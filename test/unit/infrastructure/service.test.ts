import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { Service } from '../../../src/infrastructure/service';
import { CommandHandlingMixin } from '../../../src/mixins/command-handling-mixin';
import { EventHandlingMixin } from '../../../src/mixins/event-handling-mixin';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { define } from '../../../src/decorators/define';
import { handle } from '../../../src/annotations/handle';
import { Container } from '../../../src/core/injector';
import { subscribe } from '../../../src/annotations/subscribe';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';

describe(`Service`, function() {
  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command {}

  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event {
    key: string;
  }

  let container: Container;
  let commandBus: any;
  let eventBus: any;

  beforeEach(() => {
    container = new Container();
    commandBus = stubInterface<types.CommandBus>();
    eventBus = stubInterface<types.EventBus>();

    container
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    container.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
  });

  it(`has CommandHandlingMixin mixin on prototype chain applied`, () => {
    expect(Service.prototype).to.be.instanceof(CommandHandlingMixin);
  });

  it(`has EventHandlingMixin mixin on prototype chain applied`, () => {
    expect(Service.prototype).to.be.instanceof(EventHandlingMixin);
  });

  it('ensures that initializers from CommandHandlingMixin, EventHandlingMixin are invoked upon dependency injection', () => {
    class MyService extends Service {
      MyCommand(@handle _command: MyCommand): void {
        return undefined;
      }

      MyEvent(@subscribe _events: MyEvent): void {
        return undefined;
      }
    }
    const service = new MyService();
    container.injectInto(service);

    expect(service.hasHandler(MyCommand)).to.be.true;
    expect(service.hasHandler(MyEvent)).to.be.true;
  });
});
