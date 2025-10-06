import { postConstruct, inject } from 'inversify';
import { trait } from '@traits-ts/core';
import { OneToOneHandlingTrait } from './one-to-one-handling.trait';
import { types } from '../types';
import { Command } from '../components/command';
import { BINDINGS } from '../constants/bindings';

export const CommandHandlingTrait = trait([OneToOneHandlingTrait], (base) => {
  const klass = class extends base implements types.Sender {
    public commandBus: types.CommandBus;

    /**
     * Initializes CommandHandlingTrait.
     * @remarks
     * By defining handler mappings on metadata with annotations: `@handle`
     * and resolving those mapping with `handles` method - it ensures, that there
     * is no leakage in between inheriting classes.
     */
    public initialize(): void {
      this.setupCommandHandlers();
    }

    /**
     * Setups command handlers.
     */
    public setupCommandHandlers(): void {
      this.setupHandlers({
        handlers: this.handles(),
        registrator: this.registerCommandHandler.bind(this),
        handleableTypes: [Command],
      });
    }

    /**
     * Registers command handler and registers that command on command bus.
     * @param commandType - A `Command` type for which handler mapping will be created.
     * @param handler - Handler function that will executed upon handling type.
     * @param shouldOverride - Flag indicating that handler should be overridden if exist.
     * @remarks
     * Ensure first that handler for command is registrable(i.e. only can
     * handler can exist for specific Command on whole application)
     * @throws {UnhandleableTypeError}
     * Thrown if the type argument is not one of handleable types.
     * @throws {InvalidHandlerError}
     * Thrown if the handler argument is not a function.
     * @throws {HandlerExistError}
     * Thrown if handler would overridden without explicit call.
     */
    public registerCommandHandler(
      commandType: types.MessageType<types.Command>,
      handler: types.Handler,
      shouldOverride = false
    ): void {
      this.ensureHandleability(commandType, [Command]);

      const boundHandler = handler.bind(this);
      boundHandler.original = handler;
      this.commandBus.registerHandler(
        commandType,
        boundHandler,
        shouldOverride
      );
      this.registerHandler(commandType, boundHandler, shouldOverride);
    }

    /**
     * Sends(handles) command instance through command bus.
     * @async
     * @param command - Instance of a `Command` type.
     * @returns Any value that is returned from handler after handling command instance.
     */
    public async send(command: types.Command): Promise<any> {
      const result = await this.commandBus.send(command);
      return result;
    }
  };
  const descriptor = Object.getOwnPropertyDescriptor(
    trait.prototype,
    'initialize'
  );
  // Manually apply @inject decorator for commandBus property
  inject(BINDINGS.CommandBus)(klass.prototype, 'commandBus');

  // Call postConstruct decorator factory, then apply it with all three arguments
  postConstruct()(klass.prototype, 'initialize', descriptor as any);
  return klass;
});
