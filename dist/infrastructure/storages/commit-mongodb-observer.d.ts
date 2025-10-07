import { ChangeStream, Collection } from 'mongodb';
import { types } from '../../types';
declare const CommitMongoDBObserver_base: (new () => {
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
export declare class CommitMongoDBObserver extends CommitMongoDBObserver_base {
    protected collection: Collection;
    protected storage: types.CommitStorage;
    protected log: types.Logger;
    protected config: types.Configurable;
    static STATES: {
        created: string;
        observing: string;
        paused: string;
        closed: string;
        finished: string;
        ended: string;
        failed: string;
    };
    state: types.State;
    changeStream?: ChangeStream;
    constructor();
    startObserving(commitPublisher: types.CommitPublisher): Promise<void>;
    pauseObserving(): Promise<void>;
    stopObserving(): Promise<void>;
    isObserving(): boolean;
    initializeEventHandlers(): Promise<void>;
    protected isInProduction(): boolean;
}
export {};
