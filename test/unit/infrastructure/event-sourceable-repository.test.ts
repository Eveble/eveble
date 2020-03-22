import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { define } from '../../../src/decorators/define';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { Aggregate } from '../../../src/domain/aggregate';
import { Process } from '../../../src/domain/process';
import { History } from '../../../src/domain/history';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { EventSourceableRepository } from '../../../src/infrastructure/event-sourceable-repository';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { initial } from '../../../src/annotations/initial';
import { subscribe } from '../../../src/annotations/subscribe';
import { Log } from '../../../src/components/log-entry';
import {
  EventsNotFoundError,
  UndefinedSnapshotterError,
} from '../../../src/infrastructure/infrastructure-errors';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`EventSourceableRepository`, function() {
  @define('MyInitEvent', { isRegistrable: false })
  class MyInitEvent extends Event {
    name: string;
  }

  @define('MyOtherEvent', { isRegistrable: false })
  class MyOtherEvent extends Event {
    age: number;
  }

  @define('Namespace.MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {
    name?: string;

    age?: number;

    MyInitEvent(@initial event: MyInitEvent): void {
      this.name = event.name;
    }

    MyOtherEvent(@subscribe event: MyOtherEvent): void {
      this.age = event.age;
    }
  }

  @define('Namespace.MyAggregate', { isRegistrable: false })
  class MyAggregate extends Aggregate {
    name?: string;

    age?: number;

    MyInitEvent(@initial event: MyInitEvent): void {
      this.name = event.name;
    }

    MyOtherEvent(@subscribe event: MyOtherEvent): void {
      this.age = event.age;
    }
  }

  @define('MyProcess', { isRegistrable: false })
  class MyProcess extends Process {
    name: string;

    age: number;

    MyInitEvent(@initial event: MyInitEvent): void {
      this.name = event.name;
    }

    MyOtherEvent(@subscribe event: MyOtherEvent): void {
      this.age = event.age;
    }
  }

  let now: Date;
  let injector: Injector;
  let log: any;
  let config: any;
  let commitStore: any;
  let snapshotter: any;
  let repository: EventSourceableRepository;
  let commit: Commit;

  const props: Record<string, any> = {};
  const events: Record<string, Event> = {};

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    injector = new Injector();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();
    commitStore = stubInterface<types.CommitStore>();
    snapshotter = stubInterface<types.Snapshotter>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .toConstantValue(commitStore);
    repository = new EventSourceableRepository();
    injector.injectInto(repository);

    props.id = new Guid();
    events.initEvent = new MyInitEvent({
      sourceId: props.id,
      name: 'Foo',
      timestamp: now,
    });
    events.otherEvent = new MyOtherEvent({
      sourceId: props.id,
      age: 20,
      timestamp: now,
    });

    commit = new Commit({
      id: 'commit-id',
      sourceId: props.id.toString(),
      version: 0,
      eventSourceableType: 'Namespace.MyAggregate',
      commands: [],
      events: [],
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
  });

  describe(`saving(persisting)`, () => {
    it(`persists event sourceable as a serialized and versioned commit`, async () => {
      commitStore.createCommit.returns(commit);

      const esInstance = new MyEventSourceable({ id: props.id });
      expect(esInstance.getVersion()).to.be.equal(0);

      await repository.save(esInstance);
      expect(esInstance.getVersion()).to.be.equal(1);
      expect(commitStore.addCommit).to.be.calledOnce;
      expect(commitStore.addCommit).to.be.calledWithExactly(commit);
    });

    it(`persists event sourceable as commit and snapshots it when snapshotter is defined`, async () => {
      injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .toConstantValue(snapshotter);
      commitStore.createCommit.returns(commit);
      config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);

      const esInstance = new MyEventSourceable({ id: props.id });
      expect(esInstance.getVersion()).to.be.equal(0);

      await repository.save(esInstance);
      expect(esInstance.getVersion()).to.be.equal(1);
      expect(commitStore.addCommit).to.be.calledWithExactly(commit);
      expect(snapshotter.makeSnapshotOf).to.be.calledWithExactly(esInstance);
    });

    it('logs saving event sourceable', async () => {
      commitStore.createCommit.returns(commit);

      const esInstance = new MyEventSourceable({ id: props.id });
      await repository.save(esInstance);
      expect(log.debug).to.be.calledWithMatch(
        new Log(
          `saving 'Namespace.MyEventSourceable' with id '${esInstance.id}'`
        )
          .on(repository)
          .in(repository.save)
          .with('event sourceable', esInstance)
      );
      expect(log.debug).to.be.calledWithMatch(
        new Log(
          `saved 'Namespace.MyEventSourceable' with id '${esInstance.id}'`
        )
          .on(repository)
          .in(repository.save)
          .with('event sourceable', esInstance)
      );
    });

    it('logs thrown error while saving commit to storage', async () => {
      commitStore.createCommit.returns(commit);
      commitStore.addCommit.rejects(new Error('my-error'));

      const esInstance = new MyEventSourceable({ id: props.id });
      await expect(repository.save(esInstance)).to.eventually.be.rejectedWith(
        Error
      );

      expect(log.error).to.be.calledWithExactly(
        new Log(
          `failed saving 'Namespace.MyEventSourceable' with id '${esInstance.id}' do to error: Error: my-error`
        )
          .on(repository)
          .in(repository.save)
          .with('event sourceable', esInstance)
      );
    });

    it('logs thrown error while saving snapshot to storage', async () => {
      commitStore.createCommit.returns(commit);
      snapshotter.makeSnapshotOf.rejects(new Error('my-error'));
      injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .toConstantValue(snapshotter);
      config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);

      const esInstance = new MyEventSourceable({ id: props.id });
      await expect(repository.save(esInstance)).to.eventually.be.rejectedWith(
        Error
      );

      expect(log.error).to.be.calledWithExactly(
        new Log(
          `failed saving 'Namespace.MyEventSourceable' with id '${esInstance.id}' do to error: Error: my-error`
        )
          .on(repository)
          .in(repository.save)
          .with('event sourceable', esInstance)
      );
    });
  });

  describe(`finding`, () => {
    it(`returns undefined when event sourceable cannot be re-hydrated from event history`, async () => {
      commitStore.getEvents.withArgs(props.id).returns(undefined);

      const result = await repository.find(MyEventSourceable, props.id);
      expect(result).to.be.equal(undefined);
      expect(commitStore.getEvents).to.be.calledWithExactly(props.id);
    });

    it(`logs not found event sourceable when it cannot be restored`, async () => {
      commitStore.getEvents.withArgs(props.id).returns(undefined);

      await repository.find(MyEventSourceable, props.id);
      expect(log.notice).to.be.calledWithExactly(
        new Log(`'Namespace.MyEventSourceable' not found with id '${props.id}'`)
          .on(repository)
          .in(repository.find)
      );
    });

    it(`returns undefined when event sourceable cannot be restored from snapshotter`, async () => {
      injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .toConstantValue(snapshotter);
      config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);
      snapshotter.getSnapshotOf.returns(undefined);
      commitStore.getEvents.withArgs(props.id).returns(undefined);

      const result = await repository.find(MyEventSourceable, props.id);
      expect(result).to.be.equal(undefined);
      expect(snapshotter.getSnapshotOf).to.be.calledWithExactly(
        MyEventSourceable,
        props.id
      );
    });

    it(`throws EventsNotFoundError when commit store returns empty event history`, async () => {
      commitStore.getEvents.withArgs(props.id).returns([]);

      await expect(
        repository.find(MyEventSourceable, props.id)
      ).to.eventually.be.rejectedWith(
        EventsNotFoundError,
        `No events found for event sourceable 'Namespace.MyEventSourceable' with id '${props.id}'`
      );
    });

    it(`logs error when commit store returns empty event history`, async () => {
      commitStore.getEvents.withArgs(props.id).returns([]);

      await expect(
        repository.find(MyEventSourceable, props.id)
      ).to.eventually.be.rejectedWith(EventsNotFoundError);
      expect(log.error).to.be.calledWithMatch(
        new Log(
          `no events found for 'Namespace.MyEventSourceable' with id '${props.id}'`
        )
          .on(repository)
          .in('rehydrateFromEventHistory')
      );
    });

    describe(`re-hydration`, () => {
      context('aggregate', () => {
        it(`returns a re-hydrated instance of the expected version of aggregate`, async () => {
          commitStore.getEvents
            .withArgs(props.id)
            .returns([events.initEvent, events.otherEvent]);

          const aggregate = (await repository.find(
            MyAggregate,
            props.id
          )) as MyAggregate;
          expect(aggregate.name).to.be.equal('Foo');
          expect(aggregate.age).to.be.equal(20);
          expect(commitStore.getEvents).to.be.calledWithExactly(props.id);
        });

        it(`logs fetching event history for aggregate`, async () => {
          const eventHistory = [events.initEvent, events.otherEvent];
          commitStore.getEvents.withArgs(props.id).returns(eventHistory);

          await repository.find(MyAggregate, props.id);
          expect(log.debug).to.be.calledWithExactly(
            new Log(
              `fetching event history for 'Namespace.MyAggregate' with id '${props.id}'`
            )
              .on(repository)
              .in('rehydrateFromEventHistory')
          );
        });

        it(`logs a re-hydrated instance of the expected version of aggregate`, async () => {
          const eventHistory = [events.initEvent, events.otherEvent];
          commitStore.getEvents.withArgs(props.id).returns(eventHistory);

          await repository.find(MyAggregate, props.id);
          expect(log.debug).to.be.calledWithExactly(
            new Log(
              `re-hydrated 'Namespace.MyAggregate' with id '${props.id}' from event history`
            )
              .on(repository)
              .in('rehydrateFromEventHistory')
              .with('event history', eventHistory)
          );
        });
      });

      context('process', () => {
        it(`returns a re-hydrated instance of the expected version of process`, async () => {
          commitStore.getEvents
            .withArgs(props.id)
            .returns([events.initEvent, events.otherEvent]);

          const process = (await repository.find(
            MyProcess,
            props.id
          )) as MyProcess;
          expect(process.name).to.be.equal('Foo');
          expect(process.age).to.be.equal(20);
          expect(commitStore.getEvents).to.be.calledWithExactly(props.id);
        });
      });
    });

    describe(`restoring snapshot`, () => {
      let snapshotedEs: MyAggregate;

      context('aggregate', () => {
        beforeEach(() => {
          snapshotedEs = new MyAggregate(
            new History([events.initEvent, events.otherEvent])
          );
        });

        it(`does not call snapshotter when snapshotter is not defined on repository`, async () => {
          await repository.find(MyAggregate, props.id);
          expect(snapshotter.getSnapshotOf).to.be.not.called;
        });

        it(`returns aggregate restored from snapshot`, async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          snapshotter.getSnapshotOf.returns(snapshotedEs);
          config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);
          commitStore.getEvents.withArgs(props.id).returns([]);

          await repository.save(snapshotedEs); // Save aggregate so it's version is updated to 2
          const foundEs = await repository.find(MyAggregate, props.id);
          expect(foundEs).to.be.equal(snapshotedEs);

          expect(snapshotter.getSnapshotOf).to.be.calledWithExactly(
            MyAggregate,
            props.id
          );
        });

        it('logs restoring event sourceable from snapshot', async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);
          snapshotter.getSnapshotOf.returns(snapshotedEs);
          commitStore.getEvents.withArgs(props.id).returns([]);

          await repository.find(MyEventSourceable, props.id);
          expect(log.debug).to.be.calledWithMatch(
            new Log(
              `restoring 'Namespace.MyEventSourceable' with id '${props.id}' from snapshot`
            )
              .on(repository)
              .in('restoreFromSnapshot')
          );
        });

        it('logs restored event sourceable from snapshot', async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);
          snapshotter.getSnapshotOf.returns(snapshotedEs);
          commitStore.getEvents.withArgs(props.id).returns([]);

          await repository.find(MyEventSourceable, props.id);
          expect(log.debug).to.be.calledWithExactly(
            new Log(
              `restored 'Namespace.MyEventSourceable' with id '${props.id}' from snapshot`
            )
              .on(repository)
              .in('restoreFromSnapshot')
              .with('event sourceable', snapshotedEs)
          );
        });

        it(`returns aggregate restored from snapshot with replayed remaining eventSourceable events from commit store`, async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);
          snapshotter.getSnapshotOf.returns(snapshotedEs);
          const thirdEvent = new MyOtherEvent({
            sourceId: props.id,
            age: 25,
            version: 2,
            timestamp: now,
          });
          const fourthEvent = new MyOtherEvent({
            sourceId: props.id,
            age: 26,
            version: 3,
            timestamp: now,
          });
          const remainingEvents = [thirdEvent, fourthEvent];
          commitStore.getEvents.withArgs(props.id).returns(remainingEvents);

          await repository.save(snapshotedEs); // Save aggregate so it's version is updated to 2
          const foundEs = (await repository.find(
            MyAggregate,
            props.id
          )) as MyAggregate;
          expect(foundEs).to.be.instanceof(MyAggregate);
          expect(foundEs.id).to.be.equal(props.id);
          expect(foundEs.age).to.be.equal(26);
          expect(foundEs.getVersion()).to.be.equal(3);

          expect(snapshotter.getSnapshotOf).to.be.calledWithExactly(
            MyAggregate,
            props.id
          );
          expect(commitStore.getEvents).to.be.calledWithExactly(props.id, 2);
        });

        it('logs restored event sourceable from snapshot with replayed remaining events from commit store', async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);
          snapshotter.getSnapshotOf.returns(snapshotedEs);
          const thirdEvent = new MyOtherEvent({
            sourceId: props.id,
            age: 25,
            version: 2,
            timestamp: now,
          });
          const fourthEvent = new MyOtherEvent({
            sourceId: props.id,
            age: 26,
            version: 3,
            timestamp: now,
          });
          const remainingEvents = [thirdEvent, fourthEvent];
          commitStore.getEvents.withArgs(props.id).returns(remainingEvents);

          await repository.find(MyEventSourceable, props.id);
          expect(log.debug).to.be.calledWithMatch(
            new Log(
              `replaying history on snapshot of 'Namespace.MyEventSourceable' with id '${props.id}'`
            )
              .on(repository)
              .in('restoreFromSnapshot')
              .with('event sourceable', snapshotedEs)
              .with('remaining events', remainingEvents)
          );
        });
      });

      context('process', () => {
        beforeEach(() => {
          snapshotedEs = new MyProcess(
            new History([events.initEvent, events.otherEvent])
          );
        });

        it(`does not call snapshotter when snapshotter is not defined on repository`, async () => {
          await repository.find(MyProcess, props.id);
          expect(snapshotter.getSnapshotOf).to.be.not.called;
        });

        it(`returns process restored from snapshot`, async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          snapshotter.getSnapshotOf.returns(snapshotedEs);
          config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);

          commitStore.getEvents.withArgs(props.id).returns([]);

          await repository.save(snapshotedEs); // Save process so it's version is updated to 2
          const foundEs = await repository.find(MyProcess, props.id);
          expect(foundEs).to.be.equal(snapshotedEs);

          expect(snapshotter.getSnapshotOf).to.be.calledWithExactly(
            MyProcess,
            props.id
          );
        });

        it(`returns process restored from snapshot with replayed remaining eventSourceable events from commit store`, async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          snapshotter.getSnapshotOf.returns(snapshotedEs);
          config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);

          const thirdEvent = new MyOtherEvent({
            sourceId: props.id,
            age: 25,
            version: 2,
            timestamp: now,
          });
          const fourthEvent = new MyOtherEvent({
            sourceId: props.id,
            age: 26,
            version: 3,
            timestamp: now,
          });
          commitStore.getEvents
            .withArgs(props.id)
            .returns([thirdEvent, fourthEvent]);

          await repository.save(snapshotedEs); // Save process so it's version is updated to 2
          const foundEs = (await repository.find(
            MyProcess,
            props.id
          )) as MyProcess;
          expect(foundEs).to.be.instanceof(MyProcess);
          expect(foundEs.id).to.be.equal(props.id);
          expect(foundEs.age).to.be.equal(26);
          expect(foundEs.getVersion()).to.be.equal(3);

          expect(snapshotter.getSnapshotOf).to.be.calledWithExactly(
            MyProcess,
            props.id
          );
          expect(commitStore.getEvents).to.be.calledWithExactly(props.id, 2);
        });
      });
    });
  });

  describe(`using snapshotter`, () => {
    describe(`throwing UndefinedSnapshotterError on snapshot related methods`, () => {
      it(`on snapshot creation`, async () => {
        const esInstance = new EventSourceable({ id: props.id });

        expect(
          repository.makeSnapshotOf(esInstance)
        ).to.eventually.be.rejectedWith(
          UndefinedSnapshotterError,
          `Snapshotter is not defined on EventSourceableRepository`
        );
      });

      it(`on restoring snapshot`, async () => {
        expect(
          repository.getSnapshotOf(MyAggregate, props.id)
        ).to.eventually.be.rejectedWith(
          UndefinedSnapshotterError,
          `Snapshotter is not defined on EventSourceableRepository`
        );
      });
    });

    it(`returns true if snapshotter is defined on repository`, () => {
      injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .toConstantValue(snapshotter);
      config.get.withArgs('eveble.Snapshotter.isEnabled').returns(true);

      expect(repository.isSnapshotting()).to.be.true;
    });

    it(`returns false if snapshotter is not defined on repository`, () => {
      expect(repository.isSnapshotting()).to.be.false;
    });
  });
});
