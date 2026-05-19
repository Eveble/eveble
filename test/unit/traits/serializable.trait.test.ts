import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';

import { kernel, Type } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { types } from '../../../src/types';
import { SerializableTrait } from '../../../src/traits/serializable.trait';

describe('SerializableTrait', () => {
  let originalConverter: any;
  let converter: any;
  let serializer: any;

  beforeAll(() => {
    originalConverter = kernel.converter;
  });

  beforeEach(() => {
    converter = mock<types.Converter>();
    kernel.setConverter(converter);

    serializer = mock<types.Serializer>();
    kernel.setSerializer(serializer);

    converter.convert.mockReturnValue({ properties: {} });
  });

  afterEach(() => {
    kernel.setSerializer(undefined as any);
  });

  afterAll(() => {
    kernel.setConverter(originalConverter);
  });

  describe('type name', () => {
    it('returns the default defined type name as class constructor name', () => {
      @Type()
      class MyClass extends derive(SerializableTrait) {}

      expect(new MyClass().getTypeName()).toBe('MyClass');
      expect(MyClass.getTypeName()).toBe('MyClass');
    });

    it('returns the defined type name to the type', () => {
      @Type('MyNamedClass')
      class MyClass extends derive(SerializableTrait) {}

      expect(new MyClass().getTypeName()).toBe('MyNamedClass');
      expect(MyClass.getTypeName()).toBe('MyNamedClass');
    });

    it('returns the defined type name with namespace', () => {
      @Type('Namespace.MyClass')
      class MyClass extends derive(SerializableTrait) {}

      expect(new MyClass().getTypeName()).toBe('Namespace.MyClass');
      expect(MyClass.getTypeName()).toBe('Namespace.MyClass');
    });
  });

  describe('serialization', () => {
    it('serializes instance to JSON with serializer', () => {
      @Type('Person', { isRegistrable: false })
      class Person extends derive(SerializableTrait) {}

      const serialized = vi.fn();
      const person = new Person();
      serializer.toJSONValue.mockReturnValue(serialized);
      expect(person.toJSONValue()).toEqual(serialized);
      expect(serializer.toJSONValue).toHaveBeenCalledTimes(1);
      expect(serializer.toJSONValue).toHaveBeenCalledWith(person);
    });
  });
});
