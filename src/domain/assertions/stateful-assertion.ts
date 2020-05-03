import { Assertion } from '../assertion';
import { define } from '../../decorators/define';
import { types } from '../../types';
import { AssertionError, UndefinedActionError } from '../domain-errors';
import { DomainError } from '../domain-error';

@define('InvalidStateTransitionError')
export class InvalidStateTransitionError extends AssertionError {
  entityName: string;

  entityId: string;

  currentState: string;

  expectedStates: string[];

  action: string;

  constructor(
    entityName: string,
    entityId: string,
    currentState: string,
    expected: string,
    action: string
  ) {
    const message = `${entityName}: cannot '${action}' when in '${currentState}' state(expected states: '${expected}')`;
    const expectedStates = expected.split(', ');
    super({
      message,
      entityName,
      entityId,
      currentState,
      expectedStates,
      action,
    });
  }
}

export class StatefulAssertion extends Assertion {
  public api: Map<string, Function> = new Map([
    ['ensure.is.inState', this.ensureIsInState as Function],
    ['ensure.is.not.inState', this.ensureIsNotInState as Function],
    ['ensure.is.inOneOfStates', this.ensureIsInOneOfStates as Function],
    ['ensure.is.not.inOneOfStates', this.ensureIsNotInOneOfStates as Function],
  ]);

  /**
   * Ensures that `Entity` is expected state.
   * @param expectedState - Expected state that `Entity` should be in.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @returns `Asserter` implementation instance.
   */
  public ensureIsInState(
    expectedState: types.State,
    error?: DomainError
  ): types.Asserter {
    if (!this.asserter.getEntity().isInState(expectedState)) {
      this.failAssertion(expectedState, 'ensure.is.inState', error);
    }
    return this.asserter;
  }

  /**
   * Ensures that `Entity` is NOT in expected state.
   * @param expectedState - Expected state that `Entity` shouldn't be in.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @returns `Asserter` implementation instance.
   */
  public ensureIsNotInState(
    expectedState: types.State,
    error?: DomainError
  ): types.Asserter {
    if (this.asserter.getEntity().isInState(expectedState)) {
      this.failAssertion(expectedState, 'ensure.is.not.inState', error);
    }
    return this.asserter;
  }

  /**
   * Ensures that `Entity` is one of expected states.
   * @param expectedStates - Expected list of states in one of which `Entity` should be.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @returns `Asserter` implementation instance.
   */
  public ensureIsInOneOfStates(
    expectedStates: types.State[],
    error?: DomainError
  ): types.Asserter {
    if (!this.asserter.getEntity().isInOneOfStates(expectedStates)) {
      this.failAssertion(
        expectedStates.join(', '),
        'ensure.is.inOneOfStates',
        error
      );
    }
    return this.asserter;
  }

  /**
   * Ensures that `Entity` is NOT in one of expected states.
   * @param expectedStates - Expected list of states in one of which `Entity` shouldn't be.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @returns `Asserter` implementation instance.
   */
  public ensureIsNotInOneOfStates(
    expectedStates: types.State[],
    error?: DomainError
  ): types.Asserter {
    if (this.asserter.getEntity().isInOneOfStates(expectedStates)) {
      this.failAssertion(
        expectedStates.join(', '),
        'ensure.is.not.inOneOfStates',
        error
      );
    }
    return this.asserter;
  }

  /**
   * Throws error on failed assertion - on invalid state of `Entity`.
   * @param expectedState - Expected state on `Entity`.
   * @param api - Api path that is being invoked.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @throws {DomainError}
   * Thrown if an error is passed as argument.
   * @throws {UndefinedActionError}
   * Thrown if action is not set on `Asserter`.
   * @throws {InvalidStateTransitionError}
   * Thrown if custom error is not provided.
   */
  protected failAssertion(
    expectedState: types.State,
    api: string,
    error?: DomainError
  ): void {
    if (error !== undefined) {
      throw error;
    } else {
      if (!this.asserter.hasAction()) {
        throw new UndefinedActionError(
          this.asserter.getEntity().getTypeName(),
          api
        );
      }
      let action = this.asserter.getAction() as
        | types.Stringifiable
        | types.MessageType<types.Message>;
      if (
        (action as types.MessageType<types.Message>).getTypeName !== undefined
      ) {
        action = (action as types.MessageType<types.Message>).getTypeName();
      }
      throw new InvalidStateTransitionError(
        this.asserter.getEntity().getTypeName(),
        this.asserter
          .getEntity()
          .getId()
          .toString(),
        this.asserter.getEntity().getState() as string,
        expectedState as string,
        action.toString()
      );
    }
  }
}
