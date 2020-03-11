import { expect } from 'chai';
import sinon from 'sinon';
import { inject } from '@parisholley/inversify-async';
import { stubInterface } from 'ts-sinon';
import { Module } from '../../../src/core/module';
import { BaseApp } from '../../../src/core/base-app';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';

describe('building applications based on modules', () => {
  let log: any;

  beforeEach(() => {
    log = stubInterface<types.Logger>();
  });

  const MY_BINDINGS = {
    Dependency: Symbol.for('Dependency'),
  };

  it('loads required module correctly', async () => {
    const dependencyValue = sinon.spy();

    class MyApp extends BaseApp {
      @inject(MY_BINDINGS.Dependency)
      dependency: any;
    }

    class MyModule extends Module {
      async onInitialize(): Promise<void> {
        this.injector
          .bind(MY_BINDINGS.Dependency)
          .toConstantValue(dependencyValue);
      }
    }

    const app = new MyApp({
      modules: [new MyModule()],
    });
    app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    await app.initialize();
    expect(app.dependency).to.equal(dependencyValue);
  });

  it('configures module before running', async () => {
    const moduleValue = 'module-configuration';
    const appValue = 'application-configuration';
    let testResult = null;

    class MyApp extends BaseApp {
      @inject(MY_BINDINGS.Dependency)
      dependency: any;

      async onInitialize(): Promise<void> {
        this.injector.rebind(MY_BINDINGS.Dependency).toConstantValue(appValue);
      }
    }

    class FirstModule extends Module {
      async onInitialize(): Promise<void> {
        this.injector.bind(MY_BINDINGS.Dependency).toConstantValue(moduleValue);
      }

      async onStart(): Promise<void> {
        testResult = await this.injector.get(MY_BINDINGS.Dependency);
      }
    }

    const app = new MyApp({
      modules: [new FirstModule()],
    });
    app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    await app.initialize();
    await app.start();

    expect(testResult).to.equal(appValue);
  });
});
