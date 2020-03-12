import chai, { expect } from 'chai';
import chalk from 'chalk';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import { LogTransportConfig } from '../../../src/configs/log-transport-config';
import { types } from '../../../src/types';
import { ConsoleTransport } from '../../../src/core/logging-transports/console-transport';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { Log } from '../../../src/components/log-entry';

chai.use(sinonChai);

describe('ConsoleTransport', function() {
  let injector: types.Injector;
  let combinedFormat: any;
  let config: LogTransportConfig;
  let simpleFormatter: any;
  let detailedFormatter: any;
  let winston: any;
  let winstonLogger: any;
  let logger: any;
  let levels: types.LogLevels;

  before(() => {
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
      createLogger: sinon.stub(),
      transports: {
        Console: sinon.stub(),
      },
      format: {
        errors: sinon.stub(),
        timestamp: sinon.stub(),
        colorize: sinon.stub(),
        printf: sinon.stub(),
        combine: sinon.stub(),
      },
      addColors: sinon.stub(),
    };
    combinedFormat = sinon.stub();
    winston.format.combine.returns(combinedFormat);
    winstonLogger = {
      debug: sinon.stub(),
      emerg: sinon.stub(),
    };
    winston.createLogger.returns(winstonLogger);

    logger = stubInterface<types.Logger>();
    logger.levels = levels;

    simpleFormatter = stubInterface<types.Logger>();
    detailedFormatter = stubInterface<types.Logger>();

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
        start: chalk`{gray start}`,
        exit: chalk`{gray exit}`,
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
      expect(transport.level).to.be.equal(level);
      expect(transport.config).to.be.equal(config);
    });

    it('annotates winston property for property injection', () => {
      const level = 'debug';
      const transport = new ConsoleTransport(level, config);
      injector.injectInto(transport);
      expect(winston.createLogger).to.be.calledOnce;
    });
  });

  describe('initialization', () => {
    context('creating winston logger', () => {
      it(`creates with logging level assigned from instance`, () => {
        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.createLogger).to.be.calledOnce;
        expect(winston.createLogger.args[0][0].level).to.be.equal('debug');
        expect(transport.client).to.be.equal(winstonLogger);
      });

      it(`creates with logging levels assigned from logger instance`, () => {
        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.createLogger).to.be.calledOnce;
        expect(winston.createLogger.args[0][0].levels).to.be.equal(
          logger.levels
        );
      });

      it(`creates with winston's console transport`, () => {
        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.createLogger).to.be.calledOnce;
        expect(winston.createLogger.args[0][0].transports).to.be.an('array');
        expect(winston.createLogger.args[0][0].transports).to.have.length(1);
        expect(winston.createLogger.args[0][0].transports).to.be.eql([
          new winston.transports.Console(),
        ]);
      });

      it(`creates with combined format with winston's formatter`, () => {
        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.createLogger).to.be.calledOnce;
        expect(winston.createLogger.args[0][0].format).to.be.equal(
          combinedFormat
        );
      });
    });

    it('assings log colors from configuration to winston', () => {
      const level = 'debug';
      const transport = new ConsoleTransport(level, config);
      injector.injectInto(transport);
      expect(winston.addColors).to.be.calledOnce;
      expect(winston.addColors).to.be.calledWithExactly(config.logColors);
    });

    context('formatting', () => {
      context('stacktrace', () => {
        it('enables stacktrace on passed errors', () => {
          config.set('flags.includeStackTrace', true);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.errors).to.be.calledWith({ stack: true });
        });

        it('disables stacktrace on passed errors', () => {
          config.set('flags.includeStackTrace', false);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.errors).to.be.calledWith({
            stack: false,
          });
        });
      });

      context('timestamp', () => {
        it('enables timestamp', () => {
          config.set('flags.isTimestamped', true);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.timestamp).to.be.calledWith({
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
          expect(winston.format.timestamp).to.be.calledWith({
            format: timestampFormat,
          });
        });

        it('disables timestamp', () => {
          config.set('flags.isTimestamped', false);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.timestamp).to.not.be.called;
        });
      });

      context('colorization', () => {
        it('enables colorization', () => {
          config.set('flags.isColored', true);
          config.set('flags.isWholeLineColored', false);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.colorize).to.be.calledWith({
            all: false,
          });
        });

        it('enables colorization on whole line', () => {
          config.set('flags.isColored', true);
          config.set('flags.isWholeLineColored', true);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.colorize).to.be.calledWith({
            all: true,
          });
        });

        it('disables colorization', () => {
          config.set('flags.isColored', false);

          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);
          expect(winston.format.colorize).to.not.be.called;
        });
      });

      it('combines all formatting selections', () => {
        winston.format.errors.returns('errors');
        winston.format.timestamp.returns('timestamp');
        winston.format.colorize.returns('colorize');
        winston.format.printf.returns('printf');

        const level = 'debug';
        const transport = new ConsoleTransport(level, config);
        injector.injectInto(transport);
        expect(winston.format.combine).to.be.calledOnce;
        expect(winston.format.combine).to.be.calledWith(
          'errors',
          'timestamp',
          'colorize',
          'printf'
        );
      });

      context('printf', () => {
        it('uses simple formatter for log entries with simple formatting enabled', () => {
          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);

          const log = new Log('my-message').format({ isSimple: true });
          transport.formatEntry(log);

          expect(simpleFormatter.format).to.be.calledOnce;
          expect(simpleFormatter.format).to.be.calledWith(log);
          expect(detailedFormatter.format).to.not.be.called;
        });

        it('uses as default detailed formatter for log entries', () => {
          const level = 'debug';
          const transport = new ConsoleTransport(level, config);
          injector.injectInto(transport);

          const log = new Log('my-message');
          transport.formatEntry(log);

          expect(detailedFormatter.format).to.be.calledOnce;
          expect(detailedFormatter.format).to.be.calledWith(log);
          expect(simpleFormatter.format).to.not.be.called;
        });
      });
    });

    it(`takes optional custom winston's combined format as third argument on construction`, () => {
      const customFormat = sinon.stub();
      const level = 'debug';
      const transport = new ConsoleTransport(level, config, customFormat);
      injector.injectInto(transport);
      expect(winston.createLogger).to.be.calledOnce;
      expect(winston.createLogger.args[0][0].format).to.be.equal(customFormat);
    });
  });

  describe('logging', () => {
    it('logs log entry with loggable level', () => {
      const level = 'debug';
      const transport = new ConsoleTransport(level, config);
      injector.injectInto(transport);

      const args = ['my-message', 'first', 2, null, undefined];
      transport.log('debug', 'my-message', 'first', 2, null, undefined);
      expect(winstonLogger.debug).to.be.calledOnce;
      expect(winstonLogger.debug).to.be.calledWith(...args);
    });

    it(`skips logging entry on loggable level not matching transport's priority`, () => {
      const level = 'emerg';
      const transport = new ConsoleTransport(level, config);
      injector.injectInto(transport);

      const args = ['my-message', 'first', 2, null, undefined];
      transport.log('debug', 'my-message', 'first', 2, null, undefined);
      expect(winstonLogger.debug).to.not.be.called;
      transport.log('emerg', 'my-message', 'first', 2, null, undefined);
      expect(winstonLogger.emerg).to.be.calledOnce;
      expect(winstonLogger.emerg).to.be.calledWith(...args);
    });
  });
});
