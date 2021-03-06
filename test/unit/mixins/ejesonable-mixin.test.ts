import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { define, kernel } from '@eveble/core';

import { types } from '../../../src/types';
import { EjsonableMixin } from '../../../src/mixins/ejsonable-mixin';

chai.use(sinonChai);

describe('EjsonableMixin', () => {
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
      @define('MyNamedClass')
      class MyClass extends EjsonableMixin {}
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
