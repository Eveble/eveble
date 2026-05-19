import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
} from 'vitest';

import { Type } from '@eveble/core';
import { Command } from '../../../src/components/command';
import { Aggregate } from '../../../src/domain/aggregate';
import { History } from '../../../src/domain/history';
import { subscribe } from '../../../src/annotations/subscribe';
import { Event } from '../../../src/components/event';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { isTyped } from '../../../src/utils/helpers';
import { InvalidInitializingMessageError } from '../../../src/domain/domain-errors';
import { Guid } from '../../../src/domain/value-objects/guid';
import { initial } from '../../../src/annotations/initial';

describe(`Aggregate`, () => {
  let now: Date;
  let clock: any;
  let handlers: Record<string, Function>;
  let props: Record<string, any>;
  let commands: Record<string, Command<{}>>;
  let events: Record<string, Event<{}>>;

  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    name: string;
  }

  @Type('MyAggregate', { isRegistrable: false })
  class MyAggregate extends Aggregate {
    name: string;

    MyCommand(@initial command: MyCommand): void {
      this.record(new MyEvent({ ...this.eventProps(), name: command.name }));
      handlers.MyCommand(command);
    }

    MyEvent(@subscribe event: MyEvent): void {
      this.assign(event);
      handlers.MyEvent(event);
    }
  }

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = vi.useFakeTimers(now.getTime());

    handlers = {
      MyCommand: vi.fn(),
      MyEvent: vi.fn(),
    };

    props = {
      id: 'my-id',
      name: 'Foo',
    };

    commands = {
      MyCommand: new MyCommand({
        targetId: props.id,
        name: props.name,
        timestamp: now,
      }),
    };
    events = {
      MyEvent: new MyEvent({
        sourceId: props.id,
        name: props.name,
        version: 0,
        timestamp: now,
      }),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it(`extends EventSourceable`, () => {
    expect(Aggregate.prototype).toBeInstanceOf(EventSourceable);
  });

  it('defines the type name correctly', () => {
    expect(Aggregate.getTypeName()).toBe('Aggregate');
    expect(Aggregate.prototype.getTypeName()).toBe('Aggregate');
  });

  it('ensures that type is defined', () => {
    expect(isTyped(Aggregate.prototype)).toBe(true);
  });

  describe(`construction`, () => {
    it(`makes the id publicly available`, () => {
      const id = 'my-id';
      const aggregate = new Aggregate({ id });
      expect(aggregate.getId()).toBe(id);
    });

    it(`sets the initial version to 0`, () => {
      const aggregate = new Aggregate({ id: 'my-id' });
      expect(aggregate.getVersion()).toBe(0);
    });

    it(`initializes uncommitted changes as empty array`, () => {
      const aggregate = new Aggregate({ id: 'my-id' });
      expect(aggregate.getEvents()).toEqual([]);
    });

    it(`initializes untriggered commands as empty array`, () => {
      const aggregate = new Aggregate({ id: 'my-id' });
      expect(aggregate.getCommands()).toEqual([]);
    });

    describe('construction flows', () => {
      describe('initializing command flow', () => {
        it(`takes a command as initializing message and assigns only id`, () => {
          const aggregate = new MyAggregate(commands.MyCommand);
          expect(aggregate.id).toBe(props.id);
        });

        it(`ensures that manual handling of command is required`, () => {
          const aggregate = new MyAggregate(commands.MyCommand);
          expect(aggregate.id).toBe(props.id);
          expect(handlers.MyCommand).not.toHaveBeenCalled;
        });

        it(`initializes aggregate instance and handles command after construction`, () => {
          const aggregate = new MyAggregate(commands.MyCommand);
          expect(aggregate.id).toBe(props.id);
          aggregate.initialize();
          aggregate.handle(commands.MyCommand);
          expect(handlers.MyCommand).toHaveBeenCalledTimes(1);
          expect(handlers.MyCommand).toHaveBeenCalledWith(commands.MyCommand);
        });
      });

      describe('replay history flow', () => {
        it('takes instance of History with list of Event instances', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyAggregate(history);
          expect(aggregate.getId()).toBe(events.MyEvent.sourceId);
        });

        it('ensures that manual replay of history is required', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyAggregate(history);
          aggregate.replayHistory = vi.fn();
          expect(aggregate.replayHistory).not.toHaveBeenCalled;
        });

        it('initializes aggregate and replies history', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyAggregate(history);
          aggregate.initialize();
          aggregate.replayHistory(history);
          expect(aggregate.getId()).toBe(events.MyEvent.sourceId);
          expect(handlers.MyEvent).toHaveBeenCalledWith(events.MyEvent);
        });
      });

      describe('properties flow', () => {
        it('takes required properties for aggregate and assings them', () => {
          const properties = {
            id: new Guid(),
            name: 'Foo',
            version: 0,
          };
          const aggregate = new MyAggregate(properties);
          expect(aggregate).toEqual(properties);
        });
      });
    });

    it(`does not initialize from passed event`, () => {
      expect(() => new MyAggregate(events.MyEvent)).toThrow(
        InvalidInitializingMessageError,
        `MyAggregate: the given initializing message is not one of allowed types. Expected [Command, Function], got MyEvent({"sourceId":"my-id","name":"Foo","version":0,"timestamp":"${now.toISOString()}","metadata":{}}`
      );
    });
  });
});
