import { ExtendableError } from '@eveble/core';
import { types } from '../types';
export declare class StateError extends ExtendableError {
}
export declare class UndefinedStatesError extends StateError {
    constructor(typeName: types.TypeName);
}
export declare class InvalidStateError extends StateError {
    constructor(typeName: types.TypeName, currentState: types.State, expectedStates: types.State);
}
export declare const StatefulTrait: import("@traits-ts/core").Trait<(base: any) => {
    new (): {
        [x: string]: any;
        state: types.State;
        setState(state: types.State): void;
        isInState(state: types.State | types.State[]): boolean;
        isInOneOfStates(states: types.State | types.State[]): boolean;
        getState(): types.State;
        hasState(): boolean;
        validateState(stateOrStates: types.State | types.State[], error?: Error): boolean;
        getSelectableStates(): Record<string, types.State>;
    };
    [x: string]: any;
}, undefined>;
