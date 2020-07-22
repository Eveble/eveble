import { define } from '@eveble/core';
import { route } from '../../../src/annotations/route';
import { Aggregate } from '../../../src/domain/aggregate';
import {
  CreateEmployee,
  AssignTaskListToEmployee,
  EstimateEmployeeProductivity,
  TerminateEmployee,
} from './employee-commands';
import {
  EmployeeCreated,
  TaskListAssignedToEmployee,
  EmployeeProductivityEstimated,
  EmployeeTerminated,
} from './employee-events';
import { subscribe } from '../../../src/annotations/subscribe';
import { initial } from '../../../src/annotations/initial';
import { Guid } from '../../../src/domain/value-objects/guid';
import { DomainError } from '../../../src/domain/domain-error';

@define()
export class EmployeeTerminatedError extends DomainError {
  constructor(employeeId: string) {
    super(
      `Can't add new productivity points to terminated employee with id '${employeeId}'`
    );
  }
}

@define()
export class EmployeeAlreadyTerminatedError extends DomainError {
  constructor(employeeId: string) {
    super(
      `Can't terminate already terminated employee with id '${employeeId}'`
    );
  }
}

@define()
export class TaskListAlreadyAssignedError extends DomainError {
  constructor(employeeId: string, taskListId: string) {
    super(
      `Task list with id '${taskListId}' is already assigned to employee with id '${employeeId}'`
    );
  }
}

@define()
export class Employee extends Aggregate {
  static STATES = {
    active: 'active',
    terminated: 'terminated',
  };

  firstName: string;

  lastName: string;

  points: number;

  taskListsIds: Guid[];

  /*
  HANDLES
  */
  CreateEmployee(@initial command: CreateEmployee): void {
    const { firstName, lastName } = command;
    this.record(
      new EmployeeCreated({
        ...this.eventProps(),
        firstName,
        lastName,
        points: 0,
        taskListsIds: [],
      })
    );
  }

  EstimateEmployeeProductivity(
    @route command: EstimateEmployeeProductivity
  ): void {
    if (this.isInState('terminated')) {
      throw new EmployeeTerminatedError(this.getId().toString());
    }

    this.record(
      new EmployeeProductivityEstimated({
        ...this.eventProps(),
        estimatedPoints: command.estimatedPoints,
        points: this.points,
      })
    );
  }

  AssignTaskListToEmployee(@route command: AssignTaskListToEmployee): void {
    const { taskListId } = command;
    if (this.hasTaskListAssigned(taskListId)) {
      throw new TaskListAlreadyAssignedError(
        this.getId().toString(),
        taskListId.toString()
      );
    }
    this.record(
      new TaskListAssignedToEmployee({
        ...this.eventProps(),
        taskListId,
      })
    );
  }

  TerminateEmployee(@route _command: TerminateEmployee): void {
    if (this.isInState('terminated')) {
      throw new EmployeeAlreadyTerminatedError(this.getId().toString());
    }
    this.record(
      new EmployeeTerminated({
        ...this.eventProps(),
        firstName: this.firstName,
        lastName: this.lastName,
        points: this.points,
        taskListsIds: this.taskListsIds,
      })
    );
  }

  /**
   * Determines whether task list is assigned to Employee.
   * @param taskListId - Task list identifier.
   * @returns Returns `true` if task list is assigned to employee, else `false`.
   */
  protected hasTaskListAssigned(taskListId: Guid): boolean {
    for (const id of this.taskListsIds) {
      if (id.equals(taskListId)) {
        return true;
      }
    }
    return false;
  }

  /*
  SUBSCRIPTIONS
  */
  EmployeeCreated(@subscribe event: EmployeeCreated): void {
    this.assign(event);
    this.setState(Employee.STATES.active);
  }

  TaskListAssignedToEmployee(
    @subscribe event: TaskListAssignedToEmployee
  ): void {
    this.taskListsIds.push(event.taskListId);
  }

  EmployeeProductivityEstimated(
    @subscribe event: EmployeeProductivityEstimated
  ): void {
    this.points += event.estimatedPoints;
  }

  EmployeeTerminated(@subscribe _event: EmployeeTerminated): void {
    this.setState(Employee.STATES.terminated);
  }
}
