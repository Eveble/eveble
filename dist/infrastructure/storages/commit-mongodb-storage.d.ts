import { Collection, InsertOneResult, UpdateResult, FindOptions, Filter, UpdateFilter, FindOneAndUpdateOptions, ModifyResult } from 'mongodb';
import { types } from '../../types';
import { Guid } from '../../domain/value-objects/guid';
export declare class CommitMongoDBStorage implements types.CommitStorage {
    protected collection: Collection;
    protected commitSerializer: types.CommitSerializer;
    save(commit: types.Commit): Promise<string>;
    generateId(): Promise<string>;
    findLastVersionById(eventSourceableId: string | Guid): Promise<number | undefined>;
    findById(commitId: string): Promise<types.Commit | undefined>;
    hasBySourceId(eventSourceableId: string | Guid): Promise<boolean>;
    getCommits(eventSourceableId: string | types.Stringifiable, versionOffset: number): Promise<types.Commit[]>;
    getAllCommits(): Promise<types.Commit[]>;
    flagCommitAsPublished(commitId: string, appId: string, workerId: string, publishedAt: Date): Promise<boolean>;
    flagCommitAsFailed(commitId: string, appId: string, workerId: string, failedAt: Date): Promise<boolean>;
    flagAndResolveCommitAsTimeouted(commitId: string, appId: string, workerId: string, failedAt: Date): Promise<types.Commit | undefined>;
    lockCommit(commitId: string, appId: string, workerId: string, registeredAndNotReceivedYetFilter: Record<string, any>): Promise<types.Commit | undefined>;
    protected findAndReturnDeserializedCommits(query?: Filter<any>, options?: FindOptions<any>): Promise<types.Commit[]>;
    protected findCommits(query?: Filter<any>, options?: FindOptions<any>): Promise<Record<string, any>[]>;
    protected updateOne(filter?: Filter<any>, update?: UpdateFilter<any>): Promise<boolean>;
    findOneAndUpdate(filter?: Filter<any>, update?: UpdateFilter<any>, options?: FindOneAndUpdateOptions): Promise<types.Commit | undefined>;
    protected isSuccessfulInsert(output: InsertOneResult<any>, _expectedNumber: number): boolean;
    protected isSuccessfulUpdate(output: UpdateResult | ModifyResult<any>, expectedNumber: number): boolean;
    protected getExpectedVersionOnStorage(commit: types.Commit): number;
}
