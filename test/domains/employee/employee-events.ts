import { define } from '../../../src/decorators/define';
import { Guid } from '../../../src/domain/value-objects/guid';
import { DomainException } from '../../../src/domain/domain-exception';
import { Event } from '../../../src/components/event';

@define()
export class EmployeeCreated extends Event {
  firstName: string;

  lastName: string;

  points: number;

  taskListsIds: Guid[];
}

@define()
export class TaskListAssignedToEmployee extends Event {
  taskListId: Guid;
}

@define()
export class EmployeeProductivityEstimated extends Event {
  estimatedPoints: number;

  points: number;
}

@define()
export class EmployeeTerminated extends Event {
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
export class CancelingEmploymentInitiated extends Event {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@define()
export class CancelingEmploymentCompleted extends Event {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@define()
export class CancelingEmploymentFailed extends Event {
  employeeId: Guid;

  exception: DomainException;
}
// Employee Termination
@define()
export class EmployeeTerminationInitiated extends Event {
  employeeId: Guid;
}

@define()
export class EmployeeTerminationCompleted extends Event {
  employeeId: Guid;

  taskListsIds: Guid[];
}

// Closing task lists
@define()
export class ClosingEmployeeTaskListsInitiated extends Event {
  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}

@define()
export class AddedClosedEmployeeTaskList extends Event {
  employeeId: Guid;

  taskListId: Guid;
}

@define()
export class ClosingEmployeeTaskListsCompleted extends Event {
  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];
}
