import chai, { expect } from 'chai';
import { instanceOf, PropTypes } from 'typend';
import sinonChai from 'sinon-chai';
import { define } from '@eveble/core';
import { Serializable } from '../../../src/components/serializable';
import { Struct } from '../../../src/components/struct';
import { VersionableMixin } from '../../../src/mixins/versionable-mixin';
import { types } from '../../../src/types';
import { isDefinable } from '../../../src/utils/helpers';
import { SerializableMixin } from '../../../src/mixins/serializable-mixin';
import { EjsonableMixin } from '../../../src/mixins/ejsonable-mixin';
import { List } from '../../../src/domain/list';
import { InvalidListError } from '../../../src/domain/domain-errors';

chai.use(sinonChai);

describe('Serializable', () => {
  @define('Person', { isRegistrable: false })
  class Person extends Serializable {
    firstName: string;

    lastName: string;
  }

  @define('Employee', { isRegistrable: false })
  class Employee extends Serializable {
    id: string;
  }

  @define('Company', { isRegistrable: false })
  class Company extends Serializable {
    employees: Employee[];
  }

  it(`extends Struct`, () => {
    expect(Serializable.prototype).to.instanceof(Struct);
  });

  it('implements Versionable interface', () => {
    expect(Serializable.prototype).to.instanceof(VersionableMixin);
    expect(instanceOf<types.Versionable>(Serializable.prototype)).to.be.true;
  });

  it('implements Serializable interface', () => {
    expect(Serializable.prototype).to.instanceof(SerializableMixin);
    expect(instanceOf<types.Serializable>(Serializable.prototype)).to.be.true;
  });

  it('implements Ejesonable interface', () => {
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

    it('processes lists with serializables to List instances', () => {
      const employees = [
        new Employee({ id: 'first' }),
        new Employee({ id: 'second' }),
      ];
      const company = new Company({ employees });
      expect(company.employees).to.be.instanceof(List);
      expect(company.employees).to.have.length(2);
      expect(company.employees).to.have.members(employees);
    });

    describe('static constructor', () => {
      it('constructs from properties picked from source', () => {
        const props = {
          firstName: 'Jane',
          lastName: 'Doe',
          age: 28,
        };
        const person = Person.from(props);
        expect(person).to.be.instanceof(Person);
        expect(person).to.be.eql({
          firstName: 'Jane',
          lastName: 'Doe',
        });
        expect(person.age).to.be.undefined;
      });

      it('constructs from properties picked from multiple source', () => {
        const props1 = {
          firstName: 'Jane',
          age: 28,
        };
        const props2 = {
          lastName: 'Doe',
          favoriteColor: 'black',
        };
        const props3 = {
          hobby: 'martial arts',
        };
        const person = Person.from(props1, props2, props3);
        expect(person).to.be.instanceof(Person);
        expect(person).to.be.eql({
          firstName: 'Jane',
          lastName: 'Doe',
        });
      });
    });
  });

  describe('prop types', () => {
    it('takes optional schemaVersion property as a number', () => {
      expect(Serializable.getPropTypes()).to.be.eql({
        schemaVersion: PropTypes.instanceOf(Number).isOptional,
      });
    });
  });

  describe('hooks', () => {
    it('has convert-serializable-list hook applied', () => {
      expect(
        Serializable.prototype.hasHook(
          'onConstruction',
          'convert-serializable-list'
        )
      ).to.be.true;
    });
  });

  describe('accessors', () => {
    describe('in - serializable lists', () => {
      it('returns serializable list by its property key', () => {
        const employees = [
          new Employee({ id: 'first' }),
          new Employee({ id: 'second' }),
        ];
        const company = new Company({ employees });
        expect(company.in<Employee>('employees')).to.be.instanceof(List);
        expect(company.in<Employee>('employees')).to.have.length(2);
        expect(company.in<Employee>('employees')).to.have.members(employees);
      });

      it('throws InvalidListError upon accessing non-list property', () => {
        const company = new Company({ employees: [] });
        expect(() => company.in<Person>('not-existing-person-list')).to.throw(
          InvalidListError,
          `Company: list 'not-existing-person-list' is not a serializable list property type`
        );
      });
    });
  });
});
