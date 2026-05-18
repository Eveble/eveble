import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';

import delay from 'delay';

import { Collection } from 'mongodb';
import { Type, kernel } from '@eveble/core';
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
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { createEJSON } from '../../../src/utils/helpers';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';

import { Guid } from '../../../src/domain/value-objects/guid';

describe(`Observing and publishing new commits`, () => {
  @Type('ObservingAndPublishingNewCommits.MyCommand')
  class MyCommand extends Command<MyCommand> {}
  @Type('ObservingAndPublishingNewCommits.MyEvent')
  class MyEvent extends Event<MyEvent> {}

  // Props
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  const now = new Date();
  // Injector
  let injector: Injector;
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

  const setupInjector = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function (): void {
    config.get.calledWith('appId').mockReturnValue(appId);
    config.get.calledWith('workerId').mockReturnValue(workerId);
    config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(60);
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

  const setupTypes = function (): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  beforeAll(async () => {
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

  afterAll(async () => {
    await clients.commitStore.disconnect();
  });

  describe(`publishing changes`, () => {
    let id: Guid;
    let event: Event<{}>;
    let command: Command<{}>;
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

      generateCommit = function (
        sendingAppId: string,
        sendingWorkerId: string
      ): Commit {
        return new Commit({
          id: commitId,
          sourceId: id.toString(),
          version: 1,
          eventSourceableType:
            'ObservingAndPublishingNewCommits.MyEventSourceable',
          events: [event],
          commands: [command],
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
      const commandHandler = vi.fn();
      commandBus.registerHandler(MyCommand, commandHandler);

      const eventHandler = vi.fn();
      eventBus.registerHandler(MyEvent, eventHandler);

      const sendingAppId = 'my-sending-app-id';
      const sendingWorkerId = 'my-sending-worker-id';

      const receivingAppId = 'my-receiving-app-id';
      const receivingWorkerId = 'my-receiving-worker-id';

      config.get.calledWith('appId').mockReturnValue(receivingAppId);
      config.get.calledWith('workerId').mockReturnValue(receivingWorkerId);

      await commitPublisher.startPublishing();

      // Give the publisher time to initialize the change stream
      await delay(100);

      const commitToPublishAsSendingApp = generateCommit(
        sendingAppId,
        sendingWorkerId
      );

      await storage.save(commitToPublishAsSendingApp);

      // Wait for the commit to be processed by polling
      let foundCommitAfterObserving: Commit | undefined;
      let receivers: any[] = [];
      const maxAttempts = 30; // 30 attempts * 200ms = 6 seconds max
      const delayBetweenAttempts = 200;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        foundCommitAfterObserving = (await storage.findById(
          commitId
        )) as Commit;
        receivers = foundCommitAfterObserving?.receivers || [];

        // Log for debugging
        if (attempt % 5 === 0) {
          console.log(
            `Attempt ${attempt}: receivers length = ${receivers.length}`
          );
        }

        if (receivers.length === 2) {
          break; // Success - commit has been processed
        }

        await delay(delayBetweenAttempts);
      }

      // Add diagnostic information if it fails
      if (receivers.length !== 2) {
        console.log(
          'Command handler called:',
          commandHandler.mock.calls.length,
          'times'
        );
        console.log(
          'Event handler called:',
          eventHandler.mock.calls.length,
          'times'
        );
        console.log('Actual receivers:', JSON.stringify(receivers, null, 2));
      }

      expect(receivers).toBeInstanceOf(Array);
      expect(receivers).toHaveLength(2);
      // First receiver(the "sender" app)
      expect(receivers[0].appId).toBe(sendingAppId);
      expect(receivers[0].state).toBe('received');
      expect(receivers[0].receivedAt).toBeInstanceOf(Date);
      expect(receivers[0].publishedAt).toBeUndefined();
      expect(receivers[0].failedAt).toBeUndefined();
      // Second receiver(the "receiving" app)
      expect(receivers[1].appId).toBe(receivingAppId);
      expect(receivers[1].workerId).toBe(receivingWorkerId);
      expect(receivers[1].state).toBe('published');
      expect(receivers[1].receivedAt).toBeInstanceOf(Date);
      expect(receivers[1].publishedAt).toBeInstanceOf(Date);
      expect(receivers[1].failedAt).toBeUndefined();

      await commitPublisher.stopPublishing();
    });

    it(`stops publishing commits by stopping observing changes done on storage`, async () => {
      const commandHandler = vi.fn();
      commandBus.registerHandler(MyCommand, commandHandler);
      const eventHandler = vi.fn();
      eventBus.registerHandler(MyEvent, eventHandler);

      const sendingAppId = 'my-sending-app-id';
      const sendingWorkerId = 'my-sending-worker-id';

      const receivingAppId = 'my-receiving-app-id';
      const receivingWorkerId = 'my-receiving-worker-id';

      config.get.calledWith('appId').mockReturnValue(receivingAppId);
      config.get.calledWith('workerId').mockReturnValue(receivingWorkerId);

      await commitPublisher.startPublishing();
      await commitPublisher.stopPublishing();

      const commitToPublishAsSendingApp = generateCommit(
        sendingAppId,
        sendingWorkerId
      );
      await storage.save(commitToPublishAsSendingApp);

      const foundCommitAfterObserving = (await storage.findById(
        commitId
      )) as Commit;

      const receivers = foundCommitAfterObserving?.receivers;
      expect(receivers).toBeInstanceOf(Array);
      expect(receivers).toHaveLength(1);
      // First receiver(the "sender" app)
      expect(receivers[0].appId).toBe(sendingAppId);
      expect(receivers[0].workerId).toBe(sendingWorkerId);
      expect(receivers[0].state).toBe('received');
      expect(receivers[0].receivedAt).toBeInstanceOf(Date);
      expect(receivers[0].publishedAt).toBeUndefined();
      expect(receivers[0].failedAt).toBeUndefined();
    });
  });
});
