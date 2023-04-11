import { define } from '@eveble/core';
import { Guid } from '../../../src/domain/value-objects/guid';
import { DomainException } from '../../../src/domain/domain-exception';
import { Event } from '../../../src/components/event';

@define()
export class EmployeeCreated extends Event<EmployeeCreated> {
  firstName: string;

  lastName: string;

  points: number;

  taskListsIds: Guid[];
}

@define()
export class TaskListAssignedToEmployee extends Event<TaskListAssignedToEmployee> {
  taskListId: Guid;
}

@define()
export class EmployeeProductivityEstimated extends Event<EmployeeProductivityEstimated> {
  estimatedPoints: number;

  points: number;
}

@define()
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
@define()
export class CancelingEmploymentInitiated extends Event<CancelingEmploymentInitiated> {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@define()
export class CancelingEmploymentCompleted extends Event<CancelingEmploymentCompleted> {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@define()
export class CancelingEmploymentFailed extends Event<CancelingEmploymentFailed> {
  employeeId: Guid;

  exception: DomainException;
}
// Employee Termination
@define()
export class EmployeeTerminationInitiated extends Event<EmployeeTerminationInitiated> {
  employeeId: Guid;
}

@define()
export class EmployeeTerminationCompleted extends Event<EmployeeTerminationCompleted> {
  employeeId: Guid;

  taskListsIds: Guid[];
}

// Closing task lists
@define()
export class ClosingEmployeeTaskListsInitiated extends Event<ClosingEmployeeTaskListsInitiated> {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@define()
export class AddedClosedEmployeeTaskList extends Event<AddedClosedEmployeeTaskList> {
  employeeId: Guid;

  taskListId: Guid;
}

@define()
export class ClosingEmployeeTaskListsCompleted extends Event<ClosingEmployeeTaskListsCompleted> {
  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}
