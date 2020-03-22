import { inject, injectable } from '@parisholley/inversify-async';
import { CommitConcurrencyError } from './infrastructure-errors';
import { types } from '../types';
import { BINDINGS } from '../constants/bindings';
import { Commit, CommitReceiver } from './structs/commit';
import { Log } from '../components/log-entry';
import { Guid } from '../domain/value-objects/guid';

@injectable()
export class CommitStore implements types.CommitStore {
  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.Config)
  protected config: types.Configurable;

  @inject(BINDINGS.CommitStorage)
  protected storage: types.CommitStorage;

  @inject(BINDINGS.CommitPublisher)
  protected publisher: types.CommitPublisher;

  /**
   * Create `Commit` from event sourceable instance.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @return Instance implementing `Commit` interface.
   */
  public async createCommit(
    eventSourceable: types.EventSourceable
  ): Promise<types.Commit> {
    const sourceId = eventSourceable.getId();
    const expectedVersion = eventSourceable.getVersion();
    const eventSourceableType = eventSourceable.getTypeName();
    let events = [...eventSourceable.getEvents()];
    const commands = [...eventSourceable.getCommands()];

    this.log.debug(
      new Log(
        `creating commit for '${eventSourceableType}@${sourceId}' with expected at version ${expectedVersion}`
      )
        .on(this)
        .in(this.createCommit)
        .with('event sourceable', eventSourceable)
    );

    let currentVersion: number;
    // Fetch last inserted batch to get the current version
    const lastVersion = await this.storage.getLastCommitVersionById(sourceId);
    if (lastVersion !== undefined) {
      // Take version of last existing commit
      currentVersion = lastVersion;
    } else {
      // First time being saved, so start at 0
      currentVersion = 0;
    }

    if (currentVersion !== expectedVersion) {
      throw new CommitConcurrencyError(
        eventSourceableType,
        sourceId.toString(),
        expectedVersion.toString(),
        currentVersion.toString()
      );
    }

    const newVersion = currentVersion + 1;
    events = this.resolveEventsWithNewVersion(events, newVersion);

    const appId = this.config.get('appId').toString();
    const workerId = this.config.get('workerId').toString();
    const timestamp = new Date();

    const receiver = new CommitReceiver({
      state: CommitReceiver.STATES.received,
      appId,
      workerId,
      receivedAt: timestamp,
    });

    const props: Partial<Commit> = {
      sourceId: sourceId.toString(),
      version: newVersion,
      eventSourceableType,
      commands,
      events,
      insertedAt: timestamp,
      sentBy: appId,
      receivers: [receiver],
    };
    const commitId = await this.generateCommitId();
    if (commitId) {
      props.id = commitId.toString();
    } else {
      props.id = new Guid().toString();
    }

    return new Commit(props);
  }

  /**
   * Generates identifier compatible with commit storage.
   * @async
   * @return Identifier for commit compatible with storage implementation.
   */
  public async generateCommitId(): Promise<string> {
    return this.storage.generateCommitId();
  }

  /**
   * Adds commit to storage and publishes changes.
   * @async
   * @param commit - Instance implementing `Commit` interface.
   * @return Identifier of commit on commit storage.
   */
  public async addCommit(commit: types.Commit): Promise<string> {
    this.log.debug(
      new Log(
        `adding commit for '${commit.eventSourceableType}@${commit.sourceId}'`
      )
        .on(this)
        .in(this.addCommit)
        .with('commit', commit)
    );

    let commitId;
    try {
      commitId = await this.storage.addCommit(commit);
      this.log.debug(
        new Log(
          `added commit with id '${commitId}' for '${commit.eventSourceableType}@${commit.sourceId}'`
        )
          .on(this)
          .in(this.addCommit)
          .with('commit', commit)
      );
    } catch (error) {
      this.log.error(
        new Log(
          `failed adding commit for '${commit.eventSourceableType}@${commit.sourceId}' do to error: ${error}`
        )
          .on(this)
          .in(this.addCommit)
          .with('commit', commit)
      );
      throw error;
    }
    await this.publisher.publishChanges(commit);
    return commitId;
  }

  /**
   * Returns all events associated with commits that exceeds or are equal to provided version offset.
   * @async
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @param versionOffset - Version number from which version events should be returned.
   * @return List of all `Events` associated with resolved commits for version offset.
   */
  public async getEvents(
    eventSourceableId: string | Guid,
    versionOffset = 1
  ): Promise<types.Event[]> {
    const foundCommits = await this.storage.getCommits(
      eventSourceableId,
      versionOffset
    );
    return this.getEventsFromCommits(foundCommits);
  }

  /**
   * Returns events from all existing commits on storage.
   * @async
   * @return List of all published `Events`.
   */
  public async getAllEvents(): Promise<types.Event[]> {
    const foundCommits = await this.storage.getAllCommits();
    return this.getEventsFromCommits(foundCommits);
  }

  /**
   * Returns commit by commit id.
   * @param commitId - Identifier of `Commit`.
   * @returns Instance implementing `Commit` interface, else `undefined`.
   */
  public async getCommitById(
    commitId: string
  ): Promise<types.Commit | undefined> {
    return this.storage.getCommitById(commitId);
  }

  /**
   * Extracts all published events from `Commit`.
   * @param commits - List of instances implementing `Commit` interface.
   * @return List of all published events from commits.
   */
  protected getEventsFromCommits(commits: types.Commit[] = []): types.Event[] {
    const events: types.Event[] = [];
    for (const commit of commits) {
      for (const event of commit.events) {
        events.push(event);
      }
    }
    return events;
  }

  /**
   * Resolves events for new version(`Events` are immutable!).
   * @param events - List of instances implementing `Event` interface.
   * @param newVersion - New version that should be set on changed events.
   * @returns List of instances implementing `Event` interface with new version.
   */
  protected resolveEventsWithNewVersion(
    events: types.Event[],
    newVersion: number
  ): types.Event[] {
    const newlyVersionedEvents: types.Event[] = [];
    for (const event of events) {
      newlyVersionedEvents.push(
        new (event as any).constructor({ ...event, version: newVersion })
      );
    }
    return newlyVersionedEvents;
  }
}
