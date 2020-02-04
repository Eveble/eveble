import { stubInterface } from 'ts-sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import {
  StatefulAssertion,
  InvalidStateTransitionError,
} from '../../../../src/domain/assertions/stateful-assertion';
import { types } from '../../../../src/types';
import { DomainError } from '../../../../src/domain/domain-error';

chai.use(sinonChai);

describe(`Asserter`, () => {
  let entity: any;
  let asserter: any;

  beforeEach(() => {
    entity = stubInterface<types.Entity>();
    asserter = stubInterface<types.Asserter>();

    asserter.getEntity.returns(entity);
    asserter.getAction.returns('my-action');
    entity.getTypeName.returns('MyTypeName');
    entity.getId.returns('my-id');
  });

  class MyError extends DomainError {}

  describe('extends asserter API', () => {
    it('ensure.is.inState', () => {
      const assertion = new StatefulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.inState')).to.be.equal(
        assertion.ensureIsInState
      );
    });

    it('ensure.is.not.inState', () => {
      const assertion = new StatefulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.not.inState')).to.be.equal(
        assertion.ensureIsNotInState
      );
    });

    it('ensure.is.inOneOfStates', () => {
      const assertion = new StatefulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.inOneOfStates')).to.be.equal(
        assertion.ensureIsInOneOfStates
      );
    });

    it('ensure.is.not.inOneOfStates', () => {
      const assertion = new StatefulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.not.inOneOfStates')).to.be.equal(
        assertion.ensureIsNotInOneOfStates
      );
    });
  });

  describe('ensures expected state', () => {
    describe('ensureIsInState', () => {
      it('returns Asserter instance if entity is in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.returns(true);
        const expectedState = 'expected-state';
        expect(assertion.ensureIsInState(expectedState)).to.be.equal(asserter);
        expect(entity.isInState).to.be.calledOnce;
        expect(entity.isInState).to.be.calledWithExactly(expectedState);
      });

      it('throws InvalidStateTransitionError if entity is not in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.returns(false);
        const currentState = 'current-state';
        entity.getState.returns(currentState);

        const expectedState = 'expected-state';
        expect(() => assertion.ensureIsInState(expectedState)).to.throw(
          InvalidStateTransitionError,
          `MyTypeName@my-id: cannot 'my-action' when in 'current-state' state(expected states: 'expected-state')`
        );
        expect(entity.isInState).to.be.calledOnce;
        expect(entity.isInState).to.be.calledWithExactly(expectedState);
      });

      it('allows to pass custom error if entity is not in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.returns(false);
        const currentState = 'current-state';
        entity.getState.returns(currentState);

        const error = new MyError('my-error');
        const expectedState = 'expected-state';
        expect(() => assertion.ensureIsInState(expectedState, error)).to.throw(
          error
        );
        expect(entity.isInState).to.be.calledOnce;
        expect(entity.isInState).to.be.calledWithExactly(expectedState);
      });
    });

    describe('ensureIsNotInState', () => {
      it('returns Asserter instance if entity is not in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.returns(false);
        const expectedState = 'expected-state';
        expect(assertion.ensureIsNotInState(expectedState)).to.be.equal(
          asserter
        );
        expect(entity.isInState).to.be.calledOnce;
        expect(entity.isInState).to.be.calledWithExactly(expectedState);
      });

      it('throws InvalidStateTransitionError if entity is in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.returns(true);
        const currentState = 'current-state';
        entity.getState.returns(currentState);

        const expectedState = 'expected-state';
        expect(() => assertion.ensureIsNotInState(expectedState)).to.throw(
          InvalidStateTransitionError,
          `MyTypeName@my-id: cannot 'my-action' when in 'current-state' state(expected states: 'expected-state')`
        );
        expect(entity.isInState).to.be.calledOnce;
        expect(entity.isInState).to.be.calledWithExactly(expectedState);
      });

      it('allows to pass custom error if entity is in state', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInState.returns(true);
        const currentState = 'current-state';
        entity.getState.returns(currentState);

        const error = new MyError('my-error');
        const expectedState = 'expected-state';
        expect(() =>
          assertion.ensureIsNotInState(expectedState, error)
        ).to.throw(error);
        expect(entity.isInState).to.be.calledOnce;
        expect(entity.isInState).to.be.calledWithExactly(expectedState);
      });
    });

    describe('ensureIsInOneOfStates', () => {
      it('returns Asserter instance if entity is in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.returns(true);
        const expectedStates = ['first', 'second'];
        expect(assertion.ensureIsInOneOfStates(expectedStates)).to.be.equal(
          asserter
        );
        expect(entity.isInOneOfStates).to.be.calledOnce;
        expect(entity.isInOneOfStates).to.be.calledWithExactly(expectedStates);
      });

      it('throws InvalidStateTransitionError if entity is not in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.returns(false);
        const currentState = 'current-state';
        entity.getState.returns(currentState);

        const expectedStates = ['first', 'second'];
        expect(() => assertion.ensureIsInOneOfStates(expectedStates)).to.throw(
          InvalidStateTransitionError,
          `MyTypeName@my-id: cannot 'my-action' when in 'current-state' state(expected states: 'first, second')`
        );
        expect(entity.isInOneOfStates).to.be.calledOnce;
        expect(entity.isInOneOfStates).to.be.calledWithExactly(expectedStates);
      });

      it('allows to pass custom error if entity is not in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.returns(false);
        const currentState = 'current-state';
        entity.getState.returns(currentState);

        const error = new MyError('my-error');
        const expectedStates = ['first', 'second'];
        expect(() =>
          assertion.ensureIsInOneOfStates(expectedStates, error)
        ).to.throw(error);
        expect(entity.isInOneOfStates).to.be.calledOnce;
        expect(entity.isInOneOfStates).to.be.calledWithExactly(expectedStates);
      });
    });

    describe('ensureIsNotInOneOfStates', () => {
      it('returns Asserter instance if entity is not in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.returns(false);
        const expectedStates = ['first', 'second'];
        expect(assertion.ensureIsNotInOneOfStates(expectedStates)).to.be.equal(
          asserter
        );
        expect(entity.isInOneOfStates).to.be.calledOnce;
        expect(entity.isInOneOfStates).to.be.calledWithExactly(expectedStates);
      });

      it('throws InvalidStateTransitionError if entity is in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.returns(true);
        const currentState = 'current-state';
        entity.getState.returns(currentState);

        const expectedStates = ['first', 'second'];
        expect(() =>
          assertion.ensureIsNotInOneOfStates(expectedStates)
        ).to.throw(
          InvalidStateTransitionError,
          `MyTypeName@my-id: cannot 'my-action' when in 'current-state' state(expected states: 'first, second')`
        );
        expect(entity.isInOneOfStates).to.be.calledOnce;
        expect(entity.isInOneOfStates).to.be.calledWithExactly(expectedStates);
      });

      it('allows to pass custom error if entity is in one of states', () => {
        const assertion = new StatefulAssertion(asserter);
        entity.isInOneOfStates.returns(true);
        const currentState = 'current-state';
        entity.getState.returns(currentState);

        const error = new MyError('my-error');
        const expectedStates = ['first', 'second'];
        expect(() =>
          assertion.ensureIsNotInOneOfStates(expectedStates, error)
        ).to.throw(error);
        expect(entity.isInOneOfStates).to.be.calledOnce;
        expect(entity.isInOneOfStates).to.be.calledWithExactly(expectedStates);
      });
    });
  });
});
