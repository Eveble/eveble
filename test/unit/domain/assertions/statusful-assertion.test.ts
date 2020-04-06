import { stubInterface } from 'ts-sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import {
  StatusfulAssertion,
  InvalidStatusTransitionError,
} from '../../../../src/domain/assertions/statusful-assertion';
import { types } from '../../../../src/types';
import { DomainError } from '../../../../src/domain/domain-error';
import { UndefinedActionError } from '../../../../src/domain/domain-errors';

chai.use(sinonChai);

describe(`StatusfulAssertion`, () => {
  let entity: any;
  let asserter: any;

  beforeEach(() => {
    entity = stubInterface<types.Entity>();
    asserter = stubInterface<types.Asserter>();

    asserter.getEntity.returns(entity);
    asserter.getAction.returns('my-action');
    asserter.hasAction.returns(true);
    entity.getTypeName.returns('MyTypeName');
    entity.getId.returns('my-id');
  });

  class MyError extends DomainError {}

  describe('extends asserter API', () => {
    it('ensure.is.inStatus', () => {
      const assertion = new StatusfulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.inStatus')).to.be.equal(
        assertion.ensureIsInStatus
      );
    });

    it('ensure.is.not.inStatus', () => {
      const assertion = new StatusfulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.not.inStatus')).to.be.equal(
        assertion.ensureIsNotInStatus
      );
    });

    it('ensure.is.inOneOfStatuses', () => {
      const assertion = new StatusfulAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.inOneOfStatuses')).to.be.equal(
        assertion.ensureIsInOneOfStatuses
      );
    });

    it('ensure.is.not.inOneOfStatuses', () => {
      const assertion = new StatusfulAssertion(asserter);
      expect(
        assertion.getApi().get('ensure.is.not.inOneOfStatuses')
      ).to.be.equal(assertion.ensureIsNotInOneOfStatuses);
    });
  });

  describe('ensures expected status', () => {
    describe('ensureIsInStatus', () => {
      it('returns Asserter instance if entity is in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.returns(true);
        const expectedStatus = 'expected-status';
        expect(assertion.ensureIsInStatus(expectedStatus)).to.be.equal(
          asserter
        );
        expect(entity.isInStatus).to.be.calledOnce;
        expect(entity.isInStatus).to.be.calledWithExactly(expectedStatus);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.returns(false);
        asserter.hasAction.returns(false);

        expect(() => assertion.ensureIsInStatus('expected-status')).to.throw(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.inStatus'. Please define action by using 'entity.on('action-name-as-string').ensure.is.inStatus(...)' or 'entity.on(MyCommandType).ensure.ensure.is.inStatus(...)`
        );
      });

      it('throws InvalidStatusTransitionError if entity is not in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.returns(false);
        const currentStatus = 'current-status';
        entity.getStatus.returns(currentStatus);

        const expectedStatus = 'expected-status';
        expect(() => assertion.ensureIsInStatus(expectedStatus)).to.throw(
          InvalidStatusTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-status' status(expected statuses: 'expected-status')`
        );
        expect(entity.isInStatus).to.be.calledOnce;
        expect(entity.isInStatus).to.be.calledWithExactly(expectedStatus);
      });

      it('allows to pass custom error if entity is not in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.returns(false);
        const currentStatus = 'current-status';
        entity.getStatus.returns(currentStatus);

        const error = new MyError('my-error');
        const expectedStatus = 'expected-status';
        expect(() =>
          assertion.ensureIsInStatus(expectedStatus, error)
        ).to.throw(error);
        expect(entity.isInStatus).to.be.calledOnce;
        expect(entity.isInStatus).to.be.calledWithExactly(expectedStatus);
      });
    });

    describe('ensureIsNotInStatus', () => {
      it('returns Asserter instance if entity is not in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.returns(false);
        const expectedStatus = 'expected-status';
        expect(assertion.ensureIsNotInStatus(expectedStatus)).to.be.equal(
          asserter
        );
        expect(entity.isInStatus).to.be.calledOnce;
        expect(entity.isInStatus).to.be.calledWithExactly(expectedStatus);
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.returns(true);
        asserter.hasAction.returns(false);

        expect(() => assertion.ensureIsNotInStatus('expected-status')).to.throw(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.not.inStatus'. Please define action by using 'entity.on('action-name-as-string').ensure.is.not.inStatus(...)' or 'entity.on(MyCommandType).ensure.ensure.is.not.inStatus(...)`
        );
      });

      it('throws InvalidStatusTransitionError if entity is in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.returns(true);
        const currentStatus = 'current-status';
        entity.getStatus.returns(currentStatus);

        const expectedStatus = 'expected-status';
        expect(() => assertion.ensureIsNotInStatus(expectedStatus)).to.throw(
          InvalidStatusTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-status' status(expected statuses: 'expected-status')`
        );
        expect(entity.isInStatus).to.be.calledOnce;
        expect(entity.isInStatus).to.be.calledWithExactly(expectedStatus);
      });

      it('allows to pass custom error if entity is in status', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInStatus.returns(true);
        const currentStatus = 'current-status';
        entity.getStatus.returns(currentStatus);

        const error = new MyError('my-error');
        const expectedStatus = 'expected-status';
        expect(() =>
          assertion.ensureIsNotInStatus(expectedStatus, error)
        ).to.throw(error);
        expect(entity.isInStatus).to.be.calledOnce;
        expect(entity.isInStatus).to.be.calledWithExactly(expectedStatus);
      });
    });

    describe('ensureIsInOneOfStatuses', () => {
      it('returns Asserter instance if entity is in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.returns(true);
        const expectedStatuses = ['first', 'second'];
        expect(assertion.ensureIsInOneOfStatuses(expectedStatuses)).to.be.equal(
          asserter
        );
        expect(entity.isInOneOfStatuses).to.be.calledOnce;
        expect(entity.isInOneOfStatuses).to.be.calledWithExactly(
          expectedStatuses
        );
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.returns(false);
        asserter.hasAction.returns(false);

        expect(() =>
          assertion.ensureIsInOneOfStatuses(['expected-status'])
        ).to.throw(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.inOneOfStatuses'. Please define action by using 'entity.on('action-name-as-string').ensure.is.inOneOfStatuses(...)' or 'entity.on(MyCommandType).ensure.ensure.is.inOneOfStatuses(...)`
        );
      });

      it('throws InvalidStatusTransitionError if entity is not in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.returns(false);
        const currentStatus = 'current-status';
        entity.getStatus.returns(currentStatus);

        const expectedStatuses = ['first', 'second'];
        expect(() =>
          assertion.ensureIsInOneOfStatuses(expectedStatuses)
        ).to.throw(
          InvalidStatusTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-status' status(expected statuses: 'first, second')`
        );
        expect(entity.isInOneOfStatuses).to.be.calledOnce;
        expect(entity.isInOneOfStatuses).to.be.calledWithExactly(
          expectedStatuses
        );
      });

      it('allows to pass custom error if entity is not in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.returns(false);
        const currentStatus = 'current-status';
        entity.getStatus.returns(currentStatus);

        const error = new MyError('my-error');
        const expectedStatuses = ['first', 'second'];
        expect(() =>
          assertion.ensureIsInOneOfStatuses(expectedStatuses, error)
        ).to.throw(error);
        expect(entity.isInOneOfStatuses).to.be.calledOnce;
        expect(entity.isInOneOfStatuses).to.be.calledWithExactly(
          expectedStatuses
        );
      });
    });

    describe('ensureIsNotInOneOfStatuses', () => {
      it('returns Asserter instance if entity is not in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.returns(false);
        const expectedStatuses = ['first', 'second'];
        expect(
          assertion.ensureIsNotInOneOfStatuses(expectedStatuses)
        ).to.be.equal(asserter);
        expect(entity.isInOneOfStatuses).to.be.calledOnce;
        expect(entity.isInOneOfStatuses).to.be.calledWithExactly(
          expectedStatuses
        );
      });

      it('throws UndefinedActionError if action is not set on asserter', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.returns(true);
        asserter.hasAction.returns(false);

        expect(() =>
          assertion.ensureIsNotInOneOfStatuses(['expected-status'])
        ).to.throw(
          UndefinedActionError,
          `MyTypeName: action name is not set while using assertion 'ensure.is.not.inOneOfStatuses'. Please define action by using 'entity.on('action-name-as-string').ensure.is.not.inOneOfStatuses(...)' or 'entity.on(MyCommandType).ensure.ensure.is.not.inOneOfStatuses(...)`
        );
      });

      it('throws InvalidStatusTransitionError if entity is in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.returns(true);
        const currentStatus = 'current-status';
        entity.getStatus.returns(currentStatus);

        const expectedStatuses = ['first', 'second'];
        expect(() =>
          assertion.ensureIsNotInOneOfStatuses(expectedStatuses)
        ).to.throw(
          InvalidStatusTransitionError,
          `MyTypeName: cannot 'my-action' when in 'current-status' status(expected statuses: 'first, second')`
        );
        expect(entity.isInOneOfStatuses).to.be.calledOnce;
        expect(entity.isInOneOfStatuses).to.be.calledWithExactly(
          expectedStatuses
        );
      });

      it('allows to pass custom error if entity is in one of statuses', () => {
        const assertion = new StatusfulAssertion(asserter);
        entity.isInOneOfStatuses.returns(true);
        const currentStatus = 'current-status';
        entity.getStatus.returns(currentStatus);

        const error = new MyError('my-error');
        const expectedStatuses = ['first', 'second'];
        expect(() =>
          assertion.ensureIsNotInOneOfStatuses(expectedStatuses, error)
        ).to.throw(error);
        expect(entity.isInOneOfStatuses).to.be.calledOnce;
        expect(entity.isInOneOfStatuses).to.be.calledWithExactly(
          expectedStatuses
        );
      });
    });
  });
});
