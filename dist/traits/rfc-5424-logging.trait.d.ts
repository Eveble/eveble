import { types } from '../types';
export declare const RFC5424LoggingTrait: import("@traits-ts/core").Trait<(base: any) => {
    new (): {
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
    [x: string]: any;
}, undefined>;
