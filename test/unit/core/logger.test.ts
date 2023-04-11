import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { stubInterface } from 'ts-sinon';
import { Logger } from '../../../src/core/logger';
import { types } from '../../../src/types';
import { Log } from '../../../src/components/log-entry';
import { StatefulMixin } from '../../../src/mixins/stateful-mixin';
import {
  InvalidTransportIdError,
  TransportExistsError,
} from '../../../src/core/core-errors';
import { RFC5424LoggingMixin } from '../../../src/mixins/rfc-5424-logging-mixin';

chai.use(sinonChai);

describe('Logger', () => {
  let levels: types.LogLevels;
  let transport: types.LogTransport;

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
    transport = stubInterface<types.LogTransport>();
  });

  it('has StatefulMixin applied', () => {
    expect(Logger.prototype instanceof StatefulMixin);
  });

  it('has RFC5424LoggingMixin applied', () => {
    expect(Logger.prototype instanceof RFC5424LoggingMixin);
  });

  describe(`construction`, () => {
    it(`sets logging state to constructed after construction`, () => {
      const logger = new Logger(levels);
      expect(logger.isInState(Logger.STATES.constructed));
    });

    it(`initializes transports as empty Map`, () => {
      const logger = new Logger(levels);
      expect(logger.getTransports()).to.be.instanceof(Map);
      expect(logger.getTransports()).to.be.eql(new Map());
    });
  });

  describe('levels', () => {
    it('returns assigned levels on construction', () => {
      const logger = new Logger(levels);
      expect(logger.levels).to.be.eql(levels);
    });

    it('returns level priority number from levels', () => {
      const logger = new Logger(levels);
      expect(logger.getPriority('emerg')).to.be.equal(0);
      expect(logger.getPriority('alert')).to.be.equal(1);
      expect(logger.getPriority('crit')).to.be.equal(2);
      expect(logger.getPriority('error')).to.be.equal(3);
      expect(logger.getPriority('warning')).to.be.equal(4);
      expect(logger.getPriority('notice')).to.be.equal(5);
      expect(logger.getPriority('info')).to.be.equal(6);
      expect(logger.getPriority('debug')).to.be.equal(7);
    });
  });

  describe(`logging`, () => {
    it(`allows to start logging`, () => {
      const logger = new Logger(levels);
      logger.start();

      expect(logger.isInState(Logger.STATES.running)).to.be.true;
      expect(logger.isRunning()).to.be.true;
    });

    it(`allows to stop logging`, () => {
      const logger = new Logger(levels);
      logger.start();
      logger.stop();

      expect(logger.isInState(Logger.STATES.stopped)).to.be.true;
      expect(logger.isStopped()).to.be.true;
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
        ).to.throw(
          InvalidTransportIdError,
          `Expected id argument to be string, got undefined`
        );
      });

      it('throws TransportExistsError if transport would be overridden', () => {
        const id = 'my-transport';
        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        expect(() => logger.registerTransport(id, transport)).to.throw(
          TransportExistsError,
          `Transport with id 'my-transport' would be overridden. To override existing mapping use <Logger.prototype.overrideTransport>`
        );
      });

      it('registers transport', () => {
        const id = 'my-transport';

        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        expect(logger.getTransport(id)).to.equal(transport);
        expect(logger.hasTransport(id)).to.be.true;
      });

      it('allows to override transport', () => {
        const id = 'my-transport';
        const otherTransport = stubInterface<types.LogTransport>();

        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        expect(() => {
          logger.overrideTransport(id, otherTransport);
        }).to.not.throw(Error);
        expect(logger.getTransport(id)).to.equal(otherTransport);
      });

      it('returns transport by id', () => {
        const consoleTransport = stubInterface<types.LogTransport>();
        const fileTransport = stubInterface<types.LogTransport>();

        const logger = new Logger(levels);
        logger.registerTransport('console', consoleTransport);
        logger.registerTransport('file', fileTransport);
        expect(logger.getTransport('console')).to.equal(consoleTransport);
        expect(logger.getTransport('file')).to.equal(fileTransport);
        expect(logger.getTransport('non-existing-transport')).to.be.undefined;
      });

      it('removes transport', () => {
        const id = 'my-transport';

        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        logger.removeTransport(id);
        expect(logger.getTransport(id)).to.be.undefined;
        expect(logger.hasTransport(id)).to.be.false;
      });
    });
    describe('evaluation', () => {
      it(`returns true if logger has registered transport`, () => {
        const id = 'my-transport';
        const logger = new Logger(levels);
        logger.registerTransport(id, transport);
        expect(logger.hasTransport(id)).to.be.true;
      });

      it(`returns false transport is not registered on logger`, () => {
        const id = 'my-transport';
        const logger = new Logger(levels);
        expect(logger.hasTransport(id)).to.be.false;
      });
    });

    describe('getters', () => {
      it(`returns all transport mappings as a instance of map`, () => {
        const cnsl = stubInterface<types.LogTransport>();
        const file = stubInterface<types.LogTransport>();

        const transports = new Map([
          ['console', cnsl],
          ['file', file],
        ]);

        const logger = new Logger(levels);
        logger.registerTransport('console', cnsl);
        logger.registerTransport('file', file);
        expect(logger.getTransports()).to.be.eql(transports);
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
      expect(transport.log).to.be.calledOnce;
      expect(transport.log).to.be.calledWith(level, message);
    });

    it('only logs after starting', () => {
      const logger = new Logger(levels);
      logger.registerTransport('my-logger', transport);

      const message = 'My log message';

      expect(logger.isRunning()).to.be.false;
      expect(logger.isStopped()).to.be.true;
      logger.info(message);
      expect(transport.log).to.not.be.called;

      logger.start();
      expect(logger.isRunning()).to.be.true;
      expect(logger.isStopped()).to.be.false;
      logger.info(message);
      expect(transport.log).to.be.calledOnce;
      expect(transport.log).to.be.calledWithExactly('info', message);
    });

    it('allows logging output to be stopped', () => {
      const logger = new Logger(levels);
      logger.registerTransport('my-logger', transport);

      const message = 'My log message';

      expect(logger.isRunning()).to.be.false;
      expect(logger.isStopped()).to.be.true;
      logger.start();
      expect(logger.isRunning()).to.be.true;
      expect(logger.isStopped()).to.be.false;

      logger.info(message);
      expect(transport.log).to.be.calledWithExactly('info', message);

      logger.stop();
      expect(logger.isRunning()).to.be.false;
      expect(logger.isStopped()).to.be.true;

      logger.info(message);
      expect(transport.log).to.not.be.calledTwice;
    });

    it('allows multiple logging transports to log same message', () => {
      const firstTransport = stubInterface<types.LogTransport>();
      const secondTransport = stubInterface<types.LogTransport>();

      const message = 'My log message';

      const logger = new Logger(levels);
      logger.registerTransport('first', firstTransport);
      logger.registerTransport('second', secondTransport);
      logger.start();

      logger.debug(message);
      expect(firstTransport.log).to.be.calledOnce;
      expect(firstTransport.log).to.be.calledWithExactly('debug', message);
      expect(secondTransport.log).to.be.calledOnce;
      expect(secondTransport.log).to.be.calledWithExactly('debug', message);
    });

    it('assigns dynamic methods corresponding to logging level names', () => {
      const logger = new Logger(levels);
      expect(logger.emerg).to.be.instanceof(Function);
      expect(logger.emerg).to.be.instanceof(Function);
      expect(logger.alert).to.be.instanceof(Function);
      expect(logger.crit).to.be.instanceof(Function);
      expect(logger.error).to.be.instanceof(Function);
      expect(logger.warning).to.be.instanceof(Function);
      expect(logger.notice).to.be.instanceof(Function);
      expect(logger.info).to.be.instanceof(Function);
      expect(logger.debug).to.be.instanceof(Function);
    });

    it('ensures that dynamically assigned methods are not overriding existing methods set prior to initialization', () => {
      const spy = sinon.stub();
      class MyLogger extends Logger {
        info(): void {
          spy();
        }
      }
      const logger = new MyLogger(levels);
      logger.info();
      expect(spy).to.be.calledOnce;
    });

    it('ensures that log method from dynamic level methods is called with proper arguments', () => {
      const logger = new Logger(levels);
      logger.start();
      logger.registerTransport('my-id', transport);

      const args = ['my-message', 'first', 2, null, undefined];
      expect(logger.info).to.be.instanceof(Function);
      logger.info('my-message', 'first', 2, null, undefined);
      expect(transport.log).to.be.calledWith('info', ...args);
    });

    it('sets the log entries logging level', () => {
      const logger = new Logger(levels);
      logger.start();
      logger.registerTransport('my-id', transport);
      const logEntry: types.LogEntry = new Log('my-message');
      logger.info(logEntry);
      expect(logEntry.level).to.be.equal('info');
      expect(transport.log).to.be.calledWith('info', logEntry);
    });
  });
});
