import { classes } from 'polytype';
import merge from 'deepmerge';
import { pick } from 'lodash';
import { define, ExtendableError } from '@eveble/core';
import { DefinableMixin } from '../mixins/definable-mixin';
import { types } from '../types';
import { VersionableMixin } from '../mixins/versionable-mixin';
import { HookableMixin } from '../mixins/hookable-mixin';
import { isPlainRecord } from '../utils/helpers';
import { EjsonableMixin } from '../mixins/ejsonable-mixin';

@define('SerializableError')
export abstract class SerializableError
  extends classes(
    ExtendableError,
    DefinableMixin,
    HookableMixin,
    EjsonableMixin,
    VersionableMixin
  )
  implements types.Versionable, types.Ejsonable {
  public name: string;

  public message: string;

  public stack?: string;

  public code?: number;

  public schemaVersion?: number;

  /**
   * Creates an instance of SerializableError.
   * @param props - Optional properties for error.
   */
  constructor(propsOrMessage?: types.Props | string) {
    let props: types.Props = {};
    if (typeof propsOrMessage === 'string') {
      props.message = propsOrMessage as string;
    } else if (propsOrMessage !== undefined) {
      props = propsOrMessage;
    }

    const errorProps: types.ErrorProps = pick(props, [
      'message',
      'name',
      'stack',
      'code',
    ]);
    super([errorProps]);
    Object.assign(this, this.processProps(props));
  }

  /**
   * Processes properties for SerializableError.
   * @param props - Properties of the type required for construction.
   * @returns Processed properties with any registered `onConstruction` hooks that
   * valid against prop types.
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
    // Since ExtendableError already assigned error properties during
    // initializeProperties, we pick that and assign it to processedProps
    // for validation purposes
    if (props.name === undefined) processedProps.name = this.name;
    if (props.message === undefined) processedProps.message = this.message;

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
    return this.validateProps(props, this.getPropTypes(), true);
  }
}
