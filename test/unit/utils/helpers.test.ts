import { mock } from 'vitest-mock-extended';
import { expect, describe, it } from 'vitest';

import { Collection, PropTypes } from 'typend';

import {
  Type,
  isSerializable,
  resolveSerializableFromPropType,
} from '@eveble/core';
import {
  isTyped,
  isRecord,
  toPlainObject,
  convertObjectToCollection,
  isPlainRecord,
  isEventSourceableType,
} from '../../../src/utils/helpers';
import { types } from '../../../src/types';
import { Struct } from '../../../src/components/struct';

/* eslint-disable @typescript-eslint/no-empty-function */

describe('helpers', () => {
  @Type('SerializableStub')
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

  describe('isTyped', () => {
    it('returns true for defined(@Type) instances of class implementing Definable interface', () => {
      @Type()
      class MyDefinable {
        getPropTypes(): void {}

        toPlainObject(): void {}

        validateProps(): void {}

        getPropertyInitializers(): void {}

        equals(): void {}
      }

      expect(isTyped(new MyDefinable())).toBe(true);
    });

    it('returns false for nil', () => {
      expect(isTyped(null)).toBe(false);
      expect(isTyped(undefined)).toBe(false);
    });

    it('returns true for Struct', () => {
      @Type('MyStruct', { isRegistrable: false })
      class MyStruct extends Struct {}
      expect(isTyped(new MyStruct())).toBe(true);
    });

    it('returns false for not defined(@Type) classes implementing Definable interface', () => {
      class ValidButNotDefined {
        getPropTypes(): void {}

        toPlainObject(): void {}

        validateProps(): void {}

        getPropertyInitializers(): void {}

        equals(): void {}
      }

      expect(isTyped(ValidButNotDefined)).toBe(false);
    });

    it('returns false for arguments not implementing Definable interface', () => {
      class InvalidDefinable {}
      expect(isTyped(InvalidDefinable)).toBe(false);
    });
  });

  describe('isSerializable', () => {
    it('returns true for defined(@Type) class instances implementing Serializable interface', () => {
      @Type('MySerialziable', { isRegistrable: false })
      class MySerializable extends SerializableStub {}

      expect(isSerializable(new MySerializable())).toBe(true);
    });

    it('returns false for not defined(@Type) class instances that implementing Serializable interface', () => {
      class MySerializable extends SerializableStub {}

      expect(isSerializable(new MySerializable())).toBe(false);
    });

    it('returns false for nil', () => {
      expect(isSerializable(null)).toBe(false);
      expect(isSerializable(undefined)).toBe(false);
    });

    it('returns false for other arguments', () => {
      class InvalidSerializable {}
      expect(isSerializable(InvalidSerializable)).toBe(false);
    });
  });

  describe('isRecord', () => {
    it('returns true for plain objects', () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord({ key: 'string' })).toBe(true);
    });

    it('returns true for class instances', () => {
      class MyClass {
        key: string;

        constructor(key: string) {
          this.key = key;
        }
      }

      expect(isRecord(new MyClass('my-string'))).toBe(true);
    });

    it('returns true for Collection instances', () => {
      expect(isRecord(new Collection())).toBe(true);
    });

    it('returns false for other arguments', () => {
      expect(isRecord('my-string')).toBe(false);
      expect(isRecord(1234)).toBe(false);
    });
  });

  describe('isPlainRecord', () => {
    it('returns true for plain objects', () => {
      expect(isPlainRecord({})).toBe(true);
      expect(isPlainRecord({ key: 'string' })).toBe(true);
    });

    it('returns true for Collection instances', () => {
      expect(isPlainRecord(new Collection())).toBe(true);
    });

    it('returns false for class instances', () => {
      class MyClass {
        key: string;

        constructor(key: string) {
          this.key = key;
        }
      }

      expect(isPlainRecord(new MyClass('my-string'))).toBe(false);
    });

    it('returns false for other arguments', () => {
      expect(isPlainRecord('my-string')).toBe(false);
      expect(isPlainRecord(1234)).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('returns unchanged plain object without Definable values', () => {
      const obj = { key: 'my-string' };
      expect(toPlainObject(obj)).toEqual(obj);
    });

    it('returns converted plain object with Definable values', () => {
      class MyDefinable {
        toPlainObject(): Record<string, any> {
          return { nested: 'my-converted-definable-plain-object' };
        }
      }
      const obj = { key: 'my-string', definable: new MyDefinable() };
      expect(toPlainObject(obj)).toEqual({
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
      ).toEqual({
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
      expect(converted).toEqual({
        nested: new Collection({
          key: 'my-string',
        }),
      });
      expect(converted.nested).toBeInstanceOf(Collection);
    });
  });

  describe('resolveSerializableFromPropType', () => {
    it('resolves serializable type from root-level list', () => {
      const propType = PropTypes.arrayOf(SerializableStub);
      expect(resolveSerializableFromPropType(propType)).toBe(SerializableStub);
    });

    it('resolves serializable type from root-level list with nested instance of', () => {
      const propType = PropTypes.arrayOf(
        PropTypes.instanceOf(SerializableStub)
      );
      expect(resolveSerializableFromPropType(propType)).toBe(SerializableStub);
    });

    it('resolves serializable type from root-level optional list with nested instance of', () => {
      const propType = PropTypes.arrayOf(
        PropTypes.instanceOf(SerializableStub)
      ).isOptional;
      expect(resolveSerializableFromPropType(propType)).toBe(SerializableStub);
    });

    it('returns undefined for non-list serializable types', () => {
      const propType = PropTypes.instanceOf(SerializableStub);
      expect(resolveSerializableFromPropType(propType)).toBeUndefined();
    });

    it('returns undefined for nil prop type', () => {
      expect(resolveSerializableFromPropType(null)).toBeUndefined();
      expect(resolveSerializableFromPropType(undefined)).toBeUndefined();
    });
  });

  describe('isEventSourceableType', () => {
    it('returns false for nil', () => {
      expect(isEventSourceableType(null)).toBe(false);
      expect(isEventSourceableType(undefined)).toBe(false);
    });

    it('returns true for value implementing EventSourceableType interface', () => {
      const EventSourceableType = mock<types.EventSourceableType>();
      expect(isEventSourceableType(EventSourceableType)).toBe(true);
    });

    it('returns false for value not implementing EventSourceableType interface', () => {
      class MyInvalidEventSourceableType {
        static getTypeName(): string {
          return 'my-type-name';
        }
      }
      expect(isEventSourceableType(MyInvalidEventSourceableType)).toBe(false);
    });
  });
});
