import { pick } from 'lodash';
import { derive } from '@traits-ts/core';
import { Type } from '@eveble/core';
import { InstanceOf } from 'typend';
import { Struct } from './struct';
import { types } from '../types';
import { List } from '../domain/list';
import { InvalidListError } from '../domain/domain-errors';
import { EjsonableTrait } from '../traits/ejsonable.trait';
import { VersionableTrait } from '../traits/versionable.trait';

@Type('Serializable')
export class Serializable
  extends derive(EjsonableTrait, VersionableTrait, Struct)
  implements types.Ejsonable
{
  public schemaVersion?: number;

  /**
   * Creates an instance of Serializable.
   * @param props - Properties of the type required for construction.
   */
  constructor(props: types.Props = {}) {
    super(props);
  }

  /**
   * Returns `List` for `Serializable` array.
   * @param listName - Property name of the `Serializable` list on this instance.
   * @return Instance of `List` implementation.
   * @throws {InvalidListError}
   * Thrown if the provided container name does not point to list of supported `Serializables`.
   * @example
   *```ts
   * @Type('Employee')
   * class Employee extends Serializable {
   *   id: string;
   * }
   * @Type('Company')
   * class Company extends Serializable {
   *   employees: Employee[];
   * }
   *
   *  const employees = [
   *   new Employee({ id: 'first' }),
   *   new Employee({ id: 'second' }),
   * ];
   * const company = new Company({ employees });
   * expect(company.in<Employee>('employees')).to.be.instanceof(List);
   * expect(company.in<Employee>('employees')).to.have.length(2);
   * expect(company.in<Employee>('employees')).to.have.members(employees);
   *```
   */
  public in<T extends types.Serializable>(listName: string): types.List<T> {
    if (this[listName] === undefined) {
      throw new InvalidListError(this.typeName(), listName);
    }
    let ListCnstr = this.getPropTypes()[listName];
    if (ListCnstr === undefined) {
      throw new exports.InvalidListError(this.typeName(), listName);
    }

    if (ListCnstr.constructor.name === 'List') {
      ListCnstr = ListCnstr[0];
    }
    if (ListCnstr instanceof InstanceOf) {
      ListCnstr = ListCnstr[0];
    }
    return new List<T>(this, listName, ListCnstr, this[listName]);
  }

  /**
   * Create an `Serializable` from multiple property sources. Have similar api
   * like `Object.assign`.
   * @param sources - One or more source of properties.
   * @returns New instance of `Serializable` with assigned properties.
   * @throws {ValidationError}
   * Thrown if the passed properties does not match serializeble's property types.
   * @example
   *```ts
   * const props1 = {
   *   firstName: 'Jane',
   *   age: 28,
   * };
   * const props2 = {
   *   lastName: 'Doe',
   *   favoriteColor: 'black',
   * };
   * const props3 = {
   *   hobby: 'martial arts',
   * };
   * const person = Person.from(props1, props2, props3);
   * expect(person).to.be.instanceof(Person);
   * expect(person).to.be.eql({
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   * });
   * ```
   */
  public static from(...sources: Record<string, any>[]): any {
    const propTypes = this.getPropTypes();
    const propKeys = Object.keys(propTypes);
    const pickedProps = {};

    for (const source of sources) {
      Object.assign(pickedProps, pick(source, propKeys));
    }
    return new this(pickedProps);
  }
}
