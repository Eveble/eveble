import { types } from '../../types';
import { Serializable } from '../../components/serializable';
declare const CommitReceiver_base: (new (props?: types.Props | undefined) => {
    [x: string]: any;
    state: types.State;
    setState(state: types.State): void;
    isInState(state: types.State | types.State[]): boolean;
    isInOneOfStates(states: types.State | types.State[]): boolean;
    getState(): types.State;
    hasState(): boolean;
    validateState(stateOrStates: types.State | types.State[], error?: Error | undefined): boolean;
    getSelectableStates(): Record<string, types.State>;
} & Serializable) & {
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
    prototype: Serializable;
    from: typeof Serializable.from;
    typeName: () => string;
    toString: (() => string) & (() => string) & (() => string);
    getTypeName: () => string;
    excludedPropTypes?: string[] | undefined;
    getPropTypes: () => types.Props;
    getPropertyInitializers: () => types.Props;
};
export declare class CommitReceiver extends CommitReceiver_base implements types.CommitReceiver {
    static STATES: {
        received: string;
        published: string;
        timeouted: string;
        failed: string;
    };
    state: types.State;
    appId: string;
    workerId?: string;
    receivedAt: Date;
    publishedAt?: Date;
    failedAt?: Date;
    constructor(props?: types.Props);
    getCurrentTime(): Date;
    flagAsReceived(workerId: string): void;
    flagAsPublished(workerId: string): void;
    flagAsTimeouted(workerId: string): void;
    flagAsFailed(workerId: string): void;
}
export declare class Commit extends Serializable implements types.Commit {
    id: string;
    sourceId: string;
    version: number;
    eventSourceableType: string;
    commands: types.Command[];
    events: types.Event[];
    insertedAt: Date;
    sentBy: string;
    receivers: CommitReceiver[];
    getEventTypeNames(): types.TypeName[];
    getCommandTypeNames(): types.TypeName[];
    addReceiver(receiver: CommitReceiver): void;
    getReceiver(appId: string): CommitReceiver | undefined;
}
export {};
