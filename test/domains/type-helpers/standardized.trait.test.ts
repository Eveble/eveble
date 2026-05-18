import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { derive } from '@traits-ts/core';

import {
  StandardExistError,
  StandardizedTrait,
  UnsupportedStandardError,
} from '../../../src/domain/type-helpers/traits/standardized.trait';
import { types } from '../../../src/types';
import { ValueObject } from '../../../src/domain/value-object';

describe('StandardizedTrait', () => {
  const standardId = 'my-standard';
  const otherStandardId = 'other-standard';
  let standard: any;
  let otherStandard: any;
  let MyStandardizedVO: any;
  const code = 'my-code';

  beforeEach(() => {
    standard = mock<types.Standard<string>>();
    otherStandard = mock<types.Standard<string>>();

    standard.getId.mockReturnValue(standardId);
    otherStandard.getId.mockReturnValue(otherStandardId);

    MyStandardizedVO = class MyVO extends (
      derive(StandardizedTrait, ValueObject)
    ) {};
  });

  describe('registration', () => {
    it('registers new standard', () => {
      expect(MyStandardizedVO.hasStandard(standardId)).toBe(false);
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).toBe(true);
    });

    it('throws StandardAlreadyExists if standard with same identifier exists', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(() => MyStandardizedVO.registerStandard(standard)).toThrow(
        StandardExistError,
        `MyVO: standard with id 'my-standard' already exists`
      );
    });

    it('allows for explicit override already existing standard', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).toBe(true);
      expect(() =>
        MyStandardizedVO.registerStandard(standard, true)
      ).not.toThrow(StandardExistError);
    });

    it('overrides already registered standard', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).toBe(true);
      expect(() => MyStandardizedVO.overrideStandard(standard)).not.toThrow(
        StandardExistError
      );
    });
  });

  describe('evaluation', () => {
    it('returns true if standard with identifier is registered', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).toBe(true);
    });
    it('returns false if standard with identifier is not registered', () => {
      expect(MyStandardizedVO.hasStandard(standardId)).toBe(false);
    });
  });

  describe('mutators', () => {
    it('removes standard by identifier', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).toBe(true);
      MyStandardizedVO.removeStandard(standardId);
      expect(MyStandardizedVO.hasStandard(standardId)).toBe(false);
    });
  });

  describe('accessors', () => {
    it('returns all available standards', () => {
      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);
      expect(MyStandardizedVO.getStandards()).toEqual(
        expect.arrayContaining([standard, otherStandard])
      );
    });

    it('returns standard by identifier', () => {
      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);
      expect(MyStandardizedVO.getStandard(otherStandardId)).toBe(otherStandard);
    });

    it('returns undefined if standard with identifier does not exist', () => {
      expect(MyStandardizedVO.getStandard(standardId)).toBe(undefined);
    });

    describe('codes ', () => {
      it('returns all codes in standard', () => {
        const codes = ['code1', 'code2'];
        standard.getCodes = vi.fn();
        (standard as any).getCodes.mockReturnValue(codes);

        MyStandardizedVO.registerStandard(standard);
        expect(MyStandardizedVO.getCodes(standardId)).toEqual(codes);
      });

      it('throws UnsupportedStandardError if provided standard is not supported', () => {
        expect(() => MyStandardizedVO.getCodes(standardId)).toThrow(
          UnsupportedStandardError,
          `Standard is not supported`
        );
      });
    });
  });

  describe('identification', () => {
    it('identifies code standard', () => {
      standard.isValid.mockReturnValue(false);
      otherStandard.isValid.mockReturnValue(true);

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.identifyStandard(code)).toBe(otherStandard);
      expect(standard.isValid).toHaveBeenCalledTimes(1);
      expect(standard.isValid).toHaveBeenCalledWith(code);
      expect(otherStandard.isValid).toHaveBeenCalledTimes(1);
      expect(otherStandard.isValid).toHaveBeenCalledWith(code);
    });

    it(`returns undefined if code can't be identified`, () => {
      standard.isValid.mockReturnValue(false);
      otherStandard.isValid.mockReturnValue(false);

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.identifyStandard(code)).toBe(undefined);
      expect(standard.isValid).toHaveBeenCalledTimes(1);
      expect(standard.isValid).toHaveBeenCalledWith(code);
      expect(otherStandard.isValid).toHaveBeenCalledTimes(1);
      expect(otherStandard.isValid).toHaveBeenCalledWith(code);
    });

    it('returns true if code is included in standard', () => {
      standard.isIn.calledWith(code).mockReturnValue(true);
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.isInStandard(code, standardId)).toBe(true);
      expect(standard.isIn).toHaveBeenCalledTimes(1);
      expect(standard.isIn).toHaveBeenCalledWith(code);
    });

    it('returns false if code is not included in standard', () => {
      standard.isIn.calledWith(code).mockReturnValue(false);
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.isInStandard(code, standardId)).toBe(false);
      expect(standard.isIn).toHaveBeenCalledTimes(1);
      expect(standard.isIn).toHaveBeenCalledWith(code);
    });

    it('throws UnsupportedStandardError if provided standard is not supported', () => {
      expect(() => MyStandardizedVO.isInStandard(code, standardId)).toThrow(
        UnsupportedStandardError,
        `Standard is not supported`
      );
    });
  });

  describe('conversion', () => {
    it('converts code from one standard to another convertible standard', () => {
      const convertedCode = 'my-converted-code';

      standard.isValid.calledWith(code).mockReturnValue(true);
      otherStandard.isConvertible = true;
      otherStandard.convert
        .calledWith(code, standard)
        .mockReturnValue(convertedCode);

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.convert(code, otherStandardId)).toBe(
        convertedCode
      );

      expect(standard.isValid).toHaveBeenCalledTimes(1);
      expect(standard.isValid).toHaveBeenCalledWith(code);
      expect(otherStandard.convert).toHaveBeenCalledTimes(1);
      expect(otherStandard.convert).toHaveBeenCalledWith(code, standard);
    });

    it('does not convert code to same standard', () => {
      standard.isValid.calledWith(code).mockReturnValue(true);

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.convert(code, standardId)).toBe(code);
      expect(standard.isValid).toHaveBeenCalledTimes(1);
      expect(standard.isValid).toHaveBeenCalledWith(code);
      expect(otherStandard.convert).to.be.not.be.called;
    });

    it('returns undefined if other standard does not support conversion', () => {
      standard.isValid.calledWith(code).mockReturnValue(true);
      otherStandard.isConvertible = false;

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.convert(code, otherStandardId)).toBe(undefined);
      expect(standard.isValid).toHaveBeenCalledTimes(1);
      expect(standard.isValid).toHaveBeenCalledWith(code);
      expect(otherStandard.convert).to.be.not.be.called;
    });

    it('throws UnsupportedStandardError if provided standard is not supported', () => {
      expect(() => MyStandardizedVO.convert(code, standardId)).toThrow(
        UnsupportedStandardError,
        `Standard is not supported`
      );
    });
  });
});
