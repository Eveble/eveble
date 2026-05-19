import { expect, describe, it, vi } from 'vitest';

import { derive } from '@traits-ts/core';
import {
  StatusfulTrait,
  UndefinedStatusesError,
  InvalidStatusError,
} from '../../../src/traits/statusful.trait';

describe(`StatusfulTrait`, () => {
  class MyClass extends derive(StatusfulTrait) {
    static STATUSES = {
      pendingPayment: 'pendingPayment',
      paid: 'paid',
      refunded: 'refunded',
    };
  }

  class MyClassWithoutPredefinedStatuses extends derive(StatusfulTrait) {}

  describe('getters', () => {
    it('returns all available statuses', () => {
      const instance = new MyClass();
      expect(instance.getSelectableStatuses()).toEqual({
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
      expect(instance.getStatus()).toBe(MyClass.STATUSES.pendingPayment);
      instance.setStatus(MyClass.STATUSES.paid);
      expect(instance.getStatus()).toBe(MyClass.STATUSES.paid);
    });

    it(`throws UndefinedStatusesError on instance with undefined statuses`, () => {
      const instance = new MyClassWithoutPredefinedStatuses();
      expect(() => instance.setStatus('my-status')).toThrow(
        UndefinedStatusesError,
        `MyClassWithoutPredefinedStatuses: statuses are not defined. Please define statuses as class(MyClass.STATUSES) property or define your getter as MyClass.prototype.getAvailableStatuses`
      );
    });
  });

  describe('evaluation', () => {
    describe('single status expectation', () => {
      it(`returns true if instance is in expected status`, () => {
        const instance = new MyClass();
        instance.setStatus(MyClass.STATUSES.pendingPayment);
        expect(instance.isInStatus(MyClass.STATUSES.pendingPayment)).toBe(true);
      });

      it(`returns false if instance is not in expected status`, () => {
        const instance = new MyClass();
        expect(instance.isInStatus(MyClass.STATUSES.paid)).toBe(false);
      });

      it(`allows to pass array to isInStatus as fallback`, () => {
        const instance = new MyClass();
        instance.isInOneOfStatuses = vi.fn();

        instance.isInStatus(['pendingPayment']);
        expect(instance.isInOneOfStatuses).toHaveBeenCalledTimes(1);
        expect(instance.isInOneOfStatuses).toHaveBeenCalledWith([
          'pendingPayment',
        ]);
      });
    });

    describe('one of statuses expectation', () => {
      it(`returns true if instance is one of expected status`, () => {
        const instance = new MyClass();
        instance.setStatus(MyClass.STATUSES.paid);
        expect(
          instance.isInOneOfStatuses([
            MyClass.STATUSES.paid,
            MyClass.STATUSES.refunded,
          ])
        ).toBe(true);
        expect(instance.isInOneOfStatuses(MyClass.STATUSES.paid)).toBe(true);
      });

      it(`returns false if instance is not in one of expected status`, () => {
        const instance = new MyClass();
        expect(
          instance.isInOneOfStatuses([
            MyClass.STATUSES.paid,
            MyClass.STATUSES.refunded,
          ])
        ).toBe(false);
        expect(instance.isInOneOfStatuses(MyClass.STATUSES.paid)).toBe(false);
      });
    });

    describe('evaluating if status is not nil', () => {
      it(`returns true if instance has status assigned(is not nil)`, () => {
        const instance = new MyClass();
        instance.setStatus(MyClass.STATUSES.paid);
        expect(instance.hasStatus()).toBe(true);
      });

      it(`returns false if instance has no status assigned(is nil)`, () => {
        const instance = new MyClass();
        // Status is protected property, use 'hack'
        Object.defineProperty(instance, 'status', {
          value: undefined,
        });
        expect(instance.hasStatus()).toBe(false);
      });
    });
  });

  describe('validation', () => {
    it('throws InvalidStatusError when status is not in expected status(single) on instance', async () => {
      const instance = new MyClass();
      instance.setStatus(MyClass.STATUSES.pendingPayment);

      expect(() => instance.validateStatus(MyClass.STATUSES.paid)).toThrow(
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
      ).toThrow(
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
      ).toThrow(MyError);
    });
  });
});
