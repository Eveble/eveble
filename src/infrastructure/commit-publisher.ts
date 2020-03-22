import { inject, injectable } from '@parisholley/inversify-async';
import { types } from '../types';
import { BINDINGS } from '../constants/bindings';
import { Log } from '../components/log-entry';
import { CommitReceiver } from './structs/commit';

@injectable()
export class CommitPublisher {
  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.Config)
  protected config: types.Configurable;

  @inject(BINDINGS.CommandBus)
  public commandBus: types.CommandBus; // Public for easier testing

  @inject(BINDINGS.EventBus)
  protected eventBus: types.EventBus;

  @inject(BINDINGS.Serializer)
  protected serializer: types.Serializer;

  @inject(BINDINGS.CommitStorage)
  protected storage: types.CommitStorage;

  @inject(BINDINGS.CommitObserver)
  protected observer: types.CommitObserver;

  protected inProgress: Map<string, any>;

  /**
   * Create a CommitPublisher
   */
  constructor() {
    this.inProgress = new Map();
  }

  /**
   * Starts observing for changes in commits.
   * @async
   */
  public async startPublishing(): Promise<void> {
    this.log.debug(
      new Log('starting observing commits').on(this).in(this.startPublishing)
    );
    await this.observer.startObserving(this);
    this.log.debug(
      new Log('started observing commits').on(this).in(this.startPublishing)
    );
  }

  /**
   * Stops observing for changes in commits.
   * @async
   */
  public async stopPublishing(): Promise<void> {
    this.log.debug(
      new Log('stopping observing commits').on(this).in(this.stopPublishing)
    );
    await this.observer.stopObserving();
    this.log.debug(
      new Log('stopped observing commits').on(this).in(this.stopPublishing)
    );
  }

  /**
   * Publishes changes from commit on application.
   * @async
   * @param commit - Instance implementing `Commit` interface.
   * @throws {Error}
   * Thrown if there is any issue with handling published change(message).
   */
  async publishChanges(commit: types.Commit): Promise<void> {
    const appId = this.config.get('appId');
    const workerId = this.config.get('workerId');
    const receiver = commit.getReceiver(appId) as types.CommitReceiver;
    receiver.flagAsReceived(workerId);

    this.setTimeout(commit);
    try {
      for (const event of commit.events) {
        await this.publishEvent(event);
      }
      for (const command of commit.commands) {
        await this.sendCommand(command);
      }

      if (!receiver.isInState(CommitReceiver.STATES.timeouted)) {
        receiver.flagAsPublished(workerId);
        await this.storage.flagCommitAsPublished(
          commit.id,
          appId,
          workerId,
          new Date()
        );
        this.log.debug(
          new Log(`published commit with id '${commit.id}'`)
            .on(this)
            .in(this.publishChanges)
            .with('commit', commit)
        );
      }
    } catch (error) {
      receiver.flagAsFailed(workerId);
      await this.storage.flagCommitAsFailed(
        commit.id,
        appId,
        workerId,
        new Date()
      );
      this.log.error(
        new Log(`failed publishing commit with id '${commit.id}'`)
          .on(this)
          .in(this.publishChanges)
          .with('commit', commit)
      );
      throw error;
    } finally {
      this.clearTimeout(commit.id);
    }
  }

  /**
   * Returns all handleable event type names from event bus.
   * @returns List of handled event type names.
   */
  public getHandledEventTypes(): types.TypeName[] {
    return this.eventBus.getHandledTypesNames();
  }

  /**
   * Returns all handleable command type names from command bus.
   * @returns List of handled command type names.
   */
  public getHandledCommandTypes(): types.TypeName[] {
    return this.commandBus.getHandledTypesNames();
  }

  /**
   * Evaluates if command can be published.
   * @param command - Instance implementing `Command` interface.
   * @returns Returns `true` if command can be handled on application, else `false`.
   */
  protected canSendCommand(command: types.Command): boolean {
    const typeName = command.getTypeName();
    return (
      this.serializer.hasType(typeName) === true &&
      this.commandBus.hasHandler(
        command.constructor as types.MessageType<types.Command>
      ) === true
    );
  }

  /**
   * Evaluates if commit is processed.
   * @param commitId - Identifier for `Commit`.
   * @returns Returns `true` if commit is being processed, else `false`.
   */
  public isInProgress(commitId: string): boolean {
    return this.inProgress.has(commitId);
  }

  /**
   * Publishes `Event` on event bus.
   * @async
   * @param event - Instance implementing `Event` interface.
   */
  protected async publishEvent(event: types.Event): Promise<void> {
    this.log.debug(
      new Log(`publishing '${event.getTypeName()}'`)
        .on(this)
        .in(this.publishEvent)
        .with('event', event)
    );

    await this.eventBus.publish(event);
  }

  /**
   * Sends `Command` through command bus if command can be handled.
   * @async
   * @param command - Instance implementing `Command` interface.
   */
  protected async sendCommand(command: types.Command): Promise<void> {
    if (!this.canSendCommand(command)) {
      return;
    }
    this.log.debug(
      new Log(`sending '${command.getTypeName()}'`)
        .on(this)
        .in(this.sendCommand)
        .with('command', command)
    );

    await this.commandBus.send(command);
  }

  /**
   * Sets the timeout for currently published changes in progress.
   * @async
   * @param commit - Instance implementing `Commit` interface.
   */
  protected async setTimeout(commit: types.Commit): Promise<void> {
    const timeout = this.config.get('eveble.commitStore.timeout');

    this.inProgress.set(
      commit.id.toString(),
      setTimeout(async () => {
        await this.onTimeout(commit);
      }, timeout)
    );
  }

  /**
   * On publishing changes timeout callback.
   * @async
   * @param commit - Instance implementing `Commit` interface.
   */
  protected async onTimeout(commit: types.Commit): Promise<void> {
    const appId = this.config.get('appId');
    const workerId = this.config.get('workerId');
    commit.getReceiver(appId)?.flagAsTimeouted(workerId);

    const failedCommit = await this.storage.flagAndResolveCommitAsTimeouted(
      commit.id,
      appId,
      workerId,
      new Date()
    );

    if (failedCommit) {
      this.log.error(
        new Log(`timeouted commit with id '${commit.id}'`)
          .on(this)
          .in(this.onTimeout)
          .with('failed commit', failedCommit)
      );
    }
    this.cleanupTimeout(commit.id);
  }

  /**
   * Clears timeout when changes are successfully published.
   * @param commitId - Identifier for `Commit`.
   */
  protected clearTimeout(commitId: string): void {
    clearTimeout(this.inProgress.get(commitId.toString()));
    this.cleanupTimeout(commitId);
  }

  /**
   * Removes timeout from collection.
   * @param commitId - Identifier for `Commit`.
   */
  protected cleanupTimeout(commitId: string): void {
    this.inProgress.delete(commitId.toString());
  }
}
