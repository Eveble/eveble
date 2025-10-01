import { inject } from 'inversify';
import { Type } from '@eveble/core';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';
import { Struct } from '../components/struct';
import { Log } from '../components/log-entry';

@Type()
export class RebuildingResult extends Struct {
  projectionsNames: string[];

  duration: number;

  message: string;
}

export class ProjectionRebuilder {
  @inject(BINDINGS.CommitStore)
  protected commitStore: types.CommitStore;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  protected timer: [number, number];

  /**
   * Rebuilds projection
   * @async
   * @param projections - List of instances implementing `Projection` interface.
   */
  async rebuild(projections: types.Projection[]): Promise<RebuildingResult> {
    const projectionsNames: string[] = [];
    for (const projection of projections) {
      projectionsNames.push(projection.getProjectionName());
    }
    this.log.info(
      new Log(`rebuilding projections: '${projectionsNames.join(', ')}'`)
        .on(this)
        .in(this.rebuild)
    );

    this.startTimer();
    const queue: types.Projection[] = [];

    try {
      for (const projection of projections) {
        await this.enterRebuildModeOnProjection(projection);
        await this.runBeforeRebuildHookOnProjection(projection);
        queue.push(projection);
      }
    } catch (error) {
      // Rollback on error
      this.logInitializingRollback(error);
      for (const projection of queue) {
        await this.rollbackStateForProjection(projection);
      }
      throw error;
    }

    try {
      await this.publishAllEventsFromCommitStoreOnQueuedProjections(queue);
      for (const projection of queue) {
        await this.commitStateOnProjection(projection);
      }
    } catch (error) {
      // Rollback on error
      this.logInitializingRollback(error);
      let errorOnRollback;
      for (const projection of queue) {
        try {
          await projection.invokeAction('rollback');
        } catch (e) {
          errorOnRollback = e;
        }
        await projection.exitRebuildMode();
      }
      if (errorOnRollback !== undefined) {
        throw errorOnRollback;
      }
      throw error;
    }

    for (const projection of queue) {
      await projection.exitRebuildMode();
    }
    const duration = this.calculateOperationTime();
    const message = `finished rebuilding '${projectionsNames.join(
      ', '
    )}' in ${duration}ms`;
    this.log.info(new Log(message).on(this).in(this.rebuild));

    return new RebuildingResult({
      projectionsNames,
      duration,
      message,
    });
  }

  /**
   * Start tracking rebuilding time.
   */
  protected startTimer(): void {
    this.timer = process.hrtime();
  }

  /**
   * Returns how much time passed in milliseconds to rebuild all required projections.
   * @return Operation time as number in milliseconds.
   */
  protected calculateOperationTime(): number {
    return Math.round(process.hrtime(this.timer)[1] / 1000000);
  }

  /**
   * Enters rebuild mode on projection.
   * @async
   * @param projections - Instance implementing `Projection` interface.
   * @throws {ProjectionAlreadyRebuildingError}
   * Thrown if one of provided projections to rebuild is already in rebuild mode.
   */
  protected async enterRebuildModeOnProjection(
    projection: types.Projection
  ): Promise<void> {
    await projection.enterRebuildMode();
  }

  /**
   * Runs beforeRebuild hook on projection so state can be saved in case rebuilding can't be
   * completed(rollback).
   * @async
   * @param projections - Instance implementing `Projection` interface.
   */
  protected async runBeforeRebuildHookOnProjection(
    projection: types.Projection
  ): Promise<void> {
    await projection.invokeAction('beforeRebuild');
  }

  /**
   * Publishes all events from Commit Store to each queued projection.
   * @async
   * @param queueProjections - List of queued projections.
   */
  protected async publishAllEventsFromCommitStoreOnQueuedProjections(
    queueProjections: types.Projection[]
  ): Promise<void> {
    const events = await this.commitStore.getAllEvents();

    this.log.debug(
      new Log(`publishing events on projections`)
        .on(this)
        .in(this.publishAllEventsFromCommitStoreOnQueuedProjections)
    );
    for (const event of events) {
      for (const projection of queueProjections) {
        const isRebuildEvent = true;
        await projection.on(event, isRebuildEvent);
      }
    }

    this.log.debug(
      new Log(`finished publishing events`)
        .on(this)
        .in(this.publishAllEventsFromCommitStoreOnQueuedProjections)
    );
  }

  /**
   * Commits to new state on projection.
   * @param projections - Instance implementing `Projection` interface.
   */
  protected async commitStateOnProjection(
    projection: types.Projection
  ): Promise<void> {
    await projection.invokeAction('commit');
  }

  /**
   * Rollbacks projection state on failed rebuild.
   * @param projections - Instance implementing `Projection` interface.
   */
  protected async rollbackStateForProjection(
    projection: types.Projection
  ): Promise<void> {
    try {
      await projection.invokeAction('rollback');
    } catch (error) {}
    await projection.exitRebuildMode();
  }

  /**
   * Logs initializing rollback.
   * @async
   * @param error - `Error` instance.
   */
  protected logInitializingRollback(error: Error): void {
    this.log.emerg(
      new Log(`initializing rollback on projections due to error: ${error}`)
        .on(this)
        .in(this.rebuild)
    );
  }
}
