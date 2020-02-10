import { expect } from 'chai';
import { PropTypes } from 'typend';
import { DomainException } from '../../../src/domain/domain-exception';
import { isDefinable } from '../../../src/utils/helpers';
import { DomainError } from '../../../src/domain/domain-error';
import { Event } from '../../../src/components/event';

describe('DomainException', function() {
  it(`extends Event`, () => {
    expect(DomainException.prototype).to.be.instanceof(Event);
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(DomainException.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(DomainException.getTypeName()).to.equal('DomainException');
    expect(DomainException.prototype.getTypeName()).to.equal('DomainException');
  });

  describe('prop types', () => {
    it('takes required thrower property as a string', () => {
      expect(DomainException.getPropTypes().thrower).to.be.eql(
        PropTypes.instanceOf(String)
      );
    });

    it('takes optional version property as a Number', () => {
      expect(DomainException.getPropTypes().error).to.be.eql(
        PropTypes.instanceOf(DomainError)
      );
    });
  });
});
