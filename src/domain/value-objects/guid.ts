import { isString, isPlainObject } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { ValueObject } from '../value-object';
import { types } from '../../types';
import { kernel } from '../../core/kernel';
import { define } from '../../decorators/define';
import { ValueObjectError } from '../domain-errors';

@define('InvalidGuidValueError')
export class InvalidGuidValueError extends ValueObjectError {
  constructor(got: string) {
    super(`Guid: Expected string as a valid guid, got ${got}`);
  }
}

@define('Guid')
export class Guid extends ValueObject implements types.Stringifiable {
  id: string;

  /**
   * Creates an instance Guid.
   * @param  propsOrVal - Guid value as a string or object containing property id as a string.
   * @throws {InvalidGuidValueError}
   * Thrown if provided id is not a string or is not matching valid uuid v4 pattern.
   */
  constructor(propsOrVal?: { id: string } | string) {
    const props = isPlainObject(propsOrVal)
      ? { id: (propsOrVal as types.Props).id }
      : { id: propsOrVal };

    if (props.id !== undefined) {
      if (!Guid.isValid(props.id)) {
        throw new InvalidGuidValueError(kernel.describer.describe(props.id));
      }
    } else {
      props.id = Guid.generate().toString();
    }

    super(props);
    Object.freeze(this);
  }

  /**
   * Returns id value.
   * @returns Value of the guid as id.
   */
  valueOf(): string {
    return this.id;
  }

  /**
   * Converts Guid to string.
   * @returns Guid converted as a string.
   */
  toString(): string {
    return this.id;
  }

  /**
   * Evaluates if guid is equal to other by comparing their values.
   * @param otherGuid - Other instance of Guid.
   * @returns Returns true if both guid values are equal, else false.
   */
  equals(otherGuid: Guid): boolean {
    return otherGuid instanceof Guid && otherGuid.valueOf() === this.valueOf();
  }

  /**
   * Generates 128-bit UUIDs version 4
   * @return Returns Guid instance with self generated uuid.
   */
  static generate(): Guid {
    return new Guid(uuidv4().toString());
  }

  // Checks valid 128-bit UUIDs version 4
  static pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /**
   * Evaluates if provided guid is matching UUID v4 pattern.
   * @param id - Evaluated identifier for Guid.
   * @returns Returns true if id is a string matching UUID v4 pattern, else false.
   */
  static isValid(id: string): boolean {
    return isString(id) && this.pattern.test(id.toString());
  }
}
