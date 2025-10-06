import 'reflect-metadata';
import winston from 'winston';
import { LogTransportConfig } from '../../configs/log-transport-config';
import { types } from '../../types';
import { LogTransport } from '../log-transport';
export declare class ConsoleTransport extends LogTransport implements types.LogTransport {
    readonly level: types.LogLevel;
    readonly config: LogTransportConfig;
    logger: types.Logger;
    protected winston: any;
    protected simpleFormatter: types.LogFormatter;
    protected detailedFormatter: types.LogFormatter;
    client: winston.Logger;
    protected format?: any;
    constructor(level: types.LogLevel, config: LogTransportConfig, format?: any);
    initialize(): void;
    protected createWinstonLogger(props: winston.LoggerOptions): winston.Logger;
    protected initializeColors(colors: Record<string, string>): void;
    protected resolveFormatter(): any;
    formatEntry(entry: winston.LogEntry | types.LogEntry): string;
}
