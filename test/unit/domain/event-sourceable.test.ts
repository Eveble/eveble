import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { PropTypes, ValidationError } from 'typend';
import sinon from 'sinon';
import { Type } from '@eveble/core';
import { derived } from '@traits-ts/core';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { History } from '../../../src/domain/history';
import { Guid } from '../../../src/domain/value-objects/guid';
import { OneToOneHandlingTrait } from '../../../src/traits/one-to-one-handling.trait';
import { Entity } from '../../../src/domain/entity';
import { EVENTS_KEY, COMMANDS_KEY } from '../../../src/constants/literal-keys';
import { Command, Assignment } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { handle } from '../../../src/annotations/handle';
import { subscribe } from '../../../src/annotations/subscribe';
import {
  InvalidEventError,
  EventIdMismatchError,
} from '../../../src/domain/domain-errors';
import {
  UnhandleableTypeError,
  InvalidMessageableType,
  HandlerNotFoundError,
  InitializingMessageAlreadyExistsError,
} from '../../../src/messaging/messaging-errors';
import { UndefinedStatesError } from '../../../src/traits/stateful.trait';
import { UndefinedStatusesError } from '../../../src/traits/statusful.trait';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { UnscheduleCommand } from '../../../src/domain/unschedule-command';
import { isTyped } from '../../../src/utils/helpers';
import { initial } from '../../../src/annotations/initial';
import { route } from '../../../src/annotations/route';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`EventSourceable`, () => {
  let now: Date;
  let clock: any;
  let handlers: Record<string, Function>;
  let orderProps: Record<string, any>;
  let commands: Record<string, Command<{}>>;
  let events: Record<string, Event<{}>>;

  /*
  COMMANDS
  */
  @Type('CreateOrder')
  class CreateOrder extends Command<CreateOrder> {
    customerName: string;
  }

  @Type('PayOrder')
  class PayOrder extends Command<PayOrder> {}

  @Type('FulfillOrder')
  class FulfillOrder extends Command<FulfillOrder> {}

  @Type('AddItem')
  class AddItem extends Command<AddItem> {
    item: string;
  }

  /*
  EVENTS
  */
  @Type('OrderCreated')
  class OrderCreated extends Event<OrderCreated> {
    customerName: string;

    items: string[];
  }

  @Type('OrderPaid')
  class OrderPaid extends Event<OrderPaid> {
    customerName: string;
  }

  @Type('OrderFulfilled')
  class OrderFulfilled extends Event<OrderFulfilled> {
    customerName: string;

    discountCode: string;
  }

  @Type('ItemAdded')
  class ItemAdded extends Event<ItemAdded> {
    item: string;

    items: string[];
  }

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());

    handlers = {
      CreateOrder: sinon.stub(),
      OrderCreated: sinon.stub(),
      PayOrder: sinon.stub(),
      OrderPaid: sinon.stub(),
      FulfillOrder: sinon.stub(),
      OrderFulfilled: sinon.stub(),
    };

    orderProps = {
      id: 'my-id',
      customerName: 'Foo',
    };

    commands = {
      CreateOrder: new CreateOrder({
        targetId: orderProps.id,
        customerName: orderProps.customerName,
      }),
      PayOrder: new PayOrder({
        targetId: orderProps.id,
      }),
      FulfillOrder: new FulfillOrder({
        targetId: orderProps.id,
      }),
    };

    events = {
      OrderCreated: new OrderCreated({
        sourceId: orderProps.id,
        customerName: orderProps.customerName,
        items: [],
        timestamp: now,
        version: 0,
      }),
      OrderPaid: new OrderPaid({
        sourceId: orderProps.id,
        customerName: orderProps.customerName,
        timestamp: now,
        version: 0,
      }),
      OrderFulfilled: new OrderFulfilled({
        sourceId: orderProps.id,
        customerName: orderProps.customerName,
        discountCode: 'discount20',
        timestamp: now,
        version: 0,
      }),
    };
  });

  afterEach(() => {
    clock.restore();
  });
  /*
  EVENT SOURCEABLE
  */
  @Type('MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {}

  @Type('Order', { isRegistrable: false })
  class Order extends EventSourceable {
    static STATES = {
      pending: 'pending',
      fulfilled: 'fulfilled',
    };

    static STATUSES = {
      pendingPayment: 'pendingPayment',
      paid: 'paid',
    };

    customerName: string;

    items: string[];

    constructor(props: Partial<Order>) {
      super(props);
      this.setState(Order.STATES.pending);
      this.setStatus(Order.STATUSES.pendingPayment);
    }

    // Handles
    CreateOrder(@initial command: CreateOrder): void {
      this.record(
        new OrderCreated({
          ...this.eventProps(),
          customerName: command.customerName,
          items: [],
        })
      );
      handlers.CreateOrder(command);
    }

    PayOrder(@route command: PayOrder): void {
      this.record(
        new OrderPaid({
          ...this.eventProps(),
          customerName: this.customerName,
        })
      );
      handlers.PayOrder(command);
    }

    FulfillOrder(@route command: FulfillOrder): void {
      this.record(
        new OrderFulfilled({
          ...this.eventProps(),
          customerName: this.customerName,
          discountCode: 'discount20',
        })
      );
      handlers.FulfillOrder(command);
    }

    AddItem(@route command: AddItem): void {
      this.record(
        new ItemAdded({
          ...this.eventProps(),
          item: command.item,
          items: this.items,
        })
      );
    }

    // Subscribes

    OrderCreated(@subscribe event: OrderCreated): void {
      /*
      This is the first event that will be handled - thus all the necessary properties must be assigned. After handling all events, manual validation of properties will take place and state that does unmatch prop types - will result in `ValidationError`. So the flow is:

      1. Construction of Order happened already, it required only `id` to be provided(via `Router`).
      2. At current stage (invoked by recording on `CreateOrder` command handler), event 'OrderCreated' is being recorded
      3. Since each handled command requires that EventSourceable instance internal state matches prop types, new properties from event *MUST* be assigned to instance so EventSourceable.prototype.validateProps passes manual validation.
      */
      this.assign(event);
      handlers.OrderCreated(event);
    }

    OrderPaid(@subscribe event: OrderPaid): void {
      this.assign(event);
      this.setStatus(Order.STATUSES.paid);
      handlers.OrderPaid(event);
    }

    OrderFulfilled(@subscribe event: OrderFulfilled): void {
      this.assign(event);
      this.setState(Order.STATES.fulfilled);
      handlers.OrderFulfilled(event);
    }

    ItemAdded(@subscribe event: ItemAdded): void {
      this.items.push(event.item);
    }
  }

  it(`extends Entity`, () => {
    expect(EventSourceable.prototype).to.be.instanceof(Entity);
  });

  it(`implements OneToOneHandlingTrait`, () => {
    expect(derived(EventSourceable.prototype, OneToOneHandlingTrait)).to.be
      .true;
  });

  it('defines the type name correctly', () => {
    expect(EventSourceable.getTypeName()).to.equal('EventSourceable');
    expect(EventSourceable.prototype.getTypeName()).to.equal('EventSourceable');
  });

  it('ensures that type is defined', () => {
    expect(isTyped(EventSourceable.prototype)).to.be.true;
  });

  describe('prop types', () => {
    it('have prop types set for: id, version, state, status, COMMANDS_KEY, EVENTS_KEY and metadata', () => {
      expect(EventSourceable.getPropTypes()).to.contain.all.keys([
        'id',
        'version',
        'state',
        'status',
        'metadata',
        COMMANDS_KEY,
        EVENTS_KEY,
      ]);
    });

    it('takes required id property as a string or Guid', () => {
      expect(EventSourceable.getPropTypes().id).to.be.eql(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes required version property as a Number', () => {
      expect(EventSourceable.getPropTypes().version).to.be.eql(
        PropTypes.instanceOf(Number)
      );
    });

    it('takes optional metadata property as an object', () => {
      expect(EventSourceable.getPropTypes().metadata).to.be.eql(
        PropTypes.object.isOptional
      );
    });

    it('takes optional schemaVersion property as a Number', () => {
      expect(EventSourceable.getPropTypes().schemaVersion).to.be.eql(
        PropTypes.instanceOf(Number).isOptional
      );
    });

    it('takes optional state property as a string', () => {
      expect(EventSourceable.getPropTypes().state).to.be.eql(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Number),
        ])
      );
    });

    it('takes optional status property as a string', () => {
      expect(EventSourceable.getPropTypes().status).to.be.eql(
        PropTypes.oneOf([
          undefined,
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Number),
        ])
      );
    });
  });

  describe(`construction`, () => {
    it(`ensures that validation is not triggered on construction`, () => {
      expect(() => new MyEventSourceable({})).to.not.throw(ValidationError);
      const props = {
        customerName: 'Jane Doe',
      };
      expect(() => new MyEventSourceable(props)).to.not.throw(ValidationError);
    });

    it(`makes the id publicly available`, () => {
      const id = 'my-id';
      const instance = new MyEventSourceable({ id });
      expect(instance.getId()).to.be.equal(id);
    });

    it(`sets the initial state to undefined`, () => {
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(instance.getState()).to.be.equal(undefined);
    });

    it(`sets the initial status to undefined`, () => {
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(instance.getState()).to.be.equal(undefined);
    });

    it(`sets the initial version to 0`, () => {
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(instance.getVersion()).to.be.equal(0);
    });

    it(`initializes uncommitted changes(events) as empty array`, () => {
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(instance.getEvents()).to.be.instanceof(Array);
      expect(instance.getEvents()).to.be.eql([]);
    });

    it(`initializes untriggered commands as empty array`, () => {
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(instance.getCommands()).to.be.instanceof(Array);
      expect(instance.getCommands()).to.be.eql([]);
    });

    it(`initializes with empty handled commands as a mapping`, () => {
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(instance.handles()).to.be.instanceof(Map);
      expect(instance.handles()).to.be.eql(new Map());
    });

    it(`initializes with empty subscribed events as a mapping`, () => {
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(instance.subscribes()).to.be.instanceof(Map);
      expect(instance.subscribes()).to.be.eql(new Map());
    });
  });

  describe(`recording`, () => {
    it('records(handles) the given event', () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();

      instance.record(events.OrderCreated);
      expect(handlers.OrderCreated).to.be.calledOnce;
      expect(handlers.OrderCreated).to.have.been.calledWithMatch(
        events.OrderCreated
      );
    });

    it(`allows to record event on command handler by passing event's type and additional required properties`, async () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();

      await instance.handle(commands.CreateOrder);
      await instance.handle(commands.FulfillOrder);
      expect(handlers.OrderFulfilled).to.be.calledWithMatch(
        new OrderFulfilled({
          sourceId: orderProps.id,
          customerName: orderProps.customerName,
          discountCode: 'discount20',
          version: 0,
          timestamp: now,
        })
      );
    });

    it('pushes the event into the events array', () => {
      const instance = new Order({ id: orderProps.id });
      instance.record(events.OrderCreated);
      expect(instance.getEvents()).to.have.length(1);
      expect(instance.getEvents()).to.eql([events.OrderCreated]);
    });

    it('only records instances of domain Event', () => {
      const nonEvent = {
        type: 'Test',
        eventSourceableId: 'my-id',
      };
      const instance = new Order({ id: 'my-id' });
      expect(() => {
        instance.record(nonEvent as any as Event<{}>);
      }).to.throw(
        InvalidEventError,
        `Order: event must be instance of Event, got {"type":String("Test"), "eventSourceableId":String("my-id")}`
      );
    });

    it(`expects recorded event with source id matching event sourcable's id`, () => {
      @Type('MyEvent', { isRegistrable: false })
      class MyEvent extends Event<MyEvent> {}

      const event = new MyEvent({
        sourceId: 'other-id',
      });

      const instance = new Order({ id: 'my-id' });
      expect(() => {
        instance.record(event);
      }).to.throw(
        EventIdMismatchError,
        `Order: the given event has mismatching source id. Expected id 'my-id', got 'other-id'`
      );
    });

    it('does not throw error if there is missing handler for event', () => {
      @Type('MyEvent', { isRegistrable: false })
      class MyEvent extends Event<MyEvent> {}

      const event = new MyEvent({
        sourceId: 'my-id',
      });
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(() => instance.record(event)).not.to.throw(
        UnhandleableTypeError,
        `MyEventSourceable: cannot handle 'Event'`
      );
    });

    it('does not push the event into the events array if there is thrown error', async () => {
      const nonEvent = {
        type: 'Test',
        eventSourceableId: 'my-id',
      };
      const instance = new MyEventSourceable({ id: 'my-id' });
      expect(() => {
        instance.record(nonEvent as any as Event<{}>);
      }).to.throw(InvalidEventError);
      expect(instance.getEvents()).to.eql([]);
    });

    it('ensures that each event fired from single handler does not leak n+x state on referenceable properties(like arrays, objects)', async () => {
      const instance = new Order({ id: orderProps.id, items: [] });
      instance.initialize();

      // Simulate handling multiple events referencing to same array
      await instance.handle(
        new AddItem({
          targetId: orderProps.id,
          item: 'first',
        })
      );
      await instance.handle(
        new AddItem({
          targetId: orderProps.id,
          item: 'second',
        })
      );
      expect(instance.getEvents()).to.eql([
        new ItemAdded({
          sourceId: orderProps.id,
          item: 'first',
          items: [],
          version: 0,
        }),
        new ItemAdded({
          sourceId: orderProps.id,
          item: 'second',
          items: ['first'],
          version: 0,
        }),
      ]);
    });
  });

  describe('working with state', () => {
    it(`throws UndefinedStatesError when setting state on event sourceable without defined states`, () => {
      @Type('MyNonStateES')
      class MyNonStateES extends EventSourceable {}

      const instance = new MyNonStateES({ id: 'my-id' });
      expect(() => instance.setState('created')).to.throw(
        UndefinedStatesError,
        `MyNonStateES: states are not defined. Please define states as class(MyClass.STATES) property or define your getter as MyClass.prototype.getAvailableStates`
      );
    });

    it('has no state by default', () => {
      expect(new MyEventSourceable({ id: 'my-id' }).hasState()).to.be.false;
    });

    it('can transition to a state', async () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      expect(instance.isInState(Order.STATES.pending)).to.be.true;
      await instance.handle(events.OrderFulfilled);
      expect(instance.isInState(Order.STATES.fulfilled)).to.be.true;
    });
  });

  describe('working with status', () => {
    it(`throws UndefinedStatusesError when setting status on event sourceable without defined statuses`, () => {
      @Type('MyNonStatusES')
      class MyNonStatusES extends EventSourceable {}

      const instance = new MyNonStatusES({ id: 'my-id' });
      expect(() => instance.setStatus('myStatus')).to.throw(
        UndefinedStatusesError,
        `MyNonStatusES: statuses are not defined. Please define statuses as class(MyClass.STATUSES) property or define your getter as MyClass.prototype.getAvailableStatuses`
      );
    });

    it('has no status by default', () => {
      expect(new MyEventSourceable({ id: 'my-id' }).hasStatus()).to.be.false;
    });

    it('can transition to a status', async () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      expect(instance.isInStatus(Order.STATUSES.pendingPayment)).to.be.true;
      await instance.handle(events.OrderPaid);
      expect(instance.isInStatus(Order.STATUSES.paid)).to.be.true;
    });
  });

  describe(`replaying`, () => {
    it('invokes the mapped event handler', () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      instance.replay(events.OrderCreated);
      expect(handlers.OrderCreated).to.be.calledOnce;
      expect(handlers.OrderCreated).to.have.been.calledWithMatch(
        events.OrderCreated
      );
    });

    it('does not push the event into the events array(only recorded events should be added)', () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      instance.replay(events.OrderCreated);
      expect(instance.getEvents()).to.eql([]);
    });

    it('throws DomainEventRequiredError when the event is not a domain event', () => {
      const nonEvent = {
        type: 'Test',
        eventSourceableId: 'my-id',
      };
      const instance = new Order({ id: orderProps.id });
      expect(() => {
        instance.record(nonEvent as any as Event<{}>);
      }).to.throw(
        InvalidEventError,
        `Order: event must be instance of Event, got {"type":String("Test"), "eventSourceableId":String("my-id")}`
      );
    });

    it('updates event sourceable version to the one from the replayed event', () => {
      const event = new OrderCreated({
        sourceId: orderProps.id,
        customerName: orderProps.customerName,
        items: [],
        version: 5,
      });
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      instance.replay(event);
      expect(instance.getVersion()).to.equal(event.version);
    });

    it('allows to set event sourceable version', () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      const version = 10;
      instance.setVersion(version);
      expect(instance.getVersion()).to.equal(version);
    });

    it('also accepts events that have no version', () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      instance.replay(
        new OrderCreated({
          sourceId: orderProps.id,
          customerName: orderProps.customerName,
          items: [],
        })
      );
      expect(instance.getVersion()).to.equal(0);
    });

    it('only replays events that have the right source id', () => {
      const event = new OrderCreated({
        sourceId: 'other-id',
        customerName: orderProps.customerName,
        items: [],
      });

      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      expect(() => instance.replay(event)).to.throw(
        EventIdMismatchError,
        `Order: the given event has mismatching source id. Expected id 'my-id', got 'other-id'`
      );
    });
  });

  describe(`history`, () => {
    @Type('Created', { isRegistrable: false })
    class Created extends Event<Created> {}

    @Type('FirstChange', { isRegistrable: false })
    class FirstChange extends Event<FirstChange> {}

    @Type('SecondChange', { isRegistrable: false })
    class SecondChange extends Event<SecondChange> {}

    it('replays given historic events on the event sourceable', () => {
      const instance = new EventSourceable({ id: orderProps.id });
      instance.initialize();
      const replaySpy = sinon.stub(instance, 'replay');
      const history = new History([
        new Created({
          sourceId: orderProps.id,
          version: 1,
        }),
        new FirstChange({
          sourceId: orderProps.id,
          version: 2,
        }),
        new SecondChange({
          sourceId: orderProps.id,
          version: 3,
        }),
      ]);
      instance.replayHistory(history);
      expect(replaySpy).to.have.been.calledThrice;
      expect(replaySpy).to.have.been.calledWithExactly(history[0]);
      expect(replaySpy).to.have.been.calledWithExactly(history[1]);
      expect(replaySpy).to.have.been.calledWithExactly(history[2]);
    });
  });

  describe(`handling`, () => {
    it(`throws InvalidTypeError if type is not provided when resolving handler`, () => {
      class MyMessage {}

      const instance = new EventSourceable({ id: orderProps.id });
      expect(() => instance.getHandler(MyMessage as any)).to.throw(
        InvalidMessageableType,
        `Type 'MyMessage' must implement Messageable interface`
      );
    });

    it(`throws HandlerNotFoundError when handler for message was not registered`, async () => {
      @Type('NotHandledCommand')
      class NotHandledCommand extends Command<NotHandledCommand> {}

      const id = 'my-id';
      const command = new NotHandledCommand({
        targetId: id,
      });

      const instance = new MyEventSourceable({ id });
      expect(instance.handle(command)).to.eventually.be.rejectedWith(
        HandlerNotFoundError,
        `MyEventSourceable: handler for type 'NotHandledCommand' can't be found`
      );
    });

    it('invokes the mapped event handler', async () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      await instance.handle(events.OrderCreated);
      expect(handlers.OrderCreated).to.have.been.calledWithExactly(
        events.OrderCreated
      );
    });

    it('does not push the event into the events array', async () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      await instance.handle(events.OrderCreated);
      expect(instance.getEvents()).to.eql([]);
    });

    it('it does not assign the event version to the event sourceable(only record does that)', async () => {
      const event = new OrderCreated({
        sourceId: orderProps.id,
        customerName: orderProps.customerName,
        items: [],
        version: 10,
      });
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      await instance.handle(event);
      expect(instance.getVersion()).not.to.equal(event.version);
    });

    it('handles events that have no version', async () => {
      const event = new OrderCreated({
        sourceId: orderProps.id,
        customerName: orderProps.customerName,
        items: [],
      });
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      await instance.handle(event);
      expect(instance.getVersion()).to.equal(0);
    });

    it('handles events with different source id then id of event sourceable', async () => {
      const id = 'my-id';
      const event = new OrderCreated({
        sourceId: 'other-id',
        customerName: orderProps.customerName,
        items: [],
      });

      const instance = new Order({ id });
      instance.initialize();
      expect(async () => instance.handle(event)).not.to.throw(
        EventIdMismatchError
      );
    });

    it('handles commands', async () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      await instance.handle(commands.CreateOrder);
      expect(handlers.CreateOrder).to.have.been.calledWithExactly(
        commands.CreateOrder
      );
    });

    it(`returns event sourceable for chaining after handling`, async () => {
      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      expect(await instance.handle(commands.CreateOrder)).to.be.equal(instance);
    });
  });

  describe(`assigning properties`, () => {
    @Type('UpdateProfile', { isRegistrable: false })
    class UpdateProfile extends Event<UpdateProfile> {
      name: string;

      username: string;

      bio: string;
    }

    @Type('NotRelatedEvent', { isRegistrable: false })
    class NotRelatedEvent extends Event<NotRelatedEvent> {
      propertyThatDoesNotMatchDefinition: string;
    }

    @Type('Profile', { isRegistrable: false })
    class Profile extends EventSourceable {
      name: string;

      username: string;

      bio?: string;

      luckyNumber?: number;

      color?: string;

      UpdateProfile(@subscribe event: UpdateProfile): void {
        this.assign(event, { luckyNumber: Math.PI }, { color: 'blue' });
      }

      NotRelatedEvent(@subscribe event: NotRelatedEvent): void {
        this.assign(event);
      }
    }

    it(`assigns all properties that matches property types from event on event sourceable`, () => {
      const id = 'my-id';
      const updateProfileEvent = new UpdateProfile({
        sourceId: id,
        name: 'Foo',
        username: 'foo',
        bio: 'Cool story bro',
      });

      const initialState = {
        id,
        version: 0,
      };
      const instance = new Profile({
        id,
      });
      instance.initialize();
      expect(instance).to.be.eql(initialState);
      instance.record(updateProfileEvent);

      const expectedStateAfterProfileUpdate = {
        id,
        name: 'Foo',
        username: 'foo',
        bio: 'Cool story bro',
        luckyNumber: Math.PI,
        metadata: {},
        color: 'blue',
        version: 0,
      };
      expect(instance).to.be.eql(expectedStateAfterProfileUpdate);
    });

    it(`does not assign properties that does not match event sourceable's prop types`, () => {
      const id = 'my-id';
      const notRelatedEvent = new NotRelatedEvent({
        sourceId: id,
        propertyThatDoesNotMatchDefinition: 'my-value',
      });

      const instance = new Profile({
        id,
        name: 'Foo',
        username: 'bar',
      });
      instance.initialize();
      instance.record(notRelatedEvent);
      expect((instance as any).propertyThatDoesNotMatchDefinition).to.be.equal(
        undefined
      );
    });

    it('attaches metadata to event sourceable', () => {
      const instance = new Order({ id: orderProps.id });
      const metadata = {
        key: 'value',
        'other-key': 'other-value',
      };
      instance.assignMetadata(metadata);
      expect(instance.metadata).to.be.eql(metadata);
    });

    it('ensures that assigning metadata preserves deeply nested properties', () => {
      const instance = new Order({ id: orderProps.id });
      const firstMetadata = {
        I: {
          a: 'a-value',
          b: {
            '1': '1-value',
            '2': '2-value',
          },
        },
      };
      const secondMetadata = {
        I: {
          b: {
            '2': '2-replaced',
          },
          c: 'c-value',
        },
        II: {
          x: 'x-value',
        },
      };
      const expectedMetadata = {
        I: {
          a: 'a-value',
          b: {
            '1': '1-value',
            '2': '2-replaced',
          },
          c: 'c-value',
        },
        II: {
          x: 'x-value',
        },
      };
      instance.assignMetadata(firstMetadata);
      instance.assignMetadata(secondMetadata);
      expect(instance.metadata).to.be.eql(expectedMetadata);
    });
  });

  describe(`picking properties`, () => {
    it(`returns essential event properties: sourceId, timestamp, metadata, version`, () => {
      const instance = new Order({ id: orderProps.id });
      const eventProps = {
        sourceId: orderProps.id,
        timestamp: new Date(),
        metadata: {},
        version: 0,
      };
      expect(instance.eventProps()).to.be.eql(eventProps);
    });

    it(`returns essential command properties: metadata, timestamp`, () => {
      const instance = new Order({ id: orderProps.id });
      const commandProps = {
        timestamp: new Date(),
        metadata: {},
      };
      expect(instance.commandProps()).to.be.eql(commandProps);
    });
  });

  describe(`scheduled commands`, () => {
    it(`schedules command by taking command and delivery date and adds command to scheduled commands`, () => {
      const command = new CreateOrder({
        targetId: orderProps.id,
        customerName: 'Foo',
      });
      const deliverAt = now;

      const assignmentId = new Guid();
      const instance = new Order({ id: orderProps.id });
      instance.schedule(command, deliverAt, assignmentId);

      const assignment = new Assignment({
        assignmentId,
        deliverAt,
        assignerId: orderProps.id,
        assignerType: 'Order',
      });
      const commandAfterSchedule = new CreateOrder({
        targetId: orderProps.id,
        customerName: 'Foo',
      });
      commandAfterSchedule.schedule(assignment);
      const expectedScheduleCommand = new ScheduleCommand({
        targetId: orderProps.id,
        command: commandAfterSchedule,
      });
      expect(instance.getCommands()).to.be.eql([expectedScheduleCommand]);
      expect(command).to.be.eql(commandAfterSchedule);
    });

    it(`assigns id of Event Sourceable when custom id is not passed on scheduling`, () => {
      const command = new CreateOrder({
        targetId: orderProps.id,
        customerName: 'Foo',
      });
      const deliverAt = now;

      const instance = new Order({ id: orderProps.id });
      instance.schedule(command, deliverAt);

      const assignment = new Assignment({
        assignmentId: orderProps.id,
        deliverAt,
        assignerId: orderProps.id,
        assignerType: 'Order',
      });
      const commandAfterSchedule = new CreateOrder({
        targetId: orderProps.id,
        customerName: 'Foo',
      });
      commandAfterSchedule.schedule(assignment);
      const expectedScheduleCommand = new ScheduleCommand({
        targetId: orderProps.id,
        command: commandAfterSchedule,
      });
      expect(instance.getCommands()).to.be.eql([expectedScheduleCommand]);
      expect(command).to.be.eql(commandAfterSchedule);
    });

    it('adds unschedule command to routed commands upon unscheduling', () => {
      const assignmentId = new Guid();

      const instance = new Order({ id: orderProps.id });
      instance.unschedule(assignmentId, CreateOrder);

      const expectedUnscheduleCommand = new UnscheduleCommand({
        targetId: orderProps.id,
        assignerId: orderProps.id,
        assignerType: 'Order',
        assignmentId,
        commandType: 'CreateOrder',
      });
      expect(instance.getCommands()).to.be.eql([expectedUnscheduleCommand]);
    });

    it('omits handler execution of scheduled, non deliverable command on handling', async () => {
      const command = new CreateOrder({
        targetId: orderProps.id,
        customerName: 'Foo',
      });

      const deliverAt = new Date(new Date().getTime() + 1000);
      const assignment = new Assignment({
        assignmentId: orderProps.id,
        deliverAt,
        assignerId: orderProps.id,
        assignerType: 'Order',
      });
      command.schedule(assignment);

      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      await instance.handle(command);
      expect(handlers.CreateOrder).to.not.be.called;
    });

    it('executes handler for scheduled, deliverable command on handling', async () => {
      const command = new CreateOrder({
        targetId: orderProps.id,
        customerName: 'Foo',
      });

      const deliverAt = new Date(new Date().getTime() - 1000);
      const assignment = new Assignment({
        assignmentId: orderProps.id,
        deliverAt,
        assignerId: orderProps.id,
        assignerType: 'Order',
      });
      command.schedule(assignment);

      const instance = new Order({ id: orderProps.id });
      instance.initialize();
      await instance.handle(command);
      expect(handlers.CreateOrder).to.be.called;
      expect(handlers.CreateOrder).to.be.calledWithExactly(command);
    });
  });

  describe('flagging messages', () => {
    @Type('FirstCommand', { isRegistrable: false })
    class FirstCommand extends Command<FirstCommand> {}
    @Type('SecondCommand', { isRegistrable: false })
    class SecondCommand extends Command<SecondCommand> {}

    @Type('FirstEvent', { isRegistrable: false })
    class FirstEvent extends Event<FirstEvent> {}
    @Type('SecondEvent', { isRegistrable: false })
    class SecondEvent extends Event<SecondEvent> {}

    describe('initializing messages', () => {
      it(`throws InitializingMessageAlreadyExistsError when there is more then one initializing command found`, () => {
        const fn = (): any => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {
            FirstComand(@initial command: FirstCommand): Command<{}> {
              return command;
            }

            SecondCommand(@initial command: SecondCommand): Command<{}> {
              return command;
            }
          }
          return MyClass;
        };
        expect(fn).to.throw(
          InitializingMessageAlreadyExistsError,
          `MyClass: trying to override already existing initializing message with 'SecondCommand'. Remove annotation '@initial' from 'FirstCommand' beforehand`
        );
      });
      it(`throws InitializingMessageAlreadyExistsError when there is more then one initializing event found`, () => {
        const fn = (): any => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {
            FirstEvent(@initial event: FirstEvent): Event<{}> {
              return event;
            }

            SecondEvent(@initial event: SecondEvent): Event<{}> {
              return event;
            }
          }
          return MyClass;
        };
        expect(fn).to.throw(
          InitializingMessageAlreadyExistsError,
          `MyClass: trying to override already existing initializing message with 'SecondEvent'. Remove annotation '@initial' from 'FirstEvent' beforehand`
        );
      });
      it(`throws InitializingMessageAlreadyExistsError when there is more then one initializing message mix found`, () => {
        const fn = (): any => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {
            FirstCommand(@initial command: FirstCommand): Command<{}> {
              return command;
            }

            FirstEvent(@initial event: FirstEvent): Event<{}> {
              return event;
            }
          }
          return MyClass;
        };
        expect(fn).to.throw(
          InitializingMessageAlreadyExistsError,
          `MyClass: trying to override already existing initializing message with 'FirstEvent'. Remove annotation '@initial' from 'FirstCommand' beforehand`
        );
      });

      it('sets the initializing command', () => {
        @Type('MyClass', { isRegistrable: false })
        class MyClass extends EventSourceable {
          FirstCommand(@initial command: FirstCommand): Command<{}> {
            return command;
          }

          SecondCommand(@handle command: SecondCommand): Command<{}> {
            return command;
          }

          FirstEvent(@subscribe event: FirstEvent): Event<{}> {
            return event;
          }

          SecondEvent(@subscribe event: SecondEvent): Event<{}> {
            return event;
          }
        }
        expect(MyClass.resolveInitializingMessage()).to.be.equal(FirstCommand);
      });

      it('sets the initializing event', () => {
        @Type('MyClass', { isRegistrable: false })
        class MyClass extends EventSourceable {
          FirstCommand(@handle command: FirstCommand): Command<{}> {
            return command;
          }

          SecondCommand(@handle command: SecondCommand): Command<{}> {
            return command;
          }

          FirstEvent(@initial event: FirstEvent): Event<{}> {
            return event;
          }

          SecondEvent(@subscribe event: SecondEvent): Event<{}> {
            return event;
          }
        }
        expect(MyClass.resolveInitializingMessage()).to.be.equal(FirstEvent);
      });

      it('returns undefined if initializing message is not set', () => {
        @Type('MyClass', { isRegistrable: false })
        class MyClass extends EventSourceable {
          FirstCommand(@handle command: FirstCommand): Command<{}> {
            return command;
          }

          SecondCommand(@handle command: SecondCommand): Command<{}> {
            return command;
          }

          FirstEvent(@subscribe event: FirstEvent): Event<{}> {
            return event;
          }

          SecondEvent(@subscribe event: SecondEvent): Event<{}> {
            return event;
          }
        }
        expect(MyClass.resolveInitializingMessage()).to.be.equal(undefined);
      });
    });

    describe('routing messages', () => {
      context('commands', () => {
        it('routes commands', () => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {
            FirstCommand(@route command: FirstCommand): Command<{}> {
              return command;
            }

            SecondCommand(@route command: SecondCommand): Command<{}> {
              return command;
            }
          }
          expect(MyClass.resolveRoutedCommands()).to.be.eql([
            FirstCommand,
            SecondCommand,
          ]);
        });

        it('returns empty array if there are no routed commands', () => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {}
          expect(MyClass.resolveRoutedCommands()).to.be.eql([]);
        });
      });
      context('events', () => {
        it('routes events', () => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {
            FirstEvent(@route event: FirstEvent): Event<{}> {
              return event;
            }

            SecondEvent(@route event: SecondEvent): Event<{}> {
              return event;
            }
          }
          expect(MyClass.resolveRoutedEvents()).to.be.eql([
            FirstEvent,
            SecondEvent,
          ]);
        });

        it('returns empty array if there are no routed events', () => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {}
          expect(MyClass.resolveRoutedEvents()).to.be.eql([]);
        });
      });

      context('mixed messages', () => {
        it('routes mixed messages', () => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {
            FirstCommand(@route command: FirstCommand): Command<{}> {
              return command;
            }

            SecondEvent(@route event: SecondEvent): Event<{}> {
              return event;
            }
          }
          expect(MyClass.resolveRoutedMessages()).to.be.eql([
            FirstCommand,
            SecondEvent,
          ]);
        });

        it('returns empty array if there are no routed messages', () => {
          @Type('MyClass', { isRegistrable: false })
          class MyClass extends EventSourceable {}
          expect(MyClass.resolveRoutedMessages()).to.be.eql([]);
        });
      });
    });
  });

  describe('hooks', () => {
    it('has convert-serializable-list hook applied', () => {
      expect(
        EventSourceable.prototype.hasHook(
          'onConstruction',
          'convert-serializable-list'
        )
      ).to.be.true;
    });
  });
});
