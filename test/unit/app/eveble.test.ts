import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { define } from 'typend';
import { EventSourceableRepository } from '../../../src/infrastructure/event-sourceable-repository';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { CommandSchedulingService } from '../../../src/infrastructure/command-scheduling-service';
import { AppConfig } from '../../../src/configs/app-config';
import { EvebleConfig } from '../../../src/configs/eveble-config';
import { Eveble } from '../../../src/app/eveble';
import { Module } from '../../../src/core/module';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Log } from '../../../src/components/log-entry';
import { Injector } from '../../../src/core/injector';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { kernel } from '../../../src/core/kernel';
import { Asserter } from '../../../src/domain/asserter';
import { StatefulAssertion } from '../../../src/domain/assertions/stateful-assertion';
import { StatusfulAssertion } from '../../../src/domain/assertions/statusful-assertion';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { Router } from '../../../src/infrastructure/router';

chai.use(sinonChai);

describe(`Eveble Module`, function() {
  // Props
  const appId = 'my-app-id';
  let appConfig: AppConfig;
  let app: any;
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // Dependencies
  let library: any;
  let commitStorage: any;
  let commitObserver: any;
  let snapshotStorage: any;
  let snapshotSerializer: any;
  let commandScheduler: any;

  const setupInjector = function(): void {
    injector = new Injector();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function(): void {
    // Config.prototype.get
    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('eveble.commitStore.timeout').returns(60);
    config.get.withArgs('eveble.Snapshotter.frequency').returns(1);
    // Config.prototype.has
    config.has.withArgs('eveble.Snapshotter.frequency').returns(true);
  };

  const setupEvebleDependencies = function(): void {
    library = stubInterface<types.Library>();
    commitStorage = stubInterface<types.CommitStorage>();
    commitObserver = stubInterface<types.CommitObserver>();
    snapshotStorage = stubInterface<types.SnapshotStorage>();
    snapshotSerializer = stubInterface<types.SnapshotSerializer>();
    commandScheduler = stubInterface<types.CommandScheduler>();

    // Library
    injector.bind<types.Library>(BINDINGS.Library).toConstantValue(library);
    library.getTypes.returns(new Map([]));
    // Commit
    injector
      .bind<types.CommitStorage>(BINDINGS.CommitStorage)
      .toConstantValue(commitStorage);
    injector
      .bind<types.CommitObserver>(BINDINGS.CommitObserver)
      .toConstantValue(commitObserver);
    // Snapshotter
    injector
      .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
      .toConstantValue(snapshotStorage);
    injector
      .bind<types.SnapshotSerializer>(BINDINGS.SnapshotSerializer)
      .toConstantValue(snapshotSerializer);
    // Scheduling
    injector
      .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
      .toConstantValue(commandScheduler);
  };

  beforeEach(async () => {
    setupInjector();
    setupEvebleDependencies();
    setupDefaultConfiguration();

    appConfig = new AppConfig({
      appId: 'my-app-id',
    });
    app = stubInterface<types.App>();
    app.config = appConfig;
  });

  afterEach(() => {
    kernel.setSerializer(undefined as any);
    kernel.setAsserter(undefined as any);
  });

  it(`extends Module`, () => {
    expect(Eveble.prototype).to.instanceof(Module);
  });

  describe(`initialization`, () => {
    describe('initializes top level dependencies', () => {
      it('logs initializing top level dependencies', async () => {
        const eveble = new Eveble();
        await eveble.initialize(app, injector);
        expect(log.debug).to.be.calledWithExactly(
          new Log(`initializing top level dependencies`)
            .on(eveble)
            .in('initializeTopLevelDependencies')
        );
      });

      describe('Asserter', () => {
        it('sets asserter on kernel', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);
          expect(kernel.asserter).to.be.instanceof(Asserter);

          expect(log.debug).to.be.calledWithExactly(
            new Log(`set asserter 'Asserter' on Kernel`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('ensures that StatefulAssertion is registered on asserter', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);
          expect(kernel.asserter).to.be.instanceof(Asserter);
          expect(kernel.asserter.hasAssertion(StatefulAssertion)).to.be.true;
        });

        it('ensures that StatusfulAssertion is registered on asserter', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);
          expect(kernel.asserter).to.be.instanceof(Asserter);
          expect(kernel.asserter.hasAssertion(StatusfulAssertion)).to.be.true;
        });

        it('ensures that AbilityAssertion is registered on asserter', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);
          expect(kernel.asserter).to.be.instanceof(Asserter);
          expect(kernel.asserter.hasAssertion(AbilityAssertion)).to.be.true;
        });
      });

      describe('Serializer', async () => {
        it('binds Serializer on Injector', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.Serializer>(
              BINDINGS.Serializer
            )
          ).to.be.instanceof(EJSONSerializerAdapter);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'EJSON' to constant value`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
          expect(log.debug).to.be.calledWithExactly(
            new Log(
              `bound 'Serializer' to 'EJSONSerializerAdapter' in singleton scope`
            )
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound Serializer on Injector if its already bound prior to initialization', async () => {
          const serializer = stubInterface<types.Serializer>();
          const eveble = new Eveble();
          injector
            .bind<types.Serializer>(BINDINGS.Serializer)
            .toConstantValue(serializer);
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.Serializer>(
              BINDINGS.Serializer
            )
          ).to.be.equal(serializer);
        });

        it('sets serializer on kernel', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);
          expect(kernel.serializer).to.be.instanceof(EJSONSerializerAdapter);

          expect(log.debug).to.be.calledWithExactly(
            new Log(`set serializer 'EJSONSerializerAdapter' on Kernel`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('registers types on serializer', async () => {
          const serializer = stubInterface<types.Serializer>();
          injector
            .bind<types.Serializer>(BINDINGS.Serializer)
            .toConstantValue(serializer);
          @define('MyCommand')
          class MyCommand extends Command {
            key: string;
          }
          @define('Namespace.MyEvent')
          class MyEvent extends Event {
            key: string;
          }

          const registeredTypes: Map<
            string,
            types.MessageType<types.Command | types.Event>
          > = new Map([
            ['MyCommand', MyCommand as any],
            ['Namespace.MyEvent', MyEvent as any],
          ]);
          library.getTypes.returns(registeredTypes);
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(serializer.registerType).to.be.calledTwice;
          expect(serializer.registerType).to.be.calledWithExactly(
            'MyCommand',
            MyCommand
          );
          expect(serializer.registerType).to.be.calledWithExactly(
            'Namespace.MyEvent',
            MyEvent
          );

          expect(log.debug).to.be.calledWithExactly(
            new Log(`registered type 'MyCommand' on 'Object' serializer`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );

          expect(log.debug).to.be.calledWithExactly(
            new Log(
              `registered type 'Namespace.MyEvent' on 'Object' serializer`
            )
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });
      });

      describe('Router', async () => {
        it('binds Router on Injector', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.Router>(BINDINGS.Router)
          ).to.be.equal(Router);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'Router' as constant value`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound Router on Injector if its already bound prior to initialization', async () => {
          const router = stubInterface<types.Router>();
          const eveble = new Eveble();
          injector.bind<types.Router>(BINDINGS.Router).toConstantValue(router);
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.Router>(BINDINGS.Router)
          ).to.be.equal(router);
        });
      });

      describe('CommandBus', async () => {
        it('binds CommandBus on Injector', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.CommandBus>(
              BINDINGS.CommandBus
            )
          ).to.be.instanceof(CommandBus);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'CommandBus' in singleton scope`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound CommandBus on Injector if its already bound prior to initialization', async () => {
          const commandBus = stubInterface<types.CommandBus>();
          const eveble = new Eveble();
          injector
            .bind<types.CommandBus>(BINDINGS.CommandBus)
            .toConstantValue(commandBus);
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.CommandBus>(
              BINDINGS.CommandBus
            )
          ).to.be.equal(commandBus);
        });
      });

      describe('EventBus', async () => {
        it('binds EventBus on Injector', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.EventBus>(BINDINGS.EventBus)
          ).to.be.instanceof(EventBus);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'EventBus' in singleton scope`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound EventBus on Injector if its already bound prior to initialization', async () => {
          const eventBus = stubInterface<types.EventBus>();
          const eveble = new Eveble();
          injector
            .bind<types.EventBus>(BINDINGS.EventBus)
            .toConstantValue(eventBus);
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.EventBus>(BINDINGS.EventBus)
          ).to.be.equal(eventBus);
        });
      });

      describe('EventSourceableRepository', async () => {
        it('binds EventSourceableRepository on Injector', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.EventSourceableRepository>(
              BINDINGS.EventSourceableRepository
            )
          ).to.be.instanceof(EventSourceableRepository);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'EventSourceableRepository' in singleton scope`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound EventSourceableRepository on Injector if its already bound prior to initialization', async () => {
          const eventSourceableRepository = stubInterface<
            types.EventSourceableRepository
          >();
          const eveble = new Eveble();
          injector
            .bind<types.EventSourceableRepository>(
              BINDINGS.EventSourceableRepository
            )
            .toConstantValue(eventSourceableRepository);
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.EventSourceableRepository>(
              BINDINGS.EventSourceableRepository
            )
          ).to.be.equal(eventSourceableRepository);
        });
      });

      describe('CommitStore', async () => {
        it('binds CommitStore on Injector', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.CommitStore>(
              BINDINGS.CommitStore
            )
          ).to.be.instanceof(CommitStore);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'CommitStore' in singleton scope`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound CommitStore on Injector if its already bound prior to initialization', async () => {
          const commitStore = stubInterface<types.CommitStore>();
          const eveble = new Eveble();
          injector
            .bind<types.CommitStore>(BINDINGS.CommitStore)
            .toConstantValue(commitStore);
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.CommitStore>(
              BINDINGS.CommitStore
            )
          ).to.be.equal(commitStore);
        });
      });

      describe('CommitPublisher', async () => {
        it('binds CommitPublisher on Injector', async () => {
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.CommitPublisher>(
              BINDINGS.CommitPublisher
            )
          ).to.be.instanceof(CommitPublisher);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'CommitPublisher' in singleton scope`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound CommitPublisher on Injector if its already bound prior to initialization', async () => {
          const commitPublisher = stubInterface<types.CommitPublisher>();
          const eveble = new Eveble();
          injector
            .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
            .toConstantValue(commitPublisher);
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.CommitPublisher>(
              BINDINGS.CommitPublisher
            )
          ).to.be.equal(commitPublisher);
        });
      });

      describe('Snapshotter', async () => {
        it('binds Snapshotter on Injector', async () => {
          app.config = new AppConfig({
            appId: 'my-app-id',
            eveble: new EvebleConfig({
              Snapshotter: { isEnabled: true, frequency: 10 },
            }),
          });
          injector
            .rebind<types.Configurable>(BINDINGS.Config)
            .toConstantValue(app.config);
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.Snapshotter>(
              BINDINGS.Snapshotter
            )
          ).to.be.instanceof(Snapshotter);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'Snapshotter' in singleton scope`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound Snapshotter on Injector if its already bound prior to initialization', async () => {
          const snapshotter = stubInterface<types.Snapshotter>();
          const eveble = new Eveble();
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<types.Snapshotter>(
              BINDINGS.Snapshotter
            )
          ).to.be.equal(snapshotter);
        });
      });

      describe('CommandScheduler', () => {
        it('binds CommandSchedulingService if its enabled on configuration', async () => {
          app.config = new AppConfig({
            appId: 'my-app-id',
            eveble: new EvebleConfig({
              CommandScheduler: { isEnabled: true },
            }),
          });
          injector
            .rebind<types.Configurable>(BINDINGS.Config)
            .toConstantValue(app.config);
          const eveble = new Eveble();

          await eveble.initialize(app, injector);

          expect(
            await eveble.injector.getAsync<any>(
              BINDINGS.CommandSchedulingService
            )
          ).to.be.instanceof(CommandSchedulingService);
          expect(log.debug).to.be.calledWithExactly(
            new Log(`bound 'CommandSchedulingService' as constant value`)
              .on(eveble)
              .in('initializeTopLevelDependencies')
          );
        });

        it('does not bound CommandSchedulingService if its disabled on configuration', async () => {
          app.config = new AppConfig({
            appId: 'my-app-id',
            eveble: new EvebleConfig({
              CommandScheduler: { isEnabled: false },
            }),
          });
          const eveble = new Eveble();
          await eveble.initialize(app, injector);

          expect(eveble.injector.isBound(BINDINGS.CommandSchedulingService)).to
            .be.false;
        });
      });
    });
  });

  describe(`on initialization`, () => {
    it(`enables Snapshotter if snapshotting is enabled on configuration`, async () => {
      app.config = new AppConfig({
        appId: 'my-app-id',
        eveble: new EvebleConfig({
          Snapshotter: { isEnabled: true, frequency: 1 },
        }),
      });
      injector
        .rebind<types.Configurable>(BINDINGS.Config)
        .toConstantValue(app.config);

      const eveble = new Eveble({
        injector,
      });
      await eveble.initialize(app, injector);

      const repository = await eveble.injector.getAsync<
        types.EventSourceableRepository
      >(BINDINGS.EventSourceableRepository);
      expect(repository.isSnapshotting()).to.be.true;
      expect(log.debug).to.be.calledWithExactly(
        new Log(`enabling snapshotting`).on(eveble).in('bindSnapshotter')
      );
      expect(log.debug).to.be.calledWithExactly(
        new Log(`enabled snapshotting`).on(eveble).in('bindSnapshotter')
      );
    });

    it(`does not enable Snapshotter when snapshotting is disabled on configuration`, async () => {
      app.config = new AppConfig({
        appId: 'my-app-id',
        eveble: new EvebleConfig({
          Snapshotter: { isEnabled: false, frequency: 1 },
        }),
      });
      injector
        .rebind<types.Configurable>(BINDINGS.Config)
        .toConstantValue(app.config);
      const eveble = new Eveble({
        injector,
      });
      await eveble.initialize(app, injector);

      const repository = await eveble.injector.getAsync<
        types.EventSourceableRepository
      >(BINDINGS.EventSourceableRepository);
      expect(repository.isSnapshotting()).to.be.false;
    });
  });

  describe(`on start`, () => {
    it(`starts publishing with commit publisher`, async () => {
      const commitPublisher = stubInterface<types.CommitPublisher>();
      injector.bind(BINDINGS.CommitPublisher).toConstantValue(commitPublisher);

      const eveble = new Eveble({
        injector,
      });
      await eveble.initialize(app, injector);

      await eveble.start();
      expect(commitPublisher.startPublishing).to.be.calledOnce;
    });

    it(`starts schedulers`, async () => {
      app.config = new AppConfig({
        appId: 'my-app-id',
        eveble: new EvebleConfig({
          CommandScheduler: { isEnabled: true },
        }),
      });
      const eveble = new Eveble({
        injector,
      });
      await eveble.initialize(app, injector);

      await eveble.start();
      expect(commandScheduler.startScheduling).to.be.calledOnce;
    });
  });

  describe(`on stop`, () => {
    it(`stops publishing with commit publisher`, async () => {
      const commitPublisher = stubInterface<types.CommitPublisher>();
      injector.bind(BINDINGS.CommitPublisher).toConstantValue(commitPublisher);

      const eveble = new Eveble({
        injector,
      });
      await eveble.initialize(app, injector);

      await eveble.start();
      await eveble.stop();

      expect(commitPublisher.startPublishing).to.be.calledOnce;
      expect(commitPublisher.stopPublishing).to.be.calledOnce;
    });

    it(`stops schedulers`, async () => {
      app.config = new AppConfig({
        appId: 'my-app-id',
        eveble: new EvebleConfig({
          CommandScheduler: { isEnabled: true },
        }),
      });
      const eveble = new Eveble({
        injector,
      });

      await eveble.initialize(app, injector);
      await eveble.start();
      await eveble.stop();

      expect(commandScheduler.stopScheduling).to.be.calledOnce;
    });
  });
});
