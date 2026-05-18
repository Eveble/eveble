import { expect, describe, it, beforeEach, afterEach, vi, beforeAll } from 'vitest';

import { pull } from 'lodash';
import { Type, kernel } from '@eveble/core';
import {
  StatefulAssertion,
  InvalidStateTransitionError,
} from '../../../src/domain/assertions/stateful-assertion';
import { Entity } from '../../../src/domain/entity';
import { Asserter } from '../../../src/domain/asserter';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';
import {
  StatusfulAssertion,
  InvalidStatusTransitionError,
} from '../../../src/domain/assertions/statusful-assertion';
import { ValueObject } from '../../../src/domain/value-object';
import { types } from '../../../src/types';
import { can } from '../../../src/decorators/can';

describe(`Entity BDD assertions`, () => {
  describe(`validating state assertion`, () => {
    @Type('MyEntity', { isRegistrable: false })
    class MyEntity extends Entity {
      static STATES = {
        first: 'first',
        second: 'second',
        third: 'third',
      };

      static STATUSES = {};
    }

    let asserter: Asserter;

    beforeAll(() => {
      asserter = new Asserter();
      asserter.registerAssertion(new StatefulAssertion(asserter));
    });

    beforeEach(() => {
      kernel.setAsserter(asserter);
    });

    afterEach(() => {
      kernel.setAsserter(undefined as any);
    });

    describe('single state validation', () => {
      describe('evaluating state', () => {
        it(`returns true if entity is in expected state`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setState(MyEntity.STATES.first);
          expect(entity.isInState(MyEntity.STATES.first)).toBe(true);
          entity.setState(MyEntity.STATES.second);
          expect(entity.isInState(MyEntity.STATES.second)).toBe(true);
        });

        it(`returns false if entity is not in expected state`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setState(MyEntity.STATES.first);
          expect(entity.isInState(MyEntity.STATES.second)).toBe(false);
          entity.setState(MyEntity.STATES.second);
          expect(entity.isInState(MyEntity.STATES.third)).toBe(false);
        });
      });

      describe('ensuring state correctness', () => {
        describe('positive ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is in expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-state')
                .ensure.is.inState(MyEntity.STATES.first)
            ).not.toThrow(InvalidStateTransitionError);
          });

          it(`throws InvalidStateTransitionError if entity is not in expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-second-state')
                .ensure.is.inState(MyEntity.STATES.second)
            ).toThrow(
              InvalidStateTransitionError,
              `MyEntity: cannot 'ensure-is-in-second-state' when in 'first' state(expected states: 'second')`
            );
          });

          it(`throws custom error if entity is not in expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            const error = new Error('my-custom-error');
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-second-state')
                .ensure.is.inState(MyEntity.STATES.second, error)
            ).toThrow(error);
          });
        });

        describe('negative ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is NOT in expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-state')
                .ensure.is.not.inState(MyEntity.STATES.second)
            ).not.toThrow(InvalidStateTransitionError);
          });

          it(`throws InvalidStateTransitionError if entity is in NOT expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-state')
                .ensure.is.not.inState(MyEntity.STATES.first)
            ).toThrow(
              InvalidStateTransitionError,
              `MyEntity: cannot 'ensure-is-in-first-state' when in 'first' state(expected states: 'first')`
            );
          });

          it(`throws custom error if entity is in NOT expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            const error = new Error('my-custom-error');
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-state')
                .ensure.is.not.inState(MyEntity.STATES.first, error)
            ).toThrow(error);
          });
        });
      });
    });

    describe('multiple states validation', () => {
      describe('evaluating state', () => {
        it(`returns true if entity is in one of expected states`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setState(MyEntity.STATES.first);
          expect(
            entity.isInOneOfStates([
              MyEntity.STATES.first,
              MyEntity.STATES.second,
            ])
          ).toBe(true);
        });

        it(`returns false if entity is not in one of expected states`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setState(MyEntity.STATES.first);
          expect(
            entity.isInOneOfStates([
              MyEntity.STATES.second,
              MyEntity.STATES.third,
            ])
          ).toBe(false);
        });
      });

      describe('ensuring state correctness', () => {
        describe('positive ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is in one of expected states`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-or-second-state')
                .ensure.is.inOneOfStates([
                  MyEntity.STATES.first,
                  MyEntity.STATES.second,
                ])
            ).not.toThrow(InvalidStateTransitionError);
          });

          it(`throws InvalidStateTransitionError if entity is not in one of expected states`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-second-or-third-state')
                .ensure.is.inOneOfStates([
                  MyEntity.STATES.second,
                  MyEntity.STATES.third,
                ])
            ).toThrow(
              InvalidStateTransitionError,
              `MyEntity: cannot 'ensure-is-in-second-or-third-state' when in 'first' state(expected states: 'second, third')`
            );
          });

          it(`throws custom error if entity is not in one of expected states`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            const error = new Error('my-custom-error');
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-second-or-third-state')
                .ensure.is.inOneOfStates(
                  [MyEntity.STATES.second, MyEntity.STATES.third],
                  error
                )
            ).toThrow(error);
          });
        });

        describe('negative ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is NOT in one of expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-not-in-second-or-third--state')
                .ensure.is.not.inOneOfStates([
                  MyEntity.STATES.second,
                  MyEntity.STATES.third,
                ])
            ).not.toThrow(InvalidStateTransitionError);
          });

          it(`throws InvalidStateTransitionError if entity is in one of NOT expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-not-in-first-or-second-state')
                .ensure.is.not.inOneOfStates([
                  MyEntity.STATES.first,
                  MyEntity.STATES.second,
                ])
            ).toThrow(
              InvalidStateTransitionError,
              `MyEntity: cannot 'ensure-is-not-in-first-or-second-state' when in 'first' state(expected states: 'first, second')`
            );
          });

          it(`throws custom error if entity is in one of NOT expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            const error = new Error('my-custom-error');
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-not-in-first-or-second-state')
                .ensure.is.not.inOneOfStates(
                  [MyEntity.STATES.first, MyEntity.STATES.second],
                  error
                )
            ).toThrow(error);
          });
        });
      });
    });
  });

  describe(`validating status assertion`, () => {
    @Type('MyEntity', { isRegistrable: false })
    class MyEntity extends Entity {
      static STATES = {
        created: 'created',
      };

      static STATUSES = {
        first: 'first',
        second: 'second',
        third: 'third',
      };
    }

    let asserter: Asserter;

    beforeAll(() => {
      asserter = new Asserter();
      asserter.registerAssertion(new StatusfulAssertion(asserter));
    });
    beforeEach(() => {
      kernel.setAsserter(asserter);
    });

    afterEach(() => {
      kernel.setAsserter(undefined as any);
    });
    describe('single status validation', () => {
      describe('evaluating status', () => {
        it(`returns true if entity is in expected status`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setStatus(MyEntity.STATUSES.first);
          expect(entity.isInStatus(MyEntity.STATUSES.first)).toBe(true);
          entity.setStatus(MyEntity.STATUSES.second);
          expect(entity.isInStatus(MyEntity.STATUSES.second)).toBe(true);
        });

        it(`returns false if entity is not in expected status`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setStatus(MyEntity.STATUSES.first);
          expect(entity.isInStatus(MyEntity.STATUSES.second)).toBe(false);
          entity.setStatus(MyEntity.STATUSES.second);
          expect(entity.isInStatus(MyEntity.STATUSES.third)).toBe(false);
        });
      });

      describe('ensuring status correctness', () => {
        describe('positive ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is in expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-status')
                .ensure.is.inStatus(MyEntity.STATUSES.first)
            ).not.toThrow(InvalidStatusTransitionError);
          });

          it(`throws InvalidStateTransitionError if entity is not in expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-second-status')
                .ensure.is.inStatus(MyEntity.STATUSES.second)
            ).toThrow(
              InvalidStatusTransitionError,
              `MyEntity: cannot 'ensure-is-in-second-status' when in 'first' status(expected statuses: 'second')`
            );
          });

          it(`throws custom error if entity is not in expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            const error = new Error('my-custom-error');
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-second-status')
                .ensure.is.inStatus(MyEntity.STATUSES.second, error)
            ).toThrow(error);
          });
        });

        describe('negative ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is NOT in expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-status')
                .ensure.is.not.inStatus(MyEntity.STATUSES.second)
            ).not.toThrow(InvalidStatusTransitionError);
          });

          it(`throws InvalidStateTransitionError if entity is in NOT expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-status')
                .ensure.is.not.inStatus(MyEntity.STATUSES.first)
            ).toThrow(
              InvalidStatusTransitionError,
              `MyEntity: cannot 'ensure-is-in-first-status' when in 'first' status(expected statuses: 'first')`
            );
          });

          it(`throws custom error if entity is in NOT expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            const error = new Error('my-custom-error');
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-status')
                .ensure.is.not.inStatus(MyEntity.STATUSES.first, error)
            ).toThrow(error);
          });
        });
      });
    });

    describe('multiple statuses validation', () => {
      describe('evaluating status', () => {
        it(`returns true if entity is in one of expected statuses`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setStatus(MyEntity.STATUSES.first);
          expect(
            entity.isInOneOfStatuses([
              MyEntity.STATUSES.first,
              MyEntity.STATUSES.second,
            ])
          ).toBe(true);
        });

        it(`returns false if entity is not in one of expected statuses`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setStatus(MyEntity.STATUSES.first);
          expect(
            entity.isInOneOfStatuses([
              MyEntity.STATUSES.second,
              MyEntity.STATUSES.third,
            ])
          ).toBe(false);
        });
      });

      describe('ensuring status correctness', () => {
        describe('positive ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is in one of expected statuses`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-or-second-status')
                .ensure.is.inOneOfStatuses([
                  MyEntity.STATUSES.first,
                  MyEntity.STATUSES.second,
                ])
            ).not.toThrow(InvalidStatusTransitionError);
          });

          it(`throws InvalidStateTransitionError if entity is not in one of expected statuses`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-second-or-third-status')
                .ensure.is.inOneOfStatuses([
                  MyEntity.STATUSES.second,
                  MyEntity.STATUSES.third,
                ])
            ).toThrow(
              InvalidStatusTransitionError,
              `MyEntity: cannot 'ensure-is-in-second-or-third-status' when in 'first' status(expected statuses: 'second, third')`
            );
          });

          it(`throws custom error if entity is not in one of expected statuses`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            const error = new Error('my-custom-error');
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-second-or-third-status')
                .ensure.is.inOneOfStatuses(
                  [MyEntity.STATUSES.second, MyEntity.STATUSES.third],
                  error
                )
            ).toThrow(error);
          });
        });

        describe('negative ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is NOT in one of expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-not-in-second-or-third--status')
                .ensure.is.not.inOneOfStatuses([
                  MyEntity.STATUSES.second,
                  MyEntity.STATUSES.third,
                ])
            ).not.toThrow(InvalidStatusTransitionError);
          });

          it(`throws InvalidStateTransitionError if entity is in one of NOT expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-not-in-first-or-second-status')
                .ensure.is.not.inOneOfStatuses([
                  MyEntity.STATUSES.first,
                  MyEntity.STATUSES.second,
                ])
            ).toThrow(
              InvalidStatusTransitionError,
              `MyEntity: cannot 'ensure-is-not-in-first-or-second-status' when in 'first' status(expected statuses: 'first, second')`
            );
          });

          it(`throws custom error if entity is in one of NOT expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            const error = new Error('my-custom-error');
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-not-in-first-or-second-status')
                .ensure.is.not.inOneOfStatuses(
                  [MyEntity.STATUSES.first, MyEntity.STATUSES.second],
                  error
                )
            ).toThrow(error);
          });
        });
      });
    });
  });

  describe(`ability validating assertions`, () => {
    const handler = vi.fn();

    @Type('MyEntity', { isRegistrable: false })
    class MyEntity extends Entity {
      static STATES = {
        created: 'created',
        accepted: 'accepted',
        started: 'started',
        declined: 'declined',
      };

      declinedAt?: Date;

      declineReason?: string;

      constructor(props: types.EntityType<MyEntity>) {
        super(props);
        this.setState(MyEntity.STATES.created);
      }

      start(): void {
        this.on('start').ensure.is.inState('accepted');
        this.setState(MyEntity.STATES.started);
      }

      decline(declinedAt: Date, declineReason: string): void {
        handler(declinedAt, declineReason);
        this.assign({ declinedAt, declineReason });
        this.setState(MyEntity.STATES.declined);
      }
    }

    @Type('Price', { isRegistrable: false })
    class Price extends ValueObject {
      value: number;
    }

    @Type('Item', { isRegistrable: false })
    class Item extends Entity {
      price: Price;
    }

    @Type('Order', { isRegistrable: false })
    class Order extends Entity {
      items: Item[];

      removeItem(item: Item): void {
        pull(this.items, item);
      }
    }

    let asserter: Asserter;

    beforeAll(() => {
      asserter = new Asserter();
      asserter.registerAssertion(new StatefulAssertion(asserter));
      asserter.registerAssertion(new AbilityAssertion(asserter));
    });

    beforeEach(() => {
      kernel.setAsserter(asserter);
    });

    afterEach(() => {
      kernel.setAsserter(undefined as any);
    });

    it(`provides an api to assert that entity is able to change state`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      expect(() => entity.ensure.is.ableTo.start()).toThrow(
        InvalidStateTransitionError,
        `MyEntity: cannot 'start' when in 'created' state(expected states: 'accepted')`
      );
    });

    it(`ensures that state of entity is unchanged if error is not thrown upon validation`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      expect(() => entity.ensure.is.ableTo.start()).toThrow(
        InvalidStateTransitionError,
        `MyEntity: cannot 'start' when in 'created' state(expected states: 'accepted')`
      );
      expect(entity.isInState(MyEntity.STATES.created)).toBe(true);
    });

    it(`allows to pass all required arguments to invoked action(method)`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      const declinedAt = new Date();
      const declineReason = 'My reason';

      entity.ensure.is.ableTo.decline(declinedAt, declineReason);
      expect(handler).toHaveBeenCalledWith(declinedAt, declineReason);
    });

    it(`allows to use 'ensure.is.ableTo' with serializable lists to ensure ability of manipulating list`, () => {
      const itemProps = {
        id: 'my-item-id',
        price: new Price({ value: 1.29 }),
      };
      const order = new Order({
        id: 'my-order-id',
        items: [],
      });
      const item = order.ensure.is.ableTo.in<Item>('items').create(itemProps);
      expect(item).toBeInstanceOf(Item);
      expect(item).toEqual(itemProps);
      expect(order.items).toHaveLength(1);
    });
  });

  describe(`ability evaluation assertions`, () => {
    const handler = vi.fn();

    @Type('MyEntity', {
      isRegistrable: false,
    })
    class MyEntity extends Entity {
      static STATES = {
        created: 'created',
        completed: 'completed',
        expired: 'expired',
        declined: 'declined',
      };

      declinedAt?: Date;

      declineReason?: string;

      constructor(props: types.EntityType<MyEntity>) {
        super(props);
        this.setState(MyEntity.STATES.created);
      }

      @can((entity: MyEntity) => {
        entity.on('complete').ensure.is.inState('created');
      })
      complete(): void {
        this.setState(MyEntity.STATES.completed);
      }

      @can((entity: MyEntity) => {
        entity.on('expire').ensure.is.inState('created');
      })
      expire(): void {
        this.setState(MyEntity.STATES.expired);
      }

      decline(declinedAt: Date, declineReason: string): void {
        handler(declinedAt, declineReason);
        this.assign({ declinedAt, declineReason });
      }
    }

    let asserter: Asserter;

    beforeAll(() => {
      asserter = new Asserter();
      asserter.registerAssertion(new StatefulAssertion(asserter));
      asserter.registerAssertion(new AbilityAssertion(asserter));
    });

    beforeEach(() => {
      kernel.setAsserter(asserter);
    });

    afterEach(() => {
      kernel.setAsserter(undefined as any);
    });

    it(`returns true if entity can change to selected state`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      expect(entity.can.complete()).toBe(true);
      expect(entity.can.expire()).toBe(true);
    });

    it(`returns false if entity can't change to selected state`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      entity.complete();
      expect(entity.can.complete()).toBe(false);
      expect(entity.can.expire()).toBe(false);
    });

    it(`ensures that state of entity is unchanged if assertion returns true`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      expect(entity.can.complete()).toBe(true);
      expect(entity.can.expire()).toBe(true);
      expect(entity.isInState(MyEntity.STATES.created)).toBe(true);
    });

    it(`ensures that state of entity is unchanged if assertion returns false`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      entity.complete();
      expect(entity.can.expire()).toBe(false);
      expect(entity.isInState(MyEntity.STATES.completed)).toBe(true);
    });

    it(`returns true if entity can change to selected state with additional required arguments to invoked action(method)`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      const declinedAt = new Date();
      const declineReason = 'My reason';
      expect(entity.can.decline(declinedAt, declineReason)).toBe(true);
      expect(handler).toHaveBeenCalledWith(declinedAt, declineReason);
    });
  });
});

