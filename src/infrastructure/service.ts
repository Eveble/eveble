import { classes } from 'polytype';
import { postConstruct, inject, injectable } from 'inversify';
import { EventHandlingMixin } from '../mixins/event-handling-mixin';
import { CommandHandlingTrait } from '../traits/command-handling.trait';
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
    super.class(EventHandlingMixin).initialize();
    super.class(CommandHandlingTrait).initialize();
  }
}

/*
Fix for Inversify getClassPropsAsTargets function that can't resolve parent class constructor
from mixed prototype.
*/
Object.getPrototypeOf(Service.prototype).constructor = Object;
