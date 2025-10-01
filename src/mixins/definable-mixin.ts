import { pick, isEqual } from 'lodash';
import { types as typendTypes, Class, getMatchingParentProto } from 'typend';
import { getTypeName } from '@eveble/helpers';
import merge from 'deepmerge';
import { injectable } from '@parisholley/inversify-async';
import deepClone from '@jsbits/deep-clone';
import { kernel } from '@eveble/core';
import { types } from '../types';
import { toPlainObject, isPlainRecord } from '../utils/helpers';
import { DEFAULT_PROPS_KEY } from '../constants/metadata-keys';

@injectable()
export class DefinableMixin implements types.Definable {
  /**
   * Returns class properties types from whole inheritance tree.
   * @returns Plain object representation of properties types.
   * @example
   *```ts
   * @Type()
   * class MyClass extends DefinableMixin {
   *   stringKey: string
   *
   *   constructor(props: Record<keyof any, any>) {
   *     super()
   *     Object.assign(this, props);
   *   }
   * }
   *
   * expect(new MyClass({stringKey: 'my-string'}).getPropTypes()).to.be.eql({
   *   stringKey: PropTypes.instanceOf(String)
   * })
   *```
   */
  public getPropTypes(): types.Props {
    const classPattern: Class = kernel.converter.convert(
      this.constructor as typendTypes.Class
    );
    return classPattern.properties;
  }

  /**
   * Returns default values metadata from property initializers conversion for whole
   * inheritance tree.
   * @returns Default values for properties.
   * @example
   *```ts
   * @Type()
   * class MyClass extends Struct {
   *   stringKey = 'my-string';
   *
   *   numberKey = 1337;
   *
   *   constructor(props: Partial<MyClass>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * expect(new MyClass().getPropertyInitializers()).to.be.eql({
   *   stringKey: 'my-string',
   *   numberKey: 1337
   * })
   * ```
   */
  public getPropertyInitializers(): types.Props {
    const parentInitializers = this.getParentInitializers();
    const instanceInitializers = this.getInstanceInitializers();

    const defaults = merge(parentInitializers, instanceInitializers, {
      isMergeableObject: isPlainRecord,
    });
    return defaults;
  }

  /**
   * Returns default values metadata from property initializers conversion for this instance.
   * @returns Default values for properties.
   */
  protected getInstanceInitializers(): types.Props {
    return Reflect.getMetadata(DEFAULT_PROPS_KEY, this.constructor) || {};
  }

  /**
   * Returns default values metadata from property initializers conversion from parent classes.
   * @returns Default values for properties.
   */
  protected getParentInitializers(): types.Props {
    // Support 'classes' from 'polytype' for multi inheritance(mixin/traits etc.)
    const matcher = (evaluatedProto: types.Prototype): boolean =>
      typeof evaluatedProto.getInstanceInitializers === 'function';
    const parentProto: types.Prototype | undefined = getMatchingParentProto(
      this.constructor.prototype,
      matcher
    );
    if (parentProto === undefined) return {};
    return parentProto.getInstanceInitializers();
  }

  /**
   * Converts properties to plain object.
   * @returns Public properties with assigned values as plain object.
   * @remarks
   * **Loosing object references is required** since in scenarios when properties resolved
   * from `toPlainObject` are transformed - in such changes to the modified plain object
   * will cascade to original instance(**THIS** instance, since properties are **referenced**).
   * @example
   *```ts
   * @Type()
   * class Point extends DefinableMixin {
   *   x: number;
   *   y: number;
   *   z: number;
   * }
   *
   * const point = new Point({x: 1, y: 2, z: 3})
   * expect(point.toPlainObject()).to.be.eql({x: 1, y: 2, z: 3});
   * ```
   */
  public toPlainObject(): types.Props {
    const propsKeys: string[] = Object.keys(this.getPropTypes());
    const plainObj = deepClone(toPlainObject(this));
    return pick(plainObj, propsKeys);
  }

  /**
   * Validates if provided properties matches prop types.
   * @param props - Properties to validate.
   * @param propTypes - Properties types.
   * @param isStrict - Flag indicating that validation should be done in strict mode.
   * @returns Returns `true` if properties are valid, else throws.
   * @throws {ValidationError}
   * Thrown if the passed properties do not match prop types.
   * @remarks
   * Disabling of runtime validation is possible via Kernel's configuration(and by
   * that env flags also) or by annotating class with `@validable(false)`.
   *
   * This is useful when there is external layer(like transportation) that does all
   * the heavy lifting of validation and there are no other sources of incoming data beside
   * points that is handled by layer.
   *
   * Use env `EVEBLE_VALIDATION_TYPE` set to `manual` to disable validation on
   * initialization. You ca re-enable it again on your application configuration via
   * path `validation.type` set to `runtime` before staring application.
   * @example
   *```ts
   * @Type()
   * class MyClass extends DefinableMixin {
   *   stringKey: string
   *
   *   constructor(props: Record<keyof any, any>) {
   *     super()
   *     Object.assign(this, props);
   *   }
   * }
   *
   * const instance = new MyClass({stringKey: 'my-string'});
   * expect(
   *   () => instance.validateProps({stringKey: 1337}, this.getPropTypes())
   * ).to.throw(ValidationError)
   *```
   */
  public validateProps(
    props: types.Props = {},
    propTypes: types.PropTypes,
    isStrict = true
  ): boolean {
    if (!kernel.isValidating()) {
      return true;
    }
    try {
      return kernel.validator.validate(props, propTypes, isStrict);
    } catch (error) {
      const { message } = error;
      const typeName: types.TypeName = getTypeName(this) as types.TypeName;
      throw new error.constructor(`${typeName}: ${message}`);
    }
  }

  /**
   * Evaluates if value and value's type of passed other instance are equal to current one.
   * @param  other - Other instance of DefinableMixin.
   * @returns Returns `true` if other instance of DefinableMixin is equal, else `false`.
   * @example
   *```ts
   * class Person extends DefinableMixin {
   *   firstName: string;
   *   lastName: string;
   *   age: number;
   *
   *   constructor(firstName: string, lastName: string, age: number) {
   *     super();
   *     this.firstName = firstName;
   *     this.lastName = lastName;
   *     this.age = age;
   *   }
   * }
   * const firstPerson = new Person('Jane', 'Doe', 28);
   * const secondPerson = new Person('Jane', 'Doe', 28);
   * expect(firstPerson.equals(secondPerson)).to.be.true;
   *```
   * @example
   *```ts
   * const firstPerson = new Person('Jane', 'Doe', 28);
   * const secondPerson = new Person('John', 'Doe', 30);
   * expect(firstPerson.equals(secondPerson)).to.be.false;
   *```
   * @example
   *```ts
   * const firstPerson = new Person('Jane', 'Doe', 28);
   * const secondPerson = {firstName: 'John', lastName: 'Doe', age: 30);
   * expect(firstPerson.equals(secondPerson)).to.be.false;
   *```
   */
  public equals(other: any): boolean {
    return (
      other !== null &&
      other.constructor === this.constructor &&
      this.hasSameValues(other)
    );
  }

  /**
   * Evaluates if values from other instance matches current instance.
   * @param  other - Other instance of DefinableMixin.
   * @returns Returns `true` if other instance of DefinableMixin has same values, else `false`.
   */
  protected hasSameValues(other: types.Definable): boolean {
    let hasSameValues = true;
    for (const key in this.getPropTypes()) {
      if (typeof this[key]?.equals === 'function') {
        if (!this[key].equals(other[key])) {
          hasSameValues = false;
          break;
        }
      } else if (!isEqual(this[key], other[key])) {
        hasSameValues = false;
        break;
      }
    }
    return hasSameValues;
  }

  /**
   * Returns class properties types from whole inheritance tree.
   * @returns Plain object representation of properties types.
   * @example
   *```ts
   * @Type()
   * class MyClass extends DefinableMixin {
   *   stringKey: string
   *
   *   constructor(props: Record<keyof any, any>) {
   *     super()
   *     Object.assign(this, props);
   *   }
   * }
   *
   * expect(MyClass.getPropTypes()).to.be.eql({
   *   stringKey: PropTypes.instanceOf(String)
   * })
   *```
   */
  public static getPropTypes(): types.Props {
    return this.prototype.getPropTypes();
  }

  /**
   * Returns class property initializers for whole inheritance tree.
   * @returns Plain object representation of property initializers.
   * @example
   *```ts
   * @Type()
   * class MyClass extends Struct {
   *   stringKey = 'my-string';
   *
   *   numberKey = 1337;
   *
   *   constructor(props: Partial<MyClass>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * expect(MyClass.getPropertyInitializers()).to.be.eql({
   *   stringKey: 'my-string',
   *   numberKey: 1337
   * })
   * ```
   */
  public static getPropertyInitializers(): types.Props {
    return this.prototype.getPropertyInitializers();
  }
}
