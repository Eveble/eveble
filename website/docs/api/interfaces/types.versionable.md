---
id: "types.versionable"
title: "@eveble/eveble"
sidebar_label: "Versionable"
---

## Hierarchy

* **Versionable**

  ↳ [Serializable](types.serializable.md)

## Implemented by

* [AddingCommitFailedError](../classes/addingcommitfailederror.md)
* [AddingSnapshotError](../classes/addingsnapshoterror.md)
* [AssertionError](../classes/assertionerror.md)
* [CannotRouteMessageError](../classes/cannotroutemessageerror.md)
* [ClientError](../classes/clienterror.md)
* [CommandSchedulingError](../classes/commandschedulingerror.md)
* [CommandUnschedulingError](../classes/commandunschedulingerror.md)
* [CommitConcurrencyError](../classes/commitconcurrencyerror.md)
* [DomainError](../classes/domainerror.md)
* [ElementAlreadyExistsError](../classes/elementalreadyexistserror.md)
* [ElementNotFoundError](../classes/elementnotfounderror.md)
* [EntityError](../classes/entityerror.md)
* [EventIdMismatchError](../classes/eventidmismatcherror.md)
* [EventSourceableError](../classes/eventsourceableerror.md)
* [EventsNotFoundError](../classes/eventsnotfounderror.md)
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
* [MissingEventSourceableError](../classes/missingeventsourceableerror.md)
* [MissingInitializingMessageError](../classes/missinginitializingmessageerror.md)
* [ProjectionAlreadyRebuildingError](../classes/projectionalreadyrebuildingerror.md)
* [ProjectionNotRebuildingError](../classes/projectionnotrebuildingerror.md)
* [ProjectionRebuildingError](../classes/projectionrebuildingerror.md)
* [RouterError](../classes/routererror.md)
* [SavedStateNotFoundError](../classes/savedstatenotfounderror.md)
* [SchedulerError](../classes/schedulererror.md)
* [SerializableError](../classes/serializableerror.md)
* [SnapshotterError](../classes/snapshottererror.md)
* [StorageNotFoundError](../classes/storagenotfounderror.md)
* [UndefinedActionError](../classes/undefinedactionerror.md)
* [UndefinedSnapshotterError](../classes/undefinedsnapshottererror.md)
* [UndefinedSnapshotterFrequencyError](../classes/undefinedsnapshotterfrequencyerror.md)
* [UnresolvableIdentifierFromMessageError](../classes/unresolvableidentifierfrommessageerror.md)
* [UpdatingCommitError](../classes/updatingcommiterror.md)
* [UpdatingSnapshotError](../classes/updatingsnapshoterror.md)
* [ValueObjectError](../classes/valueobjecterror.md)

## Index

### Methods

* [getLegacyTransformer](types.versionable.md#getlegacytransformer)
* [getLegacyTransformers](types.versionable.md#getlegacytransformers)
* [getSchemaVersion](types.versionable.md#getschemaversion)
* [hasLegacyTransformer](types.versionable.md#haslegacytransformer)
* [overrideLegacyTransformer](types.versionable.md#overridelegacytransformer)
* [registerLegacyTransformer](types.versionable.md#registerlegacytransformer)
* [transformLegacyProps](types.versionable.md#transformlegacyprops)

## Methods

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *[Hook](../modules/types.md#hook)*

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getLegacyTransformers

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

**Returns:** *number | undefined*

▸ **getSchemaVersion**(): *number | undefined*

**Returns:** *number | undefined*

___

###  hasLegacyTransformer

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *boolean*

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *boolean*

___

###  overrideLegacyTransformer

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  registerLegacyTransformer

▸ **registerLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook), `shouldOverride`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |
`shouldOverride` | boolean |

**Returns:** *void*

▸ **registerLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook), `shouldOverride`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |
`shouldOverride` | boolean |

**Returns:** *void*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*
