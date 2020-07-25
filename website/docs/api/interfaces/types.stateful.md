---
id: "types.stateful"
title: "@eveble/eveble"
sidebar_label: "Stateful"
---

## Hierarchy

* **Stateful**

  ↳ [Logger](types.logger.md)

  ↳ [BaseApp](types.baseapp.md)

  ↳ [Module](types.module.md)

  ↳ [Entity](types.entity.md)

  ↳ [CommitReceiver](types.commitreceiver.md)

  ↳ [Client](types.client.md)

  ↳ [CommandScheduler](types.commandscheduler.md)

  ↳ [ScheduledJob](types.scheduledjob.md)

## Implemented by

* [AgendaClient](../classes/agendaclient.md)
* [AgendaCommandScheduler](../classes/agendacommandscheduler.md)
* [AgendaCommandSchedulerModule](../classes/agendacommandschedulermodule.md)
* [AgendaCommandSchedulerModule](../classes/agendacommandschedulermodule.md)
* [Aggregate](../classes/aggregate.md)
* [App](../classes/app.md)
* [App](../classes/app.md)
* [BaseApp](../classes/baseapp.md)
* [BaseApp](../classes/baseapp.md)
* [BoundedContext](../classes/boundedcontext.md)
* [BoundedContext](../classes/boundedcontext.md)
* [Client](../classes/client.md)
* [CommitMongoDBObserver](../classes/commitmongodbobserver.md)
* [CommitReceiver](../classes/commitreceiver.md)
* [Entity](../classes/entity.md)
* [Eveble](../classes/eveble.md)
* [Eveble](../classes/eveble.md)
* [EventSourceable](../classes/eventsourceable.md)
* [Logger](../classes/logger.md)
* [Module](../classes/module.md)
* [Module](../classes/module.md)
* [MongoDBClient](../classes/mongodbclient.md)
* [MongoDBCommitStorageModule](../classes/mongodbcommitstoragemodule.md)
* [MongoDBCommitStorageModule](../classes/mongodbcommitstoragemodule.md)
* [MongoDBSnapshotStorageModule](../classes/mongodbsnapshotstoragemodule.md)
* [MongoDBSnapshotStorageModule](../classes/mongodbsnapshotstoragemodule.md)
* [Process](../classes/process.md)
* [Projection](../classes/projection.md)
* [ScheduledJob](../classes/scheduledjob.md)
* [StatefulMixin](../classes/statefulmixin.md)

## Index

### Properties

* [state](types.stateful.md#state)

### Methods

* [getSelectableStates](types.stateful.md#getselectablestates)
* [getState](types.stateful.md#getstate)
* [hasState](types.stateful.md#hasstate)
* [isInOneOfStates](types.stateful.md#isinoneofstates)
* [isInState](types.stateful.md#isinstate)
* [setState](types.stateful.md#setstate)
* [validateState](types.stateful.md#validatestate)

## Properties

###  state

• **state**: *[State](../modules/types.md#state)*

## Methods

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

**Returns:** *[State](../modules/types.md#state)*

▸ **getState**(): *[State](../modules/types.md#state)*

**Returns:** *[State](../modules/types.md#state)*

___

###  hasState

▸ **hasState**(): *boolean*

**Returns:** *boolean*

▸ **hasState**(): *boolean*

**Returns:** *boolean*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*
