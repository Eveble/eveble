import { classes } from 'polytype';
import merge from 'deepmerge';
import {
  METADATA_KEY,
  interfaces as inversifyTypes,
} from '@parisholley/inversify-async';
import { omit } from 'lodash';
import { METADATA_KEYS } from '@eveble/core';
import { TypeTrait } from '../mixins/definable-mixin';
import { HookableMixin } from '../mixins/hookable-mixin';
import { types } from '../types';
import { isPlainRecord } from '../utils/helpers';
import { DELEGATED_KEY } from '../constants/metadata-keys';

export class Struct extends classes(DefinableMixin, HookableMixin) {
  /**
   * Creates an instance of Struct.
   * @param props - Properties of the type required for construction.
   * @throws {UndefinableClassError}
   * Thrown if provided class constructor has no `@Type` decorator applied.
   * @remarks
   * **Property initializers** on current implementation of TypeScript v3.7 are counterintuitive
   * when inheritance is involved:
   *
   * ```ts
   * @Type('MyClass')
   * class MyClass extends Struct {
   *  foo = 'default-value';
   * }
   * expect(
   * new MyClass({foo: 'set-value'}).foo
   * ).to.be.equal('set-value'); // false, its 'default-value'
   * ```
   *
   * Normally in such cases developer expects, that - since underlying parent of
   * `MyClass` i.e. `Struct` class assings properties via `Object.assign` - they will
   * override the default values of property initializer(so the `default-value` will be
   * overridden by `set-value`).
   *
   * **However since `MyClass` does not override constructor - that will not happen.**
   *
   * This will instantiate `MyClass` with the `default-value`, and not the
   * expected one - `set-value`.
   * Conclusion from this is that property initializers are set **AFTER** the
   * construction - not before(where inhabitance is in play).
   *
   * To **fix this issue** - define custom constructor for derived class:
   *```ts
   * @Type('MyClass')
   * class MyClass extends Struct {
   *  foo = 'default-value';
   *
   *  constructor(props: Partial<MyClass>) {
   *    super();
   *    Object.assign(this, this.processProps(props));
   *  }
   * }
   *
   * expect(
   * new MyClass({foo: 'set-value'}).foo
   * ).to.be.equal('set-value'); // true
   * ```
   */
  constructor(props: types.Props = {}) {
    super();
    if (
      Reflect.getMetadata(DELEGATED_KEY, this.constructor) !== true &&
      Reflect.getMetadata(METADATA_KEYS.DEFAULT_PROPS_KEY, this.constructor) ===
        undefined
    ) {
      this.construct(props);
    }
  }

  /**
   * Constructs Struct.
   * @param props - Properties of the type required for construction.
   */
  protected construct(props: types.Props = {}): void {
    Object.assign(this, this.processProps(props));
  }

  /**
   * Processes properties for Struct.
   * @param props - Properties of the type required for construction.
   * @returns Processed properties with any registered `onConstruction` hooks and
   * validates them against prop types.
   */
  protected processProps(props: types.Props = {}): types.Props {
    const processedProps: types.Props = this.onConstruction(props);
    this.onValidation(processedProps);
    return processedProps;
  }

  /**
   * On construction hook.
   * @param props - Properties object to be processed.
   * @returns Processed properties as an object.
   */
  protected onConstruction(props: types.Props): types.Props {
    const propertyInitializers = this.getPropertyInitializers();
    const processedProps: types.Props = merge(propertyInitializers, props, {
      isMergeableObject: isPlainRecord,
    });

    const hooks: types.hooks.Mappings = this.getHooks('onConstruction');
    for (const hook of Object.values(hooks)) {
      hook.bind(this)(processedProps);
    }
    return processedProps;
  }

  /**
   * On validation hook.
   * @param props - Properties object that already has been processed.
   * @returns Returns `true` on valid properties, else throws.
   * @throws {ValidationError}
   * Thrown if the provided properties does not match the prop types.
   */
  protected onValidation(props: types.Props): boolean {
    const mappings: Record<keyof any, inversifyTypes.Metadata[]> =
      Reflect.getMetadata(METADATA_KEY.TAGGED_PROP, this.constructor) || {};
    const propTypes = omit(this.getPropTypes(), Object.keys(mappings));
    const result = this.validateProps(props, propTypes, true);

    const hooks: types.hooks.Mappings = this.getHooks('onValidation');
    for (const hook of Object.values(hooks)) {
      hook.bind(this)(props);
    }

    return result;
  }
}
