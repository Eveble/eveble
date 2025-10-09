import { Pulse, Job, PulseConfig } from '@pulsecron/pulse';
import { inject } from 'inversify';
import { Client } from '../client';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { Log } from '../../components/log-entry';
import { MongoDBClient } from './mongodb-client';
import { Guid } from '../../domain/value-objects/guid';

export class PulseClient extends Client implements types.Client {
  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.Pulse.library)
  protected Pulse: typeof Pulse;

  @inject(BINDINGS.MongoDB.clients.CommandScheduler)
  public readonly mongoClient: MongoDBClient;

  public id: string | Guid;

  public state: types.State;

  public readonly databaseName: string;

  public readonly collectionName: string;

  public readonly options?: PulseConfig;

  protected _library?: Pulse;

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
      // Fix issue with constructor not being properly mapped between ESM and CJS
      // so it breaks the code when trying to instantiate Pulse on other
      // module using Eveble
      const PulseConstructor = (this.Pulse as any)?.Pulse
        ? (this.Pulse as any).Pulse
        : this.Pulse;

      this._library = new PulseConstructor({
        mongo: database,
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
      this.setState(PulseClient.STATES.initialized);
    } catch (error) {
      this.setState(PulseClient.STATES.failed);
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
   * @returns `Pulse` instance.
   */
  public get library(): Pulse {
    this.validateState([
      PulseClient.STATES.initialized,
      PulseClient.STATES.connected,
      PulseClient.STATES.paused,
      PulseClient.STATES.stopped,
      PulseClient.STATES.disconnected,
    ]);
    return this._library as Pulse;
  }

  /**
   * Connects to Pulse.
   * @async
   * @throws {Error}
   * Thrown if Pulse client can't be instantiated.
   */
  public async connect(): Promise<void> {
    this.validateState([
      PulseClient.STATES.initialized,
      PulseClient.STATES.connected,
      PulseClient.STATES.stopped,
    ]);

    if (this.isConnected()) {
      return;
    }
    this.log.debug(
      new Log(`connecting client '${this.getId()}'`).on(this).in(this.connect)
    );
    try {
      this.setState(PulseClient.STATES.connected);
      this.log.debug(
        new Log(`connected client '${this.getId()}'`).on(this).in(this.connect)
      );
    } catch (error) {
      this.setState(PulseClient.STATES.failed);
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
   * Starts Pulse job processing.
   * Should be called after all jobs are defined.
   * @async
   */
  public async startProcessing(jobName: string): Promise<void> {
    if (!this.isConnected()) {
      throw new Error(
        'Pulse client must be connected before starting processing'
      );
    }
    this.log.debug(
      new Log(`starting job processing on client '${this.getId()}'`)
        .on(this)
        .in(this.startProcessing)
        .with('jobName', jobName)
        .with('processEvery', this.getInterval())
    );

    await this.library.start();
  }

  /**
   * Stops Pulse client.
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

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.setState(PulseClient.STATES.stopped);
    this.log.debug(
      new Log(`stopped client '${this.getId()}'`).on(this).in(this.stop)
    );
  }

  /**
   * Disconnects Pulse client.
   * @async
   */
  public async disconnect(): Promise<void> {
    if (!this.isInState(PulseClient.STATES.stopped)) {
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
    this.setState(PulseClient.STATES.disconnected);
    delete this._library;
    this.log.debug(
      new Log(`disconnected client '${this.getId()}'`)
        .on(this)
        .in(this.disconnect)
    );
  }

  /**
   * Reconnects Pulse.
   * @async
   */
  public async reconnect(): Promise<void> {
    this.log.debug(
      new Log(`reconnecting client '${this.getId()}'`)
        .on(this)
        .in(this.reconnect)
    );
    this.setState(PulseClient.STATES.paused);
    if (!this.isConnected()) {
      await this.initialize();
      await this.connect();
    }
  }

  /**
   * Evaluates if client is connected to Pulse.
   * @returns Returns `true` if client is connected, else `false`.
   */
  public isConnected(): boolean {
    return (
      this._library !== undefined &&
      this.isInState(PulseClient.STATES.connected) &&
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
    this._library?.on('ready', async (): Promise<void> => {
      this.log.debug(
        new Log(`activated client '${this.getId()}'`)
          .on(this)
          .in(this.initializeEventHandlers)
      );
    });

    this._library?.on('start', async (job: Job): Promise<void> => {
      this.log.debug(
        new Log(`started job '${job.attrs.name}'`)
          .on(this)
          .in(this.initializeEventHandlers)
      );
    });

    this._library?.on('complete', async (job: Job): Promise<void> => {
      this.log.debug(
        new Log(`completed job '${job.attrs.name}'`)
          .on(this)
          .in(this.initializeEventHandlers)
      );
    });

    this._library?.on('success', async (job: Job): Promise<void> => {
      this.log.debug(
        new Log(`successful job '${job.attrs.name}'`)
          .on(this)
          .in(this.initializeEventHandlers)
      );
    });

    this._library?.on('fail', async (error: Error, job: Job): Promise<void> => {
      this.log.error(
        new Log(`failed job '${job.attrs.name}' do to error: ${error}`)
          .on(this)
          .in(this.initializeEventHandlers)
      );
    });
  }
}
