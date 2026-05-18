import { expect, describe, it, beforeEach, beforeAll } from 'vitest';

import { ValidationError } from 'typend';
import { Type } from '@eveble/core';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { Struct } from '../../../src/components/struct';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';

describe(`Commit`, () => {
  @Type('Commit.FirstCommand', { isRegistrable: false })
  class FirstCommand extends Command<FirstCommand> {}
  @Type('Commit.SecondCommand', { isRegistrable: false })
  class SecondCommand extends Command<SecondCommand> {}

  @Type('Commit.FirstEvent', { isRegistrable: false })
  class FirstEvent extends Event<FirstEvent> {}
  @Type('Commit.SecondEvent', { isRegistrable: false })
  class SecondEvent extends Event<SecondEvent> {}

  const now: Date = new Date();

  it(`extends Struct`, () => {
    expect(Commit.prototype).toBeInstanceOf(Struct);
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

      expect(commit.id).toBe(commitId);
      expect(commit.sourceId).toBe(id);
      expect(commit.version).toBe(1);
      expect(commit.eventSourceableType).toBe('MyProcess');
      expect(commit.events).toEqual([firstEvent, secondEvent]);
      expect(commit.commands).toEqual([firstCommand, secondCommand]);
      expect(commit.insertedAt).toBe(now);
      expect(commit.sentBy).toBe('my-app-id');
      expect(commit.receivers).toEqual([
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

      expect(commit.getReceiver(firstAppId)).toBe(firstReceiver);
      expect(commit.getReceiver(secondAppId)).toBe(secondReceiver);
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
      expect(commit.receivers).toEqual([firstReceiver, secondReceiver]);
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
      expect(commit.getEventTypeNames()).toEqual([
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
      expect(commit.getCommandTypeNames()).toEqual([
        'Commit.FirstCommand',
        'Commit.SecondCommand',
      ]);
    });
  });
});

describe(`CommitReceiver`, () => {
  let now: Date;

  beforeAll(() => {
    now = new Date();
  });

  describe('construction', () => {
    it('takes state as string of one of allowed states, appId as a string, receivedAt as a Date', () => {
      const receiver = new CommitReceiver({
        state: 'received',
        appId: 'my-app-id',
        receivedAt: now,
      });
      expect(receiver.state).toBe(CommitReceiver.STATES.received);
      expect(receiver.appId).toBe('my-app-id');
      expect(receiver.receivedAt).toBe(now);
    });
  });

  describe('working with state', () => {
    let props: Record<string, any>;

    beforeAll(() => {
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
      expect(commit.getState()).toBe(CommitReceiver.STATES.received);
      commit.setState(CommitReceiver.STATES.published);
      expect(commit.getState()).toBe(CommitReceiver.STATES.published);
    });

    it(`returns true if commit is in state`, () => {
      const commit = new CommitReceiver({
        ...props,
        state: CommitReceiver.STATES.received,
      });
      expect(commit.isInState(CommitReceiver.STATES.received)).toBe(true);
    });

    it(`returns false if commit is not in state`, () => {
      const commit = new CommitReceiver({
        ...props,
        state: CommitReceiver.STATES.received,
      });
      expect(commit.isInState(CommitReceiver.STATES.published)).toBe(false);
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
      ).toBe(true);
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
      ).toBe(false);
      expect(commit.isInOneOfStates(CommitReceiver.STATES.published)).to.be
        .false;
    });

    it('allows only available states to be set', () => {
      expect(CommitReceiver.STATES).toEqual({
        received: 'received',
        published: 'published',
        timeouted: 'timeouted',
        failed: 'failed',
      });
    });

    it('throws ValidationError if state is not in one of allowed values on creation', () => {
      expect(() => {
        new CommitReceiver({ ...props, state: 'notValidState' });
      }).toThrow(
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
      }).toThrow(
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
      expect(receiver.isInState(CommitReceiver.STATES.published)).toBe(true);
      expect(receiver.publishedAt).toBeInstanceOf(Date);
      expect(receiver.workerId).toBe(workerId);
    });

    it('allows to flag commit receiver as timeouted', () => {
      receiver.flagAsTimeouted(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.timeouted)).toBe(true);
      expect(receiver.failedAt).toBeInstanceOf(Date);
      expect(receiver.workerId).toBe(workerId);
    });

    it('allows to flag commit receiver as failed', () => {
      receiver.flagAsFailed(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.failed)).toBe(true);
      expect(receiver.failedAt).toBeInstanceOf(Date);
      expect(receiver.workerId).toBe(workerId);
    });

    it('allows to re-flag commit receiver as received', () => {
      receiver.flagAsTimeouted(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.timeouted)).toBe(true);
      receiver.flagAsReceived(workerId);
      expect(receiver.isInState(CommitReceiver.STATES.received)).toBe(true);
      expect(receiver.receivedAt).toBeInstanceOf(Date);
      expect(receiver.workerId).toBe(workerId);
    });
  });
});

