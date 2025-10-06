import { types } from '../types';
import { LogTransportConfig } from '../configs/log-transport-config';
declare const LogTransport_base: (new () => {
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
export declare abstract class LogTransport extends LogTransport_base {
    readonly level: types.LogLevel;
    readonly config?: LogTransportConfig;
    logger: types.Logger;
    client: any;
    constructor(level: types.LogLevel, config?: LogTransportConfig);
    initialize(): void;
    isLoggable(level: types.LogLevel): boolean;
    log(level: types.LogLevel, entry: string | types.LogEntry, ...args: any[]): void;
    protected initializeLoggedLevels(): void;
}
export {};
