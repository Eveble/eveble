import chai, { expect } from 'chai';
import chalk from 'chalk';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import * as winston from 'winston';
import { LogTransportConfig } from '../../../src/configs/log-transport-config';
import { types } from '../../../src/types';
import { ConsoleTransport } from '../../../src/core/logging-transports/console-transport';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { SimpleLogFormatter } from '../../../src/core/logging-transports/formatters/simple-log-entry-formatter';
import { DetailedLogFormatter } from '../../../src/core/logging-transports/formatters/detailed-log-entry-formatter';
import { StringifingConverter } from '../../../src/core/logging-transports/formatters/converters/stringifing-converter';
import { LogMetadata, Log } from '../../../src/components/log-entry';

chai.use(sinonChai);

describe('ConsoleTransport', function() {
  let injector: types.Injector;
  let config: LogTransportConfig;
  let converter: types.LogConverter;
  let simpleFormatter: any;
  let detailedFormatter: any;
  let logger: any;
  let levels: types.LogLevels;
  let transport: ConsoleTransport;

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
    logger = stubInterface<types.Logger>();
    logger.levels = levels;

    converter = new StringifingConverter();
    simpleFormatter = new SimpleLogFormatter(converter);
    detailedFormatter = new DetailedLogFormatter(converter);

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
        isAbbreviatingSources: false,
      },
      timestampFormat: 'YYYY-MM-DDTHH:mm:ss',
      inspectDepth: 0,
      abbreviationLength: 15,
    });
  });

  describe('formatting logged message', () => {
    beforeEach(() => {
      transport = new ConsoleTransport('debug', config);
      injector.injectInto(transport);
    });

    context('with message only', () => {
      it('formats a message String with default configuration', () => {
        const winstonLogObj = {
          message: '\u001b[32mmy-message\u001b[39m',
          level: '\u001b[32minfo\u001b[39m',
          timestamp: '2019-10-07T02:51:35',
          [Symbol.for('level')]: 'info',
        };

        const str = transport.formatEntry(winstonLogObj);
        expect(str).to.be.equal(
          '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m: \u001b[32mmy-message\u001b[39m '
        );
      });

      it('does not show label if its not enabled on configuration', () => {
        const winstonLogObj = {
          message: '\u001b[32mmy-message\u001b[39m',
          level: '\u001b[32minfo\u001b[39m',
          [Symbol.for('level')]: 'info',
        };

        config.set('flags.isLabeled', false);

        const str = transport.formatEntry(winstonLogObj);
        expect(str).to.be.equal(
          '$ \u001b[32minfo\u001b[39m: \u001b[32mmy-message\u001b[39m '
        );
      });

      it('does not show initial if its not set on configuration', () => {
        const winstonLogObj = {
          message: '\u001b[32mmy-message\u001b[39m',
          level: '\u001b[32minfo\u001b[39m',
          [Symbol.for('level')]: 'info',
        };

        config.set('parts.initial', '');

        const str = transport.formatEntry(winstonLogObj);
        expect(str).to.be.equal(
          '\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m: \u001b[32mmy-message\u001b[39m '
        );
      });

      it('does not show timestamp if timestamped is disabled on configuration', () => {
        const winstonLogObj = {
          message: '\u001b[32mmy-message\u001b[39m',
          level: '\u001b[32minfo\u001b[39m',
          [Symbol.for('level')]: 'info',
        };

        config.set('flags.isTimestamped', false);

        const str = transport.formatEntry(winstonLogObj);
        expect(str).to.be.equal(
          '$ \u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m: \u001b[32mmy-message\u001b[39m '
        );
      });

      it('shows label if labeled is enabled and label is set on configuration', () => {
        const winstonLogObj = {
          message: '\u001b[32mmy-message\u001b[39m',
          level: '\u001b[32minfo\u001b[39m',
          timestamp: '2019-10-07T02:51:35',
          [Symbol.for('level')]: 'info',
        };

        config.set('flags.isLabeled', true);
        config.set('parts.label', 'my-app-id');

        const str = transport.formatEntry(winstonLogObj);
        expect(str).to.be.equal(
          '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m: \u001b[32mmy-message\u001b[39m '
        );
      });
    });

    context('with multiple primitive arguments passed after message', () => {
      it('formats message with additional primitive arguments', () => {
        const winstonLogObj = {
          message: '\u001b[32mmy-message\u001b[39m',
          level: '\u001b[32minfo\u001b[39m',
          timestamp: '2019-10-07T02:51:35',
          [Symbol.for('level')]: 'info',
          [Symbol.for('splat')]: [1, 'str', true, null, undefined],
        };

        const str = transport.formatEntry(winstonLogObj);
        expect(str).to.be.equal(
          "$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m: \u001b[32mmy-message\u001b[39m 1 'str' true null undefined"
        );
      });
    });

    context('with multiple Object arguments passed after message', () => {
      it('formats a message with additional Object arguments', () => {
        class MyClass {
          constructor(props) {
            Object.assign(this, props);
          }
        }

        const myClassInstance = new MyClass({
          first: 'first-value',
        });

        const winstonLogObj = {
          message: '\u001b[32mmy-message\u001b[39m',
          level: '\u001b[32minfo\u001b[39m',
          timestamp: '2019-10-07T02:51:35',
          [Symbol.for('level')]: 'info',
          [Symbol.for('splat')]: [myClassInstance, { second: 'second-value' }],
        };

        const str = transport.formatEntry(winstonLogObj);

        expect(str).to.be.equal(
          '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
            "MyClass { first: 'first-value' } \n" +
            "{ second: 'second-value' }"
        );
      });
    });

    context('with additional metadata', () => {
      class MyClass {
        first: string;

        second: string;

        third: string;

        fourth: string;

        constructor(props: Record<keyof any, any>) {
          Object.assign(this, props);
        }

        myMethod(
          first: string,
          second: string,
          third: string,
          fourth: string
        ): string {
          Object.assign(this, {
            first,
            second,
            third,
            fourth,
          });
          return 'my-result';
        }
      }

      let myClassInstance: MyClass;
      let logEntry: winston.LogEntry;

      beforeEach(() => {
        myClassInstance = new MyClass({
          first: 'first-value',
          second: {
            1: 'one',
          },
        });

        logEntry = new Log({
          message: '\u001b[32mmy-message\u001b[39m',
          level: '\u001b[32minfo\u001b[39m',
          timestamp: '2019-10-07T02:51:35',
          [Symbol.for('level')]: 'info',
          [Symbol.for('splat')]: [],
          typeName: 'MyClass',
          target: myClassInstance,
          method: myClassInstance.myMethod,
          methodName: 'myMethod',
          options: {},
          metadata: new Map([
            [
              'arguments',
              new LogMetadata('arguments', [
                'first-value',
                'second-value',
                'third-value',
                'fourth-value',
              ]),
            ],
            ['properties', new LogMetadata('properties')],
          ]),
        });

        transport = new ConsoleTransport('debug', config);
        injector.injectInto(transport);
      });

      it('formats a message with additional metadata', () => {
        const str = transport.formatEntry(logEntry);
        expect(str).to.be.equal(
          '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
            'function arguments:\n' +
            "  first: 'first-value',\n" +
            "  second: 'second-value',\n" +
            "  third: 'third-value',\n" +
            "  fourth: 'fourth-value'\n" +
            'class properties:\n' +
            "  first: 'first-value', second: [Object]"
        );
      });

      describe('formatting configuration', () => {
        it('omits all log details on simple message with additional simple formatting context', () => {
          logEntry.options.isSimple = true;
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal('\u001b[32mmy-message\u001b[39m ');
        });

        it('ensure that rest arguments are passed through', () => {
          logEntry[Symbol.for('splat') as any] = [
            1,
            'str',
            true,
            null,
            undefined,
          ];
          logEntry.options.isSimple = true;
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            "\u001b[32mmy-message\u001b[39m 1 'str' true null undefined"
          );
        });
      });

      describe('logging additional metadata', () => {
        it('allows to add additional metadata as simple key: primitive type', () => {
          logEntry.metadata.delete('properties');
          logEntry.metadata.delete('arguments');
          logEntry.metadata.set(
            'result',
            new LogMetadata('result', 'my-result')
          );
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
              "result:  'my-result'"
          );
        });

        it('allows to add additional metadata as complex structure key: Props', () => {
          logEntry.metadata.delete('properties');
          logEntry.metadata.delete('arguments');
          logEntry.metadata.set(
            'result',
            new LogMetadata('my-title', myClassInstance)
          );
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
              "my-title:  MyClass { first: 'first-value', second: { '1': 'one' } }"
          );
        });
      });

      describe('logging function arguments', () => {
        it('formats a message with function arguments logged only', () => {
          logEntry.metadata.delete('properties');
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
              'function arguments:\n' +
              "  first: 'first-value',\n" +
              "  second: 'second-value',\n" +
              "  third: 'third-value',\n" +
              "  fourth: 'fourth-value'"
          );
        });

        it('formats a message with selective function arguments logged only', () => {
          logEntry.metadata.get('arguments').keys = ['first', 'second'];
          logEntry.metadata.delete('properties');
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
              'function arguments:\n' +
              "  first: 'first-value', second: 'second-value'"
          );
        });

        it('does not display function arguments if context does not contain any', () => {
          logEntry.metadata.delete('properties');
          logEntry.metadata.get('arguments').value = [];
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m '
          );
        });
      });

      describe('logging class properties', () => {
        it('formats a message with class properties logged only', () => {
          logEntry.metadata.delete('arguments');
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
              'class properties:\n' +
              "  first: 'first-value', second: [Object]"
          );
        });

        it('formats a message with selective class properties logged only', () => {
          logEntry.metadata.get('properties').keys = ['first', 'second'];
          logEntry.metadata.delete('arguments');
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
              'class properties:\n' +
              "  first: 'first-value', second: [Object]"
          );
        });

        it('does not log class properties if target transport does not contain any', () => {
          logEntry.metadata.delete('arguments');
          delete myClassInstance.first;
          delete myClassInstance.second;
          delete myClassInstance.third;
          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyClass\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyMethod\u001b[39m: \u001b[32mmy-message\u001b[39m '
          );
        });
      });

      describe('abbreviating sources', () => {
        it('it allows to abbreviate sources to trim long-named type names', () => {
          config.set('flags.isAbbreviatingSources', true);
          config.set('abbreviationLength', 3);

          const str = transport.formatEntry(logEntry);
          expect(str).to.be.equal(
            '$ \u001b[37m2019-10-07T02:51:35\u001b[39m\u001b[37m│\u001b[39m\u001b[37mmy-app-id\u001b[39m\u001b[37m│\u001b[39m\u001b[32minfo\u001b[39m\u001b[37m│\u001b[39m\u001b[37mMyC\u001b[39m\u001b[37m::\u001b[39m\u001b[37mmyM\u001b[39m: \u001b[32mmy-message\u001b[39m \n' +
              'function arguments:\n' +
              "  first: 'first-value',\n" +
              "  second: 'second-value',\n" +
              "  third: 'third-value',\n" +
              "  fourth: 'fourth-value'\n" +
              'class properties:\n' +
              "  first: 'first-value', second: [Object]"
          );
        });
      });
    });
  });
});
