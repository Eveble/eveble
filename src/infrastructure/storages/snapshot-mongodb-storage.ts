import { inject, injectable } from '@parisholley/inversify-async';
import {
  Collection,
  UpdateWriteOpResult,
  InsertOneWriteOpResult,
  FilterQuery,
  UpdateQuery,
} from 'mongodb';
import { get } from 'lodash';
import {
  AddingSnapshotError,
  UpdatingSnapshotError,
} from '../infrastructure-errors';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { Guid } from '../../domain/value-objects/guid';

@injectable()
export class SnapshotMongoDBStorage implements types.SnapshotStorage {
  @inject(BINDINGS.MongoDB.collections.Snapshots)
  protected collection: Collection;

  @inject(BINDINGS.SnapshotSerializer)
  protected esSerializer: types.SnapshotSerializer;

  /**
   * Adds new snapshot as serialized version of `EventSourceable` instance to `MongoDB` snapshots collection.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @returns Identifier for document(as Snapshot's id) on MongoDB collection.
   */
  public async addSnapshot(
    eventSourceable: types.EventSourceable
  ): Promise<string> {
    const eventSourceableId = eventSourceable.getId().toString();
    const serializedEventSourceable = this.esSerializer.serialize(
      eventSourceable
    );

    const doc = {
      _id: eventSourceableId,
      snapshot: serializedEventSourceable,
    };
    const output = await this.collection.insertOne(doc);
    if (!this.isSuccessfulInsert(output, 1)) {
      throw new AddingSnapshotError(
        this.constructor.name,
        eventSourceable.getTypeName(),
        eventSourceable.getId().toString()
      );
    }
    return output.insertedId;
  }

  /**
   * Updates `EventSourceable` snapshot on z snapshots collection.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @returns Returns `true` if snapshot update was successful, else throws.
   * @throws {UpdatingSnapshotError}
   * Thrown if update operation on MongoDB is not successful.
   */
  public async updateSnapshot(
    eventSourceable: types.EventSourceable
  ): Promise<boolean> {
    const filter = { _id: eventSourceable.getId().toString() };
    const update = {
      $set: { snapshot: this.esSerializer.serialize(eventSourceable) },
    };

    const isSuccessful = await this.updateOne(filter, update);
    if (!isSuccessful) {
      throw new UpdatingSnapshotError(
        this.constructor.name,
        eventSourceable.getTypeName(),
        eventSourceable.getId().toString()
      );
    }
    return true;
  }

  /**
   * Returns snapshot from Mongo snapshots collection by id if exists.
   * @async
   * @param EventSourceableType - Event sourceable type(constructor).
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @returns Instance as a snapshot implementing `EventSourceable` interface, else `undefined`.
   */
  public async getSnapshotById(
    EventSourceableType: types.EventSourceableType, // Can be skipped since were using EJSON serializer
    eventSourceableId: string | Guid
  ): Promise<types.EventSourceable | undefined> {
    const query = { _id: eventSourceableId.toString() };
    const foundSerializedSnapshot = await this.collection.findOne(query);
    if (foundSerializedSnapshot) {
      return this.esSerializer.deserialize(
        EventSourceableType,
        foundSerializedSnapshot.snapshot
      );
    }
    return undefined;
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
    output: UpdateWriteOpResult,
    expectedNumber: number
  ): boolean {
    const didUpdateOne = get(output, 'result.nModified') === expectedNumber;
    const didFindAndUpdatedOne =
      get(output, 'lastErrorObject.n') === expectedNumber;
    return didUpdateOne || didFindAndUpdatedOne;
  }
}
