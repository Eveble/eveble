import { PulseClient } from '../clients/pulse-client';
import { MongoDBClient } from '../clients/mongodb-client';
import { Module } from '../../core/module';
export declare class PulseCommandSchedulerModule extends Module {
    pulseClient?: PulseClient;
    mongoClient?: MongoDBClient;
    protected beforeInitialize(): Promise<void>;
    protected onInitialize(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onStop(): Promise<void>;
    protected onShutdown(): Promise<void>;
    initializeTopLevelDependencies(): Promise<void>;
    initializeMongoDBClientForCommandScheduler(): Promise<void>;
    initializePulseClientForCommandScheduler(): Promise<void>;
    initializeCommandScheduler(): Promise<void>;
}
