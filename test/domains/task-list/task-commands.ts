import { Type } from '@eveble/core';
import { taskTypes } from './task-types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Command } from '../../../src/components/command';

/*
TASK LIST
*/
@Type()
export class CreateTaskList extends Command<CreateTaskList> {
  title: string;
}

@Type()
export class AssignTaskList extends Command<AssignTaskList> {
  employeeId: Guid;
}

@Type()
export class OpenTaskList extends Command<OpenTaskList> {}

@Type()
export class CloseTaskList extends Command<CloseTaskList> {}

/*
TASK
*/
@Type()
export class CreateTask extends Command<CreateTask> {
  id: Guid;

  name: string;

  priority: number;
}

@Type()
export class ChangeTaskPriority extends Command<ChangeTaskPriority> {
  id: Guid;

  priority: taskTypes.Priority;
}

@Type()
export class AcceptTask extends Command<AcceptTask> {
  id: Guid;
}

@Type()
export class DeclineTask extends Command<DeclineTask> {
  id: Guid;

  reason: string;
}

@Type()
export class StartTask extends Command<StartTask> {
  id: Guid;
}

@Type()
export class CompleteTask extends Command<CompleteTask> {
  id: Guid;
}

@Type()
export class PostponeTask extends Command<PostponeTask> {
  id: Guid;

  tillAt: Date;
}

@Type()
export class QuitTask extends Command<QuitTask> {
  id: Guid;
}

@Type()
export class HoldTask extends Command<HoldTask> {
  id: Guid;
}

@Type()
export class ExpireTask extends Command<ExpireTask> {
  id: Guid;

  expireAt: Date;
}
