import { types } from '../types';
declare enum STATES {
    constructed = "constructed",
    stopped = "stopped",
    running = "running"
}
declare const Logger_base: (new () => {
    [x: string]: any;
    state: types.State;
    setState(state: types.State): void;
    isInState(state: types.State | types.State[]): boolean;
    isInOneOfStates(states: types.State | types.State[]): boolean;
    getState(): types.State;
    hasState(): boolean;
    validateState(stateOrStates: types.State | types.State[], error?: Error | undefined): boolean;
    getSelectableStates(): Record<string, types.State>;
} & {
    [x: string]: any;
    emerg(entry: string | types.LogEntry, ...args: any[]): void;
    alert(entry: string | types.LogEntry, ...args: any[]): void;
    crit(entry: string | types.LogEntry, ...args: any[]): void;
    error(entry: string | types.LogEntry, ...args: any[]): void;
    warning(entry: string | types.LogEntry, ...args: any[]): void;
    notice(entry: string | types.LogEntry, ...args: any[]): void;
    info(entry: string | types.LogEntry, ...args: any[]): void;
    debug(entry: string | types.LogEntry, ...args: any[]): void;
    log(entry: string | types.LogEntry, ...args: any[]): void;
}) & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        state: types.State;
        setState(state: types.State): void;
        isInState(state: types.State | types.State[]): boolean;
        isInOneOfStates(states: types.State | types.State[]): boolean;
        getState(): types.State;
        hasState(): boolean;
        validateState(stateOrStates: types.State | types.State[], error?: Error | undefined): boolean;
        getSelectableStates(): Record<string, types.State>;
    };
} & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        emerg(entry: string | types.LogEntry, ...args: any[]): void;
        alert(entry: string | types.LogEntry, ...args: any[]): void;
        crit(entry: string | types.LogEntry, ...args: any[]): void;
        error(entry: string | types.LogEntry, ...args: any[]): void;
        warning(entry: string | types.LogEntry, ...args: any[]): void;
        notice(entry: string | types.LogEntry, ...args: any[]): void;
        info(entry: string | types.LogEntry, ...args: any[]): void;
        debug(entry: string | types.LogEntry, ...args: any[]): void;
        log(entry: string | types.LogEntry, ...args: any[]): void;
    };
};
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
