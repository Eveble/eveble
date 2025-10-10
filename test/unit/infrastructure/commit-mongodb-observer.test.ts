import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import getenv from 'getenv';
import { MongoClient, Collection, ChangeStream } from 'mongodb';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';
import { types } from '../../../src/types';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { Log } from '../../../src/components/log-entry';
import { Guid } from '../../../src/domain/value-objects/guid';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`CommitMongoDBObserver`, () => {
  const now = new Date();
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  let clock: any;
  let mongoClient: MongoClient;
  let injector: Injector;
  let collection: Collection;
  let collectionMock: any;
  let config: any;
  let log: any;
  let storage: any;
  let observer: CommitMongoDBObserver;
  let commitPublisher: any;

  before(async () => {
    const mongoUrl = getenv.string('EVEBLE_COMMITSTORE_MONGODB_URL');
    mongoClient = await MongoClient.connect(mongoUrl);
  });

  beforeEach(() => {
    const dbName =
      getenv.string('EVEBLE_COMMITSTORE_MONGODB_DBNAME') || 'eveble_testing';
    const collectionName =
      getenv.string('EVEBLE_COMMITSTORE_MONGODB_COLLECTION') || 'commits';
    collection = mongoClient.db(dbName).collection(collectionName);
    collectionMock = sinon.mock(collection);

    injector = new Injector();
    observer = new CommitMongoDBObserver();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();
    storage = stubInterface<types.CommitStorage>();
    commitPublisher = stubInterface<types.CommitPublisher>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector
      .bind<Collection<any>>(BINDINGS.MongoDB.collections.Commits)
      .toConstantValue(collection);
    injector
      .bind<types.CommitStorage>(BINDINGS.CommitStorage)
      .toConstantValue(storage);
    injector.injectInto(observer);

    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('workerId').returns(workerId);
  });

  after(async () => {
    await mongoClient.close();
  });

  const commitId = new Guid().toString();

  describe('observing', () => {
    before(() => {
      clock = sinon.useFakeTimers(now.getTime());
    });
    after(() => {
      clock.restore();
    });

    it(`observes commits for changes`, async () => {
      // Prepare handled types
      commitPublisher.getHandledEventTypes.returns(['MyEvent']);
      commitPublisher.getHandledCommandTypes.returns(['MyCommand']);

      const expectedPipeline = [
        {
          $match: {
            operationType: 'insert',
            $or: [
              { 'fullDocument.eventTypes': { $in: ['MyEvent'] } },
              { 'fullDocument.commandTypes': { $in: ['MyCommand'] } },
            ],
          },
        },
      ];

      // Create fake change stream that immediately triggers "change"
      const changeStream: any = {
        on: (event: string, handler: Function) => {
          if (event === 'change') {
            handler({ fullDocument: { id: commitId } });
          }
          return changeStream;
        },
        close: sinon.stub(),
      };

      collectionMock
        .expects('watch')
        .withArgs(expectedPipeline, { fullDocument: 'updateLookup' })
        .returns(changeStream);

      const lockedCommit = stubInterface<types.Commit>();
      storage.lockCommit.resolves(lockedCommit);

      await observer.startObserving(commitPublisher);

      expect(observer.isObserving()).to.be.true;
      expect(storage.lockCommit).to.have.been.calledOnce;
      expect(commitPublisher.publishChanges).to.have.been.calledOnce;
      expect(commitPublisher.publishChanges).to.have.been.calledWithExactly(
        lockedCommit
      );

      await observer.stopObserving();
      expect(observer.isObserving()).to.be.false;
      collectionMock.verify();

      // Each of these should be called once (precomputed in observer)
      expect(commitPublisher.getHandledEventTypes).to.be.calledOnce;
      expect(commitPublisher.getHandledCommandTypes).to.be.calledOnce;
    });

    it('uses registeredAndNotReceivedYetFilter when locking commits (prevents duplicate publish)', async () => {
      commitPublisher.getHandledEventTypes.returns(['MyEvent']);
      commitPublisher.getHandledCommandTypes.returns(['MyCommand']);

      const expectedFilter = {
        $and: [
          {
            $or: [
              { eventTypes: { $in: ['MyEvent'] } },
              { commandTypes: { $in: ['MyCommand'] } },
            ],
          },
          { 'receivers.appId': { $nin: [appId] } },
        ],
      };

      // Fake changeStream that fires a "change" immediately
      const changeStream: any = {
        on: (event: string, handler: Function) => {
          if (event === 'change') {
            handler({ fullDocument: { id: commitId } });
          }
          return changeStream;
        },
        close: sinon.stub(),
      };
      collectionMock.expects('watch').returns(changeStream);

      const lockedCommit = stubInterface<types.Commit>();
      storage.lockCommit.resolves(lockedCommit);

      await observer.startObserving(commitPublisher);

      sinon.assert.calledOnce(storage.lockCommit);
      expect(storage.lockCommit).to.have.been.calledWithMatch(
        sinon.match.any, // commit id (can be Guid or string)
        sinon.match(appId),
        sinon.match(workerId),
        sinon.match(expectedFilter)
      );
      expect(commitPublisher.publishChanges).to.have.been.calledOnce;
      expect(commitPublisher.publishChanges).to.have.been.calledWithExactly(
        lockedCommit
      );

      await observer.stopObserving();
      collectionMock.verify();
    });

    it('initializes with created state when observer is instantiated', async () => {
      expect(observer.isInState(CommitMongoDBObserver.STATES.created)).to.be
        .true;
    });

    it('changes state to observing when observer starts observing commit changes', async () => {
      const changeStream: any = stubInterface<ChangeStream>();
      collectionMock.expects('watch').returns(changeStream);

      await observer.startObserving(commitPublisher);
      expect(observer.isInState(CommitMongoDBObserver.STATES.observing)).to.be
        .true;
      await observer.stopObserving();
    });

    it('changes state to paused when observer pauses observing commit changes', async () => {
      const changeStream = {
        on: (): void => undefined,
        close: (): void => undefined,
        pause: sinon.stub().resolves(),
      };

      collectionMock.expects('watch').returns(changeStream);

      await observer.startObserving(commitPublisher);
      await observer.pauseObserving();
      expect(observer.isInState(CommitMongoDBObserver.STATES.paused)).to.be
        .true;
      expect(changeStream.pause).to.be.calledOnce;

      await observer.stopObserving();
    });

    it('changes state to closed when observer stops observing commit changes', async () => {
      const changeStream = {
        on: (): void => undefined,
        close: sinon.stub().resolves(),
      };

      collectionMock.expects('watch').returns(changeStream);

      await observer.startObserving(commitPublisher);
      await observer.stopObserving();
      expect(observer.isInState(CommitMongoDBObserver.STATES.closed)).to.be
        .true;

      expect(changeStream.close).to.be.calledOnce;
    });
  });

  describe('initialize MongoDB event handlers', () => {
    let handlers: any;
    let changeStream: any;

    beforeEach(() => {
      handlers = new Map();
      changeStream = {
        on(eventName: string, handler: Function): void {
          handlers.set(eventName, handler);
        },
      };

      collectionMock.expects('watch').returns(changeStream);
    });

    it('registers event handlers for mongo events', async () => {
      await observer.startObserving(commitPublisher);
      expect(Array.from(handlers.keys())).to.be.eql([
        'change',
        'close',
        'error',
      ]);
    });

    it('changes state to closed on close event and logs info', async () => {
      await observer.startObserving(commitPublisher);
      const handler = handlers.get('close');
      await handler();
      expect(observer.isInState(CommitMongoDBObserver.STATES.closed)).to.be
        .true;
      expect(log.debug).to.be.calledWithMatch(
        new Log(`closed observing commits`)
      );
    });

    it('changes state to failed on error event and logs error', async () => {
      await observer.startObserving(commitPublisher);
      const handler = handlers.get('error');
      const error = new Error('my-error');
      await handler(error);
      expect(observer.isInState(CommitMongoDBObserver.STATES.failed)).to.be
        .true;
      expect(log.error).to.be.calledWithMatch(
        new Log(`failed observing commits due to error: Error: my-error`)
      );
    });
  });
});
