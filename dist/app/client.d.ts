import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
declare const Client_base: (new () => {
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
export declare class Client extends Client_base {
    static STATES: {
        constructed: string;
        initialized: string;
        connected: string;
        paused: string;
        stopped: string;
        disconnected: string;
        failed: string;
    };
    id: string | Guid;
    state: types.State;
    constructor(props?: types.Props);
    getId(): string | Guid;
}
export {};
