import { expect, describe, it, vi } from 'vitest';

import { Module } from '../../../src/core/module';
import { BaseApp } from '../../../src/core/base-app';

describe('requiring modules', () => {
  it('allows multiple modules to require the same sub module', () => {
    class SubModule extends Module {
      // Regression test -> this was invoked twice at some point
      afterInitialize(): void {
        this.injector?.bind('x').toConstantValue(vi.fn());
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

    const appInit = function (): void {
      const app = new MyApp({});
      app.initialize();
    };
    expect(() => {
      appInit();
    }).not.toThrow(Error);
  });
});
