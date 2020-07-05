import { StatefulMixin } from '../mixins/stateful-mixin';
import { types } from '../types';
import { RFC5424LoggingMixin } from '../mixins/rfc-5424-logging-mixin';
declare enum STATES {
    constructed = "constructed",
    stopped = "stopped",
    running = "running"
}
declare const Logger_base: import("polytype").Polytype.ClusteredConstructor<[typeof StatefulMixin, typeof RFC5424LoggingMixin]>;
export declare class Logger extends Logger_base implements types.Logger {
    static STATES: typeof STATES;
    readonly levels: types.LogLevels;
    private transports;
    constructor(levels?: types.LogLevels);
    start(): void;
    stop(): void;
    isRunning(): boolean;
    isStopped(): boolean;
    getPriority(level: types.LogLevel): number;
    registerTransport(id: string, transport: types.LogTransport, shouldOverride?: boolean): void;
    overrideTransport(id: string, transport: types.LogTransport): void;
    getTransport(id: string): types.LogTransport | undefined;
    hasTransport(id: string): boolean;
    removeTransport(id: string): void;
    getTransports(): Map<string, types.LogTransport>;
    log(level: types.LogLevel, entry: string | types.LogEntry, ...args: any[]): void;
    protected initializeLoggedLevels(): void;
}
export {};
