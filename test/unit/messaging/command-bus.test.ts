import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Type } from '@eveble/core';
import { derived } from '@traits-ts/core';
import { CommandBus } from '../../../src/messaging/command-bus';
import {
  HandlerExistError,
  UnhandleableTypeError,
} from '../../../src/messaging/messaging-errors';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { OneToOneHandlingTrait } from '../../../src/traits/one-to-one-handling.trait';
import { HookableTrait } from '../../../src/traits/hookable.trait';

chai.use(sinonChai);

describe('CommandBus', () => {
  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }

  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  it(`extends OneToOneHandlingTrait mixin on prototype chain applied`, () => {
    expect(derived(CommandBus.prototype, OneToOneHandlingTrait)).to.be.true;
  });

  it(`extends HookableTrait mixin on prototype chain applied`, () => {
    expect(derived(CommandBus.prototype, HookableTrait)).to.be.true;
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
      expect(() =>
        commandBus.registerHandler(MyEvent as any, sinon.stub())
      ).to.throw(
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

    it('allows for overriding onSend hook', async () => {
      const firstHook = sinon.spy();
      const secondHook = sinon.spy();

      const commandBus = new CommandBus();
      commandBus.onSend('my-id', firstHook);
      commandBus.onSend('my-id', secondHook, true);
      commandBus.registerHandler(MyCommand, sinon.stub());

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      await commandBus.send(command);
      expect(firstHook).to.have.not.been.called;
      expect(secondHook).to.have.been.calledWithExactly(command);
    });
  });
});
