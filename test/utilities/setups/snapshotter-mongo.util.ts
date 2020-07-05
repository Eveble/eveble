import { MongoClient, Collection } from 'mongodb';
import { MongoDBClient } from '../../../src/app/clients/mongodb-client';
import { BINDINGS } from '../../../src/constants/bindings';
import {
  getUrl,
  getDatabaseName,
  getCollectionName,
  isSSL,
} from './mongo-env.util';
import { types } from '../../../src/types';

export const setupSnapshotterMongo = async function (
  injector: types.Injector,
  clients: Record<string, types.Client>,
  collections: Record<string, Collection>
): Promise<{
  mongoClient: MongoDBClient;
  collection: Collection;
  databaseName: string;
  collectionName: string;
}> {
  // Map mongo client for all mongo requiring dependents
  if (!injector.isBound(BINDINGS.MongoDB.library)) {
    injector.bind<any>(BINDINGS.MongoDB.library).toConstantValue(MongoClient);
  }

  const target = 'snapshotter';
  const url = getUrl(target);
  const databaseName = getDatabaseName(target);
  const collectionName = getCollectionName(target);
  const options = {
    ssl: isSSL(target),
  };

  const mongoClient = new MongoDBClient({
    id: url,
    url,
    options,
  });
  await injector.injectIntoAsync(mongoClient);
  await mongoClient.initialize();
  await mongoClient.connect();
  const collection = mongoClient.getCollection(databaseName, collectionName);

  injector
    .bind<Collection>(BINDINGS.MongoDB.collections.Snapshots)
    .toConstantValue(collection);
  injector
    .bind<types.Client>(BINDINGS.MongoDB.clients.Snapshotter)
    .toConstantValue(mongoClient);

  // Add properties to system under test for easy access
  clients.snapshotter = mongoClient;
  collections.snapshotter = collection;

  return { mongoClient, collection, databaseName, collectionName };
};
