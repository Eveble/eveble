---
id: "app"
title: "App"
sidebar_label: "App"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [BaseApp](baseapp.md)

* BaseApp

  ↳ **App**

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

* [constructor](app.md#constructor)

### Properties

* [app](app.md#optional-app)
* [config](app.md#config)
* [envFilePath](app.md#readonly-envfilepath)
* [injector](app.md#injector)
* [log](app.md#log)
* [modules](app.md#modules)
* [state](app.md#state)
* [STATES](app.md#static-states)

### Methods

* [afterShutdown](app.md#aftershutdown)
* [configure](app.md#configure)
* [debug](app.md#debug)
* [getSelectableStates](app.md#getselectablestates)
* [getState](app.md#getstate)
* [hasState](app.md#hasstate)
* [initialize](app.md#initialize)
* [invokeAction](app.md#invokeaction)
* [isCommandScheduling](app.md#iscommandscheduling)
* [isInDevelopment](app.md#isindevelopment)
* [isInOneOfStates](app.md#isinoneofstates)
* [isInProduction](app.md#isinproduction)
* [isInState](app.md#isinstate)
* [isSnapshotting](app.md#issnapshotting)
* [onProcessSignal](app.md#onprocesssignal)
* [publish](app.md#publish)
* [reset](app.md#reset)
* [send](app.md#send)
* [setState](app.md#setstate)
* [shutdown](app.md#shutdown)
* [start](app.md#start)
* [stop](app.md#stop)
* [subscribeTo](app.md#subscribeto)
* [validateState](app.md#validatestate)

## Constructors

###  constructor

\+ **new App**(`props?`: [ModuleProps](../modules/types.md#moduleprops) & object): *[App](app.md)*

*Overrides [BaseApp](baseapp.md).[constructor](baseapp.md#constructor)*

Creates an instance of App.
Creates an instance of App.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props?` | [ModuleProps](../modules/types.md#moduleprops) & object | Properties for App. |

**Returns:** *[App](app.md)*

## Properties

### `Optional` app

• **app**? : *[BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [Module](module.md).[app](module.md#optional-app)*

*Overrides void*

___

###  config

• **config**: *AppConfig*

*Implementation of [BaseApp](../interfaces/types.baseapp.md).[config](../interfaces/types.baseapp.md#config)*

*Overrides [BaseApp](baseapp.md).[config](baseapp.md#config)*

___

### `Readonly` envFilePath

• **envFilePath**: *string*

___

###  injector

• **injector**: *Injector*

*Implementation of [BaseApp](../interfaces/types.baseapp.md).[injector](../interfaces/types.baseapp.md#injector)*

*Overrides [BaseApp](baseapp.md).[injector](baseapp.md#injector)*

___

###  log

• **log**: *Logger*

*Overrides [BaseApp](baseapp.md).[log](baseapp.md#optional-log)*

___

###  modules

• **modules**: *Module[]*

*Overrides [BaseApp](baseapp.md).[modules](baseapp.md#modules)*

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

*Inherited from [BaseApp](baseapp.md).[afterShutdown](baseapp.md#aftershutdown)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  configure

▸ **configure**(`props`: [ConfigProps](../modules/types.md#configprops)): *void*

*Inherited from [BaseApp](baseapp.md).[configure](baseapp.md#configure)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ConfigProps](../modules/types.md#configprops) |

**Returns:** *void*

___

###  debug

▸ **debug**(): *void*

*Inherited from [BaseApp](baseapp.md).[debug](baseapp.md#debug)*

*Overrides void*

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

*Inherited from [BaseApp](baseapp.md).[initialize](baseapp.md#initialize)*

*Overrides [Module](module.md).[initialize](module.md#initialize)*

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

###  isCommandScheduling

▸ **isCommandScheduling**(): *boolean*

Evaluates if application has `CommandScheduler` enabled.

**Returns:** *boolean*

Returns `true` if command scheduling is enabled on application, else `false`.

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

*Overrides [Module](module.md).[isInProduction](module.md#isinproduction)*

Evaluates if app is running on production.

**Returns:** *boolean*

Returns `true` if application is running on production environment, else `false`.

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

###  isSnapshotting

▸ **isSnapshotting**(): *boolean*

Evaluates if application has `Snapshotter` enabled.

**Returns:** *boolean*

Returns `true` if snapshotting is enabled on application, else fal`se.

___

###  onProcessSignal

▸ **onProcessSignal**(`code`: NodeJS.Signals): *Promise‹void›*

On process signal hook for graceful shutdown.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`code` | NodeJS.Signals | Node's signal process code.  |

**Returns:** *Promise‹void›*

___

###  publish

▸ **publish**(`event`: [Event](../interfaces/types.event.md)): *Promise‹void›*

Publishes event through `EventBus`.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [Event](../interfaces/types.event.md) | Instance implementing `Event` interface.  |

**Returns:** *Promise‹void›*

___

###  reset

▸ **reset**(): *Promise‹void›*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [Module](module.md).[reset](module.md#reset)*

*Overrides void*

**Returns:** *Promise‹void›*

___

###  send

▸ **send**(`command`: [Command](../interfaces/types.command.md)): *Promise‹any›*

Sends command through `CommandBus`.

**`async`** 

**`throws`** {HandlerNotFoundError}
Thrown if handler for message type is not found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`command` | [Command](../interfaces/types.command.md) | Instance implementing `Command` interface. |

**Returns:** *Promise‹any›*

Result of handling command.

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

*Inherited from [BaseApp](baseapp.md).[shutdown](baseapp.md#shutdown)*

*Overrides [Module](module.md).[shutdown](module.md#shutdown)*

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

###  subscribeTo

▸ **subscribeTo**(`eventType`: [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, `handler`: [Handler](../modules/types.md#handler)): *Promise‹void›*

Subscribes to event type with handler.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventType` | [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)› | - |
`handler` | [Handler](../modules/types.md#handler) | Handler function that will executed upon published `Event`.  |

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [BaseApp](../interfaces/types.baseapp.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](extendableerror.md#static-error) |

**Returns:** *boolean*
