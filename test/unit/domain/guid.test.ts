import { expect } from 'chai';
import {
  Guid,
  InvalidGuidValueError,
} from '../../../src/domain/value-objects/guid';
import { ValueObject } from '../../../src/domain/value-object';
import { isDefinable } from '../../../src/utils/helpers';

describe('Guid', function () {
  it(`extends ValueObject`, () => {
    expect(Guid.prototype).to.be.instanceof(ValueObject);
  });

  describe(`immutability`, () => {
    it(`freezes itself`, () => {
      expect(Object.isFrozen(new Guid())).to.be.true;
    });
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Guid.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(Guid.getTypeName()).to.equal('Guid');
    expect(Guid.prototype.getTypeName()).to.equal('Guid');
  });

  describe('construction', () => {
    it('generates a globally unique id if id is not passed on construction', () => {
      const guid = new Guid();
      expect(guid.valueOf()).to.match(Guid.pattern);
      expect(guid.toString()).to.match(Guid.pattern);
    });

    it('takes an optional id as a string matching pattern and assigns it', () => {
      const id = '936DA01F-9ABD-4D9D-80C7-02AF85C822A8';
      const guid = new Guid(id);
      expect(guid.valueOf()).to.equal(id);
      expect(guid.toString()).to.equal(id);
    });

    it('takes an object with id property as a string matching pattern and assigns it', () => {
      const id = '936DA01F-9ABD-4D9D-80C7-02AF85C822A8';
      const guid = new Guid({
        id,
      });
      expect(guid.valueOf()).to.equal(id);
      expect(guid.toString()).to.equal(id);
    });

    it('throws InvalidGuidValueError when passed id is not matching pattern', () => {
      const invalidValue = '1234';
      expect(() => {
        new Guid(invalidValue);
      }).to.throw(
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
      expect(Guid.isValid('110ec58a-a0f2-4ac4-8393-c866d813b8d1')).to.be.true;
    });

    it(`returns false if value is not matching settable pattern(UUID v4 at the time)`, () => {
      expect(Guid.isValid('im-totally-a-guid')).to.be.false;
    });

    it(`returns false if value is not provided`, () => {
      expect(Guid.isValid((1234 as any) as string)).to.be.false;
    });
  });
});
