import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import { MongoClient } from 'mongodb';

import getenv from 'getenv';
import {
  MongoDBClient,
  MongoDBCollectionConfig,
  MongoDBDatabaseConfig,
} from '../../../src/app/clients/mongodb-client';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';

describe(`MongoDB client`, () => {
  // Props
  const url = getenv.string('EVEBLE_COMMITSTORE_MONGODB_URL');
  const databaseName =
    getenv.string('EVEBLE_COMMITSTORE_MONGODB_DBNAME') || 'eveble_testing';
  // useNewUrlParser and useUnifiedTopology are deprecated in v4+ and removed in v6
  const options = {};
  // Injector
  let injector: Injector;
  let log: any;

  beforeEach(async () => {
    injector = new Injector();
    log = mock<types.Logger>();

    injector = new Injector();
    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<any>(BINDINGS.MongoDB.library).toConstantValue(MongoClient);
  });

  describe(`connection`, () => {
    it('returns false if client is not connected to MongoDB', async () => {
      const client = new MongoDBClient({
        id: 'my-id',
        url,
        options,
      });

      expect(client.isConnected()).toBe(false);
    });

    it(`connects client to MongoDB`, async () => {
      const client = new MongoDBClient({
        id: 'my-id',
        url,
        options,
      });
      await injector.injectIntoAsync(client);

      await client.initialize();
      await client.connect();
      expect(client.isConnected()).toBe(true);

      await client.disconnect();
    });

    it(`disconnects client from MongoDB`, async () => {
      const client = new MongoDBClient({
        id: 'my-id',
        url,
        options,
      });
      await injector.injectIntoAsync(client);

      await client.initialize();
      await client.connect();
      await client.disconnect();
      expect(client.isConnected()).toBe(false);
    });

    it(`reconnects client to MongoDB`, async () => {
      const client = new MongoDBClient({
        id: 'my-id',
        url,
        options,
      });
      await injector.injectIntoAsync(client);

      await client.initialize();
      await client.connect();
      await client.disconnect();
      expect(client.isConnected()).toBe(false);
      await client.reconnect();
      expect(client.isConnected()).toBe(true);

      await client.disconnect();
    });
  });

  describe(`collections`, () => {
    it(`initializes collections on connection`, async () => {
      const client = new MongoDBClient({
        id: 'my-id',
        url,
        databases: [
          new MongoDBDatabaseConfig({
            name: 'eveble_testing',
            collections: [
              new MongoDBCollectionConfig({
                name: 'first-collection',
              }),
              new MongoDBCollectionConfig({
                name: 'second-collection',
              }),
            ],
          }),
        ],
      });
      await injector.injectIntoAsync(client);

      await client.initialize();
      await client.connect();
      expect(client.getCollection(databaseName, 'first-collection')).to.not.be
        .undefined;
      expect(client.getCollection(databaseName, 'second-collection')).to.not.be
        .undefined;

      await client.disconnect();
    });

    it(`creates collection indexes on defined fields from configuration`, async () => {
      const customDatabaseName = 'eveble_testing';
      const customCollectionName = 'first-collection';
      const firstCollection = new MongoDBCollectionConfig({
        name: customCollectionName,
        indexes: [
          [
            {
              'my-field': 1,
            },
            {
              unique: true,
            },
          ],
        ],
      });
      const client = new MongoDBClient({
        id: 'my-id',
        url,
        databases: [
          new MongoDBDatabaseConfig({
            name: customDatabaseName,
            collections: [firstCollection],
          }),
        ],
      });
      await injector.injectIntoAsync(client);

      await client.initialize();
      await client.connect();
      const foundIndexes = await client
        .getCollection(customDatabaseName, customCollectionName)
        .listIndexes()
        .toArray();
      // First index is reserved for main key identifier "_id"
      expect(foundIndexes[1].key).toEqual({ 'my-field': 1 });
      expect(foundIndexes[1].unique).toBe(true);

      const db = client.getDatabase(customDatabaseName);
      await db.dropCollection(customCollectionName);
      await client.disconnect();
    });
  });
});

