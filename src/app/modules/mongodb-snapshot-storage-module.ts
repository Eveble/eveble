import getenv from 'getenv';
import { Collection } from 'mongodb';
import { MongoDBClient } from '../clients/mongodb-client';
import { SnapshotMongoDBStorage } from '../../infrastructure/storages/snapshot-mongodb-storage';
import { Module } from '../../core/module';
import { types } from '../../types';
import { Log } from '../../components/log-entry';
import { BINDINGS } from '../../constants/bindings';
import { SnapshotSerializer } from '../../infrastructure/serializers/snapshot-serializer';

export class MongoDBSnapshotStorageModule extends Module {
  mongoClient?: MongoDBClient;

  /**
   * On initialize hook.
   * @async
   */
  protected async onInitialize(): Promise<void> {
    await this.initializeSnapshotSerializer();
    await this.initializeClientForSnapshotter();
    await this.initializeSnapshotter();
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
   * Initializes client for Snapshotter.
   * @async
   */
  protected async initializeClientForSnapshotter(): Promise<void> {
    const url = getenv.string(`EVEBLE_SNAPSHOTTER_MONGODB_URL`);
    const options = {
      ...this.config.get('clients.MongoDB.Snapshotter'),
      ssl: getenv.bool(`EVEBLE_SNAPSHOTTER_MONGODB_SSL`),
    };
    const databaseName = getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_DBNAME');
    const collectionName = getenv.string(
      'EVEBLE_SNAPSHOTTER_MONGODB_COLLECTION'
    );

    const client = new MongoDBClient({
      id: 'MongoDB.clients.Snapshotter',
      url,
      options,
    });
    this.injector.injectInto(client);
    this.injector
      .bind<MongoDBClient>(BINDINGS.MongoDB.clients.Snapshotter)
      .toConstantValue(client);
    this.log?.debug(
      new Log(`bound 'MongoDB.clients.Snapshotter' as constant value`)
        .on(this)
        .in(this.initializeClientForSnapshotter)
    );

    this.mongoClient = this.injector.get<MongoDBClient>(
      BINDINGS.MongoDB.clients.Snapshotter
    );
    await this.mongoClient.initialize();
    await this.mongoClient.connect();

    const collection = this.mongoClient.getCollection(
      databaseName,
      collectionName
    );
    this.injector
      .bind<Collection<any>>(BINDINGS.MongoDB.collections.Snapshots)
      .toConstantValue(collection);
    this.log?.debug(
      new Log(`bound 'MongoDB.collections.Snapshots' as constant value`)
        .on(this)
        .in(this.initializeClientForSnapshotter)
    );
  }

  /**
   * Initializes SnapshotSerializer.
   * @async
   */
  protected async initializeSnapshotSerializer(): Promise<void> {
    this.injector
      .bind<types.SnapshotSerializer>(BINDINGS.SnapshotSerializer)
      .to(SnapshotSerializer)
      .inSingletonScope();
    this.log?.debug(
      new Log(
        `bound 'SnapshotSerializer' to 'SnapshotSerializer' in singleton scope`
      )
        .on(this)
        .in(this.initializeSnapshotSerializer)
    );
  }

  /**
   * Initializes Snapshotter.
   * @async
   */
  protected async initializeSnapshotter(): Promise<void> {
    this.injector
      .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
      .to(SnapshotMongoDBStorage)
      .inSingletonScope();
    this.log?.debug(
      new Log(
        `bound 'SnapshotStorage' to 'SnapshotMongoDBStorage' in singleton scope`
      )
        .on(this)
        .in(this.initializeSnapshotter)
    );
  }
}
