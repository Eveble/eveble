---
id: "types.baseapp"
title: "@eveble/eveble"
sidebar_label: "BaseApp"
---

## Hierarchy

* [Stateful](types.stateful.md)

* Stateful

  ↳ **BaseApp**

  ↳ [App](types.app.md)

## Implemented by

* [App](../classes/app.md)
* [BaseApp](../classes/baseapp.md)

## Index

### Properties

* [config](types.baseapp.md#config)
* [injector](types.baseapp.md#injector)
* [state](types.baseapp.md#state)

### Methods

* [getSelectableStates](types.baseapp.md#getselectablestates)
* [getState](types.baseapp.md#getstate)
* [hasState](types.baseapp.md#hasstate)
* [initialize](types.baseapp.md#initialize)
* [invokeAction](types.baseapp.md#invokeaction)
* [isInOneOfStates](types.baseapp.md#isinoneofstates)
* [isInState](types.baseapp.md#isinstate)
* [reset](types.baseapp.md#reset)
* [setState](types.baseapp.md#setstate)
* [shutdown](types.baseapp.md#shutdown)
* [start](types.baseapp.md#start)
* [stop](types.baseapp.md#stop)
* [validateState](types.baseapp.md#validatestate)

## Properties

###  config

• **config**: *Configurable*

___

###  injector

• **injector**: *Injector*

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

▸ **initialize**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **initialize**(): *Promise‹void›*

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
