import { expect, describe, it, vi } from 'vitest';

import { derive } from '@traits-ts/core';
import {
  HookableTrait,
  HookAlreadyExistsError,
  HookNotFoundError,
  InvalidHookActionError,
  InvalidHookIdError,
} from '../../../src/traits/hookable.trait';
import { HOOKABLE_KEY } from '../../../src/constants/metadata-keys';

describe('HookableTrait', () => {
  describe('registration', () => {
    it('registers hook for specific action with id as a string and fn as a function', () => {
      class MyClass extends derive(HookableTrait) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = vi.fn();

      MyClass.prototype.registerHook(action, id, fn);
      expect(MyClass.prototype.getHook(action, id)).toBe(fn);
    });

    it(`throws InvalidHookActionError when action is not a string`, () => {
      class MyClass extends derive(HookableTrait) {}

      expect(() => {
        MyClass.prototype.registerHook(
          undefined as any as string,
          'my-id',
          vi.fn()
        );
      }).toThrow(
        InvalidHookActionError,
        `Expected action argument to be string, got undefined`
      );
      expect(() => {
        MyClass.prototype.registerHook(null as any as string, 'my-id', vi.fn());
      }).toThrow(
        InvalidHookActionError,
        `Expected action argument to be string, got null`
      );
    });

    it(`throws InvalidHookIdError when id is not a string`, () => {
      class MyClass extends derive(HookableTrait) {}

      expect(() => {
        MyClass.prototype.registerHook(
          'my-action',
          undefined as any as string,
          vi.fn()
        );
      }).toThrow(
        InvalidHookIdError,
        `Expected id argument to be string, got undefined`
      );
      expect(() => {
        MyClass.prototype.registerHook(
          'my-action',
          null as any as string,
          vi.fn()
        );
      }).toThrow(
        InvalidHookIdError,
        `Expected id argument to be string, got null`
      );
    });

    it('ensures that hook can be set for action that was previously not defined', () => {
      class MyClass extends derive(HookableTrait) {}

      const action = 'my-new-action';
      const id = 'my-id';
      const fn = vi.fn();

      expect(() => {
        MyClass.prototype.registerHook(action, id, fn);
      }).not.toThrow(Error);
    });

    it('throws HookAlreadyExistsError when hook would be overridden', () => {
      class MyClass extends derive(HookableTrait) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = vi.fn();

      MyClass.prototype.registerHook(action, id, fn);
      expect(() => {
        MyClass.prototype.registerHook(action, id, fn);
      }).toThrow(
        HookAlreadyExistsError,
        `MyClass: hook for action 'my-action' with id 'my-id' would be overwritten. Avoid overriding of existing hooks do to inconsistent behavior`
      );
    });

    it('returns hook by action and id', () => {
      class MyClass extends derive(HookableTrait) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = vi.fn();

      MyClass.prototype.registerHook(action, id, fn);
      expect(MyClass.prototype.getHook(action, id)).toBe(fn);
    });

    it(`throws HookNotFoundError when hook can't be found`, () => {
      class MyClass extends derive(HookableTrait) {}

      const notExistingAction = 'my-not-existing-action';
      const notExistingId = 'my-not-existing-id';

      expect(() => {
        MyClass.prototype.getHookOrThrow(notExistingAction, notExistingId);
      }).toThrow(
        HookNotFoundError,
        `MyClass: hook for action 'my-not-existing-action' with id 'my-not-existing-id' can't be found`
      );
    });

    it('adds metadata to class flagging it as hookable', () => {
      class MyClass extends derive(HookableTrait) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = vi.fn();

      MyClass.prototype.registerHook(action, id, fn);
      expect(Reflect.getOwnMetadata(HOOKABLE_KEY, MyClass)).toBe(true);
    });

    it(`ensures that hooks registered under same action and different id are resolved from both: parent and child`, () => {
      class Parent extends derive(HookableTrait) {}
      class Child extends Parent {}

      const action = 'my-action';
      const parentId = 'parent-id';
      const childId = 'child-id';
      const parentFn = vi.fn();
      const childFn = vi.fn();

      Parent.prototype.registerHook(action, parentId, parentFn);
      Child.prototype.overrideHook(action, childId, childFn);

      expect(Parent.prototype.hasHook(action, parentId)).toBe(true);
      expect(Child.prototype.hasHook(action, childId)).toBe(true);

      expect(Child.prototype.getActions()).toEqual({
        'my-action': {
          'parent-id': parentFn,
          'child-id': childFn,
        },
      });
    });
  });

  describe('evaluation', () => {
    describe('evaluate if hooks are registered for action', () => {
      it('returns true if hooks exists for action', () => {
        class MyClass extends derive(HookableTrait) {}

        const action = 'my-action';
        const id = 'my-id';
        const fn = vi.fn();

        MyClass.prototype.registerHook(action, id, fn);
        expect(MyClass.prototype.hasAction(action)).toBe(true);
      });

      it('returns false if hooks does not exist for action', () => {
        class MyClass extends derive(HookableTrait) {}

        const action = 'my-action';
        const id = 'my-id';
        const fn = vi.fn();

        MyClass.prototype.registerHook(action, id, fn);
        expect(MyClass.prototype.hasAction('non-existing-action')).toBe(false);
      });
    });

    describe('evaluate if hook exists', () => {
      it('returns true if hook exists for action and id', () => {
        class MyClass extends derive(HookableTrait) {}

        const action = 'my-action';
        const id = 'my-id';
        const fn = vi.fn();

        MyClass.prototype.registerHook(action, id, fn);
        expect(MyClass.prototype.hasHook(action, id)).toBe(true);
      });

      it('returns false if hook does not exist for action and id', () => {
        class MyClass extends derive(HookableTrait) {}

        const action = 'my-action';
        const id = 'my-id';
        const fn = vi.fn();

        MyClass.prototype.registerHook(action, id, fn);
        expect(MyClass.prototype.hasHook('non-existing-action', id)).to.be
          .false;
        expect(MyClass.prototype.hasHook(action, 'non-existing-id')).to.be
          .false;
      });
    });
  });

  describe('getters', () => {
    it('returns collection of all registered hooks for specific action', () => {
      class MyClass extends derive(HookableTrait) {}

      const action = 'my-action';
      const firstId = 'first';
      const secondId = 'second';
      const firstFn = vi.fn();
      const secondFn = vi.fn();

      MyClass.prototype.registerHook(action, firstId, firstFn);
      MyClass.prototype.registerHook(action, secondId, secondFn);
      const expected = {
        first: firstFn,
        second: secondFn,
      };
      expect(MyClass.prototype.getHooks(action)).toEqual(expected);
    });

    it('returns collection of all registered actions', () => {
      class MyClass extends derive(HookableTrait) {}

      const action = 'my-action';
      const firstId = 'first';
      const secondId = 'second';
      const firstFn = vi.fn();
      const secondFn = vi.fn();

      MyClass.prototype.registerHook(action, firstId, firstFn);
      MyClass.prototype.registerHook(action, secondId, secondFn);
      const expected = {
        'my-action': {
          first: firstFn,
          second: secondFn,
        },
      };
      expect(MyClass.prototype.getActions()).toEqual(expected);
    });

    it('returns empty collection on non registered action', () => {
      class MyClass extends derive(HookableTrait) {}

      expect(MyClass.prototype.getActions()).toEqual({});
    });
  });

  describe('mutators', () => {
    it('removes hook by action and id', () => {
      class MyClass extends derive(HookableTrait) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = vi.fn();

      MyClass.prototype.registerHook(action, id, fn);
      expect(MyClass.prototype.hasHook(action, id)).toBe(true);
      MyClass.prototype.removeHook(action, id);
      expect(MyClass.prototype.hasHook(action, id)).toBe(false);
    });

    it(`ensures that hook from parent can't removed on child class instance`, () => {
      class Parent extends derive(HookableTrait) {}
      class Child extends Parent {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = vi.fn();

      Parent.prototype.registerHook(action, id, fn);
      expect(Parent.prototype.hasHook(action, id)).toBe(true);
      expect(Child.prototype.hasHook(action, id)).toBe(true);

      Child.prototype.removeHook(action, id);
      expect(Child.prototype.hasHook(action, id)).toBe(true);
      expect(Parent.prototype.hasHook(action, id)).toBe(true);
    });

    it(`allows to remove overriding hook on child even if parent hs already registered hook under same action and id`, () => {
      class Parent extends derive(HookableTrait) {}
      class Child extends Parent {}

      const action = 'my-action';
      const id = 'my-id';
      const parentFn = vi.fn();
      const childFn = vi.fn();

      Parent.prototype.registerHook(action, id, parentFn);
      Child.prototype.overrideHook(action, id, childFn);
      expect(Parent.prototype.hasHook(action, id)).toBe(true);
      expect(Child.prototype.hasHook(action, id)).toBe(true);

      Child.prototype.removeHook(action, id);
      expect(Child.prototype.hasHook(action, id)).toBe(true);
      expect(Child.prototype.getHook(action, id)).toBe(parentFn);
      expect(Parent.prototype.hasHook(action, id)).toBe(true);
      expect(Parent.prototype.getHook(action, id)).toBe(parentFn);
    });
  });

  describe('leakage', () => {
    it('ensures that hooks set on child class does not leak to parent class and vice versa', () => {
      class MyParent extends derive(HookableTrait) {}
      class MyChild extends MyParent {}

      const myParentInstance = new MyParent();
      const myChildInstance = new MyChild();

      myParentInstance.registerHook('onConstruction', 'parent', vi.fn());
      myChildInstance.registerHook('onConstruction', 'child', vi.fn());

      expect(myParentInstance.hasHook('onConstruction', 'parent')).toBe(true);
      expect(myParentInstance.hasHook('onConstruction', 'child')).toBe(false);

      expect(myChildInstance.hasHook('onConstruction', 'parent')).toBe(false);
      expect(myChildInstance.hasHook('onConstruction', 'child')).toBe(true);
    });
  });
});
