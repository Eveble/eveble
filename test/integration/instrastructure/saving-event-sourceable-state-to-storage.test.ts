import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { Collection } from 'mongodb';
import { stubInterface } from 'ts-sinon';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { EventSourceableRepository } from '../../../src/infrastructure/event-sourceable-repository';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { TaskList } from '../../domains/task-list/task-list';
import { CreateTaskList } from '../../domains/task-list/task-commands';
import { TaskListCreated } from '../../domains/task-list/task-events';
import { Asserter } from '../../../src/domain/asserter';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { BINDINGS } from '../../../src/constants/bindings';
import { createEJSON } from '../../../src/utils/helpers';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { StatefulAssertion } from '../../../src/domain/assertions/stateful-assertion';
import { StatusfulAssertion } from '../../../src/domain/assertions/statusful-assertion';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';
import { kernel } from '../../../src/core/kernel';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Saving Event Sourceable state to storage`, function() {
  // Props
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  // Kernel
  let asserter: Asserter;
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Dependencies
  let serializer: types.Serializer;
  let commandBus: types.CommandBus;
  let eventBus: types.EventBus;
  let commitStore: types.CommitStore;
  let repository: types.EventSourceableRepository;

  const setupInjector = function(): void {
    injector = new Injector();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function(): void {
    // Config.prototype.get
    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('workerId').returns(workerId);
    config.get.withArgs('eveble.commitStore.timeout').returns(60);
    config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);
    config.get.withArgs('eveble.Snapshotter.frequency').returns(1);
    // Config.prototype.has
    config.has.withArgs('eveble.Snapshotter.frequency').returns(true);
  };

  const setupEvebleDependencies = function(): void {
    commandBus = new CommandBus();
    eventBus = new EventBus();

    // Serializer
    injector.bind<any>(BINDINGS.EJSON).toConstantValue(createEJSON());
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .to(EJSONSerializerAdapter)
      .inSingletonScope();
    // Commit
    injector
      .bind<types.CommitStorage>(BINDINGS.CommitStorage)
      .to(CommitMongoDBStorage)
      .inSingletonScope();
    injector
      .bind<types.CommitObserver>(BINDINGS.CommitObserver)
      .to(CommitMongoDBObserver)
      .inSingletonScope();
    injector
      .bind<types.CommitSerializer>(BINDINGS.CommitSerializer)
      .to(CommitSerializer)
      .inSingletonScope();
    injector
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .to(CommitStore)
      .inSingletonScope();
    injector
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .to(CommitPublisher)
      .inSingletonScope();
    // Snapshotter
    injector
      .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
      .to(SnapshotMongoDBStorage)
      .inSingletonScope();
    injector
      .bind<types.SnapshotSerializer>(BINDINGS.SnapshotSerializer)
      .to(SnapshotSerializer)
      .inSingletonScope();
    injector
      .bind<types.Snapshotter>(BINDINGS.Snapshotter)
      .to(Snapshotter)
      .inSingletonScope();
    // Busses
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    // Repositories
    injector
      .bind<types.EventSourceableRepository>(BINDINGS.EventSourceableRepository)
      .to(EventSourceableRepository)
      .inSingletonScope();

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
    commitStore = injector.get<types.CommitStore>(BINDINGS.CommitStore);
    repository = injector.get<types.EventSourceableRepository>(
      BINDINGS.EventSourceableRepository
    );
  };

  const setupTypes = function(): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  const setupKernel = function(): void {
    asserter = new Asserter();
    asserter.registerAssertion(new StatefulAssertion(asserter));
    asserter.registerAssertion(new StatusfulAssertion(asserter));
    asserter.registerAssertion(new AbilityAssertion(asserter));
    kernel.setAsserter(asserter);
    kernel.setSerializer(serializer);
  };

  const expectCommitIsMatchingCreatedTaskList = function(
    commit: types.Commit,
    taskListId: Guid,
    title: string
  ): void {
    expect(commit).to.be.instanceof(Commit);
    expect(commit.id).to.be.a('string'); // Generated from MongoDBStorage
    expect(commit.sourceId).to.be.equal(taskListId.toString());
    expect(commit.version).to.be.equal(1);
    expect(commit.eventSourceableType).to.be.equal('TaskList');

    expect(commit.events).to.be.instanceof(Array);
    const firstEvent = commit.events[0] as any;
    expect(firstEvent).to.be.instanceof(TaskListCreated);
    expect(firstEvent.sourceId).to.be.eql(taskListId);
    expect(firstEvent.timestamp).to.be.instanceof(Date);
    expect(firstEvent.version).to.be.equal(1);
    expect(firstEvent.title).to.be.equal(title);
    expect(firstEvent.tasks).to.be.eql([]);

    expect(commit.commands).to.be.instanceof(Array);
    expect(commit.commands).to.be.eql([]);

    expect(commit.insertedAt).to.be.instanceof(Date);
    expect(commit.sentBy).to.be.equal(appId);

    expect(commit.receivers).to.be.instanceof(Array);
    expect(commit.receivers[0]).to.be.instanceof(CommitReceiver);
    expect(commit.receivers[0].state).to.be.equal('published');
    expect(commit.receivers[0].appId).to.be.equal(appId);
    expect(commit.receivers[0].workerId).to.be.equal(workerId);
    expect(commit.receivers[0].receivedAt).to.be.instanceof(Date);
    expect(commit.receivers[0].publishedAt).to.be.instanceof(Date);
  };

  before(async () => {
    setupInjector();
    await setupCommitStoreMongo(injector, clients, collections);
    await setupSnapshotterMongo(injector, clients, collections);
    setupDefaultConfiguration();
    setupEvebleDependencies();
    setupTypes();
    setupKernel();
  });

  let taskListId: Guid;

  beforeEach(async () => {
    taskListId = new Guid();

    setupDefaultConfiguration();
  });

  afterEach(async () => {
    await collections.commitStore.deleteMany({});
    await collections.snapshotter.deleteMany({});
  });

  after(async () => {
    await clients.commitStore.disconnect();
    await clients.snapshotter.disconnect();

    kernel.setAsserter(undefined as any);
    kernel.setSerializer(undefined as any);
  });

  describe(`saving(persisting)`, () => {
    it('persists event sourceable as a serialized and versioned commit', async () => {
      const title = 'my-title';
      const createList = new CreateTaskList({
        targetId: taskListId,
        title,
      });

      const esInstance = new TaskList(createList);
      esInstance.initialize();
      await esInstance.handle(createList);

      const storageIdentifiers = await repository.save(esInstance);
      const { commitId } = storageIdentifiers;

      const foundCommit = (await commitStore.getCommitById(
        commitId as string
      )) as Commit;
      expectCommitIsMatchingCreatedTaskList(foundCommit, taskListId, title);
    });

    it(`persists event sourcable as commit and snapshots it when snapshotter is defined`, async () => {
      config.get.withArgs('eveble.Snapshotter.frequency').returns(1);

      const title = 'my-title';
      const createList = new CreateTaskList({
        targetId: taskListId,
        title,
      });

      const esInstance = new TaskList(createList);
      esInstance.initialize();
      await esInstance.handle(createList);

      const storageIdentifiers = await repository.save(esInstance);
      const { commitId, snapshotId } = storageIdentifiers;

      // Expected commit
      const foundCommit = (await commitStore.getCommitById(
        commitId as string
      )) as Commit;
      expectCommitIsMatchingCreatedTaskList(foundCommit, taskListId, title);

      // Expected snapshot
      const foundSnapshot = await repository.getSnapshotOf(
        TaskList,
        snapshotId as string
      );
      const expectedSnapshot = new TaskList({
        version: 1,
        id: taskListId,
        state: 'created',
        metadata: {},
        title,
        tasks: [],
      });
      expect(foundSnapshot).to.be.instanceof(TaskList);
      expect(foundSnapshot).to.be.eql(expectedSnapshot);
    });
  });
});
