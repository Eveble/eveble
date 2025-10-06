import { Type } from 'typend';
import { types } from '../types';

@Type()
export class History extends Array {
  /**
   * Creates an instance of History.
   * @param events - List of all events that already happen on `EventSourceable`.
   */
  constructor(events: types.Event[]) {
    super();
    this.push(...events);
  }

  /**
   * Returns initializing message.
   * @returns Returns initializing message as instance implementing `Event` interface.
   */
  getInitializingMessage(): types.Event {
    return this[0];
  }
}
