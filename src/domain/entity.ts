import { classes } from 'polytype';
import { pick } from 'lodash';
import deepcopy from 'deepcopy';
import { StatefulMixin } from '../mixins/stateful-mixin';
import { Serializable } from '../components/serializable';
import { define } from '../decorators/define';
import { Guid } from './value-objects/guid';
import { types } from '../types';
import { StatusfulMixin } from '../mixins/statusful-mixin';
import { StateSaveNotFoundError, AsserterNotFoundError } from './domain-errors';
import {
  SAVED_STATE_KEY,
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
} from '../constants/literal-keys';

@define('Entity')
export class Entity extends classes(
  Serializable,
  StatefulMixin,
  StatusfulMixin
) {
  protected static asserter: types.Asserter;

  public id: string | Guid;

  public state: types.State;

  public status: types.Status;

  public schemaVersion?: number;

  protected [SAVED_STATE_KEY]?: Record<keyof any, any>;

  /**
   * Creates an instance of `Entity`.
   * @param props - Properties of the type required for construction.
   */
  constructor(props: types.Props) {
    super([props]);
  }

  /**
   * Returns identifier for Entity.
   * @return Entities identifier as `Guid` instance or string.
   */
  public getId(): string | Guid {
    return this.id;
  }

  /**
   * Evaluates if one entity is equal to other by its constructor and identifier.
   * @param otherEntity - Other `Entity` instance.
   * @returns Returns `true` if both Entities instances are equal, else `false`.
   */
  public equals(otherEntity: Entity): boolean {
    return (
      otherEntity != null &&
      otherEntity.constructor === this.constructor &&
      otherEntity.getId() === this.id
    );
  }

  /**
   * Assigns validated properties from one or more sources.
   * @param sources - One or more source of properties.
   * @return Returns this instance of `Entity` with new properties assigned.
   * @throws {ValidationError}
   * Thrown if properties does not match prop types of `Entity`.
   * @remarks
   * Works like `Object.assign` with additional validation.
   */
  protected assign(...sources: Record<string, any>[]): this {
    const pickedProps = this.pickProps(...sources);

    this.validateProps({ ...this, ...pickedProps }, this.getPropTypes(), true);

    Object.assign(this, pickedProps);
    return this;
  }

  /**
   * Picks properties matching entity property types from one or more sources.
   * @param sources - One or more source of properties.
   * @return Returns properties picked from sources.
   * @throws {ValidationError}
   * Thrown if properties does not match prop types of Entity.
   */
  protected pickProps(...sources: Record<string, any>[]): Partial<this> {
    const propTypes = this.getPropTypes();
    const propKeys = Object.keys(propTypes);

    const pickedProps = {};
    for (const source of sources) {
      Object.assign(pickedProps, pick(source, propKeys));
    }
    return pickedProps;
  }

  /**
   * Clones entity state while preserving any other nested types.
   * @return Cloned state as an object.
   * @remarks
   * Use with precaution, for internal use case only. Used to make simplified DSL validation.
   */
  public clone(): Record<string, any> {
    const propKeys = Object.keys(this.getPropTypes());
    const copy = deepcopy(this);
    return { ...pick(copy, propKeys) } as Record<string, any>;
  }

  /**
   * Sets current action for asserting state of `Entity`.
   * @param action - Name of action to be taken or `Command` that is handled.
   * @return Instance implementing `Asserter` interface.
   */
  public on(action: string | types.Stringifiable): any {
    const asserter: types.Asserter = (this.constructor as any).getAsserter();
    asserter.setAction(action);
    asserter.setEntity(this);
    // Return as any so assertion extensions can be accessed without TypeScript errors
    return asserter as types.Asserter;
  }

  /**
   * Saves current entity state.
   */
  public [SAVE_STATE_METHOD_KEY](): void {
    this[SAVED_STATE_KEY] = deepcopy(this);
  }

  /**
   * Rollbacks entity to previous state.
   * @throws {StateSaveNotFoundError}
   * Thrown if rollback is done on `Entity` without prior saved state.
   */
  public [ROLLBACK_STATE_METHOD_KEY](): void {
    if (!this.isStateSaved()) {
      throw new StateSaveNotFoundError(
        this.getTypeName(),
        this.getId().toString()
      );
    }
    Object.assign(this, this[SAVED_STATE_KEY]);
    delete this[SAVED_STATE_KEY];
  }

  /**
   * Evaluates if state of entity is saved.
   * @returns Returns `true` if state of entity is saved, else `false`.
   */
  public isStateSaved(): boolean {
    return this[SAVED_STATE_KEY] !== undefined;
  }
}
// Enable conversion of serializable list by default
Entity.enableSerializableLists();
