import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { define } from '../../../src/decorators/define';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { Log } from '../../../src/components/log-entry';
import { BINDINGS } from '../../../src/constants/bindings';
import { UndefinedSnapshotterFrequencyError } from '../../../src/infrastructure/infrastructure-errors';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Snapshotter`, function () {
  @define('Snapshotter.MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {}

  let injector: Injector;
  let config: any;
  let log: any;
  let storage: any;
  let versionFrequency: number;
  let snapshotter: any;

  beforeEach(() => {
    injector = new Injector();
    config = stubInterface<types.Configurable>();
    log = stubInterface<types.Logger>();
    storage = stubInterface<types.SnapshotStorage>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
      .toConstantValue(storage);

    versionFrequency = 10;
    config.has.withArgs('eveble.Snapshotter.frequency').returns(true);
    config.get
      .withArgs('eveble.Snapshotter.frequency')
      .returns(versionFrequency);

    snapshotter = new Snapshotter();
    injector.injectInto(snapshotter);
  });

  it(`throws UndefinedSnapshotterFrequencyError when frequency for snapshotting is not set on configuration`, () => {
    const instance = new Snapshotter();
    config.has.withArgs('eveble.Snapshotter.frequency').returns(false);
    expect(() => injector.injectInto(instance)).to.throw(
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
      expect(storage.update).to.be.not.called;
      expect(storage.save).to.be.not.called;
    });

    it(`logs skipping snapshot when not enough versions have passed`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency - 1;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(log.debug).to.be.calledWithMatch(
        new Log(
          `not enough version passed(9<=10) on 'Snapshotter.MyEventSourceable' with id 'my-id' to create new snapshot of event sourceable`
        )
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('current version', eventSourceable.version)
          .with('snapshot frequency', 10)
      );
    });

    it(`saves the current state of event sourceable to storage`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;
      storage.findById.returns(undefined);

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(storage.save).to.be.calledOnce;
      expect(storage.save).to.be.calledWithExactly(eventSourceable);
      expect(storage.update).to.be.not.called;
    });

    it(`logs saving the current state of event sourceable to storage`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;
      storage.findById.returns(undefined);

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(log.debug).to.be.calledWithMatch(
        new Log(`snapshotting 'Snapshotter.MyEventSourceable' with id 'my-id'`)
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      );
      expect(log.debug).to.be.calledWithMatch(
        new Log(
          `created new snapshot of 'Snapshotter.MyEventSourceable' with id 'my-id'`
        )
          .on(snapshotter)
          .in('saveToStorage')
          .with('event sourceable', eventSourceable)
      );
    });

    it(`logs thrown error on new snapshot creation`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;
      storage.findById.returns(undefined);
      storage.save.rejects(new Error('my-error'));

      await expect(
        snapshotter.makeSnapshotOf(eventSourceable)
      ).to.eventually.be.rejectedWith(Error);
      expect(log.error).to.be.calledWithMatch(
        new Log(
          `failed creating snapshot of 'Snapshotter.MyEventSourceable' with id 'my-id' do to error: Error: my-error`
        )
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      );
    });

    it(`updates existing event sourceable snapshot on storage`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency;
      storage.findById.returns(lastSnapshot);

      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency + 10;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(storage.update).to.be.calledOnce;
      expect(storage.update).to.be.calledWithExactly(
        eventSourceable,
        lastSnapshot
      );
      expect(storage.save).to.be.not.called;
    });

    it(`logs updating existing event sourceable snapshot on storage`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency;
      storage.findById.returns(lastSnapshot);

      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency + 10;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(log.debug).to.be.calledWithMatch(
        new Log(`snapshotting 'Snapshotter.MyEventSourceable' with id 'my-id'`)
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      );
      expect(log.debug).to.be.calledWithMatch(
        new Log(
          `updated last found snapshot(10) for 'Snapshotter.MyEventSourceable' with id 'my-id'`
        )
          .on(snapshotter)
          .in('updateOnStorage')
          .with('updated last snapshot', lastSnapshot)
      );
    });

    it(`logs thrown error on snapshot update`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency;
      storage.findById.returns(lastSnapshot);
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency + 10;
      const error = new Error('my-error');
      storage.update.rejects(error);

      await expect(
        snapshotter.makeSnapshotOf(eventSourceable)
      ).to.eventually.be.rejectedWith(Error);
      expect(log.error).to.be.calledWithExactly(
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
      storage.findById.returns(lastSnapshot);

      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(storage.update).to.be.not.called;
      expect(storage.save).to.be.not.called;
    });

    it(`logs not updating existing event sourceable snapshot when not enough versions have passed`, async () => {
      const id = 'my-id';
      const lastSnapshot = new MyEventSourceable({
        id,
      });
      lastSnapshot.version = versionFrequency - 1;
      storage.findById.returns(lastSnapshot);

      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = versionFrequency;

      await snapshotter.makeSnapshotOf(eventSourceable);
      expect(log.debug).to.be.calledWithMatch(
        new Log(`snapshotting 'Snapshotter.MyEventSourceable' with id 'my-id'`)
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      );
      expect(log.debug).to.be.calledWithMatch(
        new Log(
          `not enough version passed(9<=10) on 'Snapshotter.MyEventSourceable' with id 'my-id' to update last snapshot`
        )
          .on(snapshotter)
          .in(snapshotter.makeSnapshotOf)
          .with('last snapshot', lastSnapshot)
          .with('last snapshot version', lastSnapshot.version)
          .with('current version', eventSourceable.version)
          .with('snapshot frequency', 10)
      );
    });
  });

  describe(`restoring latest snapshot of event sourceable`, () => {
    it(`creates and returns an aggregate instance based on the snapshot`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      storage.findById.returns(eventSourceable);

      const snapshot = await snapshotter.getSnapshotOf(MyEventSourceable, id);
      expect(snapshot).to.be.equal(eventSourceable);
      expect(storage.findById).to.be.calledWith(MyEventSourceable, id);
    });

    it(`returns undefined if event sourceable snapshot cannot be found on storage`, async () => {
      const id = 'my-id';
      storage.findById.returns(undefined);

      const snapshot = await snapshotter.getSnapshotOf(MyEventSourceable, id);
      expect(snapshot).to.be.equal(undefined);
    });
  });
});
