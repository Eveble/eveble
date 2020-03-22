import { MongoClient, Collection, MongoClientOptions } from 'mongodb';
import { MongoDBClient } from '../../../src/infrastructure/clients/mongodb-client';
import {
  getUrl,
  getDatabaseName,
  getCollectionName,
  isSSL,
} from './mongo-env.util';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';

export const setupCommitStoreMongo = async function(
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

  const target = 'commitStore';
  const url = getUrl(target);
  const databaseName = getDatabaseName(target);
  const collectionName = getCollectionName(target);
  const options: MongoClientOptions = {
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
    .bind<Collection>(BINDINGS.MongoDB.collections.Commits)
    .toConstantValue(collection);
  injector
    .bind<types.Client>(BINDINGS.MongoDB.clients.CommitStore)
    .toConstantValue(mongoClient);

  // Add properties to system under test for easy access
  clients.commitStore = mongoClient;
  collections.commitStore = collection;

  return { mongoClient, collection, databaseName, collectionName };
};
