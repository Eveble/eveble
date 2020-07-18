import { EventSourceable } from './event-sourceable';
import { History } from './history';
import { types } from '../types';
import { Command } from '../components/command';
import { COMMANDS_KEY, EVENTS_KEY } from '../constants/literal-keys';
import { Guid } from './value-objects/guid';
export declare class Aggregate extends EventSourceable {
    id: string | Guid;
    version: number;
    state: types.State;
    status: types.Status;
    metadata?: Record<string, any>;
    schemaVersion?: number;
    [COMMANDS_KEY]: types.Command[];
    [EVENTS_KEY]: types.Event[];
    constructor(arg: History | Command<{}> | types.Props);
}
