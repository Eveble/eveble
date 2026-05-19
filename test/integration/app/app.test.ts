import { mock, mockFn } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  afterAll,
} from 'vitest';

import Pulse from '@pulsecron/pulse';
import { MongoClient, Collection, Db } from 'mongodb';
import { kernel, Type } from '@eveble/core';
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
import { PulseCommandSchedulerModule } from '../../../src/app/modules/pulse-command-scheduler-module';
import { Guid } from '../../../src/domain/value-objects/guid';

describe(`App`, () => {
  let injector: Injector;
  let log: any;
  let originalProcessOn: any;

  beforeEach(() => {
    injector = new Injector();
    log = mock<types.Logger>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);

    originalProcessOn = process.on;
    (process as any).on = mockFn();
  });

  afterEach(() => {
    kernel.setAsserter(undefined as any);
    kernel.setSerializer(undefined as any);
    kernel.setInjector(undefined as any);
  });

  afterAll(() => {
    process.on = originalProcessOn;
  });

  it(`extends BaseApp`, () => {
    expect(App.prototype).to.instanceof(BaseApp);
  });

  describe('construction', () => {
    it(`initializes modules array with Eveble module if list is missing on properties`, () => {
      const app = new App({});
      expect(app.modules[0]).toBeInstanceOf(Eveble);
    });
    it(`does not modify modules array if Eveble module is present`, () => {
      class MyModule extends Module {}
      const userModule = new MyModule();
      const eveble = new Eveble();
      const modules = [userModule, eveble];
      const app = new App({ modules });
      expect(app.modules[0]).toBe(userModule);
      expect(app.modules[1]).toBe(eveble);
    });
    it(`initializes configuration as AppConfig if plain object is passed`, () => {
      const config = {
        appId: 'my-custom-app-id',
        logging: new LoggingConfig({ isEnabled: false }),
      };
      const app = new App({ config });
      expect(app.config).toBeInstanceOf(AppConfig);
      expect(app.config.get('appId')).toBe('my-custom-app-id');
      expect(app.config.get('logging')).toBeInstanceOf(LoggingConfig);
      expect(app.config.get('logging.isEnabled')).toBe(false);
    });
    describe(`configuration`, () => {
      describe(`CommitStore`, () => {
        it(`configures timeout as an integer and sets the default value`, () => {
          const app = new App({});
          expect(app.config.get('eveble.CommitStore.timeout')).toBe(600000);
        });
      });
      describe(`Snapshotter`, () => {
        it(`configures isEnabled as a boolean and sets the default value`, () => {
          const app = new App({});
          expect(app.config.get('eveble.Snapshotter.isEnabled')).toBe(true);
        });
        it(`configures frequency as a integer and sets the default value`, () => {
          const app = new App({});
          expect(app.config.get('eveble.Snapshotter.frequency')).toBe(10);
        });
      });
      describe(`CommandScheduler`, () => {
        it(`configures isEnabled as a boolean and sets the default value`, () => {
          const app = new App({});
          expect(app.config.get('eveble.CommandScheduler.isEnabled')).toBe(
            true
          );
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
        expect(log.debug).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`initializing graceful shutdown for process signals`)
              .on(app)
              .in('initializeGracefulShutdown')
          )
        );
        await app.shutdown();
      });

      it('for signal code SIGINT', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect((process as any).on.mock.calls[0][0]).toBe('SIGINT');
        expect((process as any).on.mock.calls[0][1].original).toBe(
          app.onProcessSignal
        );
        expect(log.debug).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`registers graceful shutdown for code: 'SIGINT'`)
              .on(app)
              .in('initializeGracefulShutdown')
          )
        );
        await app.shutdown();
      });

      it('for signal code SIGTERM', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect((process as any).on.mock.calls[1][0]).toBe('SIGTERM');
        expect((process as any).on.mock.calls[1][1].original).toBe(
          app.onProcessSignal
        );
        expect(log.debug).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`registers graceful shutdown for code: 'SIGTERM'`)
              .on(app)
              .in('initializeGracefulShutdown')
          )
        );
        await app.shutdown();
      });

      it('for signal code SIGQUIT', async () => {
        const app = new App({
          modules: [],
          injector,
        });
        await app.initialize();
        expect((process as any).on.mock.calls[2][0]).toBe('SIGQUIT');
        expect((process as any).on.mock.calls[2][1].original).toBe(
          app.onProcessSignal
        );

        expect(log.debug).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`registers graceful shutdown for code: 'SIGQUIT'`)
              .on(app)
              .in('initializeGracefulShutdown')
          )
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
        expect(log.debug).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`initializing external dependencies`)
              .on(app)
              .in('initializeExternalDependencies')
          )
        );
        await app.shutdown();
      });
      describe('Pulse', () => {
        it('binds Pulse library to injector', async () => {
          const app = new App({
            modules: [],
            injector,
          });
          await app.initialize();
          const pulse = await app.injector.get<any>(BINDINGS.Pulse.library);
          expect(pulse).toBe(Pulse);
          expect(log.debug).toHaveBeenCalledWith(
            expect.objectContaining(
              new Log(`bound 'Pulse.library' as constant value`)
                .on(app)
                .in('initializeExternalDependencies')
            )
          );
          await app.shutdown();
        });
        it('does not override existing Pulse library on injector', async () => {
          const pulseInstance = mock<Pulse>();

          class PulseStub {
            constructor(options?: any) {
              return pulseInstance as any;
            }
          }

          const PulseConstructorSpy = vi.fn(PulseStub);

          injector
            .bind(BINDINGS.Pulse.library)
            .toConstantValue(PulseConstructorSpy);
          const app = new App({ injector, modules: [] });
          await app.initialize();
          const pulse = await app.injector.get<any>(BINDINGS.Pulse.library);
          expect(pulse).toBe(PulseConstructorSpy);
          await app.shutdown();
        });
      });
      describe('MongoDB', () => {
        it('binds MongoDB library to injector', async () => {
          const app = new App({ modules: [], injector });
          await app.initialize();
          const mongodb = await app.injector.get<any>(BINDINGS.MongoDB.library);
          expect(mongodb).toEqual(MongoClient);
          expect(log.debug).toHaveBeenCalledWith(
            expect.objectContaining(
              new Log(`bound 'MongoDB.library' as constant value`)
                .on(app)
                .in('initializeExternalDependencies')
            )
          );
          await app.shutdown();
        });
        it('does not override existing MongoDB library on injector', async () => {
          const mongoClientInstance = mock<MongoClient>();
          const collection = mock<Collection<any>>();
          const db = mock<Db>();

          db.collection.mockReturnValue(collection);
          mongoClientInstance.db.mockReturnValue(db);

          // Create a mock constructor that returns the mocked instance
          class MongoClientStub {
            constructor(url?: string, options?: any) {
              return mongoClientInstance as any;
            }
          }

          const MongoClientConstructorSpy = vi.fn(MongoClientStub);

          injector
            .bind<any>(BINDINGS.MongoDB.library)
            .toConstantValue(MongoClientConstructorSpy);

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
          expect(mongodb).toBe(MongoClientConstructorSpy);
          await app.shutdown();
        });
      });
    });

    describe('initializes schedulers', () => {
      describe('PulseCommandSchedulerModule', () => {
        it('does not include module if command scheduling is not enabled on configuration', async () => {
          const config = new AppConfig({
            appId: 'my-id',
            eveble: new EvebleConfig({
              CommandScheduler: { isEnabled: false },
            }),
          });
          const app = new App({ config, injector });

          await app.initialize();

          expect(app.modules).toBeInstanceOf(Array);
          expect(app.modules).toHaveLength(3);
          expect(app.modules[0]).toBeInstanceOf(MongoDBCommitStorageModule);
          expect(app.modules[1]).toBeInstanceOf(MongoDBSnapshotStorageModule);
          expect(app.modules[2]).toBeInstanceOf(Eveble);

          await app.shutdown();
        });

        it('does not include module if CommandScheduler is bound prior to initialization on Injector', async () => {
          const commandScheduler = mock<types.CommandScheduler>();

          const config = new AppConfig({
            appId: 'my-id',
          });
          const app = new App({ config });

          app.injector
            .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
            .toConstantValue(commandScheduler);
          app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);

          await app.initialize();
          expect(app.modules).toBeInstanceOf(Array);
          expect(app.modules).toHaveLength(3);
          expect(app.modules[0]).toBeInstanceOf(MongoDBCommitStorageModule);
          expect(app.modules[1]).toBeInstanceOf(MongoDBSnapshotStorageModule);
          expect(app.modules[2]).toBeInstanceOf(Eveble);
          expect(
            await app.injector.get<types.CommandScheduler>(
              BINDINGS.CommandScheduler
            )
          ).toBe(commandScheduler);

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
          expect(app.modules).toBeInstanceOf(Array);
          expect(app.modules).toHaveLength(4);
          expect(app.modules[0]).toBeInstanceOf(MongoDBCommitStorageModule);
          expect(app.modules[1]).toBeInstanceOf(MongoDBSnapshotStorageModule);
          expect(app.modules[2]).toBeInstanceOf(PulseCommandSchedulerModule);
          expect(app.modules[3]).toBeInstanceOf(Eveble);
          await app.shutdown();
        });
      });
    });

    describe('initializes storages', () => {
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
          expect(app.modules).toBeInstanceOf(Array);
          expect(app.modules).toHaveLength(3);
          expect(app.modules[0]).toBeInstanceOf(MongoDBCommitStorageModule);
          expect(app.modules[1]).toBeInstanceOf(PulseCommandSchedulerModule);
          expect(app.modules[2]).toBeInstanceOf(Eveble);

          await app.shutdown();
        });

        it('does not include module if SnapshotStorage is bound prior to initialization on Injector', async () => {
          const snapshotStorageStub = mock<types.SnapshotStorage>();

          const config = new AppConfig({
            appId: 'my-id',
          });
          const app = new App({ config });

          app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
          app.injector
            .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
            .toConstantValue(snapshotStorageStub);

          await app.initialize();
          expect(app.modules).toBeInstanceOf(Array);
          expect(app.modules).toHaveLength(3);
          expect(app.modules[0]).toBeInstanceOf(MongoDBCommitStorageModule);
          expect(app.modules[1]).toBeInstanceOf(PulseCommandSchedulerModule);
          expect(app.modules[2]).toBeInstanceOf(Eveble);
          expect(
            await app.injector.get<types.SnapshotStorage>(
              BINDINGS.SnapshotStorage
            )
          ).toBe(snapshotStorageStub);

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
          expect(app.modules).toBeInstanceOf(Array);
          expect(app.modules).toHaveLength(4);
          expect(app.modules[0]).toBeInstanceOf(MongoDBCommitStorageModule);
          expect(app.modules[1]).toBeInstanceOf(MongoDBSnapshotStorageModule);
          expect(app.modules[2]).toBeInstanceOf(PulseCommandSchedulerModule);
          expect(app.modules[3]).toBeInstanceOf(Eveble);
          await app.shutdown();
        });
      });

      describe('MongoDBCommitStorageModule', () => {
        it('does not include module if CommitStore is bound prior to initialization on Injector', async () => {
          const commitStorageStub = mock<types.CommitStorage>();
          const commitObserverStub = mock<types.CommitObserver>();

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
          expect(app.modules).toBeInstanceOf(Array);
          expect(app.modules).toHaveLength(3);
          expect(app.modules[0]).toBeInstanceOf(MongoDBSnapshotStorageModule);
          expect(app.modules[1]).toBeInstanceOf(PulseCommandSchedulerModule);
          expect(app.modules[2]).toBeInstanceOf(Eveble);
          expect(
            await app.injector.get<types.CommitStorage>(BINDINGS.CommitStorage)
          ).toBe(commitStorageStub);
          expect(
            await app.injector.get<types.CommitObserver>(
              BINDINGS.CommitObserver
            )
          ).toBe(commitObserverStub);
          await app.shutdown();
        });

        it('initializes module if its not bound on Injector already', async () => {
          const config = new AppConfig({
            appId: 'my-id',
          });
          const app = new App({ config, injector });

          await app.initialize();
          expect(app.modules).toBeInstanceOf(Array);
          expect(app.modules).toHaveLength(4);
          expect(app.modules[0]).toBeInstanceOf(MongoDBCommitStorageModule);
          await app.shutdown();
        });
      });
    });

    it('binds app instance on injector', async () => {
      const app = new App({
        modules: [],
        injector,
      });
      expect(injector.get<types.App>(BINDINGS.App)).toBe(app);
    });
  });

  describe(`helpers`, () => {
    @Type('App.MyCommand')
    class MyCommand extends Command<{}> {}
    @Type('App.MyEvent')
    class MyEvent extends Event<{}> {}

    let app: App;
    let commandBus: any;
    let eventBus: any;

    beforeEach(() => {
      commandBus = mock<types.CommandBus>();
      eventBus = mock<types.EventBus>();

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

      commandBus.send.mockResolvedValue('result');

      const result = await app.send(command);
      expect(result).toBe('result');
      expect(commandBus.send).toHaveBeenCalledTimes(1);
      expect(commandBus.send).toHaveBeenCalledWith(command);
    });

    it(`publishes event through event bus`, async () => {
      const event = new MyEvent({
        sourceId: new Guid(),
      });

      await app.publish(event);
      expect(eventBus.publish).toHaveBeenCalledTimes(1);
      expect(eventBus.publish).toHaveBeenCalledWith(event);
    });

    it(`subscribes to event with handler on event bus`, async () => {
      const handler = vi.fn();

      await app.subscribeTo(MyEvent, handler);
      expect(eventBus.subscribeTo).toHaveBeenCalledTimes(1);
      expect(eventBus.subscribeTo).toHaveBeenCalledWith(MyEvent, handler);
    });
  });
});
