import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import { Collection } from 'mongodb';
import { type Job, DefineOptions } from '@pulsecron/pulse';

import { Type } from '@eveble/core';
import { Command, Assignment } from '../../../src/components/command';
import { types } from '../../../src/types';
import { Log } from '../../../src/components/log-entry';
import {
  InactiveClientError,
  CommandSchedulingError,
  CommandUnschedulingError,
} from '../../../src/infrastructure/infrastructure-errors';
import { Guid } from '../../../src/domain/value-objects/guid';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { UnscheduleCommand } from '../../../src/domain/unschedule-command';
import { PulseCommandScheduler } from '../../../src/infrastructure/schedulers/pulse-command-scheduler';
import { PulseClient } from '../../../src/app/clients/pulse-client';

describe(`PulseCommandScheduler`, () => {
  @Type('PulseCommandScheduler.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }

  // Dependencies
  let log: any;
  let injector: Injector;
  let commandBus: any;
  let pulseClient: any;
  let serializer: any;
  let collection: any;
  let jobTransformer: any;
  let pulseInstance: any;
  let scheduler: PulseCommandScheduler;

  // PulseClient props
  const pulseClientId = 'my-pulse-client-id';
  // Scheduler props
  const jobName = 'my-job-name';
  const options: DefineOptions = {
    concurrency: 5,
    lockLimit: 5,
    lockLifetime: 5,
    priority: 'normal',
  };

  // Schedule command
  const targetId = new Guid();
  const assignmentId = new Guid();
  const timestamp = new Date();
  const deliverAt = new Date();
  const assignerId = new Guid();
  const assignerType = 'MyEventSourceable';
  const name = 'foo';
  const assignment = new Assignment({
    assignmentId,
    deliverAt,
    assignerId,
    assignerType,
  });
  const command = new MyCommand({
    targetId,
    name,
    timestamp,
  });
  command.schedule(assignment);
  const scheduleCommand = new ScheduleCommand({
    targetId,
    command,
  });
  const unscheduleCommand = new UnscheduleCommand({
    targetId,
    assignmentId,
    commandType: MyCommand.getTypeName(),
    assignerId,
    assignerType,
  });

  // Returns
  const serializedCommand = `{"$type":"PulseCommandScheduler.MyCommand","$value":{"timestamp":{"$date":${Number(
    timestamp
  )}},"targetId":{"$type":"Guid","$value":{"id":"${targetId.toString()}"}},"name":"Foo"}}`;

  beforeEach(() => {
    log = mock<types.Logger>();
    commandBus = mock<types.CommandBus>();
    pulseClient = mock<PulseClient>();
    serializer = mock<types.Serializer>();
    collection = mock<Collection>();
    jobTransformer = mock<types.PulseJobTransformer>();
    pulseInstance = {
      define: vi.fn(),
      schedule: vi.fn(),
      cancel: vi.fn(),
      jobs: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      _definitions: {},
    };

    pulseClient.library = pulseInstance;
    pulseClient.isConnected.mockReturnValue(true);
    pulseClient.getId.mockReturnValue(pulseClientId);

    serializer.stringify.calledWith(command).mockReturnValue(serializedCommand);
    serializer.parse.calledWith(serializedCommand).mockReturnValue(command);

    injector = new Injector();
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .toConstantValue(serializer);
    injector
      .bind<Collection>(BINDINGS.MongoDB.collections.ScheduledCommands)
      .toConstantValue(collection);
    injector
      .bind<types.PulseJobTransformer>(BINDINGS.Pulse.jobTransformer)
      .toConstantValue(jobTransformer);
    injector
      .bind<PulseClient>(BINDINGS.Pulse.clients.CommandScheduler)
      .toConstantValue(pulseClient);

    scheduler = new PulseCommandScheduler(jobName, options);
    injector.injectInto(scheduler);
  });

  describe(`construction`, () => {
    it(`takes jobName as a string and assigns it`, () => {
      const instance = new PulseCommandScheduler(jobName);
      expect(instance.jobName).toBe(jobName);
    });

    it(`takes jobName and options as an object and assigns them`, () => {
      const instance = new PulseCommandScheduler(jobName, options);
      expect(instance.jobName).toBe(jobName);
      expect(instance.options).toBe(options);
    });
  });

  describe('initialization', () => {
    describe('successful', () => {
      beforeEach(() => {
        pulseInstance._definitions[jobName] = { name: jobName };
      });

      it(`defines pulse job for scheduled command upon initialization`, async () => {
        await scheduler.initialize();

        expect(pulseInstance.define).toHaveBeenCalledTimes(1);
        const calledArgs = pulseInstance.define.mock.calls[0];
        expect(calledArgs[0]).toBe(jobName);
        expect(calledArgs[1]).toBeInstanceOf(Function);
        expect(calledArgs[2]).toBe(options);
      });

      it('ensures that scheduled command job handler is bound to instance of scheduler', async () => {
        const handleSSchduledCommandStub = vi.fn();
        scheduler.handleScheduledCommand = handleSSchduledCommandStub;
        await scheduler.initialize();

        expect(pulseInstance.define).toHaveBeenCalledTimes(1);
        const calledArgs = pulseInstance.define.mock.calls[0];
        const boundHandler = calledArgs[1];
        await boundHandler();

        expect(handleSSchduledCommandStub).toHaveBeenCalledTimes(1);
      });

      it('logs successful scheduler initialization', async () => {
        await scheduler.initialize();

        expect(log.debug).toHaveBeenCalledWith(
          new Log(
            `defined new Pulse job '${jobName}' for client with id '${pulseClientId}'`
          )
            .on(scheduler)
            .in(scheduler.initialize)
        );
      });

      it('starts processing jobs after initialization', async () => {
        await scheduler.initialize();

        expect(pulseClient.startProcessing).toHaveBeenCalledTimes(1);
        expect(pulseClient.startProcessing).toHaveBeenCalledWith(jobName);
      });
    });

    describe('failed', () => {
      it('logs failed initialization due to inactive Pulse client', async () => {
        pulseClient.isConnected.mockReturnValue(false);
        await expect(scheduler.initialize()).rejects.toThrow(
          InactiveClientError,
          `PulseCommandScheduler: can't be initialized since underlying client with id '${pulseClientId}' is inactive`
        );
      });

      it('throws InactiveClientError when Pulse client is inactive on initialization', async () => {
        pulseClient.isConnected.mockReturnValue(false);
        await expect(scheduler.initialize()).rejects.toThrow(
          InactiveClientError
        );
        expect(log.error).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`inactive Pulse client`)
              .on(scheduler)
              .in(scheduler.initialize)
          )
        );
      });
    });
  });

  describe('managing state', () => {
    beforeEach(() => {
      pulseInstance._definitions[jobName] = { name: jobName };
    });

    it('starts scheduling(processing scheduled jobs)', async () => {
      await scheduler.initialize();
      await scheduler.startScheduling();
      expect(scheduler.isInState(PulseCommandScheduler.STATES.active)).to.be
        .true;
    });

    it('stops scheduling(stops processing scheduled jobs)', async () => {
      await scheduler.initialize();
      await scheduler.startScheduling();
      await scheduler.stopScheduling();
      expect(scheduler.isInState(PulseCommandScheduler.STATES.stopped)).to.be
        .true;
    });
  });

  describe('scheduling command', () => {
    beforeEach(() => {
      pulseInstance._definitions[jobName] = { name: jobName };
    });

    it('logs scheduling command', async () => {
      await scheduler.initialize();
      await scheduler.schedule(scheduleCommand);

      expect(log.debug).toHaveBeenCalledWith(
        new Log(`scheduling command '${assignmentId}'`)
          .on(scheduler)
          .in(scheduler.schedule)
          .with('scheduled command', scheduleCommand)
      );
    });

    describe('successful', () => {
      it(`schedules command`, async () => {
        const expectedSerializedData = {
          id: assignmentId.toString(),
          command: serializedCommand,
          commandType: 'PulseCommandScheduler.MyCommand',
          assignerId: assignerId.toString(),
          assignerType: 'MyEventSourceable',
        };

        const mockJob = {
          save: vi.fn().mockResolvedValue(),
        };
        pulseInstance.schedule.mockResolvedValue(mockJob);

        await scheduler.initialize();
        await scheduler.schedule(scheduleCommand);

        expect(pulseInstance.schedule).toHaveBeenCalledTimes(1);
        expect(pulseInstance.schedule).toHaveBeenCalledWith(
          deliverAt,
          jobName,
          expectedSerializedData
        );
        expect(mockJob.save).toHaveBeenCalledTimes(1);
      });

      it('logs successfully scheduled command', async () => {
        const mockJob = {
          save: vi.fn().mockResolvedValue(),
        };
        pulseInstance.schedule.mockResolvedValue(mockJob);

        await scheduler.initialize();
        await scheduler.schedule(scheduleCommand);

        expect(log.debug).toHaveBeenCalledWith(
          new Log(`scheduled command '${assignmentId}'`)
            .on(scheduler)
            .in(scheduler.schedule)
            .with('scheduled command', scheduleCommand)
        );
      });
    });

    describe('failed', () => {
      it(`throws error when scheduled command can't be scheduled`, async () => {
        const error = new Error('my-error');
        pulseInstance.schedule.mockRejectedValue(error);

        await scheduler.initialize();
        await expect(scheduler.schedule(scheduleCommand)).rejects.toThrow(
          CommandSchedulingError,
          `${jobName}: cannot schedule command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`
        );
      });

      it(`logs thrown error when Pulse can't schedule command`, async () => {
        const error = new Error('my-error');
        pulseInstance.schedule.mockRejectedValue(error);

        await scheduler.initialize();
        await expect(scheduler.schedule(scheduleCommand)).rejects.toThrow(
          CommandSchedulingError
        );
        expect(log.error).toHaveBeenCalledWith(
          new Log(
            `failed scheduling command '${assignmentId}' do to error: ${error}`
          )
            .on(scheduler)
            .in(scheduler.schedule)
            .with('scheduled command', scheduleCommand)
        );
      });
    });
  });

  describe('unscheduling command', () => {
    beforeEach(() => {
      pulseInstance._definitions[jobName] = { name: jobName };
    });

    it('logs unscheduling command', async () => {
      await scheduler.initialize();
      await scheduler.unschedule(unscheduleCommand);

      expect(log.debug).toHaveBeenCalledWith(
        new Log(`unscheduling command '${assignmentId}'`)
          .on(scheduler)
          .in(scheduler.unschedule)
          .with('unschedule command', unscheduleCommand)
      );
    });

    describe('successful', () => {
      it(`unschedules command`, async () => {
        pulseInstance.cancel.mockResolvedValue(1);

        await scheduler.initialize();
        const isSuccessful = await scheduler.unschedule(unscheduleCommand);
        expect(isSuccessful).toBe(true);

        const expectedMongoQuery = {
          'data.id': assignmentId.toString(),
          'data.commandType': MyCommand.getTypeName(),
          'data.assignerId': assignerId.toString(),
          'data.assignerType': assignerType,
        };
        expect(pulseInstance.cancel).toHaveBeenCalledTimes(1);
        expect(pulseInstance.cancel).toHaveBeenCalledWith(expectedMongoQuery);
      });

      it('logs successful cancellation of scheduled command', async () => {
        pulseInstance.cancel.mockResolvedValue(1);

        await scheduler.initialize();
        await scheduler.unschedule(unscheduleCommand);

        expect(log.debug).toHaveBeenCalledWith(
          new Log(`unscheduled command '${assignmentId}'`)
            .on(scheduler)
            .in(scheduler.unschedule)
            .with('unschedule command', unscheduleCommand)
        );
      });

      it('does not throw error if Pulse client resolves removed job count as 0', async () => {
        pulseInstance.cancel.mockResolvedValue(0);

        await scheduler.initialize();
        const isSuccessful = await scheduler.unschedule(unscheduleCommand);
        expect(isSuccessful).toBe(false);
      });
    });

    describe('failed', () => {
      it('throws CommandUnschedulingError when Pulse client throws error', async () => {
        const error = new Error('my-error');
        pulseInstance.cancel.mockRejectedValue(error);

        await scheduler.initialize();
        await expect(scheduler.unschedule(unscheduleCommand)).rejects.toThrow(
          CommandUnschedulingError,
          `${jobName}: cannot cancel command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`
        );
      });

      it('logs thrown error upon Pulse client canceling the job', async () => {
        const error = new Error('my-error');
        pulseInstance.cancel.mockRejectedValue(error);

        await scheduler.initialize();
        await expect(scheduler.unschedule(unscheduleCommand)).rejects.toThrow(
          CommandUnschedulingError
        );

        expect(log.error).toHaveBeenCalledWith(
          new Log(
            `failed unscheduling command '${assignmentId}' do to error: ${error}`
          )
            .on(scheduler)
            .in(scheduler.unschedule)
            .with('unschedule command', unscheduleCommand)
        );
      });
    });
  });

  describe('handling schedule command job', () => {
    it(`logs handling scheduled command`, async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
      };

      const job = mock<Job>();
      job.attrs.data = serializedData;

      await scheduler.handleScheduledCommand(job);
      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(`handling scheduled command '${assignmentId}'`)
            .on(scheduler)
            .in(scheduler.handleScheduledCommand)
            .with('command', command)
        )
      );
    });

    it(`sends command through command bus upon scheduled time`, async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
        commandType: 'PulseCommandScheduler.MyCommand',
        assignerId: assignerId.toString(),
        assignerType,
      };

      const job = mock<Job>();
      job.attrs.data = serializedData;

      await scheduler.handleScheduledCommand(job);
      expect(commandBus.send).toHaveBeenCalledTimes(1);
      expect(commandBus.send).toHaveBeenCalledWith(command);
    });

    it(`logs sent command through command bus upon scheduled time`, async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
        commandType: 'PulseCommandScheduler.MyCommand',
        assignerId: assignerId.toString(),
        assignerType,
      };

      const job = mock<Job>();
      job.attrs.data = serializedData;

      await scheduler.handleScheduledCommand(job);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(`handled scheduled command '${assignmentId}'`)
          .on(scheduler)
          .in(scheduler.handleScheduledCommand)
          .with('command', command)
      );
    });

    it('saves failed state on job upon thrown error', async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
        commandType: 'PulseCommandScheduler.MyCommand',
        assignerId: assignerId.toString(),
        assignerType,
      };

      const job = mock<Job>();
      job.attrs.data = serializedData;

      const error = new Error('my-error');
      commandBus.send.mockRejectedValue(error);

      await scheduler.handleScheduledCommand(job);
      expect(job.fail).toHaveBeenCalledTimes(1);
      expect(job.fail).toHaveBeenCalledWith(error);
      expect(job.save).toHaveBeenCalledTimes(1);
      expect(job.save).toHaveBeenCalledWith();
    });

    it('logs failed handling of job upon thrown error', async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
        commandType: 'PulseCommandScheduler.MyCommand',
        assignerId: assignerId.toString(),
        assignerType,
      };

      const job = mock<Job>();
      job.attrs.data = serializedData;

      const error = new Error('my-error');
      commandBus.send.mockRejectedValue(error);

      await scheduler.handleScheduledCommand(job);
      expect(log.error).toHaveBeenCalledWith(
        new Log(
          `failed handling of scheduled command '${assignmentId}' do to error: ${error}`
        )
          .on(scheduler)
          .in(scheduler.handleScheduledCommand)
          .with('command', command)
      );
    });
  });

  describe('batch canceling of scheduled commands', () => {
    it('successfully cancels all scheduled commands', async () => {
      await scheduler.unscheduleAll();

      expect(collection.deleteMany).toHaveBeenCalledTimes(1);
      expect(collection.deleteMany).toHaveBeenCalledWith({
        name: jobName,
      });
    });

    it('logs successful cancellation of all scheduled commands', async () => {
      await scheduler.unscheduleAll();

      expect(log.debug).toHaveBeenCalledWith(
        new Log(`successfully unscheduled all jobs from '${jobName}'`)
          .on(scheduler)
          .in(scheduler.unscheduleAll)
      );
    });

    it('throws error upon unsuccessful cancellation of all jobs', async () => {
      const error = new Error('my-error');
      collection.deleteMany.mockRejectedValue(error);

      await expect(scheduler.unscheduleAll()).rejects.toThrow(error);
    });

    it('logs unsuccessful cancellation of all jobs', async () => {
      const error = new Error('my-error');
      collection.deleteMany.mockRejectedValue(error);

      await expect(scheduler.unscheduleAll()).rejects.toThrow(error);
      expect(log.error).toHaveBeenCalledWith(
        new Log(
          `failed unscheduling all jobs from '${jobName}' do to error: ${error}`
        )
          .on(scheduler)
          .in(scheduler.unscheduleAll)
      );
    });
  });

  describe('resolving', () => {
    it('returns scheduled job if job is found on queue', async () => {
      const returnedJob = vi.fn();
      pulseInstance.jobs.mockReturnValue([returnedJob]);

      const transformedJob = vi.fn();
      jobTransformer.transform.mockReturnValue(transformedJob);

      const foundJob = await scheduler.getJob(
        MyCommand.getTypeName(),
        assignerId,
        assignerType,
        assignmentId
      );
      expect(foundJob).toBe(transformedJob);

      const expectedMongoQuery = {
        'data.commandType': MyCommand.getTypeName(),
        'data.assignerId': assignerId.toString(),
        'data.assignerType': assignerType,
        'data.id': assignmentId.toString(),
      };
      const expectedMongoSort = { data: -1 };
      const expectedMongoLimit = 1;
      expect(pulseInstance.jobs).toHaveBeenCalledTimes(1);
      expect(pulseInstance.jobs).toHaveBeenCalledWith(
        expectedMongoQuery,
        expectedMongoSort,
        expectedMongoLimit
      );
      expect(jobTransformer.transform).toHaveBeenCalledWith(returnedJob);
    });

    it('returns scheduled job with omitted optional assignmentId argument', async () => {
      const returnedJob = vi.fn();
      pulseInstance.jobs.mockReturnValue([returnedJob]);

      const transformedJob = vi.fn();
      jobTransformer.transform.mockReturnValue(transformedJob);

      const foundJob = await scheduler.getJob(
        MyCommand.getTypeName(),
        assignerId,
        assignerType
      );
      expect(foundJob).toBe(transformedJob);

      const expectedMongoQuery = {
        'data.commandType': MyCommand.getTypeName(),
        'data.assignerId': assignerId.toString(),
        'data.assignerType': assignerType,
      };
      const expectedMongoSort = { data: -1 };
      const expectedMongoLimit = 1;
      expect(pulseInstance.jobs).toHaveBeenCalledTimes(1);
      expect(pulseInstance.jobs).toHaveBeenCalledWith(
        expectedMongoQuery,
        expectedMongoSort,
        expectedMongoLimit
      );
      expect(jobTransformer.transform).toHaveBeenCalledWith(returnedJob);
    });

    it(`returns undefined if job can't be found on queue`, async () => {
      pulseInstance.jobs.mockReturnValue([]);

      const foundJob = await scheduler.getJob(
        MyCommand.getTypeName(),
        targetId,
        assignerType,
        assignmentId
      );
      expect(foundJob).toBe(undefined);

      expect(pulseInstance.jobs).toHaveBeenCalledTimes(1);
      expect(jobTransformer.transform).not.toHaveBeenCalled();
    });
  });

  describe('getters', () => {
    describe('getInterval', () => {
      it('returns interval in which jobs are processed', () => {
        const interval = 50;
        pulseClient.getInterval.mockReturnValue(interval);
        expect(scheduler.getInterval()).toBe(interval);
      });

      it('returns default interval of 1 when client interval is undefined', () => {
        pulseClient.getInterval.mockReturnValue(undefined);
        expect(scheduler.getInterval()).toBe(1);
      });
    });
  });
});
