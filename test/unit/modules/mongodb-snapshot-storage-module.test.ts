import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import { MongoClient as MongoClientOriginal, Collection, Db } from 'mongodb';
import getenv from 'getenv';
import { AppConfig } from '../../../src/configs/app-config';
import { MongoDBClient } from '../../../src/app/clients/mongodb-client';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { MongoDBSnapshotStorageModule } from '../../../src/app/modules/mongodb-snapshot-storage-module';
import { Log } from '../../../src/components/log-entry';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { Module } from '../../../src/core/module';

describe(`MongoDBSnapshotStorageModule`, () => {
  // Props
  const appConfig = new AppConfig({
    appId: 'my-app-id',
  });
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  let serializer: any;
  // App
  let app: any;
  // Dependencies
  let MongoClient: any;
  let mongoClientInstance: any;
  let snapshotsCollection: any;
  let db: any;

  const setupInjector = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();
    serializer = mock<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .toConstantValue(serializer);
  };

  const setupMongo = function (): void {
    MongoClient = vi.fn();
    mongoClientInstance = mock<MongoClientOriginal>();
    snapshotsCollection = mock<Collection<any>>();
    db = mock<Db>();

    MongoClient.mockImplementation(function () {
      return mongoClientInstance;
    });
    mongoClientInstance.db.mockReturnValue(db);
    db.collection.mockReturnValue(snapshotsCollection);

    injector
      .bind<MongoClientOriginal>(BINDINGS.MongoDB.library)
      .toConstantValue(MongoClient);
  };

  const setupApp = function (): void {
    app = mock<types.App>();
    app.config = appConfig;
  };

  beforeEach(() => {
    setupInjector();
    setupMongo();
    setupApp();
  });

  it(`extends Module`, () => {
    expect(MongoDBSnapshotStorageModule.prototype).toBeInstanceOf(Module);
  });

  describe('before initialization', () => {
    it('initializes MongoDB client and bounds it on injector', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.Snapshotter
      );
      expect(mongodbClient).toBeInstanceOf(MongoDBClient);
      expect(MongoClient).toHaveBeenCalledTimes(1);

      const url = getenv.string(`EVEBLE_SNAPSHOTTER_MONGODB_URL`);
      expect(mongodbClient.url).toBe(url);
      expect(mongodbClient.options).toEqual({
        ...MongoDBClient.defaultOptions,
        ssl: getenv.bool(`EVEBLE_SNAPSHOTTER_MONGODB_SSL`),
      });
    });

    it('initializes MongoDB client with custom options set on app configuration', async () => {
      const mongodbOptions = {
        noDelay: true,
        keepAlive: true,
      };
      const customApp = mock<types.App>();
      customApp.config = new AppConfig({
        appId: 'my-app-id',
        clients: {
          MongoDB: {
            Snapshotter: mongodbOptions,
          },
        },
      });

      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(customApp, injector);

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.Snapshotter
      );

      expect(mongodbClient.options).toEqual({
        ...MongoDBClient.defaultOptions,
        noDelay: true,
        keepAlive: true,
        ssl: getenv.bool(`EVEBLE_SNAPSHOTTER_MONGODB_SSL`),
      });
    });

    it('logs bounding MongoDB client on injector', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(`bound 'MongoDB.clients.Snapshotter' as constant value`)
          .on(module)
          .in('initializeClientForSnapshotter')
      );
    });

    it('logs bounding snapshots collection on injector', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(`bound 'MongoDB.collections.Snapshots' as constant value`)
          .on(module)
          .in('initializeClientForSnapshotter')
      );
    });

    it('bounds snapshots collection on injector', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      const databaseName = getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_DBNAME');
      const collectionName = getenv.string(
        'EVEBLE_SNAPSHOTTER_MONGODB_COLLECTION'
      );
      const collection = await injector.getAsync(
        BINDINGS.MongoDB.collections.Snapshots
      );
      expect(collection).toBe(snapshotsCollection);
      expect(mongoClientInstance.db).toHaveBeenCalledTimes(1);
      expect(mongoClientInstance.db).toHaveBeenCalledWith(databaseName);
      expect(db.collection).toHaveBeenCalledTimes(1);
      expect(db.collection).toHaveBeenCalledWith(collectionName);
    });

    it('bounds SnapshotSerializer to singleton on injector', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      expect(injector.isBound(BINDINGS.SnapshotSerializer)).toBe(true);
      const commitSerializer =
        await injector.getAsync<types.SnapshotSerializer>(
          BINDINGS.SnapshotSerializer
        );
      expect(commitSerializer).toBeInstanceOf(SnapshotSerializer);
    });

    it('logs bounding SnapshotSerializer on injector', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(
          `bound 'SnapshotSerializer' to 'SnapshotSerializer' in singleton scope`
        )
          .on(module)
          .in('initializeSnapshotSerializer')
      );
    });

    it('bounds SnapshotStorage to singleton on injector', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      expect(injector.isBound(BINDINGS.SnapshotStorage)).toBe(true);
      const commitStorage = await injector.getAsync<types.SnapshotStorage>(
        BINDINGS.SnapshotStorage
      );
      expect(commitStorage).toBeInstanceOf(SnapshotMongoDBStorage);
    });

    it('logs bounding SnapshotStorage on injector', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(
          `bound 'SnapshotStorage' to 'SnapshotMongoDBStorage' in singleton scope`
        )
          .on(module)
          .in('initializeSnapshotter')
      );
    });
  });

  describe('on initialization', () => {
    it('creates MongoDB client and connects it as prerequisite for collection', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.Snapshotter
      );
      expect(mongodbClient.isInState(MongoDBClient.STATES.connected)).to.be
        .true;
    });
  });

  describe('on start', () => {
    it('connect MongoDB client', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.Snapshotter
      );
      await mongodbClient.disconnect();
      await module.start();

      expect(mongodbClient.isInState(MongoDBClient.STATES.connected)).to.be
        .true;
    });
  });

  describe('on shutdown', () => {
    it('disconnects MongoDB client', async () => {
      const module = new MongoDBSnapshotStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      await module.stop();
      mongoClientInstance.isConnected.mockReturnValue(true);
      await module.shutdown();

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.Snapshotter
      );
      expect(mongodbClient.isInState(MongoDBClient.STATES.disconnected)).to.be
        .true;
    });
  });
});
