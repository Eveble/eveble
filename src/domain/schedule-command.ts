import { get } from 'lodash';
import { define } from '../decorators/define';
import { Command, Assignment } from '../components/command';

@define('ScheduleCommand')
export class ScheduleCommand extends Command {
  public command: Command;

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
  public getAssignment(): Assignment {
    return get(this, 'metadata.scheduling');
  }
}
