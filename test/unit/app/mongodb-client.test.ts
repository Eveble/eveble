import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { MongoClient as MongoClientOriginal, Collection, Db } from 'mongodb';
import { stubInterface } from 'ts-sinon';
import { Guid } from '../../../src/domain/value-objects/guid';
import {
  MongoDBClient,
  MongoDBCollectionConfig,
  MongoDBDatabaseConfig,
} from '../../../src/app/clients/mongodb-client';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Log } from '../../../src/components/log-entry';
import { InvalidStateError } from '../../../src/mixins/stateful-mixin';
import { Injector } from '../../../src/core/injector';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`MongoDBClient`, function() {
  let props: Record<string, any>;

  before(() => {
    // Properties
    props = {
      id: new Guid(),
      url: 'mongodb://localhost:27017/eveble',
      options: {
        autoReconnect: true,
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

  const setupDoubles = function(): void {
    injector = new Injector();
    log = stubInterface<types.Logger>();

    MongoClient = sinon.stub();
    mongoClientInstance = stubInterface<MongoClientOriginal>();
    firstCollection = stubInterface<Collection<any>>();
    secondCollection = stubInterface<Collection<any>>();
    db = stubInterface<Db>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector
      .bind<MongoClientOriginal>(BINDINGS.MongoDB.library)
      .toConstantValue(MongoClient);
  };

  const setupMongoClient = function(): void {
    mongoClientInstance.db.returns(db);
    db.collection.withArgs('first-collection').returns(firstCollection);
    db.collection.withArgs('second-collection').returns(secondCollection);

    MongoClient.returns(mongoClientInstance);

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
      expect(instance.id).to.be.equal(props.id);
      expect(instance.url).to.be.equal(props.url);
    });

    it(`allows to define id as a String`, () => {
      const id = 'my-client-id';
      const instance = new MongoDBClient({
        id,
        url: props.url,
      });
      expect(instance.id).to.be.equal(id);
      expect(instance.url).to.be.equal(props.url);
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
      expect(instance.id).to.be.equal(props.id);
      expect(instance.url).to.be.equal(props.url);
      expect(instance.databases[0].name).to.be.equal(databaseName);
      expect(instance.databases[0].collections[0]).to.be.equal(
        nonIndexedCollection
      );
      expect(instance.databases[0].collections[1]).to.be.equal(
        indexedCollection
      );
    });

    it(`takes object with optional: options as an object and assigns them`, () => {
      const instance = new MongoDBClient({
        id: props.id,
        url: props.url,
        options: props.options,
      });
      expect(instance.id).to.be.equal(props.id);
      expect(instance.url).to.be.equal(props.url);
      expect(instance.options).to.be.eql({
        ...MongoDBClient.defaultOptions,
        ...props.options,
      });
    });

    it(`assigns default options when creating client`, () => {
      const instance = new MongoDBClient({
        id: props.id,
        url: props.url,
      });
      expect(instance.id).to.be.equal(props.id);
      expect(instance.url).to.be.equal(props.url);
      expect(instance.options).to.be.eql({
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    });

    it(`sets the client state to constructed when client is constructed`, async () => {
      const instance = new MongoDBClient(props);
      expect(instance.isInState(MongoDBClient.STATES.constructed)).to.be.true;
    });
  });

  describe('initialize', () => {
    it('logs client initialization', async () => {
      await injector.injectIntoAsync(client);
      await client.initialize();

      expect(log.debug).to.be.calledWithExactly(
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
    context('successful initialization', () => {
      it(`initializes client`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(client.library).to.be.equal(mongoClientInstance);
        expect(MongoClient).to.be.calledWithNew;
        expect(MongoClient).to.be.calledWith(props.url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          ...props.options,
        });
        expect(mongoClientInstance.connect).to.not.be.called;
      });

      it(`sets the client state to initialized when client is initialized`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(client.isInState(MongoDBClient.STATES.initialized)).to.be.true;
      });

      it('logs successful client initialization', async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(log.debug).to.be.calledWithExactly(
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

    context('failed initialization', () => {
      it('re-throws error from MongoClient on creation', async () => {
        const error = new Error('my-error');
        MongoClient.throws(error);
        await injector.injectIntoAsync(client);

        await expect(client.initialize()).to.eventually.be.rejectedWith(error);
      });

      it('logs failed initialization as an error', async () => {
        const error = new Error('my-error');
        MongoClient.throws(error);

        await injector.injectIntoAsync(client);
        await expect(client.initialize()).to.eventually.be.rejectedWith(error);
        expect(log.error).to.be.calledWithExactly(
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
      expect(client.connect()).to.eventually.be.rejectedWith(
        InvalidStateError,
        `MongoDBClient: expected current state of 'constructed' to be in one of states: 'initialized, connected, stopped'`
      );
    });

    it('logs establishing connection', async () => {
      await injector.injectIntoAsync(client);
      await client.initialize();

      await client.connect();
      expect(log.debug).to.be.calledWithExactly(
        new Log(`connecting client '${props.id}'`).on(client).in(client.connect)
      );
    });

    context('successful connection', () => {
      it(`creates and connects client to MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();

        expect(mongoClientInstance.connect).to.be.calledOnce;
        expect(mongoClientInstance.connect).to.be.calledWithExactly();
      });

      it(`ensures that connection can be established only once`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        mongoClientInstance.isConnected.returns(true);
        await client.connect();

        expect(mongoClientInstance.connect).to.be.calledOnce;
        expect(client.isInState(MongoDBClient.STATES.connected)).to.be.true;
      });

      it(`sets the client state to connected when connection is established`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        expect(client.isInState(MongoDBClient.STATES.connected)).to.be.true;
      });

      it('logs successful connection', async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        expect(log.debug).to.be.calledWithExactly(
          new Log(`connected client '${props.id}'`)
            .on(client)
            .in(client.connect)
        );
      });
    });

    context('failed connection', () => {
      it('re-throws error from MongoClient', async () => {
        const error = new Error('my-error');
        mongoClientInstance.connect.rejects(error);

        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(client.connect()).to.eventually.be.rejectedWith(error);
      });

      it('sets the client state to failed when error is thrown on establishing connection', async () => {
        const error = new Error('my-error');
        mongoClientInstance.connect.rejects(error);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await expect(client.connect()).to.eventually.be.rejectedWith(error);
        expect(client.isInState(MongoDBClient.STATES.failed)).to.be.true;
      });

      it('logs failed connection as an error', async () => {
        const error = new Error('my-error');
        mongoClientInstance.connect.rejects(error);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await expect(client.connect()).to.eventually.be.rejectedWith(error);
        expect(log.error).to.be.calledWithExactly(
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
        mongoClientInstance.isConnected.returns(true);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        expect(client.isConnected()).to.be.equal(true);
      });

      it('returns false if client is not connected', async () => {
        expect(client.isConnected()).to.be.equal(false);
      });
    });

    describe('disconnecting', () => {
      it(`disconnects client from MongoDB`, async () => {
        mongoClientInstance.isConnected.returns(true);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        expect(mongoClientInstance.close).to.be.calledOnce;
      });

      it(`logs information about client being disconnected`, async () => {
        mongoClientInstance.isConnected.returns(true);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        expect(log.debug).to.be.calledWithExactly(
          new Log(`disconnecting client '${props.id}'`)
            .on(client)
            .in(client.disconnect)
        );
        expect(log.debug).to.be.calledWithExactly(
          new Log(`disconnected client '${props.id}'`)
            .on(client)
            .in(client.disconnect)
        );
      });

      it(`sets client state to disconnected upon disconnection`, async () => {
        mongoClientInstance.isConnected.returns(true);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        expect(client.isInState(MongoDBClient.STATES.disconnected)).to.be.true;
      });

      it(`destroys MongoClient library instance`, async () => {
        mongoClientInstance.isConnected.returns(true);

        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        expect(client.library).to.be.undefined;
      });
    });

    describe('reconnecting', () => {
      it(`reconnects client to MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        mongoClientInstance.isConnected.returns(true);
        await client.disconnect();
        mongoClientInstance.isConnected.returns(false);
        await client.reconnect();
        expect(mongoClientInstance.close).to.be.calledOnce;
        expect(mongoClientInstance.connect).to.be.calledTwice;
      });

      it(`logs information about client being reconnected`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        await client.connect();
        await client.disconnect();
        await client.reconnect();
        expect(log.debug).to.be.calledWithExactly(
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
        expect(client.isInState(MongoDBClient.STATES.connected)).to.be.true;
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
      ).to.be.equal(firstCollection);
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
      ).to.be.equal(firstCollection);
      expect(firstCollection.createIndex).to.be.calledOnce;
      expect(firstCollection.createIndex).to.be.calledWithMatch(
        {
          'my-field': 1,
        },
        {
          unique: true,
        }
      );
    });
  });
});
