import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import getenv from 'getenv';
import { stubInterface } from 'ts-sinon';
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

chai.use(sinonChai);

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
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();
    serializer = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .toConstantValue(serializer);
  };

  const setupMongo = function (): void {
    MongoClient = sinon.stub();
    mongoClientInstance = stubInterface<MongoClientOriginal>();
    commitsCollection = stubInterface<Collection<any>>();
    db = stubInterface<Db>();

    MongoClient.returns(mongoClientInstance);
    mongoClientInstance.db.returns(db);
    db.collection.returns(commitsCollection);

    injector
      .bind<MongoClientOriginal>(BINDINGS.MongoDB.library)
      .toConstantValue(MongoClient);
  };

  const setupApp = function (): void {
    app = stubInterface<types.App>();
    app.config = appConfig;
  };

  beforeEach(() => {
    setupInjector();
    setupMongo();
    setupApp();
  });

  it(`extends Module`, () => {
    expect(MongoDBCommitStorageModule.prototype).to.be.instanceof(Module);
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
      expect(mongodbClient).to.be.instanceof(MongoDBClient);
      expect(MongoClient).to.be.calledWithNew;

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
      expect(mongodbClient.url).to.be.equal(url);
      expect(mongodbClient.options).to.be.eql({
        ...MongoDBClient.defaultOptions,
        ssl: getenv.bool(`EVEBLE_COMMITSTORE_MONGODB_SSL`),
      });
      expect(mongodbClient.databases).to.be.eql([expectedDatabase]);
    });

    it('initializes MongoDB client with custom options set on app configuration', async () => {
      const mongodbOptions = {
        noDelay: true,
        keepAlive: true,
      };
      const customApp = stubInterface<types.App>();
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
      expect(mongodbClient.options).to.be.eql({
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
      expect(log.debug).to.be.calledWithExactly(
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
      expect(log.debug).to.be.calledWithExactly(
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
      expect(collection).to.be.equal(commitsCollection);
      expect(mongoClientInstance.db).to.be.calledTwice;
      expect(mongoClientInstance.db).to.be.calledWithExactly(databaseName);
      expect(db.collection).to.be.calledTwice;
      expect(db.collection).to.be.calledWithExactly(collectionName);
    });

    it('bounds CommitSerializer to singleton on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);

      expect(injector.isBound(BINDINGS.CommitSerializer)).to.be.true;
      const commitSerializer = await injector.get(BINDINGS.CommitSerializer);
      expect(commitSerializer).to.be.instanceof(CommitSerializer);
    });

    it('logs bounding CommitSerializer on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).to.be.calledWithExactly(
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

      expect(injector.isBound(BINDINGS.CommitStorage)).to.be.true;
      const commitStorage = await injector.get(BINDINGS.CommitStorage);
      expect(commitStorage).to.be.instanceof(CommitMongoDBStorage);
    });

    it('logs bounding CommitStorage on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).to.be.calledWithExactly(
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

      expect(injector.isBound(BINDINGS.CommitObserver)).to.be.true;
      const commitObserver = await injector.get(BINDINGS.CommitObserver);
      expect(commitObserver).to.be.instanceof(CommitMongoDBObserver);
    });

    it('logs bounding CommitObserver on injector', async () => {
      const module = new MongoDBCommitStorageModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).to.be.calledWithExactly(
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
      mongoClientInstance.isConnected.returns(true);
      await module.shutdown();

      const mongodbClient = await injector.getAsync<MongoDBClient>(
        BINDINGS.MongoDB.clients.CommitStore
      );
      expect(mongodbClient.isInState(MongoDBClient.STATES.disconnected)).to.be
        .true;
    });
  });
});
