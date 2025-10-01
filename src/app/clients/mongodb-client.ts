import { MongoClient, Db, Collection, MongoClientOptions } from 'mongodb';
import { inject } from 'inversify';
import { isEmpty } from 'lodash';
import { Type } from '@eveble/core';
import { Client } from '../client';
import { BINDINGS } from '../../constants/bindings';
import { types } from '../../types';
import { Config } from '../../components/config';
import { Log } from '../../components/log-entry';
import { Guid } from '../../domain/value-objects/guid';

@Type()
export class MongoDBCollectionConfig extends Config {
  public name: string;

  public indexes?: any[]; // Issue with correct definition

  constructor(props: Partial<MongoDBCollectionConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

@Type()
export class MongoDBDatabaseConfig extends Config {
  public name: string;

  public collections: MongoDBCollectionConfig[];

  constructor(props: Partial<MongoDBDatabaseConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

export class MongoDBClient extends Client implements types.Client {
  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.MongoDB.library)
  protected MongoDB: any;

  static defaultOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  public id: string | Guid;

  public state: types.State;

  public url: string;

  public databases: MongoDBDatabaseConfig[];

  public options?: MongoClientOptions;

  public _library?: MongoClient;

  /**
   * Creates an instance of MongoDBClient.
   * @param props - Properties of the type required for construction.
   */
  constructor(props: Partial<MongoDBClient>) {
    const processedProps: types.Props = {
      databases: [],
      ...props,
    };
    processedProps.options = {
      ...MongoDBClient.defaultOptions,
      ...(props.options || {}),
    };
    super(processedProps);
  }

  /**
   * Initializes client.
   * @async
   */
  public async initialize(): Promise<void> {
    this.log.debug(
      new Log(`initializing client '${this.getId()}'`)
        .on(this)
        .in(this.initialize)
        .with('url', this.url)
        .with('options', this.options)
    );
    try {
      this._library = new this.MongoDB(this.url, this.options);
      this.setState(Client.STATES.initialized);
      this.log.debug(
        new Log(`successfully initialized client '${this.getId()}'`)
          .on(this)
          .in(this.initialize)
          .with('url', this.url)
          .with('options', this.options)
      );
    } catch (error) {
      this.setState(Client.STATES.failed);
      this.log.error(
        new Log(
          `failed to initialize client '${this.getId()}' do to error: ${error}`
        )
          .on(this)
          .in(this.initialize)
          .with('url', this.url)
          .with('options', this.options)
      );

      throw error;
    }
  }

  /**
   * Gets library instance.
   * @returns `MongoClient` instance.
   */
  public get library(): MongoClient {
    this.validateState([
      MongoDBClient.STATES.initialized,
      MongoDBClient.STATES.connected,
      MongoDBClient.STATES.paused,
      MongoDBClient.STATES.stopped,
      MongoDBClient.STATES.disconnected,
    ]);
    return this._library as MongoClient;
  }

  /**
   * Connects to MongoDB.
   * @async
   * @throws {Error}
   * Thrown if the connection to MongoDB cannot be established.
   */
  public async connect(): Promise<void> {
    this.validateState([
      Client.STATES.initialized,
      Client.STATES.connected,
      Client.STATES.stopped,
    ]);

    if (this.isConnected()) {
      return;
    }
    this.log.debug(
      new Log(`connecting client '${this.getId()}'`).on(this).in(this.connect)
    );
    try {
      await this._library?.connect();
      this.setState(Client.STATES.connected);
      if (!isEmpty(this.databases)) {
        await this.initializeDatabases(this.databases);
      }
      this.log.debug(
        new Log(`connected client '${this.getId()}'`).on(this).in(this.connect)
      );
    } catch (error) {
      this.setState(Client.STATES.failed);
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
   * Disconnects MongoDB client.
   * @async
   */
  public async disconnect(): Promise<void> {
    if (!this.isInState(Client.STATES.stopped)) {
      if (!this.isConnected()) {
        return;
      }
    }
    this.log.debug(
      new Log(`disconnecting client '${this.getId()}'`)
        .on(this)
        .in(this.disconnect)
    );
    await this._library?.close();
    this.setState(Client.STATES.disconnected);
    delete this._library;
    this.log.debug(
      new Log(`disconnected client '${this.getId()}'`)
        .on(this)
        .in(this.disconnect)
    );
  }

  /**
   * Reconnects to MongoDB.
   * @async
   */
  public async reconnect(): Promise<void> {
    this.log.debug(
      new Log(`reconnecting client '${this.getId()}'`)
        .on(this)
        .in(this.reconnect)
    );
    if (!this.isConnected()) {
      await this.initialize();
      await this.connect();
    }
  }

  /**
   * Evaluates if client is connected to MongoDB.
   * @returns Returns `true` if client is connected, else `false`.
   */
  public isConnected(): boolean {
    return (
      this._library !== undefined &&
      this.isInState(Client.STATES.connected) &&
      this._library?.isConnected()
    );
  }

  /**
   * Returns database from MongoClient.
   * @param name - Database name.
   * @returns `Db` instance from MongoClient.
   */
  public getDatabase(name: string): Db {
    this.validateState([
      Client.STATES.initialized,
      Client.STATES.connected,
      Client.STATES.stopped,
    ]);

    return (this._library as MongoClient)?.db(name);
  }

  /**
   * Returns collection from MongoClient.
   * @param databaseName - Database name.
   * @param collectionName - Collection name.
   * @returns `Collection` instance from MongoClient.
   */
  public getCollection(
    databaseName: string,
    collectionName: string
  ): Collection {
    return this.getDatabase(databaseName).collection(collectionName);
  }

  /**
   * Initializes predefined databases.
   * @async
   */
  protected async initializeDatabases(
    databases: MongoDBDatabaseConfig[]
  ): Promise<void> {
    for (const dbDefinition of databases) {
      const { name, collections } = dbDefinition;

      const db = this.getDatabase(name);
      await this.initializeCollections(db, collections);
    }
  }

  /**
   * Initializes predefined collections.
   * @async
   */
  protected async initializeCollections(
    db: Db,
    collections: MongoDBCollectionConfig[]
  ): Promise<void> {
    for (const collDefinition of collections) {
      const { name, indexes } = collDefinition;

      const collection = db.collection(name);
      if (indexes !== undefined) {
        for (const indexDefinition of indexes) {
          // eslint-disable-next-line prefer-spread
          await collection.createIndex.apply(collection, indexDefinition);
        }
      }
    }
  }
}
