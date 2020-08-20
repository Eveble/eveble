import { set, get, has, isEmpty } from 'lodash';
import merge from 'deepmerge';
import { diff } from 'deep-diff';
import { InstanceOf, Collection, instanceOf, Optional } from 'typend';
import { getTypeName } from '@eveble/helpers';
import { define, kernel } from '@eveble/core';
import deepClone from '@jsbits/deep-clone';
import { Struct } from './struct';
import { types } from '../types';
import { InvalidConfigError } from '../core/core-errors';
import { isPlainRecord, convertObjectToCollection } from '../utils/helpers';
import { delegate } from '../annotations/delegate';

/*
Force delegated construction always on each Configuration and inheritables by
requiring to define class constructor:

class MyConfig extends Config {
  constructor(props: Partial<MyConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

This solution enables support for property initializers ALWAYS.
*/
@delegate()
@define()
export class Config extends Struct implements types.Configurable {
  public included?: Record<string, types.Configurable>;

  public merged?: Record<string, types.Configurable>;

  /**
   * Creates an instance of Config.
   * @example
   *```ts
   * @define()
   * class MyConfig extends Config {
   *   appId: string
   *   logging: {
   *     isEnabled = true,
   *     level: 'debug' | 'info'
   *   }
   *
   *   constructor(props: Partial<MyConfig>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   * ```
   */
  constructor() {
    super();
  }

  /**
   * Evaluates if value can be configured on specific path.
   * @param path - Configuration path using dotted notation for nested objects.
   * @returns Returns `true` if property on path is configurable on configuration, else `false`.
   * @example
   *```ts
   * @define()
   * class MyConfig extends Config {
   *   appId: string
   *   logging: {
   *     isEnabled = true,
   *     level: 'debug' | 'info'
   *   }
   *
   *   constructor(props: Partial<MyConfig>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * const config = new MyAppConfig()
   * expect(config.isConfigurable('appId')).to.be.true;
   * expect(config.isConfigurable('logging.level')).to.be.true;
   * expect(config.isConfigurable('logging.nonExistentPath')).to.be.false;
   * ```
   */
  public isConfigurable(path: string): boolean {
    return has(this.getPropTypes(), path);
  }

  /**
   * Returns all prop types from whole inheritance tree and other included configurations.
   * @returns Plain object representation of prop types.
   */
  public getPropTypes(): types.Props {
    const instancePropTypes = super.getPropTypes();
    let propTypes = {};
    for (const key of Reflect.ownKeys(instancePropTypes)) {
      const value = instancePropTypes[key.toString()];

      if (value instanceof InstanceOf) {
        // Instance of `Config` prop type
        if (value[0].prototype instanceof Config) {
          propTypes[key] = new Collection((value[0] as any).getPropTypes());
        } else {
          propTypes[key] = value;
        }
      } else {
        propTypes[key] = value;
      }
    }

    if (isEmpty(this.merged)) {
      return propTypes;
    }

    let mergedPropTypes = {};
    for (const mergedCfg of Object.values(this.merged || {})) {
      const mergedConfigPropTypes = mergedCfg.getPropTypes();

      mergedPropTypes = merge(mergedPropTypes, mergedConfigPropTypes, {
        isMergeableObject: isPlainRecord,
      });
    }

    propTypes = merge(mergedPropTypes, propTypes, {
      isMergeableObject: isPlainRecord,
    });

    return convertObjectToCollection(propTypes);
  }

  /**
   * Evaluates if value is set on configuration or included ones.
   * @param path - Configuration path using dotted notation for nested objects.
   * @returns Returns `true` if configuration is set under questioned path, else `false`.
   * @example
   *```ts
   * @define()
   * class MyConfig extends Config {
   *   appId: string
   *   logging: {
   *     isEnabled = true,
   *     level: 'debug' | 'info'
   *   }
   *
   *   constructor(props: Partial<MyConfig>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * const config = new MyAppConfig({
   *   appId: 'my-app-id',
   *   logging: {isEnabled: true, level: 'debug'}
   * })
   * expect(config.has('appId')).to.be.true;
   * expect(config.has('logging.level')).to.be.true;
   * expect(config.has('logging.nonExistentPath')).to.be.false;
   * ```
   */
  public has(path: string): boolean {
    const hasValue: boolean = has(this, path);
    if (hasValue) return true;

    for (const config of Object.values(this.included || {})) {
      if (config.has(path)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns value from configuration, included ones or default fallbacks.
   * @param path - Configuration path using dotted notation for nested objects.
   * @param runtimeDefaultValue - Value that will be returned as default if no value is set on configuration.
   * @returns Resolved value from instance if its found on path; value from other included configurations; the runtime default value(if provided) or undefined.
   * @example
   *```ts
   * @define()
   * class MyConfig extends Config {
   *   appId: string
   *   logging: {
   *     isEnabled = true,
   *     level: 'debug' | 'info'
   *   }
   *
   *   constructor(props: Partial<MyConfig>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * const config = new MyAppConfig({
   *   appId: 'my-app-id',
   *   logging: {isEnabled: true, level: 'debug'}
   * })
   *
   * expect(config.get('appId')).to.be.equal('my-app-id');
   * expect(config.get('logging.level')).to.be.equal('debug');
   *
   * expect(
   *   config.get('logging.nonExistentPath', 'my-runtime-fallback')
   * ).to.be.equal('my-runtime-fallback');
   * ```
   */
  public get<T extends any>(path: string, runtimeDefaultValue?: T): T | any {
    let foundValue: any = get(this, path);
    if (foundValue !== undefined) {
      // Since were returning reference to object, any runtime changes to object would change the original instance - for this were loosing the reference
      if (isPlainRecord(foundValue)) {
        return { ...foundValue };
      }
      return foundValue;
    }

    for (const config of Object.values(this.included || [])) {
      foundValue = config.getExact(path);
      if (foundValue !== undefined) {
        return foundValue;
      }
    }

    if (runtimeDefaultValue !== undefined) {
      return runtimeDefaultValue;
    }

    return this.getDefault(path);
  }

  /**
   * Returns exact value set on configuration or included ones(without any fallback in place).
   * @param path - Configuration path using dotted notation for nested objects.
   * @returns Resolved value if its found over provided path or value from other included configurations.
   */
  public getExact<T extends any>(path: string): T | any {
    let foundValue: any = get(this, path);
    if (foundValue !== undefined) {
      // Since were returning reference to Object, any runtime changes to Object would change the original instance - for this were loosing reference
      if (isPlainRecord(foundValue)) {
        return { ...foundValue };
      }
      return foundValue;
    }

    for (const config of Object.values(this.included || [])) {
      foundValue = config.getExact(path);
      if (foundValue !== undefined) {
        return foundValue;
      }
    }
    return undefined;
  }

  /**
   * Returns default value for configuration(if property initializers are set) or included ones.
   * @param path - Configuration path using dotted notation for nested objects.
   * @return Resolved default value or undefined.
   */
  public getDefault<T extends any>(path: string): T | any {
    let foundDefaultValue = get(this.getPropertyInitializers(), path);

    if (foundDefaultValue !== undefined) {
      // Since were returning reference to Object, any runtime changes to Object would change the original instance - for this were loosing reference
      if (isPlainRecord(foundDefaultValue)) {
        return { ...foundDefaultValue };
      }
      return foundDefaultValue;
    }

    for (const config of Object.values(this.included || {})) {
      foundDefaultValue = config.getDefault(path);
      if (foundDefaultValue !== undefined) {
        return foundDefaultValue;
      }
    }
    return undefined;
  }

  /**
   * Evaluates if there is default value set for path on configuration or included ones.
   * @param path - Configuration path using dotted notation for nested objects.
   * @returns Returns `true` if default value is set on configuration, else `false`.
   */
  public hasDefault(path: string): boolean {
    const hasDefaultValue = has(this.getPropertyInitializers(), path);

    if (hasDefaultValue) return true;

    for (const config of Object.values(this.included || {})) {
      if (config.hasDefault(path)) {
        return true;
      }
    }
    return hasDefaultValue;
  }

  /**
   * Sets a value on configuration.
   * @param path - Configuration path using dotted notation for nested objects.
   * @param value - Value to be set on configuration.
   * @throws {ValidationError}
   * Thrown if the provided value does not match the prop types.
   * @example
   *```ts
   * @define()
   * class MyConfig extends Config {
   *   appId: string
   *   logging: {
   *     isEnabled = true,
   *     level: 'debug' | 'info'
   *   }
   *
   *   constructor(props: Partial<MyConfig>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * const config = new MyAppConfig({
   *   appId: 'my-app-id',
   *   logging: {isEnabled: true, level: 'debug'}
   * });
   *
   * config.set('appId', 'set-id')
   * config.set('logging.level', 'info')
   *
   * expect(config.get('appId')).to.be.equal('set-id');
   * expect(config.get('logging.level')).to.be.equal('info');
   *
   * expect(() =>
   *   config.set('appId', 1337)
   * ).to.throw(ValidationError)
   * expect(() =>
   *   config.set('logging.nonExistentPath', 'my-value')
   * ).to.throw(ValidationError)
   * ```
   */
  public set<T extends any>(path: string, value: T): void {
    // First validate on copy if provided value matches properties types
    const copy = this.toPlainObject();
    set(copy, path, value);
    this.validateProps(copy, this.getPropTypes());

    set(this, path, value);
  }

  /**
   * Assign collection of values to configuration.
   * @param props - Properties with relation path: value matching prop types.
   * @throws {ValidationError}
   * Thrown if the provided properties does not match prop types.
   * @example
   *```ts
   * @define()
   * class MyConfig extends Config {
   *   appId: string
   *   logging: {
   *     isEnabled = true,
   *     level: 'debug' | 'info'
   *   }
   *
   *   constructor(props: Partial<MyConfig>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * const config = new MyAppConfig({
   *   appId: 'my-app-id',
   *   logging: {isEnabled: true, level: 'debug'}
   * });
   *
   * const newProps = {
   *   appId: 'my-other-app-id',
   *   logging: {isEnabled: false, level: 'info'}
   * };
   * config.assign(newProps);
   * expect(config).to.be.eql(newProps);
   * expect(() =>
   *   config.assign({invalidKey: 'invalid-value'})
   * ).to.throw(ValidationError);
   * ```
   */
  public assign(props: types.Props): void {
    const configCopy: any = deepClone(this);
    // Prepare config copy for validation
    this.findDiffAndUpdate(configCopy, configCopy, props);
    // Validate copied config against prop types
    this.validateProps(configCopy, this.getPropTypes());
    // Update actual config to the newest source
    this.findDiffAndUpdate(this, props, this);
  }

  /**
   * Attaches another configuration instance to current configuration.
   * @param config - Instance implementing `Configurable` interface.
   * @throws {InvalidConfigError}
   * Thrown if the passed configuration is not implementation of `Configurable` interface.
   * @example
   *```ts
   * @define('First')
   * class First extends Config {
   *   firstKey: string;
   *
   *   constructor(props: Partial<First>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * @define('Second')
   * class Second extends Config {
   *   secondKey: string;
   *
   *   constructor(props: Partial<Second>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * const first = new First({ firstKey: 'first' });
   * const second = new Second({ secondKey: 'second' });
   * first.include(second);
   *
   * expect(first.included).to.be.eql({ Second: second });
   * expect(first.get('firstKey')).to.be.equal('first');
   * expect(first.get('secondKey')).to.be.equal('second');
   * ```
   */
  public include(config: types.Configurable): void {
    if (!instanceOf<types.Configurable>(config)) {
      throw new InvalidConfigError(
        getTypeName(this) as string,
        kernel.describer.describe(config)
      );
    }
    if (this.included === undefined) this.included = {};
    this.included[getTypeName(config) as string] = config;
  }

  /**
   * Create an `Config` from plain object source of properties.
   * @param props - Properties as object that can contains other nested configurations.
   * @returns New instance of `Config` with assigned properties.
   * @throws {ValidationError}
   * Thrown if the passed properties does not match config property types.
   */
  public static from<T>(props: Record<string, any>): T {
    const propTypes = this.getPropTypes();

    const processedProps = {};
    for (const [key, PropType] of Object.entries(propTypes)) {
      let UnwrapedPropType = PropType;
      if (PropType instanceof Optional) {
        UnwrapedPropType = PropType[0];
      }
      if (UnwrapedPropType instanceof InstanceOf) {
        UnwrapedPropType = UnwrapedPropType[0];
      }

      if (props[key] === undefined) {
        continue;
      }
      if (
        UnwrapedPropType.prototype !== undefined &&
        UnwrapedPropType.prototype instanceof Config
      ) {
        processedProps[key] = new UnwrapedPropType(props[key]);
      } else {
        processedProps[key] = props[key];
      }
    }
    return new (this as any)(processedProps);
  }

  /**
   * Attaches another configuration instance to current configuration and merges
   * all properties. Parent configuration merging child will always have precedence
   * in values assigned on same paths.
   * @param config - Instance implementing `Configurable` interface.
   * @throws {InvalidConfigError}
   * Thrown if the passed configuration is not implementation of `Configurable` interface.
   *```ts
   * @define('Config.First')
   * class First extends Config {
   *   key = 'first-key';
   *
   *   foo = 'first-foo';
   *
   *   constructor(props: Partial<First>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * @define('Config.Second')
   * class Second extends Config {
   *   key = 'second-key';
   *
   *   baz = 'second-baz';
   *
   *   constructor(props: Partial<Second>) {
   *     super();
   *     Object.assign(this, this.processProps(props));
   *   }
   * }
   *
   * const first = new First({
   *   key: 'first-key',
   *   foo: 'first-foo',
   * });
   * const second = new Second({
   *   key: 'second-key',
   *   baz: 'second-baz',
   * });
   *
   * first.merge(second);
   * expect(first.getPropTypes()).to.be.eql({
   *   included: PropTypes.interface({}).isOptional,
   *   merged: PropTypes.interface({}).isOptional,
   *   foo: PropTypes.instanceOf(String),
   *   key: PropTypes.instanceOf(String),
   *   baz: PropTypes.instanceOf(String),
   * });
   *
   * expect(first).to.be.eql({
   *   merged: { 'Config.Second': second },
   *   foo: 'first-foo',
   *   baz: 'second-baz',
   *   key: 'first-key',
   * });
   * ```
   */
  public merge(config: types.Configurable): void {
    if (!instanceOf<types.Configurable>(config)) {
      throw new InvalidConfigError(
        getTypeName(this) as string,
        kernel.describer.describe(config)
      );
    }
    const configCopy: any = deepClone(config);
    delete configCopy.included;

    this.findDiffAndUpdate(this, this, configCopy);

    if (this.merged === undefined) this.merged = {};
    this.merged[getTypeName(config) as string] = config;
  }

  /**
   * Finds differences between two objects and update's the target.
   * @param target - Target of assignment as an object.
   * @param left - Left source of assignment as an object.
   * @param right - Left source of assignment as an object.
   */
  protected findDiffAndUpdate(
    target: Record<string, any>,
    left: Record<string, any>,
    right: Record<string, any>
  ): void {
    const differences = diff(left, right);
    for (const difference of differences) {
      if (difference.path.includes('merged')) {
        continue;
      }
      if (['E'].includes(difference.kind)) {
        set(target, difference.path, difference.lhs);
      }
      if (['N'].includes(difference.kind)) {
        set(target, difference.path, difference.rhs);
      }
      if (['D'].includes(difference.kind)) {
        set(target, difference.path, difference.lhs);
      }
    }
  }
}
