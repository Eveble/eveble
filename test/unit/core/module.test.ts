import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, vi, beforeAll } from 'vitest';
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';

import getenv from 'getenv';
import { Type } from '@eveble/core';
import { PropTypes } from 'typend';
import { derived } from '@traits-ts/core';
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
import {
  InvalidStateError,
  StatefulTrait,
} from '../../../src/traits/stateful.trait';
import { EvebleConfig } from '../../../src/configs/eveble-config';

describe('Module', () => {
  class MyModule extends Module {
    // All available custom hooks that developer can define on App/Modules
    beforeInitialize(): any {}

    onInitialize(): any {}

    afterInitialize(): any {}

    beforeStart(): any {}

    onStart(): any {}

    afterStart(): any {}

    beforeStop(): any {}

    onStop(): any {}

    afterStop(): any {}

    beforeReset(): any {}

    onReset(): any {}

    afterReset(): any {}

    beforeShutdown(): any {}

    onShutdown(): any {}

    afterShutdown(): any {}
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

  beforeAll(() => {
    currentEnv = getenv.string('NODE_ENV');
    for (const method of lifeCycleHooks) {
      vi.spyOn(MyModule.prototype, method as any);
    }
  });

  beforeEach(() => {
    app = mock<types.App>();
    app.config = new AppConfig();
    logger = mock<types.Logger>();
    injector = mock<types.Injector>();

    generateId = vi.spyOn(AppConfig, "generateId");
    generatedId = 'my-app-id';
    generateId.mockReturnValue(generatedId);

    injector.getAsync.calledWith(BINDINGS.log).mockReturnValue(logger);
    injector.findByScope.calledWith('Singleton').mockReturnValue([]);
  });

  afterEach(() => {
    generateId.mockRestore();
    process.env.NODE_ENV = currentEnv;

    for (const method of lifeCycleHooks) {
      (MyModule.prototype as any)[method].mockReset();
    }
  });

  it(`has StatefulTrait in composition chain`, () => {
    expect(derived(Module.prototype, StatefulTrait)).toBe(true);
  });

  describe('construction', () => {
    it('initializes dependent submodules as empty array', () => {
      const module = new MyModule();
      expect(module.modules).toBeInstanceOf(Array);
      expect(module.modules).toHaveLength(0);
    });

    it('initializes configuration and instance of Config', () => {
      const module = new MyModule();
      expect(module.config).toBeInstanceOf(Config);
    });

    it('takes props with: modules as an array with instances implementing Module interface and assigns it', () => {
      const modules = [new MyModule()];
      const module = new MyModule({
        modules,
      });
      expect(module.modules).toEqual(modules);
    });

    it(`takes props with: config instance implementing Configurable interface and assigns it`, () => {
      @Type('MyConfig', { isRegistrable: false })
      class MyConfig extends Config {
        foo: string;

        bar: number;

        constructor(props: Partial<MyConfig>) {
          super();
          Object.assign(this, this.processProps(props));
        }
      }

      const config = new MyConfig({ foo: 'first', bar: 2 });
      expect(new MyModule({ config }).config).toEqual(config);
    });

    it('sets the constructed state on construction', () => {
      const module = new MyModule();
      expect(module.isInState(Module.STATES.constructed)).toBe(true);
    });

    it(`throws InvalidModuleError error if provided submodule does not implement Module interface`, () => {
      class InvalidModule {}
      expect(() => {
        new MyModule({
          modules: [new InvalidModule()],
        });
      }).toThrow(
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
      }).toThrow(
        InvalidConfigError,
        `Module: configuration must be an instance implementing Configurable interface, got {}`
      );
    });
  });

  describe('initialization', () => {
    it('throws an AppMissingError if no application is provided', async () => {
      await expect(
        new MyModule().initialize(undefined as any, undefined as any)
      ).rejects.toThrow(
        AppMissingError,
        `Instance of App is required to initialize module`
      );
    });

    it('throws an InjectorMissingError if injector is not provided', async () => {
      await expect(
        new MyModule().initialize(app, undefined as any)
      ).rejects.toThrow(
        InjectorMissingError,
        `Instance of Injector is required to initialize module`
      );
    });

    it('can be only initialized once', async () => {
      const module = new MyModule();
      // First initialization
      // Initialize module once so it changes state from constructed to initialized.
      await module.initialize(app, injector);
      expect(module.isInState(Module.STATES.initialized)).toBe(true);

      // Since logger is assigned to module on initialization after verifying that
      // current state allows initialization to proceed - we unset previously initialized logger
      // to test if initialization can run more then once.
      delete (module as any).log;

      // Second initialization of already initialized module
      await module.initialize(app, injector);
      expect((module as any).log).toBeUndefined();
    });

    it(`initializes logger and logs initialization stage before initializing submodules`, async () => {
      const submodule = mock<types.Module>();
      submodule.state = Module.STATES.constructed;
      submodule.config = mock<types.Configurable>();
      const module = new MyModule({
        modules: [submodule],
      });

      await module.initialize(app, injector);
      expect(module.log).toBe(logger);
      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`initializing`)
          .on(module)
          .in(module.initialize)
          .with('arguments', [app, injector])
      ));
      expect(logger.debug).toHaveBeenCalled(); expect(submodule.initialize as any).toHaveBeenCalled(); /* TODO: verify call order */;
    });

    describe('merging with application configuration', () => {
      it('throws InvalidAppConfigError if configuration on application is not instance of AppConfig', async () => {
        class MyApp {
          config: any;

          initialize(): void {}

          start(): void {}

          stop(): void {}

          reset(): void {}

          shutdown(): void {}

          invokeAction(): void {}
        }

        const module = new MyModule({});
        await expect(
          module.initialize(new MyApp() as any, injector)
        ).rejects.toThrow(
          InvalidAppConfigError,
          `Configuration provided for application must be an instance of AppConfig, got undefined`
        );
      });

      it(`merges module configuration with application and replaces module's configuration with the one from app`, async () => {
        @Type('MyAppConfig', { isRegistrable: false })
        class MyAppConfig extends AppConfig {
          foo: string;

          bar: number;

          constructor(props: Partial<MyAppConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @Type('MyModuleConfig', { isRegistrable: false })
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
            Pulse: {
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
          schemaVersion: PropTypes.instanceOf(Number).isOptional,
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
            Pulse: PropTypes.shape({
              CommandScheduler: PropTypes.object.isOptional,
            }).isOptional,
          }).isOptional,
          eveble: PropTypes.instanceOf(EvebleConfig).isOptional,
          foo: PropTypes.instanceOf(String),
          bar: PropTypes.instanceOf(Number),
          baz: PropTypes.instanceOf(Boolean),
          qux: PropTypes.instanceOf(String),
        };

        expect(app.config).toEqual(expectedAppConfig);
        expect(module.config).not.toEqual(moduleConfig);
        expect(module.config).toEqual(expectedAppConfig);
        expect(appConfig.getPropTypes()).toEqual(expectedPropTypes);
      });

      it(`ensures that module configuration is not overriding already set properties on app configuration`, async () => {
        @Type('MyAppConfig', { isRegistrable: false })
        class MyAppConfig extends AppConfig {
          foo: string;

          bar: string;

          constructor(props: Partial<MyAppConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @Type('MyModuleConfig', { isRegistrable: false })
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
            Pulse: {
              CommandScheduler: {
                processEvery: 180000,
              },
            },
          },
          eveble: new EvebleConfig(),
          foo: 'app-foo',
          bar: 'app-bar',
        };

        expect(app.config).toEqual(expectedAppConfig);
      });

      it('log merging module configuration with the one from application', async () => {
        const configuration = new Config();
        const module = new MyModule({ configuration });

        await module.initialize(app, injector);
        expect(logger.debug).toHaveBeenCalledWith(
          new Log(`merging module configuration with application`)
            .on(module)
            .in('mergeConfigWithApp')
        );
      });
    });

    it('invokes the beforeInitialize method on itself', async () => {
      const module = new MyModule();
      module.beforeInitialize = vi.fn();

      await module.initialize(app, injector);
      expect(module.beforeInitialize).toHaveBeenCalledTimes(1);
      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`beforeInitialize`).on(module).in('runBeforeInitializeHooks')
      ));
    });

    it('invokes the onInitialize method on itself', async () => {
      const module = new MyModule();
      module.onInitialize = vi.fn();

      await module.initialize(app, injector);
      expect(module.onInitialize).toHaveBeenCalledTimes(1);
      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`onInitialize`).on(module).in('runOnInitializeHooks')
      ));
    });

    it('invokes the afterInitialize method on itself', async () => {
      const module = new MyModule();
      module.afterInitialize = vi.fn();
      await module.initialize(app, injector);
      expect(module.afterInitialize).toHaveBeenCalledTimes(1);
      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`afterInitialize`).on(module).in('runAfterInitializeHooks')
      ));
    });

    it('ensures that order of: before, on, after for initialization hooks is correct', async () => {
      const module = new MyModule();
      module.beforeInitialize = vi.fn();
      module.onInitialize = vi.fn();
      module.afterInitialize = vi.fn();

      await module.initialize(app, injector);
      expect(module.beforeInitialize).toHaveBeenCalled(); expect(
        module.onInitialize as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
      expect(module.onInitialize).toHaveBeenCalled(); expect(
        module.afterInitialize as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
      expect(module.afterInitialize).toHaveBeenCalled(); expect(
        module.onInitialize as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
    });

    it('injects dependencies into the module at initialization stage', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      expect(injector.injectIntoAsync).toHaveBeenCalledWith(module);
    });

    it('sets the initialized state correctly on last stage', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      expect(module.isInState(Module.STATES.initialized)).toBe(true);
    });

    describe(`submodules`, () => {
      it('initializes submodules of module', async () => {
        const submodule1 = mock<types.Module>();
        submodule1.state = Module.STATES.constructed;
        submodule1.config = mock<types.Configurable>();
        const submodule2 = mock<types.Module>();
        submodule2.state = Module.STATES.constructed;
        submodule2.config = mock<types.Configurable>();

        const module = new MyModule({
          modules: [submodule1, submodule2],
        });
        await module.initialize(app, injector);
        expect(submodule1.initialize).toHaveBeenCalledTimes(1);
        expect(submodule1.initialize).toHaveBeenCalledWith(app, injector);
        expect(submodule2.initialize).toHaveBeenCalledTimes(1);
        expect(submodule2.initialize).toHaveBeenCalledWith(app, injector);
      });
    });
  });

  describe('starting', () => {
    it('throws InvalidStateError when starting not initialized module', async () => {
      const module = new MyModule();
      await expect(module.start()).rejects.toThrow(
        InvalidStateError,
        `MyModule: expected current state of 'constructed' to be in one of states: 'initialized, stopped, running'`
      );
    });

    it('sets the state to running', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      expect(module.isInState(Module.STATES.running)).toBe(true);
      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(new Log(`start`).on(module)));
    });

    it('invokes start action on sub modules', async () => {
      const submodule1 = new MyModule();
      const submodule2 = new MyModule();
      // Can't create stubbed instance like in `initializes submodule of module` example
      // do to sinon limitation resolved around spy & how 'invokeAction' is
      // running in conjunction with 'invokeActionOnDependentModules'
      const startSpy1 = vi.spyOn(submodule1, "start");
      const startSpy2 = vi.spyOn(submodule2, "start");
      const module = new MyModule({
        modules: [submodule1, submodule2],
      });
      await module.initialize(app, injector);
      await module.start();
      expect(startSpy1).toHaveBeenCalledTimes(1);
      expect(startSpy2).toHaveBeenCalledTimes(1);
    });

    it('ignores start calls on a running module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      await module.start(); // Start module for second time
      expect(MyModule.prototype.beforeStart).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onStart).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterStart).toHaveBeenCalledTimes(1);
    });

    it('allows to restart stopped module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      expect(module.isInState(Module.STATES.running)).toBe(true);
      await module.stop();
      expect(module.isInState(Module.STATES.stopped)).toBe(true);
      await module.start();
      expect(module.isInState(Module.STATES.running)).toBe(true);
    });

    it(`runs start lifecycle hooks`, async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`beforeStart`).on(module)
      ));
      expect(MyModule.prototype.beforeStart).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.beforeStart).toHaveBeenCalled(); expect(
        MyModule.prototype.onStart as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(new Log(`onStart`).on(module)));
      expect(MyModule.prototype.onStart).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onStart).toHaveBeenCalled(); expect(
        MyModule.prototype.afterStart as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`afterStart`).on(module)
      ));
      expect(MyModule.prototype.afterStart).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterStart).toHaveBeenCalled(); expect(
        MyModule.prototype.onStart as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
    });
  });

  describe('stopping', async () => {
    it('throws InvalidStateError when stopping not initialized module', async () => {
      const module = new MyModule();

      return expect(module.stop()).rejects.toThrow(
        InvalidStateError,
        `MyModule: expected current state of 'constructed' to be in one of states: 'initialized, stopped, running'`
      );
    });

    it('sets the state to stopped', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.stop();
      expect(module.isInState(Module.STATES.stopped)).toBe(true);
    });

    it('invokes stop action on sub modules', async () => {
      const submodule1 = new MyModule();
      const submodule2 = new MyModule();
      // Can't create stubbed instance like in `initializes submodule of module` example
      // do to sinon limitation resolved around spy & how 'invokeAction' is running in conjunction
      // with invokeActionOnDependentModules
      const stopSpy1 = vi.spyOn(submodule1, "stop");
      const stopSpy2 = vi.spyOn(submodule2, "stop");

      const module = new MyModule({
        modules: [submodule1, submodule2],
      });
      await module.initialize(app, injector);
      await module.stop();
      expect(stopSpy1).toHaveBeenCalledTimes(1);
      expect(stopSpy2).toHaveBeenCalledTimes(1);
    });

    it('ignores stop calls on a stopped module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.stop();
      await module.stop(); // Stops module for second time

      expect(MyModule.prototype.beforeStop).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onStop).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterStop).toHaveBeenCalledTimes(1);
    });

    it(`runs stop lifecycle hooks`, async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.stop();

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`beforeStop`).on(module)
      ));
      expect(MyModule.prototype.beforeStop).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.beforeStop).toHaveBeenCalled(); expect(
        MyModule.prototype.onStop as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(new Log(`onStop`).on(module)));
      expect(MyModule.prototype.onStop).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onStop).toHaveBeenCalled(); expect(
        MyModule.prototype.afterStop as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`afterStop`).on(module)
      ));
      expect(MyModule.prototype.afterStop).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterStop).toHaveBeenCalled(); expect(
        MyModule.prototype.onStop as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
    });
  });

  describe('shutdown', () => {
    it('sets the state to shutdown after initialization of module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.shutdown();
      expect(module.isInState(Module.STATES.shutdown)).toBe(true);
    });

    it('sets the state to shutdown on running module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      await module.shutdown();
      expect(module.isInState(Module.STATES.shutdown)).toBe(true);
    });

    it('sets the state to shutdown on stopped module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.stop();
      await module.shutdown();
      expect(module.isInState(Module.STATES.shutdown)).toBe(true);
    });

    it('invokes shutdown action on sub modules', async () => {
      const submodule1 = new MyModule();
      const submodule2 = new MyModule();
      // Can't create stubbed instance like in `initializes submodule of module` example
      // do to sinon limitation resolved around spy & how 'invokeAction' is running in conjunction
      // with _invokeActionOnDependentModules
      const shutdownSpy1 = vi.spyOn(submodule1, "shutdown");
      const shutdownSpy2 = vi.spyOn(submodule2, "shutdown");

      const module = new MyModule({
        modules: [submodule1, submodule2],
      });
      await module.initialize(app, injector);
      await module.shutdown();
      expect(shutdownSpy1).toHaveBeenCalledTimes(1);
      expect(shutdownSpy2).toHaveBeenCalledTimes(1);
    });

    it('ignores shutdown calls on a shutdown module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.shutdown();
      await module.shutdown(); // Shutdown module for second time

      expect(MyModule.prototype.beforeShutdown).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onShutdown).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterShutdown).toHaveBeenCalledTimes(1);
    });

    it('ensures that module is stopped before shutdown', async () => {
      const module = new MyModule();
      const stopSpy = vi.spyOn(module, "stop");
      await module.initialize(app, injector);
      await module.start();
      await module.shutdown();

      expect(stopSpy).toHaveBeenCalledTimes(1);
    });

    it(`runs shutdown lifecycle hooks`, async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.shutdown();

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`beforeShutdown`).on(module)
      ));
      expect(MyModule.prototype.beforeShutdown).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.beforeShutdown).toHaveBeenCalled(); expect(
        MyModule.prototype.onShutdown as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`onShutdown`).on(module)
      ));
      expect(MyModule.prototype.onShutdown).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onShutdown).toHaveBeenCalled(); expect(
        MyModule.prototype.afterShutdown as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`afterShutdown`).on(module)
      ));
      expect(MyModule.prototype.afterShutdown).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterShutdown).toHaveBeenCalled(); expect(
        MyModule.prototype.onShutdown as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
    });
  });

  describe('resetting', async () => {
    it('throws InvalidStateError when resetting not initialized module', async () => {
      const module = new MyModule();

      return expect(module.reset()).rejects.toThrow(
        InvalidStateError,
        `MyModule: expected current state of 'constructed' to be in one of states: 'initialized, stopped, running'`
      );
    });

    describe(`invalid environment`, async () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it('throws InvalidEnvironmentError to reject attempts to reset on production environment', async () => {
        process.env.NODE_ENV = 'production';

        const module = new MyModule();
        await module.initialize(app, injector);

        return expect(module.reset()).rejects.toThrow(
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

      expect(MyModule.prototype.beforeReset).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onReset).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterReset).toHaveBeenCalledTimes(1);
    });

    it('allows to reset module again after starting module', async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.reset();
      await module.start();
      await module.reset(); // Reset module second time

      expect(MyModule.prototype.beforeReset).toHaveBeenCalledTimes(2);
      expect(MyModule.prototype.onReset).toHaveBeenCalledTimes(2);
      expect(MyModule.prototype.afterReset).toHaveBeenCalledTimes(2);
    });

    it(`runs reset lifecycle hooks`, async () => {
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.reset();
      expect(MyModule.prototype.beforeReset).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onReset).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterReset).toHaveBeenCalledTimes(1);

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`beforeReset`).on(module)
      ));
      expect(MyModule.prototype.beforeReset).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.beforeReset).toHaveBeenCalled(); expect(
        MyModule.prototype.onReset as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;

      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(new Log(`onReset`).on(module)));
      expect(MyModule.prototype.onReset).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.onReset).toHaveBeenCalled(); expect(
        MyModule.prototype.afterReset as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
      expect(logger.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`afterReset`).on(module)
      ));
      expect(MyModule.prototype.afterReset).toHaveBeenCalledTimes(1);
      expect(MyModule.prototype.afterReset).toHaveBeenCalled(); expect(
        MyModule.prototype.onReset as any
      ).toHaveBeenCalled(); /* TODO: verify call order */;
    });

    it('invokes reset action on sub modules', async () => {
      const submodule1 = new MyModule();
      const submodule2 = new MyModule();
      // Can't create stubbed instance like in `initializes submodule of module` example
      // do to sinon limitation resolved around spy & how 'invokeAction' is running in conjunction
      // with _invokeActionOnDependentModules
      const resetSpy1 = vi.spyOn(submodule1, "reset");
      const resetSpy2 = vi.spyOn(submodule2, "reset");

      const module = new MyModule({
        modules: [submodule1, submodule2],
      });
      await module.initialize(app, injector);
      await module.reset();
      expect(resetSpy1).toHaveBeenCalledTimes(1);
      expect(resetSpy2).toHaveBeenCalledTimes(1);
    });

    it(`restarts already running module to running state`, async () => {
      const stop = vi.spyOn(MyModule.prototype, "stop");
      const module = new MyModule();
      await module.initialize(app, injector);
      await module.start();
      expect(module.isInState(Module.STATES.running)).toBe(true);

      const start = vi.spyOn(MyModule.prototype, "start");
      await module.reset();
      expect(start).toHaveBeenCalledTimes(1);
      expect(stop).toHaveBeenCalledTimes(1);
      expect(module.isInState(Module.STATES.running)).toBe(true);
    });
  });

  describe(`evaluation`, () => {
    describe(`environment`, () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it(`returns true if environment is set to production`, () => {
        process.env.NODE_ENV = 'production';
        expect(Module.prototype.isInProduction()).toBe(true);
      });

      it(`returns false if environment is not set to production`, () => {
        expect(Module.prototype.isInProduction()).toBe(false);
      });
    });
  });
});

