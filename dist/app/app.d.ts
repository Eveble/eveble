/// <reference types="node" />
import { BaseApp } from '../core/base-app';
import { AppConfig } from '../configs/app-config';
import { types } from '../types';
export declare class App extends BaseApp {
    injector: types.Injector;
    config: AppConfig;
    modules: types.Module[];
    log: types.Logger;
    readonly envFilePath: string;
    constructor(props?: types.ModuleProps & {
        config?: AppConfig | Partial<AppConfig> | Record<string, any>;
    });
    send(command: types.Command): Promise<any>;
    publish(event: types.Event): Promise<void>;
    subscribeTo(eventType: types.MessageType<types.Event>, handler: types.Handler): Promise<void>;
    isInProduction(): boolean;
    isSnapshotting(): boolean;
    isCommandScheduling(): boolean;
    protected onConfiguration(): Promise<void>;
    protected initializeGracefulShutdown(): Promise<void>;
    onProcessSignal(code: NodeJS.Signals): Promise<void>;
    protected initializeExternalDependencies(): Promise<void>;
    protected initializeSchedulers(): Promise<void>;
    protected initializeStorages(): Promise<void>;
}
