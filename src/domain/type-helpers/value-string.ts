import util from 'util';
import { derive } from '@traits-ts/core';
import { kernel } from '@eveble/core';
import { ValidableTrait } from './traits/validable.trait';
import { NON_ENUMERABLE_VALUE_KEY } from '../../constants/literal-keys';
import { EjsonableTrait } from '../../traits/ejsonable.trait';
import { HookableTrait } from '../../traits/hookable.trait';
import { types } from '../../types';

export class ValueString extends derive(
  EjsonableTrait,
  HookableTrait,
  ValidableTrait,
  String
) {
  protected [NON_ENUMERABLE_VALUE_KEY]: string;

  constructor(value: string) {
    super(value);
    this.onValidation(value);

    Object.defineProperty(this, NON_ENUMERABLE_VALUE_KEY, {
      value,
      enumerable: false,
    });
  }

  /**
   * Evaluates if value and value's type of passed other instance are equal to current one.
   * @param  other - Other instance of.
   * @returns Returns `true` if other instance of `ValueString` is equal, else `false`.
   */
  public equals(other: any): boolean {
    return (
      other !== null &&
      other.constructor === this.constructor &&
      this.valueOf() === other.valueOf()
    );
  }

  /**
   * Re-implement custom inspection in console.log do to issue with `polytype` `classes` mixin resolving
   * provided string as an Object with key-value pairs as text(so 'bar' becomes {0: "b", 1: "a", 2: "r"})
   * @remarks
   * https://stackoverflow.com/a/41440854/15841272
   *
   */
  [util.inspect.custom as symbol]() {
    return `[${this.constructor.name}: '${this[NON_ENUMERABLE_VALUE_KEY]}']`;
  }

  public toString(): string {
    return this[NON_ENUMERABLE_VALUE_KEY];
  }

  public valueOf(): string {
    return this[NON_ENUMERABLE_VALUE_KEY];
  }

  public toPlainObject(): string {
    return this.valueOf();
  }

  /**
   * On validation hook.
   * @param value - Value as a `string`.
   * @param isStrict - Flag indicating that validation should be done in strict mode.
   * @returns Returns `true` on valid value, else throws.
   * @throws {Error}
   * Thrown if the provided value does not match the validation.
   */
  protected onValidation(value: string, isStrict = true): boolean {
    if (!kernel.isValidating()) {
      return true;
    }

    try {
      kernel.validator.validate(value, String, isStrict);
    } catch (error) {
      const { message } = error;
      const typeName: types.TypeName = this.getTypeName();
      throw new error.constructor(`${typeName}: ${message}`);
    }

    const hooks: types.hooks.Mappings = this.getHooks('onValidation');
    for (const hook of Object.values(hooks)) {
      hook.bind(this)(value);
    }

    return true;
  }

  /**
   * Create an instance of `this`.
   * @param value - Value as a `string`.
   * @returns New instance of `this`.
   */
  public static from(value: string): any {
    return new this(value);
  }

  /**
   * Returns `@Column` transformer for TypeORM.
   */
  public static transformer = function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const Self = this;
    return {
      to: (instance: typeof Self) => {
        if (instance === undefined) {
          return undefined;
        }
        if (Array.isArray(instance)) {
          return instance.map((item) => item.valueOf());
        }
        return instance.valueOf();
      },
      from: (value: string | string[]) => {
        if (Array.isArray(value)) {
          return value.map((item) => new Self(item));
        }
        return new Self(value);
      },
    };
  };
}
