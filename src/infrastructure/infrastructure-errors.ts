import { Type } from '@eveble/core';
import { SerializableError } from '../components/serializable-error';

@Type('InfrastructureError')
export class InfrastructureError extends SerializableError {}

/*
PERSISTENCE ERRORS
*/
@Type('CommitConcurrencyError')
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

@Type('EventsNotFoundError')
export class EventsNotFoundError extends InfrastructureError {
  constructor(EventSourceableTypeName: string, id: string) {
    super(
      `No events found for event sourceable '${EventSourceableTypeName}' with id '${id}'`
    );
  }
}

@Type('AddingCommitFailedError')
export class AddingCommitFailedError extends InfrastructureError {
  constructor(storageName: string, commitId: string, appId: string) {
    super(
      `${storageName}: adding commit with id '${commitId}' failed on '${appId}'`
    );
  }
}

@Type('UpdatingCommitError')
export class UpdatingCommitError extends InfrastructureError {
  constructor(storageName: string, commitId: string, appId: string) {
    super(
      `${storageName}: updating commit with id '${commitId}' failed on '${appId}'`
    );
  }
}

@Type('AddingSnapshotError')
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
@Type('UpdatingSnapshotError')
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

@Type('StorageNotFoundError')
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
@Type('RouterError')
export class RouterError extends InfrastructureError {}

@Type('MissingEventSourceableError')
export class MissingEventSourceableError extends RouterError {
  constructor(routerName: string) {
    super(
      `${routerName}: please specify property Router.prototype.EventSourceableType as EventSourceable class to be managed by the router`
    );
  }
}

@Type('MissingInitializingMessageError')
export class MissingInitializingMessageError extends RouterError {
  constructor(routerName: string) {
    super(
      `${routerName}: please specify property Router.prototype.InitializingMessageType(as command or event class) that will be used to create new instances of the managed EventSourceable`
    );
  }
}

@Type('CannotRouteMessageError')
export class CannotRouteMessageError extends RouterError {
  constructor(routerName: string, messageTypeName: string) {
    super(
      `${routerName}: no event sourceable found to handle '${messageTypeName}'`
    );
  }
}

@Type('UnresolvableIdentifierFromMessageError')
export class UnresolvableIdentifierFromMessageError extends RouterError {
  constructor(routerName: string, eventTypeName: string, esTypeName: string) {
    super(
      `${routerName}: message '${eventTypeName}' is not a valid initializing or handleable message for '${esTypeName}'`
    );
  }
}

@Type('InitializingIdentifierAlreadyExistsError')
export class InitializingIdentifierAlreadyExistsError extends RouterError {
  constructor(routerName: string, id: string) {
    super(`${routerName}: provided identifier ${id} is already in use`);
  }
}

/*
SNAPSHOOTING ERRORS
*/
@Type('SnapshotterError')
class SnapshotterError extends InfrastructureError {}

@Type('UndefinedSnapshotterFrequencyError')
export class UndefinedSnapshotterFrequencyError extends SnapshotterError {
  constructor() {
    super(
      `Missing snapshotting frequency on configuration with path: 'eveble.Snapshotter.frequency'`
    );
  }
}

@Type('UndefinedSnapshotterError')
export class UndefinedSnapshotterError extends InfrastructureError {
  constructor() {
    super(`Snapshotter is not defined on EventSourceableRepository`);
  }
}

/*
PROJECTION ERRORS
*/
@Type('ProjectionRebuildingError')
export class ProjectionRebuildingError extends InfrastructureError {}

@Type('ProjectionAlreadyRebuildingError')
export class ProjectionAlreadyRebuildingError extends ProjectionRebuildingError {
  constructor(projectionName: string) {
    super(`Projection '${projectionName}' is already being rebuilt`);
  }
}

@Type('ProjectionNotRebuildingError')
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
@Type('ClientError')
export class ClientError extends InfrastructureError {}

@Type('InactiveClientError')
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
@Type('SchedulerError')
export class SchedulerError extends InfrastructureError {}

@Type('CommandSchedulingError')
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

@Type('CommandUnschedulingError')
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
