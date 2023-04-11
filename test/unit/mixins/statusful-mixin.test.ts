import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { classes } from 'polytype';
import {
  StatusfulMixin,
  UndefinedStatusesError,
  InvalidStatusError,
} from '../../../src/mixins/statusful-mixin';

chai.use(sinonChai);

describe(`StatusfulMixin`, () => {
  class BaseClass {}

  class MyClass extends classes(BaseClass, StatusfulMixin) {
    static STATUSES = {
      pendingPayment: 'pendingPayment',
      paid: 'paid',
      refunded: 'refunded',
    };
  }

  class MyClassWithoutPredefinedStatuses extends classes(
    BaseClass,
    StatusfulMixin
  ) {}

  describe('getters', () => {
    it('returns all available statuses', () => {
      const instance = new MyClass();
      expect(instance.getSelectableStatuses()).to.be.eql({
        pendingPayment: 'pendingPayment',
        paid: 'paid',
        refunded: 'refunded',
      });
    });
  });

  describe('setters', () => {
    it(`allows to set status on instance `, () => {
      const instance = new MyClass();
      instance.setStatus(MyClass.STATUSES.pendingPayment);
      expect(instance.getStatus()).to.be.equal(MyClass.STATUSES.pendingPayment);
      instance.setStatus(MyClass.STATUSES.paid);
      expect(instance.getStatus()).to.be.equal(MyClass.STATUSES.paid);
    });

    it(`throws UndefinedStatusesError on instance with undefined statuses`, () => {
      const instance = new MyClassWithoutPredefinedStatuses();
      expect(() => instance.setStatus('my-status')).to.throw(
        UndefinedStatusesError,
        `MyClassWithoutPredefinedStatuses: statuses are not defined. Please define statuses as class(MyClass.STATUSES) property or define your getter as MyClass.prototype.getAvailableStatuses`
      );
    });
  });

  describe('evaluation', () => {
    context('single status expectation', () => {
      it(`returns true if instance is in expected status`, () => {
        const instance = new MyClass();
        instance.setStatus(MyClass.STATUSES.pendingPayment);
        expect(instance.isInStatus(MyClass.STATUSES.pendingPayment)).to.be.true;
      });

      it(`returns false if instance is not in expected status`, () => {
        const instance = new MyClass();
        expect(instance.isInStatus(MyClass.STATUSES.paid)).to.be.false;
      });

      it(`allows to pass array to isInStatus as fallback`, () => {
        const instance = new MyClass();
        instance.isInOneOfStatuses = sinon.spy(instance.isInOneOfStatuses);

        instance.isInStatus(['pendingPayment']);
        expect(instance.isInOneOfStatuses).to.be.calledOnce;
        expect(instance.isInOneOfStatuses).to.be.calledWithExactly([
          'pendingPayment',
        ]);
      });
    });

    context('one of statuses expectation', () => {
      it(`returns true if instance is one of expected status`, () => {
        const instance = new MyClass();
        instance.setStatus(MyClass.STATUSES.paid);
        expect(
          instance.isInOneOfStatuses([
            MyClass.STATUSES.paid,
            MyClass.STATUSES.refunded,
          ])
        ).to.be.true;
        expect(instance.isInOneOfStatuses(MyClass.STATUSES.paid)).to.be.true;
      });

      it(`returns false if instance is not in one of expected status`, () => {
        const instance = new MyClass();
        expect(
          instance.isInOneOfStatuses([
            MyClass.STATUSES.paid,
            MyClass.STATUSES.refunded,
          ])
        ).to.be.false;
        expect(instance.isInOneOfStatuses(MyClass.STATUSES.paid)).to.be.false;
      });
    });

    context('evaluating if status is not nil', () => {
      it(`returns true if instance has status assigned(is not nil)`, () => {
        const instance = new MyClass();
        instance.setStatus(MyClass.STATUSES.paid);
        expect(instance.hasStatus()).to.be.true;
      });

      it(`returns false if instance has no status assigned(is nil)`, () => {
        const instance = new MyClass();
        // Status is protected property, use 'hack'
        Object.defineProperty(instance, 'status', {
          value: undefined,
        });
        expect(instance.hasStatus()).to.be.false;
      });
    });
  });

  describe('validation', () => {
    it('throws InvalidStatusError when status is not in expected status(single) on instance', async () => {
      const instance = new MyClass();
      instance.setStatus(MyClass.STATUSES.pendingPayment);

      expect(() => instance.validateStatus(MyClass.STATUSES.paid)).to.throw(
        InvalidStatusError,
        `MyClass: expected current status of 'pendingPayment' to be in one of statuses: 'paid'`
      );
    });

    it('throws InvalidStatusError when status is not in one of expected statuses(array) on instance', async () => {
      const instance = new MyClass();
      instance.setStatus(MyClass.STATUSES.pendingPayment);

      expect(() =>
        instance.validateStatus([
          MyClass.STATUSES.paid,
          MyClass.STATUSES.refunded,
        ])
      ).to.throw(
        InvalidStatusError,
        `MyClass: expected current status of 'pendingPayment' to be in one of statuses: 'paid, refunded'`
      );
    });

    it('throws provided as second argument custom error when status is not in one of available statuses on instance', async () => {
      class MyError extends Error {}
      const error = new MyError();
      const instance = new MyClass();
      instance.setStatus(MyClass.STATUSES.pendingPayment);

      expect(() =>
        instance.validateStatus(
          [MyClass.STATUSES.paid, MyClass.STATUSES.refunded],
          error
        )
      ).to.throw(MyError);
    });
  });
});
