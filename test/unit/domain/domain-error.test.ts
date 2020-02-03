import { expect } from 'chai';
import { DomainError } from '../../../src/domain/domain-error';
import { SerializableError } from '../../../src/components/serializable-error';

describe('DomainError', function() {
  it(`extends SerializableError`, () => {
    expect(DomainError.prototype).to.be.instanceof(SerializableError);
  });

  it('defines its serializable type name correctly', () => {
    expect(DomainError.getTypeName()).to.equal('DomainError');
    expect(new DomainError('my-error').getTypeName()).to.equal('DomainError');
  });
});
