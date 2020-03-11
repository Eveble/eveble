import 'reflect-metadata';
import chai, { expect } from 'chai';
import { getTypeName } from '@eveble/helpers';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import { define, InvalidTypeNameError } from '../../../src/decorators/define';
import { Serializable } from '../../../src/components/serializable';
import { kernel } from '../../../src/core/kernel';
import { types } from '../../../src/types';
import { Struct } from '../../../src/components/struct';
import {
  DEFAULT_PROPS_KEY,
  SERIALIZABLE_LIST_PROPS_KEY,
} from '../../../src/constants/metadata-keys';

chai.use(sinonChai);

describe(`define`, function() {
  let originalLibrary: any;
  let library: any;

  before(() => {
    originalLibrary = kernel.library;
  });

  beforeEach(() => {
    library = stubInterface<types.Library>();
    kernel.setLibrary(library);
  });

  after(() => {
    kernel.setLibrary(originalLibrary);
  });

  describe('hooks', () => {
    describe('beforeDefine', () => {
      it('throws InvalidTypeNameError if invalid type name is passed', () => {
        const fn = (): void => {
          @define(1234)
          class MyType {}
          new MyType();
        };

        expect(() => fn()).to.throw(
          InvalidTypeNameError,
          `Expected type name argument to be a String, got Number(1234)`
        );
      });
    });
  });

  describe('afterDefine', () => {
    it('sets the optional type name for type', () => {
      @define('Namespace.MyType')
      class MyType {
        key: string;
      }
      expect(getTypeName(MyType)).to.be.equal('Namespace.MyType');
    });

    describe('registration', () => {
      it('registers serializable type', () => {
        @define('MySerializable')
        class MySerializable extends Serializable {}

        expect(library.registerType).to.be.called;
        expect(library.registerType).to.be.calledWithExactly(
          'MySerializable',
          MySerializable
        );
      });

      it('omits registration of serializable type if isRegistrable options is set to false', () => {
        @define('MySerializable', { isRegistrable: false })
        class MySerializable extends Serializable {}
        new MySerializable();
        expect(library.registerType).to.not.be.called;
      });

      it('skips registration on non-serializable types', () => {
        @define('MyStruct', { isRegistrable: false })
        class MyStruct extends Struct {}
        new MyStruct();
        expect(library.registerType).to.not.be.called;
      });

      it(`sets the property initializers on type's metadata`, () => {
        @define('MyClass', { isRegistrable: false })
        class MyClass extends Serializable {
          stringKey = 'my-string';

          numberKey = 1337;
        }
        expect(Reflect.getOwnMetadata(DEFAULT_PROPS_KEY, MyClass)).to.be.eql({
          stringKey: 'my-string',
          numberKey: 1337,
        });
      });

      it(`sets the serializable lists for later use for performance reasons`, () => {
        @define('Employee', { isRegistrable: false })
        class Employee extends Serializable {
          id: string;
        }

        @define('Car', { isRegistrable: false })
        class Car extends Serializable {
          plate: string;
        }

        @define('Company', { isRegistrable: false })
        class Company extends Serializable {
          employee: Employee[];

          fleet: Car[];
        }
        expect(
          Reflect.getOwnMetadata(SERIALIZABLE_LIST_PROPS_KEY, Company)
        ).to.be.eql({
          employee: Employee,
          fleet: Car,
        });
      });
    });
  });
});
