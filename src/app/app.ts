import getenv from 'getenv';
import { isPlainObject, get } from 'lodash';
import Pulse from '@pulsecron/pulse';
import { MongoClient } from 'mongodb';
import { BaseApp } from '../core/base-app';
import { AppConfig } from '../configs/app-config';
import { types } from '../types';
import { LoggingConfig } from '../configs/logging-config';
import { Eveble } from './eveble';
import { Log } from '../components/log-entry';
import { BINDINGS } from '../constants/bindings';
import { PulseCommandSchedulerModule } from './modules/pulse-command-scheduler-module';
import { MongoDBSnapshotStorageModule } from './modules/mongodb-snapshot-storage-module';
import { MongoDBCommitStorageModule } from './modules/mongodb-commit-storage-module';
import { InMemoryModule } from './modules/in-memory-module';
import { InMemoryCommitStorage } from '../infrastructure/storages/commit-memory-storage';
import { InMemorySnapshotStorage } from '../infrastructure/storages/snapshot-memory-storage';
import { InMemoryCommitObserver } from '../infrastructure/storages/commit-memory-observer';
import { InMemoryCommandScheduler } from '../infrastructure/schedulers/in-memory-command-scheduler';
import { StorageNotFoundError } from '../infrastructure/infrastructure-errors';
import { loadENV } from '../utils/helpers';

export class App extends BaseApp {
  public injector: types.Injector;

  public config: AppConfig;

  public modules: types.Module[];

  public log: types.Logger;

  public readonly envFilePath: string;

  /**
   * Creates an instance of App.
   * @param props - Properties for App.
   * @param props.modules - Optional dependent list of modules.
   * @param props.config - Optional configuration for App as plain object or `AppConfig` instance.
   * @param props.injector - Optional custom IoC container implementing `Injector` interface.
   */
  constructor(
    props: types.ModuleProps & {
      config?: AppConfig | Partial<AppConfig> | Record<string, any>;
    } = {}
  ) {
    // Load environment variables from .env file
    const env = process.env.NODE_ENV;
    const envFilePath = process.env.NODE_ENV ? `.env.${env}` : '.env';
    loadENV(envFilePath);

    const processedProps: types.ModuleProps = { ...props };
    if (isPlainObject(props.config)) {
      const configData = props.config as Partial<AppConfig>;
      // Ensure logging is a LoggingConfig instance if it exists as plain object
      if (
        configData.logging &&
        !(configData.logging instanceof LoggingConfig)
      ) {
        configData.logging = new LoggingConfig(configData.logging);
      }
      processedProps.config = AppConfig.from(configData);
    }

    if (props.config === undefined) {
      processedProps.config = new AppConfig({
        appId: AppConfig.generateId(),
        logging: new LoggingConfig({
          isEnabled: true,
        }),
      });
    }
    if (!processedProps.config.has('eveble.CommitStore.timeout')) {
      processedProps.config.set(
        'eveble.CommitStore.timeout',
        getenv.int('EVEBLE_COMMITSTORE_TIMEOUT')
      );
    }
    if (!processedProps.config.has('eveble.Snapshotter.isEnabled')) {
      processedProps.config.set(
        'eveble.Snapshotter.isEnabled',
        getenv.bool('EVEBLE_SNAPSHOTTER_ENABLED')
      );
    }
    if (!processedProps.config.has('eveble.Snapshotter.frequency')) {
      processedProps.config.set(
        'eveble.Snapshotter.frequency',
        getenv.int('EVEBLE_SNAPSHOTTER_FREQUENCY')
      );
    }
    if (!processedProps.config.has('eveble.CommandScheduler.isEnabled')) {
      processedProps.config.set(
        'eveble.CommandScheduler.isEnabled',
        getenv.bool('EVEBLE_COMMAND_SCHEDULER_ENABLED')
      );
    }

    if (processedProps.modules === undefined) {
      processedProps.modules = [];
    }

    // Ensure Eveble module is always present
    const hasEveble = processedProps.modules.some((m) => m instanceof Eveble);
    if (!hasEveble) {
      processedProps.modules.unshift(new Eveble());
    }
    super(processedProps);
    // Bind itself on injector for further reference
    this.injector.bind<types.App>(BINDINGS.App).toConstantValue(this);

    this.envFilePath = envFilePath;
  }

  /**
   * Sends command through `CommandBus`.
   * @async
   * @param command - Instance implementing `Command` interface.
   * @return Result of handling command.
   * @throws {HandlerNotFoundError}
   * Thrown if handler for message type is not found.
   */
  public async send(command: types.Command): Promise<any> {
    const commandBus = await this.injector.getAsync<types.CommandBus>(
      BINDINGS.CommandBus
    );
    return commandBus.send(command);
  }

  /**
   * Publishes event through `EventBus`.
   * @async
   * @param event - Instance implementing `Event` interface.
   */
  public async publish(event: types.Event): Promise<void> {
    const eventBus = await this.injector.getAsync<types.EventBus>(
      BINDINGS.EventBus
    );
    await eventBus.publish(event);
  }

  /**
   * Subscribes to event type with handler.
   * @async
   * @param event - Instance implementing `Event` interface.
   * @param handler - Handler function that will executed upon published `Event`.
   */
  public async subscribeTo(
    eventType: types.MessageType<types.Event>,
    handler: types.Handler
  ): Promise<void> {
    const eventBus = await this.injector.getAsync<types.EventBus>(
      BINDINGS.EventBus
    );
    eventBus.subscribeTo(eventType, handler);
  }

  /**
   * Evaluates if app is running on production.
   * @returns Returns `true` if application is running on production environment, else `false`.
   */
  public isInProduction(): boolean {
    return getenv.string('NODE_ENV') === 'production';
  }

  /**
   * Evaluates if application has `Snapshotter` enabled.
   * @returns Returns `true` if snapshotting is enabled on application, else fal`se.
   */
  public isSnapshotting(): boolean {
    return this.config.get('eveble.Snapshotter.isEnabled') === true;
  }

  /**
   * Evaluates if application has `CommandScheduler` enabled.
   * @returns Returns `true` if command scheduling is enabled on application, else `false`.
   */
  public isCommandScheduling(): boolean {
    return this.config.get('eveble.CommandScheduler.isEnabled') === true;
  }

  /**
   * Registers additional modules after construction but before initialization.
   * @param modules - List of modules to register.
   * @throws {Error} If app is already initialized.
   */
  public configureModules(modules: types.Module[]): void {
    for (const module of modules) {
      this.validateModules([module]);
      if (!this.modules.includes(module)) {
        this.modules.push(module);
      }
    }
  }

  /**
   * Resolves and auto-registers infrastructure modules based on configuration
   * and environment variables. Called during onConfiguration, before module
   * initialization and before external dependency binding.
   *
   * Order matches original: scheduler first, then storages.
   */
  protected resolveModules(): void {
    const hasInMemoryModule = this.modules.some(
      (m) => m instanceof InMemoryModule
    );

    // InMemoryModule handles its own binding in beforeInitialize
    if (hasInMemoryModule) {
      return;
    }

    // Resolve scheduler module first, then storage modules
    // to maintain consistent module ordering
    this.resolveSchedulerModule();
    this.resolveStorageModules();
  }

  /**
   * Resolves CommitStorage and SnapshotStorage modules based on env config.
   */
  protected resolveStorageModules(): void {
    if (
      this.isSnapshotting() &&
      !this.injector.isBound(BINDINGS.SnapshotStorage)
    ) {
      const client = getenv.string('EVEBLE_SNAPSHOTTER_CLIENT');
      switch (client) {
        case 'mongodb':
          this.modules.unshift(new MongoDBSnapshotStorageModule());
          break;
        case 'inmemory':
          break;
        default:
          throw new StorageNotFoundError('SnapshotStorage', client);
      }
    }

    if (!this.injector.isBound(BINDINGS.CommitStorage)) {
      const client = getenv.string('EVEBLE_COMMITSTORE_CLIENT');
      switch (client) {
        case 'mongodb':
          this.modules.unshift(new MongoDBCommitStorageModule());
          break;
        case 'inmemory':
          break;
        default:
          throw new StorageNotFoundError('CommitStorage', client);
      }
    }
  }

  /**
   * Resolves CommandScheduler module based on env config.
   */
  protected resolveSchedulerModule(): void {
    if (
      !this.isCommandScheduling() ||
      this.injector.isBound(BINDINGS.CommandScheduler)
    ) {
      return;
    }

    const client = getenv.string('EVEBLE_COMMAND_SCHEDULER_CLIENT');
    switch (client) {
      case 'pulse':
        this.modules.unshift(new PulseCommandSchedulerModule());
        break;
      case 'inmemory':
        break;
      default:
        throw new StorageNotFoundError('CommandScheduler', client);
    }
  }

  /**
   * Binds in-memory storage and scheduler implementations early if
   * InMemoryModule is present, so they are available before Eveble's
   * afterInitialize eagerly resolves CommitPublisher.
   */
  protected bindInMemoryImplementations(): void {
    const hasInMemoryModule = this.modules.some(
      (m) => m instanceof InMemoryModule
    );
    if (!hasInMemoryModule) {
      return;
    }

    if (!this.injector.isBound(BINDINGS.CommitStorage)) {
      this.injector
        .bind<types.CommitStorage>(BINDINGS.CommitStorage)
        .to(InMemoryCommitStorage)
        .inSingletonScope();
    }
    if (!this.injector.isBound(BINDINGS.SnapshotStorage)) {
      this.injector
        .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
        .to(InMemorySnapshotStorage)
        .inSingletonScope();
    }
    if (!this.injector.isBound(BINDINGS.CommitObserver)) {
      this.injector
        .bind<types.CommitObserver>(BINDINGS.CommitObserver)
        .to(InMemoryCommitObserver)
        .inSingletonScope();
    }
    if (!this.injector.isBound(BINDINGS.CommandScheduler)) {
      this.injector
        .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
        .to(InMemoryCommandScheduler)
        .inSingletonScope();
    }
  }

  /**
   * On configuration hook.
   * @async
   */
  protected async onConfiguration(): Promise<void> {
    // Resolve additional infrastructure modules before configuration
    // runs, so users can pre-bind injector entries between construction
    // and initialize() to influence module selection.
    this.resolveModules();

    // Bind in-memory implementations before module initialization so
    // Eveble's afterInitialize can resolve CommitPublisher (which depends
    // on CommitStorage) without requiring InMemoryModule to init first.
    this.bindInMemoryImplementations();

    await super.onConfiguration();

    await this.initializeGracefulShutdown();
    await this.initializeExternalDependencies();
  }

  /**
   * Initializes graceful shutdown.
   */
  protected async initializeGracefulShutdown(): Promise<void> {
    this.log?.debug(
      new Log(`initializing graceful shutdown for process signals`)
        .on(this)
        .in(this.initializeGracefulShutdown)
    );
    // eslint-disable-next-line no-undef
    const signalEvents: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    for (const sig of signalEvents) {
      this.log?.debug(
        new Log(`registers graceful shutdown for code: '${sig}'`)
          .on(this)
          .in(this.initializeGracefulShutdown)
      );
      const boundListener = this.onProcessSignal.bind(this);
      boundListener.original = this.onProcessSignal;
      process.on(sig, boundListener);
    }
  }

  /**
   * On process signal hook for graceful shutdown.
   * @async
   * @param code - Node's signal process code.
   */
  // eslint-disable-next-line no-undef
  public async onProcessSignal(code: NodeJS.Signals): Promise<void> {
    this.log?.warning(
      new Log(`got signal '${code}': initializing graceful shutdown`)
        .on(this)
        .in(this.onProcessSignal)
    );
    await this.shutdown();
  }

  /**
   * Initializes external dependencies.
   * @async
   */
  protected async initializeExternalDependencies(): Promise<void> {
    this.log?.debug(
      new Log(`initializing external dependencies`)
        .on(this)
        .in(this.initializeExternalDependencies)
    );

    const components = {
      'Pulse.library': Pulse,
      'MongoDB.library': MongoClient,
    };

    for (const [id, component] of Object.entries(components)) {
      if (!this.injector.isBound(get(BINDINGS, id))) {
        this.injector.bind(get(BINDINGS, id)).toConstantValue(component);
        this.log?.debug(
          new Log(`bound '${id}' as constant value`)
            .on(this)
            .in(this.initializeExternalDependencies)
        );
      }
    }
  }
}
