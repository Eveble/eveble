import { expect } from 'chai';
import { derive } from '@traits-ts/core';
import {
  ValidatorExistsError,
  ValidatorTrait,
  InvalidValidatorIdError,
} from '../../../src/domain/type-helpers/traits/validator.trait';

describe(`ValidatorTrait`, () => {
  const validator = function (value: string): boolean {
    return typeof value === 'string';
  };

  class ColorValidator extends derive(
    ValidatorTrait<(value: string) => boolean>
  ) {}

  describe('registration', () => {
    it('throws InvalidValidatorIdError if provided id is not a string on registering validator', () => {
      expect(() =>
        new ColorValidator().registerValidator(
          undefined as any as string,
          validator
        )
      ).to.throw(
        InvalidValidatorIdError,
        `Expected id argument to be string, got undefined`
      );
    });

    it('throws ValidatorExistsError if validator would be overridden', () => {
      const id = 'my-validator';
      const instance = new ColorValidator();
      instance.registerValidator(id, validator);
      expect(() => instance.registerValidator(id, validator)).to.throw(
        ValidatorExistsError,
        `Validator with id 'my-validator' would be overridden. To override existing mapping use <MyValidator.prototype.overrideValidator>`
      );
    });

    it('registers validator', () => {
      const id = 'my-validator';

      const instance = new ColorValidator();
      instance.registerValidator(id, validator);
      expect(instance.getValidator(id)).to.equal(validator);
      expect(instance.hasValidator(id)).to.be.true;
    });

    it('allows to override validator', () => {
      const id = 'my-validator';
      const otherValidator = function (value: string): boolean {
        return value === 'my-string';
      };

      const instance = new ColorValidator();
      instance.registerValidator(id, validator);
      expect(() => {
        instance.overrideValidator(id, otherValidator);
      }).to.not.throw(Error);
      expect(instance.getValidator(id)).to.equal(otherValidator);
    });

    it('returns validator by id', () => {
      const hexValidator = function (value: string): boolean {
        return /^[0-9a-fA-F]+$/.test(value);
      };
      const hslValidator = function (value: string): boolean {
        return /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(value);
      };
      const instance = new ColorValidator();
      instance.registerValidator('hex', hexValidator);
      instance.registerValidator('green', hslValidator);
      expect(instance.getValidator('hex')).to.equal(hexValidator);
      expect(instance.getValidator('green')).to.equal(hslValidator);
      expect(instance.getValidator('non-existing-validator')).to.be.undefined;
    });

    it('removes validator', () => {
      const id = 'my-validator';

      const instance = new ColorValidator();
      instance.registerValidator(id, validator);
      instance.removeValidator(id);
      expect(instance.getValidator(id)).to.be.undefined;
      expect(instance.hasValidator(id)).to.be.false;
    });
  });

  describe('evaluation', () => {
    it(`returns true if instance has registered validator`, () => {
      const id = 'my-validator';
      const instance = new ColorValidator();
      instance.registerValidator(id, validator);
      expect(instance.hasValidator(id)).to.be.true;
    });

    it(`returns false validator is not registered on instance`, () => {
      const id = 'my-validator';
      const instance = new ColorValidator();
      expect(instance.hasValidator(id)).to.be.false;
    });
  });

  describe('getters', () => {
    it(`returns all validator mappings as a instance of map`, () => {
      const hexValidator = function (value: string): boolean {
        return /^[0-9a-fA-F]+$/.test(value);
      };
      const hslValidator = function (value: string): boolean {
        return /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(value);
      };
      const validators = new Map([
        ['hex', hexValidator],
        ['green', hslValidator],
      ]);

      const instance = new ColorValidator();
      instance.registerValidator('hex', hexValidator);
      instance.registerValidator('green', hslValidator);
      expect(instance.getValidators()).to.be.eql(validators);
    });
  });
});
