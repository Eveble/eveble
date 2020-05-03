import { Assertion } from '../assertion';
import { DomainError } from '../domain-error';
import { define } from '../../decorators/define';
import { types } from '../../types';
import { UndefinedActionError, AssertionError } from '../domain-errors';

@define('InvalidStatusTransitionError')
export class InvalidStatusTransitionError extends AssertionError {
  entityName: string;

  entityId: string;

  currentStatus: string;

  expectedStatuses: string[];

  action: string;

  constructor(
    entityName: string,
    entityId: string,
    currentStatus: string,
    expected: string,
    action: string
  ) {
    const message = `${entityName}: cannot '${action}' when in '${currentStatus}' status(expected statuses: '${expected}')`;
    const expectedStatuses = expected.split(', ');
    super({
      message,
      entityName,
      entityId,
      currentStatus,
      expectedStatuses,
      action,
    });
  }
}

export class StatusfulAssertion extends Assertion {
  public api: Map<string, Function> = new Map([
    ['ensure.is.inStatus', this.ensureIsInStatus as Function],
    ['ensure.is.not.inStatus', this.ensureIsNotInStatus as Function],
    ['ensure.is.inOneOfStatuses', this.ensureIsInOneOfStatuses as Function],
    [
      'ensure.is.not.inOneOfStatuses',
      this.ensureIsNotInOneOfStatuses as Function,
    ],
  ]);

  /**
   * Ensures that `Entity` is expected status.
   * @param expectedStatus - Expected status that `Entity` should be in.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @returns `Asserter` implementation instance.
   */
  public ensureIsInStatus(
    expectedStatus: types.Status,
    error?: DomainError
  ): types.Asserter {
    if (!this.asserter.getEntity().isInStatus(expectedStatus)) {
      this.failAssertion(expectedStatus, 'ensure.is.inStatus', error);
    }
    return this.asserter;
  }

  /**
   * Ensures that `Entity` is NOT in expected status.
   * @param expectedStatus - Expected status that `Entity` shouldn't be in.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @returns `Asserter` implementation instance.
   */
  public ensureIsNotInStatus(
    expectedStatus: types.Status,
    error?: DomainError
  ): types.Asserter {
    if (this.asserter.getEntity().isInStatus(expectedStatus)) {
      this.failAssertion(expectedStatus, 'ensure.is.not.inStatus', error);
    }
    return this.asserter;
  }

  /**
   * Ensures that `Entity` is one of expected statuses.
   * @param expectedStatuses - Expected list of statuses in one of which `Entity` should be.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @returns `Asserter` implementation instance.
   */
  public ensureIsInOneOfStatuses(
    expectedStatuses: types.Status[],
    error?: DomainError
  ): types.Asserter {
    if (!this.asserter.getEntity().isInOneOfStatuses(expectedStatuses)) {
      this.failAssertion(
        expectedStatuses.join(', '),
        'ensure.is.inOneOfStatuses',
        error
      );
    }
    return this.asserter;
  }

  /**
   * Ensures that `Entity` is NOT in one of expected statuses.
   * @param expectedStatuses - Expected list of statuses in one of which `Entity` shouldn't be.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @returns `Asserter` implementation instance.
   */
  public ensureIsNotInOneOfStatuses(
    expectedStatuses: types.Status[],
    error?: DomainError
  ): types.Asserter {
    if (this.asserter.getEntity().isInOneOfStatuses(expectedStatuses)) {
      this.failAssertion(
        expectedStatuses.join(', '),
        'ensure.is.not.inOneOfStatuses',
        error
      );
    }
    return this.asserter;
  }

  /**
   * Throws error on failed assertion - on invalid status of `Entity`.
   * @param expectedStatus - Expected status on `Entity`.
   * @param api - Api path that is being invoked.
   * @param error - Optional instance of `DomainError` that will be thrown upon failed assertion.
   * @throws {DomainError}
   * Thrown if an error is passed as argument.
   * @throws {InvalidStatusTransitionError}
   * Thrown if custom error is not provided.
   */
  protected failAssertion(
    expectedStatus: types.Status,
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
      throw new InvalidStatusTransitionError(
        this.asserter.getEntity().getTypeName(),
        this.asserter
          .getEntity()
          .getId()
          .toString(),
        this.asserter.getEntity().getStatus() as string,
        expectedStatus as string,
        action.toString()
      );
    }
  }
}
