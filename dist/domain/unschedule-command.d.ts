import { Command } from '../components/command';
import { types } from '../types';
import { Guid } from './value-objects/guid';
export declare class UnscheduleCommand extends Command {
    assignmentId: string | Guid;
    commandType: types.TypeName;
    assignerId: string | Guid;
    assignerType: types.TypeName;
}
