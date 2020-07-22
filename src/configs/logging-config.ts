import getenv from 'getenv';
import { define } from '@eveble/core';
import { Config } from '../components/config';
import { LogTransportConfig } from './log-transport-config';
import { types } from '../types';

@define()
export class LoggingConfig extends Config {
  public isEnabled? = true;

  public levels?: types.LogLevels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  };

  public transports?: {
    console?: LogTransportConfig;
  } = {
    console: new LogTransportConfig({
      level: getenv.string('LOGGING_LEVEL', 'info'),
    }),
  };

  constructor(props?: Partial<LoggingConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}
