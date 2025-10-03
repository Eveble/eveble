import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { injectable } from 'inversify';
import { Type } from '@eveble/core';
import { derived } from '@traits-ts/core';
import { Service } from '../../../src/infrastructure/service';
import { CommandHandlingTrait } from '../../../src/traits/command-handling.trait';
import { EventHandlingTrait } from '../../../src/traits/event-handling.trait';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { handle } from '../../../src/annotations/handle';
import { Injector } from '../../../src/core/injector';
import { subscribe } from '../../../src/annotations/subscribe';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';

describe(`Service`, () => {
  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {}

  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  let injector: Injector;
  let commandBus: any;
  let eventBus: any;

  beforeEach(() => {
    injector = new Injector();
    commandBus = stubInterface<types.CommandBus>();
    eventBus = stubInterface<types.EventBus>();

    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
  });

  it(`has CommandHandlingTrait mixin on prototype chain applied`, () => {
    expect(derived(Service.prototype, CommandHandlingTrait)).to.be.true;
  });

  it(`has EventHandlingTrait mixin on prototype chain applied`, () => {
    expect(derived(Service.prototype, EventHandlingTrait)).to.be.true;
  });

  it('ensures that initializers from CommandHandlingTrait, EventHandlingTrait are invoked upon dependency injection', () => {
    class MyService extends Service {
      MyCommand(@handle _command: MyCommand): void {
        return undefined;
      }

      MyEvent(@subscribe _events: MyEvent): void {
        return undefined;
      }
    }
    const service = new MyService();
    injector.injectInto(service);

    expect(service.hasHandler(MyCommand)).to.be.true;
    expect(service.hasHandler(MyEvent)).to.be.true;
  });

  it('ensures that service can be resolved by Inversify in singleton scope', () => {
    @injectable()
    class MyService extends Service {
      MyCommand(@handle _command: MyCommand): void {
        return undefined;
      }

      MyEvent(@subscribe _events: MyEvent): void {
        return undefined;
      }
    }
    injector.bind<types.Service>('MyService').to(MyService).inSingletonScope();

    injector.get('MyService');
    expect(() => injector.get('MyService')).to.not.throw(Error);
    expect(injector.get('MyService')).to.be.instanceof(MyService);
  });
});
