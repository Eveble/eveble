import { Collection, UpdateWriteOpResult, InsertOneWriteOpResult, FilterQuery, UpdateQuery } from 'mongodb';
import { types } from '../../types';
import { Guid } from '../../domain/value-objects/guid';
export declare class SnapshotMongoDBStorage implements types.SnapshotStorage {
    protected collection: Collection;
    protected snapshotSerializer: types.SnapshotSerializer;
    save(eventSourceable: types.EventSourceable): Promise<string>;
    update(eventSourceable: types.EventSourceable): Promise<boolean>;
    findById(EventSourceableType: types.EventSourceableType, eventSourceableId: string | Guid): Promise<types.EventSourceable | undefined>;
    protected updateOne(filter?: FilterQuery<any>, update?: UpdateQuery<any>): Promise<boolean>;
    protected isSuccessfulInsert(output: InsertOneWriteOpResult<any>, expectedNumber: number): boolean;
    protected isSuccessfulUpdate(output: UpdateWriteOpResult, expectedNumber: number): boolean;
}
