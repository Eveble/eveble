import { define } from '../decorators/define';
import { Command } from '../components/command';
import { types } from '../types';
import { Guid } from './value-objects/guid';

@define('UnscheduleCommand')
export class UnscheduleCommand extends Command {
  assignmentId: string | Guid;

  commandType: types.TypeName;

  assignerId: string | Guid;

  assignerType: types.TypeName;
}
