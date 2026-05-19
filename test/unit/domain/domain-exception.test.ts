import { expect, describe, it } from 'vitest';

import { PropTypes } from 'typend';
import { DomainException } from '../../../src/domain/domain-exception';
import { isTyped } from '../../../src/utils/helpers';
import { DomainError } from '../../../src/domain/domain-error';
import { Event } from '../../../src/components/event';

describe('DomainException', () => {
  it(`extends Event`, () => {
    expect(DomainException.prototype).toBeInstanceOf(Event);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(DomainException.prototype)).toBe(true);
  });

  it('defines the type name correctly', () => {
    expect(DomainException.getTypeName()).toBe('DomainException');
    expect(DomainException.prototype.getTypeName()).toBe('DomainException');
  });

  describe('prop types', () => {
    it('takes required thrower property as a string', () => {
      expect(DomainException.getPropTypes().thrower).toEqual(
        PropTypes.instanceOf(String)
      );
    });

    it('takes optional version property as a Number', () => {
      expect(DomainException.getPropTypes().error).toEqual(
        PropTypes.instanceOf(DomainError)
      );
    });
  });
});
