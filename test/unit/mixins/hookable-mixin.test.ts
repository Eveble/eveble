import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { classes } from 'polytype';
import { HOOKABLE_KEY } from '../../../src/constants/metadata-keys';
import {
  HookableMixin,
  InvalidHookActionError,
  InvalidHookIdError,
  HookAlreadyExistsError,
  HookNotFoundError,
} from '../../../src/mixins/hookable-mixin';

chai.use(sinonChai);

describe('HookableMixin', () => {
  class BaseClass {}

  describe('registration', () => {
    it('registers hook for specific action with id as a string and fn as a function', () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = sinon.spy();

      MyClass.prototype.registerHook(action, id, fn);
      expect(MyClass.prototype.getHook(action, id)).to.be.equal(fn);
    });

    it(`throws InvalidHookActionError when action is not a string`, () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      expect(() => {
        MyClass.prototype.registerHook(
          undefined as any as string,
          'my-id',
          sinon.spy()
        );
      }).to.throw(
        InvalidHookActionError,
        `Expected action argument to be string, got undefined`
      );
      expect(() => {
        MyClass.prototype.registerHook(
          null as any as string,
          'my-id',
          sinon.spy()
        );
      }).to.throw(
        InvalidHookActionError,
        `Expected action argument to be string, got null`
      );
    });

    it(`throws InvalidHookIdError when id is not a string`, () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      expect(() => {
        MyClass.prototype.registerHook(
          'my-action',
          undefined as any as string,
          sinon.spy()
        );
      }).to.throw(
        InvalidHookIdError,
        `Expected id argument to be string, got undefined`
      );
      expect(() => {
        MyClass.prototype.registerHook(
          'my-action',
          null as any as string,
          sinon.spy()
        );
      }).to.throw(
        InvalidHookIdError,
        `Expected id argument to be string, got null`
      );
    });

    it('ensures that hook can be set for action that was previously not defined', () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const action = 'my-new-action';
      const id = 'my-id';
      const fn = sinon.spy();

      expect(() => {
        MyClass.prototype.registerHook(action, id, fn);
      }).to.not.throw(Error);
    });

    it('throws HookAlreadyExistsError when hook would be overridden', () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = sinon.spy();

      MyClass.prototype.registerHook(action, id, fn);
      expect(() => {
        MyClass.prototype.registerHook(action, id, fn);
      }).to.throw(
        HookAlreadyExistsError,
        `MyClass: hook for action 'my-action' with id 'my-id' would be overwritten. Avoid overriding of existing hooks do to inconsistent behavior`
      );
    });

    it('returns hook by action and id', () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = sinon.spy();

      MyClass.prototype.registerHook(action, id, fn);
      expect(MyClass.prototype.getHook(action, id)).to.be.equal(fn);
    });

    it(`throws HookNotFoundError when hook can't be found`, () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const notExistingAction = 'my-not-existing-action';
      const notExistingId = 'my-not-existing-id';

      expect(() => {
        MyClass.prototype.getHookOrThrow(notExistingAction, notExistingId);
      }).to.throw(
        HookNotFoundError,
        `MyClass: hook for action 'my-not-existing-action' with id 'my-not-existing-id' can't be found`
      );
    });

    it('adds metadata to class flagging it as hookable', () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = sinon.spy();

      MyClass.prototype.registerHook(action, id, fn);
      expect(Reflect.getOwnMetadata(HOOKABLE_KEY, MyClass)).to.be.true;
    });

    it(`ensures that hooks registered under same action and different id are resolved from both: parent and child`, () => {
      class Parent extends classes(BaseClass, HookableMixin) {}
      class Child extends Parent {}

      const action = 'my-action';
      const parentId = 'parent-id';
      const childId = 'child-id';
      const parentFn = sinon.spy();
      const childFn = sinon.spy();

      Parent.prototype.registerHook(action, parentId, parentFn);
      Child.prototype.overrideHook(action, childId, childFn);

      expect(Parent.prototype.hasHook(action, parentId)).to.be.true;
      expect(Child.prototype.hasHook(action, childId)).to.be.true;

      expect(Child.prototype.getActions()).to.be.eql({
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
        class MyClass extends classes(BaseClass, HookableMixin) {}

        const action = 'my-action';
        const id = 'my-id';
        const fn = sinon.spy();

        MyClass.prototype.registerHook(action, id, fn);
        expect(MyClass.prototype.hasAction(action)).to.be.true;
      });

      it('returns false if hooks does not exist for action', () => {
        class MyClass extends classes(BaseClass, HookableMixin) {}

        const action = 'my-action';
        const id = 'my-id';
        const fn = sinon.spy();

        MyClass.prototype.registerHook(action, id, fn);
        expect(MyClass.prototype.hasAction('non-existing-action')).to.be.false;
      });
    });

    describe('evaluate if hook exists', () => {
      it('returns true if hook exists for action and id', () => {
        class MyClass extends classes(BaseClass, HookableMixin) {}

        const action = 'my-action';
        const id = 'my-id';
        const fn = sinon.spy();

        MyClass.prototype.registerHook(action, id, fn);
        expect(MyClass.prototype.hasHook(action, id)).to.be.true;
      });

      it('returns false if hook does not exist for action and id', () => {
        class MyClass extends classes(BaseClass, HookableMixin) {}

        const action = 'my-action';
        const id = 'my-id';
        const fn = sinon.spy();

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
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const action = 'my-action';
      const firstId = 'first';
      const secondId = 'second';
      const firstFn = sinon.spy();
      const secondFn = sinon.spy();

      MyClass.prototype.registerHook(action, firstId, firstFn);
      MyClass.prototype.registerHook(action, secondId, secondFn);
      const expected = {
        first: firstFn,
        second: secondFn,
      };
      expect(MyClass.prototype.getHooks(action)).to.be.eql(expected);
    });

    it('returns collection of all registered actions', () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const action = 'my-action';
      const firstId = 'first';
      const secondId = 'second';
      const firstFn = sinon.spy();
      const secondFn = sinon.spy();

      MyClass.prototype.registerHook(action, firstId, firstFn);
      MyClass.prototype.registerHook(action, secondId, secondFn);
      const expected = {
        'my-action': {
          first: firstFn,
          second: secondFn,
        },
      };
      expect(MyClass.prototype.getActions()).to.be.eql(expected);
    });

    it('returns empty collection on non registered action', () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      expect(MyClass.prototype.getActions()).to.be.eql({});
    });
  });

  describe('mutators', () => {
    it('removes hook by action and id', () => {
      class MyClass extends classes(BaseClass, HookableMixin) {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = sinon.spy();

      MyClass.prototype.registerHook(action, id, fn);
      expect(MyClass.prototype.hasHook(action, id)).to.be.true;
      MyClass.prototype.removeHook(action, id);
      expect(MyClass.prototype.hasHook(action, id)).to.be.false;
    });

    it(`ensures that hook from parent can't removed on child class instance`, () => {
      class Parent extends classes(BaseClass, HookableMixin) {}
      class Child extends Parent {}

      const action = 'my-action';
      const id = 'my-id';
      const fn = sinon.spy();

      Parent.prototype.registerHook(action, id, fn);
      expect(Parent.prototype.hasHook(action, id)).to.be.true;
      expect(Child.prototype.hasHook(action, id)).to.be.true;

      Child.prototype.removeHook(action, id);
      expect(Child.prototype.hasHook(action, id)).to.be.true;
      expect(Parent.prototype.hasHook(action, id)).to.be.true;
    });

    it(`allows to remove overriding hook on child even if parent hs already registered hook under same action and id`, () => {
      class Parent extends classes(BaseClass, HookableMixin) {}
      class Child extends Parent {}

      const action = 'my-action';
      const id = 'my-id';
      const parentFn = sinon.spy();
      const childFn = sinon.spy();

      Parent.prototype.registerHook(action, id, parentFn);
      Child.prototype.overrideHook(action, id, childFn);
      expect(Parent.prototype.hasHook(action, id)).to.be.true;
      expect(Child.prototype.hasHook(action, id)).to.be.true;

      Child.prototype.removeHook(action, id);
      expect(Child.prototype.hasHook(action, id)).to.be.true;
      expect(Child.prototype.getHook(action, id)).to.be.equal(parentFn);
      expect(Parent.prototype.hasHook(action, id)).to.be.true;
      expect(Parent.prototype.getHook(action, id)).to.be.equal(parentFn);
    });
  });

  describe('leakage', () => {
    it('ensures that hooks set on child class does not leak to parent class and vice versa', () => {
      class MyParent extends classes(BaseClass, HookableMixin) {}
      class MyChild extends MyParent {}

      const myParentInstance = new MyParent();
      const myChildInstance = new MyChild();

      myParentInstance.registerHook('onConstruction', 'parent', sinon.spy());
      myChildInstance.registerHook('onConstruction', 'child', sinon.spy());

      expect(myParentInstance.hasHook('onConstruction', 'parent')).to.be.true;
      expect(myParentInstance.hasHook('onConstruction', 'child')).to.be.false;

      expect(myChildInstance.hasHook('onConstruction', 'parent')).to.be.false;
      expect(myChildInstance.hasHook('onConstruction', 'child')).to.be.true;
    });
  });
});
