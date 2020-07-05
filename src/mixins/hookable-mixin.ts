import 'reflect-metadata';
import { isString, has, get, isPlainObject } from 'lodash';
import { getMatchingParentProto } from 'typend';
import { getTypeName } from '@eveble/helpers';
import merge from 'deepmerge';
import { injectable } from '@parisholley/inversify-async';
import { HOOKABLE_KEY, HOOKS_CONTAINER_KEY } from '../constants/metadata-keys';
import { ExtendableError } from '../components/extendable-error';
import { types } from '../types';
import { kernel } from '../core/kernel';

export class HookError extends ExtendableError {}

export class InvalidHookActionError extends HookError {
  constructor(got: any) {
    super(`Expected action argument to be string, got ${got}`);
  }
}
export class InvalidHookIdError extends HookError {
  constructor(got: any) {
    super(`Expected id argument to be string, got ${got}`);
  }
}

export class HookAlreadyExistsError extends HookError {
  constructor(typeName: types.TypeName, action: string, id: string) {
    super(
      `${typeName}: hook for action '${action}' with id '${id}' would be overwritten. Avoid overriding of existing hooks do to inconsistent behavior`
    );
  }
}

export class HookNotFoundError extends HookError {
  constructor(typeName: types.TypeName, action: string, id: string) {
    super(
      `${typeName}: hook for action '${action}' with id '${id}' can't be found`
    );
  }
}

@injectable()
export class HookableMixin implements types.Hookable {
  /**
   * Registers hook by action type and id.
   * @param action - Action for which hook will be registered(like `onConstruction`, `onSend`, `onPublish` etc.)
   * @param id - Identifier under which hook will be registered for further reference.
   * @param hook - Hook as a `function` matching declaration for required action that will be invoked upon action.
   * @param shouldOverride - Flag indicating that hook should be overridden if exist.
   * @throws {InvalidHookActionError}
   * Thrown if the the action argument is not a string.
   * @throws {InvalidHookIdError}
   * Thrown if the the id argument is not a string.
   * @throws {HookAlreadyExistsError}
   * Thrown if the existing hook with id would be overridden.
   * @example
   *```ts
   * import {expect} from 'chai';
   * import {HookableMixin} from 'eveble'
   *
   * class Document extends HookableMixin {
   *   content: string;
   *
   *   version: number;
   *
   *   constructor(props: Record<keyof any, any>) {
   *     super();
   *     const processedProps = { ...props };
   *
   *     const hooks = this.getHooks('onConstruction');
   *     for (const hook of Object.values(hooks)) {
   *       hook.bind(this)(processedProps);
   *     }
   *     Object.assign(this, processedProps);
   *   }
   * }
   *
   * const versionable = (props: Record<keyof any, any>) => {
   *   if (props.version === undefined) {
   *     props.version = 0;
   *   }
   *   return props;
   * };
   * Document.prototype.registerHook('onConstruction', 'versionable', versionable);
   *
   * const newDoc = new Document({ content: 'My document content' });
   * expect(newDoc.version).to.be.equal(0);
   * ```
   */
  public registerHook(
    action: string,
    id: string,
    hook: types.Hook,
    shouldOverride = false
  ): void {
    if (!isString(action)) {
      throw new InvalidHookActionError(kernel.describer.describe(action));
    }
    if (!isString(id)) {
      throw new InvalidHookIdError(kernel.describer.describe(id));
    }

    const typeName: types.TypeName = getTypeName(this.constructor) || '';
    // Avoid overriding of existing hook do to inconsistent behavior.
    if (this.hasHook(action, id) && !shouldOverride) {
      throw new HookAlreadyExistsError(typeName, action, id);
    }

    if (!Reflect.hasOwnMetadata(HOOKS_CONTAINER_KEY, this)) {
      Reflect.defineMetadata(HOOKS_CONTAINER_KEY, {}, this);
    }

    if (!Reflect.hasOwnMetadata(HOOKABLE_KEY, this.constructor)) {
      Reflect.defineMetadata(HOOKABLE_KEY, true, this.constructor);
    }

    const actions: types.hooks.Actions = Reflect.getOwnMetadata(
      HOOKS_CONTAINER_KEY,
      this
    );

    if (!has(actions, action)) {
      actions[action] = {};
    }
    actions[action][id] = hook;
  }

  /**
   * Overrides registered hook by action and id or registers a new one.
   * @param action - Action for which hook will be registered(like `onConstruction`, `onSend`, `onPublish` etc.)
   * @param id - Identifier under which hook will be registered for further reference.
   * @param hook - Hook as a `function` matching declaration for required action that will be invoked upon action.
   * @throws {InvalidHookActionError}
   * Thrown if the the action argument is not a `string`.
   * @throws {InvalidHookIdError}
   * Thrown if the the id argument is not a `string`.
   */
  public overrideHook(action: string, id: string, hook: types.Hook): void {
    this.registerHook(action, id, hook, true);
  }

  /**
   * Returns hook for action and id.
   * @param action - Action for which hook is resolved.
   * @param id - Identifier under which hook was was registered.
   * @returns Hook as a `function` matching declaration, else `undefined`.
   * @example
   *```ts
   * class MyClass extends HookableMixin {}
   *
   * const hook = sinon.spy();
   * MyClass.prototype.registerHook('onConstruction', 'my-hook', hook);
   *
   * expect(MyClass.prototype.getHook('onConstruction', 'my-hook')).to.be.equal(hook);
   * ```
   */
  public getHook(action: string, id: string): types.Hook | undefined {
    const hooks: types.hooks.Mappings = this.getHooks(action);
    return get(hooks, id, undefined);
  }

  /**
   * Returns hook for action and id or throws.
   * @param action - Action for which hook is resolved.
   * @param id - Identifier under which hook was was registered.
   * @returns Hook as a `function` matching declaration, else throws.
   * @throws {HandlerNotFoundError}
   * Thrown if there is no hook registered for action with id.
   */
  public getHookOrThrow(action: string, id: string): types.Hook {
    const hook: types.Hook | undefined = this.getHook(action, id);

    if (!hook) {
      const typeName: types.TypeName = getTypeName(this.constructor) || '';
      throw new HookNotFoundError(typeName, action, id);
    }
    return hook;
  }

  /**
   * Returns a collection of all available hooks registered for action.
   * @param action - Action for which hooks are resolved.
   * @returns Collection of hooks.
   */
  public getHooks(action: string): types.hooks.Mappings {
    const matcher = (proto: types.Prototype): boolean => {
      return (
        typeof proto.getHooks === 'function' &&
        proto.constructor !== HookableMixin
      );
    };
    const parentProto: types.Prototype | undefined = getMatchingParentProto(
      this,
      matcher
    );

    const parentHooks: types.hooks.Mappings =
      parentProto !== undefined && typeof parentProto.getHooks === 'function'
        ? parentProto.getHooks(action)
        : {};
    const childActions: types.hooks.Actions = Reflect.hasOwnMetadata(
      HOOKS_CONTAINER_KEY,
      this
    )
      ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
      : {};
    const childHooks: types.hooks.Mappings = childActions[action] || {};

    const hooks: types.hooks.Mappings = merge(parentHooks, childHooks, {
      isMergeableObject: isPlainObject,
    });
    return hooks;
  }

  /**
   * Returns a collection of all available actions with matching registered hooks as nested collection.
   * @returns Collection of actions(key) with matching registered hooks as nested collection(value).
   */
  public getActions(): types.hooks.Actions {
    const matcher = (proto: types.Prototype): boolean => {
      return (
        typeof proto.getActions === 'function' &&
        proto.constructor !== HookableMixin
      );
    };
    const parentProto: types.Prototype | undefined = getMatchingParentProto(
      this,
      matcher
    );

    const parentActions: types.hooks.Actions =
      parentProto !== undefined && typeof parentProto.getActions === 'function'
        ? parentProto.getActions()
        : {};
    const childActions: types.hooks.Actions = Reflect.hasOwnMetadata(
      HOOKS_CONTAINER_KEY,
      this
    )
      ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
      : {};

    const actions: types.hooks.Actions = merge(parentActions, childActions, {
      isMergeableObject: isPlainObject,
    });
    return actions;
  }

  /**
   * Evaluates if hook for action with id is registered.
   * @param action - Action for which hook is existence is evaluated.
   * @param id - Identifier under which hook was was registered.
   * @returns Returns true if hook exists, else false.
   *
   */
  public hasHook(action: string, id: string): boolean {
    const actions: types.hooks.Actions = this.getActions();
    return has(actions, `${action}.${id}`);
  }

  /**
   * Evaluates if hooks for action are registered.
   * @param action - Action for which hook is existence is evaluated.
   * @returns Returns true if hooks for action exists, else false.
   */
  public hasAction(action: string): boolean {
    const actions: types.hooks.Actions = this.getActions();
    return has(actions, action);
  }

  /**
   * Removes a hook by action and id.
   * @param action - Action for which hook is removed.
   * @param id - Identifier under which hook was was registered.
   * @example
   *```ts
   * class MyClass extends HookableMixin {}
   *
   * const hook = sinon.spy();
   * MyClass.prototype.registerHook('onConstruction', 'my-hook', hook);
   *
   * MyClass.prototype.removeHook('onConstruction', 'my-hook')
   * expect(MyClass.prototype.getHook('onConstruction', 'my-hook')).to.be.undefined;
   * ```
   */
  public removeHook(action: string, id: string): void {
    const isHookable: boolean = Reflect.getOwnMetadata(
      HOOKABLE_KEY,
      this.constructor
    );
    // Don't allow to remove hooks from parent containers
    if (!isHookable) {
      return;
    }
    const actions: types.hooks.Actions = Reflect.hasOwnMetadata(
      HOOKS_CONTAINER_KEY,
      this
    )
      ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
      : {};

    if (has(actions, `${action}.${id}`)) {
      delete actions[action][id];
    }
  }
}
