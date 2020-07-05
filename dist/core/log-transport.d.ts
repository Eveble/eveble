import { types } from '../types';
import { RFC5424LoggingMixin } from '../mixins/rfc-5424-logging-mixin';
import { LogTransportConfig } from '../configs/log-transport-config';
export declare abstract class LogTransport extends RFC5424LoggingMixin {
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
