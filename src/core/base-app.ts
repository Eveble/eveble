import * as winston from 'winston';
import { Injector } from './injector';
import { Module } from './module';
import { AppConfig } from '../configs/app-config';
import { types } from '../types';
import { Log } from '../components/log-entry';
import { InvalidAppConfigError } from './core-errors';
import { BINDINGS } from '../constants/bindings';
import { RFC5424 } from '../constants/specifications';
import { Logger } from './logger';
import { LogTransportConfig } from '../configs/log-transport-config';
import { ConsoleTransport } from './logging-transports/console-transport';
import { kernel } from './kernel';
import { StringifingConverter } from './logging-transports/formatters/converters/stringifing-converter';
import { SimpleLogFormatter } from './logging-transports/formatters/simple-log-entry-formatter';
import { DetailedLogFormatter } from './logging-transports/formatters/detailed-log-entry-formatter';
import { LoggingConfig } from '../configs/logging-config';

export abstract class BaseApp extends Module implements types.BaseApp {
  public config: types.Configurable;

  public injector: types.Injector;

  public log?: types.Logger;

  public modules: types.Module[];

  /**
   * Creates an instance of BaseApp.
   * @param props - Properties for BaseApp.
   * @param props.modules - Optional dependent list of modules.
   * @param props.config - Optional configuration for BaseApp.
   * @param props.injector - Optional custom IoC container implementing `Injector` interface.
   */
  constructor(props: types.AppProps = {}) {
    const defaults = {
      modules: [],
      config: new AppConfig(),
    };
    const processedProps = { ...defaults, ...props };
    if (!(processedProps.config instanceof AppConfig)) {
      throw new InvalidAppConfigError(
        kernel.describer.describe(processedProps.config)
      );
    }
    super(processedProps);
    this.injector = processedProps.injector ?? new Injector();
  }

  /**
   * Enables debug mode logging on application app.
   * **Must be enabled prior to initialization**.
   */
  public debug(): void {
    this.config.assign({
      logging: new LoggingConfig({
        isEnabled: true,
        transports: {
          console: new LogTransportConfig({
            level: 'debug',
            timestampFormat: 'mm:ss',
            flags: {
              isLabeled: false,
              isAbbreviatingSources: true,
            },
            abbreviationLength: 15,
          }),
        },
      }),
    });
  }

  /**
   * Initializes application.
   * @async
   */
  public async initialize(): Promise<void> {
    // Only initialize once
    if (!this.isInState(BaseApp.STATES.constructed)) {
      return;
    }
    this.setState(BaseApp.STATES.configuring);

    await this.onConfiguration();

    if (this.modules !== undefined) {
      await this.initializeModules(this.modules, this, this.injector);
    }
    await this.runInitializeHooks(this.injector);
    await this.initializeSingletons();

    this.log?.debug(
      new Log(`config:`)
        .on(this)
        .in(this.initialize)
        .with('config', this.config)
        .format({
          inspectDepth: 10,
        })
    );
  }

  /**
   * Shutdowns app.
   * @async
   */
  public async shutdown(): Promise<void> {
    await super.shutdown();

    const consoleTransport = this.log?.getTransport(BINDINGS.console);
    if (
      consoleTransport !== undefined &&
      this.config.get('logging.isEnabled')
    ) {
      this.logExitingMessage(consoleTransport);
    }
  }

  /**
   * On shutdown hook.
   * @async
   */
  public async afterShutdown(): Promise<void> {
    if (this.config.get('logging.isEnabled')) {
      this.log?.stop();
    }
  }

  /**
   * Make it possible to override configuration (at any nested level).
   * @param props - Properties with relation path: value matching property types.
   */
  public configure(props: types.ConfigProps): void {
    this.config.assign(props);
  }

  /**
   * Setup basic mappings required by all modules.
   * @async
   */
  protected async onConfiguration(): Promise<void> {
    this.bindKernelDependencies();
    this.bindAppDependencies();
    if (kernel.injector === undefined) {
      kernel.setInjector(this.injector);
    }

    this.bindExternalDependencies();
    this.bindLoggerDependencies();
    await this.initializeLogger();

    this.log?.debug(new Log(`initialize`).on(this).in(this.initialize));
  }

  /**
   * Binds kernel dependencies on Injector.
   */
  protected bindKernelDependencies(): void {
    this.injector
      .bind<types.Converter>(BINDINGS.Converter)
      .toConstantValue(kernel.converter);
    this.injector
      .bind<types.Validator>(BINDINGS.Validator)
      .toConstantValue(kernel.validator);
    this.injector
      .bind<types.Describer>(BINDINGS.Describer)
      .toConstantValue(kernel.describer);
    this.injector
      .bind<types.Library>(BINDINGS.Library)
      .toConstantValue(kernel.library);
  }

  /**
   * Binds app dependencies to Injector.
   */
  protected bindAppDependencies(): void {
    this.injector
      .bind<types.Injector>(BINDINGS.Injector)
      .toConstantValue(this.injector);
    this.injector
      .bind<types.Configurable>(BINDINGS.Config)
      .toConstantValue(this.config);
  }

  /**
   * Binds external dependencies to Injector.
   */
  protected bindExternalDependencies(): void {
    if (!this.injector.isBound(BINDINGS.winston)) {
      this.injector.bind<any>(BINDINGS.winston).toConstantValue(winston);
    }
  }

  /**
   * Binds logger dependencies to Injector.
   */
  protected bindLoggerDependencies(): void {
    const converter = new StringifingConverter();
    const simpleFormatter = new SimpleLogFormatter(converter);
    const detailedFormatter = new DetailedLogFormatter(converter);

    if (!this.injector.isBound(BINDINGS.SimpleLogFormatter)) {
      this.injector
        .bind<types.LogFormatter>(BINDINGS.SimpleLogFormatter)
        .toConstantValue(simpleFormatter);
    }
    if (!this.injector.isBound(BINDINGS.DetailedLogFormatter)) {
      this.injector
        .bind<types.LogFormatter>(BINDINGS.DetailedLogFormatter)
        .toConstantValue(detailedFormatter);
    }
  }

  /**
   * Initializes logger instance on app.
   * @async
   * @remarks
   * Method is made async in case BaseApp is extended by developer and
   * implementation of logging library requires async support.
   */
  protected async initializeLogger(): Promise<void> {
    let logger: types.Logger;
    if (!this.injector.isBound(BINDINGS.log)) {
      logger = await this.createLogger();
      this.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(logger);
    } else {
      logger = this.injector.get<types.Logger>(BINDINGS.log);
    }
    this.log = logger;

    const transportId = BINDINGS.console;
    if (
      this.config.get(`logging.transports.${transportId}.isEnabled`) &&
      !this.log.hasTransport(transportId)
    ) {
      const consoleTransport = await this.createConsoleTransport();
      logger.registerTransport(transportId, consoleTransport);
    }

    if (this.config.get('logging.isEnabled')) {
      await this.startLogging();
    }
  }

  /**
   * Creates Logger instance.
   */
  protected async createLogger(): Promise<types.Logger> {
    const levels = {
      ...RFC5424,
      ...this.config.get('logging.levels'),
    };
    return new Logger(levels);
  }

  /**
   * Creates ConsoleTransport instance.
   */
  protected async createConsoleTransport(): Promise<types.LogTransport> {
    const key = 'logging.transports.console';
    if (!this.config.has(`${key}.parts.label`)) {
      this.config.set(`${key}.parts.label`, this.config.get(`appId`));
    }

    const level = this.config.get(`${key}.level`);
    const consoleOptions: LogTransportConfig = this.config.get(`${key}`);
    const consoleTransport = new ConsoleTransport(level, consoleOptions);
    this.injector.injectInto(consoleTransport);
    return consoleTransport;
  }

  /**
   * Starts logging if logger is set on application.
   * @async
   * @remarks
   * Method is made async in case BaseApp is extended by developer and
   * implementation of logging library requires async support.
   */
  protected async startLogging(): Promise<void> {
    this.log?.start();
    if (this.log?.hasTransport('console')) {
      const consoleTransport = this.log.getTransport(
        BINDINGS.console
      ) as types.LogTransport;
      this.logStartingMessage(consoleTransport);
    }
  }

  /**
   * Logs start message with ConsoleTransport.
   * @param consoleTransport - ConsoleTransport instance.
   */
  protected logStartingMessage(consoleTransport: types.LogTransport): void {
    consoleTransport.info(
      new Log(this.config.get(`logging.transports.console.messages.start`))
    );
  }

  /**
   * Logs exit message with ConsoleTransport.
   * @param consoleTransport - ConsoleTransport instance.
   */
  protected logExitingMessage(consoleTransport: types.LogTransport): void {
    consoleTransport.info(
      new Log(this.config.get(`logging.transports.console.messages.exit`))
    );
  }

  /**
   * Initializes all bound singletons on `Injector`.
   * @async
   */
  protected async initializeSingletons(): Promise<void> {
    this.log?.debug(
      new Log(`initializing singletons`).on(this).in(this.initializeSingletons)
    );

    const serviceIdentifiers = this.injector.findByScope('Singleton');
    for (const serviceIdentifier of serviceIdentifiers) {
      await this.injector.getAsync<any>(serviceIdentifier);
    }
  }
}
