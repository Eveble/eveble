import { injectable } from '@parisholley/inversify-async';
import { ExpireTask } from './task-commands';
import { TaskList } from './task-list';
import { Guid } from '../../../src/domain/value-objects/guid';

@injectable()
export class ExpiringTaskCompletionPolicy {
  protected expireIn: number;

  /**
   * Creates an instance of `ExpiringTaskCompletionPolicy`.
   * @param expireIn - The amount of time in milliseconds after which `Task` will expire.
   */
  constructor(expireIn: number = 1 * 60 * 60 * 1000) {
    this.expireIn = expireIn;
  }

  /**
   * Applies expiring policy to created `Task` in `TaskList`.
   * @param taskList - `TaskList` instance on which policy is applied.
   * @param taskId - `Task` identifier to which policy should be applied.
   */
  public implement(taskList: TaskList, taskId: Guid): void {
    const expireAt = new Date(new Date().getTime() + this.expireIn);
    const expiryCommand = new ExpireTask({
      targetId: taskList.getId(),
      id: taskId,
      expireAt,
    });
    taskList.schedule(expiryCommand, expireAt, taskId);
  }

  /**
   * Cancels expiring policy for `Task` in `TaskList`.
   * @param taskList - `TaskList` instance on which policy is cancelled.
   * @param taskId - Identifier of a `Task` which policy should be cancelled.
   */
  public cancel(taskList: TaskList, taskId: Guid): void {
    taskList.unschedule(taskId, ExpireTask);
  }

  /**
   * Sets expiration duration for policy.
   * @param expireIn - The amount of time in milliseconds after which `Task` will expire.
   */
  public setExpirationDuration(expireIn: number): void {
    this.expireIn = expireIn;
  }
}
