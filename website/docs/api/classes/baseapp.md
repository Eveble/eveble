---
id: "baseapp"
title: "BaseApp"
sidebar_label: "BaseApp"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [Module](module.md)

* Module

  ↳ **BaseApp**

  ↳ [App](app.md)

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Stateful](../interfaces/types.stateful.md)
* [Module](../interfaces/types.module.md)
* [BaseApp](../interfaces/types.baseapp.md)
* Stateful
* Stateful
* Module
* BaseApp

## Index

### Constructors

* [constructor](baseapp.md#constructor)

### Properties

* [app](baseapp.md#optional-app)
* [config](baseapp.md#config)
* [injector](baseapp.md#injector)
* [log](baseapp.md#optional-log)
* [modules](baseapp.md#modules)
* [state](baseapp.md#state)
* [STATES](baseapp.md#static-states)

### Methods

* [afterShutdown](baseapp.md#aftershutdown)
* [configure](baseapp.md#configure)
* [debug](baseapp.md#debug)
* [getSelectableStates](baseapp.md#getselectablestates)
* [getState](baseapp.md#getstate)
* [hasState](baseapp.md#hasstate)
* [initialize](baseapp.md#initialize)
* [invokeAction](baseapp.md#invokeaction)
* [isInDevelopment](baseapp.md#isindevelopment)
* [isInOneOfStates](baseapp.md#isinoneofstates)
* [isInProduction](baseapp.md#isinproduction)
* [isInState](baseapp.md#isinstate)
* [reset](baseapp.md#reset)
* [setState](baseapp.md#setstate)
* [shutdown](baseapp.md#shutdown)
* [start](baseapp.md#start)
* [stop](baseapp.md#stop)
* [validateState](baseapp.md#validatestate)

## Constructors

###  constructor

\+ **new BaseApp**(`props?`: [AppProps](../modules/types.md#appprops)): *[BaseApp](baseapp.md)*

*Overrides [Module](module.md).[constructor](module.md#constructor)*

Creates an instance of BaseApp.
Creates an instance of BaseApp.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props?` | [AppProps](../modules/types.md#appprops) | Properties for BaseApp. |

**Returns:** *[BaseApp](baseapp.md)*

## Properties

### `Optional` app

• **app**? : *[BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [Module](module.md).[app](module.md#optional-app)*

*Overrides void*

___

###  config

• **config**: *Configurable*

*Implementation of [BaseApp](../interfaces/types.baseapp.md).[config](../interfaces/types.baseapp.md#config)*

*Overrides [Module](module.md).[config](module.md#config)*

___

###  injector

• **injector**: *Injector*

*Implementation of [BaseApp](../interfaces/types.baseapp.md).[injector](../interfaces/types.baseapp.md#injector)*

*Overrides [Module](module.md).[injector](module.md#injector)*

___

### `Optional` log

• **log**? : *Logger*

*Overrides [Module](module.md).[log](module.md#optional-log)*

___

###  modules

• **modules**: *Module[]*

*Overrides [Module](module.md).[modules](module.md#modules)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [BaseApp](../interfaces/types.baseapp.md).[state](../interfaces/types.baseapp.md#state)*

*Inherited from [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

*Overrides void*

___

### `Static` STATES

▪ **STATES**: *typeof STATES*

*Inherited from [Module](module.md).[STATES](module.md#static-states)*

*Overrides void*

## Methods

###  afterShutdown

▸ **afterShutdown**(): *Promise‹void›*

On shutdown hook.

**`async`** 

**Returns:** *Promise‹void›*

___

###  configure

▸ **configure**(`props`: [ConfigProps](../modules/types.md#configprops)): *void*

Make it possible to override configuration (at any nested level).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [ConfigProps](../modules/types.md#configprops) | Properties with relation path: value matching property types.  |

**Returns:** *void*

___

###  debug

▸ **debug**(): *void*

Enables debug mode logging on application app.
**Must be enabled prior to initialization**.

**Returns:** *void*

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Overrides [Module](module.md).[initialize](module.md#initialize)*

Initializes application.

**`async`** 

**Returns:** *Promise‹void›*

___

###  invokeAction

▸ **invokeAction**(`actionName`: string, `options?`: [ActionInvokingOptions](../modules/types.md#actioninvokingoptions)): *Promise‹void›*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

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

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

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

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

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

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [Module](module.md).[reset](module.md#reset)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

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

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Overrides [Module](module.md).[shutdown](module.md#shutdown)*

Shutdowns app.

**`async`** 

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(): *Promise‹void›*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [Module](module.md).[start](module.md#start)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *Promise‹void›*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [Module](module.md).[stop](module.md#stop)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*
