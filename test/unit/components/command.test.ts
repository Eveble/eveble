import { expect, describe, it, beforeEach, afterEach, vi, beforeAll } from 'vitest';

import { PropTypes } from 'typend';
import { Type } from '@eveble/core';
import { Message } from '../../../src/components/message';
import { Command, Assignment } from '../../../src/components/command';
import { isTyped } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';
import { types } from '../../../src/types';

describe('Command', () => {
  let now: Date;
  let clock: any;

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = vi.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {}

  @Type('MyCustomCommand', { isRegistrable: false })
  class MyCustomCommand extends Command<MyCustomCommand> {
    name: string;
  }

  it(`extends Message`, () => {
    expect(Command.prototype).toBeInstanceOf(Message);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(Command.prototype)).toBe(true);
  });

  it('defines the type name correctly', () => {
    expect(Command.getTypeName()).toBe('Command');
    expect(Command.prototype.getTypeName()).toBe('Command');
  });

  describe('prop types', () => {
    it('takes required targetId property as a string or Guid', () => {
      expect(Command.getPropTypes().targetId).toEqual(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes optional timestamp property as a Date', () => {
      vi.useRealTimers();

      expect(Command.getPropTypes().timestamp).toEqual(
        PropTypes.instanceOf(Date).isOptional
      );
    });

    it('takes optional metadata property as an object', () => {
      expect(Command.getPropTypes().metadata).toEqual(
        PropTypes.object.isOptional
      );
    });
  });

  describe(`construction`, () => {
    describe('required properties', () => {
      it(`takes an object with targetId property as a string`, () => {
        const targetId = 'my-id';
        expect(
          new MyCommand({
            targetId,
          }).targetId
        ).toBe(targetId);
      });

      it(`takes an object with targetId property as a guid`, () => {
        const targetId = new Guid();
        expect(
          new MyCommand({
            targetId,
          }).targetId
        ).toBe(targetId);
      });
    });

    describe('optional properties', () => {
      it(`takes an object with optional timestamp property as a date`, () => {
        const targetId = new Guid();
        const timestamp = new Date();
        const command = new MyCommand({ targetId, timestamp });
        expect(command.timestamp).toBe(timestamp);
      });

      it('adds current date if property timestamp is missing on construction', () => {
        expect(new MyCommand({ targetId: 'my-id' }).timestamp).toBeInstanceOf(
          Date
        );
      });

      it(`takes an object with optional metadata property as an object`, () => {
        const targetId = new Guid();
        const metadata = {
          key: 'value',
        };
        const command = new MyCommand({ targetId, metadata });
        expect(command.metadata).toEqual(metadata);
      });
    });

    describe('immutability', () => {
      it('makes the message instance immutable', () => {
        const message = new MyCustomCommand({
          targetId: 'my-id',
          name: 'set-durning-construction',
        });
        expect(Object.isFrozen(message)).toBe(true);
        expect(() => (message.name = 'set-after')).toThrow(TypeError);
      });

      it('requires explicit constructor for messages with property initializers', () => {
        @Type('MyDefaultCommand', { isRegistrable: false })
        class MyDefaultCommand extends Command<MyDefaultCommand> {
          key: string;

          default? = 'default';

          constructor(props: types.ConstructorType<MyDefaultCommand>) {
            super(props as any);
            Object.assign(this, this.processProps(props));
            Object.freeze(this);
          }
        }

        const message = new MyDefaultCommand({
          targetId: 'my-id',
          key: 'my-key',
          timestamp: now,
        });
        expect(Object.isFrozen(message)).toBe(true);
        expect(message).toEqual({
          targetId: 'my-id',
          key: 'my-key',
          default: 'default',
          metadata: {},
          timestamp: now,
        });
      });
    });
  });

  describe(`accessors`, () => {
    it(`returns command target id as a string`, () => {
      const targetId = 'my-id';
      expect(
        new MyCommand({
          targetId,
        }).getId()
      ).toBe(targetId);
    });

    it(`returns command target id as a guid`, () => {
      const targetId = new Guid();
      expect(
        new MyCommand({
          targetId,
        }).getId()
      ).toBe(targetId);
    });
  });

  describe('scheduling', () => {
    describe('getters', () => {
      describe('scheduling', () => {
        it('returns true if command is scheduled', () => {
          const assignment = new Assignment({
            assignmentId: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: now,
            assignerId: new Guid(),
            assignerType: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isScheduled()).toBe(true);
        });

        it('returns false if command is not scheduled', () => {
          const command = new MyCommand({ targetId: 'my-id' });
          expect(command.isScheduled()).toBe(false);
        });

        it('returns true if command can be delivered(deliver at date is in past now)', () => {
          const assignment = new Assignment({
            assignmentId: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: now,
            assignerId: new Guid(),
            assignerType: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isDeliverable()).toBe(true);
        });

        it(`returns true if command can be delivered(deliver at date is in past)`, () => {
          const assignment = new Assignment({
            assignmentId: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: new Date(new Date().getTime() - 1000),
            assignerId: new Guid(),
            assignerType: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isDeliverable()).toBe(true);
        });

        it(`returns false if command is not deliverable(deliver at date is in future)`, () => {
          const assignment = new Assignment({
            assignmentId: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: new Date(new Date().getTime() + 1000),
            assignerId: new Guid(),
            assignerType: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isScheduled()).toBe(true);
        });
      });
    });

    describe('mutators', () => {
      describe('scheduling', () => {
        it('schedules command to be delivered at specific date with task id', () => {
          const assignmentId = 'my-custom-id-to-identify-scheduled-task';
          const assignerId = new Guid();
          const assignerType = 'MyEventSourceable';
          const deliverAt = now;

          const assignment = new Assignment({
            assignmentId,
            deliverAt,
            assignerId,
            assignerType,
          });

          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          const metadata = command.getMetadata();
          expect(metadata?.scheduling?.assignmentId).toBe(assignmentId);
          expect(metadata?.scheduling?.assignerId).toBe(assignerId);
          expect(metadata?.scheduling?.assignerType).toBe(assignerType);
          expect(metadata?.scheduling?.deliverAt).toBe(deliverAt);
        });
      });
    });
  });
});

