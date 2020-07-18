import { Command, Assignment } from '../components/command';
import { types } from '../types';
export declare class ScheduleCommand extends Command<ScheduleCommand> {
    command: types.Command;
    isDeliverable(): boolean;
    getDeliveryDate(): Date;
    getAssignment(): Assignment;
}
