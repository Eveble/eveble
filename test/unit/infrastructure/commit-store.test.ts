import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
} from 'vitest';

import { Type } from '@eveble/core';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { Aggregate } from '../../../src/domain/aggregate';
import { Process } from '../../../src/domain/process';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Guid } from '../../../src/domain/value-objects/guid';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { CommitConcurrencyError } from '../../../src/infrastructure/infrastructure-errors';
import { Log } from '../../../src/components/log-entry';
import { BINDINGS } from '../../../src/constants/bindings';

describe(`CommitStore`, () => {
  @Type('CommitStore.MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {}

  @Type('CommitStore.MyAggregate', { isRegistrable: false })
  class MyAggregate extends Aggregate {}

  @Type('CommitStore.MyProcess', { isRegistrable: false })
  class MyProcess extends Process {}

  @Type('CommitStore.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {}
  @Type('CommitStore.MyOtherCommand', { isRegistrable: false })
  class MyOtherCommand extends Command<MyOtherCommand> {}

  @Type('CommitStore.MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {}
  @Type('CommitStore.MyOtherEvent', { isRegistrable: false })
  class MyOtherEvent extends Event<MyOtherEvent> {}

  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  let now: Date;
  let clock: any;
  let injector: Injector;
  let log: any;
  let config: any;
  let storage: any;
  let commitPublisher: any;
  let commitStore: CommitStore;

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = vi.useFakeTimers({ now });

    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();
    storage = mock<types.CommitStorage>();
    commitPublisher = mock<types.CommitPublisher>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<types.CommitStorage>(BINDINGS.CommitStorage)
      .toConstantValue(storage);
    injector
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .toConstantValue(commitPublisher);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    config.get.calledWith('appId').mockReturnValue(appId);
    config.get.calledWith('workerId').mockReturnValue(workerId);

    commitStore = new CommitStore();
    injector.injectInto(commitStore);
    storage.generateId.mockReturnValue(undefined);
  });

  describe(`creating commit`, () => {
    it(`creates a first commit for an aggregate`, async () => {
      const commitId = new Guid('91f09174-aebc-48e9-9ce8-672a670ede37');
      storage.findLastVersionById.mockReturnValue(undefined);
      storage.generateId.mockReturnValue(commitId);

      const id = 'my-id';
      const aggregate = new MyAggregate({ id });

      const firstEvent = new MyEvent({
        sourceId: id,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: id,
        timestamp: now,
      });

      aggregate.record(firstEvent);
      aggregate.record(secondEvent);

      const commit = await commitStore.createCommit(aggregate);
      expect(commit).toBeInstanceOf(Commit);
      expect(commit).toEqual(
        new Commit({
          id: commitId.toString(),
          sourceId: id,
          version: 1,
          eventSourceableType: 'CommitStore.MyAggregate',
          events: [
            new MyEvent({
              sourceId: id,
              timestamp: now,
              version: 1,
            }),
            new MyOtherEvent({
              sourceId: id,
              timestamp: now,
              version: 1,
            }),
          ],
          commands: [],
          insertedAt: now,
          sentBy: appId,
          receivers: [
            new CommitReceiver({
              state: 'received',
              appId,
              workerId,
              receivedAt: now,
            }),
          ],
        })
      );
    });

    it(`creates a first commit for a process`, async () => {
      const commitId = new Guid('91f09174-aebc-48e9-9ce8-672a670ede37');
      storage.findLastVersionById.mockReturnValue(undefined);
      storage.generateId.mockReturnValue(commitId);

      const id = 'my-id';
      const process = new MyProcess({ id });

      const firstCommand = new MyCommand({
        targetId: id,
        timestamp: now,
      });
      const secondCommand = new MyOtherCommand({
        targetId: id,
        timestamp: now,
      });
      const firstEvent = new MyEvent({
        sourceId: id,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: id,
        timestamp: now,
      });

      process.trigger(firstCommand);
      process.record(firstEvent);
      process.trigger(secondCommand);
      process.record(secondEvent);

      const commit = await commitStore.createCommit(process);
      expect(commit).toBeInstanceOf(Commit);
      expect(commit).toEqual(
        new Commit({
          id: commitId.toString(),
          sourceId: id,
          version: 1,
          eventSourceableType: 'CommitStore.MyProcess',
          events: [
            new MyEvent({
              sourceId: id,
              timestamp: now,
              version: 1,
            }),
            new MyOtherEvent({
              sourceId: id,
              timestamp: now,
              version: 1,
            }),
          ],
          commands: [firstCommand, secondCommand],
          insertedAt: now,
          sentBy: appId,
          receivers: [
            new CommitReceiver({
              state: 'received',
              appId,
              workerId,
              receivedAt: now,
            }),
          ],
        })
      );
    });

    it(`creates another commit for event sourceable`, async () => {
      const foundLastCommitVersion = 10;
      const commitId = new Guid('91f09174-aebc-48e9-9ce8-672a670ede37');
      storage.findLastVersionById.mockReturnValue(foundLastCommitVersion);
      storage.generateId.mockReturnValue(commitId);

      const id = 'my-id';
      const firstEvent = new MyEvent({
        sourceId: id,
        timestamp: now,
      });
      const secondEvent = new MyOtherEvent({
        sourceId: id,
        timestamp: now,
      });

      const eventSourceable = new MyEventSourceable({
        id,
      });

      eventSourceable.record(firstEvent);
      eventSourceable.record(secondEvent);

      eventSourceable.version = 10;

      const commit = await commitStore.createCommit(eventSourceable);
      expect(commit).toBeInstanceOf(Commit);
      expect(commit).toEqual(
        new Commit({
          id: commitId.toString(),
          sourceId: id,
          version: 11,
          eventSourceableType: 'CommitStore.MyEventSourceable',
          events: [
            new MyEvent({
              sourceId: id,
              timestamp: now,
              version: 11,
            }),
            new MyOtherEvent({
              sourceId: id,
              timestamp: now,
              version: 11,
            }),
          ],
          commands: [],
          insertedAt: now,
          sentBy: appId,
          receivers: [
            new CommitReceiver({
              state: 'received',
              appId,
              workerId,
              receivedAt: now,
            }),
          ],
        })
      );
    });

    it(`throws CommitConcurrencyError if the version in the store does not equal the expected version`, async () => {
      const foundLastCommitVersion = 10;
      storage.findLastVersionById.mockReturnValue(foundLastCommitVersion);

      const eventSourceable = new MyEventSourceable({
        id: 'my-id',
        version: 20,
      });

      await expect(commitStore.createCommit(eventSourceable)).rejects.toThrow(
        CommitConcurrencyError,
        `MyEventSourceable: expected event sourceable with id of 'my-id' to be at version 20 but is at version 10`
      );
    });

    it(`logs commit creation`, async () => {
      const eventSourceable = new MyEventSourceable({
        id: 'my-id',
      });

      await commitStore.createCommit(eventSourceable);

      expect(log.debug).toHaveBeenCalledTimes(1);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(
          `creating commit for 'CommitStore.MyEventSourceable@my-id' with expected at version 0`
        )
          .on(commitStore)
          .in(commitStore.createCommit)
          .with('event sourceable', eventSourceable)
      );
    });
  });

  describe(`saving commit`, () => {
    describe('successful', () => {
      it(`stores commit on storage and returns commit id assigned by storage`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          eventSourceableType: 'MyEventSourceable',
          commands: [],
          events: [],
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const commitId = 'commit-id';
        storage.save.calledWith(commit).mockReturnValue(commitId);

        expect(await commitStore.save(commit)).toBe(commitId);
        expect(storage.save).toHaveBeenCalledTimes(1);
        expect(storage.save).toHaveBeenCalledWith(commit);
      });

      it(`logs adding commit`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          eventSourceableType: 'MyEventSourceable',
          commands: [],
          events: [],
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const commitId = 'commit-id';
        storage.save.calledWith(commit).mockReturnValue(commitId);

        await commitStore.save(commit);
        expect(log.debug).toHaveBeenCalledTimes(2);
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`adding commit for 'MyEventSourceable@my-id'`)
            .on(commitStore)
            .in(commitStore.save)
            .with('commit', commit)
        );
      });

      it(`logs added commit`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          eventSourceableType: 'MyEventSourceable',
          commands: [],
          events: [],
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const commitId = 'commit-id';
        storage.save.calledWith(commit).mockReturnValue(commitId);

        await commitStore.save(commit);
        expect(log.debug).toHaveBeenCalledTimes(2);
        expect(log.debug).toHaveBeenCalledWith(
          new Log(
            `added commit with id 'commit-id' for 'MyEventSourceable@my-id'`
          )
            .on(commitStore)
            .in(commitStore.save)
            .with('commit', commit)
        );
      });

      it(`publishes changes through commit publisher with commit and commit id`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          eventSourceableType: 'MyEventSourceable',
          commands: [],
          events: [],
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const commitId = 'commit-id';
        storage.save.calledWith(commit).mockReturnValue(commitId);

        await commitStore.save(commit);
        expect(commitPublisher.publishChanges).toHaveBeenCalledTimes(1);
        expect(commitPublisher.publishChanges).toHaveBeenCalledWith(commit);
      });
    });

    describe('failed', () => {
      it(`logs unsuccessful commit addition upon storage error`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          eventSourceableType: 'MyEventSourceable',
          commands: [],
          events: [],
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const error = new Error('my-error');
        storage.save.calledWith(commit).mockRejectedValue(error);

        await expect(commitStore.save(commit)).rejects.toThrow(error);
        expect(log.error).toHaveBeenCalledTimes(1);
        expect(log.error).toHaveBeenCalledWith(
          new Log(
            `failed adding commit for 'MyEventSourceable@my-id' do to error: Error: my-error`
          )
            .on(commitStore)
            .in(commitStore.save)
            .with('commit', commit)
        );
      });

      it(`rethrows any thrown error on storage`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          eventSourceableType: 'MyEventSourceable',
          commands: [],
          events: [],
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        storage.save.calledWith(commit).mockImplementation(() => {
          throw new CommitConcurrencyError('MyTypeName', 'my-id', '123', '7');
        });

        await expect(commitStore.save(commit)).rejects.toThrow(
          CommitConcurrencyError,
          `MyTypeName: expected event sourceable with id of 'my-id' to be at version 123 but is at version 7`
        );
      });
    });
  });

  describe('returning commits', () => {
    it('returns commit by id', async () => {
      const commitId = 'commit-id';
      const commit = new Commit({
        id: commitId.toString(),
        sourceId: 'my-event-sourceable-id',
        version: 1,
        eventSourceableType: 'CommitStore.MyAggregate',
        events: [],
        commands: [],
        insertedAt: now,
        sentBy: appId,
        receivers: [],
      });
      storage.findById.calledWith(commitId).mockResolvedValue(commit);

      const foundCommit = await commitStore.findById(commitId);
      expect(foundCommit).toBeInstanceOf(Commit);
      expect(foundCommit).toEqual(commit);
    });

    it(`returns undefined if commit by id can't be found`, async () => {
      const commitId = 'commit-id';
      storage.findById.calledWith(commitId).mockResolvedValue(undefined);

      const foundCommit = await storage.findById(commitId);
      expect(foundCommit).toBe(undefined);
    });
  });

  describe(`returning events`, () => {
    it(`returns all events versioned by batch for given event sourceable`, async () => {
      const firstEvent = vi.fn();
      const secondEvent = vi.fn();
      const thirdEvent = vi.fn();

      storage.getCommits.calledWith('my-id', 1).mockReturnValue([
        {
          events: [firstEvent, secondEvent],
        },
        {
          events: [thirdEvent],
        },
      ]);

      const events = await commitStore.getEvents('my-id');
      expect(events).toEqual([firstEvent, secondEvent, thirdEvent]);
      expect(storage.getCommits).toHaveBeenCalledTimes(1);
      expect(storage.getCommits).toHaveBeenCalledWith('my-id', 1);
    });

    it(`allows to pass version offset to skip events`, async () => {
      const firstEvent = vi.fn();
      const secondEvent = vi.fn();
      const thirdEvent = vi.fn();

      storage.getCommits.calledWith('my-id', 20).mockReturnValue([
        {
          events: [firstEvent, secondEvent],
        },
        {
          events: [thirdEvent],
        },
      ]);

      const events = await commitStore.getEvents('my-id', 20);
      expect(events).toEqual([firstEvent, secondEvent, thirdEvent]);
      expect(storage.getCommits).toHaveBeenCalledTimes(1);
      expect(storage.getCommits).toHaveBeenCalledWith('my-id', 20);
    });

    it(`returns empty array if commits for event sourceable can't be found`, async () => {
      storage.getCommits.calledWith('my-id').mockReturnValue([]);

      const events = await commitStore.getEvents('my-id');
      expect(events).toEqual([]);
    });

    it(`returns all events from all available commits`, async () => {
      const firstEvent = vi.fn();
      const secondEvent = vi.fn();
      const thirdEvent = vi.fn();

      storage.getAllCommits.mockReturnValue([
        {
          events: [firstEvent, secondEvent],
        },
        {
          events: [thirdEvent],
        },
      ]);

      const allEvents = await commitStore.getAllEvents();
      expect(allEvents).toEqual([firstEvent, secondEvent, thirdEvent]);
    });

    it(`returns empty when no commits are available`, async () => {
      storage.getAllCommits.mockReturnValue([]);

      const allEvents = await commitStore.getAllEvents();
      expect(allEvents).toEqual([]);
    });
  });
});
