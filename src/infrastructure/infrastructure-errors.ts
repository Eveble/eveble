import { define } from '../decorators/define';
import { SerializableError } from '../components/serializable-error';

@define('InfrastructureError')
export class InfrastructureError extends SerializableError {}

/*
PERSISTANCE ERRORS
*/
@define('CommitConcurrencyError')
export class CommitConcurrencyError extends InfrastructureError {
  constructor(
    eventSourceableType: string,
    id: string,
    expectedVersion: string,
    currentVersion: string
  ) {
    super(
      `${eventSourceableType}: expected event sourceable with id of '${id}' to be at version ${expectedVersion} but is at version ${currentVersion}`
    );
  }
}

/*
ROUTER ERRORS
*/
@define('RouterError')
export class RouterError extends InfrastructureError {}

@define('MissingEventSourceableError')
export class MissingEventSourceableError extends RouterError {
  constructor(routerName: string) {
    super(
      `${routerName}: please specify property Router.prototype.EventSourceableType as EventSourceable class to be managed by the router`
    );
  }
}

@define('MissingInitializingMessageError')
export class MissingInitializingMessageError extends RouterError {
  constructor(routerName: string) {
    super(
      `${routerName}: please specify property Router.prototype.InitializingMessageType(as command or event class) that will be used to create new instances of the managed EventSourceable`
    );
  }
}

@define('CannotRouteMessageError')
export class CannotRouteMessageError extends RouterError {
  constructor(routerName: string, messageTypeName: string) {
    super(
      `${routerName}: no event sourceable found to handle '${messageTypeName}'`
    );
  }
}

@define('UnresolvableIdentifierFromMessageError')
export class UnresolvableIdentifierFromMessageError extends RouterError {
  constructor(routerName: string, eventTypeName: string, esTypeName: string) {
    super(
      `${routerName}: message '${eventTypeName}' is not a valid initializing or handleable message for '${esTypeName}'`
    );
  }
}
