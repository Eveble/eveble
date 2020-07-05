import { has, get } from 'lodash';
import { Message } from './message';
import { define } from '../decorators/define';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
import { Serializable } from './serializable';
import { DEFAULT_PROPS_KEY } from '../constants/metadata-keys';

@define('Assignment')
export class Assignment extends Serializable implements types.Assignment {
  assignmentId: Guid | string; // Assignment id

  deliverAt: Date;

  assignerId: Guid | string; // Source of entity that scheduled command

  assignerType: types.TypeName; // Entities type name that scheduled command
}

@define('Command')
export class Command extends Message
  implements types.Command, types.Identifiable {
  targetId: Guid | string;

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
   * Returns command's targeted element by id.
   * @return Command's target identifier as a instance of `Guid` or string.
   */
  getId(): Guid | string {
    return this.targetId;
  }

  /**
   * Schedules command for delivery at specific time.
   * @param assignment - Scheduling assignment information.
   */
  schedule(assignment: Assignment): void {
    this.assignMetadata({
      scheduling: assignment,
    });
  }

  /**
   * Returns scheduling assignment if present.
   * @returns Instance of `Assignment`, else `undefined`.
   */
  getAssignment(): Assignment | undefined {
    return get(this, 'metadata.scheduling', undefined);
  }

  /**
   * Evaluates if command is scheduled for delivery.
   * @returns Returns `true` if command is scheduled, else `false`.
   */
  isScheduled(): boolean {
    if (!this.hasMetadata()) {
      return false;
    }
    const metadata = this.getMetadata();
    return has(metadata, 'scheduling');
  }

  /**
   * Evaluates if message is deliverable(i.e. is not scheduled or is past delivery time).
   * @returns Returns `true` if command is deliverable, else `false`.
   */
  isDeliverable(): boolean {
    const metadata = this.getMetadata();
    return (
      this.isScheduled() &&
      new Date().getTime() >= metadata?.scheduling?.deliverAt
    );
  }
}
