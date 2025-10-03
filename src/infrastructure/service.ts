import { classes } from 'polytype';
import { postConstruct, inject, injectable } from 'inversify';
import { CommandHandlingTrait } from '../traits/command-handling.trait';
import { EventHandlingTrait } from '../traits/event-handling.trait';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';

@injectable()
export class Service extends classes(CommandHandlingTrait, EventHandlingTrait) {
  @inject(BINDINGS.CommandBus)
  public commandBus: types.CommandBus;

  @inject(BINDINGS.EventBus)
  public eventBus: types.EventBus;

  /**
   * Initializes Service.
   */
  @postConstruct()
  public initialize(): void {
    super.class(CommandHandlingTrait).initialize();
    super.class(EventHandlingTrait).initialize();
  }
}

/*
Fix for Inversify getClassPropsAsTargets function that can't resolve parent class constructor
from mixed prototype.
*/
Object.getPrototypeOf(Service.prototype).constructor = Object;
