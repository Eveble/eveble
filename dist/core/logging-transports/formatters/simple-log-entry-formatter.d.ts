import winston from 'winston';
import { types } from '../../../types';
export declare class SimpleLogFormatter implements types.LogFormatter {
    protected converter: types.LogConverter;
    constructor(converter: types.LogConverter);
    format(entry: winston.LogEntry | types.LogEntry): string;
}
