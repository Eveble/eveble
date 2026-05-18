import { expect, describe, it, afterEach, vi } from 'vitest';

import { UnmatchedTypeError } from 'typend';
import { ValueString } from '../../../src/domain/type-helpers/value-string';
import { NON_ENUMERABLE_VALUE_KEY } from '../../../src/constants/literal-keys';

describe('ValueString', () => {
  class MyValue extends ValueString {}
  class MyOtherValue extends ValueString {}

  it('extends String', () => {
    expect(ValueString.prototype).toBeInstanceOf(String);
  });

  it('ensures that provided value is stored under non enumerable value property', () => {
    const val = new ValueString('foo');
    expect((val as any)[NON_ENUMERABLE_VALUE_KEY]).toBe('foo');
    expect(Object.keys(val).includes('value')).toBe(false);
  });

  it('ensures that value can be compared truthfully', () => {
    expect(new ValueString('foo')).toEqual(new ValueString('foo'));
  });

  it('ensures that value can be compared falsy', () => {
    expect(new ValueString('foo')).not.toEqual(new ValueString('bar'));
  });

  describe('creation', () => {
    it('from', () => {
      const value = 'foo';
      const result = MyValue.from(value);
      expect(result).toBeInstanceOf(MyValue);
      expect(result.valueOf()).toBe(value);
    });
  });

  describe('conversion', () => {
    it('toString', () => {
      expect(new ValueString('foo').toString()).toBe('foo');
    });

    it('valueOf', () => {
      expect(new ValueString('foo').valueOf()).toBe('foo');
    });

    it('toPlainObject', () => {
      expect(new ValueString('foo').toPlainObject()).toBe('foo');
    });

    describe('transformer', () => {
      describe('as single instance', () => {
        it('to', () => {
          const transformer = MyValue.transformer();
          expect(transformer.to(new MyValue('my-value'))).toBe('my-value');
        });
        it('from', () => {
          const transformer = MyValue.transformer();
          const result = transformer.from('my-value');
          expect(result).toBeInstanceOf(MyValue);
          expect(result).toEqual(new MyValue('my-value'));
        });
      });

      describe('as array', () => {
        it('to', () => {
          const transformer = MyValue.transformer();
          expect(
            transformer.to([new MyValue('first'), new MyValue('second')])
          ).toEqual(expect.arrayContaining(['first', 'second']));
        });
        it('from', () => {
          const transformer = MyValue.transformer();
          const result = transformer.from(['first', 'second']);
          expect(Array.isArray(result)).toBe(true);
          expect(result[0]).toEqual(new MyValue('first'));
          expect(result[1]).toEqual(new MyValue('second'));
        });
      });
    });
  });

  describe('comparison', () => {
    describe('equality', () => {
      it('is not equal if compared with a null value', () => {
        expect(new MyValue('my-value').equals(null)).toBe(false);
      });

      it('returns true if both instance are equal', () => {
        expect(new MyValue('my-value').equals(new MyValue('my-value'))).to.be
          .true;
      });

      it('returns false if one instance is different from other by values', () => {
        expect(new MyValue('my-value').equals(new MyValue('my-other-value'))).to
          .be.false;
      });

      it('returns false if one instance has different type then other', () => {
        expect(new MyValue('my-value').equals(new MyOtherValue('my-value'))).to
          .be.false;
      });
    });
  });

  describe('validation', () => {
    afterEach(() => {
      ValueString.prototype.removeHook('onValidation', 'first');
      ValueString.prototype.removeHook('onValidation', 'second');
    });

    it('throws UnmatchedTypeError when provide type is not a string', () => {
      expect(() => new ValueString(2 as any)).toThrow(
        UnmatchedTypeError,
        `Expected Number(2) to be a String`
      );
    });

    it('iterates over registered onValidation hooks', () => {
      const firstValidator = vi.fn();
      const secondValidator = vi.fn();

      ValueString.prototype.registerHook(
        'onValidation',
        'first',
        firstValidator
      );
      ValueString.prototype.registerHook(
        'onValidation',
        'second',
        secondValidator
      );

      const value = 'foo';
      new ValueString(value);
      expect(firstValidator).toHaveBeenCalledTimes(1);
      expect(firstValidator).toHaveBeenCalledWith(value);
      expect(secondValidator).toHaveBeenCalledTimes(1);
      expect(secondValidator).toHaveBeenCalledWith(value);
    });

    it('ensures that error is thrown upon invalid value', () => {
      const firstValidator = vi.fn();
      const secondValidator = vi.fn();

      ValueString.prototype.registerHook(
        'onValidation',
        'first',
        firstValidator
      );
      ValueString.prototype.registerHook(
        'onValidation',
        'second',
        secondValidator
      );
      const error = new Error('invalid-value');
      secondValidator.mockImplementation(() => {
        throw error;
      });

      expect(() => new ValueString('foo')).toThrow(error);
    });
  });
});
