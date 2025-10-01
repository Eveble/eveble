import { classes } from 'polytype';
import { Type } from 'typend';
import { types } from '../../types';
import { StatefulMixin } from '../../mixins/stateful-mixin';
import { Serializable } from '../../components/serializable';

@Type('CommitReceiver')
export class CommitReceiver
  extends classes(Serializable, StatefulMixin)
  implements types.CommitReceiver
{
  static STATES = {
    received: 'received',
    published: 'published',
    timeouted: 'timeouted',
    failed: 'failed',
  };

  public state: types.State;

  public appId: string;

  public workerId?: string;

  public receivedAt: Date;

  public publishedAt?: Date;

  public failedAt?: Date;

  /**
   * Creates an instance of Serializable.
   * @param props - Properties of the type required for construction.
   * @remarks
   * Since were dealing with special cases, mixins and limits of TypeScript, we
   * use of "invoking multiple base constructors" from polytype to pass props to Struct's
   * constructor:
   * https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors
   */
  constructor(props: types.Props = {}) {
    super([props]);
    if (props.state) {
      this.setState(props.state);
    }
  }

  /**
   * Returns current time.
   * @returns Instance of `Date`.
   */
  public getCurrentTime(): Date {
    return new Date();
  }

  /**
   * Flags that commit is received by application.
   * @param workerId - Identifier of worker that received `Commit`.
   */
  public flagAsReceived(workerId: string): void {
    this.setState(CommitReceiver.STATES.received);
    this.receivedAt = this.getCurrentTime();
    this.workerId = workerId;
  }

  /**
   * Flags that commit is published on application.
   * @param workerId - Identifier of worker that published `Commit`.
   */
  public flagAsPublished(workerId: string): void {
    this.setState(CommitReceiver.STATES.published);
    this.publishedAt = this.getCurrentTime();
    this.workerId = workerId;
  }

  /**
   * Flags that commit was not published do to timeout on application.
   * @param workerId - Identifier of worker on which `Commit` timeout.
   */
  public flagAsTimeouted(workerId: string): void {
    this.setState(CommitReceiver.STATES.timeouted);
    this.failedAt = this.getCurrentTime();
    this.workerId = workerId;
  }

  /**
   * Flags that commit failed(is not publishable on application).
   * @param workerId - Identifier of worker that failed to publish `Commit`.
   */
  public flagAsFailed(workerId: string): void {
    this.setState(CommitReceiver.STATES.failed);
    this.failedAt = this.getCurrentTime();
    this.workerId = workerId;
  }
}

@Type('Commit')
export class Commit extends Serializable implements types.Commit {
  public id: string;

  public sourceId: string;

  public version: number;

  public eventSourceableType: string;

  public commands: types.Command[];

  public events: types.Event[];

  public insertedAt: Date;

  public sentBy: string;

  public receivers: CommitReceiver[];

  /**
   * Gets list of event type names.
   * @returns List with event type names.
   */
  public getEventTypeNames(): types.TypeName[] {
    const typeNames: types.TypeName[] = [];
    for (const event of this.events) {
      typeNames.push(event.getTypeName());
    }
    return typeNames;
  }

  /**
   * Gets list of command type names.
   * @returns List with command type names.
   */
  public getCommandTypeNames(): types.TypeName[] {
    const typeNames: types.TypeName[] = [];
    for (const command of this.commands) {
      typeNames.push(command.getTypeName());
    }
    return typeNames;
  }

  /**
   * Adds receiver to commit receivers list.
   * @param receiver - Instance of `CommitReceiver`.
   */
  public addReceiver(receiver: CommitReceiver): void {
    this.receivers.push(receiver);
  }

  /**
   * Gets receiver for application by its id.
   * @param appId - Application identifier.
   * @returns Instance of `CommitReceiver`, else `undefined`.
   */
  public getReceiver(appId: string): CommitReceiver | undefined {
    return this.receivers.find(
      (receiver) => receiver.appId.toString() === appId.toString()
    );
  }
}
