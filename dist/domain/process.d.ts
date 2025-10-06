import { EventSourceable } from './event-sourceable';
import { types } from '../types';
import { Guid } from './value-objects/guid';
import { COMMANDS_KEY, EVENTS_KEY } from '../constants/literal-keys';
export declare class Process extends EventSourceable {
    static correlationKey?: string;
    id: string | Guid;
    version: number;
    state: types.State;
    status: types.Status;
    metadata?: Record<string, any>;
    schemaVersion?: number;
    [COMMANDS_KEY]: types.Command[];
    [EVENTS_KEY]: types.Event[];
    constructor(arg: types.Command | types.Event | types.Event[] | types.Props);
    static getCorrelationKey(): string;
    static setCorrelationKey(key: string): void;
    getCorrelationKey(): string;
    trigger(command: types.Command): void;
    protected validateEventApplicability(): boolean;
}
