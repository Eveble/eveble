import getenv from 'getenv';
import { isPlainObject, get } from 'lodash';
import Agenda from 'agenda';
import { MongoClient } from 'mongodb';
import { BaseApp } from '../core/base-app';
import { AppConfig } from '../configs/app-config';
import { types } from '../types';
import { LoggingConfig } from '../configs/logging-config';
import { Eveble } from './eveble';
import { Log } from '../components/log-entry';
import { BINDINGS } from '../constants/bindings';
import { AgendaCommandSchedulerModule } from './modules/agenda-command-scheduler-module';
import { MongoDBSnapshotStorageModule } from './modules/mongodb-snapshot-storage-module';
import { MongoDBCommitStorageModule } from './modules/mongodb-commit-storage-module';
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
    let hasEveble = false;
    for (const module of processedProps.modules) {
      if (module instanceof Eveble) {
        hasEveble = true;
      }
    }
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
   * On configuration hook.
   * @async
   */
  protected async onConfiguration(): Promise<void> {
    await super.onConfiguration();

    await this.initializeGracefulShutdown();
    await this.initializeExternalDependencies();
    await this.initializeSchedulers();
    await this.initializeStorages();
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
      'Agenda.library': Agenda,
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

  /**
   * Initializes schedulers.
   * @async
   */
  protected async initializeSchedulers(): Promise<void> {
    this.log?.debug(
      new Log(`initializing schedulers`).on(this).in(this.initializeSchedulers)
    );

    if (
      this.isCommandScheduling() &&
      !this.injector.isBound(BINDINGS.CommandScheduler)
    ) {
      const client = getenv.string('EVEBLE_COMMAND_SCHEDULER_CLIENT');
      switch (client) {
        case 'agenda':
          this.modules.unshift(new AgendaCommandSchedulerModule());
          this.log?.debug(
            new Log(
              `added 'CommandScheduler' as 'AgendaCommandSchedulerModule' to application modules`
            )
              .on(this)
              .in(this.initializeSchedulers)
          );
          break;
        default:
          throw new StorageNotFoundError('CommandScheduler', client);
      }
    }
  }

  /**
   * Initializes storages.
   * @async
   */
  protected async initializeStorages(): Promise<void> {
    this.log?.debug(
      new Log(`initializing storages`).on(this).in(this.initializeStorages)
    );

    if (
      !this.injector.isBound(BINDINGS.SnapshotStorage) &&
      this.isSnapshotting()
    ) {
      const client = getenv.string('EVEBLE_COMMITSTORE_CLIENT');
      switch (client) {
        case 'mongodb':
          this.modules.unshift(new MongoDBSnapshotStorageModule());
          this.log?.debug(
            new Log(
              `added 'SnapshotStorage' as 'MongoDBSnapshotStorageModule' to application modules`
            )
              .on(this)
              .in(this.initializeStorages)
          );
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
          this.log?.debug(
            new Log(
              `added 'CommitStorage' as 'MongoDBCommitStorageModule' to application modules`
            )
              .on(this)
              .in(this.initializeStorages)
          );
          break;
        default:
          throw new StorageNotFoundError('CommitStorage', client);
      }
    }
  }
}
