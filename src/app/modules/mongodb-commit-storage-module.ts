import getenv from 'getenv';
import { Collection } from 'mongodb';
import {
  MongoDBClient,
  MongoDBCollectionConfig,
  MongoDBDatabaseConfig,
} from '../clients/mongodb-client';
import { CommitMongoDBStorage } from '../../infrastructure/storages/commit-mongodb-storage';
import { CommitMongoDBObserver } from '../../infrastructure/storages/commit-mongodb-observer';
import { Module } from '../../core/module';
import { types } from '../../types';
import { Log } from '../../components/log-entry';
import { BINDINGS } from '../../constants/bindings';
import { CommitSerializer } from '../../infrastructure/serializers/commit-serializer';

export class MongoDBCommitStorageModule extends Module {
  mongoClient?: MongoDBClient;

  /**
   * On initialize hook.
   * @async
   */
  protected async onInitialize(): Promise<void> {
    await this.initializeClientForCommitStorage();
    await this.initializeCommitSerializer();
    await this.initializeCommitStorage();
    await this.initializeCommitObserver();
  }

  /**
   * On module start hook.
   * @async
   */
  protected async onStart(): Promise<void> {
    if (!this.mongoClient?.isConnected()) {
      await this.mongoClient?.initialize();
      await this.mongoClient?.connect();
    }
  }

  /**
   * On module shutdown hook.
   * @async
   */
  protected async onShutdown(): Promise<void> {
    await this.mongoClient?.disconnect();
  }

  /**
   * Initializes client for CommitStorage.
   * @async
   */
  protected async initializeClientForCommitStorage(): Promise<void> {
    const url: string = getenv.string(`EVEBLE_COMMITSTORE_MONGODB_URL`);
    const options = {
      ...this.config.get<Record<string, any>>('clients.MongoDB.CommitStore'),
      ssl: getenv.bool(`EVEBLE_COMMITSTORE_MONGODB_SSL`),
    };
    const databaseName: string = getenv.string(
      'EVEBLE_COMMITSTORE_MONGODB_DBNAME'
    );
    const collectionName: string = getenv.string(
      'EVEBLE_COMMITSTORE_MONGODB_COLLECTION'
    );
    const indexes = [
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
    ];
    const commitsCollection = new MongoDBCollectionConfig({
      name: collectionName,
      indexes,
    });
    const database = new MongoDBDatabaseConfig({
      name: databaseName,
      collections: [commitsCollection],
    });
    const client = new MongoDBClient({
      id: 'MongoDB.clients.CommitStore',
      databases: [database],
      url,
      options,
    });
    this.injector.injectInto(client);
    this.injector
      .bind<MongoDBClient>(BINDINGS.MongoDB.clients.CommitStore)
      .toConstantValue(client);
    this.log?.debug(
      new Log(`bound 'MongoDB.clients.CommitStore' as constant value`)
        .on(this)
        .in(this.initializeClientForCommitStorage)
    );

    this.mongoClient = this.injector.get<MongoDBClient>(
      BINDINGS.MongoDB.clients.CommitStore
    );
    await this.mongoClient.initialize();
    await this.mongoClient.connect();

    const collection = this.mongoClient.getCollection(
      databaseName,
      collectionName
    );
    this.injector
      .bind<Collection<any>>(BINDINGS.MongoDB.collections.Commits)
      .toConstantValue(collection);
    this.log?.debug(
      new Log(`bound 'MongoDB.collections.Commits' as constant value`)
        .on(this)
        .in(this.initializeClientForCommitStorage)
    );
  }

  /**
   * Initializes CommitSerializer.
   * @async
   */
  protected async initializeCommitSerializer(): Promise<void> {
    this.injector
      .bind<types.CommitSerializer>(BINDINGS.CommitSerializer)
      .to(CommitSerializer)
      .inSingletonScope();
    this.log?.debug(
      new Log(
        `bound 'CommitSerializer' to 'CommitSerializer' in singleton scope`
      )
        .on(this)
        .in(this.initializeCommitSerializer)
    );
  }

  /**
   * Initializes CommitStorage.
   * @async
   */
  protected async initializeCommitStorage(): Promise<void> {
    this.injector
      .bind<types.CommitStorage>(BINDINGS.CommitStorage)
      .to(CommitMongoDBStorage)
      .inSingletonScope();
    this.log?.debug(
      new Log(
        `bound 'CommitStorage' to 'CommitMongoDBStorage' in singleton scope`
      )
        .on(this)
        .in(this.initializeCommitStorage)
    );
  }

  /**
   * Initializes CommitObserver.
   * @async
   */
  protected async initializeCommitObserver(): Promise<void> {
    if (!this.injector.isBound(BINDINGS.CommitObserver)) {
      this.injector
        .bind<types.CommitObserver>(BINDINGS.CommitObserver)
        .to(CommitMongoDBObserver)
        .inSingletonScope();
      this.log?.debug(
        new Log(
          `bound 'CommitObserver' to 'CommitMongoDBObserver' in singleton scope`
        )
          .on(this)
          .in(this.initializeCommitObserver)
      );
    }
  }
}
