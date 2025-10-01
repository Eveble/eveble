import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { injectable, inject, postConstruct, preDestroy } from 'inversify';
import sinon from 'sinon';
import {
  getInversifyMetadata,
  isInjectableClass,
  getInjectedPropertyNames,
  getInjectedPropertyDetails,
  hasPostConstruct,
  getPostConstructMethodNames,
  hasPreDestroy,
  getPreDestroyMethodNames,
  getMetadataSummary,
  debugInversifyMetadata,
  getAllClassProperties,
  getPropertiesToValidate,
  isPropertyInjected,
} from '../../../src/utils/inversify';

chai.use(sinonChai);

describe('InversifyJS Metadata Utilities', () => {
  const SERVICE_ID = {
    Database: Symbol.for('Database'),
    Logger: Symbol.for('Logger'),
    Cache: Symbol.for('Cache'),
  };

  interface IDatabase {
    connect(): void;
  }

  interface ILogger {
    log(msg: string): void;
  }

  interface ICache {
    get(key: string): any;
    set(key: string, value: any): void;
  }

  @injectable()
  class Database implements IDatabase {
    connect() {
      console.log('Connected to database');
    }
  }

  @injectable()
  class Logger implements ILogger {
    log(msg: string) {
      console.log(msg);
    }
  }

  @injectable()
  class UserService {
    @inject(SERVICE_ID.Database)
    private db!: IDatabase;

    @inject(SERVICE_ID.Logger)
    private logger!: ILogger;

    @inject(SERVICE_ID.Cache)
    private cache!: ICache;

    public userName = '';

    public userAge = 0;

    @postConstruct()
    initialize() {
      this.logger.log('UserService initialized');
    }

    @preDestroy()
    cleanup() {
      this.logger.log('UserService cleanup');
    }

    getUser() {
      this.logger.log('Getting user...');
      this.db.connect();
      return this.cache.get('user');
    }

    saveUser(name: string, age: number) {
      this.userName = name;
      this.userAge = age;
      this.cache.set('user', { name, age });
    }
  }

  it.skip('debug', () => {
    // Test the functions
    console.log('=== TESTING INVERSIFY METADATA ===\n');

    debugInversifyMetadata(UserService);

    console.log('\n=== METADATA SUMMARY ===');
    const summary = getMetadataSummary(UserService);
    console.log(summary);

    console.log('\n=== INJECTED PROPERTY DETAILS ===');
    const propertyDetails = getInjectedPropertyDetails(UserService);
    for (const [name, details] of propertyDetails.entries()) {
      console.log(`${name}:`, details);
    }

    console.log('\n=== PROPERTY VALIDATION ===');
    console.log('All properties:', getAllClassProperties(UserService));
    console.log(
      'Injected properties (exclude):',
      getInjectedPropertyNames(UserService)
    );
    console.log('Lifecycle methods (exclude):', [
      ...getPostConstructMethodNames(UserService),
      ...getPreDestroyMethodNames(UserService),
    ]);
    console.log(
      'Properties to validate:',
      getPropertiesToValidate(UserService)
    );

    console.log('\n=== INDIVIDUAL CHECKS ===');
    console.log('Is "db" injected?', isPropertyInjected(UserService, 'db'));
    console.log(
      'Is "userName" injected?',
      isPropertyInjected(UserService, 'userName')
    );
    console.log('Has postConstruct?', hasPostConstruct(UserService));
    console.log('Has preDestroy?', hasPreDestroy(UserService));
  });
  describe('getInversifyMetadata', () => {
    it('returns metadata for injectable class', () => {
      const metadata = getInversifyMetadata(UserService);

      expect(metadata).to.not.be.null;
      expect(metadata).to.have.property('properties');
      expect(metadata).to.have.property('lifecycle');
      expect(metadata).to.have.property('constructorArguments');
    });

    it('returns null for non-injectable class', () => {
      class NonInjectable {}

      const metadata = getInversifyMetadata(NonInjectable);
      expect(metadata).to.be.null;
    });
  });

  describe('isInjectableClass', () => {
    it('returns true for injectable class', () => {
      expect(isInjectableClass(UserService)).to.be.true;
      expect(isInjectableClass(Database)).to.be.true;
      expect(isInjectableClass(Logger)).to.be.true;
    });

    it('returns false for non-injectable class', () => {
      class NonInjectable {}
      expect(isInjectableClass(NonInjectable)).to.be.false;
    });
  });

  describe('getInjectedPropertyNames', () => {
    it('returns all injected property names', () => {
      const properties = getInjectedPropertyNames(UserService);

      expect(properties).to.be.an('array');
      expect(properties).to.have.lengthOf(3);
      expect(properties).to.include('db');
      expect(properties).to.include('logger');
      expect(properties).to.include('cache');
    });

    it('returns empty array for class without injected properties', () => {
      @injectable()
      class NoInjections {
        public value = 42;
      }

      const properties = getInjectedPropertyNames(NoInjections);
      expect(properties).to.be.an('array');
      expect(properties).to.have.lengthOf(0);
    });
  });

  describe('getInjectedPropertyDetails', () => {
    it('returns detailed information about injected properties', () => {
      const details = getInjectedPropertyDetails(UserService);

      expect(details).to.be.instanceof(Map);
      expect(details.size).to.equal(3);

      const dbDetails = details.get('db');
      expect(dbDetails).to.exist;
      expect(dbDetails!.serviceIdentifier).to.equal(SERVICE_ID.Database);
      expect(dbDetails!.optional).to.be.false;

      const loggerDetails = details.get('logger');
      expect(loggerDetails).to.exist;
      expect(loggerDetails!.serviceIdentifier).to.equal(SERVICE_ID.Logger);

      const cacheDetails = details.get('cache');
      expect(cacheDetails).to.exist;
      expect(cacheDetails!.serviceIdentifier).to.equal(SERVICE_ID.Cache);
    });
  });

  describe('hasPostConstruct', () => {
    it('returns true when class has @postConstruct', () => {
      expect(hasPostConstruct(UserService)).to.be.true;
    });

    it('returns false when class has no @postConstruct', () => {
      @injectable()
      class NoLifecycle {}

      expect(hasPostConstruct(NoLifecycle)).to.be.false;
    });
  });

  describe('getPostConstructMethodNames', () => {
    it('returns names of @postConstruct methods', () => {
      const methods = getPostConstructMethodNames(UserService);

      expect(methods).to.be.an('array');
      expect(methods).to.have.lengthOf(1);
      expect(methods).to.include('initialize');
    });

    it('supports multiple @postConstruct methods', () => {
      @injectable()
      class MultiplePostConstruct {
        @postConstruct()
        init1() {}

        @postConstruct()
        init2() {}
      }

      const methods = getPostConstructMethodNames(MultiplePostConstruct);
      expect(methods).to.have.lengthOf(2);
      expect(methods).to.include.members(['init1', 'init2']);
    });
  });

  describe('hasPreDestroy', () => {
    it('returns true when class has @preDestroy', () => {
      expect(hasPreDestroy(UserService)).to.be.true;
    });

    it('returns false when class has no @preDestroy', () => {
      @injectable()
      class NoLifecycle {}

      expect(hasPreDestroy(NoLifecycle)).to.be.false;
    });
  });

  describe('getPreDestroyMethodNames', () => {
    it('returns names of @preDestroy methods', () => {
      const methods = getPreDestroyMethodNames(UserService);

      expect(methods).to.be.an('array');
      expect(methods).to.have.lengthOf(1);
      expect(methods).to.include('cleanup');
    });
  });

  describe('getMetadataSummary', () => {
    it('returns complete metadata summary', () => {
      const summary = getMetadataSummary(UserService);

      expect(summary).to.deep.include({
        isInjectable: true,
        injectedProperties: ['db', 'logger', 'cache'],
        postConstructMethods: ['initialize'],
        preDestroyMethods: ['cleanup'],
      });
      expect(summary.injectedParameters).to.be.an('array');
    });
  });

  describe('debugInversifyMetadata', () => {
    it('logs metadata without throwing errors', () => {
      const consoleLogStub = sinon.stub(console, 'log');

      expect(() => debugInversifyMetadata(UserService)).to.not.throw();

      expect(consoleLogStub).to.have.been.called;
      consoleLogStub.restore();
    });

    it('handles class without metadata gracefully', () => {
      class NonInjectable {}
      const consoleLogStub = sinon.stub(console, 'log');

      expect(() => debugInversifyMetadata(NonInjectable)).to.not.throw();

      expect(consoleLogStub).to.have.been.calledWith(
        'No InversifyJS metadata found'
      );
      consoleLogStub.restore();
    });
  });

  describe('getAllClassProperties', () => {
    it('returns all prototype properties excluding constructor', () => {
      const properties = getAllClassProperties(UserService);

      expect(properties).to.be.an('array');
      expect(properties).to.include.members([
        'initialize',
        'cleanup',
        'getUser',
        'saveUser',
      ]);
      expect(properties).to.not.include('constructor');
    });
  });

  describe('getPropertiesToValidate', () => {
    it('excludes injected properties and lifecycle methods', () => {
      const properties = getPropertiesToValidate(UserService);

      // Should include regular methods
      expect(properties).to.include.members(['getUser', 'saveUser']);

      // Should NOT include injected properties
      expect(properties).to.not.include('db');
      expect(properties).to.not.include('logger');
      expect(properties).to.not.include('cache');

      // Should NOT include lifecycle methods
      expect(properties).to.not.include('initialize');
      expect(properties).to.not.include('cleanup');
    });

    it('returns all properties for class without injections', () => {
      @injectable()
      class SimpleClass {
        method1() {}

        method2() {}
      }

      const properties = getPropertiesToValidate(SimpleClass);
      expect(properties).to.include.members(['method1', 'method2']);
    });
  });

  describe('isPropertyInjected', () => {
    it('returns true for injected properties', () => {
      expect(isPropertyInjected(UserService, 'db')).to.be.true;
      expect(isPropertyInjected(UserService, 'logger')).to.be.true;
      expect(isPropertyInjected(UserService, 'cache')).to.be.true;
    });

    it('returns false for non-injected properties', () => {
      expect(isPropertyInjected(UserService, 'userName')).to.be.false;
      expect(isPropertyInjected(UserService, 'userAge')).to.be.false;
      expect(isPropertyInjected(UserService, 'getUser')).to.be.false;
    });
  });

  describe('UserService integration', () => {
    it('has correct metadata structure', () => {
      const metadata = getInversifyMetadata(UserService);

      expect(metadata).to.not.be.null;
      expect(metadata!.properties.size).to.equal(3);
      expect(metadata!.lifecycle.postConstructMethodNames.size).to.equal(1);
      expect(metadata!.lifecycle.preDestroyMethodNames.size).to.equal(1);
    });

    it('correctly identifies validation properties vs injected properties', () => {
      const allProps = getAllClassProperties(UserService);
      const injectedProps = getInjectedPropertyNames(UserService);
      const validateProps = getPropertiesToValidate(UserService);

      // Injected properties should not be in validation list
      for (const injected of injectedProps) {
        expect(validateProps).to.not.include(injected);
      }

      // All properties should include both injected and non-injected
      expect(allProps.length).to.be.greaterThan(validateProps.length);
    });
  });
});
