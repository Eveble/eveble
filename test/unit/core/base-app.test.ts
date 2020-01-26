import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import {
  Container,
  interfaces as inversifyTypes,
} from '@parisholley/inversify-async';
import * as winston from 'winston';
import { BaseApp } from '../../../src/core/base-app';
import { BaseModule } from '../../../src/core/base-module';
import { Log } from '../../../src/components/log-entry';
import { kernel } from '../../../src/core/kernel';
import { BINDINGS } from '../../../src/constants/bindings';
import { AppConfig } from '../../../src/configs/app-config';
import {
  InvalidModuleError,
  InvalidAppConfigError,
} from '../../../src/core/core-errors';
import { types } from '../../../src/types';
import { Config } from '../../../src/components/config';
import { define } from '../../../src/decorators/define';
import { LoggingConfig } from '../../../src/configs/logging-config';
import { Logger } from '../../../src/core/logger';
import { ConsoleTransport } from '../../../src/core/logging-transports/console-transport';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('BaseApp', function() {
  class MyApp extends BaseApp {
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

    // afterShutdown is set on BaseApp
  }
  class MyModule extends BaseModule {}

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
  ];

  let log: any;
  let generateId: any;
  let generatedId: string;
  let injector: any;
  let binding: any;

  before(() => {
    for (const method of lifeCycleHooks) {
      sinon.stub(MyApp.prototype, method as any);
    }
  });

  beforeEach(() => {
    kernel.injector = undefined;

    log = stubInterface<types.Logger>();
    injector = stubInterface<types.Injector>();
    binding = stubInterface<inversifyTypes.BindingToSyntax<any>>();
    injector.bind.returns(binding);

    generateId = sinon.stub(AppConfig, 'generateId');
    generatedId = 'my-app-id';
    generateId.returns(generatedId);
  });

  afterEach(() => {
    generateId.restore();

    for (const method of lifeCycleHooks) {
      (MyApp.prototype as any)[method].reset();
    }
  });

  it('extends BaseModule', () => {
    expect(BaseApp.prototype).to.be.instanceof(BaseModule);
  });

  describe('construction', () => {
    context('modules', () => {
      it('initializes modules on application as empty array', () => {
        const app = new MyApp();
        expect(app.modules).to.be.instanceof(Array);
        expect(app.modules).to.be.empty;
      });

      it('takes an props object with modules property as array and assigns it', () => {
        const modules = [new MyModule()];
        const app = new MyApp({
          modules,
        });
        expect(app.modules).to.eql(modules);
      });

      it(`throws InvalidModuleError error if provided module in list does not inherit from Module`, () => {
        class InvalidModule {}
        expect(() => {
          new MyApp({
            modules: [new InvalidModule()],
          });
        }).to.throw(
          InvalidModuleError,
          `App: dependent modules must be instance of Module, got InvalidModule`
        );
      });
    });

    context('configuration', () => {
      it(`initializes with AppConfig instance if configuration its not provided on construction`, () => {
        const app = new MyApp({});
        expect(app.config).to.be.instanceof(AppConfig);
        expect((app.config as AppConfig).appId).to.be.string;
      });

      it('takes an props object with: config property as AppConfig and assigns it', () => {
        const config = new AppConfig({
          appId: 'my-custom-app-id',
        });
        const app = new MyApp({
          config,
        });
        expect(app.config).to.instanceof(AppConfig);
        expect(app.config).to.eql(config);
      });

      it(`generates by default identifier for application as uuid`, () => {
        const app = new MyApp({});
        expect((app.config as AppConfig).appId).to.be.equal(generatedId);
      });

      it(`throws InvalidAppConfigError error if provided configuration does not inherit from AppConfig`, () => {
        class InvalidAppConfig {}
        expect(() => {
          new MyApp({
            config: InvalidAppConfig,
          });
        }).to.throw(
          InvalidAppConfigError,
          `Configuration provided for application must be an instance of AppConfig, got InvalidAppConfig`
        );
      });
    });

    it('creates a new injector instance if none was given on construction', async () => {
      const app = new MyApp({});
      expect(app.injector).to.be.instanceof(Container);
    });

    it('uses the provided injector on construction when given', async () => {
      const app = new MyApp({
        injector,
      });
      expect(app.injector).to.equal(injector);
    });
  });

  describe(`initialization`, () => {
    it('does not initialize the application on construction', async () => {
      const initializeSpy = sinon.spy(BaseApp.prototype, 'initialize');
      new MyApp({});
      expect(initializeSpy).to.have.not.be.called;
      initializeSpy.restore();
    });

    it('can be only initialized once', async () => {
      const app = new MyApp({
        injector,
      });
      // First initialization: initialize app once so it changes state from constructed to
      // initialized
      await app.initialize();
      expect(app.isInState(MyApp.STATES.initialized)).to.be.true;
      const setStateSpy = sinon.stub(BaseApp.prototype, 'setState');
      // Initialize app for second time
      await app.initialize();
      expect(setStateSpy).to.not.be.called;
    });

    it('initializes modules of application', async () => {
      const module1 = stubInterface<types.Module>();
      module1.config = stubInterface<types.Configurable>();
      const module2 = stubInterface<types.Module>();
      module2.config = stubInterface<types.Configurable>();

      const app = new MyApp({
        modules: [module1, module2],
        injector,
      });
      await app.initialize();

      expect(module1.initialize).to.been.calledOnce;
      expect(module1.initialize).to.been.calledWithExactly(app, app.injector);
      expect(module2.initialize).to.been.calledOnce;
      expect(module2.initialize).to.been.calledWithExactly(app, app.injector);
    });

    it('sets the initialized state correctly on last stage', async () => {
      const app = new MyApp({
        injector,
      });
      await app.initialize();
      expect(app.isInState(MyApp.STATES.initialized)).to.be.true;
    });

    it(`runs initalizing hooks`, async () => {
      const app = new MyApp({
        injector,
      });
      await app.initialize();

      expect(app.beforeInitialize).to.be.calledOnce;
      expect(app.onInitialize).to.be.calledOnce;
      expect(app.afterInitialize).to.be.calledOnce;
    });

    it('ensures that order of: before, on, after for initialization hooks is correct', async () => {
      const app = new MyApp({
        injector,
      });
      await app.initialize();

      expect(app.beforeInitialize).to.have.been.calledBefore(
        app.onInitialize as any
      );
      expect(app.onInitialize).to.have.been.calledBefore(
        app.afterInitialize as any
      );
      expect(app.afterInitialize).to.have.been.calledAfter(
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
          expect(kernel.injector).to.be.equal(injector);
        });
      });

      describe('creating bindings on injector', () => {
        context('binding kernel dependencies', () => {
          it('binds converter instance as constant value', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).to.have.been.calledWithExactly(
              BINDINGS.Converter
            );
            expect(binding.toConstantValue).to.have.been.calledWithExactly(
              kernel.converter
            );
          });

          it('binds validator instance as constant value', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).to.have.been.calledWithExactly(
              BINDINGS.Validator
            );
            expect(binding.toConstantValue).to.have.been.calledWithExactly(
              kernel.validator
            );
          });

          it('binds describer instance as constant value', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).to.have.been.calledWithExactly(
              BINDINGS.Describer
            );
            expect(binding.toConstantValue).to.have.been.calledWithExactly(
              kernel.describer
            );
          });

          it('binds library instance as constant value', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).to.have.been.calledWithExactly(BINDINGS.Library);
            expect(binding.toConstantValue).to.have.been.calledWithExactly(
              kernel.library
            );
          });
        });

        context('binding app dependencies ', () => {
          it('binds injector instance with itself(as constant value)', async () => {
            const app = new MyApp({
              injector,
            });
            await app.initialize();
            expect(injector.bind).to.have.been.calledWithExactly(
              BINDINGS.Injector
            );
            expect(binding.toConstantValue).to.have.been.calledWithExactly(
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
            expect(injector.bind).to.have.been.calledWithExactly(BINDINGS.Config);
            expect(binding.toConstantValue).to.have.been.calledWithExactly(
              config
            );
          });
        });

        context('binding external dependencies ', () => {
          context('winston', () => {
            it('binds winston to constant value', async () => {
              const app = new MyApp({
                injector,
              });
              await app.initialize();
              expect(injector.bind).to.have.been.calledWithExactly(
                BINDINGS.winston
              );
              expect(binding.toConstantValue).to.have.been.calledWithExactly(
                winston
              );
            });

            it('ensures to not override existing binding of winston set prior to initialization', async () => {
              const app = new MyApp({
                injector,
              });
              injector.isBound.withArgs(BINDINGS.winston).returns(true);
              await app.initialize();
              expect(injector.bind).to.not.be.calledWith(BINDINGS.winston);
            });
          });
        });
      });
    });
  });

  describe(`logger`, () => {
    it(`initializes logger as instance of Logger`, async () => {
      const app = new MyApp({
        injector,
      });
      await app.initialize();
      expect(app.log).to.be.instanceof(Logger);
    });

    it(`does not initialize logger if its mapped on Injector as 'log' prior to initialization`, async () => {
      injector.isBound.withArgs(BINDINGS.log).returns(true);
      injector.get.withArgs(BINDINGS.log).returns(log);

      const app = new MyApp({
        injector,
      });

      await app.initialize();
      expect(app.log).to.be.equal(log);
    });

    it(`binds logger to injector`, async () => {
      const app = new MyApp({});
      await app.initialize();

      expect(app.injector.get<types.Logger>(BINDINGS.log)).to.be.instanceof(
        Logger
      );
    });

    it(`ensures that logger has console transport added by default`, async () => {
      const app = new MyApp({});

      await app.initialize();
      const logger = app.log as types.Logger;
      expect(logger).to.be.instanceof(Logger);
      expect(logger.hasTransport(BINDINGS.console)).to.be.true;
      expect(logger.getTransport(BINDINGS.console)).to.be.instanceof(
        ConsoleTransport
      );
    });

    it(`initializes logger and logs initialization stage before initializing submodules`, async () => {
      injector.isBound.withArgs(BINDINGS.log).returns(true);
      injector.get.withArgs(BINDINGS.log).returns(log);

      const module = stubInterface<types.Module>();
      module.config = stubInterface<types.Configurable>();

      const app = new MyApp({
        modules: [module],
        injector,
      });

      await app.initialize();
      expect(log.debug).to.be.calledWithMatch(
        new Log(`initialize`).on(app).in('initialize')
      );
      expect(log.debug).to.be.calledBefore(module.initialize);
    });

    it(`shows simple start log`, async () => {
      injector.isBound.withArgs(BINDINGS.log).returns(true);
      injector.get.withArgs(BINDINGS.log).returns(log);
      const consoleTransport = stubInterface<types.LogTransport>();
      log.hasTransport.withArgs(BINDINGS.console).returns(true);
      log.getTransport.withArgs(BINDINGS.console).returns(consoleTransport);

      const config = new AppConfig({});
      const startMessage = 'start';
      config.set(`logging.transports.console.messages.start`, startMessage);
      const app = new MyApp({
        config,
        injector,
      });

      await app.initialize();
      expect(consoleTransport.info).to.be.calledWithMatch(
        new Log('start').format({ isSimple: true })
      );
      expect(consoleTransport.info).to.be.calledBefore(log.debug);
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
      expect((app.log as types.Logger).isInState(MyApp.STATES.running)).to.be
        .true;
    });

    it(`starts logging a custom logger if logging is enabled on application configuration`, async () => {
      injector.isBound.withArgs(BINDINGS.log).returns(true);
      injector.get.withArgs(BINDINGS.log).returns(log);

      const app = new MyApp({
        config: new AppConfig({
          logging: new LoggingConfig({
            isEnabled: true,
          }),
        }),
        injector,
      });

      await app.initialize();
      expect(log.start).to.be.calledOnce;
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
      expect((app.log as Logger).isInState(Logger.STATES.constructed)).to.be
        .true;
    });

    it(`does not log on custom logger if logging is disabled on application configuration`, async () => {
      injector.isBound.withArgs(BINDINGS.log).returns(true);
      injector.get.withArgs(BINDINGS.log).returns(log);

      const app = new MyApp({
        config: new AppConfig({
          logging: new LoggingConfig({
            isEnabled: false,
          }),
        }),
        injector,
      });

      await app.initialize();
      expect(log.start).to.not.be.called;
    });
  });

  describe('shutdown', () => {
    it(`logs shutdown stage`, async () => {
      injector.isBound.withArgs(BINDINGS.log).returns(true);
      injector.get.withArgs(BINDINGS.log).returns(log);

      const app = new MyApp({
        injector,
      });

      await app.initialize();
      await app.shutdown();
      expect(log.debug).to.be.calledWithMatch(
        new Log(`shutdown`).on(app).in('shutdown')
      );
      expect(log.debug).to.be.calledBefore(app.afterShutdown as any);
    });

    it('stops logging after shutdown', async () => {
      injector.isBound.withArgs(BINDINGS.log).returns(true);
      injector.get.withArgs(BINDINGS.log).returns(log);

      const app = new MyApp({
        injector,
      });
      await app.initialize();
      await app.shutdown();
      expect(log.stop).to.be.calledOnce;
    });

    it(`shows simple exit log`, async () => {
      injector.isBound.withArgs(BINDINGS.log).returns(true);
      injector.get.withArgs(BINDINGS.log).returns(log);
      const consoleTransport = stubInterface<types.LogTransport>();
      log.hasTransport.withArgs(BINDINGS.console).returns(true);
      log.getTransport.withArgs(BINDINGS.console).returns(consoleTransport);

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
      expect(log.debug).to.be.calledWithMatch(
        new Log(`shutdown`).on(app).in('shutdown')
      );
      expect(consoleTransport.info).to.be.calledWithMatch(
        new Log(`exit`).format({ isSimple: true })
      );
      expect(consoleTransport.info).to.be.calledAfter(log.debug);
    });
  });

  describe(`configuration`, () => {
    /*
    CONFIGURATIONS
    */
    @define('GrandchildModuleConfig')
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

    @define('ChildModuleConfig')
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

    @define('MyAppConfig')
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

    class GrandchildModule extends BaseModule {
      constructor() {
        super({
          config: grandchildConfig,
        });
      }
    }

    class ChildModule extends BaseModule {
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
          ...{
            modules: [new ChildModule()],
            config: new MyAppConfig({
              appId: 'my-app-id',
              root: 'app-root',
              change: 'app-change',
              keep: 'app-keep',
            }),
          },
        });
      }
    }

    it('merges configurations of all modules (deeply nested merge)', async () => {
      const app = new TestApp({
        injector,
      });
      await app.initialize();

      expect(app.config).to.be.eql({
        merged: {
          ChildModuleConfig: childConfig,
          GrandchildModuleConfig: grandchildConfig,
        },
        appId: 'my-app-id',
        logging: new LoggingConfig(),
        conversion: { type: 'runtime' },
        validation: { type: 'runtime' },
        description: { formatting: 'default' },
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
      expect(app.config).to.be.eql({
        merged: {
          ChildModuleConfig: childConfig,
          GrandchildModuleConfig: grandchildConfig,
        },
        appId: 'my-app-id',
        logging: new LoggingConfig(),
        conversion: { type: 'runtime' },
        validation: { type: 'runtime' },
        description: { formatting: 'default' },
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
