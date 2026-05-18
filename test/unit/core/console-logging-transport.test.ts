import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, beforeAll } from 'vitest';

import { LogTransportConfig } from '../../../src/configs/log-transport-config';
import { types } from '../../../src/types';
import { ConsoleTransport } from '../../../src/core/logging-transports/console-transport';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { Log } from '../../../src/components/log-entry';

describe('ConsoleTransport', () => {
  let injector: types.Injector;
  let combinedFormat: any;
  let config: LogTransportConfig;
  let simpleFormatter: any;
  let detailedFormatter: any;
  let winston: any;
  let winstonLogger: any;
  let logger: any;
  let levels: types.LogLevels;

  beforeAll(() => {
    levels = {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7,
    };
  });

  beforeEach(() => {
    winston = {
      createLogger: vi.fn(),
      transports: {
        Console: vi.fn(),
      },
      format: {
        errors: vi.fn(),
        timestamp: vi.fn(),
        colorize: vi.fn(),
        printf: vi.fn(),
        combine: vi.fn(),
      },
      addColors: vi.fn(),
    };
    combinedFormat = vi.fn();
    winston.format.combine.mockReturnValue(combinedFormat);
    winstonLogger = {
      debug: vi.fn(),
      emerg: vi.fn(),
    };
    winston.createLogger.mockReturnValue(winstonLogger);

    logger = mock<types.Logger>();
    logger.levels = levels;

    simpleFormatter = mock<types.Logger>();
    detailedFormatter = mock<types.Logger>();

    injector = new Injector();
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(logger);
    injector
      .bind<types.LogFormatter>(BINDINGS.SimpleLogFormatter)
      .toConstantValue(simpleFormatter);
    injector
      .bind<types.LogFormatter>(BINDINGS.DetailedLogFormatter)
      .toConstantValue(detailedFormatter);
    injector.bind(BINDINGS.winston).toConstantValue(winston);

    config = new LogTransportConfig({
      isEnabled: true,
      level: 'emerg',
      logColors: {
        emerg: 'bold redBG',
        alert: 'bold yellow',
        crit: 'bold red',
        error: 'red',
        warning: 'yellow',
        notice: 'blue',
        info: 'white',
        debug: 'bold cyan',
      },
      partsColors: {
        separator: 'white',
        timestamp: 'white',
        label: 'white',
        target: 'white',
        method: 'white',
      },
      messages: {
        start: 'start',
        exit: 'exit',
      },
      parts: {
        initial: '$ ',
        separator: '│',
        label: 'my-app-id',
      },
      flags: {
        isTimestamped: true,
        isLabeled: true,
        showTarget: true,
        showMethod: true,
        isColored: true,
        isWholeLineColored: true,
        includeStackTrace: true,
      },
      timestampFormat: 'YYYY-MM-DDTHH:mm:ss',
      inspectDepth: 0,
    });
  });

  describe('construction', () => {
    it('takes required level as a string as first and config as instance of LogTransportConfig and assigns them', () => {
      const level = 'debug';
      const transport = new ConsoleTransport(level, config);
      expect(transport.level).toBe(level);
      expect(transport.config).toBe(config);
    });

    it('annotates winston property for property injection', () => {
      const level = 'debug';
      const transport = new ConsoleTransport(level, config);
      injector.injectInto(transport);
      expect(winston.createLogger).toHaveBeenCalledTimes(1);
    });
  });

  describe('initialization', () => {
    describe('creating winston logger', () => {
      it(`creates with logging level assigned from instance`, () => {
        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.createLogger).toHaveBeenCalledTimes(1);
        expect(winston.createLogger.mock.calls[0][0].level).toBe('debug');
        expect(transport.client).toBe(winstonLogger);
      });

      it(`creates with logging levels assigned from logger instance`, () => {
        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.createLogger).toHaveBeenCalledTimes(1);
        expect(winston.createLogger.mock.calls[0][0].levels).toBe(
          logger.levels
        );
      });

      it(`creates with winston's console transport`, () => {
        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.createLogger).toHaveBeenCalledTimes(1);
        expect(winston.createLogger.mock.calls[0][0].transports).toBeInstanceOf(Array);
        expect(winston.createLogger.mock.calls[0][0].transports).toHaveLength(1);
        expect(winston.createLogger.mock.calls[0][0].transports).toEqual([
          new winston.transports.Console(),
        ]);
      });

      it(`creates with combined format with winston's formatter`, () => {
        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.createLogger).toHaveBeenCalledTimes(1);
        expect(winston.createLogger.mock.calls[0][0].format).toBe(
          combinedFormat
        );
      });
    });

    it('assings log colors from configuration to winston', () => {
      const level = 'debug';
      const transport = new ConsoleTransport(level, config);
      injector.injectInto(transport);
      expect(winston.addColors).toHaveBeenCalledTimes(1);
      expect(winston.addColors).toHaveBeenCalledWith(config.logColors);
    });

    describe('formatting', () => {
      describe('stacktrace', () => {
        it('enables stacktrace on passed errors', () => {
          config.set('flags.includeStackTrace', true);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.errors).toHaveBeenCalledWith({ stack: true });
        });

        it('disables stacktrace on passed errors', () => {
          config.set('flags.includeStackTrace', false);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.errors).toHaveBeenCalledWith({
            stack: false,
          });
        });
      });

      describe('timestamp', () => {
        it('enables timestamp', () => {
          config.set('flags.isTimestamped', true);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.timestamp).toHaveBeenCalledWith({
            format: config.get('timestampFormat'),
          });
        });

        it('enables custom timestamp format', () => {
          config.set('flags.isTimestamped', true);
          const timestampFormat = 'HH:mm';
          config.set('timestampFormat', timestampFormat);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.timestamp).toHaveBeenCalledWith({
            format: timestampFormat,
          });
        });

        it('disables timestamp', () => {
          config.set('flags.isTimestamped', false);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.timestamp).not.toHaveBeenCalled;
        });
      });

      describe('colorization', () => {
        it('enables colorization', () => {
          config.set('flags.isColored', true);
          config.set('flags.isWholeLineColored', false);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.colorize).toHaveBeenCalledWith({
            all: false,
          });
        });

        it('enables colorization on whole line', () => {
          config.set('flags.isColored', true);
          config.set('flags.isWholeLineColored', true);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.colorize).toHaveBeenCalledWith({
            all: true,
          });
        });

        it('disables colorization', () => {
          config.set('flags.isColored', false);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.colorize).not.toHaveBeenCalled;
        });
      });

      it('combines all formatting selections', () => {
        winston.format.errors.mockReturnValue('errors');
        winston.format.timestamp.mockReturnValue('timestamp');
        winston.format.colorize.mockReturnValue('colorize');
        winston.format.printf.mockReturnValue('printf');

        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.format.combine).toHaveBeenCalledTimes(1);
        expect(winston.format.combine).toHaveBeenCalledWith(
          'errors',
          'timestamp',
          'colorize',
          'printf'
        );
      });

      describe('printf', () => {
        it('uses simple formatter for log entries with simple formatting enabled', () => {
          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);

          const log = new Log('my-message').format({ isSimple: true });
          transport.formatEntry(log);

          expect(simpleFormatter.format).toHaveBeenCalledTimes(1);
          expect(simpleFormatter.format).toHaveBeenCalledWith(log);
          expect(detailedFormatter.format).not.toHaveBeenCalled();
        });

        it('uses as default detailed formatter for log entries', () => {
          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);

          const log = new Log('my-message');
          transport.formatEntry(log);

          expect(detailedFormatter.format).toHaveBeenCalledTimes(1);
          expect(detailedFormatter.format).toHaveBeenCalledWith(log, config);
          expect(simpleFormatter.format).not.toHaveBeenCalled();
        });
      });
    });

    it(`takes optional custom winston's combined format as third argument on construction`, () => {
      const customFormat = vi.fn();
      const level = 'debug';
      const transport = new ConsoleTransport(level, config, customFormat);
      injector.injectInto(transport);
      expect(winston.createLogger).toHaveBeenCalledTimes(1);
      expect(winston.createLogger.mock.calls[0][0].format).toBe(customFormat);
    });
  });

  describe('logging', () => {
    it('logs log entry with loggable level', () => {
      const level = 'debug';
      const transport = new ConsoleTransport(level, config);
      injector.injectInto(transport);

      const args = ['my-message', 'first', 2, null, undefined];
      transport.log('debug', 'my-message', 'first', 2, null, undefined);
      expect(winstonLogger.debug).toHaveBeenCalledTimes(1);
      expect(winstonLogger.debug).toHaveBeenCalledWith(...args);
    });

    it(`skips logging entry on loggable level not matching transport's priority`, () => {
      const level = 'emerg';
      const transport = new ConsoleTransport(level, config);
      injector.injectInto(transport);

      const args = ['my-message', 'first', 2, null, undefined];
      transport.log('debug', 'my-message', 'first', 2, null, undefined);
      expect(winstonLogger.debug).not.toHaveBeenCalled();
      transport.log('emerg', 'my-message', 'first', 2, null, undefined);
      expect(winstonLogger.emerg).toHaveBeenCalledTimes(1);
      expect(winstonLogger.emerg).toHaveBeenCalledWith(...args);
    });
  });
});

