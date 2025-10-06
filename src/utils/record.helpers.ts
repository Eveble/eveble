import { isPlainObject } from 'lodash';
import { Collection } from 'typend';
import { isClassInstance } from '@eveble/helpers';

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
 * Converts object and all nested records implementing `TypeTrait` to plain object.
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
