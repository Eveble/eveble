import { MongoClient, Db, Collection, MongoClientOptions } from 'mongodb';
import { Client } from '../client';
import { types } from '../../types';
import { Config } from '../../components/config';
import { Guid } from '../../domain/value-objects/guid';
export declare class MongoDBCollectionConfig extends Config {
    name: string;
    indexes?: any[];
    constructor(props: Partial<MongoDBCollectionConfig>);
}
export declare class MongoDBDatabaseConfig extends Config {
    name: string;
    collections: MongoDBCollectionConfig[];
    constructor(props: Partial<MongoDBDatabaseConfig>);
}
export declare class MongoDBClient extends Client implements types.Client {
    protected log: types.Logger;
    protected MongoDB: any;
    static defaultOptions: {};
    id: string | Guid;
    state: types.State;
    url: string;
    databases: MongoDBDatabaseConfig[];
    options?: MongoClientOptions;
    _library?: MongoClient;
    constructor(props: Partial<MongoDBClient>);
    initialize(): Promise<void>;
    get library(): MongoClient;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    reconnect(): Promise<void>;
    isConnected(): boolean;
    getDatabase(name: string): Db;
    getCollection(databaseName: string, collectionName: string): Collection;
    protected initializeDatabases(databases: MongoDBDatabaseConfig[]): Promise<void>;
    protected initializeCollections(db: Db, collections: MongoDBCollectionConfig[]): Promise<void>;
}
