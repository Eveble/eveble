import 'reflect-metadata';
import { has, set, get, isEmpty } from 'lodash';
import merge from 'deepmerge';
import { Serializable } from './serializable';
import { isPlainRecord } from '../utils/helpers';
import { define } from '../decorators/define';
import { types } from '../types';
import { DEFAULT_PROPS_KEY } from '../constants/metadata-keys';
import { PickableProperties } from './pickable-properties';

@define('Message')
export abstract class Message extends Serializable
  implements types.Messageable {
  public timestamp: Date;

  public metadata: Record<string, any>;

  /**
   * Creates an instance of Message.
   * @param props - Properties of the type required for construction.
   */
  constructor(props: types.Props = {}) {
    super(props);
    if (
      Reflect.getMetadata(DEFAULT_PROPS_KEY, this.constructor) === undefined
    ) {
      Object.freeze(this);
    }
  }

  /**
   * Constructs Message.
   * @param props - Properties of the type required for construction.
   * @remarks
   * Since Messages by default should always be immutable, we use this hook to freeze the
   * message instance.
   * However, if there are initializing properties involved, construction and
   * freezing object is required to be done manually.
   */
  protected construct(props: types.Props = {}): void {
    Object.assign(this, this.processProps(props));
  }

  /**
   * Processes properties for Message.
   * @param props - Properties of the type required for construction.
   * @returns Processed properties with any registered `onConstruction` hooks and
   * validates them against prop types.
   */
  protected processProps(props: types.Props = {}): types.Props {
    let processedProps: types.Props;
    if (props instanceof PickableProperties) {
      processedProps = props.pickProps(this.getPropTypes());
    } else {
      processedProps = { ...props };
    }
    if (!processedProps.timestamp) {
      processedProps.timestamp = new Date();
    }
    if (!processedProps.metadata) {
      processedProps.metadata = {};
    }
    return super.processProps(processedProps);
  }

  /**
   * Returns time when message was created.
   * @returns Returns instance of `Date`.
   */
  public getTimestamp(): Date {
    return this.timestamp;
  }

  /**
   * Assigns metadata to message via reflection.
   * @param props - Metadata properties object with all information related to `Message`.
   */
  public assignMetadata(props: Record<string, any>): void {
    Object.assign(
      this.metadata,
      merge(this.metadata as Record<string, any>, props, {
        isMergeableObject: isPlainRecord,
      })
    );
  }

  /**
   * Evaluates if there is assigned metadata to message.
   * @returns Returns true if `message` has assigned metadata, else `false`.
   */
  public hasMetadata(): boolean {
    return !isEmpty(this.metadata);
  }

  /**
   * Returns metadata assigned to the message.
   * @returns  Returns metadata assigned to the message as an object.
   */
  public getMetadata(): Record<string, any> {
    return this.metadata;
  }

  /**
   * Sets correlation id metadata on message.
   * @param key - Key under which correlation is set with support of dotted notation for nested objects.
   * @param id - Identifier of correlating element.
   * @remarks
   * **Databases like MongoDB does not support object keys with dots like: `my.nested.key`**
   * Since for correlation key - namespaced 'type name' like `MyNamespace.MyMessage`
   * can be used we utilize lodash'es 'set' method to construct nested object from
   * such notation.
   */
  public setCorrelationId(key: string, id: types.Stringifiable): void {
    set(
      this.metadata as Record<string, any>,
      `correlation.${key}`,
      id.toString()
    );
  }

  /**
   * Returns metadata correlation id for message.
   * @param key - Key under which correlation is set with support of dotted notation for nested objects.
   * @returns String identifier of correlating element.
   */
  public getCorrelationId(key: string): string | undefined {
    if (!this.hasMetadata()) {
      return undefined;
    }
    return get(this.metadata, `correlation.${key}`);
  }

  /**
   * Evaluates if message contains correlation id on metadata.
   * @param key - Key under which correlation is set with support of dotted notation for nested objects.
   * @returns Returns `true` if metadata contains correlated element, else `false`.
   */
  public hasCorrelationId(key: string): boolean {
    if (!this.hasMetadata()) {
      return false;
    }
    return has(this.metadata, `correlation.${key}`);
  }
}
