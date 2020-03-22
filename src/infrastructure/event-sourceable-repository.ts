import { inject, injectable } from '@parisholley/inversify-async';
import {
  UndefinedSnapshotterError,
  EventsNotFoundError,
} from './infrastructure-errors';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';
import { Log } from '../components/log-entry';
import { History } from '../domain/history';
import { Guid } from '../domain/value-objects/guid';

@injectable()
export class EventSourceableRepository
  implements types.EventSourceableRepository {
  @inject(BINDINGS.Injector)
  protected injector: types.Injector;

  @inject(BINDINGS.Config)
  protected config: types.Configurable;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.CommitStore)
  protected commitStore: types.CommitStore;

  /**
   * Persists event sourceable.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @returns Object implementing `StorageIdentifiers` interface.
   */
  public async save(
    eventSourceable: types.EventSourceable
  ): Promise<types.StorageIdentifiers> {
    this.log.debug(
      new Log(
        `saving '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`
      )
        .on(this)
        .in(this.save)
        .with('event sourceable', eventSourceable)
    );

    const storageIdentifiers: types.StorageIdentifiers = {};
    try {
      const commit = await this.commitStore.createCommit(eventSourceable);
      const commitId = await this.commitStore.save(commit);
      storageIdentifiers.commitId = commitId;

      eventSourceable.incrementVersion();

      if (this.isSnapshotting()) {
        const snapshotIdOnStorage = await this.makeSnapshotOf(eventSourceable);
        if (snapshotIdOnStorage !== undefined) {
          storageIdentifiers.snapshotId = snapshotIdOnStorage;
        }
      }
    } catch (error) {
      this.log.error(
        new Log(
          `failed saving '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' do to error: ${error}`
        )
          .on(this)
          .in(this.save)
          .with('event sourceable', eventSourceable)
      );
      throw error;
    }

    this.log.debug(
      new Log(
        `saved '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`
      )
        .on(this)
        .in(this.save)
        .with('event sourceable', eventSourceable)
    );
    return storageIdentifiers;
  }

  /**
   * Returns a re-hydrated instance of event sourceable.
   * @async
   * @param EventSourceableType - Event sourceable type(constructor).
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @return Instance implementing `EventSourceable` interface, else `undefined`.
   */
  public async find(
    EventSourceableType: types.EventSourceableType,
    eventSourceableId: string | Guid
  ): Promise<types.EventSourceable | undefined> {
    let eventSourceable;
    // Flow 1: Snapshot flow
    if (this.isSnapshotting()) {
      eventSourceable = await this.restoreFromSnapshot(
        EventSourceableType,
        eventSourceableId
      );
    }
    // Re-hydrates EventSourceable
    if (eventSourceable === undefined) {
      eventSourceable = await this.rehydrateFromEventHistory(
        EventSourceableType,
        eventSourceableId
      );
    }

    // Not found
    if (eventSourceable === undefined) {
      this.log.notice(
        new Log(
          `'${EventSourceableType.getTypeName()}' not found with id '${eventSourceableId}'`
        )
          .on(this)
          .in(this.find)
      );
    }

    return eventSourceable;
  }

  /**
   * Makes a snapshot of `EventSourceable`.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @return String identifier for made snapshot on storage.
   * @throws {UndefinedSnapshotterError}
   * Thrown f the snapshotter is not available on IoC.
   */
  public async makeSnapshotOf(
    eventSourceable: types.EventSourceable
  ): Promise<string | undefined> {
    if (!this.isSnapshotting()) {
      throw new UndefinedSnapshotterError();
    }
    const snapshotter = this.injector.get<types.Snapshotter>(
      BINDINGS.Snapshotter
    );
    const snapshotIdOnStorage = await snapshotter.makeSnapshotOf(
      eventSourceable
    );
    return snapshotIdOnStorage;
  }

  /**
   * Returns snapshot of `EventSourceable` by identifier.
   * @async
   * @param EventSourceableType - Event sourceable type(constructor).
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @returns Instance implementing `EventSourceable` interface, else `undefined`.
   * @throws {UndefinedSnapshotterError}
   * Thrown f the snapshotter is not available on IoC.
   */
  public async getSnapshotOf(
    EventSourceableType: types.EventSourceableType,
    eventSourceableId: string | Guid
  ): Promise<types.EventSourceable | undefined> {
    if (!this.isSnapshotting()) {
      throw new UndefinedSnapshotterError();
    }
    const snapshotter = this.injector.get<types.Snapshotter>(
      BINDINGS.Snapshotter
    );
    return snapshotter.getSnapshotOf(EventSourceableType, eventSourceableId);
  }

  /**
   * Evaluates if application is snapshotting.
   * @returns Returns `true` if snapshotting is enabled on application, else `false`.
   */
  public isSnapshotting(): boolean {
    return (
      this.injector.isBound(BINDINGS.Snapshotter) &&
      this.config.get('eveble.Snapshotter.isEnabled')
    );
  }

  /**
   * Restores event sourceable from snapshot(snapshot + remaining events).
   * @async
   * @param EventSourceableType - Event sourceable type(constructor).
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @returns Instance implementing `EventSourceable` interface, else `undefined`.
   */
  protected async restoreFromSnapshot(
    EventSourceableType: types.EventSourceableType,
    eventSourceableId: string | Guid
  ): Promise<types.EventSourceable | undefined> {
    this.log.debug(
      new Log(
        `restoring '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}' from snapshot`
      )
        .on(this)
        .in(this.restoreFromSnapshot)
    );

    const eventSourceable = await this.getSnapshotOf(
      EventSourceableType,
      eventSourceableId
    );
    if (eventSourceable !== undefined) {
      this.log.debug(
        new Log(
          `restored '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}' from snapshot`
        )
          .on(this)
          .in(this.restoreFromSnapshot)
          .with('event sourceable', eventSourceable)
      );

      const nextVersion = eventSourceable.getVersion() + 1;
      const remainingEvents = await this.commitStore.getEvents(
        eventSourceableId,
        nextVersion
      );
      eventSourceable.initialize();
      if (remainingEvents !== undefined && remainingEvents.length > 0) {
        this.log.debug(
          new Log(
            `replaying history on snapshot of '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}'`
          )
            .on(this)
            .in(this.restoreFromSnapshot)
            .with('event sourceable', eventSourceable)
            .with('remaining events', remainingEvents)
        );
        const history = new History(remainingEvents);
        eventSourceable.replayHistory(history);
      }
    }
    return eventSourceable;
  }

  /**
   * Re-hydrates event sourceable from events history(each event is applied to re-create `EventSoureceable` state)
   * @async
   * @param EventSourceableType - Event sourceable type(constructor).
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @returns Instance implementing `EventSourceable` interface, else `undefined`.
   */
  protected async rehydrateFromEventHistory(
    EventSourceableType: types.EventSourceableType,
    eventSourceableId: string | Guid
  ): Promise<types.EventSourceable | undefined> {
    this.log.debug(
      new Log(
        `fetching event history for '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}'`
      )
        .on(this)
        .in(this.rehydrateFromEventHistory)
    );

    let eventSourceable;
    const eventHistory = await this.commitStore.getEvents(eventSourceableId);
    if (!Array.isArray(eventHistory)) {
      return eventSourceable;
    }

    if (eventHistory.length > 0) {
      const history = new History(eventHistory);
      eventSourceable = new EventSourceableType(history);
      eventSourceable.initialize();
      eventSourceable.replayHistory(eventHistory);
    } else {
      const error = new EventsNotFoundError(
        EventSourceableType.getTypeName(),
        eventSourceableId.toString()
      );
      this.log.error(
        new Log(
          `no events found for '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}'`
        )
          .on(this)
          .in(this.rehydrateFromEventHistory)
      );
      throw error;
    }

    this.log.debug(
      new Log(
        `re-hydrated '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}' from event history`
      )
        .on(this)
        .in(this.rehydrateFromEventHistory)
        .with('event history', eventHistory)
    );
    return eventSourceable;
  }
}
