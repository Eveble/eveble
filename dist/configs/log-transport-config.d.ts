import { Config } from '../components/config';
import { types } from '../types';
export declare class LogTransportConfig extends Config {
    isEnabled?: boolean | undefined;
    level?: types.LogLevel;
    logColors?: {
        [colorName: string]: string;
    };
    partsColors?: {
        initial?: string;
        separator?: string;
        timestamp?: string;
        target?: string;
        method?: string;
        label?: string;
    };
    messages?: {
        start?: string;
        exit?: string;
    };
    parts?: {
        initial?: string;
        separator?: string;
        label?: string;
    };
    flags?: {
        isTimestamped?: boolean;
        isLabeled?: boolean;
        showTarget?: boolean;
        showMethod?: boolean;
        isColored?: boolean;
        isWholeLineColored?: boolean;
        includeStackTrace?: boolean;
        isAbbreviatingSources?: boolean;
    };
    timestampFormat?: string;
    abbreviationLength?: number;
    inspectDepth?: number;
    constructor(props?: Partial<LogTransportConfig>);
}
