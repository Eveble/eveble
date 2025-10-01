import { expect } from 'chai';
import { ValueObject } from '../../../src/domain/value-object';
import { Serializable } from '../../../src/components/serializable';
import { isTyped } from '../../../src/utils/helpers';

describe(`ValueObject`, () => {
  it(`extends Serializable`, () => {
    expect(ValueObject.prototype).to.be.instanceof(Serializable);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(ValueObject.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(ValueObject.getTypeName()).to.equal('ValueObject');
    expect(ValueObject.prototype.getTypeName()).to.equal('ValueObject');
  });
});
