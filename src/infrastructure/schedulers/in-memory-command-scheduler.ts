import { inject, injectable } from 'inversify';
import { derive } from '@traits-ts/core';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import { Log } from '../../components/log-entry';
import { StatefulTrait } from '../../traits/stateful.trait';
import { Guid } from '../../domain/value-objects/guid';
import { ScheduleCommand } from '../../domain/schedule-command';
import { UnscheduleCommand } from '../../domain/unschedule-command';
import { ScheduledJob } from '../../infrastructure/structs/scheduled-job';

interface ScheduledJobEntry {
  job: ScheduledJob;
  timeout?: ReturnType<typeof setTimeout>;
  command: types.Command;
  deliverAt: Date;
}

@injectable()
export class InMemoryCommandScheduler
  extends derive(StatefulTrait)
  implements types.CommandScheduler
{
  static STATES = {
    constructed: 'constructed',
    initialized: 'initialized',
    active: 'active',
    stopped: 'stopped',
  };

  @inject(BINDINGS.CommandBus)
  protected commandBus: types.CommandBus;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.Serializer)
  protected serializer: types.Serializer;

  public state: types.State;

  protected jobs: Map<string, ScheduledJobEntry>;

  protected interval: number;

  constructor(interval = 1000) {
    super();
    this.jobs = new Map();
    this.interval = interval;
    this.setState(InMemoryCommandScheduler.STATES.constructed);
  }

  async initialize(): Promise<void> {
    this.setState(InMemoryCommandScheduler.STATES.initialized);
  }

  async startScheduling(): Promise<void> {
    if (this.isInState(InMemoryCommandScheduler.STATES.active)) {
      return;
    }
    if (!this.isInState(InMemoryCommandScheduler.STATES.initialized)) {
      await this.initialize();
    }
    this.setState(InMemoryCommandScheduler.STATES.active);
  }

  async stopScheduling(): Promise<void> {
    if (this.isInState(InMemoryCommandScheduler.STATES.stopped)) {
      return;
    }
    for (const entry of this.jobs.values()) {
      if (entry.timeout !== undefined) {
        clearTimeout(entry.timeout);
        entry.timeout = undefined;
      }
    }
    this.setState(InMemoryCommandScheduler.STATES.stopped);
  }

  async schedule(scheduleCommand: ScheduleCommand): Promise<void> {
    const { command } = scheduleCommand;
    const assignment = command.getAssignment();
    const assignmentId = assignment.assignmentId.toString();
    const deliverAt = assignment.deliverAt;

    this.log.debug(
      new Log(`scheduling command '${assignmentId}'`)
        .on(this)
        .in(this.schedule)
        .with('scheduled command', scheduleCommand)
    );

    const jobId = new Guid().toString();
    const now = new Date();
    const delay = deliverAt.getTime() - now.getTime();

    const scheduledJob = new ScheduledJob({
      id: jobId,
      name: 'send scheduled command',
      state: ScheduledJob.STATES.enqueued,
      priority: 'normal',
      data: {
        id: assignmentId,
        commandType: command.getTypeName(),
        assignerId: assignment.assignerId.toString(),
        assignerType: assignment.assignerType,
        command: this.serializer.stringify(command),
      },
      nextRunAt: deliverAt,
    });

    const timeout =
      delay > 0
        ? setTimeout(async () => {
            await this.executeScheduledCommand(assignmentId, command);
          }, delay)
        : undefined;

    this.jobs.set(assignmentId, {
      job: scheduledJob,
      timeout,
      command,
      deliverAt,
    });

    this.log.debug(
      new Log(`scheduled command '${assignmentId}'`)
        .on(this)
        .in(this.schedule)
        .with('scheduled command', scheduleCommand)
    );
  }

  async unschedule(unscheduleCommand: UnscheduleCommand): Promise<boolean> {
    const { assignmentId, commandType, assignerId, assignerType } =
      unscheduleCommand;

    for (const [key, entry] of this.jobs.entries()) {
      const cmdAssignment = entry.command.getAssignment();
      if (
        cmdAssignment.assignmentId.toString() === assignmentId.toString() &&
        entry.command.getTypeName() === commandType &&
        cmdAssignment.assignerId.toString() === assignerId.toString() &&
        cmdAssignment.assignerType === assignerType
      ) {
        if (entry.timeout !== undefined) {
          clearTimeout(entry.timeout);
        }
        this.jobs.delete(key);

        this.log.debug(
          new Log(`unscheduled command '${assignmentId}'`)
            .on(this)
            .in(this.unschedule)
            .with('unschedule command', unscheduleCommand)
        );
        return true;
      }
    }
    return false;
  }

  async getJob(
    commandType: string,
    assignerId: string | types.Stringifiable,
    assignerType: string,
    assignmentId?: string | types.Stringifiable
  ): Promise<types.ScheduledJob | undefined> {
    for (const entry of this.jobs.values()) {
      const cmdAssignment = entry.command.getAssignment();
      if (
        entry.command.getTypeName() === commandType &&
        cmdAssignment.assignerId.toString() === assignerId.toString() &&
        cmdAssignment.assignerType === assignerType
      ) {
        if (
          assignmentId === undefined ||
          cmdAssignment.assignmentId.toString() === assignmentId.toString()
        ) {
          return entry.job;
        }
      }
    }
    return undefined;
  }

  async unscheduleAll(): Promise<void> {
    for (const entry of this.jobs.values()) {
      if (entry.timeout !== undefined) {
        clearTimeout(entry.timeout);
      }
    }
    this.jobs.clear();
  }

  getInterval(): number {
    return this.interval;
  }

  protected async executeScheduledCommand(
    assignmentId: string,
    command: types.Command
  ): Promise<void> {
    this.log.debug(
      new Log(`handling scheduled command '${assignmentId}'`)
        .on(this)
        .in(this.executeScheduledCommand)
        .with('command', command)
    );

    try {
      await this.commandBus.send(command);
      this.log.debug(
        new Log(`handled scheduled command '${assignmentId}'`)
          .on(this)
          .in(this.executeScheduledCommand)
          .with('command', command)
      );
    } catch (error) {
      this.log.error(
        new Log(
          `failed handling of scheduled command '${assignmentId}' do to error: ${error}`
        )
          .on(this)
          .in(this.executeScheduledCommand)
          .with('command', command)
      );
    }
  }
}
