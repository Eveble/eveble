import * as winston from 'winston';
import chalk from 'chalk';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';
import { StringifingConverter } from '../core/logging-transports/formatters/converters/stringifing-converter';
import { DetailedLogFormatter } from '../core/logging-transports/formatters/detailed-log-entry-formatter';
import { SimpleLogFormatter } from '../core/logging-transports/formatters/simple-log-entry-formatter';
import { LogTransportConfig } from '../configs/log-transport-config';
import { ConsoleTransport } from '../core/logging-transports/console-transport';
import { Logger } from '../core/logger';

/**
 * Binds external dependencies to Injector.
 * @param injector - IoC container implementing `Injector` interface.
 */
function bindExternalDependencies(injector: types.Injector): void {
  if (!injector.isBound(BINDINGS.winston)) {
    injector.bind<any>(BINDINGS.winston).toConstantValue(winston);
  }
  if (!injector.isBound(BINDINGS.chalk)) {
    injector.bind<any>(BINDINGS.chalk).toConstantValue(chalk);
  }
}

/**
 * Binds logger dependencies to Injector.
 * @param injector - IoC container implementing `Injector` interface.
 */
function bindLoggerDependencies(injector: types.Injector): void {
  const converter = new StringifingConverter();

  if (!injector.isBound(BINDINGS.SimpleLogFormatter)) {
    const simpleFormatter = new SimpleLogFormatter(converter);
    injector
      .bind<types.LogFormatter>(BINDINGS.SimpleLogFormatter)
      .toConstantValue(simpleFormatter);
  }
  if (!injector.isBound(BINDINGS.DetailedLogFormatter)) {
    const detailedFormatter = new DetailedLogFormatter(
      converter,
      injector.get<any>(BINDINGS.chalk)
    );
    injector
      .bind<types.LogFormatter>(BINDINGS.DetailedLogFormatter)
      .toConstantValue(detailedFormatter);
  }
}

/**
 * Creates a ConsoleTransport.
 * @param level - Level for which priority logging will only be done(less than or equal to this level) on `ConsoleTransport`.
 * @param config - Optional `LogTransportConfig` instance.
 */
function createConsoleTransport(
  level: types.LogLevel,
  transportConfig: LogTransportConfig = new LogTransportConfig()
): ConsoleTransport {
  return new ConsoleTransport(level, transportConfig);
}

/**
 * Creates an instance of Logger.
 * @param levels - Optional logging levels for logger.
 */
function createLogger(levels?: types.LogLevels): types.Logger {
  return new Logger(levels);
}

/**
 * Bootstraps creation of `Logger` instance.
 * @param injector - IoC container implementing `Injector` interface
 * @param level - Level for which priority logging will only be done(less than or equal to this level) on `ConsoleTransport`.
 * @param consoleTransportConfig - Optional `LogTransportConfig` instance.
 * @param levels - Optional logging levels for logger.
 * @returns `Logger` instance.
 */
export function loggerLoader(
  injector: types.Injector,
  level: types.LogLevel,
  consoleTransportConfig: LogTransportConfig = new LogTransportConfig(),
  levels?: types.LogLevels
): types.Logger {
  bindExternalDependencies(injector);
  bindLoggerDependencies(injector);

  const logger = createLogger(levels);
  injector.bind<types.Logger>(BINDINGS.log).toConstantValue(logger);
  const consoleTransport = createConsoleTransport(
    level,
    consoleTransportConfig
  );
  injector.injectInto(consoleTransport);
  logger.registerTransport('console', consoleTransport);
  return logger;
}
