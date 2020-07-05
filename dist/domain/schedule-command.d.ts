import { Command, Assignment } from '../components/command';
export declare class ScheduleCommand extends Command {
    command: Command;
    isDeliverable(): boolean;
    getDeliveryDate(): Date;
    getAssignment(): Assignment;
}
