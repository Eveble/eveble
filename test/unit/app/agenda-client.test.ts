import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import AgendaOriginal from 'agenda';
import { stubInterface } from 'ts-sinon';
import { Db } from 'mongodb';
import { MongoDBClient } from '../../../src/app/clients/mongodb-client';
import { AgendaClient } from '../../../src/app/clients/agenda-client';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Log } from '../../../src/components/log-entry';
import { InvalidStateError } from '../../../src/mixins/stateful-mixin';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`AgendaClient`, function() {
  let props: Record<string, any>;

  before(() => {
    // Properties
    props = {
      id: new Guid(),
      databaseName: 'my-database',
      collectionName: 'my-collection',
      options: {
        name: 'my-job-processor-name',
        processEvery: '1 minute',
        maxConcurrency: 2,
        defaultConcurrency: 2,
        lockLimit: 2,
        defaultLockLimit: 2,
        defaultLockLifetime: 2, // In milliseconds
        sort: { nextRunAt: 1, priority: -1 },
      },
    };
  });

  let injector: Injector;
  let log: any;
  let Agenda: any;
  let agendaInstance: any;
  let mongoClient: any;
  let db: any;
  let client: any;

  const setupDoubles = function(): void {
    injector = new Injector();
    log = stubInterface<types.Logger>();

    Agenda = sinon.stub();
    agendaInstance = stubInterface<AgendaOriginal>();
    Agenda.returns(agendaInstance);

    mongoClient = {
      getDatabase: sinon.stub(),
      isConnected: sinon.stub(),
      url: 'mongodb://root:password@localhost:27017/',
    };
    db = stubInterface<Db>();
    mongoClient.getDatabase.returns(db);

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<any>(BINDINGS.Agenda.library).toConstantValue(Agenda);
    injector
      .bind<MongoDBClient>(BINDINGS.MongoDB.clients.CommandScheduler)
      .toConstantValue(mongoClient);
  };

  const setupAgendaClient = function(): void {
    client = new AgendaClient(props);
  };

  beforeEach(() => {
    setupDoubles();
    setupAgendaClient();
  });
  describe(`construction`, () => {
    it(`takes properties Object with required properties: id as a Guid, url as a String and assign it`, () => {
      const instance = new AgendaClient({
        id: props.id,
        databaseName: props.databaseName,
        collectionName: props.collectionName,
      });
      expect(instance.id).to.be.equal(props.id);
      expect(instance.databaseName).to.be.equal(props.databaseName);
      expect(instance.collectionName).to.be.equal(props.collectionName);
    });

    it(`allows to define id as a String`, () => {
      const id = 'my-client-id';
      const instance = new AgendaClient({
        id,
        databaseName: props.databaseName,
        collectionName: props.collectionName,
      });
      expect(instance.id).to.be.equal(id);
      expect(instance.databaseName).to.be.equal(props.databaseName);
      expect(instance.collectionName).to.be.equal(props.collectionName);
    });

    it(`takes object with additional optional properties: options and assigns them`, () => {
      const instance = new AgendaClient(props);
      expect(instance.id).to.be.equal(props.id);
      expect(instance.databaseName).to.be.equal(props.databaseName);
      expect(instance.collectionName).to.be.equal(props.collectionName);
      expect(instance.options).to.be.eql(props.options);
    });

    it(`sets the client state to constructed upon successful creation`, async () => {
      expect(client.isInState(AgendaClient.STATES.constructed)).to.be.true;
    });
  });

  describe('initialization', () => {
    it('logs client initialization', async () => {
      await injector.injectIntoAsync(client);
      await client.initialize();

      expect(log.debug).to.be.calledWithExactly(
        new Log(`initializing client '${props.id}'`)
          .on(client)
          .in(client.initialize)
          .with('url', mongoClient.url)
          .with('options', props.options)
          .with('collectionName', props.collectionName)
      );
    });

    context('successful initialization', () => {
      it(`initializes client with MongoDB database`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(client.library).to.be.equal(agendaInstance);

        expect(mongoClient.getDatabase).to.be.calledOnce;
        expect(mongoClient.getDatabase).to.be.calledWithExactly(
          props.databaseName
        );

        expect(Agenda).to.be.calledOnce;
        expect(Agenda).to.be.calledWithNew;
        expect(Agenda).to.be.calledWith({
          mongo: db,
          collection: props.collectionName,
          ...props.options,
        });
        expect(agendaInstance.start).to.not.be.called;
      });

      it(`sets the client state to initialized upon successful creation`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        expect(client.isInState(AgendaClient.STATES.initialized)).to.be.true;
      });

      it('logs successful client initialization', async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(log.debug).to.be.calledWithExactly(
          new Log(`successfully initialized client '${props.id}'`)
            .on(client)
            .in(client.initialize)
            .with('url', mongoClient.url)
            .with('options', props.options)
            .with('collectionName', props.collectionName)
        );
      });
    });

    context('failed initialization', () => {
      it('re-throws error from Agenda on creation', async () => {
        const error = new Error('my-error');
        Agenda.throws(error);
        await injector.injectIntoAsync(client);

        await expect(client.initialize()).to.eventually.be.rejectedWith(error);
      });

      it('sets the client state to failed when error is thrown on initialization', async () => {
        const error = new Error('my-error');
        Agenda.throws(error);
        await injector.injectIntoAsync(client);

        await expect(client.initialize()).to.eventually.be.rejectedWith(error);
        expect(client.isInState(AgendaClient.STATES.failed)).to.be.true;
      });

      it('logs failed initialization as an error', async () => {
        const error = new Error('my-error');
        Agenda.throws(error);
        await injector.injectIntoAsync(client);

        await expect(client.initialize()).to.eventually.be.rejectedWith(error);
        expect(log.error).to.be.calledWithExactly(
          new Log(
            `failed to initialize client '${props.id}' do to error: ${error}`
          )
            .on(client)
            .in(client.initialize)
            .with('url', mongoClient.url)
            .with('options', props.options)
            .with('collectionName', props.collectionName)
        );
      });
    });
  });

  describe(`connection`, () => {
    it('throws InvalidStateError if client is not initialized prior to establishing connection', async () => {
      expect(client.connect()).to.eventually.be.rejectedWith(
        InvalidStateError,
        `AgendaClient: expected current state of 'constructed' to be in one of states: 'initialized, connected, stopped'`
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
      it(`connects client to MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(agendaInstance.start).to.be.calledOnce;
      });

      it(`ensures that connection can be established only once`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
        await client.connect();

        expect(agendaInstance.start).to.be.calledOnce;
        expect(client.isInState(MongoDBClient.STATES.connected)).to.be.true;
      });

      it(`sets the client state to connected upon successful connection with MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(client.isInState(AgendaClient.STATES.connected)).to.be.true;
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
      it('re-throws error from Agenda on creation', async () => {
        const error = new Error('my-error');
        agendaInstance.start.rejects(error);

        await injector.injectIntoAsync(client);
        await client.initialize();
        await expect(client.connect()).to.eventually.be.rejectedWith(error);
      });
      it('sets the client state to failed when error is thrown on establishing connection', async () => {
        const error = new Error('my-error');
        agendaInstance.start.rejects(error);

        await injector.injectIntoAsync(client);
        await client.initialize();
        await expect(client.connect()).to.eventually.be.rejectedWith(error);
        expect(client.isInState(AgendaClient.STATES.failed)).to.be.true;
      });

      it('logs failed connection as an error', async () => {
        const error = new Error('my-error');
        agendaInstance.start.rejects(error);

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
        mongoClient.isConnected.returns(true);

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(client.isConnected()).to.be.equal(true);
      });

      it('returns false if client is not connected', async () => {
        mongoClient.isConnected.returns(false);

        expect(client.isConnected()).to.be.equal(false);
      });
    });

    describe('stopping', () => {
      it(`stops client from MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
        await client.stop();
        expect(agendaInstance.stop).to.be.calledOnce;
      });

      it(`logs information about client being stopped`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
        await client.stop();
        expect(log.debug).to.be.calledWithExactly(
          new Log(`stopping client '${props.id}'`).on(client).in(client.stop)
        );
        expect(log.debug).to.be.calledWithExactly(
          new Log(`stopped client '${props.id}'`).on(client).in(client.stop)
        );
      });

      it(`sets client state to stopped upon stopping`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
        await client.stop();
        expect(client.isInState(AgendaClient.STATES.stopped)).to.be.true;
      });
    });

    describe('disconnecting', () => {
      it(`disconnects client from MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
        await client.disconnect();
        expect(agendaInstance.stop).to.be.calledOnce;
      });

      it(`logs information about client being disconnected`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
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
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
        await client.disconnect();
        expect(client.isInState(AgendaClient.STATES.disconnected)).to.be.true;
      });

      it(`destroys Agenda library instance`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
        await client.disconnect();
        expect(client.library).to.be.undefined;
      });
    });

    describe('reconnecting', () => {
      it(`reconnects client to MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.returns(true);
        await client.disconnect();
        mongoClient.isConnected.returns(false);
        await client.reconnect();
        expect(agendaInstance.stop).to.be.calledOnce;
        expect(agendaInstance.start).to.be.calledTwice;
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
        expect(client.isInState(AgendaClient.STATES.connected)).to.be.true;
      });
    });
  });

  describe('hooks', () => {
    describe('ready', () => {
      it(`logs successful on active client(ready) upon firing Agenda's on ready hook`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(agendaInstance.on.args[0][0]).to.equal('ready');
        const handler = agendaInstance.on.args[0][1];
        handler();
        expect(log.debug).to.be.calledWithExactly(
          new Log(`activated client '${props.id}'`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });
    describe('start', () => {
      it(`logs successful on started job upon firing Agenda's on start hook`, async () => {
        const job = { attrs: { name: 'my-job-name' } };

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(agendaInstance.on.args[1][0]).to.equal('start');
        const handler = agendaInstance.on.args[1][1];
        await handler(job);
        expect(log.debug).to.be.calledWithExactly(
          new Log(`started job '${job.attrs.name}'`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });
    describe('complete', () => {
      it(`logs information on completed job upon firing Agenda's on complete hook`, async () => {
        const job = { attrs: { name: 'my-job-name' } };

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(agendaInstance.on.args[2][0]).to.equal('complete');
        const handler = agendaInstance.on.args[2][1];
        await handler(job);
        expect(log.debug).to.be.calledWithExactly(
          new Log(`completed job '${job.attrs.name}'`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });
    describe('success', () => {
      it(`logs information on successful job upon firing Agenda's on success hook`, async () => {
        const job = { attrs: { name: 'my-job-name' } };

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(agendaInstance.on.args[3][0]).to.equal('success');
        const handler = agendaInstance.on.args[3][1];
        await handler(job);
        expect(log.debug).to.be.calledWithExactly(
          new Log(`successful job '${job.attrs.name}'`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });
    describe('fail', () => {
      it(`logs error on failed job upon firing Agenda's on fail hook`, async () => {
        const job = { attrs: { name: 'my-job-name' } };

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(agendaInstance.on.args[4][0]).to.equal('fail');
        const handler = agendaInstance.on.args[4][1];
        const error = new Error('my-error');
        await handler(error, job);
        expect(log.error).to.be.calledWith(
          new Log(`failed job '${job.attrs.name}' do to error: ${error}`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });
  });

  describe('getters', () => {
    it('returns processing interval', () => {
      const interval = 1000;
      const id = 'my-client-id';
      const instance = new AgendaClient({
        id,
        databaseName: props.databaseName,
        collectionName: props.collectionName,
        options: {
          processEvery: interval,
        },
      });
      expect(instance.getInterval()).to.be.equal(interval);
    });
  });
});
