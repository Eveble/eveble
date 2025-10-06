import Agenda from 'agenda';
import { Client } from '../client';
import { types } from '../../types';
import { MongoDBClient } from './mongodb-client';
import { Guid } from '../../domain/value-objects/guid';
export declare class AgendaClient extends Client implements types.Client {
    protected log: types.Logger;
    protected Agenda: any;
    readonly mongoClient: MongoDBClient;
    id: string | Guid;
    state: types.State;
    readonly databaseName: string;
    readonly collectionName: string;
    readonly options?: Record<string, any>;
    protected _library?: Agenda;
    initialize(): Promise<void>;
    get library(): Agenda;
    connect(): Promise<void>;
    stop(): Promise<void>;
    disconnect(): Promise<void>;
    reconnect(): Promise<void>;
    isConnected(): boolean;
    getInterval(): number | undefined;
    protected initializeEventHandlers(): Promise<void>;
}
