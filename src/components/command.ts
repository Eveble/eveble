import { has } from 'lodash';
import { Message } from './message';
import { define } from '../decorators/define';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
import { Struct } from './struct';

@define('Appointment')
export class Appointment extends Struct {
  id: Guid | string; // Appointment id

  deliverAt: Date;

  sourceId: Guid | string; // Source of entity that scheduled command

  sourceTypeName: types.TypeName; // Entities type name that scheduled command
}

@define('Command')
export abstract class Command extends Message {
  targetId: Guid | string;

  /**
   * Returns command's targeted element by id.
   * @return Command's target identifier as a instance of `Guid` or string.
   */
  getId(): Guid | string {
    return this.targetId;
  }

  /**
   * Schedules command for delivery at specific time.
   * @param appointment - Scheduling appointment information.
   */
  schedule(appointment: Appointment): void {
    this.assignMetadata({
      scheduling: appointment,
    });
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