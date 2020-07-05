---
id: "module"
title: "Module"
sidebar_label: "Module"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[StatefulMixin](statefulmixin.md), this› & [StatefulMixin](statefulmixin.md)‹this›

* SuperPrototypeSelector‹StatefulMixin, this› & StatefulMixin‹this›

  ↳ **Module**

  ↳ [BaseApp](baseapp.md)

  ↳ [Eveble](eveble.md)

  ↳ [AgendaCommandSchedulerModule](agendacommandschedulermodule.md)

  ↳ [MongoDBCommitStorageModule](mongodbcommitstoragemodule.md)

  ↳ [MongoDBSnapshotStorageModule](mongodbsnapshotstoragemodule.md)

  ↳ [BoundedContext](boundedcontext.md)

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Stateful](../interfaces/types.stateful.md)
* [Module](../interfaces/types.module.md)
* Stateful
* Stateful
* Module

## Index

### Constructors

* [constructor](module.md#constructor)

### Properties

* [app](module.md#optional-app)
* [config](module.md#config)
* [injector](module.md#injector)
* [log](module.md#optional-log)
* [modules](module.md#modules)
* [state](module.md#state)
* [STATES](module.md#static-states)

### Methods

* [getSelectableStates](module.md#getselectablestates)
* [getState](module.md#getstate)
* [hasState](module.md#hasstate)
* [initialize](module.md#initialize)
* [invokeAction](module.md#invokeaction)
* [isInDevelopment](module.md#isindevelopment)
* [isInOneOfStates](module.md#isinoneofstates)
* [isInProduction](module.md#isinproduction)
* [isInState](module.md#isinstate)
* [reset](module.md#reset)
* [setState](module.md#setstate)
* [shutdown](module.md#shutdown)
* [start](module.md#start)
* [stop](module.md#stop)
* [validateState](module.md#validatestate)

## Constructors

###  constructor

\+ **new Module**(`props?`: [ModuleProps](../modules/types.md#moduleprops)): *[Module](module.md)*

Creates an instance of Module.
Creates an instance of Module.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props?` | [ModuleProps](../modules/types.md#moduleprops) | Properties matching module definition.  |

**Returns:** *[Module](module.md)*

## Properties

### `Optional` app

• **app**? : *BaseApp*

___

###  config

• **config**: *Configurable*

*Implementation of [Module](../interfaces/types.module.md).[config](../interfaces/types.module.md#config)*

___

###  injector

• **injector**: *Injector*

___

### `Optional` log

• **log**? : *Logger*

___

###  modules

• **modules**: *Module[]*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Module](../interfaces/types.module.md).[state](../interfaces/types.module.md#state)*

*Inherited from [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

*Overrides void*

___

### `Static` STATES

▪ **STATES**: *[STATES](../enums/states.md)* = STATES

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

Initializes module.

**`async`** 

**`throws`** {AppMissingError}
Thrown if the app argument is missing.

**`throws`** {InjectorMissingError}
Thrown if the injector argument is missing.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`app` | [BaseApp](../interfaces/types.baseapp.md) | Application that requires(depends) module. |
`injector` | [Injector](../interfaces/types.injector.md) | IoC container implementing Inversifiy's Containers interface. |

**Returns:** *Promise‹void›*

___

###  invokeAction

▸ **invokeAction**(`actionName`: string, `options?`: [ActionInvokingOptions](../modules/types.md#actioninvokingoptions)): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

Runs action on module if action is defined.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`actionName` | string | Name of action(function) to run. |
`options?` | [ActionInvokingOptions](../modules/types.md#actioninvokingoptions) | Additional options for behavior of invoking action. |

**Returns:** *Promise‹void›*

___

###  isInDevelopment

▸ **isInDevelopment**(): *boolean*

Evaluates if current environment is on development.

**Returns:** *boolean*

Returns `true` if is on development environment, else `false`.

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

Evaluates if current environment is on production.

**Returns:** *boolean*

Returns `true` if is on production environment, else `false`.

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

Restarts module state and invokes all associated lifecycle hooks.

**`async`** 

**`throws`** {InvalidStateError}
Thrown if the module is not in one of states: 'initialized', 'stopped', 'running'.

**`throws`** {InvalidEnvironmentError}
Thrown if resetting is done on production environment.

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

Shutdowns module and changes state to 'shutdown' and invokes lifecycle 'shutdown' action.

**`async`** 

**`throws`** {InvalidStateError}
Thrown if the module is not in one of states: 'initialized', 'stopped', 'running', 'shutdown'.

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

Changes module state to 'running' and invokes lifecycle 'start' action.

**`async`** 

**`throws`** {InvalidStateError}
Thrown if the module is not in one of states: 'initialized', 'stopped', 'running'.

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *Promise‹void›*

*Implementation of [Module](../interfaces/types.module.md)*

Changes module state to 'stopped' and invokes lifecycle 'stop' action.

**`async`** 

**`throws`** {InvalidStateError}
Thrown if the module is not in one of states: 'initialized', 'stopped', 'running'.

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [Module](../interfaces/types.module.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](extendableerror.md#static-error) |

**Returns:** *boolean*
