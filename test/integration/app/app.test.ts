import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import Agenda from 'agenda';
import { MongoClient, Collection, Db } from 'mongodb';
import { EvebleConfig } from '../../../src/configs/eveble-config';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { BaseApp } from '../../../src/core/base-app';
import { App } from '../../../src/app/app';
import { Eveble } from '../../../src/app/eveble';
import { Module } from '../../../src/core/module';
import { AppConfig } from '../../../src/configs/app-config';
import { LoggingConfig } from '../../../src/configs/logging-config';
import { Log } from '../../../src/components/log-entry';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { MongoDBCommitStorageModule } from '../../../src/app/modules/mongodb-commit-storage-module';
import { MongoDBSnapshotStorageModule } from '../../../src/app/modules/mongodb-snapshot-storage-module';
import { AgendaCommandSchedulerModule } from '../../../src/app/modules/agenda-command-scheduler-module';
import { define } from '../../../src/decorators/define';
import { Guid } from '../../../src/domain/value-objects/guid';
import { kernel } from '../../../src/core/kernel';

chai.use(sinonChai);

describe(`App`, function () {
  let injector: Injector;
  let log: any;
  let originalProcessOn: any;

  beforeEach(() => {
    injector = new Injector();
    log = stubInterface<types.Logger>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);

    originalProcessOn = process.on;
    (process as any).on = sinon.stub();
  });

  afterEach(() => {
    kernel.setAsserter(undefined as any);
    kernel.setSerializer(undefined as any);
    kernel.setInjector(undefined as any);
  });

  after(() => {
    process.on = originalProcessOn;
  });

  it(`extends BaseApp`, () => {
    expect(App.prototype).to.instanceof(BaseApp);
  });

  describe('construction', () => {
    it(`initializes modules array with Eveble module if list is missing on properties`, () => {
      const app = new App({});
      expect(app.modules[0]).to.be.instanceof(Eveble);
    });
    it(`does not modify modules array if Eveble module is present`, () => {
      class MyModule extends Module {}
      const userModule = new MyModule();
      const eveble = new Eveble();
      const modules = [userModule, eveble];
      const app = new App({ modules });
      expect(app.modules[0]).to.be.equal(userModule);
      expect(app.modules[1]).to.be.equal(eveble);
    });
    it(`initializes configuration as AppConfig if plain object is passed`, () => {
      const config = {
        appId: 'my-custom-app-id',
        logging: { isEnabled: false },
      };
      const app = new App({ config });
      expect(app.config).to.be.instanceof(AppConfig);
      expect(app.config.get('appId')).to.be.equal('my-custom-app-id');
      expect(app.config.get('logging')).to.be.instanceof(LoggingConfig);
      expect(app.config.get('logging.isEnabled')).to.be.equal(false);
    });
    describe(`configuration`, () => {
      describe(`CommitStore`, () => {
        it(`configures timeout as an integer and sets the default value`, () => {
          const app = new App({});
          expect(app.config.get('eveble.CommitStore.timeout')).to.be.equal(
            600000
          );
        });
      });
      describe(`Snapshotter`, () => {
        it(`configures isEnabled as a boolean and sets the default value`, () => {
          const app = new App({});
          expect(app.config.get('eveble.Snapshotter.isEnabled')).to.be.equal(
            true
          );
        });
        it(`configures frequency as a integer and sets the default value`, () => {
          const app = new App({});
          expect(app.config.get('eveble.Snapshotter.frequency')).to.be.equal(
            10
          );
        });
      });
      describe(`CommandScheduler`, () => {
        it(`configures isEnabled as a boolean and sets the default value`, () => {
          const app = new App({});
          expect(
            app.config.get('eveble.CommandScheduler.isEnabled')
          ).to.be.equal(true);
        });
      });
    });
  });

  describe('initialization', () => {
    describe('initializes graceful shutdown for process signals', () => {
      it('logs initializing graceful shutdown for process signals', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect(log.debug).to.be.calledWithMatch(
          new Log(`initializing graceful shutdown for process signals`)
            .on(app)
            .in('initializeGracefulShutdown')
        );
        await app.shutdown();
      });

      it('for signal code SIGINT', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect((process as any).on.getCall(0).args[0]).to.be.equal('SIGINT');
        expect((process as any).on.args[0][1].original).to.be.equal(
          app.onProcessSignal
        );
        expect(log.debug).to.be.calledWithMatch(
          new Log(`registers graceful shutdown for code: 'SIGINT'`)
            .on(app)
            .in('initializeGracefulShutdown')
        );
        await app.shutdown();
      });

      it('for signal code SIGTERM', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect((process as any).on.getCall(1).args[0]).to.be.equal('SIGTERM');
        expect((process as any).on.args[1][1].original).to.be.equal(
          app.onProcessSignal
        );
        expect(log.debug).to.be.calledWithMatch(
          new Log(`registers graceful shutdown for code: 'SIGTERM'`)
            .on(app)
            .in('initializeGracefulShutdown')
        );
        await app.shutdown();
      });

      it('for signal code SIGQUIT', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect((process as any).on.getCall(2).args[0]).to.be.equal('SIGQUIT');
        expect((process as any).on.args[2][1].original).to.be.equal(
          app.onProcessSignal
        );

        expect(log.debug).to.be.calledWithMatch(
          new Log(`registers graceful shutdown for code: 'SIGQUIT'`)
            .on(app)
            .in('initializeGracefulShutdown')
        );
        await app.shutdown();
      });

      it('ensures that application is gracefully shutdown on process signal', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        await app.onProcessSignal('SIGINT');
        expect(app.isInState(App.STATES.shutdown));
      });
    });

    describe('initializes external dependencies', () => {
      it('logs initialization of external dependencies', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect(log.debug).to.be.calledWithMatch(
          new Log(`initializing external dependencies`)
            .on(app)
            .in('initializeExternalDependencies')
        );
        await app.shutdown();
      });
      describe('Agenda', () => {
        it('binds Agenda library to injector', async () => {
          const app = new App({
            modules: [],
            injector,
          });
          await app.initialize();
          const agenda = await app.injector.get<any>(BINDINGS.Agenda.library);
          expect(agenda).to.be.equal(Agenda);
          expect(log.debug).to.be.calledWithMatch(
            new Log(`bound 'Agenda.library' as constant value`)
              .on(app)
              .in('initializeExternalDependencies')
          );
          await app.shutdown();
        });
        it('does not override existing Agenda library on injector', async () => {
          const AgendaStub = sinon.stub();
          const agendaInstance = stubInterface<Agenda>();
          AgendaStub.returns(agendaInstance);
          injector.bind(BINDINGS.Agenda.library).toConstantValue(AgendaStub);
          const app = new App({ injector, modules: [] });
          await app.initialize();
          const agenda = await app.injector.get<any>(BINDINGS.Agenda.library);
          expect(agenda).to.be.equal(AgendaStub);
          await app.shutdown();
        });
      });
      describe('MongoDB', () => {
        it('binds MongoDB library to injector', async () => {
          const app = new App({ modules: [], injector });
          await app.initialize();
          const mongodb = await app.injector.get<any>(BINDINGS.MongoDB.library);
          expect(mongodb).to.be.eql(MongoClient);
          expect(log.debug).to.be.calledWithMatch(
            new Log(`bound 'MongoDB.library' as constant value`)
              .on(app)
              .in('initializeExternalDependencies')
          );
          await app.shutdown();
        });
        it('does not override existing MongoDB library on injector', async () => {
          const MongoClientStub = sinon.stub();
          const mongoClientInstance = stubInterface<MongoClient>();
          const collection = stubInterface<Collection<any>>();
          const db = stubInterface<Db>();
          db.collection.returns(collection);
          mongoClientInstance.db.returns(db);
          MongoClientStub.returns(mongoClientInstance);
          injector
            .bind<any>(BINDINGS.MongoDB.library)
            .toConstantValue(MongoClientStub);
          const app = new App({
            injector,
            config: new AppConfig({
              appId: 'id',
              logging: new LoggingConfig({ isEnabled: true }),
              eveble: new EvebleConfig({
                CommandScheduler: {
                  isEnabled: false, // Disable CommandScheduler since that will require a real MongoDB client implementation
                },
              }),
            }),
          });
          await app.initialize();
          const mongodb = await injector.get<any>(BINDINGS.MongoDB.library);
          expect(mongodb).to.be.eql(MongoClientStub);
          await app.shutdown();
        });
      });
    });

    describe('initializes schedulers', () => {
      it('logs initialization of schedulers', async () => {
        const app = new App({
          modules: [],
          injector,
        });

        await app.initialize();
        expect(log.debug).to.be.calledWithMatch(
          new Log(`initializing schedulers`).on(app).in('initializeSchedulers')
        );
        await app.shutdown();
      });

      describe('AgendaCommandSchedulerModule', () => {
        it('does not include module if command scheduling is not enabled on configuration', async () => {
          const config = new AppConfig({
            appId: 'my-id',
            eveble: new EvebleConfig({
              CommandScheduler: { isEnabled: false },
            }),
          });
          const app = new App({ config, injector });

          await app.initialize();

          expect(app.modules).to.be.instanceof(Array);
          expect(app.modules).to.have.length(3);
          expect(app.modules[0]).to.be.instanceof(MongoDBCommitStorageModule);
          expect(app.modules[1]).to.be.instanceof(MongoDBSnapshotStorageModule);
          expect(app.modules[2]).to.be.instanceof(Eveble);

          await app.shutdown();
        });

        it('does not include module if CommandScheduler is bound prior to initialization on Injector', async () => {
          const commandScheduler = stubInterface<types.CommandScheduler>();

          const config = new AppConfig({
            appId: 'my-id',
          });
          const app = new App({ config });

          app.injector
            .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
            .toConstantValue(commandScheduler);
          app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);

          await app.initialize();
          expect(app.modules).to.be.instanceof(Array);
          expect(app.modules).to.have.length(3);
          expect(app.modules[0]).to.be.instanceof(MongoDBCommitStorageModule);
          expect(app.modules[1]).to.be.instanceof(MongoDBSnapshotStorageModule);
          expect(app.modules[2]).to.be.instanceof(Eveble);
          expect(
            await app.injector.get<types.CommandScheduler>(
              BINDINGS.CommandScheduler
            )
          ).to.be.equal(commandScheduler);

          await app.shutdown();
        });

        it('initializes module if its enabled on configuration', async () => {
          const config = new AppConfig({
            appId: 'my-id',
            eveble: new EvebleConfig({
              CommandScheduler: { isEnabled: true },
            }),
          });
          const app = new App({ config, injector });

          await app.initialize();
          expect(app.modules).to.be.instanceof(Array);
          expect(app.modules).to.have.length(4);
          expect(app.modules[0]).to.be.instanceof(MongoDBCommitStorageModule);
          expect(app.modules[1]).to.be.instanceof(MongoDBSnapshotStorageModule);
          expect(app.modules[2]).to.be.instanceof(AgendaCommandSchedulerModule);
          expect(app.modules[3]).to.be.instanceof(Eveble);
          expect(log.debug).to.be.calledWithMatch(
            new Log(
              new Log(
                `added 'CommandScheduler' as 'AgendaCommandSchedulerModule' to application modules`
              )
                .on(app)
                .in('initializeSchedulers')
            )
          );
          await app.shutdown();
        });
      });
    });

    describe('initializes storages', () => {
      it('logs initialization of storages', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect(log.debug).to.be.calledWithMatch(
          new Log(`initalizing storages`).on(app).in('initializeStorages')
        );
        await app.shutdown();
      });

      describe('MongoDBSnapshotStorageModule', () => {
        it('does not include module if snapshotting is not enabled on configuration', async () => {
          const config = new AppConfig({
            appId: 'my-id',
            eveble: new EvebleConfig({
              Snapshotter: { isEnabled: false, frequency: 5 },
            }),
          });
          const app = new App({ config });
          app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);

          await app.initialize();
          expect(app.modules).to.be.instanceof(Array);
          expect(app.modules).to.have.length(3);
          expect(app.modules[0]).to.be.instanceof(MongoDBCommitStorageModule);
          expect(app.modules[1]).to.be.instanceof(AgendaCommandSchedulerModule);
          expect(app.modules[2]).to.be.instanceof(Eveble);

          await app.shutdown();
        });

        it('does not include module if SnapshotStorage is bound prior to initialization on Injector', async () => {
          const snapshotStorageStub = stubInterface<types.SnapshotStorage>();

          const config = new AppConfig({
            appId: 'my-id',
          });
          const app = new App({ config });

          app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
          app.injector
            .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
            .toConstantValue(snapshotStorageStub);

          await app.initialize();
          expect(app.modules).to.be.instanceof(Array);
          expect(app.modules).to.have.length(3);
          expect(app.modules[0]).to.be.instanceof(MongoDBCommitStorageModule);
          expect(app.modules[1]).to.be.instanceof(AgendaCommandSchedulerModule);
          expect(app.modules[2]).to.be.instanceof(Eveble);
          expect(
            await app.injector.get<types.SnapshotStorage>(
              BINDINGS.SnapshotStorage
            )
          ).to.be.equal(snapshotStorageStub);

          await app.shutdown();
        });

        it('initializes module if its enabled on configuration', async () => {
          const config = new AppConfig({
            appId: 'my-id',
            eveble: new EvebleConfig({
              Snapshotter: { isEnabled: true, frequency: 5 },
            }),
          });
          const app = new App({ config, injector });

          await app.initialize();
          expect(app.modules).to.be.instanceof(Array);
          expect(app.modules).to.have.length(4);
          expect(app.modules[0]).to.be.instanceof(MongoDBCommitStorageModule);
          expect(app.modules[1]).to.be.instanceof(MongoDBSnapshotStorageModule);
          expect(app.modules[2]).to.be.instanceof(AgendaCommandSchedulerModule);
          expect(app.modules[3]).to.be.instanceof(Eveble);
          expect(log.debug).to.be.calledWithMatch(
            new Log(
              `added 'SnapshotStorage' as 'MongoDBSnapshotStorageModule' to application modules`
            )
              .on(app)
              .in('initializeStorages')
          );
          await app.shutdown();
        });
      });

      describe('MongoDBCommitStorageModule', () => {
        it('does not include module if CommitStore is bound prior to initialization on Injector', async () => {
          const commitStorageStub = stubInterface<types.CommitStorage>();
          const commitObserverStub = stubInterface<types.CommitObserver>();

          const config = new AppConfig({
            appId: 'my-id',
          });
          const app = new App({ config });

          app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
          app.injector
            .bind<types.CommitStorage>(BINDINGS.CommitStorage)
            .toConstantValue(commitStorageStub);
          app.injector
            .bind<types.CommitObserver>(BINDINGS.CommitObserver)
            .toConstantValue(commitObserverStub);

          await app.initialize();
          expect(app.modules).to.be.instanceof(Array);
          expect(app.modules).to.have.length(3);
          expect(app.modules[0]).to.be.instanceof(MongoDBSnapshotStorageModule);
          expect(app.modules[1]).to.be.instanceof(AgendaCommandSchedulerModule);
          expect(app.modules[2]).to.be.instanceof(Eveble);
          expect(
            await app.injector.get<types.CommitStorage>(BINDINGS.CommitStorage)
          ).to.be.equal(commitStorageStub);
          expect(
            await app.injector.get<types.CommitObserver>(
              BINDINGS.CommitObserver
            )
          ).to.be.equal(commitObserverStub);
          await app.shutdown();
        });

        it('initializes module if its not bound on Injector already', async () => {
          const config = new AppConfig({
            appId: 'my-id',
          });
          const app = new App({ config, injector });

          await app.initialize();
          expect(app.modules).to.be.instanceof(Array);
          expect(app.modules).to.have.length(4);
          expect(app.modules[0]).to.be.instanceof(MongoDBCommitStorageModule);
          expect(log.debug).to.be.calledWithMatch(
            new Log(
              `added 'CommitStorage' as 'MongoDBCommitStorageModule' to application modules`
            )
              .on(app)
              .in('initializeStorages')
          );
          await app.shutdown();
        });
      });
    });

    it('binds app instance on injector', async () => {
      const app = new App({
        modules: [],
        injector,
      });
      expect(injector.get<types.App>(BINDINGS.App)).to.be.equal(app);
    });
  });

  describe(`helpers`, () => {
    @define('App.MyCommand')
    class MyCommand extends Command {}
    @define('App.MyEvent')
    class MyEvent extends Event {}

    let app: App;
    let commandBus: any;
    let eventBus: any;

    beforeEach(() => {
      commandBus = stubInterface<types.CommandBus>();
      eventBus = stubInterface<types.EventBus>();

      app = new App();
      app.injector
        .bind<types.CommandBus>(BINDINGS.CommandBus)
        .toConstantValue(commandBus);
      app.injector
        .bind<types.EventBus>(BINDINGS.EventBus)
        .toConstantValue(eventBus);
    });

    it(`sends command through command bus`, async () => {
      const command = new MyCommand({
        targetId: new Guid(),
      });

      commandBus.send.resolves('result');

      const result = await app.send(command);
      expect(result).to.be.equal('result');
      expect(commandBus.send).to.be.calledOnce;
      expect(commandBus.send).to.be.calledWithExactly(command);
    });

    it(`publishes event through event bus`, async () => {
      const event = new MyEvent({
        sourceId: new Guid(),
      });

      await app.publish(event);
      expect(eventBus.publish).to.be.calledOnce;
      expect(eventBus.publish).to.be.calledWithExactly(event);
    });

    it(`subscribes to event with handler on event bus`, async () => {
      const handler = sinon.spy();

      await app.subscribeTo(MyEvent, handler);
      expect(eventBus.subscribeTo).to.be.calledOnce;
      expect(eventBus.subscribeTo).to.be.calledWithExactly(MyEvent, handler);
    });
  });
});
