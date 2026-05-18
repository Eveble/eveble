import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, beforeAll, afterAll } from 'vitest';

import getenv from 'getenv';
import { MongoClient, Collection } from 'mongodb';

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

describe(`SnapshotMongoDBStorage`, () => {
  @Type('SnapshotMongoDBStorage.MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {
    name: string;
  }

  let mongoClient: MongoClient;
  let injector: Injector;
  let collection: Collection;
  let esSerializer: any;
  let storage: SnapshotMongoDBStorage;
  let eventSourceableId: string;
  let eventSourceable: EventSourceable;
  let snapshot: any;
  let snapshotedES: any;

  beforeAll(async () => {
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
    snapshotedES = vi.fn();
    snapshot = {
      id: 'my-id',
      snapshot: snapshotedES,
    };

    const dbName =
      getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_DBNAME') || 'eveble_testing';
    const collectionName =
      getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_COLLECTION') || 'snapshots';
    collection = mongoClient.db(dbName).collection(collectionName);

    injector = new Injector();
    storage = new SnapshotMongoDBStorage();
    esSerializer = mock<types.SnapshotSerializer>();

    esSerializer.serialize.calledWith(eventSourceable).mockReturnValue(snapshot);
    esSerializer.deserialize
      .calledWith(MyEventSourceable, snapshotedES)
      .mockReturnValue(eventSourceable);

    injector
      .bind<types.SnapshotSerializer>(BINDINGS.SnapshotSerializer)
      .toConstantValue(esSerializer);
    injector
      .bind<Collection<any>>(BINDINGS.MongoDB.collections.Snapshots)
      .toConstantValue(collection);
    injector.injectInto(storage);
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it(`inserts snapshot to MongoDB collection`, async () => {
    const docId = 'mongo-id';
    vi.spyOn(collection, 'insertOne').mockResolvedValue({
      insertedId: docId,
      acknowledged: true,
    });

    const result = await storage.save(eventSourceable);
    expect(result).toBe(docId);

    expect(collection.insertOne).toHaveBeenCalledWith(snapshot);
  });

  it(`throws AddingSnapshotError on unsuccessful document insertion`, async () => {
    vi.spyOn(collection, 'insertOne').mockResolvedValue({
      acknowledged: false,
      insertedId: null,
    });

    await expect(storage.save(eventSourceable)).rejects.toThrow(
      AddingSnapshotError,
      `SnapshotMongoDBStorage: adding snapshot for event sourceable 'SnapshotMongoDBStorage.MyEventSourceable' with id '${eventSourceableId.toString()}' failed`
    );
    expect(collection.insertOne).toHaveBeenCalledWith(snapshot);
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

    vi.spyOn(collection, 'updateOne').mockResolvedValue({ modifiedCount: 1, acknowledged: true });

    await storage.update(eventSourceable);

    expect(collection.updateOne).toHaveBeenCalledWith(filter, update);
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

    vi.spyOn(collection, 'updateOne').mockResolvedValue({ modifiedCount: 0, acknowledged: true });

    await expect(storage.update(eventSourceable)).rejects.toThrow(
      UpdatingSnapshotError,
      `SnapshotMongoDBStorage: updating snapshot for event sourceable 'SnapshotMongoDBStorage.MyEventSourceable' with id '${eventSourceableId.toString()}' failed`
    );

    expect(collection.updateOne).toHaveBeenCalledWith(filter, update);
  });

  it(`returns deserialized event sourceable snapshot from MongoDB collection by event sourceable's id`, async () => {
    const query = {
      _id: eventSourceableId,
    };

    vi.spyOn(collection, 'findOne').mockResolvedValue(snapshot);

    const foundSnapshot = await storage.findById(
      MyEventSourceable,
      eventSourceableId
    );
    expect(foundSnapshot).toBeInstanceOf(MyEventSourceable);
    expect(foundSnapshot).toEqual(eventSourceable);

    expect(collection.findOne).toHaveBeenCalledWith(query);
  });

  it(`returns undefined if snapshot cannot be found on MongoDB collection`, async () => {
    const query = {
      _id: eventSourceableId,
    };

    vi.spyOn(collection, 'findOne').mockResolvedValue(null);

    const foundSnapshot = await storage.findById(
      MyEventSourceable,
      eventSourceableId
    );
    expect(foundSnapshot).toBe(undefined);

    expect(collection.findOne).toHaveBeenCalledWith(query);
  });
});
