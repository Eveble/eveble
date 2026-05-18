import { injectable } from 'inversify';
import { types } from '../../types';
import { CommitConcurrencyError } from '../infrastructure-errors';
import { Commit, CommitReceiver } from '../structs/commit';
import { Guid } from '../../domain/value-objects/guid';

@injectable()
export class InMemoryCommitStorage implements types.CommitStorage {
  protected commits: Map<string, Map<number, types.Commit>>;

  protected commitIds: Map<string, string>;

  constructor() {
    this.commits = new Map();
    this.commitIds = new Map();
  }

  async save(commit: types.Commit): Promise<string> {
    const sourceId = commit.sourceId.toString();
    const version = commit.version;

    let versionMap = this.commits.get(sourceId);
    if (versionMap === undefined) {
      versionMap = new Map();
      this.commits.set(sourceId, versionMap);
    }

    if (versionMap.has(version)) {
      const lastVersion = await this.findLastVersionById(sourceId);
      throw new CommitConcurrencyError(
        commit.eventSourceableType,
        sourceId,
        version.toString(),
        (lastVersion ?? 0).toString()
      );
    }

    versionMap.set(version, commit);
    this.commitIds.set(commit.id, sourceId);
    return commit.id;
  }

  async findLastVersionById(
    eventSourceableId: string | types.Stringifiable
  ): Promise<number | undefined> {
    const sourceId = eventSourceableId.toString();
    const versionMap = this.commits.get(sourceId);
    if (versionMap === undefined || versionMap.size === 0) {
      return undefined;
    }
    let maxVersion = -1;
    for (const ver of versionMap.keys()) {
      if (ver > maxVersion) {
        maxVersion = ver;
      }
    }
    return maxVersion;
  }

  async generateId(): Promise<string> {
    return new Guid().toString();
  }

  async findById(commitId: string): Promise<types.Commit | undefined> {
    const sourceId = this.commitIds.get(commitId);
    if (sourceId === undefined) return undefined;

    const versionMap = this.commits.get(sourceId);
    if (versionMap === undefined) return undefined;

    for (const commit of versionMap.values()) {
      if (commit.id === commitId) return commit;
    }
    return undefined;
  }

  async hasBySourceId(
    eventSourceableId: string | types.Stringifiable
  ): Promise<boolean> {
    const sourceId = eventSourceableId.toString();
    const versionMap = this.commits.get(sourceId);
    return versionMap !== undefined && versionMap.size > 0;
  }

  async getCommits(
    eventSourceableId: string | types.Stringifiable,
    versionOffset: number
  ): Promise<types.Commit[]> {
    const sourceId = eventSourceableId.toString();
    const versionMap = this.commits.get(sourceId);
    if (versionMap === undefined) return [];

    const result: types.Commit[] = [];
    for (const [ver, commit] of versionMap.entries()) {
      if (ver >= versionOffset) {
        result.push(commit);
      }
    }
    result.sort((a, b) => a.version - b.version);
    return result;
  }

  async getAllCommits(): Promise<types.Commit[]> {
    const result: types.Commit[] = [];
    for (const versionMap of this.commits.values()) {
      for (const commit of versionMap.values()) {
        result.push(commit);
      }
    }
    result.sort((a, b) => a.version - b.version);
    return result;
  }

  async flagCommitAsPublished(
    commitId: string,
    appId: string,
    workerId: string,
    publishedAt: Date
  ): Promise<boolean> {
    const commit = await this.findById(commitId);
    if (commit === undefined) return false;

    const receiver = commit.getReceiver(appId);
    if (receiver === undefined) return false;

    receiver.flagAsPublished(workerId);
    return true;
  }

  async flagCommitAsFailed(
    commitId: string,
    appId: string,
    workerId: string,
    failedAt: Date
  ): Promise<boolean> {
    const commit = await this.findById(commitId);
    if (commit === undefined) return false;

    const receiver = commit.getReceiver(appId);
    if (receiver === undefined) return false;

    receiver.flagAsFailed(workerId);
    return true;
  }

  async flagAndResolveCommitAsTimeouted(
    commitId: string,
    appId: string,
    workerId: string,
    failedAt: Date
  ): Promise<types.Commit | undefined> {
    const commit = await this.findById(commitId);
    if (commit === undefined) return undefined;

    const receiver = commit.getReceiver(appId);
    if (receiver === undefined) return undefined;

    if (receiver.publishedAt !== undefined) return undefined;

    receiver.flagAsTimeouted(workerId);
    return commit;
  }

  async lockCommit(
    commitId: string,
    appId: string,
    workerId: string,
    registeredAndNotReceivedYetFilter: Record<string, any>
  ): Promise<types.Commit | undefined> {
    const commit = await this.findById(commitId);
    if (commit === undefined) return undefined;

    const existingReceiver = commit.getReceiver(appId);
    if (existingReceiver !== undefined) return undefined;

    const receiver = new CommitReceiver({
      state: 'received',
      appId,
      workerId,
      receivedAt: new Date(),
    });
    commit.addReceiver(receiver);
    return commit;
  }
}
