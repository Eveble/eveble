import { expect } from 'chai';
import { instanceOf, PropTypes, ValidationError } from 'typend';
import { define } from '../../../src/decorators/define';
import { types } from '../../../src/types';
import { Serializable } from '../../../src/components/serializable';
import { SerializableError } from '../../../src/components/serializable-error';
import { VersionableMixin } from '../../../src/mixins/versionable-mixin';
import { ExtendableError } from '../../../src/components/extendable-error';
import { isDefinable } from '../../../src/utils/helpers';
import { DefinableMixin } from '../../../src/mixins/definable-mixin';
import { HookableMixin } from '../../../src/mixins/hookable-mixin';
import { EjsonableMixin } from '../../../src/mixins/ejsonable-mixin';
import { SerializableMixin } from '../../../src/mixins/serializable-mixin';

describe('SerializableError', function () {
  @define('MySerializable', { isRegistrable: false })
  class MySerializable extends Serializable {
    foo: string;
  }

  @define('MySerializableError', { isRegistrable: false })
  class MySerializableError extends SerializableError {}

  @define('MyNestedSerializableError', { isRegistrable: false })
  class MyNestedSerializableError extends SerializableError {
    nested: MySerializable;
  }

  it(`extends ExtendableError`, () => {
    expect(SerializableError.prototype).to.be.instanceof(ExtendableError);
  });

  it('implements Definable interface', () => {
    expect(SerializableError.prototype).to.instanceof(DefinableMixin);
    expect(instanceOf<types.Definable>(Serializable.prototype)).to.be.true;
  });

  it('implements Hookable interface', () => {
    expect(SerializableError.prototype).to.instanceof(HookableMixin);
    expect(instanceOf<types.Hookable>(Serializable.prototype)).to.be.true;
  });

  it('implements Serializable interface', () => {
    expect(SerializableError.prototype).to.instanceof(SerializableMixin);
    expect(instanceOf<types.Serializable>(Serializable.prototype)).to.be.true;
  });

  it('implements Ejsonable interface', () => {
    expect(SerializableError.prototype).to.instanceof(EjsonableMixin);
    expect(instanceOf<types.Ejsonable>(Serializable.prototype)).to.be.true;
  });

  it('implements Versionable interface', () => {
    expect(SerializableError.prototype).to.instanceof(VersionableMixin);
    expect(instanceOf<types.Versionable>(Serializable.prototype)).to.be.true;
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(SerializableError.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(SerializableError.getTypeName()).to.equal('SerializableError');
    expect(SerializableError.prototype.getTypeName()).to.equal(
      'SerializableError'
    );
  });

  describe('property types', () => {
    it('returns property types as an object', () => {
      const nested = new MySerializable({
        foo: 'foo',
      });
      const error = new MyNestedSerializableError({
        message: 'My message',
        nested,
      });
      const propTypes = {
        name: PropTypes.instanceOf(String),
        message: PropTypes.instanceOf(String),
        stack: PropTypes.instanceOf(String).isOptional,
        code: PropTypes.instanceOf(Number).isOptional,
        schemaVersion: PropTypes.instanceOf(Number).isOptional,
        nested: PropTypes.instanceOf(MySerializable),
      };

      expect(MyNestedSerializableError.getPropTypes()).to.be.eql(propTypes);
      expect(error.getPropTypes()).to.be.eql(propTypes);
    });
  });

  describe('construction', () => {
    it('throws ValidationError if passed properties on construction does not match prop types', () => {
      expect(() => {
        new MyNestedSerializableError({
          message: 'my-error-message',
          stack: 'my-stack',
        });
      }).to.throw(
        ValidationError,
        `MyNestedSerializableError: (Key 'nested': Expected undefined to be a MySerializable in {"message":String("my-error-message"), "stack":String("my-stack"), "name":String("MyNestedSerializableError")})`
      );
    });

    it('returns constructed parent class on valid properties', () => {
      const nested = new MySerializable({
        foo: 'foo',
      });
      const error = new MyNestedSerializableError({
        message: 'my-error-message',
        nested,
      });

      expect(error).to.be.instanceof(MyNestedSerializableError);
      expect(error).to.be.instanceof(ExtendableError);
      expect(error.nested).to.be.instanceof(MySerializable);
      expect(error.nested.foo).to.equal(nested.foo);
    });

    it(`can be instantiated without passed arguments`, () => {
      const error = new MySerializableError();
      expect(error.message).to.be.equal('');
    });

    it('takes message as a string during construction', () => {
      const message = 'This is a custom message';
      const error = new MySerializableError(message);
      expect(error.message).to.be.equal(message);
    });

    it('takes optional message property as a string during construction', () => {
      const message = 'This is a custom message';
      const error = new MySerializableError({ message });
      expect(error.message).to.be.equal(message);
    });

    it(`allows to set message as initializing class property`, () => {
      @define('MyDefaultError', { isRegistrable: false })
      class MyDefaultError extends SerializableError {
        message = 'The default message for error';
      }

      expect(new MyDefaultError().message).to.be.equal(
        'The default message for error'
      );
    });

    it('throws the prototype message by default', () => {
      expect(() => {
        throw new MySerializableError();
      }).to.throw(MySerializableError.prototype.message);
    });
  });

  describe('hooks', () => {
    describe('supports onConstruction hook', () => {
      @define('MyOtherSerializableError', { isRegistrable: false })
      class MyOtherSerializableError extends SerializableError {}

      const hookFn = (props: types.Props): types.Props => {
        if (props.message === 'my-error-message') {
          props.message = 'my-processed-error-message';
        }
        return props;
      };
      MyOtherSerializableError.prototype.registerHook(
        'onConstruction',
        'my-hook',
        hookFn
      );

      const instance = new MyOtherSerializableError({
        message: 'my-error-message',
      });
      expect(instance.message).to.be.equal('my-processed-error-message');
    });
  });
});
