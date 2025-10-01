import { Type } from '@eveble/core';
import { Entity } from '../../../src/domain/entity';
import { can } from '../../../src/decorators/can';
import { StateError } from '../../../src/mixins/stateful-mixin';
import { types } from '../../../src/types';
// import { PriorityOutOfRangeError } from './task-errors';

@Type()
export class NoQuittingFoolError extends StateError {
  constructor() {
    super('I pitty you fool!');
  }
}

@Type()
export class TaskAlreadyCompletedError extends StateError {
  constructor(id) {
    super(`Task '${id}' is already completed!`);
  }
}

@Type()
export class Task extends Entity {
  static STATES = {
    created: 'created',
    accepted: 'accepted',
    declined: 'declined',
    started: 'started',
    completed: 'completed',
    postponed: 'postponed',
    quitted: 'quitted',
    hold: 'hold',
    expired: 'expired',
  };

  name: string;

  priority: 0 | 1 | 2 | 3;

  declineReason?: string;

  postponeReason?: string;

  postponedAt?: Date;

  expireAt?: Date;

  constructor(props: types.EntityType<Task>) {
    super(props);
    if (props.state === undefined) {
      this.setState(Task.STATES.created);
    }
  }

  @can((_task: Task, priority: number) => {
    if (priority > 3) {
      throw new Error('priority');
    }
  })
  changePriority(priority: 0 | 1 | 2 | 3): void {
    this.priority = priority;
  }

  @can((task: Task) => {
    task.on('expire').ensure.is.not.inState(Task.STATES.completed);
    task.on('expire').ensure.is.not.inState(Task.STATES.completed);
  })
  expire(): void {
    this.setState(Task.STATES.expired);
  }

  @can((task: Task) => {
    task
      .on('accept')
      .ensure.is.not.inOneOfStates([
        Task.STATES.completed,
        Task.STATES.declined,
      ]);
  })
  accept(): void {
    this.setState(Task.STATES.accepted);
  }

  @can((task: Task) => {
    task.on('decline').ensure.is.inState(Task.STATES.created);
  })
  decline(declineReason: string): void {
    this.declineReason = declineReason;
    this.setState(Task.STATES.declined);
  }

  @can((task: Task) => {
    task
      .on('start')
      .ensure.is.inOneOfStates([Task.STATES.accepted, Task.STATES.postponed]);
  })
  start(): void {
    this.setState(Task.STATES.started);
  }

  @can((task: Task) => {
    task
      .on('complete')
      .ensure.is.not.inState(
        'completed',
        new TaskAlreadyCompletedError(task.getId())
      );
  })
  complete(): void {
    this.setState(Task.STATES.completed);
  }

  @can((task: Task) => {
    task
      .on('postpone')
      .ensure.is.not.inOneOfStates([
        Task.STATES.postponed,
        Task.STATES.completed,
      ]);
  })
  postpone(postponedAt: Date): void {
    this.postponedAt = postponedAt;
    this.setState(Task.STATES.postponed);
  }

  @can((task: Task) => {
    task
      .on('quit')
      .ensure.is.not.inOneOfStates(
        [Task.STATES.started, Task.STATES.postponed],
        NoQuittingFoolError
      );
  })
  quit(): void {
    this.setState(Task.STATES.quitted);
  }

  @can((task: Task) => {
    task
      .on('hold')
      .ensure.is.not.inState(Task.STATES.created)
      .ensure.is.not.inState('completed');
  })
  hold(): void {
    this.setState(Task.STATES.hold);
  }
}
