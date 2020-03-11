import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import getenv from 'getenv';
import { stubInterface } from 'ts-sinon';
import AgendaOriginal from 'agenda';
import { MongoClient as MongoClientOriginal, Collection, Db } from 'mongodb';
import { AgendaScheduledJobTransformer } from '../../../src/infrastructure/transformers/agenda-scheduled-job-transformer';
import { AppConfig } from '../../../src/configs/app-config';
import { MongoDBClient } from '../../../src/infrastructure/clients/mongodb-client';
import { AgendaClient } from '../../../src/infrastructure/clients/agenda-client';

import { types } from '../../../src/types';
import { Container } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { AgendaCommandSchedulerModule } from '../../../src/app/modules/agenda-command-scheduler-module';
import { Module } from '../../../src/core/module';
import { Log } from '../../../src/components/log-entry';

chai.use(sinonChai);

describe(`AgendaCommandSchedulerModule`, function() {
  // Props
  const appConfig = new AppConfig({
    appId: 'my-app-id',
  });
  // Injector
  let injector: Container;
  let log: any;
  let config: any;
  let serializer: any;
  // App
  let app: any;
  // Dependencies
  let MongoClient: any;
  let mongoClientInstance: any;
  let commandSchedulerCollection: any;
  let db: any;
  let Agenda: any;
  let agendaInstance: any;
  let commandBus: any;

  const setupInjector = function(): void {
    injector = new Container();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();
    serializer = stubInterface<types.Configurable>();
    commandBus = stubInterface<types.CommandBus>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .toConstantValue(serializer);
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
  };

  const setupMongo = function(): void {
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

  const setupAgenda = function(): void {
    Agenda = sinon.stub();
    agendaInstance = stubInterface<AgendaOriginal>();

    Agenda.returns(agendaInstance);

    injector
      .bind<AgendaOriginal>(BINDINGS.Agenda.library)
      .toConstantValue(Agenda);
  };

  const setupApp = function(): void {
    app = stubInterface<types.App>();
    app.config = appConfig;
  };

  beforeEach(() => {
    setupInjector();
    setupMongo();
    setupAgenda();
    setupApp();
  });

  it(`extends Module`, () => {
    expect(AgendaCommandSchedulerModule.prototype).to.be.instanceof(Module);
  });

  describe('before initialization', () => {
    describe('MongoDB client initialization', () => {
      it('initializes MongoDB client and maps it on injector', async () => {
        const module = new AgendaCommandSchedulerModule({
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
          useNewUrlParser: true,
          useUnifiedTopology: false,
        });
        expect(mongodbClient.url).to.be.equal(url);
        expect(mongodbClient.options).to.be.eql({
          ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
          useNewUrlParser: true,
          useUnifiedTopology: false,
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

        const module = new AgendaCommandSchedulerModule({
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
          useNewUrlParser: true,
          useUnifiedTopology: false,
        });
      });

      it('logs binding MongoDB client on injector', async () => {
        const module = new AgendaCommandSchedulerModule({
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
        const module = new AgendaCommandSchedulerModule({
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
        const module = new AgendaCommandSchedulerModule({
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

    describe('Agenda client initialization', () => {
      it('initializes Agenda client and maps it on injector', async () => {
        const module = new AgendaCommandSchedulerModule({
          injector,
        });
        await module.initialize(app, injector);

        const agendaClient = injector.get<AgendaClient>(
          BINDINGS.Agenda.clients.CommandScheduler
        );
        expect(agendaClient).to.be.instanceof(AgendaClient);

        const databaseName = getenv.string(
          'EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME'
        );
        const collectionName = getenv.string(
          'EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION'
        );
        const interval = getenv.int('EVEBLE_COMMAND_SCHEDULER_INTERVAL');

        expect(Agenda).to.be.calledWithNew;
        expect(Agenda).to.be.calledWithExactly({
          mongo: db,
          collection: collectionName,
          processEvery: interval,
        });
        expect(agendaClient.databaseName).to.be.equal(databaseName);
        expect(agendaClient.collectionName).to.be.eql(collectionName);
      });

      it('initializes Agenda client with custom options set on app configuration with processEvery from env variable', async () => {
        const interval = getenv.int('EVEBLE_COMMAND_SCHEDULER_INTERVAL');

        const agendaOptions = {
          name: 'my-name',
          maxConcurrency: 5,
        };
        const customApp = stubInterface<types.App>();
        customApp.config = new AppConfig({
          appId: 'my-app-id',
          clients: {
            Agenda: {
              CommandScheduler: agendaOptions,
            },
          },
        });

        const module = new AgendaCommandSchedulerModule({
          injector,
        });
        await module.initialize(customApp, injector);

        const agendaClient = injector.get<AgendaClient>(
          BINDINGS.Agenda.clients.CommandScheduler
        );

        expect(agendaClient.options).to.be.eql({
          name: 'my-name',
          maxConcurrency: 5,
          processEvery: interval,
        });
      });

      it('logs binding Agenda client on injector', async () => {
        const module = new AgendaCommandSchedulerModule({
          injector,
        });
        await module.initialize(app, injector);
        expect(log.debug).to.be.calledWithExactly(
          new Log(`bound 'Agenda.clients.CommandScheduler' as constant value`)
            .on(module)
            .in('initializeAgendaClientForCommandScheduler')
        );
      });
    });

    it('maps Agenda.ScheduledJobTransformer to singleton on injector', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);

      expect(injector.isBound(BINDINGS.Agenda.jobTransformer)).to.be.true;
      const transformer = injector.get(BINDINGS.Agenda.jobTransformer);
      expect(transformer).to.be.instanceof(AgendaScheduledJobTransformer);
    });

    it('logs binding Agenda.ScheduledJobTransformer on injector', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).to.be.calledWithMatch(
        new Log(`bound 'Agenda.ScheduledJobTransformer' in singleton scope`)
          .on(module)
          .in('initializeTopLevelDependencies')
      );
    });

    it('logs binding CommandScheduler on injector', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      expect(log.debug).to.be.calledWithMatch(
        new Log(
          `bound 'CommandScheduler' to 'AgendaCommandScheduler' in singleton scope`
        )
          .on(module)
          .in('initializeCommandScheduler')
      );
    });
  });

  describe('on initialization', () => {
    it('creates MongoDB client and connects it as prerequisite for collection and Agenda', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);

      const mongodbClient = injector.get<types.CommandScheduler>(
        BINDINGS.MongoDB.clients.CommandScheduler
      );
      expect(mongodbClient.isInState(MongoDBClient.STATES.connected)).to.be
        .true;
    });

    it('creates Agenda client and initializes it', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Agenda.clients.CommandScheduler
      );
      expect(agendaClient.isInState(AgendaClient.STATES.initialized)).to.be
        .true;
    });
  });

  describe('on start', () => {
    it('connects Agenda client', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Agenda.clients.CommandScheduler
      );
      expect(agendaClient.isInState(AgendaClient.STATES.connected)).to.be.true;
    });

    it('re-connects Agenda client', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.returns(true);
      await module.stop();
      mongoClientInstance.isConnected.returns(false);
      await module.start();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Agenda.clients.CommandScheduler
      );
      expect(agendaClient.isInState(AgendaClient.STATES.connected)).to.be.true;
    });
  });

  describe('on stop', () => {
    it('stops Agenda client', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.returns(true);
      await module.stop();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Agenda.clients.CommandScheduler
      );
      expect(agendaClient.isInState(AgendaClient.STATES.stopped)).to.be.true;
    });
  });

  describe('on shutdown', () => {
    it('disconnects Agenda client(that will handle disconnecting MongoDB)', async () => {
      const module = new AgendaCommandSchedulerModule({
        injector,
      });
      await module.initialize(app, injector);
      await module.start();
      mongoClientInstance.isConnected.returns(true);
      await module.shutdown();

      const agendaClient = injector.get<types.CommandScheduler>(
        BINDINGS.Agenda.clients.CommandScheduler
      );
      expect(agendaClient.isInState(AgendaClient.STATES.disconnected)).to.be
        .true;
    });
  });
});
