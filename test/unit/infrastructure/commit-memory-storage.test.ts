import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import { Type } from '@eveble/core';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import {
  CommitReceiver,
  Commit,
} from '../../../src/infrastructure/structs/commit';
import { Guid } from '../../../src/domain/value-objects/guid';
import { types } from '../../../src/types';
import { InMemoryCommitStorage } from '../../../src/infrastructure/storages/commit-memory-storage';
import { CommitConcurrencyError } from '../../../src/infrastructure/infrastructure-errors';

describe('InMemoryCommitStorage', () => {
  @Type('InMemoryCommitStorage.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @Type('InMemoryCommitStorage.MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    name: string;
  }

  const now = new Date();
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  let storage: InMemoryCommitStorage;

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
      eventSourceableType: 'InMemoryCommitStorage.MyEventSourceable',
      events: [event],
      commands: [command],
      insertedAt: now,
      sentBy: appId,
      receivers: [receiver],
    });
  };

  beforeEach(() => {
    storage = new InMemoryCommitStorage();
  });

  describe('save', () => {
    it('saves a commit and returns its id', async () => {
      const commit = generateCommit('commit-1', 'source-1', 1);
      const id = await storage.save(commit);
      expect(id).toBe('commit-1');
    });

    it('throws CommitConcurrencyError when saving duplicate sourceId + version', async () => {
      const commit1 = generateCommit('commit-1', 'source-1', 1);
      const commit2 = generateCommit('commit-2', 'source-1', 1);

      await storage.save(commit1);
      await expect(storage.save(commit2)).rejects.toThrow(
        CommitConcurrencyError
      );
    });

    it('allows saving different versions of same source id', async () => {
      const commit1 = generateCommit('commit-1', 'source-1', 1);
      const commit2 = generateCommit('commit-2', 'source-1', 2);

      await storage.save(commit1);
      await expect(storage.save(commit2)).resolves.toBe('commit-2');
    });
  });

  describe('findLastVersionById', () => {
    it('returns undefined when no commits exist for source id', async () => {
      const version = await storage.findLastVersionById('non-existent');
      expect(version).toBeUndefined();
    });

    it('returns the highest version for a source id', async () => {
      await storage.save(generateCommit('c1', 'source-1', 1));
      await storage.save(generateCommit('c2', 'source-1', 2));
      await storage.save(generateCommit('c3', 'source-1', 3));

      const version = await storage.findLastVersionById('source-1');
      expect(version).toBe(3);
    });
  });

  describe('generateId', () => {
    it('generates a valid guid', async () => {
      const id = await storage.generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('findById', () => {
    it('returns undefined when commit id does not exist', async () => {
      const found = await storage.findById('non-existent');
      expect(found).toBeUndefined();
    });

    it('returns the commit when it exists', async () => {
      const commit = generateCommit('commit-1', 'source-1', 1);
      await storage.save(commit);

      const found = await storage.findById('commit-1');
      expect(found).toBeDefined();
      expect(found!.id).toBe('commit-1');
      expect(found!.version).toBe(1);
    });
  });

  describe('hasBySourceId', () => {
    it('returns false when no commits exist for source id', async () => {
      const exists = await storage.hasBySourceId('non-existent');
      expect(exists).toBe(false);
    });

    it('returns true when commits exist for source id', async () => {
      await storage.save(generateCommit('c1', 'source-1', 1));
      const exists = await storage.hasBySourceId('source-1');
      expect(exists).toBe(true);
    });
  });

  describe('getCommits', () => {
    it('returns empty array when no commits exist', async () => {
      const commits = await storage.getCommits('source-1', 1);
      expect(commits).toEqual([]);
    });

    it('returns commits with version >= offset', async () => {
      await storage.save(generateCommit('c1', 'source-1', 1));
      await storage.save(generateCommit('c2', 'source-1', 2));
      await storage.save(generateCommit('c3', 'source-1', 3));

      const commits = await storage.getCommits('source-1', 2);
      expect(commits).toHaveLength(2);
      expect(commits[0].version).toBe(2);
      expect(commits[1].version).toBe(3);
    });

    it('returns commits sorted by version ascending', async () => {
      await storage.save(generateCommit('c3', 'source-1', 3));
      await storage.save(generateCommit('c1', 'source-1', 1));
      await storage.save(generateCommit('c2', 'source-1', 2));

      const commits = await storage.getCommits('source-1', 1);
      expect(commits).toHaveLength(3);
      expect(commits[0].version).toBe(1);
      expect(commits[1].version).toBe(2);
      expect(commits[2].version).toBe(3);
    });
  });

  describe('getAllCommits', () => {
    it('returns all commits from all sources', async () => {
      await storage.save(generateCommit('c1', 'source-1', 1));
      await storage.save(generateCommit('c2', 'source-2', 1));
      await storage.save(generateCommit('c3', 'source-1', 2));

      const commits = await storage.getAllCommits();
      expect(commits).toHaveLength(3);
    });
  });

  describe('flagCommitAsPublished', () => {
    it('flags receiver as published', async () => {
      const commit = generateCommit('commit-1', 'source-1', 1);
      await storage.save(commit);

      const result = await storage.flagCommitAsPublished(
        'commit-1',
        appId,
        workerId,
        new Date()
      );
      expect(result).toBe(true);

      const found = await storage.findById('commit-1');
      const receiver = found!.getReceiver(appId);
      expect(receiver!.isInState('published')).toBe(true);
    });

    it('returns false when commit does not exist', async () => {
      const result = await storage.flagCommitAsPublished(
        'non-existent',
        appId,
        workerId,
        new Date()
      );
      expect(result).toBe(false);
    });
  });

  describe('flagCommitAsFailed', () => {
    it('flags receiver as failed', async () => {
      const commit = generateCommit('commit-1', 'source-1', 1);
      await storage.save(commit);

      const result = await storage.flagCommitAsFailed(
        'commit-1',
        appId,
        workerId,
        new Date()
      );
      expect(result).toBe(true);

      const found = await storage.findById('commit-1');
      const receiver = found!.getReceiver(appId);
      expect(receiver!.isInState('failed')).toBe(true);
    });
  });

  describe('flagAndResolveCommitAsTimeouted', () => {
    it('flags receiver as timeouted and returns commit', async () => {
      const commit = generateCommit('commit-1', 'source-1', 1);
      await storage.save(commit);

      const result = await storage.flagAndResolveCommitAsTimeouted(
        'commit-1',
        appId,
        workerId,
        new Date()
      );
      expect(result).toBeDefined();
      expect(result!.id).toBe('commit-1');

      const receiver = result!.getReceiver(appId);
      expect(receiver!.isInState('timeouted')).toBe(true);
    });

    it('returns undefined when commit does not exist', async () => {
      const result = await storage.flagAndResolveCommitAsTimeouted(
        'non-existent',
        appId,
        workerId,
        new Date()
      );
      expect(result).toBeUndefined();
    });
  });

  describe('lockCommit', () => {
    it('locks commit by adding a new receiver', async () => {
      const otherAppId = 'other-app-id';
      const commit = generateCommit('commit-1', 'source-1', 1);
      await storage.save(commit);

      const filter = {
        $or: [],
        $and: [],
      };
      const result = await storage.lockCommit(
        'commit-1',
        otherAppId,
        workerId,
        filter
      );
      expect(result).toBeDefined();
      expect(result!.getReceiver(otherAppId)).toBeDefined();
    });

    it('returns undefined if commit already has receiver for appId', async () => {
      const commit = generateCommit('commit-1', 'source-1', 1);
      await storage.save(commit);

      const filter = { $or: [], $and: [] };
      const result = await storage.lockCommit(
        'commit-1',
        appId,
        workerId,
        filter
      );
      expect(result).toBeUndefined();
    });
  });
});
