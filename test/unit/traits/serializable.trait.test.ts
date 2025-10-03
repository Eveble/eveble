import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { kernel, Type } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { types } from '../../../src/types';
import { SerializableTrait } from '../../../src/trait/serializable.trait';

chai.use(sinonChai);

describe('SerializableTrait', () => {
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
      @Type()
      class MyClass extends derive(SerializableTrait) {}

      expect(new MyClass().getTypeName()).to.be.equal('MyClass');
      expect(MyClass.getTypeName()).to.be.equal('MyClass');
    });

    it('returns the defined type name to the type', () => {
      @Type('MyNamedClass')
      class MyClass extends derive(SerializableTrait) {}

      expect(new MyClass().getTypeName()).to.be.equal('MyNamedClass');
      expect(MyClass.getTypeName()).to.be.equal('MyNamedClass');
    });

    it('returns the defined type name with namespace', () => {
      @Type('Namespace.MyClass')
      class MyClass extends derive(SerializableTrait) {}

      expect(new MyClass().getTypeName()).to.be.equal('Namespace.MyClass');
      expect(MyClass.getTypeName()).to.be.equal('Namespace.MyClass');
    });
  });

  describe('serialization', () => {
    it('serializes instance to JSON with serializer', () => {
      @Type('Person', { isRegistrable: false })
      class Person extends derive(SerializableTrait) {}

      const serialized = sinon.stub();
      const person = new Person();
      serializer.toJSONValue.returns(serialized);
      expect(person.toJSONValue()).to.be.eql(serialized);
      expect(serializer.toJSONValue).to.be.calledOnce;
      expect(serializer.toJSONValue).to.be.calledWithExactly(person);
    });
  });
});
