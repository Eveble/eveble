import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { Collection, MongoClient as MongoClientOriginal, Db } from 'mongodb';

import getenv from 'getenv';
import PulseOriginal from '@pulsecron/pulse';
import { PulseCommandSchedulerModule } from '../../../src/app/modules/pulse-command-scheduler-module';
import { MongoDBClient } from '../../../src/app/clients/mongodb-client';
import { PulseScheduledJobTransformer } from '../../../src/infrastructure/transformers/pulse-scheduled-job-transformer';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import {
  getDatabaseName,
  getCollectionName,
} from '../../utilities/setups/mongo-env.util';
import { AppConfig } from '../../../src/configs/app-config';
import { Log } from '../../../src/components/log-entry';
import { Module } from '../../../src/core/module';
import { PulseClient } from '../../../src/app/clients/pulse-client';

describe(`PulseCommandSchedulerModule`, () => {
  // Props
  const appConfig = new AppConfig({
    appId: 'my-app-id',
  });
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // App
  let app: any;
  // Dependencies
  let MongoClient: any;
  let mongoClientInstance: any;
  let commandSchedulerCollection: any;
  // let pulseClient: any;
  let db: any;
  let Pulse: any;
  let pulseInstance: any;

  const setupInjector = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupConfig = function (): void {
    config.get.calledWith('clients.MongoDB.CommandScheduler').mockReturnValue({
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    config.get.calledWith('clients.Pulse.CommandScheduler').mockReturnValue({
      processEvery: '1 seconds',
    });
  };

  const setupPulse = function (): void {
    Pulse = vi.fn();
    pulseInstance = mock<PulseOriginal>();
    Pulse.mockImplementation(function() { return pulseInstance; });
    injector.bind<PulseOriginal>(BINDINGS.Pulse.library).toConstantValue(Pulse);
  };

  const setupMongo = function (): void {
    MongoClient = vi.fn();
    mongoClientInstance = mock<MongoClientOriginal>();
    commandSchedulerCollection = mock<Collection<any>>();
    db = mock<Db>();

    MongoClient.mockImplementation(function() { return mongoClientInstance; });
    mongoClientInstance.db.mockReturnValue(db);
    mongoClientInstance.isConnected.mockReturnValue(false);
    db.collection.mockReturnValue(commandSchedulerCollection);

    injector
      .bind<MongoClientOriginal>(BINDINGS.MongoDB.library)
      .toConstantValue(MongoClient);
  };

  const setupApp = function (): void {
    app = mock<types.App>();
    app.config = appConfig;
  };

  beforeEach(() => {
    setupInjector();
    setupMongo();
    setupPulse();
    setupConfig();
    setupApp();

    // Set up environment variables
    vi.stubEnv('EVEBLE_COMMAND_SCHEDULER_MONGODB_URL', 'mongodb://localhost:27017');
    vi.stubEnv('EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL', 'false');
    vi.stubEnv('EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME', getDatabaseName('scheduler'));
    vi.stubEnv('EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION', getCollectionName('scheduler'));
    vi.stubEnv('EVEBLE_COMMAND_SCHEDULER_INTERVAL', '1000');

    // Create module instance
    injector.injectInto(module);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it(`extends Module`, () => {
    expect(PulseCommandSchedulerModule.prototype).toBeInstanceOf(Module);
  });

  describe('initialization', () => {
    it('initializes top level dependencies', async () => {
      const module = new PulseCommandSchedulerModule({ injector });
      await module.initializeTopLevelDependencies();

      const jobTransformer = injector.get<types.PulseJobTransformer>(
        BINDINGS.Pulse.jobTransformer
      );
      expect(jobTransformer).toBeInstanceOf(PulseScheduledJobTransformer);
    });

    describe('MongoDB client initialization', () => {
      it('initializes MongoDB client and maps it on injector', async () => {
        const module = new PulseCommandSchedulerModule({
          injector,
        });
        await module.initialize(app, injector);

        const mongodbClient = injector.get<MongoDBClient>(
          BINDINGS.MongoDB.clients.CommandScheduler
        );
        expect(mongodbClient).toBeInstanceOf(MongoDBClient);

        const url = getenv.string(`EVEBLE_COMMAND_SCHEDULER_MONGODB_URL`);
        const options = {
          ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
        };

        expect(MongoClient).toHaveBeenCalledTimes(1);
        expect(MongoClient).toHaveBeenCalledWith(url, {
          ...options,
        });
        expect(mongodbClient.url).toBe(url);
        expect(mongodbClient.options).toEqual({
          ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
        });
      });

      it('initializes MongoDB client with custom options set on app configuration', async () => {
        const mongodbOptions = {
          noDelay: true,
          keepAlive: true,
        };
        const customApp = mock<types.App>();
        customApp.config = new AppConfig({
          appId: 'my-app-id',
          clients: {
            MongoDB: {
              CommandScheduler: mongodbOptions,
            },
          },
        });

        const module = new PulseCommandSchedulerModule({
          injector,
        });
        await module.initialize(customApp, injector);

        const mongodbClient = injector.get<MongoDBClient>(
          BINDINGS.MongoDB.clients.CommandScheduler
        );

        expect(mongodbClient.options).toEqual({
          noDelay: true,
          keepAlive: true,
          ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
        });
      });

      it('logs binding MongoDB client on injector', async () => {
        const module = new PulseCommandSchedulerModule({
          injector,
        });
        await module.initialize(app, injector);
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`bound 'MongoDB.clients.CommandScheduler' as constant value`)
            .on(module)
            .in('initializeMongoDBClientForCommandScheduler')
        );
      });

      it('logs binding CommandScheduler collection on injector', async () => {
        const module = new PulseCommandSchedulerModule({
          injector,
        });
        await module.initialize(app, injector);
        expect(log.debug).toHaveBeenCalledWith(
          new Log(
            `bound 'MongoDB.collections.CommandScheduler' as constant value`
          )
            .on(module)
            .in('initializeMongoDBClientForCommandScheduler')
        );
      });

      it('maps command scheduler collection on injector', async () => {
        const module = new PulseCommandSchedulerModule({
          injector,
        });
        await module.initialize(app, injector);

        const databaseName = getenv.string(
          'EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME'
        );
        const collectionName = getenv.string(
          'EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION'
        );
        const collection = injector.get<Collection<any>>(
          BINDINGS.MongoDB.collections.ScheduledCommands
        );
        expect(collection).toBe(commandSchedulerCollection);
        expect(mongoClientInstance.db).toHaveBeenCalledTimes(2);
        expect(mongoClientInstance.db).toHaveBeenCalledWith(databaseName);
        expect(db.collection).toHaveBeenCalledTimes(1);
        expect(db.collection).toHaveBeenCalledWith(collectionName);
      });
    });
  });

  describe('on initialization', () => {
    it('creates MongoDB client and connects it as prerequisite for collection and Pulse', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);

      const mongodbClient = injector.get<types.CommandScheduler>(
        BINDINGS.MongoDB.clients.CommandScheduler
      );
      expect(mongodbClient.isInState(MongoDBClient.STATES.connected)).to.be
        .true;
    });

    it('creates Pulse client and initializes it', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Pulse.clients.CommandScheduler
      );
      expect(agendaClient.isInState(PulseClient.STATES.initialized)).toBe(true);
    });
  });

  describe('on start', () => {
    it('connects Pulse client', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Pulse.clients.CommandScheduler
      );
      expect(agendaClient.isInState(PulseClient.STATES.connected)).toBe(true);
    });

    it('re-connects Pulse client', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.mockReturnValue(true);
      await module.stop();
      mongoClientInstance.isConnected.mockReturnValue(false);
      await module.start();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Pulse.clients.CommandScheduler
      );
      expect(agendaClient.isInState(PulseClient.STATES.connected)).toBe(true);
    });
  });

  describe('on stop', () => {
    it('stops Pulse client', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.mockReturnValue(true);
      await module.stop();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Pulse.clients.CommandScheduler
      );
      expect(agendaClient.isInState(PulseClient.STATES.stopped)).toBe(true);
    });
  });

  describe('on shutdown', () => {
    it('disconnects Pulse client(that will handle disconnecting MongoDB)', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.mockReturnValue(true);
      await module.shutdown();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Pulse.clients.CommandScheduler
      );
      expect(agendaClient.isInState(PulseClient.STATES.disconnected)).to.be
        .true;
    });
  });
});

