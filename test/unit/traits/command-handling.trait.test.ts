import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { Type } from '@eveble/core';
import { derive, derived } from '@traits-ts/core';
import { CommandHandlingTrait } from '../../../src/traits/command-handling.trait';
import { OneToOneHandlingTrait } from '../../../src/traits/one-to-one-handling.trait';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { handle } from '../../../src/annotations/handle';
import { subscribe } from '../../../src/annotations/subscribe';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { UnhandleableTypeError } from '../../../src/messaging/messaging-errors';

chai.use(sinonChai);

describe(`CommandHandlingTrait`, () => {
  let injector: types.Injector;
  let commandBus: any;

  beforeEach(() => {
    commandBus = stubInterface<types.CommandBus>();
    injector = new Injector();
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
  });

  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }

  @Type('MyOtherCommand', { isRegistrable: false })
  class MyOtherCommand extends Command<MyOtherCommand> {
    key: string;
  }

  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  it(`has OneToOneHandlingTrait in composition chain`, () => {
    class TestClass extends derive(CommandHandlingTrait) {}

    expect(derived(TestClass.prototype, OneToOneHandlingTrait)).to.be.true;
  });

  describe('construction', () => {
    it(`initializes with empty handled commands`, () => {
      class MyController extends derive(CommandHandlingTrait) {}

      const controller = new MyController();
      expect(controller.getHandledCommands()).to.be.eql([]);
    });
  });

  describe('initialization', () => {
    it('sets handler for commands with dedicated registration method on initialization', () => {
      class MyController extends derive(CommandHandlingTrait) {
        MyCommand(@handle command: MyCommand): boolean {
          return command.key === 'my-string';
        }

        MyOtherCommand(@handle command: MyOtherCommand): boolean {
          return command.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.registerCommandHandler = sinon.stub();
      injector.injectInto(controller);

      expect(controller.registerCommandHandler).to.be.calledTwice;
      expect(controller.registerCommandHandler).to.be.calledWithExactly(
        MyCommand,
        controller.MyCommand
      );
      expect(controller.registerCommandHandler).to.be.calledWithExactly(
        MyOtherCommand,
        controller.MyOtherCommand
      );
    });

    it('overrides initialize method from OneToOneHandlingTrait thus not initializing event subscriptions mappings', () => {
      class MyController extends derive(CommandHandlingTrait) {
        MyEvent(@subscribe event: MyEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.registerHandler = sinon.stub();
      controller.initialize();
      expect(controller.registerHandler).to.not.be.called;
    });

    it(`throws UnhandleableTypeError upon types not subclassing from Command defined as handlers`, () => {
      class MyController extends derive(CommandHandlingTrait) {
        handles(): Map<types.MessageType<any>, types.Handler> {
          return new Map([[MyEvent, sinon.stub()]]);
        }
      }
      const controller = new MyController();
      expect(() => controller.initialize()).to.throw(
        UnhandleableTypeError,
        `MyController: type must be one of: [Command]; got MyEvent`
      );
    });
  });

  describe('registration', () => {
    it('throws UnhandleableTypeError upon registering non command type', () => {
      class MyController extends derive(CommandHandlingTrait) {}
      const controller = new MyController();
      expect(() => {
        controller.registerCommandHandler(MyEvent as any, sinon.stub());
      }).to.throw(
        UnhandleableTypeError,
        'MyController: type must be one of: [Command]; got MyEvent'
      );
    });

    it(`registers command handler`, () => {
      const handler = sinon.spy();
      class MyController extends derive(CommandHandlingTrait) {}
      const controller = new MyController();
      injector.injectInto(controller);
      controller.registerHandler = sinon.stub();

      controller.registerCommandHandler(MyCommand, handler);
      expect(controller.registerHandler).to.be.calledOnce;
    });

    it(`registers handler on instance with bound handler`, () => {
      const handler = sinon.stub();
      class MyController extends derive(CommandHandlingTrait) {}
      const controller = new MyController();
      const registerHandler = sinon.stub(controller, 'registerHandler');
      injector.injectInto(controller);

      controller.registerCommandHandler(MyCommand, handler);
      expect(registerHandler).to.be.calledOnce;
      expect(registerHandler.args[0][0]).to.be.equal(MyCommand);
      expect(
        Object.create(handler.prototype) instanceof registerHandler.args[0][1]
      ).to.be.true; // Compare bound function to handler function example
      expect(registerHandler.args[0][2]).to.be.false; // Flag shouldOverride set by default to false
    });

    it(`registers handler on CommandBus with bound handler`, () => {
      const handler = sinon.stub();
      class MyController extends derive(CommandHandlingTrait) {}
      const controller = new MyController();
      injector.injectInto(controller);

      controller.registerCommandHandler(MyCommand, handler);
      expect(commandBus.registerHandler).to.be.calledOnce;
      expect(commandBus.registerHandler.args[0][0]).to.be.equal(MyCommand);
      expect(
        Object.create(handler.prototype) instanceof
          commandBus.registerHandler.args[0][1]
      ).to.be.true; // Compare bound function to handler function example
      expect(commandBus.registerHandler.args[0][2]).to.be.false; // Flag shouldOverride set by default to false
    });

    it(`ensures that context of registered handler on CommandBus is bound to instance`, () => {
      commandBus.handlers = new Map();
      commandBus.registerHandler = function (command, handler): void {
        this.handlers.set(command, handler);
      };

      class MyController extends derive(CommandHandlingTrait) {
        dependency: any;

        MyCommand(command: MyCommand): void {
          return this.dependency(command);
        }
      }
      const controller = new MyController();
      controller.dependency = sinon.stub();
      controller.commandBus = commandBus;

      controller.registerCommandHandler(MyCommand, controller.MyCommand);
      const commandInstance = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-key',
      });
      commandBus.handlers.get(MyCommand)(commandInstance);
      expect(controller.dependency).to.be.calledOnce;
      expect(controller.dependency).to.be.calledWithExactly(commandInstance);
    });
  });

  describe('command handling', () => {
    it(`allows to send command through command bus`, async () => {
      class MyController extends derive(CommandHandlingTrait) {}
      const controller = new MyController();
      injector.injectInto(controller);

      const commandInstance = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-key',
      });
      await controller.send(commandInstance);
      expect(commandBus.send).to.be.calledOnce;
      expect(commandBus.send).to.be.calledWithExactly(commandInstance);
    });

    it(`ensures that result is passed back from handler upon sending command`, async () => {
      commandBus.send.returns('result');

      class MyController extends derive(CommandHandlingTrait) {}
      const controller = new MyController();
      injector.injectInto(controller);

      const commandInstance = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-key',
      });
      const result = await controller.send(commandInstance);
      expect(result).to.be.equal('result');
    });
  });
});
