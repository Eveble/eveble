import { get } from 'lodash';
import { Type } from '@eveble/core';
import { Command, Assignment } from '../components/command';
import { types } from '../types';

@Type('ScheduleCommand')
export class ScheduleCommand extends Command<ScheduleCommand> {
  public command: types.Command;

  /**
   * Evaluates if command is deliverable.
   * @returns Returns `true` if command is deliverable, else `false`.
   */
  public isDeliverable(): boolean {
    const metadata = this.command.getMetadata();
    return new Date().getTime() >= metadata?.scheduling.deliverAt.getTime();
  }

  /**
   * Gets delivery date for scheduled command.
   * @returns Instance of a `Date`.
   */
  public getDeliveryDate(): Date {
    const metadata = this.command.getMetadata();
    return metadata?.scheduling.deliverAt;
  }

  /**
   * Returns scheduling assignment if present.
   * @returns Instance of `Assignment`, else `undefined`.
   */
  public getAssignment(): Assignment | any {
    return get(this, 'metadata.scheduling');
  }
}
