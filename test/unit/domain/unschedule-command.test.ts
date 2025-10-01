import { expect } from 'chai';
import { PropTypes } from 'typend';
import { UnscheduleCommand } from '../../../src/domain/unschedule-command';
import { isTyped } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Command } from '../../../src/components/command';

describe('UnscheduleCommand', () => {
  it(`extends Command`, () => {
    expect(UnscheduleCommand.prototype).to.be.instanceof(Command);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(UnscheduleCommand.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(UnscheduleCommand.getTypeName()).to.equal('UnscheduleCommand');
    expect(UnscheduleCommand.prototype.getTypeName()).to.equal(
      'UnscheduleCommand'
    );
  });

  describe('prop types', () => {
    it('takes required targetId property as a string or Guid', () => {
      expect(UnscheduleCommand.getPropTypes().targetId).to.be.eql(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes required assignmentId property as a string or Guid', () => {
      expect(UnscheduleCommand.getPropTypes().assignmentId).to.be.eql(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes commandType property as a string', () => {
      expect(UnscheduleCommand.getPropTypes().commandType).to.be.eql(
        PropTypes.instanceOf(String)
      );
    });

    it('takes required assignerId property as a string or Guid', () => {
      expect(UnscheduleCommand.getPropTypes().assignerId).to.be.eql(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes assignerType property as a string', () => {
      expect(UnscheduleCommand.getPropTypes().assignerType).to.be.eql(
        PropTypes.instanceOf(String)
      );
    });

    it('takes optional timestamp property as a Date', () => {
      expect(UnscheduleCommand.getPropTypes().timestamp).to.be.eql(
        PropTypes.instanceOf(Date).isOptional
      );
    });

    it('takes optional metadata property as an object', () => {
      expect(UnscheduleCommand.getPropTypes().metadata).to.be.eql(
        PropTypes.object.isOptional
      );
    });
  });
});
