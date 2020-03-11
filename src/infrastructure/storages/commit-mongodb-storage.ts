import { inject, injectable } from '@parisholley/inversify-async';
import {
  Collection,
  InsertOneWriteOpResult,
  UpdateWriteOpResult,
  FindOneOptions,
  FilterQuery,
  UpdateQuery,
  FindOneAndUpdateOption,
  FindAndModifyWriteOpResultObject,
} from 'mongodb';
import { get } from 'lodash';
import { types } from '../../types';
import {
  CommitConcurrencyError,
  AddingCommitFailedError,
  UpdatingCommitError,
} from '../infrastructure-errors';
import { BINDINGS } from '../../constants/bindings';
import { Guid } from '../../domain/value-objects/guid';

@injectable()
export class CommitMongoDBStorage implements types.CommitStorage {
  @inject(BINDINGS.MongoDB.collections.Commits)
  protected collection: Collection;

  @inject(BINDINGS.CommitSerializer)
  protected commitSerializer: types.CommitSerializer;

  /**
   * Adds commit to MongoDB collection.
   * @async
   * @param commit - Instance implementing `Commit` interface.
   * @returns Identifier for document(as Commit's id) on MongoDB collection.
   * @throws {CommitConcurrencyError}
   * Thrown if commit with same id already exists on MongoDB collection.
   * @throws {AddingCommitFailedError}
   * Thrown if commit with same id already exists on MongoDB collection.
   */
  async addCommit(commit: types.Commit): Promise<string> {
    const serializedCommit = this.commitSerializer.serialize(commit);
    let output: InsertOneWriteOpResult<any>;
    try {
      output = await this.collection.insertOne(serializedCommit);
    } catch (error) {
      // Duplicate key error index
      if (error.code === 11000) {
        const foundDuplicatedVersion = (await this.getLastCommitVersionById(
          commit.sourceId
        )) as number;

        throw new CommitConcurrencyError(
          commit.changes.eventSourceableType,
          commit.sourceId,
          this.getExpectedVersionOnStorage(commit).toString(),
          foundDuplicatedVersion.toString()
        );
      } else {
        throw error;
      }
    }

    if (!this.isSuccessfulInsert(output, 1)) {
      throw new AddingCommitFailedError(
        this.constructor.name,
        commit.id,
        commit.sentBy
      );
    }
    return output.insertedId;
  }

  /**
   * Generates commit's id.
   * @return Identifier for `Commit` compatible with MongoDB.
   */
  public async generateCommitId(): Promise<string> {
    return new Guid().toString();
  }

  /**
   * Returns last version of commit by event sourceable's id from MongoDB collection.
   * @async
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @returns Last commit version as number, else `undefined`.
   */
  public async getLastCommitVersionById(
    eventSourceableId: string | Guid
  ): Promise<number | undefined> {
    const query = { sourceId: eventSourceableId.toString() };
    const sort = {
      sort: [['version', 'desc']],
      projection: { version: 1 },
    };

    const foundSerializedCommit = await this.collection.findOne(query, sort);

    if (foundSerializedCommit != null) {
      return foundSerializedCommit.version;
    }
    return undefined;
  }

  /**
   * Returns commit by id from MongoDB collection.
   * @param commitId - Identifier of `Commit`.
   * @returns Instance implementing `Commit` interface, else `undefined`.
   */
  public async getCommitById(
    commitId: string
  ): Promise<types.Commit | undefined> {
    const query = {
      _id: commitId,
    };

    const foundSerializedCommit = await this.collection.findOne(query);
    if (foundSerializedCommit != null) {
      return this.commitSerializer.deserialize(foundSerializedCommit);
    }
    return undefined;
  }

  /**
   * Returns commit from MongoDB collection if exists by event sourceable's id for specific version offset.
   * @async
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @param versionOffset - Version number from which version events should be returned.
   * @return List of instances implementing `Commit` interface.
   */
  public async getCommits(
    eventSourceableId: string | types.Stringifiable,
    versionOffset: number
  ): Promise<types.Commit[]> {
    const query = {
      sourceId: eventSourceableId.toString(),
      version: { $gte: versionOffset },
    };
    const options = { sort: [['version', 'asc']] };

    return this.findAndReturnDeserializedCommits(query, options);
  }

  /**
   * Returns all commits from MongoDB collection.
   * @async
   * @return List of instances implementing `Commit` interface.
   */
  public async getAllCommits(): Promise<types.Commit[]> {
    return this.findAndReturnDeserializedCommits();
  }

  /**
   * Flags commit as published on MongoDB collection.
   * @async
   * @param commitId - Identifier for Commit that should be locked.
   * @param appId - Application identifer on which commit is published.
   * @param workerId - Worker identifer on which commit is published.
   * @param publishedAt - Date of commit publication.
   * @returns Returns `true` if commit was flagged successfully, else `false`.
   * @throws {UpdatingCommitError}
   * Thrown if update operation on MongoDB is not successful.
   */
  public async flagCommitAsPublished(
    commitId: string,
    appId: string,
    workerId: string,
    publishedAt: Date
  ): Promise<boolean> {
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
        'receivers.$.publishedAt': publishedAt,
        'receivers.$.state': 'published',
        'receivers.$.workerId': workerId,
      },
    };
    const isSuccessful = await this.updateOne(filter, update);
    if (!isSuccessful) {
      throw new UpdatingCommitError(this.constructor.name, commitId, appId);
    }
    return true;
  }

  /**
   * Flags commit as failed on MongoDB collection.
   * @async
   * @param commitId - Identifier for Commit that should be locked.
   * @param appId - Application identifer on which commit failed.
   * @param workerId - Worker identifer on which commit failed.
   * @param failedAt - Date of commit processing fail.
   * @returns Returns `true` if commit was flagged successfully, else `false`.
   * @throws {UpdatingCommitError}
   * Thrown if update operation on MongoDB is not successful.
   */
  public async flagCommitAsFailed(
    commitId: string,
    appId: string,
    workerId: string,
    failedAt: Date
  ): Promise<boolean> {
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
        'receivers.$.failedAt': failedAt,
        'receivers.$.state': 'failed',
        'receivers.$.workerId': workerId,
      },
    };
    const isSuccessful = await this.updateOne(filter, update);
    if (!isSuccessful) {
      throw new UpdatingCommitError(this.constructor.name, commitId, appId);
    }
    return true;
  }

  /**
   * Flags commit as timeouted on MongoDB collection.
   * @async
   * @param commitId - Identifier for Commit that should be locked.
   * @param appId - Application identifer on which commit timeouted.
   * @param workerId - Worker identifer on which commit timeouted.
   * @param failedAt - Date of commit processing timeout.
   * @returns Instance implementing `Commit` interface, else `undefined`.
   */
  public async flagAndResolveCommitAsTimeouted(
    commitId: string,
    appId: string,
    workerId: string,
    failedAt: Date
  ): Promise<types.Commit | undefined> {
    const filter = {
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
        'receivers.$.failedAt': failedAt,
        'receivers.$.state': 'timeouted',
        'receivers.$.workerId': workerId,
      },
    };

    return this.findOneAndUpdate(filter, update);
  }

  /**
   * Locks(changes state to received) commit on MongoDB and publishes it through CommitPublisher
   * @async
   * @param commitId - Identifier for Commit that should be locked.
   * @param appId - Application identifer that is handling(locking) Commit.
   * @param workerId - Worker identifer that is handling(locking) Commit.
   * @param registeredAndNotReceivedYetFilter - Filter for MongoDB query argument which selects only commits that
   * have not been yet received by current application.
   * @returns Instance implementing `Commit` interface, else `undefined`.
   */
  public async lockCommit(
    commitId: string,
    appId: string,
    workerId: string,
    registeredAndNotReceivedYetFilter: Record<string, any>
  ): Promise<types.Commit | undefined> {
    // Find and lock the event, so only one app instance publishes it
    const filter: Record<string, any> = {
      $and: [{ _id: commitId }, registeredAndNotReceivedYetFilter],
    };
    const update: Record<string, any> = {
      $push: {
        receivers: {
          state: 'received',
          appId,
          workerId,
          receivedAt: new Date(),
        },
      },
    };
    const options = {
      returnOriginal: false,
    };
    return this.findOneAndUpdate(filter, update, options);
  }

  /**
   * Finds and returns deserialized form MongoDB collection.
   * @async
   * @param query - The cursor query object.
   * @param options - Optional settings
   * @return List of instances implementing `Commit` interface.
   */
  protected async findAndReturnDeserializedCommits(
    query: FilterQuery<any> = {},
    options: FindOneOptions = {}
  ): Promise<types.Commit[]> {
    const foundSerializedCommits = await this.findCommits(query, options);

    const commits: types.Commit[] = [];
    for (const serializedCommit of foundSerializedCommits) {
      commits.push(this.commitSerializer.deserialize(serializedCommit));
    }
    return commits;
  }

  /**
   * Finds commits on MongoDB collection by query and options.
   * @async
   * @param query - The cursor query object.
   * @param options - Optional settings
   * @return Returned serialized commits from MongoDB collection.
   */
  protected async findCommits(
    query: FilterQuery<any> = {},
    options: FindOneOptions = {}
  ): Promise<Record<string, any>[]> {
    const cursor = await this.collection.find(query, options);
    const foundSerializedCommits = await cursor.toArray();
    return foundSerializedCommits;
  }

  /**
   * Updates document on MongoDB collection.
   * @async
   * @param filter - The filter used to select the document for update operation.
   * @param update - The update operations to be applied to the document.
   * @returns Returns `true` if update operation was successful, else `false`.
   */
  protected async updateOne(
    filter: FilterQuery<any> = {},
    update: UpdateQuery<any> = {}
  ): Promise<boolean> {
    const output = await this.collection.updateOne(filter, update);
    if (output !== undefined && this.isSuccessfulUpdate(output, 1)) {
      return true;
    }

    return false;
  }

  /**
   * Find one document and updates it on MongoDB collection.
   * @async
   * @param filter - The Filter used to select the document to update
   * @param update - The update operations to be applied to the document
   * @param options - Optional settings
   * @returns Updated instance implementing `Commit` interface, else `undefined`.
   */
  async findOneAndUpdate(
    filter: FilterQuery<any> = {},
    update: UpdateQuery<any> = {},
    options: FindOneAndUpdateOption = {
      returnOriginal: false,
    }
  ): Promise<types.Commit | undefined> {
    const output = await this.collection.findOneAndUpdate(
      filter,
      update,
      options
    );

    if (output !== undefined && this.isSuccessfulUpdate(output, 1)) {
      const foundSerializedCommit = output.value;
      return this.commitSerializer.deserialize(foundSerializedCommit);
    }
    return undefined;
  }

  /**
   * Evaluates if output of insert operation is successful.
   * @param output - Output response from MongoDB as an object implementing `InsertOneWriteOpResult`.
   * @param expectedNumber - The number of expected inserted documents to MongoDB collection.
   * @returns Returns `true` if insert operation was successful, else `false`.
   */
  protected isSuccessfulInsert(
    output: InsertOneWriteOpResult<any>,
    expectedNumber: number
  ): boolean {
    return output.insertedCount === expectedNumber;
  }

  /**
   * Evaluates if output of update operation is successful.
   * @param output - Output response from MongoDB as an object implementing `UpdateWriteOpResult`.
   * @param expectedNumber - The number of expected updated documents to MongoDB collection.
   * @returns Returns `true` if update operation was successful, else `false`.
   */
  protected isSuccessfulUpdate(
    output: UpdateWriteOpResult | FindAndModifyWriteOpResultObject<any>,
    expectedNumber: number
  ): boolean {
    const didUpdateOne = get(output, 'result.nModified') === expectedNumber;
    const didFindAndUpdatedOne =
      get(output, 'lastErrorObject.n') === expectedNumber;
    return didUpdateOne || didFindAndUpdatedOne;
  }

  /**
   * Returns expected version of commit that should be resolved from storage
   * before adding new commit version(this instance).
   * @param commit - Instance implementing `Commit` interface.
   * @return Expected version as number.
   */
  protected getExpectedVersionOnStorage(commit: types.Commit): number {
    const decremented = commit.version - 1;
    return decremented === 0 ? 0 : decremented;
  }
}
