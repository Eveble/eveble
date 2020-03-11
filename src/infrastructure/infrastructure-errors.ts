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

@define('EventsNotFoundError')
export class EventsNotFoundError extends InfrastructureError {
  constructor(EventSourceableTypeName: string, id: string) {
    super(
      `No events found for event sourceable '${EventSourceableTypeName}' with id '${id}'`
    );
  }
}

@define('AddingCommitFailedError')
export class AddingCommitFailedError extends InfrastructureError {
  constructor(storageName: string, commitId: string, appId: string) {
    super(
      `${storageName}: adding commit with id '${commitId}' failed on '${appId}'`
    );
  }
}

@define('UpdatingCommitError')
export class UpdatingCommitError extends InfrastructureError {
  constructor(storageName: string, commitId: string, appId: string) {
    super(
      `${storageName}: updating commit with id '${commitId}' failed on '${appId}'`
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

/*
SNAPSHOOTING ERRORS
*/
@define('SnapshotterError')
class SnapshotterError extends InfrastructureError {}

@define('UndefinedSnapshotterFrequencyError')
export class UndefinedSnapshotterFrequencyError extends SnapshotterError {
  constructor() {
    super(
      `Missing snapshotting frequency on configuration with path: 'eveble.Snapshotter.frequency'`
    );
  }
}

@define('UndefinedSnapshotterError')
export class UndefinedSnapshotterError extends InfrastructureError {
  constructor() {
    super(`Snapshotter is not defined on EventSourceableRepository`);
  }
}
