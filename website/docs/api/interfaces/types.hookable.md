---
id: "types.hookable"
title: "@eveble/eveble"
sidebar_label: "Hookable"
---

## Hierarchy

* **Hookable**

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
* [CommandBus](../classes/commandbus.md)
* [CommandSchedulingError](../classes/commandschedulingerror.md)
* [CommandUnschedulingError](../classes/commandunschedulingerror.md)
* [Commit](../classes/commit.md)
* [CommitConcurrencyError](../classes/commitconcurrencyerror.md)
* [CommitReceiver](../classes/commitreceiver.md)
* [Config](../classes/config.md)
* [DomainError](../classes/domainerror.md)
* [DomainException](../classes/domainexception.md)
* [ElementAlreadyExistsError](../classes/elementalreadyexistserror.md)
* [ElementNotFoundError](../classes/elementnotfounderror.md)
* [Entity](../classes/entity.md)
* [EntityError](../classes/entityerror.md)
* [EvebleConfig](../classes/evebleconfig.md)
* [Event](../classes/event.md)
* [EventBus](../classes/eventbus.md)
* [EventIdMismatchError](../classes/eventidmismatcherror.md)
* [EventSourceable](../classes/eventsourceable.md)
* [EventSourceableError](../classes/eventsourceableerror.md)
* [EventsNotFoundError](../classes/eventsnotfounderror.md)
* [Guid](../classes/guid.md)
* [HookableMixin](../classes/hookablemixin.md)
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

* [getActions](types.hookable.md#getactions)
* [getHook](types.hookable.md#gethook)
* [getHookOrThrow](types.hookable.md#gethookorthrow)
* [getHooks](types.hookable.md#gethooks)
* [hasAction](types.hookable.md#hasaction)
* [hasHook](types.hookable.md#hashook)
* [overrideHook](types.hookable.md#overridehook)
* [registerHook](types.hookable.md#registerhook)
* [removeHook](types.hookable.md#removehook)

## Methods

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getHook

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

___

###  getHookOrThrow

▸ **getHookOrThrow**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

▸ **getHookOrThrow**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

___

###  getHooks

▸ **getHooks**(`action`: string): *[Mappings](../modules/types.hooks.md#mappings)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

▸ **getHooks**(`action`: string): *[Mappings](../modules/types.hooks.md#mappings)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

___

###  hasAction

▸ **hasAction**(`action`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *boolean*

▸ **hasAction**(`action`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *boolean*

___

###  hasHook

▸ **hasHook**(`action`: string, `id`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *boolean*

▸ **hasHook**(`action`: string, `id`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *boolean*

___

###  overrideHook

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  registerHook

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHook

▸ **removeHook**(`action`: string, `id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *void*

▸ **removeHook**(`action`: string, `id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *void*
