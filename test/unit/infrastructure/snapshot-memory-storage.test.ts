import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import { types } from '../../../src/types';
import { InMemorySnapshotStorage } from '../../../src/infrastructure/storages/snapshot-memory-storage';
import { Guid } from '../../../src/domain/value-objects/guid';

describe('InMemorySnapshotStorage', () => {
  let storage: InMemorySnapshotStorage;
  let eventSourceableMock: types.EventSourceable;
  let eventSourceableType: types.EventSourceableType;

  let testGuid: Guid;
  let testGuidString: string;

  beforeEach(() => {
    storage = new InMemorySnapshotStorage();
    testGuid = Guid.generate();
    testGuidString = testGuid.toString();
    eventSourceableMock = mock<types.EventSourceable>();
    eventSourceableMock.getId.mockReturnValue(testGuid);
    eventSourceableMock.getVersion.mockReturnValue(1);
    eventSourceableMock.getTypeName.mockReturnValue('TestEventSourceable');

    eventSourceableType = class TestEventSourceable {} as any;
  });

  describe('save', () => {
    it('saves a snapshot and returns its id', async () => {
      const id = await storage.save(eventSourceableMock);
      expect(id).toBe(testGuidString);
    });

    it('overwrites existing snapshot for same id', async () => {
      await storage.save(eventSourceableMock);

      const updatedMock = mock<types.EventSourceable>();
      updatedMock.getId.mockReturnValue(testGuid);
      updatedMock.getVersion.mockReturnValue(2);

      const id = await storage.save(updatedMock);
      expect(id).toBe(testGuidString);
    });
  });

  describe('findById', () => {
    it('returns undefined when no snapshot exists for id', async () => {
      const found = await storage.findById(
        eventSourceableType,
        Guid.generate()
      );
      expect(found).toBeUndefined();
    });

    it('returns the snapshot when it exists', async () => {
      await storage.save(eventSourceableMock);

      const found = await storage.findById(eventSourceableType, testGuid);
      expect(found).toBeDefined();
      expect(found!.getId().toString()).toBe(testGuidString);
    });
  });

  describe('update', () => {
    it('returns true after updating', async () => {
      await storage.save(eventSourceableMock);

      const updatedMock = mock<types.EventSourceable>();
      updatedMock.getId.mockReturnValue(testGuid);
      updatedMock.getVersion.mockReturnValue(2);

      const result = await storage.update(updatedMock);
      expect(result).toBe(true);
    });

    it('updates the stored snapshot', async () => {
      await storage.save(eventSourceableMock);

      const updatedMock = mock<types.EventSourceable>();
      updatedMock.getId.mockReturnValue(testGuid);
      updatedMock.getVersion.mockReturnValue(2);

      await storage.update(updatedMock);

      const found = await storage.findById(eventSourceableType, testGuid);
      expect(found!.getVersion()).toBe(2);
    });

    it('creates a new snapshot if none existed', async () => {
      const result = await storage.update(eventSourceableMock);
      expect(result).toBe(true);

      const found = await storage.findById(eventSourceableType, testGuid);
      expect(found).toBeDefined();
    });
  });
});
