import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { PropTypes, ValidationError } from 'typend';
import { pull } from 'lodash';

import { Type, UnavailableAsserterError, kernel } from '@eveble/core';
import { derived } from '@traits-ts/core';
import { Entity } from '../../../src/domain/entity';
import { isTyped } from '../../../src/utils/helpers';
import { types } from '../../../src/types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Command } from '../../../src/components/command';
import { ValueObject } from '../../../src/domain/value-object';
import {
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
} from '../../../src/constants/literal-keys';
import { SavedStateNotFoundError } from '../../../src/domain/domain-errors';
import { can } from '../../../src/decorators/can';
import { StatusfulTrait } from '../../../src/traits/statusful.trait';
import { Serializable } from '../../../src/components/serializable';
import { StatefulTrait } from '../../../src/traits/stateful.trait';

describe('Entity', () => {
  let asserter: any;

  @Type('Account', { isRegistrable: false })
  class Account extends Entity {
    static STATES = {
      active: 'active',
      disabled: 'disabled',
    };

    name: string;

    age?: number;

    activate(): void {
      if (this.isInState(Account.STATES.disabled)) {
        throw new Error('Account disabled');
      }
      this.setState(Account.STATES.active);
    }

    disable(): void {
      this.setState(Account.STATES.disabled);
    }

    @can((_account: Account, name: string) => {
      if (name.length > 20) {
        throw new Error('name-to-long');
      }
    })
    changeName(name: string): void {
      this.assign({ name });
    }

    @can((_account: Account, props: Partial<Account>) => {
      // do validation
      if (props.name !== undefined && props.name.length > 20) {
        throw new Error('name-to-long');
      }
    })
    updateProfile(props: types.Props): void {
      this.assign(props);
    }
  }
  @Type('Price', { isRegistrable: false })
  class Price extends ValueObject {
    value: number;
  }

  @Type('Item', { isRegistrable: false })
  class Item extends Entity {
    price: Price;
  }

  @Type('Order', { isRegistrable: false })
  class Order extends Entity {
    items: Item[];

    removeItem(item: Item): void {
      pull(this.items, item);
    }
  }

  beforeEach(() => {
    asserter = mock<types.Asserter>();
    kernel.setAsserter(asserter);
  });

  afterEach(() => {
    kernel.setAsserter(undefined as any);
  });

  it(`extends Serializable`, () => {
    expect(Entity.prototype).toBeInstanceOf(Serializable);
  });

  it(`implements StatefulTrait`, () => {
    expect(derived(Entity.prototype, StatefulTrait)).toBe(true);
  });

  it(`implements StatusfulTrait`, () => {
    expect(derived(Entity.prototype, StatusfulTrait)).toBe(true);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(Entity.prototype)).toBe(true);
  });

  it('defines the type name correctly', () => {
    expect(Entity.getTypeName()).toBe('Entity');
    expect(Entity.prototype.getTypeName()).toBe('Entity');
  });

  describe('prop types', () => {
    it('have prop types set for: id, schemaVersion, state, status', () => {
      expect(Object.keys(Entity.getPropTypes()).sort()).toEqual([
        'id',
        'schemaVersion',
        'state',
        'status',
      ]);
    });

    it('takes required id property as a string or Guid', () => {
      expect(Entity.getPropTypes().id).toEqual(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes optional schemaVersion property as a number', () => {
      expect(Entity.getPropTypes().schemaVersion).toEqual(
        PropTypes.instanceOf(Number).isOptional
      );
    });

    it('takes optional state property as a string', () => {
      expect(Entity.getPropTypes().state).toEqual(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Number),
        ])
      );
    });

    it('takes optional status property as a string', () => {
      expect(Entity.getPropTypes().status).toEqual(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Number),
        ])
      );
    });
  });

  describe(`construction`, () => {
    it(`throws ValidationError if id is missing on properties`, () => {
      expect(() => new Entity({})).toThrow(
        ValidationError,
        `Entity: (Key 'id': Expected undefined to be one of: [[String], [Guid]] in {})`
      );
    });

    it(`throws ValidationError if provided object does not contain id as a string or guid`, () => {
      const props = {
        name: 'value',
      };
      expect(() => new Entity(props)).toThrow(
        ValidationError,
        `Entity: (Key 'id': Expected undefined to be one of: [[String], [Guid]] in {"name":String("value")})`
      );
    });

    it(`takes object with id property as a string and assigns it`, () => {
      const id = 'my-id';
      expect(new Entity({ id }).id).toBe(id);
    });

    it(`takes object with id property as a guid and assigns it`, () => {
      const id = new Guid();
      expect(new Entity({ id }).id).toBe(id);
    });

    it(`takes an object with properties matching prop types and assigns them`, () => {
      const props = {
        id: new Guid(),
        name: 'my-name',
      };
      expect(new Account(props)).toEqual(props);
    });

    describe('static constructor', () => {
      it(`constructs from properties picked from source`, () => {
        const props = {
          id: new Guid(),
          name: 'value',
        };
        const entity = Account.from(props);
        expect(entity).toBeInstanceOf(Account);
        expect(entity.id).toBe(props.id);
        expect(entity.name).toBe(props.name);
      });

      it('constructs from properties picked from multiple source', () => {
        const props1 = {
          id: new Guid(),
        };
        const props2 = {
          name: 'value',
        };
        const person = Account.from(props1, props2);
        expect(person).toBeInstanceOf(Account);
        expect(person).toEqual({
          id: props1.id,
          name: props2.name,
        });
      });
    });
  });

  describe(`accessors`, () => {
    describe(`getId`, () => {
      it(`returns id as a string`, () => {
        const id = new Guid();
        expect(new Entity({ id }).getId()).toBe(id);
      });

      it(`returns id as a Guid instance`, () => {
        const id = 'my-id';
        expect(new Entity({ id }).getId()).toBe(id);
      });
    });
  });

  describe(`comparison`, () => {
    it(`returns true when same both entities are instances of same class and have same id`, () => {
      const first = new Entity({ id: 'my-id' });
      const second = new Entity({ id: 'my-id' });
      expect(first.equals(second)).toBe(true);
    });

    it(`returns false when entities of same class are instances of same class but have different id`, () => {
      const first = new Entity({ id: 'my-id' });
      const second = new Entity({ id: 'other-id' });
      expect(first.equals(second)).toBe(false);
    });

    it(`returns false when entities are not instances of same class and have same id`, () => {
      const first = new Entity({ id: 'my-id' });
      const second = new Account({ id: 'my-id', name: 'my-name' });
      expect(first.equals(second)).toBe(false);
    });
  });

  describe('recording state change', () => {
    it(`assigns properties on entity instance`, () => {
      const entity = new Account({
        id: 'my-id',
        name: 'Foo',
      });
      entity.changeName('Bar');
      expect(entity.name).toBe('Bar');
    });

    it(`only assigns properties from sources that matches prop types on entity instance and omits the rest`, () => {
      const entity = new Account({
        id: 'my-id',
        name: 'Foo',
      });
      entity.changeName('Bar');
      const props = {
        name: 'Jane Doe',
        age: 28,
        color: 'black',
      };
      expect(() => entity.updateProfile(props)).not.toThrow(ValidationError);
      expect(entity.name).toBe('Jane Doe');
      expect(entity.age).toBe(28);
      expect((entity as any).color).toBeUndefined();
    });

    it(`throws ValidationError upon assign invalid properties to entity instance`, () => {
      const entity = new Account({
        id: 'my-id',
        name: 'Foo',
      });
      expect(() => entity.changeName(1 as any as string)).toThrow(
        ValidationError,
        `Account: (Key 'name': Expected Number(1) to be a String in {"id":String("my-id"), "name":Number(1)})`
      );
    });
  });

  describe('asserting', () => {
    describe('with asserter', () => {
      describe('on', () => {
        it('throws UnavailableAsserterError if assertion is not set', () => {
          kernel.setAsserter(undefined as any);

          const entity = new Account({ id: 'my-id', name: 'my-name' });

          expect(() => entity.on('my-action')).toThrow(
            UnavailableAsserterError,
            `Assertion is unavailable outside on application environment. Define application before using any features related to assertion on entities or set asserter on kernel by using <kernel.setAsserter()>`
          );
        });

        it('sets the action as a string on asserter', () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          entity.on('my-action');
          expect(asserter.setAction).toHaveBeenCalledTimes(1);
          expect(asserter.setAction).toHaveBeenCalledWith('my-action');
        });

        it('sets the action as a Command on asserter', () => {
          @Type('MyCommand', { isRegistrable: false })
          class MyCommand extends Command<MyCommand> {}

          const entity = new Account({ id: 'my-id', name: 'my-name' });
          entity.on(MyCommand);
          expect(asserter.setAction).toHaveBeenCalledTimes(1);
          expect(asserter.setAction).toHaveBeenCalledWith(MyCommand);
        });

        it(`returns entity instance 'on' setting action`, () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(entity.on('my-action')).toBe(entity);
        });
      });

      describe('ensure', () => {
        it('returns proxified instance of entity', () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          const proxy = entity.ensure;
          expect(proxy instanceof Account).toBe(true);
          expect(proxy === entity).toBe(false);
        });

        it(`ensures that error is not thrown upon using 'entity.ensure' without method name`, () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(() => entity.ensure).not.toThrow(Error);
        });

        it(`returns matching assertion from asserter if provided method name is matching registered assertion's api`, () => {
          asserter.hasApi.calledWith('is.').mockReturnValue(true);
          const isAssertion = vi.fn();
          asserter.ensure = {
            is: isAssertion,
          };

          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(entity.ensure.is).toBe(isAssertion);
          expect(asserter.hasApi).toHaveBeenCalledTimes(1);
          expect(asserter.hasApi).toHaveBeenCalledWith('is.');
          expect(asserter.setEntity).toHaveBeenCalledTimes(1);
          expect(asserter.setEntity).toHaveBeenCalledWith(entity);
        });

        it('returns proxified method if provided property key matches function on entity but there is no registered assertion api', () => {
          asserter.hasApi.calledWith('updateProfile.').mockReturnValue(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          entity.updateProfile = vi.fn();

          const props = {
            name: 'my-other-name',
          };
          expect(entity.ensure.updateProfile(props)).not.toBeInstanceOf(
            Account
          );
          expect(entity.updateProfile).toHaveBeenCalledTimes(1);
          expect(entity.updateProfile).toHaveBeenCalledWith(
            expect.objectContaining(props)
          );
        });

        it('ensures that state of entity is not changed after invocation of assertion method', () => {
          asserter.hasApi.calledWith('updateProfile.').mockReturnValue(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          const props = {
            name: 'my-other-name',
          };
          entity.ensure.updateProfile(props);
          expect(entity.name).toBe('my-name');
        });

        it('ensures that state of entity is rollbacked before re-throwing error from non-assertion method', () => {
          asserter.hasApi.calledWith('updateProfile.').mockReturnValue(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });

          entity.ensure.disable();
          expect(() => entity.ensure.activate()).toThrow(Error);
          expect(entity.isInState(Account.STATES.disabled)).toBe(true);
        });

        it('returns property if provided key is not matching assertion api or method', () => {
          asserter.hasApi.calledWith('name.').mockReturnValue(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });

          expect(entity.ensure.name).toBe('my-name');
        });

        it('returns entity if provided key does not match property, assertion api or method', () => {
          asserter.hasApi.calledWith('name.').mockReturnValue(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });

          expect(entity.ensure.test).toBe(entity);
        });
      });

      describe('can', () => {
        it('returns proxified instance of entity', () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          const proxy = entity.can;
          expect(proxy instanceof Account).toBe(true);
          expect(proxy === entity).toBe(false);
        });

        it(`ensures that error is not thrown upon using 'entity.can' without method name`, () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(() => entity.can).not.toThrow(Error);
        });

        it('returns proxified method if provided property key matches function on entity', () => {
          asserter.hasApi.calledWith('updateProfile.').mockReturnValue(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          entity.updateProfile = vi.fn();

          const props = {
            name: 'my-other-name',
          };
          expect(entity.can.updateProfile(props)).toBe(true);
          expect(entity.updateProfile).toHaveBeenCalledTimes(1);
          expect(entity.updateProfile).toHaveBeenCalledWith(
            expect.objectContaining(props)
          );
        });

        it('ensures that state of entity is rollbacked after invocation method', () => {
          asserter.hasApi.calledWith('updateProfile.').mockReturnValue(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          const props = {
            name: 'my-other-name',
          };
          entity.can.updateProfile(props);
          expect(entity.name).toBe('my-name');
        });

        it('ensures that state of entity is rollbacked before re-throwing error from  method', () => {
          asserter.hasApi.calledWith('updateProfile.').mockReturnValue(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });

          expect(entity.can.disable()).toBe(true);
          expect(entity.can.activate()).toBe(false);
          expect(entity.isInState(Account.STATES.disabled)).toBe(true);
        });
      });
    });
  });

  describe('save and rollback of state', () => {
    it('allows to save and rollback Entity state', () => {
      const entity = new Account({ id: 'my-id', name: 'initial-name' });
      entity[SAVE_STATE_METHOD_KEY]();
      entity.changeName('changed-name');
      expect(entity.name).toBe('changed-name');
      entity[ROLLBACK_STATE_METHOD_KEY]();
      expect(entity.name).toBe('initial-name');
    });

    it('ensures that nested types state is also preserved on rollback operation', () => {
      const items = [
        new Item({ id: 'first', price: new Price({ value: 1.29 }) }),
        new Item({ id: 'second', price: new Price({ value: 6.99 }) }),
      ];
      const entity = new Order({ id: 'my-id', items });
      expect(entity.items).toEqual(items);

      entity[SAVE_STATE_METHOD_KEY]();
      entity.removeItem(items[0]);
      entity.items[0].price = new Price({ value: 9000 });
      entity[ROLLBACK_STATE_METHOD_KEY]();
      expect(entity.items).toEqual([
        new Item({ id: 'first', price: new Price({ value: 1.29 }) }),
        new Item({ id: 'second', price: new Price({ value: 6.99 }) }),
      ]);
    });

    it('ensures that save is deleted after issuing rollback', () => {
      const entity = new Account({ id: 'my-id', name: 'initial-name' });
      entity[SAVE_STATE_METHOD_KEY]();
      expect(entity.isStateSaved()).toBe(true);
      entity.changeName('changed-name');
      entity[ROLLBACK_STATE_METHOD_KEY]();
      expect(entity.isStateSaved()).toBe(false);
    });

    it('does not allow to rollback unavailable previous state', () => {
      const entity = new Account({ id: 'my-id', name: 'initial-name' });
      expect(() => entity[ROLLBACK_STATE_METHOD_KEY]()).toThrow(
        SavedStateNotFoundError,
        `Account@my-id: expected entity to be have state saved before rollbacking it`
      );
    });
  });
});
