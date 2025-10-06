/// <reference types="node" />
import { ExtendableError } from '@eveble/core';
import { types } from '../types';
declare const SerializableError_base: (new (messageOrProps?: string | import("@eveble/core/dist/types").types.ErrorProps | undefined) => {
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
} & {
    [x: string]: any;
    typeName(): string;
    getTypeName(): string;
    toString(): string;
    toJSONValue(): Record<string, any>;
} & {
    [x: string]: any;
    getTypeName(): string;
    toString(): string;
    toJSONValue(): Record<string, any>;
} & {
    [x: string]: any;
    schemaVersion?: number | undefined;
    transformLegacyProps(props: types.Props): types.Props;
    getCurrentSchemaVersion(): number;
    isLegacySchemaVersion(instanceVersion: number, currentVersion: number): boolean;
    calculateNextSchemaVersion(instanceVersion?: number): number;
    registerLegacyTransformer(schemaVersion: number, transformer: types.AnyFunction, shouldOverride?: boolean): void;
    overrideLegacyTransformer(schemaVersion: number, transformer: types.AnyFunction): void;
    hasLegacyTransformer(schemaVersion: number): boolean;
    getLegacyTransformers(): types.LegacyTransformers;
    getLegacyTransformer(schemaVersion: number): types.AnyFunction;
    getSchemaVersion(): number | undefined;
} & ExtendableError) & {
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
} & {
    prototype: {
        [x: string]: any;
        typeName(): string;
        getTypeName(): string;
        toString(): string;
        toJSONValue(): Record<string, any>;
    };
    typeName: () => string;
    toString: () => string;
    getTypeName: () => string;
} & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        getTypeName(): string;
        toString(): string;
        toJSONValue(): Record<string, any>;
    };
    toString: () => string;
    getTypeName: () => string;
} & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        schemaVersion?: number | undefined;
        transformLegacyProps(props: types.Props): types.Props;
        getCurrentSchemaVersion(): number;
        isLegacySchemaVersion(instanceVersion: number, currentVersion: number): boolean;
        calculateNextSchemaVersion(instanceVersion?: number): number;
        registerLegacyTransformer(schemaVersion: number, transformer: types.AnyFunction, shouldOverride?: boolean): void;
        overrideLegacyTransformer(schemaVersion: number, transformer: types.AnyFunction): void;
        hasLegacyTransformer(schemaVersion: number): boolean;
        getLegacyTransformers(): types.LegacyTransformers;
        getLegacyTransformer(schemaVersion: number): types.AnyFunction;
        getSchemaVersion(): number | undefined;
    };
} & {
    prototype: ExtendableError;
    captureStackTrace: (targetObject: object, constructorOpt?: Function | undefined) => void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare abstract class SerializableError extends SerializableError_base implements types.Versionable, types.Ejsonable {
    name: string;
    message: string;
    stack?: string;
    code?: number;
    schemaVersion?: number;
    constructor(propsOrMessage?: types.Props | string);
    protected processProps(props?: types.Props): types.Props;
    protected onConstruction(props: types.Props): types.Props;
    protected onValidation(props: types.Props): boolean;
}
export {};
