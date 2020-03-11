import { expect } from 'chai';
import sinon from 'sinon';
import { Module } from '../../../src/core/module';
import { BaseApp } from '../../../src/core/base-app';

describe('requiring modules', function() {
  it('allows multiple modules to require the same sub module', function() {
    class SubModule extends Module {
      // Regression test -> this was invoked twice at some point
      afterInitialize(): void {
        this.injector?.bind('x').toConstantValue(sinon.spy());
      }
    }

    class DependentModule1 extends Module {
      modules = [new SubModule()];
    }
    class DependentModule2 extends Module {
      modules = [new SubModule()];
    }

    class MyApp extends BaseApp {
      modules = [new DependentModule1(), new DependentModule2()];
    }

    const appInit = function(): void {
      const app = new MyApp({});
      app.initialize();
    };
    expect(() => {
      appInit();
    }).to.not.throw(Error);
  });
});
