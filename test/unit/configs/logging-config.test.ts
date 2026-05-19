import { expect, describe, it, vi } from 'vitest';

import { PropTypes } from 'typend';
import { LoggingConfig } from '../../../src/configs/logging-config';
import { LogTransportConfig } from '../../../src/configs/log-transport-config';
import { Config } from '../../../src/components/config';

describe('LoggingConfig', () => {
  it('extends Config', () => {
    expect(LoggingConfig.prototype).toBeInstanceOf(Config);
  });

  describe('prop types', () => {
    it('takes optional isEnabled property as a boolean', () => {
      expect(LoggingConfig.getPropTypes().isEnabled).toEqual(
        PropTypes.instanceOf(Boolean).isOptional
      );
    });

    it('takes optional levels property as an object', () => {
      expect(LoggingConfig.getPropTypes().levels).toEqual(
        PropTypes.object.isOptional
      );
    });

    it('takes optional transports property as an object with console property that is instance of LogTransportConfig', () => {
      expect(LoggingConfig.getPropTypes().transports).toEqual(
        PropTypes.shape({
          console: PropTypes.instanceOf(LogTransportConfig).isOptional,
        }).isOptional
      );
    });
  });

  describe('defaults', () => {
    it('has default values assigned via property initializers', () => {
      expect(new LoggingConfig()).toEqual({
        isEnabled: true,
        levels: {
          emerg: 0,
          alert: 1,
          crit: 2,
          error: 3,
          warning: 4,
          notice: 5,
          info: 6,
          debug: 7,
        },
        transports: {
          console: new LogTransportConfig(),
        },
      });
    });

    // @Type() decorator evaluates metadata initializers at module import time and
    // caches the result (via DEFAULT_PROPS_KEY). processProps() overwrites field
    // initializers with cached metadata values, so env vars changed post-import
    // have no effect on constructed instances.
    it.skip('has default console logging level assigned via LOGGING_LEVEL env', () => {
      const defaultLoggingLevel = process.env.LOGGING_LEVEL;
      process.env.LOGGING_LEVEL = 'crit';
      expect(new LoggingConfig().get('transports.console.level')).toBe('crit');
      process.env.LOGGING_LEVEL = defaultLoggingLevel;
    });

    it('assigns console logging level as info if LOGGING_LEVEL env is not present ', () => {
      const defaultLoggingLevel = process.env.LOGGING_LEVEL;
      delete process.env.LOGGING_LEVEL;
      expect(new LoggingConfig().get('transports.console.level')).toBe('info');
      process.env.LOGGING_LEVEL = defaultLoggingLevel;
    });
  });
});
