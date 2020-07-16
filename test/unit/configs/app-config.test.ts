import { expect } from 'chai';
import { PropTypes } from 'typend';
import sinon from 'sinon';
import { AppConfig } from '../../../src/configs/app-config';
import { Config } from '../../../src/components/config';
import { LoggingConfig } from '../../../src/configs/logging-config';
import { EvebleConfig } from '../../../src/configs/eveble-config';

describe('AppConfig', function () {
  let generateId: any;
  const id = 'my-id';

  beforeEach(() => {
    generateId = sinon.stub(AppConfig, 'generateId');
    generateId.returns(id);
  });

  afterEach(() => {
    delete process.env.APP_ID;
    delete process.env.WORKER_ID;
    generateId.restore();
  });

  it('extends Config', () => {
    expect(AppConfig.prototype).to.be.instanceof(Config);
  });

  describe('prop types', () => {
    it('takes optional appId property as a string', () => {
      expect(AppConfig.getPropTypes().appId).to.be.eql(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.interface({ toString: PropTypes.instanceOf(Function) }),
        ])
      );
    });

    it('takes optional workerId property as a string', () => {
      expect(AppConfig.getPropTypes().workerId).to.be.eql(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.interface({ toString: PropTypes.instanceOf(Function) }),
        ])
      );
    });

    it('takes optional logging property as instance of LoggingConfig', () => {
      expect(AppConfig.getPropTypes().logging).to.be.eql(
        PropTypes.instanceOf(LoggingConfig).isOptional
      );
    });

    it('takes optional included property as an list of Config instances', () => {
      expect(AppConfig.getPropTypes().included).to.be.eql(
        PropTypes.interface({}).isOptional
      );
    });

    it('takes optional merged property as an list of Config instances', () => {
      expect(AppConfig.getPropTypes().merged).to.be.eql(
        PropTypes.interface({}).isOptional
      );
    });

    it(`takes optional conversion property as an object with type property as one of: 'manual' or 'runtime'`, () => {
      expect(AppConfig.getPropTypes().conversion).to.be.eql(
        PropTypes.shape({
          type: PropTypes.oneOf([
            PropTypes.equal('manual'),
            PropTypes.equal('runtime'),
          ]),
        }).isOptional
      );
    });

    it(`takes optional validation property as an object with type property as one of: 'manual' or 'runtime'`, () => {
      expect(AppConfig.getPropTypes().validation).to.be.eql(
        PropTypes.shape({
          type: PropTypes.oneOf([
            PropTypes.equal('manual'),
            PropTypes.equal('runtime'),
          ]),
        }).isOptional
      );
    });

    it(`takes optional description property as an object with formatting property as one of: 'default', 'compact', or 'debug'`, () => {
      expect(AppConfig.getPropTypes().description).to.be.eql(
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
      expect(AppConfig.getPropTypes().clients).to.be.eql(
        PropTypes.shape({
          MongoDB: PropTypes.shape({
            CommitStore: PropTypes.object.isOptional,
            Snapshotter: PropTypes.object.isOptional,
            CommandScheduler: PropTypes.object.isOptional,
          }).isOptional,
          Agenda: PropTypes.shape({
            CommandScheduler: PropTypes.object.isOptional,
          }).isOptional,
        }).isOptional
      );
    });

    it('takes optional eveble property as an instance of EvebleConfig', () => {
      expect(AppConfig.getPropTypes().eveble).to.be.eql(
        PropTypes.instanceOf(EvebleConfig).isOptional
      );
    });
  });

  describe('construction', () => {
    describe('defaults via property initializers', () => {
      it('has default values for logging property', () => {
        expect(new AppConfig().logging).to.be.instanceof(LoggingConfig);
        expect(new AppConfig().logging).to.be.eql(new LoggingConfig());
      });

      it('has default values for appId property as generated uuid', () => {
        expect(new AppConfig().appId).to.be.equal(id);
      });

      it('has default values for workerId property as generated uuid', () => {
        expect(new AppConfig().workerId).to.be.equal(id);
      });

      it('has default values for conversion property', () => {
        expect(new AppConfig().conversion).to.be.eql({ type: 'runtime' });
      });

      it('has default values for validation property', () => {
        expect(new AppConfig().validation).to.be.eql({ type: 'runtime' });
      });

      it('has default values for description property', () => {
        expect(new AppConfig().description).to.be.eql({
          formatting: 'default',
        });
      });

      it('has default values for clients property', () => {
        const defaultMongoDBOptions = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
        expect(new AppConfig().clients).to.be.eql({
          MongoDB: {
            CommitStore: defaultMongoDBOptions,
            Snapshotter: defaultMongoDBOptions,
            CommandScheduler: defaultMongoDBOptions,
          },
          Agenda: {
            CommandScheduler: {
              processEvery: 180000,
            },
          },
        });
      });

      it('has default values for eveble property', () => {
        expect(new AppConfig().eveble).to.be.instanceof(EvebleConfig);
        expect(new AppConfig().eveble).to.be.eql(new EvebleConfig());
      });
    });

    describe('default values via ENV property initializers', () => {
      it('uses env APP_ID value for appId property', () => {
        const envId = 'app-env-id';
        process.env.APP_ID = envId;
        expect(new AppConfig().appId).to.be.equal(envId);
      });

      it('uses env WORKER_ID value for workerId property', () => {
        const envId = 'worker-env-id';
        process.env.WORKER_ID = envId;
        expect(new AppConfig().workerId).to.be.equal(envId);
      });
    });
  });
});
