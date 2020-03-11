import { classes } from 'polytype';
import {
  postConstruct,
  inject,
  injectable,
} from '@parisholley/inversify-async';
import { CommandHandlingMixin } from '../mixins/command-handling-mixin';
import { EventHandlingMixin } from '../mixins/event-handling-mixin';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';

@injectable()
export class Service extends classes(CommandHandlingMixin, EventHandlingMixin) {
  @inject(BINDINGS.CommandBus)
  public commandBus: types.CommandBus;

  @inject(BINDINGS.EventBus)
  public eventBus: types.EventBus;

  /**
   * Initializes Service.
   */
  @postConstruct()
  public initialize(): void {
    super.class(CommandHandlingMixin).initialize();
    super.class(EventHandlingMixin).initialize();
  }
}
