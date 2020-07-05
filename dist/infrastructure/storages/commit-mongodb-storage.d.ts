import { Collection, InsertOneWriteOpResult, UpdateWriteOpResult, FindOneOptions, FilterQuery, UpdateQuery, FindOneAndUpdateOption, FindAndModifyWriteOpResultObject } from 'mongodb';
import { types } from '../../types';
import { Guid } from '../../domain/value-objects/guid';
export declare class CommitMongoDBStorage implements types.CommitStorage {
    protected collection: Collection;
    protected commitSerializer: types.CommitSerializer;
    save(commit: types.Commit): Promise<string>;
    generateId(): Promise<string>;
    findLastVersionById(eventSourceableId: string | Guid): Promise<number | undefined>;
    findById(commitId: string): Promise<types.Commit | undefined>;
    getCommits(eventSourceableId: string | types.Stringifiable, versionOffset: number): Promise<types.Commit[]>;
    getAllCommits(): Promise<types.Commit[]>;
    flagCommitAsPublished(commitId: string, appId: string, workerId: string, publishedAt: Date): Promise<boolean>;
    flagCommitAsFailed(commitId: string, appId: string, workerId: string, failedAt: Date): Promise<boolean>;
    flagAndResolveCommitAsTimeouted(commitId: string, appId: string, workerId: string, failedAt: Date): Promise<types.Commit | undefined>;
    lockCommit(commitId: string, appId: string, workerId: string, registeredAndNotReceivedYetFilter: Record<string, any>): Promise<types.Commit | undefined>;
    protected findAndReturnDeserializedCommits(query?: FilterQuery<any>, options?: FindOneOptions): Promise<types.Commit[]>;
    protected findCommits(query?: FilterQuery<any>, options?: FindOneOptions): Promise<Record<string, any>[]>;
    protected updateOne(filter?: FilterQuery<any>, update?: UpdateQuery<any>): Promise<boolean>;
    findOneAndUpdate(filter?: FilterQuery<any>, update?: UpdateQuery<any>, options?: FindOneAndUpdateOption): Promise<types.Commit | undefined>;
    protected isSuccessfulInsert(output: InsertOneWriteOpResult<any>, expectedNumber: number): boolean;
    protected isSuccessfulUpdate(output: UpdateWriteOpResult | FindAndModifyWriteOpResultObject<any>, expectedNumber: number): boolean;
    protected getExpectedVersionOnStorage(commit: types.Commit): number;
}
