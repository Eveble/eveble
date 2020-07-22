import { ExtendableError } from '@eveble/core';

/*
  MODULE ERRORS
*/
export class ModuleError extends ExtendableError {}

export class AppMissingError extends ModuleError {
  constructor() {
    super(`Instance of App is required to initialize module`);
  }
}

export class InjectorMissingError extends ModuleError {
  constructor() {
    super(`Instance of Injector is required to initialize module`);
  }
}

export class InvalidModuleError extends ModuleError {
  constructor(className: string, got: string) {
    super(
      `${className}: dependent modules must be instance of Module, got ${got}`
    );
  }
}

export class InvalidConfigError extends ModuleError {
  constructor(className: string, got: string) {
    super(
      `${className}: configuration must be an instance implementing Configurable interface, got ${got}`
    );
  }
}

export class InvalidEnvironmentError extends ModuleError {
  constructor(action: string, currentEnv: string) {
    super(`Trying to run action '${action}' on '${currentEnv}' environment`);
  }
}

/*
INJECTOR ERRORS
*/
export class InjectorError extends ExtendableError {}

export class InvalidEventSourceableError extends InjectorError {
  constructor(got) {
    super(
      `Injector: expected EventSourceableType to be constructor type of EventSourceable, got ${got}`
    );
  }
}

/*
APP ERRORS
*/
export class AppError extends ExtendableError {}

export class InvalidAppConfigError extends AppError {
  constructor(got: string) {
    super(
      `Configuration provided for application must be an instance of AppConfig, got ${got}`
    );
  }
}

/*
LOGGING ERRORS
*/
export class LoggingError extends ExtendableError {}

export class InvalidTransportIdError extends LoggingError {
  constructor(got: string) {
    super(`Expected id argument to be string, got ${got}`);
  }
}
export class TransportExistsError extends LoggingError {
  constructor(id: string) {
    super(
      `Transport with id '${id}' would be overridden. To override existing mapping use <Logger.prototype.overrideTransport>`
    );
  }
}
