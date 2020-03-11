import { MongoClient, Collection } from 'mongodb';
import { MongoDBClient } from '../../../src/infrastructure/clients/mongodb-client';
import {
  getUrl,
  getDatabaseName,
  getCollectionName,
  isSSL,
} from './mongo-env.util';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';

export const setupSchedulerMongo = async function(
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

  const target = 'scheduler';
  const url = getUrl(target);
  const databaseName = getDatabaseName(target);
  const collectionName = getCollectionName(target);
  const options = {
    ssl: isSSL(target),
    useNewUrlParser: true,
    useUnifiedTopology: false,
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
    .bind<Collection>(BINDINGS.MongoDB.collections.ScheduledCommands)
    .toConstantValue(collection);
  injector
    .bind<types.Client>(BINDINGS.MongoDB.clients.CommandScheduler)
    .toConstantValue(mongoClient);

  // Add properties to system under test for easy access
  clients.scheduler = mongoClient;
  collections.scheduler = collection;

  return { mongoClient, collection, databaseName, collectionName };
};
