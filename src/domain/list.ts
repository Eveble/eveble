import { isFunction, pull, last } from 'lodash';
import getenv from 'getenv';
import { kernel } from '@eveble/core';
import { types } from '../types';
import {
  ElementAlreadyExistsError,
  ElementNotFoundError,
  IdentifiableAlreadyExistsError,
} from './domain-errors';
import {
  SOURCE_KEY,
  LIST_KEY,
  SERIALIZABLE_TYPE_KEY,
} from '../constants/literal-keys';

export class List<T extends types.Serializable> extends Array {
  protected [SOURCE_KEY]: types.Serializable;

  protected [LIST_KEY]: string;

  protected [SERIALIZABLE_TYPE_KEY]: T;

  /**
   * Creates an instance of `List` that behaves like instance of `Array`.
   * @param source - Source `Serializable`, from which list is referenced.
   * @param listKey - Property key under which list is assigned on source.
   * @param serializableType - `Serializable` type constructor for which list is dedicated for.
   */
  constructor(
    source: types.Serializable,
    listKey: string,
    serializableType: types.Type,
    serializables: any[]
  ) {
    // Fix for issue related to how splice&push works in JS(removeBy, removeById)
    // and done tests with chai's expect(...).to.have.members(...)
    if (typeof source === 'number') {
      super(source as any);
    } else {
      super();
      Object.defineProperty(this, SOURCE_KEY, {
        enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
        value: source,
      });
      Object.defineProperty(this, LIST_KEY, {
        enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
        value: listKey,
      });
      Object.defineProperty(this, SERIALIZABLE_TYPE_KEY, {
        enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
        value: serializableType,
      });
      if (Array.isArray(serializables)) {
        this.push(...serializables);
      }
    }
  }

  /**
   * Converts list to array with plain objects.
   * @returns Array with items converted to plain object.
   */
  public toPlainObject(): any[] {
    return this.map((value: any) => {
      if (typeof value?.toPlainObject === 'function') {
        return value.toPlainObject();
      }
      return value.valueOf();
    });
  }

  /**
   * Creates `Serializable` from multiple data sources and adds it to list.
   * @param sources - Source(s) of properties(like Object.assign).
   * @returns Instance of newly created and added `Serializable`.
   * @throws {ValidationError}
   * Thrown if the properties does not match property types on `Serializable`.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   *
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * source.in<Item>('items').create({
   *   name: 'my-item-name',
   * });
   * expect(source.items[0]).to.be.instanceof(Item);
   * expect(source.items[0]).to.be.be.eql(
   *   new Item({
   *     name: 'my-item-name',
   *   })
   * );
   *```
   */
  public create(...sources: Record<string, any>[]): T {
    const element = (this[SERIALIZABLE_TYPE_KEY] as any).from(...sources);
    this.add(element);
    return element;
  }

  /**
   * Adds already instantiated `Serializable` to list.
   * @param element - `Serializable` instance matching type for which list is dedicated.
   * @throws {ValidationError}
   * Thrown if the `Serializable` is not matching list's `Serializable` type.
   * @throws {IdentifiableAlreadyExistsError}
   * Thrown if the `Identifiable` with same identifier already exists on list.
   * @throws {ElementAlreadyExistError}
   * Thrown if the same `Serializable` already exists on list(use `List.prototype.push` instead).
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const element = new Item({ name: 'my-item-name' });
   *
   * source.in<Item>('items').add(element);
   * expect(source.items[0]).to.be.instanceof(Item);
   * expect(source.items[0]).to.be.eql(
   *   new Item({
   *     name: 'my-item-name',
   *   })
   * );
   *```
   */
  public add(element: T): void {
    kernel.validator.validate(element, this[SERIALIZABLE_TYPE_KEY]);

    if (typeof (element as any).getId === 'function') {
      const identifiable = element as any as types.Identifiable;
      if (this.hasById(identifiable.getId())) {
        throw new IdentifiableAlreadyExistsError({
          sourceName: this[SOURCE_KEY].getTypeName(),
          sourceId: this.getSourceIdAsString(),
          listKey: this[LIST_KEY],
          identifiableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
          key: 'id',
          value: identifiable.getId().toString(),
        });
      }
    } else if (this.hasSame(element)) {
      throw new ElementAlreadyExistsError({
        sourceName: this[SOURCE_KEY].getTypeName(),
        sourceId: this.getSourceIdAsString(),
        listKey: this[LIST_KEY],
        serializableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
        // Element is added as property to error for further reference
        element,
      });
    }
    this.push(element);
  }

  /**
   * Override existing `Serializable` on list by specific key and matching value or adds it to list.
   * @param key - Property name(key) from `Serializable`.
   * @param value - Property value that should be matched.
   * @param element - `Serializable` instance.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const firstElement = new Item({ name: 'my-first-name' });
   * const secondElement = new Item({ name: 'my-second-name' });
   *
   * source.in<Item>('items').add(firstElement);
   * expect(source.items[0]).to.be.equal(firstElement);
   * source
   *   .in<Item>('items')
   *   .overrideBy('name', 'my-first-name', secondElement);
   * expect(source.items[0]).to.be.equal(secondElement);
   *```
   */
  public overrideBy(key: string, value: any, element: T): void {
    const foundSerializable = this.getBy(key, value);

    if (foundSerializable === undefined) {
      this.add(element);
    } else {
      this[this.indexOf(foundSerializable)] = element;
    }
  }

  /**
   * Returns `Serializable` from list by custom key and matching value.
   * @param key - Property name(key) from `Serializable`.
   * @param value - Property value that should be matched.
   * @return Returns `Serializable` instance if found, else `undefined`.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const element = new Item({ name: 'my-item-name' });
   * source.in<Item>('items').add(element);
   * expect(
   *   source.in<Item>('items').getBy('name', 'my-item-name')
   * ).to.be.equal(element);
   *```
   */
  public getBy(key: string, value: any): T | undefined {
    let foundSerializable: T | undefined;
    for (const serializable of this) {
      if (serializable[key] === undefined) {
        continue;
      }
      if (isFunction(serializable[key].equals)) {
        if (serializable[key].equals(value)) {
          foundSerializable = serializable;
        }
      } else if (serializable[key] === value) {
        foundSerializable = serializable;
      }
    }
    return foundSerializable;
  }

  /**
   * Returns `Serializable` from list by custom key and value or throws.
   * @param key - Property name(key) from `Serializable`.
   * @param value - Property value that should be matched.
   * @return Returns `Serializable` instance if found, else throws.
   * @throws {ElementNotFoundError}
   * Thrown if the `Serializable` with key and value can't be matched on list.
   * @example
   */
  public getByOrThrow(key: string, value: any): T {
    const foundSerializable = this.getBy(key, value);
    if (foundSerializable === undefined) {
      throw new ElementNotFoundError({
        sourceName: this[SOURCE_KEY].getTypeName(),
        sourceId: this.getSourceIdAsString(),
        listKey: this[LIST_KEY],
        serializableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
        key,
        value: kernel.describer.describe(value),
      });
    }
    return foundSerializable;
  }

  /**
   * Returns `Serializable` instance from list by its identifier.
   * @param id - Identifier of `Serializable`.
   * @return Returns `Serializable` instance if found, else `undefined`.
   * @example
   *```ts
   * @define('Employee')
   * class Employee extends Serializable implements types.Identifiable {
   *   id: string;
   *
   *   getId(): string {
   *     return this.id;
   *   }
   * }
   *
   * @define('Company')
   * class Company extends Serializable {
   *   id: string;
   *
   *   employees: Employee[];
   * }
   *
   * const source = new Company({ id: 'my-company-id', employees: [] });
   * const element = new Employee({ id: 'my-employee-id' });
   * source.in<Employee>('employees').add(element);
   * expect(
   *   source.in<Employee>('employees').getById('my-employee-id')
   * ).to.be.
   *```
   */
  public getById(id: string | types.Stringifiable): T | undefined {
    return this.getBy('id', id);
  }

  /**
   * Returns `Serializable` from list by its identifier or throws.
   * @param id - Identifier of `Serializable`.
   * @return Returns `Serializable` instance if found, else throws.
   * @throws {ElementNotFoundError}
   * Thrown if the `Serializable` with identifier can't be found on list.
   * @example
   */
  public getByIdOrThrow(id: string | types.Stringifiable): T {
    const foundSerializable = this.getById(id);
    if (foundSerializable === undefined) {
      throw new ElementNotFoundError({
        sourceName: this[SOURCE_KEY].getTypeName(),
        sourceId: this.getSourceIdAsString(),
        listKey: this[LIST_KEY],
        serializableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
        key: 'id',
        value: id.toString(),
      });
    }
    return foundSerializable;
  }

  /**
   * @alias getOrThrow
   */
  public findById(id: string | types.Stringifiable): T {
    return this.getByIdOrThrow(id);
  }

  /**
   * @alias getByOrThrow
   */
  public findBy(key: string, value: any): T {
    return this.getByOrThrow(key, value);
  }

  /**
   * Evaluates if list contains `Serializable` by key and value.
   * @param key - Property name(key) from `Serializable`.
   * @param value - Property value that should be matched.
   * @return Returns `Serializable` instance if found, else `undefined`.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const element = new Item({ name: 'my-first-name' });
   * source.in<Item>('items').add(element);
   * expect(source.in<Item>('items').hasBy('name', 'my-first-name')).to.be
   *   .true;
   *```
   */
  public hasBy(key: string, value: any): boolean {
    return this.getBy(key, value) !== undefined;
  }

  /**
   * Evaluates if list contains same `Serializable` by values.
   * @param element - `Serializable` instance.
   * @returns Returns `true` if `Serializable` exists on list, else `false`.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const element = new Item({ name: 'my-first-name' });
   * source.in<Item>('items').add(element);
   * expect(source.in<Item>('items').hasSame(element)).to.be.true;
   *```
   */
  public hasSame(element: T): boolean {
    return this.some((serializable) => serializable.equals(element));
  }

  /**
   * Evaluates if list contains `Serializable` by its identifier.
   * @param id - `Serializable` identifier.
   * @returns Returns `true` if `Serializable` exists on list, else `false`.
   * @example
   *```ts
   * @define('Employee')
   * class Employee extends Serializable {
   *   id: string;
   *
   *   getId(): string {
   *     return this.id;
   *   }
   * }
   *
   * @define('Company')
   * class Company extends Serializable {
   *   id: string;
   *
   *   employees: Employee[];
   * }
   *
   * const source = new Company({ id: 'my-company-id', employees: [] });
   * const element = new Employee({ id: 'my-first-id' });
   * source.in<Employee>('employees').add(element);
   * expect(source.in<Employee>('employees').hasById('my-first-id')).to.be
   *   .true;
   *```
   */
  public hasById(id: string | types.Stringifiable): boolean {
    return this.getById(id) !== undefined;
  }

  /**
   * Replaces element by identifier.
   * @param id - Identifier of `Serializable`.
   * @param element - `Serializable` instance matching type for which list is dedicated.
   * @example
   *```ts
   * @define('Employee')
   * class Employee extends Serializable {
   *   id: string;
   *
   *   getId(): string {
   *     return this.id;
   *   }
   * }
   *
   * @define('Company')
   * class Company extends Serializable {
   *   id: string;
   *
   *   employees: Employee[];
   * }
   *
   * const source = new Company({ id: 'my-company-id', employees: [] });
   * const element = new Employee({ id: 'my-id' });
   * const updatedElement = new Employee({ id: 'my-id' });
   * source.in<Employee>('employees').add(element);
   * source.in<Employee>('employees').replaceById(
   *  element.id, updatedElement
   * );
   * expect(source.in<Employee>('employees').getById('my-id')).to.be
   *   .equal(updatedElement);
   *```
   */
  public replaceById(id: string | types.Stringifiable, element: T): void {
    const foundSerializable = this.getById(id);
    if (foundSerializable === undefined) {
      this.add(element);
    } else {
      this[this.indexOf(foundSerializable)] = element;
    }
  }

  /**
   * Replaces element by key and value.
   * @param key - Property name(key) from `Serializable`.
   * @param value - Property value that should be matched.
   * @param element - `Serializable` instance matching type for
   * which list is dedicated.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const element = new Item({ name: 'my-item-name' });
   * const updatedElement = new Item({ name: 'my-item-name' });
   * source.in<Item>('items').add(element);
   * source.in<Item>('items').replaceBy(
   *  'name', 'my-item-name', updatedElement
   * );
   * expect(
   *  source.in<Item>('items').getBy('name', 'my-item-name')
   * ).to.be.equal(updatedElement);
   *```
   */
  public replaceBy(key: string, value: any, element: T): void {
    const foundSerializable = this.getBy(key, value);
    if (foundSerializable === undefined) {
      this.add(element);
    } else {
      this[this.indexOf(foundSerializable)] = element;
    }
  }

  /**
   * Removes `Serializable` from list by its identifier.
   * @param id - Identifier of `Serializable`.
   * @example
   *```ts
   * @define('Employee')
   * class Employee extends Serializable {
   *   id: string;
   *
   *   getId(): string {
   *     return this.id;
   *   }
   * }
   *
   * @define('Company')
   * class Company extends Serializable {
   *   id: string;
   *
   *   employees: Employee[];
   * }
   *
   * const source = new Company({ id: 'my-company-id', employees: [] });
   * const element = new Employee({ id: 'my-employee-id' });
   *
   * source.in<Employee>('employees').add(element);
   * expect(source.employees).to.have.length(1);
   * source.in<Employee>('employees').removeById('my-employee-id');
   * expect(source.employees).to.have.length(0);
   *```
   */
  public removeById(id: string | types.Stringifiable): void {
    const foundSerializable = this.getById(id);
    if (foundSerializable !== undefined) {
      pull(this, foundSerializable);
    }
  }

  /**
   * Removes `Serializable` from list by key and value.
   * @param key - Property name(key) from `Serializable`.
   * @param value - Property value that should be matched.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const element = new Item({ name: 'my-item-name' });
   * source.in<Item>('items').add(element);
   * expect(source.items).to.have.length(1);
   * source.in<Item>('items').removeBy('name', 'my-item-name');
   * expect(source.items).to.have.length(0);
   *```
   */
  public removeBy(key: string, value: any): void {
    const foundSerializable = this.getBy(key, value);
    if (foundSerializable !== undefined) {
      pull(this, foundSerializable);
    }
  }

  /**
   * Returns first `Serializable` in list.
   * @return Returns `Serializable` instance.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const firstElement = new Item({ name: 'my-first-name' });
   * const secondElement = new Item({ name: 'my-second-name' });
   * source.in<Item>('items').add(firstElement);
   * source.in<Item>('items').add(secondElement);
   * expect(source.in<Item>('items').first()).to.be.equal(firstElement);
   *```
   */
  public first(): T | undefined {
    return this[0];
  }

  /**
   * Returns last `Serializable` in list.
   * @return Returns `Serializable` instance.
   * @example
   *```ts
   * @define('Item')
   * class Item extends Serializable {
   *   name: string;
   * }
   * @define('Order')
   * class Order extends Serializable {
   *   items: Item[];
   * }
   *
   * const source = new Order({ items: [] });
   * const firstElement = new Item({ name: 'my-first-name' });
   * const secondElement = new Item({ name: 'my-second-name' });
   * source.in<Item>('items').add(firstElement);
   * source.in<Item>('items').add(secondElement);
   * expect(source.in<Item>('items').last()).to.be.equal(secondElement);
   *```
   */
  public last(): T | undefined {
    return last(this);
  }

  /**
   * Returns source's identifer.
   * @returns Return source's identifier as string, else if `Identifiable` interface is not implemented - `undefined`.
   */
  protected getSourceIdAsString(): string | undefined {
    if (typeof (this[SOURCE_KEY] as any).getId === 'function') {
      const identifiable = this[SOURCE_KEY] as any as types.Identifiable;
      return identifiable.getId().toString();
    }
    return undefined;
  }

  /**
   * Gets source for which list is made.
   * @returns Instance of `Serializable`.
   */
  public getSource(): types.Serializable {
    return this[SOURCE_KEY];
  }

  /**
   * Gets property key under which list is created on source.
   * @returns Property key of the list as a string.
   */
  public getListKey(): string {
    return this[LIST_KEY];
  }

  /**
   * Gets serializable type constructor for which this list is being made.
   * @returns `Serializable` type constructor.
   */
  public getSerializableType(): types.Type {
    return this[SERIALIZABLE_TYPE_KEY];
  }
}
