import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, vi, beforeAll } from 'vitest';

import { Type } from '@eveble/core';
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

function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe(`CommitPublisher`, () => {
  @Type('CommitPublisher.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {}
  @Type('CommitPublisher.MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {}

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

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = vi.useFakeTimers({ now });
    timeout = 60;

    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();
    commandBus = mock<types.CommandBus>();
    eventBus = mock<types.EventBus>();
    serializer = mock<types.Serializer>();
    storage = mock<types.CommitStorage>();
    observer = mock<types.CommitObserver>();

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

    config.get.calledWith('appId').mockReturnValue(appId);
    config.get.calledWith('workerId').mockReturnValue(workerId);
    config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(timeout);

    commitPublisher = new CommitPublisher();
    injector.injectInto(commitPublisher);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it(`starts publishing commits by observing changes done on storage`, async () => {
    await commitPublisher.startPublishing();

    expect(observer.startObserving).toHaveBeenCalledTimes(1);
    expect(observer.startObserving).toHaveBeenCalledWith(commitPublisher);

    expect(log.debug).toHaveBeenCalledTimes(2);
    expect(log.debug).toHaveBeenCalledWith(
      new Log('starting observing commits')
        .on(commitPublisher)
        .in(commitPublisher.startPublishing)
    );
    expect(log.debug).toHaveBeenCalledWith(
      new Log('started observing commits')
        .on(commitPublisher)
        .in(commitPublisher.startPublishing)
    );
  });

  it(`stops publishing commits by stopping observing changes done on storage`, async () => {
    await commitPublisher.stopPublishing();

    expect(observer.stopObserving).toHaveBeenCalledTimes(1);
    expect(observer.stopObserving).toHaveBeenCalledWith();

    expect(log.debug).toHaveBeenCalledTimes(2);
    expect(log.debug).toHaveBeenCalledWith(
      new Log('stopping observing commits')
        .on(commitPublisher)
        .in(commitPublisher.stopPublishing)
    );
    expect(log.debug).toHaveBeenCalledWith(
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
      serializer.hasType.calledWith('CommitPublisher.MyCommand').mockReturnValue(true);
      commandBus.hasHandler.calledWith(MyCommand).mockReturnValue(true);

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

      expect(eventBus.publish).toHaveBeenCalledWith(event);

      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`publishing 'CommitPublisher.MyEvent'`)
          .on(commitPublisher)
          .in('publishEvent')
          .with('event', event)
      ));

      expect(serializer.hasType).toHaveBeenCalledWith('CommitPublisher.MyCommand');
      expect(commandBus.hasHandler).toHaveBeenCalledWith(MyCommand);
      expect(commandBus.send).toHaveBeenCalledWith(command);
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`sending 'CommitPublisher.MyCommand'`)
          .on(commitPublisher)
          .in('sendCommand')
          .with('command', command)
      ));

      expect(storage.flagCommitAsPublished).toHaveBeenCalledTimes(1);
      expect(storage.flagCommitAsPublished).toHaveBeenCalledWith(
        commitId,
        appId,
        workerId,
        now
      );

      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(
          `published commit with id '91f09174-aebc-48e9-9ce8-672a670ede37'`
        )
          .on(commitPublisher)
          .in(commitPublisher.publishChanges)
          .with('commit', expectedCommitStateAfterPublication)
      ));
      expect(commit).toEqual(expectedCommitStateAfterPublication);
    });

    it(`fails the processing attempt if timeout is reached`, async () => {
      timeout = 5;
      config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(timeout);
      serializer.hasType.calledWith('CommitPublisher.MyCommand').mockReturnValue(true);
      commandBus.hasHandler.calledWith(MyCommand).mockReturnValue(true);
      // Simulate that handling command takes more time then allowed timeout
      commandBus.send = async (): Promise<void> => vi.advanceTimersByTime(timeout + 5);
      storage.flagAndResolveCommitAsTimeouted.mockReturnValue(commit);

      const expectedCommitStateAfterTimeout = new Commit({
        ...commit,
        receivers: [
          new CommitReceiver({
            state: 'timeouted',
            appId,
            workerId,
            receivedAt: now,
            failedAt: new Date(now.getTime() + timeout),
          }),
        ],
      });

      await commitPublisher.publishChanges(commit);
      expect(commit).toEqual(expectedCommitStateAfterTimeout);

      expect(storage.flagAndResolveCommitAsTimeouted).toHaveBeenCalledTimes(1);
      expect(storage.flagAndResolveCommitAsTimeouted).toHaveBeenCalledWith(
        commitId,
        appId,
        workerId,
        expect.any(Date)
      );

      expect(log.error).toHaveBeenCalledWith(expect.objectContaining(
        new Log(
          `timeouted commit with id '91f09174-aebc-48e9-9ce8-672a670ede37'`
        )
          .on(commitPublisher)
          .in('onTimeout')
          .with('failed commit', expectedCommitStateAfterTimeout)
      ));
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

      serializer.hasType.calledWith('CommitPublisher.MyCommand').mockReturnValue(true);
      commandBus.hasHandler.calledWith(MyCommand).mockReturnValue(true);
      commandBus.send.calledWith(command).mockImplementation(() => { throw new Error('my-error'); });

      await expect(
        commitPublisher.publishChanges(commit)
      ).rejects.toThrow(Error, 'my-error');
      expect(commit).toEqual(expectedCommitStateAfterFailed);

      expect(storage.flagCommitAsFailed).toHaveBeenCalledTimes(1);
      expect(storage.flagCommitAsFailed).toHaveBeenCalledWith(
        commitId,
        appId,
        workerId,
        now
      );

      expect(log.error).toHaveBeenCalledWith(expect.objectContaining(
        new Log(
          `failed publishing commit with id '91f09174-aebc-48e9-9ce8-672a670ede37'`
        )
          .on(commitPublisher)
          .in(commitPublisher.publishChanges)
          .with('commit', expectedCommitStateAfterFailed)
      ));
    });

    it(`does not process commands that can't be handled`, async () => {
      commandBus.hasHandler.calledWith(MyCommand).mockReturnValue(false);

      await commitPublisher.publishChanges(commit);
      expect(commandBus.send).not.toHaveBeenCalled();
    });

    it(`stores each commit's publishing timeout using the id as a the key`, async () => {
      commitPublisher.commandBus.send = (): any => vi.advanceTimersByTime(5);
      serializer.hasType.calledWith('CommitPublisher.MyCommand').mockReturnValue(true);
      commandBus.hasHandler.calledWith(MyCommand).mockReturnValue(true);

      commitPublisher.publishChanges(commit);
      expect(commitPublisher.isInProgress(commitId)).toBe(true);
    });

    it(`cleans up after the commit is published, by deleting the object key`, async () => {
      serializer.hasType.calledWith('CommitPublisher.MyCommand').mockReturnValue(true);
      commandBus.hasHandler.calledWith(MyCommand).mockReturnValue(true);

      await commitPublisher.publishChanges(commit);
      expect(commitPublisher.isInProgress(commitId)).toBe(false);
    });

    it(`avoids potential race condition between commit being flagged as timeouted and published`, async () => {
      timeout = 5;
      config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(timeout);
      serializer.hasType.calledWith('CommitPublisher.MyCommand').mockReturnValue(true);
      commandBus.hasHandler.calledWith(MyCommand).mockReturnValue(true);
      // Simulate that handling command takes more time then allowed timeout
      commitPublisher.commandBus.send = (): any => vi.advanceTimersByTime(timeout + 5);
      storage.flagAndResolveCommitAsTimeouted.mockReturnValue(commit);

      await commitPublisher.publishChanges(commit);

      expect(storage.flagAndResolveCommitAsTimeouted).toHaveBeenCalledTimes(1);
      expect(storage.flagCommitAsPublished).not.toHaveBeenCalled();

      expect(commit).toEqual(
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
      config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(timeout);
      serializer.hasType.calledWith('CommitPublisher.MyCommand').mockReturnValue(true);
      commandBus.hasHandler.calledWith(MyCommand).mockReturnValue(true);
      // Simulate that handling command takes more time then allowed timeout
      commandBus.send = async (): Promise<any> => vi.advanceTimersByTime(timeout + 5);

      commitPublisher.publishChanges(commit);
      expect(commitPublisher.isInProgress(commitId)).toBe(true);
      await sleep(timeout); // [!]Simulate time passing since commitPublisher.publishChanges was executed as async
      expect(commitPublisher.isInProgress(commitId)).toBe(false);
    });
  });
});

