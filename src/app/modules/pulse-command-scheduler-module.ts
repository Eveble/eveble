import getenv from 'getenv';
import { Collection } from 'mongodb';
import { Pulse } from '@pulsecron/pulse';
import { PulseClient } from '../clients/pulse-client';
import { MongoDBClient } from '../clients/mongodb-client';
import { Module } from '../../core/module';
import { types } from '../../types';
import { Log } from '../../components/log-entry';
import { BINDINGS } from '../../constants/bindings';
import { PulseScheduledJobTransformer } from '../../infrastructure/transformers/pulse-scheduled-job-transformer';
import { PulseCommandScheduler } from '../../infrastructure/schedulers/pulse-command-scheduler';

export class PulseCommandSchedulerModule extends Module {
  pulseClient?: PulseClient;

  mongoClient?: MongoDBClient;

  /**
   * On before initialize hook.
   * @async
   */
  protected async beforeInitialize(): Promise<void> {
    await this.initializeTopLevelDependencies();
    await this.initializeMongoDBClientForCommandScheduler();
    await this.initializePulseClientForCommandScheduler();
  }

  /**
   * On initialize hook.
   * @async
   */
  protected async onInitialize(): Promise<void> {
    await this.initializeCommandScheduler();
  }

  /**
   * On start hook.
   * @async
   */
  protected async onStart(): Promise<void> {
    await this.pulseClient?.connect();
  }

  /**
   * On stop hook.
   * @async
   */
  protected async onStop(): Promise<void> {
    await this.pulseClient?.stop();
  }

  /**
   * On module shutdown hook.
   * @async
   */
  protected async onShutdown(): Promise<void> {
    await this.pulseClient?.disconnect();
  }

  /**
   * Initializes top level dependencies.
   * @async
   */
  async initializeTopLevelDependencies(): Promise<void> {
    if (this.injector.isBound(BINDINGS.Pulse.library) === false) {
      this.injector
        .bind<typeof Pulse>(BINDINGS.Pulse.library)
        .toConstantValue(Pulse);
    }
    this.injector
      .bind<types.PulseJobTransformer>(BINDINGS.Pulse.jobTransformer)
      .to(PulseScheduledJobTransformer as any)
      .inSingletonScope();
    this.log?.debug(
      new Log(`bound 'Pulse.ScheduledJobTransformer' in singleton scope`)
        .on(this)
        .in(this.initializeTopLevelDependencies)
    );
  }

  /**
   * Initializes MongoDB client for CommandScheduler.
   * @async
   */
  async initializeMongoDBClientForCommandScheduler(): Promise<void> {
    const url = getenv.string(`EVEBLE_COMMAND_SCHEDULER_MONGODB_URL`);
    const options = {
      ...this.config.get<Record<string, any>>(
        'clients.MongoDB.CommandScheduler'
      ),
      ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
    };
    const databaseName = getenv.string(
      'EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME'
    );
    const collectionName = getenv.string(
      'EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION'
    );

    const mongoClient = new MongoDBClient({
      id: 'MongoDB.clients.CommandScheduler',
      url,
      options,
    });
    this.injector.injectInto(mongoClient);
    this.injector
      .bind<MongoDBClient>(BINDINGS.MongoDB.clients.CommandScheduler)
      .toConstantValue(mongoClient);

    this.log?.debug(
      new Log(`bound 'MongoDB.clients.CommandScheduler' as constant value`)
        .on(this)
        .in(this.initializeMongoDBClientForCommandScheduler)
    );

    this.mongoClient = this.injector.get<MongoDBClient>(
      BINDINGS.MongoDB.clients.CommandScheduler
    );
    await this.mongoClient.initialize();
    await this.mongoClient.connect();

    const collection = this.mongoClient.getCollection(
      databaseName,
      collectionName
    );
    this.injector
      .bind<Collection<any>>(BINDINGS.MongoDB.collections.ScheduledCommands)
      .toConstantValue(collection as Collection);
    this.log?.debug(
      new Log(`bound 'MongoDB.collections.CommandScheduler' as constant value`)
        .on(this)
        .in(this.initializeMongoDBClientForCommandScheduler)
    );
  }

  /**
   * Initializes Pulse client for CommandScheduler.
   * @async
   */
  async initializePulseClientForCommandScheduler(): Promise<void> {
    const databaseName = getenv.string(
      'EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME'
    );
    const collectionName = getenv.string(
      'EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION'
    );
    const options = this.config.get<Record<string, any>>(
      'clients.Pulse.CommandScheduler'
    );
    options.processEvery = getenv.int('EVEBLE_COMMAND_SCHEDULER_INTERVAL');
    const client = new PulseClient({
      id: 'Pulse.clients.CommandScheduler',
      databaseName,
      collectionName,
      options,
    });
    this.injector.injectInto(client);
    await client.initialize();
    this.injector
      .bind<PulseClient>(BINDINGS.Pulse.clients.CommandScheduler)
      .toConstantValue(client);
    this.log?.debug(
      new Log(`bound 'Pulse.clients.CommandScheduler' as constant value`)
        .on(this)
        .in(this.initializePulseClientForCommandScheduler)
    );
    this.pulseClient = this.injector.get<PulseClient>(
      BINDINGS.Pulse.clients.CommandScheduler
    );
  }

  /**
   * Initializes CommandScheduler.
   * @async
   */
  async initializeCommandScheduler(): Promise<void> {
    this.injector
      .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
      .to(PulseCommandScheduler)
      .inSingletonScope();
    this.log?.debug(
      new Log(
        `bound 'CommandScheduler' to 'PulseCommandScheduler' in singleton scope`
      )
        .on(this)
        .in(this.initializeCommandScheduler)
    );
  }
}
