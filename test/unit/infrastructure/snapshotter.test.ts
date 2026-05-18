import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import { Type } from '@eveble/core';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { Log } from '../../../src/components/log-entry';
import { BINDINGS } from '../../../src/constants/bindings';
import { UndefinedSnapshotterFrequencyError } from '../../../src/infrastructure/infrastructure-errors';

describe(`Snapshotter`, () => {
  @Type('Snapshotter.MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {}

  let injector: Injector;
  let config: any;
  let log: any;
  let storage: any;
  let versionFrequency: number;
  let snapshotter: any;

  beforeEach(() => {
    injector = new Injector();
    config = mock<types.Configurable>();
    log = mock<types.Logger>();
    storage = mock<types.SnapshotStorage>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
      .toConstantValue(storage);

    versionFrequency = 10;
    config.has.calledWith('eveble.Snapshotter.frequency').mockReturnValue(true);
    config.get
      .calledWith('eveble.Snapshotter.frequency')
      .mockReturnValue(versionFrequency);

    snapshotter = new Snapshotter();
    injector.injectInto(snapshotter);
  });

  it(`throws UndefinedSnapshotterFrequencyError when frequency for snapshotting is not set on configuration`, () => {
    const instance = new Snapshotter();
    config.has.calledWith('eveble.Snapshotter.frequency').mockReturnValue(false);
    expect(() => injector.injectInto(instance)).toThrow(
      UndefinedSnapshotterFrequencyError,
      `Missing snapshotting frequency on configuration with path: 'eveble.Snapshotter.frequency`
    );
  });

  describe(`making snapshots`, () => {
    it(`skips snapshot if not enough versions have passed`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency - 1;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(storage.update).not.toHaveBeenCalled();
      expect(storage.save).not.toHaveBeenCalled();
    });

    it(`logs skipping snapshot when not enough versions have passed`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency - 1;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(
          `not enough version passed(9<=10) on 'Snapshotter.MyEventSourceable' with id 'my-id' to create new snapshot of event sourceable`
        )
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('current version', eventSourceable.version)
          .with('snapshot frequency', 10)
      ));
    });

    it(`saves the current state of event sourceable to storage`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;
      storage.findById.mockReturnValue(undefined);

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(storage.save).toHaveBeenCalledTimes(1);
      expect(storage.save).toHaveBeenCalledWith(eventSourceable);
      expect(storage.update).not.toHaveBeenCalled();
    });

    it(`logs saving the current state of event sourceable to storage`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;
      storage.findById.mockReturnValue(undefined);

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`snapshotting 'Snapshotter.MyEventSourceable' with id 'my-id'`)
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      ));
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(
          `created new snapshot of 'Snapshotter.MyEventSourceable' with id 'my-id'`
        )
          .on(snapshotter)
          .in('saveToStorage')
          .with('event sourceable', eventSourceable)
      ));
    });

    it(`logs thrown error on new snapshot creation`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;
      storage.findById.mockReturnValue(undefined);
      storage.save.mockRejectedValue(new Error('my-error'));

      await expect(
        snapshotter.makeSnapshotOf(eventSourceable)
      ).rejects.toThrow(Error);
      expect(log.error).toHaveBeenCalledWith(expect.objectContaining(
        new Log(
          `failed creating snapshot of 'Snapshotter.MyEventSourceable' with id 'my-id' do to error: Error: my-error`
        )
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      ));
    });

    it(`updates existing event sourceable snapshot on storage`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency;
      storage.findById.mockReturnValue(lastSnapshot);

      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency + 10;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(storage.update).toHaveBeenCalledTimes(1);
      expect(storage.update).toHaveBeenCalledWith(
        eventSourceable,
        lastSnapshot
      );
      expect(storage.save).not.toHaveBeenCalled();
    });

    it(`logs updating existing event sourceable snapshot on storage`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency;
      storage.findById.mockReturnValue(lastSnapshot);

      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency + 10;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`snapshotting 'Snapshotter.MyEventSourceable' with id 'my-id'`)
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      ));
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(
          `updated last found snapshot(10) for 'Snapshotter.MyEventSourceable' with id 'my-id'`
        )
          .on(snapshotter)
          .in('updateOnStorage')
          .with('updated last snapshot', lastSnapshot)
      ));
    });

    it(`logs thrown error on snapshot update`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency;
      storage.findById.mockReturnValue(lastSnapshot);
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency + 10;
      const error = new Error('my-error');
      storage.update.mockRejectedValue(error);

      await expect(
        snapshotter.makeSnapshotOf(eventSourceable)
      ).rejects.toThrow(Error);
      expect(log.error).toHaveBeenCalledWith(
        new Log(
          `failed to update last found snapshot(10) for 'Snapshotter.MyEventSourceable' with id 'my-id' do to error: Error: my-error`
        )
          .on(snapshotter)
          .in('updateOnStorage')
          .with('event sourceable', eventSourceable)
          .with('updated last snapshot', lastSnapshot)
          .with('error', error)
      );
    });

    it(`does not update existing event sourceable snapshot when not enough versions have passed`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency - 1;
      storage.findById.mockReturnValue(lastSnapshot);

      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(storage.update).not.toHaveBeenCalled();
      expect(storage.save).not.toHaveBeenCalled();
    });

    it(`logs not updating existing event sourceable snapshot when not enough versions have passed`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency - 1;
      storage.findById.mockReturnValue(lastSnapshot);

      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(`snapshotting 'Snapshotter.MyEventSourceable' with id 'my-id'`)
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      ));
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining(
        new Log(
          `not enough version passed(9<=10) on 'Snapshotter.MyEventSourceable' with id 'my-id' to update last snapshot`
        )
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('last snapshot', lastSnapshot)
          .with('last snapshot version', lastSnapshot.version)
          .with('current version', eventSourceable.version)
          .with('snapshot frequency', 10)
      ));
    });
  });

  describe(`restoring latest snapshot of event sourceable`, () => {
    it(`creates and returns an aggregate instance based on the snapshot`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      storage.findById.mockReturnValue(eventSourceable);

      const snapshot = await snapshotter.getSnapshotOf(MyEventSourceable, id);
      expect(snapshot).toBe(eventSourceable);
      expect(storage.findById).toHaveBeenCalledWith(MyEventSourceable, id);
    });

    it(`returns undefined if event sourceable snapshot cannot be found on storage`, async () => {
      const id = 'my-id';
      storage.findById.mockReturnValue(undefined);

      const snapshot = await snapshotter.getSnapshotOf(MyEventSourceable, id);
      expect(snapshot).toBe(undefined);
    });
  });
});

