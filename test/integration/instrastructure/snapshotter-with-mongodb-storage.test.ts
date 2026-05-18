import { mock } from 'vitest-mock-extended';
import { expect, describe, it, afterEach, beforeAll, afterAll } from 'vitest';

import { Collection } from 'mongodb';

import { Type, kernel } from '@eveble/core';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { createEJSON } from '../../../src/utils/helpers';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';

import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';

describe(`SnapshotMongoDBStorage with MongoDB storage`, () => {
  @Type('SnapshotterWithMongoDBStorage.MyEventSourceable')
  class MyEventSourceable extends EventSourceable {
    name: string;
  }

  // Props
  const appId = 'my-app-id';
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Dependencies
  let serializer: types.Serializer;
  let snapshotter: types.Snapshotter;

  const setupInjector = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function (): void {
    // Config.prototype.get
    config.get.calledWith('appId').mockReturnValue(appId);
    config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(60);
    config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(10);
    // Config.prototype.has
    config.has.calledWith('eveble.Snapshotter.frequency').mockReturnValue(true);
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
    injector
      .bind<types.Snapshotter>(BINDINGS.Snapshotter)
      .to(Snapshotter)
      .inSingletonScope();

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
    snapshotter = injector.get<types.Snapshotter>(BINDINGS.Snapshotter);
  };

  const setupTypes = function (): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  beforeAll(async () => {
    setupInjector();
    setupDefaultConfiguration();
    await setupSnapshotterMongo(injector, clients, collections);
    setupEvebleDependencies();
    setupTypes();
  });

  afterEach(async () => {
    await collections.snapshotter.deleteMany({});
  });

  afterAll(async () => {
    await clients.snapshotter.disconnect();
  });

  describe(`making snapshots`, () => {
    it(`skips snapshot if not enough versions have passed`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 1;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshot = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshot).toBeUndefined();
    });

    it(`saves the current state of event sourceable to storage`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 11;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshot = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshot).toBeInstanceOf(MyEventSourceable);
      expect(foundSnapshot).toEqual(eventSourceable);
    });

    it(`updates existing event sourceable snapshot on storage`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 11;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshotV5 = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshotV5).toEqual(eventSourceable);

      eventSourceable.version = 21;
      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshotV10 = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshotV10).toEqual(eventSourceable);
    });

    it(`does not update existing event sourceable snapshot when not enough versions have passed`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 11;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshotV5 = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshotV5).toEqual(eventSourceable);

      eventSourceable.version = 12;
      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshotStillOnV11 = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshotStillOnV11).toEqual(
        Object.assign(eventSourceable, { version: 11 })
      );
    });
  });

  describe(`restoring latest snapshot of event sourceable`, () => {
    it(`creates and returns an aggregate instance based on the snapshot`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 11;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshot = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshot).toBeInstanceOf(MyEventSourceable);
      expect(foundSnapshot).toEqual(eventSourceable);
    });

    it(`returns undefined if event sourceable snapshot cannot be found on storage`, async () => {
      const id = 'my-id';
      const foundSnapshot = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshot).toBeUndefined();
    });
  });
});

