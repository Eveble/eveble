import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, beforeAll } from 'vitest';

import { derived } from '@traits-ts/core';
import { Logger } from '../../../src/core/logger';
import { types } from '../../../src/types';
import { Log } from '../../../src/components/log-entry';
import { StatefulTrait } from '../../../src/traits/stateful.trait';
import {
  InvalidTransportIdError,
  TransportExistsError,
} from '../../../src/core/core-errors';
import { RFC5424LoggingTrait } from '../../../src/traits/rfc-5424-logging.trait';

describe('Logger', () => {
  let levels: types.LogLevels;
  let transport: types.LogTransport;

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
    transport = mock<types.LogTransport>();
  });

  it(`has StatefulTrait in composition chain`, () => {
    expect(derived(Logger.prototype, StatefulTrait)).toBe(true);
  });

  it(`has RFC5424LoggingTrait in composition chain`, () => {
    expect(derived(Logger.prototype, RFC5424LoggingTrait)).toBe(true);
  });

  describe(`construction`, () => {
    it(`sets logging state to constructed after construction`, () => {
      const logger = new Logger(levels);
      expect(logger.isInState(Logger.STATES.constructed));
    });

    it(`initializes transports as empty Map`, () => {
      const logger = new Logger(levels);
      expect(logger.getTransports()).toBeInstanceOf(Map);
      expect(logger.getTransports()).toEqual(new Map());
    });
  });

  describe('levels', () => {
    it('returns assigned levels on construction', () => {
      const logger = new Logger(levels);
      expect(logger.levels).toEqual(levels);
    });

    it('returns level priority number from levels', () => {
      const logger = new Logger(levels);
      expect(logger.getPriority('emerg')).toBe(0);
      expect(logger.getPriority('alert')).toBe(1);
      expect(logger.getPriority('crit')).toBe(2);
      expect(logger.getPriority('error')).toBe(3);
      expect(logger.getPriority('warning')).toBe(4);
      expect(logger.getPriority('notice')).toBe(5);
      expect(logger.getPriority('info')).toBe(6);
      expect(logger.getPriority('debug')).toBe(7);
    });
  });

  describe(`logging`, () => {
    it(`allows to start logging`, () => {
      const logger = new Logger(levels);
      logger.start();

      expect(logger.isInState(Logger.STATES.running)).toBe(true);
      expect(logger.isRunning()).toBe(true);
    });

    it(`allows to stop logging`, () => {
      const logger = new Logger(levels);
      logger.start();
      logger.stop();

      expect(logger.isInState(Logger.STATES.stopped)).toBe(true);
      expect(logger.isStopped()).toBe(true);
    });
  });

  describe(`transports`, () => {
    describe('registration', () => {
      it('throws InvalidTransportIdError if provided id is not a string on registering transport', () => {
        expect(() =>
          new Logger(levels).registerTransport(
            undefined as any as string,
            transport
          )
        ).toThrow(
          InvalidTransportIdError,
          `Expected id argument to be string, got undefined`
        );
      });

      it('throws TransportExistsError if transport would be overridden', () => {
        const id = 'my-transport';
        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        expect(() => logger.registerTransport(id, transport)).toThrow(
          TransportExistsError,
          `Transport with id 'my-transport' would be overridden. To override existing mapping use <Logger.prototype.overrideTransport>`
        );
      });

      it('registers transport', () => {
        const id = 'my-transport';

        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        expect(logger.getTransport(id)).toBe(transport);
        expect(logger.hasTransport(id)).toBe(true);
      });

      it('allows to override transport', () => {
        const id = 'my-transport';
        const otherTransport = mock<types.LogTransport>();

        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        expect(() => {
          logger.overrideTransport(id, otherTransport);
        }).not.toThrow(Error);
        expect(logger.getTransport(id)).toBe(otherTransport);
      });

      it('returns transport by id', () => {
        const consoleTransport = mock<types.LogTransport>();
        const fileTransport = mock<types.LogTransport>();

        const logger = new Logger(levels);
        logger.registerTransport('console', consoleTransport);
        logger.registerTransport('file', fileTransport);
        expect(logger.getTransport('console')).toBe(consoleTransport);
        expect(logger.getTransport('file')).toBe(fileTransport);
        expect(logger.getTransport('non-existing-transport')).toBeUndefined();
      });

      it('removes transport', () => {
        const id = 'my-transport';

        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        logger.removeTransport(id);
        expect(logger.getTransport(id)).toBeUndefined();
        expect(logger.hasTransport(id)).toBe(false);
      });
    });
    describe('evaluation', () => {
      it(`returns true if logger has registered transport`, () => {
        const id = 'my-transport';
        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        expect(logger.hasTransport(id)).toBe(true);
      });

      it(`returns false transport is not registered on logger`, () => {
        const id = 'my-transport';
        const logger = new Logger(levels);
        expect(logger.hasTransport(id)).toBe(false);
      });
    });

    describe('getters', () => {
      it(`returns all transport mappings as a instance of map`, () => {
        const cnsl = mock<types.LogTransport>();
        const file = mock<types.LogTransport>();

        const transports = new Map([
          ['console', cnsl],
          ['file', file],
        ]);

        const logger = new Logger(levels);
        logger.registerTransport('console', cnsl);
        logger.registerTransport('file', file);
        expect(logger.getTransports()).toEqual(transports);
      });
    });
  });

  describe('logging', () => {
    it('logs message', () => {
      const logger = new Logger(levels);
      logger.registerTransport('my-logger', transport);
      logger.start();

      const level = 'debug';
      const message = 'My log message';

      logger.log(level, message);
      expect(transport.log).toHaveBeenCalledTimes(1);
      expect(transport.log).toHaveBeenCalledWith(level, message);
    });

    it('only logs after starting', () => {
      const logger = new Logger(levels);
      logger.registerTransport('my-logger', transport);

      const message = 'My log message';

      expect(logger.isRunning()).toBe(false);
      expect(logger.isStopped()).toBe(true);
      logger.info(message);
      expect(transport.log).not.toHaveBeenCalled;

      logger.start();
      expect(logger.isRunning()).toBe(true);
      expect(logger.isStopped()).toBe(false);
      logger.info(message);
      expect(transport.log).toHaveBeenCalledTimes(1);
      expect(transport.log).toHaveBeenCalledWith('info', message);
    });

    it('allows logging output to be stopped', () => {
      const logger = new Logger(levels);
      logger.registerTransport('my-logger', transport);

      const message = 'My log message';

      expect(logger.isRunning()).toBe(false);
      expect(logger.isStopped()).toBe(true);
      logger.start();
      expect(logger.isRunning()).toBe(true);
      expect(logger.isStopped()).toBe(false);

      logger.info(message);
      expect(transport.log).toHaveBeenCalledWith('info', message);

      logger.stop();
      expect(logger.isRunning()).toBe(false);
      expect(logger.isStopped()).toBe(true);

      logger.info(message);
      expect(transport.log).not.toHaveBeenCalledTimes(2);
    });

    it('allows multiple logging transports to log same message', () => {
      const firstTransport = mock<types.LogTransport>();
      const secondTransport = mock<types.LogTransport>();

      const message = 'My log message';

      const logger = new Logger(levels);
      logger.registerTransport('first', firstTransport);
      logger.registerTransport('second', secondTransport);
      logger.start();

      logger.debug(message);
      expect(firstTransport.log).toHaveBeenCalledTimes(1);
      expect(firstTransport.log).toHaveBeenCalledWith('debug', message);
      expect(secondTransport.log).toHaveBeenCalledTimes(1);
      expect(secondTransport.log).toHaveBeenCalledWith('debug', message);
    });

    it('assigns dynamic methods corresponding to logging level names', () => {
      const logger = new Logger(levels);
      expect(logger.emerg).toBeInstanceOf(Function);
      expect(logger.emerg).toBeInstanceOf(Function);
      expect(logger.alert).toBeInstanceOf(Function);
      expect(logger.crit).toBeInstanceOf(Function);
      expect(logger.error).toBeInstanceOf(Function);
      expect(logger.warning).toBeInstanceOf(Function);
      expect(logger.notice).toBeInstanceOf(Function);
      expect(logger.info).toBeInstanceOf(Function);
      expect(logger.debug).toBeInstanceOf(Function);
    });

    it('ensures that dynamically assigned methods are not overriding existing methods set prior to initialization', () => {
      const spy = vi.fn();
      class MyLogger extends Logger {
        info(): void {
          spy();
        }
      }
      const logger = new MyLogger(levels);
      logger.info();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('ensures that log method from dynamic level methods is called with proper arguments', () => {
      const logger = new Logger(levels);
      logger.start();
      logger.registerTransport('my-id', transport);

      const args = ['my-message', 'first', 2, null, undefined];
      expect(logger.info).toBeInstanceOf(Function);
      logger.info('my-message', 'first', 2, null, undefined);
      expect(transport.log).toHaveBeenCalledWith('info', ...args);
    });

    it('sets the log entries logging level', () => {
      const logger = new Logger(levels);
      logger.start();
      logger.registerTransport('my-id', transport);
      const logEntry: types.LogEntry = new Log('my-message');
      logger.info(logEntry);
      expect(logEntry.level).toBe('info');
      expect(transport.log).toHaveBeenCalledWith('info', logEntry);
    });
  });
});
