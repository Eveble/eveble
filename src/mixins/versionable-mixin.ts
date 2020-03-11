import { isNumber } from 'lodash';
import { getTypeName } from '@eveble/helpers';
import { injectable } from '@parisholley/inversify-async';
import { types } from '../types';
import {
  LEGACY_TRANSFORMERS_CONTAINER_KEY,
  VERSIONABLE_KEY,
} from '../constants/metadata-keys';
import { kernel } from '../core/kernel';
import { ExtendableError } from '../components/extendable-error';

export class VersionableError extends ExtendableError {}

export class InvalidSchemaVersionError extends VersionableError {
  constructor(typeName: types.TypeName, got: any) {
    super(`${typeName}: schema version must be a number, got ${got}`);
  }
}

export class LegacyTransformerAlreadyExistsError extends VersionableError {
  constructor(typeName: types.TypeName, schemaVersion: number) {
    super(
      `${typeName}: legacy transformer for schema version ${schemaVersion} already exists`
    );
  }
}

export class LegacyTransformerNotFoundError extends VersionableError {
  constructor(typeName: types.TypeName, schemaVersion: number) {
    super(
      `${typeName}: legacy transformer for schema version ${schemaVersion} was not found`
    );
  }
}
export class InvalidLegacyTransformerError extends VersionableError {
  constructor(
    typeName: types.TypeName,
    propertyKey: string,
    schemaVersion: number
  ) {
    super(
      `${typeName}: declared legacy transformer under key '${propertyKey}' for schema version of ${schemaVersion} must be annotating method`
    );
  }
}
export class NotVersionableError extends VersionableError {
  constructor(typeName: types.TypeName) {
    super(
      `${typeName}: class must implement Versionable and Hookable interfaces`
    );
  }
}

@injectable()
export class VersionableMixin {
  public schemaVersion?: number;

  /**
   * Registrable hook for transforming legacy schema.
   * @param props - Properties object to be transformed.
   * @returns Transformed legacy properties or thier unchanged state if up to date.
   */
  public transformLegacyProps(props: types.Props): types.Props {
    const instanceSchemaVersion: number = props.schemaVersion || 0;
    const currentSchemaVersion: number = this.getCurrentSchemaVersion();
    // Only require schemaVersion to be present on versions above 0
    if (
      this.isLegacySchemaVersion(instanceSchemaVersion, currentSchemaVersion)
    ) {
      const nextSchemaVersion = this.calculateNextSchemaVersion(
        instanceSchemaVersion
      );
      for (
        let version = nextSchemaVersion;
        version <= currentSchemaVersion;
        version++
      ) {
        const transformerMethod: types.Hook = this.getLegacyTransformer(
          version
        );
        transformerMethod(props);
      }
      props.schemaVersion = currentSchemaVersion;
    }
    return props;
  }

  /**
   * Returns current schema version.
   * @returns Current schema version as a number.
   */
  protected getCurrentSchemaVersion(): number {
    const transformers: types.LegacyTransformers = this.getLegacyTransformers();
    if (transformers.size === 0) {
      return 0;
    }

    const schemaVersions: number[] = Array.from(transformers.keys());
    const sortedSchemaVersions = schemaVersions.sort(
      (a: number, b: number): number => b - a
    );
    return sortedSchemaVersions[0];
  }

  /**
   * Evaluates if provided schema version from properties is a legacy one.
   * @param  instanceVersion - Schema version provided on properties that would be assigned to instance.
   * @param  currentVersion - Schema version of current type(class).
   * @returns Returns `true` if schema version is legacy, else `false`.
   */
  protected isLegacySchemaVersion(
    instanceVersion: number,
    currentVersion: number
  ): boolean {
    return currentVersion > instanceVersion;
  }

  /**
   * Calculates next schema version.
   * @param  instanceVersion - Schema version provided on properties that would be assigned to instance.
   * @return Calculated next schema version.
   */
  protected calculateNextSchemaVersion(instanceVersion = 0): number {
    return instanceVersion + 1;
  }

  /**
   * Registers legacy transformer for version.
   * @param schemaVersion - Schema version.
   * @param transformer - Transformer function.
   * @param shouldOverride - Flag indicating that transformer should be overridden if exist.
   * @throws {InvalidSchemaVersionError}
   * Thrown if the the schema version argument is not a number.
   * @throws {LegacyTransformerAlreadyExistsError}
   * Thrown if transformer for version would overridden without explicit call.
   */
  public registerLegacyTransformer(
    schemaVersion: number,
    transformer: types.Hook,
    shouldOverride = false
  ): void {
    if (!isNumber(schemaVersion)) {
      throw new InvalidSchemaVersionError(
        getTypeName(this.constructor) as types.TypeName,
        kernel.describer.describe(schemaVersion)
      );
    }

    if (this.hasLegacyTransformer(schemaVersion) && !shouldOverride) {
      throw new LegacyTransformerAlreadyExistsError(
        getTypeName(this.constructor) as types.TypeName,
        schemaVersion
      );
    }

    const typeName = getTypeName(this.constructor);
    const isVersionable: boolean =
      Reflect.getMetadata(VERSIONABLE_KEY, this.constructor) === typeName;
    if (!isVersionable) {
      Reflect.defineMetadata(
        LEGACY_TRANSFORMERS_CONTAINER_KEY,
        new Map(),
        this.constructor.prototype
      );
      // Flag that target is versionable for further reference
      Reflect.defineMetadata(VERSIONABLE_KEY, typeName, this.constructor);
    }
    const transformers: types.LegacyTransformers = this.getLegacyTransformers();
    transformers.set(schemaVersion, transformer);
  }

  /**
   * Overrides registered transformer by schema version or registers a new one.
   * @param schemaVersion - Schema version.
   * @param transformer - Transformer function.
   * @throws {InvalidSchemaVersionError}
   * Thrown if the the schema version argument is not a number.
   */
  public overrideLegacyTransformer(
    schemaVersion: number,
    transformer: types.Hook
  ): void {
    this.registerLegacyTransformer(schemaVersion, transformer, true);
  }

  /**
   * Evaluates is there is registered legacy transformer for schema version.
   * @param schemaVersion - Schema version.
   * @returns Returns `true` if legacy transformer for schema version is registered, else `false`.
   */
  public hasLegacyTransformer(schemaVersion: number): boolean {
    return this.getLegacyTransformers().has(schemaVersion);
  }

  /**
   * Returns all available legacy transformers.
   * @return Map instance of all registered legacy transformers with number version as a key and transformer function as a value.
   */
  public getLegacyTransformers(): types.LegacyTransformers {
    const transformers: types.LegacyTransformers = Reflect.getOwnMetadata(
      LEGACY_TRANSFORMERS_CONTAINER_KEY,
      this.constructor.prototype
    );
    return transformers || new Map();
  }

  /**
   * Returns legacy transformer for schema version.
   * @param schemaVersion - Schema version.
   * @returns Legacy transformer for schema version.
   * @throws {LegacyTransformerNotFoundError}
   * Thrown if transformer for schema version can't be found.
   */
  public getLegacyTransformer(schemaVersion: number): types.Hook {
    const typeName: types.TypeName = getTypeName(this.constructor) || '';
    const transformers: types.LegacyTransformers = this.getLegacyTransformers();

    if (!transformers.has(schemaVersion)) {
      throw new LegacyTransformerNotFoundError(typeName, schemaVersion);
    }

    return transformers.get(schemaVersion) as types.Hook;
  }

  /**
   * Returns current instance schema version.
   * @returns Schema version as a number, else `undefined`.
   */
  public getSchemaVersion(): number | undefined {
    return this.schemaVersion;
  }
}
