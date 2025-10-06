import { types } from '../../types';
import { Guid } from '../../domain/value-objects/guid';
import { Struct } from '../../components/struct';
declare const ScheduledJob_base: (new (props?: types.Props | undefined) => {
    [x: string]: any;
    state: types.State;
    setState(state: types.State): void;
    isInState(state: types.State | types.State[]): boolean;
    isInOneOfStates(states: types.State | types.State[]): boolean;
    getState(): types.State;
    hasState(): boolean;
    validateState(stateOrStates: types.State | types.State[], error?: Error | undefined): boolean;
    getSelectableStates(): Record<string, types.State>;
} & Struct) & {
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
} & {
    prototype: Struct;
    excludedPropTypes?: string[] | undefined;
    getPropTypes: () => types.Props;
    getPropertyInitializers: () => types.Props;
};
export declare class ScheduledJob extends ScheduledJob_base implements types.ScheduledJob {
    static STATES: {
        enqueued: string;
        started: string;
        locked: string;
        failed: string;
        completed: string;
        removed: string;
    };
    id: string | Guid;
    state: types.State;
    name: string;
    data: Record<string, any>;
    priority: 'lowest' | 'low' | 'normal' | 'high' | 'highest' | number;
    nextRunAt?: Date;
    completedAt?: Date;
    lockedAt?: Date;
    lastRunAt?: Date;
    failedAt?: Date;
    constructor(props?: types.Props);
}
export {};
