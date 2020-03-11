import { EstimateEmployeeProductivity } from './employee-commands';
import { EmployeeProductivityEstimated } from './employee-events';
import { DomainError } from '../../../src/domain/domain-error';
import { initial } from '../../../src/annotations/initial';
import { Process } from '../../../src/domain/process';
import { Guid } from '../../../src/domain/value-objects/guid';
import {
  TaskCompleted,
  ProductivityEstimationInitiated,
  ProductivityEstimationCompleted,
  ProductivityEstimationFailed,
} from '../task-list/task-events';
import { subscribe } from '../../../src/annotations/subscribe';
import { DomainException } from '../../../src/domain/domain-exception';
import { Task } from '../task-list/task';
import { route } from '../../../src/annotations/route';
import { define } from '../../../src/decorators/define';

@define()
export class ProductivityEstimationUnavailableForEmployeeError extends DomainError {
  constructor(employeeId: string) {
    super(
      `Productivity estimation for employee with id '${employeeId}' is unavailable`
    );
  }
}

@define()
export class ProductivityEstimation extends Process {
  static STATES = {
    initiated: 'initiated',
    completed: 'completed',
    failed: 'failed',
  };

  taskId: Guid;

  employeeId: Guid;

  estimatedPoints: number;

  TaskCompleted(@initial event: TaskCompleted): void {
    if (event.employeeId === undefined) {
      return;
    }
    const { task, employeeId } = event;
    if (employeeId?.toString() === '51a1849f-472f-45ca-92c7-5c3d5f353d40') {
      throw new ProductivityEstimationUnavailableForEmployeeError(
        employeeId.toString()
      );
    }

    const estimatedPoints = this.estimateProductivityPoints(task);
    this.record(
      new ProductivityEstimationInitiated({
        ...this.eventProps(),
        taskId: task.getId(),
        employeeId,
        estimatedPoints,
      })
    );

    this.trigger(
      new EstimateEmployeeProductivity({
        targetId: employeeId,
        estimatedPoints,
      })
    );
  }

  ProductivityEstimationInitiated(
    @subscribe event: ProductivityEstimationInitiated
  ): void {
    this.assign(event);
    this.setState(ProductivityEstimation.STATES.initiated);
  }

  EmployeeProductivityEstimated(
    @route _event: EmployeeProductivityEstimated
  ): void {
    this.record(new ProductivityEstimationCompleted(this.eventProps()));
  }

  ProductivityEstimationCompleted(
    @subscribe _event: ProductivityEstimationCompleted
  ): void {
    this.setState(ProductivityEstimation.STATES.completed);
  }

  DomainException(@route exception: DomainException): void {
    this.record(
      new ProductivityEstimationFailed({ ...this.eventProps(), exception })
    );
  }

  ProductivityEstimationFailed(
    @subscribe _event: ProductivityEstimationFailed
  ): void {
    this.setState(ProductivityEstimation.STATES.failed);
  }

  /**
   * Estimates productivity points for Task.
   * @param task - `Task` instance.
   * @returns Number of productivity points.
   */
  protected estimateProductivityPoints(task: Task): number {
    let points = 0;
    if (task.priority === 0) {
      points = 1;
    } else {
      points = task.priority * 2;
    }
    return points;
  }
}
