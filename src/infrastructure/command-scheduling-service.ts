import { inject, injectable } from 'inversify';
import { Service } from './service';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';
import { ScheduleCommand } from '../domain/schedule-command';
import { UnscheduleCommand } from '../domain/unschedule-command';
import { handle } from '../annotations/handle';

@injectable()
export class CommandSchedulingService extends Service {
  @inject(BINDINGS.CommandScheduler)
  protected scheduler: types.CommandScheduler;

  @inject(BINDINGS.CommandBus)
  public commandBus: types.CommandBus;

  @inject(BINDINGS.EventBus)
  public eventBus: types.EventBus;

  /**
   * Handles scheduling delayed commands with scheduler or sends command immediately if its deliverable.
   * @async
   * @param scheduleCommand - Instance of `ScheduleCommand`.
   */
  async ScheduleCommand(
    @handle scheduleCommand: ScheduleCommand
  ): Promise<void> {
    if (scheduleCommand.isDeliverable()) {
      await this.commandBus.send(scheduleCommand.command);
    } else {
      await this.scheduler.schedule(scheduleCommand);
    }
  }

  /**
   * Unschedules command from scheduler.
   * @async
   * @param unscheduleCommand - Instance of `UnscheduleCommand`.
   */
  async UnscheduleCommand(
    @handle unscheduleCommand: UnscheduleCommand
  ): Promise<void> {
    await this.scheduler.unschedule(unscheduleCommand);
  }
}
