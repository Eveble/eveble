import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import { types } from '../../../../src/types';
import { AbilityAssertion } from '../../../../src/domain/assertions/ability-assertion';
import { Asserter } from '../../../../src/domain/asserter';
import {
  ENABLE_ACTION_VALIDATION_METHOD_KEY,
  DISABLE_ACTION_VALIDATION_METHOD_KEY,
} from '../../../../src/constants/literal-keys';

describe(`AbilityAssertion`, () => {
  let entity: any;
  let asserter: any;

  beforeEach(() => {
    entity = mock<types.Entity>();
    asserter = new Asserter();
    asserter.setEntity(entity);
  });

  describe('extends asserter API', () => {
    it('ensure.is.ableTo', () => {
      const assertion = new AbilityAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.ableTo')).toBeInstanceOf(
        AbilityAssertion
      );
    });

    it('is.ableTo', () => {
      const assertion = new AbilityAssertion(asserter);
      expect(assertion.getApi().get('is.ableTo')).toBeInstanceOf(
        AbilityAssertion
      );
    });
  });

  describe('ensures ability to change state', () => {
    it('ensures that state of entity is being snapshotted before validation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = vi.fn();
      entity.myAction.mockReturnValue('result');

      entity[ENABLE_ACTION_VALIDATION_METHOD_KEY] = vi.fn();
      expect(asserter.ensure.is.ableTo.myAction(...args)).toBe('result');
      expect(entity.myAction).toHaveBeenCalledTimes(1);
      expect(entity.myAction).toHaveBeenCalledWith(...args);
      expect(entity[ENABLE_ACTION_VALIDATION_METHOD_KEY]).toHaveBeenCalledBefore(entity.myAction);
    });

    it('ensures that state of entity is being rollbacked after validation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = vi.fn();
      entity.myAction.mockReturnValue('result');

      expect(asserter.ensure.is.ableTo.myAction(...args)).toBe('result');
      expect(entity.myAction).toHaveBeenCalledTimes(1);
      expect(entity.myAction).toHaveBeenCalledWith(...args);
      expect(entity.myAction).toHaveBeenCalledBefore(entity[DISABLE_ACTION_VALIDATION_METHOD_KEY]);
    });
  });

  describe('evaluation of ability to change state', () => {
    it('returns true for successful evaluation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = vi.fn();
      entity.myAction.mockReturnValue(true);

      expect(asserter.is.ableTo.myAction(...args)).toBe(true);
      expect(entity.myAction).toHaveBeenCalledTimes(1);
      expect(entity.myAction).toHaveBeenCalledWith(...args);
    });

    it('ensures that state of entity is being snapshotted before evaluation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = vi.fn();
      entity.myAction.mockReturnValue(true);
      entity[ENABLE_ACTION_VALIDATION_METHOD_KEY] = vi.fn();

      expect(asserter.is.ableTo.myAction(...args)).toBe(true);
      expect(entity[ENABLE_ACTION_VALIDATION_METHOD_KEY]).toHaveBeenCalledBefore(entity.myAction);
    });

    it('ensures that state of entity is being rollbacked after validation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = vi.fn();
      entity.myAction.mockReturnValue(true);

      expect(asserter.is.ableTo.myAction(...args)).toBe(true);
      expect(entity.myAction).toHaveBeenCalledBefore(entity[DISABLE_ACTION_VALIDATION_METHOD_KEY]);
    });

    it('returns false for failed evaluation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = vi.fn();
      entity.myAction.mockImplementation(() => { throw new Error(); });

      expect(asserter.is.ableTo.myAction(...args)).toBe(false);
      expect(entity.myAction).toHaveBeenCalledTimes(1);
      expect(entity.myAction).toHaveBeenCalledWith(...args);
    });

    it('ensures that state of entity is being rollbacked if action throws error', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = vi.fn();
      entity.myAction.mockImplementation(() => { throw new Error(); });

      expect(asserter.is.ableTo.myAction(...args)).toBe(false);
      expect(entity.myAction).toHaveBeenCalledBefore(entity[DISABLE_ACTION_VALIDATION_METHOD_KEY]);
    });
  });
});

