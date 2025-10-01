import { Type } from '@eveble/core';
import { Guid } from '../../../src/domain/value-objects/guid';
import { DomainException } from '../../../src/domain/domain-exception';
import { Event } from '../../../src/components/event';

@Type()
export class EmployeeCreated extends Event<EmployeeCreated> {
  firstName: string;

  lastName: string;

  points: number;

  taskListsIds: Guid[];
}

@Type()
export class TaskListAssignedToEmployee extends Event<TaskListAssignedToEmployee> {
  taskListId: Guid;
}

@Type()
export class EmployeeProductivityEstimated extends Event<EmployeeProductivityEstimated> {
  estimatedPoints: number;

  points: number;
}

@Type()
export class EmployeeTerminated extends Event<EmployeeTerminated> {
  firstName: string;

  lastName: string;

  points: number;

  taskListsIds: Guid[];
}

/*
CANCELING EMPLOYMENT
*/
// Process
@Type()
export class CancelingEmploymentInitiated extends Event<CancelingEmploymentInitiated> {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@Type()
export class CancelingEmploymentCompleted extends Event<CancelingEmploymentCompleted> {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@Type()
export class CancelingEmploymentFailed extends Event<CancelingEmploymentFailed> {
  employeeId: Guid;

  exception: DomainException;
}
// Employee Termination
@Type()
export class EmployeeTerminationInitiated extends Event<EmployeeTerminationInitiated> {
  employeeId: Guid;
}

@Type()
export class EmployeeTerminationCompleted extends Event<EmployeeTerminationCompleted> {
  employeeId: Guid;

  taskListsIds: Guid[];
}

// Closing task lists
@Type()
export class ClosingEmployeeTaskListsInitiated extends Event<ClosingEmployeeTaskListsInitiated> {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@Type()
export class AddedClosedEmployeeTaskList extends Event<AddedClosedEmployeeTaskList> {
  employeeId: Guid;

  taskListId: Guid;
}

@Type()
export class ClosingEmployeeTaskListsCompleted extends Event<ClosingEmployeeTaskListsCompleted> {
  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}
