import { MongoDBClient } from '../clients/mongodb-client';
import { Module } from '../../core/module';
export declare class MongoDBSnapshotStorageModule extends Module {
    mongoClient?: MongoDBClient;
    protected onInitialize(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onShutdown(): Promise<void>;
    protected initializeClientForSnapshotter(): Promise<void>;
    protected initializeSnapshotSerializer(): Promise<void>;
    protected initializeSnapshotter(): Promise<void>;
}
