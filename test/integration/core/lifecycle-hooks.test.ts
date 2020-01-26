import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { BaseModule } from '../../../src/core/base-module';
import { BaseApp } from '../../../src/core/base-app';
import { types } from '../../../src/types';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('app lifecycle hooks', function() {
  // ================================= TEST HELPERS ================================= //

  const createLifeCycleHookSpies = function(): Record<string, Function> {
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
      hooks[hookName] = sinon.spy();
    }
    return hooks;
  };

  class StubbedModule extends BaseModule {
    beforeInitialize(): any {}

    onInitialize(): any {}

    afterInitialize(): any {}

    beforeStart(): any {}

    onStart(): any {}

    afterStart(): any {}

    beforeStop(): any {}

    onStop(): any {}

    afterStop(): any {}

    beforeReset(): any {}

    onReset(): any {}

    afterReset(): any {}

    beforeShutdown(): any {}

    onShutdown(): any {}

    afterShutdown(): any {}
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

    beforeInitialize(): any {}

    onInitialize(): any {}

    afterInitialize(): any {}

    beforeStart(): any {}

    onStart(): any {}

    afterStart(): any {}

    beforeStop(): any {}

    onStop(): any {}

    afterStop(): any {}

    beforeReset(): any {}

    onReset(): any {}

    afterReset(): any {}

    beforeShutdown(): any {}

    onShutdown(): any {}

    afterShutdown(): any {}
  }

  let firstModule: any;
  let secondModule: any;
  let app: any;

  beforeEach(() => {
    firstModule = new FirstModule({});
    secondModule = new SecondModule({
      modules: [firstModule],
    });

    app = new MyApp({ modules: [secondModule] });
  });

  // Readability and 'understanding' is archived by writing expectations manually with use of few letter helpers to not clutter tests with full blown expectation statements.
  const never = function(hook): void {
    expect(hook).not.to.have.been.called;
  };

  const once = function(hook): void {
    expect(hook).to.have.been.calledOnce;
  };

  const twice = function(hook): void {
    expect(hook).to.have.been.calledTwice;
  };

  const before = function(firstHook, secondHook): void {
    expect(firstHook).to.have.been.to.have.been.calledBefore(secondHook);
  };

  it('runs the initialize hooks in correct order when application is constructed', async () => {
    await app.initialize();

    // firstModule
    once(firstModule.beforeInitialize);
    before(firstModule.beforeInitialize, secondModule.beforeInitialize);
    once(firstModule.onInitialize);
    once(firstModule.afterInitialize);
    before(firstModule.afterInitialize, secondModule.afterInitialize);
    // secondModule
    once(secondModule.beforeInitialize);
    before(secondModule.beforeInitialize, app.beforeInitialize);
    once(secondModule.onInitialize);
    once(secondModule.afterInitialize);
    before(secondModule.afterInitialize, app.afterInitialize);
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
    before(firstModule.beforeStart, secondModule.beforeStart);
    once(firstModule.onStart);
    before(firstModule.onStart, secondModule.onStart);
    once(firstModule.afterStart);
    before(firstModule.afterStart, secondModule.afterStart);

    // secondModule
    once(secondModule.beforeStart);
    before(secondModule.beforeStart, app.beforeStart);
    once(secondModule.onStart);
    before(secondModule.onStart, app.onStart);
    once(secondModule.afterStart);
    before(secondModule.afterStart, app.afterStart);
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
    before(firstModule.beforeStop, secondModule.beforeStop);
    once(firstModule.onStop);
    before(firstModule.onStop, secondModule.onStop);
    once(firstModule.afterStop);
    before(firstModule.afterStop, secondModule.afterStop);

    // secondModule
    once(secondModule.beforeStop);
    before(secondModule.beforeStop, app.beforeStop);
    once(secondModule.onStop);
    before(secondModule.onStop, app.onStop);
    once(secondModule.afterStop);
    before(secondModule.afterStop, app.afterStop);

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
    before(firstModule.beforeShutdown, secondModule.beforeShutdown);
    once(firstModule.onShutdown);
    before(firstModule.onShutdown, secondModule.onShutdown);
    once(firstModule.afterShutdown);
    before(firstModule.afterShutdown, secondModule.afterShutdown);

    // secondModule
    once(secondModule.beforeShutdown);
    before(secondModule.beforeShutdown, app.beforeShutdown);
    once(secondModule.onShutdown);
    before(secondModule.onShutdown, app.onShutdown);
    once(secondModule.afterShutdown);
    before(secondModule.afterShutdown, app.afterShutdown);

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
    before(firstModule.beforeStop, secondModule.beforeStop);
    once(firstModule.onStop);
    before(firstModule.onStop, secondModule.onStop);
    once(firstModule.afterStop);
    before(firstModule.afterStop, secondModule.afterStop);

    // secondModule
    once(secondModule.beforeStop);
    before(secondModule.beforeStop, app.beforeStop);
    once(secondModule.onStop);
    before(secondModule.onStop, app.onStop);
    once(secondModule.afterStop);
    before(secondModule.afterStop, app.afterStop);

    // app
    once(app.beforeStop);
    once(app.onStop);
    once(app.afterStop);

    /*
    APPLICATION AND MODULES THEN ARE RESETTING
    */
    // firstModule
    once(firstModule.beforeReset);
    before(firstModule.beforeReset, secondModule.beforeReset);
    once(firstModule.onReset);
    before(firstModule.onReset, secondModule.onReset);
    once(firstModule.afterReset);
    before(firstModule.afterReset, secondModule.afterReset);

    // secondModule
    once(secondModule.beforeReset);
    before(secondModule.beforeReset, app.beforeReset);
    once(secondModule.onReset);
    before(secondModule.onReset, app.onReset);
    once(secondModule.afterReset);
    before(secondModule.afterReset, app.afterReset);

    // app
    once(app.beforeReset);
    once(app.onReset);
    once(app.afterReset);

    /*
    APPLICATION AND MODULES THEN ARE _AGAIN_ STARTING FOR SECOND TIME
    */
    // firstModule
    twice(firstModule.beforeStart);
    before(firstModule.beforeStart, secondModule.beforeStart);
    twice(firstModule.onStart);
    before(firstModule.onStart, secondModule.onStart);
    twice(firstModule.afterStart);
    before(firstModule.afterStart, secondModule.afterStart);

    // secondModule
    twice(secondModule.beforeStart);
    before(secondModule.beforeStart, app.beforeStart);
    twice(secondModule.onStart);
    before(secondModule.onStart, app.onStart);
    twice(secondModule.afterStart);
    before(secondModule.afterStart, app.afterStart);

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
    before(firstModule.beforeReset, secondModule.beforeReset);
    once(firstModule.onReset);
    before(firstModule.onReset, secondModule.onReset);
    once(firstModule.afterReset);
    before(firstModule.afterReset, secondModule.afterReset);

    // secondModule
    once(secondModule.beforeReset);
    before(secondModule.beforeReset, app.beforeReset);
    once(secondModule.onReset);
    before(secondModule.onReset, app.onReset);
    once(secondModule.afterReset);
    before(secondModule.afterReset, app.afterReset);

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
