import { inject, injectable } from 'inversify';
import { type Job, DefineOptions } from '@pulsecron/pulse';
import { Collection } from 'mongodb';
import { isEmpty } from 'lodash';
import { derive } from '@traits-ts/core';
import { Assignment } from '../../components/command';
import {
  InactiveClientError,
  CommandSchedulingError,
  CommandUnschedulingError,
} from '../infrastructure-errors';
import { StatefulTrait } from '../../traits/stateful.trait';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { Log } from '../../components/log-entry';
import { ScheduleCommand } from '../../domain/schedule-command';
import { UnscheduleCommand } from '../../domain/unschedule-command';
import { Guid } from '../../domain/value-objects/guid';
import { PulseClient } from '../../app/clients/pulse-client';

@injectable()
export class PulseCommandScheduler
  extends derive(StatefulTrait)
  implements types.CommandScheduler
{
  static STATES = {
    constructed: 'constructed',
    initialized: 'initialized',
    active: 'active',
    stopped: 'stopped',
  };

  @inject(BINDINGS.Pulse.clients.CommandScheduler)
  public readonly pulseClient: PulseClient;

  @inject(BINDINGS.CommandBus)
  protected commandBus: types.CommandBus;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.Serializer)
  protected serializer: types.Serializer;

  @inject(BINDINGS.MongoDB.collections.ScheduledCommands)
  protected collection: Collection;

  @inject(BINDINGS.Pulse.jobTransformer)
  protected jobTransformer: types.PulseJobTransformer;

  public state: types.State;

  public readonly jobName: string;

  public readonly options?: DefineOptions;

  /**
   * Creates an instance of PulseCommandScheduler.
   * @param jobName - Name of the job that is being scheduled on Pulse.
   * @param options - Optional options passed to Pulse job definition.
   */
  constructor(jobName = 'send scheduled command', options: DefineOptions = {}) {
    super();
    this.jobName = jobName;
    this.options = options;
    this.setState(PulseCommandScheduler.STATES.constructed);
  }

  /**
   * Starts processing on CommandScheduler.
   */
  public async startScheduling(): Promise<void> {
    if (this.isInState(PulseCommandScheduler.STATES.active)) {
      return;
    }
    await this.initialize();
    this.setState(PulseCommandScheduler.STATES.active);
  }

  /**
   * Stops processing on CommandScheduler.
   */
  public async stopScheduling(): Promise<void> {
    if (this.isInState(PulseCommandScheduler.STATES.stopped)) {
      return;
    }

    await this.pulseClient.library.cancel({ name: this.jobName });

    this.setState(PulseCommandScheduler.STATES.stopped);
  }

  /**
   * Initializes Pulse command scheduler.
   * @async
   * @throws {InactiveClientError}
   * Thrown if pulse client is not connected.
   */
  public async initialize(): Promise<void> {
    if (!this.pulseClient.isConnected()) {
      const error = new InactiveClientError(
        this.constructor.name,
        this.pulseClient.getId().toString()
      );

      this.log.error(
        new Log('inactive Pulse client').on(this).in(this.initialize)
      );
      throw error;
    }

    await this.defineJob(this.jobName, this.options, async (job: Job) =>
      this.handleScheduledCommand(job)
    );
    this.log.debug(
      new Log(
        `defined new Pulse job '${
          this.jobName
        }' for client with id '${this.pulseClient.getId()}'`
      )
        .on(this)
        .in(this.initialize)
    );

    await (this.pulseClient as any).startProcessing(this.jobName);

    this.setState(PulseCommandScheduler.STATES.initialized);
  }

  /**
   * Schedules command with Pulse.
   * @async
   * @param scheduleCommand - Instance of `ScheduleCommand`.
   * @throws {CommandSchedulingError}
   * Thrown if scheduled command cannot be scheduled.
   */
  public async schedule(scheduleCommand: ScheduleCommand): Promise<void> {
    const serializedData = this.serializeScheduleCommandToData(scheduleCommand);

    const { command } = scheduleCommand;
    const assignment = command.getAssignment() as Assignment;
    const assignmentId = assignment.assignmentId;
    this.log.debug(
      new Log(`scheduling command '${assignmentId}'`)
        .on(this)
        .in(this.schedule)
        .with('scheduled command', scheduleCommand)
    );
    try {
      const when = scheduleCommand.getDeliveryDate();
      const job: any = await this.pulseClient.library.schedule(
        when,
        this.jobName,
        serializedData
      );

      // Ensure the job is saved to the database
      if (job && typeof job.save === 'function') {
        await job.save();
      }

      this.log.debug(
        new Log(`scheduled command '${assignmentId}'`)
          .on(this)
          .in(this.schedule)
          .with('scheduled command', scheduleCommand)
      );
    } catch (error) {
      this.log.error(
        new Log(
          `failed scheduling command '${assignmentId}' do to error: ${error}`
        )
          .on(this)
          .in(this.schedule)
          .with('scheduled command', scheduleCommand)
      );

      throw new CommandSchedulingError(
        this.jobName,
        assignmentId.toString(),
        assignment.assignerType,
        assignment.assignerId.toString(),
        error
      );
    }
  }

  /**
   * Unschedules command from Pulse.
   * @async
   * @param unscheduleCommand - Instance of `UnscheduleCommand`.
   * @throws {CommandUnschedulingError}
   * Thrown if scheduled command cannot be canceled.
   */
  public async unschedule(
    unscheduleCommand: UnscheduleCommand
  ): Promise<boolean> {
    const { assignmentId, commandType, assignerId, assignerType } =
      unscheduleCommand;

    const mongoQuery = {
      'data.commandType': commandType,
      'data.assignerId': assignerId.toString(),
      'data.assignerType': assignerType,
      'data.id': assignmentId.toString(),
    };

    this.log.debug(
      new Log(`unscheduling command '${assignmentId}'`)
        .on(this)
        .in(this.unschedule)
        .with('unschedule command', unscheduleCommand)
    );

    try {
      const removedCount = await this.pulseClient.library.cancel(mongoQuery);
      const isSuccessful = (removedCount ?? 0) > 0;
      if (isSuccessful) {
        this.log.debug(
          new Log(`unscheduled command '${assignmentId}'`)
            .on(this)
            .in(this.unschedule)
            .with('unschedule command', unscheduleCommand)
        );
      }
      return isSuccessful;
    } catch (error) {
      this.log.error(
        new Log(
          `failed unscheduling command '${assignmentId}' do to error: ${error}`
        )
          .on(this)
          .in(this.unschedule)
          .with('unschedule command', unscheduleCommand)
      );
      throw new CommandUnschedulingError(
        this.jobName,
        assignmentId.toString(),
        assignerType,
        assignerId.toString(),
        error
      );
    }
  }

  /**
   * Unschedules all commands(jobs matching scheduler's job name) from Pulse.
   * @async
   */
  public async unscheduleAll(): Promise<void> {
    const mongoQuery = { name: this.jobName };
    try {
      await this.collection.deleteMany(mongoQuery);
      this.log.debug(
        new Log(`successfully unscheduled all jobs from '${this.jobName}'`)
          .on(this)
          .in(this.unscheduleAll)
      );
    } catch (error) {
      this.log.error(
        new Log(
          `failed unscheduling all jobs from '${this.jobName}' do to error: ${error}`
        )
          .on(this)
          .in(this.unscheduleAll)
      );
      throw error;
    }
  }

  /**
   * Returns ScheduledJob if it can be found on `Scheduler`.
   * @param commandType - Command type name for which schedule was made.
   * @param assignerId - Source of scheduled job i.e. Event Sourceable's identifier.
   * @param assignerType - Event Sourceable type name.
   * @param assignmentId - Assignment identifier.
   * @returns Instance implementing `ScheduledJob` interface, else `undefined`.
   */
  public async getJob(
    commandType: string,
    assignerId: string | Guid,
    assignerType: string,
    assignmentId?: string | Guid
  ): Promise<types.ScheduledJob | undefined> {
    const mongoQuery = {
      'data.commandType': commandType,
      'data.assignerId': assignerId.toString(),
      'data.assignerType': assignerType,
    };

    if (assignmentId) {
      mongoQuery['data.id'] = assignmentId.toString();
    }

    const mongoSort = { data: -1 };
    const mongoLimit = 1;
    const jobs: Job[] = await (this.pulseClient.library as any).jobs(
      mongoQuery,
      mongoSort,
      mongoLimit
    );
    if (isEmpty(jobs)) {
      return undefined;
    }
    return this.jobTransformer.transform(jobs[0]);
  }

  /**
   * Pulse job handler for ScheduledCommand.
   * @async
   * @param job - Instance implementing `Job` interface.
   */
  public async handleScheduledCommand(job: Job): Promise<void> {
    const serializedData = job.attrs.data;
    const command = this.serializer.parse(serializedData.command);

    this.log.debug(
      new Log(`handling scheduled command '${serializedData.id}'`)
        .on(this)
        .in(this.handleScheduledCommand)
        .with('command', command)
    );

    try {
      await this.commandBus.send(command);
      this.log.debug(
        new Log(`handled scheduled command '${serializedData.id}'`)
          .on(this)
          .in(this.handleScheduledCommand)
          .with('command', command)
      );
    } catch (error) {
      job.fail(error);
      await job.save();

      this.log.error(
        new Log(
          `failed handling of scheduled command '${serializedData.id}' do to error: ${error}`
        )
          .on(this)
          .in(this.handleScheduledCommand)
          .with('command', command)
      );
    }
  }

  /**
   * Returns frequency at which schedule will query looking for scheduled commands that need to
   * be processed.
   * @return Interval for query frequency as a `number`, else `undefined`.
   */
  public getInterval(): number {
    return this.pulseClient.getInterval() || 1;
  }

  /**
   * Defines a new job on Pulse.
   * @async
   * @param jobName - Name of a job to define.
   * @param options - Options for Pulse job implementing `DefineOptions` interface.
   * @param handler - Async function that will handle job upon scheduling it.
   */
  protected async defineJob(
    jobName: string,
    options: DefineOptions = {},
    handler: (job: Job) => Promise<void>
  ): Promise<void> {
    this.pulseClient.library.define(jobName, handler, options);

    const definitions = (this.pulseClient.library as any)._definitions || {};

    if (!definitions[jobName]) {
      this.log.error(
        new Log(`failed defining job '${jobName}'`).on(this).in(this.defineJob)
      );
      throw new Error(`Failed to define job: ${jobName}`);
    }
  }

  /**
   * Serializes schedule command instance.
   * @param scheduleCommand - Instance of `ScheduleCommand`.
   * @returns Serialized scheduled command.
   */
  protected serializeScheduleCommandToData(
    scheduleCommand: ScheduleCommand
  ): Record<string, any> {
    const { command } = scheduleCommand;
    const assignment = command.getAssignment() as Assignment;

    const data = {
      commandType: command.getTypeName(),
      command: this.serializer.stringify(command),
      assignerId: assignment.assignerId.toString(),
      assignerType: assignment.assignerType,
      id: assignment.assignmentId.toString(),
    };

    return data;
  }
}
