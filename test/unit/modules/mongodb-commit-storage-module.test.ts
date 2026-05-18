import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import getenv from 'getenv';

import { MongoClient as MongoClientOriginal, Collection, Db } from 'mongodb';
import { AppConfig } from '../../../src/configs/app-config';
import {
  MongoDBDatabaseConfig,
  MongoDBCollectionConfig,
  MongoDBClient,
} from '../../../src/app/clients/mongodb-client';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { MongoDBCommitStorageModule } from '../../../src/app/modules/mongodb-commit-storage-module';
import { Module } from '../../../src/core/module';
import { Log } from '../../../src/components/log-entry';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';

describe(`MongoDBCommitStorageModule`, () => {
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
  let commitsCollection: any;
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
    commitsCollection = mock<Collection<any>>();
    db = mock<Db>();

    MongoClient.mockImplementation(function() { return mongoClientInstance; });
    mongoClientInstance.db.mockReturnValue(db);
    db.collection.mockReturnValue(commitsCollection);

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
    expect(MongoDBCommitStorageModule.prototype).toBeInstanceOf(Module);
  });

  describe('before initialization', () => {
    it('initializes MongoDB client and bounds it on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.CommitStore
      );
      expect(mongodbClient).toBeInstanceOf(MongoDBClient);
      expect(MongoClient).toHaveBeenCalledTimes(1);

      const url = getenv.string(`EVEBLE_COMMITSTORE_MONGODB_URL`);
      const expectedDommitsCollection = new MongoDBCollectionConfig({
        name: getenv.string('EVEBLE_COMMITSTORE_MONGODB_COLLECTION'),
        indexes: [
          [
            {
              sourceId: 1,
              version: 1,
            },
            {
              unique: true,
            },
          ],
          [
            {
              'receivers.appId': 1,
            },
          ],
          [
            {
              _id: 1,
              'receivers.appId': 1,
            },
          ],
        ],
      });
      const expectedDatabase = new MongoDBDatabaseConfig({
        name: getenv.string('EVEBLE_COMMITSTORE_MONGODB_DBNAME'),
        collections: [expectedDommitsCollection],
      });
      expect(mongodbClient.url).toBe(url);
      expect(mongodbClient.options).toEqual({
        ...MongoDBClient.defaultOptions,
        ssl: getenv.bool(`EVEBLE_COMMITSTORE_MONGODB_SSL`),
      });
      expect(mongodbClient.databases).toEqual([expectedDatabase]);
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
            CommitStore: mongodbOptions,
          },
        },
      });

      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(customApp, injector);

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.CommitStore
      );
      expect(mongodbClient.options).toEqual({
        ...MongoDBClient.defaultOptions,
        noDelay: true,
        keepAlive: true,
        ssl: getenv.bool(`EVEBLE_COMMITSTORE_MONGODB_SSL`),
      });
    });

    it('logs bounding MongoDB client on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(`bound 'MongoDB.clients.CommitStore' as constant value`)
          .on(module)
          .in('initializeClientForCommitStorage')
      );
    });

    it('logs bounding commits collection on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(`bound 'MongoDB.collections.Commits' as constant value`)
          .on(module)
          .in('initializeClientForCommitStorage')
      );
    });

    it('bounds commits collection on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      const databaseName = getenv.string('EVEBLE_COMMITSTORE_MONGODB_DBNAME');
      const collectionName = getenv.string(
        'EVEBLE_COMMITSTORE_MONGODB_COLLECTION'
      );
      const collection = await injector.get(
        BINDINGS.MongoDB.collections.Commits
      );
      expect(collection).toBe(commitsCollection);
      expect(mongoClientInstance.db).toHaveBeenCalledTimes(2);
      expect(mongoClientInstance.db).toHaveBeenCalledWith(databaseName);
      expect(db.collection).toHaveBeenCalledTimes(2);
      expect(db.collection).toHaveBeenCalledWith(collectionName);
    });

    it('bounds CommitSerializer to singleton on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      expect(injector.isBound(BINDINGS.CommitSerializer)).toBe(true);
      const commitSerializer = await injector.get(BINDINGS.CommitSerializer);
      expect(commitSerializer).toBeInstanceOf(CommitSerializer);
    });

    it('logs bounding CommitSerializer on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(
          `bound 'CommitSerializer' to 'CommitSerializer' in singleton scope`
        )
          .on(module)
          .in('initializeCommitSerializer')
      );
    });

    it('bounds CommitStorage to singleton on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      expect(injector.isBound(BINDINGS.CommitStorage)).toBe(true);
      const commitStorage = await injector.get(BINDINGS.CommitStorage);
      expect(commitStorage).toBeInstanceOf(CommitMongoDBStorage);
    });

    it('logs bounding CommitStorage on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(
          `bound 'CommitStorage' to 'CommitMongoDBStorage' in singleton scope`
        )
          .on(module)
          .in('initializeCommitStorage')
      );
    });

    it('bounds CommitObserver to singleton on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      expect(injector.isBound(BINDINGS.CommitObserver)).toBe(true);
      const commitObserver = await injector.get(BINDINGS.CommitObserver);
      expect(commitObserver).toBeInstanceOf(CommitMongoDBObserver);
    });

    it('logs bounding CommitObserver on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(
          `bound 'CommitObserver' to 'CommitMongoDBObserver' in singleton scope`
        )
          .on(module)
          .in('initializeCommitObserver')
      );
    });
  });

  describe('on initialization', () => {
    it('creates MongoDB client and connects it as prerequisite for collection', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.CommitStore
      );
      expect(mongodbClient.isInState(MongoDBClient.STATES.connected)).to.be
        .true;
    });
  });

  describe('on start', () => {
    it('connect MongoDB client', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.CommitStore
      );
      await mongodbClient.disconnect();
      await module.start();

      expect(mongodbClient.isInState(MongoDBClient.STATES.connected)).to.be
        .true;
    });
  });

  describe('on shutdown', () => {
    it('disconnects MongoDB client', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      await module.stop();
      mongoClientInstance.isConnected.mockReturnValue(true);
      await module.shutdown();

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.CommitStore
      );
      expect(mongodbClient.isInState(MongoDBClient.STATES.disconnected)).to.be
        .true;
    });
  });
});

