import { EventSourceable } from './event-sourceable';
import { define } from '../decorators/define';
import { Command } from '../components/command';
import { Event } from '../components/event';
import { History } from './history';
import { types } from '../types';
import { Guid } from './value-objects/guid';
import { InvalidInitializingMessageError } from './domain-errors';
import { kernel } from '../core/kernel';
import { COMMANDS_KEY, EVENTS_KEY } from '../constants/literal-keys';

@define('Process')
export class Process extends EventSourceable {
  public static correlationKey?: string;

  public id: string | Guid;

  public version: number;

  public state: types.State;

  public status: types.Status;

  public metadata?: Record<string, any>;

  public schemaVersion?: number;

  public [COMMANDS_KEY]: types.Command[];

  public [EVENTS_KEY]: types.Event[];

  /**
   * Creates an instance of `Process`.
   * **Flows**:
   * 1. **Replay History** - `Process` is recreated from `History` instance - list  of `Events`(manual initialization and replay is required before running Aggregate.prototype.replayHistory!).
   * 2. **Command|Event** - `Command` or `Event` instance is passed as initializing message and `Process` has assigned id from it.
   * 3. **Properties** - `Process` is deserialized, so props as object are passed.
   * @param arg - Instance of: `History`, `Command`, `Event` or properties.
   * @example
   *```ts
   * new Process(
   *  new History([
   *    new Event({targetId: 'my-id', key: 'value'})
   *  ])
   * );
   * new Process(new Command({targetId: 'my-id', key: 'value'}));
   * new Process(new Event({targetId: 'my-id', key: 'value'}));
   * new Process({id: 'my-id'}); // 3
   * new Process({id: 'my-id', key: 'value'}); // 3
   *```
   * @throws {InvalidInitializingMessageError}
   * Thrown if provided initializing message is not instance of `Command` or `Event`.
   */
  constructor(arg: History | Command | Event | types.Props) {
    // Build up Process props
    const props: Record<string, any> = {
      version: 0,
    };

    let hasInitializingMessage = false;
    // Flow 1: Replay History(requires manual initialization with Aggregate.prototype.replayHistory!)
    if (arg instanceof History) {
      const initializingMessage = arg.getInitializingMessage();
      props.id = initializingMessage.getId();
      // Flow 2: Initializing message(Command or Event)
    } else if (arg instanceof Command || arg instanceof Event) {
      hasInitializingMessage = true;
      const initializingMessage = arg as types.Identifiable;
      if (initializingMessage instanceof Event) {
        // Since Event in Process is always routed from another `EventSourceable` - we need to
        // use new identifier
        props.id = new Guid();
      } else {
        props.id = initializingMessage.getId();
      }
      // Flow 3: Properties
    } else {
      Object.assign(props, arg);
    }

    super(props);

    if (
      hasInitializingMessage &&
      !(arg instanceof Command || arg instanceof Event)
    ) {
      throw new InvalidInitializingMessageError(
        this.getTypeName(),
        kernel.describer.describe([Command, Event]),
        kernel.describer.describe(arg)
      );
    }
  }

  /**
   * Returns correlation key.
   * @return Custom predefined correlation key or `Process` type name.
   */
  public static getCorrelationKey(): string {
    return this.correlationKey !== undefined
      ? this.correlationKey
      : this.getTypeName();
  }

  /**
   * Sets correlation key.
   * @param key - Key under which correlation will be set for `Process`.
   */
  public static setCorrelationKey(key: string): void {
    this.correlationKey = key;
  }

  /**
   * Returns correlation key for `Process`.
   * @return Custom predefined correlation key or `Process` type name.
   */
  public getCorrelationKey(): string {
    return (this.constructor as any).getCorrelationKey();
  }

  /**
   * Adds `Command` instance to command that should be triggered.
   * @param command - Instance of `Command`.
   */
  public trigger(command: types.Command): void {
    command.setCorrelationId(this.getCorrelationKey(), this.getId());
    this[COMMANDS_KEY].push(command);
  }

  /**
   * [OVERRIDE]
   * Ensures that provided `Event` instance has matching `sourceId` of current event sourceable
   * instance.
   * @returns Returns `true` always even for event instances with mismatching identifier.
   */
  protected validateEventApplicability(): boolean {
    return true;
  }
}
