import { CancelEmployment, TerminateEmployee } from './employee-commands';
import {
  // Canceling employment
  CancelingEmploymentInitiated,
  CancelingEmploymentCompleted,
  CancelingEmploymentFailed,
  // Employee termination
  EmployeeTerminationInitiated,
  EmployeeTerminated,
  EmployeeTerminationCompleted,
  // Closing tasks lists
  ClosingEmployeeTaskListsInitiated,
  AddedClosedEmployeeTaskList,
  ClosingEmployeeTaskListsCompleted,
} from './employee-events';
import { TaskListClosed } from '../task-list/task-events';
import { CloseTaskList } from '../task-list/task-commands';
import { DomainError } from '../../../src/domain/domain-error';
import { Process } from '../../../src/domain/process';
import { define } from '../../../src/decorators/define';
import { subscribe } from '../../../src/annotations/subscribe';
import { Guid } from '../../../src/domain/value-objects/guid';
import { initial } from '../../../src/annotations/initial';
import { route } from '../../../src/annotations/route';
import { DomainException } from '../../../src/domain/domain-exception';

@define()
export class CancelingEmploymentUnavailableForEmployee extends DomainError {
  constructor(employeeId: string) {
    super(
      `Canceling employment for employee with id '${employeeId}' is unavailable`
    );
  }
}

@define()
export class CancelingEmployment extends Process {
  static STATES = {
    // Employment cancellation
    initiated: 'initiated',
    // Employee termination
    'employeeTermination.initiated': 'employeeTermination.initiated',
    'employeeTermination.completed': 'employeeTermination.completed',
    'employeeTermination.failed': 'employeeTermination.failed',
    // Closing tasks lists
    'closingTaskLists.initiated': 'closingTaskLists.initiated',
    'closingTaskLists.completed': 'closingTaskLists.completed',
    // Employment cancellation
    completed: 'completed',
    failed: 'failed',
  };

  employeeId: Guid;

  taskListsIds: Guid[];

  closedTaskListsIds: Guid[];

  CancelEmployment(@initial command: CancelEmployment): void {
    const { employeeId } = command;

    if (employeeId.toString() === '51a1849f-472f-45ca-92c7-5c3d5f353d40') {
      throw new CancelingEmploymentUnavailableForEmployee(
        employeeId.toString()
      );
    }

    this.record(
      new CancelingEmploymentInitiated(
        this.pickEventProps(command, {
          taskListsIds: [],
          closedTaskListsIds: [],
        })
      )
    );

    this.record(new EmployeeTerminationInitiated(this.pickEventProps(command)));

    this.trigger(
      new TerminateEmployee({
        targetId: employeeId,
      })
    );
  }

  CancelingEmploymentInitiated(
    @subscribe event: CancelingEmploymentInitiated
  ): void {
    this.assign(event);
    this.setState(CancelingEmployment.STATES.initiated);
  }

  EmployeeTerminationInitiated(
    @subscribe _event: EmployeeTerminationInitiated
  ): void {
    this.setState(CancelingEmployment.STATES['employeeTermination.initiated']);
  }

  EmployeeTerminated(@route event: EmployeeTerminated): void {
    const { employeeId } = this;
    const { taskListsIds } = event;

    this.record(
      new EmployeeTerminationCompleted({
        ...this.eventProps(),
        employeeId,
        taskListsIds,
      })
    );

    if (taskListsIds.length > 0) {
      this.record(
        new ClosingEmployeeTaskListsInitiated({
          ...this.eventProps(),
          employeeId,
          taskListsIds,
          closedTaskListsIds: [],
        })
      );

      this.trigger(new CloseTaskList({ targetId: taskListsIds[0] }));
    } else {
      this.record(new CancelingEmploymentCompleted(this.pickEventProps()));
    }
  }

  EmployeeTerminationCompleted(
    @subscribe _event: EmployeeTerminationCompleted
  ): void {
    this.setState(CancelingEmployment.STATES['employeeTermination.completed']);
  }

  ClosingEmployeeTaskListsInitiated(
    @subscribe event: ClosingEmployeeTaskListsInitiated
  ): void {
    this.assign(event);
    this.setState(CancelingEmployment.STATES['closingTaskLists.initiated']);
  }

  TaskListClosed(@route event: TaskListClosed): void {
    this.record(
      new AddedClosedEmployeeTaskList({
        ...this.eventProps(),
        employeeId: this.employeeId,
        taskListId: event.sourceId,
      })
    );

    const closedTaskListsStrIds = this.closedTaskListsIds.map(item => {
      return item.toString();
    });

    for (const id of this.taskListsIds) {
      if (!closedTaskListsStrIds.includes(id.toString())) {
        // Iterate till all task lists are closed
        this.trigger(new CloseTaskList({ targetId: id }));
        return;
      }
    }

    const { taskListsIds, closedTaskListsIds } = this;
    this.record(
      new ClosingEmployeeTaskListsCompleted({
        ...this.eventProps(),
        taskListsIds,
        closedTaskListsIds,
      })
    );
  }

  AddedClosedEmployeeTaskList(
    @subscribe event: AddedClosedEmployeeTaskList
  ): void {
    this.closedTaskListsIds.push(event.taskListId);
  }

  ClosingEmployeeTaskListsCompleted(
    @subscribe _event: ClosingEmployeeTaskListsCompleted
  ): void {
    this.setState(CancelingEmployment.STATES['closingTaskLists.completed']);
    this.record(new CancelingEmploymentCompleted(this.pickEventProps()));
  }

  CancelingEmploymentCompleted(
    @subscribe _event: CancelingEmploymentCompleted
  ): void {
    this.setState(CancelingEmployment.STATES.completed);
  }

  // Fails
  DomainException(@route exception: DomainException): void {
    this.record(
      new CancelingEmploymentFailed({
        ...this.eventProps(),
        employeeId: this.employeeId,
        exception,
      })
    );
  }

  CancelingEmploymentFailed(
    @subscribe _event: CancelingEmploymentFailed
  ): void {
    this.setState(CancelingEmployment.STATES.failed);
  }
}
