import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import getenv from 'getenv';
import { MongoClient, Collection, Cursor } from 'mongodb';
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
    const mongoClientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    mongoClient = await MongoClient.connect(mongoUrl, mongoClientOptions);
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
      const stream: any = stubInterface<Cursor>();
      const findResult = {
        stream: (): Cursor => stream,
      };

      commitPublisher.getHandledEventTypes.returns(['MyEvent']);
      commitPublisher.getHandledCommandTypes.returns(['MyCommand']);

      const registeredQuery = {
        $or: [
          { eventTypes: { $in: ['MyEvent'] } },
          { commandTypes: { $in: ['MyCommand'] } },
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

      collectionMock
        .expects('find')
        .withArgs(registeredAndNotReceivedYetFilter)
        .resolves(findResult);

      const serializedCommit = {
        id: commitId,
      };

      stream.on.withArgs('data').yields(serializedCommit);

      const lockedCommit = stubInterface<types.Commit>();

      storage.lockCommit
        .withArgs(commitId, appId, workerId, registeredAndNotReceivedYetFilter)
        .resolves(lockedCommit);

      await observer.startObserving(commitPublisher);
      expect(observer.isObserving()).to.be.true;
      await observer.stopObserving();
      expect(observer.isObserving()).to.be.false;

      collectionMock.verify();
      expect(stream.on).to.be.calledWith('finish');
      expect(stream.on).to.be.calledWith('end');
      expect(stream.on).to.be.calledWith('close');
      expect(stream.on).to.be.calledWith('pause');
      expect(stream.on).to.be.calledWith('error');
      expect(commitPublisher.getHandledEventTypes).to.be.calledOnce;
      expect(commitPublisher.getHandledCommandTypes).to.be.calledOnce;
      expect(commitPublisher.publishChanges).to.be.calledOnce;
      expect(commitPublisher.publishChanges).to.be.calledWithExactly(
        lockedCommit
      );
      expect(storage.lockCommit).to.be.calledOnce;
      expect(storage.lockCommit).to.be.calledWithExactly(
        serializedCommit.id,
        appId,
        workerId,
        registeredAndNotReceivedYetFilter
      );
    });

    it('initializes with created state when observer is instantiated', async () => {
      expect(observer.isInState(CommitMongoDBObserver.STATES.created)).to.be
        .true;
    });

    it('changes state to observing when observer starts observing commit changes', async () => {
      await observer.startObserving(commitPublisher);
      expect(observer.isInState(CommitMongoDBObserver.STATES.observing)).to.be
        .true;
      await observer.stopObserving();
    });

    it('changes state to paused when observer pauses observing commit changes', async () => {
      const stream = {
        on: (): void => undefined,
        pause: (): void => undefined,
        close: (): void => undefined,
      };
      const streamMock = sinon.mock(stream);
      const findResult = {
        stream: (): Record<string, any> => stream,
      };
      collectionMock.expects('find').resolves(findResult);
      streamMock.expects('pause');

      await observer.startObserving(commitPublisher);
      await observer.pauseObserving();
      expect(observer.isInState(CommitMongoDBObserver.STATES.paused)).to.be
        .true;
      streamMock.verify();

      await observer.stopObserving();
    });

    it('changes state to closed when observer stops observing commit changes', async () => {
      const stream = {
        on: (): void => undefined,
        pause: (): void => undefined,
        close: (): void => undefined,
      };
      const streamMock = sinon.mock(stream);
      const findResult = {
        stream: (): Record<string, any> => stream,
      };
      collectionMock.expects('find').resolves(findResult);
      streamMock.expects('close');

      await observer.startObserving(commitPublisher);
      await observer.stopObserving();
      expect(observer.isInState(CommitMongoDBObserver.STATES.closed)).to.be
        .true;

      streamMock.verify();
    });
  });

  describe('initialize MongoDB event handlers', () => {
    let handlers: any;
    let stream: any;
    let findResult: any;

    beforeEach(() => {
      handlers = new Map();
      stream = {
        on(mongoEventName: string, handler: Function): void {
          handlers.set(mongoEventName, handler);
        },
      };

      findResult = {
        stream(): Record<string, any> {
          return stream;
        },
      };
      collectionMock.expects('find').resolves(findResult);
    });

    it('registers event handlers for mongo events', async () => {
      await observer.startObserving(commitPublisher);
      expect(Array.from(handlers.keys())).to.be.eql([
        'data',
        'finish',
        'end',
        'close',
        'pause',
        'error',
      ]);
    });

    it('changes state to finished on finish event and logs info', async () => {
      await observer.startObserving(commitPublisher);
      const handler = handlers.get('finish');
      await handler();
      expect(observer.isInState(CommitMongoDBObserver.STATES.finished)).to.be
        .true;
      expect(log.debug).to.be.calledWithMatch(
        new Log(`finished observing commits`)
      );
    });

    it('changes state to ended on end event and logs info', async () => {
      await observer.startObserving(commitPublisher);
      const handler = handlers.get('end');
      await handler();
      expect(observer.isInState(CommitMongoDBObserver.STATES.ended)).to.be.true;
      expect(log.debug).to.be.calledWithMatch(
        new Log(`ended observing commits`)
      );
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

    it('changes state to paused on pause event and logs info', async () => {
      await observer.startObserving(commitPublisher);
      const handler = handlers.get('pause');
      await handler();
      expect(observer.isInState(CommitMongoDBObserver.STATES.paused)).to.be
        .true;
      expect(log.debug).to.be.calledWithMatch(
        new Log(`paused observing commits`)
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
        new Log(`failed observing commits do to error: Error: my-error`)
      );
    });
  });
});
