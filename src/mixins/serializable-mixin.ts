import { getTypeName } from '@eveble/helpers';
import { kernel } from '@eveble/core';
import { types } from '../types';

export class SerializableMixin {
  /**
   * Returns definable type name.
   * @returns Type name as a string.
   */
  public getTypeName(): types.TypeName {
    return getTypeName(this) as types.TypeName;
  }

  /**
   * Returns definable type name
   * @returns Type name as a string.
   */
  public toString(): types.TypeName {
    return this.getTypeName();
  }

  /**
   * Returns definable type name
   * @returns Type name as a string.
   */
  public static toString(): types.TypeName {
    return this.getTypeName();
  }

  /**
   * Returns definable type name.
   * @returns Type name as a string.
   */
  public static getTypeName(): types.TypeName {
    return getTypeName(this) as types.TypeName;
  }

  /**
   * Serializes value into a JSON-compatible value. It preserves all custom
   * field types, however the initial value type is not saved.
   * @returns Normalized value as JSON-compatible without type identifers.
   * @example
   *```ts
   * @Type('Address')
   * class Address extends Serializable {
   *   city: string;
   *
   *   street: string;
   * }
   *
   * @Type('Person')
   * class Person extends Serializable {
   *   firstName: string;
   *
   *   lastName: string;
   *
   *   address?: Address;
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
   */
  public toJSONValue(): Record<string, any> {
    return kernel.serializer?.toJSONValue(this);
  }
}
