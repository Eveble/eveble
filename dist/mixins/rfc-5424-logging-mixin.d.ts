import { types } from '../types';
export declare class RFC5424LoggingMixin {
    emerg(entry: string | types.LogEntry, ...args: any[]): void;
    alert(entry: string | types.LogEntry, ...args: any[]): void;
    crit(entry: string | types.LogEntry, ...args: any[]): void;
    error(entry: string | types.LogEntry, ...args: any[]): void;
    warning(entry: string | types.LogEntry, ...args: any[]): void;
    notice(entry: string | types.LogEntry, ...args: any[]): void;
    info(entry: string | types.LogEntry, ...args: any[]): void;
    debug(entry: string | types.LogEntry, ...args: any[]): void;
    log(entry: string | types.LogEntry, ...args: any[]): void;
}
