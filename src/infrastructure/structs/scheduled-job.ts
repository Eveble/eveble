import { Type } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { StatefulTrait } from '../../traits/stateful.trait';
import { types } from '../../types';
import { Guid } from '../../domain/value-objects/guid';
import { Struct } from '../../components/struct';

@Type()
export class ScheduledJob
  extends derive(StatefulTrait, Struct)
  implements types.ScheduledJob
{
  static STATES = {
    enqueued: 'enqueued',
    started: 'started',
    locked: 'locked',
    failed: 'failed',
    completed: 'completed',
    removed: 'removed',
  };

  public id: string | Guid;

  public state: types.State;

  public name: string;

  public data: Record<string, any>;

  /*
      highest: 20,
      high: 10,
      normal: 0,
      low: -10,
      lowest: -20
    */
  public priority: 'lowest' | 'low' | 'normal' | 'high' | 'highest' | number;

  public nextRunAt?: Date;

  public completedAt?: Date;

  public lockedAt?: Date;

  public lastRunAt?: Date;

  public failedAt?: Date;

  /**
   * Creates an instance of ScheduledJob.
   * @param props - Properties of the type required for construction.
   */
  constructor(props: types.Props = {}) {
    super(props);
    if (props.state) {
      this.setState(props.state);
    }
  }
}
