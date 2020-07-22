import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { define, kernel } from '@eveble/core';
import { SerializableMixin } from '../../../src/mixins/serializable-mixin';

import { types } from '../../../src/types';

chai.use(sinonChai);

describe('SerializableMixin', () => {
  let originalConverter: any;
  let converter: any;
  let serializer: any;

  before(() => {
    originalConverter = kernel.converter;
  });

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    kernel.setConverter(converter);

    serializer = stubInterface<types.Serializer>();
    kernel.setSerializer(serializer);

    converter.convert.returns({ properties: {} });
  });

  afterEach(() => {
    kernel.setSerializer(undefined as any);
  });

  after(() => {
    kernel.setConverter(originalConverter);
  });

  describe('type name', () => {
    it('returns the default defined type name as class constructor name', () => {
      @define()
      class MyClass extends SerializableMixin {}

      expect(new MyClass().getTypeName()).to.be.equal('MyClass');
      expect(MyClass.getTypeName()).to.be.equal('MyClass');
    });

    it('returns the defined type name to the type', () => {
      @define('MyNamedClass')
      class MyClass extends SerializableMixin {}

      expect(new MyClass().getTypeName()).to.be.equal('MyNamedClass');
      expect(MyClass.getTypeName()).to.be.equal('MyNamedClass');
    });

    it('returns the defined type name with namespace', () => {
      @define('Namespace.MyClass')
      class MyClass extends SerializableMixin {}

      expect(new MyClass().getTypeName()).to.be.equal('Namespace.MyClass');
      expect(MyClass.getTypeName()).to.be.equal('Namespace.MyClass');
    });
  });

  describe('serialization', () => {
    it('serializes instance to JSON with serializer', () => {
      @define('Person', { isRegistrable: false })
      class Person extends SerializableMixin {}

      const serialized = sinon.stub();
      const person = new Person();
      serializer.toJSONValue.returns(serialized);
      expect(person.toJSONValue()).to.be.eql(serialized);
      expect(serializer.toJSONValue).to.be.calledOnce;
      expect(serializer.toJSONValue).to.be.calledWithExactly(person);
    });
  });
});
