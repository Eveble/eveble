import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { CommandBus } from '../../../src/messaging/command-bus';
import { OneToOneHandlingMixin } from '../../../src/mixins/one-to-one-handling-mixin';
import { HookableMixin } from '../../../src/mixins/hookable-mixin';
import {
  HandlerExistError,
  UnhandleableTypeError,
} from '../../../src/messaging/messaging-errors';
import { define } from '../../../src/decorators/define';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';

chai.use(sinonChai);

describe('CommandBus', function() {
  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command {
    key: string;
  }

  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event {
    key: string;
  }

  it(`extends OneToOneHandlingMixin mixin on prototype chain applied`, () => {
    expect(CommandBus.prototype).to.be.instanceof(OneToOneHandlingMixin);
  });

  it(`extends HookableMixin mixin on prototype chain applied`, () => {
    expect(CommandBus.prototype).to.be.instanceof(HookableMixin);
  });

  describe('construction', () => {
    it('sets handleable type upon construction', () => {
      const commandBus = new CommandBus();
      expect(commandBus.getHandleableTypes()).to.be.eql([Command]);
    });
  });

  describe('handlers registration', () => {
    it('throws UnhandleabeTypeError when provided type is not handleable', () => {
      const commandBus = new CommandBus();
      expect(() => commandBus.registerHandler(MyEvent, sinon.stub())).to.throw(
        UnhandleableTypeError,
        `CommandBus: type must be one of: [Command]; got MyEvent`
      );
    });

    it(`throws HandlerExistError allowing only one handler to be registered for command`, () => {
      const firstHandler = sinon.spy();
      const secondHandler = sinon.spy();

      const commandBus = new CommandBus();
      commandBus.registerHandler(MyCommand, firstHandler);
      expect(() => {
        commandBus.registerHandler(MyCommand, secondHandler);
      }).to.throw(
        HandlerExistError,
        `CommandBus: handler for 'MyCommand' already exists`
      );
    });

    it('allows handlers to be overridden', () => {
      const firstHandler = sinon.spy();
      const secondHandler = sinon.spy();

      const commandBus = new CommandBus();
      commandBus.registerHandler(MyCommand, firstHandler);
      commandBus.registerHandler(MyCommand, secondHandler, true);

      expect(commandBus.getHandler(MyCommand)).to.eql(secondHandler);
    });
  });

  describe('sending commands', () => {
    it('handles command', async () => {
      const handler = sinon.stub();
      const commandBus = new CommandBus();
      commandBus.registerHandler(MyCommand, handler);

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      await commandBus.send(command);
      expect(handler).to.have.been.calledWith(command);
    });

    it('ensures that upon handling command result from handler is returned', async () => {
      const handler = sinon.stub();
      handler.returns('result');
      const commandBus = new CommandBus();
      commandBus.registerHandler(MyCommand, handler);

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      const result = await commandBus.send(command);
      expect(handler).to.have.been.calledWith(command);
      expect(result).to.be.equal('result');
    });

    it('has more expressive api for handling command - send', async () => {
      const handler = sinon.stub();
      handler.returns('result');
      const commandBus = new CommandBus();
      const handle = sinon.spy(commandBus, 'handle');

      commandBus.registerHandler(MyCommand, handler);

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      const result = await commandBus.send(command);
      expect(result).to.be.equal('result');
      expect(handler).to.have.been.calledWithExactly(command);
      expect(handle).to.be.calledOnce;
      expect(handle).to.be.calledWithExactly(command);
    });
  });

  describe('onSend hooks', () => {
    it('calls all hooks when sending a command', async () => {
      const firstHook = sinon.spy();
      const secondHook = sinon.spy();

      const commandBus = new CommandBus();
      commandBus.onSend('first-id', firstHook);
      commandBus.onSend('second-id', secondHook);
      commandBus.registerHandler(MyCommand, sinon.stub());

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      await commandBus.send(command);
      expect(firstHook).to.have.been.calledWithExactly(command);
      expect(secondHook).to.have.been.calledWithExactly(command);
    });
  });
});
