import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { Collection } from 'mongodb';
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
import { define } from '../../../src/decorators/define';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { CommitConcurrencyError } from '../../../src/infrastructure/infrastructure-errors';
import { Guid } from '../../../src/domain/value-objects/guid';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { createEJSON } from '../../../src/utils/helpers';
import { kernel } from '../../../src/core/kernel';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`CommitStore with MongoDB storage`, function() {
  @define('CommitStoreWithMongoDBStorage.MyEventSourceable')
  class MyEventSourceable extends EventSourceable {}
  @define('CommitStoreWithMongoDBStorage.MyAggregate')
  class MyAggregate extends Aggregate {}
  @define('CommitStoreWithMongoDBStorage.MyProcess')
  class MyProcess extends Process {}

  @define('CommitStoreWithMongoDBStorage.MyCommand')
  class MyCommand extends Command {}
  @define('CommitStoreWithMongoDBStorage.MyOtherCommand')
  class MyOtherCommand extends Command {}

  @define('CommitStoreWithMongoDBStorage.MyEvent')
  class MyEvent extends Event {}
  @define('CommitStoreWithMongoDBStorage.MyOtherEvent')
  class MyOtherEvent extends Event {}

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

  const setupInjector = function(): void {
    injector = new Injector();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function(): void {
    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('workerId').returns(workerId);
  };

  const setupEvebleDependencies = function(): void {
    commitPublisher = stubInterface<types.CommitPublisher>();

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
    await collections.commitStore.deleteMany({});
  });

  after(async () => {
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

      expect(commit).to.be.instanceof(Commit);
      expect(commit.id).to.be.a('string'); // Generated from MongoDBStorage
      expect(commit.sourceId).to.be.equal(id);
      expect(commit.version).to.be.equal(1);
      expect(commit.changes.eventSourceableType).to.be.equal(
        'CommitStoreWithMongoDBStorage.MyAggregate'
      );

      expect(commit.changes.events).to.be.instanceof(Array);
      expect(commit.changes.events[0]).to.be.instanceof(MyEvent);
      expect(commit.changes.events[0].sourceId).to.be.equal(id);
      expect(commit.changes.events[0].timestamp).to.be.instanceof(Date);
      expect(commit.changes.events[0].version).to.be.equal(1);

      expect(commit.changes.events[1]).to.be.instanceof(MyOtherEvent);
      expect(commit.changes.events[1].sourceId).to.be.equal(id);
      expect(commit.changes.events[1].timestamp).to.be.instanceof(Date);
      expect(commit.changes.events[1].version).to.be.equal(1);

      expect(commit.changes.commands).to.be.instanceof(Array);
      expect(commit.changes.commands).to.be.eql([]);

      expect(commit.insertedAt).to.be.instanceof(Date);
      expect(commit.sentBy).to.be.equal(appId);

      expect(commit.receivers).to.be.instanceof(Array);
      expect(commit.receivers[0]).to.be.instanceof(CommitReceiver);
      expect(commit.receivers[0].state).to.be.equal('received');
      expect(commit.receivers[0].appId).to.be.equal(appId);
      expect(commit.receivers[0].workerId).to.be.equal(workerId);
      expect(commit.receivers[0].receivedAt).to.be.instanceof(Date);
    });

    it(`generates unique commit id on storage`, async () => {
      const firstAggregate = new MyAggregate({ id: 'my-id' });
      const secondAggregate = new MyAggregate({ id: 'my-id' });

      const firstCommit = await commitStore.createCommit(firstAggregate);
      const secondCommit = await commitStore.createCommit(secondAggregate);
      expect(firstCommit.id).to.be.a('string');
      expect(secondCommit.id).to.be.a('string');
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

      expect(commit).to.be.instanceof(Commit);
      expect(commit.id).to.be.a('string'); // Generated from MongoDBStorage
      expect(commit.sourceId).to.be.equal(id);
      expect(commit.version).to.be.equal(1);
      expect(commit.changes.eventSourceableType).to.be.equal(
        'CommitStoreWithMongoDBStorage.MyProcess'
      );

      expect(commit.changes.events).to.be.instanceof(Array);
      expect(commit.changes.events[0]).to.be.instanceof(MyEvent);
      expect(commit.changes.events[0].sourceId).to.be.equal(id);
      expect(commit.changes.events[0].timestamp).to.be.instanceof(Date);
      expect(commit.changes.events[0].version).to.be.equal(1);

      expect(commit.changes.events[1]).to.be.instanceof(MyOtherEvent);
      expect(commit.changes.events[1].sourceId).to.be.equal(id);
      expect(commit.changes.events[1].timestamp).to.be.instanceof(Date);
      expect(commit.changes.events[1].version).to.be.equal(1);

      expect(commit.changes.commands).to.be.instanceof(Array);
      expect(commit.changes.commands).to.be.eql([firstCommand, secondCommand]);

      expect(commit.insertedAt).to.be.instanceof(Date);
      expect(commit.sentBy).to.be.equal(appId);

      expect(commit.receivers).to.be.instanceof(Array);
      expect(commit.receivers[0]).to.be.instanceof(CommitReceiver);
      expect(commit.receivers[0].state).to.be.equal('received');
      expect(commit.receivers[0].appId).to.be.equal(appId);
      expect(commit.receivers[0].workerId).to.be.equal(workerId);
      expect(commit.receivers[0].receivedAt).to.be.instanceof(Date);
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
      await commitStore.addCommit(firstCommit);
      eventSourceable.version = 1;
      const secondCommit = await commitStore.createCommit(eventSourceable);
      await commitStore.addCommit(secondCommit);
      eventSourceable.version = 2;
      const thirdCommit = await commitStore.createCommit(eventSourceable);
      await commitStore.addCommit(thirdCommit);
      eventSourceable.record(firstEvent);
      eventSourceable.record(secondEvent);
      eventSourceable.version = 3;
      const fourthCommit = await commitStore.createCommit(eventSourceable);
      await commitStore.addCommit(fourthCommit);

      expect(fourthCommit).to.be.instanceof(Commit);
      expect(fourthCommit.id).to.be.a('string'); // Generated from MongoDBStorage
      expect(fourthCommit.sourceId).to.be.equal(id);
      expect(fourthCommit.version).to.be.equal(4);
      expect(fourthCommit.changes.eventSourceableType).to.be.equal(
        'CommitStoreWithMongoDBStorage.MyEventSourceable'
      );

      expect(fourthCommit.changes.events).to.be.instanceof(Array);
      expect(fourthCommit.changes.events[0]).to.be.instanceof(MyEvent);
      expect(fourthCommit.changes.events[0].sourceId).to.be.equal(id);
      expect(fourthCommit.changes.events[0].timestamp).to.be.instanceof(Date);
      expect(fourthCommit.changes.events[0].version).to.be.equal(4);

      expect(fourthCommit.changes.events[1]).to.be.instanceof(MyOtherEvent);
      expect(fourthCommit.changes.events[1].sourceId).to.be.equal(id);
      expect(fourthCommit.changes.events[1].timestamp).to.be.instanceof(Date);
      expect(fourthCommit.changes.events[1].version).to.be.equal(4);

      expect(fourthCommit.changes.commands).to.be.instanceof(Array);
      expect(fourthCommit.changes.commands).to.be.eql([]);

      expect(fourthCommit.insertedAt).to.be.instanceof(Date);
      expect(fourthCommit.sentBy).to.be.equal(appId);

      expect(fourthCommit.receivers).to.be.instanceof(Array);
      expect(fourthCommit.receivers[0]).to.be.instanceof(CommitReceiver);
      expect(fourthCommit.receivers[0].state).to.be.equal('received');
      expect(fourthCommit.receivers[0].appId).to.be.equal(appId);
      expect(fourthCommit.receivers[0].workerId).to.be.equal(workerId);
      expect(fourthCommit.receivers[0].receivedAt).to.be.instanceof(Date);
    });

    it(`throws CommitConcurrencyError if the version in the store does not equal the expected version`, async () => {
      const aggregate = new MyAggregate({ id: 'my-id' });

      const commit = await commitStore.createCommit(aggregate);
      await commitStore.addCommit(commit);

      aggregate.version = 20; // Should be at version 1
      await expect(
        commitStore.createCommit(aggregate)
      ).to.eventually.be.rejectedWith(
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

      const commitId = await commitStore.addCommit(commit);
      expect(commitId).to.be.a('string');

      const foundCommit = (await commitStore.getCommitById(commitId)) as Commit;

      expect(foundCommit).to.be.instanceof(Commit);
      expect(foundCommit.id).to.be.a('string'); // Generated from MongoDBStorage
      expect(foundCommit.sourceId).to.be.equal(id);
      expect(foundCommit.version).to.be.equal(1);

      expect(foundCommit.changes.eventSourceableType).to.be.equal(
        'CommitStoreWithMongoDBStorage.MyAggregate'
      );
      expect(foundCommit.changes.events).to.be.eql([]);
      expect(foundCommit.changes.commands).to.be.eql([]);

      expect(foundCommit.insertedAt).to.be.instanceof(Date);
      expect(foundCommit.sentBy).to.be.equal(appId);

      expect(foundCommit.receivers).to.be.instanceof(Array);
      expect(foundCommit.receivers[0]).to.be.instanceof(CommitReceiver);
      expect(foundCommit.receivers[0].state).to.be.equal('received');
      expect(foundCommit.receivers[0].appId).to.be.equal(appId);
      expect(foundCommit.receivers[0].workerId).to.be.equal(workerId);
      expect(foundCommit.receivers[0].receivedAt).to.be.instanceof(Date);
    });

    it(`rethrows any thrown error on storage`, async () => {
      const aggregate = new MyAggregate({ id: 'my-id' });

      const commit = await commitStore.createCommit(aggregate);
      await commitStore.addCommit(commit);
      await expect(commitStore.addCommit(commit)).to.eventually.be.rejectedWith(
        CommitConcurrencyError,
        `CommitStoreWithMongoDBStorage.MyAggregate: expected event sourceable with id of 'my-id' to be at version 0 but is at version 1`
      );
    });
  });

  describe('returning commits', () => {
    it('returns commit by id', async () => {
      const aggregate = new MyAggregate({ id: 'my-id' });

      const commit = await commitStore.createCommit(aggregate);
      await commitStore.addCommit(commit);

      const foundCommit = await commitStore.getCommitById(commit.id);
      expect(foundCommit).to.be.instanceof(Commit);
      expect(foundCommit).to.be.eql(commit);
    });

    it(`returns undefined if commit by id can't be found`, async () => {
      const commitId = new Guid().toString();
      const foundCommit = await commitStore.getCommitById(commitId);
      expect(foundCommit).to.be.equal(undefined);
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
      await commitStore.addCommit(firstCommit);

      aggregate.version = 1;
      aggregate.record(secondEvent);
      const secondCommit = await commitStore.createCommit(aggregate);
      await commitStore.addCommit(secondCommit);

      const events = await commitStore.getEvents(aggregateId);
      const firstV1Event = new MyEvent({ ...firstEvent, version: 1 });
      const firstV2Event = new MyEvent({ ...firstEvent, version: 2 });
      const secondV2Event = new MyOtherEvent({ ...secondEvent, version: 2 });
      expect(events).to.be.eql([firstV1Event, firstV2Event, secondV2Event]);
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
      await commitStore.addCommit(firstCommit);

      aggregate.version = 1;
      aggregate.record(secondEvent);
      const secondCommit = await commitStore.createCommit(aggregate);
      await commitStore.addCommit(secondCommit);

      const events = await commitStore.getEvents(aggregateId, 2);
      const firstV2Event = new MyEvent({ ...firstEvent, version: 2 });
      const secondV2Event = new MyOtherEvent({ ...secondEvent, version: 2 });
      expect(events).to.be.eql([firstV2Event, secondV2Event]);

      const firstV1Event = new MyEvent({ ...firstEvent, version: 1 });
      expect(events).to.not.include(firstV1Event);
    });

    it(`returns empty array if commits for event sourceable can't be found`, async () => {
      const events = await commitStore.getEvents('my-id');
      expect(events).to.be.eql([]);
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
      await commitStore.addCommit(firstCommit);

      aggregate.version = 1;
      aggregate.record(secondEvent);
      const secondCommit = await commitStore.createCommit(aggregate);
      await commitStore.addCommit(secondCommit);

      const events = await commitStore.getAllEvents();
      const firstV1Event = new MyEvent({ ...firstEvent, version: 1 });
      const firstV2Event = new MyEvent({ ...firstEvent, version: 2 });
      const secondV2Event = new MyOtherEvent({ ...secondEvent, version: 2 });
      expect(events).to.be.eql([firstV1Event, firstV2Event, secondV2Event]);
    });

    it(`returns empty when no commits are available`, async () => {
      const allEvents = await commitStore.getAllEvents();
      expect(allEvents).to.be.eql([]);
    });
  });
});
