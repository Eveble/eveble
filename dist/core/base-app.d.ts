import { Module } from './module';
import { types } from '../types';
export declare abstract class BaseApp extends Module implements types.BaseApp {
    config: types.Configurable;
    injector: types.Injector;
    log?: types.Logger;
    modules: types.Module[];
    constructor(props?: types.AppProps);
    debug(): void;
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
    afterShutdown(): Promise<void>;
    configure(props: types.ConfigProps): void;
    protected onConfiguration(): Promise<void>;
    protected bindKernelDependencies(): void;
    protected bindAppDependencies(): void;
    protected bindExternalDependencies(): void;
    protected bindLoggerDependencies(): void;
    protected initializeLogger(): Promise<void>;
    protected createLogger(): Promise<types.Logger>;
    protected createConsoleTransport(): Promise<types.LogTransport>;
    protected startLogging(): Promise<void>;
    protected logStartingMessage(consoleTransport: types.LogTransport): void;
    protected logExitingMessage(consoleTransport: types.LogTransport): void;
    protected initializeSingletons(): Promise<void>;
}
