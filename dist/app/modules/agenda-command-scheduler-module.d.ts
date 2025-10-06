import { AgendaClient } from '../clients/agenda-client';
import { MongoDBClient } from '../clients/mongodb-client';
import { Module } from '../../core/module';
export declare class AgendaCommandSchedulerModule extends Module {
    agendaClient?: AgendaClient;
    mongoClient?: MongoDBClient;
    protected beforeInitialize(): Promise<void>;
    protected onInitialize(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onStop(): Promise<void>;
    protected onShutdown(): Promise<void>;
    initializeTopLevelDependencies(): Promise<void>;
    initializeMongoDBClientForCommandScheduler(): Promise<void>;
    initializeAgendaClientForCommandScheduler(): Promise<void>;
    initializeCommandScheduler(): Promise<void>;
}
