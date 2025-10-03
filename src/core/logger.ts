import { classes } from 'polytype';
import { injectable } from 'inversify';
import { kernel } from '@eveble/core';
import { InvalidTransportIdError, TransportExistsError } from './core-errors';
import { StatefulTrait } from '../traits/stateful.trait';
import { LOGGING_LEVELS } from '../constants/defaults';
import { types } from '../types';
import { RFC5424LoggingMixin } from '../mixins/rfc-5424-logging-mixin';

// eslint-disable-next-line no-shadow
enum STATES {
  constructed = 'constructed',
  stopped = 'stopped',
  running = 'running',
}

@injectable()
export class Logger
  extends classes(StatefulTrait, RFC5424LoggingMixin)
  implements types.Logger
{
  static STATES = STATES;

  public readonly levels: types.LogLevels;

  private transports: Map<string, types.LogTransport>;

  /**
   * Creates an instance of Logger.
   * @param describer - Describing library.
   * @param levels - Logging levels for logger.
   */
  constructor(levels: types.LogLevels = LOGGING_LEVELS) {
    super();
    this.levels = levels;
    this.transports = new Map();

    this.setState(Logger.STATES.constructed);
    this.initializeLoggedLevels();
  }

  /**
   * Starts logging.
   * @throws {InvalidStateError}
   * Thrown if logger is not in one of valid states: 'constructed' or 'stopped'.
   */
  public start(): void {
    if (this.isInState(Logger.STATES.running)) {
      return;
    }
    this.validateState([Logger.STATES.constructed, Logger.STATES.stopped]);
    this.setState(Logger.STATES.running);
  }

  /**
   * Stops logging.
   */
  public stop(): void {
    if (this.isInState(Logger.STATES.constructed)) {
      return;
    }
    this.setState(Logger.STATES.stopped);
  }

  /**
   * Evaluates if logger is running.
   * @returns Returns `true` if logger is in 'running' state, else `false`.
   */
  public isRunning(): boolean {
    return this.isInState(Logger.STATES.running);
  }

  /**
   * Evaluates if logger is stopped.
   * @returns Returns `true` if logger is not in running state, else `false`.
   */
  public isStopped(): boolean {
    return !this.isInState(Logger.STATES.running);
  }

  /**
   * Returns logging level priority.
   * @param level - Level name.
   * @returns Logging level priority as `number`.
   */
  public getPriority(level: types.LogLevel): number {
    return this.levels[level];
  }

  /**
   * Registers logging transport.
   * @param id - Identifier for the transport.
   * @param transport - Instance implementing `LogTransport` interface.
   * @param shouldOverride Flag indicating that transport should be overridden.
   * @throws {InvalidTransportIdError}
   * Thrown if the id argument is not a string.
   * @throws {TransportExistsError}
   * Thrown if the transport would override existing one.
   */
  public registerTransport(
    id: string,
    transport: types.LogTransport,
    shouldOverride = false
  ): void {
    if (typeof id !== 'string') {
      throw new InvalidTransportIdError(kernel.describer.describe(id));
    }
    if (this.hasTransport(id) && !shouldOverride) {
      throw new TransportExistsError(id);
    }
    this.transports.set(id, transport);
  }

  /**
   * Override existing transport.
   * @param id - Identifier for the transport.
   * @param transport - Instance implementing `LogTransport` interface.
   */
  public overrideTransport(id: string, transport: types.LogTransport): void {
    this.registerTransport(id, transport, true);
  }

  /**
   * Returns transport.
   * @param id - Identifier for the transport.
   * @return Logging transport as instance implementing `LogTransport` interface.
   */
  public getTransport(id: string): types.LogTransport | undefined {
    return this.transports.get(id);
  }

  /**
   * Evaluates if transport is registered on logger.
   * @param id - Identifier for the transport.
   * @returns Returns `true` if logger has transport registered, else `false`.
   */
  public hasTransport(id: string): boolean {
    return this.transports.has(id);
  }

  /**
   * Removes transport from logger's transports.
   * @param id - Identifier for the transport.
   */
  public removeTransport(id: string): void {
    this.transports.delete(id);
  }

  /**
   * Returns all transport mappings on logger.
   * @returns Mappings of all registered transports.
   */
  public getTransports(): Map<string, types.LogTransport> {
    return this.transports;
  }

  /**
   * Logs message for level.
   * @param level - Supported logging level by logging transport.
   * @param  entry - Logging entry as a string or instance implementing `LogEntry` interface.
   * @param args - Any other arguments that will be attached to log entry.
   */
  public log(
    level: types.LogLevel,
    entry: string | types.LogEntry,
    ...args: any[]
  ): void {
    if (!this.isInState(Logger.STATES.running)) {
      return;
    }
    if (typeof entry !== 'string' && entry?.setLevel !== undefined) {
      entry.setLevel(level);
    }
    for (const transport of this.getTransports().values()) {
      transport.log(level, entry, ...args);
    }
  }

  /**
   * Initializes logged levels methods on Logger.
   */
  protected initializeLoggedLevels(): void {
    for (const [level] of Object.entries(this.levels)) {
      if (this[level] !== undefined) {
        continue;
      }
      this[level] = (entry: string | types.LogEntry, ...args: any[]): void => {
        this.log(level, entry, ...args);
      };
    }
  }
}
