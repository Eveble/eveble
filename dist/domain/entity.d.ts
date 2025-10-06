import { Serializable } from '../components/serializable';
import { Guid } from './value-objects/guid';
import { types } from '../types';
import { SAVE_STATE_METHOD_KEY, ROLLBACK_STATE_METHOD_KEY, ENABLE_ACTION_VALIDATION_METHOD_KEY, DISABLE_ACTION_VALIDATION_METHOD_KEY, IS_ACTION_VALIDATED_METHOD_KEY } from '../constants/literal-keys';
declare const Entity_base: (new (props?: types.Props | undefined) => {
    [x: string]: any;
    state: types.State;
    setState(state: types.State): void;
    isInState(state: types.State | types.State[]): boolean;
    isInOneOfStates(states: types.State | types.State[]): boolean;
    getState(): types.State;
    hasState(): boolean;
    validateState(stateOrStates: types.State | types.State[], error?: Error | undefined): boolean;
    getSelectableStates(): Record<string, types.State>;
} & {
    [x: string]: any;
    status: types.Status;
    setStatus(status: types.Status): void;
    isInStatus(status: types.Status | types.Status[]): boolean;
    isInOneOfStatuses(status: types.Status | types.Status[]): boolean;
    getStatus(): types.Status;
    hasStatus(): boolean;
    validateStatus(statusOrStatuses: types.Status | types.Status[], error?: Error | undefined): boolean;
    getSelectableStatuses(): Record<string, types.Status>;
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
    [x: string]: any;
    prototype: {
        [x: string]: any;
        status: types.Status;
        setStatus(status: types.Status): void;
        isInStatus(status: types.Status | types.Status[]): boolean;
        isInOneOfStatuses(status: types.Status | types.Status[]): boolean;
        getStatus(): types.Status;
        hasStatus(): boolean;
        validateStatus(statusOrStatuses: types.Status | types.Status[], error?: Error | undefined): boolean;
        getSelectableStatuses(): Record<string, types.Status>;
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
export declare class Entity extends Entity_base implements types.Entity {
    [key: symbol]: any;
    protected static asserter: types.Asserter;
    id: string | Guid;
    state: types.State;
    status: types.Status;
    schemaVersion?: number;
    constructor(props: types.Props);
    getId(): string | Guid;
    equals(otherEntity: Entity): boolean;
    protected assign(...sources: Record<string, any>[]): this;
    protected pickProps(...sources: Record<string, any>[]): Partial<this>;
    on(action: string | types.Stringifiable): this;
    get ensure(): this & {
        [key: string]: any;
    };
    get ableTo(): this;
    get is(): this & {
        [key: string]: any;
    };
    get can(): any;
    [SAVE_STATE_METHOD_KEY](): void;
    [ENABLE_ACTION_VALIDATION_METHOD_KEY](): void;
    [DISABLE_ACTION_VALIDATION_METHOD_KEY](): void;
    [IS_ACTION_VALIDATED_METHOD_KEY](): boolean;
    [ROLLBACK_STATE_METHOD_KEY](): void;
    isStateSaved(): boolean;
}
export {};
