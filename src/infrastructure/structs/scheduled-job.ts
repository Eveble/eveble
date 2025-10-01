import { classes } from 'polytype';
import { Type } from '@eveble/core';
import { StatefulMixin } from '../../mixins/stateful-mixin';
import { types } from '../../types';
import { Guid } from '../../domain/value-objects/guid';
import { Struct } from '../../components/struct';

@Type()
export class ScheduledJob
  extends classes(Struct, StatefulMixin)
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
   * @remarks
   * Since were dealing with special cases, mixins and limits of TypeScript, we
   * use of "invoking multiple base constructors" from polytype to pass props to Struct's
   * constructor:
   * https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors
   */
  constructor(props: types.Props = {}) {
    super([props]);
    if (props.state) {
      this.setState(props.state);
    }
  }
}
