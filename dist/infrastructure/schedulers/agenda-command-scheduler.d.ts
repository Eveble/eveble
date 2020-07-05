import Agenda, { AgendaConfiguration } from 'agenda';
import { Collection } from 'mongodb';
import { StatefulMixin } from '../../mixins/stateful-mixin';
import { types } from '../../types';
import { ScheduleCommand } from '../../domain/schedule-command';
import { UnscheduleCommand } from '../../domain/unschedule-command';
import { Guid } from '../../domain/value-objects/guid';
import { AgendaClient } from '../../app/clients/agenda-client';
export declare class AgendaCommandScheduler extends StatefulMixin implements types.CommandScheduler {
    static STATES: {
        constructed: string;
        initialized: string;
        active: string;
        stopped: string;
    };
    readonly agendaClient: AgendaClient;
    protected commandBus: types.CommandBus;
    protected log: types.Logger;
    protected serializer: types.Serializer;
    protected collection: Collection;
    protected jobTransformer: types.AgendaJobTransformer;
    state: types.State;
    readonly jobName: string;
    readonly options?: AgendaConfiguration;
    constructor(jobName?: string, options?: AgendaConfiguration);
    startScheduling(): Promise<void>;
    stopScheduling(): Promise<void>;
    initialize(): Promise<void>;
    schedule(scheduleCommand: ScheduleCommand): Promise<void>;
    unschedule(unscheduleCommand: UnscheduleCommand): Promise<boolean>;
    unscheduleAll(): Promise<void>;
    getJob(commandType: string, assignerId: string | Guid, assignerType: string, assignmentId?: string | Guid): Promise<types.ScheduledJob | undefined>;
    handleScheduledCommand(job: Agenda.Job): Promise<void>;
    getInterval(): number;
    protected defineJob(jobName: string, options: Agenda.JobOptions | undefined, handler: (job: Agenda.Job) => Promise<void>): Promise<void>;
    protected serializeScheduleCommandToData(scheduleCommand: ScheduleCommand): Record<string, any>;
}
