import { type Job, DefineOptions } from '@pulsecron/pulse';
import { Collection } from 'mongodb';
import { types } from '../../types';
import { ScheduleCommand } from '../../domain/schedule-command';
import { UnscheduleCommand } from '../../domain/unschedule-command';
import { Guid } from '../../domain/value-objects/guid';
import { PulseClient } from '../../app/clients/pulse-client';
declare const PulseCommandScheduler_base: (new () => {
    [x: string]: any;
    state: types.State;
    setState(state: types.State): void;
    isInState(state: types.State | types.State[]): boolean;
    isInOneOfStates(states: types.State | types.State[]): boolean;
    getState(): types.State;
    hasState(): boolean;
    validateState(stateOrStates: types.State | types.State[], error?: Error | undefined): boolean;
    getSelectableStates(): Record<string, types.State>;
}) & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        state: types.State;
        setState(state: types.State): void;
        isInState(state: types.State | types.State[]): boolean;
        isInOneOfStates(states: types.State | types.State[]): boolean;
        getState(): types.State;
        hasState(): boolean;
        validateState(stateOrStates: types.State | types.State[], error?: Error | undefined): boolean;
        getSelectableStates(): Record<string, types.State>;
    };
};
export declare class PulseCommandScheduler extends PulseCommandScheduler_base implements types.CommandScheduler {
    static STATES: {
        constructed: string;
        initialized: string;
        active: string;
        stopped: string;
    };
    readonly pulseClient: PulseClient;
    protected commandBus: types.CommandBus;
    protected log: types.Logger;
    protected serializer: types.Serializer;
    protected collection: Collection;
    protected jobTransformer: types.PulseJobTransformer;
    state: types.State;
    readonly jobName: string;
    readonly options?: DefineOptions;
    constructor(jobName?: string, options?: DefineOptions);
    startScheduling(): Promise<void>;
    stopScheduling(): Promise<void>;
    initialize(): Promise<void>;
    schedule(scheduleCommand: ScheduleCommand): Promise<void>;
    unschedule(unscheduleCommand: UnscheduleCommand): Promise<boolean>;
    unscheduleAll(): Promise<void>;
    getJob(commandType: string, assignerId: string | Guid, assignerType: string, assignmentId?: string | Guid): Promise<types.ScheduledJob | undefined>;
    handleScheduledCommand(job: Job): Promise<void>;
    getInterval(): number;
    protected defineJob(jobName: string, options: DefineOptions | undefined, handler: (job: Job) => Promise<void>): Promise<void>;
    protected serializeScheduleCommandToData(scheduleCommand: ScheduleCommand): Record<string, any>;
}
export {};
