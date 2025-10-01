import {
  inject,
  postConstruct,
  injectable,
} from 'inversify';
import { UndefinedSnapshotterFrequencyError } from './infrastructure-errors';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';
import { Log } from '../components/log-entry';
import { Guid } from '../domain/value-objects/guid';

@injectable()
export class Snapshotter implements types.Snapshotter {
  @inject(BINDINGS.Config)
  protected config: types.Configurable;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.SnapshotStorage)
  protected storage: types.SnapshotStorage;

  /**
   * Initializes Snapshotter.
   */
  @postConstruct()
  public initialize(): void {
    if (!this.config.has('eveble.Snapshotter.frequency')) {
      throw new UndefinedSnapshotterFrequencyError();
    }
  }

  /**
   * Snapshots Event Sourceable.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @returns Identifier of snapshot on storage.
   */
  public async makeSnapshotOf(
    eventSourceable: types.EventSourceable
  ): Promise<string | undefined> {
    const id = eventSourceable.getId();
    const currentVersion = eventSourceable.getVersion();
    const isSnapshottable = currentVersion >= this.getVersionFrequency();

    // Return early on non-snapshotable event sourceables
    if (!isSnapshottable) {
      this.logInsufficientPassedVersionsForSnapshot(eventSourceable);
      return undefined;
    }

    this.log.debug(
      new Log(
        `snapshotting '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`
      )
        .on(this)
        .in(this.makeSnapshotOf)
        .with('event sourceable', eventSourceable)
    );

    const EventSourceableType =
      eventSourceable.constructor as types.EventSourceableType;
    const lastSnapshot = await this.storage.findById(EventSourceableType, id);

    let snapshotId;

    // Insert first snapshot of this event sourceable
    if (lastSnapshot === undefined) {
      snapshotId = await this.saveToStorage(eventSourceable);
      // Update existing snapshot of this event sourceable
    } else {
      // Update only if event sourceable doubled version since last snapshot
      const isUpdatable =
        lastSnapshot.getVersion() <=
        currentVersion - this.getVersionFrequency();
      if (isUpdatable) {
        snapshotId = await this.updateOnStorage(eventSourceable, lastSnapshot);
      } else {
        this.logInsufficientPassedVersionsForSnapshot(
          eventSourceable,
          lastSnapshot
        );
      }
    }
    return snapshotId;
  }

  /**
   * Restores snapshotted event sourceable from storage.
   * @async
   * @param EventSourceableType - Event sourceable type(constructor).
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @returns Instance as a snapshot implementing `EventSourceable` interface, else `undefined`.
   */
  public async getSnapshotOf(
    EventSourceableType: types.EventSourceableType,
    eventSourceableId: string | Guid
  ): Promise<types.EventSourceable | undefined> {
    return this.storage.findById(
      EventSourceableType, // Pass event sourceable type for complex storage implementations
      eventSourceableId
    );
  }

  /**
   * Returns snapshotting version frequency from app configuration.
   * @returns Version frequency as number.
   */
  protected getVersionFrequency(): number {
    return this.config.get('eveble.Snapshotter.frequency');
  }

  /**
   * Adds `EventSourceable` instance snapshot to storage.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @returns Identifier of snapshot on storage.
   */
  protected async saveToStorage(
    eventSourceable: types.EventSourceable
  ): Promise<string | undefined> {
    try {
      const snapshotId = await this.storage.save(eventSourceable);
      this.log.debug(
        new Log(
          `created new snapshot of '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`
        )
          .on(this)
          .in(this.saveToStorage)
          .with('event sourceable', eventSourceable)
      );

      return snapshotId;
    } catch (error) {
      this.log.error(
        new Log(
          `failed creating snapshot of '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' do to error: ${error}`
        )
          .on(this)
          .in(this.makeSnapshotOf)
          .with('event sourceable', eventSourceable)
      );
      throw error;
    }
  }

  /**
   * Updates snapshot of EventSourceable on storage.
   * Pass last found snapshot back to storage, so "difference" between current version
   * and previous can be computed for selective field updating on persistence if event
   * sourceable was not stored as serialized.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @param lastSnapshot - Last available snapshot of `EventSourceable`.
   * @return Updated snapshot identifier.
   */
  protected async updateOnStorage(
    eventSourceable: types.EventSourceable,
    lastSnapshot: types.EventSourceable
  ): Promise<string> {
    try {
      await this.storage.update(eventSourceable, lastSnapshot);
    } catch (error) {
      this.log.error(
        new Log(
          `failed to update last found snapshot(${lastSnapshot.getVersion()}) for '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' do to error: ${error}`
        )
          .on(this)
          .in(this.updateOnStorage)
          .with('event sourceable', eventSourceable)
          .with('updated last snapshot', lastSnapshot)
          .with('error', error)
      );
      throw error;
    }
    this.log.debug(
      new Log(
        `updated last found snapshot(${lastSnapshot.getVersion()}) for '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`
      )
        .on(this)
        .in(this.updateOnStorage)
        .with('updated last snapshot', lastSnapshot)
    );

    return lastSnapshot.getId().toString();
  }

  /**
   * Logs debug message on inssuficnet version passed for creating snapshot.
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @param lastSnapshot - Last found snapshot.
   */
  protected logInsufficientPassedVersionsForSnapshot(
    eventSourceable: types.EventSourceable,
    lastSnapshot?: types.EventSourceable
  ): void {
    let log: types.LogEntry;
    if (lastSnapshot !== undefined) {
      log = new Log(
        `not enough version passed(${lastSnapshot.getVersion()}<=${this.getVersionFrequency()}) on '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' to update last snapshot`
      );
      log.with('last snapshot', lastSnapshot);
      log.with('last snapshot version', lastSnapshot.getVersion());
    } else {
      log = new Log(
        `not enough version passed(${eventSourceable.getVersion()}<=${this.getVersionFrequency()}) on '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' to create new snapshot of event sourceable`
      );
    }

    log.on(this);
    log.in(this.makeSnapshotOf);
    log.with('current version', eventSourceable.getVersion());
    log.with('snapshot frequency', this.getVersionFrequency());

    this.log.debug(log);
  }
}
