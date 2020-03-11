import { expect } from 'chai';
import { Collection, PropTypes } from 'typend';
import { postConstruct } from '@parisholley/inversify-async';
import { stubInterface } from 'ts-sinon';
import {
  isDefinable,
  isSerializable,
  isRecord,
  hasPostConstruct,
  toPlainObject,
  convertObjectToCollection,
  isPlainRecord,
  resolveSerializableFromPropType,
  isEventSourceableType,
} from '../../../src/utils/helpers';
import { define } from '../../../src/decorators/define';
import { types } from '../../../src/types';

/* eslint-disable @typescript-eslint/no-empty-function */

describe('helpers', function() {
  @define('SerializableStub')
  class SerializableStub {
    getPropTypes(): void {}

    toPlainObject(): void {}

    validateProps(): void {}

    getPropertyInitializers(): void {}

    equals(): void {}

    getTypeName(): void {}

    toString(): void {}

    typeName(): void {}

    toJSONValue(): void {}

    getSchemaVersion(): void {}

    transformLegacyProps(): void {}

    registerLegacyTransformer(): void {}

    overrideLegacyTransformer(): void {}

    hasLegacyTransformer(): void {}

    getLegacyTransformers(): void {}

    getLegacyTransformer(): void {}
  }

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
      @define('MySerialziable', { isRegistrable: false })
      class MySerializable extends SerializableStub {}

      expect(isSerializable(new MySerializable())).to.be.true;
    });

    it('returns false for not defined(@define) class instances that implementing Serializable interface', () => {
      class MySerializable extends SerializableStub {}

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

  describe('isPlainRecord', () => {
    it('returns true for plain objects', () => {
      expect(isPlainRecord({})).to.be.true;
      expect(isPlainRecord({ key: 'string' })).to.be.true;
    });

    it('returns true for Collection instances', () => {
      expect(isPlainRecord(new Collection())).to.be.true;
    });

    it('returns false for class instances', () => {
      class MyClass {
        key: string;

        constructor(key: string) {
          this.key = key;
        }
      }

      expect(isPlainRecord(new MyClass('my-string'))).to.be.false;
    });

    it('returns false for other arguments', () => {
      expect(isPlainRecord('my-string')).to.be.false;
      expect(isPlainRecord(1234)).to.be.false;
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

    it('returns converted Collection to plain object', () => {
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

  describe('resolveSerializableFromPropType', () => {
    it('resolves serializable type from root-level list', () => {
      const propType = PropTypes.arrayOf(SerializableStub);
      expect(resolveSerializableFromPropType(propType)).to.be.equal(
        SerializableStub
      );
    });

    it('resolves serializable type from root-level list with nested instance of', () => {
      const propType = PropTypes.arrayOf(
        PropTypes.instanceOf(SerializableStub)
      );
      expect(resolveSerializableFromPropType(propType)).to.be.equal(
        SerializableStub
      );
    });

    it('resolves serializable type from root-level optional list with nested instance of', () => {
      const propType = PropTypes.arrayOf(PropTypes.instanceOf(SerializableStub))
        .isOptional;
      expect(resolveSerializableFromPropType(propType)).to.be.equal(
        SerializableStub
      );
    });

    it('returns undefined for non-list serializable types', () => {
      const propType = PropTypes.instanceOf(SerializableStub);
      expect(resolveSerializableFromPropType(propType)).to.be.undefined;
    });

    it('returns undefined for nil prop type', () => {
      expect(resolveSerializableFromPropType(null)).to.be.undefined;
      expect(resolveSerializableFromPropType(undefined)).to.be.undefined;
    });
  });

  describe('isEventSourceableType', () => {
    it('returns false for nil', () => {
      expect(isEventSourceableType(null)).to.be.false;
      expect(isEventSourceableType(undefined)).to.be.false;
    });

    it('returns true for value implementing EventSourceableType interface', () => {
      const EventSourceableType = stubInterface<types.EventSourceableType>();
      expect(isEventSourceableType(EventSourceableType)).to.be.true;
    });

    it('returns false for value not implementing EventSourceableType interface', () => {
      class MyInvalidEventSourceableType {
        static getTypeName(): string {
          return 'my-type-name';
        }
      }
      expect(isEventSourceableType(MyInvalidEventSourceableType)).to.be.false;
    });
  });
});
