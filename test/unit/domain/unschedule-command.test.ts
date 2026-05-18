import { expect, describe, it } from 'vitest';

import { PropTypes } from 'typend';
import { UnscheduleCommand } from '../../../src/domain/unschedule-command';
import { isTyped } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Command } from '../../../src/components/command';

describe('UnscheduleCommand', () => {
  it(`extends Command`, () => {
    expect(UnscheduleCommand.prototype).toBeInstanceOf(Command);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(UnscheduleCommand.prototype)).toBe(true);
  });

  it('defines the type name correctly', () => {
    expect(UnscheduleCommand.getTypeName()).toBe('UnscheduleCommand');
    expect(UnscheduleCommand.prototype.getTypeName()).toBe(
      'UnscheduleCommand'
    );
  });

  describe('prop types', () => {
    it('takes required targetId property as a string or Guid', () => {
      expect(UnscheduleCommand.getPropTypes().targetId).toEqual(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes required assignmentId property as a string or Guid', () => {
      expect(UnscheduleCommand.getPropTypes().assignmentId).toEqual(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes commandType property as a string', () => {
      expect(UnscheduleCommand.getPropTypes().commandType).toEqual(
        PropTypes.instanceOf(String)
      );
    });

    it('takes required assignerId property as a string or Guid', () => {
      expect(UnscheduleCommand.getPropTypes().assignerId).toEqual(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes assignerType property as a string', () => {
      expect(UnscheduleCommand.getPropTypes().assignerType).toEqual(
        PropTypes.instanceOf(String)
      );
    });

    it('takes optional timestamp property as a Date', () => {
      expect(UnscheduleCommand.getPropTypes().timestamp).toEqual(
        PropTypes.instanceOf(Date).isOptional
      );
    });

    it('takes optional metadata property as an object', () => {
      expect(UnscheduleCommand.getPropTypes().metadata).toEqual(
        PropTypes.object.isOptional
      );
    });
  });
});

