import { expect } from 'chai';
import sinon from 'sinon';
import { stubInterface } from 'ts-sinon';
import {
  Asserter,
  AssertionApiAlreadyExistsError,
} from '../../../src/domain/asserter';
import { types } from '../../../src/types';
import { Command } from '../../../src/components/command';

describe(`Asserter`, () => {
  describe('construction', () => {
    it('initializes with empty api mappings', () => {
      const asserter = new Asserter();
      expect(asserter.getApi()).to.be.instanceof(Map);
      expect(asserter.getApi()).to.be.eql(new Map([]));
    });

    it('initializes with empty assertions as an array', () => {
      const asserter = new Asserter();
      expect(asserter.getAssertions()).to.be.instanceof(Array);
      expect(asserter.getAssertions()).to.be.empty;
    });
  });

  describe('assertions', () => {
    const ensureIsTrue = sinon.stub();
    const ensureIsFalse = sinon.stub();

    class MyAssertion implements types.Assertion {
      getApi(): Map<string, Function> {
        return new Map([
          ['ensure.is.true', ensureIsTrue],
          ['ensure.is.false', ensureIsFalse],
        ]);
      }
    }
    it('registers assertion on asserter', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();
      asserter.registerAssertion(assertion);
      expect(asserter.getAssertions()).to.be.instanceof(Array);
      expect(asserter.getAssertions()).to.have.length(1);
      expect(asserter.getAssertions()).to.have.members([assertion]);
    });

    it('returns true if  assertion is registered on asserter', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();
      asserter.registerAssertion(assertion);
      expect(asserter.hasAssertion(MyAssertion)).to.be.true;
    });

    it('extends asserter api with the one from assertion', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();

      asserter.registerAssertion(assertion);
      expect(asserter.getApi()).to.be.instanceof(Map);
      expect(asserter.getApi()).to.be.eql(
        new Map([
          ['ensure.is.true', ensureIsTrue],
          ['ensure.is.false', ensureIsFalse],
        ])
      );
      expect(
        Object.create(ensureIsTrue.prototype) instanceof
          asserter.assert().ensure.is.true
      ).to.be.true; // Compare bound assertion to the original function
      expect(
        Object.create(ensureIsFalse.prototype) instanceof
          asserter.assert().ensure.is.false
      ).to.be.true; // Compare bound assertion to the original function
    });

    it('throws AssertionApiAlreadyExistsError if api on same path already exists', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();

      asserter.registerAssertion(assertion);
      expect(() => asserter.registerAssertion(assertion)).to.throw(
        AssertionApiAlreadyExistsError,
        `Asserter: api from assertion 'MyAssertion' already exists on path 'ensure.is.true'`
      );
    });
  });

  describe('asserting', () => {
    it('sets the action as a string', () => {
      const asserter = new Asserter();
      asserter.setAction('my-action');
      expect(asserter.getAction()).to.be.equal('my-action');
    });

    it('sets the action as MessageableType type constructor', () => {
      class MyCommand extends Command {}

      const asserter = new Asserter();
      asserter.setAction(MyCommand);
      expect(asserter.getAction()).to.be.equal(MyCommand);
    });

    it('sets the target as Entity instance', () => {
      const entity = stubInterface<types.Entity>();

      const asserter = new Asserter();
      asserter.setEntity(entity);
      expect(asserter.getEntity()).to.be.equal(entity);
    });
  });
});
