import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { PropTypes, ValidationError } from 'typend';
import { pull } from 'lodash';
import { Entity } from '../../../src/domain/entity';
import { Serializable } from '../../../src/components/serializable';
import { StatefulMixin } from '../../../src/mixins/stateful-mixin';
import { StatusfulMixin } from '../../../src/mixins/statusful-mixin';
import { isDefinable } from '../../../src/utils/helpers';
import { types } from '../../../src/types';
import { Guid } from '../../../src/domain/value-objects/guid';
import { AsserterNotFoundError } from '../../../src/domain/domain-errors';
import { Command } from '../../../src/components/command';
import { ValueObject } from '../../../src/domain/value-object';
import {
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
  SAVED_STATE_KEY,
} from '../../../src/constants/literal-keys';
import { define } from '../../../src/decorators/define';

chai.use(sinonChai);

describe('Entity', function() {
  let asserter: any;

  @define('Person', { isRegistrable: false })
  class Person extends Entity {
    static STATES = {
      active: 'active',
      disabled: 'disabled',
    };

    name: string;

    age?: number;

    activate(): void {
      this.setState(Person.STATES.active);
    }

    disable(): void {
      this.setState(Person.STATES.disabled);
    }

    changeName(name: string): void {
      this.assign({ name });
    }

    updateProfile(props: types.Props): void {
      this.assign(props);
    }
  }

  beforeEach(() => {
    asserter = stubInterface<types.Asserter>();
    Person.setAsserter(asserter);
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
        PropTypes.oneOf(
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid)
        )
      );
    });

    it('takes optional schemaVersion property as a number', () => {
      expect(Entity.getPropTypes().schemaVersion).to.be.eql(
        PropTypes.instanceOf(Number).isOptional
      );
    });

    it('takes optional state property as a string', () => {
      expect(Entity.getPropTypes().state).to.be.eql(
        PropTypes.oneOf(
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Number)
        )
      );
    });

    it('takes optional status property as a string', () => {
      expect(Entity.getPropTypes().status).to.be.eql(
        PropTypes.oneOf(
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Number)
        )
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
      expect(new Person(props)).to.be.eql(props);
    });

    describe('static constructor', () => {
      it(`constructs from properties picked from source`, () => {
        const props = {
          id: new Guid(),
          name: 'value',
        };
        const entity = Person.from(props);
        expect(entity).to.be.instanceof(Person);
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
        const person = Person.from(props1, props2);
        expect(person).to.be.instanceof(Person);
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
      const second = new Person({ id: 'my-id', name: 'my-name' });
      expect(first.equals(second)).to.be.false;
    });
  });

  describe('recording state change', () => {
    it(`allows to clone state of entity`, () => {
      const entity = new Person({
        id: 'my-id',
        name: 'Foo',
      });
      entity.activate();
      expect(entity.isInState(Person.STATES.active)).to.be.true;
      const clonedState = entity.clone();
      entity.setState(Person.STATES.disabled);
      expect(clonedState).to.be.eql({
        id: 'my-id',
        name: 'Foo',
        state: 'active',
      });
    });

    it(`assigns properties on entity instance`, () => {
      const entity = new Person({
        id: 'my-id',
        name: 'Foo',
      });
      entity.changeName('Bar');
      expect(entity.name).to.be.equal('Bar');
    });

    it(`only assigns properties from sources that matches prop types on entity instance and omits the rest`, () => {
      const entity = new Person({
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
      const entity = new Person({
        id: 'my-id',
        name: 'Foo',
      });
      expect(() => entity.changeName((1 as any) as string)).to.throw(
        ValidationError,
        `Person: (Key 'name': Expected Number(1) to be a String in {"id":String("my-id"), "name":Number(1)})`
      );
    });
  });

  describe('asserting', () => {
    it('throws AsserterNotFoundError if assertion is not set', () => {
      expect(() => Entity.getAsserter()).to.throw(
        AsserterNotFoundError,
        `Entity: asserter not found on class constructor`
      );
    });

    it('sets the asserter on Entity class as static property', () => {
      @define('MyEntity', { isRRegistrable: true })
      class MyEntity extends Entity {}

      MyEntity.setAsserter(asserter);
      expect(MyEntity.getAsserter()).to.be.equal(asserter);
    });

    it('sets the entity on asserter', () => {
      const entity = new Person({ id: 'my-id', name: 'my-name' });
      entity.on('my-action');
      expect(asserter.setEntity).to.be.calledOnce;
      expect(asserter.setEntity).to.be.calledWith(entity);
    });

    it('sets the action as a string on asserter', () => {
      const entity = new Person({ id: 'my-id', name: 'my-name' });
      entity.on('my-action');
      expect(asserter.setAction).to.be.calledOnce;
      expect(asserter.setAction).to.be.calledWith('my-action');
    });

    it('sets the action as a Command on asserter', () => {
      @define('MyCommand', { isRegistrable: false })
      class MyCommand extends Command {}

      const entity = new Person({ id: 'my-id', name: 'my-name' });
      entity.on(MyCommand);
      expect(asserter.setAction).to.be.calledOnce;
      expect(asserter.setAction).to.be.calledWith(MyCommand);
    });

    it('returns the asserter instance', () => {
      const entity = new Person({ id: 'my-id', name: 'my-name' });
      expect(entity.on('my-action')).to.be.equal(asserter);
    });
  });

  describe('save and rollback of state', () => {
    it('allows to save and rollback Entity state', () => {
      const entity = new Person({ id: 'my-id', name: 'initial-name' });
      entity[SAVE_STATE_METHOD_KEY]();
      entity.changeName('changed-name');
      expect(entity.name).to.be.equal('changed-name');
      entity[ROLLBACK_STATE_METHOD_KEY]();
      expect(entity.name).to.be.equal('initial-name');
    });

    it('ensures that nested types state is also preserved on rollback operation', () => {
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
      const entity = new Person({ id: 'my-id', name: 'initial-name' });
      entity[SAVE_STATE_METHOD_KEY]();
      expect(entity.isStateSaved()).to.be.true;
      entity.changeName('changed-name');
      entity[ROLLBACK_STATE_METHOD_KEY]();
      expect(entity.isStateSaved()).to.be.false;
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
