import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';

import sinon from 'sinon';
import { LogTransportConfig } from '../../../src/configs/log-transport-config';
import { LogTransport } from '../../../src/core/log-transport';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';

chai.use(sinonChai);

describe(`LoggingTransport`, function () {
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
    logger = stubInterface<types.Logger>();
    client = stubInterface<LoggingClient>();
    injector = new Injector();
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(logger);
  });

  class MyTransport extends LogTransport {}

  describe('construction', () => {
    it('takes required level as a string and assigns it', () => {
      const level = 'my-level';
      const transport = new MyTransport(level);
      expect(transport.level).to.be.equal(level);
    });

    it('takes optional config as instance of LogTransportConfig and assings it', () => {
      const level = 'my-level';
      const config = new LogTransportConfig();
      const transport = new MyTransport(level, config);
      expect(transport.level).to.be.equal(level);
      expect(transport.config).to.be.equal(config);
    });

    it('annotates logger property for property injection', () => {
      const level = 'my-level';
      const transport = new MyTransport(level);
      injector.injectInto(transport);
      expect(transport.logger).to.be.equal(logger);
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

      expect(transport.logger).to.be.equal(logger);
      expect((transport as any).first).to.be.instanceof(Function);
      expect((transport as any).second).to.be.instanceof(Function);
    });

    it('ensures that dynamically assigned methods are not overriding existing methods set prior to initialization', () => {
      const spy = sinon.stub();
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
      expect(spy).to.be.calledOnce;
    });
  });

  describe('evaluation', () => {
    it('returns true if logging level is loggable on transport', () => {
      logger.levels = levels;
      const level = 'debug';
      const transport = new MyTransport(level);
      injector.injectInto(transport);
      expect(transport.isLoggable('emerg')).to.be.true;
      expect(transport.isLoggable('alert')).to.be.true;
      expect(transport.isLoggable('crit')).to.be.true;
      expect(transport.isLoggable('error')).to.be.true;
      expect(transport.isLoggable('warning')).to.be.true;
      expect(transport.isLoggable('notice')).to.be.true;
      expect(transport.isLoggable('info')).to.be.true;
      expect(transport.isLoggable('debug')).to.be.true;
    });

    it('returns false if expected logging level has higher priority', () => {
      logger.levels = levels;
      const level = 'emerg';
      const transport = new MyTransport(level);
      injector.injectInto(transport);
      expect(transport.isLoggable('emerg')).to.be.true;
      expect(transport.isLoggable('alert')).to.be.false;
      expect(transport.isLoggable('crit')).to.be.false;
      expect(transport.isLoggable('error')).to.be.false;
      expect(transport.isLoggable('warning')).to.be.false;
      expect(transport.isLoggable('notice')).to.be.false;
      expect(transport.isLoggable('info')).to.be.false;
      expect(transport.isLoggable('debug')).to.be.false;
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
      expect(client.debug).to.be.calledOnce;
      expect(client.debug).to.be.calledWith(...args);
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
      expect(client.debug).to.not.be.called;
      transport.log('emerg', 'my-message', 'first', 2, null, undefined);
      expect(client.emerg).to.be.calledOnce;
      expect(client.emerg).to.be.calledWith(...args);
    });
  });
});
