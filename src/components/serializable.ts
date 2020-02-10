import { classes } from 'polytype';
import { pick } from 'lodash';
import { VersionableMixin } from '../mixins/versionable-mixin';
import { Struct } from './struct';
import { define } from '../decorators/define';
import { types } from '../types';
import { EjsonableMixin } from '../mixins/ejsonable-mixin';
import { SERIALIZABLE_LIST_PROPS_KEY } from '../constants/metadata-keys';
import { List } from '../domain/list';
import { InvalidListError } from '../domain/domain-errors';

@define('Serializable')
export class Serializable
  extends classes(Struct, EjsonableMixin, VersionableMixin)
  implements types.Ejsonable {
  public schemaVersion?: number;

  /**
   * Creates an instance of Serializable.
   * @param props - Properties of the type required for construction.
   * @remarks
   * Since were dealing with special cases, mixins and limits of TypeScript, we
   * use of "invoking multiple base constructors" from polytype to pass props to Struct's
   * constructor:
   * https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors
   */
  constructor(props: types.Props = {}) {
    super([props]);
  }

  /**
   * Processes properties for Serializable by wrapping each serializable list property with `List` .
   * @param props - Properties of the type required for construction.
   * @returns Processed properties with any registered `onConstruction` hooks and
   * validates them against prop types.
   */
  public processSerializableList(props: types.Props = {}): types.Props {
    const serializablesListProps = Reflect.getMetadata(
      SERIALIZABLE_LIST_PROPS_KEY,
      this.constructor
    );
    for (const [key, serializable] of Object.entries(serializablesListProps)) {
      props[key] = new List(this, key, serializable, props[key] || []);
    }
    return props;
  }

  /**
   * Returns `List` for `Serializable` array.
   * @param listName - Property name of the `Serializable` list on this instance.
   * @return Instance of `List` implementation.
   * @throws {InvalidListError}
   * Thrown if the provided container name does not point to list of supported `Serializables`.
   * @example
   *```ts
   * @define('Employee')
   * class Employee extends Serializable {
   *   id: string;
   * }
   * @define('Company')
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
  public in<T>(listName: string): types.List<T> {
    if (this[listName] === undefined) {
      throw new InvalidListError(this.typeName(), listName);
    }
    return this[listName] as types.List<T>;
  }

  /**
   * Create an `Serializable` from multiple property sources. Have similar api
   * like `Object.assign`.
   * @param sources - One or more source of properties.
   * @returns New instance of `Serializable` with assigned properties.
   * @throws {ValidationError}
   * Thrown if the passed properties does not match entities property types.
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

  /**
   * Enables conversion of serializable lists to `List` instances.
   * @remarks
   * Since using mixins with polytype on extendable classes like: `Serializable`, `Entity`,
   * `EventSourceable`, `ValueObject` will result in loosing all registered hooks on metadata
   * - this ensures that hook can be easily re-applied.
   */
  public static enableSerializableLists(): void {
    this.prototype.registerHook(
      'onConstruction',
      'convert-serializable-list',
      this.prototype.processSerializableList
    );
  }
}
// Enable conversion of serializable list by default
Serializable.enableSerializableLists();
