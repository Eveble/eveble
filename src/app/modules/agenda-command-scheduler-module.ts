import getenv from 'getenv';
import { Collection } from 'mongodb';
import { AgendaClient } from '../clients/agenda-client';
import { MongoDBClient } from '../clients/mongodb-client';
import { AgendaCommandScheduler } from '../../infrastructure/schedulers/agenda-command-scheduler';
import { AgendaScheduledJobTransformer } from '../../infrastructure/transformers/agenda-scheduled-job-transformer';
import { Module } from '../../core/module';
import { types } from '../../types';
import { Log } from '../../components/log-entry';
import { BINDINGS } from '../../constants/bindings';

export class AgendaCommandSchedulerModule extends Module {
  agendaClient?: AgendaClient;

  mongoClient?: MongoDBClient;

  /**
   * On before initialize hook.
   * @async
   */
  protected async beforeInitialize(): Promise<void> {
    await this.initializeTopLevelDependencies();
    await this.initializeMongoDBClientForCommandScheduler();
    await this.initializeAgendaClientForCommandScheduler();
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
    await this.agendaClient?.connect();
  }

  /**
   * On stop hook.
   * @async
   */
  protected async onStop(): Promise<void> {
    await this.agendaClient?.stop();
  }

  /**
   * On module shutdown hook.
   * @async
   */
  protected async onShutdown(): Promise<void> {
    await this.agendaClient?.disconnect();
    await this.mongoClient?.disconnect();
  }

  /**
   * Initializes top level dependencies.
   * @async
   */
  async initializeTopLevelDependencies(): Promise<void> {
    this.injector
      .bind<types.AgendaJobTransformer>(BINDINGS.Agenda.jobTransformer)
      .to(AgendaScheduledJobTransformer)
      .inSingletonScope();
    this.log?.debug(
      new Log(`bound 'Agenda.ScheduledJobTransformer' in singleton scope`)
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
      useUnifiedTopology: false,
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
   * Initializes Agenda client for CommandScheduler.
   * @async
   */
  async initializeAgendaClientForCommandScheduler(): Promise<void> {
    const databaseName = getenv.string(
      'EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME'
    );
    const collectionName = getenv.string(
      'EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION'
    );
    const options = this.config.get<Record<string, any>>(
      'clients.Agenda.CommandScheduler'
    );
    options.processEvery = getenv.int('EVEBLE_COMMAND_SCHEDULER_INTERVAL');
    const client = new AgendaClient({
      id: 'Agenda.clients.CommandScheduler',
      databaseName,
      collectionName,
      options,
    });
    this.injector.injectInto(client);
    await client.initialize();
    this.injector
      .bind<AgendaClient>(BINDINGS.Agenda.clients.CommandScheduler)
      .toConstantValue(client);
    this.log?.debug(
      new Log(`bound 'Agenda.clients.CommandScheduler' as constant value`)
        .on(this)
        .in(this.initializeAgendaClientForCommandScheduler)
    );
    this.agendaClient = this.injector.get<AgendaClient>(
      BINDINGS.Agenda.clients.CommandScheduler
    );
  }

  /**
   * Initializes CommandScheduler.
   * @async
   */
  async initializeCommandScheduler(): Promise<void> {
    this.injector
      .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
      .to(AgendaCommandScheduler)
      .inSingletonScope();
    this.log?.debug(
      new Log(
        `bound 'CommandScheduler' to 'AgendaCommandScheduler' in singleton scope`
      )
        .on(this)
        .in(this.initializeCommandScheduler)
    );
  }
}
