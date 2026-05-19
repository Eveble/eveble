import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { PropTypes } from 'typend';

import { AppConfig } from '../../../src/configs/app-config';
import { Config } from '../../../src/components/config';
import { LoggingConfig } from '../../../src/configs/logging-config';
import { EvebleConfig } from '../../../src/configs/eveble-config';

describe('AppConfig', () => {
  let generateId: any;
  const id = 'my-id';

  beforeEach(() => {
    generateId = vi.spyOn(AppConfig, 'generateId');
    generateId.mockReturnValue(id);
  });

  afterEach(() => {
    delete process.env.APP_ID;
    delete process.env.WORKER_ID;
    generateId.mockRestore();
  });

  it('extends Config', () => {
    expect(AppConfig.prototype).toBeInstanceOf(Config);
  });

  describe('prop types', () => {
    it('takes optional appId property as a string', () => {
      expect(AppConfig.getPropTypes().appId).toEqual(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.interface({ toString: PropTypes.instanceOf(Function) }),
        ])
      );
    });

    it('takes optional workerId property as a string', () => {
      expect(AppConfig.getPropTypes().workerId).toEqual(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.interface({ toString: PropTypes.instanceOf(Function) }),
        ])
      );
    });

    it('takes optional logging property as instance of LoggingConfig', () => {
      expect(AppConfig.getPropTypes().logging).toEqual(
        PropTypes.instanceOf(LoggingConfig).isOptional
      );
    });

    it(`takes optional conversion property as an object with type property as one of: 'manual' or 'runtime'`, () => {
      expect(AppConfig.getPropTypes().conversion).toEqual(
        PropTypes.shape({
          type: PropTypes.oneOf([
            PropTypes.equal('manual'),
            PropTypes.equal('runtime'),
          ]),
        }).isOptional
      );
    });

    it(`takes optional validation property as an object with type property as one of: 'manual' or 'runtime'`, () => {
      expect(AppConfig.getPropTypes().validation).toEqual(
        PropTypes.shape({
          type: PropTypes.oneOf([
            PropTypes.equal('manual'),
            PropTypes.equal('runtime'),
          ]),
        }).isOptional
      );
    });

    it(`takes optional description property as an object with formatting property as one of: 'default', 'compact', or 'debug'`, () => {
      expect(AppConfig.getPropTypes().description).toEqual(
        PropTypes.shape({
          formatting: PropTypes.oneOf([
            PropTypes.equal('compact'),
            PropTypes.equal('debug'),
            PropTypes.equal('default'),
          ]),
        }).isOptional
      );
    });

    it(`takes optional clients property as an object with options properties for clients`, () => {
      expect(AppConfig.getPropTypes().clients).toEqual(
        PropTypes.shape({
          MongoDB: PropTypes.shape({
            CommitStore: PropTypes.object.isOptional,
            Snapshotter: PropTypes.object.isOptional,
            CommandScheduler: PropTypes.object.isOptional,
          }).isOptional,
          Pulse: PropTypes.shape({
            CommandScheduler: PropTypes.object.isOptional,
          }).isOptional,
        }).isOptional
      );
    });

    it('takes optional eveble property as an instance of EvebleConfig', () => {
      expect(AppConfig.getPropTypes().eveble).toEqual(
        PropTypes.instanceOf(EvebleConfig).isOptional
      );
    });
  });

  describe('construction', () => {
    describe('defaults via property initializers', () => {
      it('has default values for logging property', () => {
        expect(new AppConfig().logging).toBeInstanceOf(LoggingConfig);
        expect(new AppConfig().logging).toEqual(new LoggingConfig());
      });

      it('has default values for appId property as generated uuid', () => {
        expect(new AppConfig().appId).toBe(id);
      });

      it('has default values for workerId property as generated uuid', () => {
        expect(new AppConfig().workerId).toBe(id);
      });

      it('has default values for conversion property', () => {
        expect(new AppConfig().conversion).toEqual({ type: 'runtime' });
      });

      it('has default values for validation property', () => {
        expect(new AppConfig().validation).toEqual({ type: 'runtime' });
      });

      it('has default values for description property', () => {
        expect(new AppConfig().description).toEqual({
          formatting: 'default',
        });
      });

      it('has default values for clients property', () => {
        const defaultMongoDBOptions = {};
        expect(new AppConfig().clients).toEqual({
          MongoDB: {
            CommitStore: defaultMongoDBOptions,
            Snapshotter: defaultMongoDBOptions,
            CommandScheduler: defaultMongoDBOptions,
          },
          Pulse: {
            CommandScheduler: {
              processEvery: 180000,
            },
          },
        });
      });

      it('has default values for eveble property', () => {
        expect(new AppConfig().eveble).toBeInstanceOf(EvebleConfig);
        expect(new AppConfig().eveble).toEqual(new EvebleConfig());
      });
    });

    describe('default values via ENV property initializers', () => {
      it('uses env APP_ID value for appId property', () => {
        const envId = 'app-env-id';
        process.env.APP_ID = envId;
        expect(new AppConfig().appId).toBe(envId);
      });

      it('uses env WORKER_ID value for workerId property', () => {
        const envId = 'worker-env-id';
        process.env.WORKER_ID = envId;
        expect(new AppConfig().workerId).toBe(envId);
      });
    });
  });
});
