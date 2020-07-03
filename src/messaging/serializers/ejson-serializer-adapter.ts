import { inject, injectable } from '@parisholley/inversify-async';
import { isFunction, partial, isEmpty } from 'lodash';
import { instanceOf } from 'typend';
import {
  TypeNotFoundError,
  TypeExistsError,
  UnregistrableTypeError,
} from '../../core/core-errors';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { isSerializable } from '../../utils/helpers';
import { UnparsableValueError } from '../messaging-errors';
import { TYPE_KEY } from '../../constants/literal-keys';
import { kernel } from '../../core/kernel';

@injectable()
export class EJSONSerializerAdapter implements types.Serializer {
  @inject(BINDINGS.EJSON)
  protected ejson: any;

  protected readonly typeKey: string;

  /**
   * Creates an instance of EJSONSerializerAdapter.
   * @param typeKey - Identifier that will be use to identify custom types on `fromData` and `toData` serialization methods.
   */
  constructor(typeKey: string = TYPE_KEY) {
    this.typeKey = typeKey;
  }

  /**
   * Register a data-type on serializer.
   * @param typeName - Type's name for which mapping will be created.
   * @param type - Type constructor implementing `Serializable` interface for
   * registration. Must contain typeName - a tag for your custom type that
   * must be unique among other data types defined in your project.
   * @param shouldOverride - Flag indicating that type should be overridden if exist.
   * @throws {UnregistrableTypeError}
   * Thrown if type does not implement `Serializable` interface.
   * @throws {TypeExistsError}
   * Thrown if type would overridden on EJSON without explicit call.
   */
  public registerType(
    typeName: types.TypeName,
    type: types.Type,
    shouldOverride = false
  ): void {
    if (!isSerializable(type.prototype)) {
      throw new UnregistrableTypeError(typeName);
    }

    const factory = this.createFactory(type);
    (factory as any).type = type;
    if (this.hasType(typeName)) {
      if (shouldOverride) {
        this.ejson.overrideType(typeName, factory);
      } else {
        throw new TypeExistsError('EJSON', typeName);
      }
    } else {
      this.ejson.addType(typeName, factory);
    }
  }

  /**
   * Creates EJSON factory function.
   * @param type - Type constructor implementing `Serializable` interface.
   * @return Factory function that will be passed to `EJSON.addType`.
   */
  protected createFactory(type: types.Type): Function {
    /**
     * Factory for `EJSON.addType`.
     * @param serializer - Instance of `EJSONSerializerAdapter`.
     * @param TypeCtor - Type constructor implementing `Serializable` interface.
     * @param json -  Result from parsing JSON by EJSON.
     * @return Factory function that will be passed to `EJSON.addType`.
     */
    const construct = function (
      serializer: EJSONSerializerAdapter,
      TypeCtor: types.Type,
      json: Record<string, any>
    ): types.Type {
      const propTypes = isFunction(TypeCtor.getPropTypes)
        ? TypeCtor.getPropTypes()
        : {};

      for (const key of Object.keys(propTypes)) {
        if (json[key]) {
          json[key] = serializer.fromJSONValue(json[key]);
        }
      }
      return new TypeCtor(json);
    };

    return partial(construct, this, type);
  }

  /**
   * Returns factory for type name.
   * @param typeName - Type name for type.
   * @return Factory function for type.
   */
  public getFactory(typeName: types.TypeName): Function & { type: types.Type } {
    return this.ejson.getType(typeName);
  }

  /**
   * Override a data-type on serializer.
   * @param typeName - Type's name for which type will be registered.
   * @param type - Type constructor implementing `Serializable` interface for registration.
   * @param shouldOverride - Flag indicating that handler should be overridden if exist.
   */
  public overrideType(typeName: types.TypeName, type: types.Type): void {
    this.registerType(typeName, type, true);
  }

  /**
   * Evaluates if serializer has registered type by type name.
   * @param typeName - Type name for type.
   * @returns Returns `true` if type is registered, else `false`.
   */
  public hasType(typeName: types.TypeName): boolean {
    return this.ejson.hasType(typeName);
  }

  /**
   * Returns all data-types registered on EJSON.
   * @return Returns object with relation typeName:type.
   */
  public getTypes(): Map<types.TypeName, types.Type> {
    const factoryTypes: Record<types.TypeName, any> = this.ejson.getTypes();
    const mappings = new Map();
    for (const [typeName, factory] of Object.entries(factoryTypes)) {
      mappings.set(typeName, factory.type);
    }
    return mappings;
  }

  /**
   * Returns type for type name.
   * @param typeName - Type name for type.
   * @return Type constructor, else `undefined`;
   */
  public getType(typeName: types.TypeName): types.Type | undefined {
    const factory = this.getFactory(typeName);
    return factory !== undefined ? factory.type : undefined;
  }

  /**
   * Returns type for type name.
   * @param typeName - Type name for type.
   * @return Type constructor, else throws;
   * @throws {TypeNotFoundError}
   * Thrown if type for type name can't be found.
   */
  public getTypeOrThrow(typeName: types.TypeName): types.Type {
    if (!this.hasType(typeName)) {
      throw new TypeNotFoundError('EJSON', typeName);
    }
    return this.getType(typeName);
  }

  /**
   * Returns all types names.
   * @return List of type names of all registered types.
   */
  public getTypesNames(): types.TypeName[] {
    return Array.from(this.getTypes().keys());
  }

  /**
   * Removes data-type by its type name.
   * @param typeName - Type name for type.
   */
  public removeType(typeName: types.TypeName): void {
    this.ejson.removeType(typeName);
  }

  /**
   * Allows to remove all data-types from EJSON.
   */
  public removeTypes(): void {
    this.ejson.removeTypes();
  }

  /**
   * Evaluates if provided instance belongs to one of custom types.
   * @param typeInstance - Instance of a type implementing `Serializable` interface.
   * @returns Returns `true` if instance is of registered type, else `false`.
   */
  public isTypeInstance(typeInstance: types.Serializable): boolean {
    return this.ejson.isCustomType(typeInstance);
  }

  /**
   * Returns type key identifier.
   * @returns Type key identifier as a string.
   */
  public getTypeKey(): string {
    return this.typeKey;
  }

  /**
   * Serializes value into a JSON-compatible value. It preserves all custom
   * fields, however the initial value type is not saved.
   * @param value - JSON-compatible value like object or `Serializable` instance.
   * @returns Serialized value as JSON-compatible object without type name($type) identifers preserved.
   * @remarks
   * Method `toJSONValue` is not returning type serialized in object structure like
   * ```ts
   * {$type: "MyType", $value: {key: "my-string"}}
   * ```
   * Since that would impact `stringify` method that under the hood uses `toJSONValue`.
   * Method `stringify` will produce string that has exact structure like presented above.
   * @example
   *```ts
   * @define('Address')
   * class Address extends Serializable {
   *   city: string;
   *   street: string;
   * }
   *
   * @define('Person')
   * class Person extends Serializable {
   *   firstName: string;
   *   lastName: string;
   *   address: Address;
   * }
   *
   * const person = new Person({
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   address: new Address({
   *     city: 'New York',
   *     street: 'Wall Street',
   *   }),
   * });
   *
   * expect(person.toJSONValue()).to.be.eql({
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   address: {
   *     city: 'New York',
   *     street: 'Wall Street',
   *   },
   * });
   *```
   * @example
   *```ts
   * const date = new Date();
   * const obj = {
   *   $date: date,
   * };
   *
   * expect(
   *   serializer.toJSONValue(obj)
   * ).to.be.eql({ $date: date.toJSON() });
   *```
   */
  toJSONValue(value: any): any {
    const propTypes = isFunction(value.getPropTypes)
      ? value.getPropTypes()
      : {};
    if (isEmpty(propTypes)) {
      // No special prop types, simply parse value to create deep copy
      return JSON.parse(JSON.stringify(value));
    }
    // Prop types are defined, parse them through EJSON to support nested types
    const serialized = {};
    for (const key in propTypes) {
      if (value[key] !== undefined) {
        serialized[key] = this.ejson.toJSONValue(value[key]);
      }
    }
    return serialized;
  }

  /**
   * Deserializes an EJSON value from its plain JSON representation.
   * @param value - A value to deserialize into EJSON.
   * @return Deserialized EJSON value.
   * @throws {TypeNotFoundError}
   * Thrown if the value contains a serialized type that is not supported.
   * @example
   *```ts
   * @define('Address')
   * class Address extends Serializable {
   *   city: string;
   *   street: string;
   * }
   *
   * @define('Person')
   * class Person extends Serializable {
   *   firstName: string;
   *   lastName: string;
   *   address: Address;
   * }
   *
   * const json = {
   *   $type: 'Person',
   *   $value: {
   *     firstName: 'Jane',
   *     lastName: 'Doe',
   *     address: {
   *       $type: 'Address',
   *       $value: {
   *         city: 'New York',
   *         street: 'Wall Street',
   *       },
   *     },
   *   },
   * };
   * const person = serializer.fromJSONValue(json);
   * expect(person).to.be.instanceof(Person);
   * expect(person).to.be.eql(
   *   new Person({
   *     firstName: 'Jane',
   *     lastName: 'Doe',
   *     address: new Address({
   *       city: 'New York',
   *       street: 'Wall Street',
   *     }),
   *   })
   * );
   *```
   * @example
   *```ts
   * const date = new Date('December 17, 1995 03:24:00');
   * const obj = {
   *   $date: date,
   * };
   *
   * const json = serializer.toJSONValue(obj);
   * expect(serializer.fromJSONValue(json)).to.be.eql(date);
   *```
   */
  public fromJSONValue(
    value: Record<string, any>
  ): Record<string, any> | types.Serializable {
    try {
      return this.ejson.fromJSONValue(value);
    } catch (e) {
      const regexp = new RegExp(
        'Custom EJSON type ([a-zA-Z0-9-.]+) is not defined'
      );
      const typeName = e.message.match(regexp)[1];
      throw new TypeNotFoundError('EJSON', typeName);
    }
  }

  /**
   * Serialize a value to a string with value's initial type preserved.
   * @param value - A value or `Serializable` instance to stringify.
   * @param options - Optional serialization options.
   * @param options.indent - Indents objects and arrays for easy readability.
   * When `true`, indents by 2 spaces; when an integer, indents by that number
   * of spaces; and when a string, uses the string as the indentation pattern.
   * @param options.canonical - When `true`, stringifies keys in an
   * object in sorted order.
   * @return Stringified value.
   * @example
   *```ts
   * @define('Address')
   * class Address extends Serializable {
   *   city: string;
   *   street: string;
   * }
   *
   * @define('Person')
   * class Person extends Serializable {
   *   firstName: string;
   *   lastName: string;
   *   address: Address;
   * }
   *
   * const person = new Person({
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   address: new Address({
   *     city: 'New York',
   *     street: 'Wall Street',
   *   }),
   * });
   *
   * expect(serializer.stringify(person)).to.be.equal(
   *   '{"$type":"Person","$value":{"firstName":"Jane","lastName":"Doe","address":{"$type":"Address","$value":{"city":"New York","street":"Wall Street"}}}}'
   * );
   *```
   */
  public stringify(
    value: any,
    options?: { indent: boolean | number; canonical: boolean }
  ): string {
    return this.ejson.stringify(value, options);
  }

  /**
   * Parse a string into an EJSON value.
   * @param str - A string to parse into an EJSON value.
   * @returns Parsed value to type or `Serializable` instance.
   * @throws {UnparsableValueError}
   * Thrown if the argument is not a valid EJSON.
   * @example
   *```ts
   * @define('Address')
   * class Address extends Serializable {
   *   city: string;
   *   street: string;
   * }
   *
   * @define('Person')
   * class Person extends Serializable {
   *   firstName: string;
   *   lastName: string;
   *   address: Address;
   * }
   *
   * const string =
   * '{"$type":"Person","$value":{"firstName":"Jane","lastName":"Doe","address":{"$type":"Address","$value":{"city":"New York","street":"Wall Street"}}}}';
   *
   * const ejsonValue = serializer.parse(string);
   * expect(ejsonValue).to.be.instanceof(Person);
   * expect(ejsonValue).to.be.eql(
   *   new Person({
   *     firstName: 'Jane',
   *     lastName: 'Doe',
   *     address: new Address({
   *       city: 'New York',
   *       street: 'Wall Street',
   *     }),
   *   })
   * );
   *```
   */
  public parse(str: string): any {
    try {
      return this.ejson.parse(str);
    } catch (e) {
      throw new UnparsableValueError(str);
    }
  }

  /**
   * Return a deep copy of value.
   * @param value - A value to copy.
   * @returns Cloned value without any reference
   * @example
   *```ts
   * @define('Address')
   * class Address extends Serializable {
   *   city: string;
   *   street: string;
   * }
   *
   * @define('Person')
   * class Person extends Serializable {
   *   firstName: string;
   *   lastName: string;
   *   address: Address;
   * }
   *
   * const address = new Address({
   *   city: 'New York',
   *   street: 'Wall Street',
   * });
   * const person = new Person({
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   address,
   * });
   *
   * const clonedPerson = serializer.clone<Person>(person);
   * expect(clonedPerson).to.be.instanceof(Person);
   * expect(clonedPerson).to.be.eql(person);
   * expect(clonedPerson).to.not.be.equal(person);
   * expect(clonedPerson.address).to.not.be.equal(address);
   *```
   */
  public clone<T>(value: T): T {
    return this.ejson.clone(value);
  }

  /**
   * Return true if `a` and `b` are equal to each other. Return false otherwise.
   * Uses the `equals` method on `a` if present, otherwise performs a deep comparison.
   * @param a - Base value.
   * @param b - Other value.
   * @param options - Additional compering options.
   * @param options.keyOrderSensitive - Compare in key sensitive order,
   * if supported by the JavaScript implementation.  For example, `{a: 1, b: 2}`
   * is equal to `{b: 2, a: 1}` only when `keyOrderSensitive` is `false`.
   * @example
   *```ts
   * @define('Car')
   * class Car extends Serializable {
   *   brand: string;
   * }
   *
   * const carA = new Car({
   *   brand: 'Audi',
   * });
   * const carB = new Car({
   *   brand: 'Audi',
   * });
   *
   * expect(serializer.equals(carA, carB)).to.be.true;
   *```
   * @example
   *```ts
   * @define('Car')
   * class Car extends Serializable {
   *   brand: string;
   * }
   *
   * const carA = new Car({
   *   brand: 'Audi',
   * });
   * const carB = new Car({
   *   brand: 'BMW',
   * });
   *
   * expect(serializer.equals(carA, carB)).to.be.false;
   *```
   */
  public equals(
    a: any,
    b: any,
    options?: { keyOrderSensitive: boolean }
  ): boolean {
    return this.ejson.equals(a, b, options);
  }

  /**
   * Converts `Serializable` to plain-object data.
   * @param serializable - `Serializable` instance.
   * @returns Converted `Serializable` to plain-object data.
   * @throws {UnregistrableTypeError}
   * Thrown if provided argument is not a type implementing `Serializable` interface.
   * @example
   *```ts
   * @define('Car')
   * class Car extends Serializable {
   *   brand: string;
   * }
   *
   * const car = new Car({
   *   brand: 'Bentley',
   * });
   * expect(serializer.toData(car)).to.be.eql({
   *   _type: 'Car',
   *   brand: 'Bentley',
   * });
   *```
   */
  public toData(serializable: types.Serializable): Record<string, any> {
    if (!isSerializable(serializable)) {
      throw new UnregistrableTypeError(kernel.describer.describe(serializable));
    }

    const data: Record<string, any> = {
      [this.getTypeKey()]: serializable.getTypeName(),
    };

    for (const key of Object.keys(serializable.getPropTypes())) {
      if (serializable[key] === undefined) continue;

      const value = serializable[key];
      if (Array.isArray(value)) {
        // This is an array of sub values / Serializable
        data[key] = value.map((item) => {
          return instanceOf<types.Serializable>(item)
            ? this.toData(item)
            : item;
        });
      } else if (instanceOf<types.Serializable>(value)) {
        // This is another type
        data[key] = this.toData(value);
      } else {
        data[key] = value;
      }
    }
    return data;
  }

  /**
   * Converts record-compatible argument to plain-object data.
   * @param data - Data as an object.
   * @returns Converted data to `Serializable` instance.
   * @example
   *```ts
   * @define('Car')
   * class Car extends Serializable {
   *   brand: string;
   * }
   *
   * const data = {
   *   _type: 'Car',
   *   brand: 'Bentley',
   * };
   *
   * const typeInstance = serializer.fromData(data);
   * expect(typeInstance).to.be.instanceof(Car);
   * expect(typeInstance).to.be.eql(
   *   new Car({
   *     brand: 'Bentley',
   *   })
   * );
   *```
   */
  public fromData<T extends types.Serializable>(data: Record<string, any>): T {
    const props = {};
    const Type = this.getType(data[this.getTypeKey()]);

    for (const key of Object.keys(Type.getPropTypes())) {
      if (data[key] === undefined) continue;

      const value = data[key];
      if (value !== undefined && value[this.getTypeKey()] !== undefined) {
        // This is a sub-serializable
        props[key] = this.fromData(data[key]);
      } else if (Array.isArray(value)) {
        // This is an array of values / sub-serializables
        props[key] = value.map((item) => {
          if (item[this.getTypeKey()] !== undefined) {
            return this.fromData(item);
          }
          return item;
        });
      } else {
        props[key] = value;
      }
    }
    return new Type(props);
  }
}
