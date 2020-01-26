import { expect } from 'chai';
import { PropTypes } from 'typend';
import sinon from 'sinon';
import { AppConfig } from '../../../src/configs/app-config';
import { Config } from '../../../src/components/config';
import { LoggingConfig } from '../../../src/configs/logging-config';

describe('AppConfig', function() {
  let generateId: any;
  beforeEach(() => {
    generateId = sinon.stub(AppConfig, 'generateId');
  });

  afterEach(() => {
    generateId.restore();
  });

  it('extends Config', () => {
    expect(AppConfig.prototype).to.be.instanceof(Config);
  });

  describe('prop types', () => {
    it('takes optional appId property as a string', () => {
      expect(AppConfig.getPropTypes().appId).to.be.eql(
        PropTypes.instanceOf(String).isOptional
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
          type: PropTypes.oneOf(
            PropTypes.equal('manual'),
            PropTypes.equal('runtime')
          ),
        }).isOptional
      );
    });

    it(`takes optional validation property as an object with type property as one of: 'manual' or 'runtime'`, () => {
      expect(AppConfig.getPropTypes().validation).to.be.eql(
        PropTypes.shape({
          type: PropTypes.oneOf(
            PropTypes.equal('manual'),
            PropTypes.equal('runtime')
          ),
        }).isOptional
      );
    });

    it(`takes optional description property as an object with formatting property as one of: 'default', 'compact', or 'debug'`, () => {
      expect(AppConfig.getPropTypes().description).to.be.eql(
        PropTypes.shape({
          formatting: PropTypes.oneOf(
            PropTypes.equal('default'),
            PropTypes.equal('compact'),
            PropTypes.equal('debug')
          ),
        }).isOptional
      );
    });
  });

  describe('defaults', () => {
    it('has default values assigned via property initializers', () => {
      const id = 'my-id';
      generateId.returns(id);
      expect(new AppConfig()).to.be.eql({
        logging: new LoggingConfig(),
        appId: id,
        conversion: { type: 'runtime' },
        validation: { type: 'runtime' },
        description: { formatting: 'default' },
      });
    });
  });
});
