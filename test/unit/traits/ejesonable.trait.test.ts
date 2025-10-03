import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Type, kernel } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { types } from '../../../src/types';
import { EjsonableTrait } from '../../../src/traits/ejsonable.trait';

chai.use(sinonChai);

describe('EjsonableTrait', () => {
  let originalConverter: any;
  let converter: any;

  before(() => {
    originalConverter = kernel.converter;
  });

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    kernel.setConverter(converter);

    converter.convert.returns({ properties: {} });
  });

  after(() => {
    kernel.setConverter(originalConverter);
  });

  describe('type name', () => {
    it('adds typeName static and prototype aliased methods for compatibility @eveble/ejson serializer module', () => {
      // converter.convert.returns({ properties: {} });
      @Type('MyNamedClass')
      class MyClass extends derive(EjsonableTrait) {}
      MyClass.getTypeName = sinon.stub();

      const instance = new MyClass();
      instance.getTypeName = sinon.stub();

      MyClass.typeName();
      expect(MyClass.getTypeName).to.be.calledOnce;

      instance.typeName();
      expect(instance.getTypeName).to.be.calledOnce;
    });
  });
});
