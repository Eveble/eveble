import { expect, describe, it, beforeEach, beforeAll } from 'vitest';

import { ObjectId } from 'mongodb';
import { ScheduledJob } from '../../../src/infrastructure/structs/scheduled-job';
import { PulseScheduledJobTransformer } from '../../../src/infrastructure/transformers/pulse-scheduled-job-transformer';

describe('PulseScheduledJobTransformer', () => {
  let now: any;
  let job: any;
  let transformer: PulseScheduledJobTransformer;

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    job = {
      attrs: {
        _id: new ObjectId('5d84acfe15bb71183f5cfee3'),
        name: 'send scheduled command',
        data: {
          commandType: 'CommandScheduling.MyCommand',
          command:
            '{"$type":"CommandScheduling.MyCommand","$value":{"timestamp":{"$date":1568976116941},"targetId":{"$type":"Guid","$value":{"id":"e8d56607-f5a6-4058-b474-51b675792d6d"}},"name":"Foo"}}',
          targetId: 'e8d56607-f5a6-4058-b474-51b675792d6d',
          targetType: 'MyEventSourceable',
          id: '80203950-44a9-41f0-aa82-5b5b91c226d4',
        },
        type: 'normal',
        priority: 0,
        nextRunAt: undefined,
        lastModifiedBy: null,
      },
    };
    transformer = new PulseScheduledJobTransformer();
  });

  it(`transforms Agenda's Job to ScheduledJob`, () => {
    const scheduledJob = transformer.transform(job);
    expect(scheduledJob).toBeInstanceOf(ScheduledJob);
    expect(scheduledJob.id).toBe('5d84acfe15bb71183f5cfee3');
    expect(scheduledJob.name).toBe('send scheduled command');
    expect(scheduledJob.priority).toBe(0);
    expect(scheduledJob.nextRunAt).toBeUndefined();
    expect((scheduledJob as any).lastModifiedBy).toBeUndefined();
    expect((scheduledJob as any).type).toBeUndefined();
    expect(scheduledJob.state).toBeUndefined();
  });

  it(`transform lastFinishedAt property name from Agenda's job to completedAt`, () => {
    job.attrs.lastFinishedAt = now;
    const scheduledJob = transformer.transform(job);
    expect(scheduledJob.completedAt).toBeInstanceOf(Date);
  });

  describe('determines scheduled job state based on available dates', () => {
    describe('failed', () => {
      it('determines failed state of job if failedAt property is present on job attrs', () => {
        job.attrs.failedAt = now;
        const scheduledJob = transformer.transform(job);
        expect(scheduledJob.isInState(ScheduledJob.STATES.failed)).toBe(true);
      });
      it('ensures precedents of determining failed state over completed, locked, enqueued states', () => {
        job.attrs.failedAt = now;
        job.attrs.lastFinishedAt = now;
        job.attrs.lockedAt = now;
        job.attrs.nextRunAt = now;

        const scheduledJob = transformer.transform(job);
        expect(scheduledJob.isInState(ScheduledJob.STATES.failed)).toBe(true);
      });
    });
    describe('completed', () => {
      it('determines completed job state if lastFinishedAt property is present on job attrs', () => {
        job.attrs.lastFinishedAt = now;
        const scheduledJob = transformer.transform(job);
        expect(scheduledJob.isInState(ScheduledJob.STATES.completed)).to.be
          .true;
      });

      it('ensures precedents of determining completed state over locked, enqueued states', () => {
        job.attrs.lastFinishedAt = now;
        job.attrs.lockedAt = now;
        job.attrs.nextRunAt = now;

        const scheduledJob = transformer.transform(job);
        expect(scheduledJob.isInState(ScheduledJob.STATES.completed)).to.be
          .true;
      });
    });
    describe('locked', () => {
      it('determines locked job state if lockedAt property is present on job attrs', () => {
        job.attrs.lockedAt = now;
        const scheduledJob = transformer.transform(job);
        expect(scheduledJob.isInState(ScheduledJob.STATES.locked)).toBe(true);
      });

      it('ensures precedents of determining locked state over enqueued state', () => {
        job.attrs.lockedAt = now;
        job.attrs.nextRunAt = now;

        const scheduledJob = transformer.transform(job);
        expect(scheduledJob.isInState(ScheduledJob.STATES.locked)).toBe(true);
      });
    });
    describe('enqueued', () => {
      it('determines enqueued job state if nextRunAt property is present on job attrs', () => {
        job.attrs.nextRunAt = now;
        const scheduledJob = transformer.transform(job);
        expect(scheduledJob.isInState(ScheduledJob.STATES.enqueued)).toBe(true);
      });

      it('ensures precedents of determining enqueued state over returning null', () => {
        job.attrs.nextRunAt = now;

        const scheduledJob = transformer.transform(job);
        expect(scheduledJob.isInState(ScheduledJob.STATES.enqueued)).toBe(true);
      });
    });

    it(`sets state to undefined if state of job can't be determined`, () => {
      const scheduledJob = transformer.transform(job);
      expect(scheduledJob.isInState(undefined)).toBe(true);
    });
  });
});

