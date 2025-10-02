import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { derive } from '@traits-ts/core';
import {
  StatefulTrait,
  UndefinedStatesError,
  InvalidStateError,
} from '../../../src/trait/stateful.trait';

chai.use(sinonChai);

describe(`StatefulTrait`, () => {
  class MyClass extends derive(StatefulTrait) {
    static STATES = {
      created: 'created',
      filled: 'filled',
      processed: 'processed',
    };
  }

  class MyClassWithoutPredefinedStates extends derive(StatefulTrait) {}

  describe('getters', () => {
    it('returns all available states', () => {
      const instance = new MyClass();
      expect(instance.getSelectableStates()).to.be.eql({
        created: 'created',
        filled: 'filled',
        processed: 'processed',
      });
    });
  });

  describe('setters', () => {
    it(`allows to set state on instance `, () => {
      const instance = new MyClass();
      instance.setState(MyClass.STATES.created);
      expect(instance.getState()).to.be.equal(MyClass.STATES.created);
      instance.setState(MyClass.STATES.filled);
      expect(instance.getState()).to.be.equal(MyClass.STATES.filled);
    });

    it(`throws UndefinedStatesError on instance with undefined states`, () => {
      const instance = new MyClassWithoutPredefinedStates();
      expect(() => instance.setState('my-state')).to.throw(
        UndefinedStatesError,
        `MyClassWithoutPredefinedStates: states are not defined. Please define states as class(MyClass.STATES) property or define your getter as MyClass.prototype.getAvailableStates`
      );
    });
  });

  describe('evaluation', () => {
    context('single state expectation', () => {
      it(`returns true if instance is in expected state`, () => {
        const instance = new MyClass();
        instance.setState(MyClass.STATES.created);
        expect(instance.isInState(MyClass.STATES.created)).to.be.true;
      });

      it(`returns false if instance is not in expected state`, () => {
        const instance = new MyClass();
        expect(instance.isInState(MyClass.STATES.filled)).to.be.false;
      });

      it(`allows to pass array to isInState as fallback`, () => {
        const instance = new MyClass();
        instance.isInOneOfStates = sinon.spy(instance.isInOneOfStates);

        instance.isInState(['created']);
        expect(instance.isInOneOfStates).to.be.calledOnce;
        expect(instance.isInOneOfStates).to.be.calledWithExactly(['created']);
      });
    });

    context('one of states expectation', () => {
      it(`returns true if instance is one of expected state`, () => {
        const instance = new MyClass();
        instance.setState(MyClass.STATES.filled);
        expect(
          instance.isInOneOfStates([
            MyClass.STATES.filled,
            MyClass.STATES.processed,
          ])
        ).to.be.true;
        expect(instance.isInOneOfStates(MyClass.STATES.filled)).to.be.true;
      });

      it(`returns false if instance is not in one of expected state`, () => {
        const instance = new MyClass();
        expect(
          instance.isInOneOfStates([
            MyClass.STATES.filled,
            MyClass.STATES.processed,
          ])
        ).to.be.false;
        expect(instance.isInOneOfStates(MyClass.STATES.filled)).to.be.false;
      });
    });

    context('evaluating if state is not nil', () => {
      it(`returns true if instance has state assigned(is not nil)`, () => {
        const instance = new MyClass();
        instance.setState(MyClass.STATES.filled);
        expect(instance.hasState()).to.be.true;
      });

      it(`returns false if instance has no state assigned(is nil)`, () => {
        const instance = new MyClass();
        // State is protected property, use 'hack'
        Object.defineProperty(instance, 'state', {
          value: undefined,
        });
        expect(instance.hasState()).to.be.false;
      });
    });
  });

  describe('validation', () => {
    it('throws InvalidStateError when state is not in expected state(single) on instance', async () => {
      const instance = new MyClass();
      instance.setState(MyClass.STATES.created);

      expect(() => instance.validateState(MyClass.STATES.filled)).to.throw(
        InvalidStateError,
        `MyClass: expected current state of 'created' to be in one of states: 'filled'`
      );
    });

    it('throws InvalidStateError when state is not in one of expected states(array) on instance', async () => {
      const instance = new MyClass();
      instance.setState(MyClass.STATES.created);

      expect(() =>
        instance.validateState([
          MyClass.STATES.filled,
          MyClass.STATES.processed,
        ])
      ).to.throw(
        InvalidStateError,
        `MyClass: expected current state of 'created' to be in one of states: 'filled, processed'`
      );
    });

    it('throws provided as second argument custom error when state is not in one of available states on instance', async () => {
      class MyError extends Error {}
      const error = new MyError();
      const instance = new MyClass();
      instance.setState(MyClass.STATES.created);

      expect(() =>
        instance.validateState(
          [MyClass.STATES.filled, MyClass.STATES.processed],
          error
        )
      ).to.throw(MyError);
    });
  });
});
