import { Message } from './message';
import { define } from '../decorators/define';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
import { DEFAULT_PROPS_KEY } from '../constants/metadata-keys';

@define('Event')
export class Event extends Message implements types.Event, types.Identifiable {
  sourceId: Guid | string;

  version?: number;

  /**
   * Creates an instance of Event.
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
   * Returns event's originating source by id.
   * @return Event's source identifier as a instance of `Guid` or string.
   */
  getId(): Guid | string {
    return this.sourceId;
  }
}
