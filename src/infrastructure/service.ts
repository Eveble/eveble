import { inject, injectable, postConstruct } from 'inversify';
import { derive } from '@traits-ts/core';
import { CommandHandlingTrait } from '../traits/command-handling.trait';
import { EventHandlingTrait } from '../traits/event-handling.trait';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';

@injectable()
export class Service extends derive(CommandHandlingTrait, EventHandlingTrait) {
  @inject(BINDINGS.CommandBus)
  public commandBus: types.CommandBus;

  @inject(BINDINGS.EventBus)
  public eventBus: types.EventBus;

  /**
   * Initializes Service.
   */
  @postConstruct()
  public initialize(): void {
    this.setupCommandHandlers();
    this.setupEventHandlers();
  }
}
