import { taskTypes } from './task-types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Command } from '../../../src/components/command';
import { define } from '../../../src/decorators/define';

/*
TASK LIST
*/
@define()
export class CreateTaskList extends Command<CreateTaskList> {
  title: string;
}

@define()
export class AssignTaskList extends Command<AssignTaskList> {
  employeeId: Guid;
}

@define()
export class OpenTaskList extends Command<OpenTaskList> {}

@define()
export class CloseTaskList extends Command<CloseTaskList> {}

/*
TASK
*/
@define()
export class CreateTask extends Command<CreateTask> {
  id: Guid;

  name: string;

  priority: number;
}

@define()
export class ChangeTaskPriority extends Command<ChangeTaskPriority> {
  id: Guid;

  priority: taskTypes.Priority;
}

@define()
export class AcceptTask extends Command<AcceptTask> {
  id: Guid;
}

@define()
export class DeclineTask extends Command<DeclineTask> {
  id: Guid;

  reason: string;
}

@define()
export class StartTask extends Command<StartTask> {
  id: Guid;
}

@define()
export class CompleteTask extends Command<CompleteTask> {
  id: Guid;
}

@define()
export class PostponeTask extends Command<PostponeTask> {
  id: Guid;

  tillAt: Date;
}

@define()
export class QuitTask extends Command<QuitTask> {
  id: Guid;
}

@define()
export class HoldTask extends Command<HoldTask> {
  id: Guid;
}

@define()
export class ExpireTask extends Command<ExpireTask> {
  id: Guid;

  expireAt: Date;
}
