import { get } from 'lodash';
import { inject, postConstruct } from 'inversify';
import { types } from '../types';
import { RFC5424LoggingMixin } from '../mixins/rfc-5424-logging-mixin';
import { LogTransportConfig } from '../configs/log-transport-config';
import { BINDINGS } from '../constants/bindings';

export abstract class LogTransport extends RFC5424LoggingMixin {
  public readonly level: types.LogLevel;

  public readonly config?: LogTransportConfig;

  @inject(BINDINGS.log)
  public logger: types.Logger;

  public client: any;

  /**
   * Creates a LogTransport.
   * @param level - Level for which logging will only allowed(less than or equal to this level).
   * @param config - `LogTransportConfig` instance.
   */
  constructor(level: types.LogLevel, config?: LogTransportConfig) {
    super();
    this.level = level;
    if (config) this.config = config;
  }

  /**
   * Initializes LogTransport.
   */
  @postConstruct()
  public initialize(): void {
    this.initializeLoggedLevels();
  }

  /**
   * Evaluates if actual logged level is loggable on transport.
   * @param level - Log's level name.
   * @returns Returns true if log is loggable on transport, else false.
   */
  public isLoggable(level: types.LogLevel): boolean {
    const levelPriority = get(this.logger, `levels.${level}`);
    const transportPriority = get(this.logger, `levels.${this.level}`);
    return levelPriority <= transportPriority;
  }

  /**
   * Logs entry with level.
   * @param level - Logging level for entry.
   * @param entry - Logging entry as a string or implementation of `LogEntry` instance.
   * @param args - Any other arguments that will be attached to log entry.
   */
  public log(
    level: types.LogLevel,
    entry: string | types.LogEntry,
    ...args: any[]
  ): void {
    if (!this.isLoggable(level)) {
      return;
    }
    this.client[level](entry, ...args);
  }

  /**
   * Initializes logged levels methods on logging transport.
   */
  protected initializeLoggedLevels(): void {
    for (const [level] of Object.entries(this.logger.levels)) {
      if (this[level] !== undefined) {
        continue;
      }
      this[level] = (entry: string | types.LogEntry, ...args: any[]): void => {
        this.log(level, entry, ...args);
      };
    }
  }
}
