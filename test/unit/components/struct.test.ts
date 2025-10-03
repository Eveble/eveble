import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { Integer, PropTypes, ValidationError } from 'typend';
import { inject } from 'inversify';
import { Type } from '@eveble/core';
import { derived } from '@traits-ts/core';
import sinon from 'sinon';
import { Struct } from '../../../src/components/struct';
import { DELEGATED_KEY } from '../../../src/constants/metadata-keys';
import { HookableTrait } from '../../../src/trait/hookable.trait';
import { TypeTrait } from '../../../src/trait/type.trait';
import { types } from '../../../src/types';

chai.use(sinonChai);

describe('Struct', () => {
  @Type('Parent')
  class Parent extends Struct {
    hasJob: boolean;

    name: string;

    age: Integer;
  }

  @Type('Child')
  class Child extends Parent {
    hobby: string;
  }

  @Type('BastardChild')
  class BastardChild extends Parent {
    toy: string;
  }

  it('has TypeTrait applied', () => {
    expect(derived(Struct.prototype, TypeTrait)).to.be.true;
  });

  it('has HookableTrait applied', () => {
    expect(derived(Struct.prototype, HookableTrait)).to.be.true;
  });

  describe('property types', () => {
    it('returns property types as an object with correlating keys and expectations as values', () => {
      const propTypes = {
        hasJob: PropTypes.instanceOf(Boolean),
        name: PropTypes.instanceOf(String),
        age: PropTypes.integer,
      };
      expect(Parent.prototype.getPropTypes()).to.be.eql(propTypes);
    });

    it(`returns child's property types as an object inheriting types from parent class`, () => {
      const propTypes = {
        hasJob: PropTypes.instanceOf(Boolean),
        name: PropTypes.instanceOf(String),
        age: PropTypes.integer,
        hobby: PropTypes.instanceOf(String),
      };
      expect(Child.prototype.getPropTypes()).to.be.eql(propTypes);
    });

    it('ensures that prop types from other child classes does not leak', () => {
      const propTypes = {
        hasJob: PropTypes.instanceOf(Boolean),
        name: PropTypes.instanceOf(String),
        age: PropTypes.integer,
        toy: PropTypes.instanceOf(String),
      };
      expect(BastardChild.prototype.getPropTypes()).to.be.eql(propTypes);
    });
  });

  describe('construction', () => {
    it('throws ValidationError if passed properties on construction does not match prop types', () => {
      expect(() => {
        new Parent({
          hasJob: true,
        });
      }).to.throw(
        ValidationError,
        `Parent: (Key 'name': Expected undefined to be a String in {"hasJob":Boolean(true)}`
      );
    });

    it('ensures that prop types defined on parent class are required on construction of child class', () => {
      expect(() => {
        new Child({
          hobby: 'swimming',
        });
      }).to.throw(
        ValidationError,
        `Child: (Key 'hasJob': Expected undefined to be a Boolean in {"hobby":String("swimming")})`
      );
    });

    it('returns constructed parent class on valid properties', () => {
      const props = {
        name: 'Jane Doe',
        age: 28,
        hasJob: true,
      };
      expect(() => new Parent(props)).not.to.throw(ValidationError);
    });

    it('returns constructed child class on valid properties', () => {
      const props = {
        name: 'Tony',
        age: 12,
        hasJob: false,
        hobby: 'swimming',
      };
      expect(() => new Child(props)).not.to.throw(ValidationError);
    });

    it('returns constructed bastard child class on valid properties', () => {
      const props = {
        name: 'Elmyra Duff',
        age: 8,
        hasJob: false,
        hobby: 'woving wabbits',
      };
      expect(() => new Child(props)).not.to.throw(ValidationError);
    });

    describe(`delegated('manual') construction for classes with property initializers`, () => {
      it('allows for manual construction by flagging constructor with metadata', () => {
        // Without Object.assign on Struct's constructor classes with property
        // initializers will never work as expected.
        @Type('MyDelegatedStruct')
        class MyDelegatedStruct extends Struct {
          key: string;
        }
        Reflect.defineMetadata(DELEGATED_KEY, true, MyDelegatedStruct);
        expect(new MyDelegatedStruct({ key: 'set' })).to.be.eql({});
      });

      it('does not construct for classes with property initializers', () => {
        // Without Object.assign on Struct's constructor classes with property
        // initializers will never work as expected.
        @Type('MyStructWithInitializer')
        class MyStructWithInitializer extends Struct {
          key = 'default';
        }
        expect(new MyStructWithInitializer({ key: 'set' })).to.be.eql({
          key: 'default',
        });
      });

      it('requires that developer define constructor on their derived class', () => {
        // Without Object.assign on Struct's constructor classes with property
        // initializers will never work as expected - this is one of possible solutions.
        @Type('MyStructWithDefinedConstructor')
        class MyStructWithDefinedConstructor extends Struct {
          key = 'default';

          constructor(props: Partial<MyStructWithDefinedConstructor>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }
        expect(new MyStructWithDefinedConstructor({ key: 'set' })).to.be.eql({
          key: 'set',
        });
      });
    });
  });

  describe('validation', () => {
    it('skips validating properties defined with @inject decorator', () => {
      class MyDependency {}

      @Type()
      class MyStruct extends Struct {
        key: string;

        @inject('my-dependency')
        dependency: MyDependency;
      }

      expect(() => new MyStruct({ key: 'my-value' })).to.not.throw(
        ValidationError
      );
      expect(() => new MyStruct({})).to.throw(ValidationError);
    });
  });

  describe('hooks', () => {
    it('supports onConstruction hook', () => {
      @Type('Car')
      class Car extends Struct {
        brand: string;
      }
      const hookFn = (props: types.Props): types.Props => {
        if (props.brand === 'my-brand') {
          props.brand = 'my-processed-brand';
        }
        return props;
      };
      Car.prototype.registerHook('onConstruction', 'my-hook', hookFn);

      const instance = new Car({ brand: 'my-brand' });
      expect(instance.brand).to.be.equal('my-processed-brand');
    });

    it('supports onValidation hook', () => {
      @Type('Car')
      class Car extends Struct {
        model: string;
      }
      const validatorFn = (props: types.Props): types.Props => {
        if (props.model === 'Multipla') {
          throw new Error('Denied');
        }
        return props;
      };
      Car.prototype.registerHook('onValidation', 'my-validator', validatorFn);

      expect(() => new Car({ model: 'Multipla' })).to.throw(Error, 'Denied');
    });

    it('ensures that onValidation hooks are executed after prop types validation', () => {
      @Type('Car')
      class Car extends Struct {
        model: string;
      }
      const validatorFn = sinon.stub();

      Car.prototype.registerHook('onValidation', 'my-validator', validatorFn);
      Car.prototype.validateProps = sinon.stub();

      expect(() => new Car({ model: 'A5' })).to.not.throw(Error);
      expect(Car.prototype.validateProps).to.be.calledOnce;
      expect(validatorFn).to.be.calledOnce;
      expect(Car.prototype.validateProps).to.be.calledBefore(validatorFn);
    });
  });
});
