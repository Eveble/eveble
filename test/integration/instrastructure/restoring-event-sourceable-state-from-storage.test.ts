import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { Collection } from 'mongodb';
import { kernel } from '@eveble/core';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { EventSourceableRepository } from '../../../src/infrastructure/event-sourceable-repository';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { TaskList } from '../../domains/task-list/task-list';
import {
  CreateTaskList,
  AssignTaskList,
  OpenTaskList,
} from '../../domains/task-list/task-commands';
import { EventsNotFoundError } from '../../../src/infrastructure/infrastructure-errors';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { createEJSON } from '../../../src/utils/helpers';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { StatefulAssertion } from '../../../src/domain/assertions/stateful-assertion';
import { Asserter } from '../../../src/domain/asserter';
import { StatusfulAssertion } from '../../../src/domain/assertions/statusful-assertion';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Restoring event sourceable state from storage`, function () {
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
  let repository: types.EventSourceableRepository;

  const setupInjector = function (): void {
    injector = new Injector();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function (): void {
    // Config.prototype.get
    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('workerId').returns(workerId);
    config.get.withArgs('eveble.commitStore.timeout').returns(60);
    config.get.withArgs('eveble.Snapshotter.frequency').returns(1);
    // Config.prototype.has
    config.has.withArgs('eveble.Snapshotter.frequency').returns(true);
  };

  const setupEvebleDependencies = function (): void {
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
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .to(CommitPublisher)
      .inSingletonScope();
    injector
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .to(CommitStore)
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
    // Buses
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    // Repositories
    injector
      .bind<types.EventSourceableRepository>(BINDINGS.EventSourceableRepository)
      .to(EventSourceableRepository)
      .inSingletonScope();

    serializer = injector.get<EJSONSerializerAdapter>(BINDINGS.Serializer);
    repository = injector.get<types.EventSourceableRepository>(
      BINDINGS.EventSourceableRepository
    );
  };

  const setupTypes = function (): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  const setupKernel = function (): void {
    asserter = new Asserter();
    asserter.registerAssertion(new StatefulAssertion(asserter));
    asserter.registerAssertion(new StatusfulAssertion(asserter));
    asserter.registerAssertion(new AbilityAssertion(asserter));
    kernel.setAsserter(asserter);
    kernel.setSerializer(serializer);
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

  beforeEach(() => {
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

  describe(`finding`, () => {
    describe(`re-hydration`, () => {
      it(`throws EventsNotFoundError when commit store returns empty event history`, async () => {
        const notExistingTaskId = new Guid();
        await expect(
          repository.find(TaskList, notExistingTaskId)
        ).to.eventually.be.rejectedWith(
          EventsNotFoundError,
          `No events found for event sourceable 'TaskList' with id '${notExistingTaskId.toString()}'`
        );
      });

      it(`returns a re-hydrated instance of the expected version of event sourceable`, async () => {
        const createList = new CreateTaskList({
          targetId: taskListId,
          title: 'my-title',
        });
        const openList = new OpenTaskList({
          targetId: taskListId,
        });

        const esInstance = new TaskList(createList);
        esInstance.initialize();
        await esInstance.handle(createList);

        await repository.save(esInstance);
        await esInstance.handle(openList);
        await repository.save(esInstance);

        const rehydratedEs = (await repository.find(
          TaskList,
          taskListId
        )) as TaskList;
        expect(rehydratedEs.isInState(TaskList.STATES.open)).to.be.true;
        expect(rehydratedEs.title).to.be.equal('my-title');
        expect(rehydratedEs.tasks).to.be.eql([]);
      });
    });

    describe(`restoring snapshot`, () => {
      it(`returns event sourceable restored from snapshot`, async () => {
        config.get.withArgs('eveble.Snapshotter.frequency').returns(1);

        const createList = new CreateTaskList({
          targetId: taskListId,
          title: 'my-title',
        });
        const openList = new OpenTaskList({
          targetId: taskListId,
        });

        const esInstance = new TaskList(createList);
        esInstance.initialize();
        await esInstance.handle(createList);
        await esInstance.handle(openList);
        await repository.save(esInstance);

        const restoredSnapshot = (await repository.find(
          TaskList,
          taskListId
        )) as TaskList;
        expect(restoredSnapshot.isInState(TaskList.STATES.open)).to.be.true;
        expect(restoredSnapshot.title).to.be.equal('my-title');
        expect(restoredSnapshot.tasks).to.be.eql([]);
      });

      it(`returns event sourceable restored from snapshot with replayed remaining eventSourceable events from commit store`, async () => {
        config.get.withArgs('eveble.Snapshotter.frequency').returns(2);

        const createList = new CreateTaskList({
          targetId: taskListId,
          title: 'my-title',
        });
        const openList = new OpenTaskList({
          targetId: taskListId,
        });
        const employeeId = new Guid();
        const assignList = new AssignTaskList({
          targetId: taskListId,
          employeeId,
        });

        const esInstance = new TaskList(createList);
        esInstance.initialize();
        await esInstance.handle(createList);
        // v1 > Snapshotter will not make snapshot since version frequency is set to 2
        await repository.save(esInstance);
        await esInstance.handle(openList);
        // v2 > Snapshotter will make snapshot
        await repository.save(esInstance);
        await esInstance.handle(assignList);
        // v3 > EventSourceable is snapshottable however can't be updated since not enough version has passed (v4 is required).
        // Remaining event(ListAssigned) wil be re-hydrated from commit.
        await repository.save(esInstance);

        const rehydratedEs = (await repository.find(
          TaskList,
          taskListId
        )) as TaskList;
        expect(rehydratedEs.isInState(TaskList.STATES.open)).to.be.true;
        expect(rehydratedEs.title).to.be.equal('my-title');
        expect(rehydratedEs.tasks).to.be.eql([]);
        expect(rehydratedEs.employeeId).to.be.eql(employeeId);
      });
    });
  });
});
