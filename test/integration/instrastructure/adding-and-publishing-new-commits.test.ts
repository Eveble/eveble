import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, vi, beforeAll, afterAll } from 'vitest';

import delay from 'delay';

import { Collection } from 'mongodb';
import { Type, kernel } from '@eveble/core';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';

import { createEJSON } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';

describe(`Adding and publishing new commits`, () => {
  @Type('AddingAndPublishingNewCommits.MyCommand')
  class MyCommand extends Command<MyCommand> {}
  @Type('AddingAndPublishingNewCommits.MyEvent')
  class MyEvent extends Event<MyEvent> {}

  // Props
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Dependencies
  let commitStore: types.CommitStore;
  let serializer: types.Serializer;
  let commandBus: types.CommandBus;
  let eventBus: types.EventBus;
  let storage: types.CommitStorage;

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
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .to(CommitPublisher)
      .inSingletonScope();
    injector
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .to(CommitStore)
      .inSingletonScope();
    injector
      .bind<types.CommitSerializer>(BINDINGS.CommitSerializer)
      .to(CommitSerializer)
      .inSingletonScope();
    // Buses
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
    commitStore = injector.get<types.CommitStore>(BINDINGS.CommitStore);
    storage = injector.get<types.CommitStorage>(BINDINGS.CommitStorage);
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
    let event: MyEvent;
    let command: MyCommand;
    let commitId: string;
    let commit: Commit;
    let now: Date;

    beforeEach(() => {
      now = new Date();

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
      commit = new Commit({
        id: commitId,
        sourceId: id.toString(),
        version: 1,
        eventSourceableType:
          'Commit AddingAndPublishingNewCommits.MyEventSourceable',
        events: [event],
        commands: [command],
        insertedAt: now,
        sentBy: appId,
        receivers: [
          new CommitReceiver({
            state: 'received',
            appId,
            workerId,
            receivedAt: now,
          }),
        ],
      });
    });

    it(`publishes externally added commits in the current app if there is a registered handler`, async () => {
      const commandHandler = vi.fn();
      commandBus.registerHandler(MyCommand, commandHandler);
      const eventHandler = vi.fn();
      eventBus.registerHandler(MyEvent, eventHandler);

      await commitStore.save(commit);

      expect(eventHandler).toHaveBeenCalledWith(event);
      expect(commandHandler).toHaveBeenCalledWith(command);

      const foundCommitAfterPublishing = (await commitStore.findById(
        commit.id
      )) as Commit;
      expect(foundCommitAfterPublishing).toBeInstanceOf(Commit);
      const receivers = foundCommitAfterPublishing.receivers;
      expect(receivers[0].appId).toBe(appId);
      expect(receivers[0].workerId).toBe(workerId);
      expect(receivers[0].state).toBe('published');
      expect(receivers[0].publishedAt).toBeInstanceOf(Date);
    });

    it(`fails the processing attempt if timeout is reached`, async () => {
      const timeout = 5;
      config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(timeout);

      const commandHandlerSpy = vi.fn();
      const commandHandler = async (cmd: Command<{}>): Promise<void> => {
        await delay(timeout + 5);
        commandHandlerSpy(cmd);
      };
      commandBus.registerHandler(MyCommand, commandHandler);

      await commitStore.save(commit);

      const foundCommitAfterTimeout = (await commitStore.findById(
        commit.id
      )) as Commit;
      expect(foundCommitAfterTimeout).toBeInstanceOf(Commit);
      const receivers = foundCommitAfterTimeout.receivers;
      expect(receivers[0].appId).toBe(appId);
      expect(receivers[0].workerId).toBe(workerId);
      expect(receivers[0].state).toBe('timeouted');
      expect(receivers[0].failedAt).toBeInstanceOf(Date);
      expect(receivers[0].publishedAt).toBeUndefined();
    });

    it(`handles error by flagging commit as failed and clearing the timeout`, async () => {
      config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(60);
      const error = new Error('my-error');

      const commandHandler = async function (): Promise<void> {
        throw error;
      };
      commandBus.registerHandler(MyCommand, commandHandler);

      try {
        await commitStore.save(commit);
      } catch (e) {}

      const foundCommitAfterFail = (await commitStore.findById(
        commit.id
      )) as Commit;
      expect(foundCommitAfterFail).toBeInstanceOf(Commit);
      const receivers = foundCommitAfterFail.receivers;
      expect(receivers[0].appId).toBe(appId);
      expect(receivers[0].workerId).toBe(workerId);
      expect(receivers[0].state).toBe('failed');
      expect(receivers[0].failedAt).toBeInstanceOf(Date);
      expect(receivers[0].publishedAt).toBeUndefined();
    });

    it(`does not process commands that can't be handled`, async () => {
      const send = vi.spyOn(commandBus, "send");
      await commitStore.save(commit);
      expect(send).not.toHaveBeenCalled;
    });

    it(`avoids potential race condition between commit being flagged as timeouted and published`, async () => {
      const timeout = 5;
      config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(timeout);

      const flagCommitAsPublished = vi.spyOn(storage, "flagCommitAsPublished");

      const commandHandlerSpy = vi.fn();
      const commandHandler = async (cmd: Command<{}>): Promise<void> => {
        await delay(timeout + 5);
        commandHandlerSpy(cmd);
      };
      commandBus.registerHandler(MyCommand, commandHandler);

      await commitStore.save(commit);

      const foundCommitAfterTimeout = (await commitStore.findById(
        commit.id
      )) as Commit;
      expect(foundCommitAfterTimeout).toBeInstanceOf(Commit);
      const receivers = foundCommitAfterTimeout.receivers;
      expect(receivers[0].appId).toBe(appId);
      expect(receivers[0].workerId).toBe(workerId);
      expect(receivers[0].state).toBe('timeouted');
      expect(receivers[0].failedAt).toBeInstanceOf(Date);
      expect(receivers[0].publishedAt).toBeUndefined();
      expect(flagCommitAsPublished).not.toHaveBeenCalled;
    });
  });
});

