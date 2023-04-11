import { isEmpty } from 'lodash';
import { OneOf } from 'typend';
import { getTypeName } from '@eveble/helpers';
import { injectable } from '@parisholley/inversify-async';
import { kernel, ExtendableError } from '@eveble/core';

import { types } from '../types';

export class StatusError extends ExtendableError {}

export class UndefinedStatusesError extends StatusError {
  constructor(typeName: types.TypeName) {
    super(
      `${typeName}: statuses are not defined. Please define statuses as class(MyClass.STATUSES) property or define your getter as MyClass.prototype.getAvailableStatuses`
    );
  }
}

export class InvalidStatusError extends StatusError {
  constructor(
    typeName: types.TypeName,
    currentStatus: types.Status,
    expectedStatuses: types.Status
  ) {
    super(
      `${typeName}: expected current status of '${currentStatus}' to be in one of statuses: '${expectedStatuses}'`
    );
  }
}

@injectable()
export class StatusfulMixin implements types.Statusful {
  public status: types.Status;

  /**
   * Sets instance status.
   * @param status - Status to which instance should be set.
   * @throws {ValidationError}
   * Thrown if the provided status does not match one of the selectable status.
   * @throws {UndefinedStatusesError}
   * Thrown if the instance does not have any status assigned.
   */
  public setStatus(status: types.Status): void {
    const selectableStatuses = this.getSelectableStatuses();
    if (isEmpty(selectableStatuses)) {
      const typeName: types.TypeName = getTypeName(
        this.constructor
      ) as types.TypeName;
      throw new UndefinedStatusesError(typeName);
    }

    const oneOfSelectableStatuses: types.Status[] =
      Object.values(selectableStatuses);

    if (kernel.isValidating()) {
      const pattern = new OneOf(...oneOfSelectableStatuses);
      kernel.validator.validate(status, pattern);
    }

    this.status = status;
  }

  /**
   * Evaluates if target is in expected status.
   * @param status - Expected status in which instance should be.
   * @returns Returns `true` if instance is in status, else `false`.
   */
  public isInStatus(status: types.Status | types.Status[]): boolean {
    if (Array.isArray(status)) {
      return this.isInOneOfStatuses(status);
    }
    return this.status === status;
  }

  /**
   * Evaluates if target is in one of expected status.
   * @param status - Expected status in which one of instance should be.
   * @returns Returns true if instance is in one of status, else false.
   */
  public isInOneOfStatuses(status: types.Status | types.Status[]): boolean {
    const expectedStatuses: types.Status[] = Array.isArray(status)
      ? status
      : [status];
    return expectedStatuses.includes(this.status);
  }

  /**
   * Returns current status of instance.
   * @returns Current status of instance as `string`.
   */
  public getStatus(): types.Status {
    return this.status;
  }

  /**
   * Evaluates if target has status set on instance(is not `nil`).
   * @returns Returns `true` if instance has status set(not `nil`), else `false`.
   */
  public hasStatus(): boolean {
    return this.status != null;
  }

  /**
   * Validates if instance is in allowed status(s).
   * @param  statusOrStatuses - Expected status list in one of which instance should be.
   * @param error - Optional error instance for case where status does not match expected one.
   * @returns Returns `true` if instance is in correct status, else throws.
   * @throws {InvalidStatusError}
   * Thrown if target is not in correct(one of allowed) status.
   */
  public validateStatus(
    statusOrStatuses: types.Status | types.Status[],
    error?: Error
  ): boolean {
    const expectedStatuses: types.Status[] = Array.isArray(statusOrStatuses)
      ? statusOrStatuses
      : [statusOrStatuses];

    if (!this.isInOneOfStatuses(expectedStatuses)) {
      if (error !== undefined) {
        throw error;
      }
      const typeName: types.TypeName = getTypeName(
        this.constructor
      ) as types.TypeName;
      throw new InvalidStatusError(
        typeName,
        this.status,
        expectedStatuses.join(', ')
      );
    }
    return true;
  }

  /**
   * Returns all selectable status.
   * @returns Collection of available status.
   */
  public getSelectableStatuses(): Record<string, types.Status> {
    return (this.constructor as any).STATUSES;
  }
}
