import { expect, describe, it, beforeEach, vi } from 'vitest';

import { derive } from '@traits-ts/core';
import { RFC5424LoggingTrait } from '../../../src/traits/rfc-5424-logging.trait';
import { types } from '../../../src/types';

describe(`RFC5424LoggingTrait`, () => {
  let log;

  beforeEach(() => {
    log = vi.fn();
  });

  class MyLogTransport extends derive(RFC5424LoggingTrait) {
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
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('emerg', entry, ...args);
    });

    it('implements alert', () => {
      const transport = new MyLogTransport();
      transport.alert(entry, ...args);
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('alert', entry, ...args);
    });

    it('implements crit', () => {
      const transport = new MyLogTransport();
      transport.crit(entry, ...args);
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('crit', entry, ...args);
    });

    it('implements error', () => {
      const transport = new MyLogTransport();
      transport.error(entry, ...args);
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('error', entry, ...args);
    });

    it('implements warning', () => {
      const transport = new MyLogTransport();
      transport.warning(entry, ...args);
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('warning', entry, ...args);
    });

    it('implements notice', () => {
      const transport = new MyLogTransport();
      transport.notice(entry, ...args);
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('notice', entry, ...args);
    });

    it('implements info', () => {
      const transport = new MyLogTransport();
      transport.info(entry, ...args);
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('info', entry, ...args);
    });

    it('implements debug', () => {
      const transport = new MyLogTransport();
      transport.debug(entry, ...args);
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith('debug', entry, ...args);
    });
  });
});

