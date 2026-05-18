import { expect, describe, it } from 'vitest';

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

      expect(properties).toHaveLength(3);
      expect(properties).toEqual(
        expect.arrayContaining(['logger', 'db', 'cache'])
      );
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

      expect(properties).toHaveLength(3);
      expect(properties).toEqual(
        expect.arrayContaining(['logger', 'db', 'cache'])
      );
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
      expect(properties).toContain('logger');
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

      expect(details.size).toBe(2);

      const loggerDetails = details.get('logger');
      expect(loggerDetails).to.exist;
      expect(loggerDetails!.serviceIdentifier).toBe(SERVICE_ID.Logger);

      const dbDetails = details.get('db');
      expect(dbDetails).to.exist;
      expect(dbDetails!.serviceIdentifier).toBe(SERVICE_ID.Database);
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

      expect(hasPostConstruct(ChildService)).toBe(true);

      const methods = getPostConstructMethodNames(ChildService);
      expect(methods).toContain('baseInit');
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

      expect(hasPostConstruct(ChildService)).toBe(true);

      const methods = getPostConstructMethodNames(ChildService);
      expect(methods).toHaveLength(2);
      expect(methods).toEqual(
        expect.arrayContaining(['baseInit', 'childInit'])
      );
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

      expect(methods).toHaveLength(3);
      expect(methods).toEqual(
        expect.arrayContaining(['grandParentInit', 'parentInit', 'childInit'])
      );
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

      expect(hasPreDestroy(ChildService)).toBe(true);

      const methods = getPreDestroyMethodNames(ChildService);
      expect(methods).toContain('baseCleanup');
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

      expect(hasPreDestroy(ChildService)).toBe(true);

      const methods = getPreDestroyMethodNames(ChildService);
      expect(methods).toHaveLength(2);
      expect(methods).toEqual(
        expect.arrayContaining(['baseCleanup', 'childCleanup'])
      );
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
      expect(postConstructMethods).toHaveLength(2);
      expect(postConstructMethods).toEqual(
        expect.arrayContaining(['baseInit', 'childInit'])
      );

      const preDestroyMethods = getPreDestroyMethodNames(ChildService);
      expect(preDestroyMethods).toHaveLength(2);
      expect(preDestroyMethods).toEqual(
        expect.arrayContaining(['baseCleanup', 'childCleanup'])
      );
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
      expect(properties).toEqual(
        expect.arrayContaining(['baseMethod', 'childMethod'])
      );

      // Should NOT include injected properties
      expect(properties).not.toContain('logger');
      expect(properties).not.toContain('db');
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
      expect(properties).toEqual(
        expect.arrayContaining(['baseMethod', 'childMethod'])
      );

      // Should NOT include lifecycle hooks
      expect(properties).not.toContain('baseInit');
      expect(properties).not.toContain('childInit');
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

      expect(isPropertyInjected(ChildService, 'logger')).toBe(true);
      expect(isPropertyInjected(ChildService, 'db')).toBe(true);
      expect(isPropertyInjected(ChildService, 'regularProp')).toBe(false);
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
      expect(properties).toHaveLength(4);
      expect(properties).toEqual(
        expect.arrayContaining(['logger', 'db', 'cache', 'config'])
      );

      const postConstructMethods = getPostConstructMethodNames(Level4);
      expect(postConstructMethods).toHaveLength(4);
      expect(postConstructMethods).toEqual(
        expect.arrayContaining([
          'level1Init',
          'level2Init',
          'level3Init',
          'level4Init',
        ])
      );
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
      expect(properties).toHaveLength(2);
      expect(properties).toEqual(expect.arrayContaining(['logger', 'db']));
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

      expect(hasPostConstruct(ChildService)).toBe(true);
      expect(getInjectedPropertyNames(ChildService)).toContain('logger');

      const validateProps = getPropertiesToValidate(ChildService);
      expect(validateProps).toContain('someMethod');
      expect(validateProps).not.toContain('logger');
      expect(validateProps).not.toContain('init');
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

      expect(hasPostConstruct(StandaloneService)).toBe(true);
      expect(getInjectedPropertyNames(StandaloneService)).toContain('logger');
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
      expect(properties).toContain('logger');
    });

    it('returns empty arrays when no metadata exists in chain', () => {
      @injectable()
      class ServiceWithNoMetadata {
        regularMethod() {}
      }

      expect(getInjectedPropertyNames(ServiceWithNoMetadata)).toHaveLength(0);
      expect(getPostConstructMethodNames(ServiceWithNoMetadata)).toHaveLength(
        0
      );
      expect(getPreDestroyMethodNames(ServiceWithNoMetadata)).toHaveLength(0);
      expect(hasPostConstruct(ServiceWithNoMetadata)).toBe(false);
      expect(hasPreDestroy(ServiceWithNoMetadata)).toBe(false);
    });
  });
});
