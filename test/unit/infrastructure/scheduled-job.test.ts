import { expect, describe, it, beforeAll } from 'vitest';

import { ValidationError } from 'typend';
import { ScheduledJob } from '../../../src/infrastructure/structs/scheduled-job';
import { Struct } from '../../../src/components/struct';
import { Guid } from '../../../src/domain/value-objects/guid';

describe(`ScheduledJob`, () => {
  let now: any;
  beforeAll(() => {
    now = new Date();
  });

  it(`extends Struct`, () => {
    expect(ScheduledJob.prototype).toBeInstanceOf(Struct);
  });

  describe(`construction`, () => {
    it('takes Object with required properties: id as a Guid, name as a String, data as an Object, priority as a String and assigns them', () => {
      const props = {
        id: new Guid(),
        name: 'my-name',
        data: {},
        priority: 'lowest',
      };
      const scheduledJob = new ScheduledJob(props);
      expect(scheduledJob.id).toBe(props.id);
      expect(scheduledJob.name).toBe('my-name');
      expect(scheduledJob.data).toEqual({});
      expect(scheduledJob.priority).toBe('lowest');
    });

    it('allows to set required property id as a string', () => {
      const props = {
        id: 'my-id',
        name: 'my-name',
        data: {},
        priority: 'lowest',
      };
      const scheduledJob = new ScheduledJob(props);
      expect(scheduledJob.id).toBeTypeOf('string');
    });

    it('allows to set required: priority to on of allowed String values', () => {
      const props = {
        id: 'my-id',
        name: 'my-name',
        data: {},
      };
      const lowestPriorityJob = new ScheduledJob({
        ...props,
        priority: 'lowest',
      });
      expect(lowestPriorityJob.priority).toBe('lowest');
      const lowPriorityJob = new ScheduledJob({
        ...props,
        priority: 'low',
      });
      expect(lowPriorityJob.priority).toBe('low');
      const normalPriorityJob = new ScheduledJob({
        ...props,
        priority: 'normal',
      });
      expect(normalPriorityJob.priority).toBe('normal');
      const highPriorityJob = new ScheduledJob({
        ...props,
        priority: 'high',
      });
      expect(highPriorityJob.priority).toBe('high');
      const highestPriorityJob = new ScheduledJob({
        ...props,
        priority: 'highest',
      });
      expect(highestPriorityJob.priority).toBe('highest');
    });

    it('allows to set required: priority as numeric value', () => {
      const props = {
        id: 'my-id',
        name: 'my-name',
        data: {},
        priority: 0,
      };
      const scheduledJob = new ScheduledJob(props);
      expect(scheduledJob.priority).toBeTypeOf('number');
    });

    it('takes optional properties: nextRunAt, completedAt, lockedAt, lastRunAt, failedAt as Dates', () => {
      const props = {
        id: 'my-id',
        name: 'my-name',
        data: {},
        priority: 0,
        nextRunAt: now,
        completedAt: now,
        lockedAt: now,
        lastRunAt: now,
        failedAt: now,
      };
      const scheduledJob = new ScheduledJob(props);
      expect(scheduledJob.nextRunAt).toBeInstanceOf(Date);
      expect(scheduledJob.nextRunAt).toBe(now);
      expect(scheduledJob.completedAt).toBeInstanceOf(Date);
      expect(scheduledJob.completedAt).toBe(now);
      expect(scheduledJob.lockedAt).toBeInstanceOf(Date);
      expect(scheduledJob.lockedAt).toBe(now);
      expect(scheduledJob.lastRunAt).toBeInstanceOf(Date);
      expect(scheduledJob.lastRunAt).toBe(now);
      expect(scheduledJob.failedAt).toBeInstanceOf(Date);
      expect(scheduledJob.failedAt).toBe(now);
    });
  });

  describe('working with state', () => {
    const props: Record<string, any> = {
      id: 'my-id',
      name: 'my-name',
      data: {},
      priority: 0,
    };

    it(`allows to set state on scheduled job `, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
        state: ScheduledJob.STATES.enqueued,
      });
      expect(scheduledJob.getState()).toBe(ScheduledJob.STATES.enqueued);
      scheduledJob.setState(ScheduledJob.STATES.started);
      expect(scheduledJob.getState()).toBe(ScheduledJob.STATES.started);
    });

    it(`returns true if scheduled job is in state`, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
        state: ScheduledJob.STATES.enqueued,
      });
      expect(scheduledJob.isInState(ScheduledJob.STATES.enqueued)).toBe(true);
    });

    it(`returns false if scheduled job is not in state`, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
        state: ScheduledJob.STATES.enqueued,
      });
      expect(scheduledJob.isInState(ScheduledJob.STATES.started)).toBe(false);
    });

    it(`returns true if scheduled job has state`, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
        state: ScheduledJob.STATES.enqueued,
      });
      expect(scheduledJob.hasState()).toBe(true);
    });

    it(`returns false if scheduled job has no assigned state`, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
      });
      expect(scheduledJob.hasState()).toBe(false);
    });

    it('allows only available states to be set', () => {
      expect(ScheduledJob.STATES).toEqual({
        enqueued: 'enqueued',
        started: 'started',
        locked: 'locked',
        failed: 'failed',
        completed: 'completed',
        removed: 'removed',
      });
    });

    it('throws ValidationError if state is not in one of allowed values on creation', () => {
      expect(() => {
        new ScheduledJob({ ...props, state: 'notValidState' });
      }).toThrow(
        ValidationError,
        `Expected String("notValidState") to be one of: String("enqueued"), String("started"), String("locked"), String("failed"), String("completed"), String("removed")`
      );
    });

    it('throws ValidationError if state is not in one of allowed values on state change', () => {
      const scheduledJob = new ScheduledJob({
        ...props,
        state: ScheduledJob.STATES.enqueued,
      });
      expect(() => {
        scheduledJob.setState('notValidState');
      }).toThrow(
        ValidationError,
        `Expected String("notValidState") to be one of: String("enqueued"), String("started"), String("locked"), String("failed"), String("completed"), String("removed")`
      );
    });
  });
});
