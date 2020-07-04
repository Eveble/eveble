---
id: "types.definable"
title: "@eveble/eveble"
sidebar_label: "Definable"
---

## Hierarchy

* **Definable**

  ↳ [Configurable](types.configurable.md)

  ↳ [Serializable](types.serializable.md)

  ↳ [ScheduledJob](types.scheduledjob.md)

## Implemented by

* [AddingCommitFailedError](../classes/addingcommitfailederror.md)
* [AddingSnapshotError](../classes/addingsnapshoterror.md)
* [Aggregate](../classes/aggregate.md)
* [AppConfig](../classes/appconfig.md)
* [AssertionError](../classes/assertionerror.md)
* [Assignment](../classes/assignment.md)
* [CannotRouteMessageError](../classes/cannotroutemessageerror.md)
* [ClientError](../classes/clienterror.md)
* [Command](../classes/command.md)
* [CommandSchedulingError](../classes/commandschedulingerror.md)
* [CommandUnschedulingError](../classes/commandunschedulingerror.md)
* [Commit](../classes/commit.md)
* [CommitConcurrencyError](../classes/commitconcurrencyerror.md)
* [CommitReceiver](../classes/commitreceiver.md)
* [Config](../classes/config.md)
* [DefinableMixin](../classes/definablemixin.md)
* [DomainError](../classes/domainerror.md)
* [DomainException](../classes/domainexception.md)
* [ElementAlreadyExistsError](../classes/elementalreadyexistserror.md)
* [ElementNotFoundError](../classes/elementnotfounderror.md)
* [Entity](../classes/entity.md)
* [EntityError](../classes/entityerror.md)
* [EvebleConfig](../classes/evebleconfig.md)
* [Event](../classes/event.md)
* [EventIdMismatchError](../classes/eventidmismatcherror.md)
* [EventSourceable](../classes/eventsourceable.md)
* [EventSourceableError](../classes/eventsourceableerror.md)
* [EventsNotFoundError](../classes/eventsnotfounderror.md)
* [Guid](../classes/guid.md)
* [IdentifiableAlreadyExistsError](../classes/identifiablealreadyexistserror.md)
* [InactiveClientError](../classes/inactiveclienterror.md)
* [InfrastructureError](../classes/infrastructureerror.md)
* [InvalidEventError](../classes/invalideventerror.md)
* [InvalidGuidValueError](../classes/invalidguidvalueerror.md)
* [InvalidInitializingMessageError](../classes/invalidinitializingmessageerror.md)
* [InvalidListError](../classes/invalidlisterror.md)
* [InvalidStateTransitionError](../classes/invalidstatetransitionerror.md)
* [InvalidStatusTransitionError](../classes/invalidstatustransitionerror.md)
* [ListError](../classes/listerror.md)
* [LogTransportConfig](../classes/logtransportconfig.md)
* [LoggingConfig](../classes/loggingconfig.md)
* [Message](../classes/message.md)
* [MissingEventSourceableError](../classes/missingeventsourceableerror.md)
* [MissingInitializingMessageError](../classes/missinginitializingmessageerror.md)
* [MongoDBCollectionConfig](../classes/mongodbcollectionconfig.md)
* [MongoDBDatabaseConfig](../classes/mongodbdatabaseconfig.md)
* [Process](../classes/process.md)
* [ProjectionAlreadyRebuildingError](../classes/projectionalreadyrebuildingerror.md)
* [ProjectionNotRebuildingError](../classes/projectionnotrebuildingerror.md)
* [ProjectionRebuildingError](../classes/projectionrebuildingerror.md)
* [RebuildingResult](../classes/rebuildingresult.md)
* [RouterError](../classes/routererror.md)
* [SavedStateNotFoundError](../classes/savedstatenotfounderror.md)
* [ScheduleCommand](../classes/schedulecommand.md)
* [ScheduledJob](../classes/scheduledjob.md)
* [SchedulerError](../classes/schedulererror.md)
* [Serializable](../classes/serializable.md)
* [SerializableError](../classes/serializableerror.md)
* [SnapshotterError](../classes/snapshottererror.md)
* [StorageNotFoundError](../classes/storagenotfounderror.md)
* [Struct](../classes/struct.md)
* [UndefinedActionError](../classes/undefinedactionerror.md)
* [UndefinedSnapshotterError](../classes/undefinedsnapshottererror.md)
* [UndefinedSnapshotterFrequencyError](../classes/undefinedsnapshotterfrequencyerror.md)
* [UnresolvableIdentifierFromMessageError](../classes/unresolvableidentifierfrommessageerror.md)
* [UnscheduleCommand](../classes/unschedulecommand.md)
* [UpdatingCommitError](../classes/updatingcommiterror.md)
* [UpdatingSnapshotError](../classes/updatingsnapshoterror.md)
* [ValueObject](../classes/valueobject.md)
* [ValueObjectError](../classes/valueobjecterror.md)

## Index

### Methods

* [equals](types.definable.md#equals)
* [getPropTypes](types.definable.md#getproptypes)
* [getPropertyInitializers](types.definable.md#getpropertyinitializers)
* [toPlainObject](types.definable.md#toplainobject)
* [validateProps](types.definable.md#validateprops)

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

▸ **equals**(`other`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  getPropTypes

▸ **getPropTypes**(): *Record‹keyof any, any›*

**Returns:** *Record‹keyof any, any›*

▸ **getPropTypes**(): *Record‹keyof any, any›*

**Returns:** *Record‹keyof any, any›*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

**Returns:** *[Props](../modules/types.md#props)*

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

**Returns:** *[Props](../modules/types.md#props)*

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  validateProps

▸ **validateProps**(`props`: [Props](../modules/types.md#props), `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |
`propTypes` | [PropTypes](../modules/types.md#proptypes) |
`isStrict?` | boolean |

**Returns:** *boolean*

▸ **validateProps**(`props`: [Props](../modules/types.md#props), `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |
`propTypes` | [PropTypes](../modules/types.md#proptypes) |
`isStrict?` | boolean |

**Returns:** *boolean*
