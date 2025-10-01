import { Type } from '@eveble/core';
import { Task } from './task';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Event } from '../../../src/components/event';
import { DomainException } from '../../../src/domain/domain-exception';
import { taskTypes } from './task-types';

/*
TASK LIST
*/
@Type()
export class TaskListCreated extends Event<TaskListCreated> {
  title: string;

  tasks: Task[];
}

@Type()
export class TaskListAssigned extends Event<TaskListAssigned> {
  employeeId: Guid;
}

@Type()
export class TaskListOpened extends Event<TaskListOpened> {
  title: string;

  tasks: Task[];
}

@Type()
export class TaskListClosed extends Event<TaskListClosed> {
  title: string;

  tasks: Task[];
}

/*
TASK
*/
@Type()
export class TaskCreated extends Event<TaskCreated> {
  task: Task;

  employeeId?: Guid;
}

@Type()
export class TaskPriorityChanged extends Event<TaskPriorityChanged> {
  task: Task;

  priority: taskTypes.Priority;

  employeeId?: Guid;
}

@Type()
export class TaskAccepted extends Event<TaskAccepted> {
  task: Task;

  employeeId?: Guid;
}

@Type()
export class TaskDeclined extends Event<TaskDeclined> {
  task: Task;

  employeeId?: Guid;

  reason: string;
}

@Type()
export class TaskStarted extends Event<TaskStarted> {
  task: Task;

  employeeId?: Guid;
}

@Type()
export class TaskCompleted extends Event<TaskCompleted> {
  task: Task;

  employeeId?: Guid;
}

@Type()
export class TaskPostponed extends Event<TaskPostponed> {
  task: Task;

  employeeId?: Guid;

  tillAt: Date;
}

@Type()
export class TaskQuitted extends Event<TaskQuitted> {
  task: Task;

  employeeId?: Guid;
}

@Type()
export class TaskHold extends Event<TaskHold> {
  task: Task;

  employeeId?: Guid;
}

@Type()
export class TaskExpired extends Event<TaskExpired> {
  task: Task;

  employeeId?: Guid;
}

/*
PRODUCTIVITY REWARDING
*/
@Type()
export class ProductivityEstimationInitiated extends Event<ProductivityEstimationInitiated> {
  taskId: Guid;

  employeeId: Guid;

  estimatedPoints: number;
}

@Type()
export class ProductivityEstimationCompleted extends Event<ProductivityEstimationCompleted> {}

@Type()
export class ProductivityEstimationFailed extends Event<ProductivityEstimationFailed> {
  exception: DomainException;
}
