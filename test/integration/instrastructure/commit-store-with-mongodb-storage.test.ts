import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';

import { Collection } from 'mongodb';
import { Type, kernel } from '@eveble/core';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Aggregate } from '../../../src/domain/aggregate';
import { Process } from '../../../src/domain/process';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { CommitConcurrencyError } from '../../../src/infrastructure/infrastructure-errors';
import { Guid } from '../../../src/domain/value-objects/guid';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { createEJSON } from '../../../src/utils/helpers';

describe(`CommitStore with MongoDB storage`, () => {
  @Type('CommitStoreWithMongoDBStorage.MyEventSourceable')
  class MyEventSourceable extends EventSourceable {}
  @Type('CommitStoreWithMongoDBStorage.MyAggregate')
  class MyAggregate extends Aggregate {}
  @Type('CommitStoreWithMongoDBStorage.MyProcess')
  class MyProcess extends Process {}

  @Type('CommitStoreWithMongoDBStorage.MyCommand')
  class MyCommand extends Command<MyCommand> {}
  @Type('CommitStoreWithMongoDBStorage.MyOtherCommand')
  class MyOtherCommand extends Command<MyOtherCommand> {}

  @Type('CommitStoreWithMongoDBStorage.MyEvent')
  class MyEvent extends Event<MyEvent> {}
  @Type('CommitStoreWithMongoDBStorage.MyOtherEvent')
  class MyOtherEvent extends Event<MyOtherEvent> {}

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
  // Dependencies
  let commitPublisher: any;
  let commitStore: types.CommitStore;
  let serializer: types.Serializer;

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
  };

  const setupEvebleDependencies = function (): void {
    commitPublisher = mock<types.CommitPublisher>();

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
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .toConstantValue(commitPublisher);
    injector
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .to(CommitStore)
      .inSingletonScope();
    injector
      .bind<types.CommitSerializer>(BINDINGS.CommitSerializer)
      .to(CommitSerializer)
      .inSingletonScope();

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
    commitStore = injector.get<types.CommitStore>(BINDINGS.CommitStore);
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
    await collections.commitStore.deleteMany({});
  });

  afterAll(async () => {
    await clients.commitStore.disconnect();
  });

  describe(`creating commit`, () => {
    it(`creates a first commit for an aggregate`, async () => {
      const id = 'my-id';
      const aggregate = new MyAggregate({ id });

      const firstEvent = new MyEvent({
        sourceId: id,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: id,
        timestamp: now,
      });

      aggregate.record(firstEvent);
      aggregate.record(secondEvent);

      const commit = await commitStore.createCommit(aggregate);

      expect(commit).toBeInstanceOf(Commit);
      expect(commit.id).toBeTypeOf('string'); // Generated from MongoDBStorage
      expect(commit.sourceId).toBe(id);
      expect(commit.version).toBe(1);
      expect(commit.eventSourceableType).toBe(
        'CommitStoreWithMongoDBStorage.MyAggregate'
      );

      expect(commit.events).toBeInstanceOf(Array);
      expect(commit.events[0]).toBeInstanceOf(MyEvent);
      expect(commit.events[0].sourceId).toBe(id);
      expect(commit.events[0].timestamp).toBeInstanceOf(Date);
      expect(commit.events[0].version).toBe(1);

      expect(commit.events[1]).toBeInstanceOf(MyOtherEvent);
      expect(commit.events[1].sourceId).toBe(id);
      expect(commit.events[1].timestamp).toBeInstanceOf(Date);
      expect(commit.events[1].version).toBe(1);

      expect(commit.commands).toBeInstanceOf(Array);
      expect(commit.commands).toEqual([]);

      expect(commit.insertedAt).toBeInstanceOf(Date);
      expect(commit.sentBy).toBe(appId);

      expect(commit.receivers).toBeInstanceOf(Array);
      expect(commit.receivers[0]).toBeInstanceOf(CommitReceiver);
      expect(commit.receivers[0].state).toBe('received');
      expect(commit.receivers[0].appId).toBe(appId);
      expect(commit.receivers[0].workerId).toBe(workerId);
      expect(commit.receivers[0].receivedAt).toBeInstanceOf(Date);
    });

    it(`generates unique commit id on storage`, async () => {
      const firstAggregate = new MyAggregate({ id: 'my-id' });
      const secondAggregate = new MyAggregate({ id: 'my-id' });

      const firstCommit = await commitStore.createCommit(firstAggregate);
      const secondCommit = await commitStore.createCommit(secondAggregate);
      expect(firstCommit.id).toBeTypeOf('string');
      expect(secondCommit.id).toBeTypeOf('string');
      expect(firstCommit.id).to.not.be.equal(secondCommit.id);
    });

    it(`creates a first commit for a process`, async () => {
      const id = 'my-id';
      const process = new MyProcess({ id });

      const firstCommand = new MyCommand({
        targetId: id,
        timestamp: now,
      });
      const secondCommand = new MyOtherCommand({
        targetId: id,
        timestamp: now,
      });
      const firstEvent = new MyEvent({
        sourceId: id,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: id,
        timestamp: now,
      });

      process.trigger(firstCommand);
      process.record(firstEvent);
      process.trigger(secondCommand);
      process.record(secondEvent);

      const commit = await commitStore.createCommit(process);

      expect(commit).toBeInstanceOf(Commit);
      expect(commit.id).toBeTypeOf('string'); // Generated from MongoDBStorage
      expect(commit.sourceId).toBe(id);
      expect(commit.version).toBe(1);
      expect(commit.eventSourceableType).toBe(
        'CommitStoreWithMongoDBStorage.MyProcess'
      );

      expect(commit.events).toBeInstanceOf(Array);
      expect(commit.events[0]).toBeInstanceOf(MyEvent);
      expect(commit.events[0].sourceId).toBe(id);
      expect(commit.events[0].timestamp).toBeInstanceOf(Date);
      expect(commit.events[0].version).toBe(1);

      expect(commit.events[1]).toBeInstanceOf(MyOtherEvent);
      expect(commit.events[1].sourceId).toBe(id);
      expect(commit.events[1].timestamp).toBeInstanceOf(Date);
      expect(commit.events[1].version).toBe(1);

      expect(commit.commands).toBeInstanceOf(Array);
      expect(commit.commands).toEqual([firstCommand, secondCommand]);

      expect(commit.insertedAt).toBeInstanceOf(Date);
      expect(commit.sentBy).toBe(appId);

      expect(commit.receivers).toBeInstanceOf(Array);
      expect(commit.receivers[0]).toBeInstanceOf(CommitReceiver);
      expect(commit.receivers[0].state).toBe('received');
      expect(commit.receivers[0].appId).toBe(appId);
      expect(commit.receivers[0].workerId).toBe(workerId);
      expect(commit.receivers[0].receivedAt).toBeInstanceOf(Date);
    });

    it(`creates another commit for event sourceable`, async () => {
      const id = 'my-id';
      const firstEvent = new MyEvent({
        sourceId: id,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: id,
        timestamp: now,
      });

      const eventSourceable = new MyEventSourceable({
        id,
      });
      const firstCommit = await commitStore.createCommit(eventSourceable);
      await commitStore.save(firstCommit);
      eventSourceable.version = 1;
      const secondCommit = await commitStore.createCommit(eventSourceable);
      await commitStore.save(secondCommit);
      eventSourceable.version = 2;
      const thirdCommit = await commitStore.createCommit(eventSourceable);
      await commitStore.save(thirdCommit);
      eventSourceable.record(firstEvent);
      eventSourceable.record(secondEvent);
      eventSourceable.version = 3;
      const fourthCommit = await commitStore.createCommit(eventSourceable);
      await commitStore.save(fourthCommit);

      expect(fourthCommit).toBeInstanceOf(Commit);
      expect(fourthCommit.id).toBeTypeOf('string'); // Generated from MongoDBStorage
      expect(fourthCommit.sourceId).toBe(id);
      expect(fourthCommit.version).toBe(4);
      expect(fourthCommit.eventSourceableType).toBe(
        'CommitStoreWithMongoDBStorage.MyEventSourceable'
      );

      expect(fourthCommit.events).toBeInstanceOf(Array);
      expect(fourthCommit.events[0]).toBeInstanceOf(MyEvent);
      expect(fourthCommit.events[0].sourceId).toBe(id);
      expect(fourthCommit.events[0].timestamp).toBeInstanceOf(Date);
      expect(fourthCommit.events[0].version).toBe(4);

      expect(fourthCommit.events[1]).toBeInstanceOf(MyOtherEvent);
      expect(fourthCommit.events[1].sourceId).toBe(id);
      expect(fourthCommit.events[1].timestamp).toBeInstanceOf(Date);
      expect(fourthCommit.events[1].version).toBe(4);

      expect(fourthCommit.commands).toBeInstanceOf(Array);
      expect(fourthCommit.commands).toEqual([]);

      expect(fourthCommit.insertedAt).toBeInstanceOf(Date);
      expect(fourthCommit.sentBy).toBe(appId);

      expect(fourthCommit.receivers).toBeInstanceOf(Array);
      expect(fourthCommit.receivers[0]).toBeInstanceOf(CommitReceiver);
      expect(fourthCommit.receivers[0].state).toBe('received');
      expect(fourthCommit.receivers[0].appId).toBe(appId);
      expect(fourthCommit.receivers[0].workerId).toBe(workerId);
      expect(fourthCommit.receivers[0].receivedAt).toBeInstanceOf(Date);
    });

    it(`throws CommitConcurrencyError if the version in the store does not equal the expected version`, async () => {
      const aggregate = new MyAggregate({ id: 'my-id' });

      const commit = await commitStore.createCommit(aggregate);
      await commitStore.save(commit);

      aggregate.version = 20; // Should be at version 1
      await expect(commitStore.createCommit(aggregate)).rejects.toThrow(
        CommitConcurrencyError,
        `CommitStoreWithMongoDBStorage.MyAggregate: expected event sourceable with id of 'my-id' to be at version 20 but is at version 1`
      );
    });
  });

  describe(`saving commit`, () => {
    it(`stores commit on storage and returns commit id assigned by storage`, async () => {
      const id = 'my-id';
      const aggregate = new MyAggregate({ id: 'my-id' });
      const commit = await commitStore.createCommit(aggregate);

      const commitId = await commitStore.save(commit);
      expect(commitId).toBeTypeOf('string');

      const foundCommit = (await commitStore.findById(commitId)) as Commit;

      expect(foundCommit).toBeInstanceOf(Commit);
      expect(foundCommit.id).toBeTypeOf('string'); // Generated from MongoDBStorage
      expect(foundCommit.sourceId).toBe(id);
      expect(foundCommit.version).toBe(1);

      expect(foundCommit.eventSourceableType).toBe(
        'CommitStoreWithMongoDBStorage.MyAggregate'
      );
      expect(foundCommit.events).toEqual([]);
      expect(foundCommit.commands).toEqual([]);

      expect(foundCommit.insertedAt).toBeInstanceOf(Date);
      expect(foundCommit.sentBy).toBe(appId);

      expect(foundCommit.receivers).toBeInstanceOf(Array);
      expect(foundCommit.receivers[0]).toBeInstanceOf(CommitReceiver);
      expect(foundCommit.receivers[0].state).toBe('received');
      expect(foundCommit.receivers[0].appId).toBe(appId);
      expect(foundCommit.receivers[0].workerId).toBe(workerId);
      expect(foundCommit.receivers[0].receivedAt).toBeInstanceOf(Date);
    });

    it(`rethrows any thrown error on storage`, async () => {
      const aggregate = new MyAggregate({ id: 'my-id' });

      const commit = await commitStore.createCommit(aggregate);
      await commitStore.save(commit);
      await expect(commitStore.save(commit)).rejects.toThrow(
        CommitConcurrencyError,
        `CommitStoreWithMongoDBStorage.MyAggregate: expected event sourceable with id of 'my-id' to be at version 0 but is at version 1`
      );
    });
  });

  describe('returning commits', () => {
    it('returns commit by id', async () => {
      const aggregate = new MyAggregate({ id: 'my-id' });

      const commit = await commitStore.createCommit(aggregate);
      await commitStore.save(commit);

      const foundCommit = await commitStore.findById(commit.id);
      expect(foundCommit).toBeInstanceOf(Commit);
      expect(foundCommit).toEqual(commit);
    });

    it(`returns undefined if commit by id can't be found`, async () => {
      const commitId = new Guid().toString();
      const foundCommit = await commitStore.findById(commitId);
      expect(foundCommit).toBe(undefined);
    });
  });

  describe(`returning events`, () => {
    it(`returns all events versioned by batch for given event sourceable`, async () => {
      const aggregateId = 'my-first-aggregateId';
      const aggregate = new MyAggregate({ id: aggregateId });

      const firstEvent = new MyEvent({
        sourceId: aggregateId,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: aggregateId,
        timestamp: now,
      });

      aggregate.record(firstEvent);
      const firstCommit = await commitStore.createCommit(aggregate);
      await commitStore.save(firstCommit);

      aggregate.version = 1;
      aggregate.record(secondEvent);
      const secondCommit = await commitStore.createCommit(aggregate);
      await commitStore.save(secondCommit);

      const events = await commitStore.getEvents(aggregateId);
      const firstV1Event = new MyEvent({ ...firstEvent, version: 1 });
      const firstV2Event = new MyEvent({ ...firstEvent, version: 2 });
      const secondV2Event = new MyOtherEvent({ ...secondEvent, version: 2 });
      expect(events).toEqual([firstV1Event, firstV2Event, secondV2Event]);
    });

    it(`allows to pass version offset to skip events`, async () => {
      const aggregateId = 'my-first-aggregateId';
      const aggregate = new MyAggregate({ id: aggregateId });

      const firstEvent = new MyEvent({
        sourceId: aggregateId,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: aggregateId,
        timestamp: now,
      });

      aggregate.record(firstEvent);
      const firstCommit = await commitStore.createCommit(aggregate);
      await commitStore.save(firstCommit);

      aggregate.version = 1;
      aggregate.record(secondEvent);
      const secondCommit = await commitStore.createCommit(aggregate);
      await commitStore.save(secondCommit);

      const events = await commitStore.getEvents(aggregateId, 2);
      const firstV2Event = new MyEvent({ ...firstEvent, version: 2 });
      const secondV2Event = new MyOtherEvent({ ...secondEvent, version: 2 });
      expect(events).toEqual([firstV2Event, secondV2Event]);

      const firstV1Event = new MyEvent({ ...firstEvent, version: 1 });
      expect(events).not.toContain(firstV1Event);
    });

    it(`returns empty array if commits for event sourceable can't be found`, async () => {
      const events = await commitStore.getEvents('my-id');
      expect(events).toEqual([]);
    });

    it(`returns all events from all available commits`, async () => {
      const firstAggregateId = 'my-first-firstAggregateId';
      const aggregate = new MyAggregate({ id: firstAggregateId });

      const firstEvent = new MyEvent({
        sourceId: firstAggregateId,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: firstAggregateId,
        timestamp: now,
      });

      aggregate.record(firstEvent);
      const firstCommit = await commitStore.createCommit(aggregate);
      await commitStore.save(firstCommit);

      aggregate.version = 1;
      aggregate.record(secondEvent);
      const secondCommit = await commitStore.createCommit(aggregate);
      await commitStore.save(secondCommit);

      const events = await commitStore.getAllEvents();
      const firstV1Event = new MyEvent({ ...firstEvent, version: 1 });
      const firstV2Event = new MyEvent({ ...firstEvent, version: 2 });
      const secondV2Event = new MyOtherEvent({ ...secondEvent, version: 2 });
      expect(events).toEqual([firstV1Event, firstV2Event, secondV2Event]);
    });

    it(`returns empty when no commits are available`, async () => {
      const allEvents = await commitStore.getAllEvents();
      expect(allEvents).toEqual([]);
    });
  });
});
