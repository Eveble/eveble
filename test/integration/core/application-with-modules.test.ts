import { expect } from 'chai';
import sinon from 'sinon';
import { inject } from '@parisholley/inversify-async';
import { BaseModule } from '../../../src/core/base-module';
import { BaseApp } from '../../../src/core/base-app';

describe('building applications based on modules', () => {
  const BINDINGS = {
    Dependency: Symbol.for('Dependency'),
  };

  it('loads required module correctly', async () => {
    const dependencyValue = sinon.spy();

    class MyApp extends BaseApp {
      @inject(BINDINGS.Dependency)
      dependency: any;
    }

    class MyModule extends BaseModule {
      async onInitialize(): Promise<void> {
        this.injector.bind(BINDINGS.Dependency).toConstantValue(dependencyValue);
      }
    }

    const app = new MyApp({
      modules: [new MyModule()],
    });
    await app.initialize();
    expect(app.dependency).to.equal(dependencyValue);
  });

  it('configures module before running', async () => {
    const moduleValue = 'module-configuration';
    const appValue = 'application-configuration';
    let testResult = null;

    class MyApp extends BaseApp {
      @inject(BINDINGS.Dependency)
      dependency: any;

      async onInitialize(): Promise<void> {
        this.injector.rebind(BINDINGS.Dependency).toConstantValue(appValue);
      }
    }

    class FirstModule extends BaseModule {
      async onInitialize(): Promise<void> {
        this.injector.bind(BINDINGS.Dependency).toConstantValue(moduleValue);
      }

      async onStart(): Promise<void> {
        testResult = await this.injector.get(BINDINGS.Dependency);
      }
    }

    const app = new MyApp({
      modules: [new FirstModule()],
    });

    await app.initialize();
    await app.start();

    expect(testResult).to.equal(appValue);
  });
});
