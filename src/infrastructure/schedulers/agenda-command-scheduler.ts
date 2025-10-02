import { inject, injectable } from 'inversify';
import Agenda, { AgendaConfiguration } from 'agenda';
import { Collection } from 'mongodb';
import { isEmpty } from 'lodash';
import { Assignment } from '../../components/command';
import {
  InactiveClientError,
  CommandSchedulingError,
  CommandUnschedulingError,
} from '../infrastructure-errors';
import { StatefulTrait } from '../../trait/stateful.trait';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { Log } from '../../components/log-entry';
import { ScheduleCommand } from '../../domain/schedule-command';
import { UnscheduleCommand } from '../../domain/unschedule-command';
import { Guid } from '../../domain/value-objects/guid';
import { AgendaClient } from '../../app/clients/agenda-client';

@injectable()
export class AgendaCommandScheduler
  extends StatefulTrait
  implements types.CommandScheduler
{
  static STATES = {
    constructed: 'constructed',
    initialized: 'initialized',
    active: 'active',
    stopped: 'stopped',
  };

  @inject(BINDINGS.Agenda.clients.CommandScheduler)
  public readonly agendaClient: AgendaClient;

  @inject(BINDINGS.CommandBus)
  protected commandBus: types.CommandBus;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.Serializer)
  protected serializer: types.Serializer;

  @inject(BINDINGS.MongoDB.collections.ScheduledCommands)
  protected collection: Collection;

  @inject(BINDINGS.Agenda.jobTransformer)
  protected jobTransformer: types.AgendaJobTransformer;

  public state: types.State;

  public readonly jobName: string;

  public readonly options?: AgendaConfiguration;

  /**
   * Creates an instance of AgendaCommandScheduler.
   * @param jobName - Name of the job that is being scheduled on Agenda.
   * @param options - Optional options passed to Agenda client.
   */
  constructor(
    jobName = 'send scheduled command',
    options: AgendaConfiguration = {}
  ) {
    super();
    this.jobName = jobName;
    this.options = options;
    this.setState(AgendaCommandScheduler.STATES.constructed);
  }

  /**
   * Starts processing on CommandScheduler.
   */
  public async startScheduling(): Promise<void> {
    if (this.isInState(AgendaCommandScheduler.STATES.active)) {
      return;
    }
    await this.initialize();
    this.setState(AgendaCommandScheduler.STATES.active);
  }

  /**
   * Stops processing on CommandScheduler.
   */
  public async stopScheduling(): Promise<void> {
    if (this.isInState(AgendaCommandScheduler.STATES.stopped)) {
      return;
    }
    this.setState(AgendaCommandScheduler.STATES.stopped);
  }

  /**
   * Initializes Agenda command scheduler.
   * @async
   * @throws {InactiveClientError}
   * Thrown if agenda client is not connected.
   */
  public async initialize(): Promise<void> {
    if (!this.agendaClient.isConnected()) {
      const error = new InactiveClientError(
        this.constructor.name,
        this.agendaClient.getId().toString()
      );

      this.log.error(
        new Log('inactive Agenda client').on(this).in(this.initialize)
      );
      throw error;
    }

    await this.defineJob(
      this.jobName,
      this.options,
      this.handleScheduledCommand
    );
    this.log.debug(
      new Log(
        `defined new Agenda job '${
          this.jobName
        }' for client with id '${this.agendaClient.getId()}'`
      )
        .on(this)
        .in(this.initialize)
    );
    this.setState(AgendaCommandScheduler.STATES.initialized);
  }

  /**
   * Schedules command with Agenda.
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
      await this.agendaClient.library.schedule(
        when,
        this.jobName,
        serializedData
      );

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
   * Unschedules command from Agenda.
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
      const removedCount = await this.agendaClient.library.cancel(mongoQuery);
      const isSuccessful = removedCount > 0;
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
   * Unschedules all commands(jobs matching scheduler's job name) from Agenda.
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
    // Type is wrongly defined on @types/agenda
    const jobs: Agenda.Job[] = await (this.agendaClient.library as any).jobs(
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
   * Agenda job handler for ScheduledCommand.
   * @async
   * @param job - Instance implementing `Agenda.Job` interface.
   */
  public async handleScheduledCommand(job: Agenda.Job): Promise<void> {
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
    return this.agendaClient.getInterval() || 1;
  }

  /**
   * Defines a new job on Agenda.
   * @async
   * @param jobName - Name of a job to define.
   * @param options - Options for Agenda job implementing `Agenda.JobOptions` interface.
   * @param handler - Async function that will handle job upon scheduling it.
   */
  protected async defineJob(
    jobName: string,
    options: Agenda.JobOptions = {},
    handler: (job: Agenda.Job) => Promise<void>
  ): Promise<void> {
    const boundHandler = handler.bind(this);
    boundHandler.original = handler;
    this.agendaClient.library.define(jobName, options, boundHandler);
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
