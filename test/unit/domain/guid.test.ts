import { expect, describe, it } from 'vitest';

import {
  Guid,
  InvalidGuidValueError,
} from '../../../src/domain/value-objects/guid';
import { ValueObject } from '../../../src/domain/value-object';
import { isTyped } from '../../../src/utils/helpers';

describe('Guid', () => {
  it(`extends ValueObject`, () => {
    expect(Guid.prototype).toBeInstanceOf(ValueObject);
  });

  describe(`immutability`, () => {
    it(`freezes itself`, () => {
      expect(Object.isFrozen(new Guid())).toBe(true);
    });
  });

  it('ensures that type is defined', () => {
    expect(isTyped(Guid.prototype)).toBe(true);
  });

  it('defines the type name correctly', () => {
    expect(Guid.getTypeName()).toBe('Guid');
    expect(Guid.prototype.getTypeName()).toBe('Guid');
  });

  describe('construction', () => {
    it('generates a globally unique id if id is not passed on construction', () => {
      const guid = new Guid();
      expect(guid.valueOf()).toMatch(Guid.pattern);
      expect(guid.toString()).toMatch(Guid.pattern);
    });

    it('takes an optional id as a string matching pattern and assigns it', () => {
      const id = '936DA01F-9ABD-4D9D-80C7-02AF85C822A8';
      const guid = new Guid(id);
      expect(guid.valueOf()).toBe(id);
      expect(guid.toString()).toBe(id);
    });

    it('takes an object with id property as a string matching pattern and assigns it', () => {
      const id = '936DA01F-9ABD-4D9D-80C7-02AF85C822A8';
      const guid = new Guid({
        id,
      });
      expect(guid.valueOf()).toBe(id);
      expect(guid.toString()).toBe(id);
    });

    it('throws InvalidGuidValueError when passed id is not matching pattern', () => {
      const invalidValue = '1234';
      expect(() => {
        new Guid(invalidValue);
      }).toThrow(
        InvalidGuidValueError,
        `Guid: Expected string as a valid guid, got String("1234")`
      );
    });
  });

  describe('equality', () => {
    it('is equal on ids match', () => {
      const guid1 = new Guid();
      const guid2 = new Guid(guid1.toString());
      expect(guid1.equals(guid2)).to.true;
    });

    it('is not equal when ids do not match', () => {
      const guid1 = new Guid();
      const guid2 = new Guid();
      expect(guid1.equals(guid2)).to.false;
    });
  });

  describe(`evaluation`, () => {
    it(`returns true if id is matching settable pattern(UUID v4 at the time)`, () => {
      expect(Guid.isValid('110ec58a-a0f2-4ac4-8393-c866d813b8d1')).toBe(true);
    });

    it(`returns false if value is not matching settable pattern(UUID v4 at the time)`, () => {
      expect(Guid.isValid('im-totally-a-guid')).toBe(false);
    });

    it(`returns false if value is not provided`, () => {
      expect(Guid.isValid(1234 as any as string)).toBe(false);
    });
  });
});

