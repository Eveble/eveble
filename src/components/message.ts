import 'reflect-metadata';
import { has, set, get, isEmpty } from 'lodash';
import merge from 'deepmerge';
import { Serializable } from './serializable';
import { isPlainRecord } from '../utils/helpers';
import { define } from '../decorators/define';
import { types } from '../types';

@define('Message')
export class Message extends Serializable implements types.Message {
  /**
   * @remarks
   * Exposed as optional - but always assigned with use of
   * `Message.prototype.processProps` for easier interaction.
   */
  public timestamp?: Date;

  /**
   * @remarks
   * Since Command & Event are frozen after construction, metadata
   * property must be assigning on construction. This ensures that
   * content of message is immutable; however metadata as an object will
   * be unaffected by Object.freeze - thus allowing for additional data
   * to be assigned later on.
   * Exposed as optional - but always assigned with use of
   * `Message.prototype.processProps` for easier interaction.
   */
  public metadata?: Record<string, any>;

  /**
   * Creates an instance of Message.
   * @param props - Properties of the type required for construction.
   * @remarks
   * Since were dealing with special cases, mixins and limits of TypeScript, we
   * use of "invoking multiple base constructors" from polytype to pass props to Struct's
   * constructor:
   * https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors
   */
  constructor(props: types.Props = {}) {
    super(props);
  }

  /**
   * Processes properties for Message.
   * @param props - Properties of the type required for construction.
   * @returns Processed properties with any registered `onConstruction` hooks and
   * validates them against prop types.
   */
  protected processProps(props: types.Props = {}): types.Props {
    const processedProps: types.Props = { ...props };
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
    return this.timestamp as Date;
  }

  /**
   * Assigns metadata to message.
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
    return this.metadata || {};
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
