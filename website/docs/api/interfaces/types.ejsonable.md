---
id: "types.ejsonable"
title: "@eveble/eveble"
sidebar_label: "Ejsonable"
---

## Hierarchy

  ↳ [Serializable](types.serializable.md)

* Serializable

  ↳ **Ejsonable**

## Implemented by

* [AddingCommitFailedError](../classes/addingcommitfailederror.md)
* [AddingSnapshotError](../classes/addingsnapshoterror.md)
* [Aggregate](../classes/aggregate.md)
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
* [DomainError](../classes/domainerror.md)
* [DomainException](../classes/domainexception.md)
* [ElementAlreadyExistsError](../classes/elementalreadyexistserror.md)
* [ElementNotFoundError](../classes/elementnotfounderror.md)
* [Entity](../classes/entity.md)
* [EntityError](../classes/entityerror.md)
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
* [Message](../classes/message.md)
* [MissingEventSourceableError](../classes/missingeventsourceableerror.md)
* [MissingInitializingMessageError](../classes/missinginitializingmessageerror.md)
* [Process](../classes/process.md)
* [ProjectionAlreadyRebuildingError](../classes/projectionalreadyrebuildingerror.md)
* [ProjectionNotRebuildingError](../classes/projectionnotrebuildingerror.md)
* [ProjectionRebuildingError](../classes/projectionrebuildingerror.md)
* [RouterError](../classes/routererror.md)
* [SavedStateNotFoundError](../classes/savedstatenotfounderror.md)
* [ScheduleCommand](../classes/schedulecommand.md)
* [SchedulerError](../classes/schedulererror.md)
* [Serializable](../classes/serializable.md)
* [SerializableError](../classes/serializableerror.md)
* [SnapshotterError](../classes/snapshottererror.md)
* [StorageNotFoundError](../classes/storagenotfounderror.md)
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

* [equals](types.ejsonable.md#equals)
* [getLegacyTransformer](types.ejsonable.md#getlegacytransformer)
* [getLegacyTransformers](types.ejsonable.md#getlegacytransformers)
* [getPropTypes](types.ejsonable.md#getproptypes)
* [getPropertyInitializers](types.ejsonable.md#getpropertyinitializers)
* [getSchemaVersion](types.ejsonable.md#getschemaversion)
* [getTypeName](types.ejsonable.md#gettypename)
* [hasLegacyTransformer](types.ejsonable.md#haslegacytransformer)
* [overrideLegacyTransformer](types.ejsonable.md#overridelegacytransformer)
* [registerLegacyTransformer](types.ejsonable.md#registerlegacytransformer)
* [toJSONValue](types.ejsonable.md#tojsonvalue)
* [toPlainObject](types.ejsonable.md#toplainobject)
* [toString](types.ejsonable.md#tostring)
* [transformLegacyProps](types.ejsonable.md#transformlegacyprops)
* [typeName](types.ejsonable.md#typename)
* [validateProps](types.ejsonable.md#validateprops)

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

*Inherited from [Definable](types.definable.md).[equals](types.definable.md#equals)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Inherited from [Versionable](types.versionable.md).[getLegacyTransformer](types.versionable.md#getlegacytransformer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getLegacyTransformers

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

*Inherited from [Versionable](types.versionable.md).[getLegacyTransformers](types.versionable.md#getlegacytransformers)*

*Overrides void*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getPropTypes

▸ **getPropTypes**(): *Record‹keyof any, any›*

*Inherited from [Definable](types.definable.md).[getPropTypes](types.definable.md#getproptypes)*

*Overrides void*

**Returns:** *Record‹keyof any, any›*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [Definable](types.definable.md).[getPropertyInitializers](types.definable.md#getpropertyinitializers)*

*Overrides void*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Inherited from [Versionable](types.versionable.md).[getSchemaVersion](types.versionable.md#getschemaversion)*

*Overrides void*

**Returns:** *number | undefined*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [Serializable](types.serializable.md).[getTypeName](types.serializable.md#gettypename)*

*Overrides void*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  hasLegacyTransformer

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

*Inherited from [Versionable](types.versionable.md).[hasLegacyTransformer](types.versionable.md#haslegacytransformer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *boolean*

___

###  overrideLegacyTransformer

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

*Inherited from [Versionable](types.versionable.md).[overrideLegacyTransformer](types.versionable.md#overridelegacytransformer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  registerLegacyTransformer

▸ **registerLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook), `shouldOverride`: boolean): *void*

*Inherited from [Versionable](types.versionable.md).[registerLegacyTransformer](types.versionable.md#registerlegacytransformer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |
`shouldOverride` | boolean |

**Returns:** *void*

___

###  toJSONValue

▸ **toJSONValue**(): *Record‹string, any›*

**Returns:** *Record‹string, any›*

▸ **toJSONValue**(): *Record‹string, any›*

**Returns:** *Record‹string, any›*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Inherited from [Definable](types.definable.md).[toPlainObject](types.definable.md#toplainobject)*

*Overrides void*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename) | string*

*Inherited from [Serializable](types.serializable.md).[toString](types.serializable.md#tostring)*

*Overrides void*

**Returns:** *[TypeName](../modules/types.md#typename) | string*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Inherited from [Versionable](types.versionable.md).[transformLegacyProps](types.versionable.md#transformlegacyprops)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*

___

###  typeName

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  validateProps

▸ **validateProps**(`props`: [Props](../modules/types.md#props), `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

*Inherited from [Definable](types.definable.md).[validateProps](types.definable.md#validateprops)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |
`propTypes` | [PropTypes](../modules/types.md#proptypes) |
`isStrict?` | boolean |

**Returns:** *boolean*
