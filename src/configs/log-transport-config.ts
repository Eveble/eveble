import chalk from 'chalk';
import { define } from '@eveble/core';
import { Config } from '../components/config';
import { types } from '../types';

@define()
export class LogTransportConfig extends Config {
  public isEnabled? = true;

  public level?: types.LogLevel = 'info';

  // use winston styling notation
  public logColors?: {
    [colorName: string]: string;
  } = {
    emerg: 'bold redBG',
    alert: 'bold yellow',
    crit: 'bold red',
    error: 'red',
    warning: 'yellow',
    notice: 'blue',
    info: 'white',
    debug: 'bold cyan',
  };

  public partsColors?: {
    initial?: string;
    separator?: string;
    timestamp?: string;
    target?: string;
    method?: string;
    label?: string;
  } = {
    initial: 'white',
    separator: 'white',
    timestamp: 'white',
    label: 'white',
    target: 'white',
    method: 'white',
  };

  public messages?: {
    start?: string;
    exit?: string;
  } = {
    start: chalk`{gray start}`,
    exit: chalk`{gray exit}`,
  };

  public parts?: {
    initial?: string;
    separator?: string;
    label?: string;
  } = {
    initial: '',
    separator: ' ',
    label: '',
  };

  public flags?: {
    isTimestamped?: boolean;
    isLabeled?: boolean;
    showTarget?: boolean;
    showMethod?: boolean;
    isColored?: boolean;
    isWholeLineColored?: boolean;
    includeStackTrace?: boolean;
    isAbbreviatingSources?: boolean;
  } = {
    isTimestamped: true,
    isLabeled: false,
    showTarget: true,
    showMethod: true,
    isColored: true,
    isWholeLineColored: true,
    includeStackTrace: true,
    isAbbreviatingSources: false,
  };

  public timestampFormat?: string = 'HH:mm:ss';

  public abbreviationLength?: number = 15;

  public inspectDepth?: number = 0;

  constructor(props?: Partial<LogTransportConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}
