import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { MongoClient, Collection } from 'mongodb';
import { stubInterface } from 'ts-sinon';
import getenv from 'getenv';
import { define } from '../../../src/decorators/define';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import {
  CommitReceiver,
  Commit,
} from '../../../src/infrastructure/structs/commit';
import { Guid } from '../../../src/domain/value-objects/guid';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { Injector } from '../../../src/core/injector';
import {
  UpdatingCommitError,
  AddingCommitFailedError,
  CommitConcurrencyError,
} from '../../../src/infrastructure/infrastructure-errors';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`CommitMongoDBStorage`, function() {
  @define('CommitMongoDBStorage.MyCommand', { isRegistrable: false })
  class MyCommand extends Command {
    name: string;
  }
  @define('CommitMongoDBStorage.MyEvent', { isRegistrable: false })
  class MyEvent extends Event {
    name: string;
  }

  const now = new Date();
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  let mongoClient: MongoClient;
  let injector: Injector;
  let collection: Collection;
  let collectionMock: any;
  let commitSerializer: any;
  let storage: CommitMongoDBStorage;

  const generateCommit = (
    commitId: string,
    eventSourceableId: string,
    version: number
  ): Commit => {
    const event = new MyEvent({
      sourceId: eventSourceableId,
      timestamp: now,
      name: 'Foo',
      version,
    });
    const command = new MyCommand({
      targetId: eventSourceableId,
      timestamp: now,
      name: 'Foo',
    });
    const receiver = new CommitReceiver({
      state: 'received',
      appId,
      workerId,
      receivedAt: now,
    });

    return new Commit({
      id: commitId,
      sourceId: eventSourceableId.toString(),
      version,
      eventSourceableType: 'CommitMongoDBStorage.MyEventSourceable',
      events: [event],
      commands: [command],
      insertedAt: now,
      sentBy: appId,
      receivers: [receiver],
    });
  };

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
    storage = new CommitMongoDBStorage();
    commitSerializer = stubInterface<types.CommitSerializer>();

    injector
      .bind<types.CommitSerializer>(BINDINGS.CommitSerializer)
      .toConstantValue(commitSerializer);
    injector
      .bind<Collection<any>>(BINDINGS.MongoDB.collections.Commits)
      .toConstantValue(collection);
    injector.injectInto(storage);
  });

  after(async () => {
    await mongoClient.close();
  });

  const commitId = new Guid().toString();
  const eventSourceableId = 'my-event-sourceable-id';

  describe(`adding commit`, () => {
    it(`inserts commit to MongoDB collection`, async () => {
      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = stubInterface<
        types.SerializedCommitForMongoDB
      >();
      commitSerializer.serialize.withArgs(commit).returns(serializedCommit);

      collectionMock
        .expects('insertOne')
        .withArgs(serializedCommit)
        .resolves({
          insertedId: commitId,
          insertedCount: 1,
        });

      const result = await storage.save(commit);
      expect(result).to.be.equal(commitId);
      expect(commitSerializer.serialize).to.be.calledOnce;
      expect(commitSerializer.serialize).to.be.calledWithExactly(commit);

      collectionMock.verify();
    });

    it(`throws AddingCommitFailedError on unsuccessful document insertion`, async () => {
      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = stubInterface<
        types.SerializedCommitForMongoDB
      >();
      commitSerializer.serialize.withArgs(commit).returns(serializedCommit);

      collectionMock
        .expects('insertOne')
        .withArgs(serializedCommit)
        .resolves({ insertedCount: 0 });

      await expect(
        storage.save(generateCommit(commitId, eventSourceableId, 1))
      ).to.eventually.be.rejectedWith(
        AddingCommitFailedError,
        `CommitMongoDBStorage: adding commit with id '${commitId.toString()}' failed on '${appId}'`
      );

      collectionMock.verify();
    });

    it(`throws CommitConcurrencyError on duplicated key error`, async () => {
      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = stubInterface<
        types.SerializedCommitForMongoDB
      >();
      commitSerializer.serialize.withArgs(commit).returns(serializedCommit);

      const error = new Error('duplicate key error index');
      (error as any).code = 11000;

      collectionMock
        .expects('insertOne')
        .withArgs(serializedCommit)
        .rejects(error);

      const query = {
        sourceId: eventSourceableId,
      };
      const options = {
        sort: [['version', 'desc']],
        projection: {
          version: 1,
        },
      };
      collectionMock
        .expects('findOne')
        .withArgs(query, options)
        .resolves({
          version: 10,
        });

      await expect(
        storage.save(generateCommit(commitId, eventSourceableId, 1))
      ).to.eventually.be.rejectedWith(
        CommitConcurrencyError,
        `CommitMongoDBStorage.MyEventSourceable: expected event sourceable with id of '${eventSourceableId.toString()}' to be at version 0 but is at version 1`
      );

      collectionMock.verify();
    });
  });

  describe(`retrieving last commit version`, () => {
    it(`returns last commit version by event sourceable's id`, async () => {
      const query = {
        sourceId: eventSourceableId,
      };
      const options = {
        sort: [['version', 'desc']],
        projection: {
          version: 1,
        },
      };
      collectionMock
        .expects('findOne')
        .withArgs(query, options)
        .resolves({
          version: 10,
        });

      const lastCommitVersion = await storage.findLastVersionById(
        eventSourceableId
      );
      expect(lastCommitVersion).to.be.equal(10);

      collectionMock.verify();
    });

    it(`returns undefined when commit cannot be found for event sourceable's`, async () => {
      collectionMock.expects('findOne').resolves(null);

      const lastCommitVersion = await storage.findLastVersionById('my-id');
      expect(lastCommitVersion).to.be.equal(undefined);

      collectionMock.verify();
    });
  });

  describe(`retrieving commits`, () => {
    it('returns commit by id', async () => {
      const query = {
        _id: commitId,
      };
      const serializedCommit = stubInterface<
        types.SerializedCommitForMongoDB
      >();
      const commit = generateCommit(commitId, eventSourceableId, 1);
      collectionMock
        .expects('findOne')
        .withArgs(query)
        .resolves(serializedCommit);
      commitSerializer.deserialize.withArgs(serializedCommit).returns(commit);

      const foundCommit = await storage.findById(commitId);
      expect(foundCommit).to.be.instanceof(Commit);
      expect(foundCommit).to.be.eql(
        generateCommit(commitId, eventSourceableId, 1)
      );
      expect(commitSerializer.deserialize).to.be.calledOnce;
      expect(commitSerializer.deserialize).to.be.calledWithExactly(
        serializedCommit
      );

      collectionMock.verify();
    });

    it(`returns undefined if commit by id can't be found`, async () => {
      const query = {
        _id: commitId,
      };
      collectionMock
        .expects('findOne')
        .withArgs(query)
        .resolves(null);

      const foundCommit = await storage.findById(commitId);
      expect(foundCommit).to.be.equal(undefined);

      collectionMock.verify();
    });

    it(`returns commits by event sourcealbe's id and version offset`, async () => {
      const findResult = {
        toArray(): void {
          return undefined;
        },
      };
      const findResultMock = sinon.mock(findResult);

      const query = {
        sourceId: eventSourceableId,
        version: {
          $gte: 10,
        },
      };
      const options = {
        sort: [['version', 'asc']],
      };
      collectionMock
        .expects('find')
        .withArgs(query, options)
        .resolves(findResult);

      const firstCommitId = new Guid().toString();
      const secondCommitId = new Guid().toString();
      const firstSerializedCommit = sinon.stub();
      const secondSerializedCommit = sinon.stub();
      const firstCommit = generateCommit(firstCommitId, eventSourceableId, 10);
      const secondCommit = generateCommit(
        secondCommitId,
        eventSourceableId,
        11
      );

      findResultMock
        .expects('toArray')
        .resolves([firstSerializedCommit, secondSerializedCommit]);
      commitSerializer.deserialize
        .withArgs(firstSerializedCommit)
        .returns(firstCommit);
      commitSerializer.deserialize
        .withArgs(secondSerializedCommit)
        .returns(secondCommit);

      const foundCommits = await storage.getCommits(eventSourceableId, 10);
      expect(foundCommits).to.be.eql([firstCommit, secondCommit]);

      findResultMock.verify();
      collectionMock.verify();
    });

    it(`returns empty array when no commits can be found for version offset`, async () => {
      const findResult = {
        toArray(): void {
          return undefined;
        },
      };
      const findResultMock = sinon.mock(findResult);

      collectionMock.expects('find').resolves(findResult);

      findResultMock.expects('toArray').resolves([]);

      const foundCommits = await storage.getCommits(eventSourceableId, 10);
      expect(foundCommits).to.be.eql([]);

      findResultMock.verify();
      collectionMock.verify();
    });

    it(`returns all commits for every event sourceable`, async () => {
      const firstCommitId = new Guid().toString();
      const secondCommitId = new Guid().toString();
      const thirdCommitId = new Guid().toString();
      const otherEventSourceableId = 'my-other-id';

      const firstSerializedCommit = sinon.stub();
      const secondSerializedCommit = sinon.stub();
      const thirdSerializedCommit = sinon.stub();
      const firstCommit = generateCommit(firstCommitId, eventSourceableId, 1);
      const secondCommit = generateCommit(secondCommitId, eventSourceableId, 2);
      const thirdCommit = generateCommit(
        thirdCommitId,
        otherEventSourceableId,
        5
      );

      const findResult = {
        toArray(): void {
          return undefined;
        },
      };
      const findResultMock = sinon.mock(findResult);

      collectionMock
        .expects('find')
        .withArgs({}, {})
        .resolves(findResult);

      findResultMock
        .expects('toArray')
        .resolves([
          firstSerializedCommit,
          secondSerializedCommit,
          thirdSerializedCommit,
        ]);
      commitSerializer.deserialize
        .withArgs(firstSerializedCommit)
        .returns(firstCommit);
      commitSerializer.deserialize
        .withArgs(secondSerializedCommit)
        .returns(secondCommit);
      commitSerializer.deserialize
        .withArgs(thirdSerializedCommit)
        .returns(thirdCommit);

      const foundCommit = await storage.getAllCommits();
      expect(foundCommit).to.be.eql([firstCommit, secondCommit, thirdCommit]);

      findResultMock.verify();
      collectionMock.verify();
    });
  });

  describe(`flagging commits`, () => {
    it(`flags commit as published`, async () => {
      const filter = {
        $and: [
          { _id: commitId },
          {
            receivers: {
              $elemMatch: {
                appId,
              },
            },
          },
        ],
      };
      const update = {
        $set: {
          'receivers.$.publishedAt': now,
          'receivers.$.state': 'published',
          'receivers.$.workerId': workerId,
        },
      };

      const serializedCommit = stubInterface<
        types.SerializedCommitForMongoDB
      >();

      collectionMock
        .expects('updateOne')
        .withArgs(filter, update)
        .resolves({
          result: { ok: 1, nModified: 1 },
          value: serializedCommit,
        });

      const result = await storage.flagCommitAsPublished(
        commitId,
        appId,
        workerId,
        now
      );
      expect(result).to.be.true;

      collectionMock.verify();
    });

    it(`throws UpdatingCommitError when commit can't be updated to published`, async () => {
      collectionMock
        .expects('updateOne')
        .resolves({ result: { ok: 1, nModified: 0 } });

      await expect(
        storage.flagCommitAsPublished(commitId, appId, workerId, now)
      ).to.eventually.be.rejectedWith(
        UpdatingCommitError,
        `CommitMongoDBStorage: updating commit with id '${commitId}' failed on '${appId}'`
      );
      collectionMock.verify();
    });

    it(`flags commit as failed`, async () => {
      const filter = {
        $and: [
          { _id: commitId },
          {
            receivers: {
              $elemMatch: {
                appId,
              },
            },
          },
        ],
      };
      const update = {
        $set: {
          'receivers.$.failedAt': now,
          'receivers.$.state': 'failed',
          'receivers.$.workerId': workerId,
        },
      };

      collectionMock
        .expects('updateOne')
        .withArgs(filter, update)
        .resolves({ result: { ok: 1, nModified: 1 } });

      const result = await storage.flagCommitAsFailed(
        commitId,
        appId,
        workerId,
        now
      );
      expect(result).to.be.true;

      collectionMock.verify();
    });

    it(`throws UpdatingCommitError when commit can't be updated to failed`, async () => {
      collectionMock
        .expects('updateOne')
        .resolves({ result: { ok: 1, nModified: 0 } });

      expect(
        storage.flagCommitAsFailed(commitId, appId, workerId, now)
      ).to.eventually.be.rejectedWith(
        UpdatingCommitError,
        `CommitMongoDBStorage: updating commit with id '${commitId}' failed on '${appId}'`
      );
      collectionMock.verify();
    });

    it(`flags commit as timeouted`, async () => {
      const query = {
        $and: [
          { _id: commitId },
          {
            receivers: {
              $elemMatch: {
                appId,
                publishedAt: { $exists: false },
              },
            },
          },
        ],
      };
      const update = {
        $set: {
          'receivers.$.failedAt': now,
          'receivers.$.state': 'timeouted',
          'receivers.$.workerId': workerId,
        },
      };

      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = stubInterface<
        types.SerializedCommitForMongoDB
      >();

      collectionMock
        .expects('findOneAndUpdate')
        .withArgs(query, update)
        .resolves({
          result: { ok: 1, nModified: 1 },
          value: serializedCommit,
        });
      commitSerializer.deserialize.withArgs(serializedCommit).returns(commit);

      const foundCommit = await storage.flagAndResolveCommitAsTimeouted(
        commitId,
        appId,
        workerId,
        now
      );
      expect(foundCommit).to.be.instanceof(Commit);
      expect(foundCommit).to.be.equal(commit);

      collectionMock.verify();
    });

    it(`locks commit`, async () => {
      const clock = sinon.useFakeTimers(now.getTime());

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
      const registeredAndNotReceivedYetQuery = {
        $and: [registeredQuery, notReceivedYetQuery],
      };

      const filter = {
        $and: [{ _id: commitId }, registeredAndNotReceivedYetQuery],
      };
      const update = {
        $push: {
          receivers: {
            state: 'received',
            appId,
            workerId,
            receivedAt: now,
          },
        },
      };
      const options = {
        returnOriginal: false,
      };

      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = stubInterface<
        types.SerializedCommitForMongoDB
      >();

      collectionMock
        .expects('findOneAndUpdate')
        .withArgs(filter, update, options)
        .resolves({
          result: { ok: 1, nModified: 1 },
          value: serializedCommit,
        });
      commitSerializer.deserialize.withArgs(serializedCommit).returns(commit);

      const foundCommit = await storage.lockCommit(
        commitId,
        appId,
        workerId,
        registeredAndNotReceivedYetQuery
      );
      expect(foundCommit).to.be.instanceof(Commit);
      expect(foundCommit).to.be.equal(commit);

      collectionMock.verify();
      clock.restore();
    });
  });
});
