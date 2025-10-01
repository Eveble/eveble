import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { PropTypes } from 'typend';
import { stubInterface } from 'ts-sinon';
import { Type, kernel } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { TypeTrait } from '../../../src/mixins/type.trait';
import { types } from '../../../src/types';

chai.use(sinonChai);

describe('TypeTrait', () => {
  let originalConverter: any;
  let originalValidator: any;
  let originalLibrary: any;

  let converter: any;
  let validator: any;
  let library: any;

  before(() => {
    originalConverter = kernel.converter;
    originalValidator = kernel.validator;
    originalLibrary = kernel.library;
  });

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    validator = stubInterface<types.Validator>();
    library = stubInterface<types.Library>();
    kernel.setConverter(converter);
    kernel.setValidator(validator);
    kernel.setLibrary(library);

    converter.convert.returns({ properties: {} });
  });

  after(() => {
    kernel.setConverter(originalConverter);
    kernel.setValidator(originalValidator);
    kernel.setLibrary(originalLibrary);
  });
  /*
  [!]
  Kernel's converter is replaced, so stubbing converter's convert for prop types is
  required. Otherwise MyType.getPropTypes() DURING test will resolve empty object.
  I did this test, I fell for this twice.
  */
  @Type('Person')
  class Person extends derive(TypeTrait) {
    firstName: string;

    lastName: string;

    age: number;

    constructor(firstName: string, lastName: string, age: number) {
      super();
      this.firstName = firstName;
      this.lastName = lastName;
      this.age = age;
    }
  }

  @Type('Parent')
  class Parent extends derive(TypeTrait) {
    parentKey: string;

    parentObj?: Record<string, any>;

    constructor(props: Record<string, any> = {}) {
      super();
      Object.assign(this, props);
    }
  }

  @Type('Child')
  class Child extends Parent {
    childKey: number;
  }

  @Type('Customer')
  class Customer extends derive(TypeTrait) {
    name: string;

    emails: string[];

    address: {
      street: string;
      country: string;
    };

    constructor(props: types.Props = {}) {
      super();
      Object.assign(this, props);
    }
  }

  @Type('Order')
  class Order extends derive(TypeTrait) {
    customer: Customer;

    constructor(props: types.Props) {
      super();
      Object.assign(this, props);
    }
  }

  describe('comparison', () => {
    describe('equality', () => {
      it('is not equal if compared with a null value', () => {
        const propTypes = {
          firstName: PropTypes.instanceOf(String),
          lastName: PropTypes.instanceOf(String),
          age: PropTypes.instanceOf(Number),
        };
        converter.convert.withArgs(Person).returns({ properties: propTypes });
        const person = new Person('Jane', 'Doe', 28);
        expect(person.equals(null)).to.be.false;
      });

      context('flat', () => {
        it('returns true if both instance are equal', () => {
          const propTypes = {
            firstName: PropTypes.instanceOf(String),
            lastName: PropTypes.instanceOf(String),
            age: PropTypes.instanceOf(Number),
          };
          converter.convert.withArgs(Person).returns({ properties: propTypes });
          const firstPerson = new Person('Jane', 'Doe', 28);
          const secondPerson = new Person('Jane', 'Doe', 28);
          expect(firstPerson.equals(secondPerson)).to.be.true;
        });

        it('returns false if one instance is different from other by values', () => {
          const propTypes = {
            firstName: PropTypes.instanceOf(String),
            lastName: PropTypes.instanceOf(String),
            age: PropTypes.instanceOf(Number),
          };
          converter.convert.withArgs(Person).returns({ properties: propTypes });
          const firstPerson = new Person('Jane', 'Doe', 28);
          const secondPerson = new Person('John', 'Doe', 30);
          expect(firstPerson.equals(secondPerson)).to.be.false;
        });

        it('returns false if one instance has different type then other', () => {
          @Type('NotAPerson')
          class NotAPerson extends derive(TypeTrait) {
            firstName: string;

            lastName: string;

            age: number;

            constructor(firstName: string, lastName: string, age: number) {
              super();
              this.firstName = firstName;
              this.lastName = lastName;
              this.age = age;
            }
          }

          const propTypes = {
            firstName: PropTypes.instanceOf(String),
            lastName: PropTypes.instanceOf(String),
            age: PropTypes.instanceOf(Number),
          };
          converter.convert.withArgs(Person).returns({ properties: propTypes });
          converter.convert
            .withArgs(NotAPerson)
            .returns({ properties: propTypes });
          const firstPerson = new Person('Jane', 'Doe', 28);
          const secondPerson = new NotAPerson('John', 'Doe', 30);
          expect(firstPerson.equals(secondPerson)).to.be.false;
        });
      });

      context('nested', () => {
        beforeEach(() => {
          const customerPropTypes = {
            name: PropTypes.instanceOf(String),
            emails: PropTypes.arrayOf(String),
            address: PropTypes.shape({
              street: PropTypes.instanceOf(String),
              country: PropTypes.instanceOf(String),
            }),
          };
          converter.convert
            .withArgs(Customer)
            .returns({ properties: customerPropTypes });

          const orderPropTypes = {
            customer: PropTypes.instanceOf(Customer),
          };
          converter.convert
            .withArgs(Order)
            .returns({ properties: orderPropTypes });
        });
        it('supports comparison of nested definables', () => {
          const firstCustomer = new Customer({
            name: 'Test',
            emails: ['a@foo.bar', 'b@foo.bar'],
            address: {
              street: 'Wallstreet',
              country: 'USA',
            },
          });
          const secondCustomer = new Customer({
            name: 'Test',
            emails: ['a@foo.bar', 'b@foo.bar'],
            address: {
              street: 'Wallstreet',
              country: 'USA',
            },
          });

          const firstOrder = new Order({
            customer: firstCustomer,
          });
          const secondOrder = new Order({
            customer: secondCustomer,
          });
          expect(firstOrder.equals(secondOrder)).to.be.true;
        });

        it('is not equal if a sub value object comparison fails', () => {
          const firstCustomer = new Customer({
            name: 'Test',
            emails: ['a@foo.bar', 'b@foo.bar'],
            address: {
              street: 'Wallstreet',
              country: 'USA',
            },
          });
          const secondCustomer = new Customer({
            name: 'Changed',
            emails: ['a@foo.bar', 'b@foo.bar'],
            address: {
              street: 'Wallstreet',
              country: 'USA',
            },
          });
          const firstOrder = new Order({
            customer: firstCustomer,
          });
          const secondOrder = new Order({
            customer: secondCustomer,
          });

          expect(firstOrder.equals(secondOrder)).to.be.false;
        });
      });
    });
  });

  describe('resolving declaration', () => {
    it(`returns converted TypeScript class declaration properties declaration from instance`, () => {
      const propTypes = {
        firstName: PropTypes.instanceOf(String),
        lastName: PropTypes.instanceOf(String),
        age: PropTypes.instanceOf(Number),
      };
      converter.convert.withArgs(Person).returns({ properties: propTypes });

      const person = new Person('Jane', 'Doe', 28);
      const props = person.getPropTypes();
      expect(props).to.be.eql(propTypes);
      expect(kernel.converter.convert).to.be.calledWithExactly(Person);
    });

    it(`returns converted TypeScript class declaration properties declaration from class constructor`, () => {
      const propTypes = {
        firstName: PropTypes.instanceOf(String),
        lastName: PropTypes.instanceOf(String),
        age: PropTypes.instanceOf(Number),
      };
      converter.convert.withArgs(Person).returns({ properties: propTypes });

      const props = Person.getPropTypes();
      expect(props).to.be.eql(propTypes);
      expect(kernel.converter.convert).to.be.calledWithExactly(Person);
    });

    it('ensures that parent properties declarations are resolved on child', () => {
      const propTypes = {
        parentKey: PropTypes.instanceOf(String),
        childKey: PropTypes.instanceOf(Number),
        parentObj: PropTypes.interface({}).isOptional,
      };
      converter.convert.withArgs(Child).returns({ properties: propTypes });

      const child = new Child({ childKey: 1337, parentKey: 'my-string' });
      const props = child.getPropTypes();
      expect(props).to.be.eql(propTypes);
    });
  });

  describe('conversion', () => {
    it('returns all assigned properties from instances and their corresponding values as plain object', () => {
      const propTypes = {
        firstName: PropTypes.instanceOf(String),
        lastName: PropTypes.instanceOf(String),
        age: PropTypes.instanceOf(Number),
      };
      converter.convert.withArgs(Person).returns({ properties: propTypes });

      const person = new Person('Jane', 'Doe', 28);
      const obj = person.toPlainObject();
      expect(obj).to.be.instanceof(Object);
      expect(obj).to.be.eql({
        firstName: 'Jane',
        lastName: 'Doe',
        age: 28,
      });
    });

    it('ensures that properties related to parent are resolved on child', () => {
      const propTypes = {
        parentKey: PropTypes.instanceOf(String),
        childKey: PropTypes.instanceOf(Number),
        parentObj: PropTypes.interface({}).isOptional,
      };
      converter.convert.withArgs(Child).returns({ properties: propTypes });

      const child = new Child({ childKey: 1337, parentKey: 'my-string' });
      const props = child.toPlainObject();
      expect(props).to.be.instanceof(Object);
      expect(props).to.be.eql({
        parentKey: 'my-string',
        childKey: 1337,
      });
    });

    it('ensures that references on return plain object are uncoupled', () => {
      const propTypes = {
        parentKey: PropTypes.instanceOf(String),
        childKey: PropTypes.instanceOf(Number),
        parentObj: PropTypes.interface({}).isOptional,
      };
      converter.convert.withArgs(Child).returns({ properties: propTypes });

      const child = new Child({
        childKey: 1337,
        parentKey: 'my-string',
        parentObj: { objKey: true },
      });
      expect(child).to.be.eql({
        parentKey: 'my-string',
        childKey: 1337,
        parentObj: { objKey: true },
      });

      const plainObj = child.toPlainObject();
      expect(plainObj).to.be.eql({
        parentKey: 'my-string',
        childKey: 1337,
        parentObj: { objKey: true },
      });
      // Change the plain object without changes to original instance source
      plainObj.parentKey = 'my-other-string';
      plainObj.childKey = 1234;
      plainObj.parentObj.objKey = false;

      expect(plainObj).to.be.eql({
        parentKey: 'my-other-string',
        childKey: 1234,
        parentObj: { objKey: false },
      });
      expect(child).to.be.eql({
        parentKey: 'my-string',
        childKey: 1337,
        parentObj: { objKey: true },
      });
    });

    describe('property initializers', () => {
      it('returns property initializers for instance defined on metadata via @Type decorator', () => {
        const stringKey = PropTypes.instanceOf(String);
        stringKey.setInitializer('my-string');
        const numberKey = PropTypes.instanceOf(Number);
        numberKey.setInitializer(1337);
        const propTypes = {
          stringKey,
          numberKey,
        };
        converter.convert.returns({ properties: propTypes });

        @Type('MyClass')
        class MyClass extends derive(TypeTrait) {
          stringKey = 'my-string';

          numberKey = 1337;
        }

        expect(MyClass.prototype.getPropertyInitializers()).to.be.eql({
          stringKey: 'my-string',
          numberKey: 1337,
        });
      });

      it('returns property initializers for class constructor defined on metadata via @Type decorator', () => {
        const stringKey = PropTypes.instanceOf(String);
        stringKey.setInitializer('my-string');
        const numberKey = PropTypes.instanceOf(Number);
        numberKey.setInitializer(1337);
        const propTypes = {
          stringKey,
          numberKey,
        };
        converter.convert.returns({ properties: propTypes });

        @Type('MyClass')
        class MyClass extends derive(TypeTrait) {
          stringKey = 'my-string';

          numberKey = 1337;
        }

        expect(MyClass.getPropertyInitializers()).to.be.eql({
          stringKey: 'my-string',
          numberKey: 1337,
        });
      });

      it('returns property initializers from inherited parent', () => {
        const stringKey = PropTypes.instanceOf(String);
        stringKey.setInitializer('my-string');
        const numberKey = PropTypes.instanceOf(Number);
        numberKey.setInitializer(1337);
        const propTypes = {
          stringKey,
          numberKey,
        };
        converter.convert.returns({ properties: propTypes });

        @Type('OtherParent')
        class OtherParent extends derive(TypeTrait) {
          stringKey = 'my-string';

          numberKey = 1337;
        }

        @Type('OtherChild')
        class OtherChild extends OtherParent {}

        expect(OtherChild.prototype.getPropertyInitializers()).to.be.eql({
          stringKey: 'my-string',
          numberKey: 1337,
        });
      });

      it('returns property initializers for whole inheritable tree', () => {
        const stringKey = PropTypes.instanceOf(String);
        stringKey.setInitializer('my-string');
        const numberKey = PropTypes.instanceOf(Number);
        numberKey.setInitializer(1337);

        const parentPropTypes = {
          stringKey,
        };
        converter.convert.returns({ properties: parentPropTypes });

        @Type('OtherParent')
        class OtherParent extends derive(TypeTrait) {
          stringKey = 'my-string';
        }

        const childPropTypes = {
          numberKey,
        };
        converter.convert.returns({ properties: childPropTypes });

        @Type('OtherChild')
        class OtherChild extends OtherParent {
          numberKey = 1337;
        }

        expect(OtherChild.prototype.getPropertyInitializers()).to.be.eql({
          stringKey: 'my-string',
          numberKey: 1337,
        });
      });
    });
  });

  describe('validation', () => {
    it('returns true on valid properties matching provided prop types', () => {
      const propTypes = {
        firstName: PropTypes.instanceOf(String),
        lastName: PropTypes.instanceOf(String),
        age: PropTypes.instanceOf(Number),
      };
      const person = new Person('Jane', 'Doe', 28);

      converter.convert.withArgs(Person).returns({ properties: propTypes });
      validator.validate.withArgs(person, propTypes, true).returns(true);

      expect(person.validateProps(person, person.getPropTypes())).to.be.true;
    });

    it('re-throws error from validator using message prefixed with types type name', () => {
      const propTypes = {
        key: PropTypes.instanceOf(String),
      };
      converter.convert.returns({ properties: propTypes });

      @Type('Namespace.MyClass')
      class MyClass extends derive(TypeTrait) {
        key: string;
      }

      const message = 'my-error';
      const error = new Error(message);
      const props = { key: 'value' };
      validator.validate.withArgs(props, propTypes, true).throws(error);

      expect(() => new MyClass().validateProps(props, propTypes)).to.throw(
        Error,
        'Namespace.MyClass: my-error'
      );
    });

    it('re-throws error from validator using message prefixed with types constructor name', () => {
      const propTypes = {
        key: PropTypes.instanceOf(String),
      };
      converter.convert.returns({ properties: propTypes });

      @Type('MyClass')
      class MyClass extends derive(TypeTrait) {
        key: string;
      }

      const message = 'my-error';
      const error = new Error(message);
      const props = { key: 'value' };
      validator.validate.withArgs(props, propTypes, true).throws(error);

      expect(() => new MyClass().validateProps(props, propTypes)).to.throw(
        Error,
        'MyClass: my-error'
      );
    });

    describe('environment', () => {
      beforeEach(() => {
        kernel.disableValidation();
      });
      afterEach(() => {
        kernel.enableValidation();
      });

      it('returns true always if validation is disabled on kernel', () => {
        class MyClass extends derive(TypeTrait) {}

        const message = 'my-error';
        const error = new Error(message);
        const props = { key: 'value' };
        const propTypes = { key: PropTypes.instanceOf(String) };
        validator.validate.withArgs(props, propTypes, true).throws(error);

        expect(() =>
          new MyClass().validateProps(props, propTypes)
        ).to.not.throw(Error);
      });
    });
  });
});
