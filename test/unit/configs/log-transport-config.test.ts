import { expect } from 'chai';
import chalk from 'chalk';
import { PropTypes } from 'typend';
import { LogTransportConfig } from '../../../src/configs/log-transport-config';
import { Config } from '../../../src/components/config';

describe('LogTransportConfig', function () {
  it('extends Config', () => {
    expect(LogTransportConfig.prototype).to.be.instanceof(Config);
  });

  describe('prop types', () => {
    it('takes optional isEnabled property as a boolean', () => {
      expect(LogTransportConfig.getPropTypes().isEnabled).to.be.eql(
        PropTypes.instanceOf(Boolean).isOptional
      );
    });

    it('takes optional level property as a string', () => {
      expect(LogTransportConfig.getPropTypes().level).to.be.eql(
        PropTypes.instanceOf(String).isOptional
      );
    });

    it('takes optional logColors property as an object', () => {
      expect(LogTransportConfig.getPropTypes().logColors).to.be.eql(
        PropTypes.object.isOptional
      );
    });

    it('takes optional partsColors property as an object', () => {
      expect(LogTransportConfig.getPropTypes().partsColors).to.be.eql(
        PropTypes.shape({
          initial: PropTypes.instanceOf(String).isOptional,
          separator: PropTypes.instanceOf(String).isOptional,
          timestamp: PropTypes.instanceOf(String).isOptional,
          label: PropTypes.instanceOf(String).isOptional,
          target: PropTypes.instanceOf(String).isOptional,
          method: PropTypes.instanceOf(String).isOptional,
        }).isOptional
      );
    });

    it('takes optional messages property as an object', () => {
      expect(LogTransportConfig.getPropTypes().messages).to.be.eql(
        PropTypes.shape({
          start: PropTypes.instanceOf(String).isOptional,
          exit: PropTypes.instanceOf(String).isOptional,
        }).isOptional
      );
    });

    it('takes optional parts property as an object', () => {
      expect(LogTransportConfig.getPropTypes().parts).to.be.eql(
        PropTypes.shape({
          initial: PropTypes.instanceOf(String).isOptional,
          separator: PropTypes.instanceOf(String).isOptional,
          label: PropTypes.instanceOf(String).isOptional,
        }).isOptional
      );
    });

    it('takes optional flags property as an object', () => {
      expect(LogTransportConfig.getPropTypes().flags).to.be.eql(
        PropTypes.shape({
          isTimestamped: PropTypes.instanceOf(Boolean).isOptional,
          isLabeled: PropTypes.instanceOf(Boolean).isOptional,
          showTarget: PropTypes.instanceOf(Boolean).isOptional,
          showMethod: PropTypes.instanceOf(Boolean).isOptional,
          isColored: PropTypes.instanceOf(Boolean).isOptional,
          isWholeLineColored: PropTypes.instanceOf(Boolean).isOptional,
          includeStackTrace: PropTypes.instanceOf(Boolean).isOptional,
          isAbbreviatingSources: PropTypes.instanceOf(Boolean).isOptional,
        }).isOptional
      );
    });

    it('takes optional timestampFormat property as a string', () => {
      expect(LogTransportConfig.getPropTypes().timestampFormat).to.be.eql(
        PropTypes.instanceOf(String).isOptional
      );
    });

    it('takes optional inspectDepth property as a number', () => {
      expect(LogTransportConfig.getPropTypes().inspectDepth).to.be.eql(
        PropTypes.instanceOf(Number).isOptional
      );
    });

    it('takes optional abbreviationLength property as a number', () => {
      expect(LogTransportConfig.getPropTypes().abbreviationLength).to.be.eql(
        PropTypes.instanceOf(Number).isOptional
      );
    });
  });

  describe('defaults', () => {
    it('has default values assigned via property initializers', () => {
      expect(new LogTransportConfig()).to.be.eql({
        isEnabled: true,
        level: 'info',
        logColors: {
          emerg: 'bold redBG',
          alert: 'bold yellow',
          crit: 'bold red',
          error: 'red',
          warning: 'yellow',
          notice: 'blue',
          info: 'white',
          debug: 'bold cyan',
        },
        partsColors: {
          initial: 'white',
          separator: 'white',
          timestamp: 'white',
          label: 'white',
          target: 'white',
          method: 'white',
        },
        messages: {
          start: chalk`{gray start}`,
          exit: chalk`{gray exit}`,
        },
        parts: {
          initial: '',
          separator: ' ',
          label: '',
        },
        flags: {
          isTimestamped: true,
          isLabeled: false,
          showTarget: true,
          showMethod: true,
          isColored: true,
          isWholeLineColored: true,
          includeStackTrace: true,
          isAbbreviatingSources: false,
        },
        timestampFormat: 'HH:mm:ss',
        inspectDepth: 0,
        abbreviationLength: 15,
      });
    });
  });
});
