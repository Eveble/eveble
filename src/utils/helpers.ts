import { isPlainObject } from 'lodash';
import { Collection, isDefined, instanceOf } from 'typend';
import { METADATA_KEY } from '@parisholley/inversify-async';
import { isClassInstance } from '@eveble/helpers';
import decache from 'decache';
import dotenv from 'dotenv-extended';
import { types } from '../types';
import { Struct } from '../components/struct';

/**
 * Evaluates if provided argument is a `Definable` implementation.
 * @param arg - **Instance** of evaluated argument.
 * @returns Returns `true` if provided argument is implementing `Definable` interface, else `false`.
 */
export function isDefinable(arg: any): boolean {
  if (arg == null) return false;

  return (
    // TODO: instanceOf from Typend is still not fully reliable atm
    (arg instanceof Struct || instanceOf<types.Definable>(arg)) &&
    isDefined(arg.constructor)
  );
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
 * Creates instance of EJSON.
 * @returns De-cached version of EJSON module.
 * @remarks
 * By default, EJSON module stores types in variable that is not referenced on the EJSON object
 * itself. This creates issue when running tests in watch modes(like Mocha's --watch) since the state of EJSON is cached.
 */
export const createEJSON = function (): any {
  decache('@eveble/ejson');
  // eslint-disable-next-line global-require
  return require('@eveble/ejson');
};

/**
 * Evaluates if provided argument is a `EventSourceable` type constructor implementation.
 * @param arg - **Constructor** of evaluated argument.
 * @returns Returns `true` if provided argument is implementing `EventSourceableType` interface, else `false`.
 */
export function isEventSourceableType(arg: any): boolean {
  if (arg == null) return false;
  return (
    typeof arg.resolveInitializingMessage === 'function' &&
    typeof arg.resolveRoutedCommands === 'function' &&
    typeof arg.resolveRoutedEvents === 'function' &&
    typeof arg.resolveRoutedMessages === 'function' &&
    typeof arg.getTypeName === 'function' &&
    typeof arg.from === 'function'
  );
}

/**
 * Assigns environment variables based on environment.
 * @param envFilePath - Path to env file.
 */
export function loadENV(envFilePath: string): void {
  dotenv.load({
    silent: false,
    defaults: '.env.defaults',
    schema: '.env.schema',
    errorOnMissing: true,
    errorOnExtra: true,
    path: envFilePath,
  });
}
