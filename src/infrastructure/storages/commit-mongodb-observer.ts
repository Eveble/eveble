import getenv from 'getenv';
import { ChangeStream, Collection } from 'mongodb';
import { inject, injectable } from 'inversify';
import { derive } from '@traits-ts/core';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { StatefulTrait } from '../../traits/stateful.trait';
import { Log } from '../../components/log-entry';

@injectable()
export class CommitMongoDBObserver extends derive(StatefulTrait) {
  @inject(BINDINGS.MongoDB.collections.Commits)
  protected collection: Collection;

  @inject(BINDINGS.CommitStorage)
  protected storage: types.CommitStorage;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.Config)
  protected config: types.Configurable;

  static STATES = {
    created: 'created',
    observing: 'observing',
    paused: 'paused',
    closed: 'closed',
    finished: 'finished',
    ended: 'ended',
    failed: 'failed',
  };

  public state: types.State;

  public changeStream?: ChangeStream;

  constructor() {
    super();
    this.setState(CommitMongoDBObserver.STATES.created);
  }

  public async startObserving(
    commitPublisher: types.CommitPublisher
  ): Promise<void> {
    const appId = this.config
      .get<string | types.Stringifiable>('appId')
      .toString();
    const workerId = this.config
      .get<string | types.Stringifiable>('workerId')
      .toString();

    const handledEventTypes = commitPublisher.getHandledEventTypes();
    const handledCommandTypes = commitPublisher.getHandledCommandTypes();

    const pipeline = [
      {
        $match: {
          operationType: 'insert', // listen only for new commits
          $or: [
            {
              'fullDocument.eventTypes': {
                $in: handledEventTypes,
              },
            },
            {
              'fullDocument.commandTypes': {
                $in: handledCommandTypes,
              },
            },
          ],
        },
      },
    ];

    this.changeStream = this.collection.watch(pipeline, {
      fullDocument: 'updateLookup',
    });
    this.setState(CommitMongoDBObserver.STATES.observing);

    this.changeStream.on('change', async (change: any) => {
      const serializedCommit = change.fullDocument;
      if (!serializedCommit) return;

      const registeredQuery = {
        $or: [
          { eventTypes: { $in: handledEventTypes } },
          { commandTypes: { $in: handledCommandTypes } },
        ],
      };
      const notReceivedYetQuery = { 'receivers.appId': { $nin: [appId] } };
      const registeredAndNotReceivedYetFilter = {
        $and: [registeredQuery, notReceivedYetQuery],
      };

      const lockedCommit = await this.storage.lockCommit(
        serializedCommit.id,
        appId,
        workerId,
        registeredAndNotReceivedYetFilter
      );
      if (lockedCommit !== undefined) {
        await commitPublisher.publishChanges(lockedCommit);
      }
    });
    await this.initializeEventHandlers();
  }

  public async pauseObserving(): Promise<void> {
    if (this.changeStream && this.isObserving()) {
      this.setState(CommitMongoDBObserver.STATES.paused);
      await (this.changeStream as any).pause();
    }
  }

  public async stopObserving(): Promise<void> {
    if (this.changeStream && this.isObserving()) {
      this.setState(CommitMongoDBObserver.STATES.closed);
      await this.changeStream.close();
    }
  }

  public isObserving(): boolean {
    return this.state === CommitMongoDBObserver.STATES.observing;
  }

  async initializeEventHandlers(): Promise<void> {
    if (!this.changeStream) return;

    this.changeStream.on('close', () => {
      this.setState(CommitMongoDBObserver.STATES.closed);
      this.log.debug(new Log('closed observing commits'));
    });

    this.changeStream.on('error', (error) => {
      this.setState(CommitMongoDBObserver.STATES.failed);
      this.log.error(
        new Log(`failed observing commits due to error: ${error}`)
      );
      if (this.isInProduction()) {
        process.exit(0);
      }
    });
  }

  /**
   * Evaluates if app is running on production.
   * @returns Returns `true` if environment is running on production, else `false`.
   */
  protected isInProduction(): boolean {
    return getenv.string('NODE_ENV') === 'production';
  }
}
