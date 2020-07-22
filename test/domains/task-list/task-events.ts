import { define } from '@eveble/core';
import { Task } from './task';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Event } from '../../../src/components/event';
import { DomainException } from '../../../src/domain/domain-exception';
import { taskTypes } from './task-types';

/*
TASK LIST
*/
@define()
export class TaskListCreated extends Event<TaskListCreated> {
  title: string;

  tasks: Task[];
}

@define()
export class TaskListAssigned extends Event<TaskListAssigned> {
  employeeId: Guid;
}

@define()
export class TaskListOpened extends Event<TaskListOpened> {
  title: string;

  tasks: Task[];
}

@define()
export class TaskListClosed extends Event<TaskListClosed> {
  title: string;

  tasks: Task[];
}

/*
TASK
*/
@define()
export class TaskCreated extends Event<TaskCreated> {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskPriorityChanged extends Event<TaskPriorityChanged> {
  task: Task;

  priority: taskTypes.Priority;

  employeeId?: Guid;
}

@define()
export class TaskAccepted extends Event<TaskAccepted> {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskDeclined extends Event<TaskDeclined> {
  task: Task;

  employeeId?: Guid;

  reason: string;
}

@define()
export class TaskStarted extends Event<TaskStarted> {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskCompleted extends Event<TaskCompleted> {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskPostponed extends Event<TaskPostponed> {
  task: Task;

  employeeId?: Guid;

  tillAt: Date;
}

@define()
export class TaskQuitted extends Event<TaskQuitted> {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskHold extends Event<TaskHold> {
  task: Task;

  employeeId?: Guid;
}

@define()
export class TaskExpired extends Event<TaskExpired> {
  task: Task;

  employeeId?: Guid;
}

/*
PRODUCTIVITY REWARDING
*/
@define()
export class ProductivityEstimationInitiated extends Event<
  ProductivityEstimationInitiated
> {
  taskId: Guid;

  employeeId: Guid;

  estimatedPoints: number;
}

@define()
export class ProductivityEstimationCompleted extends Event<
  ProductivityEstimationCompleted
> {}

@define()
export class ProductivityEstimationFailed extends Event<
  ProductivityEstimationFailed
> {
  exception: DomainException;
}
