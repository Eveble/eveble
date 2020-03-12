import 'reflect-metadata';
import { setTypeName } from '@eveble/helpers';
import { define, Collection, instanceOf } from 'typend';
import { isString, isEmpty } from 'lodash';
import { Types as tsruntimeTypes } from 'tsruntime';
import { ExtendableError } from '../components/extendable-error';
import { kernel } from '../core/kernel';
import {
  DEFAULT_PROPS_KEY,
  SERIALIZABLE_LIST_PROPS_KEY,
} from '../constants/metadata-keys';
import { types } from '../types';
import { resolveSerializableFromPropType } from '../utils/helpers';

export class InvalidTypeNameError extends ExtendableError {
  constructor(invalidTypeName: any) {
    super(`Expected type name argument to be a String, got ${invalidTypeName}`);
  }
}

/**
 * Ensures that provided type name is valid.
 * @param name - Optional name for the type(otherwise, class constructor name will be used.)
 * @returns Marked class as reflective.
 * @throws {InvalidTypeNameError}
 * Thrown if provided type name is not a string.
 * @example
 * define()
 * class MyType {}
 * define('MyTypeName')
 * class MyType {}
 * define('MyNamespace.MyTypeName')
 * class MyType {}
 */
define.beforeDefine = function(
  _target: any,
  _reflectedType: tsruntimeTypes.ReflectedType,
  ...args: any[]
): void {
  const name = args[0];
  if (name !== undefined && !isString(name)) {
    throw new InvalidTypeNameError(kernel.describer.describe(name));
  }
};

/**
 * Defines a type by its serializable name and enables declaration reflection so it can be converted later on for runtime validation.
 * @param name - Optional name for the type(otherwise, class constructor name will be used.)
 * @returns Marked class as reflective.
 * @example
 * define()
 * class MyType {}
 * define('MyTypeName')
 * class MyType {}
 * define('MyNamespace.MyTypeName')
 * class MyType {}
 */
define.afterDefine = function(
  target: any,
  reflectedType: tsruntimeTypes.ReferenceType,
  ...args: any[]
): void {
  const name = args[0];

  let typeName: types.TypeName;
  if (name !== undefined) {
    typeName = name;
    setTypeName(target, name);
  } else {
    typeName = (target as any).name;
  }

  const options = args[1];
  const isRegistrable: boolean =
    options === undefined || options?.isRegistrable !== false;

  if (isRegistrable && instanceOf<types.Serializable>(target.prototype)) {
    kernel.library.registerType(typeName, target);
  }

  if (reflectedType.type === undefined) {
    reflectedType.type = target;
  }

  // Define default values since TypeScript(and JavaScript) way of
  // handling property initializers is not reliable
  const defaults = {};
  const classPattern = kernel.converter.convert(reflectedType);
  if (classPattern === undefined && classPattern.properties === undefined) {
    return;
  }
  const propTypes = classPattern.properties as Collection;
  for (const [key, propType] of Object.entries(propTypes)) {
    if (
      typeof propType.hasInitializer === 'function' &&
      propType.hasInitializer()
    ) {
      defaults[key] = propType.getInitializer();
    }
  }
  if (!isEmpty(defaults)) {
    Reflect.defineMetadata(DEFAULT_PROPS_KEY, defaults, target);
  }

  // Define lists(arrays) of serializable types for later processing to Eveble's
  // `List` instances - special arrays with extended methods
  const serializableListProps = {};
  for (const key of Object.keys(propTypes)) {
    const serializable = resolveSerializableFromPropType(propTypes[key]);
    if (serializable !== undefined) serializableListProps[key] = serializable;
  }
  Reflect.defineMetadata(
    SERIALIZABLE_LIST_PROPS_KEY,
    serializableListProps,
    target
  );
};

export { define };
