import { MongoClient, Collection } from 'mongodb';
import { MongoDBClient } from '../../../src/app/clients/mongodb-client';
import {
  getUrl,
  getDatabaseName,
  getCollectionName,
  isSSL,
} from './mongo-env.util';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';

// Cache to ensure the same database name is used throughout a test suite
const dbNameCache = new Map<string, string>();

export const setupSchedulerMongo = async function (
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

  // CRITICAL: Cache database name to ensure consistency
  // Use cached name if it exists, otherwise generate and cache
  let databaseName: string;
  if (dbNameCache.has(target)) {
    databaseName = dbNameCache.get(target)!;
  } else {
    databaseName = getDatabaseName(target);
    dbNameCache.set(target, databaseName);
  }

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

/**
 * Clears the database name cache.
 * Call this in afterAll() to ensure clean state for next test file.
 */
export const clearSchedulerDatabaseCache = function (): void {
  dbNameCache.clear();
};

/**
 * Gets the cached database name for a target without regenerating it.
 * Useful when you need to verify the database name being used.
 */
export const getCachedDatabaseName = function (
  target: string
): string | undefined {
  return dbNameCache.get(target);
};
