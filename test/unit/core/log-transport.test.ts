import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import { LogTransportConfig } from '../../../src/configs/log-transport-config';
import { LogTransport } from '../../../src/core/log-transport';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';

describe(`LoggingTransport`, () => {
  interface LoggingClient {
    debug(
      level: types.LogLevel,
      entry: string | types.LogEntry,
      args: any[]
    ): void;
    emerg(
      level: types.LogLevel,
      entry: string | types.LogEntry,
      args: any[]
    ): void;
  }

  let injector: types.Injector;
  let logger: any;
  let client: any;
  const levels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  };

  beforeEach(() => {
    logger = mock<types.Logger>();
    client = mock<LoggingClient>();
    injector = new Injector();
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(logger);
  });

  class MyTransport extends LogTransport {}

  describe('construction', () => {
    it('takes required level as a string and assigns it', () => {
      const level = 'my-level';
      const transport = new MyTransport(level);
      expect(transport.level).toBe(level);
    });

    it('takes optional config as instance of LogTransportConfig and assings it', () => {
      const level = 'my-level';
      const config = new LogTransportConfig();
      const transport = new MyTransport(level, config);
      expect(transport.level).toBe(level);
      expect(transport.config).toBe(config);
    });

    it('annotates logger property for property injection', () => {
      const level = 'my-level';
      const transport = new MyTransport(level);
      injector.injectInto(transport);
      expect(transport.logger).toBe(logger);
    });
  });

  describe('initialization', () => {
    it('assigns dynamic methods corresponding to logging level names from logger', () => {
      logger.levels = {
        first: 1,
        second: 2,
      };
      const level = 'my-level';
      const transport = new MyTransport(level);
      injector.injectInto(transport);

      expect(transport.logger).toBe(logger);
      expect((transport as any).first).toBeInstanceOf(Function);
      expect((transport as any).second).toBeInstanceOf(Function);
    });

    it('ensures that dynamically assigned methods are not overriding existing methods set prior to initialization', () => {
      const spy = vi.fn();
      class MyOtherTransport extends LogTransport {
        info(): void {
          spy();
        }
      }

      logger.levels = {
        info: 1,
      };
      const level = 'my-level';
      const transport = new MyOtherTransport(level);
      injector.injectInto(transport);

      transport.info();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('evaluation', () => {
    it('returns true if logging level is loggable on transport', () => {
      logger.levels = levels;
      const level = 'debug';
      const transport = new MyTransport(level);
      injector.injectInto(transport);
      expect(transport.isLoggable('emerg')).toBe(true);
      expect(transport.isLoggable('alert')).toBe(true);
      expect(transport.isLoggable('crit')).toBe(true);
      expect(transport.isLoggable('error')).toBe(true);
      expect(transport.isLoggable('warning')).toBe(true);
      expect(transport.isLoggable('notice')).toBe(true);
      expect(transport.isLoggable('info')).toBe(true);
      expect(transport.isLoggable('debug')).toBe(true);
    });

    it('returns false if expected logging level has higher priority', () => {
      logger.levels = levels;
      const level = 'emerg';
      const transport = new MyTransport(level);
      injector.injectInto(transport);
      expect(transport.isLoggable('emerg')).toBe(true);
      expect(transport.isLoggable('alert')).toBe(false);
      expect(transport.isLoggable('crit')).toBe(false);
      expect(transport.isLoggable('error')).toBe(false);
      expect(transport.isLoggable('warning')).toBe(false);
      expect(transport.isLoggable('notice')).toBe(false);
      expect(transport.isLoggable('info')).toBe(false);
      expect(transport.isLoggable('debug')).toBe(false);
    });
  });

  describe('logging', () => {
    it('logs log entry with loggable level', () => {
      class MyOtherTransport extends LogTransport {
        client = client;
      }

      logger.levels = levels;
      const level = 'debug';
      const transport = new MyOtherTransport(level);
      injector.injectInto(transport);

      const args = ['my-message', 'first', 2, null, undefined];
      transport.log('debug', 'my-message', 'first', 2, null, undefined);
      expect(client.debug).toHaveBeenCalledTimes(1);
      expect(client.debug).toHaveBeenCalledWith(...args);
    });

    it(`skips logging entry on loggable level not matching transport's priority`, () => {
      class MyOtherTransport extends LogTransport {
        client = client;
      }

      logger.levels = levels;
      const level = 'emerg';
      const transport = new MyOtherTransport(level);
      injector.injectInto(transport);

      const args = ['my-message', 'first', 2, null, undefined];
      transport.log('debug', 'my-message', 'first', 2, null, undefined);
      expect(client.debug).not.toHaveBeenCalled;
      transport.log('emerg', 'my-message', 'first', 2, null, undefined);
      expect(client.emerg).toHaveBeenCalledTimes(1);
      expect(client.emerg).toHaveBeenCalledWith(...args);
    });
  });
});
