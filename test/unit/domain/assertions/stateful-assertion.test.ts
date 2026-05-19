import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import {
  StatefulAssertion,
  InvalidStateTransitionError,
} from '../../../../src/domain/assertions/stateful-assertion';
import { types } from '../../../../src/types';
import { DomainError } from '../../../../src/domain/domain-error';
import { UndefinedActionError } from '../../../../src/domain/domain-errors';

describe(`StatefulAssertion`, () => {
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
    it('ensure.is.inState', () => {
      const assertion = new StatefulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.inState')).toBe(
        assertion.ensureIsInState
      );
    });

    it('ensure.is.not.inState', () => {
      const assertion = new StatefulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.not.inState')).toBe(
        assertion.ensureIsNotInState
      );
    });

    it('ensure.is.inOneOfStates', () => {
      const assertion = new StatefulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.inOneOfStates')).toBe(
        assertion.ensureIsInOneOfStates
      );
    });

    it('ensure.is.not.inOneOfStates', () => {
      const assertion = new StatefulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.not.inOneOfStates')).toBe(
        assertion.ensureIsNotInOneOfStates
      );
    });
  });

  describe('ensures expected state', () => {
    describe('ensureIsInState', () => {
      it('returns Asserter instance if entity is in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.mockReturnValue(true);
        const expectedState = 'expected-state';
        expect(assertion.ensureIsInState(expectedState)).toBe(asserter);
        expect(entity.isInState).toHaveBeenCalledTimes(1);
        expect(entity.isInState).toHaveBeenCalledWith(expectedState);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.mockReturnValue(false);
        asserter.hasAction.mockReturnValue(false);

        expect(() => assertion.ensureIsInState('expected-state')).toThrow(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.inState'. Please define action by using 'entity.on('action-name-as-string').ensure.is.inState(...)' or 'entity.on(MyCommandType).ensure.ensure.is.inState(...)`
        );
      });

      it('throws InvalidStateTransitionError if entity is not in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.mockReturnValue(false);
        const currentState = 'current-state';
        entity.getState.mockReturnValue(currentState);

        const expectedState = 'expected-state';
        expect(() => assertion.ensureIsInState(expectedState)).toThrow(
          InvalidStateTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-state' state(expected states: 'expected-state')`
        );
        expect(entity.isInState).toHaveBeenCalledTimes(1);
        expect(entity.isInState).toHaveBeenCalledWith(expectedState);
      });

      it('allows to pass custom error if entity is not in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.mockReturnValue(false);
        const currentState = 'current-state';
        entity.getState.mockReturnValue(currentState);

        const error = new MyError('my-error');
        const expectedState = 'expected-state';
        expect(() => assertion.ensureIsInState(expectedState, error)).toThrow(
          error
        );
        expect(entity.isInState).toHaveBeenCalledTimes(1);
        expect(entity.isInState).toHaveBeenCalledWith(expectedState);
      });
    });

    describe('ensureIsNotInState', () => {
      it('returns Asserter instance if entity is not in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.mockReturnValue(false);
        const expectedState = 'expected-state';
        expect(assertion.ensureIsNotInState(expectedState)).toBe(asserter);
        expect(entity.isInState).toHaveBeenCalledTimes(1);
        expect(entity.isInState).toHaveBeenCalledWith(expectedState);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.mockReturnValue(true);
        asserter.hasAction.mockReturnValue(false);

        expect(() => assertion.ensureIsNotInState('expected-state')).toThrow(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.not.inState'. Please define action by using 'entity.on('action-name-as-string').ensure.is.not.inState(...)' or 'entity.on(MyCommandType).ensure.ensure.is.not.inState(...)`
        );
      });

      it('throws InvalidStateTransitionError if entity is in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.mockReturnValue(true);
        const currentState = 'current-state';
        entity.getState.mockReturnValue(currentState);

        const expectedState = 'expected-state';
        expect(() => assertion.ensureIsNotInState(expectedState)).toThrow(
          InvalidStateTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-state' state(expected states: 'expected-state')`
        );
        expect(entity.isInState).toHaveBeenCalledTimes(1);
        expect(entity.isInState).toHaveBeenCalledWith(expectedState);
      });

      it('allows to pass custom error if entity is in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.mockReturnValue(true);
        const currentState = 'current-state';
        entity.getState.mockReturnValue(currentState);

        const error = new MyError('my-error');
        const expectedState = 'expected-state';
        expect(() =>
          assertion.ensureIsNotInState(expectedState, error)
        ).toThrow(error);
        expect(entity.isInState).toHaveBeenCalledTimes(1);
        expect(entity.isInState).toHaveBeenCalledWith(expectedState);
      });
    });

    describe('ensureIsInOneOfStates', () => {
      it('returns Asserter instance if entity is in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.mockReturnValue(true);
        const expectedStates = ['first', 'second'];
        expect(assertion.ensureIsInOneOfStates(expectedStates)).toBe(asserter);
        expect(entity.isInOneOfStates).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStates).toHaveBeenCalledWith(expectedStates);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.mockReturnValue(false);
        asserter.hasAction.mockReturnValue(false);

        expect(() =>
          assertion.ensureIsInOneOfStates(['expected-state'])
        ).toThrow(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.inOneOfStates'. Please define action by using 'entity.on('action-name-as-string').ensure.is.inOneOfStates(...)' or 'entity.on(MyCommandType).ensure.ensure.is.inOneOfStates(...)`
        );
      });

      it('throws InvalidStateTransitionError if entity is not in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.mockReturnValue(false);
        const currentState = 'current-state';
        entity.getState.mockReturnValue(currentState);

        const expectedStates = ['first', 'second'];
        expect(() => assertion.ensureIsInOneOfStates(expectedStates)).toThrow(
          InvalidStateTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-state' state(expected states: 'first, second')`
        );
        expect(entity.isInOneOfStates).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStates).toHaveBeenCalledWith(expectedStates);
      });

      it('allows to pass custom error if entity is not in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.mockReturnValue(false);
        const currentState = 'current-state';
        entity.getState.mockReturnValue(currentState);

        const error = new MyError('my-error');
        const expectedStates = ['first', 'second'];
        expect(() =>
          assertion.ensureIsInOneOfStates(expectedStates, error)
        ).toThrow(error);
        expect(entity.isInOneOfStates).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStates).toHaveBeenCalledWith(expectedStates);
      });
    });

    describe('ensureIsNotInOneOfStates', () => {
      it('returns Asserter instance if entity is not in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.mockReturnValue(false);
        const expectedStates = ['first', 'second'];
        expect(assertion.ensureIsNotInOneOfStates(expectedStates)).toBe(
          asserter
        );
        expect(entity.isInOneOfStates).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStates).toHaveBeenCalledWith(expectedStates);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.mockReturnValue(true);
        asserter.hasAction.mockReturnValue(false);

        expect(() =>
          assertion.ensureIsNotInOneOfStates(['expected-state'])
        ).toThrow(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.not.inOneOfStates'. Please define action by using 'entity.on('action-name-as-string').ensure.is.not.inOneOfStates(...)' or 'entity.on(MyCommandType).ensure.ensure.is.not.inOneOfStates(...)`
        );
      });

      it('throws InvalidStateTransitionError if entity is in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.mockReturnValue(true);
        const currentState = 'current-state';
        entity.getState.mockReturnValue(currentState);

        const expectedStates = ['first', 'second'];
        expect(() =>
          assertion.ensureIsNotInOneOfStates(expectedStates)
        ).toThrow(
          InvalidStateTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-state' state(expected states: 'first, second')`
        );
        expect(entity.isInOneOfStates).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStates).toHaveBeenCalledWith(expectedStates);
      });

      it('allows to pass custom error if entity is in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.mockReturnValue(true);
        const currentState = 'current-state';
        entity.getState.mockReturnValue(currentState);

        const error = new MyError('my-error');
        const expectedStates = ['first', 'second'];
        expect(() =>
          assertion.ensureIsNotInOneOfStates(expectedStates, error)
        ).toThrow(error);
        expect(entity.isInOneOfStates).toHaveBeenCalledTimes(1);
        expect(entity.isInOneOfStates).toHaveBeenCalledWith(expectedStates);
      });
    });
  });
});
