import { expect } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';
import {
  Standard,
  UnconvertibleStandardError,
} from '../../../src/domain/type-helpers/standard';
import { types } from '../../../src/types';
import { UnimplementedError } from '../../../src/domain/domain-errors';

describe('Standard', () => {
  let converter: any;

  class MyStandard extends Standard<string> {
    /**
     * Converts code with identified standard to current standard.
     * @param code - Converted code.
     * @param identifiedStandard - Identified `Standard` instance for code.
     * @returns Returns converted code if possible, else undefined.
     */
    public convert(
      code: string,
      identifiedStandard: types.Standard<string>
    ): string | undefined {
      return converter(code, identifiedStandard);
    }
  }

  beforeEach(() => {
    converter = sinon.stub();
  });

  const id = 'my-standard';

  const isConvertible = true;

  const codes: string[] = ['my-first-code', 'my-second-code'];

  describe('construction', () => {
    it('takes first id argument as a string and second isConvertible as boolean and assigns them', () => {
      const standard = new MyStandard(id, isConvertible);
      expect(standard.id).to.be.equal(id);
      expect(standard.isConvertible).to.be.equal(isConvertible);
    });

    it('takes optional codes as an array with required types and assings them', () => {
      const standard = new MyStandard(id, isConvertible, codes);
      expect(standard.codes).to.be.equal(codes);
    });
  });

  describe('accessors', () => {
    it('getId', () => {
      const standard = new MyStandard(id, isConvertible);
      expect(standard.getId()).to.be.equal(id);
    });

    describe('getCodes', () => {
      it('returns assigned codes during construction', () => {
        const standard = new MyStandard(id, isConvertible, codes);
        expect(standard.getCodes()).to.be.equal(codes);
      });

      it('returns empty array if codes are unavailable', () => {
        const standard = new MyStandard(id, isConvertible);
        expect(standard.getCodes()).to.be.eql([]);
      });
    });
  });

  describe('evaluation', () => {
    describe('isValid', () => {
      it('returns boolean if code is valid', () => {
        const standard = new MyStandard(id, isConvertible, codes);
        expect(standard.isValid('my-first-code')).to.be.true;
      });

      it('throws Error if method is not implemented on standard and codes array is not assigned during construction', () => {
        const standard = new MyStandard(id, isConvertible);
        expect(() => standard.isValid('my-first-code')).to.throw(
          UnimplementedError,
          'Not implemented'
        );
      });
    });

    describe('conversion', () => {
      it('allows to convert code to another standard', () => {
        const code = 'my-first-code';
        const convertedCode = 'converted-code';
        const otherStandard = stubInterface<types.Standard<string>>();
        converter.withArgs(code).returns(convertedCode);

        const standard = new MyStandard(id, isConvertible, codes);
        expect(standard.convert(code, otherStandard)).to.be.equal(
          convertedCode
        );
        expect(converter).to.be.calledOnce;
        expect(converter).to.be.calledWith(code, otherStandard);
      });

      it('throws UnconvertibleStandardError if provided standard does not support conversion', () => {
        const code = 'my-first-code';
        const otherStandard = stubInterface<types.Standard<string>>();
        const standard = new Standard(id, false, codes);
        expect(() => standard.convert(code, otherStandard)).to.throw(
          UnconvertibleStandardError
        );
      });
    });
  });
});
