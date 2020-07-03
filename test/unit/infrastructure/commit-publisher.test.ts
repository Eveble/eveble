import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { define } from '../../../src/decorators/define';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { BINDINGS } from '../../../src/constants/bindings';
import { Log } from '../../../src/components/log-entry';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';

chai.use(sinonChai);
chai.use(chaiAsPromised);

function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe(`CommitPublisher`, function () {
  @define('CommitPublisher.MyCommand', { isRegistrable: false })
  class MyCommand extends Command {}
  @define('CommitPublisher.MyEvent', { isRegistrable: false })
  class MyEvent extends Event {}

  const appId = 'my-app-id';
  const workerId = 'my-worker-id';

  let now: Date;
  let clock: any;
  let injector: Injector;
  let log: any;
  let config: any;
  let commandBus: any;
  let eventBus: any;
  let serializer: any;
  let storage: any;
  let observer: any;
  let commitPublisher: CommitPublisher;
  let timeout: number;

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());
    timeout = 60;

    injector = new Injector();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();
    commandBus = stubInterface<types.CommandBus>();
    eventBus = stubInterface<types.EventBus>();
    serializer = stubInterface<types.Serializer>();
    storage = stubInterface<types.CommitStorage>();
    observer = stubInterface<types.CommitObserver>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .toConstantValue(serializer);
    injector
      .bind<types.CommitStorage>(BINDINGS.CommitStorage)
      .toConstantValue(storage);
    injector
      .bind<types.CommitObserver>(BINDINGS.CommitObserver)
      .toConstantValue(observer);

    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('workerId').returns(workerId);
    config.get.withArgs('eveble.commitStore.timeout').returns(timeout);

    commitPublisher = new CommitPublisher();
    injector.injectInto(commitPublisher);
  });

  afterEach(() => {
    clock.restore();
  });

  it(`starts publishing commits by observing changes done on storage`, async () => {
    await commitPublisher.startPublishing();

    expect(observer.startObserving).to.be.calledOnce;
    expect(observer.startObserving).to.be.calledWithExactly(commitPublisher);

    expect(log.debug).to.be.calledTwice;
    expect(log.debug).to.be.calledWithExactly(
      new Log('starting observing commits')
        .on(commitPublisher)
        .in(commitPublisher.startPublishing)
    );
    expect(log.debug).to.be.calledWithExactly(
      new Log('started observing commits')
        .on(commitPublisher)
        .in(commitPublisher.startPublishing)
    );
  });

  it(`stops publishing commits by stopping observing changes done on storage`, async () => {
    await commitPublisher.stopPublishing();

    expect(observer.stopObserving).to.be.calledOnce;
    expect(observer.stopObserving).to.be.calledWithExactly();

    expect(log.debug).to.be.calledTwice;
    expect(log.debug).to.be.calledWithExactly(
      new Log('stopping observing commits')
        .on(commitPublisher)
        .in(commitPublisher.stopPublishing)
    );
    expect(log.debug).to.be.calledWithExactly(
      new Log('stopped observing commits')
        .on(commitPublisher)
        .in(commitPublisher.stopPublishing)
    );
  });

  describe(`publishing changes`, () => {
    let id;
    let event;
    let command;
    let commitId;
    let commit;

    beforeEach(() => {
      id = 'my-id';
      event = new MyEvent({
        sourceId: id,
        timestamp: now,
        version: 1,
      });
      command = new MyCommand({
        targetId: id,
        timestamp: now,
      });

      commitId = '91f09174-aebc-48e9-9ce8-672a670ede37';
      commit = new Commit({
        id: commitId,
        sourceId: id,
        version: 1,
        eventSourceableType: 'CommitPublisher.MyEventSourceable',
        events: [event],
        commands: [command],
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
      });
    });

    it(`publishes externally added commits in the current app if there is a registered handler`, async () => {
      serializer.hasType.withArgs('CommitPublisher.MyCommand').returns(true);
      commandBus.hasHandler.withArgs(MyCommand).returns(true);

      const expectedCommitStateAfterPublication = new Commit({
        ...commit,
        receivers: [
          new CommitReceiver({
            state: 'published',
            appId,
            workerId,
            receivedAt: now,
            publishedAt: now,
          }),
        ],
      });

      await commitPublisher.publishChanges(commit);

      expect(eventBus.publish).to.be.calledWith(event);

      expect(log.debug).to.be.calledWithMatch(
        new Log(`publishing 'CommitPublisher.MyEvent'`)
          .on(commitPublisher)
          .in('publishEvent')
          .with('event', event)
      );

      expect(serializer.hasType).to.be.calledWith('CommitPublisher.MyCommand');
      expect(commandBus.hasHandler).to.be.calledWith(MyCommand);
      expect(commandBus.send).to.be.calledWith(command);
      expect(log.debug).to.be.calledWithMatch(
        new Log(`sending 'CommitPublisher.MyCommand'`)
          .on(commitPublisher)
          .in('sendCommand')
          .with('command', command)
      );

      expect(storage.flagCommitAsPublished).to.be.calledOnce;
      expect(storage.flagCommitAsPublished).to.be.calledWithExactly(
        commitId,
        appId,
        workerId,
        now
      );

      expect(log.debug).to.be.calledWithMatch(
        new Log(
          `published commit with id '91f09174-aebc-48e9-9ce8-672a670ede37'`
        )
          .on(commitPublisher)
          .in(commitPublisher.publishChanges)
          .with('commit', expectedCommitStateAfterPublication)
      );
      expect(commit).to.be.eql(expectedCommitStateAfterPublication);
    });

    it(`fails the processing attempt if timeout is reached`, async () => {
      timeout = 5;
      config.get.withArgs('eveble.commitStore.timeout').returns(timeout);
      serializer.hasType.withArgs('CommitPublisher.MyCommand').returns(true);
      commandBus.hasHandler.withArgs(MyCommand).returns(true);
      // Simulate that handling command takes more time then allowed timeout
      commandBus.send = async (): Promise<void> => {
        return clock.tick(timeout + 5);
      };
      storage.flagAndResolveCommitAsTimeouted.returns(commit);

      const expectedCommitStateAfterTimeout = new Commit({
        ...commit,
        receivers: [
          new CommitReceiver({
            state: 'timeouted',
            appId,
            workerId,
            receivedAt: now,
            failedAt: new Date(new Date().getTime() + timeout),
          }),
        ],
      });

      await commitPublisher.publishChanges(commit);
      expect(commit).to.be.eql(expectedCommitStateAfterTimeout);

      expect(storage.flagAndResolveCommitAsTimeouted).to.be.calledOnce;
      expect(storage.flagAndResolveCommitAsTimeouted).to.be.calledWithMatch(
        commitId,
        appId,
        workerId,
        Date
      );

      expect(log.error).to.be.calledWithMatch(
        new Log(
          `timeouted commit with id '91f09174-aebc-48e9-9ce8-672a670ede37'`
        )
          .on(commitPublisher)
          .in('onTimeout')
          .with('failed commit', expectedCommitStateAfterTimeout)
      );
    });

    it(`handles error by flagging commit as failed and clearing the timeout`, async () => {
      const expectedCommitStateAfterFailed = new Commit({
        ...commit,
        receivers: [
          new CommitReceiver({
            state: 'failed',
            appId,
            workerId,
            receivedAt: now,
            failedAt: now,
          }),
        ],
      });

      serializer.hasType.withArgs('CommitPublisher.MyCommand').returns(true);
      commandBus.hasHandler.withArgs(MyCommand).returns(true);
      commandBus.send.withArgs(command).throws(new Error('my-error'));

      await expect(
        commitPublisher.publishChanges(commit)
      ).to.eventually.be.rejectedWith(Error, 'my-error');
      expect(commit).to.be.eql(expectedCommitStateAfterFailed);

      expect(storage.flagCommitAsFailed).to.be.calledOnce;
      expect(storage.flagCommitAsFailed).to.be.calledWithExactly(
        commitId,
        appId,
        workerId,
        now
      );

      expect(log.error).to.be.calledWithMatch(
        new Log(
          `failed publishing commit with id '91f09174-aebc-48e9-9ce8-672a670ede37'`
        )
          .on(commitPublisher)
          .in(commitPublisher.publishChanges)
          .with('commit', expectedCommitStateAfterFailed)
      );
    });

    it(`does not process commands that can't be handled`, async () => {
      commandBus.hasHandler.withArgs(MyCommand).returns(false);

      await commitPublisher.publishChanges(commit);
      expect(commandBus.send).to.not.be.called;
    });

    it(`stores each commit's publishing timeout using the id as a the key`, async () => {
      commitPublisher.commandBus.send = (): any => {
        return clock.tick(5);
      };
      serializer.hasType.withArgs('CommitPublisher.MyCommand').returns(true);
      commandBus.hasHandler.withArgs(MyCommand).returns(true);

      commitPublisher.publishChanges(commit);
      expect(commitPublisher.isInProgress(commitId)).to.be.true;
    });

    it(`cleans up after the commit is published, by deleting the object key`, async () => {
      serializer.hasType.withArgs('CommitPublisher.MyCommand').returns(true);
      commandBus.hasHandler.withArgs(MyCommand).returns(true);

      await commitPublisher.publishChanges(commit);
      expect(commitPublisher.isInProgress(commitId)).to.be.false;
    });

    it(`avoids potential race condition between commit being flagged as timeouted and published`, async () => {
      timeout = 5;
      config.get.withArgs('eveble.commitStore.timeout').returns(timeout);
      serializer.hasType.withArgs('CommitPublisher.MyCommand').returns(true);
      commandBus.hasHandler.withArgs(MyCommand).returns(true);
      // Simulate that handling command takes more time then allowed timeout
      commitPublisher.commandBus.send = (): any => {
        return clock.tick(timeout + 5);
      };
      storage.flagAndResolveCommitAsTimeouted.returns(commit);

      await commitPublisher.publishChanges(commit);

      expect(storage.flagAndResolveCommitAsTimeouted).to.be.calledOnce;
      expect(storage.flagCommitAsPublished).to.not.be.called;

      expect(commit).to.be.eql(
        new Commit({
          ...commit,
          receivers: [
            new CommitReceiver({
              state: 'timeouted',
              appId,
              workerId,
              receivedAt: now,
              failedAt: new Date(new Date().getTime() - timeout),
            }),
          ],
        })
      );
    });

    it(`tracks each commit's publishing timeout when publishing`, async () => {
      timeout = 5;
      config.get.withArgs('eveble.commitStore.timeout').returns(timeout);
      serializer.hasType.withArgs('CommitPublisher.MyCommand').returns(true);
      commandBus.hasHandler.withArgs(MyCommand).returns(true);
      // Simulate that handling command takes more time then allowed timeout
      commandBus.send = async (): Promise<any> => {
        return clock.tick(timeout + 5);
      };

      commitPublisher.publishChanges(commit);
      expect(commitPublisher.isInProgress(commitId)).to.be.true;
      await sleep(timeout); // [!]Simulate time passing since commitPublisher.publishChanges was executed as async
      expect(commitPublisher.isInProgress(commitId)).to.be.false;
    });
  });
});
