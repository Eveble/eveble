import { classes } from 'polytype';
import { pick } from 'lodash';
import deepClone from '@jsbits/deep-clone';
import { define, kernel } from '@eveble/core';
import { StatefulMixin } from '../mixins/stateful-mixin';
import { Serializable } from '../components/serializable';
import { Guid } from './value-objects/guid';
import { types } from '../types';
import { StatusfulMixin } from '../mixins/statusful-mixin';
import { SavedStateNotFoundError } from './domain-errors';
import {
  SAVED_STATE_KEY,
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
  ACTION_VALIDATION_KEY,
  ENABLE_ACTION_VALIDATION_METHOD_KEY,
  DISABLE_ACTION_VALIDATION_METHOD_KEY,
  IS_ACTION_VALIDATED_METHOD_KEY,
} from '../constants/literal-keys';

import { SERIALIZABLE_LIST_PROPS_KEY } from '../constants/metadata-keys';
import { List } from './list';

@define('Entity')
export class Entity
  extends classes(Serializable, StatefulMixin, StatusfulMixin)
  implements types.Entity
{
  protected static asserter: types.Asserter;

  public id: string | Guid;

  public state: types.State;

  public status: types.Status;

  public schemaVersion?: number;

  /**
   * Creates an instance of `Entity`.
   * @param props - Properties of the type required for construction.
   */
  constructor(props: types.Props) {
    super([props]);
  }

  /**
   * Returns identifier for Entity.
   * @return Entities identifier as `Guid` instance or string.
   */
  public getId(): string | Guid {
    return this.id;
  }

  /**
   * Evaluates if one entity is equal to other by its constructor and identifier.
   * @param otherEntity - Other `Entity` instance.
   * @returns Returns `true` if both Entities instances are equal, else `false`.
   */
  public equals(otherEntity: Entity): boolean {
    return (
      otherEntity != null &&
      otherEntity.constructor === this.constructor &&
      otherEntity.getId() === this.id
    );
  }

  /**
   * Assigns validated properties from one or more sources.
   * @param sources - One or more source of properties.
   * @return Returns this instance of `Entity` with new properties assigned.
   * @throws {ValidationError}
   * Thrown if properties does not match prop types of `Entity`.
   * @remarks
   * Works like `Object.assign` with additional validation.
   */
  protected assign(...sources: Record<string, any>[]): this {
    const pickedProps = this.pickProps(...sources);

    this.validateProps({ ...this, ...pickedProps }, this.getPropTypes(), true);

    Object.assign(this, pickedProps);
    return this;
  }

  /**
   * Picks properties matching entity property types from one or more sources.
   * @param sources - One or more source of properties.
   * @return Returns properties picked from sources.
   * @throws {ValidationError}
   * Thrown if properties does not match prop types of Entity.
   */
  protected pickProps(...sources: Record<string, any>[]): Partial<this> {
    const propTypes = this.getPropTypes();
    const propKeys = Object.keys(propTypes);

    const pickedProps = {};
    for (const source of sources) {
      Object.assign(pickedProps, pick(source, propKeys));
    }
    return pickedProps;
  }

  /**
   * Sets current action for asserting state of `Entity`.
   * @param action - Name of action to be taken or `Command` that is handled.
   * @return Instance implementing `Asserter` interface.
   */
  public on(action: string | types.Stringifiable): this {
    kernel.asserter.setAction(action);
    return this;
  }

  /**
   * Exposes the `ensure` BDD assertion for `Entity`.
   * @remarks
   * The `entity.ensure` getter-method will return a Proxified instance of the
   * `Entity`. This proxified instance listens to all get methods and
   * catches the requested method name.
   *
   * If the requested get method/property name matches exactly or partially
   * one of registered apis on `Asserter`(like: `is`) it returns associated
   * object assigned to that assertion. Like for example - for registered
   * `AbilityAssertion`, calling entity with:
   *```ts
   * entity.ensure.is
   *```
   * Will result with returned object:
   *```ts
   * {ableTo: ...}
   *```
   * That can be called like:
   *```ts
   * entity.ensure.is.ableTo.doAction(...)
   *```
   * Same rules of behavior will apply to other assertions like:
   * `StatefulAssertion`, `StatusfulAssertion`.
   *
   * However, since we want to enable an expressive apis on Entities - we allow
   * users to defined their own apis. By calling:
   *```ts
   * entity.ensure.myMethod()
   *```
   * A backup of the entity state will be created that will be rollbacked directly * after the invocation of the method(and that will happen automatically)
   * (it behaves exactly like `ensure.is.ableTo` assertion from `AbilityAssertion`)
   *
   * This allows for evaluation of state change on command handlers directly
   * without writing unnecessary duplicated code that would ensure that
   * state indeed can be changed(first method) and then actually change
   * it(second method).
   * @return Proxified instance of `Entity`.
   */
  public get ensure(): this & {
    [key: string]: any;
  } {
    return new Proxy(this, {
      get(target: any, key: string | symbol): any {
        // Fallback for use `entity.ensure` without specified method
        if (key === Symbol.toStringTag) {
          return this;
        }
        const propKey = key as string;
        // Add dot on end of propKey to ensure that only paths are
        // matched - and not partial words
        if (kernel.asserter.hasApi(`${propKey}.`)) {
          kernel.asserter.setEntity(target);
          return (kernel.asserter as any).ensure[propKey];
        }

        if (typeof target[propKey] === 'function') {
          const proxifiedMethod = new Proxy(target[propKey], {
            apply(_targetMethod, _thisArg, args): any {
              target[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
              const result: any = target[propKey](...args);
              target[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
              return result;
            },
          });
          return proxifiedMethod;
        }

        if (target[propKey] === undefined) {
          return target;
        }
        return target[propKey];
      },
    });
  }

  /**
   * Method to enforce TypeScript compliance with `Asserter` and `AbilityAssertion`.
   */
  get ableTo(): this {
    return this;
  }

  /**
   * Method to enforce TypeScript compliance with `Asserter` and `AbilityAssertion`.
   */
  get is(): this & {
    [key: string]: any;
  } {
    return this;
  }

  /**
   * Evaluates if action can be taken on `Entity`.
   * Prior to invocation of any non-assertion methods snapshot of current state
   * is done - that will be automatically rollbacked after method execution.
   * Proxified instance wraps the executed method and ensures that boolean is
   * returned as result indicating if method indeed can be executed(`true`) - or
   * fail with thrown error(`false`)
   * @return Proxified instance of `Entity`.
   */
  public get can(): any {
    return new Proxy(this, {
      get(target: any, propKey: string): any {
        const proxifiedMethod = new Proxy(target[propKey], {
          apply(_targetMethod, _thisArg, args): any {
            target[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
            let isAble = true;
            try {
              target[propKey](...args);
            } catch (e) {
              isAble = false;
            }
            target[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
            return isAble;
          },
        });
        return proxifiedMethod;
      },
    });
  }

  /**
   * Saves current entity state.
   */
  public [SAVE_STATE_METHOD_KEY](): void {
    this[SAVED_STATE_KEY] = {};
    const propTypes = this.getPropTypes();
    for (const key of Object.keys(propTypes)) {
      if (this[key] !== undefined) {
        (this as any)[SAVED_STATE_KEY][key] = deepClone(this[key]);
      }
    }
  }

  /**
   * Enables action validation.
   */
  public [ENABLE_ACTION_VALIDATION_METHOD_KEY](): void {
    Object.defineProperty(this, ACTION_VALIDATION_KEY, {
      value: true,
      enumerable: false,
      writable: true,
    });
  }

  /**
   * Disables action validation.
   */
  public [DISABLE_ACTION_VALIDATION_METHOD_KEY](): void {
    Object.defineProperty(this, ACTION_VALIDATION_KEY, {
      value: false,
      enumerable: false,
      writable: true,
    });
  }

  /**
   * Returns current state of action validation.
   */
  public [IS_ACTION_VALIDATED_METHOD_KEY](): boolean {
    return this[ACTION_VALIDATION_KEY] || false;
  }

  /**
   * Rollbacks entity to previous state.
   * @throws {SavedStateNotFoundError}
   * Thrown if rollback is done on `Entity` without prior saved state.
   */
  public [ROLLBACK_STATE_METHOD_KEY](): void {
    if (!this.isStateSaved()) {
      throw new SavedStateNotFoundError(
        this.getTypeName(),
        this.getId().toString()
      );
    }
    Object.assign(this, this[SAVED_STATE_KEY]);
    /*
    Fix for rollbacking serializable lists since their
    internal symbol properties(SOURCE_KEY, LIST_KEY, SERIALIZABLE_TYPE_KEY) will not be rollbacked with Object.assign
    */
    const serializablesListProps = Reflect.getMetadata(
      SERIALIZABLE_LIST_PROPS_KEY,
      this.constructor
    );
    for (const [key, serializable] of Object.entries(serializablesListProps)) {
      this[key] = new List(
        this,
        key,
        serializable,
        (this[SAVED_STATE_KEY] as any)[key] || []
      );
    }
    delete this[SAVED_STATE_KEY];
  }

  /**
   * Evaluates if state of entity is saved.
   * @returns Returns `true` if state of entity is saved, else `false`.
   */
  public isStateSaved(): boolean {
    return this[SAVED_STATE_KEY] !== undefined;
  }
}
// Enable conversion of serializable list by default
Entity.enableSerializableLists();
