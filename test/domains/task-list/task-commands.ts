import { taskTypes } from './task-types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Command } from '../../../src/components/command';
import { define } from '../../../src/decorators/define';

/*
TASK LIST
*/
@define('CreateTaskList')
export class CreateTaskList extends Command {
  title: string;
}

@define()
export class AssignTaskList extends Command {
  employeeId: Guid;
}

@define()
export class OpenTaskList extends Command {}

@define()
export class CloseTaskList extends Command {}

/*
TASK
*/
@define()
export class CreateTask extends Command {
  id: Guid;

  name: string;

  priority: number;
}

@define()
export class ChangeTaskPriority extends Command {
  id: Guid;

  priority: taskTypes.Priority;
}

@define()
export class AcceptTask extends Command {
  id: Guid;
}

@define()
export class DeclineTask extends Command {
  id: Guid;

  reason: string;
}

@define()
export class StartTask extends Command {
  id: Guid;
}

@define()
export class CompleteTask extends Command {
  id: Guid;
}

@define()
export class PostponeTask extends Command {
  id: Guid;

  tillAt: Date;
}

@define()
export class QuitTask extends Command {
  id: Guid;
}

@define()
export class HoldTask extends Command {
  id: Guid;
}

@define()
export class ExpireTask extends Command {
  id: Guid;

  expireAt: Date;
}
