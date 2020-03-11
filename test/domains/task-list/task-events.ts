import { Task } from './task';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Event } from '../../../src/components/event';
import { DomainException } from '../../../src/domain/domain-exception';
import { define } from '../../../src/decorators/define';
import { taskTypes } from './task-types';

/*
TASK LIST
*/
@define()
export class TaskListCreated extends Event {
  title: string;

  tasks: Task[];
}

@define()
export class TaskListAssigned extends Event {
  employeeId: Guid;
}

@define()
export class TaskListOpened extends Event {
  title: string;

  tasks: Task[];
}

@define()
export class TaskListClosed extends Event {
  title: string;

  tasks: Task[];
}

/*
TASK
*/
@define()
export class TaskCreated extends Event {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskPriorityChanged extends Event {
  task: Task;

  priority: taskTypes.Priority;

  employeeId?: Guid;
}

@define()
export class TaskAccepted extends Event {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskDeclined extends Event {
  task: Task;

  employeeId?: Guid;

  reason: string;
}

@define()
export class TaskStarted extends Event {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskCompleted extends Event {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskPostponed extends Event {
  task: Task;

  employeeId?: Guid;

  tillAt: Date;
}

@define()
export class TaskQuitted extends Event {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskHold extends Event {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskExpired extends Event {
  task: Task;

  employeeId?: Guid;
}

/*
PRODUCTIVITY REWARDING
*/
@define()
export class ProductivityEstimationInitiated extends Event {
  taskId: Guid;

  employeeId: Guid;

  estimatedPoints: number;
}

@define()
export class ProductivityEstimationCompleted extends Event {}

@define()
export class ProductivityEstimationFailed extends Event {
  exception: DomainException;
}
