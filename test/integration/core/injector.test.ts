import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { injectable, inject, postConstruct, unmanaged } from 'inversify';
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
    class Ninja {
      @inject(NINJA_BINDINGS.Katana)
      public katana: Katana;

      @inject(NINJA_BINDINGS.Shuriken)
      public shuriken: Shuriken;

      public name: string;

      // Mark the 'name' parameter as unmanaged since it's not injected by container
      public constructor(@unmanaged() name: string) {
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
      class FirstSingleton {}
      @injectable()
      class SecondSingleton {}

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
      class FirstSingleton {}
      @injectable()
      class SecondSingleton {}

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
      class FirstSingleton {}
      @injectable()
      class SecondSingleton {}

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
      class TransientScope {}
      @injectable()
      class RequestScope {}
      @injectable()
      class ConstantValue {}
      @injectable()
      class Singleton {}

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
      class First {}
      @injectable()
      class Second {}
      @injectable()
      class Third {}

      const injector = new Injector();
      injector.bind<Third>('3').to(Third).inSingletonScope();
      injector.bind<First>('1').to(First).inSingletonScope();
      injector.bind<Second>('2').to(Second).inSingletonScope();

      expect(injector.findByScope('Singleton')).to.be.eql(['3', '1', '2']);
    });
  });

  // describe('v7 inversify test', () => {
  //   it('internal structure diagnostics', () => {
  //     @injectable()
  //     class TestService {}

  //     const container = new Container();
  //     container
  //       .bind<TestService>('TestService')
  //       .to(TestService)
  //       .inSingletonScope();

  //     // Diagnostic function to explore internal structure
  //     function exploreContainerStructure(container: any) {
  //       console.log('\n=== CONTAINER INTERNAL STRUCTURE ===\n');

  //       // Check own properties (enumerable)
  //       const keys = Object.keys(container);
  //       console.log('Enumerable own properties:', keys);

  //       // Check ALL own properties (including non-enumerable)
  //       const allKeys = Object.getOwnPropertyNames(container);
  //       console.log('All own properties (including non-enumerable):', allKeys);

  //       // Check Symbol properties
  //       const symbolKeys = Object.getOwnPropertySymbols(container);
  //       console.log(
  //         'Symbol properties:',
  //         symbolKeys.map((s) => s.toString())
  //       );

  //       // Try to access common private field patterns
  //       const privatePatterns = [
  //         '#bindings',
  //         '#bindingDictionary',
  //         '#moduleActivationStore',
  //         '_bindings',
  //         '_bindingDictionary',
  //         '_moduleActivationStore',
  //         'bindings',
  //         'bindingDictionary',
  //         'moduleActivationStore',
  //       ];

  //       console.log('\n=== CHECKING PRIVATE FIELD PATTERNS ===\n');
  //       for (const pattern of privatePatterns) {
  //         try {
  //           const value = (container as any)[pattern];
  //           if (value !== undefined) {
  //             console.log(`✓ Found: ${pattern}`, typeof value);
  //             if (value instanceof Map) {
  //               console.log(`  -> Map with ${value.size} entries`);
  //             }
  //           }
  //         } catch (e) {
  //           // Ignore
  //         }
  //       }

  //       // Check prototype chain
  //       console.log('\n=== PROTOTYPE CHAIN ===\n');
  //       let proto = Object.getPrototypeOf(container);
  //       let depth = 0;
  //       while (proto && depth < 5) {
  //         console.log(`Prototype level ${depth}:`, proto.constructor.name);
  //         const protoKeys = Object.getOwnPropertyNames(proto);
  //         console.log(
  //           `  Properties:`,
  //           protoKeys.filter((k) => k !== 'constructor')
  //         );
  //         proto = Object.getPrototypeOf(proto);
  //         depth++;
  //       }

  //       // Try to call container methods to inspect
  //       console.log('\n=== CONTAINER METHODS ===\n');
  //       const methodNames = Object.getOwnPropertyNames(
  //         Object.getPrototypeOf(container)
  //       ).filter((name) => typeof (container as any)[name] === 'function');
  //       console.log('Available methods:', methodNames);

  //       // Check if there's a method to get bindings
  //       const bindingMethods = methodNames.filter(
  //         (m) =>
  //           m.toLowerCase().includes('bind') ||
  //           m.toLowerCase().includes('get') ||
  //           m.toLowerCase().includes('all')
  //       );
  //       console.log('Binding-related methods:', bindingMethods);
  //     }

  //     exploreContainerStructure(container);

  //     // Try to inspect the binding after it's created
  //     console.log('\n=== INSPECTING BINDING RESULT ===\n');

  //     const binding = container
  //       .bind('AnotherTest')
  //       .toConstantValue('test-value');
  //     console.log('Binding result type:', typeof binding);
  //     console.log('Binding result:', binding);
  //     console.log('Binding properties:', Object.getOwnPropertyNames(binding));

  //     // Try alternative: inspect container after multiple bindings
  //     console.log('\n=== TESTING WITH MULTIPLE BINDINGS ===\n');

  //     @injectable()
  //     class Service1 {}

  //     @injectable()
  //     class Service2 {}

  //     const testContainer = new Container();
  //     testContainer.bind('Service1').to(Service1).inSingletonScope();
  //     testContainer.bind('Service2').to(Service2).inTransientScope();

  //     // Deep dive into container structure
  //     console.log('Container constructor:', testContainer.constructor.name);
  //     console.log('Container toString:', testContainer.toString());

  //     // Try to access via descriptor
  //     const descriptors = Object.getOwnPropertyDescriptors(testContainer);
  //     console.log('\nProperty descriptors:', Object.keys(descriptors));

  //     for (const [key, descriptor] of Object.entries(descriptors)) {
  //       console.log(`\n${key}:`);
  //       console.log('  configurable:', descriptor.configurable);
  //       console.log('  enumerable:', descriptor.enumerable);
  //       console.log('  writable:', descriptor.writable);
  //       if (descriptor.value !== undefined) {
  //         console.log('  value type:', typeof descriptor.value);
  //         if (descriptor.value instanceof Map) {
  //           console.log('  -> Is Map with size:', descriptor.value.size);
  //         }
  //       }
  //       if (descriptor.get) {
  //         console.log('  -> Has getter');
  //         try {
  //           const value = descriptor.get.call(testContainer);
  //           console.log('  -> Getter returns:', typeof value);
  //           if (value instanceof Map) {
  //             console.log('  -> Map with size:', value.size);
  //             console.log('  -> Map keys:', Array.from(value.keys()));
  //           }
  //         } catch (e) {
  //           console.log('  -> Getter error:', (e as Error).message);
  //         }
  //       }
  //     }

  //     // Last resort: check if we can iterate or inspect any way
  //     console.log('\n=== CHECKING FOR PUBLIC API ===\n');

  //     // Check if container has methods like getAll, isBound, etc.
  //     const publicMethods = [
  //       'isBound',
  //       'get',
  //       'getAll',
  //       'getAllAsync',
  //       'getAsync',
  //       'unbind',
  //       'unbindAll',
  //       'resolve',
  //     ];

  //     for (const method of publicMethods) {
  //       if (typeof (testContainer as any)[method] === 'function') {
  //         console.log(`✓ Has method: ${method}`);
  //       }
  //     }

  //     // Try to see if we can get binding info through isBound
  //     console.log('\nisBound("Service1"):', testContainer.isBound('Service1'));
  //     console.log('isBound("Service2"):', testContainer.isBound('Service2'));
  //     console.log(
  //       'isBound("NonExistent"):',
  //       testContainer.isBound('NonExistent')
  //     );
  //   });
  // });
});
