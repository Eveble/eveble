import { Type } from '@eveble/core';
import { Command } from '../components/command';
import { types } from '../types';
import { Guid } from './value-objects/guid';

@Type('UnscheduleCommand')
export class UnscheduleCommand extends Command<UnscheduleCommand> {
  assignmentId: string | Guid;

  commandType: types.TypeName;

  assignerId: string | Guid;

  assignerType: types.TypeName;
}
