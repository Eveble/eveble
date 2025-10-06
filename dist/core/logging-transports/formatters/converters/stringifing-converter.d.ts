import winston from 'winston';
import { types } from '../../../../types';
import { LogTransportConfig } from '../../../../configs/log-transport-config';
export declare class StringifingConverter implements types.LogConverter {
    convertArguments(entry: winston.LogEntry | types.LogEntry, options?: LogTransportConfig): string;
    convertMetadata(metadata: types.LogMetadata, entry: winston.LogEntry | types.LogEntry, options: LogTransportConfig): string;
    protected stringifyValue(value: any, inspectOptions?: types.node.util.InspectOptions, prefix?: string, suffix?: string): string;
    protected stringifyMethodParams(entry: winston.LogEntry | types.LogEntry, metadata: types.LogMetadata, inspectOptions?: types.node.util.InspectOptions): string;
    protected stringifyClassProps(entry: winston.LogEntry | types.LogEntry, metadata: types.LogMetadata, inspectOptions?: types.node.util.InspectOptions): string;
    protected stringifyObject(obj: Record<keyof any, string>, inspectOptions?: types.node.util.InspectOptions): string;
    protected isPrimitive(arg: any): boolean;
    protected resolveInspectOptions(entry: winston.LogEntry | types.LogEntry, options: LogTransportConfig): types.node.util.InspectOptions;
}
