import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { Library } from '../../../src/core/library';
import {
  InvalidTypeError,
  TypeExistsError,
  TypeNotFoundError,
} from '../../../src/core/core-errors';
import { define } from '../../../src/decorators/define';
import { Serializable } from '../../../src/components/serializable';

chai.use(sinonChai);

describe(`Library`, () => {
  @define('MyType', { isRegistrable: false })
  class MyType extends Serializable {
    key: string;
  }

  @define('MyOtherType', { isRegistrable: false })
  class MyOtherType extends Serializable {
    key: string;
  }

  describe('construction', () => {
    it('initializes with empty map of types', () => {
      const lib = new Library();
      expect(lib.getTypes()).to.be.instanceof(Map);
      expect(lib.getTypes()).to.be.empty;
    });
  });

  describe('registration', () => {
    it('throws InvalidTypeError if provided type is not implementing Serializable interface', () => {
      class MyInvalidType {}

      const lib = new Library();

      expect(() =>
        lib.registerType('MyInvalidType', MyInvalidType as any)
      ).to.throw(
        InvalidTypeError,
        `Type 'MyInvalidType' must implement Serializable interface`
      );
    });

    it('throws TypeExistsError if provided type is already registered on library', () => {
      const lib = new Library();
      lib.registerType('MyType', MyType);
      expect(() => lib.registerType('MyType', MyOtherType)).to.throw(
        TypeExistsError,
        `Library: type 'MyType' is already registered`
      );
    });

    it('registers type ', () => {
      const lib = new Library();
      lib.registerType('MyType', MyType);
      expect(lib.getType('MyType')).to.be.equal(MyType);
    });

    it('allows for explicit override of existing type', () => {
      const lib = new Library();
      lib.registerType('MyType', MyType);
      expect(lib.getType('MyType')).to.be.equal(MyType);
      expect(() => lib.overrideType('MyType', MyOtherType)).to.not.throw(
        TypeExistsError
      );
      expect(lib.getType('MyType')).to.be.equal(MyOtherType);
    });
  });

  describe('evaluation', () => {
    it('returns true if type is registered', () => {
      const lib = new Library();
      lib.registerType('MyType', MyType);
      expect(lib.hasType('MyType')).to.be.true;
    });

    it('returns false if type is registered', () => {
      const lib = new Library();
      expect(lib.hasType('MyType')).to.be.false;
    });
  });

  describe('getters', () => {
    it('returns registered type', () => {
      const lib = new Library();
      lib.registerType('MyType', MyType);
      expect(lib.getType('MyType')).to.be.equal(MyType);
    });

    it('throws TypeNotFoundError if type is not registered on library', () => {
      const lib = new Library();
      expect(() => lib.getTypeOrThrow('MyType')).to.throw(
        TypeNotFoundError,
        `Library: type 'MyType' not found`
      );
    });

    it('returns mappings of all registered types', () => {
      const lib = new Library();
      lib.registerType('MyType', MyType);
      lib.registerType('MyOtherType', MyOtherType);
      expect(lib.getTypes()).to.be.instanceof(Map);
      expect(lib.getTypes()).to.be.eql(
        new Map([
          ['MyType', MyType],
          ['MyOtherType', MyOtherType],
        ])
      );
    });
  });

  describe('mutators', () => {
    it('removes registered type', () => {
      const lib = new Library();
      lib.registerType('MyType', MyType);
      expect(lib.getType('MyType')).to.be.equal(MyType);
      lib.removeType('MyType');
      expect(lib.getType('MyType')).to.be.undefined;
    });
  });
});
