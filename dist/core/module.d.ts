import { StatefulMixin } from '../mixins/stateful-mixin';
import { types } from '../types';
declare enum STATES {
    constructed = "constructed",
    configuring = "configuring",
    initializing = "initializing",
    initialized = "initialized",
    running = "running",
    stopped = "stopped",
    shutdown = "shutdown"
}
declare const Module_base: import("polytype").Polytype.ClusteredConstructor<[typeof StatefulMixin]>;
export declare abstract class Module extends Module_base implements types.Stateful, types.Module {
    static STATES: typeof STATES;
    config: types.Configurable;
    modules: types.Module[];
    app?: types.BaseApp;
    injector: types.Injector;
    log?: types.Logger;
    protected isResetting: boolean;
    constructor(props?: types.ModuleProps);
    initialize(app: types.BaseApp, injector: types.Injector): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    reset(): Promise<void>;
    shutdown(): Promise<void>;
    invokeAction(actionName: string, options?: types.ActionInvokingOptions): Promise<void>;
    protected validateModules(modules: types.Module[]): void;
    protected validateConfig(config: types.Configurable): void;
    protected initializeLogger(): Promise<void>;
    protected mergeConfigWithApp(app: types.BaseApp): void;
    protected isAppConfig(config: types.Configurable): boolean;
    protected initializeModules(modules: types.Module[], app: types.BaseApp, injector: types.Injector): Promise<void>;
    protected runInitializeHooks(injector: types.Injector): Promise<void>;
    protected runBeforeInitializeHooks(): Promise<void>;
    protected runOnInitializeHooks(injector: types.Injector): Promise<void>;
    protected runAfterInitializeHooks(): Promise<void>;
    protected runLifeCycleAction(actionName: string): Promise<void>;
    protected invokeActionOnDependentModules(actionName: string): Promise<void>;
    protected isAllowedToResetOnProduction(): boolean;
    isInProduction(): boolean;
    isInDevelopment(): boolean;
    protected isInEnv(env: string): boolean;
}
export {};
