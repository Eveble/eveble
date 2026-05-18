import { expect, describe, it } from 'vitest';

import { instanceOf, PropTypes } from 'typend';

import { Type } from '@eveble/core';
import { derived } from '@traits-ts/core';
import { VersionableTrait } from '../../../src/traits/versionable.trait';
import { types } from '../../../src/types';
import { isTyped } from '../../../src/utils/helpers';
import { EjsonableTrait } from '../../../src/traits/ejsonable.trait';
import { List } from '../../../src/domain/list';
import { InvalidListError } from '../../../src/domain/domain-errors';
import { Serializable } from '../../../src/components/serializable';
import { Struct } from '../../../src/components/struct';
import { SerializableTrait } from '../../../src/traits/serializable.trait';

describe('Serializable', () => {
  @Type('Person', { isRegistrable: false })
  class Person extends Serializable {
    firstName: string;

    lastName: string;
  }

  @Type('Employee', { isRegistrable: false })
  class Employee extends Serializable {
    id: string;
  }

  @Type('Company', { isRegistrable: false })
  class Company extends Serializable {
    employees: Employee[];
  }

  it(`extends Struct`, () => {
    expect(Serializable.prototype).to.instanceof(Struct);
  });

  it('implements Versionable interface', () => {
    expect(derived(Serializable.prototype, VersionableTrait)).toBe(true);
    expect(instanceOf<types.Versionable>(Serializable.prototype)).toBe(true);
  });

  it('implements Serializable interface', () => {
    expect(derived(Serializable.prototype, SerializableTrait)).toBe(true);
    expect(instanceOf<types.Serializable>(Serializable.prototype)).toBe(true);
  });

  it('implements Ejesonable interface', () => {
    expect(derived(Serializable.prototype, EjsonableTrait)).toBe(true);
    expect(instanceOf<types.Ejsonable>(Serializable.prototype)).toBe(true);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(Serializable.prototype)).toBe(true);
  });

  it('defines the type name correctly', () => {
    expect(Serializable.getTypeName()).toBe('Serializable');
    expect(Serializable.prototype.getTypeName()).toBe('Serializable');
  });

  describe('construction', () => {
    it(`ensures that Struct's constructor is properly invoked with properties`, () => {
      const props = {
        firstName: 'Jane',
        lastName: 'Doe',
      };
      const person = new Person(props);
      expect(person).toEqual(props);
    });

    describe('static constructor', () => {
      it('constructs from properties picked from source', () => {
        const props = {
          firstName: 'Jane',
          lastName: 'Doe',
          age: 28,
        };
        const person = Person.from(props);
        expect(person).toBeInstanceOf(Person);
        expect(person).toEqual({
          firstName: 'Jane',
          lastName: 'Doe',
        });
        expect(person.age).toBeUndefined();
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
        expect(person).toBeInstanceOf(Person);
        expect(person).toEqual({
          firstName: 'Jane',
          lastName: 'Doe',
        });
      });
    });
  });

  describe('prop types', () => {
    it('takes optional schemaVersion property as a number', () => {
      expect(Serializable.getPropTypes()).toEqual({
        schemaVersion: PropTypes.instanceOf(Number).isOptional,
      });
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
        const employeesList = company.in<Employee>('employees');
        expect(employeesList).toBeInstanceOf(List);
        expect(employeesList).toHaveLength(2);
        expect(employeesList).toEqual(expect.arrayContaining(employees);
      });

      it('throws InvalidListError upon accessing non-list property', () => {
        const company = new Company({ employees: [] });
        expect(() => company.in<Person>('not-existing-person-list')).toThrow(
          InvalidListError,
          `Company: list 'not-existing-person-list' is not a serializable list property type`
        );
      });
    });
  });
});

