import { types } from '../types';
declare const Struct_base: (new () => {
    [x: string]: any;
    getPropTypes(): types.Props;
    getPropertyInitializers(): types.Props;
    getInstanceInitializers(): types.Props;
    getParentInitializers(): types.Props;
    toPlainObject(): types.Props;
    validateProps(props: types.Props | undefined, propTypes: types.PropTypes, isStrict?: boolean): boolean;
    equals(other: any): boolean;
    hasSameValues(other: types.Typed): boolean;
} & {
    [x: string]: any;
    registerHook(action: string, id: string, hook: types.AnyFunction, shouldOverride?: boolean): void;
    overrideHook(action: string, id: string, hook: types.AnyFunction): void;
    getHook(action: string, id: string): types.AnyFunction | undefined;
    getHookOrThrow(action: string, id: string): types.AnyFunction;
    getHooks(action: string): types.hooks.Mappings;
    getActions(): types.hooks.Actions;
    hasHook(action: string, id: string): boolean;
    hasAction(action: string): boolean;
    removeHook(action: string, id: string): void;
}) & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        getPropTypes(): types.Props;
        getPropertyInitializers(): types.Props;
        getInstanceInitializers(): types.Props;
        getParentInitializers(): types.Props;
        toPlainObject(): types.Props;
        validateProps(props: types.Props | undefined, propTypes: types.PropTypes, isStrict?: boolean): boolean;
        equals(other: any): boolean;
        hasSameValues(other: types.Typed): boolean;
    };
    excludedPropTypes?: string[] | undefined;
    getPropTypes: () => types.Props;
    getPropertyInitializers: () => types.Props;
} & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        registerHook(action: string, id: string, hook: types.AnyFunction, shouldOverride?: boolean): void;
        overrideHook(action: string, id: string, hook: types.AnyFunction): void;
        getHook(action: string, id: string): types.AnyFunction | undefined;
        getHookOrThrow(action: string, id: string): types.AnyFunction;
        getHooks(action: string): types.hooks.Mappings;
        getActions(): types.hooks.Actions;
        hasHook(action: string, id: string): boolean;
        hasAction(action: string): boolean;
        removeHook(action: string, id: string): void;
    };
};
export declare class Struct extends Struct_base {
    constructor(props?: types.Props);
    protected construct(props?: types.Props): void;
    protected processProps(props?: types.Props): types.Props;
    protected onConstruction(props: types.Props): types.Props;
    protected onValidation(props: types.Props): boolean;
}
export {};
