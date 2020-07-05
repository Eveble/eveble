import { Service } from './service';
import { types } from '../types';
import { ScheduleCommand } from '../domain/schedule-command';
import { UnscheduleCommand } from '../domain/unschedule-command';
export declare class CommandSchedulingService extends Service {
    protected scheduler: types.CommandScheduler;
    commandBus: types.CommandBus;
    eventBus: types.EventBus;
    ScheduleCommand(scheduleCommand: ScheduleCommand): Promise<void>;
    UnscheduleCommand(unscheduleCommand: UnscheduleCommand): Promise<void>;
}
