import chai, { expect } from 'chai';
import { instanceOf, PropTypes } from 'typend';
import sinonChai from 'sinon-chai';
import { Serializable } from '../../../src/components/serializable';
import { Struct } from '../../../src/components/struct';
import { VersionableMixin } from '../../../src/mixins/versionable-mixin';
import { types } from '../../../src/types';
import { define } from '../../../src/decorators/define';
import { isDefinable } from '../../../src/utils/helpers';
import { SerializableMixin } from '../../../src/mixins/serializable-mixin';
import { EjsonableMixin } from '../../../src/mixins/ejsonable-mixin';

chai.use(sinonChai);

describe('Serializable', function() {
  @define('Person', { isRegistrable: false })
  class Person extends Serializable {
    firstName: string;

    lastName: string;
  }

  it(`extends Struct`, () => {
    expect(Serializable.prototype).to.instanceof(Struct);
  });

  it('implements Versionable interface ', () => {
    expect(Serializable.prototype).to.instanceof(VersionableMixin);
    expect(instanceOf<types.Versionable>(Serializable.prototype)).to.be.true;
  });

  it('implements Serializable interface ', () => {
    expect(Serializable.prototype).to.instanceof(SerializableMixin);
    expect(instanceOf<types.Serializable>(Serializable.prototype)).to.be.true;
  });

  it('implements Ejesonable interface ', () => {
    expect(Serializable.prototype).to.instanceof(EjsonableMixin);
    expect(instanceOf<types.Ejsonable>(Serializable.prototype)).to.be.true;
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Serializable.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(Serializable.getTypeName()).to.equal('Serializable');
    expect(Serializable.prototype.getTypeName()).to.equal('Serializable');
  });

  describe('construction', () => {
    it(`ensures that Struct's constructor is properly invoked with properties`, () => {
      const props = {
        firstName: 'Jane',
        lastName: 'Doe',
      };
      const person = new Person(props);
      expect(person).to.be.eql(props);
    });
  });

  describe('prop types', () => {
    it('takes optional schemaVersion property as a number', () => {
      expect(Serializable.getPropTypes()).to.be.eql({
        schemaVersion: PropTypes.instanceOf(Number).isOptional,
      });
    });
  });
});
