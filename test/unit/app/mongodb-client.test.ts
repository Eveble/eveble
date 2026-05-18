import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, beforeAll } from 'vitest';

import { MongoClient as MongoClientOriginal, Collection, Db } from 'mongodb';

import { Guid } from '../../../src/domain/value-objects/guid';
import {
  MongoDBClient,
  MongoDBCollectionConfig,
  MongoDBDatabaseConfig,
} from '../../../src/app/clients/mongodb-client';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Log } from '../../../src/components/log-entry';
import { InvalidStateError } from '../../../src/traits/stateful.trait';
import { Injector } from '../../../src/core/injector';

describe(`MongoDBClient`, () => {
  let props: Record<string, any>;

  beforeAll(() => {
    // Properties - removed deprecated options for v6
    props = {
      id: new Guid(),
      url: 'mongodb://localhost:27017/eveble',
      options: {
        maxPoolSize: 10,
      },
    };
  });

  let injector: Injector;
  let log: any;
  let MongoClient: any;
  let mongoClientInstance: any;
  let firstCollection: any;
  let secondCollection: any;
  let db: any;
  let client: MongoDBClient;

  const setupDoubles = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();

    MongoClient = vi.fn();
    mongoClientInstance = mock<MongoClientOriginal>();
    firstCollection = mock<Collection<any>>();
    secondCollection = mock<Collection<any>>();
    db = mock<Db>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector
      .bind<MongoClientOriginal>(BINDINGS.MongoDB.library)
      .toConstantValue(MongoClient);
  };

  const setupMongoClient = function (): void {
    mongoClientInstance.db.mockReturnValue(db);
    db.collection.calledWith('first-collection').mockReturnValue(firstCollection);
    db.collection.calledWith('second-collection').mockReturnValue(secondCollection);

    MongoClient.mockImplementation(function() { return mongoClientInstance; });

    client = new MongoDBClient(props);
  };

  beforeEach(() => {
    setupDoubles();
    setupMongoClient();
  });

  describe(`construction`, () => {
    it(`takes properties object with required: id as a Guid, url as a String and assign it`, () => {
      const instance = new MongoDBClient({
        id: props.id,
        url: props.url,
      });
      expect(instance.id).toBe(props.id);
      expect(instance.url).toBe(props.url);
    });

    it(`allows to define id as a String`, () => {
      const id = 'my-client-id';
      const instance = new MongoDBClient({
        id,
        url: props.url,
      });
      expect(instance.id).toBe(id);
      expect(instance.url).toBe(props.url);
    });

    it(`takes properties object with optional: collections as an array with objects and assigns them`, async () => {
      const nonIndexedCollection = new MongoDBCollectionConfig({
        name: 'my-collection',
      });
      const indexedCollection = new MongoDBCollectionConfig({
        name: 'my-indexed-collection',
        indexes: [
          [
            {
              field: 1,
            },
            {
              unique: true,
            },
          ],
          [
            {
              'other-field': 1,
            },
          ],
        ],
      });
      const databaseName = 'my-database-name';
      const instance = new MongoDBClient({
        id: props.id,
        url: props.url,
        databases: [
          new MongoDBDatabaseConfig({
            name: databaseName,
            collections: [nonIndexedCollection, indexedCollection],
          }),
        ],
      });
      await injector.injectIntoAsync(instance);
      expect(instance.id).toBe(props.id);
      expect(instance.url).toBe(props.url);
      expect(instance.databases[0].name).toBe(databaseName);
      expect(instance.databases[0].collections[0]).toBe(
        nonIndexedCollection
      );
      expect(instance.databases[0].collections[1]).toBe(
        indexedCollection
      );
    });

    it(`takes object with optional: options as an object and assigns them`, () => {
      const instance = new MongoDBClient({
        id: props.id,
        url: props.url,
        options: props.options,
      });
      expect(instance.id).toBe(props.id);
      expect(instance.url).toBe(props.url);
      expect(instance.options).toEqual({
        ...MongoDBClient.defaultOptions,
        ...props.options,
      });
    });

    it(`assigns default options when creating client`, () => {
      const instance = new MongoDBClient({
        id: props.id,
        url: props.url,
      });
      expect(instance.id).toBe(props.id);
      expect(instance.url).toBe(props.url);
      // Default options are now empty in v6
      expect(instance.options).toEqual({});
    });

    it(`sets the client state to constructed when client is constructed`, async () => {
      const instance = new MongoDBClient(props);
      expect(instance.isInState(MongoDBClient.STATES.constructed)).toBe(true);
    });
  });

  describe('initialize', () => {
    it('logs client initialization', async () => {
      await injector.injectIntoAsync(client);
      await client.initialize();

      expect(log.debug).toHaveBeenCalledWith(
        new Log(`initializing client '${props.id}'`)
          .on(client)
          .in(client.initialize)
          .with('url', props.url)
          .with('options', {
            ...MongoDBClient.defaultOptions,
            ...props.options,
          })
      );
    });
    describe('successful initialization', () => {
      it(`initializes client`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(client.library).toBe(mongoClientInstance);
        expect(MongoClient).toHaveBeenCalledTimes(1);
        expect(MongoClient).toHaveBeenCalledWith(props.url, props.options);
        expect(mongoClientInstance.connect).not.toHaveBeenCalled;
      });

      it(`sets the client state to initialized when client is initialized`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(client.isInState(MongoDBClient.STATES.initialized)).toBe(true);
      });

      it('logs successful client initialization', async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(log.debug).toHaveBeenCalledWith(
          new Log(`successfully initialized client '${props.id}'`)
            .on(client)
            .in(client.initialize)
            .with('url', props.url)
            .with('options', {
              ...MongoDBClient.defaultOptions,
              ...props.options,
            })
        );
      });
    });

    describe('failed initialization', () => {
      it('re-throws error from MongoClient on creation', async () => {
        const error = new Error('my-error');
        MongoClient.mockImplementation(function() { throw error; });
        await injector.injectIntoAsync(client);

        await expect(client.initialize()).rejects.toThrow(error);
      });

      it('logs failed initialization as an error', async () => {
        const error = new Error('my-error');
        MongoClient.mockImplementation(function() { throw error; });

        await injector.injectIntoAsync(client);
        await expect(client.initialize()).rejects.toThrow(error);
        expect(log.error).toHaveBeenCalledWith(
          new Log(
            `failed to initialize client '${props.id}' do to error: ${error}`
          )
            .on(client)
            .in(client.initialize)
            .with('url', props.url)
            .with('options', {
              ...MongoDBClient.defaultOptions,
              ...props.options,
            })
        );
      });
    });
  });

  describe(`connection`, () => {
    it('throws InvalidStateError if client is not initialized prior to establishing connection', async () => {
      client = new MongoDBClient(props);
      expect(client.connect()).rejects.toThrow(
        InvalidStateError,
        `MongoDBClient: expected current state of 'constructed' to be in one of states: 'initialized, connected, stopped'`
      );
    });

    it('logs establishing connection', async () => {
      await injector.injectIntoAsync(client);
      await client.initialize();

      await client.connect();
      expect(log.debug).toHaveBeenCalledWith(
        new Log(`connecting client '${props.id}'`).on(client).in(client.connect)
      );
    });

    describe('successful connection', () => {
      it(`creates and connects client to MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();

        expect(mongoClientInstance.connect).toHaveBeenCalledTimes(1);
        expect(mongoClientInstance.connect).toHaveBeenCalledWith();
      });

      it(`ensures that connection can be established only once`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        // Note: isConnected() now uses state checking, not a method call
        await client.connect();

        expect(mongoClientInstance.connect).toHaveBeenCalledTimes(1);
        expect(client.isInState(MongoDBClient.STATES.connected)).toBe(true);
      });

      it(`sets the client state to connected when connection is established`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        expect(client.isInState(MongoDBClient.STATES.connected)).toBe(true);
      });

      it('logs successful connection', async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`connected client '${props.id}'`)
            .on(client)
            .in(client.connect)
        );
      });
    });

    describe('failed connection', () => {
      it('re-throws error from MongoClient', async () => {
        const error = new Error('my-error');
        mongoClientInstance.connect.mockRejectedValue(error);

        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(client.connect()).rejects.toThrow(error);
      });

      it('sets the client state to failed when error is thrown on establishing connection', async () => {
        const error = new Error('my-error');
        mongoClientInstance.connect.mockRejectedValue(error);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await expect(client.connect()).rejects.toThrow(error);
        expect(client.isInState(MongoDBClient.STATES.failed)).toBe(true);
      });

      it('logs failed connection as an error', async () => {
        const error = new Error('my-error');
        mongoClientInstance.connect.mockRejectedValue(error);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await expect(client.connect()).rejects.toThrow(error);
        expect(log.error).toHaveBeenCalledWith(
          new Log(
            `failed connection on client '${props.id}' do to error: ${error}`
          )
            .on(client)
            .in(client.connect)
        );
      });
    });

    describe('evaluating connected client', () => {
      it('returns true if client is connected', async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        expect(client.isConnected()).toBe(true);
      });

      it('returns false if client is not connected', async () => {
        expect(client.isConnected()).toBe(false);
      });
    });

    describe('disconnecting', () => {
      it(`disconnects client from MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        expect(mongoClientInstance.close).toHaveBeenCalledTimes(1);
      });

      it(`logs information about client being disconnected`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`disconnecting client '${props.id}'`)
            .on(client)
            .in(client.disconnect)
        );
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`disconnected client '${props.id}'`)
            .on(client)
            .in(client.disconnect)
        );
      });

      it(`sets client state to disconnected upon disconnection`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        expect(client.isInState(MongoDBClient.STATES.disconnected)).toBe(true);
      });

      it(`destroys MongoClient library instance`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        expect(client.library).toBeUndefined();
      });
    });

    describe('reconnecting', () => {
      it(`reconnects client to MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        await client.reconnect();
        expect(mongoClientInstance.close).toHaveBeenCalledTimes(1);
        expect(mongoClientInstance.connect).toHaveBeenCalledTimes(2);
      });

      it(`logs information about client being reconnected`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        await client.reconnect();
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`reconnecting client '${props.id}'`)
            .on(client)
            .in(client.reconnect)
        );
      });

      it(`sets client state to connected upon successful reconnection`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        await client.reconnect();
        expect(client.isInState(MongoDBClient.STATES.connected)).toBe(true);
      });
    });
  });

  describe(`collections`, () => {
    it(`returns collection by mapping`, async () => {
      const databaseName = 'my-database-name';
      const clientInstance = new MongoDBClient({
        id: props.id,
        url: props.url,
        databases: [
          new MongoDBDatabaseConfig({
            name: databaseName,
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
      await injector.injectIntoAsync(clientInstance);
      await clientInstance.initialize();

      await clientInstance.connect();
      expect(
        clientInstance.getCollection(databaseName, 'first-collection')
      ).toBe(firstCollection);
    });

    it(`creates collection indexes on defined fields from properties`, async () => {
      const databaseName = 'my-database-name';
      const firstCollConfig = new MongoDBCollectionConfig({
        name: 'first-collection',
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
      const clientInstance = new MongoDBClient({
        id: props.id,
        url: props.url,
        databases: [
          new MongoDBDatabaseConfig({
            name: databaseName,
            collections: [firstCollConfig],
          }),
        ],
      });
      await injector.injectIntoAsync(clientInstance);
      await clientInstance.initialize();

      await clientInstance.connect();
      expect(
        clientInstance.getCollection(databaseName, 'first-collection')
      ).toBe(firstCollection);
      expect(firstCollection.createIndex).toHaveBeenCalledTimes(1);
      expect(firstCollection.createIndex).toHaveBeenCalledWith(
        expect.objectContaining({
          'my-field': 1,
        }),
        {
          unique: true,
        }
      );
    });
  });
});

