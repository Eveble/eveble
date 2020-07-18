import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { PropTypes, ValidationError } from 'typend';
import { pull } from 'lodash';
import sinon from 'sinon';
import { Entity } from '../../../src/domain/entity';
import { Serializable } from '../../../src/components/serializable';
import { StatefulMixin } from '../../../src/mixins/stateful-mixin';
import { StatusfulMixin } from '../../../src/mixins/statusful-mixin';
import { isDefinable } from '../../../src/utils/helpers';
import { types } from '../../../src/types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Command } from '../../../src/components/command';
import { ValueObject } from '../../../src/domain/value-object';
import {
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
  SAVED_STATE_KEY,
} from '../../../src/constants/literal-keys';
import { define } from '../../../src/decorators/define';
import { UnavailableAsserterError } from '../../../src/core/core-errors';
import { kernel } from '../../../src/core/kernel';
import { SavedStateNotFoundError } from '../../../src/domain/domain-errors';

chai.use(sinonChai);

describe('Entity', function () {
  let asserter: any;

  @define('Account', { isRegistrable: false })
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

    changeName(name: string): void {
      this.assign({ name });
    }

    updateProfile(props: types.Props): void {
      this.assign(props);
    }
  }
  @define('Price', { isRegistrable: false })
  class Price extends ValueObject {
    value: number;
  }

  @define('Item', { isRegistrable: false })
  class Item extends Entity {
    price: Price;
  }

  @define('Order', { isRegistrable: false })
  class Order extends Entity {
    items: Item[];

    removeItem(item: Item): void {
      pull(this.items, item);
    }
  }

  beforeEach(() => {
    asserter = stubInterface<types.Asserter>();
    kernel.setAsserter(asserter);
  });

  afterEach(() => {
    kernel.setAsserter(undefined as any);
  });

  it(`extends Serializable`, () => {
    expect(Entity.prototype).to.be.instanceof(Serializable);
  });

  it(`implements StatefulMixin`, () => {
    expect(Entity.prototype).to.be.instanceof(StatefulMixin);
  });

  it(`implements StatusfulMixin`, () => {
    expect(Entity.prototype).to.be.instanceof(StatusfulMixin);
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Entity.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(Entity.getTypeName()).to.equal('Entity');
    expect(Entity.prototype.getTypeName()).to.equal('Entity');
  });

  describe('prop types', () => {
    it('have prop types set for: id, schemaVersion, state, status, SAVED_STATE_KEY', () => {
      expect(Entity.getPropTypes()).to.contain.all.keys([
        'id',
        'schemaVersion',
        'state',
        'status',
        SAVED_STATE_KEY,
      ]);
    });

    it('takes required id property as a string or Guid', () => {
      expect(Entity.getPropTypes().id).to.be.eql(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes optional schemaVersion property as a number', () => {
      expect(Entity.getPropTypes().schemaVersion).to.be.eql(
        PropTypes.instanceOf(Number).isOptional
      );
    });

    it('takes optional state property as a string', () => {
      expect(Entity.getPropTypes().state).to.be.eql(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Number),
        ])
      );
    });

    it('takes optional status property as a string', () => {
      expect(Entity.getPropTypes().status).to.be.eql(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Number),
        ])
      );
    });

    it('has optional SAVED_STATE_KEY property as a symbol', () => {
      // https://github.com/microsoft/TypeScript/issues/1863
      const propTypes: any = Entity.getPropTypes();
      expect(propTypes[SAVED_STATE_KEY]).to.be.eql(PropTypes.object.isOptional);
    });
  });

  describe(`construction`, () => {
    it(`throws ValidationError if id is missing on properties`, () => {
      expect(() => new Entity({})).to.throw(
        ValidationError,
        `Entity: (Key 'id': Expected undefined to be one of: [[String], [Guid]] in {})`
      );
    });

    it(`throws ValidationError if provided object does not contain id as a string or guid`, () => {
      const props = {
        name: 'value',
      };
      expect(() => new Entity(props)).to.throw(
        ValidationError,
        `Entity: (Key 'id': Expected undefined to be one of: [[String], [Guid]] in {"name":String("value")})`
      );
    });

    it(`takes object with id property as a string and assigns it`, () => {
      const id = 'my-id';
      expect(new Entity({ id }).id).to.be.equal(id);
    });

    it(`takes object with id property as a guid and assigns it`, () => {
      const id = new Guid();
      expect(new Entity({ id }).id).to.be.equal(id);
    });

    it(`takes an object with properties matching prop types and assigns them`, () => {
      const props = {
        id: new Guid(),
        name: 'my-name',
      };
      expect(new Account(props)).to.be.eql(props);
    });

    describe('static constructor', () => {
      it(`constructs from properties picked from source`, () => {
        const props = {
          id: new Guid(),
          name: 'value',
        };
        const entity = Account.from(props);
        expect(entity).to.be.instanceof(Account);
        expect(entity.id).to.be.equal(props.id);
        expect(entity.name).to.be.equal(props.name);
      });

      it('constructs from properties picked from multiple source', () => {
        const props1 = {
          id: new Guid(),
        };
        const props2 = {
          name: 'value',
        };
        const person = Account.from(props1, props2);
        expect(person).to.be.instanceof(Account);
        expect(person).to.be.eql({
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
        expect(new Entity({ id }).getId()).to.be.equal(id);
      });

      it(`returns id as a Guid instance`, () => {
        const id = 'my-id';
        expect(new Entity({ id }).getId()).to.be.equal(id);
      });
    });
  });

  describe(`comparison`, () => {
    it(`returns true when same both entities are instances of same class and have same id`, () => {
      const first = new Entity({ id: 'my-id' });
      const second = new Entity({ id: 'my-id' });
      expect(first.equals(second)).to.be.true;
    });

    it(`returns false when entities of same class are instances of same class but have different id`, () => {
      const first = new Entity({ id: 'my-id' });
      const second = new Entity({ id: 'other-id' });
      expect(first.equals(second)).to.be.false;
    });

    it(`returns false when entities are not instances of same class and have same id`, () => {
      const first = new Entity({ id: 'my-id' });
      const second = new Account({ id: 'my-id', name: 'my-name' });
      expect(first.equals(second)).to.be.false;
    });
  });

  describe('recording state change', () => {
    it(`assigns properties on entity instance`, () => {
      const entity = new Account({
        id: 'my-id',
        name: 'Foo',
      });
      entity.changeName('Bar');
      expect(entity.name).to.be.equal('Bar');
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
      expect(() => entity.updateProfile(props)).to.not.throw(ValidationError);
      expect(entity.name).to.be.equal('Jane Doe');
      expect(entity.age).to.be.equal(28);
      expect((entity as any).color).to.be.undefined;
    });

    it(`throws ValidationError upon assign invalid properties to entity instance`, () => {
      const entity = new Account({
        id: 'my-id',
        name: 'Foo',
      });
      expect(() => entity.changeName((1 as any) as string)).to.throw(
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

          expect(() => entity.on('my-action')).to.throw(
            UnavailableAsserterError,
            `Assertion is unavailable outside on application environment. Define application before using any features related to assertion on entities or set asserter on kernel by using <kernel.setAsserter()>`
          );
        });

        it('sets the action as a string on asserter', () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          entity.on('my-action');
          expect(asserter.setAction).to.be.calledOnce;
          expect(asserter.setAction).to.be.calledWith('my-action');
        });

        it('sets the action as a Command on asserter', () => {
          @define('MyCommand', { isRegistrable: false })
          class MyCommand extends Command<MyCommand> {}

          const entity = new Account({ id: 'my-id', name: 'my-name' });
          entity.on(MyCommand);
          expect(asserter.setAction).to.be.calledOnce;
          expect(asserter.setAction).to.be.calledWith(MyCommand);
        });

        it(`returns entity instance 'on' setting action`, () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(entity.on('my-action')).to.be.equal(entity);
        });
      });

      describe('ensure', () => {
        it('returns proxified instance of entity', () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(entity.ensure).to.be.instanceof(Account);
          expect(entity.ensure).to.not.be.equal(entity);
        });

        it(`ensures that error is not thrown upon using 'entity.ensure' without method name`, () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(() => entity.ensure).to.not.throw(Error);
        });

        it(`returns matching assertion from asserter if provided method name is matching registered assertion's api`, () => {
          asserter.hasApi.withArgs('is.').returns(true);
          const isAssertion = sinon.stub();
          asserter.ensure = {
            is: isAssertion,
          };

          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(entity.ensure.is).to.be.equal(isAssertion);
          expect(asserter.hasApi).to.be.calledOnce;
          expect(asserter.hasApi).to.be.calledWithExactly('is.');
          expect(asserter.setEntity).to.be.calledOnce;
          expect(asserter.setEntity).to.be.calledWithExactly(entity);
        });

        it('returns proxified method if provided property key matches function on entity but there is no registered assertion api', () => {
          asserter.hasApi.withArgs('updateProfile.').returns(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          entity.updateProfile = sinon.stub();

          const props = {
            name: 'my-other-name',
          };
          expect(entity.ensure.updateProfile(props)).to.not.be.instanceof(
            Account
          );
          expect(entity.updateProfile).to.be.calledOnce;
          expect(entity.updateProfile).to.be.calledWithMatch(props);
        });

        it('ensures that state of entity is rollbacked after invocation of non-assertion method', () => {
          asserter.hasApi.withArgs('updateProfile.').returns(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          const props = {
            name: 'my-other-name',
          };
          entity.ensure.updateProfile(props);
          expect(entity.name).to.be.equal('my-name');
        });

        it('ensures that state of entity is rollbacked before re-throwing error from non-assertion method', () => {
          asserter.hasApi.withArgs('updateProfile.').returns(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });

          entity.ensure.disable();
          expect(() => entity.ensure.activate()).to.throw(Error);
          expect(entity.isInState(Account.STATES.disabled)).to.be.true;
        });

        it('returns property if provided key is not matching assertion api or method', () => {
          asserter.hasApi.withArgs('name.').returns(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });

          expect(entity.ensure.name).to.be.equal('my-name');
        });

        it('returns entity if provided key does not match property, assertion api or method', () => {
          asserter.hasApi.withArgs('name.').returns(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });

          expect(entity.ensure.test).to.be.equal(entity);
        });
      });

      describe('can', () => {
        it('returns proxified instance of entity', () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(entity.can).to.be.instanceof(Account);
          expect(entity.can).to.not.be.equal(entity);
        });

        it(`ensures that error is not thrown upon using 'entity.can' without method name`, () => {
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          expect(() => entity.can).to.not.throw(Error);
        });

        it('returns proxified method if provided property key matches function on entity', () => {
          asserter.hasApi.withArgs('updateProfile.').returns(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          entity.updateProfile = sinon.stub();

          const props = {
            name: 'my-other-name',
          };
          expect(entity.can.updateProfile(props)).to.be.true;
          expect(entity.updateProfile).to.be.calledOnce;
          expect(entity.updateProfile).to.be.calledWithMatch(props);
        });

        it('ensures that state of entity is rollbacked after invocation method', () => {
          asserter.hasApi.withArgs('updateProfile.').returns(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });
          const props = {
            name: 'my-other-name',
          };
          entity.can.updateProfile(props);
          expect(entity.name).to.be.equal('my-name');
        });

        it('ensures that state of entity is rollbacked before re-throwing error from  method', () => {
          asserter.hasApi.withArgs('updateProfile.').returns(false);
          const entity = new Account({ id: 'my-id', name: 'my-name' });

          expect(entity.can.disable()).to.be.true;
          expect(entity.can.activate()).to.be.false;
          expect(entity.isInState(Account.STATES.disabled)).to.be.true;
        });
      });
    });
  });

  describe('save and rollback of state', () => {
    it('allows to save and rollback Entity state', () => {
      const entity = new Account({ id: 'my-id', name: 'initial-name' });
      entity[SAVE_STATE_METHOD_KEY]();
      entity.changeName('changed-name');
      expect(entity.name).to.be.equal('changed-name');
      entity[ROLLBACK_STATE_METHOD_KEY]();
      expect(entity.name).to.be.equal('initial-name');
    });

    it('ensures that nested types state is also preserved on rollback operation', () => {
      const items = [
        new Item({ id: 'first', price: new Price({ value: 1.29 }) }),
        new Item({ id: 'second', price: new Price({ value: 6.99 }) }),
      ];
      const entity = new Order({ id: 'my-id', items });
      expect(entity.items).to.be.eql(items);

      entity[SAVE_STATE_METHOD_KEY]();
      entity.removeItem(items[0]);
      entity.items[0].price = new Price({ value: 9000 });
      entity[ROLLBACK_STATE_METHOD_KEY]();
      expect(entity.items).to.be.eql([
        new Item({ id: 'first', price: new Price({ value: 1.29 }) }),
        new Item({ id: 'second', price: new Price({ value: 6.99 }) }),
      ]);
    });

    it('ensures that save is deleted after issuing rollback', () => {
      const entity = new Account({ id: 'my-id', name: 'initial-name' });
      entity[SAVE_STATE_METHOD_KEY]();
      expect(entity.isStateSaved()).to.be.true;
      entity.changeName('changed-name');
      entity[ROLLBACK_STATE_METHOD_KEY]();
      expect(entity.isStateSaved()).to.be.false;
    });

    it('does not allow to rollback unavailable previous state', () => {
      const entity = new Account({ id: 'my-id', name: 'initial-name' });
      expect(() => entity[ROLLBACK_STATE_METHOD_KEY]()).to.throw(
        SavedStateNotFoundError,
        `Account@my-id: expected entity to be have state saved before rollbacking it`
      );
    });
  });

  describe('hooks', () => {
    it('has convert-serializable-list hook applied', () => {
      expect(
        Entity.prototype.hasHook('onConstruction', 'convert-serializable-list')
      ).to.be.true;
    });
  });
});
