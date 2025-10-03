import { inject, postConstruct } from 'inversify';
import { classes } from 'polytype';
import { isFunction } from 'lodash';
import {
  ProjectionAlreadyRebuildingError,
  ProjectionNotRebuildingError,
} from './infrastructure-errors';
import { EventHandlingTrait } from '../traits/event-handling.trait';
import { StatefulTrait } from '../traits/stateful.trait';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';
import { Log } from '../components/log-entry';

export class Projection
  extends classes(EventHandlingTrait, StatefulTrait)
  implements types.Projection
{
  @inject(BINDINGS.EventBus)
  public eventBus: types.EventBus;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  static STATES = {
    projecting: 'projecting',
    rebuilding: 'rebuilding',
  };

  protected queuedEvents: types.Event[];

  /**
   * Creates an instance of `Projection`.
   */
  constructor() {
    super([]);
    this.setState(Projection.STATES.projecting);
    this.queuedEvents = [];
  }

  /**
   * Initializes Projection.
   */
  @postConstruct()
  public initialize(): void {
    super.class(EventHandlingTrait).initialize();
  }

  /**
   * Handles instance of an event.
   * @async
   * @param event - Instance implementing `Event` interface.
   * @param isRebuildEvent - Flag indicating that event is published for rebuilding projection.
   */
  public async on(event: types.Event, isRebuildEvent = false): Promise<void> {
    if (!this.hasHandler(event.constructor as types.MessageType<types.Event>)) {
      return;
    }
    if (
      this.isInState(Projection.STATES.projecting) ||
      (this.isInState(Projection.STATES.rebuilding) && isRebuildEvent)
    ) {
      this.log.debug(
        new Log(`publishing '${event.getTypeName()}'`)
          .on(this)
          .in(this.on)
          .with('event', event)
      );
      await super.on(event);
    } else {
      this.log.debug(
        new Log(`adding '${event.getTypeName()}' to queue`)
          .on(this)
          .in(this.on)
          .with('event', event)
      );
      this.queuedEvents.push(event);
    }
  }

  /**
   * Enters to rebuilding mode on projection.
   * @async
   * @throws {ProjectionAlreadyRebuildingError}
   * Thrown if the projection is already in rebuilding mode.
   */
  public async enterRebuildMode(): Promise<void> {
    if (this.isInState(Projection.STATES.rebuilding)) {
      this.log.error(
        new Log(`failed entering rebuilding(already in rebuild mode)`)
          .on(this)
          .in(this.enterRebuildMode)
      );
      throw new ProjectionAlreadyRebuildingError(this.constructor.name);
    }
    this.setState(Projection.STATES.rebuilding);
    this.log.debug(new Log(`rebuilding`).on(this).in(this.enterRebuildMode));
  }

  /**
   * Exits from rebuilding mode on projection.
   * @async
   * @throws {ProjectionNotRebuildingError}
   * Thrown if the projection is not in rebuilding mode.
   */
  public async exitRebuildMode(): Promise<void> {
    if (!this.isInState(Projection.STATES.rebuilding)) {
      this.log.error(
        new Log(`failed exiting rebuilding(already projecting)`)
          .on(this)
          .in(this.exitRebuildMode)
      );
      throw new ProjectionNotRebuildingError(this.constructor.name);
    }
    this.setState(Projection.STATES.projecting);

    for (const event of this.queuedEvents) {
      this.on(event);
    }
    this.log.debug(new Log(`projecting`).on(this).in(this.exitRebuildMode));
  }

  /**
   * Runs action on projection if developer-action is defined.
   * For `ProjectionRebuilder` define methods on projection:
   * `beforeRebuild()` - On before rebuild hook used for saving state in case rebuilding cant
   * be completed(rollback).
   * `commit() `- Commits to current state of projection.
   * `rollback()` - Rollbacks to previous(before rebuilding) state of projection.
   * @async
   * @param actionName - Name of action(function) to run.
   */
  public async invokeAction(actionName: string): Promise<void> {
    if (isFunction(this[actionName])) {
      try {
        this.log.debug(new Log(`${actionName}`).on(this).in(this[actionName]));

        await this[actionName]();

        this.log.debug(
          new Log(`finished ${actionName}`).on(this).in(this[actionName])
        );
      } catch (error) {
        this.log.error(
          new Log(`failed ${actionName} do to error: ${error}`)
            .on(this)
            .in(this[actionName])
        );

        throw error;
      }
    }
  }

  /**
   * Returns projection name.
   * @returns Projection name as a constructor name.
   */
  public getProjectionName(): string {
    return this.constructor.name;
  }
}
