import 'reflect-metadata';
import { injectable } from '@parisholley/inversify-async';
import { getTypeName } from '@eveble/helpers';
import { types } from '../types';
import {
  TypeExistsError,
  UnregistrableTypeError,
  TypeNotFoundError,
} from './core-errors';
import { isSerializable } from '../utils/helpers';

@injectable()
export class Library {
  public static STATES = {
    default: 'default',
    override: 'override',
  };

  protected state: types.State;

  protected types: Map<string, any>;

  /**
   * Creates an instance of Library.
   */
  constructor() {
    this.types = new Map();
    this.setState(Library.STATES.default);
  }

  /**
   * Registers type on library.
   * @param typeName - Type's name for which mapping will be created.
   * @param type - Type constructor implementing `Serializable` interface for registration.
   * @param shouldOverride - Flag indicating that mapping should be overridden if exist.
   * @throws {UnregistrableTypeError}
   * Thrown if type does not implement `Serializable` interface.
   * @throws {TypeExistsError}
   * Thrown if type would overridden on library without explicit call.
   */
  public registerType(
    typeName: types.TypeName,
    type: any,
    shouldOverride = false
  ): void {
    if (!isSerializable(type.prototype)) {
      throw new UnregistrableTypeError(typeName);
    }
    if (this.hasType(typeName)) {
      if (!shouldOverride && !this.isInState(Library.STATES.override)) {
        throw new TypeExistsError(
          getTypeName(this.constructor) as types.TypeName,
          typeName
        );
      }
    }
    this.types.set(typeName, type);
  }

  /**
   * Overrides already existing type by mapping on library.
   * @param typeName - Type for which mapping will be created or overridden.
   * @param type - Type constructor implementing `Serializable` interface for registration.
   */
  public overrideType(typeName: types.TypeName, type: any): void {
    this.registerType(typeName, type, true);
  }

  /**
   * Returns type by name.
   * @param typeName - Type name as mapping for type.
   * @returns Registered type instance, else `undefined`.
   */
  public getType(typeName: types.TypeName): types.Serializable | undefined {
    return this.types.get(typeName);
  }

  /**
   * Returns type by name.
   * @param typeName - Type name as mapping for type.
   * @returns Registered type instance, else throws.
   * @throws {TypeNotFoundError}
   * Thrown if provided type can't be found on library.
   */
  public getTypeOrThrow(typeName: types.TypeName): types.Serializable {
    const type = this.types.get(typeName);
    if (type === undefined) {
      throw new TypeNotFoundError(
        getTypeName(this.constructor) as types.TypeName,
        typeName
      );
    }
    return type;
  }

  /**
   * Returns all registered types on Library.
   * @returns Map of all registered types.
   */
  public getTypes(): Map<string, types.Serializable> {
    return this.types;
  }

  /**
   * Evaluates if type is already registered by name.
   * @param typeName - Type name as mapping for type.
   * @returns Returns `true` if type is registered, else `false`.
   */
  public hasType(typeName: types.TypeName): boolean {
    return this.types.has(typeName);
  }

  /**
   * Removes type by type name.
   * @param typeName - Type name as mapping for type.
   */
  public removeType(typeName: types.TypeName): void {
    this.types.delete(typeName);
  }

  /**
   * Evaluates if target is in expected state.
   * @param state - Expected state in which instance should be.
   * @returns Returns `true` if instance is in state, else `false`.
   */
  public isInState(state: types.State): boolean {
    return this.state === state;
  }

  /**
   * Sets instance state.
   * @param state - State to which instance should be set.
   */
  public setState(state: types.State): void {
    this.state = state;
  }
}
