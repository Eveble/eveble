import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { UnmatchedTypeError } from 'typend';
import { ValueString } from '../../../src/domain/type-helpers/value-string';
import { NON_ENUMERABLE_VALUE_KEY } from '../../../src/constants/literal-keys';

chai.use(sinonChai);

describe('ValueString', () => {
  class MyValue extends ValueString {}
  class MyOtherValue extends ValueString {}

  it('extends String', () => {
    expect(ValueString.prototype).to.be.instanceof(String);
  });

  it('ensures that provided value is stored under non enumerable value property', () => {
    const val = new ValueString('foo');
    expect((val as any)[NON_ENUMERABLE_VALUE_KEY]).to.be.equal('foo');
    expect(Object.keys(val).includes('value')).to.be.false;
  });

  it('ensures that value can be compared truthfully', () => {
    expect(new ValueString('foo')).to.be.eql(new ValueString('foo'));
  });

  it('ensures that value can be compared falsy', () => {
    expect(new ValueString('foo')).not.to.be.eql(new ValueString('bar'));
  });

  describe('creation', () => {
    it('from', () => {
      const value = 'foo';
      const result = MyValue.from(value);
      expect(result).to.be.instanceof(MyValue);
      expect(result.valueOf()).to.be.equal(value);
    });
  });

  describe('conversion', () => {
    it('toString', () => {
      expect(new ValueString('foo').toString()).to.be.equal('foo');
    });

    it('valueOf', () => {
      expect(new ValueString('foo').valueOf()).to.be.equal('foo');
    });

    it('toPlainObject', () => {
      expect(new ValueString('foo').toPlainObject()).to.be.equal('foo');
    });

    describe('transformer', () => {
      describe('as single instance', () => {
        it('to', () => {
          const transformer = MyValue.transformer();
          expect(transformer.to(new MyValue('my-value'))).to.be.equal(
            'my-value'
          );
        });
        it('from', () => {
          const transformer = MyValue.transformer();
          const result = transformer.from('my-value');
          expect(result).to.be.instanceof(MyValue);
          expect(result).to.be.eql(new MyValue('my-value'));
        });
      });

      describe('as array', () => {
        it('to', () => {
          const transformer = MyValue.transformer();
          expect(
            transformer.to([new MyValue('first'), new MyValue('second')])
          ).to.have.members(['first', 'second']);
        });
        it('from', () => {
          const transformer = MyValue.transformer();
          const result = transformer.from(['first', 'second']);
          expect(result).to.be.an('array');
          expect(result[0]).to.be.eql(new MyValue('first'));
          expect(result[1]).to.be.eql(new MyValue('second'));
        });
      });
    });
  });

  describe('comparison', () => {
    describe('equality', () => {
      it('is not equal if compared with a null value', () => {
        expect(new MyValue('my-value').equals(null)).to.be.false;
      });

      it('returns true if both instance are equal', () => {
        expect(new MyValue('my-value').equals(new MyValue('my-value'))).to.be
          .true;
      });

      it('returns false if one instance is different from other by values', () => {
        expect(new MyValue('my-value').equals(new MyValue('my-other-value'))).to
          .be.false;
      });

      it('returns false if one instance has different type then other', () => {
        expect(new MyValue('my-value').equals(new MyOtherValue('my-value'))).to
          .be.false;
      });
    });
  });

  describe('validation', () => {
    afterEach(() => {
      ValueString.prototype.removeHook('onValidation', 'first');
      ValueString.prototype.removeHook('onValidation', 'second');
    });

    it('throws UnmatchedTypeError when provide type is not a string', () => {
      expect(() => new ValueString(2 as any)).to.throw(
        UnmatchedTypeError,
        `Expected Number(2) to be a String`
      );
    });

    it('iterates over registered onValidation hooks', () => {
      const firstValidator = sinon.stub();
      const secondValidator = sinon.stub();

      ValueString.prototype.registerHook(
        'onValidation',
        'first',
        firstValidator
      );
      ValueString.prototype.registerHook(
        'onValidation',
        'second',
        secondValidator
      );

      const value = 'foo';
      new ValueString(value);
      expect(firstValidator).to.be.calledOnce;
      expect(firstValidator).to.be.calledWith(value);
      expect(secondValidator).to.be.calledOnce;
      expect(secondValidator).to.be.calledWith(value);
    });

    it('ensures that error is thrown upon invalid value', () => {
      const firstValidator = sinon.stub();
      const secondValidator = sinon.stub();

      ValueString.prototype.registerHook(
        'onValidation',
        'first',
        firstValidator
      );
      ValueString.prototype.registerHook(
        'onValidation',
        'second',
        secondValidator
      );
      const error = new Error('invalid-value');
      secondValidator.throws(error);

      expect(() => new ValueString('foo')).to.throw(error);
    });
  });
});
