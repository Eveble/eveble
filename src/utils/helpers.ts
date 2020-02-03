import { isPlainObject } from 'lodash';
import {
  Collection,
  isDefined,
  instanceOf,
  Optional,
  List,
  InstanceOf,
} from 'typend';
import { METADATA_KEY } from '@parisholley/inversify-async';
import { isClassInstance } from '@eveble/helpers';
import { types } from '../types';

/**
 * Evaluates if provided argument is a `Definable` implementation.
 * @param arg - **Instance** of evaluated argument.
 * @returns Returns `true` if provided argument is implementing `Definable` interface, else `false`.
 */
export function isDefinable(arg: any): boolean {
  if (arg == null) return false;
  return instanceOf<types.Definable>(arg) && isDefined(arg.constructor);
}

/**
 * Evaluates if provided argument is serialziable i.e. at current time implements  `Ejsonable` implementation.
 * @param arg - **Instance** of evaluated argument.
 * @returns Returns `true` if provided argument is implementing `Ejsonable` interface, else `false`.
 */
export function isSerializable(arg: any): boolean {
  if (arg == null) return false;
  return instanceOf<types.Ejsonable>(arg) && isDefined(arg.constructor);
}

/**
 * Evaluates if provided argument is a record.
 * @param arg - Evaluated argument.
 * @returns Returns `true` if argument is an record(literal object, class instance or `Collection` instance), else `false`.
 */
export function isRecord(arg: any): boolean {
  return (
    isPlainObject(arg) || isClassInstance(arg) || arg instanceof Collection
  );
}

/**
 * Evaluates if provided argument is a plain record(plain object or `Collection`).
 * @param arg - Evaluated argument.
 * @returns Returns `true` if argument is an record(literal object or `Collection` instance), else `false`.
 */
export function isPlainRecord(arg: any): boolean {
  return isPlainObject(arg) || arg instanceof Collection;
}

/**
 * Evaluates if `@postConstruct`(from Inversify) annotation is applied to target's method.
 * @param target - **Instance** of evaluated argument.
 * @returns Returns `true` if target's constructor has `@postConstruct` annotation applied, else `false`.
 */
export function hasPostConstruct(target: any): boolean {
  return (
    target != null &&
    Reflect.hasMetadata(METADATA_KEY.POST_CONSTRUCT, target.constructor)
  );
}

/**
 *
 * Converts object and all nested records implementing `DefinableMixin` to plain object.
 * @param arg - Object or instance of a class for conversion.
 * @returns Plain object representation of provided argument.
 */
export function toPlainObject(
  arg: Record<keyof any, any>
): Record<keyof any, any> {
  const plainObj = {};
  for (const key of Reflect.ownKeys(arg)) {
    const value = arg[key.toString()];
    if (typeof value?.toPlainObject === 'function') {
      plainObj[key] = value.toPlainObject();
    } else if (isPlainRecord(value)) {
      plainObj[key] = toPlainObject(value);
    } else {
      plainObj[key] = value;
    }
  }
  return plainObj;
}

/**
 * Converts root-level objects to collection.
 * @param obj - Object that should be converted.
 * @returns Instance of `Collection` pattern with properties from object.
 */
export function convertObjectToCollection(obj): Record<keyof any, any> {
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    if (isPlainObject(value)) {
      converted[key] = new Collection(value as Record<keyof any, any>);
    } else {
      converted[key] = value;
    }
  }
  return converted;
}

/**
 * Resolves `Serializable` from prop type.
 * @param propType - Property type for converted class type.
 * @returns `Serializable` from prop type, else if not present - `undefined`.
 */
export function resolveSerializableFromPropType(
  propType: any
): types.Serializable | undefined {
  if (propType == null) return undefined;

  let type = propType;
  // PropTypes.arrayOf(Serializable).isOptional
  if (type instanceof Optional) {
    type = type[0];
  }

  if (type instanceof List) {
    type = type[0];
  } else {
    // [!] Unwrap only array of Serializables
    return undefined;
  }

  // Unwrap only Serializable from ProtoType.instanceOf(Serializable)
  if (type instanceof InstanceOf) {
    if (
      type[0] != null &&
      type[0].prototype !== undefined &&
      isSerializable(type[0].prototype)
    ) {
      type = type[0];
    } else {
      return undefined;
    }
  }
  return type;
}
