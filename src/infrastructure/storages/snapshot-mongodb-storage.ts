import { inject, injectable } from 'inversify';
import {
  Collection,
  UpdateResult,
  InsertOneResult,
  Filter,
  UpdateFilter,
} from 'mongodb';
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
  protected snapshotSerializer: types.SnapshotSerializer;

  /**
   * Adds new snapshot as serialized version of `EventSourceable` instance to `MongoDB` snapshots collection.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @returns Identifier for document(as Snapshot's id) on MongoDB collection.
   */
  public async save(eventSourceable: types.EventSourceable): Promise<string> {
    const snapshot = this.snapshotSerializer.serialize(eventSourceable);
    const output = await this.collection.insertOne(snapshot);
    if (!this.isSuccessfulInsert(output, 1)) {
      throw new AddingSnapshotError(
        this.constructor.name,
        eventSourceable.getTypeName(),
        eventSourceable.getId().toString()
      );
    }
    return output.insertedId.toString();
  }

  /**
   * Updates `EventSourceable` snapshot on the snapshots collection.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @returns Returns `true` if snapshot update was successful, else throws.
   * @throws {UpdatingSnapshotError}
   * Thrown if update operation on MongoDB is not successful.
   */
  public async update(
    eventSourceable: types.EventSourceable
  ): Promise<boolean> {
    const filter = { _id: eventSourceable.getId().toString() } as Filter<any>;
    const snapshot = this.snapshotSerializer.serialize(eventSourceable);
    const update = {
      $set: { snapshot: snapshot.snapshot },
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
  public async findById(
    EventSourceableType: types.EventSourceableType, // Can be skipped since were using EJSON serializer
    eventSourceableId: string | Guid
  ): Promise<types.EventSourceable | undefined> {
    const query = { _id: eventSourceableId.toString() } as Filter<any>;
    const foundSerializedSnapshot = await this.collection.findOne(query);
    if (foundSerializedSnapshot) {
      return this.snapshotSerializer.deserialize(
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
    filter: Filter<any> = {},
    update: UpdateFilter<any> = {}
  ): Promise<boolean> {
    const output = await this.collection.updateOne(filter, update);
    if (output !== undefined && this.isSuccessfulUpdate(output, 1)) {
      return true;
    }

    return false;
  }

  /**
   * Evaluates if output of insert operation is successful.
   * @param output - Output response from MongoDB as an object implementing `InsertOneResult`.
   * @param expectedNumber - The number of expected inserted documents to MongoDB collection.
   * @returns Returns `true` if insert operation was successful, else `false`.
   */
  protected isSuccessfulInsert(
    output: InsertOneResult<any>,
    _expectedNumber: number
  ): boolean {
    return output.acknowledged && output.insertedId !== null;
  }

  /**
   * Evaluates if output of update operation is successful.
   * @param output - Output response from MongoDB as an object implementing `UpdateResult`.
   * @param expectedNumber - The number of expected updated documents to MongoDB collection.
   * @returns Returns `true` if update operation was successful, else `false`.
   */
  protected isSuccessfulUpdate(
    output: UpdateResult,
    expectedNumber: number
  ): boolean {
    return output.modifiedCount === expectedNumber;
  }
}
