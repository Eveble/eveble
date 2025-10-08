import { expect } from 'chai';
import { derive } from '@traits-ts/core';
import {
  GeneratorExistsError,
  GeneratorTrait,
  InvalidGeneratorIdError,
} from '../../../src/domain/type-helpers/traits/generator.trait';

describe(`GeneratorTrait`, () => {
  const generator = function (): string {
    return 'burp';
  };

  class SoundGenerator extends derive(GeneratorTrait<() => string>) {}

  describe('registration', () => {
    it('throws InvalidGeneratorIdError if provided id is not a string on registering generator', () => {
      expect(() =>
        new SoundGenerator().registerGenerator(
          undefined as any as string,
          generator
        )
      ).to.throw(
        InvalidGeneratorIdError,
        `Expected id argument to be string, got undefined`
      );
    });

    it('throws GeneratorExistsError if generator would be overridden', () => {
      const id = 'my-generator';
      const instance = new SoundGenerator();
      instance.registerGenerator(id, generator);
      expect(() => instance.registerGenerator(id, generator)).to.throw(
        GeneratorExistsError,
        `Generator with id 'my-generator' would be overridden. To override existing mapping use <MyGenerator.prototype.overrideGenerator>`
      );
    });

    it('registers generator', () => {
      const id = 'my-generator';

      const instance = new SoundGenerator();
      instance.registerGenerator(id, generator);
      expect(instance.getGenerator(id)).to.equal(generator);
      expect(instance.hasGenerator(id)).to.be.true;
    });

    it('allows to override generator', () => {
      const id = 'my-generator';
      const otherGenerator = function (): string {
        return 'plop';
      };

      const instance = new SoundGenerator();
      instance.registerGenerator(id, generator);
      expect(() => {
        instance.overrideGenerator(id, otherGenerator);
      }).to.not.throw(Error);
      expect(instance.getGenerator(id)).to.equal(otherGenerator);
    });

    it('returns generator by id', () => {
      const burpGenerator = function (): string {
        return 'burp';
      };
      const plopGenerator = function (): string {
        return 'plop';
      };
      const instance = new SoundGenerator();
      instance.registerGenerator('burp', burpGenerator);
      instance.registerGenerator('plop', plopGenerator);
      expect(instance.getGenerator('burp')).to.equal(burpGenerator);
      expect(instance.getGenerator('plop')).to.equal(plopGenerator);
      expect(instance.getGenerator('non-existing-generator')).to.be.undefined;
    });

    it('removes generator', () => {
      const id = 'my-generator';

      const instance = new SoundGenerator();
      instance.registerGenerator(id, generator);
      instance.removeGenerator(id);
      expect(instance.getGenerator(id)).to.be.undefined;
      expect(instance.hasGenerator(id)).to.be.false;
    });
  });

  describe('evaluation', () => {
    it(`returns true if instance has registered generator`, () => {
      const id = 'my-generator';
      const instance = new SoundGenerator();
      instance.registerGenerator(id, generator);
      expect(instance.hasGenerator(id)).to.be.true;
    });

    it(`returns false generator is not registered on instance`, () => {
      const id = 'my-generator';
      const instance = new SoundGenerator();
      expect(instance.hasGenerator(id)).to.be.false;
    });
  });

  describe('getters', () => {
    it(`returns all generator mappings as a instance of map`, () => {
      const burpGenerator = function (): string {
        return 'burp';
      };
      const plopGenerator = function (): string {
        return 'plop';
      };
      const generators = new Map([
        ['burp', burpGenerator],
        ['plop', plopGenerator],
      ]);

      const instance = new SoundGenerator();
      instance.registerGenerator('burp', burpGenerator);
      instance.registerGenerator('plop', plopGenerator);
      expect(instance.getGenerators()).to.be.eql(generators);
    });
  });
});
