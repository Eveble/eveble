import { classes } from 'polytype';
import { injectable } from '@parisholley/inversify-async';
import { types } from '../types';
import { Command } from '../components/command';
import { OneToOneHandlingMixin } from '../mixins/one-to-one-handling-mixin';
import { HookableMixin } from '../mixins/hookable-mixin';

@injectable()
export class CommandBus extends classes(HookableMixin, OneToOneHandlingMixin)
  implements types.CommandBus {
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
   * Thrown if the handler argument is not a function.
   * @throws {HandlerExistError}
   * Thrown if handler would overridden without explicit call.
   */
  registerHandler(
    commandType: types.MessageableType,
    handler: types.Handler,
    shouldOverride = false
  ): void {
    super.registerHandler(commandType, handler, shouldOverride);
  }

  /**
   * Registers `onSend` callback hook.
   * @param id - Identifier under which `onSend` hook will be defined.
   * @param hook - Function that will be executed upon sending `Command`.
   */
  onSend(id: string, hook: types.Hook): void {
    this.registerHook('onSend', id, hook);
  }

  /**
   * Handles command instance.
   * @async
   * @param commandInstance - An instance of `Command` type.
   * @return Any value returned as a `Promise` from handler.
   */
  async handle(commandInstance: Command): Promise<any> {
    const hooks = this.getHooks('onSend');
    for (const [, hook] of Object.entries(hooks)) {
      await hook(commandInstance);
    }

    const result = await super.handle(commandInstance);
    return result;
  }

  /**
   * @alias handle
   * @async
   */
  async send(commandInstance: Command): Promise<any> {
    const result = await this.handle(commandInstance);
    return result;
  }
}
