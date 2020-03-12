import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import { TSRuntimeConverter, typend, Describer } from 'typend';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { Kernel, kernel } from '../../../src/core/kernel';
import { BINDINGS } from '../../../src/constants/bindings';
import { Library } from '../../../src/core/library';
import { UnavailableSerializerError } from '../../../src/core/core-errors';

chai.use(sinonChai);

describe(`Kernel`, () => {
  let sandbox: sinon.SinonSandbox;

  let converter: any;
  let validator: any;
  let describer: any;
  let library: any;
  let serializer: any;
  let asserter: any;
  let config: any;
  let injector: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    converter = stubInterface<types.Converter>();
    validator = stubInterface<types.Validator>();
    describer = stubInterface<types.Describer>();
    library = stubInterface<types.Library>();
    serializer = stubInterface<types.Serializer>();
    asserter = stubInterface<types.Asserter>();
    config = stubInterface<types.KernelConfig>();
    injector = stubInterface<types.Injector>();
  });

  afterEach(() => {
    sandbox.reset();
  });

  describe('construction', () => {
    it(`takes dependencies for construction: converter, validator, describer, library, config; and assigns them`, () => {
      const instance = new Kernel(
        converter,
        validator,
        describer,
        library,
        config
      );
      expect(instance.converter).to.be.equal(converter);
      expect(instance.validator).to.be.equal(validator);
      expect(instance.describer).to.be.equal(describer);
      expect(instance.library).to.be.equal(library);
    });

    it('sets the describer formatting on construction', () => {
      const cfg: types.KernelConfig = {
        validation: { type: 'runtime' },
        conversion: { type: 'runtime' },
        describer: { formatting: 'debug' },
      };
      const instance = new Kernel(
        converter,
        validator,
        describer,
        library,
        cfg
      );
      expect(instance.describer.setFormatting).to.be.calledOnce;
      expect(instance.describer.setFormatting).to.be.calledWithExactly('debug');
    });
  });

  describe('getters', () => {
    let instance;

    beforeEach(() => {
      instance = new Kernel(converter, validator, describer, library, config);
    });

    describe('converter', () => {
      it('returns converter as instance assigned durning construction', () => {
        expect(instance.converter).to.be.equal(converter);
      });

      it('returns converter from IoC', () => {
        instance.setInjector(injector);
        const otherConverter = sandbox.stub();

        injector.get.withArgs(BINDINGS.Converter).returns(otherConverter);
        expect(instance.converter).to.be.equal(otherConverter);
      });
    });

    describe('validator', () => {
      it('returns validator as instance assigned durning construction', () => {
        expect(instance.validator).to.be.equal(validator);
      });

      it('returns validator from IoC', () => {
        instance.setInjector(injector);
        const otherValidator = sandbox.stub();

        injector.get.withArgs(BINDINGS.Validator).returns(otherValidator);
        expect(instance.validator).to.be.equal(otherValidator);
      });
    });

    describe('describer', () => {
      it('returns describer as instance assigned durning construction', () => {
        expect(instance.describer).to.be.equal(describer);
      });

      it('returns describer from IoC', () => {
        instance.setInjector(injector);
        const otherDescriber = sandbox.stub();

        injector.get.withArgs(BINDINGS.Describer).returns(otherDescriber);
        expect(instance.describer).to.be.equal(otherDescriber);
      });
    });

    describe('library', () => {
      it('returns library as instance assigned durning construction', () => {
        expect(instance.library).to.be.equal(library);
      });

      it('returns library from IoC', () => {
        instance.setInjector(injector);
        const otherLibrary = sandbox.stub();

        injector.get.withArgs(BINDINGS.Library).returns(otherLibrary);
        expect(instance.library).to.be.equal(otherLibrary);
      });
    });

    describe('serializer', () => {
      it('throws UnavailableSerializerError since serializer is not assigned durning construction', () => {
        expect(() => instance.serializer).to.throw(
          UnavailableSerializerError,
          `Serialization is unavailable outside on application environment.\n      Define application before using any features related to serialization or set serializer on kernel by using <kernel.setSerializer()>`
        );
      });

      it('returns serializer from IoC', () => {
        instance.setInjector(injector);
        const otherSerializer = sandbox.stub();

        injector.isBound.withArgs(BINDINGS.Serializer).returns(true);
        injector.get.withArgs(BINDINGS.Serializer).returns(otherSerializer);
        expect(instance.serializer).to.be.equal(otherSerializer);
      });
    });
  });

  describe('setters', () => {
    let instance;

    beforeEach(() => {
      instance = new Kernel(converter, validator, describer, library, config);
    });

    it('allows to set IoC container on Kernel', () => {
      instance.setInjector(injector);
      expect(true).to.be.true;
    });

    describe('converter', () => {
      it('allows to override existing converter', () => {
        const otherConverter = stubInterface<types.Converter>();
        instance.setConverter(otherConverter);
        expect(instance.converter).to.be.equal(otherConverter);
      });

      it('sets converter on IoC', () => {
        const ioc = new Injector();
        instance.setInjector(ioc);

        const otherConverter = stubInterface<types.Converter>();
        ioc.bind(BINDINGS.Converter).toConstantValue(converter);

        instance.setConverter(otherConverter);
        expect(instance.converter).to.be.equal(otherConverter);
        expect(ioc.get(BINDINGS.Converter)).to.be.equal(otherConverter);
      });
    });

    describe('validator', () => {
      it('allows to override existing validator', () => {
        const otherValidator = stubInterface<types.Validator>();
        instance.setValidator(otherValidator);
        expect(instance.validator).to.be.equal(otherValidator);
      });

      it('sets validator on IoC', () => {
        const ioc = new Injector();
        instance.setInjector(ioc);

        const otherValidator = stubInterface<types.Validator>();
        ioc.bind(BINDINGS.Validator).toConstantValue(validator);

        instance.setValidator(otherValidator);
        expect(instance.validator).to.be.equal(otherValidator);
        expect(ioc.get(BINDINGS.Validator)).to.be.equal(otherValidator);
      });
    });

    describe('describer', () => {
      it('allows to override existing describer', () => {
        const otherDescriber = stubInterface<types.Describer>();
        instance.setDescriber(otherDescriber);
        expect(instance.describer).to.be.equal(otherDescriber);
      });

      it('sets describer on IoC', () => {
        const ioc = new Injector();
        instance.setInjector(ioc);

        const otherDescriber = stubInterface<types.Describer>();
        ioc.bind(BINDINGS.Describer).toConstantValue(describer);

        instance.setDescriber(otherDescriber);
        expect(instance.describer).to.be.equal(otherDescriber);
        expect(ioc.get(BINDINGS.Describer)).to.be.equal(otherDescriber);
      });
    });

    describe('library', () => {
      it('allows to override existing library', () => {
        const otherLibrary = stubInterface<types.Library>();
        instance.setLibrary(otherLibrary);
        expect(instance.library).to.be.equal(otherLibrary);
      });

      it('sets library on IoC', () => {
        const ioc = new Injector();
        instance.setInjector(ioc);

        const otherLibrary = stubInterface<types.Library>();
        ioc.bind(BINDINGS.Library).toConstantValue(library);

        instance.setLibrary(otherLibrary);
        expect(instance.library).to.be.equal(otherLibrary);
        expect(ioc.get(BINDINGS.Library)).to.be.equal(otherLibrary);
      });
    });

    describe('serializer', () => {
      it('allows to set serializer', () => {
        const otherSerializer = stubInterface<types.Serializer>();
        instance.setSerializer(otherSerializer);
        expect(instance.serializer).to.be.equal(otherSerializer);
      });

      it('sets serializer on IoC', () => {
        const ioc = new Injector();
        instance.setInjector(ioc);

        const otherSerializer = stubInterface<types.Serializer>();
        ioc.bind(BINDINGS.Serializer).toConstantValue(serializer);

        instance.setSerializer(otherSerializer);
        expect(instance.serializer).to.be.equal(otherSerializer);
        expect(ioc.get(BINDINGS.Serializer)).to.be.equal(otherSerializer);
      });
    });

    describe('asserter', () => {
      it('allows to set asserter', () => {
        const otherAsserter = stubInterface<types.Asserter>();
        instance.setAsserter(otherAsserter);
        expect(instance.asserter).to.be.equal(otherAsserter);
      });

      it('sets asserter on IoC', () => {
        const ioc = new Injector();
        instance.setInjector(ioc);

        const otherAsserter = stubInterface<types.Asserter>();
        ioc.bind(BINDINGS.Asserter).toConstantValue(asserter);

        instance.setAsserter(otherAsserter);
        expect(instance.asserter).to.be.equal(otherAsserter);
        expect(ioc.get(BINDINGS.Asserter)).to.be.equal(otherAsserter);
      });
    });
  });

  describe('initialization', () => {
    let cfg: types.KernelConfig;

    beforeEach(() => {
      cfg = {
        validation: { type: 'runtime' },
        conversion: { type: 'runtime' },
        describer: { formatting: 'debug' },
      };
    });

    describe('validation', () => {
      it('returns true if validation is running in runtime mode', () => {
        cfg.validation.type = 'runtime';
        const instance = new Kernel(
          converter,
          validator,
          describer,
          library,
          cfg
        );
        expect(instance.isValidating()).to.be.true;
      });

      it('returns false if validation is running in manual mode', () => {
        cfg.validation.type = 'manual';
        const instance = new Kernel(
          converter,
          validator,
          describer,
          library,
          cfg
        );
        expect(instance.isValidating()).to.be.false;
      });
    });

    describe('conversion', () => {
      it('returns true if conversion is running in runtime mode', () => {
        cfg.conversion.type = 'runtime';
        const instance = new Kernel(
          converter,
          validator,
          describer,
          library,
          cfg
        );
        expect(instance.isConverting()).to.be.true;
      });

      it('returns false if conversion is running in manual mode', () => {
        cfg.conversion.type = 'manual';
        const instance = new Kernel(
          converter,
          validator,
          describer,
          library,
          cfg
        );
        expect(instance.isConverting()).to.be.false;
      });
    });
  });

  describe('initialized default kernel', () => {
    describe('dependencies', () => {
      it('ensures that instance of TSRuntimeConverter is set as converter dependency', () => {
        expect(kernel.converter).to.be.instanceof(TSRuntimeConverter);
      });

      it(`ensures that typend's 'typend' is used as validator dependency`, () => {
        expect(kernel.validator).to.be.equal(typend);
      });

      it(`ensures that typend's 'describer' is used as describer dependency`, () => {
        expect(kernel.describer).to.be.instanceof(Describer);
      });

      it(`ensures that evebels's 'Library' is used as library dependency`, () => {
        expect(kernel.library).to.be.instanceof(Library);
      });

      it(`ensures that serializer is not set as dependency`, () => {
        expect(() => kernel.serializer).to.throw(UnavailableSerializerError);
      });

      it('ensures that default configuration is set correctly', () => {
        expect(kernel.isConverting()).to.be.true;
        expect(kernel.isValidating()).to.be.true;
      });
    });
  });
});
