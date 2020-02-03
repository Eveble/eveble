import { isFunction, pull, last } from 'lodash';
import { types } from '../types';
import { kernel } from '../core/kernel';
import {
  ElementAlreadyExistsError,
  ElementNotFoundError,
  IdentifiableAlreadyExistsError,
} from './domain-errors';
import { SOURCE, LIST_KEY, SERIALIZABLE_TYPE } from '../constants/literal-keys';

export class List<T extends types.Serializable> extends Array {
  protected [SOURCE]: types.Serializable;

  protected [LIST_KEY]: string;

  protected [SERIALIZABLE_TYPE]: T;

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
      Object.defineProperty(this, SOURCE, {
        enumerable: false,
        value: source,
      });
      Object.defineProperty(this, LIST_KEY, {
        enumerable: false,
        value: listKey,
      });
      Object.defineProperty(this, SERIALIZABLE_TYPE, {
        enumerable: false,
        value: serializableType,
      });

      this.push(...serializables);
    }
  }

  /**
   * Creates `Serializable` from multiple data sources and adds it to list.
   * @param sources - Source(s) of properties(like Object.assign).
   * @returns Instance of newly created and added `Serializable`.
   * @throws {ValidationError}
   * Thrown if the properties does not match property types on `Serializable`.
   */
  public create(...sources: Record<string, any>[]): T {
    const element = (this[SERIALIZABLE_TYPE] as any).from(...sources);
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
   */
  public add(element: T): void {
    kernel.validator.validate(element, this[SERIALIZABLE_TYPE]);

    if (typeof (element as any).getId === 'function') {
      const identifiable = (element as any) as types.Identifiable;
      if (this.hasById(identifiable.getId())) {
        throw new IdentifiableAlreadyExistsError({
          sourceName: this[SOURCE].getTypeName(),
          sourceId: this.getSourceIdAsString(),
          listKey: this[LIST_KEY],
          identifiableName: this[SERIALIZABLE_TYPE].getTypeName(),
          key: 'id',
          value: identifiable.getId().toString(),
        });
      }
    } else if (this.hasSame(element)) {
      throw new ElementAlreadyExistsError({
        sourceName: this[SOURCE].getTypeName(),
        sourceId: this.getSourceIdAsString(),
        listKey: this[LIST_KEY],
        serializableName: this[SERIALIZABLE_TYPE].getTypeName(),
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
   */
  public getByOrThrow(key: string, value: any): T {
    const foundSerializable = this.getBy(key, value);
    if (foundSerializable === undefined) {
      throw new ElementNotFoundError({
        sourceName: this[SOURCE].getTypeName(),
        sourceId: this.getSourceIdAsString(),
        listKey: this[LIST_KEY],
        serializableName: this[SERIALIZABLE_TYPE].getTypeName(),
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
   */
  public getByIdOrThrow(id: string | types.Stringifiable): T {
    const foundSerializable = this.getById(id);
    if (foundSerializable === undefined) {
      throw new ElementNotFoundError({
        sourceName: this[SOURCE].getTypeName(),
        sourceId: this.getSourceIdAsString(),
        listKey: this[LIST_KEY],
        serializableName: this[SERIALIZABLE_TYPE].getTypeName(),
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
   */
  public hasBy(key: string, value: any): boolean {
    return this.getBy(key, value) !== undefined;
  }

  /**
   * Evaluates if list contains same `Serializable` by values.
   * @param element - `Serializable` instance.
   * @returns Returns `true` if `Serializable` exists on list, else `false`.
   */
  public hasSame(element: T): boolean {
    return this.some(serializable => {
      return serializable.equals(element);
    });
  }

  /**
   * Evaluates if list contains `Serializable` by its identifier.
   * @param id - `Serializable` identifier.
   * @returns Returns `true` if `Serializable` exists on list, else `false`.
   */
  public hasById(id: string | types.Stringifiable): boolean {
    return this.getById(id) !== undefined;
  }

  /**
   * Removes `Serializable` from list by its identifier.
   * @param id - Identifier of `Serializable`.
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
   */
  public first(): T | undefined {
    return this[0];
  }

  /**
   * Returns last `Serializable` in list.
   * @return Returns `Serializable` instance.
   */
  public last(): T | undefined {
    return last(this);
  }

  /**
   * Returns source's identifer.
   * @returns Return source's identifier as string, else if `Identifiable` interface is not implemented - `undefined`.
   */
  protected getSourceIdAsString(): string | undefined {
    if (typeof (this[SOURCE] as any).getId === 'function') {
      const identifiable = (this[SOURCE] as any) as types.Identifiable;
      return identifiable.getId().toString();
    }
    return undefined;
  }

  /**
   * Gets source for which list is made.
   * @returns Instance of `Serializable`.
   */
  public getSource(): types.Serializable {
    return this[SOURCE];
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
    return this[SERIALIZABLE_TYPE];
  }
}
