import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import getenv from 'getenv';
import { MongoClient, Collection } from 'mongodb';
import { stubInterface } from 'ts-sinon';
import { Type } from '@eveble/core';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { Guid } from '../../../src/domain/value-objects/guid';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import {
  AddingSnapshotError,
  UpdatingSnapshotError,
} from '../../../src/infrastructure/infrastructure-errors';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`SnapshotMongoDBStorage`, () => {
  @Type('SnapshotMongoDBStorage.MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {
    name: string;
  }

  let mongoClient: MongoClient;
  let injector: Injector;
  let collection: Collection;
  let collectionMock: any;
  let esSerializer: any;
  let storage: SnapshotMongoDBStorage;
  let eventSourceableId: string;
  let eventSourceable: EventSourceable;
  let snapshot: any;
  let snapshotedES: any;

  before(async () => {
    const mongoUrl = getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_URL');
    // Remove deprecated options for v6
    mongoClient = await MongoClient.connect(mongoUrl);

    eventSourceableId = new Guid().toString();
    eventSourceable = new MyEventSourceable({
      id: eventSourceableId,
      name: 'Foo',
    });
  });

  beforeEach(() => {
    snapshotedES = sinon.stub();
    snapshot = {
      id: 'my-id',
      snapshot: snapshotedES,
    };

    const dbName =
      getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_DBNAME') || 'eveble_testing';
    const collectionName =
      getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_COLLECTION') || 'snapshots';
    collection = mongoClient.db(dbName).collection(collectionName);
    collectionMock = sinon.mock(collection);

    injector = new Injector();
    storage = new SnapshotMongoDBStorage();
    esSerializer = stubInterface<types.SnapshotSerializer>();

    esSerializer.serialize.withArgs(eventSourceable).returns(snapshot);
    esSerializer.deserialize
      .withArgs(MyEventSourceable, snapshotedES)
      .returns(eventSourceable);

    injector
      .bind<types.SnapshotSerializer>(BINDINGS.SnapshotSerializer)
      .toConstantValue(esSerializer);
    injector
      .bind<Collection<any>>(BINDINGS.MongoDB.collections.Snapshots)
      .toConstantValue(collection);
    injector.injectInto(storage);
  });

  after(async () => {
    await mongoClient.close();
  });

  it(`inserts snapshot to MongoDB collection`, async () => {
    const docId = 'mongo-id';
    collectionMock.expects('insertOne').withArgs(snapshot).resolves({
      insertedId: docId,
      acknowledged: true,
    });

    const result = await storage.save(eventSourceable);
    expect(result).to.be.equal(docId);

    collectionMock.verify();
  });

  it(`throws AddingSnapshotError on unsuccessful document insertion`, async () => {
    collectionMock.expects('insertOne').withArgs(snapshot).resolves({
      acknowledged: false,
      insertedId: null,
    });

    await expect(storage.save(eventSourceable)).to.eventually.be.rejectedWith(
      AddingSnapshotError,
      `SnapshotMongoDBStorage: adding snapshot for event sourceable 'SnapshotMongoDBStorage.MyEventSourceable' with id '${eventSourceableId.toString()}' failed`
    );
    collectionMock.verify();
  });

  it(`updates snapshot on MongoDB collection`, async () => {
    const filter = {
      _id: eventSourceableId,
    };
    const update = {
      $set: {
        snapshot: snapshot.snapshot,
      },
    };

    collectionMock
      .expects('updateOne')
      .withArgs(filter, update)
      .resolves({ modifiedCount: 1, acknowledged: true });

    await storage.update(eventSourceable);

    collectionMock.verify();
  });

  it(`throws UpdatingSnapshotError on failed snapshot update at MongoDB collection`, async () => {
    const filter = {
      _id: eventSourceableId,
    };
    const update = {
      $set: {
        snapshot: snapshot.snapshot,
      },
    };

    collectionMock
      .expects('updateOne')
      .withArgs(filter, update)
      .resolves({ modifiedCount: 0, acknowledged: true });

    await expect(storage.update(eventSourceable)).to.eventually.be.rejectedWith(
      UpdatingSnapshotError,
      `SnapshotMongoDBStorage: updating snapshot for event sourceable 'SnapshotMongoDBStorage.MyEventSourceable' with id '${eventSourceableId.toString()}' failed`
    );

    collectionMock.verify();
  });

  it(`returns deserialized event sourceable snapshot from MongoDB collection by event sourceable's id`, async () => {
    const query = {
      _id: eventSourceableId,
    };

    collectionMock.expects('findOne').withArgs(query).resolves(snapshot);

    const foundSnapshot = await storage.findById(
      MyEventSourceable,
      eventSourceableId
    );
    expect(foundSnapshot).to.be.instanceOf(MyEventSourceable);
    expect(foundSnapshot).to.be.eql(eventSourceable);

    collectionMock.verify();
  });

  it(`returns undefined if snapshot cannot be found on MongoDB collection`, async () => {
    const query = {
      _id: eventSourceableId,
    };

    collectionMock.expects('findOne').withArgs(query).resolves(null);

    const foundSnapshot = await storage.findById(
      MyEventSourceable,
      eventSourceableId
    );
    expect(foundSnapshot).to.be.equal(undefined);

    collectionMock.verify();
  });
});
