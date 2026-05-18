import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import { types } from '../../../src/types';
import { InMemoryCommitObserver } from '../../../src/infrastructure/storages/commit-memory-observer';

describe('InMemoryCommitObserver', () => {
  let observer: InMemoryCommitObserver;
  let commitPublisher: types.CommitPublisher;

  beforeEach(() => {
    observer = new InMemoryCommitObserver();
    commitPublisher = mock<types.CommitPublisher>();
  });

  describe('startObserving', () => {
    it('sets observing state to true', async () => {
      expect(observer.isObserving()).toBe(false);
      await observer.startObserving(commitPublisher);
      expect(observer.isObserving()).toBe(true);
    });
  });

  describe('stopObserving', () => {
    it('sets observing state to false', async () => {
      await observer.startObserving(commitPublisher);
      expect(observer.isObserving()).toBe(true);

      await observer.stopObserving();
      expect(observer.isObserving()).toBe(false);
    });
  });

  describe('pauseObserving', () => {
    it('sets observing state to false', async () => {
      await observer.startObserving(commitPublisher);
      expect(observer.isObserving()).toBe(true);

      await observer.pauseObserving();
      expect(observer.isObserving()).toBe(false);
    });
  });

  describe('isObserving', () => {
    it('returns false by default', () => {
      expect(observer.isObserving()).toBe(false);
    });

    it('returns true after startObserving', async () => {
      await observer.startObserving(commitPublisher);
      expect(observer.isObserving()).toBe(true);
    });
  });
});
