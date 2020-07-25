---
id: "projection"
title: "Projection"
sidebar_label: "Projection"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[StatefulMixin](statefulmixin.md) | [EventHandlingMixin](eventhandlingmixin.md), this› & [StatefulMixin](statefulmixin.md)‹this› & [EventHandlingMixin](eventhandlingmixin.md)‹this›

* SuperPrototypeSelector‹StatefulMixin | EventHandlingMixin, this› & StatefulMixin‹this› & EventHandlingMixin‹this›

  ↳ **Projection**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Controller](../interfaces/types.controller.md)
* [Publisher](../interfaces/types.publisher.md)
* [Projection](../interfaces/types.projection.md)
* Stateful
* Controller
* Publisher
* Projection

## Index

### Constructors

* [constructor](projection.md#constructor)

### Properties

* [eventBus](projection.md#eventbus)
* [state](projection.md#state)

### Methods

* [ensureHandleability](projection.md#ensurehandleability)
* [enterRebuildMode](projection.md#enterrebuildmode)
* [exitRebuildMode](projection.md#exitrebuildmode)
* [getHandleableTypes](projection.md#gethandleabletypes)
* [getHandled](projection.md#gethandled)
* [getHandledCommands](projection.md#gethandledcommands)
* [getHandledEvents](projection.md#gethandledevents)
* [getHandledMessages](projection.md#gethandledmessages)
* [getHandledTypes](projection.md#gethandledtypes)
* [getHandledTypesNames](projection.md#gethandledtypesnames)
* [getHandler](projection.md#gethandler)
* [getHandlerOrThrow](projection.md#gethandlerorthrow)
* [getHandlers](projection.md#gethandlers)
* [getProjectionName](projection.md#getprojectionname)
* [getSelectableStates](projection.md#getselectablestates)
* [getState](projection.md#getstate)
* [getSubscribedEvents](projection.md#getsubscribedevents)
* [getTypeByHandler](projection.md#gettypebyhandler)
* [handle](projection.md#handle)
* [handles](projection.md#handles)
* [hasHandler](projection.md#hashandler)
* [hasState](projection.md#hasstate)
* [initialize](projection.md#initialize)
* [invokeAction](projection.md#invokeaction)
* [isHandleabe](projection.md#ishandleabe)
* [isInOneOfStates](projection.md#isinoneofstates)
* [isInState](projection.md#isinstate)
* [on](projection.md#on)
* [overrideHandler](projection.md#overridehandler)
* [publish](projection.md#publish)
* [registerEventHandler](projection.md#registereventhandler)
* [registerHandler](projection.md#registerhandler)
* [removeHandler](projection.md#removehandler)
* [setHandleableTypes](projection.md#sethandleabletypes)
* [setState](projection.md#setstate)
* [subscribeTo](projection.md#subscribeto)
* [subscribes](projection.md#subscribes)
* [validateState](projection.md#validatestate)

### Object literals

* [STATES](projection.md#static-states)

## Constructors

###  constructor

\+ **new Projection**(): *[Projection](projection.md)*

*Overrides [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

Creates an instance of `Projection`.
Creates an instance of `Projection`.

**Returns:** *[Projection](projection.md)*

## Properties

###  eventBus

• **eventBus**: *EventBus*

*Overrides [EventHandlingMixin](eventhandlingmixin.md).[eventBus](eventhandlingmixin.md#eventbus)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Stateful](../interfaces/types.stateful.md).[state](../interfaces/types.stateful.md#state)*

*Inherited from [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

*Overrides void*

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[ensureHandleability](handlingmixin.md#ensurehandleability)*

*Overrides [CancelingEmployment](cancelingemployment.md).[ensureHandleability](cancelingemployment.md#ensurehandleability)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handleableTypes?` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *boolean*

___

###  enterRebuildMode

▸ **enterRebuildMode**(): *Promise‹void›*

*Implementation of [Projection](../interfaces/types.projection.md)*

Enters to rebuilding mode on projection.

**`async`** 

**`throws`** {ProjectionAlreadyRebuildingError}
Thrown if the projection is already in rebuilding mode.

**Returns:** *Promise‹void›*

___

###  exitRebuildMode

▸ **exitRebuildMode**(): *Promise‹void›*

*Implementation of [Projection](../interfaces/types.projection.md)*

Exits from rebuilding mode on projection.

**`async`** 

**`throws`** {ProjectionNotRebuildingError}
Thrown if the projection is not in rebuilding mode.

**Returns:** *Promise‹void›*

___

###  getHandleableTypes

▸ **getHandleableTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandleableTypes](handlingmixin.md#gethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandleableTypes](cancelingemployment.md#gethandleabletypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandled](handlingmixin.md#gethandled)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandled](cancelingemployment.md#gethandled)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledCommands

▸ **getHandledCommands**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledCommands](handlingmixin.md#gethandledcommands)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledCommands](cancelingemployment.md#gethandledcommands)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

___

###  getHandledEvents

▸ **getHandledEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledEvents](handlingmixin.md#gethandledevents)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledEvents](cancelingemployment.md#gethandledevents)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

___

###  getHandledMessages

▸ **getHandledMessages**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledMessages](handlingmixin.md#gethandledmessages)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledMessages](cancelingemployment.md#gethandledmessages)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledTypes](handlingmixin.md#gethandledtypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledTypes](cancelingemployment.md#gethandledtypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledTypesNames

▸ **getHandledTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledTypesNames](handlingmixin.md#gethandledtypesnames)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledTypesNames](cancelingemployment.md#gethandledtypesnames)*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

___

###  getHandler

▸ **getHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)[] | undefined*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getHandler](onetomanyhandlingmixin.md#gethandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler)[] | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)[]*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getHandlerOrThrow](onetomanyhandlingmixin.md#gethandlerorthrow)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler)[]*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandlers](handlingmixin.md#gethandlers)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandlers](cancelingemployment.md#gethandlers)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  getProjectionName

▸ **getProjectionName**(): *string*

*Implementation of [Projection](../interfaces/types.projection.md)*

Returns projection name.

**Returns:** *string*

Projection name as a constructor name.

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  getSubscribedEvents

▸ **getSubscribedEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

*Inherited from [EventHandlingMixin](eventhandlingmixin.md).[getSubscribedEvents](eventhandlingmixin.md#getsubscribedevents)*

*Overrides void*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

___

###  getTypeByHandler

▸ **getTypeByHandler**(`handlerReference`: [Handler](../modules/types.md#handler)): *any | undefined*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getTypeByHandler](onetomanyhandlingmixin.md#gettypebyhandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`handlerReference` | [Handler](../modules/types.md#handler) |

**Returns:** *any | undefined*

___

###  handle

▸ **handle**(`message`: [Message](../interfaces/types.message.md), `execution?`: [Execution](../modules/types.md#execution)): *Promise‹void›*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[handle](onetomanyhandlingmixin.md#handle)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Message](../interfaces/types.message.md) |
`execution?` | [Execution](../modules/types.md#execution) |

**Returns:** *Promise‹void›*

___

###  handles

▸ **handles**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[handles](handlingmixin.md#handles)*

*Overrides [CancelingEmployment](cancelingemployment.md).[handles](cancelingemployment.md#handles)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *boolean*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[hasHandler](handlingmixin.md#hashandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[hasHandler](cancelingemployment.md#hashandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *boolean*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *void*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Overrides [EventHandlingMixin](eventhandlingmixin.md).[initialize](eventhandlingmixin.md#initialize)*

Initializes Projection.

**Returns:** *void*

___

###  invokeAction

▸ **invokeAction**(`actionName`: string): *Promise‹void›*

*Implementation of [Projection](../interfaces/types.projection.md)*

Runs action on projection if developer-action is defined.
For `ProjectionRebuilder` define methods on projection:
`beforeRebuild()` - On before rebuild hook used for saving state in case rebuilding cant
be completed(rollback).
`commit() `- Commits to current state of projection.
`rollback()` - Rollbacks to previous(before rebuilding) state of projection.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`actionName` | string | Name of action(function) to run.  |

**Returns:** *Promise‹void›*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Inherited from [HandlingMixin](handlingmixin.md).[isHandleabe](handlingmixin.md#ishandleabe)*

*Overrides [CancelingEmployment](cancelingemployment.md).[isHandleabe](cancelingemployment.md#ishandleabe)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handleableTypes?` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *boolean*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInOneOfStates](statefulmixin.md#isinoneofstates)*

*Overrides [Task](task.md).[isInOneOfStates](task.md#isinoneofstates)*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  on

▸ **on**(`event`: [Event](../interfaces/types.event.md), `isRebuildEvent?`: boolean): *Promise‹void›*

*Implementation of [Projection](../interfaces/types.projection.md)*

*Overrides [EventHandlingMixin](eventhandlingmixin.md).[on](eventhandlingmixin.md#on)*

Handles instance of an event.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [Event](../interfaces/types.event.md) | Instance implementing `Event` interface. |
`isRebuildEvent?` | boolean | Flag indicating that event is published for rebuilding projection.  |

**Returns:** *Promise‹void›*

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[overrideHandler](handlingmixin.md#overridehandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[overrideHandler](cancelingemployment.md#overridehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

___

###  publish

▸ **publish**(`event`: [Event](../interfaces/types.event.md)): *Promise‹void›*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [EventHandlingMixin](eventhandlingmixin.md).[publish](eventhandlingmixin.md#publish)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](../interfaces/types.event.md) |

**Returns:** *Promise‹void›*

___

###  registerEventHandler

▸ **registerEventHandler**(`eventType`: [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Inherited from [EventHandlingMixin](eventhandlingmixin.md).[registerEventHandler](eventhandlingmixin.md#registereventhandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`eventType` | [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  registerHandler

▸ **registerHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[registerHandler](onetomanyhandlingmixin.md#registerhandler)*

*Overrides [HandlingMixin](handlingmixin.md).[registerHandler](handlingmixin.md#registerhandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHandler

▸ **removeHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *void*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[removeHandler](handlingmixin.md#removehandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[removeHandler](cancelingemployment.md#removehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *void*

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *void*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[setHandleableTypes](handlingmixin.md#sethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[setHandleableTypes](cancelingemployment.md#sethandleabletypes)*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  subscribeTo

▸ **subscribeTo**(`eventType`: [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Inherited from [EventHandlingMixin](eventhandlingmixin.md).[subscribeTo](eventhandlingmixin.md#subscribeto)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`eventType` | [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[subscribes](handlingmixin.md#subscribes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[subscribes](cancelingemployment.md#subscribes)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*

## Object literals

### `Static` STATES

### ▪ **STATES**: *object*

###  projecting

• **projecting**: *string* = "projecting"

###  rebuilding

• **rebuilding**: *string* = "rebuilding"
