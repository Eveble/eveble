import { expect } from 'chai';
import { Type } from '@eveble/core';
import { DomainError } from '../../../src/domain/domain-error';
import { SerializableError } from '../../../src/components/serializable-error';
import { isDefinable } from '../../../src/utils/helpers';

describe('DomainError', () => {
  @Type()
  class MyDomainError extends DomainError {}

  it(`extends SerializableError`, () => {
    expect(DomainError.prototype).to.be.instanceof(SerializableError);
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(DomainError.prototype)).to.be.true;
  });

  it('defines its serializable type name correctly', () => {
    expect(DomainError.getTypeName()).to.equal('DomainError');
    expect(new MyDomainError('my-error').getTypeName()).to.equal(
      'MyDomainError'
    );
  });
});
