import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { injectable, inject, postConstruct, preDestroy } from 'inversify';
import {
  getInjectedPropertyNames,
  getInjectedPropertyDetails,
  hasPostConstruct,
  getPostConstructMethodNames,
  hasPreDestroy,
  getPreDestroyMethodNames,
  getPropertiesToValidate,
  isPropertyInjected,
} from '../../../src/utils/inversify';

chai.use(sinonChai);

describe('InversifyJS Metadata Utilities - Inheritance', () => {
  const SERVICE_ID = {
    Logger: Symbol.for('Logger'),
    Database: Symbol.for('Database'),
    Cache: Symbol.for('Cache'),
    Config: Symbol.for('Config'),
  };

  interface ILogger {
    log(msg: string): void;
  }

  interface IDatabase {
    connect(): void;
  }

  interface ICache {
    get(key: string): any;
  }

  interface IConfig {
    get(key: string): any;
  }

  describe('Inheritance chain - injected properties', () => {
    it('collects injected properties from parent class', () => {
      @injectable()
      class BaseService {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;

        @inject(SERVICE_ID.Database)
        protected db!: IDatabase;
      }

      @injectable()
      class ChildService extends BaseService {
        @inject(SERVICE_ID.Cache)
        protected cache!: ICache;
      }

      const properties = getInjectedPropertyNames(ChildService);

      expect(properties).to.have.lengthOf(3);
      expect(properties).to.include.members(['logger', 'db', 'cache']);
    });

    it('collects injected properties from multiple inheritance levels', () => {
      @injectable()
      class GrandParentService {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;
      }

      @injectable()
      class ParentService extends GrandParentService {
        @inject(SERVICE_ID.Database)
        protected db!: IDatabase;
      }

      @injectable()
      class ChildService extends ParentService {
        @inject(SERVICE_ID.Cache)
        protected cache!: ICache;
      }

      const properties = getInjectedPropertyNames(ChildService);

      expect(properties).to.have.lengthOf(3);
      expect(properties).to.include.members(['logger', 'db', 'cache']);
    });

    it('handles property override in child class', () => {
      @injectable()
      class BaseService {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;
      }

      @injectable()
      class ChildService extends BaseService {
        // Redefine with different service (edge case)
        @inject(SERVICE_ID.Cache)
        protected logger!: any; // Override parent's logger
      }

      const properties = getInjectedPropertyNames(ChildService);

      // Should still have 'logger', even if overridden
      expect(properties).to.include('logger');
    });

    it('returns correct details for inherited properties', () => {
      @injectable()
      class BaseService {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;
      }

      @injectable()
      class ChildService extends BaseService {
        @inject(SERVICE_ID.Database)
        protected db!: IDatabase;
      }

      const details = getInjectedPropertyDetails(ChildService);

      expect(details.size).to.equal(2);

      const loggerDetails = details.get('logger');
      expect(loggerDetails).to.exist;
      expect(loggerDetails!.serviceIdentifier).to.equal(SERVICE_ID.Logger);

      const dbDetails = details.get('db');
      expect(dbDetails).to.exist;
      expect(dbDetails!.serviceIdentifier).to.equal(SERVICE_ID.Database);
    });
  });

  describe('Inheritance chain - lifecycle hooks', () => {
    it('detects @postConstruct in parent class', () => {
      @injectable()
      class BaseService {
        @postConstruct()
        baseInit() {}
      }

      @injectable()
      class ChildService extends BaseService {
        regularMethod() {}
      }

      expect(hasPostConstruct(ChildService)).to.be.true;

      const methods = getPostConstructMethodNames(ChildService);
      expect(methods).to.include('baseInit');
    });

    it('collects @postConstruct from both parent and child', () => {
      @injectable()
      class BaseService {
        @postConstruct()
        baseInit() {}
      }

      @injectable()
      class ChildService extends BaseService {
        @postConstruct()
        childInit() {}
      }

      expect(hasPostConstruct(ChildService)).to.be.true;

      const methods = getPostConstructMethodNames(ChildService);
      expect(methods).to.have.lengthOf(2);
      expect(methods).to.include.members(['baseInit', 'childInit']);
    });

    it('collects @postConstruct from multiple inheritance levels', () => {
      @injectable()
      class GrandParentService {
        @postConstruct()
        grandParentInit() {}
      }

      @injectable()
      class ParentService extends GrandParentService {
        @postConstruct()
        parentInit() {}
      }

      @injectable()
      class ChildService extends ParentService {
        @postConstruct()
        childInit() {}
      }

      const methods = getPostConstructMethodNames(ChildService);

      expect(methods).to.have.lengthOf(3);
      expect(methods).to.include.members([
        'grandParentInit',
        'parentInit',
        'childInit',
      ]);
    });

    it('detects @preDestroy in parent class', () => {
      @injectable()
      class BaseService {
        @preDestroy()
        baseCleanup() {}
      }

      @injectable()
      class ChildService extends BaseService {
        regularMethod() {}
      }

      expect(hasPreDestroy(ChildService)).to.be.true;

      const methods = getPreDestroyMethodNames(ChildService);
      expect(methods).to.include('baseCleanup');
    });

    it('collects @preDestroy from both parent and child', () => {
      @injectable()
      class BaseService {
        @preDestroy()
        baseCleanup() {}
      }

      @injectable()
      class ChildService extends BaseService {
        @preDestroy()
        childCleanup() {}
      }

      expect(hasPreDestroy(ChildService)).to.be.true;

      const methods = getPreDestroyMethodNames(ChildService);
      expect(methods).to.have.lengthOf(2);
      expect(methods).to.include.members(['baseCleanup', 'childCleanup']);
    });

    it('handles multiple lifecycle hooks at different levels', () => {
      @injectable()
      class BaseService {
        @postConstruct()
        baseInit() {}

        @preDestroy()
        baseCleanup() {}
      }

      @injectable()
      class ChildService extends BaseService {
        @postConstruct()
        childInit() {}

        @preDestroy()
        childCleanup() {}
      }

      const postConstructMethods = getPostConstructMethodNames(ChildService);
      expect(postConstructMethods).to.have.lengthOf(2);
      expect(postConstructMethods).to.include.members([
        'baseInit',
        'childInit',
      ]);

      const preDestroyMethods = getPreDestroyMethodNames(ChildService);
      expect(preDestroyMethods).to.have.lengthOf(2);
      expect(preDestroyMethods).to.include.members([
        'baseCleanup',
        'childCleanup',
      ]);
    });
  });

  describe('Inheritance chain - property validation', () => {
    it('excludes inherited injected properties from validation', () => {
      @injectable()
      class BaseService {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;

        baseMethod() {}
      }

      @injectable()
      class ChildService extends BaseService {
        @inject(SERVICE_ID.Database)
        protected db!: IDatabase;

        childMethod() {}
      }

      const properties = getPropertiesToValidate(ChildService);
      // Should include methods
      expect(properties).to.include.members(['baseMethod', 'childMethod']);

      // Should NOT include injected properties
      expect(properties).to.not.include('logger');
      expect(properties).to.not.include('db');
    });

    it('excludes inherited lifecycle hooks from validation', () => {
      @injectable()
      class BaseService {
        @postConstruct()
        baseInit() {}

        baseMethod() {}
      }

      @injectable()
      class ChildService extends BaseService {
        @postConstruct()
        childInit() {}

        childMethod() {}
      }

      const properties = getPropertiesToValidate(ChildService);

      // Should include regular methods
      expect(properties).to.include.members(['baseMethod', 'childMethod']);

      // Should NOT include lifecycle hooks
      expect(properties).to.not.include('baseInit');
      expect(properties).to.not.include('childInit');
    });

    it('correctly identifies inherited injected properties', () => {
      @injectable()
      class BaseService {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;
      }

      @injectable()
      class ChildService extends BaseService {
        @inject(SERVICE_ID.Database)
        protected db!: IDatabase;

        public regularProp = 'value';
      }

      expect(isPropertyInjected(ChildService, 'logger')).to.be.true;
      expect(isPropertyInjected(ChildService, 'db')).to.be.true;
      expect(isPropertyInjected(ChildService, 'regularProp')).to.be.false;
    });
  });

  describe('Complex inheritance scenarios', () => {
    it('handles deep inheritance chain (4+ levels)', () => {
      @injectable()
      class Level1 {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;

        @postConstruct()
        level1Init() {}
      }

      @injectable()
      class Level2 extends Level1 {
        @inject(SERVICE_ID.Database)
        protected db!: IDatabase;

        @postConstruct()
        level2Init() {}
      }

      @injectable()
      class Level3 extends Level2 {
        @inject(SERVICE_ID.Cache)
        protected cache!: ICache;

        @postConstruct()
        level3Init() {}
      }

      @injectable()
      class Level4 extends Level3 {
        @inject(SERVICE_ID.Config)
        protected config!: IConfig;

        @postConstruct()
        level4Init() {}
      }

      const properties = getInjectedPropertyNames(Level4);
      expect(properties).to.have.lengthOf(4);
      expect(properties).to.include.members([
        'logger',
        'db',
        'cache',
        'config',
      ]);

      const postConstructMethods = getPostConstructMethodNames(Level4);
      expect(postConstructMethods).to.have.lengthOf(4);
      expect(postConstructMethods).to.include.members([
        'level1Init',
        'level2Init',
        'level3Init',
        'level4Init',
      ]);
    });

    it('handles mixed inheritance with and without decorators', () => {
      @injectable()
      class BaseWithInjection {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;
      }

      @injectable()
      class MiddleWithoutInjection extends BaseWithInjection {
        regularMethod() {}
      }

      @injectable()
      class ChildWithInjection extends MiddleWithoutInjection {
        @inject(SERVICE_ID.Database)
        protected db!: IDatabase;
      }

      const properties = getInjectedPropertyNames(ChildWithInjection);
      expect(properties).to.have.lengthOf(2);
      expect(properties).to.include.members(['logger', 'db']);
    });

    it('handles class with only inherited metadata', () => {
      @injectable()
      class BaseService {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;

        @postConstruct()
        init() {}
      }

      @injectable()
      class ChildService extends BaseService {
        // No additional decorators
        someMethod() {}
      }

      expect(hasPostConstruct(ChildService)).to.be.true;
      expect(getInjectedPropertyNames(ChildService)).to.include('logger');

      const validateProps = getPropertiesToValidate(ChildService);
      expect(validateProps).to.include('someMethod');
      expect(validateProps).to.not.include('logger');
      expect(validateProps).to.not.include('init');
    });
  });

  describe('Edge cases', () => {
    it('handles class without parent having decorators', () => {
      @injectable()
      class StandaloneService {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;

        @postConstruct()
        init() {}
      }

      expect(hasPostConstruct(StandaloneService)).to.be.true;
      expect(getInjectedPropertyNames(StandaloneService)).to.include('logger');
    });

    it('handles non-injectable parent class', () => {
      // Non-injectable base (no @injectable decorator)
      class NonInjectableBase {
        regularMethod() {}
      }

      @injectable()
      class InjectableChild extends NonInjectableBase {
        @inject(SERVICE_ID.Logger)
        protected logger!: ILogger;
      }

      // Should only find metadata from injectable child
      const properties = getInjectedPropertyNames(InjectableChild);
      expect(properties).to.include('logger');
    });

    it('returns empty arrays when no metadata exists in chain', () => {
      @injectable()
      class ServiceWithNoMetadata {
        regularMethod() {}
      }

      expect(getInjectedPropertyNames(ServiceWithNoMetadata)).to.be.empty;
      expect(getPostConstructMethodNames(ServiceWithNoMetadata)).to.be.empty;
      expect(getPreDestroyMethodNames(ServiceWithNoMetadata)).to.be.empty;
      expect(hasPostConstruct(ServiceWithNoMetadata)).to.be.false;
      expect(hasPreDestroy(ServiceWithNoMetadata)).to.be.false;
    });
  });
});
