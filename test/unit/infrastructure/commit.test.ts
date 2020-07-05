import { expect } from 'chai';
import { ValidationError } from 'typend';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { Struct } from '../../../src/components/struct';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { define } from '../../../src/decorators/define';

describe(`Commit`, function () {
  @define('Commit.FirstCommand', { isRegistrable: false })
  class FirstCommand extends Command {}
  @define('Commit.SecondCommand', { isRegistrable: false })
  class SecondCommand extends Command {}

  @define('Commit.FirstEvent', { isRegistrable: false })
  class FirstEvent extends Event {}
  @define('Commit.SecondEvent', { isRegistrable: false })
  class SecondEvent extends Event {}

  const now: Date = new Date();

  it(`extends Struct`, () => {
    expect(Commit.prototype).to.be.instanceof(Struct);
  });

  const id = 'my-id';
  const firstCommand = new FirstCommand({
    targetId: id,
    timestamp: now,
  });
  const secondCommand = new SecondCommand({
    targetId: id,
    timestamp: now,
  });
  const firstEvent = new FirstEvent({
    sourceId: id,
    timestamp: now,
  });
  const secondEvent = new SecondEvent({
    sourceId: id,
    timestamp: now,
  });

  describe(`construction`, () => {
    it(`takes object with required properties and assigns them`, () => {
      const commitId = 'my-commit-id';
      const commit = new Commit({
        id: commitId,
        sourceId: id,
        version: 1,
        eventSourceableType: 'MyProcess',
        events: [firstEvent, secondEvent],
        commands: [firstCommand, secondCommand],
        insertedAt: now,
        sentBy: 'my-app-id',
        receivers: [
          new CommitReceiver({
            state: 'received',
            appId: 'my-app-id',
            workerId: 'my-worker-id',
            receivedAt: now,
          }),
        ],
      });

      expect(commit.id).to.be.equal(commitId);
      expect(commit.sourceId).to.be.equal(id);
      expect(commit.version).to.be.equal(1);
      expect(commit.eventSourceableType).to.be.equal('MyProcess');
      expect(commit.events).to.be.eql([firstEvent, secondEvent]);
      expect(commit.commands).to.be.eql([firstCommand, secondCommand]);
      expect(commit.insertedAt).to.be.equal(now);
      expect(commit.sentBy).to.be.equal('my-app-id');
      expect(commit.receivers).to.be.eql([
        new CommitReceiver({
          state: 'received',
          appId: 'my-app-id',
          workerId: 'my-worker-id',
          receivedAt: now,
        }),
      ]);
    });
  });

  describe('working with receivers', () => {
    it('allows to get receiver from commit receivers collection', () => {
      const firstAppId = 'first-app-id';
      const secondAppId = 'second-app-id';
      const firstReceiver = new CommitReceiver({
        state: 'received',
        appId: firstAppId,
        workerId: 'first-worker-id',
        receivedAt: now,
      });
      const secondReceiver = new CommitReceiver({
        state: 'received',
        appId: secondAppId,
        workerId: 'second-worker-id',
        receivedAt: now,
      });
      const commit = new Commit({
        id: 'my-commit-id',
        sourceId: id,
        version: 1,
        eventSourceableType: 'MyProcess',
        events: [firstEvent, secondEvent],
        commands: [firstCommand, secondCommand],
        insertedAt: now,
        sentBy: firstAppId,
        receivers: [firstReceiver, secondReceiver],
      });

      expect(commit.getReceiver(firstAppId)).to.be.equal(firstReceiver);
      expect(commit.getReceiver(secondAppId)).to.be.equal(secondReceiver);
    });

    it('allows to add receiver to commit receivers collection', () => {
      const firstAppId = 'first-app-id';
      const secondAppId = 'second-app-id';
      const firstReceiver = new CommitReceiver({
        state: 'received',
        appId: firstAppId,
        workerId: 'first-worker-id',
        receivedAt: now,
      });
      const secondReceiver = new CommitReceiver({
        state: 'received',
        appId: secondAppId,
        workerId: 'second-worker-id',
        receivedAt: now,
      });
      const commit = new Commit({
        id: 'my-commit-id',
        sourceId: id,
        version: 1,
        eventSourceableType: 'MyProcess',
        events: [firstEvent, secondEvent],
        commands: [firstCommand, secondCommand],
        insertedAt: now,
        sentBy: firstAppId,
        receivers: [firstReceiver],
      });
      commit.addReceiver(secondReceiver);
      expect(commit.receivers).to.be.eql([firstReceiver, secondReceiver]);
    });
  });

  describe('getters', () => {
    it('returns all event types from changes', () => {
      const commit = new Commit({
        id: 'my-commit-id',
        sourceId: id,
        version: 1,
        eventSourceableType: 'MyProcess',
        events: [firstEvent, secondEvent],
        commands: [],
        insertedAt: now,
        sentBy: 'my-app-id',
        receivers: [],
      });
      expect(commit.getEventTypeNames()).to.be.eql([
        'Commit.FirstEvent',
        'Commit.SecondEvent',
      ]);
    });

    it('returns all command types from changes', () => {
      const commit = new Commit({
        id: 'my-commit-id',
        sourceId: id,
        version: 1,
        eventSourceableType: 'MyProcess',
        events: [],
        commands: [firstCommand, secondCommand],
        insertedAt: now,
        sentBy: 'my-app-id',
        receivers: [],
      });
      expect(commit.getCommandTypeNames()).to.be.eql([
        'Commit.FirstCommand',
        'Commit.SecondCommand',
      ]);
    });
  });
});

describe(`CommitReceiver`, function () {
  let now: Date;

  before(() => {
    now = new Date();
  });

  describe('construction', () => {
    it('takes state as string of one of allowed states, appId as a string, receivedAt as a Date', () => {
      const receiver = new CommitReceiver({
        state: 'received',
        appId: 'my-app-id',
        receivedAt: now,
      });
      expect(receiver.state).to.be.equal(CommitReceiver.STATES.received);
      expect(receiver.appId).to.be.equal('my-app-id');
      expect(receiver.receivedAt).to.be.equal(now);
    });
  });

  describe('working with state', () => {
    let props: Record<string, any>;

    before(() => {
      props = {
        state: 'received',
        appId: 'my-app-id',
        receivedAt: now,
      };
    });

    it(`allows to set state on commit `, () => {
      const commit = new CommitReceiver({
        ...props,
        state: CommitReceiver.STATES.received,
      });
      expect(commit.getState()).to.be.equal(CommitReceiver.STATES.received);
      commit.setState(CommitReceiver.STATES.published);
      expect(commit.getState()).to.be.equal(CommitReceiver.STATES.published);
    });

    it(`returns true if commit is in state`, () => {
      const commit = new CommitReceiver({
        ...props,
        state: CommitReceiver.STATES.received,
      });
      expect(commit.isInState(CommitReceiver.STATES.received)).to.be.true;
    });

    it(`returns false if commit is not in state`, () => {
      const commit = new CommitReceiver({
        ...props,
        state: CommitReceiver.STATES.received,
      });
      expect(commit.isInState(CommitReceiver.STATES.published)).to.be.false;
    });

    it(`returns true if commit is one of state`, () => {
      const commit = new CommitReceiver({
        ...props,
        state: CommitReceiver.STATES.received,
      });
      commit.setState(CommitReceiver.STATES.timeouted);
      expect(
        commit.isInOneOfStates([
          CommitReceiver.STATES.timeouted,
          CommitReceiver.STATES.failed,
        ])
      ).to.be.true;
      expect(commit.isInOneOfStates(CommitReceiver.STATES.timeouted)).to.be
        .true;
    });

    it(`returns false if commit is not in one of state`, () => {
      const commit = new CommitReceiver({
        ...props,
        state: CommitReceiver.STATES.received,
      });
      expect(
        commit.isInOneOfStates([
          CommitReceiver.STATES.timeouted,
          CommitReceiver.STATES.failed,
        ])
      ).to.be.false;
      expect(commit.isInOneOfStates(CommitReceiver.STATES.published)).to.be
        .false;
    });

    it('allows only available states to be set', () => {
      expect(CommitReceiver.STATES).to.be.eql({
        received: 'received',
        published: 'published',
        timeouted: 'timeouted',
        failed: 'failed',
      });
    });

    it('throws ValidationError if state is not in one of allowed values on creation', () => {
      expect(() => {
        new CommitReceiver({ ...props, state: 'notValidState' });
      }).to.throw(
        ValidationError,
        `Expected String("notValidState") to be one of: String("received"), String("published"), String("timeouted"), String("failed")`
      );
    });

    it('throws ValidationError if state is not in one of allowed values on state change', () => {
      const commit = new CommitReceiver({
        ...props,
        state: CommitReceiver.STATES.received,
      });
      expect(() => {
        commit.setState('notValidState');
      }).to.throw(
        ValidationError,
        `Expected String("notValidState") to be one of: String("received"), String("published"), String("timeouted"), String("failed")`
      );
    });
  });

  describe('flagging', () => {
    let receiver: CommitReceiver;
    const workerId = 'my-workerId';
    beforeEach(() => {
      receiver = new CommitReceiver({
        state: 'received',
        appId: 'my-app-id',
        receivedAt: new Date(new Date().getTime() - 1000),
      });
    });

    it('allows to flag commit receiver as published', () => {
      receiver.flagAsPublished(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.published)).to.be.true;
      expect(receiver.publishedAt).to.be.instanceof(Date);
      expect(receiver.workerId).to.be.equal(workerId);
    });

    it('allows to flag commit receiver as timeouted', () => {
      receiver.flagAsTimeouted(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.timeouted)).to.be.true;
      expect(receiver.failedAt).to.be.instanceof(Date);
      expect(receiver.workerId).to.be.equal(workerId);
    });

    it('allows to flag commit receiver as failed', () => {
      receiver.flagAsFailed(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.failed)).to.be.true;
      expect(receiver.failedAt).to.be.instanceof(Date);
      expect(receiver.workerId).to.be.equal(workerId);
    });

    it('allows to re-flag commit receiver as received', () => {
      receiver.flagAsTimeouted(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.timeouted)).to.be.true;
      receiver.flagAsReceived(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.received)).to.be.true;
      expect(receiver.receivedAt).to.be.instanceof(Date);
      expect(receiver.workerId).to.be.equal(workerId);
    });
  });
});
