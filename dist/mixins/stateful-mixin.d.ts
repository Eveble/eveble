import { ExtendableError } from '../components/extendable-error';
import { types } from '../types';
export declare class StateError extends ExtendableError {
}
export declare class UndefinedStatesError extends StateError {
    constructor(typeName: types.TypeName);
}
export declare class InvalidStateError extends StateError {
    constructor(typeName: types.TypeName, currentState: types.State, expectedStates: types.State);
}
export declare class StatefulMixin implements types.Stateful {
    state: types.State;
    setState(state: types.State): void;
    isInState(state: types.State | types.State[]): boolean;
    isInOneOfStates(states: types.State | types.State[]): boolean;
    getState(): types.State;
    hasState(): boolean;
    validateState(stateOrStates: types.State | types.State[], error?: Error): boolean;
    getSelectableStates(): Record<string, types.State>;
}
