import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import {
  define,
  TypeNotFoundError,
  TypeExistsError,
  UnregistrableTypeError,
  UnavailableSerializerError,
  kernel,
} from '@eveble/core';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { Serializable } from '../../../src/components/serializable';
import { UnparsableValueError } from '../../../src/messaging/messaging-errors';
import { TYPE_KEY } from '../../../src/constants/literal-keys';
import { createEJSON } from '../../../src/utils/helpers';
import { Guid } from '../../../src';

chai.use(sinonChai);

describe(`EJSONSerializerAdapter`, () => {
  let injector: types.Injector;
  let serializer: EJSONSerializerAdapter;

  beforeEach(() => {
    injector = new Injector();
    injector.bind(BINDINGS.EJSON).toConstantValue(createEJSON());

    serializer = new EJSONSerializerAdapter();
    injector.injectInto(serializer);
    kernel.setSerializer(serializer);
  });

  afterEach(() => {
    kernel.setSerializer(undefined as any);
  });

  @define('Address', { isRegistrable: false })
  class Address extends Serializable {
    city: string;

    street: string;
  }

  @define('Person', { isRegistrable: false })
  class Person extends Serializable {
    firstName: string;

    lastName: string;

    address?: Address;
  }

  @define('Legal', { isRegistrable: false })
  class Legal extends Serializable {
    tos?: {
      id: Guid;
      isAccepted: boolean;
    };
  }

  @define('Car', { isRegistrable: false })
  class Car extends Serializable {
    brand: string;
  }

  @define('Garage', { isRegistrable: false })
  class Garage extends Serializable {
    cars: Car[];
  }

  describe('construction', () => {
    it('assigns default type key on construction', () => {
      const instance = new EJSONSerializerAdapter();
      expect(instance.getTypeKey()).to.be.equal(TYPE_KEY);
    });

    it('takes optional type key as a string and assigns it', () => {
      const typeKey = '$type';
      const instance = new EJSONSerializerAdapter(typeKey);
      expect(instance.getTypeKey()).to.be.equal(typeKey);
    });
  });

  describe('type registration', () => {
    it('throws UnregistrableTypeError if provided type does not implement Serializable interface', () => {
      class InvalidType {}
      expect(() =>
        serializer.registerType('InvalidType', InvalidType)
      ).to.throw(
        UnregistrableTypeError,
        `Type 'InvalidType' must implement Serializable interface`
      );
    });

    it('registers type on EJSON with type name and factory function for a type', () => {
      serializer.registerType('Person', Person);
      expect(serializer.getType('Person')).to.be.equal(Person);
    });

    it('throws TypeExistsError if type is already registered', () => {
      serializer.registerType('Person', Person);
      expect(() => serializer.registerType('Person', Person)).to.throw(
        TypeExistsError,
        `EJSON: type 'Person' is already registered`
      );
    });

    it('allows for explicit override of existing type', () => {
      serializer.registerType('Person', Person);
      expect(() => serializer.overrideType('Person', Person)).to.not.throw(
        TypeExistsError
      );
    });
  });

  describe('evaluating registered types', () => {
    it('returns true if type is registered', () => {
      serializer.registerType('Person', Person);
      expect(serializer.hasType('Person')).to.be.true;
    });

    it('returns false if type is registered', () => {
      expect(serializer.hasType('Person')).to.be.false;
    });
  });

  describe('evaluating type instances', () => {
    it('returns true if instance of a type is a registered type', () => {
      serializer.registerType('Person', Person);
      const person = new Person({
        firstName: 'Jane',
        lastName: 'Doe',
      });
      expect(serializer.isTypeInstance(person)).to.be.true;
    });

    it('returns false if instance of a type is not a registered type', () => {
      const person = new Person({
        firstName: 'Jane',
        lastName: 'Doe',
      });
      expect(serializer.isTypeInstance(person)).to.be.false;
    });
  });

  describe('getters', () => {
    it('returns registered type', () => {
      serializer.registerType('Person', Person);
      expect(serializer.getType('Person')).to.be.equal(Person);
    });

    it('throws TypeNotFoundError if type is not registered on serializer', () => {
      expect(() => serializer.getTypeOrThrow('Person')).to.throw(
        TypeNotFoundError,
        `EJSON: type 'Person' not found`
      );
    });

    it('returns factory for registered type', () => {
      serializer.registerType('Person', Person);
      expect(serializer.getFactory('Person')).to.be.instanceof(Function);
      expect(serializer.getFactory('Person').type).to.be.equal(Person);
    });

    it('returns mappings of all registered types', () => {
      serializer.registerType('Person', Person);
      serializer.registerType('Car', Car);
      expect(serializer.getTypes()).to.be.instanceof(Map);
      expect(serializer.getTypes()).to.be.eql(
        new Map([
          ['Person', Person as any],
          ['Car', Car as any],
        ])
      );
    });

    it('returns type names for all registered types', () => {
      serializer.registerType('Person', Person);
      serializer.registerType('Car', Car);
      expect(serializer.getTypesNames()).to.be.instanceof(Array);
      expect(serializer.getTypesNames()).to.be.eql(['Person', 'Car']);
    });
  });

  describe('mutators', () => {
    it('removes registered type', () => {
      serializer.registerType('Person', Person);
      expect(serializer.getType('Person')).to.be.equal(Person);
      serializer.removeType('Person');
      expect(serializer.getType('Person')).to.be.undefined;
    });

    it('removes all registered types', () => {
      serializer.registerType('Person', Person);
      serializer.registerType('Car', Car);
      expect(serializer.getTypes()).to.be.eql(
        new Map([
          ['Person', Person as any],
          ['Car', Car as any],
        ])
      );
      serializer.removeTypes();
      expect(serializer.getTypes()).to.be.empty;
    });
  });

  describe('serialization', () => {
    describe('toJSONValue', () => {
      it('serializes serializable type instance by preserving all custom fields but without preserving type', () => {
        const person = new Person({
          firstName: 'Jane',
          lastName: 'Doe',
          address: new Address({
            city: 'New York',
            street: 'Wall Street',
          }),
        });
        serializer.registerType('Person', Person);
        expect(serializer.toJSONValue(person)).to.be.eql({
          firstName: 'Jane',
          lastName: 'Doe',
          address: {
            city: 'New York',
            street: 'Wall Street',
          },
        });
      });

      it('serializes JSON-compatible value', () => {
        const date = new Date();
        const obj = {
          $date: date,
        };

        const json = serializer.toJSONValue(obj);
        expect(json).to.be.eql({ $date: date.toJSON() });
      });
    });

    describe('fromJSONValue', () => {
      it('throws TypeNotFoundError if serializable type present on EJSON is not registered', () => {
        const json = {
          $type: 'Person',
          $value: {
            firstName: 'Jane',
            lastName: 'Doe',
          },
        };
        expect(() => serializer.fromJSONValue(json)).to.throw(
          TypeNotFoundError,
          `EJSON: type 'Person' not found`
        );
      });

      it('deserializes instance of Serializable type', () => {
        serializer.registerType('Person', Person);
        serializer.registerType('Address', Address);
        const json = {
          $type: 'Person',
          $value: {
            firstName: 'Jane',
            lastName: 'Doe',
            address: {
              $type: 'Address',
              $value: {
                city: 'New York',
                street: 'Wall Street',
              },
            },
          },
        };
        const person = serializer.fromJSONValue(json);
        expect(person).to.be.instanceof(Person);
        expect(person).to.be.eql(
          new Person({
            firstName: 'Jane',
            lastName: 'Doe',
            address: new Address({
              city: 'New York',
              street: 'Wall Street',
            }),
          })
        );
      });

      it('deserializes JSON-compatible value', () => {
        const date = new Date('December 17, 1995 03:24:00');
        const obj = {
          $date: date,
        };

        const json = serializer.toJSONValue(obj);
        expect(serializer.fromJSONValue(json)).to.be.eql(date);
      });
    });

    describe('stringify', () => {
      it('throws UnavailableSerializerError upon stringifing types without serializer set on kernel', () => {
        kernel.setSerializer(undefined as any);

        serializer.registerType('Person', Person);
        const person = new Person({
          firstName: 'Jane',
          lastName: 'Doe',
          address: new Address({
            city: 'New York',
            street: 'Wall Street',
          }),
        });

        expect(() => serializer.stringify(person)).to.throw(
          UnavailableSerializerError,
          `Serialization is unavailable outside on application environment.
      Define application before using any features related to serialization or set serializer on kernel by using <kernel.setSerializer()>`
        );
      });

      it('serializes a type to a a string while preserving its type name', () => {
        serializer.registerType('Car', Car);

        const car = new Car({
          brand: 'Bentley',
        });

        expect(serializer.stringify(car)).to.be.equal(
          '{"$type":"Car","$value":{"brand":"Bentley"}}'
        );
      });

      it('serializes types that include other nested types', () => {
        serializer.registerType('Person', Person);
        serializer.registerType('Address', Address);

        const person = new Person({
          firstName: 'Jane',
          lastName: 'Doe',
          address: new Address({
            city: 'New York',
            street: 'Wall Street',
          }),
        });

        expect(serializer.stringify(person)).to.be.equal(
          '{"$type":"Person","$value":{"firstName":"Jane","lastName":"Doe","address":{"$type":"Address","$value":{"city":"New York","street":"Wall Street"}}}}'
        );
        kernel.setSerializer(undefined as any);
      });
    });

    describe('parse', () => {
      it('throws UnparsableValueError if provided argument is not a string', () => {
        expect(() => serializer.parse(1234 as any as string)).to.throw(
          UnparsableValueError,
          `Value must be parsable string, got 1234`
        );
      });

      it('parses string in to EJSON value', () => {
        serializer.registerType('Car', Car);

        const string = '{"$type":"Car","$value":{"brand":"Bentley"}}';

        const ejsonValue = serializer.parse(string);
        expect(ejsonValue).to.be.instanceof(Car);
        expect(ejsonValue).to.be.eql(
          new Car({
            brand: 'Bentley',
          })
        );
      });

      it('parses string including nested types in to EJSON value', () => {
        serializer.registerType('Person', Person);
        serializer.registerType('Address', Address);

        const string =
          '{"$type":"Person","$value":{"firstName":"Jane","lastName":"Doe","address":{"$type":"Address","$value":{"city":"New York","street":"Wall Street"}}}}';

        const ejsonValue = serializer.parse(string);
        expect(ejsonValue).to.be.instanceof(Person);
        expect(ejsonValue).to.be.eql(
          new Person({
            firstName: 'Jane',
            lastName: 'Doe',
            address: new Address({
              city: 'New York',
              street: 'Wall Street',
            }),
          })
        );
      });
    });

    describe('clone', () => {
      it('returns a deep copy of a value', () => {
        serializer.registerType('Person', Person);
        serializer.registerType('Address', Address);

        const address = new Address({
          city: 'New York',
          street: 'Wall Street',
        });
        const person = new Person({
          firstName: 'Jane',
          lastName: 'Doe',
          address,
        });

        const clonedPerson = serializer.clone<Person>(person);
        expect(clonedPerson).to.be.instanceof(Person);
        expect(clonedPerson).to.be.eql(person);
        expect(clonedPerson).to.not.be.equal(person);
        expect(clonedPerson.address).to.not.be.equal(address);
      });
    });

    describe('equals', () => {
      context(
        'by using equals method on type from Definable mixin(prototype)',
        () => {
          it('returns true for equal arguments', () => {
            serializer.registerType('Person', Person);
            serializer.registerType('Address', Address);

            const firstAddress = new Address({
              city: 'New York',
              street: 'Wall Street',
            });
            const firstPerson = new Person({
              firstName: 'Jane',
              lastName: 'Doe',
              address: firstAddress,
            });
            const secondAddress = new Address({
              city: 'New York',
              street: 'Wall Street',
            });
            const secondPerson = new Person({
              firstName: 'Jane',
              lastName: 'Doe',
              address: secondAddress,
            });

            expect(serializer.equals(firstPerson, secondPerson)).to.be.true;
          });

          it('returns false for not equal arguments by their values', () => {
            serializer.registerType('Person', Person);
            serializer.registerType('Address', Address);

            const firstAddress = new Address({
              city: 'First York',
              street: 'First Street',
            });
            const firstPerson = new Person({
              firstName: 'First',
              lastName: 'Last',
              address: firstAddress,
            });
            const secondAddress = new Address({
              city: 'Second York',
              street: 'Second Street',
            });
            const secondPerson = new Person({
              firstName: 'Second',
              lastName: 'Last',
              address: secondAddress,
            });

            expect(serializer.equals(firstPerson, secondPerson)).to.be.false;
          });

          it('returns false for not equal arguments by their types', () => {
            serializer.registerType('Person', Person);
            serializer.registerType('Address', Address);

            const firstAddress = new Address({
              city: 'First York',
              street: 'First Street',
            });
            const firstPerson = new Person({
              firstName: 'First',
              lastName: 'Last',
              address: firstAddress,
            });
            const secondAddressObj = {
              city: 'Second York',
              street: 'Second Street',
            };
            const secondPersonObj = {
              firstName: 'Second',
              lastName: 'Last',
              address: secondAddressObj,
            };

            expect(serializer.equals(firstPerson, secondPersonObj)).to.be.false;
          });
        }
      );

      context(`by using serializer's in-build comparer`, () => {
        context('without nested types', () => {
          it('returns true for equal arguments by their values and types', () => {
            serializer.registerType('Car', Car);

            const carA = new Car({
              brand: 'Audi',
            });
            const carB = new Car({
              brand: 'Audi',
            });

            expect(serializer.equals(carA, carB)).to.be.true;
          });

          it('returns false for not equal arguments by their values and types', () => {
            serializer.registerType('Car', Car);

            const carA = new Car({
              brand: 'Audi',
            });
            const carB = new Car({
              brand: 'BMW',
            });

            expect(serializer.equals(carA, carB)).to.be.false;
          });
        });
        context('with nested types', () => {
          it('returns true for equal arguments by their values and types', () => {
            serializer.registerType('Person', Person);
            serializer.registerType('Address', Address);

            const firstAddress = new Address({
              city: 'New York',
              street: 'Wall Street',
            });
            const firstPerson = new Person({
              firstName: 'Jane',
              lastName: 'Doe',
              address: firstAddress,
            });
            const secondAddress = new Address({
              city: 'New York',
              street: 'Wall Street',
            });
            const secondPerson = new Person({
              firstName: 'Jane',
              lastName: 'Doe',
              address: secondAddress,
            });
            // Remove equality method so serializer can use in-build methods
            // for comparison
            (firstAddress as any).equals = undefined;
            (secondAddress as any).equals = undefined;
            (firstPerson as any).equals = undefined;
            (secondPerson as any).equals = undefined;

            expect(serializer.equals(firstPerson, secondPerson)).to.be.true;
          });

          it('returns false for not equal arguments by their values and types', () => {
            serializer.registerType('Person', Person);
            serializer.registerType('Address', Address);

            const firstAddress = new Address({
              city: 'New York',
              street: 'Wall Street',
            });
            const firstPerson = new Person({
              firstName: 'Jane',
              lastName: 'Doe',
              address: firstAddress,
            });
            const secondAddressObj = {
              city: 'Second York',
              street: 'Second Street',
            };
            const secondPersonObj = {
              firstName: 'Second',
              lastName: 'Last',
              address: secondAddressObj,
            };
            // Remove equality method so serializer can use in-build methods
            // for comparison
            (firstAddress as any).equals = undefined;
            (firstPerson as any).equals = undefined;

            expect(serializer.equals(firstPerson, secondPersonObj)).to.be.false;
          });
        });
      });
    });

    describe('toData', () => {
      it('throws UnregistrableTypeError if provided argument is not instance of Serializable', () => {
        const obj = {};

        expect(() => serializer.toData(obj as any)).to.throw(
          UnregistrableTypeError,
          `Type '{}' must implement Serializable interface`
        );
      });

      it('allows to use custom type key', () => {
        const typeKey = '$type';
        const instance = new EJSONSerializerAdapter(typeKey);
        injector.injectInto(instance);
        instance.registerType('Car', Car);

        const car = new Car({ brand: 'Audi' });
        const data = instance.toData(car);
        expect(data).to.be.eql({
          $type: 'Car',
          brand: 'Audi',
        });
      });

      context('without nested types', () => {
        it('converts serializable type to data object while preserving its type', () => {
          serializer.registerType('Car', Car);

          const car = new Car({
            brand: 'Bentley',
          });
          expect(serializer.toData(car)).to.be.eql({
            _type: 'Car',
            brand: 'Bentley',
          });
        });
      });

      context('with list of nested types', () => {
        it('converts serializable type to data object while preserving its type and types in lists', () => {
          serializer.registerType('Car', Car);
          serializer.registerType('Garage', Garage);

          const audi = new Car({
            brand: 'Audi',
          });
          const bentley = new Car({
            brand: 'Bentley',
          });
          const garage = new Garage({
            cars: [audi, bentley],
          });
          expect(serializer.toData(garage)).to.be.eql({
            _type: 'Garage',
            cars: [
              { _type: 'Car', brand: 'Audi' },
              { _type: 'Car', brand: 'Bentley' },
            ],
          });
        });
      });

      context('with nested optional types', () => {
        it('converts data object while preserving its type and optional nested types', () => {
          serializer.registerType('Legal', Legal);
          serializer.registerType('Guid', Guid);

          const id = new Guid();
          const legal = new Legal({
            tos: {
              id,
              isAccepted: true,
            },
          });

          expect(serializer.toData(legal)).to.be.eql({
            _type: 'Legal',
            tos: {
              id: {
                _type: 'Guid',
                id: id.toString(),
              },
              isAccepted: true,
            },
          });
        });
      });

      context('with nested types', () => {
        it('converts data object while preserving its type and nested types', () => {
          serializer.registerType('Person', Person);
          serializer.registerType('Address', Address);

          const person = new Person({
            firstName: 'Jane',
            lastName: 'Doe',
            address: new Address({
              city: 'New York',
              street: 'Wall Street',
            }),
          });

          expect(serializer.toData(person)).to.be.eql({
            _type: 'Person',
            firstName: 'Jane',
            lastName: 'Doe',
            address: {
              _type: 'Address',
              city: 'New York',
              street: 'Wall Street',
            },
          });
        });
      });
    });

    describe('fromData', () => {
      it('allows to use custom type key', () => {
        const typeKey = '$type';
        const instance = new EJSONSerializerAdapter(typeKey);
        injector.injectInto(instance);
        instance.registerType('Car', Car);

        const data = {
          $type: 'Car',
          brand: 'Audi',
        };
        const car = instance.fromData(data);
        expect(car).to.be.instanceof(Car);
        expect(car).to.be.eql({ brand: 'Audi' });
      });

      context('without nested types', () => {
        it('converts data object to serializable type', () => {
          serializer.registerType('Car', Car);

          const data = {
            _type: 'Car',
            brand: 'Bentley',
          };

          const typeInstance = serializer.fromData(data);
          expect(typeInstance).to.be.instanceof(Car);
          expect(typeInstance).to.be.eql(
            new Car({
              brand: 'Bentley',
            })
          );
        });
      });

      context('with list of nested types', () => {
        it('converts data object to serializable type', () => {
          serializer.registerType('Car', Car);
          serializer.registerType('Garage', Garage);

          const data = {
            _type: 'Garage',
            cars: [
              { _type: 'Car', brand: 'Audi' },
              { _type: 'Car', brand: 'Bentley' },
            ],
          };

          const audi = new Car({
            brand: 'Audi',
          });
          const bentley = new Car({
            brand: 'Bentley',
          });
          const garage = new Garage({
            cars: [audi, bentley],
          });
          const typeInstance = serializer.fromData<Garage>(data);
          expect(typeInstance).to.be.instanceof(Garage);
          expect(typeInstance).to.be.eql(garage);
          expect(typeInstance.cars[0]).to.be.instanceof(Car);
          expect(typeInstance.cars[1]).to.be.instanceof(Car);
        });
      });

      context('with nested optional types', () => {
        it('converts data object to serializable type', () => {
          serializer.registerType('Legal', Legal);
          serializer.registerType('Guid', Guid);

          const id = new Guid();
          const data = {
            _type: 'Legal',
            tos: {
              id: {
                _type: 'Guid',
                id: id.toString(),
              },
              isAccepted: true,
            },
          };
          expect(serializer.fromData<Legal>(data)).to.be.eql(
            new Legal({
              tos: {
                id,
                isAccepted: true,
              },
            })
          );
        });
      });

      context('with nested types', () => {
        it('converts data object to serializable type', () => {
          serializer.registerType('Person', Person);
          serializer.registerType('Address', Address);

          const data = {
            _type: 'Person',
            firstName: 'Jane',
            lastName: 'Doe',
            address: {
              _type: 'Address',
              city: 'New York',
              street: 'Wall Street',
            },
          };

          const typeInstance = serializer.fromData<Person>(data);
          expect(typeInstance).to.be.instanceof(Person);
          expect(typeInstance).to.be.eql(
            new Person({
              firstName: 'Jane',
              lastName: 'Doe',
              address: new Address({
                city: 'New York',
                street: 'Wall Street',
              }),
            })
          );
          expect(typeInstance.address).to.be.instanceof(Address);
        });
      });
    });
  });
});
