import { Pulse } from '@pulsecron/pulse';
import { Client } from '../client';
import { types } from '../../types';
import { MongoDBClient } from './mongodb-client';
import { Guid } from '../../domain/value-objects/guid';
export declare class PulseClient extends Client implements types.Client {
    protected log: types.Logger;
    protected Pulse: any;
    readonly mongoClient: MongoDBClient;
    id: string | Guid;
    state: types.State;
    readonly databaseName: string;
    readonly collectionName: string;
    readonly options?: Record<string, any>;
    protected _library?: Pulse;
    initialize(): Promise<void>;
    get library(): Pulse;
    connect(): Promise<void>;
    startProcessing(jobName: string): Promise<void>;
    stop(): Promise<void>;
    disconnect(): Promise<void>;
    reconnect(): Promise<void>;
    isConnected(): boolean;
    getInterval(): number | undefined;
    protected initializeEventHandlers(): Promise<void>;
}
