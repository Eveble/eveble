import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, beforeAll } from 'vitest';

import { Type } from '@eveble/core';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
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

describe(`EventSourceableRepository`, () => {
  @Type('MyInitEvent', { isRegistrable: false })
  class MyInitEvent extends Event<MyInitEvent> {
    name: string;
  }

  @Type('MyOtherEvent', { isRegistrable: false })
  class MyOtherEvent extends Event<MyOtherEvent> {
    age: number;
  }

  @Type('Namespace.MyEventSourceable', { isRegistrable: false })
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

  @Type('Namespace.MyAggregate', { isRegistrable: false })
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

  @Type('MyProcess', { isRegistrable: false })
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
  const events: Record<string, Event<{}>> = {};

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();
    commitStore = mock<types.CommitStore>();
    snapshotter = mock<types.Snapshotter>();

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
      commitStore.createCommit.mockReturnValue(commit);

      const esInstance = new MyEventSourceable({ id: props.id });
      expect(esInstance.getVersion()).toBe(0);

      await repository.save(esInstance);
      expect(esInstance.getVersion()).toBe(1);
      expect(commitStore.save).toHaveBeenCalledTimes(1);
      expect(commitStore.save).toHaveBeenCalledWith(commit);
    });

    it(`persists event sourceable as commit and snapshots it when snapshotter is defined`, async () => {
      injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .toConstantValue(snapshotter);
      commitStore.createCommit.mockReturnValue(commit);
      config.get
        .calledWith('eveble.Snapshotter.isEnabled')
        .mockReturnValue(true);

      const esInstance = new MyEventSourceable({ id: props.id });
      expect(esInstance.getVersion()).toBe(0);

      await repository.save(esInstance);
      expect(esInstance.getVersion()).toBe(1);
      expect(commitStore.save).toHaveBeenCalledWith(commit);
      expect(snapshotter.makeSnapshotOf).toHaveBeenCalledWith(esInstance);
    });

    it('logs saving event sourceable', async () => {
      commitStore.createCommit.mockReturnValue(commit);

      const esInstance = new MyEventSourceable({ id: props.id });
      await repository.save(esInstance);
      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(
            `saving 'Namespace.MyEventSourceable' with id '${esInstance.id}'`
          )
            .on(repository)
            .in(repository.save)
            .with('event sourceable', esInstance)
        )
      );
    });

    it('logs thrown error while saving commit to storage', async () => {
      commitStore.createCommit.mockReturnValue(commit);
      commitStore.save.mockRejectedValue(new Error('my-error'));

      const esInstance = new MyEventSourceable({ id: props.id });
      await expect(repository.save(esInstance)).rejects.toThrow(Error);

      expect(log.error).toHaveBeenCalledWith(
        new Log(
          `failed saving 'Namespace.MyEventSourceable' with id '${esInstance.id}' do to error: Error: my-error`
        )
          .on(repository)
          .in(repository.save)
          .with('event sourceable', esInstance)
      );
    });

    it('logs thrown error while saving snapshot to storage', async () => {
      commitStore.createCommit.mockReturnValue(commit);
      snapshotter.makeSnapshotOf.mockRejectedValue(new Error('my-error'));
      injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .toConstantValue(snapshotter);
      config.get
        .calledWith('eveble.Snapshotter.isEnabled')
        .mockReturnValue(true);

      const esInstance = new MyEventSourceable({ id: props.id });
      await expect(repository.save(esInstance)).rejects.toThrow(Error);

      expect(log.error).toHaveBeenCalledWith(
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
      commitStore.getEvents.calledWith(props.id).mockReturnValue(undefined);

      const result = await repository.find(MyEventSourceable, props.id);
      expect(result).toBe(undefined);
      expect(commitStore.getEvents).toHaveBeenCalledWith(props.id);
    });

    it(`logs not found event sourceable when it cannot be restored`, async () => {
      commitStore.getEvents.calledWith(props.id).mockReturnValue(undefined);

      await repository.find(MyEventSourceable, props.id);
      expect(log.notice).toHaveBeenCalledWith(
        new Log(`'Namespace.MyEventSourceable' not found with id '${props.id}'`)
          .on(repository)
          .in(repository.find)
      );
    });

    it(`returns undefined when event sourceable cannot be restored from snapshotter`, async () => {
      injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .toConstantValue(snapshotter);
      config.get
        .calledWith('eveble.Snapshotter.isEnabled')
        .mockReturnValue(true);
      snapshotter.getSnapshotOf.mockReturnValue(undefined);
      commitStore.getEvents.calledWith(props.id).mockReturnValue(undefined);

      const result = await repository.find(MyEventSourceable, props.id);
      expect(result).toBe(undefined);
      expect(snapshotter.getSnapshotOf).toHaveBeenCalledWith(
        MyEventSourceable,
        props.id
      );
    });

    it(`throws EventsNotFoundError when commit store returns empty event history`, async () => {
      commitStore.getEvents.calledWith(props.id).mockReturnValue([]);

      await expect(
        repository.find(MyEventSourceable, props.id)
      ).rejects.toThrow(
        EventsNotFoundError,
        `No events found for event sourceable 'Namespace.MyEventSourceable' with id '${props.id}'`
      );
    });

    it(`logs error when commit store returns empty event history`, async () => {
      commitStore.getEvents.calledWith(props.id).mockReturnValue([]);

      await expect(
        repository.find(MyEventSourceable, props.id)
      ).rejects.toThrow(EventsNotFoundError);
      expect(log.error).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(
            `no events found for 'Namespace.MyEventSourceable' with id '${props.id}'`
          )
            .on(repository)
            .in('rehydrateFromEventHistory')
        )
      );
    });

    describe(`re-hydration`, () => {
      describe('aggregate', () => {
        it(`returns a re-hydrated instance of the expected version of aggregate`, async () => {
          commitStore.getEvents
            .calledWith(props.id)
            .mockReturnValue([events.initEvent, events.otherEvent]);

          const aggregate = (await repository.find(
            MyAggregate,
            props.id
          )) as MyAggregate;
          expect(aggregate.name).toBe('Foo');
          expect(aggregate.age).toBe(20);
          expect(commitStore.getEvents).toHaveBeenCalledWith(props.id);
        });

        it('ensures that injector is injecting async dependencies and initializes aggregate', async () => {
          const injectorStub = mock<Injector>();
          injector
            .rebindSync<types.Injector>(BINDINGS.Injector)
            .toConstantValue(injectorStub);
          injector.injectInto(repository);

          commitStore.getEvents
            .calledWith(props.id)
            .mockReturnValue([events.initEvent, events.otherEvent]);

          const aggregate = (await repository.find(
            MyAggregate,
            props.id
          )) as MyAggregate;
          expect(injectorStub.injectIntoAsync).toHaveBeenCalledTimes(1);
          expect(injectorStub.injectIntoAsync).toHaveBeenCalledWith(aggregate);
        });

        it(`logs fetching event history for aggregate`, async () => {
          const eventHistory = [events.initEvent, events.otherEvent];
          commitStore.getEvents
            .calledWith(props.id)
            .mockReturnValue(eventHistory);

          await repository.find(MyAggregate, props.id);
          expect(log.debug).toHaveBeenCalledWith(
            new Log(
              `fetching event history for 'Namespace.MyAggregate' with id '${props.id}'`
            )
              .on(repository)
              .in('rehydrateFromEventHistory')
          );
        });

        it(`logs a re-hydrated instance of the expected version of aggregate`, async () => {
          const eventHistory = [events.initEvent, events.otherEvent];
          commitStore.getEvents
            .calledWith(props.id)
            .mockReturnValue(eventHistory);

          await repository.find(MyAggregate, props.id);
          expect(log.debug).toHaveBeenCalledWith(
            new Log(
              `re-hydrated 'Namespace.MyAggregate' with id '${props.id}' from event history`
            )
              .on(repository)
              .in('rehydrateFromEventHistory')
              .with('event history', eventHistory)
          );
        });
      });

      describe('process', () => {
        it(`returns a re-hydrated instance of the expected version of process`, async () => {
          commitStore.getEvents
            .calledWith(props.id)
            .mockReturnValue([events.initEvent, events.otherEvent]);

          const process = (await repository.find(
            MyProcess,
            props.id
          )) as MyProcess;
          expect(process.name).toBe('Foo');
          expect(process.age).toBe(20);
          expect(commitStore.getEvents).toHaveBeenCalledWith(props.id);
        });

        it('ensures that injector is injecting async dependencies and initializes process', async () => {
          const injectorStub = mock<Injector>();
          injector
            .rebindSync<types.Injector>(BINDINGS.Injector)
            .toConstantValue(injectorStub);
          injector.injectInto(repository);

          commitStore.getEvents
            .calledWith(props.id)
            .mockReturnValue([events.initEvent, events.otherEvent]);

          const process = (await repository.find(
            MyProcess,
            props.id
          )) as MyProcess;
          expect(injectorStub.injectIntoAsync).toHaveBeenCalledTimes(1);
          expect(injectorStub.injectIntoAsync).toHaveBeenCalledWith(process);
        });
      });
    });

    describe(`restoring snapshot`, () => {
      let snapshotedEs: MyAggregate;

      describe('aggregate', () => {
        beforeEach(() => {
          snapshotedEs = new MyAggregate(
            new History([events.initEvent, events.otherEvent])
          );
        });

        it(`does not call snapshotter when snapshotter is not defined on repository`, async () => {
          await repository.find(MyAggregate, props.id);
          expect(snapshotter.getSnapshotOf).not.toHaveBeenCalled();
        });

        it(`returns aggregate restored from snapshot`, async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);
          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);
          commitStore.getEvents.calledWith(props.id).mockReturnValue([]);

          await repository.save(snapshotedEs); // Save aggregate so it's version is updated to 2
          const foundEs = await repository.find(MyAggregate, props.id);
          expect(foundEs).toBe(snapshotedEs);

          expect(snapshotter.getSnapshotOf).toHaveBeenCalledWith(
            MyAggregate,
            props.id
          );
        });

        it('logs restoring event sourceable from snapshot', async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);
          commitStore.getEvents.calledWith(props.id).mockReturnValue([]);

          await repository.find(MyEventSourceable, props.id);
          expect(log.debug).toHaveBeenCalledWith(
            expect.objectContaining(
              new Log(
                `restoring 'Namespace.MyEventSourceable' with id '${props.id}' from snapshot`
              )
                .on(repository)
                .in('restoreFromSnapshot')
            )
          );
        });

        it('logs restored event sourceable from snapshot', async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);
          commitStore.getEvents.calledWith(props.id).mockReturnValue([]);

          await repository.find(MyEventSourceable, props.id);
          expect(log.debug).toHaveBeenCalledWith(
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
          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);
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
          commitStore.getEvents
            .calledWith(props.id)
            .mockReturnValue(remainingEvents);

          await repository.save(snapshotedEs); // Save aggregate so it's version is updated to 2
          const foundEs = (await repository.find(
            MyAggregate,
            props.id
          )) as MyAggregate;
          expect(foundEs).toBeInstanceOf(MyAggregate);
          expect(foundEs.id).toBe(props.id);
          expect(foundEs.age).toBe(26);
          expect(foundEs.getVersion()).toBe(3);

          expect(snapshotter.getSnapshotOf).toHaveBeenCalledWith(
            MyAggregate,
            props.id
          );
          expect(commitStore.getEvents).toHaveBeenCalledWith(props.id, 2);
        });

        it('ensures that injector is injecting async dependencies and initializes aggregate', async () => {
          const injectorStub = mock<Injector>();
          injector
            .rebindSync<types.Injector>(BINDINGS.Injector)
            .toConstantValue(injectorStub);

          injectorStub.isBound
            .calledWith(BINDINGS.Snapshotter)
            .mockReturnValue(true);
          injectorStub.get
            .calledWith(BINDINGS.Snapshotter)
            .mockReturnValue(snapshotter);
          injector.injectInto(repository);

          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);

          const foundEs = (await repository.find(
            MyAggregate,
            props.id
          )) as MyAggregate;
          expect(injectorStub.injectIntoAsync).toHaveBeenCalledTimes(1);
          expect(injectorStub.injectIntoAsync).toHaveBeenCalledWith(foundEs);
        });

        it('logs restored event sourceable from snapshot with replayed remaining events from commit store', async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);
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
          commitStore.getEvents
            .calledWith(props.id)
            .mockReturnValue(remainingEvents);

          await repository.find(MyEventSourceable, props.id);
          expect(log.debug).toHaveBeenCalledWith(
            expect.objectContaining(
              new Log(
                `replaying history on snapshot of 'Namespace.MyEventSourceable' with id '${props.id}'`
              )
                .on(repository)
                .in('restoreFromSnapshot')
                .with('event sourceable', snapshotedEs)
                .with('remaining events', remainingEvents)
            )
          );
        });
      });

      describe('process', () => {
        beforeEach(() => {
          snapshotedEs = new MyProcess(
            new History([events.initEvent, events.otherEvent])
          );
        });

        it(`does not call snapshotter when snapshotter is not defined on repository`, async () => {
          await repository.find(MyProcess, props.id);
          expect(snapshotter.getSnapshotOf).not.toHaveBeenCalled();
        });

        it(`returns process restored from snapshot`, async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);
          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);

          commitStore.getEvents.calledWith(props.id).mockReturnValue([]);

          await repository.save(snapshotedEs); // Save process so it's version is updated to 2
          const foundEs = await repository.find(MyProcess, props.id);
          expect(foundEs).toBe(snapshotedEs);

          expect(snapshotter.getSnapshotOf).toHaveBeenCalledWith(
            MyProcess,
            props.id
          );
        });

        it('ensures that injector is injecting async dependencies and initializes process', async () => {
          const injectorStub = mock<Injector>();
          injector
            .rebindSync<types.Injector>(BINDINGS.Injector)
            .toConstantValue(injectorStub);

          injectorStub.isBound
            .calledWith(BINDINGS.Snapshotter)
            .mockReturnValue(true);
          injectorStub.get
            .calledWith(BINDINGS.Snapshotter)
            .mockReturnValue(snapshotter);
          injector.injectInto(repository);

          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);

          const foundEs = (await repository.find(
            MyProcess,
            props.id
          )) as MyProcess;
          expect(injectorStub.injectIntoAsync).toHaveBeenCalledTimes(1);
          expect(injectorStub.injectIntoAsync).toHaveBeenCalledWith(foundEs);
        });

        it(`returns process restored from snapshot with replayed remaining eventSourceable events from commit store`, async () => {
          injector
            .bind<types.Snapshotter>(BINDINGS.Snapshotter)
            .toConstantValue(snapshotter);
          snapshotter.getSnapshotOf.mockReturnValue(snapshotedEs);
          config.get
            .calledWith('eveble.Snapshotter.isEnabled')
            .mockReturnValue(true);

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
            .calledWith(props.id)
            .mockReturnValue([thirdEvent, fourthEvent]);

          await repository.save(snapshotedEs); // Save process so it's version is updated to 2
          const foundEs = (await repository.find(
            MyProcess,
            props.id
          )) as MyProcess;
          expect(foundEs).toBeInstanceOf(MyProcess);
          expect(foundEs.id).toBe(props.id);
          expect(foundEs.age).toBe(26);
          expect(foundEs.getVersion()).toBe(3);

          expect(snapshotter.getSnapshotOf).toHaveBeenCalledWith(
            MyProcess,
            props.id
          );
          expect(commitStore.getEvents).toHaveBeenCalledWith(props.id, 2);
        });
      });
    });
  });

  describe(`using snapshotter`, () => {
    describe(`throwing UndefinedSnapshotterError on snapshot related methods`, () => {
      it(`on snapshot creation`, async () => {
        const esInstance = new EventSourceable({ id: props.id });

        expect(repository.makeSnapshotOf(esInstance)).rejects.toThrow(
          UndefinedSnapshotterError,
          `Snapshotter is not defined on EventSourceableRepository`
        );
      });

      it(`on restoring snapshot`, async () => {
        expect(repository.getSnapshotOf(MyAggregate, props.id)).rejects.toThrow(
          UndefinedSnapshotterError,
          `Snapshotter is not defined on EventSourceableRepository`
        );
      });
    });

    it(`returns true if snapshotter is defined on repository`, () => {
      injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .toConstantValue(snapshotter);
      config.get
        .calledWith('eveble.Snapshotter.isEnabled')
        .mockReturnValue(true);

      expect(repository.isSnapshotting()).toBe(true);
    });

    it(`returns false if snapshotter is not defined on repository`, () => {
      expect(repository.isSnapshotting()).toBe(false);
    });
  });
});
