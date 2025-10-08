import { derive } from '@traits-ts/core';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import {
  StandardExistError,
  StandardizedTrait,
  UnsupportedStandardError,
} from '../../../src/domain/type-helpers/traits/standardized.trait';
import { types } from '../../../src/types';
import { ValueObject } from '../../../src/domain/value-object';

chai.use(sinonChai);

describe('StandardizedTrait', () => {
  const standardId = 'my-standard';
  const otherStandardId = 'other-standard';
  let standard: any;
  let otherStandard: any;
  let MyStandardizedVO: any;
  const code = 'my-code';

  beforeEach(() => {
    standard = stubInterface<types.Standard<string>>();
    otherStandard = stubInterface<types.Standard<string>>();

    standard.getId.returns(standardId);
    otherStandard.getId.returns(otherStandardId);

    MyStandardizedVO = class MyVO extends (
      derive(StandardizedTrait, ValueObject)
    ) {};
  });

  describe('registration', () => {
    it('registers new standard', () => {
      expect(MyStandardizedVO.hasStandard(standardId)).to.be.false;
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).to.be.true;
    });

    it('throws StandardAlreadyExists if standard with same identifier exists', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(() => MyStandardizedVO.registerStandard(standard)).to.throw(
        StandardExistError,
        `MyVO: standard with id 'my-standard' already exists`
      );
    });

    it('allows for explicit override already existing standard', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).to.be.true;
      expect(() =>
        MyStandardizedVO.registerStandard(standard, true)
      ).to.not.throw(StandardExistError);
    });

    it('overrides already registered standard', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).to.be.true;
      expect(() => MyStandardizedVO.overrideStandard(standard)).to.not.throw(
        StandardExistError
      );
    });
  });

  describe('evaluation', () => {
    it('returns true if standard with identifier is registered', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).to.be.true;
    });
    it('returns false if standard with identifier is not registered', () => {
      expect(MyStandardizedVO.hasStandard(standardId)).to.be.false;
    });
  });

  describe('mutators', () => {
    it('removes standard by identifier', () => {
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.hasStandard(standardId)).to.be.true;
      MyStandardizedVO.removeStandard(standardId);
      expect(MyStandardizedVO.hasStandard(standardId)).to.be.false;
    });
  });

  describe('accessors', () => {
    it('returns all available standards', () => {
      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);
      expect(MyStandardizedVO.getStandards()).to.have.members([
        standard,
        otherStandard,
      ]);
    });

    it('returns standard by identifier', () => {
      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);
      expect(MyStandardizedVO.getStandard(otherStandardId)).to.be.equal(
        otherStandard
      );
    });

    it('returns undefined if standard with identifier does not exist', () => {
      expect(MyStandardizedVO.getStandard(standardId)).to.be.equal(undefined);
    });

    describe('codes ', () => {
      it('returns all codes in standard', () => {
        const codes = ['code1', 'code2'];
        standard.getCodes = sinon.stub();
        (standard as any).getCodes.returns(codes);

        MyStandardizedVO.registerStandard(standard);
        expect(MyStandardizedVO.getCodes(standardId)).to.be.eql(codes);
      });

      it('throws UnsupportedStandardError if provided standard is not supported', () => {
        expect(() => MyStandardizedVO.getCodes(standardId)).to.throw(
          UnsupportedStandardError,
          `Standard is not supported`
        );
      });
    });
  });

  describe('identification', () => {
    it('identifies code standard', () => {
      standard.isValid.returns(false);
      otherStandard.isValid.returns(true);

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.identifyStandard(code)).to.be.equal(
        otherStandard
      );
      expect(standard.isValid).to.be.calledOnce;
      expect(standard.isValid).to.be.calledWithExactly(code);
      expect(otherStandard.isValid).to.be.calledOnce;
      expect(otherStandard.isValid).to.be.calledWithExactly(code);
    });

    it(`returns undefined if code can't be identified`, () => {
      standard.isValid.returns(false);
      otherStandard.isValid.returns(false);

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.identifyStandard(code)).to.be.equal(undefined);
      expect(standard.isValid).to.be.calledOnce;
      expect(standard.isValid).to.be.calledWithExactly(code);
      expect(otherStandard.isValid).to.be.calledOnce;
      expect(otherStandard.isValid).to.be.calledWithExactly(code);
    });

    it('returns true if code is included in standard', () => {
      standard.isIn.withArgs(code).returns(true);
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.isInStandard(code, standardId)).to.be.true;
      expect(standard.isIn).to.be.calledOnce;
      expect(standard.isIn).to.be.calledWithExactly(code);
    });

    it('returns false if code is not included in standard', () => {
      standard.isIn.withArgs(code).returns(false);
      MyStandardizedVO.registerStandard(standard);
      expect(MyStandardizedVO.isInStandard(code, standardId)).to.be.false;
      expect(standard.isIn).to.be.calledOnce;
      expect(standard.isIn).to.be.calledWithExactly(code);
    });

    it('throws UnsupportedStandardError if provided standard is not supported', () => {
      expect(() => MyStandardizedVO.isInStandard(code, standardId)).to.throw(
        UnsupportedStandardError,
        `Standard is not supported`
      );
    });
  });

  describe('conversion', () => {
    it('converts code from one standard to another convertible standard', () => {
      const convertedCode = 'my-converted-code';

      standard.isValid.withArgs(code).returns(true);
      otherStandard.isConvertible = true;
      otherStandard.convert.withArgs(code, standard).returns(convertedCode);

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.convert(code, otherStandardId)).to.be.equal(
        convertedCode
      );

      expect(standard.isValid).to.be.calledOnce;
      expect(standard.isValid).to.be.calledWithExactly(code);
      expect(otherStandard.convert).to.be.calledOnce;
      expect(otherStandard.convert).to.be.calledWithExactly(code, standard);
    });

    it('does not convert code to same standard', () => {
      standard.isValid.withArgs(code).returns(true);

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.convert(code, standardId)).to.be.equal(code);
      expect(standard.isValid).to.be.calledOnce;
      expect(standard.isValid).to.be.calledWithExactly(code);
      expect(otherStandard.convert).to.be.not.be.called;
    });

    it('returns undefined if other standard does not support conversion', () => {
      standard.isValid.withArgs(code).returns(true);
      otherStandard.isConvertible = false;

      MyStandardizedVO.registerStandard(standard);
      MyStandardizedVO.registerStandard(otherStandard);

      expect(MyStandardizedVO.convert(code, otherStandardId)).to.be.equal(
        undefined
      );
      expect(standard.isValid).to.be.calledOnce;
      expect(standard.isValid).to.be.calledWithExactly(code);
      expect(otherStandard.convert).to.be.not.be.called;
    });

    it('throws UnsupportedStandardError if provided standard is not supported', () => {
      expect(() => MyStandardizedVO.convert(code, standardId)).to.throw(
        UnsupportedStandardError,
        `Standard is not supported`
      );
    });
  });
});
