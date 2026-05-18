import { expect, describe, it, vi } from 'vitest';

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
    expect(derived(CommandBus.prototype, OneToOneHandlingTrait)).toBe(true);
  });

  it(`extends HookableTrait mixin on prototype chain applied`, () => {
    expect(derived(CommandBus.prototype, HookableTrait)).toBe(true);
  });

  describe('construction', () => {
    it('sets handleable type upon construction', () => {
      const commandBus = new CommandBus();
      expect(commandBus.getHandleableTypes()).toEqual([Command]);
    });
  });

  describe('handlers registration', () => {
    it('throws UnhandleabeTypeError when provided type is not handleable', () => {
      const commandBus = new CommandBus();
      expect(() =>
        commandBus.registerHandler(MyEvent as any, vi.fn())
      ).toThrow(
        UnhandleableTypeError,
        `CommandBus: type must be one of: [Command]; got MyEvent`
      );
    });

    it(`throws HandlerExistError allowing only one handler to be registered for command`, () => {
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const commandBus = new CommandBus();
      commandBus.registerHandler(MyCommand, firstHandler);
      expect(() => {
        commandBus.registerHandler(MyCommand, secondHandler);
      }).toThrow(
        HandlerExistError,
        `CommandBus: handler for 'MyCommand' already exists`
      );
    });

    it('allows handlers to be overridden', () => {
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const commandBus = new CommandBus();
      commandBus.registerHandler(MyCommand, firstHandler);
      commandBus.registerHandler(MyCommand, secondHandler, true);

      expect(commandBus.getHandler(MyCommand)).toEqual(secondHandler);
    });
  });

  describe('sending commands', () => {
    it('handles command', async () => {
      const handler = vi.fn();
      const commandBus = new CommandBus();
      commandBus.registerHandler(MyCommand, handler);

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      await commandBus.send(command);
      expect(handler).toHaveBeenCalledWith(command);
    });

    it('ensures that upon handling command result from handler is returned', async () => {
      const handler = vi.fn();
      handler.mockReturnValue('result');
      const commandBus = new CommandBus();
      commandBus.registerHandler(MyCommand, handler);

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      const result = await commandBus.send(command);
      expect(handler).toHaveBeenCalledWith(command);
      expect(result).toBe('result');
    });

    it('has more expressive api for handling command - send', async () => {
      const handler = vi.fn();
      handler.mockReturnValue('result');
      const commandBus = new CommandBus();
      const handle = vi.spyOn(commandBus, "handle");

      commandBus.registerHandler(MyCommand, handler);

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      const result = await commandBus.send(command);
      expect(result).toBe('result');
      expect(handler).toHaveBeenCalledWith(command);
      expect(handle).toHaveBeenCalledTimes(1);
      expect(handle).toHaveBeenCalledWith(command);
    });
  });

  describe('onSend hooks', () => {
    it('calls all hooks when sending a command', async () => {
      const firstHook = vi.fn();
      const secondHook = vi.fn();

      const commandBus = new CommandBus();
      commandBus.onSend('first-id', firstHook);
      commandBus.onSend('second-id', secondHook);
      commandBus.registerHandler(MyCommand, vi.fn());

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      await commandBus.send(command);
      expect(firstHook).toHaveBeenCalledWith(command);
      expect(secondHook).toHaveBeenCalledWith(command);
    });

    it('allows for overriding onSend hook', async () => {
      const firstHook = vi.fn();
      const secondHook = vi.fn();

      const commandBus = new CommandBus();
      commandBus.onSend('my-id', firstHook);
      commandBus.onSend('my-id', secondHook, true);
      commandBus.registerHandler(MyCommand, vi.fn());

      const command = new MyCommand({
        targetId: 'my-target-id',
        key: 'my-string',
      });
      await commandBus.send(command);
      expect(firstHook).to.have.not.been.called;
      expect(secondHook).toHaveBeenCalledWith(command);
    });
  });
});

