import { ExtendableError } from '@eveble/core';

/**
 * HANDLING ERRORS
 */
export class HandlingError extends ExtendableError {}

export class UnhandleableTypeError extends HandlingError {
  constructor(className: string, handleableTypes: string, got: string) {
    super(`${className}: type must be one of: ${handleableTypes}; got ${got}`);
  }
}

export class InvalidControllerError extends HandlingError {
  constructor(className: string) {
    super(`${className}: provided class must implement Controller interface`);
  }
}

export class InvalidHandlerError extends HandlingError {
  constructor(className: string, type: string, got: string) {
    super(
      `${className}: provided handler for '${type}' must be a function, got ${got}`
    );
  }
}

export class HandlerExistError extends HandlingError {
  constructor(className: string, type: string) {
    super(`${className}: handler for '${type}' already exists`);
  }
}

export class HandlerNotFoundError extends HandlingError {
  constructor(className: string, type: string) {
    super(`${className}: handler for type '${type}' can't be found`);
  }
}

export class UnsupportedExecutionTypeError extends HandlingError {
  constructor(className: string, execution: string) {
    super(
      `${className}: execution type '${execution}' is not supported on controller`
    );
  }
}

export class InvalidMessageableType extends HandlingError {
  constructor(got: string) {
    super(`Type '${got}' must implement Messageable interface`);
  }
}

export class InitializingMessageAlreadyExistsError extends HandlingError {
  constructor(className: string, existingMsgName: string, newMsgName: string) {
    super(
      `${className}: trying to override already existing initializing message with '${newMsgName}'. Remove annotation '@initial' from '${existingMsgName}' beforehand`
    );
  }
}

/**
 * SERIALIZATION ERRORS
 */
export class SerializationError extends ExtendableError {}

export class UnparsableValueError extends SerializationError {
  constructor(got: string) {
    super(`Value must be parsable string, got ${got}`);
  }
}
