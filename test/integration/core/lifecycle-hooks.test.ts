import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, beforeAll } from 'vitest';

import { Module } from '../../../src/core/module';
import { BaseApp } from '../../../src/core/base-app';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';

describe('app lifecycle hooks', () => {
  // ================================= TEST HELPERS ================================= //

  const createLifeCycleHookSpies = function (): Record<string, Function> {
    const hooks = {};
    const hookNames = [
      'beforeInitialize',
      'onInitialize',
      'afterInitialize',
      'beforeStart',
      'onStart',
      'afterStart',
      'beforeReset',
      'onReset',
      'afterReset',
      'beforeStop',
      'onStop',
      'afterStop',
      'beforeShutdown',
      'onShutdown',
      'afterShutdown',
    ];
    for (const hookName of hookNames) {
      hooks[hookName] = vi.fn();
    }
    return hooks;
  };

  class StubbedModule extends Module {
    beforeInitialize(): any {
      return undefined;
    }

    onInitialize(): any {
      return undefined;
    }

    afterInitialize(): any {
      return undefined;
    }

    beforeStart(): any {
      return undefined;
    }

    onStart(): any {
      return undefined;
    }

    afterStart(): any {
      return undefined;
    }

    beforeStop(): any {
      return undefined;
    }

    onStop(): any {
      return undefined;
    }

    afterStop(): any {
      return undefined;
    }

    beforeReset(): any {
      return undefined;
    }

    onReset(): any {
      return undefined;
    }

    afterReset(): any {
      return undefined;
    }

    beforeShutdown(): any {
      return undefined;
    }

    onShutdown(): any {
      return undefined;
    }

    afterShutdown(): any {
      return undefined;
    }
  }

  class FirstModule extends StubbedModule {
    constructor(props: types.Props) {
      super({ ...props, ...createLifeCycleHookSpies() });
    }
  }
  class SecondModule extends StubbedModule {
    constructor(props: types.Props) {
      super({ ...props, ...createLifeCycleHookSpies() });
    }
  }

  class MyApp extends BaseApp {
    constructor(props: types.Props) {
      super({ ...props, ...createLifeCycleHookSpies() });
    }

    beforeInitialize(): any {
      return undefined;
    }

    onInitialize(): any {
      return undefined;
    }

    afterInitialize(): any {
      return undefined;
    }

    beforeStart(): any {
      return undefined;
    }

    onStart(): any {
      return undefined;
    }

    afterStart(): any {
      return undefined;
    }

    beforeStop(): any {
      return undefined;
    }

    onStop(): any {
      return undefined;
    }

    afterStop(): any {
      return undefined;
    }

    beforeReset(): any {
      return undefined;
    }

    onReset(): any {
      return undefined;
    }

    afterReset(): any {
      return undefined;
    }

    beforeShutdown(): any {
      return undefined;
    }

    onShutdown(): any {
      return undefined;
    }

    afterShutdown(): any {
      return undefined;
    }
  }

  let firstModule: any;
  let secondModule: any;
  let app: MyApp;

  beforeEach(() => {
    firstModule = new FirstModule({});
    secondModule = new SecondModule({
      modules: [firstModule],
    });

    app = new MyApp({ modules: [secondModule] });
    const log = mock<types.Logger>();
    app.injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
  });

  // Readability and 'understanding' is archived by writing expectations manually with use of few letter helpers to not clutter tests with full blown expectation statements.
  const never = function (hook): void {
    expect(hook).not.toHaveBeenCalled();
  };

  const once = function (hook): void {
    expect(hook).toHaveBeenCalledTimes(1);
  };

  const twice = function (hook): void {
    expect(hook).toHaveBeenCalledTimes(2);
  };

  const before = function (firstHook, secondHook): void {
    expect(firstHook).to.have.been.to.have.been.calledBefore(secondHook);
  };

  it('runs the initialize hooks in correct order when application is constructed', async () => {
    await app.initialize();

    // firstModule
    once(firstModule.beforeInitialize);
    beforeAll(firstModule.beforeInitialize, secondModule.beforeInitialize);
    once(firstModule.onInitialize);
    once(firstModule.afterInitialize);
    beforeAll(firstModule.afterInitialize, secondModule.afterInitialize);
    // secondModule
    once(secondModule.beforeInitialize);
    beforeAll(secondModule.beforeInitialize, app.beforeInitialize);
    once(secondModule.onInitialize);
    once(secondModule.afterInitialize);
    beforeAll(secondModule.afterInitialize, app.afterInitialize);
    // app
    once(app.beforeInitialize);
    once(app.onInitialize);
    once(app.afterInitialize);
  });

  it('runs the start hooks in correct order', async () => {
    await app.initialize();

    /*
    ENSURE THAT _START HOOKS DID NOT RUN UPON INITIALIZATION
    */

    // firstModule
    never(firstModule.beforeStart);
    never(firstModule.onStart);
    never(firstModule.afterStart);
    // secondModule
    never(secondModule.beforeStart);
    never(secondModule.onStart);
    never(secondModule.afterStart);
    // app
    never(app.beforeStart);
    never(app.onStart);
    never(app.afterStart);

    /*
    START APPLICATION
    */
    await app.start();

    // first Module
    once(firstModule.beforeStart);
    beforeAll(firstModule.beforeStart, secondModule.beforeStart);
    once(firstModule.onStart);
    beforeAll(firstModule.onStart, secondModule.onStart);
    once(firstModule.afterStart);
    beforeAll(firstModule.afterStart, secondModule.afterStart);

    // secondModule
    once(secondModule.beforeStart);
    beforeAll(secondModule.beforeStart, app.beforeStart);
    once(secondModule.onStart);
    beforeAll(secondModule.onStart, app.onStart);
    once(secondModule.afterStart);
    beforeAll(secondModule.afterStart, app.afterStart);
    // app
    once(app.beforeStart);
    once(app.onStart);
    once(app.afterStart);
  });

  it('runs the stop hooks in correct order', async () => {
    await app.initialize();
    /*
    ENSURE THAT _STOP HOOKS DID NOT RUN UPON INITIALIZATION
    */

    // firstModule
    never(firstModule.beforeStop);
    never(firstModule.onStop);
    never(firstModule.afterStop);

    // secondModule
    never(secondModule.beforeStop);
    never(secondModule.onStop);
    never(secondModule.afterStop);

    // app
    never(app.beforeStop);
    never(app.onStop);
    never(app.afterStop);

    /*
    START & STOP APPLICATION
    */
    await app.start();
    await app.stop();

    // firstModule
    once(firstModule.beforeStop);
    beforeAll(firstModule.beforeStop, secondModule.beforeStop);
    once(firstModule.onStop);
    beforeAll(firstModule.onStop, secondModule.onStop);
    once(firstModule.afterStop);
    beforeAll(firstModule.afterStop, secondModule.afterStop);

    // secondModule
    once(secondModule.beforeStop);
    beforeAll(secondModule.beforeStop, app.beforeStop);
    once(secondModule.onStop);
    beforeAll(secondModule.onStop, app.onStop);
    once(secondModule.afterStop);
    beforeAll(secondModule.afterStop, app.afterStop);

    // app
    once(app.beforeStop);
    once(app.onStop);
    once(app.afterStop);
  });

  it('runs the shutdown hooks in correct order', async () => {
    await app.initialize();
    /*
    ENSURE THAT _STOP HOOKS DID NOT RUN UPON INITIALIZATION
    */

    // firstModule
    never(firstModule.beforeShutdown);
    never(firstModule.onShutdown);
    never(firstModule.afterShutdown);

    // secondModule
    never(secondModule.beforeShutdown);
    never(secondModule.onShutdown);
    never(secondModule.afterShutdown);

    // app
    never(app.beforeShutdown);
    never(app.onShutdown);
    never(app.afterShutdown);

    /*
    START & STOP APPLICATION
    */
    await app.start();
    await app.stop();
    await app.shutdown();

    // firstModule
    once(firstModule.beforeShutdown);
    beforeAll(firstModule.beforeShutdown, secondModule.beforeShutdown);
    once(firstModule.onShutdown);
    beforeAll(firstModule.onShutdown, secondModule.onShutdown);
    once(firstModule.afterShutdown);
    beforeAll(firstModule.afterShutdown, secondModule.afterShutdown);

    // secondModule
    once(secondModule.beforeShutdown);
    beforeAll(secondModule.beforeShutdown, app.beforeShutdown);
    once(secondModule.onShutdown);
    beforeAll(secondModule.onShutdown, app.onShutdown);
    once(secondModule.afterShutdown);
    beforeAll(secondModule.afterShutdown, app.afterShutdown);

    // app
    once(app.beforeShutdown);
    once(app.onShutdown);
    once(app.afterShutdown);
  });

  it('runs the reset hooks in correct order when app is running', async () => {
    await app.initialize();
    /*
    ENSURE THAT _STOP HOOKS DID NOT RUN UPON INITIALIZATION
    */

    // firstModule
    never(firstModule.beforeReset);
    never(firstModule.onReset);
    never(firstModule.afterReset);

    // secondModule
    never(secondModule.beforeReset);
    never(secondModule.onReset);
    never(secondModule.afterReset);

    // app
    never(app.beforeReset);
    never(app.onReset);
    never(app.afterReset);

    /*
    START & RESET APPLICATION
    */
    await app.start();
    await app.reset();

    /*
    APPLICATION AND MODULES ARE FIRST STOPPED
    */
    // firstModule
    once(firstModule.beforeStop);
    beforeAll(firstModule.beforeStop, secondModule.beforeStop);
    once(firstModule.onStop);
    beforeAll(firstModule.onStop, secondModule.onStop);
    once(firstModule.afterStop);
    beforeAll(firstModule.afterStop, secondModule.afterStop);

    // secondModule
    once(secondModule.beforeStop);
    beforeAll(secondModule.beforeStop, app.beforeStop);
    once(secondModule.onStop);
    beforeAll(secondModule.onStop, app.onStop);
    once(secondModule.afterStop);
    beforeAll(secondModule.afterStop, app.afterStop);

    // app
    once(app.beforeStop);
    once(app.onStop);
    once(app.afterStop);

    /*
    APPLICATION AND MODULES THEN ARE RESETTING
    */
    // firstModule
    once(firstModule.beforeReset);
    beforeAll(firstModule.beforeReset, secondModule.beforeReset);
    once(firstModule.onReset);
    beforeAll(firstModule.onReset, secondModule.onReset);
    once(firstModule.afterReset);
    beforeAll(firstModule.afterReset, secondModule.afterReset);

    // secondModule
    once(secondModule.beforeReset);
    beforeAll(secondModule.beforeReset, app.beforeReset);
    once(secondModule.onReset);
    beforeAll(secondModule.onReset, app.onReset);
    once(secondModule.afterReset);
    beforeAll(secondModule.afterReset, app.afterReset);

    // app
    once(app.beforeReset);
    once(app.onReset);
    once(app.afterReset);

    /*
    APPLICATION AND MODULES THEN ARE _AGAIN_ STARTING FOR SECOND TIME
    */
    // firstModule
    twice(firstModule.beforeStart);
    beforeAll(firstModule.beforeStart, secondModule.beforeStart);
    twice(firstModule.onStart);
    beforeAll(firstModule.onStart, secondModule.onStart);
    twice(firstModule.afterStart);
    beforeAll(firstModule.afterStart, secondModule.afterStart);

    // secondModule
    twice(secondModule.beforeStart);
    beforeAll(secondModule.beforeStart, app.beforeStart);
    twice(secondModule.onStart);
    beforeAll(secondModule.onStart, app.onStart);
    twice(secondModule.afterStart);
    beforeAll(secondModule.afterStart, app.afterStart);

    // app
    twice(app.beforeStart);
    twice(app.onStart);
    twice(app.afterStart);
  });

  it('runs the reset hooks in correct order when app is stopped', async () => {
    await app.initialize();
    /*
    ENSURE THAT _STOP HOOKS DID NOT RUN UPON INITIALIZATION
    */

    // firstModule
    never(firstModule.beforeReset);
    never(firstModule.onReset);
    never(firstModule.afterReset);

    // secondModule
    never(secondModule.beforeReset);
    never(secondModule.onReset);
    never(secondModule.afterReset);

    // app
    never(app.beforeReset);
    never(app.onReset);
    never(app.afterReset);

    /*
    RESET APPLICATION
    */
    await app.reset();

    /*
    APPLICATION _IS ALREADY IN STOPPED MODE_, THERE IS NO NEED FOR RUNNING STOP
    */
    // firstModule
    never(firstModule.beforeStop);
    never(firstModule.onStop);
    never(firstModule.afterStop);

    // secondModule
    never(secondModule.beforeStop);
    never(secondModule.onStop);
    never(secondModule.afterStop);

    // app
    never(app.beforeStop);
    never(app.onStop);
    never(app.afterStop);

    /*
    APPLICATION AND MODULES ARE RESETTING
    */
    // firstModule
    once(firstModule.beforeReset);
    beforeAll(firstModule.beforeReset, secondModule.beforeReset);
    once(firstModule.onReset);
    beforeAll(firstModule.onReset, secondModule.onReset);
    once(firstModule.afterReset);
    beforeAll(firstModule.afterReset, secondModule.afterReset);

    // secondModule
    once(secondModule.beforeReset);
    beforeAll(secondModule.beforeReset, app.beforeReset);
    once(secondModule.onReset);
    beforeAll(secondModule.onReset, app.onReset);
    once(secondModule.afterReset);
    beforeAll(secondModule.afterReset, app.afterReset);

    // app
    once(app.beforeReset);
    once(app.onReset);
    once(app.afterReset);

    /*
    ENSURE THAT MODULES ARE NOT _STARTING_, SINCE APPLICATION WAS INITIALLY STOPPED
    */
    // firstModule
    never(firstModule.beforeStart);
    never(firstModule.onStart);
    never(firstModule.afterStart);

    // secondModule
    never(secondModule.beforeStart);
    never(secondModule.onStart);
    never(secondModule.afterStart);

    // app
    never(app.beforeStart);
    never(app.onStart);
    never(app.afterStart);
  });
});
