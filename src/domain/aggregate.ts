import { define } from '../decorators/define';
import { EventSourceable } from './event-sourceable';
import { History } from './history';
import { types } from '../types';
import { Command } from '../components/command';
import { kernel } from '../core/kernel';
import { InvalidInitializingMessageError } from './domain-errors';
import { Event } from '../components/event';
import { COMMANDS_KEY, EVENTS_KEY } from '../constants/literal-keys';
import { Guid } from './value-objects/guid';

@define('Aggregate')
export class Aggregate extends EventSourceable {
  public id: string | Guid;

  public version: number;

  public state: types.State;

  public status: types.Status;

  public metadata?: Record<string, any>;

  public schemaVersion?: number;

  public [COMMANDS_KEY]: types.Command[];

  public [EVENTS_KEY]: types.Event[];

  /**
   * Creates an instance of `Aggregate`.
   * **Flows**:
   * 1. **Replay History** - `Aggregate` is recreated from `History` instance - list  of `Events`(manual initialization and replay is required before running Aggregate.prototype.replayHistory!).
   * 2. **Command** - `Command` instance is passed as initializing message and `Aggregate` has assigned id from it.
   * 3. **Properties** - `Aggregate` is deserialized, so props as object are passed.
   * @param arg - Instance of: `History`, `Command` or properties.
   * @example
   *```ts
   * new Aggregate(
   *  new History([
   *    new Event({targetId: 'my-id', key: 'value'})
   *  ])
   * ); // 1
   * new Aggregate(new Command({targetId: 'my-id', key: 'value'})); // 2
   * new Aggregate({id: 'my-id'}); // 3
   * new Aggregate({id: 'my-id', key: 'value'}); // 3
   *```
   * @throws {InvalidInitializingMessageError}
   * Thrown if provided initializing message is not instance of `Command`.
   */
  constructor(arg: History | Command<{}> | types.Props) {
    // Build up Aggregate props
    const props: Record<string, any> = {
      version: 0,
    };

    let isInitializedWithEvent = false;
    // Flow 1: Replay History(requires manual initialization with Aggregate.prototype.replayHistory!)
    if (arg instanceof History) {
      const initializingMessage = arg.getInitializingMessage();
      props.id = initializingMessage.getId();
      // Flow 2: Initializing message(Command)
    } else if (arg instanceof Command) {
      const initializingMessage = arg as types.Identifiable;
      props.id = initializingMessage.getId();
      // Flow 3: Properties
    } else if (arg instanceof Event) {
      isInitializedWithEvent = true;
    } else {
      Object.assign(props, arg);
    }

    super(props);

    if (isInitializedWithEvent) {
      throw new InvalidInitializingMessageError(
        this.typeName(),
        kernel.describer.describe([Command, History]),
        kernel.describer.describe(arg)
      );
    }
  }
}
