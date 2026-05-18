import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, vi, beforeAll } from 'vitest';

import {
  Container,
  postConstruct,
  injectable,
  BindToFluentSyntax,
} from 'inversify';
import * as winston from 'winston';
import chalk from 'chalk';
import getenv from 'getenv';
import { Type, kernel } from '@eveble/core';
import { BaseApp } from '../../../src/core/base-app';
import { Module } from '../../../src/core/module';
import { Log } from '../../../src/components/log-entry';

import { BINDINGS } from '../../../src/constants/bindings';
import { AppConfig } from '../../../src/configs/app-config';
import {
  InvalidModuleError,
  InvalidAppConfigError,
} from '../../../src/core/core-errors';
import { types } from '../../../src/types';
import { Config } from '../../../src/components/config';
import { LoggingConfig } from '../../../src/configs/logging-config';
import { Logger } from '../../../src/core/logger';
import { ConsoleTransport } from '../../../src/core/logging-transports/console-transport';
import { EvebleConfig } from '../../../src/configs/eveble-config';
import { Injector } from '../../../src/core/injector';

describe('BaseApp', () => {
  class MyApp extends BaseApp {
    beforeInitialize(): any {
      return undefined;
    }

    onInitialize(): any {
      return undefined;
    }

    afterInitialize(): any {
      return undefined;
    }

    beforeStart(): any {
      return undefined;
    }

    onStart(): any {
      return undefined;
    }

    afterStart(): any {
      return undefined;
    }

    beforeStop(): any {
      return undefined;
    }

    onStop(): any {
      return undefined;
    }

    afterStop(): any {
      return undefined;
    }

    beforeReset(): any {
      return undefined;
    }

    onReset(): any {
      return undefined;
    }

    afterReset(): any {
      return undefined;
    }

    beforeShutdown(): any {
      return undefined;
    }

    onShutdown(): any {
      return undefined;
    }

    // afterShutdown is set on BaseApp
  }
  class MyModule extends Module {}

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

  let log: any;
  let generateId: any;
  let generatedId: string;
  let injector: any;
  let binding: any;
  let originalAppId: any;
  let originalWorkerId: any;

  beforeAll(() => {
    for (const method of lifeCycleHooks) {
      vi.spyOn(MyApp.prototype, method as any);
    }
  });

  beforeEach(() => {
    // Remove env if present
    originalAppId = getenv.string('APP_ID', '');
    originalWorkerId = getenv.string('WORKER_ID', '');
    delete process.env.APP_ID;
    delete process.env.WORKER_ID;

    kernel.setInjector(undefined as any);

    log = mock<types.Logger>();
    injector = mock<types.Injector>();
    binding = mock<BindToFluentSyntax<any>>();
    injector.bind.mockReturnValue(binding);
    injector.findByScope.calledWith('Singleton').mockReturnValue([]);

    generateId = vi.spyOn(AppConfig, "generateId");
    generatedId = 'my-generated-id';
    generateId.mockReturnValue(generatedId);
  });

  afterEach(() => {
    generateId.mockRestore();

    for (const method of lifeCycleHooks) {
      (MyApp.prototype as any)[method].mockReset();
    }
    kernel.setInjector(undefined as any);

    // Restore env if present
    if (originalAppId.length > 0) {
      process.env.APP_ID = originalAppId;
    } else {
      process.env.APP_ID = undefined;
    }
    if (originalWorkerId.length > 0) {
      process.env.WORKER_ID = originalWorkerId;
    } else {
      process.env.WORKER_ID = undefined;
    }
  });

  it('extends Module', () => {
    expect(BaseApp.prototype).toBeInstanceOf(Module);
  });

  describe('construction', () => {
    describe('modules', () => {
      it('initializes modules on application as empty array', () => {
        const app = new MyApp();
        expect(app.modules).toBeInstanceOf(Array);
        expect(app.modules).toHaveLength(0);
      });

      it('takes an props object with modules property as array and assigns it', () => {
        const modules = [new MyModule()];
        const app = new MyApp({
          modules,
        });
        expect(app.modules).toEqual(modules);
      });

      it(`throws InvalidModuleError error if provided module in list does not inherit from Module`, () => {
        class InvalidModule {}
        expect(() => {
          new MyApp({
            modules: [new InvalidModule()],
          });
        }).toThrow(
          InvalidModuleError,
          `App: dependent modules must be instance of Module, got InvalidModule`
        );
      });
    });

    describe('configuration', () => {
      it(`initializes with AppConfig instance if configuration its not provided on construction`, () => {
        const app = new MyApp({});
        expect(app.config).toBeInstanceOf(AppConfig);
        expect(typeof (app.config as AppConfig).appId).toBe('string');
      });

      it('takes an props object with: config property as AppConfig and assigns it', () => {
        const config = new AppConfig({
          appId: 'my-custom-app-id',
        });
        const app = new MyApp({
          config,
        });
        expect(app.config).toBeInstanceOf(AppConfig);
        expect(app.config).toEqual(config);
      });

      it(`generates by default identifier for application as uuid`, () => {
        const app = new MyApp({});
        expect((app.config as AppConfig).appId).toBe(generatedId);
      });

      it(`generates by default identifier for worker as uuid`, () => {
        const app = new MyApp({});
        expect((app.config as AppConfig).workerId).toBe(generatedId);
      });

      it(`throws InvalidAppConfigError error if provided configuration does not inherit from AppConfig`, () => {
        class InvalidAppConfig {}
        expect(() => {
          new MyApp({
            config: InvalidAppConfig,
          });
        }).toThrow(
          InvalidAppConfigError,
          `Configuration provided for application must be an instance of AppConfig, got InvalidAppConfig`
        );
      });
    });

    it('creates a new injector instance if none was given on construction', async () => {
      const app = new MyApp({});
      expect(app.injector).toBeInstanceOf(Container);
    });

    it('uses the provided injector on construction when given', async () => {
      const app = new MyApp({
        injector,
      });
      expect(app.injector).toBe(injector);
    });
  });

  describe(`initialization`, () => {
    it('does not initialize the application on construction', async () => {
      const initializeSpy = vi.spyOn(BaseApp.prototype, "initialize");
      new MyApp({});
      expect(initializeSpy).not.toHaveBeenCalled();
      initializeSpy.mockRestore();
    });

    it('can be only initialized once', async () => {
      const app = new MyApp({
        injector,
      });
      // First initialization: initialize app once so it changes state from constructed to
      // initialized
      await app.initialize();
      expect(app.isInState(MyApp.STATES.initialized)).toBe(true);
      app.setState = vi.fn();
      // Initialize app for second time
      await app.initialize();
      expect(app.setState).not.toHaveBeenCalled();
    });

    it('initializes modules of application', async () => {
      const module1 = mock<types.Module>();
      module1.state = Module.STATES.constructed;
      module1.config = mock<types.Configurable>();
      const module2 = mock<types.Module>();
      module2.state = Module.STATES.constructed;
      module2.config = mock<types.Configurable>();

      const app = new MyApp({
        modules: [module1, module2],
        injector,
      });
      await app.initialize();

      expect(module1.initialize).toHaveBeenCalledTimes(1);
      expect(module1.initialize).toHaveBeenCalledWith(app, app.injector);
      expect(module2.initialize).toHaveBeenCalledTimes(1);
      expect(module2.initialize).toHaveBeenCalledWith(app, app.injector);
    });

    it('sets the initialized state correctly on last stage', async () => {
      const app = new MyApp({
        injector,
      });
      await app.initialize();
      expect(app.isInState(MyApp.STATES.initialized)).toBe(true);
    });

    it(`runs initializing hooks`, async () => {
      const app = new MyApp({
        injector,
      });
      await app.initialize();

      expect(app.beforeInitialize).toHaveBeenCalledTimes(1);
      expect(app.onInitialize).toHaveBeenCalledTimes(1);
      expect(app.afterInitialize).toHaveBeenCalledTimes(1);
    });

    it('ensures that order of: before, on, after for initialization hooks is correct', async () => {
      const app = new MyApp({
        injector,
      });
      await app.initialize();

      expect(app.beforeInitialize).toHaveBeenCalledBefore(
        app.onInitialize as any
      );
      expect(app.onInitialize).toHaveBeenCalledBefore(
        app.afterInitialize as any
      );
      expect(app.afterInitialize).toHaveBeenCalledAfter(
        app.onInitialize as any
      );
    });

    describe('on configuration', () => {
      describe('configuring kernel', () => {
        it('sets the injector on kernel', async () => {
          const app = new MyApp({
            injector,
          });
          await app.initialize();
          expect(kernel.injector).toBe(injector);
        });
      });

      describe('creating bindings on injector', () => {
        describe('binding kernel dependencies', () => {
          it('binds converter instance as constant value', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).toHaveBeenCalledWith(
              BINDINGS.Converter
            );
            expect(binding.toConstantValue).toHaveBeenCalledWith(
              kernel.converter
            );
          });

          it('binds validator instance as constant value', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).toHaveBeenCalledWith(
              BINDINGS.Validator
            );
            expect(binding.toConstantValue).toHaveBeenCalledWith(
              kernel.validator
            );
          });

          it('binds describer instance as constant value', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).toHaveBeenCalledWith(
              BINDINGS.Describer
            );
            expect(binding.toConstantValue).toHaveBeenCalledWith(
              kernel.describer
            );
          });

          it('binds library instance as constant value', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).toHaveBeenCalledWith(
              BINDINGS.Library
            );
            expect(binding.toConstantValue).toHaveBeenCalledWith(
              kernel.library
            );
          });
        });

        describe('binding app dependencies', () => {
          it('binds injector instance with itself(as constant value)', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).toHaveBeenCalledWith(
              BINDINGS.Injector
            );
            expect(binding.toConstantValue).toHaveBeenCalledWith(
              injector
            );
          });

          it('binds config instance to constant value', async () => {
            const config = new AppConfig({
              appId: 'my-custom-app-id',
            });
            const app = new MyApp({
              injector,
              config,
            });
            await app.initialize();
            expect(injector.bind).toHaveBeenCalledWith(
              BINDINGS.Config
            );
            expect(binding.toConstantValue).toHaveBeenCalledWith(
              config
            );
          });
        });

        describe('binding external dependencies', () => {
          describe('winston', () => {
            it('binds winston to constant value', async () => {
              const app = new MyApp({
                injector,
              });
              await app.initialize();
              expect(injector.bind).toHaveBeenCalledWith(
                BINDINGS.winston
              );
              expect(binding.toConstantValue).toHaveBeenCalledWith(
                winston
              );
            });

            it('ensures to not override existing binding of winston set prior to initialization', async () => {
              const app = new MyApp({
                injector,
              });
              injector.isBound.calledWith(BINDINGS.winston).mockReturnValue(true);
              await app.initialize();
              expect(injector.bind).not.toHaveBeenCalledWith(BINDINGS.winston);
            });
          });
          describe('chalk', () => {
            it('binds chalk to constant value', async () => {
              const app = new MyApp({
                injector,
              });
              await app.initialize();
              expect(injector.bind).toHaveBeenCalledWith(
                BINDINGS.chalk
              );
              expect(binding.toConstantValue).toHaveBeenCalledWith(
                chalk
              );
            });

            it('ensures to not override existing binding of chalk set prior to initialization', async () => {
              const app = new MyApp({
                injector,
              });
              injector.isBound.calledWith(BINDINGS.chalk).mockReturnValue(true);
              await app.initialize();
              expect(injector.bind).not.toHaveBeenCalledWith(BINDINGS.chalk);
            });
          });
        });
      });
    });

    describe('initializes singletons', () => {
      it('logs initialization of singletons', async () => {
        const ioc = new Injector();
        ioc.bind<types.Logger>(BINDINGS.log).toConstantValue(log);

        const app = new MyApp({
          modules: [],
          injector: ioc,
        });

        await app.initialize();
        expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
          new Log(`initializing singletons`).on(app).in('initializeSingletons')
        ));
        await app.shutdown();
      });

      it('initializes all registered singletons as strings on injector', async () => {
        const spy = vi.fn();
        @injectable()
        class MyClass {
          @postConstruct()
          initialize(): void {
            spy();
          }
        }
        const ioc = new Injector();
        ioc.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
        const app = new MyApp({
          modules: [], injector: ioc,
        });
        app.injector.bind<MyClass>('MyClass').to(MyClass).inSingletonScope();
        await app.initialize();
        expect(spy).toHaveBeenCalledTimes(1);
        await app.shutdown();
      });

      it('initializes all registered singletons as symbols on injector', async () => {
        const spy = vi.fn();
        @injectable()
        class MyClass {
          @postConstruct()
          initialize(): void {
            spy();
          }
        }

        const symbolIdentifier = Symbol.for('MyClass');
        const ioc = new Injector();
        ioc.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
        const app = new MyApp({
          modules: [], injector: ioc,
        });
        app.injector
          .bind<MyClass>(symbolIdentifier)
          .to(MyClass)
          .inSingletonScope();
        await app.initialize();
        expect(spy).toHaveBeenCalledTimes(1);
        await app.shutdown();
      });

      it('ensures that all registered singletons are resolved in asynchronous mode', async () => {
        const ioc = new Injector();
        ioc.bind<types.Logger>(BINDINGS.log).toConstantValue(log);

        @injectable()
        class MyClass {}
        const app = new MyApp({
          modules: [],
          injector: ioc,
        });

        ioc.findByScope = vi.fn().mockReturnValue(['MyClass']);
        const getAsync = vi.spyOn(ioc, "getAsync");

        app.injector.bind<MyClass>('MyClass').to(MyClass).inSingletonScope();

        await app.initialize();
        expect(ioc.findByScope).toHaveBeenCalledTimes(1);
        expect(ioc.findByScope).toHaveBeenCalledWith('Singleton');
        expect(getAsync).toHaveBeenCalledWith('MyClass');
        await app.shutdown();
      });
    });
  });

  describe(`logger`, () => {
    it(`initializes logger as instance of Logger`, async () => {
      const app = new MyApp({
        injector,
      });
      await app.initialize();
      expect(app.log).toBeInstanceOf(Logger);
    });

    it(`does not initialize logger if its mapped on Injector as 'log' prior to initialization`, async () => {
      injector.isBound.calledWith(BINDINGS.log).mockReturnValue(true);
      injector.get.calledWith(BINDINGS.log).mockReturnValue(log);

      const app = new MyApp({
        injector,
      });

      await app.initialize();
      expect(app.log).toBe(log);
    });

    it(`binds logger to injector`, async () => {
      const app = new MyApp({});
      await app.initialize();

      expect(app.injector.get<types.Logger>(BINDINGS.log)).toBeInstanceOf(
        Logger
      );
    });

    it(`ensures that logger has console transport added by default`, async () => {
      const app = new MyApp({});

      await app.initialize();
      const logger = app.log as types.Logger;
      expect(logger).toBeInstanceOf(Logger);
      expect(logger.hasTransport(BINDINGS.console)).toBe(true);
      expect(logger.getTransport(BINDINGS.console)).toBeInstanceOf(
        ConsoleTransport
      );
    });

    it(`initializes logger and logs initialization stage before initializing submodules`, async () => {
      injector.isBound.calledWith(BINDINGS.log).mockReturnValue(true);
      injector.get.calledWith(BINDINGS.log).mockReturnValue(log);

      const module = mock<types.Module>();
      module.state = Module.STATES.constructed;
      module.config = mock<types.Configurable>();

      const app = new MyApp({
        modules: [module],
        injector,
      });

      await app.initialize();
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`initialize`).on(app).in('initialize')
      ));
      expect(log.debug).toHaveBeenCalledBefore(module.initialize as any);
    });

    it(`shows simple start log`, async () => {
      injector.isBound.calledWith(BINDINGS.log).mockReturnValue(true);
      injector.get.calledWith(BINDINGS.log).mockReturnValue(log);
      const consoleTransport = mock<types.LogTransport>();
      log.hasTransport.calledWith(BINDINGS.console).mockReturnValue(true);
      log.getTransport.calledWith(BINDINGS.console).mockReturnValue(consoleTransport);

      const config = new AppConfig({});
      const startMessage = 'start';
      config.set(`logging.transports.console.messages.start`, startMessage);
      const app = new MyApp({
        config,
        injector,
      });

      await app.initialize();
      expect(consoleTransport.info).toHaveBeenCalledWith(expect.objectContaining(new Log('start')));
      expect(consoleTransport.info).toHaveBeenCalledBefore(log.debug);
    });

    it(`starts logging if logging is enabled on application configuration`, async () => {
      const app = new MyApp({
        config: new AppConfig({
          logging: new LoggingConfig({
            isEnabled: true,
          }),
        }),
      });

      await app.initialize();
      expect((app.log as types.Logger).isInState(MyApp.STATES.running)).toBe(
        true
      );
    });

    it(`starts logging a custom logger if logging is enabled on application configuration`, async () => {
      injector.isBound.calledWith(BINDINGS.log).mockReturnValue(true);
      injector.get.calledWith(BINDINGS.log).mockReturnValue(log);

      const app = new MyApp({
        config: new AppConfig({
          logging: new LoggingConfig({
            isEnabled: true,
          }),
        }),
        injector,
      });

      await app.initialize();
      expect(log.start).toHaveBeenCalledTimes(1);
    });

    it(`does not log if logging is disabled on application configuration`, async () => {
      const app = new MyApp({
        config: new AppConfig({
          logging: new LoggingConfig({
            isEnabled: false,
          }),
        }),
        injector,
      });

      await app.initialize();
      expect((app.log as Logger).isInState(Logger.STATES.constructed)).toBe(
        true
      );
    });

    it(`does not log on custom logger if logging is disabled on application configuration`, async () => {
      injector.isBound.calledWith(BINDINGS.log).mockReturnValue(true);
      injector.get.calledWith(BINDINGS.log).mockReturnValue(log);

      const app = new MyApp({
        config: new AppConfig({
          logging: new LoggingConfig({
            isEnabled: false,
          }),
        }),
        injector,
      });

      await app.initialize();
      expect(log.start).not.toHaveBeenCalled();
    });
  });

  describe('shutdown', () => {
    it(`logs shutdown stage`, async () => {
      injector.isBound.calledWith(BINDINGS.log).mockReturnValue(true);
      injector.get.calledWith(BINDINGS.log).mockReturnValue(log);

      const app = new MyApp({
        injector,
      });

      await app.initialize();
      await app.shutdown();
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`shutdown`).on(app).in('shutdown')
      ));
      expect(log.debug).toHaveBeenCalledBefore(app.afterShutdown as any);
    });

    it('stops logging after shutdown', async () => {
      injector.isBound.calledWith(BINDINGS.log).mockReturnValue(true);
      injector.get.calledWith(BINDINGS.log).mockReturnValue(log);

      const app = new MyApp({
        injector,
      });
      await app.initialize();
      await app.shutdown();
      expect(log.stop).toHaveBeenCalledTimes(1);
    });

    it(`shows simple exit log`, async () => {
      injector.isBound.calledWith(BINDINGS.log).mockReturnValue(true);
      injector.get.calledWith(BINDINGS.log).mockReturnValue(log);
      const consoleTransport = mock<types.LogTransport>();
      log.hasTransport.calledWith(BINDINGS.console).mockReturnValue(true);
      log.getTransport.calledWith(BINDINGS.console).mockReturnValue(consoleTransport);

      const config = new AppConfig({});
      const exitMessage = 'exit';
      config.set(`logging.transports.console.messages.exit`, exitMessage);
      const app = new MyApp({
        config,
        injector,
      });

      await app.initialize();

      await app.stop();

      await app.shutdown();
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`shutdown`).on(app).in('shutdown')
      ));
      expect(consoleTransport.info).toHaveBeenCalledWith(expect.objectContaining(new Log(`exit`)));
      expect(log.debug).toHaveBeenCalled();
    });
  });

  describe(`configuration`, () => {
    /*
    CONFIGURATIONS
    */
    @Type('GrandchildModuleConfig')
    class GrandchildModuleConfig extends Config {
      root: string;

      grandchild?: {
        change: string;
        keep: string;
      };

      constructor(props?: Partial<GrandchildModuleConfig>) {
        super();
        Object.assign(this, this.processProps(props));
      }
    }

    @Type('ChildModuleConfig')
    class ChildModuleConfig extends Config {
      root: string;

      child?: {
        change: string;
        keep: string;
      };

      constructor(props?: Partial<ChildModuleConfig>) {
        super();
        Object.assign(this, this.processProps(props));
      }
    }

    @Type('MyAppConfig')
    class MyAppConfig extends AppConfig {
      root: string;

      change: string;

      keep: string;

      constructor(props?: Partial<MyAppConfig>) {
        super();
        Object.assign(this, this.processProps(props));
      }
    }

    /*
    MODULES
    */
    const grandchildConfig = new GrandchildModuleConfig({
      root: 'grandchild-root',
      grandchild: {
        change: 'grandchild-change',
        keep: 'grandchild-keep',
      },
    });

    const childConfig = new ChildModuleConfig({
      root: 'child-root',
      child: {
        change: 'child-change',
        keep: 'child-keep',
      },
    });

    class GrandchildModule extends Module {
      constructor() {
        super({
          config: grandchildConfig,
        });
      }
    }

    class ChildModule extends Module {
      constructor() {
        super({
          modules: [new GrandchildModule()],
          config: childConfig,
        });
      }
    }

    class TestApp extends BaseApp {
      constructor(props: types.Props) {
        super({
          ...props,
          modules: [new ChildModule()],
          config: new MyAppConfig({
            appId: 'my-app-id',
            workerId: 'my-worker-id',
            root: 'app-root',
            change: 'app-change',
            keep: 'app-keep',
            eveble: new EvebleConfig(),
          }),
        });
      }
    }

    it('merges configurations of all modules (deeply nested merge)', async () => {
      const app = new TestApp({
        injector,
      });
      await app.initialize();

      expect(app.config).toEqual({
        appId: 'my-app-id',
        workerId: 'my-worker-id',
        logging: new LoggingConfig(),
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
        change: 'app-change',
        keep: 'app-keep',
        root: 'app-root',
        child: {
          change: 'child-change',
          keep: 'child-keep',
        },
        grandchild: {
          change: 'grandchild-change',
          keep: 'grandchild-keep',
        },
      });
    });

    it('allows to set deeply nested app configuration on app runtime', async () => {
      const app = new TestApp({
        injector,
      });
      await app.initialize();

      app.configure({
        change: 'configured-change',
        child: {
          change: 'child-configured-change',
        },
        grandchild: {
          change: 'grandchild-configured-change',
        },
      });
      expect(app.config).toEqual({
        appId: 'my-app-id',
        workerId: 'my-worker-id',
        logging: new LoggingConfig(),
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
        change: 'configured-change',
        keep: 'app-keep',
        root: 'app-root',
        child: {
          change: 'child-configured-change',
          keep: 'child-keep',
        },
        grandchild: {
          change: 'grandchild-configured-change',
          keep: 'grandchild-keep',
        },
      });
    });
  });
});

