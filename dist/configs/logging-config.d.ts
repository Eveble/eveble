import { Config } from '../components/config';
import { LogTransportConfig } from './log-transport-config';
import { types } from '../types';
export declare class LoggingConfig extends Config {
    isEnabled?: boolean | undefined;
    levels?: types.LogLevels;
    transports?: {
        console?: LogTransportConfig;
    };
    constructor(props?: Partial<LoggingConfig>);
}
