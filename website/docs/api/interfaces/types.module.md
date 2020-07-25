---
id: "types.module"
title: "@eveble/eveble"
sidebar_label: "Module"
---

## Hierarchy

* [Stateful](types.stateful.md)

* Stateful

  ↳ **Module**

## Implemented by

* [AgendaCommandSchedulerModule](../classes/agendacommandschedulermodule.md)
* [App](../classes/app.md)
* [BaseApp](../classes/baseapp.md)
* [BoundedContext](../classes/boundedcontext.md)
* [Eveble](../classes/eveble.md)
* [Module](../classes/module.md)
* [MongoDBCommitStorageModule](../classes/mongodbcommitstoragemodule.md)
* [MongoDBSnapshotStorageModule](../classes/mongodbsnapshotstoragemodule.md)

## Index

### Properties

* [config](types.module.md#config)
* [state](types.module.md#state)

### Methods

* [getSelectableStates](types.module.md#getselectablestates)
* [getState](types.module.md#getstate)
* [hasState](types.module.md#hasstate)
* [initialize](types.module.md#initialize)
* [invokeAction](types.module.md#invokeaction)
* [isInOneOfStates](types.module.md#isinoneofstates)
* [isInState](types.module.md#isinstate)
* [reset](types.module.md#reset)
* [setState](types.module.md#setstate)
* [shutdown](types.module.md#shutdown)
* [start](types.module.md#start)
* [stop](types.module.md#stop)
* [validateState](types.module.md#validatestate)

## Properties

###  config

• **config**: *Configurable*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[state](types.stateful.md#state)*

*Overrides void*

## Methods

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Inherited from [Stateful](types.stateful.md).[getSelectableStates](types.stateful.md#getselectablestates)*

*Overrides void*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[getState](types.stateful.md#getstate)*

*Overrides void*

**Returns:** *[State](../modules/types.md#state)*

___

###  hasState

▸ **hasState**(): *boolean*

*Inherited from [Stateful](types.stateful.md).[hasState](types.stateful.md#hasstate)*

*Overrides void*

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(`app`: [BaseApp](types.baseapp.md), `injector`: [Injector](types.injector.md)): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`app` | [BaseApp](types.baseapp.md) |
`injector` | [Injector](types.injector.md) |

**Returns:** *Promise‹void›*

▸ **initialize**(`app`: BaseApp, `injector`: Injector): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`app` | BaseApp |
`injector` | Injector |

**Returns:** *Promise‹void›*

___

###  invokeAction

▸ **invokeAction**(`actionName`: string, `options`: [ActionInvokingOptions](../modules/types.md#actioninvokingoptions)): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`actionName` | string |
`options` | [ActionInvokingOptions](../modules/types.md#actioninvokingoptions) |

**Returns:** *Promise‹void›*

▸ **invokeAction**(`actionName`: string, `options`: [ActionInvokingOptions](../modules/types.md#actioninvokingoptions)): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`actionName` | string |
`options` | [ActionInvokingOptions](../modules/types.md#actioninvokingoptions) |

**Returns:** *Promise‹void›*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Stateful](types.stateful.md).[isInOneOfStates](types.stateful.md#isinoneofstates)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Stateful](types.stateful.md).[isInState](types.stateful.md#isinstate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  reset

▸ **reset**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **reset**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Inherited from [Stateful](types.stateful.md).[setState](types.stateful.md#setstate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  shutdown

▸ **shutdown**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **shutdown**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **start**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **stop**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Inherited from [Stateful](types.stateful.md).[validateState](types.stateful.md#validatestate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*
