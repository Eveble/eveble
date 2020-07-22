import { define } from '@eveble/core';
import { SerializableError } from '../components/serializable-error';

@define('InfrastructureError')
export class InfrastructureError extends SerializableError {}

/*
PERSISTENCE ERRORS
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

@define('AddingSnapshotError')
export class AddingSnapshotError extends InfrastructureError {
  constructor(
    storageName: string,
    EventSourceableTypeName: string,
    eventSourceableId: string
  ) {
    super(
      `${storageName}: adding snapshot for event sourceable '${EventSourceableTypeName}' with id '${eventSourceableId}' failed`
    );
  }
}
@define('UpdatingSnapshotError')
export class UpdatingSnapshotError extends InfrastructureError {
  constructor(
    storageName: string,
    EventSourceableTypeName: string,
    eventSourceableId: string
  ) {
    super(
      `${storageName}: updating snapshot for event sourceable '${EventSourceableTypeName}' with id '${eventSourceableId}' failed`
    );
  }
}

@define('StorageNotFoundError')
export class StorageNotFoundError extends InfrastructureError {
  constructor(storageName: string, clientType: string) {
    super(
      `${storageName}: storage for client type '${clientType}' was not found`
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

/*
PROJECTION ERRORS
*/
@define('ProjectionRebuildingError')
export class ProjectionRebuildingError extends InfrastructureError {}

@define('ProjectionAlreadyRebuildingError')
export class ProjectionAlreadyRebuildingError extends ProjectionRebuildingError {
  constructor(projectionName: string) {
    super(`Projection '${projectionName}' is already being rebuilt`);
  }
}

@define('ProjectionNotRebuildingError')
export class ProjectionNotRebuildingError extends ProjectionRebuildingError {
  constructor(projectionName: string) {
    super(
      `Expected projection '${projectionName}' to be in a state of rebuilding`
    );
  }
}

/*
CLIENT ERRORS
*/
@define('ClientError')
export class ClientError extends InfrastructureError {}

@define('InactiveClientError')
export class InactiveClientError extends ClientError {
  constructor(targetName: string, clientId: string) {
    super(
      `${targetName}: can't be initialized since underlying client with id '${clientId}' is inactive`
    );
  }
}

/*
SCHEDULER ERRORS
*/
@define('SchedulerError')
export class SchedulerError extends InfrastructureError {}

@define('CommandSchedulingError')
export class CommandSchedulingError extends SchedulerError {
  constructor(
    jobName: string,
    assignmentId: string,
    assignerType: string,
    assignerId: string,
    error: string
  ) {
    super(
      `${jobName}: cannot schedule command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`
    );
  }
}

@define('CommandUnschedulingError')
export class CommandUnschedulingError extends SchedulerError {
  constructor(
    jobName: string,
    assignmentId: string,
    assignerType: string,
    assignerId: string,
    error: string
  ) {
    super(
      `${jobName}: cannot cancel command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`
    );
  }
}
