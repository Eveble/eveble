import 'reflect-metadata';
import { inject, postConstruct } from '@parisholley/inversify-async';
import winston from 'winston';
import { BINDINGS } from '../../constants/bindings';
import { LogTransportConfig } from '../../configs/log-transport-config';
import { types } from '../../types';
import { LogTransport } from '../log-transport';
import { Log } from '../../components/log-entry';

export class ConsoleTransport extends LogTransport
  implements types.LogTransport {
  public readonly level: types.LogLevel;

  public readonly config: LogTransportConfig;

  @inject(BINDINGS.log)
  public logger: types.Logger;

  @inject(BINDINGS.winston)
  protected winston: any;

  @inject(BINDINGS.SimpleLogFormatter)
  protected simpleFormatter: types.LogFormatter;

  @inject(BINDINGS.DetailedLogFormatter)
  protected detailedFormatter: types.LogFormatter;

  public client: winston.Logger;

  protected format?: any;

  /**
   * Creates a ConsoleTransport.
   * @param level - Level for which priority logging will only be done(less than or equal to this level).
   * @param config - `LogTransportConfig` instance.
   * @param format - Optional Winston's formatting.
   */
  constructor(level: types.LogLevel, config: LogTransportConfig, format?: any) {
    super(level, config);
    if (format) this.format = format;
  }

  /**
   * Initializes ConsoleTransport.
   */
  @postConstruct()
  public initialize(): void {
    if (this.format === undefined) this.format = this.resolveFormatter();

    const props: winston.LoggerOptions = {
      level: this.level,
      levels: this.logger.levels,
      transports: [new this.winston.transports.Console()],
      format: this.format,
    };
    this.client = this.createWinstonLogger(props);

    const logColors: Record<string, string> = this.config.get<
      Record<string, string>
    >(`logColors`);
    if (logColors !== undefined) {
      this.initializeColors(this.config.get(`logColors`));
    }

    super.initialize();
  }

  /**
   * Creates Winston's logger instance.
   * @param props - Winston logger options.
   * @return Winston's logger instance.
   */
  protected createWinstonLogger(props: winston.LoggerOptions): winston.Logger {
    return this.winston.createLogger(props);
  }

  /**
   * Initializes colorizing for logging levels.
   * @param colors - Logging level colors.
   */
  protected initializeColors(colors: Record<string, string>): void {
    this.winston.addColors(colors);
  }

  /**
   * Resolves formatter for transport.
   * @returns Combined with `logfrom` format.
   */
  protected resolveFormatter(): any {
    const { format } = this.winston as any;
    const formatArgs = [
      format.errors({
        stack: this.config.get('flags.includeStackTrace'),
      }),
    ];
    // Timestamp
    if (this.config.get('flags.isTimestamped')) {
      formatArgs.push(
        format.timestamp({
          format: this.config.get('timestampFormat'),
        })
      );
    }
    // Colors
    if (this.config.get('flags.isColored')) {
      formatArgs.push(
        format.colorize({
          all: this.config.get('flags.isWholeLineColored'),
        })
      );
    }
    // Message formatting
    formatArgs.push(
      format.printf((log) => {
        return this.formatEntry(log);
      })
    );
    return format.combine(...formatArgs);
  }

  /**
   * Formats log entry.
   * @param entry - Winston's or Eveble's Log instance.
   * @returns String representation of the provided log.
   */
  public formatEntry(entry: winston.LogEntry | types.LogEntry): string {
    const isSimple = entry instanceof Log && entry?.options?.isSimple === true;
    let str: string;
    if (isSimple) {
      str = this.simpleFormatter.format(entry);
    } else {
      str = this.detailedFormatter.format(entry, this.config);
    }
    return str;
  }
}
