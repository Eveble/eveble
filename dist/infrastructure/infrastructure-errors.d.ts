import { SerializableError } from '../components/serializable-error';
export declare class InfrastructureError extends SerializableError {
}
export declare class CommitConcurrencyError extends InfrastructureError {
    constructor(eventSourceableType: string, id: string, expectedVersion: string, currentVersion: string);
}
export declare class EventsNotFoundError extends InfrastructureError {
    constructor(EventSourceableTypeName: string, id: string);
}
export declare class AddingCommitFailedError extends InfrastructureError {
    constructor(storageName: string, commitId: string, appId: string);
}
export declare class UpdatingCommitError extends InfrastructureError {
    constructor(storageName: string, commitId: string, appId: string);
}
export declare class AddingSnapshotError extends InfrastructureError {
    constructor(storageName: string, EventSourceableTypeName: string, eventSourceableId: string);
}
export declare class UpdatingSnapshotError extends InfrastructureError {
    constructor(storageName: string, EventSourceableTypeName: string, eventSourceableId: string);
}
export declare class StorageNotFoundError extends InfrastructureError {
    constructor(storageName: string, clientType: string);
}
export declare class RouterError extends InfrastructureError {
}
export declare class MissingEventSourceableError extends RouterError {
    constructor(routerName: string);
}
export declare class MissingInitializingMessageError extends RouterError {
    constructor(routerName: string);
}
export declare class CannotRouteMessageError extends RouterError {
    constructor(routerName: string, messageTypeName: string);
}
export declare class UnresolvableIdentifierFromMessageError extends RouterError {
    constructor(routerName: string, eventTypeName: string, esTypeName: string);
}
export declare class InitializingIdentifierAlreadyExistsError extends RouterError {
    constructor(routerName: string, id: string);
}
declare class SnapshotterError extends InfrastructureError {
}
export declare class UndefinedSnapshotterFrequencyError extends SnapshotterError {
    constructor();
}
export declare class UndefinedSnapshotterError extends InfrastructureError {
    constructor();
}
export declare class ProjectionRebuildingError extends InfrastructureError {
}
export declare class ProjectionAlreadyRebuildingError extends ProjectionRebuildingError {
    constructor(projectionName: string);
}
export declare class ProjectionNotRebuildingError extends ProjectionRebuildingError {
    constructor(projectionName: string);
}
export declare class ClientError extends InfrastructureError {
}
export declare class InactiveClientError extends ClientError {
    constructor(targetName: string, clientId: string);
}
export declare class SchedulerError extends InfrastructureError {
}
export declare class CommandSchedulingError extends SchedulerError {
    constructor(jobName: string, assignmentId: string, assignerType: string, assignerId: string, error: string);
}
export declare class CommandUnschedulingError extends SchedulerError {
    constructor(jobName: string, assignmentId: string, assignerType: string, assignerId: string, error: string);
}
export {};
