---
id: "boundedcontext"
title: "BoundedContext"
sidebar_label: "BoundedContext"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [Module](module.md)

* Module

  ↳ **BoundedContext**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Stateful](../interfaces/types.stateful.md)
* [Module](../interfaces/types.module.md)
* Stateful
* Stateful
* Module

## Index

### Constructors

* [constructor](boundedcontext.md#constructor)

### Properties

* [app](boundedcontext.md#optional-app)
* [config](boundedcontext.md#config)
* [injector](boundedcontext.md#injector)
* [log](boundedcontext.md#optional-log)
* [modules](boundedcontext.md#modules)
* [state](boundedcontext.md#state)
* [STATES](boundedcontext.md#static-states)

### Methods

* [getSelectableStates](boundedcontext.md#getselectablestates)
* [getState](boundedcontext.md#getstate)
* [hasState](boundedcontext.md#hasstate)
* [initialize](boundedcontext.md#initialize)
* [invokeAction](boundedcontext.md#invokeaction)
* [isInDevelopment](boundedcontext.md#isindevelopment)
* [isInOneOfStates](boundedcontext.md#isinoneofstates)
* [isInProduction](boundedcontext.md#isinproduction)
* [isInState](boundedcontext.md#isinstate)
* [reset](boundedcontext.md#reset)
* [setState](boundedcontext.md#setstate)
* [shutdown](boundedcontext.md#shutdown)
* [start](boundedcontext.md#start)
* [stop](boundedcontext.md#stop)
* [validateState](boundedcontext.md#validatestate)

## Constructors

###  constructor

\+ **new BoundedContext**(`props?`: [ModuleProps](../modules/types.md#moduleprops)): *[BoundedContext](boundedcontext.md)*

*Inherited from [Module](module.md).[constructor](module.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props?` | [ModuleProps](../modules/types.md#moduleprops) |

**Returns:** *[BoundedContext](boundedcontext.md)*

## Properties

### `Optional` app

• **app**? : *[BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [Module](module.md).[app](module.md#optional-app)*

*Overrides void*

___

###  config

• **config**: *[Configurable](../interfaces/types.configurable.md)*

*Implementation of [Module](../interfaces/types.module.md).[config](../interfaces/types.module.md#config)*

*Inherited from [Module](module.md).[config](module.md#config)*

*Overrides void*

___

###  injector

• **injector**: *[Injector](../interfaces/types.injector.md)*

*Inherited from [Module](module.md).[injector](module.md#injector)*

*Overrides void*

___

### `Optional` log

• **log**? : *[Logger](../interfaces/types.logger.md)*

*Inherited from [Module](module.md).[log](module.md#optional-log)*

*Overrides void*

___

###  modules

• **modules**: *[Module](../interfaces/types.module.md)[]*

*Inherited from [Module](module.md).[modules](module.md#modules)*

*Overrides void*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Module](../interfaces/types.module.md).[state](../interfaces/types.module.md#state)*

*Inherited from [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

*Overrides void*

___

### `Static` STATES

▪ **STATES**: *typeof STATES*

*Inherited from [Module](module.md).[STATES](module.md#static-states)*

*Overrides void*

## Methods

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(`app`: [BaseApp](../interfaces/types.baseapp.md), `injector`: [Injector](../interfaces/types.injector.md)): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [Module](module.md).[initialize](module.md#initialize)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`app` | [BaseApp](../interfaces/types.baseapp.md) |
`injector` | [Injector](../interfaces/types.injector.md) |

**Returns:** *Promise‹void›*

___

###  invokeAction

▸ **invokeAction**(`actionName`: string, `options?`: [ActionInvokingOptions](../modules/types.md#actioninvokingoptions)): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [Module](module.md).[invokeAction](module.md#invokeaction)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`actionName` | string |
`options?` | [ActionInvokingOptions](../modules/types.md#actioninvokingoptions) |

**Returns:** *Promise‹void›*

___

###  isInDevelopment

▸ **isInDevelopment**(): *boolean*

*Inherited from [Module](module.md).[isInDevelopment](module.md#isindevelopment)*

*Overrides void*

**Returns:** *boolean*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInOneOfStates](statefulmixin.md#isinoneofstates)*

*Overrides [Task](task.md).[isInOneOfStates](task.md#isinoneofstates)*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInProduction

▸ **isInProduction**(): *boolean*

*Inherited from [Module](module.md).[isInProduction](module.md#isinproduction)*

*Overrides void*

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  reset

▸ **reset**(): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [Module](module.md).[reset](module.md#reset)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  shutdown

▸ **shutdown**(): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [Module](module.md).[shutdown](module.md#shutdown)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [Module](module.md).[start](module.md#start)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [Module](module.md).[stop](module.md#stop)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*
