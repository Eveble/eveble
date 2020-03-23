import Agenda, { Job } from 'agenda';
import { inject } from '@parisholley/inversify-async';
import { Client } from '../client';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { define } from '../../decorators/define';
import { Log } from '../../components/log-entry';
import { MongoDBClient } from './mongodb-client';
import { Guid } from '../../domain/value-objects/guid';

@define()
export class AgendaClient extends Client implements types.Client {
  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.Agenda.library)
  protected Agenda: any;

  @inject(BINDINGS.MongoDB.clients.CommandScheduler)
  public readonly mongoClient: MongoDBClient;

  public id: string | Guid;

  public state: types.State;

  public readonly databaseName: string;

  public readonly collectionName: string;

  public readonly options?: Record<string, any>;

  protected _library?: Agenda;

  /**
   * Initializes client.
   * @async
   */
  public async initialize(): Promise<void> {
    this.log.debug(
      new Log(`initializing client '${this.getId()}'`)
        .on(this)
        .in(this.initialize)
        .with('url', this.mongoClient.url)
        .with('options', this.options)
        .with('collectionName', this.collectionName)
    );
    try {
      const database = this.mongoClient.getDatabase(this.databaseName);
      this._library = new this.Agenda({
        mongo: database,
        collection: this.collectionName,
        ...this.options,
      });
      await this.initializeEventHandlers();
      this.log.debug(
        new Log(`successfully initialized client '${this.getId()}'`)
          .on(this)
          .in(this.initialize)
          .with('url', this.mongoClient.url)
          .with('options', this.options)
          .with('collectionName', this.collectionName)
      );
      this.setState(AgendaClient.STATES.initialized);
      this.setState('initialized');
    } catch (error) {
      this.setState(AgendaClient.STATES.failed);
      this.log.error(
        new Log(
          `failed to initialize client '${this.getId()}' do to error: ${error}`
        )
          .on(this)
          .in(this.initialize)
          .with('url', this.mongoClient.url)
          .with('options', this.options)
          .with('collectionName', this.collectionName)
      );

      throw error;
    }
  }

  /**
   * Gets library instance.
   * @returns `Agenda` instance.
   */
  public get library(): Agenda {
    this.validateState([
      AgendaClient.STATES.initialized,
      AgendaClient.STATES.connected,
      AgendaClient.STATES.paused,
      AgendaClient.STATES.stopped,
      AgendaClient.STATES.disconnected,
    ]);
    return this._library as Agenda;
  }

  /**
   * Connects to Agenda.
   * @async
   * @throws {Error}
   * Thrown if Agenda client can't be instantiated.
   */
  public async connect(): Promise<void> {
    this.validateState([
      AgendaClient.STATES.initialized,
      AgendaClient.STATES.connected,
      AgendaClient.STATES.stopped,
    ]);

    if (this.isConnected()) {
      return;
    }
    this.log.debug(
      new Log(`connecting client '${this.getId()}'`).on(this).in(this.connect)
    );
    try {
      await this.library.start();
      this.setState(AgendaClient.STATES.connected);
      this.log.debug(
        new Log(`connected client '${this.getId()}'`).on(this).in(this.connect)
      );
    } catch (error) {
      this.setState(AgendaClient.STATES.failed);
      this.log.error(
        new Log(
          `failed connection on client '${this.getId()}' do to error: ${error}`
        )
          .on(this)
          .in(this.connect)
      );

      throw error;
    }
  }

  /**
   * Stops Agenda client.
   * @async
   */
  public async stop(): Promise<void> {
    if (!this.isConnected()) {
      return;
    }
    this.log.debug(
      new Log(`stopping client '${this.getId()}'`).on(this).in(this.stop)
    );
    await this.library.stop();
    this.setState(AgendaClient.STATES.stopped);
    this.log.debug(
      new Log(`stopped client '${this.getId()}'`).on(this).in(this.stop)
    );
  }

  /**
   * Disconnects Agenda client.
   * @async
   */
  public async disconnect(): Promise<void> {
    if (!this.isInState(AgendaClient.STATES.stopped)) {
      if (!this.isConnected()) {
        return;
      }
    }
    this.log.debug(
      new Log(`disconnecting client '${this.getId()}'`)
        .on(this)
        .in(this.disconnect)
    );
    await this.stop();
    this.setState(AgendaClient.STATES.disconnected);
    delete this._library;
    this.log.debug(
      new Log(`disconnected client '${this.getId()}'`)
        .on(this)
        .in(this.disconnect)
    );
  }

  /**
   * Reconnects Agenda.
   * @async
   */
  public async reconnect(): Promise<void> {
    this.log.debug(
      new Log(`reconnecting client '${this.getId()}'`)
        .on(this)
        .in(this.reconnect)
    );
    this.setState(AgendaClient.STATES.paused);
    if (!this.isConnected()) {
      await this.initialize();
      await this.connect();
    }
  }

  /**
   * Evaluates if client is connected to Agenda.
   * @returns Returns `true` if client is connected, else `false`.
   */
  public isConnected(): boolean {
    return (
      this._library !== undefined &&
      this.isInState(AgendaClient.STATES.connected) &&
      this.mongoClient.isConnected()
    );
  }

  /**
   * Returns frequency at which client will query looking for jobs that need to be processed.
   * @return Interval for query frequency as a `number`, else `undefined`.
   */
  public getInterval(): number | undefined {
    if (this.options?.processEvery === undefined) return undefined;
    return typeof this.options?.processEvery === 'number'
      ? this.options?.processEvery
      : parseFloat(this.options?.processEvery);
  }

  /**
   * Initializes event handlers.
   * @async
   */
  protected async initializeEventHandlers(): Promise<void> {
    this._library?.on(
      'ready',
      async (): Promise<void> => {
        this.log.debug(
          new Log(`activated client '${this.getId()}'`)
            .on(this)
            .in(this.initializeEventHandlers)
        );
      }
    );

    this._library?.on(
      'start',
      async (job: Job): Promise<void> => {
        this.log.debug(
          new Log(`started job '${job.attrs.name}'`)
            .on(this)
            .in(this.initializeEventHandlers)
        );
      }
    );

    this._library?.on(
      'complete',
      async (job: Job): Promise<void> => {
        this.log.debug(
          new Log(`completed job '${job.attrs.name}'`)
            .on(this)
            .in(this.initializeEventHandlers)
        );
      }
    );

    this._library?.on(
      'success',
      async (job: Job): Promise<void> => {
        this.log.debug(
          new Log(`successful job '${job.attrs.name}'`)
            .on(this)
            .in(this.initializeEventHandlers)
        );
      }
    );

    this._library?.on(
      'fail',
      async (error: Error, job: Job): Promise<void> => {
        this.log.error(
          new Log(`failed job '${job.attrs.name}' do to error: ${error}`)
            .on(this)
            .in(this.initializeEventHandlers)
        );
      }
    );
  }
}
