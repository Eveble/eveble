import { define } from '@eveble/core';
import { Message } from './message';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
import { DEFAULT_PROPS_KEY } from '../constants/metadata-keys';

@define('Event')
export class Event<
    T extends {
      [key: string]: any;
    }
  >
  extends Message
  implements types.Event, types.Identifiable
{
  public sourceId: Guid | string;

  public version?: number;

  /**
   * Creates an instance of Event.
   * @param props - Properties matching generic `T` with `sourceId` as `Guid|string` and
   * optional `version` as `number`.
   */
  constructor(
    props: types.ConstructorType<T> & {
      sourceId: Guid | string;
      version?: number;
    }
  ) {
    super(props);
    if (
      Reflect.getMetadata(DEFAULT_PROPS_KEY, this.constructor) === undefined
    ) {
      Object.freeze(this);
    }
  }

  /**
   * Returns event's originating source by id.
   * @return Event's source identifier as a instance of `Guid` or string.
   */
  public getId(): Guid | string {
    return this.sourceId;
  }
}
