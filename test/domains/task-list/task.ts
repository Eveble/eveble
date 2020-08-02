import { define } from '@eveble/core';
import { Entity } from '../../../src/domain/entity';
import { StateError } from '../../../src/mixins/stateful-mixin';
import { types } from '../../../src/types';

@define()
export class NoQuittingFoolError extends StateError {
  constructor() {
    super('I pitty you fool!');
  }
}

@define()
export class TaskAlreadyCompletedError extends StateError {
  constructor(id) {
    super(`Task '${id}' is already completed!`);
  }
}

@define()
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

  changePriority(priority: 0 | 1 | 2 | 3): void {
    this.priority = priority;
  }

  expire(): void {
    this.on('accept').ensure.is.not.inState(Task.STATES.completed);

    this.setState(Task.STATES.expired);
  }

  accept(): void {
    this.on('accept').ensure.is.inState(Task.STATES.created);

    this.setState(Task.STATES.accepted);
  }

  decline(declineReason: string): void {
    this.on('decline').ensure.is.inState(Task.STATES.created);

    this.declineReason = declineReason;
    this.setState(Task.STATES.declined);
  }

  start(): void {
    this.on('start').ensure.is.inOneOfStates([
      Task.STATES.accepted,
      Task.STATES.postponed,
    ]);

    this.setState(Task.STATES.started);
  }

  complete(): void {
    this.on('complete').ensure.is.not.inState(
      'completed',
      new TaskAlreadyCompletedError(this.getId())
    );

    this.setState(Task.STATES.completed);
  }

  postpone(postponedAt: Date): void {
    this.on('postpone').ensure.is.not.inOneOfStates([
      Task.STATES.postponed,
      Task.STATES.completed,
    ]);

    this.postponedAt = postponedAt;
    this.setState(Task.STATES.postponed);
  }

  quit(): void {
    this.on('quit').ensure.is.not.inOneOfStates(
      [Task.STATES.started, Task.STATES.postponed],
      NoQuittingFoolError
    );

    this.setState(Task.STATES.quitted);
  }

  hold(): void {
    this.on('hold')
      .ensure.is.not.inState(Task.STATES.created)
      .ensure.is.not.inState('completed');

    this.setState(Task.STATES.hold);
  }
}
