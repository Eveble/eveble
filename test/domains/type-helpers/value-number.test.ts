import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { kernel } from '@eveble/core';
import { UnmatchedTypeError } from 'typend';
import { ValueNumber } from '../../../src/domain/type-helpers/value-number';

chai.use(sinonChai);

describe('ValueNumber', () => {
  beforeEach(() => {
    kernel.enableValidation();
  });

  class MyValue extends ValueNumber {}
  class MyOtherValue extends ValueNumber {}

  it('extends Number', () => {
    expect(ValueNumber.prototype).to.be.instanceof(Number);
  });

  it('ensures that value can be compared truthfully', () => {
    expect(new ValueNumber(2)).to.be.eql(new ValueNumber(2));
  });

  it('ensures that value can be compared falsy', () => {
    expect(new ValueNumber(2)).not.to.be.eql(new ValueNumber(3));
  });

  describe('creation', () => {
    it('from', () => {
      const value = 1;
      const result = MyValue.from(value);
      expect(result).to.be.instanceof(MyValue);
      expect(result.valueOf()).to.be.equal(value);
    });
  });

  describe('comparison', () => {
    describe('equality', () => {
      it('is not equal if compared with a null value', () => {
        expect(new MyValue(1).equals(null)).to.be.false;
      });

      it('returns true if both instance are equal', () => {
        expect(new MyValue(1).equals(new MyValue(1))).to.be.true;
      });

      it('returns false if one instance is different from other by values', () => {
        expect(new MyValue(1).equals(new MyValue(2))).to.be.false;
      });

      it('returns false if one instance has different type then other', () => {
        expect(new MyValue(1).equals(new MyOtherValue(1))).to.be.false;
      });
    });
  });

  describe('conversion', () => {
    it('toString', () => {
      expect(new ValueNumber(1).toString()).to.be.equal('1');
    });

    it('valueOf', () => {
      expect(new ValueNumber(1).valueOf()).to.be.equal(1);
    });

    it('toPlainObject', () => {
      expect(new ValueNumber(2).toPlainObject()).to.be.equal(2);
    });

    describe('transformer', () => {
      describe('as single instance', () => {
        it('to', () => {
          const transformer = MyValue.transformer();
          expect(transformer.to(new MyValue(1))).to.be.equal(1);
        });
        it('from', () => {
          const transformer = MyValue.transformer();
          const result = transformer.from(1);
          expect(result).to.be.instanceof(MyValue);
          expect(result).to.be.eql(new MyValue(1));
        });
      });
      describe('as array', () => {
        it('to', () => {
          const transformer = MyValue.transformer();
          expect(
            transformer.to([new MyValue(1), new MyValue(2)])
          ).to.have.members([1, 2]);
        });
        it('from', () => {
          const transformer = MyValue.transformer();
          const result = transformer.from([1, 2]);
          expect(result).to.be.an('array');
          expect(result[0]).to.be.eql(new MyValue(1));
          expect(result[1]).to.be.eql(new MyValue(2));
        });
      });
    });
  });

  describe('validation', () => {
    afterEach(() => {
      ValueNumber.prototype.removeHook('onValidation', 'first');
      ValueNumber.prototype.removeHook('onValidation', 'second');
    });

    it('throws UnmatchedTypeError when provide type is not a number', () => {
      expect(() => new ValueNumber('foo' as any)).to.throw(
        UnmatchedTypeError,
        `Expected String("foo") to be a Number`
      );
    });

    it('ensures that errors are only thrown upon enabled validation on kernel', () => {
      kernel.disableValidation();

      expect(() => new ValueNumber('foo' as any)).to.not.throw(Error);
    });

    it('iterates over registered onValidation hooks', () => {
      const firstValidator = sinon.stub();
      const secondValidator = sinon.stub();

      ValueNumber.prototype.registerHook(
        'onValidation',
        'first',
        firstValidator
      );
      ValueNumber.prototype.registerHook(
        'onValidation',
        'second',
        secondValidator
      );

      const value = 1;
      new ValueNumber(value);
      expect(firstValidator).to.be.calledOnce;
      expect(firstValidator).to.be.calledWith(value);
      expect(secondValidator).to.be.calledOnce;
      expect(secondValidator).to.be.calledWith(value);
    });

    it('ensures that error is thrown upon invalid value', () => {
      const firstValidator = sinon.stub();
      const secondValidator = sinon.stub();

      ValueNumber.prototype.registerHook(
        'onValidation',
        'first',
        firstValidator
      );
      ValueNumber.prototype.registerHook(
        'onValidation',
        'second',
        secondValidator
      );
      const error = new Error('invalid-value');
      secondValidator.throws(error);

      expect(() => new ValueNumber(1)).to.throw(error);
    });
  });
});
