import { types } from '../types';
import { LogTransportConfig } from '../configs/log-transport-config';
export declare function loggerLoader(injector: types.Injector, level: types.LogLevel, consoleTransportConfig?: LogTransportConfig, levels?: types.LogLevels): types.Logger;
