import { Struct } from './struct';
import { types } from '../types';
declare const Serializable_base: (new (props?: types.Props | undefined) => {
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
} & Struct) & {
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
    prototype: Struct;
    excludedPropTypes?: string[] | undefined;
    getPropTypes: () => types.Props;
    getPropertyInitializers: () => types.Props;
};
export declare class Serializable extends Serializable_base implements types.Ejsonable {
    schemaVersion?: number;
    constructor(props?: types.Props);
    in<T extends types.Serializable>(listName: string): types.List<T>;
    static from(...sources: Record<string, any>[]): any;
}
export {};
