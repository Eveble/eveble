import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import delay from 'delay';
import { stubInterface } from 'ts-sinon';
import { Collection } from 'mongodb';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';
import { define } from '../../../src/decorators/define';
import { Container } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { createEJSON } from '../../../src/utils/helpers';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { kernel } from '../../../src/core/kernel';
import { Guid } from '../../../src/domain/value-objects/guid';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Observing and publishing new commits`, function() {
  @define('ObservingAndPublishingNewCommits.MyCommand')
  class MyCommand extends Command {}
  @define('ObservingAndPublishingNewCommits.MyEvent')
  class MyEvent extends Event {}

  // Props
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  const now = new Date();
  // Injector
  let injector: Container;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Eveble dependencies
  let serializer: types.Serializer;
  let commandBus: types.CommandBus;
  let eventBus: types.EventBus;
  let storage: types.CommitStorage;
  let commitPublisher: types.CommitPublisher;

  const setupInjector = function(): void {
    injector = new Container();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function(): void {
    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('workerId').returns(workerId);
    config.get.withArgs('eveble.commitStore.timeout').returns(60);
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
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .to(CommitPublisher)
      .inSingletonScope();
    injector
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .to(CommitStore)
      .inSingletonScope();
    // Buses
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);

    serializer = injector.get<EJSONSerializerAdapter>(BINDINGS.Serializer);
    storage = injector.get<types.CommitStorage>(BINDINGS.CommitStorage);
    commitPublisher = injector.get<types.CommitPublisher>(
      BINDINGS.CommitPublisher
    );
  };

  const setupTypes = function(): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  before(async () => {
    setupInjector();
    await setupCommitStoreMongo(injector, clients, collections);
    setupDefaultConfiguration();
    setupEvebleDependencies();
    setupTypes();
  });

  beforeEach(() => {
    setupDefaultConfiguration();
  });

  afterEach(async () => {
    commandBus.removeHandler(MyCommand);
    eventBus.removeHandler(MyEvent);
    await collections.commitStore.deleteMany({});
  });

  after(async () => {
    await clients.commitStore.disconnect();
  });

  describe(`publishing changes`, () => {
    let id: Guid;
    let event: Event;
    let command: Command;
    let commitId: string;
    let generateCommit: Function;

    beforeEach(() => {
      id = new Guid();
      event = new MyEvent({
        sourceId: id,
        timestamp: now,
        version: 1,
      });
      command = new MyCommand({
        targetId: id,
        timestamp: now,
      });
      commitId = new Guid().toString();

      generateCommit = function(
        sendingAppId: string,
        sendingWorkerId: string
      ): Commit {
        return new Commit({
          id: commitId,
          sourceId: id.toString(),
          version: 1,
          changes: {
            eventSourceableType:
              'ObservingAndPublishingNewCommits.MyEventSourceable',
            events: [event],
            commands: [command],
          },
          insertedAt: now,
          sentBy: sendingAppId,
          receivers: [
            new CommitReceiver({
              state: 'received',
              appId: sendingAppId,
              workerId: sendingWorkerId,
              receivedAt: now,
            }),
          ],
        });
      };
    });

    it(`starts publishing commits by observing changes done on storage`, async () => {
      const commandHandler = sinon.stub();
      commandBus.registerHandler(MyCommand, commandHandler);
      const eventHandler = sinon.stub();
      eventBus.registerHandler(MyEvent, eventHandler);

      const sendingAppId = 'my-sending-app-id';
      const sendingWorkerId = 'my-sending-worker-id';

      const receivingAppId = 'my-receiving-app-id';
      const receivingWorkerId = 'my-receiving-worker-id';

      config.get.withArgs('appId').returns(receivingAppId);
      config.get.withArgs('workerId').returns(receivingWorkerId);

      await commitPublisher.startPublishing();

      const commitToPublishAsSendingApp = generateCommit(
        sendingAppId,
        sendingWorkerId
      );
      await storage.addCommit(commitToPublishAsSendingApp);

      await delay(500); // Simulate time passing while observing changes
      const foundCommitAfterObserving = (await storage.getCommitById(
        commitId
      )) as Commit;
      const receivers = foundCommitAfterObserving?.receivers;
      expect(receivers).to.be.instanceof(Array);
      expect(receivers).to.have.length(2);
      // First receiver(the "sender" app)
      expect(receivers[0].appId).to.be.equal(sendingAppId);
      expect(receivers[0].state).to.be.equal('received');
      expect(receivers[0].receivedAt).to.be.instanceof(Date);
      expect(receivers[0].publishedAt).to.be.undefined;
      expect(receivers[0].failedAt).to.be.undefined;
      // Second receiver(the "receiving" app)
      expect(receivers[1].appId).to.be.equal(receivingAppId);
      expect(receivers[1].workerId).to.be.equal(receivingWorkerId);
      expect(receivers[1].state).to.be.equal('published');
      expect(receivers[1].receivedAt).to.be.instanceof(Date);
      expect(receivers[1].publishedAt).to.be.instanceof(Date);
      expect(receivers[1].failedAt).to.be.undefined;

      await commitPublisher.stopPublishing();
    });

    it(`stops publishing commits by stopping observing changes done on storage`, async () => {
      const commandHandler = sinon.stub();
      commandBus.registerHandler(MyCommand, commandHandler);
      const eventHandler = sinon.stub();
      eventBus.registerHandler(MyEvent, eventHandler);

      const sendingAppId = 'my-sending-app-id';
      const sendingWorkerId = 'my-sending-worker-id';

      const receivingAppId = 'my-receiving-app-id';
      const receivingWorkerId = 'my-receiving-worker-id';

      config.get.withArgs('appId').returns(receivingAppId);
      config.get.withArgs('workerId').returns(receivingWorkerId);

      await commitPublisher.startPublishing();
      await commitPublisher.stopPublishing();

      const commitToPublishAsSendingApp = generateCommit(
        sendingAppId,
        sendingWorkerId
      );
      await storage.addCommit(commitToPublishAsSendingApp);

      const foundCommitAfterObserving = (await storage.getCommitById(
        commitId
      )) as Commit;
      const receivers = foundCommitAfterObserving?.receivers;
      expect(receivers).to.be.instanceof(Array);
      expect(receivers).to.have.length(1);
      // First receiver(the "sender" app)
      expect(receivers[0].appId).to.be.equal(sendingAppId);
      expect(receivers[0].workerId).to.be.equal(sendingWorkerId);
      expect(receivers[0].state).to.be.equal('received');
      expect(receivers[0].receivedAt).to.be.instanceof(Date);
      expect(receivers[0].publishedAt).to.be.undefined;
      expect(receivers[0].failedAt).to.be.undefined;
    });
  });
});
