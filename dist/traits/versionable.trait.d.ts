import { ExtendableError } from '@eveble/core';
import { types } from '../types';
export declare class VersionableError extends ExtendableError {
}
export declare class InvalidSchemaVersionError extends VersionableError {
    constructor(typeName: types.TypeName, got: any);
}
export declare class LegacyTransformerAlreadyExistsError extends VersionableError {
    constructor(typeName: types.TypeName, schemaVersion: number);
}
export declare class LegacyTransformerNotFoundError extends VersionableError {
    constructor(typeName: types.TypeName, schemaVersion: number);
}
export declare class InvalidLegacyTransformerError extends VersionableError {
    constructor(typeName: types.TypeName, propertyKey: string, schemaVersion: number);
}
export declare class NotVersionableError extends VersionableError {
    constructor(typeName: types.TypeName);
}
export declare const VersionableTrait: import("@traits-ts/core").Trait<(base: any) => {
    new (): {
        [x: string]: any;
        schemaVersion?: number | undefined;
        transformLegacyProps(props: types.Props): types.Props;
        getCurrentSchemaVersion(): number;
        isLegacySchemaVersion(instanceVersion: number, currentVersion: number): boolean;
        calculateNextSchemaVersion(instanceVersion?: number): number;
        registerLegacyTransformer(schemaVersion: number, transformer: types.Hook, shouldOverride?: boolean): void;
        overrideLegacyTransformer(schemaVersion: number, transformer: types.Hook): void;
        hasLegacyTransformer(schemaVersion: number): boolean;
        getLegacyTransformers(): types.LegacyTransformers;
        getLegacyTransformer(schemaVersion: number): types.Hook;
        getSchemaVersion(): number | undefined;
    };
    [x: string]: any;
}, undefined>;
