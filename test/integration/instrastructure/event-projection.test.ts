import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { Type } from 'typend';

import { Event } from '../../../src/components/event';
import { Projection } from '../../../src/infrastructure/projection';
import { subscribe } from '../../../src/annotations/subscribe';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { EventBus } from '../../../src/messaging/event-bus';
import { Guid } from '../../../src/domain/value-objects/guid';

describe('Event projection', () => {
  const handlers = {
    CustomerDocStorageProjection: vi.fn(),
    CustomerGraphStorageProjection: vi.fn(),
  };

  @Type('EventProjection.CustomerRegistered')
  class CustomerRegistered extends Event<CustomerRegistered> {
    firstName: string;

    lastName: string;
  }

  class CustomerDocStorageProjection extends Projection {
    CustomerRegistered(@subscribe event: CustomerRegistered): void {
      handlers.CustomerDocStorageProjection(event);
    }
  }

  class CustomerGraphStorageProjection extends Projection {
    CustomerRegistered(@subscribe event: CustomerRegistered): void {
      handlers.CustomerGraphStorageProjection(event);
    }
  }

  // Props
  const appId = 'my-app-id';
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  let eventBus: types.EventBus;

  beforeEach(async () => {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();
    eventBus = new EventBus();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    config.get.calledWith('appId').mockReturnValue(appId);

    injector.injectInto(new CustomerDocStorageProjection());
    injector.injectInto(new CustomerGraphStorageProjection());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('publishes event on projection', () => {
    const sourceId = new Guid();
    const event = new CustomerRegistered({
      sourceId,
      firstName: 'Foo',
      lastName: 'Bar',
    });
    eventBus.publish(event);
    expect(handlers.CustomerDocStorageProjection).toHaveBeenCalledTimes(1);
    expect(handlers.CustomerDocStorageProjection).toHaveBeenCalledWith(event);
  });

  it('executes event on all registered projections', () => {
    const sourceId = new Guid();
    const event = new CustomerRegistered({
      sourceId,
      firstName: 'Qux',
      lastName: 'Bar',
    });
    eventBus.publish(event);
    expect(handlers.CustomerDocStorageProjection).toHaveBeenCalledTimes(1);
    expect(handlers.CustomerDocStorageProjection).toHaveBeenCalledWith(event);
    expect(handlers.CustomerGraphStorageProjection).toHaveBeenCalledTimes(1);
    expect(handlers.CustomerGraphStorageProjection).toHaveBeenCalledWith(event);
  });
});
