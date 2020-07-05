import { injectable } from '@parisholley/inversify-async';
import { TaskList } from './task-list';
import { Guid } from '../../../src/domain/value-objects/guid';

@injectable()
export class InfiniteTaskCompletionPolicy {
  /**
   * Applies expiring policy to created Task in TaskList.
   * @param _taskList - `TaskList` instance on which policy is applied.
   * @param _taskId - `Task` identifier to which policy should be applied.
   */
  implement(_taskList: TaskList, _taskId: Guid): void {
    return undefined;
  }

  /**
   * Cancels expiring policy for Task in TaskList.
   * @param _taskList - `TaskList` instance on which policy is canceled.
   * @param _taskId - Identifier of a `Task` which policy should be canceled.
   */
  cancel(_taskList: TaskList, _taskId: Guid): void {
    return undefined;
  }
}
