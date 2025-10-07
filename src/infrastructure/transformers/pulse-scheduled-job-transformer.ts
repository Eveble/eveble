import { pick } from 'lodash';
import { type Job } from '@pulsecron/pulse';
import { injectable } from 'inversify';
import { ScheduledJob } from '../structs/scheduled-job';
import { types } from '../../types';

@injectable()
export class PulseScheduledJobTransformer {
  /**
   * Transforms Pulse job to framework-normalized ScheduledJob.
   * @param job - Instance implementing `Job` interface.
   * @returns Instance implementing `ScheduledJob` interface.
   */
  public transform(job: Job): types.ScheduledJob {
    const props = this.pickProps(job);
    props.state = this.determineState(job);
    return new ScheduledJob(props);
  }

  /**
   * Picks all applicable by ScheduledJob properties from Pulse's Job.
   * @param job - Instance implementing `Job` interface.
   * @returns {Object}
   */
  protected pickProps(job: Job): Record<string, any> {
    const { attrs } = job;
    const props: Record<string, any> = pick(
      attrs,
      Object.keys(ScheduledJob.getPropTypes())
    );

    Object.keys(props).forEach(
      (key) => props[key] === null && delete props[key]
    );

    if (attrs.lastFinishedAt !== undefined) {
      props.completedAt = attrs.lastFinishedAt;
    }
    props.id = attrs._id.toString();
    return props;
  }

  /**
   * Determines Pulse's Job state.
   * @param job - Instance implementing `Job` interface.
   * @returns Found applicable state, else `undefined`.
   */
  protected determineState(job: Job): types.State {
    const { attrs } = job;
    if (attrs.failedAt instanceof Date) {
      return ScheduledJob.STATES.failed;
    }

    if (attrs.lastFinishedAt instanceof Date) {
      return ScheduledJob.STATES.completed;
    }

    if (attrs.lockedAt instanceof Date) {
      return ScheduledJob.STATES.locked;
    }

    if (attrs.nextRunAt instanceof Date) {
      return ScheduledJob.STATES.enqueued;
    }
    return undefined;
  }
}
