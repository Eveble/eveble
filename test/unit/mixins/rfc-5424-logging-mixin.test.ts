import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { RFC5424LoggingMixin } from '../../../src/mixins/rfc-5424-logging-mixin';
import { types } from '../../../src/types';

chai.use(sinonChai);

describe(`RFC5424LoggingMixin`, function () {
  let log;

  beforeEach(() => {
    log = sinon.stub();
  });

  class MyLogTransport extends RFC5424LoggingMixin {
    public log(entry: string | types.LogEntry, ...args: any[]): void {
      return log(entry, ...args);
    }
  }

  describe('implements RFC 5424 compliment level logging methods', () => {
    const entry = 'my-message';
    const args = ['my-arg', 1234, true];

    it('implements emerg', () => {
      const transport = new MyLogTransport();
      transport.emerg(entry, ...args);
      expect(log).to.be.calledOnce;
      expect(log).to.be.calledWithExactly('emerg', entry, ...args);
    });

    it('implements alert', () => {
      const transport = new MyLogTransport();
      transport.alert(entry, ...args);
      expect(log).to.be.calledOnce;
      expect(log).to.be.calledWithExactly('alert', entry, ...args);
    });

    it('implements crit', () => {
      const transport = new MyLogTransport();
      transport.crit(entry, ...args);
      expect(log).to.be.calledOnce;
      expect(log).to.be.calledWithExactly('crit', entry, ...args);
    });

    it('implements error', () => {
      const transport = new MyLogTransport();
      transport.error(entry, ...args);
      expect(log).to.be.calledOnce;
      expect(log).to.be.calledWithExactly('error', entry, ...args);
    });

    it('implements warning', () => {
      const transport = new MyLogTransport();
      transport.warning(entry, ...args);
      expect(log).to.be.calledOnce;
      expect(log).to.be.calledWithExactly('warning', entry, ...args);
    });

    it('implements notice', () => {
      const transport = new MyLogTransport();
      transport.notice(entry, ...args);
      expect(log).to.be.calledOnce;
      expect(log).to.be.calledWithExactly('notice', entry, ...args);
    });

    it('implements info', () => {
      const transport = new MyLogTransport();
      transport.info(entry, ...args);
      expect(log).to.be.calledOnce;
      expect(log).to.be.calledWithExactly('info', entry, ...args);
    });

    it('implements debug', () => {
      const transport = new MyLogTransport();
      transport.debug(entry, ...args);
      expect(log).to.be.calledOnce;
      expect(log).to.be.calledWithExactly('debug', entry, ...args);
    });
  });
});
