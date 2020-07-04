---
id: "types.app"
title: "@eveble/eveble"
sidebar_label: "App"
---

## Hierarchy

  ↳ [BaseApp](types.baseapp.md)

* BaseApp

  ↳ **App**

## Index

### Properties

* [config](types.app.md#config)
* [injector](types.app.md#injector)
* [state](types.app.md#state)

### Methods

* [getSelectableStates](types.app.md#getselectablestates)
* [getState](types.app.md#getstate)
* [hasState](types.app.md#hasstate)
* [initialize](types.app.md#initialize)
* [invokeAction](types.app.md#invokeaction)
* [isInOneOfStates](types.app.md#isinoneofstates)
* [isInState](types.app.md#isinstate)
* [publish](types.app.md#publish)
* [reset](types.app.md#reset)
* [send](types.app.md#send)
* [setState](types.app.md#setstate)
* [shutdown](types.app.md#shutdown)
* [start](types.app.md#start)
* [stop](types.app.md#stop)
* [validateState](types.app.md#validatestate)

## Properties

###  config

• **config**: *[Configurable](types.configurable.md)*

*Inherited from [BaseApp](types.baseapp.md).[config](types.baseapp.md#config)*

*Overrides void*

___

###  injector

• **injector**: *[Injector](types.injector.md)*

*Inherited from [BaseApp](types.baseapp.md).[injector](types.baseapp.md#injector)*

*Overrides void*

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

*Inherited from [BaseApp](types.baseapp.md).[initialize](types.baseapp.md#initialize)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  invokeAction

▸ **invokeAction**(`actionName`: string, `options`: [ActionInvokingOptions](../modules/types.md#actioninvokingoptions)): *Promise‹void›*

*Inherited from [BaseApp](types.baseapp.md).[invokeAction](types.baseapp.md#invokeaction)*

*Overrides void*

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

###  publish

▸ **publish**(`event`: [Event](types.event.md)): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](types.event.md) |

**Returns:** *Promise‹void›*

▸ **publish**(`event`: Event): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | Event |

**Returns:** *Promise‹void›*

___

###  reset

▸ **reset**(): *Promise‹void›*

*Inherited from [BaseApp](types.baseapp.md).[reset](types.baseapp.md#reset)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  send

▸ **send**(`command`: [Command](types.command.md)): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`command` | [Command](types.command.md) |

**Returns:** *Promise‹any›*

▸ **send**(`command`: Command): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`command` | Command |

**Returns:** *Promise‹any›*

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

*Inherited from [BaseApp](types.baseapp.md).[shutdown](types.baseapp.md#shutdown)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(): *Promise‹void›*

*Inherited from [BaseApp](types.baseapp.md).[start](types.baseapp.md#start)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *Promise‹void›*

*Inherited from [BaseApp](types.baseapp.md).[stop](types.baseapp.md#stop)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](../classes/extendableerror.md#static-error)): *boolean*

*Inherited from [Stateful](types.stateful.md).[validateState](types.stateful.md#validatestate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](../classes/extendableerror.md#static-error) |

**Returns:** *boolean*
