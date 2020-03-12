import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { Aggregate } from '../../../src/domain/aggregate';
import { Process } from '../../../src/domain/process';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { define } from '../../../src/decorators/define';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { createEJSON } from '../../../src/utils/helpers';
import { InvalidEventSourceableError } from '../../../src/core/core-errors';
import { handle } from '../../../src/annotations/handle';
import { route } from '../../../src/annotations/route';
import { kernel } from '../../../src/core/kernel';
import { Router } from '../../../src/infrastructure/router';
import { initial } from '../../../src/annotations/initial';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Mapping Router with routing provider on Injector`, function() {
  @define('RoutesProvider.MyCommand')
  class MyCommand extends Command {}
  @define('RoutesProvider.MyOtherCommand')
  class MyOtherCommand extends Command {}

  @define('RoutesProvider.MyEvent')
  class MyEvent extends Event {}
  @define('RoutesProvider.MyOtherEvent')
  class MyOtherEvent extends Event {}

  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // Dependencies
  let serializer: types.Serializer;
  let commandBus: types.CommandBus;
  let eventBus: types.EventBus;
  let repository: any;

  const setupInjector = function(): void {
    injector = new Injector();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupEvebleDependencies = function(): void {
    commandBus = new CommandBus();
    eventBus = new EventBus();
    repository = stubInterface<types.EventSourceableRepository>();

    // Serializer
    injector.bind<any>(BINDINGS.EJSON).toConstantValue(createEJSON());
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .to(EJSONSerializerAdapter)
      .inSingletonScope();
    // Busses
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    // Repositories
    injector
      .bind<types.EventSourceableRepository>(BINDINGS.EventSourceableRepository)
      .toConstantValue(repository);
    // Bind the router constructor on the Injector, since pointing directly to
    // the class would create layer-concern intersection
    injector.bind<types.RouterType>(BINDINGS.Router).toConstantValue(Router);
    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
  };

  const setupTypes = function(): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  beforeEach(async () => {
    setupInjector();
    setupEvebleDependencies();
    setupTypes();
  });

  describe(`routes aggregate`, () => {
    it(`throws InvalidEventSourceableError if argument mapped is not an aggregate`, () => {
      class NotAnAggregate {}
      expect(() =>
        injector.bind<types.Router>('MyRouter').toRoute(NotAnAggregate as any)
      ).to.throw(
        InvalidEventSourceableError,
        `Injector: expected EventSourceableType to be constructor type of EventSourceable, got NotAnAggregate`
      );
    });

    it(`creates router for aggregate with initializing message`, async () => {
      class MyAggregate extends Aggregate {
        MyCommand(@initial _command: MyCommand): void {
          return undefined;
        }

        MyOtherCommand(@handle _command: MyOtherCommand): void {
          return undefined;
        }
      }
      injector.bind<types.Router>('MyRouter').toRoute(MyAggregate);
      const router = injector.get<types.Router>('MyRouter');
      expect(router.InitializingMessageType).to.be.equal(MyCommand);
      expect(router.routedCommands).to.be.eql([]);
    });

    it(`create router for aggregate with routed commands`, async () => {
      class MyAggregate extends Aggregate {
        MyCommand(@initial _command: MyCommand): void {
          return undefined;
        }

        MyOtherCommand(@route _command: MyOtherCommand): void {
          return undefined;
        }
      }
      injector.bind<types.Router>('MyRouter').toRoute(MyAggregate);
      const router = injector.get<types.Router>('MyRouter');
      expect(router.InitializingMessageType).to.be.equal(MyCommand);
      expect(router.routedCommands).to.be.eql([MyOtherCommand]);
    });
  });

  describe(`routes process`, () => {
    it(`throws InvalidEventSourceableError if argument mapped is not an process`, () => {
      class NotAProcess {}
      expect(() =>
        injector.bind<types.Router>('MyRouter').toRoute(NotAProcess as any)
      ).to.throw(
        InvalidEventSourceableError,
        `Injector: expected EventSourceableType to be constructor type of EventSourceable, got NotAProcess`
      );
    });

    it(`creates router for process with initializing message`, async () => {
      class MyProcess extends Process {
        MyCommand(@initial _command: MyCommand): void {
          return undefined;
        }

        MyOtherCommand(@handle _command: MyOtherCommand): void {
          return undefined;
        }
      }
      injector.bind<types.Router>('MyRouter').toRoute(MyProcess);
      const MyRouter = injector.get<types.Router>('MyRouter');
      expect(MyRouter.InitializingMessageType).to.be.equal(MyCommand);
      expect(MyRouter.routedCommands).to.be.eql([]);
    });

    it(`create router for process with routed commands`, async () => {
      class MyProcess extends Process {
        MyCommand(@initial _command: MyCommand): void {
          return undefined;
        }

        MyOtherCommand(@route _command: MyOtherCommand): void {
          return undefined;
        }
      }
      injector.bind<types.Router>('MyRouter').toRoute(MyProcess);
      const MyRouter = injector.get<types.Router>('MyRouter');
      expect(MyRouter.InitializingMessageType).to.be.equal(MyCommand);
      expect(MyRouter.routedCommands).to.be.eql([MyOtherCommand]);
    });

    it(`create router for process with routed events`, async () => {
      class MyProcess extends Process {
        MyCommand(@initial _command: MyCommand): void {
          return undefined;
        }

        MyOtherCommand(@route _command: MyOtherCommand): void {
          return undefined;
        }

        MyEvent(@route _event: MyEvent): void {
          return undefined;
        }

        MyOtherEvent(@route _event: MyOtherEvent): void {
          return undefined;
        }
      }
      injector.bind<types.Router>('MyRouter').toRoute(MyProcess);
      const MyRouter = injector.get<types.Router>('MyRouter');
      expect(MyRouter.InitializingMessageType).to.be.equal(MyCommand);
      expect(MyRouter.routedCommands).to.be.eql([MyOtherCommand]);
      expect(MyRouter.routedEvents).to.be.eql([MyEvent, MyOtherEvent]);
    });
  });
});
