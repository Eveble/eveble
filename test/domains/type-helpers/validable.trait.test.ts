import { expect, describe, it, beforeEach, vi } from 'vitest';
import { derive } from '@traits-ts/core';

import { Type } from 'typend';
import { ValueObject } from '../../../src/domain/value-object';
import { ValidableTrait } from '../../../src/domain/type-helpers/traits/validable.trait';

describe('ValidableTrait', () => {
  @Type('ValidableTrait.MyVO')
  class MyVO extends derive(ValidableTrait, ValueObject) {
    value: string;

    constructor(arg: string | { value: string }) {
      let props: { value: string };
      if (typeof arg === 'string') {
        props = { value: arg };
      } else {
        props = arg;
      }
      super([props]);
      Object.freeze(this);
    }
  }

  beforeEach(() => {
    MyVO.removeValidator();
  });

  it('sets validator as a function', () => {
    const validator = vi.fn();
    MyVO.setValidator(validator);
    expect(MyVO.getValidator()).toBe(validator);
  });

  it('ensures that validator is set as onValidation hook', () => {
    const validator = vi.fn();
    MyVO.setValidator(validator);
    expect(MyVO.prototype.hasHook('onValidation', 'validation')).toBe(true);
    expect(MyVO.prototype.getHook('onValidation', 'validation')).toBe(
      validator
    );
  });

  it('removes validation', () => {
    const validator = vi.fn();
    MyVO.setValidator(validator);
    MyVO.removeValidator();
    expect(MyVO.getValidator()).toBe(undefined);
    expect(MyVO.prototype.hasHook('onValidation', 'validation')).toBe(false);
    expect(MyVO.prototype.getHook('onValidation', 'validation')).toBe(
      undefined
    );
  });

  it('returns true if validation is set', () => {
    MyVO.setValidator(vi.fn());
    expect(MyVO.hasValidator()).toBe(true);
  });

  it('returns false if validation is not set', () => {
    MyVO.removeValidator();
    expect(MyVO.hasValidator()).toBe(false);
  });
});
