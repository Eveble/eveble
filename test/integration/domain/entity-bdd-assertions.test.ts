import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { pull } from 'lodash';
import {
  StatefulAssertion,
  InvalidStateTransitionError,
} from '../../../src/domain/assertions/stateful-assertion';
import { define } from '../../../src/decorators/define';
import { Entity } from '../../../src/domain/entity';

import { Asserter } from '../../../src/domain/asserter';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';
import {
  StatusfulAssertion,
  InvalidStatusTransitionError,
} from '../../../src/domain/assertions/statusful-assertion';
import { kernel } from '../../../src/core/kernel';
import { ValueObject } from '../../../src/domain/value-object';

chai.use(sinonChai);

describe(`Entity BDD assertions`, function () {
  describe(`validating state assertion`, () => {
    @define('MyEntity', { isRegistrable: false })
    class MyEntity extends Entity {
      static STATES = {
        first: 'first',
        second: 'second',
        third: 'third',
      };

      static STATUSES = {};
    }

    let asserter: Asserter;

    before(() => {
      asserter = new Asserter();
      asserter.registerAssertion(new StatefulAssertion(asserter));
    });

    beforeEach(() => {
      kernel.setAsserter(asserter);
    });

    afterEach(() => {
      kernel.setAsserter(undefined as any);
    });

    context('single state validation', () => {
      describe('evaluating state', () => {
        it(`returns true if entity is in expected state`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setState(MyEntity.STATES.first);
          expect(entity.isInState(MyEntity.STATES.first)).to.be.true;
          entity.setState(MyEntity.STATES.second);
          expect(entity.isInState(MyEntity.STATES.second)).to.be.true;
        });

        it(`returns false if entity is not in expected state`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setState(MyEntity.STATES.first);
          expect(entity.isInState(MyEntity.STATES.second)).to.be.false;
          entity.setState(MyEntity.STATES.second);
          expect(entity.isInState(MyEntity.STATES.third)).to.be.false;
        });
      });

      describe('ensuring state correctness', () => {
        context('positive ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is in expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-state')
                .ensure.is.inState(MyEntity.STATES.first)
            ).to.not.throw(InvalidStateTransitionError);
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
            ).to.throw(
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
            ).to.throw(error);
          });
        });

        context('negative ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is NOT in expected state`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setState(MyEntity.STATES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-state')
                .ensure.is.not.inState(MyEntity.STATES.second)
            ).to.not.throw(InvalidStateTransitionError);
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
            ).to.throw(
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
            ).to.throw(error);
          });
        });
      });
    });

    context('multiple states validation', () => {
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
          ).to.be.true;
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
          ).to.be.false;
        });
      });

      describe('ensuring state correctness', () => {
        context('positive ensurement', () => {
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
            ).to.not.throw(InvalidStateTransitionError);
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
            ).to.throw(
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
            ).to.throw(error);
          });
        });

        context('negative ensurement', () => {
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
            ).to.not.throw(InvalidStateTransitionError);
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
            ).to.throw(
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
            ).to.throw(error);
          });
        });
      });
    });
  });

  describe(`validating status assertion`, () => {
    @define('MyEntity', { isRegistrable: false })
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

    before(() => {
      asserter = new Asserter();
      asserter.registerAssertion(new StatusfulAssertion(asserter));
    });
    beforeEach(() => {
      kernel.setAsserter(asserter);
    });

    afterEach(() => {
      kernel.setAsserter(undefined as any);
    });
    context('single status validation', () => {
      describe('evaluating status', () => {
        it(`returns true if entity is in expected status`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setStatus(MyEntity.STATUSES.first);
          expect(entity.isInStatus(MyEntity.STATUSES.first)).to.be.true;
          entity.setStatus(MyEntity.STATUSES.second);
          expect(entity.isInStatus(MyEntity.STATUSES.second)).to.be.true;
        });

        it(`returns false if entity is not in expected status`, () => {
          const entity = new MyEntity({
            id: 'my-id',
          });
          entity.setStatus(MyEntity.STATUSES.first);
          expect(entity.isInStatus(MyEntity.STATUSES.second)).to.be.false;
          entity.setStatus(MyEntity.STATUSES.second);
          expect(entity.isInStatus(MyEntity.STATUSES.third)).to.be.false;
        });
      });

      describe('ensuring status correctness', () => {
        context('positive ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is in expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-status')
                .ensure.is.inStatus(MyEntity.STATUSES.first)
            ).to.not.throw(InvalidStatusTransitionError);
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
            ).to.throw(
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
            ).to.throw(error);
          });
        });

        context('negative ensurement', () => {
          it(`does not throw InvalidStateTransitionError if entity is NOT in expected status`, () => {
            const entity = new MyEntity({
              id: 'my-id',
            });
            entity.setStatus(MyEntity.STATUSES.first);
            expect(() =>
              entity
                .on('ensure-is-in-first-status')
                .ensure.is.not.inStatus(MyEntity.STATUSES.second)
            ).to.not.throw(InvalidStatusTransitionError);
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
            ).to.throw(
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
            ).to.throw(error);
          });
        });
      });
    });

    context('multiple statuses validation', () => {
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
          ).to.be.true;
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
          ).to.be.false;
        });
      });

      describe('ensuring status correctness', () => {
        context('positive ensurement', () => {
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
            ).to.not.throw(InvalidStatusTransitionError);
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
            ).to.throw(
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
            ).to.throw(error);
          });
        });

        context('negative ensurement', () => {
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
            ).to.not.throw(InvalidStatusTransitionError);
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
            ).to.throw(
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
            ).to.throw(error);
          });
        });
      });
    });
  });

  describe(`ability validating assertions`, () => {
    const handler = sinon.stub();

    @define('MyEntity', { isRegistrable: false })
    class MyEntity extends Entity {
      static STATES = {
        created: 'created',
        accepted: 'accepted',
        started: 'started',
        declined: 'declined',
      };

      declinedAt?: Date;

      declineReason?: string;

      constructor(props: Partial<MyEntity>) {
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

    @define('Price', { isRegistrable: false })
    class Price extends ValueObject {
      value: number;
    }

    @define('Item', { isRegistrable: false })
    class Item extends Entity {
      price: Price;
    }

    @define('Order', { isRegistrable: false })
    class Order extends Entity {
      items: Item[];

      removeItem(item: Item): void {
        pull(this.items, item);
      }
    }

    let asserter: Asserter;

    before(() => {
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
      expect(() => entity.ensure.is.ableTo.start()).to.throw(
        InvalidStateTransitionError,
        `MyEntity: cannot 'start' when in 'created' state(expected states: 'accepted')`
      );
    });

    it(`ensures that state of entity is unchanged if error is not thrown upon validation`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      expect(() => entity.ensure.is.ableTo.start()).to.throw(
        InvalidStateTransitionError,
        `MyEntity: cannot 'start' when in 'created' state(expected states: 'accepted')`
      );
      expect(entity.isInState(MyEntity.STATES.created)).to.be.true;
    });

    it(`allows to pass all required arguments to invoked action(method)`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      const declinedAt = new Date();
      const declineReason = 'My reason';

      entity.ensure.is.ableTo.decline(declinedAt, declineReason);
      expect(handler).to.be.calledWithExactly(declinedAt, declineReason);
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
      expect(item).to.be.instanceof(Item);
      expect(item).to.be.eql(itemProps);
      expect(order.items).to.be.empty;
    });
  });

  describe(`ability evaluation assertions`, () => {
    const handler = sinon.stub();

    @define('MyEntity', {
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

      constructor(props: Partial<MyEntity>) {
        super(props);
        this.setState(MyEntity.STATES.created);
      }

      complete(): void {
        this.on('complete').ensure.is.inState('created');
        this.setState(MyEntity.STATES.completed);
      }

      expire(): void {
        this.on('expire').ensure.is.inState('created');
        this.setState(MyEntity.STATES.expired);
      }

      decline(declinedAt: Date, declineReason: string): void {
        handler(declinedAt, declineReason);
        this.assign({ declinedAt, declineReason });
      }
    }

    let asserter: Asserter;

    before(() => {
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
      expect(entity.can.complete()).to.be.true;
      expect(entity.can.expire()).to.be.true;
    });

    it(`returns false if entity can't change to selected state`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      entity.complete();
      expect(entity.can.complete()).to.be.false;
      expect(entity.can.expire()).to.be.false;
    });

    it(`ensures that state of entity is unchanged if assertion returns true`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      expect(entity.can.complete()).to.be.true;
      expect(entity.can.expire()).to.be.true;
      expect(entity.isInState(MyEntity.STATES.created)).to.be.true;
    });

    it(`ensures that state of entity is unchanged if assertion returns false`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      entity.complete();
      expect(entity.can.expire()).to.be.false;
      expect(entity.isInState(MyEntity.STATES.completed)).to.be.true;
    });

    it(`returns true if entity can change to selected state with additional required arguments to invoked action(method)`, () => {
      const entity = new MyEntity({ id: 'my-id' });
      const declinedAt = new Date();
      const declineReason = 'My reason';
      expect(entity.can.decline(declinedAt, declineReason)).to.be.true;
      expect(handler).to.be.calledWithExactly(declinedAt, declineReason);
    });
  });
});
