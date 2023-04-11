/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';
import getenv from 'getenv';
import { define } from '@eveble/core';
import { PropTypes } from 'typend';
import { Module } from '../../../src/core/module';
import { Config } from '../../../src/components/config';
import { Log } from '../../../src/components/log-entry';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import {
  AppMissingError,
  InvalidModuleError,
  InvalidConfigError,
  InjectorMissingError,
  InvalidAppConfigError,
  InvalidEnvironmentError,
} from '../../../src/core/core-errors';
import { AppConfig } from '../../../src/configs/app-config';
import { LoggingConfig } from '../../../src/configs/logging-config';
import { InvalidStateError } from '../../../src/mixins/stateful-mixin';
import { EvebleConfig } from '../../../src/configs/eveble-config';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Module', () => {
  class MyModule extends Module {
    // All available custom hooks that developer can define on App/Modules
    beforeInitialize(): any { }

    onInitialize(): any { }

    afterInitialize(): any { }

    beforeStart(): any { }

    onStart(): any { }

    afterStart(): any { }

    beforeStop(): any { }

    onStop(): any { }

    afterStop(): any { }

    beforeReset(): any { }

    onReset(): any { }

    afterReset(): any { }

    beforeShutdown(): any { }

    onShutdown(): any { }

    afterShutdown(): any { }
  }

  const lifeCycleHooks = [
    'beforeInitialize',
    'onInitialize',
    'afterInitialize',
    'beforeStart',
    'onStart',
    'afterStart',
    'beforeStop',
    'onStop',
    'afterStop',
    'beforeReset',
    'onReset',
    'afterReset',
    'beforeShutdown',
    'onShutdown',
    'afterShutdown',
  ];

  let injector: any;
  let app: any;
  let logger: any;
  let currentEnv: string | undefined;
  let generateId: any;
  let generatedId: string;

  before(() => {
    currentEnv = getenv.string('NODE_ENV');
    for (const method of lifeCycleHooks) {
      sinon.stub(MyModule.prototype, method as any);
    }
  });

  beforeEach(() => {
    app = stubInterface<types.App>();
    app.config = new AppConfig();
    logger = stubInterface<types.Logger>();
    injector = stubInterface<types.Injector>();

    generateId = sinon.stub(AppConfig, 'generateId');
    generatedId = 'my-app-id';
    generateId.returns(generatedId);

    injector.getAsync.withArgs(BINDINGS.log).returns(logger);
    injector.findByScope.withArgs('Singleton').returns([]);
  });

  afterEach(() => {
    generateId.restore();
    process.env.NODE_ENV = currentEnv;

    for (const method of lifeCycleHooks) {
      (MyModule.prototype as any)[method].reset();
    }
  });

  describe('construction', () => {
    it('initializes dependent submodules as empty array', () => {
      const module = new MyModule();
      expect(module.modules).to.be.instanceof(Array);
      expect(module.modules).to.be.empty;
    });

    it('initializes configuration and instance of Config', () => {
      const module = new MyModule();
      expect(module.config).to.be.instanceof(Config);
      expect(module.config).to.be.empty;
    });

    it('takes props with: modules as an array with instances implementing Module interface and assigns it', () => {
      const modules = [new MyModule()];
      const module = new MyModule({
        modules,
      });
      expect(module.modules).to.eql(modules);
    });

    it(`takes props with: config instance implementing Configurable interface and assigns it`, () => {
      @define('MyConfig')
      class MyConfig extends Config {
        foo: string;

        bar: number;

        constructor(props: Partial<MyConfig>) {
          super();
          Object.assign(this, this.processProps(props));
        }
      }

      const config = new MyConfig({ foo: 'first', bar: 2 });
      expect(new MyModule({ config }).config).to.be.eql(config);
    });

    it('sets the constructed state on construction', () => {
      const module = new MyModule();
      expect(module.isInState(Module.STATES.constructed)).to.be.true;
    });

    it(`throws InvalidModuleError error if provided submodule does not implement Module interface`, () => {
      class InvalidModule { }
      expect(() => {
        new MyModule({
          modules: [new InvalidModule()],
        });
      }).to.throw(
        InvalidModuleError,
        `MyModule: dependent modules must be instance of Module, got InvalidModule`
      );
    });

    it(`throws InvalidConfigError error if provided configuration does implement Configurable interface`, () => {
      const invalidConfig = {};
      expect(() => {
        new MyModule({
          config: invalidConfig,
        });
      }).to.throw(
        InvalidConfigError,
        `Module: configuration must be an instance implementing Configurable interface, got {}`
      );
    });
  });

  describe('initialization', () => {
    it('throws an AppMissingError if no application is provided', async () => {
      expect(
        new MyModule().initialize(undefined as any, undefined as any)
      ).to.eventually.be.rejectedWith(
        AppMissingError,
        `Instance of App is required to initialize module`
      );
    });

    it('throws an InjectorMissingError if injector is not provided', async () => {
      expect(
        new MyModule().initialize(app, undefined as any)
      ).to.eventually.be.rejectedWith(
        InjectorMissingError,
        `Instance of Injector is required to initialize module`
      );
    });

    it('can be only initialized once', async () => {
      const module = new MyModule();
      // First initialization
      // Initialize module once so it changes state from constructed to initialized.
      await module.initialize(app, injector);
      expect(module.isInState(Module.STATES.initialized)).to.be.true;

      // Since logger is assigned to module on initialization after verifying that
      // current state allows initialization to proceed - we unset previously initialized logger
      // to test if initialization can run more then once.
      delete (module as any).log;

      // Second initialization of already initialized module
      await module.initialize(app, injector);
      expect((module as any).log).to.be.undefined;
    });

    it(`initializes logger and logs initialization stage before initializing submodules`, async () => {
      const submodule = stubInterface<types.Module>();
      submodule.state = Module.STATES.constructed;
      submodule.config = stubInterface<types.Configurable>();
      const module = new MyModule({
        modules: [submodule],
      });

      await module.initialize(app, injector);
      expect(module.log).to.be.equal(logger);
      expect(logger.debug).to.be.calledWithMatch(
        new Log(`initializing`)
          .on(module)
          .in(module.initialize)
          .with('arguments', [app, injector])
      );
      expect(logger.debug).to.be.calledBefore(submodule.initialize);
    });

    describe('merging with application configuration', () => {
      it('throws InvalidAppConfigError if configuration on application is not instance of AppConfig', async () => {
        class MyApp {
          config: any;

          initialize(): void { }

          start(): void { }

          stop(): void { }

          reset(): void { }

          shutdown(): void { }

          invokeAction(): void { }
        }

        const module = new MyModule({});
        expect(
          module.initialize(new MyApp() as any, injector)
        ).to.eventually.be.rejectedWith(
          InvalidAppConfigError,
          `Configuration provided for application must be an instance of AppConfig, got undefined`
        );
      });

      it(`merges module configuration with application and replaces module's configuration with the one from app`, async () => {
        @define('MyAppConfig')
        class MyAppConfig extends AppConfig {
          foo: string;

          bar: number;

          constructor(props: Partial<MyAppConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @define('MyModuleConfig')
        class MyModuleConfig extends Config {
          baz: boolean;

          qux: string;

          constructor(props: Partial<MyModuleConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const appConfig = new MyAppConfig({
          appId: 'my-app-id',
          workerId: 'my-worker-id',
          foo: 'first',
          bar: 2,
          eveble: new EvebleConfig(),
        });

        const moduleConfig = new MyModuleConfig({
          baz: true,
          qux: 'fourth',
        });

        app.config = appConfig;
        const module = new MyModule({
          config: moduleConfig,
        });
        await module.initialize(app, injector);

        const expectedAppConfig = {
          merged: {
            MyModuleConfig: moduleConfig,
          },
          appId: 'my-app-id',
          workerId: 'my-worker-id',
          conversion: { type: 'runtime' },
          validation: { type: 'runtime' },
          description: { formatting: 'default' },
          logging: new LoggingConfig(),
          clients: {
            MongoDB: {
              CommitStore: AppConfig.defaultMongoDBOptions,
              Snapshotter: AppConfig.defaultMongoDBOptions,
              CommandScheduler: AppConfig.defaultMongoDBOptions,
            },
            Agenda: {
              CommandScheduler: {
                processEvery: 180000,
              },
            },
          },
          eveble: new EvebleConfig(),
          foo: 'first',
          bar: 2,
          baz: true,
          qux: 'fourth',
        };

        const expectedPropTypes = {
          included: PropTypes.object.isOptional,
          merged: PropTypes.object.isOptional,
          appId: PropTypes.oneOf([
            undefined,
            PropTypes.instanceOf(String),
            PropTypes.interface({ toString: PropTypes.instanceOf(Function) }),
          ]),
          workerId: PropTypes.oneOf([
            undefined,
            PropTypes.instanceOf(String),
            PropTypes.interface({ toString: PropTypes.instanceOf(Function) }),
          ]),
          conversion: PropTypes.shape({
            type: PropTypes.oneOf([
              PropTypes.equal('manual'),
              PropTypes.equal('runtime'),
            ]),
          }).isOptional,
          validation: PropTypes.shape({
            type: PropTypes.oneOf([
              PropTypes.equal('manual'),
              PropTypes.equal('runtime'),
            ]),
          }).isOptional,
          description: PropTypes.shape({
            formatting: PropTypes.oneOf([
              PropTypes.equal('compact'),
              PropTypes.equal('debug'),
              PropTypes.equal('default'),
            ]),
          }).isOptional,
          logging: PropTypes.instanceOf(LoggingConfig).isOptional,
          clients: PropTypes.shape({
            MongoDB: PropTypes.shape({
              CommitStore: PropTypes.object.isOptional,
              Snapshotter: PropTypes.object.isOptional,
              CommandScheduler: PropTypes.object.isOptional,
            }).isOptional,
            Agenda: PropTypes.shape({
              CommandScheduler: PropTypes.object.isOptional,
            }).isOptional,
          }).isOptional,
          eveble: PropTypes.instanceOf(EvebleConfig).isOptional,
          foo: PropTypes.instanceOf(String),
          bar: PropTypes.instanceOf(Number),
          baz: PropTypes.instanceOf(Boolean),
          qux: PropTypes.instanceOf(String),
        };

        expect(app.config).to.be.eql(expectedAppConfig);
        expect(module.config).to.not.be.eql(moduleConfig);
        expect(module.config).to.be.eql(expectedAppConfig);
        expect(appConfig.getPropTypes()).to.be.eql(expectedPropTypes);
      });

      it(`ensures that module configuration is not overriding already set properties on app configuration`, async () => {
        @define('MyAppConfig')
        class MyAppConfig extends AppConfig {
          foo: string;

          bar: string;

          constructor(props: Partial<MyAppConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @define('MyModuleConfig')
        class MyModuleConfig extends Config {
          foo: string;

          bar: string;

          constructor(props: Partial<MyModuleConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const appConfig = new MyAppConfig({
          appId: 'my-app-id',
          workerId: 'my-worker-id',
          foo: 'app-foo',
          bar: 'app-bar',
          eveble: new EvebleConfig(),
        });
        const moduleConfig = new MyModuleConfig({
          foo: 'module-foo',
          bar: 'module-bar',
        });

        app.config = appConfig;
        const module = new MyModule({
          config: moduleConfig,
        });
        await module.initialize(app, injector);

        const expectedAppConfig = {
          merged: {
            MyModuleConfig: moduleConfig,
          },
          logging: new LoggingConfig(),
          appId: 'my-app-id',
          workerId: 'my-worker-id',
          conversion: { type: 'runtime' },
          validation: { type: 'runtime' },
          description: { formatting: 'default' },
          clients: {
            MongoDB: {
              CommitStore: AppConfig.defaultMongoDBOptions,
              Snapshotter: AppConfig.defaultMongoDBOptions,
              CommandScheduler: AppConfig.defaultMongoDBOptions,
            },
            Agenda: {
              CommandScheduler: {
                processEvery: 180000,
              },
            },
          },
          eveble: new EvebleConfig(),
          foo: 'app-foo',
          bar: 'app-bar',
        };

        expect(app.config).to.be.eql(expectedAppConfig);
      });

      it('log merging module configuration with the one from application', async () => {
        const configuration = new Config();
        const module = new MyModule({ configuration });

        await module.initialize(app, injector);
        expect(logger.debug).to.be.calledWith(
          new Log(`merging module configuration with application`)
            .on(module)
            .in('mergeConfigWithApp')
        );
      });
    });

    it('invokes the beforeInitialize method on itself', async () => {
      const module = new MyModule();
      module.beforeInitialize = sinon.spy();

      await module.initialize(app, injector);
      expect(module.beforeInitialize).to.have.been.calledOnce;
      expect(logger.debug).to.be.calledWithMatch(
        new Log(`beforeInitialize`).on(module).in('runBeforeInitializeHooks')
      );
    });

    it('invokes the onInitialize method on itself', async () => {
      const module = new MyModule();
      module.onInitialize = sinon.spy();

      await module.initialize(app, injector);
      expect(module.onInitialize).to.have.been.calledOnce;
      expect(logger.debug).to.be.calledWithMatch(
        new Log(`onInitialize`).on(module).in('runOnInitializeHooks')
      );
    });

    it('invokes the afterInitialize method on itself', async () => {
      const module = new MyModule();
      module.afterInitialize = sinon.spy();
      await module.initialize(app, injector);
      expect(module.afterInitialize).to.have.been.calledOnce;
      expect(logger.debug).to.be.calledWithMatch(
        new Log(`afterInitialize`).on(module).in('runAfterInitializeHooks')
      );
    });

    it('ensures that order of: before, on, after for initialization hooks is correct', async () => {
      const module = new MyModule();
      module.beforeInitialize = sinon.spy();
      module.onInitialize = sinon.spy();
      module.afterInitialize = sinon.spy();

      await module.initialize(app, injector);
      expect(module.beforeInitialize).to.have.been.calledBefore(
        module.onInitialize as any
      );
      expect(module.onInitialize).to.have.been.calledBefore(
        module.afterInitialize as any
      );
      expect(module.afterInitialize).to.have.been.calledAfter(
        module.onInitialize as any
      );
    });

    it('injects dependencies into the module at initialization stage', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      expect(injector.injectIntoAsync).to.have.been.calledWith(module);
    });

    it('sets the initialized state correctly on last stage', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      expect(module.isInState(Module.STATES.initialized)).to.be.true;
    });

    describe(`submodules`, () => {
      it('initializes submodules of module', async () => {
        const submodule1 = stubInterface<types.Module>();
        submodule1.state = Module.STATES.constructed;
        submodule1.config = stubInterface<types.Configurable>();
        const submodule2 = stubInterface<types.Module>();
        submodule2.state = Module.STATES.constructed;
        submodule2.config = stubInterface<types.Configurable>();

        const module = new MyModule({
          modules: [submodule1, submodule2],
        });
        await module.initialize(app, injector);
        expect(submodule1.initialize).to.been.calledOnce;
        expect(submodule1.initialize).to.been.calledWithExactly(app, injector);
        expect(submodule2.initialize).to.been.calledOnce;
        expect(submodule2.initialize).to.been.calledWithExactly(app, injector);
      });
    });
  });

  describe('starting', () => {
    it('throws InvalidStateError when starting not initialized module', async () => {
      const module = new MyModule();
      await expect(module.start()).to.eventually.be.rejectedWith(
        InvalidStateError,
        `MyModule: expected current state of 'constructed' to be in one of states: 'initialized, stopped, running'`
      );
    });

    it('sets the state to running', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      expect(module.isInState(Module.STATES.running)).to.be.true;
      expect(logger.debug).to.be.calledWithMatch(new Log(`start`).on(module));
    });

    it('invokes start action on sub modules', async () => {
      const submodule1 = new MyModule();
      const submodule2 = new MyModule();
      // Can't create stubbed instance like in `initializes submodule of module` example
      // do to sinon limitation resolved around spy & how 'invokeAction' is
      // running in conjunction with 'invokeActionOnDependentModules'
      const startSpy1 = sinon.spy(submodule1, 'start');
      const startSpy2 = sinon.spy(submodule2, 'start');
      const module = new MyModule({
        modules: [submodule1, submodule2],
      });
      await module.initialize(app, injector);
      await module.start();
      expect(startSpy1).to.been.calledOnce;
      expect(startSpy2).to.been.calledOnce;
    });

    it('ignores start calls on a running module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      await module.start(); // Start module for second time
      expect(MyModule.prototype.beforeStart).to.be.calledOnce;
      expect(MyModule.prototype.onStart).to.be.calledOnce;
      expect(MyModule.prototype.afterStart).to.be.calledOnce;
    });

    it('allows to restart stopped module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      expect(module.isInState(Module.STATES.running)).to.be.true;
      await module.stop();
      expect(module.isInState(Module.STATES.stopped)).to.be.true;
      await module.start();
      expect(module.isInState(Module.STATES.running)).to.be.true;
    });

    it(`runs start lifecycle hooks`, async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();

      expect(logger.debug).to.be.calledWithMatch(
        new Log(`beforeStart`).on(module)
      );
      expect(MyModule.prototype.beforeStart).to.be.calledOnce;
      expect(MyModule.prototype.beforeStart).to.be.calledBefore(
        MyModule.prototype.onStart as any
      );

      expect(logger.debug).to.be.calledWithMatch(new Log(`onStart`).on(module));
      expect(MyModule.prototype.onStart).to.be.calledOnce;
      expect(MyModule.prototype.onStart).to.be.calledBefore(
        MyModule.prototype.afterStart as any
      );

      expect(logger.debug).to.be.calledWithMatch(
        new Log(`afterStart`).on(module)
      );
      expect(MyModule.prototype.afterStart).to.be.calledOnce;
      expect(MyModule.prototype.afterStart).to.be.calledAfter(
        MyModule.prototype.onStart as any
      );
    });
  });

  describe('stopping', async () => {
    it('throws InvalidStateError when stopping not initialized module', async () => {
      const module = new MyModule();

      return expect(module.stop()).to.eventually.be.rejectedWith(
        InvalidStateError,
        `MyModule: expected current state of 'constructed' to be in one of states: 'initialized, stopped, running'`
      );
    });

    it('sets the state to stopped', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.stop();
      expect(module.isInState(Module.STATES.stopped)).to.be.true;
    });

    it('invokes stop action on sub modules', async () => {
      const submodule1 = new MyModule();
      const submodule2 = new MyModule();
      // Can't create stubbed instance like in `initializes submodule of module` example
      // do to sinon limitation resolved around spy & how 'invokeAction' is running in conjunction
      // with invokeActionOnDependentModules
      const stopSpy1 = sinon.spy(submodule1, 'stop');
      const stopSpy2 = sinon.spy(submodule2, 'stop');

      const module = new MyModule({
        modules: [submodule1, submodule2],
      });
      await module.initialize(app, injector);
      await module.stop();
      expect(stopSpy1).to.been.calledOnce;
      expect(stopSpy2).to.been.calledOnce;
    });

    it('ignores stop calls on a stopped module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.stop();
      await module.stop(); // Stops module for second time

      expect(MyModule.prototype.beforeStop).to.be.calledOnce;
      expect(MyModule.prototype.onStop).to.be.calledOnce;
      expect(MyModule.prototype.afterStop).to.be.calledOnce;
    });

    it(`runs stop lifecycle hooks`, async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.stop();

      expect(logger.debug).to.be.calledWithMatch(
        new Log(`beforeStop`).on(module)
      );
      expect(MyModule.prototype.beforeStop).to.be.calledOnce;
      expect(MyModule.prototype.beforeStop).to.be.calledBefore(
        MyModule.prototype.onStop as any
      );

      expect(logger.debug).to.be.calledWithMatch(new Log(`onStop`).on(module));
      expect(MyModule.prototype.onStop).to.be.calledOnce;
      expect(MyModule.prototype.onStop).to.be.calledBefore(
        MyModule.prototype.afterStop as any
      );
      expect(logger.debug).to.be.calledWithMatch(
        new Log(`afterStop`).on(module)
      );
      expect(MyModule.prototype.afterStop).to.be.calledOnce;
      expect(MyModule.prototype.afterStop).to.be.calledAfter(
        MyModule.prototype.onStop as any
      );
    });
  });

  describe('shutdown', () => {
    it('sets the state to shutdown after initialization of module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.shutdown();
      expect(module.isInState(Module.STATES.shutdown)).to.be.true;
    });

    it('sets the state to shutdown on running module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      await module.shutdown();
      expect(module.isInState(Module.STATES.shutdown)).to.be.true;
    });

    it('sets the state to shutdown on stopped module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.stop();
      await module.shutdown();
      expect(module.isInState(Module.STATES.shutdown)).to.be.true;
    });

    it('invokes shutdown action on sub modules', async () => {
      const submodule1 = new MyModule();
      const submodule2 = new MyModule();
      // Can't create stubbed instance like in `initializes submodule of module` example
      // do to sinon limitation resolved around spy & how 'invokeAction' is running in conjunction
      // with _invokeActionOnDependentModules
      const shutdownSpy1 = sinon.spy(submodule1, 'shutdown');
      const shutdownSpy2 = sinon.spy(submodule2, 'shutdown');

      const module = new MyModule({
        modules: [submodule1, submodule2],
      });
      await module.initialize(app, injector);
      await module.shutdown();
      expect(shutdownSpy1).to.been.calledOnce;
      expect(shutdownSpy2).to.been.calledOnce;
    });

    it('ignores shutdown calls on a shutdown module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.shutdown();
      await module.shutdown(); // Shutdown module for second time

      expect(MyModule.prototype.beforeShutdown).to.be.calledOnce;
      expect(MyModule.prototype.onShutdown).to.be.calledOnce;
      expect(MyModule.prototype.afterShutdown).to.be.calledOnce;
    });

    it('ensures that module is stopped before shutdown', async () => {
      const module = new MyModule();
      const stopSpy = sinon.spy(module, 'stop');
      await module.initialize(app, injector);
      await module.start();
      await module.shutdown();

      expect(stopSpy).to.be.calledOnce;
    });

    it(`runs shutdown lifecycle hooks`, async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.shutdown();

      expect(logger.debug).to.be.calledWithMatch(
        new Log(`beforeShutdown`).on(module)
      );
      expect(MyModule.prototype.beforeShutdown).to.be.calledOnce;
      expect(MyModule.prototype.beforeShutdown).to.be.calledBefore(
        MyModule.prototype.onShutdown as any
      );

      expect(logger.debug).to.be.calledWithMatch(
        new Log(`onShutdown`).on(module)
      );
      expect(MyModule.prototype.onShutdown).to.be.calledOnce;
      expect(MyModule.prototype.onShutdown).to.be.calledBefore(
        MyModule.prototype.afterShutdown as any
      );
      expect(logger.debug).to.be.calledWithMatch(
        new Log(`afterShutdown`).on(module)
      );
      expect(MyModule.prototype.afterShutdown).to.be.calledOnce;
      expect(MyModule.prototype.afterShutdown).to.be.calledAfter(
        MyModule.prototype.onShutdown as any
      );
    });
  });

  describe('resetting', async () => {
    it('throws InvalidStateError when resetting not initialized module', async () => {
      const module = new MyModule();

      return expect(module.reset()).to.eventually.be.rejectedWith(
        InvalidStateError,
        `MyModule: expected current state of 'constructed' to be in one of states: 'initialized, stopped, running'`
      );
    });

    context(`invalid environment`, async () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it('throws InvalidEnvironmentError to reject attempts to reset on production environment', async () => {
        process.env.NODE_ENV = 'production';

        const module = new MyModule();
        await module.initialize(app, injector);

        return expect(module.reset()).to.eventually.be.rejectedWith(
          InvalidEnvironmentError,
          `Trying to run action 'reset' on 'production' environment`
        );
      });
    });

    it('ignores reset calls on a stopped module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.reset();
      await module.reset(); // Reset module second time

      expect(MyModule.prototype.beforeReset).to.be.calledOnce;
      expect(MyModule.prototype.onReset).to.be.calledOnce;
      expect(MyModule.prototype.afterReset).to.be.calledOnce;
    });

    it('allows to reset module again after starting module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.reset();
      await module.start();
      await module.reset(); // Reset module second time

      expect(MyModule.prototype.beforeReset).to.be.calledTwice;
      expect(MyModule.prototype.onReset).to.be.be.calledTwice;
      expect(MyModule.prototype.afterReset).to.be.calledTwice;
    });

    it(`runs reset lifecycle hooks`, async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.reset();
      expect(MyModule.prototype.beforeReset).to.be.calledOnce;
      expect(MyModule.prototype.onReset).to.be.calledOnce;
      expect(MyModule.prototype.afterReset).to.be.calledOnce;

      expect(logger.debug).to.be.calledWithMatch(
        new Log(`beforeReset`).on(module)
      );
      expect(MyModule.prototype.beforeReset).to.be.calledOnce;
      expect(MyModule.prototype.beforeReset).to.be.calledBefore(
        MyModule.prototype.onReset as any
      );

      expect(logger.debug).to.be.calledWithMatch(new Log(`onReset`).on(module));
      expect(MyModule.prototype.onReset).to.be.calledOnce;
      expect(MyModule.prototype.onReset).to.be.calledBefore(
        MyModule.prototype.afterReset as any
      );
      expect(logger.debug).to.be.calledWithMatch(
        new Log(`afterReset`).on(module)
      );
      expect(MyModule.prototype.afterReset).to.be.calledOnce;
      expect(MyModule.prototype.afterReset).to.be.calledAfter(
        MyModule.prototype.onReset as any
      );
    });

    it('invokes reset action on sub modules', async () => {
      const submodule1 = new MyModule();
      const submodule2 = new MyModule();
      // Can't create stubbed instance like in `initializes submodule of module` example
      // do to sinon limitation resolved around spy & how 'invokeAction' is running in conjunction
      // with _invokeActionOnDependentModules
      const resetSpy1 = sinon.spy(submodule1, 'reset');
      const resetSpy2 = sinon.spy(submodule2, 'reset');

      const module = new MyModule({
        modules: [submodule1, submodule2],
      });
      await module.initialize(app, injector);
      await module.reset();
      expect(resetSpy1).to.been.calledOnce;
      expect(resetSpy2).to.been.calledOnce;
    });

    it(`restarts already running module to running state`, async () => {
      const stop = sinon.spy(MyModule.prototype, 'stop');
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      expect(module.isInState(Module.STATES.running)).to.be.true;

      const start = sinon.spy(MyModule.prototype, 'start');
      await module.reset();
      expect(start).to.be.calledOnce;
      expect(stop).to.be.calledOnce;
      expect(module.isInState(Module.STATES.running)).to.be.true;
    });
  });

  describe(`evaluation`, () => {
    describe(`environment`, () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it(`returns true if environment is set to production`, () => {
        process.env.NODE_ENV = 'production';
        expect(Module.prototype.isInProduction()).to.be.true;
      });

      it(`returns false if environment is not set to production`, () => {
        expect(Module.prototype.isInProduction()).to.be.false;
      });
    });
  });
});
