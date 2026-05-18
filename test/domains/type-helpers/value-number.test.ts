import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { kernel } from '@eveble/core';
import { UnmatchedTypeError } from 'typend';
import { ValueNumber } from '../../../src/domain/type-helpers/value-number';

describe('ValueNumber', () => {
  beforeEach(() => {
    kernel.enableValidation();
  });

  class MyValue extends ValueNumber {}
  class MyOtherValue extends ValueNumber {}

  it('extends Number', () => {
    expect(ValueNumber.prototype).toBeInstanceOf(Number);
  });

  it('ensures that value can be compared truthfully', () => {
    expect(new ValueNumber(2)).toEqual(new ValueNumber(2));
  });

  it('ensures that value can be compared falsy', () => {
    expect(new ValueNumber(2)).not.toEqual(new ValueNumber(3));
  });

  describe('creation', () => {
    it('from', () => {
      const value = 1;
      const result = MyValue.from(value);
      expect(result).toBeInstanceOf(MyValue);
      expect(result.valueOf()).toBe(value);
    });
  });

  describe('comparison', () => {
    describe('equality', () => {
      it('is not equal if compared with a null value', () => {
        expect(new MyValue(1).equals(null)).toBe(false);
      });

      it('returns true if both instance are equal', () => {
        expect(new MyValue(1).equals(new MyValue(1))).toBe(true);
      });

      it('returns false if one instance is different from other by values', () => {
        expect(new MyValue(1).equals(new MyValue(2))).toBe(false);
      });

      it('returns false if one instance has different type then other', () => {
        expect(new MyValue(1).equals(new MyOtherValue(1))).toBe(false);
      });
    });
  });

  describe('conversion', () => {
    it('toString', () => {
      expect(new ValueNumber(1).toString()).toBe('1');
    });

    it('valueOf', () => {
      expect(new ValueNumber(1).valueOf()).toBe(1);
    });

    it('toPlainObject', () => {
      expect(new ValueNumber(2).toPlainObject()).toBe(2);
    });

    describe('transformer', () => {
      describe('as single instance', () => {
        it('to', () => {
          const transformer = MyValue.transformer();
          expect(transformer.to(new MyValue(1))).toBe(1);
        });
        it('from', () => {
          const transformer = MyValue.transformer();
          const result = transformer.from(1);
          expect(result).toBeInstanceOf(MyValue);
          expect(result).toEqual(new MyValue(1));
        });
      });
      describe('as array', () => {
        it('to', () => {
          const transformer = MyValue.transformer();
          expect(transformer.to([new MyValue(1), new MyValue(2)])).toEqual(
            expect.arrayContaining([1, 2])
          );
        });
        it('from', () => {
          const transformer = MyValue.transformer();
          const result = transformer.from([1, 2]);
          expect(Array.isArray(result)).toBe(true);
          expect(result[0]).toEqual(new MyValue(1));
          expect(result[1]).toEqual(new MyValue(2));
        });
      });
    });
  });

  describe('validation', () => {
    afterEach(() => {
      ValueNumber.prototype.removeHook('onValidation', 'first');
      ValueNumber.prototype.removeHook('onValidation', 'second');
    });

    it('throws UnmatchedTypeError when provide type is not a number', () => {
      expect(() => new ValueNumber('foo' as any)).toThrow(
        UnmatchedTypeError,
        `Expected String("foo") to be a Number`
      );
    });

    it('ensures that errors are only thrown upon enabled validation on kernel', () => {
      kernel.disableValidation();

      expect(() => new ValueNumber('foo' as any)).not.toThrow(Error);
    });

    it('iterates over registered onValidation hooks', () => {
      const firstValidator = vi.fn();
      const secondValidator = vi.fn();

      ValueNumber.prototype.registerHook(
        'onValidation',
        'first',
        firstValidator
      );
      ValueNumber.prototype.registerHook(
        'onValidation',
        'second',
        secondValidator
      );

      const value = 1;
      new ValueNumber(value);
      expect(firstValidator).toHaveBeenCalledTimes(1);
      expect(firstValidator).toHaveBeenCalledWith(value);
      expect(secondValidator).toHaveBeenCalledTimes(1);
      expect(secondValidator).toHaveBeenCalledWith(value);
    });

    it('ensures that error is thrown upon invalid value', () => {
      const firstValidator = vi.fn();
      const secondValidator = vi.fn();

      ValueNumber.prototype.registerHook(
        'onValidation',
        'first',
        firstValidator
      );
      ValueNumber.prototype.registerHook(
        'onValidation',
        'second',
        secondValidator
      );
      const error = new Error('invalid-value');
      secondValidator.mockImplementation(() => {
        throw error;
      });

      expect(() => new ValueNumber(1)).toThrow(error);
    });
  });
});
