import { has, get } from 'lodash';
import { Type } from '@eveble/core';
import { Message } from './message';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
import { Serializable } from './serializable';
import { DEFAULT_PROPS_KEY } from '../constants/metadata-keys';

@Type('Assignment')
export class Assignment extends Serializable implements types.Assignment {
  assignmentId: Guid | string; // Assignment id

  deliverAt: Date;

  assignerId: Guid | string; // Source of entity that scheduled command

  assignerType: types.TypeName; // Entities type name that scheduled command
}

@Type('Command')
export class Command<
    T extends {
      [key: string]: any;
    }
  >
  extends Message
  implements types.Command, types.Identifiable
{
  public targetId: Guid | string;

  /**
   * Creates an instance of Message.
   * @param props - Properties matching generic `T` with `targetId` as `Guid|string`.
   */
  constructor(
    props: types.ConstructorType<T> & {
      targetId: Guid | string;
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
   * Returns command's targeted element by id.
   * @return Command's target identifier as a instance of `Guid` or string.
   */
  public getId(): Guid | string {
    return this.targetId;
  }

  /**
   * Schedules command for delivery at specific time.
   * @param assignment - Scheduling assignment information.
   */
  public schedule(assignment: Assignment): void {
    this.assignMetadata({
      scheduling: assignment,
    });
  }

  /**
   * Returns scheduling assignment if present.
   * @returns Instance of `Assignment`, else `undefined`.
   */
  public getAssignment(): Assignment | undefined {
    return get(this, 'metadata.scheduling', undefined);
  }

  /**
   * Evaluates if command is scheduled for delivery.
   * @returns Returns `true` if command is scheduled, else `false`.
   */
  public isScheduled(): boolean {
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
  public isDeliverable(): boolean {
    const metadata = this.getMetadata();
    return (
      this.isScheduled() &&
      new Date().getTime() >= metadata?.scheduling?.deliverAt
    );
  }
}
