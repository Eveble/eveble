import { expect } from 'chai';
import { Collection } from 'typend';
import { postConstruct } from '@parisholley/inversify-async';
import {
  isDefinable,
  isSerializable,
  isRecord,
  hasPostConstruct,
  toPlainObject,
 convertObjectToCollection } from '../../../src/utils/helpers';
import { define } from '../../../src/decorators/define';


/* eslint-disable @typescript-eslint/no-empty-function */

describe('helpers', function() {
  describe('isDefinable', () => {
    it('returns true for defined(@define) instances of class implementing Definable interface', () => {
      @define()
      class MyDefinable {
        getPropTypes(): void {}

        toPlainObject(): void {}

        validateProps(): void {}

        getPropertyInitializers(): void {}

        equals(): void {}
      }

      expect(isDefinable(new MyDefinable())).to.be.true;
    });

    it('returns false for nil', () => {
      expect(isDefinable(null)).to.be.false;
      expect(isDefinable(undefined)).to.be.false;
    });

    it('returns false for not defined(@define) classes implementing Definable interface', () => {
      class ValidButNotDefined {
        getPropTypes(): void {}

        toPlainObject(): void {}

        validateProps(): void {}

        getPropertyInitializers(): void {}

        equals(): void {}
      }

      expect(isDefinable(ValidButNotDefined)).to.be.false;
    });

    it('returns false for arguments not implementing Definable interface', () => {
      class InvalidDefinable {}
      expect(isDefinable(InvalidDefinable)).to.be.false;
    });
  });

  describe('isSerializable', () => {
    it('returns true for defined(@define) class instances implementing Serializable interface', () => {
      @define('MySerialziable')
      class MySerializable {
        getPropTypes(): void {}

        toPlainObject(): void {}

        validateProps(): void {}

        getPropertyInitializers(): void {}

        equals(): void {}

        getTypeName(): void {}

        toString(): void {}

        typeName(): void {}

        toJSONValue(): void {}

        schemaVersion: number | undefined;

        transformLegacyProps(): void {}

        registerLegacyTransformer(): void {}

        overrideLegacyTransformer(): void {}

        hasLegacyTransformer(): void {}

        getLegacyTransformers(): void {}

        getLegacyTransformer(): void {}
      }

      expect(isSerializable(new MySerializable())).to.be.true;
    });

    it('returns false for not defined(@define) class instances that implementing Serializable interface', () => {
      class MySerializable {
        getPropTypes(): void {}

        toPlainObject(): void {}

        validateProps(): void {}

        getPropertyInitializers(): void {}

        equals(): void {}

        getTypeName(): void {}

        toString(): void {}

        typeName(): void {}

        toJSONValue(): void {}

        schemaVersion: number | undefined;

        transformLegacyProps(): void {}

        registerLegacyTransformer(): void {}

        overrideLegacyTransformer(): void {}

        hasLegacyTransformer(): void {}

        getLegacyTransformers(): void {}

        getLegacyTransformer(): void {}
      }

      expect(isSerializable(new MySerializable())).to.be.false;
    });

    it('returns false for nil', () => {
      expect(isSerializable(null)).to.be.false;
      expect(isSerializable(undefined)).to.be.false;
    });

    it('returns false for other arguments', () => {
      class InvalidSerializable {}
      expect(isSerializable(InvalidSerializable)).to.be.false;
    });
  });

  describe('isRecord', () => {
    it('returns true for plain objects', () => {
      expect(isRecord({})).to.be.true;
      expect(isRecord({ key: 'string' })).to.be.true;
    });

    it('returns true for class instances', () => {
      class MyClass {
        key: string;

        constructor(key: string) {
          this.key = key;
        }
      }

      expect(isRecord(new MyClass('my-string'))).to.be.true;
    });

    it('returns true for Collection instances', () => {
      expect(isRecord(new Collection())).to.be.true;
    });

    it('returns false for other arguments', () => {
      expect(isRecord('my-string')).to.be.false;
      expect(isRecord(1234)).to.be.false;
    });
  });

  describe('hasPostConstruct', () => {
    it('returns true for class instance with implemented @postConstruct annotation from Inversify', () => {
      class MyClass {
        @postConstruct()
        initialize(): void {}
      }
      expect(hasPostConstruct(MyClass.prototype)).to.be.true;
    });

    it('returns false for nil', () => {
      expect(hasPostConstruct(null)).to.be.false;
      expect(hasPostConstruct(undefined)).to.be.false;
    });

    it('returns false for classes not implementing @postConstruct annotation from Inversify', () => {
      class MyClass {
        initialize(): void {}
      }
      expect(hasPostConstruct(MyClass)).to.be.false;
    });
  });

  describe('toPlainObject', () => {
    it('returns unchanged plain object without Definable values', () => {
      const obj = { key: 'my-string' };
      expect(toPlainObject(obj)).to.be.eql(obj);
    });

    it('returns converted plain object with Definable values', () => {
      class MyDefinable {
        toPlainObject(): Record<string, any> {
          return { nested: 'my-converted-definable-plain-object' };
        }
      }
      const obj = { key: 'my-string', definable: new MyDefinable() };
      expect(toPlainObject(obj)).to.be.eql({
        key: 'my-string',
        definable: {
          nested: 'my-converted-definable-plain-object',
        },
      });
    });

    it('returns converted Collection to plain object ', () => {
      expect(
        toPlainObject(
          new Collection({
            key: 'my-collection',
          })
        )
      ).to.be.eql({
        key: 'my-collection',
      });
    });
  });

  describe('convertObjectToCollection', () => {
    it('converts root-level nested objects to collection', () => {
      const obj = {
        nested: {
          key: 'my-string',
        },
      };
      const converted = convertObjectToCollection(obj);
      expect(converted).to.be.eql({
        nested: new Collection({
          key: 'my-string',
        }),
      });
      expect(converted.nested).to.be.instanceof(Collection);
    });
  });
});
