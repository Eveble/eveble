import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';

import { Type } from '@eveble/core';
import { Command, Assignment } from '../../../src/components/command';
import { types } from '../../../src/types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { InMemoryCommandScheduler } from '../../../src/infrastructure/schedulers/in-memory-command-scheduler';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { UnscheduleCommand } from '../../../src/domain/unschedule-command';
import { Log } from '../../../src/components/log-entry';

describe('InMemoryCommandScheduler', () => {
  @Type('InMemoryCommandScheduler.TestCommand', { isRegistrable: false })
  class TestCommand extends Command<TestCommand> {
    name: string;
  }

  let scheduler: InMemoryCommandScheduler;
  let commandBus: types.CommandBus;
  let logger: types.Logger;
  let serializer: types.Serializer;

  const now = new Date();
  const assignerId = new Guid();
  const assignmentId = new Guid();

  const createScheduledCommand = (cmdName: string) => {
    const cmd = new TestCommand({
      targetId: assignerId,
      timestamp: now,
      name: cmdName,
    });
    const assignment = new Assignment({
      assignmentId,
      deliverAt: new Date(Date.now() + 60000),
      assignerId,
      assignerType: 'TestType',
    });
    cmd.schedule(assignment);
    return new ScheduleCommand({
      targetId: assignerId,
      command: cmd,
    });
  };

  beforeEach(() => {
    commandBus = mock<types.CommandBus>();
    logger = mock<types.Logger>();
    serializer = mock<types.Serializer>();

    scheduler = new InMemoryCommandScheduler();
    (scheduler as any).commandBus = commandBus;
    (scheduler as any).log = logger;
    (scheduler as any).serializer = serializer;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('lifecycle states', () => {
    it('starts in constructed state', () => {
      expect(
        scheduler.isInState(InMemoryCommandScheduler.STATES.constructed)
      ).toBe(true);
    });

    it('transitions to initialized state', async () => {
      await scheduler.initialize();
      expect(
        scheduler.isInState(InMemoryCommandScheduler.STATES.initialized)
      ).toBe(true);
    });

    it('transitions to active state via startScheduling', async () => {
      await scheduler.startScheduling();
      expect(scheduler.isInState(InMemoryCommandScheduler.STATES.active)).toBe(
        true
      );
    });

    it('transitions to stopped state via stopScheduling', async () => {
      await scheduler.startScheduling();
      await scheduler.stopScheduling();
      expect(scheduler.isInState(InMemoryCommandScheduler.STATES.stopped)).toBe(
        true
      );
    });

    it('ignores duplicate startScheduling calls', async () => {
      await scheduler.startScheduling();
      await scheduler.startScheduling();
      expect(scheduler.isInState(InMemoryCommandScheduler.STATES.active)).toBe(
        true
      );
    });

    it('ignores duplicate stopScheduling calls', async () => {
      await scheduler.startScheduling();
      await scheduler.stopScheduling();
      await scheduler.stopScheduling();
      expect(scheduler.isInState(InMemoryCommandScheduler.STATES.stopped)).toBe(
        true
      );
    });
  });

  describe('getInterval', () => {
    it('returns default interval', () => {
      expect(scheduler.getInterval()).toBe(1000);
    });

    it('returns configured interval', () => {
      const customScheduler = new InMemoryCommandScheduler(5000);
      expect(customScheduler.getInterval()).toBe(5000);
    });
  });

  describe('schedule', () => {
    it('stores a scheduled command', async () => {
      const scheduleCommand = createScheduledCommand('test');

      await scheduler.schedule(scheduleCommand);

      const job = await scheduler.getJob(
        scheduleCommand.command.getTypeName(),
        assignerId,
        'TestType',
        assignmentId
      );
      expect(job).toBeDefined();
      expect(job!.name).toBe('send scheduled command');
    });
  });

  describe('unschedule', () => {
    it('removes a scheduled command', async () => {
      const scheduleCommand = createScheduledCommand('test');
      await scheduler.schedule(scheduleCommand);

      const unscheduleCommand = new UnscheduleCommand({
        targetId: assignerId,
        assignmentId,
        commandType: scheduleCommand.command.getTypeName(),
        assignerId,
        assignerType: 'TestType',
      });

      const result = await scheduler.unschedule(unscheduleCommand);
      expect(result).toBe(true);

      const job = await scheduler.getJob(
        scheduleCommand.command.getTypeName(),
        assignerId,
        'TestType',
        assignmentId
      );
      expect(job).toBeUndefined();
    });

    it('returns false if command not found', async () => {
      const unscheduleCommand = new UnscheduleCommand({
        targetId: new Guid(),
        assignmentId: new Guid(),
        commandType: 'NonExistent',
        assignerId: new Guid(),
        assignerType: 'TestType',
      });

      const result = await scheduler.unschedule(unscheduleCommand);
      expect(result).toBe(false);
    });
  });

  describe('unscheduleAll', () => {
    it('removes all scheduled commands', async () => {
      await scheduler.schedule(createScheduledCommand('test1'));
      await scheduler.schedule(createScheduledCommand('test2'));

      await scheduler.unscheduleAll();

      expect(scheduler.getInterval()).toBe(1000);
    });
  });

  describe('getJob', () => {
    it('returns undefined when no matching job exists', async () => {
      const job = await scheduler.getJob('NonExistent', new Guid(), 'TestType');
      expect(job).toBeUndefined();
    });

    it('returns matching job by commandType and assigner', async () => {
      const scheduleCommand = createScheduledCommand('test');
      await scheduler.schedule(scheduleCommand);

      const job = await scheduler.getJob(
        scheduleCommand.command.getTypeName(),
        assignerId,
        'TestType'
      );
      expect(job).toBeDefined();
      expect(job!.data.commandType).toBe(scheduleCommand.command.getTypeName());
    });
  });
});
