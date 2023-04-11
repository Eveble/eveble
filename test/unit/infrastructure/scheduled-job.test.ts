import { expect } from 'chai';
import { ValidationError } from 'typend';
import { ScheduledJob } from '../../../src/infrastructure/structs/scheduled-job';
import { Struct } from '../../../src/components/struct';
import { Guid } from '../../../src/domain/value-objects/guid';

describe(`ScheduledJob`, () => {
  let now: any;
  before(() => {
    now = new Date();
  });

  it(`extends Struct`, () => {
    expect(ScheduledJob.prototype).to.be.instanceof(Struct);
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
      expect(scheduledJob.id).to.be.equal(props.id);
      expect(scheduledJob.name).to.be.equal('my-name');
      expect(scheduledJob.data).to.be.eql({});
      expect(scheduledJob.priority).to.be.equal('lowest');
    });

    it('allows to set required property id as a string', () => {
      const props = {
        id: 'my-id',
        name: 'my-name',
        data: {},
        priority: 'lowest',
      };
      const scheduledJob = new ScheduledJob(props);
      expect(scheduledJob.id).to.be.a('string');
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
      expect(lowestPriorityJob.priority).to.be.equal('lowest');
      const lowPriorityJob = new ScheduledJob({
        ...props,
        priority: 'low',
      });
      expect(lowPriorityJob.priority).to.be.equal('low');
      const normalPriorityJob = new ScheduledJob({
        ...props,
        priority: 'normal',
      });
      expect(normalPriorityJob.priority).to.be.equal('normal');
      const highPriorityJob = new ScheduledJob({
        ...props,
        priority: 'high',
      });
      expect(highPriorityJob.priority).to.be.equal('high');
      const highestPriorityJob = new ScheduledJob({
        ...props,
        priority: 'highest',
      });
      expect(highestPriorityJob.priority).to.be.equal('highest');
    });

    it('allows to set required: priority as numeric value', () => {
      const props = {
        id: 'my-id',
        name: 'my-name',
        data: {},
        priority: 0,
      };
      const scheduledJob = new ScheduledJob(props);
      expect(scheduledJob.priority).to.be.a('number');
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
      expect(scheduledJob.nextRunAt).to.be.instanceof(Date);
      expect(scheduledJob.nextRunAt).to.be.equal(now);
      expect(scheduledJob.completedAt).to.be.instanceof(Date);
      expect(scheduledJob.completedAt).to.equal(now);
      expect(scheduledJob.lockedAt).to.be.instanceof(Date);
      expect(scheduledJob.lockedAt).to.be.equal(now);
      expect(scheduledJob.lastRunAt).to.be.instanceof(Date);
      expect(scheduledJob.lastRunAt).to.be.equal(now);
      expect(scheduledJob.failedAt).to.be.instanceof(Date);
      expect(scheduledJob.failedAt).to.be.equal(now);
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
      expect(scheduledJob.getState()).to.be.equal(ScheduledJob.STATES.enqueued);
      scheduledJob.setState(ScheduledJob.STATES.started);
      expect(scheduledJob.getState()).to.be.equal(ScheduledJob.STATES.started);
    });

    it(`returns true if scheduled job is in state`, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
        state: ScheduledJob.STATES.enqueued,
      });
      expect(scheduledJob.isInState(ScheduledJob.STATES.enqueued)).to.be.true;
    });

    it(`returns false if scheduled job is not in state`, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
        state: ScheduledJob.STATES.enqueued,
      });
      expect(scheduledJob.isInState(ScheduledJob.STATES.started)).to.be.false;
    });

    it(`returns true if scheduled job has state`, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
        state: ScheduledJob.STATES.enqueued,
      });
      expect(scheduledJob.hasState()).to.be.true;
    });

    it(`returns false if scheduled job has no assigned state`, () => {
      const scheduledJob = new ScheduledJob({
        ...props,
      });
      expect(scheduledJob.hasState()).to.be.false;
    });

    it('allows only available states to be set', () => {
      expect(ScheduledJob.STATES).to.be.eql({
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
      }).to.throw(
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
      }).to.throw(
        ValidationError,
        `Expected String("notValidState") to be one of: String("enqueued"), String("started"), String("locked"), String("failed"), String("completed"), String("removed")`
      );
    });
  });
});
