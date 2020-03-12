import { isEmpty } from 'lodash';
import { OneOf } from 'typend';
import { getTypeName } from '@eveble/helpers';
import { injectable } from '@parisholley/inversify-async';
import { ExtendableError } from '../components/extendable-error';
import { kernel } from '../core/kernel';
import { types } from '../types';

export class StateError extends ExtendableError {}

export class UndefinedStatesError extends StateError {
  constructor(typeName: types.TypeName) {
    super(
      `${typeName}: states are not defined. Please define states as class(MyClass.STATES) property or define your getter as MyClass.prototype.getAvailableStates`
    );
  }
}

export class InvalidStateError extends StateError {
  constructor(
    typeName: types.TypeName,
    currentState: types.State,
    expectedStates: types.State
  ) {
    super(
      `${typeName}: expected current state of '${currentState}' to be in one of states: '${expectedStates}'`
    );
  }
}

@injectable()
export class StatefulMixin implements types.Stateful {
  public state: types.State;

  /**
   * Sets instance state.
   * @param state - State to which instance should be set.
   * @throws {ValidationError}
   * Thrown if the provided state does not match one of the selectable states.
   * @throws {UndefinedStatesError}
   * Thrown if the instance does not have any states assigned.
   */
  public setState(state: types.State): void {
    const selectableStates = this.getSelectableStates();
    if (isEmpty(selectableStates)) {
      const typeName: types.TypeName = getTypeName(
        this.constructor
      ) as types.TypeName;
      throw new UndefinedStatesError(typeName);
    }

    const oneOfSelectableStates: types.State[] = Object.values(
      selectableStates
    );

    if (kernel.isValidating()) {
      const pattern = new OneOf(...oneOfSelectableStates);
      kernel.validator.validate(state, pattern);
    }

    this.state = state;
  }

  /**
   * Evaluates if target is in expected state.
   * @param state - Expected state in which instance should be.
   * @returns Returns `true` if instance is in state, else `false`.
   */
  public isInState(state: types.State | types.State[]): boolean {
    if (Array.isArray(state)) {
      return this.isInOneOfStates(state);
    }
    return this.state === state;
  }

  /**
   * Evaluates if target is in one of expected state.
   * @param states - Expected states in which one of instance should be.
   * @returns Returns true if instance is in one of states, else false.
   */
  public isInOneOfStates(states: types.State | types.State[]): boolean {
    const expectedStates: types.State[] = Array.isArray(states)
      ? states
      : [states];
    return expectedStates.includes(this.state);
  }

  /**
   * Returns current state of instance.
   * @returns Current state of instance as `string`.
   */
  public getState(): types.State {
    return this.state;
  }

  /**
   * Evaluates if target has state set on instance(is not `nil`).
   * @returns Returns `true` if instance has state set(not `nil`), else `false`.
   */
  public hasState(): boolean {
    return this.state != null;
  }

  /**
   * Validates if instance is in allowed state(s).
   * @param  stateOrStates - Expected states list in one of which instance should be.
   * @param error - Optional error instance for case where state does not match expected one.
   * @returns Returns `true` if instance is in correct state, else throws.
   * @throws {InvalidStateError}
   * Thrown if target is not in correct(one of allowed) state.
   */
  public validateState(
    stateOrStates: types.State | types.State[],
    error?: Error
  ): boolean {
    const expectedStates: types.State[] = Array.isArray(stateOrStates)
      ? stateOrStates
      : [stateOrStates];

    if (!this.isInOneOfStates(expectedStates)) {
      if (error !== undefined) {
        throw error;
      }
      const typeName: types.TypeName = getTypeName(
        this.constructor
      ) as types.TypeName;
      throw new InvalidStateError(
        typeName,
        this.state,
        expectedStates.join(', ')
      );
    }
    return true;
  }

  /**
   * Returns all selectable states.
   * @returns Collection of available states.
   */
  public getSelectableStates(): Record<string, types.State> {
    return (this.constructor as any).STATES;
  }
}
