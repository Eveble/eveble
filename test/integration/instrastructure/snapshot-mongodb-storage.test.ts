import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

import { Collection, Filter } from 'mongodb';

import { Type, kernel } from '@eveble/core';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { createEJSON } from '../../../src/utils/helpers';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { Guid } from '../../../src/domain/value-objects/guid';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';

describe(`SnapshotMongoDBStorage`, () => {
  @Type('IntegrationSnapshotMongoDBStorage.MyEventSourceable')
  class MyEventSourceable extends EventSourceable {
    name: string;
  }

  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Dependencies
  let serializer: types.Serializer;
  let storage: types.SnapshotStorage;

  const setupInjector = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupEvebleDependencies = function (): void {
    // Serializer
    injector.bind<any>(BINDINGS.EJSON).toConstantValue(createEJSON());
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .to(EJSONSerializerAdapter)
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

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
    storage = injector.get<types.SnapshotStorage>(BINDINGS.SnapshotStorage);
  };

  const setupTypes = function (): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  beforeAll(async () => {
    setupInjector();
    await setupSnapshotterMongo(injector, clients, collections);
    setupEvebleDependencies();
    setupTypes();
  });

  let eventSourceableId: string;
  let eventSourceable: MyEventSourceable;

  beforeEach(() => {
    eventSourceableId = new Guid().toString();
    eventSourceable = new MyEventSourceable({
      id: eventSourceableId,
      name: 'Foo',
    });
  });

  afterEach(async () => {
    await collections.snapshotter.deleteMany({});
  });

  afterAll(async () => {
    await clients.snapshotter.disconnect();
  });

  it(`inserts snapshot to MongoDB snapshots collection`, async () => {
    const result = await storage.save(eventSourceable);
    expect(result).toBe(eventSourceableId);

    const expectedSnapshot = {
      _id: `${eventSourceableId}`,
      snapshot: `{"_type":"IntegrationSnapshotMongoDBStorage.MyEventSourceable","id":"${eventSourceableId}","version":0,"name":"Foo"}`,
    };
    const foundSnapshot = await collections.snapshotter.findOne({
      _id: eventSourceableId,
    } as Filter<any>);
    expect(foundSnapshot).toEqual(expectedSnapshot);
  });

  it(`updates snapshot on MongoDB snapshots collection`, async () => {
    const updatedName = 'Not-Foo-Anymore';

    await storage.save(eventSourceable);

    eventSourceable.name = updatedName;
    await storage.update(eventSourceable);

    const expectedUpdatedSnapshot = {
      _id: `${eventSourceableId}`,
      snapshot: `{"_type":"IntegrationSnapshotMongoDBStorage.MyEventSourceable","id":"${eventSourceableId}","version":0,"name":"Not-Foo-Anymore"}`,
    };
    const foundUpdatedSnapshot = await collections.snapshotter.findOne({
      _id: eventSourceableId,
    } as Filter<any>);
    expect(foundUpdatedSnapshot).toEqual(expectedUpdatedSnapshot);
  });

  it(`returns deserialized event sourceable snapshot from MongoDB snapshots collection by event sourceable's id`, async () => {
    await storage.save(eventSourceable);
    const foundSnapshot = await storage.findById(
      MyEventSourceable,
      eventSourceableId
    );
    expect(foundSnapshot).toBeInstanceOf(MyEventSourceable);
    expect(foundSnapshot).toEqual(eventSourceable);
  });

  it(`returns undefined if snapshot cannot be found on MongoDB snapshots collection`, async () => {
    const foundSnapshot = await storage.findById(
      MyEventSourceable,
      eventSourceableId
    );
    expect(foundSnapshot).toBe(undefined);
  });
});

