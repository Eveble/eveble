import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, beforeAll, afterAll } from 'vitest';

import { MongoClient, Collection } from 'mongodb';

import getenv from 'getenv';
import { Type } from '@eveble/core';
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

describe(`CommitMongoDBStorage`, () => {
  @Type('CommitMongoDBStorage.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @Type('CommitMongoDBStorage.MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    name: string;
  }

  const now = new Date();
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  let mongoClient: MongoClient;
  let injector: Injector;
  let collection: Collection;
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

  beforeAll(async () => {
    const mongoUrl = getenv.string('EVEBLE_COMMITSTORE_MONGODB_URL');
    const mongoClientOptions = {};
    // Remove deprecated options for v6
    mongoClient = await MongoClient.connect(mongoUrl, mongoClientOptions);
  });

  beforeEach(() => {
    const dbName =
      getenv.string('EVEBLE_COMMITSTORE_MONGODB_DBNAME') || 'eveble_testing';
    const collectionName =
      getenv.string('EVEBLE_COMMITSTORE_MONGODB_COLLECTION') || 'commits';
    collection = mongoClient.db(dbName).collection(collectionName);

    injector = new Injector();
    storage = new CommitMongoDBStorage();
    commitSerializer = mock<types.CommitSerializer>();

    injector
      .bind<types.CommitSerializer>(BINDINGS.CommitSerializer)
      .toConstantValue(commitSerializer);
    injector
      .bind<Collection<any>>(BINDINGS.MongoDB.collections.Commits)
      .toConstantValue(collection);
    injector.injectInto(storage);
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  const commitId = new Guid().toString();
  const eventSourceableId = 'my-event-sourceable-id';

  describe(`adding commit`, () => {
    it(`inserts commit to MongoDB collection`, async () => {
      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = mock<types.MongoDBSerializedCommit>();
      commitSerializer.serialize.calledWith(commit).mockReturnValue(serializedCommit);

      vi.spyOn(collection, 'insertOne').mockResolvedValue({
        insertedId: commitId,
        acknowledged: true,
      });

      const result = await storage.save(commit);
      expect(result).toBe(commitId);
      expect(commitSerializer.serialize).toHaveBeenCalledTimes(1);
      expect(commitSerializer.serialize).toHaveBeenCalledWith(commit);
      expect(collection.insertOne).toHaveBeenCalledWith(serializedCommit);
    });

    it(`throws AddingCommitFailedError on unsuccessful document insertion`, async () => {
      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = mock<types.MongoDBSerializedCommit>();
      commitSerializer.serialize.calledWith(commit).mockReturnValue(serializedCommit);

      vi.spyOn(collection, 'insertOne').mockResolvedValue({ acknowledged: false, insertedId: null });

      await expect(
        storage.save(commit)
      ).rejects.toThrow(
        AddingCommitFailedError,
        `CommitMongoDBStorage: adding commit with id '${commitId.toString()}' failed on '${appId}'`
      );

      expect(collection.insertOne).toHaveBeenCalledWith(serializedCommit);
    });

    it(`throws CommitConcurrencyError on duplicated key error`, async () => {
      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = mock<types.MongoDBSerializedCommit>();
      commitSerializer.serialize.calledWith(commit).mockReturnValue(serializedCommit);

      const error = new Error('duplicate key error index');
      (error as any).code = 11000;

      vi.spyOn(collection, 'insertOne').mockRejectedValue(error);

      const query = {
        sourceId: eventSourceableId,
      };
      const options = {
        sort: { version: -1 },
        projection: {
          version: 1,
        },
      };
      vi.spyOn(collection, 'findOne').mockResolvedValue({
        version: 10,
      });

      await expect(
        storage.save(commit)
      ).rejects.toThrow(
        CommitConcurrencyError,
        `CommitMongoDBStorage.MyEventSourceable: expected event sourceable with id of '${eventSourceableId.toString()}' to be at version 0 but is at version 1`
      );

      expect(collection.insertOne).toHaveBeenCalledWith(serializedCommit);
      expect(collection.findOne).toHaveBeenCalledWith(query, options);
    });
  });

  describe(`retrieving last commit version`, () => {
    it(`returns last commit version by event sourceable's id`, async () => {
      const query = {
        sourceId: eventSourceableId,
      };
      const options = {
        sort: { version: -1 },
        projection: {
          version: 1,
        },
      };
      vi.spyOn(collection, 'findOne').mockResolvedValue({
        version: 10,
      });

      const lastCommitVersion = await storage.findLastVersionById(
        eventSourceableId
      );
      expect(lastCommitVersion).toBe(10);
      expect(collection.findOne).toHaveBeenCalledWith(query, options);
    });

    it(`returns undefined when commit cannot be found for event sourceable's`, async () => {
      vi.spyOn(collection, 'findOne').mockResolvedValue(null);

      const lastCommitVersion = await storage.findLastVersionById('my-id');
      expect(lastCommitVersion).toBe(undefined);
    });
  });

  describe(`retrieving commits`, () => {
    it('returns commit by id', async () => {
      const query = {
        _id: commitId,
      };
      const serializedCommit = mock<types.MongoDBSerializedCommit>();
      const commit = generateCommit(commitId, eventSourceableId, 1);
      vi.spyOn(collection, 'findOne').mockResolvedValue(serializedCommit);
      commitSerializer.deserialize.calledWith(serializedCommit).mockReturnValue(commit);

      const foundCommit = await storage.findById(commitId);
      expect(foundCommit).toBeInstanceOf(Commit);
      expect(foundCommit).toEqual(
        generateCommit(commitId, eventSourceableId, 1)
      );
      expect(commitSerializer.deserialize).toHaveBeenCalledTimes(1);
      expect(commitSerializer.deserialize).toHaveBeenCalledWith(
        serializedCommit
      );
      expect(collection.findOne).toHaveBeenCalledWith(query);
    });

    it(`returns undefined if commit by id can't be found`, async () => {
      const query = {
        _id: commitId,
      };
      vi.spyOn(collection, 'findOne').mockResolvedValue(null);

      const foundCommit = await storage.findById(commitId);
      expect(foundCommit).toBe(undefined);
      expect(collection.findOne).toHaveBeenCalledWith(query);
    });

    it(`returns commits by event sourcealbe's id and version offset`, async () => {
      const findResult = {
        toArray(): void {
          return undefined;
        },
      };

      const query = {
        sourceId: eventSourceableId,
        version: {
          $gte: 10,
        },
      };
      const options = {
        sort: { version: 1 },
      };
      vi.spyOn(collection, 'find').mockReturnValue(findResult);

      const firstCommitId = new Guid().toString();
      const secondCommitId = new Guid().toString();
      const firstSerializedCommit = vi.fn();
      const secondSerializedCommit = vi.fn();
      const firstCommit = generateCommit(firstCommitId, eventSourceableId, 10);
      const secondCommit = generateCommit(
        secondCommitId,
        eventSourceableId,
        11
      );

      vi.spyOn(findResult, 'toArray').mockResolvedValue([firstSerializedCommit, secondSerializedCommit]);
      commitSerializer.deserialize
        .calledWith(firstSerializedCommit)
        .mockReturnValue(firstCommit);
      commitSerializer.deserialize
        .calledWith(secondSerializedCommit)
        .mockReturnValue(secondCommit);

      const foundCommits = await storage.getCommits(eventSourceableId, 10);
      expect(foundCommits).toEqual([firstCommit, secondCommit]);
      expect(collection.find).toHaveBeenCalledWith(query, options);
    });

    it(`returns empty array when no commits can be found for version offset`, async () => {
      const findResult = {
        toArray(): void {
          return undefined;
        },
      };

      vi.spyOn(collection, 'find').mockReturnValue(findResult);

      vi.spyOn(findResult, 'toArray').mockResolvedValue([]);

      const foundCommits = await storage.getCommits(eventSourceableId, 10);
      expect(foundCommits).toEqual([]);
    });

    it(`returns all commits for every event sourceable`, async () => {
      const firstCommitId = new Guid().toString();
      const secondCommitId = new Guid().toString();
      const thirdCommitId = new Guid().toString();
      const otherEventSourceableId = 'my-other-id';

      const firstSerializedCommit = vi.fn();
      const secondSerializedCommit = vi.fn();
      const thirdSerializedCommit = vi.fn();
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

      vi.spyOn(collection, 'find').mockReturnValue(findResult);

      vi.spyOn(findResult, 'toArray').mockResolvedValue([
        firstSerializedCommit,
        secondSerializedCommit,
        thirdSerializedCommit,
      ]);
      commitSerializer.deserialize
        .calledWith(firstSerializedCommit)
        .mockReturnValue(firstCommit);
      commitSerializer.deserialize
        .calledWith(secondSerializedCommit)
        .mockReturnValue(secondCommit);
      commitSerializer.deserialize
        .calledWith(thirdSerializedCommit)
        .mockReturnValue(thirdCommit);

      const foundCommit = await storage.getAllCommits();
      expect(foundCommit).toEqual([firstCommit, secondCommit, thirdCommit]);
      expect(collection.find).toHaveBeenCalledWith({}, {});
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

      vi.spyOn(collection, 'updateOne').mockResolvedValue({
        modifiedCount: 1,
        acknowledged: true,
      });

      const result = await storage.flagCommitAsPublished(
        commitId,
        appId,
        workerId,
        now
      );
      expect(result).toBe(true);
      expect(collection.updateOne).toHaveBeenCalledWith(filter, update);
    });

    it(`throws UpdatingCommitError when commit can't be updated to published`, async () => {
      vi.spyOn(collection, 'updateOne').mockResolvedValue({ modifiedCount: 0, acknowledged: true });

      await expect(
        storage.flagCommitAsPublished(commitId, appId, workerId, now)
      ).rejects.toThrow(
        UpdatingCommitError,
        `CommitMongoDBStorage: updating commit with id '${commitId}' failed on '${appId}'`
      );
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

      vi.spyOn(collection, 'updateOne').mockResolvedValue({ modifiedCount: 1, acknowledged: true });

      const result = await storage.flagCommitAsFailed(
        commitId,
        appId,
        workerId,
        now
      );
      expect(result).toBe(true);
      expect(collection.updateOne).toHaveBeenCalledWith(filter, update);
    });

    it(`throws UpdatingCommitError when commit can't be updated to failed`, async () => {
      vi.spyOn(collection, 'updateOne').mockResolvedValue({ modifiedCount: 0, acknowledged: true });

      expect(
        storage.flagCommitAsFailed(commitId, appId, workerId, now)
      ).rejects.toThrow(
        UpdatingCommitError,
        `CommitMongoDBStorage: updating commit with id '${commitId}' failed on '${appId}'`
      );
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
      const serializedCommit = mock<types.MongoDBSerializedCommit>();

      vi.spyOn(collection, 'findOneAndUpdate').mockResolvedValue(serializedCommit);
      commitSerializer.deserialize.calledWith(serializedCommit).mockReturnValue(commit);

      const foundCommit = await storage.flagAndResolveCommitAsTimeouted(
        commitId,
        appId,
        workerId,
        now
      );
      expect(foundCommit).toBeInstanceOf(Commit);
      expect(foundCommit).toBe(commit);
      expect(collection.findOneAndUpdate).toHaveBeenCalledWith(query, update, {
        returnDocument: 'after',
      });
    });

    it(`locks commit`, async () => {
      const clock = vi.useFakeTimers(now.getTime());
      const expectedReceivedAt = new Date();

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
            receivedAt: expectedReceivedAt,
          },
        },
      };
      const options = {
        returnDocument: 'after',
      };

      const commit = generateCommit(commitId, eventSourceableId, 1);
      const serializedCommit = mock<types.MongoDBSerializedCommit>();

      vi.spyOn(collection, 'findOneAndUpdate').mockResolvedValue(serializedCommit);
      commitSerializer.deserialize.calledWith(serializedCommit).mockReturnValue(commit);

      const foundCommit = await storage.lockCommit(
        commitId,
        appId,
        workerId,
        registeredAndNotReceivedYetQuery
      );
      expect(foundCommit).toBeInstanceOf(Commit);
      expect(foundCommit).toBe(commit);

      expect(collection.findOneAndUpdate).toHaveBeenCalledWith(filter, update, options);
      vi.useRealTimers();
    });
  });
});
