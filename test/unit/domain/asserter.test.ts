import { mock } from 'vitest-mock-extended';
import { expect, describe, it, vi } from 'vitest';

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
      expect(asserter.getApi()).toBeInstanceOf(Map);
      expect(asserter.getApi()).toEqual(new Map([]));
    });

    it('initializes with empty assertions as an array', () => {
      const asserter = new Asserter();
      expect(asserter.getAssertions()).toBeInstanceOf(Array);
      expect(asserter.getAssertions()).toHaveLength(0);
    });
  });

  describe('assertions', () => {
    const ensureIsTrue = vi.fn();
    const ensureIsFalse = vi.fn();

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
      expect(asserter.getAssertions()).toBeInstanceOf(Array);
      expect(asserter.getAssertions()).toHaveLength(1);
      expect(asserter.getAssertions()).toEqual(expect.arrayContaining([assertion]));
    });

    it('returns true if assertion is registered on asserter', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();
      asserter.registerAssertion(assertion);
      expect(asserter.hasAssertion(MyAssertion)).toBe(true);
    });

    it('returns true if explicit api is registered on asserter', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();
      asserter.registerAssertion(assertion);
      expect(asserter.hasApi('ensure.is.true')).toBe(true);
      expect(asserter.hasApi('ensure.is.false')).toBe(true);
    });

    it('returns true if partial api is registered on asserter', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();
      asserter.registerAssertion(assertion);
      expect(asserter.hasApi('ensure.is')).toBe(true);
    });

    it('returns false if api is not registered on asserter', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();
      asserter.registerAssertion(assertion);
      expect(asserter.hasApi('not-registered')).toBe(false);
    });

    it('extends asserter api with the one from assertion', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();

      asserter.registerAssertion(assertion);
      expect(asserter.getApi()).toBeInstanceOf(Map);
      expect(asserter.getApi()).toEqual(
        new Map([
          ['ensure.is.true', ensureIsTrue],
          ['ensure.is.false', ensureIsFalse],
        ])
      );
      expect(
        Object.create(ensureIsTrue.prototype) instanceof
          asserter.assert().ensure.is.true
      ).toBe(true); // Compare bound assertion to the original function
      expect(
        Object.create(ensureIsFalse.prototype) instanceof
          asserter.assert().ensure.is.false
      ).toBe(true); // Compare bound assertion to the original function
    });

    it('throws AssertionApiAlreadyExistsError if api on same path already exists', () => {
      const asserter = new Asserter();
      const assertion = new MyAssertion();

      asserter.registerAssertion(assertion);
      expect(() => asserter.registerAssertion(assertion)).toThrow(
        AssertionApiAlreadyExistsError,
        `Asserter: api from assertion 'MyAssertion' already exists on path 'ensure.is.true'`
      );
    });
  });

  describe('asserting', () => {
    it('sets the action as a string', () => {
      const asserter = new Asserter();
      asserter.setAction('my-action');
      expect(asserter.getAction()).toBe('my-action');
    });

    it('returns true if action is set on asserter', () => {
      const asserter = new Asserter();
      asserter.setAction('my-action');
      expect(asserter.hasAction()).toBe(true);
    });

    it('returns false if action is not set on asserter', () => {
      const asserter = new Asserter();
      expect(asserter.hasAction()).toBe(false);
    });

    it('sets the action as MessageableType type constructor', () => {
      class MyCommand extends Command<MyCommand> {}

      const asserter = new Asserter();
      asserter.setAction(MyCommand);
      expect(asserter.getAction()).toBe(MyCommand);
    });

    it('allows to clear the action', () => {
      const asserter = new Asserter();
      asserter.setAction('my-action');
      asserter.clearAction();
      expect(asserter.getAction()).toBeUndefined();
    });

    it('sets the target as Entity instance', () => {
      const entity = mock<types.Entity>();

      const asserter = new Asserter();
      asserter.setEntity(entity);
      expect(asserter.getEntity()).toBe(entity);
    });
  });
});

