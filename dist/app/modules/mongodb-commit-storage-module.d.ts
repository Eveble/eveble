import { MongoDBClient } from '../clients/mongodb-client';
import { Module } from '../../core/module';
export declare class MongoDBCommitStorageModule extends Module {
    mongoClient?: MongoDBClient;
    protected onInitialize(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onShutdown(): Promise<void>;
    protected initializeClientForCommitStorage(): Promise<void>;
    protected initializeCommitSerializer(): Promise<void>;
    protected initializeCommitStorage(): Promise<void>;
    protected initializeCommitObserver(): Promise<void>;
}
