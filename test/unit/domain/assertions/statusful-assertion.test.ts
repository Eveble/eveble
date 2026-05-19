import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import {
  StatusfulAssertion,
  InvalidStatusTransitionError,
} from '../../../../src/domain/assertions/statusful-assertion';
import { types } from '../../../../src/types';
import { DomainError } from '../../../../src/domain/domain-error';
import { UndefinedActionError } from '../../../../src/domain/domain-errors';

describe(`StatusfulAssertion`, () => {
  let entity: any;
  let asserter: any;

  beforeEach(() => {
    entity = mock<types.Entity>();
    asserter = mock<types.Asserter>();

    asserter.getEntity.mockReturnValue(entity);
    asserter.getAction.mockReturnValue('my-action');
    asserter.hasAction.mockReturnValue(true);
    entity.getTypeName.mockReturnValue('MyTypeName');
    entity.getId.mockReturnValue('my-id');
  });

  class MyError extends DomainError {}

  describe('extends asserter API', () => {
    it('ensure.is.inStatus', () => {
      const assertion = new StatusfulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.inStatus')).toBe(
        assertion.ensureIsInStatus
      );
    });

    it('ensure.is.not.inStatus', () => {
      const assertion = new StatusfulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.not.inStatus')).toBe(
        assertion.ensureIsNotInStatus
      );
    });

    it('ensure.is.inOneOfStatuses', () => {
      const assertion = new StatusfulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.inOneOfStatuses')).toBe(
        assertion.ensureIsInOneOfStatuses
      );
    });

    it('ensure.is.not.inOneOfStatuses', () => {
      const assertion = new StatusfulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.not.inOneOfStatuses')).toBe(
        assertion.ensureIsNotInOneOfStatuses
      );
    });
  });

  describe('ensures expected status', () => {
    describe('ensureIsInStatus', () => {
      it('returns Asserter instance if entity is in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.mockReturnValue(true);
        const expectedStatus = 'expected-status';
        expect(assertion.ensureIsInStatus(expectedStatus)).toBe(asserter);
        expect(entity.isInStatus).toHaveBeenCalledTimes(1);
        expect(entity.isInStatus).toHaveBeenCalledWith(expectedStatus);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.mockReturnValue(false);
        asserter.hasAction.mockReturnValue(false);

        expect(() => assertion.ensureIsInStatus('expected-status')).toThrow(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.inStatus'. Please define action by using 'entity.on('action-name-as-string').ensure.is.inStatus(...)' or 'entity.on(MyCommandType).ensure.ensure.is.inStatus(...)`
        );
      });

      it('throws InvalidStatusTransitionError if entity is not in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.mockReturnValue(false);
        const currentStatus = 'current-status';
        entity.getStatus.mockReturnValue(currentStatus);

        const expectedStatus = 'expected-status';
        expect(() => assertion.ensureIsInStatus(expectedStatus)).toThrow(
          InvalidStatusTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-status' status(expected statuses: 'expected-status')`
        );
        expect(entity.isInStatus).toHaveBeenCalledTimes(1);
        expect(entity.isInStatus).toHaveBeenCalledWith(expectedStatus);
      });

      it('allows to pass custom error if entity is not in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.mockReturnValue(false);
        const currentStatus = 'current-status';
        entity.getStatus.mockReturnValue(currentStatus);

        const error = new MyError('my-error');
        const expectedStatus = 'expected-status';
        expect(() => assertion.ensureIsInStatus(expectedStatus, error)).toThrow(
          error
        );
        expect(entity.isInStatus).toHaveBeenCalledTimes(1);
        expect(entity.isInStatus).toHaveBeenCalledWith(expectedStatus);
      });
    });

    describe('ensureIsNotInStatus', () => {
      it('returns Asserter instance if entity is not in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.mockReturnValue(false);
        const expectedStatus = 'expected-status';
        expect(assertion.ensureIsNotInStatus(expectedStatus)).toBe(asserter);
        expect(entity.isInStatus).toHaveBeenCalledTimes(1);
        expect(entity.isInStatus).toHaveBeenCalledWith(expectedStatus);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.mockReturnValue(true);
        asserter.hasAction.mockReturnValue(false);

        expect(() => assertion.ensureIsNotInStatus('expected-status')).toThrow(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.not.inStatus'. Please define action by using 'entity.on('action-name-as-string').ensure.is.not.inStatus(...)' or 'entity.on(MyCommandType).ensure.ensure.is.not.inStatus(...)`
        );
      });

      it('throws InvalidStatusTransitionError if entity is in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.mockReturnValue(true);
        const currentStatus = 'current-status';
        entity.getStatus.mockReturnValue(currentStatus);

        const expectedStatus = 'expected-status';
        expect(() => assertion.ensureIsNotInStatus(expectedStatus)).toThrow(
          InvalidStatusTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-status' status(expected statuses: 'expected-status')`
        );
        expect(entity.isInStatus).toHaveBeenCalledTimes(1);
        expect(entity.isInStatus).toHaveBeenCalledWith(expectedStatus);
      });

      it('allows to pass custom error if entity is in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.mockReturnValue(true);
        const currentStatus = 'current-status';
        entity.getStatus.mockReturnValue(currentStatus);

        const error = new MyError('my-error');
        const expectedStatus = 'expected-status';
        expect(() =>
          assertion.ensureIsNotInStatus(expectedStatus, error)
        ).toThrow(error);
        expect(entity.isInStatus).toHaveBeenCalledTimes(1);
        expect(entity.isInStatus).toHaveBeenCalledWith(expectedStatus);
      });
    });

    describe('ensureIsInOneOfStatuses', () => {
      it('returns Asserter instance if entity is in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.mockReturnValue(true);
        const expectedStatuses = ['first', 'second'];
        expect(assertion.ensureIsInOneOfStatuses(expectedStatuses)).toBe(
          asserter
        );
        expect(entity.isInOneOfStatuses).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStatuses).toHaveBeenCalledWith(expectedStatuses);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.mockReturnValue(false);
        asserter.hasAction.mockReturnValue(false);

        expect(() =>
          assertion.ensureIsInOneOfStatuses(['expected-status'])
        ).toThrow(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.inOneOfStatuses'. Please define action by using 'entity.on('action-name-as-string').ensure.is.inOneOfStatuses(...)' or 'entity.on(MyCommandType).ensure.ensure.is.inOneOfStatuses(...)`
        );
      });

      it('throws InvalidStatusTransitionError if entity is not in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.mockReturnValue(false);
        const currentStatus = 'current-status';
        entity.getStatus.mockReturnValue(currentStatus);

        const expectedStatuses = ['first', 'second'];
        expect(() =>
          assertion.ensureIsInOneOfStatuses(expectedStatuses)
        ).toThrow(
          InvalidStatusTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-status' status(expected statuses: 'first, second')`
        );
        expect(entity.isInOneOfStatuses).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStatuses).toHaveBeenCalledWith(expectedStatuses);
      });

      it('allows to pass custom error if entity is not in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.mockReturnValue(false);
        const currentStatus = 'current-status';
        entity.getStatus.mockReturnValue(currentStatus);

        const error = new MyError('my-error');
        const expectedStatuses = ['first', 'second'];
        expect(() =>
          assertion.ensureIsInOneOfStatuses(expectedStatuses, error)
        ).toThrow(error);
        expect(entity.isInOneOfStatuses).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStatuses).toHaveBeenCalledWith(expectedStatuses);
      });
    });

    describe('ensureIsNotInOneOfStatuses', () => {
      it('returns Asserter instance if entity is not in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.mockReturnValue(false);
        const expectedStatuses = ['first', 'second'];
        expect(assertion.ensureIsNotInOneOfStatuses(expectedStatuses)).toBe(
          asserter
        );
        expect(entity.isInOneOfStatuses).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStatuses).toHaveBeenCalledWith(expectedStatuses);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.mockReturnValue(true);
        asserter.hasAction.mockReturnValue(false);

        expect(() =>
          assertion.ensureIsNotInOneOfStatuses(['expected-status'])
        ).toThrow(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.not.inOneOfStatuses'. Please define action by using 'entity.on('action-name-as-string').ensure.is.not.inOneOfStatuses(...)' or 'entity.on(MyCommandType).ensure.ensure.is.not.inOneOfStatuses(...)`
        );
      });

      it('throws InvalidStatusTransitionError if entity is in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.mockReturnValue(true);
        const currentStatus = 'current-status';
        entity.getStatus.mockReturnValue(currentStatus);

        const expectedStatuses = ['first', 'second'];
        expect(() =>
          assertion.ensureIsNotInOneOfStatuses(expectedStatuses)
        ).toThrow(
          InvalidStatusTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-status' status(expected statuses: 'first, second')`
        );
        expect(entity.isInOneOfStatuses).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStatuses).toHaveBeenCalledWith(expectedStatuses);
      });

      it('allows to pass custom error if entity is in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.mockReturnValue(true);
        const currentStatus = 'current-status';
        entity.getStatus.mockReturnValue(currentStatus);

        const error = new MyError('my-error');
        const expectedStatuses = ['first', 'second'];
        expect(() =>
          assertion.ensureIsNotInOneOfStatuses(expectedStatuses, error)
        ).toThrow(error);
        expect(entity.isInOneOfStatuses).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStatuses).toHaveBeenCalledWith(expectedStatuses);
      });
    });
  });
});
