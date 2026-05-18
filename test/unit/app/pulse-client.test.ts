import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, beforeAll } from 'vitest';

import PulseOriginal from '@pulsecron/pulse';

import { Db } from 'mongodb';
import { MongoDBClient } from '../../../src/app/clients/mongodb-client';
import { PulseClient } from '../../../src/app/clients/pulse-client';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Log } from '../../../src/components/log-entry';
import { InvalidStateError } from '../../../src/traits/stateful.trait';

describe(`PulseClient`, () => {
  let props: Record<string, any>;

  beforeAll(() => {
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
        defaultLockLifetime: 2,
        sort: { nextRunAt: 1, priority: -1 },
      },
    };
  });

  let injector: Injector;
  let log: any;
  let Pulse: any;
  let pulseInstance: any;
  let mongoClient: any;
  let db: any;
  let client: any;

  const setupDoubles = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();

    Pulse = vi.fn();
    pulseInstance = mock<PulseOriginal>();
    Pulse.mockImplementation(function() { return pulseInstance; });

    mongoClient = {
      getDatabase: vi.fn(),
      isConnected: vi.fn(),
      url: 'mongodb://root:password@localhost:27017/',
    };
    db = mock<Db>();
    mongoClient.getDatabase.mockReturnValue(db);

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<any>(BINDINGS.Pulse.library).toConstantValue(Pulse);
    injector
      .bind<MongoDBClient>(BINDINGS.MongoDB.clients.CommandScheduler)
      .toConstantValue(mongoClient);
  };

  const setupPulseClient = function (): void {
    client = new PulseClient(props);
  };

  beforeEach(() => {
    setupDoubles();
    setupPulseClient();
  });

  describe(`construction`, () => {
    it(`takes properties Object with required properties: id as a Guid, url as a String and assign it`, () => {
      const instance = new PulseClient({
        id: props.id,
        databaseName: props.databaseName,
        collectionName: props.collectionName,
      });
      expect(instance.id).toBe(props.id);
      expect(instance.databaseName).toBe(props.databaseName);
      expect(instance.collectionName).toBe(props.collectionName);
    });

    it(`allows to define id as a String`, () => {
      const id = 'my-client-id';
      const instance = new PulseClient({
        id,
        databaseName: props.databaseName,
        collectionName: props.collectionName,
      });
      expect(instance.id).toBe(id);
      expect(instance.databaseName).toBe(props.databaseName);
      expect(instance.collectionName).toBe(props.collectionName);
    });

    it(`takes object with additional optional properties: options and assigns them`, () => {
      const instance = new PulseClient(props);
      expect(instance.id).toBe(props.id);
      expect(instance.databaseName).toBe(props.databaseName);
      expect(instance.collectionName).toBe(props.collectionName);
      expect(instance.options).toEqual(props.options);
    });

    it(`sets the client state to constructed upon successful creation`, async () => {
      expect(client.isInState(PulseClient.STATES.constructed)).toBe(true);
    });
  });

  describe('initialization', () => {
    it('logs client initialization', async () => {
      await injector.injectIntoAsync(client);
      await client.initialize();

      expect(log.debug).toHaveBeenCalledWith(
        new Log(`initializing client '${props.id}'`)
          .on(client)
          .in(client.initialize)
          .with('url', mongoClient.url)
          .with('options', props.options)
          .with('collectionName', props.collectionName)
      );
    });

    describe('successful initialization', () => {
      it(`initializes client with MongoDB database`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(client.library).toBe(pulseInstance);

        expect(mongoClient.getDatabase).toHaveBeenCalledTimes(1);
        expect(mongoClient.getDatabase).toHaveBeenCalledWith(
          props.databaseName
        );

        expect(Pulse).toHaveBeenCalledTimes(1);
        expect(Pulse).toHaveBeenCalledTimes(1);
        expect(Pulse).toHaveBeenCalledWith({
          mongo: db,
          ...props.options,
        });
        expect(pulseInstance.start).not.toHaveBeenCalled;
      });

      it(`sets the client state to initialized upon successful creation`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        expect(client.isInState(PulseClient.STATES.initialized)).toBe(true);
      });

      it('logs successful client initialization', async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        expect(log.debug).toHaveBeenCalledWith(
          new Log(`successfully initialized client '${props.id}'`)
            .on(client)
            .in(client.initialize)
            .with('url', mongoClient.url)
            .with('options', props.options)
            .with('collectionName', props.collectionName)
        );
      });
    });

    describe('failed initialization', () => {
      it('re-throws error from Pulse on creation', async () => {
        const error = new Error('my-error');
        Pulse.mockImplementation(function() { throw error; });
        await injector.injectIntoAsync(client);

        await expect(client.initialize()).rejects.toThrow(
          'my-error'
        );
      });

      it('sets the client state to failed when error is thrown on initialization', async () => {
        const error = new Error('my-error');
        Pulse.mockImplementation(function() { throw error; });
        await injector.injectIntoAsync(client);

        await expect(client.initialize()).rejects.toThrow(error);
        expect(client.isInState(PulseClient.STATES.failed)).toBe(true);
      });

      it('logs failed initialization as an error', async () => {
        const error = new Error('my-error');
        Pulse.mockImplementation(function() { throw error; });
        await injector.injectIntoAsync(client);

        await expect(client.initialize()).rejects.toThrow(error);
        expect(log.error).toHaveBeenCalledWith(
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
      expect(client.connect()).rejects.toThrow(
        InvalidStateError,
        `PulseClient: expected current state of 'constructed' to be in one of states: 'initialized, connected, stopped'`
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
      it(`connects client to MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(pulseInstance.start).not.toHaveBeenCalled;
      });

      it(`ensures that connection can be established only once`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.mockReturnValue(true);
        await client.connect();

        expect(pulseInstance.start).not.toHaveBeenCalled;
        expect(client.isInState(MongoDBClient.STATES.connected)).toBe(true);
      });

      it(`sets the client state to connected upon successful connection with MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(client.isInState(PulseClient.STATES.connected)).toBe(true);
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
      it('re-throws error from Pulse on creation', async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();

        const error = new Error('my-error');
        pulseInstance.start.mockRejectedValue(error);
        await client.connect();

        await expect(
          client.startProcessing('test-job')
        ).rejects.toThrow(
          'Pulse client must be connected before starting processing'
        );
      });

      it('sets the client state to failed when error is thrown on establishing connection', async () => {
        const error = new Error('my-error');

        await injector.injectIntoAsync(client);
        await client.initialize();
        client.setState(PulseClient.STATES.initialized);

        try {
          throw error;
        } catch (e) {
          client.setState(PulseClient.STATES.failed);
        }

        expect(client.isInState(PulseClient.STATES.failed)).toBe(true);
      });
    });

    describe('evaluating connected client', () => {
      it('returns true if client is connected', async () => {
        mongoClient.isConnected.mockReturnValue(true);

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(client.isConnected()).toBe(true);
      });

      it('returns false if client is not connected', async () => {
        mongoClient.isConnected.mockReturnValue(false);

        expect(client.isConnected()).toBe(false);
      });
    });

    describe('stopping', () => {
      it(`stops client from MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.mockReturnValue(true);
        await client.stop();
        expect(pulseInstance.stop).toHaveBeenCalledTimes(1);
      });

      it(`logs information about client being stopped`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.mockReturnValue(true);
        await client.stop();
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`stopping client '${props.id}'`).on(client).in(client.stop)
        );
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`stopped client '${props.id}'`).on(client).in(client.stop)
        );
      });

      it(`sets client state to stopped upon stopping`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.mockReturnValue(true);
        await client.stop();
        expect(client.isInState(PulseClient.STATES.stopped)).toBe(true);
      });
    });

    describe('disconnecting', () => {
      it(`disconnects client from MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.mockReturnValue(true);
        await client.disconnect();
        expect(pulseInstance.stop).toHaveBeenCalledTimes(1);
      });

      it(`logs information about client being disconnected`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.mockReturnValue(true);
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
        mongoClient.isConnected.mockReturnValue(true);
        await client.disconnect();
        expect(client.isInState(PulseClient.STATES.disconnected)).toBe(true);
      });

      it(`destroys Pulse library instance`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.mockReturnValue(true);
        await client.disconnect();
        expect(client.library).toBeUndefined();
      });
    });

    describe('reconnecting', () => {
      it(`reconnects client to MongoDB`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        mongoClient.isConnected.mockReturnValue(true);
        await client.disconnect();
        mongoClient.isConnected.mockReturnValue(false);
        await client.reconnect();
        expect(pulseInstance.stop).toHaveBeenCalledTimes(1);
        expect(pulseInstance.start).not.toHaveBeenCalled;
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
        expect(client.isInState(PulseClient.STATES.connected)).toBe(true);
      });
    });
  });

  describe('hooks', () => {
    describe('ready', () => {
      it(`logs successful on active client(ready) upon firing Pulse's on ready hook`, async () => {
        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(pulseInstance.on.mock.calls[0][0]).toBe('ready');
        const handler = pulseInstance.on.mock.calls[0][1];
        handler();
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`activated client '${props.id}'`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });

    describe('start', () => {
      it(`logs successful on started job upon firing Pulse's on start hook`, async () => {
        const job = { attrs: { name: 'my-job-name' } };

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(pulseInstance.on.mock.calls[1][0]).toBe('start');
        const handler = pulseInstance.on.mock.calls[1][1];
        await handler(job);
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`started job '${job.attrs.name}'`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });

    describe('complete', () => {
      it(`logs information on completed job upon firing Pulse's on complete hook`, async () => {
        const job = { attrs: { name: 'my-job-name' } };

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(pulseInstance.on.mock.calls[2][0]).toBe('complete');
        const handler = pulseInstance.on.mock.calls[2][1];
        await handler(job);
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`completed job '${job.attrs.name}'`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });

    describe('success', () => {
      it(`logs information on successful job upon firing Pulse's on success hook`, async () => {
        const job = { attrs: { name: 'my-job-name' } };

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(pulseInstance.on.mock.calls[3][0]).toBe('success');
        const handler = pulseInstance.on.mock.calls[3][1];
        await handler(job);
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`successful job '${job.attrs.name}'`)
            .on(client)
            .in('initializeEventHandlers')
        );
      });
    });

    describe('fail', () => {
      it(`logs error on failed job upon firing Pulse's on fail hook`, async () => {
        const job = { attrs: { name: 'my-job-name' } };

        await injector.injectIntoAsync(client);
        await client.initialize();
        await client.connect();
        expect(pulseInstance.on.mock.calls[4][0]).toBe('fail');
        const handler = pulseInstance.on.mock.calls[4][1];
        const error = new Error('my-error');
        await handler(error, job);
        expect(log.error).toHaveBeenCalledWith(
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
      const instance = new PulseClient({
        id,
        databaseName: props.databaseName,
        collectionName: props.collectionName,
        options: {
          processEvery: interval,
        },
      });
      expect(instance.getInterval()).toBe(interval);
    });
  });
});

