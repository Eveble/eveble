import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { Collection, MongoClient as MongoClientOriginal, Db } from 'mongodb';
import { stubInterface } from 'ts-sinon';
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

chai.use(sinonChai);
chai.use(chaiAsPromised);

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
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupConfig = function (): void {
    config.get.withArgs('clients.MongoDB.CommandScheduler').returns({
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    config.get.withArgs('clients.Pulse.CommandScheduler').returns({
      processEvery: '1 seconds',
    });
  };

  const setupMongo = function (): void {
    MongoClient = sinon.stub();
    mongoClientInstance = stubInterface<MongoClientOriginal>();
    commandSchedulerCollection = stubInterface<Collection<any>>();
    db = stubInterface<Db>();

    MongoClient.returns(mongoClientInstance);
    mongoClientInstance.db.returns(db);
    db.collection.returns(commandSchedulerCollection);

    injector
      .bind<MongoClientOriginal>(BINDINGS.MongoDB.library)
      .toConstantValue(MongoClient);
  };

  const setupPulse = function (): void {
    Pulse = sinon.stub();
    pulseInstance = stubInterface<PulseOriginal>();

    Pulse.returns(pulseInstance);

    injector.bind<PulseOriginal>(BINDINGS.Pulse.library).toConstantValue(Pulse);
  };

  const setupApp = function (): void {
    app = stubInterface<types.App>();
    app.config = appConfig;
  };

  beforeEach(() => {
    setupInjector();
    setupMongo();
    setupPulse();
    setupConfig();
    setupApp();

    // Set up environment variables via sinon stubs
    sinon
      .stub(process.env, 'EVEBLE_COMMAND_SCHEDULER_MONGODB_URL')
      .value('mongodb://localhost:27017');
    sinon
      .stub(process.env, 'EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL')
      .value('false');
    sinon
      .stub(process.env, 'EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME')
      .value(getDatabaseName('scheduler'));
    sinon
      .stub(process.env, 'EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION')
      .value(getCollectionName('scheduler'));
    sinon.stub(process.env, 'EVEBLE_COMMAND_SCHEDULER_INTERVAL').value('1000');

    // Create module instance
    injector.injectInto(module);
  });

  afterEach(() => {
    sinon.restore();
  });

  it(`extends Module`, () => {
    expect(PulseCommandSchedulerModule.prototype).to.be.instanceof(Module);
  });

  describe('initialization', () => {
    it('initializes top level dependencies', async () => {
      const module = new PulseCommandSchedulerModule({ injector });
      await module.initializeTopLevelDependencies();

      const jobTransformer = injector.get<types.PulseJobTransformer>(
        BINDINGS.Pulse.jobTransformer
      );
      expect(jobTransformer).to.be.instanceof(PulseScheduledJobTransformer);
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
        expect(mongodbClient).to.be.instanceof(MongoDBClient);

        const url = getenv.string(`EVEBLE_COMMAND_SCHEDULER_MONGODB_URL`);
        const options = {
          ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
        };

        expect(MongoClient).to.be.calledWithNew;
        expect(MongoClient).to.be.calledWithExactly(url, {
          ...options,
        });
        expect(mongodbClient.url).to.be.equal(url);
        expect(mongodbClient.options).to.be.eql({
          ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
        });
      });

      it('initializes MongoDB client with custom options set on app configuration', async () => {
        const mongodbOptions = {
          noDelay: true,
          keepAlive: true,
        };
        const customApp = stubInterface<types.App>();
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

        expect(mongodbClient.options).to.be.eql({
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
        expect(log.debug).to.be.calledWithExactly(
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
        expect(log.debug).to.be.calledWithExactly(
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
        expect(collection).to.be.equal(commandSchedulerCollection);
        expect(mongoClientInstance.db).to.be.calledTwice;
        expect(mongoClientInstance.db).to.be.calledWithExactly(databaseName);
        expect(db.collection).to.be.calledOnce;
        expect(db.collection).to.be.calledWithExactly(collectionName);
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
      expect(agendaClient.isInState(PulseClient.STATES.initialized)).to.be.true;
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
      expect(agendaClient.isInState(PulseClient.STATES.connected)).to.be.true;
    });

    it('re-connects Pulse client', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.returns(true);
      await module.stop();
      mongoClientInstance.isConnected.returns(false);
      await module.start();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Pulse.clients.CommandScheduler
      );
      expect(agendaClient.isInState(PulseClient.STATES.connected)).to.be.true;
    });
  });

  describe('on stop', () => {
    it('stops Pulse client', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.returns(true);
      await module.stop();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Pulse.clients.CommandScheduler
      );
      expect(agendaClient.isInState(PulseClient.STATES.stopped)).to.be.true;
    });
  });

  describe('on shutdown', () => {
    it('disconnects Pulse client(that will handle disconnecting MongoDB)', async () => {
      const module = new PulseCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.returns(true);
      await module.shutdown();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Pulse.clients.CommandScheduler
      );
      expect(agendaClient.isInState(PulseClient.STATES.disconnected)).to.be
        .true;
    });
  });
});
