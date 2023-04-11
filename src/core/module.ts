import { isFunction, capitalize } from 'lodash';
import { getTypeName } from '@eveble/helpers';
import { instanceOf } from 'typend';
import { classes } from 'polytype';
import getenv from 'getenv';
import { kernel } from '@eveble/core';
import { StatefulMixin } from '../mixins/stateful-mixin';
import {
  AppMissingError,
  InjectorMissingError,
  InvalidModuleError,
  InvalidConfigError,
  InvalidEnvironmentError,
  InvalidAppConfigError,
} from './core-errors';
import { types } from '../types';
import { Log } from '../components/log-entry';
import { BINDINGS } from '../constants/bindings';
import { AppConfig } from '../configs/app-config';
import { Config } from '../components/config';

enum STATES {
  constructed = 'constructed',
  configuring = 'configuring',
  initializing = 'initializing',
  initialized = 'initialized',
  running = 'running',
  stopped = 'stopped',
  shutdown = 'shutdown',
}

export abstract class Module
  extends classes(StatefulMixin)
  implements types.Stateful, types.Module
{
  static STATES = STATES;

  public config: types.Configurable;

  public modules: types.Module[];

  public app?: types.BaseApp;

  public injector: types.Injector;

  public log?: types.Logger;

  protected isResetting: boolean;

  /**
   * Creates an instance of Module.
   * @param props - Properties matching module definition.
   */
  constructor(props: types.ModuleProps = {}) {
    super();
    if (props.config) this.validateConfig(props.config);
    if (props.modules) this.validateModules(props.modules);

    Object.assign(this, props);
    if (this.config === undefined) {
      this.config = new Config();
    }
    if (this.modules === undefined) {
      this.modules = [];
    }
    this.isResetting = false;
    this.setState(Module.STATES.constructed);
  }

  /**
   * Initializes module.
   * @async
   * @param app - Application that requires(depends) module.
   * @param injector - IoC container implementing Inversifiy's Containers interface.
   * @throws {AppMissingError}
   * Thrown if the app argument is missing.
   * @throws {InjectorMissingError}
   * Thrown if the injector argument is missing.
   */
  public async initialize(
    app: types.BaseApp,
    injector: types.Injector
  ): Promise<void> {
    if (app == null) {
      throw new AppMissingError();
    }
    if (injector == null) {
      throw new InjectorMissingError();
    }
    this.app = app;
    this.injector = injector;
    // Only initialize once
    if (!this.isInState(Module.STATES.constructed)) {
      return;
    }
    this.setState(Module.STATES.configuring);

    await this.initializeLogger();

    this.log?.debug(
      new Log(`initializing`)
        .on(this)
        .in(this.initialize)
        .with('arguments', [app, injector])
    );

    this.mergeConfigWithApp(this.app);
    if (this.modules !== undefined) {
      await this.initializeModules(this.modules, app, injector);
    }
    await this.runInitializeHooks(injector);
  }

  /**
   * Changes module state to 'running' and invokes lifecycle 'start' action.
   * @async
   * @throws {InvalidStateError}
   * Thrown if the module is not in one of states: 'initialized', 'stopped', 'running'.
   */
  public async start(): Promise<void> {
    this.validateState([
      Module.STATES.initialized,
      Module.STATES.stopped,
      Module.STATES.running,
    ]);

    if (this.isInState(Module.STATES.running)) {
      return;
    }

    await this.runLifeCycleAction('start');
    this.setState(Module.STATES.running);
    this.isResetting = false;
  }

  /**
   * Changes module state to 'stopped' and invokes lifecycle 'stop' action.
   * @async
   * @throws {InvalidStateError}
   * Thrown if the module is not in one of states: 'initialized', 'stopped', 'running'.
   */
  public async stop(): Promise<void> {
    this.validateState([
      Module.STATES.initialized,
      Module.STATES.stopped,
      Module.STATES.running,
    ]);

    if (this.isInState(Module.STATES.stopped)) {
      return;
    }

    await this.runLifeCycleAction('stop');
    this.setState(Module.STATES.stopped);
  }

  /**
   * Restarts module state and invokes all associated lifecycle hooks.
   * @async
   * @throws {InvalidStateError}
   * Thrown if the module is not in one of states: 'initialized', 'stopped', 'running'.
   * @throws {InvalidEnvironmentError}
   * Thrown if resetting is done on production environment.
   */
  public async reset(): Promise<void> {
    this.validateState([
      Module.STATES.initialized,
      Module.STATES.stopped,
      Module.STATES.running,
    ]);

    if (!this.isAllowedToResetOnProduction()) {
      throw new InvalidEnvironmentError('reset', getenv.string('NODE_ENV'));
    }
    if (this.isResetting) {
      return;
    }

    this.isResetting = true;
    const restartRequired = this.isInState(Module.STATES.running);
    if (restartRequired) {
      await this.stop();
    }
    await this.runLifeCycleAction('reset');
    if (restartRequired) {
      await this.start();
    }
  }

  /**
   * Shutdowns module and changes state to 'shutdown' and invokes lifecycle 'shutdown' action.
   * @async
   * @throws {InvalidStateError}
   * Thrown if the module is not in one of states: 'initialized', 'stopped', 'running', 'shutdown'.
   */
  public async shutdown(): Promise<void> {
    this.validateState([
      Module.STATES.constructed,
      Module.STATES.initialized,
      Module.STATES.stopped,
      Module.STATES.running,
      Module.STATES.shutdown,
    ]);

    if (this.isInState(Module.STATES.constructed)) {
      return;
    }
    if (this.isInState(Module.STATES.shutdown)) {
      return;
    }
    if (
      !this.isInState(Module.STATES.constructed) &&
      !this.isInState(Module.STATES.stopped)
    ) {
      await this.stop();
    }

    await this.runLifeCycleAction('shutdown');
    this.setState(Module.STATES.shutdown);
    this.log?.debug(new Log(`shutdown`).on(this).in(this.shutdown));
  }

  /**
   * Runs action on module if action is defined.
   * @async
   * @param actionName - Name of action(function) to run.
   * @param options - Additional options for behavior of invoking action.
   * @param options.isLoggable - Flag indicating to log action invocation.
   */
  public async invokeAction(
    actionName: string,
    options: types.ActionInvokingOptions = { isLoggable: false }
  ): Promise<void> {
    if (options.isLoggable) {
      this.log?.debug(new Log(`${actionName}`).on(this));
    }
    if (isFunction(this[actionName])) {
      await this[actionName]();
    }
  }

  /**
   * Validates dependent modules.
   * @param modules - List of modules that inherit from Module class.
   * @throws {InvalidModuleError}
   * Thrown if one of modules from list is not implementing `Module` interface.
   */
  protected validateModules(modules: types.Module[]): void {
    for (const module of modules) {
      if (!instanceOf<types.Module>(module)) {
        const typeName: types.TypeName = getTypeName(
          this.constructor
        ) as types.TypeName;
        throw new InvalidModuleError(
          typeName,
          kernel.describer.describe(module)
        );
      }
    }
  }

  /**
   * Validates module configuration.
   * @param config - Instance inheriting from Config class as configuration for module.
   * @throws {InvalidConfigError}
   * Thrown if configuration is not implementing `Configurable` interface.
   */
  protected validateConfig(config: types.Configurable): void {
    if (!instanceOf<types.Configurable>(config)) {
      const typeName: types.TypeName = getTypeName(
        this.constructor
      ) as types.TypeName;
      throw new InvalidConfigError(typeName, kernel.describer.describe(config));
    }
  }

  /**
   * Initializes logger instance on module.
   * @async
   */
  protected async initializeLogger(): Promise<void> {
    this.log = await this.injector?.getAsync<types.Logger>(BINDINGS.log);
  }

  /**
   * Merge app configuration with module configuration to give the chance for overwriting settings.
   * @param app - Application that requires(depends) module.
   */
  protected mergeConfigWithApp(app: types.BaseApp): void {
    if (!this.isAppConfig(app.config)) {
      throw new InvalidAppConfigError(kernel.describer.describe(app.config));
    }
    if (this.config !== undefined) {
      this.log?.debug(
        new Log(`merging module configuration with application`)
          .on(this)
          .in(this.mergeConfigWithApp)
      );
      app.config.merge(this.config);
    }
    this.config = app.config;
  }

  /**
   * Evaluates if provided configuration is valid application configuration.
   * @param config - Evaluated configuration.
   * @returns Returns `true` if configuration is instance of `AppConfig`, else `false`.
   */
  protected isAppConfig(config: types.Configurable): boolean {
    return config instanceof AppConfig;
  }

  /**
   * Initializes all required modules.
   * @async
   * @param modules - List of submodules.
   * @param app - Application that requires(depends) module.
   * @param injector - IoC container implementing Inversifiy's `Container` interface.
   */
  protected async initializeModules(
    modules: types.Module[],
    app: types.BaseApp,
    injector: types.Injector
  ): Promise<void> {
    for (const module of modules) {
      await module.initialize(app, injector);
    }
  }

  /**
   * Runs through 'beforeInitialize', 'onInitialize', 'afterInitialize' hooks.
   * @async
   * @param injector - IoC container implementing Inversifiy's `Container` interface.
   */
  protected async runInitializeHooks(injector: types.Injector): Promise<void> {
    await this.runBeforeInitializeHooks();
    await this.runOnInitializeHooks(injector);
    await this.runAfterInitializeHooks();
  }

  /**
   * Provide lifecycle hook before any initialization has been done.
   * @async
   */
  protected async runBeforeInitializeHooks(): Promise<void> {
    this.log?.debug(
      new Log(`beforeInitialize`).on(this).in(this.runBeforeInitializeHooks)
    );
    const options: types.ActionInvokingOptions = {
      isLoggable: false,
    };
    await this.invokeAction('beforeInitialize', options);
  }

  /**
   * Provide lifecycle hook after this module was configured and injected.
   * @async
   * @param injector - IoC container implementing Inversifiy's Containers interface.
   */
  protected async runOnInitializeHooks(
    injector: types.Injector
  ): Promise<void> {
    await this.invokeActionOnDependentModules('runOnInitializeHooks');
    // Never run this hook twice
    if (!this.isInState(Module.STATES.configuring)) {
      return;
    }

    this.log?.debug(
      new Log(`onInitialize`).on(this).in(this.runOnInitializeHooks)
    );
    this.setState(Module.STATES.initializing);
    // Inject required dependencies into this module
    injector.injectIntoAsync(this);
    // Call custom lifecycle hook if existent
    const options: types.ActionInvokingOptions = {
      isLoggable: false,
    };
    await this.invokeAction('onInitialize', options);
  }

  /**
   * Invoke last hook after all modules in the tree have been configured.
   * @async
   */
  protected async runAfterInitializeHooks(): Promise<void> {
    await this.invokeActionOnDependentModules('runAfterInitializeHooks');
    // Never run this hook twice
    if (!this.isInState(Module.STATES.initializing)) {
      return;
    }
    this.log?.debug(
      new Log(`afterInitialize`).on(this).in(this.runAfterInitializeHooks)
    );
    this.setState(Module.STATES.initialized);
    // Call custom lifecycle hook if existent
    const options: types.ActionInvokingOptions = {
      isLoggable: false,
    };
    await this.invokeAction('afterInitialize', options);
  }

  /**
   * Invokes the lifecycle action on all required modules, then on itself,
   * calling the instance hooks before, on, and after.
   * @async
   * @param actionName - Name of action(function) to run
   */
  protected async runLifeCycleAction(actionName: string): Promise<void> {
    await this.invokeActionOnDependentModules(actionName);
    this.log?.debug(new Log(`${actionName}`).on(this));

    await this.invokeAction(`before${capitalize(actionName)}`, {
      isLoggable: true,
    });
    await this.invokeAction(`on${capitalize(actionName)}`, {
      isLoggable: true,
    });
    await this.invokeAction(`after${capitalize(actionName)}`, {
      isLoggable: true,
    });
  }

  /**
   * Runs lifecycle on each included module from current module.
   * @async
   * @param actionName - Name of action(function) to run.
   */
  protected async invokeActionOnDependentModules(
    actionName: string
  ): Promise<void> {
    if (this.modules === undefined) {
      return;
    }
    const options: types.ActionInvokingOptions = {
      isLoggable: false,
    };
    for (const module of this.modules) {
      await module.invokeAction(actionName, options);
    }
  }

  /**
   * Placeholder for more robust implementation of evaluation if module can invoke reset action on production environment.
   * @returns Returns `true` if is allowed to reset on production, else `false`.
   */
  protected isAllowedToResetOnProduction(): boolean {
    return !this.isInProduction();
  }

  /**
   * Evaluates if current environment is on production.
   * @returns Returns `true` if is on production environment, else `false`.
   */
  public isInProduction(): boolean {
    return this.isInEnv('production');
  }

  /**
   * Evaluates if current environment is on development.
   * @returns Returns `true` if is on development environment, else `false`.
   */
  public isInDevelopment(): boolean {
    return this.isInEnv('dev');
  }

  /**
   * Evaluates if current environment matches provided one.
   * @param env - Environment name.
   * @returns Returns `true` if is in environment, else `false`.
   */
  protected isInEnv(env: string): boolean {
    return getenv.string('NODE_ENV') === env;
  }
}
