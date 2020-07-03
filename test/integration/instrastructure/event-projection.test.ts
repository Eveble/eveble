import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { define } from 'typend';
import { stubInterface } from 'ts-sinon';
import { Event } from '../../../src/components/event';
import { Projection } from '../../../src/infrastructure/projection';
import { subscribe } from '../../../src/annotations/subscribe';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { EventBus } from '../../../src/messaging/event-bus';
import { Guid } from '../../../src/domain/value-objects/guid';

chai.use(sinonChai);

describe('Event projection', function () {
  const sandbox = sinon.createSandbox();

  const handlers = {
    CustomerDocStorageProjection: sandbox.stub(),
    CustomerGraphStorageProjection: sandbox.stub(),
  };

  @define('EventProjection.CustomerRegistered')
  class CustomerRegistered extends Event {
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
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();
    eventBus = new EventBus();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    config.get.withArgs('appId').returns(appId);

    injector.injectInto(new CustomerDocStorageProjection());
    injector.injectInto(new CustomerGraphStorageProjection());
  });

  afterEach(() => {
    sandbox.reset();
  });

  it('publishes event on projection', () => {
    const sourceId = new Guid();
    const event = new CustomerRegistered({
      sourceId,
      firstName: 'Foo',
      lastName: 'Bar',
    });
    eventBus.publish(event);
    expect(handlers.CustomerDocStorageProjection).to.be.calledOnce;
    expect(handlers.CustomerDocStorageProjection).to.be.calledWithExactly(
      event
    );
  });

  it('executes event on all registered projections', () => {
    const sourceId = new Guid();
    const event = new CustomerRegistered({
      sourceId,
      firstName: 'Qux',
      lastName: 'Bar',
    });
    eventBus.publish(event);
    expect(handlers.CustomerDocStorageProjection).to.be.calledOnce;
    expect(handlers.CustomerDocStorageProjection).to.be.calledWithExactly(
      event
    );
    expect(handlers.CustomerGraphStorageProjection).to.be.calledOnce;
    expect(handlers.CustomerGraphStorageProjection).to.be.calledWithExactly(
      event
    );
  });
});
