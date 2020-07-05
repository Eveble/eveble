import { types } from '../types';
import { ExtendableError } from '../components/extendable-error';
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
export declare class VersionableMixin {
    schemaVersion?: number;
    transformLegacyProps(props: types.Props): types.Props;
    protected getCurrentSchemaVersion(): number;
    protected isLegacySchemaVersion(instanceVersion: number, currentVersion: number): boolean;
    protected calculateNextSchemaVersion(instanceVersion?: number): number;
    registerLegacyTransformer(schemaVersion: number, transformer: types.Hook, shouldOverride?: boolean): void;
    overrideLegacyTransformer(schemaVersion: number, transformer: types.Hook): void;
    hasLegacyTransformer(schemaVersion: number): boolean;
    getLegacyTransformers(): types.LegacyTransformers;
    getLegacyTransformer(schemaVersion: number): types.Hook;
    getSchemaVersion(): number | undefined;
}
