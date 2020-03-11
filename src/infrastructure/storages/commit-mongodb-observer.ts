import getenv from 'getenv';
import { Collection, Cursor } from 'mongodb';
import { inject, injectable } from '@parisholley/inversify-async';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { StatefulMixin } from '../../mixins/stateful-mixin';
import { Log } from '../../components/log-entry';

@injectable()
export class CommitMongoDBObserver extends StatefulMixin {
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

  public stream: Cursor<any> | undefined;

  /**
   * Creates an instance of CommitMongoDBObserver.
   */
  constructor() {
    super();
    this.setState(CommitMongoDBObserver.STATES.created);
  }

  /**
   * Observes MongoDB collection for changes and publishes them through CommitPublisher.
   * @async
   * @param commitPublisher - Instance implementing `CommitPublisher` interface.
   */
  public async startObserving(
    commitPublisher: types.CommitPublisher
  ): Promise<void> {
    const appId = this.config.get('appId');
    const workerId = this.config.get('workerId');
    const registeredQuery = {
      $or: [
        { eventTypes: { $in: commitPublisher.getHandledEventTypes() } },
        {
          commandTypes: {
            $in: commitPublisher.getHandledCommandTypes(),
          },
        },
      ],
    };
    const notReceivedYetQuery = {
      'receivers.appId': {
        $nin: [appId],
      },
    };
    const registeredAndNotReceivedYetFilter = {
      $and: [registeredQuery, notReceivedYetQuery],
    };

    const cursor = await this.collection.find(
      registeredAndNotReceivedYetFilter,
      {
        timeout: false,
      }
    );
    this.stream = await cursor.stream();
    this.setState(CommitMongoDBObserver.STATES.observing);

    this.stream.on(
      'data',
      async (serializedCommit: types.SerializedCommitForMongoDB) => {
        const lockedCommit = await this.storage.lockCommit(
          serializedCommit.id,
          appId,
          workerId,
          registeredAndNotReceivedYetFilter
        );
        // Only publish the event if this process was the one that locked it
        if (lockedCommit !== undefined) {
          await commitPublisher.publishChanges(lockedCommit);
        }
      }
    );
    await this.initializeEventHandlers();
  }

  /**
   * Pause observing Mongo's commit collection for changes.
   * @async
   */
  public async pauseObserving(): Promise<void> {
    if (this.stream !== undefined && this.isObserving()) {
      this.setState(CommitMongoDBObserver.STATES.paused);
      await this.stream.pause();
    }
  }

  /**
   * Stops observing observed Mongo's commit collection for changes.
   * @async
   */
  public async stopObserving(): Promise<void> {
    if (this.stream !== undefined && this.isObserving()) {
      this.setState(CommitMongoDBObserver.STATES.closed);
      await this.stream.close();
    }
  }

  /**
   * Evaluates if Mongo's commit collection is observed.
   * @return {Boolean}
   */
  public isObserving(): boolean {
    return (
      this.state !== undefined &&
      this.state === CommitMongoDBObserver.STATES.observing
    );
  }

  /**
   * Initializes event handlers.
   * @async
   */
  async initializeEventHandlers(): Promise<void> {
    if (this.stream === undefined) return;
    // Not sure why can't use new Log(...).on() here do to endless loop
    this.stream.on('finish', async () => {
      this.setState(CommitMongoDBObserver.STATES.finished);
      this.log.debug(new Log(`finished observing commits`));
    });
    this.stream.on('end', async () => {
      this.setState(CommitMongoDBObserver.STATES.ended);
      this.log.debug(new Log(`ended observing commits`));
    });
    this.stream.on('close', async () => {
      this.setState(CommitMongoDBObserver.STATES.closed);
      this.log.debug(new Log(`closed observing commits`));
    });
    this.stream.on('pause', async () => {
      this.setState(CommitMongoDBObserver.STATES.paused);
      this.log.debug(new Log(`paused observing commits`));
    });
    this.stream.on('error', async error => {
      this.setState(CommitMongoDBObserver.STATES.failed);
      this.log.error(new Log(`failed observing commits do to error: ${error}`));
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
