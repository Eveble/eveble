import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { Aggregate } from '../../../src/domain/aggregate';
import { Process } from '../../../src/domain/process';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { define } from '../../../src/decorators/define';
import { types } from '../../../src/types';
import { Container } from '../../../src/core/injector';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Guid } from '../../../src/domain/value-objects/guid';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { CommitConcurrencyError } from '../../../src/infrastructure/infrastructure-errors';
import { Log } from '../../../src/components/log-entry';
import { BINDINGS } from '../../../src/constants/bindings';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`CommitStore`, function() {
  @define('CommitStore.MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {}
  @define('CommitStore.MyAggregate', { isRegistrable: false })
  class MyAggregate extends Aggregate {}
  @define('CommitStore.MyProcess', { isRegistrable: false })
  class MyProcess extends Process {}

  @define('CommitStore.MyCommand', { isRegistrable: false })
  class MyCommand extends Command {}
  @define('CommitStore.MyOtherCommand', { isRegistrable: false })
  class MyOtherCommand extends Command {}

  @define('CommitStore.MyEvent', { isRegistrable: false })
  class MyEvent extends Event {}
  @define('CommitStore.MyOtherEvent', { isRegistrable: false })
  class MyOtherEvent extends Event {}

  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  let now: Date;
  let clock: any;
  let container: Container;
  let log: any;
  let config: any;
  let storage: any;
  let commitPublisher: any;
  let commitStore: CommitStore;

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());

    container = new Container();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();
    storage = stubInterface<types.CommitStorage>();
    commitPublisher = stubInterface<types.CommitPublisher>();

    container.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    container.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    container
      .bind<types.CommitStorage>(BINDINGS.CommitStorage)
      .toConstantValue(storage);
    container
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .toConstantValue(commitPublisher);
  });

  afterEach(() => {
    clock.restore();
  });

  beforeEach(() => {
    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('workerId').returns(workerId);

    commitStore = new CommitStore();
    container.injectInto(commitStore);
    storage.generateCommitId.returns(undefined);
  });

  describe(`creating commit`, () => {
    it(`creates a first commit for an aggregate`, async () => {
      const commitId = new Guid('91f09174-aebc-48e9-9ce8-672a670ede37');
      storage.getLastCommitVersionById.returns(undefined);
      storage.generateCommitId.returns(commitId);

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
      expect(commit).to.be.instanceOf(Commit);
      expect(commit).to.be.eql(
        new Commit({
          id: commitId.toString(),
          sourceId: id,
          version: 1,
          changes: {
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
          },
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
      storage.getLastCommitVersionById.returns(undefined);
      storage.generateCommitId.returns(commitId);

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
      expect(commit).to.be.instanceOf(Commit);
      expect(commit).to.be.eql(
        new Commit({
          id: commitId.toString(),
          sourceId: id,
          version: 1,
          changes: {
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
          },
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
      storage.getLastCommitVersionById.returns(foundLastCommitVersion);
      storage.generateCommitId.returns(commitId);

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
      expect(commit).to.be.instanceOf(Commit);
      expect(commit).to.be.eql(
        new Commit({
          id: commitId.toString(),
          sourceId: id,
          version: 11,
          changes: {
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
          },
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
      storage.getLastCommitVersionById.returns(foundLastCommitVersion);

      const eventSourceable = new MyEventSourceable({
        id: 'my-id',
        version: 20,
      });

      expect(
        commitStore.createCommit(eventSourceable)
      ).to.eventually.be.rejectedWith(
        CommitConcurrencyError,
        `MyEventSourceable: expected event sourceable with id of 'my-id' to be at version 20 but is at version 10`
      );
    });

    it(`logs commit creation`, async () => {
      const eventSourceable = new MyEventSourceable({
        id: 'my-id',
      });

      await commitStore.createCommit(eventSourceable);

      expect(log.debug).to.be.calledOnce;
      expect(log.debug).to.be.calledWithExactly(
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
    context('successful', () => {
      it(`stores commit on storage and returns commit id assigned by storage`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          changes: {
            eventSourceableType: 'MyEventSourceable',
            commands: [],
            events: [],
          },
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const commitId = 'commit-id';
        storage.addCommit.withArgs(commit).returns(commitId);

        expect(await commitStore.addCommit(commit)).to.be.equal(commitId);
        expect(storage.addCommit).to.be.calledOnce;
        expect(storage.addCommit).to.be.calledWithExactly(commit);
      });

      it(`logs adding commit`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          changes: {
            eventSourceableType: 'MyEventSourceable',
            commands: [],
            events: [],
          },
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const commitId = 'commit-id';
        storage.addCommit.withArgs(commit).returns(commitId);

        await commitStore.addCommit(commit);
        expect(log.debug).to.be.calledTwice;
        expect(log.debug).to.be.calledWithExactly(
          new Log(`adding commit for 'MyEventSourceable@my-id'`)
            .on(commitStore)
            .in(commitStore.addCommit)
            .with('commit', commit)
        );
      });

      it(`logs added commit`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          changes: {
            eventSourceableType: 'MyEventSourceable',
            commands: [],
            events: [],
          },
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const commitId = 'commit-id';
        storage.addCommit.withArgs(commit).returns(commitId);

        await commitStore.addCommit(commit);
        expect(log.debug).to.be.calledTwice;
        expect(log.debug).to.be.calledWithExactly(
          new Log(
            `added commit with id 'commit-id' for 'MyEventSourceable@my-id'`
          )
            .on(commitStore)
            .in(commitStore.addCommit)
            .with('commit', commit)
        );
      });

      it(`publishes changes through commit publisher with commit and commit id`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          changes: {
            eventSourceableType: 'MyEventSourceable',
            commands: [],
            events: [],
          },
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const commitId = 'commit-id';
        storage.addCommit.withArgs(commit).returns(commitId);

        await commitStore.addCommit(commit);
        expect(commitPublisher.publishChanges).to.be.calledOnce;
        expect(commitPublisher.publishChanges).to.be.calledWithExactly(commit);
      });
    });

    context('failed', () => {
      it(`logs unsuccessful commit addition upon storage error`, async () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          changes: {
            eventSourceableType: 'MyEventSourceable',
            commands: [],
            events: [],
          },
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        const error = new Error('my-error');
        storage.addCommit.withArgs(commit).rejects(error);

        await expect(
          commitStore.addCommit(commit)
        ).to.eventually.be.rejectedWith(error);
        expect(log.error).to.be.calledOnce;
        expect(log.error).to.be.calledWithExactly(
          new Log(
            `failed adding commit for 'MyEventSourceable@my-id' do to error: Error: my-error`
          )
            .on(commitStore)
            .in(commitStore.addCommit)
            .with('commit', commit)
        );
      });

      it(`rethrows any thrown error on storage`, () => {
        const commit = new Commit({
          id: 'commit-id',
          sourceId: 'my-id',
          version: 2,
          changes: {
            eventSourceableType: 'MyEventSourceable',
            commands: [],
            events: [],
          },
          insertedAt: now,
          sentBy: appId,
          receivers: [],
        });
        storage.addCommit
          .withArgs(commit)
          .throws(
            new CommitConcurrencyError('MyTypeName', 'my-id', '123', '7')
          );

        expect(commitStore.addCommit(commit)).to.eventually.be.rejectedWith(
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
        changes: {
          eventSourceableType: 'CommitStore.MyAggregate',
          events: [],
          commands: [],
        },
        insertedAt: now,
        sentBy: appId,
        receivers: [],
      });
      storage.getCommitById.withArgs(commitId).resolves(commit);

      const foundCommit = await commitStore.getCommitById(commitId);
      expect(foundCommit).to.be.instanceof(Commit);
      expect(foundCommit).to.be.eql(commit);
    });

    it(`returns undefined if commit by id can't be found`, async () => {
      const commitId = 'commit-id';
      storage.getCommitById.withArgs(commitId).resolves(undefined);

      const foundCommit = await storage.getCommitById(commitId);
      expect(foundCommit).to.be.equal(undefined);
    });
  });

  describe(`returning events`, () => {
    it(`returns all events versioned by batch for given event sourceable`, async () => {
      const firstEvent = sinon.spy();
      const secondEvent = sinon.spy();
      const thirdEvent = sinon.spy();

      storage.getCommits.withArgs('my-id', 1).returns([
        {
          changes: {
            events: [firstEvent, secondEvent],
          },
        },
        {
          changes: {
            events: [thirdEvent],
          },
        },
      ]);

      const events = await commitStore.getEvents('my-id');
      expect(events).to.be.eql([firstEvent, secondEvent, thirdEvent]);
      expect(storage.getCommits).to.be.calledOnce;
      expect(storage.getCommits).to.be.calledWithExactly('my-id', 1);
    });

    it(`allows to pass version offset to skip events`, async () => {
      const firstEvent = sinon.spy();
      const secondEvent = sinon.spy();
      const thirdEvent = sinon.spy();

      storage.getCommits.withArgs('my-id', 20).returns([
        {
          changes: {
            events: [firstEvent, secondEvent],
          },
        },
        {
          changes: {
            events: [thirdEvent],
          },
        },
      ]);

      const events = await commitStore.getEvents('my-id', 20);
      expect(events).to.be.eql([firstEvent, secondEvent, thirdEvent]);
      expect(storage.getCommits).to.be.calledOnce;
      expect(storage.getCommits).to.be.calledWithExactly('my-id', 20);
    });

    it(`returns empty array if commits for event sourceable can't be found`, async () => {
      storage.getCommits.withArgs('my-id').returns([]);

      const events = await commitStore.getEvents('my-id');
      expect(events).to.be.eql([]);
    });

    it(`returns all events from all available commits`, async () => {
      const firstEvent = sinon.spy();
      const secondEvent = sinon.spy();
      const thirdEvent = sinon.spy();

      storage.getAllCommits.returns([
        {
          changes: {
            events: [firstEvent, secondEvent],
          },
        },
        {
          changes: {
            events: [thirdEvent],
          },
        },
      ]);

      const allEvents = await commitStore.getAllEvents();
      expect(allEvents).to.be.eql([firstEvent, secondEvent, thirdEvent]);
    });

    it(`returns empty when no commits are available`, async () => {
      storage.getAllCommits.returns([]);

      const allEvents = await commitStore.getAllEvents();
      expect(allEvents).to.be.eql([]);
    });
  });
});
