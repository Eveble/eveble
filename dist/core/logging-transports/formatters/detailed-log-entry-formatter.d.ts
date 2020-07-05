import winston from 'winston';
import { types } from '../../../types';
import { LogTransportConfig } from '../../../configs/log-transport-config';
export declare class DetailedLogFormatter implements types.LogFormatter {
    protected converter: types.LogConverter;
    protected chalk: any;
    constructor(converter: types.LogConverter, chalk: any);
    format(entry: winston.LogEntry | types.LogEntry, config: LogTransportConfig): string;
    protected getMethodName(entry: winston.LogEntry | types.LogEntry, config: LogTransportConfig, colors: Record<string, string>): any;
    protected getTargetName(entry: winston.LogEntry | types.LogEntry, config: LogTransportConfig, colors: Record<string, string>): string;
    protected getLabel(config: LogTransportConfig, colors: Record<string, string>): string;
    protected getTimestamp(entry: winston.LogEntry | types.LogEntry, config: LogTransportConfig, colors: Record<string, string>): string;
    protected getSeparator(config: LogTransportConfig, colors: Record<string, string>): string;
    protected getInitial(config: LogTransportConfig, colors: Record<string, string>): string;
    protected processPartsColors(config: LogTransportConfig): Record<string, string>;
    protected abbreviate(str: string, config: LogTransportConfig): string;
}
