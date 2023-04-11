import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import {
  injectable,
  inject,
  postConstruct,
} from '@parisholley/inversify-async';
import sinon from 'sinon';
import delay from 'delay';
import { stubInterface } from 'ts-sinon';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';

chai.use(sinonChai);

describe(`Injector`, () => {
  let initialize;

  beforeEach(() => {
    initialize = sinon.stub();
  });

  describe('routing event sourceables', () => {
    let initializingMessageType: any;
    let commands: any;
    let events: any;
    let MyEventSourceable: any;

    beforeEach(() => {
      initializingMessageType = sinon.stub();
      commands = sinon.stub();
      events = sinon.stub();

      MyEventSourceable = stubInterface<types.EventSourceableType>();
      MyEventSourceable.resolveInitializingMessage.returns(
        initializingMessageType
      );
      MyEventSourceable.resolveRoutedCommands.returns(commands as any);
      MyEventSourceable.resolveRoutedEvents.returns(events as any);
    });

    it('allows to route event sourceable', () => {
      const routerCnstrSpy = sinon.spy();

      class Router implements types.Router {
        EventSourceableType: types.EventSourceableType;

        InitializingMessageType: types.MessageType<types.Command | types.Event>;

        routedCommands: types.MessageType<types.Command>[];

        routedEvents: types.MessageType<types.Event>[];

        constructor(
          EventSourceableType?: types.EventSourceableType,
          InitializingMessageType?: types.MessageType<
            types.Command | types.Event
          >,
          routedCommands?: types.MessageType<types.Command>[],
          routedEvents?: types.MessageType<types.Event>[]
        ) {
          routerCnstrSpy(
            EventSourceableType,
            InitializingMessageType,
            routedCommands,
            routedEvents
          );
        }

        @postConstruct()
        initialize(): void {
          return undefined;
        }

        setupCommandHandler(
          _CommandType: types.MessageType<types.Command>
        ): void {
          return undefined;
        }

        setupEventHandler(_EventType: types.MessageType<types.Event>) {
          return undefined;
        }
      }

      const injector = new Injector();
      injector.bind<types.RouterType>(BINDINGS.Router).toConstantValue(Router);

      injector
        .bind<types.Router>('MyEventSourceable')
        .toRoute(MyEventSourceable);
      expect(routerCnstrSpy).to.be.calledOnce;
      expect(routerCnstrSpy).to.be.calledWithExactly(
        MyEventSourceable,
        initializingMessageType,
        commands,
        events
      );
    });

    it('ensures that router is initialized', () => {
      const initializeSpy = sinon.spy();
      class Router implements types.Router {
        @inject(BINDINGS.log)
        protected log: types.Logger;

        EventSourceableType: types.EventSourceableType;

        InitializingMessageType: types.MessageType<types.Command | types.Event>;

        routedCommands: types.MessageType<types.Command>[];

        routedEvents: types.MessageType<types.Event>[];

        @postConstruct()
        initialize(): void {
          initializeSpy();
        }

        setupCommandHandler(
          _CommandType: types.MessageType<types.Command>
        ): void {
          return undefined;
        }

        setupEventHandler(_EventType: types.MessageType<types.Event>) {
          return undefined;
        }
      }

      const injector = new Injector();
      const log = stubInterface<types.Logger>();
      injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
      injector.bind<types.RouterType>(BINDINGS.Router).toConstantValue(Router);

      injector
        .bind<types.Router>('MyEventSourceable')
        .toRoute(MyEventSourceable);
      expect(initializeSpy).to.be.calledOnce;
    });

    it('ensures that dependencies are injected to router', () => {
      class Router implements types.Router {
        @inject(BINDINGS.log)
        protected log: types.Logger;

        EventSourceableType: types.EventSourceableType;

        InitializingMessageType: types.MessageType<types.Command | types.Event>;

        routedCommands: types.MessageType<types.Command>[];

        routedEvents: types.MessageType<types.Event>[];

        @postConstruct()
        initialize(): void {
          this.log.debug('my-message');
        }

        setupCommandHandler(
          _CommandType: types.MessageType<types.Command>
        ): void {
          return undefined;
        }

        setupEventHandler(_EventType: types.MessageType<types.Event>) {
          return undefined;
        }
      }

      const injector = new Injector();
      const log = stubInterface<types.Logger>();
      injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
      injector.bind<types.RouterType>(BINDINGS.Router).toConstantValue(Router);

      injector
        .bind<types.Router>('MyEventSourceable')
        .toRoute(MyEventSourceable);
      expect(log.debug).to.be.calledOnce;
      expect(log.debug).to.be.calledWithExactly('my-message');
    });
  });

  it(`injects synchronously dependencies from IoC container to existing value`, () => {
    interface Ninja {
      fight(): string;
      sneak(): string;
    }

    interface Katana {
      hit(): string;
    }

    interface Shuriken {
      throw(): string;
    }

    @injectable()
    class Katana implements Katana {
      public hit(): string {
        return 'cut!';
      }
    }

    @injectable()
    class Shuriken implements Shuriken {
      public throw(): string {
        return 'hit!';
      }
    }

    const NINJA_BINDINGS = {
      Katana: Symbol.for('Katana'),
      Shuriken: Symbol.for('Shuriken'),
    };

    @injectable()
    class Ninja implements Ninja {
      @inject(NINJA_BINDINGS.Katana)
      public katana: Katana;

      @inject(NINJA_BINDINGS.Shuriken)
      public shuriken: Shuriken;

      public name: string;

      public constructor(name: string) {
        this.name = name;
      }

      @postConstruct()
      public initialize(): void {
        initialize(this);
      }

      public fight(): string {
        return this.katana.hit();
      }

      public sneak(): string {
        return this.shuriken.throw();
      }
    }
    const injector = new Injector();
    injector.bind<Ninja>('Ninja').to(Ninja);
    injector.bind<Katana>(NINJA_BINDINGS.Katana).to(Katana);
    injector.bind<Shuriken>(NINJA_BINDINGS.Shuriken).to(Shuriken);

    const name = 'Naruto Uzumaki';
    const ninja = new Ninja(name);
    injector.injectInto(ninja);

    expect(ninja.name).to.be.equal(name);
    expect(ninja.katana).to.be.instanceof(Katana);
    expect(ninja.shuriken).to.be.instanceof(Shuriken);
    expect(ninja.sneak()).to.be.equal('hit!');
    expect(ninja.fight()).to.be.equal('cut!');
    expect(initialize).to.be.calledOnce;
    expect(initialize).to.be.calledOnceWithExactly(ninja);
  });

  it(`injects asynchronously injects dependencies from IoC container to existing value`, async () => {
    const before = sinon.stub();
    const after = sinon.stub();

    @injectable()
    class Transport {
      @postConstruct()
      async initialize(): Promise<void> {
        initialize('transport');
        before();
        await delay(50);
        after();
      }
    }
    @injectable()
    class Logger {
      @inject('Transport')
      public transport: Transport;

      public id: string;

      constructor(id: string) {
        this.id = id;
      }
    }

    const injector = new Injector();
    injector.bind<Transport>('Transport').to(Transport);

    const id = 'my-id';
    const logger = new Logger(id);
    await injector.injectIntoAsync(logger);

    expect(logger.id).to.be.equal(id);
    expect(logger.transport).to.be.instanceof(Transport);
    expect(initialize).to.be.calledOnce;
    expect(initialize).to.be.calledWithExactly('transport');
    expect(before).to.be.calledBefore(after);
    expect(after).to.be.calledAfter(before);
  });

  it('ensures that synchronous post construct method is executed even if there value is not dependent on other dependencies', () => {
    const initializeSpy = sinon.spy();
    class MyClass {
      @postConstruct()
      initialize(): void {
        initializeSpy();
      }
    }
    const instance = new MyClass();
    const injector = new Injector();
    injector.injectInto(instance);
    expect(initializeSpy).to.be.calledOnce;
  });

  it('ensures that asynchronous post construct method is executed even if there value is not dependent on other dependencies', async () => {
    const initializeSpy = sinon.spy();
    class MyClass {
      @postConstruct()
      initailize(): void {
        initializeSpy();
      }
    }
    const instance = new MyClass();
    const injector = new Injector();
    await injector.injectIntoAsync(instance);
    expect(initializeSpy).to.be.calledOnce;
  });

  describe('bindings', () => {
    it('returns service identifiers as a string matching singleton scope', () => {
      @injectable()
      class FirstSingleton { }
      @injectable()
      class SecondSingleton { }

      const injector = new Injector();
      injector
        .bind<FirstSingleton>('FirstSingleton')
        .to(FirstSingleton)
        .inSingletonScope();
      injector
        .bind<SecondSingleton>('SecondSingleton')
        .to(SecondSingleton)
        .inSingletonScope();

      expect(injector.findByScope('Singleton')).to.be.eql([
        'FirstSingleton',
        'SecondSingleton',
      ]);
    });

    it('returns service identifiers as a string matching singleton scope', () => {
      @injectable()
      class FirstSingleton { }
      @injectable()
      class SecondSingleton { }

      const injector = new Injector();
      injector
        .bind<FirstSingleton>('FirstSingleton')
        .to(FirstSingleton)
        .inSingletonScope();
      injector
        .bind<SecondSingleton>('SecondSingleton')
        .to(SecondSingleton)
        .inSingletonScope();

      expect(injector.findByScope('Singleton')).to.be.eql([
        'FirstSingleton',
        'SecondSingleton',
      ]);
    });

    it('returns service identifiers as a symbol matching singleton scope', () => {
      @injectable()
      class FirstSingleton { }
      @injectable()
      class SecondSingleton { }

      const first = Symbol.for('FirstSingleton');
      const second = Symbol.for('SecondSingleton');

      const injector = new Injector();
      injector
        .bind<FirstSingleton>(first)
        .to(FirstSingleton)
        .inSingletonScope();
      injector
        .bind<SecondSingleton>(second)
        .to(SecondSingleton)
        .inSingletonScope();

      expect(injector.findByScope('Singleton')).to.be.eql([first, second]);
    });

    it('returns service identifiers only matching provided scope', () => {
      @injectable()
      class TransientScope { }
      @injectable()
      class RequestScope { }
      @injectable()
      class ConstantValue { }
      @injectable()
      class Singleton { }

      const injector = new Injector();
      injector
        .bind<TransientScope>('TransientScope')
        .to(TransientScope)
        .inTransientScope();
      injector
        .bind<RequestScope>('RequestScope')
        .to(RequestScope)
        .inRequestScope();
      injector.bind<any>('ConstantValue').toConstantValue(ConstantValue);
      injector
        .bind<Singleton>('SingletonScope')
        .to(Singleton)
        .inSingletonScope();

      expect(injector.findByScope('Singleton')).to.be.eql(['SingletonScope']);
      expect(injector.findByScope('Transient')).to.be.eql([
        'TransientScope',
        'ConstantValue',
      ]);
      expect(injector.findByScope('Request')).to.be.eql(['RequestScope']);
    });

    it('ensure that order of resolved service identifiers is consistent with the order of bindings', () => {
      @injectable()
      class First { }
      @injectable()
      class Second { }
      @injectable()
      class Third { }

      const injector = new Injector();
      injector.bind<Third>('3').to(Third).inSingletonScope();
      injector.bind<First>('1').to(First).inSingletonScope();
      injector.bind<Second>('2').to(Second).inSingletonScope();

      expect(injector.findByScope('Singleton')).to.be.eql(['3', '1', '2']);
    });
  });
});
