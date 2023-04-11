import { classes } from 'polytype';
import { omit } from 'lodash';
import { getTypeName } from '@eveble/helpers';
import merge from 'deepmerge';
import { postConstruct } from '@parisholley/inversify-async';
import getenv from 'getenv';
import { define, kernel } from '@eveble/core';
import deepClone from '@jsbits/deep-clone';
import { Entity } from './entity';
import { OneToOneHandlingMixin } from '../mixins/one-to-one-handling-mixin';
import { types } from '../types';
import { Command, Assignment } from '../components/command';
import { HandlerNotFoundError } from '../messaging/messaging-errors';
import { EVENTS_KEY, COMMANDS_KEY } from '../constants/literal-keys';
import { Event } from '../components/event';

import { isPlainRecord } from '../utils/helpers';
import { EventIdMismatchError, InvalidEventError } from './domain-errors';
import {
  ROUTED_COMMANDS_CONTAINER_KEY,
  ROUTED_EVENTS_CONTAINER_KEY,
  INITIALIZING_MESSAGE_KEY,
} from '../constants/metadata-keys';
import { Guid } from './value-objects/guid';
import { ScheduleCommand } from './schedule-command';
import { UnscheduleCommand } from './unschedule-command';
import { History } from './history';

@define('EventSourceable')
export class EventSourceable
  extends classes(Entity, OneToOneHandlingMixin)
  implements types.EventSourceable
{
  public id: string | Guid;

  public version: number;

  public state: types.State;

  public status: types.Status;

  public metadata?: Record<string, any>;

  public schemaVersion?: number;

  public [COMMANDS_KEY]: types.Command[];

  public [EVENTS_KEY]: types.Event[];

  /**
   * Creates an instance of `EventSourceable`.
   * @param props - Properties of the type required for construction.
   * @example
   *```ts
   * new EventSourceable({id: 'my-id'})
   * new EventSourceable({id: 'my-id', key: 'value'})
   *```
   */
  constructor(props: types.Props) {
    const processedProps: types.Props = { version: 0, ...props };
    super([processedProps]);
    if (this.state !== undefined) {
      this.setState(this.state); // Ensure that state is valid
    }
    if (this.status !== undefined) {
      this.setStatus(this.status); // Ensure that status is valid
    }
    // Define all property related to underlying configuration of EventSourceable
    // as non-enumerable for easier debugging
    Object.defineProperty(this, EVENTS_KEY, {
      enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
      value: [],
    });
    Object.defineProperty(this, COMMANDS_KEY, {
      enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
      value: [],
    });
    this.setHandleableTypes([Command, Event]);
  }

  /**
   * Initializes EventSourceable.
   */
  @postConstruct()
  public async initialize(): Promise<void> {
    this.setupHandlers({
      handlers: this.handles(),
      handleableTypes: [Command],
      isBoundable: true,
    });
    this.setupHandlers({
      handlers: this.subscribes(),
      handleableTypes: [Event],
      isBoundable: true,
    });
  }

  /**
   * [OVERRIDE] Processes properties for `EventSourceable`.
   * @param props - Properties of the type required for construction.
   * @returns Processed properties with any registered `onConstruction` hooks.
   * @remarks
   * Skips validation since its done manually after initialization on `Router`.
   */
  protected processProps(props: types.Props = {}): types.Props {
    const processedProps: types.Props = this.onConstruction(props);
    // Skip validation
    return processedProps;
  }

  /*
  HANDLING
  */
  /**
   * Returns current version of `EventSourceable`.
   * @returns Current number version of instance.
   */
  public getVersion(): number {
    return this.version || 0;
  }

  /**
   * Sets version of `EventSourceable`.
   * @param version - Version number.
   * @returns Current number version of instance.
   */
  public setVersion(version: number): void {
    this.version = version;
  }

  /**
   * Returns recorded events on `EventSourceable`.
   * @returns List of recorded `Events`.
   */
  public getEvents(): types.Event[] {
    return this[EVENTS_KEY];
  }

  /**
   * Returns triggered commands on `EventSourceable`.
   * @returns List of recorded `Commands`.
   */
  public getCommands(): types.Command[] {
    return this[COMMANDS_KEY];
  }

  /**
   * Handles message.
   * @async
   * @param eventInstance - Instance implementing `Command` or `Event` interface.
   * @return Instance of `EventSourceable`.
   * @throws {HandlerNotFoundError}
   * Thrown if handler for type is not found.
   */
  public async handle(message: types.Command | types.Event): Promise<any> {
    if (
      message instanceof Command &&
      message.isScheduled() &&
      !message.isDeliverable()
    ) {
      return this;
    }

    if (message.hasMetadata()) {
      const metadata = omit(message.metadata, ['scheduling']);
      this.assignMetadata(metadata);
    }
    const handler = this.getHandler(
      message.constructor as types.MessageType<types.Message>
    );
    if (handler === undefined) {
      throw new HandlerNotFoundError(
        getTypeName(this.constructor) as types.TypeName,
        message.getTypeName()
      );
    }
    await handler(message);

    return this;
  }

  /*
  SCHEDULING
  */
  /**
   * Schedules command to be delivered at specific time.
   * @param assignmentId - Scheduling assignment identifer.
   * @param command - `Command` instance.
   * @param deliverAt - `Date` instance on which command should be delivered.
   */
  public schedule(
    command: types.Command,
    deliverAt: Date,
    assignmentId: string | Guid = this.getId()
  ): void {
    const assignmentProps: Record<string, any> = {
      assignmentId,
      assignerId: this.getId(),
      assignerType: this.typeName(),
      deliverAt,
    };

    const assignment = new Assignment(assignmentProps);
    command.schedule(assignment);

    const scheduleCommand = new ScheduleCommand({
      targetId: command.getId() as string | Guid,
      command,
    });
    this[COMMANDS_KEY].push(scheduleCommand);
  }

  /**
   * Unschedule delivery of a specific command by assignment specification.
   * @param assignmentId - Scheduling assignment identifer.
   * @param commandType - A `Command` type that should be unscheduled.
   */
  public unschedule(
    assignmentId: string | Guid,
    commandType: types.MessageType<types.Command>
  ): void {
    const unscheduleCommand = new UnscheduleCommand({
      targetId: this.getId(),
      assignerId: this.getId(),
      assignerType: this.typeName(),
      assignmentId,
      commandType: commandType.getTypeName(),
    });
    this[COMMANDS_KEY].push(unscheduleCommand);
  }

  /*
  STATE MUTATORS
  */
  /**
   * [OVERRIDE] Assigns properties from one or more sources.
   * @param sources - One or more source of properties.
   * @return Returns this instance of `EventSourceable` with new properties assigned.
   * @throws {ValidationError}
   * Thrown if properties does not match prop types of `EventSourceable`.
   * @remarks
   * Works like `Object.assign` with additional validation.
   */
  protected assign(...sources: Record<string, any>[]): this {
    const pickedProps = {};
    for (const source of sources) {
      const processedSource = omit(
        source,
        'sourceId',
        'targetId',
        'version',
        'timestamp'
      );
      const props = this.pickProps(processedSource);
      Object.assign(pickedProps, props);
    }
    Object.assign(this, pickedProps);
    return this;
  }

  /**
   * Records state change of `EventSourceable` as `Event` and updates event sourceable version.
   * @param event - Instance of `Event`.
   * @example
   *```ts
   * this.record(new MyEvent({
   *   sourceId: this.getId(),
   *   key: 'value'
   * });
   * this.record(new MyEvent({
   *   ...this.eventProps(),
   *   customerName: command.customerName,
   * }));
   *```
   */
  public record(event: types.Event): void {
    this.validateEventApplicability(event);
    if (this.metadata !== undefined) {
      event.assignMetadata(this.metadata);
    }

    /*
    Lose any reference properties(like arrays, objects) in case multiple events are fired from one command that keeps references to same property

    @event-sourceable.test.ts
    `ensures that each event fired from single handler does not leak n+x state on referenceable properties(like arrays, objects)`
    */
    this[EVENTS_KEY].push(deepClone(event));
    // this[EVENTS_KEY].push(deepClone(event));
    if (this.hasHandler(event.constructor as types.MessageType<types.Event>)) {
      this.handle(event);
    }
    this.updateToEventVersion(event);
  }

  /**
   * Replies event and updates `EventSourceable` version.
   * @param event - Instance of `Event`.
   */
  public replay(event: types.Event): void {
    this.validateEventApplicability(event);
    if (this.hasHandler(event.constructor as types.MessageType<types.Event>)) {
      this.handle(event);
    }
    this.updateToEventVersion(event);
  }

  /**
   * Replies history from list of events.
   * @param history - Instance of `History` containing `Event` list.
   */
  public replayHistory(history: History): void {
    for (const event of history) {
      this.replay(event);
    }
  }

  /**
   * Attaches metadata to `EventSourceable`.
   * @param props - Metadata properties object with all information related tp `EventSourcable`.
   */
  public assignMetadata(metadata: Record<string, any>): void {
    if (this.metadata === undefined) {
      this.metadata = {};
    }
    Object.assign(
      this.metadata,
      merge(this.metadata, metadata, {
        isMergeableObject: isPlainRecord,
      })
    );
  }

  /**
   * Updates `EventSourceable's` version to the one from event.
   * @param event - Instance of `Event`.
   * @remarks
   * Incremental update of of **new** `EventSourceable` version is done on
   * `EventSourceableRepository.prototype.save`
   */
  protected updateToEventVersion(event: types.Event): void {
    if (event.version !== undefined) {
      this.setVersion(event.version);
    }
  }

  /**
   * Ensures that provided `Event` instance has matching `sourceId` of current event sourceable
   * instance.
   * @param event - Instance of `Event`.
   * @returns Returns `true` if event's `sourceId` matches event sourceable identifier, else `false`.
   * @throws {EventIdMismatchError}
   * Thrown if provided `Event` instance has different `sourceId` then the current event sourceable
   * identifier.
   */
  protected validateEventApplicability(event: types.Event): boolean {
    if (!(event instanceof Event)) {
      throw new InvalidEventError(
        this.typeName(),
        kernel.describer.describe(event)
      );
    }

    if (event.sourceId.toString() !== this.getId().toString()) {
      throw new EventIdMismatchError(
        this.typeName(),
        this.getId().toString(),
        event.sourceId.toString()
      );
    }
    return true;
  }

  /*
  HELPERS
  */
  /**
   * Picks base properties(`sourceId`, `timestamp`, `metadata`, `version`) for new `Event` instance.
   * @return Returns properties for `Event` instance.
   * @example
   *```ts
   * this.record(new MyEvent({
   *   ...this.eventProps(),
   *   customerName: command.customerName,
   * }));
   *```
   */
  public eventProps(): {
    sourceId: Guid | string;
    timestamp: Date;
    metadata: Record<string, any>;
    version: number;
  } {
    return {
      sourceId: this.getId(),
      version: this.getVersion(),
      timestamp: new Date(),
      metadata: {},
    };
  }

  /**
   * Picks base properties(`timestamp` & `metadata`) for new `Command` instance.
   * @return Returns properties for `Command` instance.
   * @example
   *```ts
   * this.trigger(new MyCommand({
   *   ...this.commandProps(),
   *   customerName: command.customerName,
   * }));
   *```
   */
  public commandProps(): {
    timestamp: Date;
    metadata: Record<string, any>;
  } {
    return {
      timestamp: new Date(),
      metadata: {},
    };
  }

  /**
   * Increments version of event sourceable.
   */
  public incrementVersion(): void {
    this.version += 1;
  }

  /*
  HANDLED MESSAGES
  */
  /**
   * Resolves initializing message on `EventSourceable`.
   * @returns `Command` or `Event` type.
   */
  public static resolveInitializingMessage():
    | types.MessageType<types.Command | types.Event>
    | undefined {
    return (
      Reflect.getMetadata(INITIALIZING_MESSAGE_KEY, this.prototype) || undefined
    );
  }

  /**
   * Resolves routed commands.
   * @returns List of all routed `Command` types.
   */
  public static resolveRoutedCommands(): types.MessageType<types.Command>[] {
    return (
      Reflect.getMetadata(ROUTED_COMMANDS_CONTAINER_KEY, this.prototype) || []
    );
  }

  /**
   * Resolves routed events.
   * @returns List of all routed `Event` types.
   */
  public static resolveRoutedEvents(): types.MessageType<types.Event>[] {
    return (
      Reflect.getMetadata(ROUTED_EVENTS_CONTAINER_KEY, this.prototype) || []
    );
  }

  /**
   * Resolves routed messages.
   * @returns List of all routed messages types.
   */
  public static resolveRoutedMessages(): types.MessageType<
    types.Command | types.Event
  >[] {
    const commands =
      Reflect.getMetadata(ROUTED_COMMANDS_CONTAINER_KEY, this.prototype) || [];
    const events =
      Reflect.getMetadata(ROUTED_EVENTS_CONTAINER_KEY, this.prototype) || [];
    return [...commands, ...events];
  }
}
// Enable conversion of serializable list by default
EventSourceable.enableSerializableLists();
