import { classes } from 'polytype';
import { injectable } from 'inversify';
import { types } from '../types';
import { Command } from '../components/command';
import { OneToOneHandlingMixin } from '../mixins/one-to-one-handling-mixin';
import { HookableTrait } from '../traits/hookable.trait';

@injectable()
export class CommandBus
  extends classes(HookableTrait, OneToOneHandlingMixin)
  implements types.CommandBus
{
  /**
   * Creates an instance of CommandBus.
   */
  constructor() {
    super();
    this.setHandleableTypes([Command]);
  }

  /**
   * Registers command handler.
   * @param commandType - A subclass of `Command` type.
   * @param handler - Handler function that will executed upon handling type.
   * @param shouldOverride - Flag indicating that handler should be overridden if exist.
   * @throws {UnhandleableTypeError}
   * Thrown if the type argument is not subclass of `Command` type.
   * @throws {InvalidHandlerError}
   * Thrown if the handler argument is not a function.r
   * @throws {HandlerExistError}
   * Thrown if handler would overridden without explicit call.
   */
  registerHandler(
    commandType: types.MessageType<types.Command>,
    handler: types.Handler,
    shouldOverride = false
  ): void {
    super.registerHandler(commandType, handler, shouldOverride);
  }

  /**
   * Registers `onSend` callback hook.
   * @param id - Identifier under which `onSend` hook will be defined.
   * @param hook - Function that will be executed upon sending `Command`.
   * @param shouldOverride - Flag indicating that hook should be overridden if exist.
   */
  onSend(id: string, hook: types.Hook, shouldOverride = false): void {
    this.registerHook('onSend', id, hook, shouldOverride);
  }

  /**
   * Handles command instance.
   * @async
   * @param command - An instance of `Command` type.
   * @return Any value returned as a `Promise` from handler.
   */
  async handle(command: types.Command): Promise<any> {
    const hooks = this.getHooks('onSend');
    for (const [, hook] of Object.entries(hooks)) {
      await hook(command);
    }

    const result = await super.handle(command);
    return result;
  }

  /**
   * @alias handle
   * @async
   */
  async send(command: types.Command): Promise<any> {
    const result = await this.handle(command);
    return result;
  }
}

/*
Fix for Inversify getClassPropsAsTargets function that can't resolve parent class constructor
from mixed prototype.
*/
Object.getPrototypeOf(CommandBus.prototype).constructor = Object;
