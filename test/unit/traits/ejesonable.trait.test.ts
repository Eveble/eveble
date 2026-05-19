import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';

import { Type, kernel } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { types } from '../../../src/types';
import { EjsonableTrait } from '../../../src/traits/ejsonable.trait';

describe('EjsonableTrait', () => {
  let originalConverter: any;
  let converter: any;

  beforeAll(() => {
    originalConverter = kernel.converter;
  });

  beforeEach(() => {
    converter = mock<types.Converter>();
    kernel.setConverter(converter);

    converter.convert.mockReturnValue({ properties: {} });
  });

  afterAll(() => {
    kernel.setConverter(originalConverter);
  });

  describe('type name', () => {
    it('adds typeName static and prototype aliased methods for compatibility @eveble/ejson serializer module', () => {
      // converter.convert.mockReturnValue({ properties: {} });
      @Type('MyNamedClass')
      class MyClass extends derive(EjsonableTrait) {}
      MyClass.getTypeName = vi.fn();

      const instance = new MyClass();
      instance.getTypeName = vi.fn();

      MyClass.typeName();
      expect(MyClass.getTypeName).toHaveBeenCalledTimes(1);

      instance.typeName();
      expect(instance.getTypeName).toHaveBeenCalledTimes(1);
    });
  });
});
