import util from 'util';
import { getTypeName } from '@eveble/helpers';
import { kernel } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { NON_ENUMERABLE_VALUE_KEY } from '../../constants/literal-keys';
import { types } from '../../types';
import { HookableTrait } from '../../traits/hookable.trait';

export class ValueNumber extends derive(HookableTrait, Number) {
  protected [NON_ENUMERABLE_VALUE_KEY]: number;

  constructor(value: number) {
    super(value);

    this.onValidation(value);

    Object.defineProperties(this, {
      [NON_ENUMERABLE_VALUE_KEY]: {
        value,
        enumerable: false,
      },
      // HookableTrait
      registerHook: {
        enumerable: false,
      },
      overrideHook: {
        enumerable: false,
      },
      getHook: {
        enumerable: false,
      },
      getHookOrThrow: {
        enumerable: false,
      },
      getHooks: {
        enumerable: false,
      },
      getActions: {
        enumerable: false,
      },
      hasHook: {
        enumerable: false,
      },
      hasAction: {
        enumerable: false,
      },
      removeHook: {
        enumerable: false,
      },
    });
  }

  public toString(): string {
    return `${this[NON_ENUMERABLE_VALUE_KEY]}`;
  }

  public valueOf(): number {
    return this[NON_ENUMERABLE_VALUE_KEY];
  }

  public toPlainObject(): number {
    return this.valueOf();
  }

  /**
   * Evaluates if value and value's type of passed other instance are equal to current one.
   * @param  other - Other instance.
   * @returns Returns `true` if other instance of `ValueNumber` is equal, else `false`.
   */
  public equals(other: any): boolean {
    return (
      other !== null &&
      other.constructor === this.constructor &&
      this.valueOf() === other.valueOf()
    );
  }

  /**
   * Reimplement custom inspection in console.log do to issue with `polytype` `classes` mixin resolving
   * provided string as an Object with key-value pairs as text(so 'bar' becomes {0: "b", 1: "a", 2: "r"})
   * @remarks
   * https://stackoverflow.com/a/41440854/15841272
   *
   */
  [util.inspect.custom as symbol]() {
    return `[${this.constructor.name}: ${this}]`;
  }

  /**
   * EjsonableMixin
   */
  /**
   * @alias getTypeName
   * @remarks
   * Compatibility for EJSON serializer: `@eveble/ejson`
   */
  public typeName(): types.TypeName {
    return this.getTypeName();
  }

  /**
   * @alias getTypeName
   * @remarks
   * Compatibility for EJSON serializer: `@eveble/ejson`
   */
  public static typeName(): types.TypeName {
    return this.getTypeName();
  }

  /**
   * SerializableMixin
   */
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
   */
  public toJSONValue(): Record<string, any> {
    return kernel.serializer?.toJSONValue(this);
  }

  /**
   * HookableTrait
   * @remarks
   * Pull methods definitions from HookableTrait.
   * Accessing them via:
   * `ValueString.prototype.registerHook(...)`
   * will be still unavailable, for that we assign below again functions
   * to prototype.
   */
  // registerHook = ValueNumber.prototype.registerHook;

  // overrideHook = ValueNumber.prototype.overrideHook;

  // getHook = ValueNumber.prototype.getHook;

  // getHookOrThrow = ValueNumber.prototype.getHookOrThrow;

  // getHooks = ValueNumber.prototype.getHooks;

  // getActions = ValueNumber.prototype.getActions;

  // hasHook = ValueNumber.prototype.hasHook;

  // hasAction = ValueNumber.prototype.hasAction;

  // removeHook = ValueNumber.prototype.removeHook;

  /**
   * Create an instance of `this`.
   * @param value - Value as a `number`.
   * @returns New instance of `this`.
   */
  public static from(value: number): any {
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
      from: (value: number | number[]) => {
        if (Array.isArray(value)) {
          return value.map((item) => new Self(item));
        }
        return new Self(value);
      },
    };
  };

  /**
   * On validation hook.
   * @param value - Value as a `number`.
   * @param isStrict - Flag indicating that validation should be done in strict mode.
   * @returns Returns `true` on valid value, else throws.
   * @throws {Error}
   * Thrown if the provided value does not match the validation.
   */
  protected onValidation(value: number, isStrict = true): boolean {
    if (!kernel.isValidating()) {
      return true;
    }
    try {
      kernel.validator.validate(value, Number, isStrict);
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
   * ValidableMixin
   */
  /**
   * Sets validator on `ValueObject` in form of `onValidation` hook.
   * @param validator - Function validating ValueObject properties.
   */
  public static setValidator(validator: (...args: any[]) => boolean): void {
    (this.prototype as any).overrideHook(
      'onValidation',
      'validation',
      validator
    );
  }

  /**
   * Returns `ValueObject` validator from `onValidation` hook.
   * @returns Validation `Function` if assigned, else `undefined`.
   */
  public static getValidator(): () => boolean {
    return (this.prototype as any).getHook('onValidation', 'validation');
  }

  /**
   * Removes validation from `onValidation` hook.
   */
  public static removeValidator(): void {
    (this.prototype as any).removeHook('onValidation', 'validation');
  }

  /**
   * Evaluates if validator is assigned to `ValueObject`
   * @returns Returns `true` if validator is assigned, else `false`.
   */
  public static hasValidator(): boolean {
    return (this.prototype as any).hasHook('onValidation', 'validation');
  }
}

// /**
//  * HookableTrait
//  */
// const proto: any = ValueNumber.prototype as any;
// proto.registerHook = ValueNumber.prototype.registerHook;
// proto.overrideHook = ValueNumber.prototype.overrideHook;
// proto.getHook = ValueNumber.prototype.getHook;
// proto.getHookOrThrow = ValueNumber.prototype.getHookOrThrow;
// proto.getHooks = ValueNumber.prototype.getHooks;
// proto.getActions = ValueNumber.prototype.getActions;
// proto.hasHook = ValueNumber.prototype.hasHook;
// proto.hasAction = ValueNumber.prototype.hasAction;
// proto.removeHook = ValueNumber.prototype.removeHook;
