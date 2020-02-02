import { Message } from './message';
import { define } from '../decorators/define';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';

@define('Event')
export abstract class Event extends Message
  implements types.Publishable, types.Identifiable {
  sourceId: Guid | string;

  version?: number;

  /**
   * Returns event's originating source by id.
   * @return Event's source identifier as a instance of `Guid` or string.
   */
  getId(): Guid | string {
    return this.sourceId;
  }
}
