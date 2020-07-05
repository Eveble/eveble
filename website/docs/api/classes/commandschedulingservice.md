---
id: "commandschedulingservice"
title: "CommandSchedulingService"
sidebar_label: "CommandSchedulingService"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [Service](service.md)

* Service

  ↳ **CommandSchedulingService**

## Implements

* [Controller](../interfaces/types.controller.md)
* [Sender](../interfaces/types.sender.md)
* [Controller](../interfaces/types.controller.md)
* [Publisher](../interfaces/types.publisher.md)
* Controller
* Sender
* Controller
* Publisher

## Index

### Constructors

* [constructor](commandschedulingservice.md#constructor)

### Properties

* [commandBus](commandschedulingservice.md#commandbus)
* [eventBus](commandschedulingservice.md#eventbus)

### Methods

* [ScheduleCommand](commandschedulingservice.md#schedulecommand)
* [UnscheduleCommand](commandschedulingservice.md#unschedulecommand)
* [ensureHandleability](commandschedulingservice.md#ensurehandleability)
* [getHandleableTypes](commandschedulingservice.md#gethandleabletypes)
* [getHandled](commandschedulingservice.md#gethandled)
* [getHandledCommands](commandschedulingservice.md#gethandledcommands)
* [getHandledEvents](commandschedulingservice.md#gethandledevents)
* [getHandledMessages](commandschedulingservice.md#gethandledmessages)
* [getHandledTypes](commandschedulingservice.md#gethandledtypes)
* [getHandledTypesNames](commandschedulingservice.md#gethandledtypesnames)
* [getHandler](commandschedulingservice.md#gethandler)
* [getHandlerOrThrow](commandschedulingservice.md#gethandlerorthrow)
* [getHandlers](commandschedulingservice.md#gethandlers)
* [getSubscribedEvents](commandschedulingservice.md#getsubscribedevents)
* [getTypeByHandler](commandschedulingservice.md#gettypebyhandler)
* [handle](commandschedulingservice.md#handle)
* [handles](commandschedulingservice.md#handles)
* [hasHandler](commandschedulingservice.md#hashandler)
* [initialize](commandschedulingservice.md#initialize)
* [isHandleabe](commandschedulingservice.md#ishandleabe)
* [on](commandschedulingservice.md#on)
* [overrideHandler](commandschedulingservice.md#overridehandler)
* [publish](commandschedulingservice.md#publish)
* [registerCommandHandler](commandschedulingservice.md#registercommandhandler)
* [registerEventHandler](commandschedulingservice.md#registereventhandler)
* [registerHandler](commandschedulingservice.md#registerhandler)
* [removeHandler](commandschedulingservice.md#removehandler)
* [send](commandschedulingservice.md#send)
* [setHandleableTypes](commandschedulingservice.md#sethandleabletypes)
* [subscribeTo](commandschedulingservice.md#subscribeto)
* [subscribes](commandschedulingservice.md#subscribes)

## Constructors

###  constructor

\+ **new CommandSchedulingService**(): *[CommandSchedulingService](commandschedulingservice.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

*Overrides void*

**Returns:** *[CommandSchedulingService](commandschedulingservice.md)*

## Properties

###  commandBus

• **commandBus**: *CommandBus*

*Overrides [Service](service.md).[commandBus](service.md#commandbus)*

___

###  eventBus

• **eventBus**: *EventBus*

*Overrides [Service](service.md).[eventBus](service.md#eventbus)*

## Methods

###  ScheduleCommand

▸ **ScheduleCommand**(`scheduleCommand`: [ScheduleCommand](schedulecommand.md)): *Promise‹void›*

Handles scheduling delayed commands with scheduler or sends command immediately if its deliverable.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scheduleCommand` | [ScheduleCommand](schedulecommand.md) | Instance of `ScheduleCommand`.  |

**Returns:** *Promise‹void›*

___

###  UnscheduleCommand

▸ **UnscheduleCommand**(`unscheduleCommand`: [UnscheduleCommand](unschedulecommand.md)): *Promise‹void›*

Unschedules command from scheduler.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`unscheduleCommand` | [UnscheduleCommand](unschedulecommand.md) | Instance of `UnscheduleCommand`.  |

**Returns:** *Promise‹void›*

___

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

▸ **getHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler) | undefined*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getHandler](onetoonehandlingmixin.md#gethandler)*

*Overrides [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getHandler](onetomanyhandlingmixin.md#gethandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getHandlerOrThrow](onetoonehandlingmixin.md#gethandlerorthrow)*

*Overrides [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getHandlerOrThrow](onetomanyhandlingmixin.md#gethandlerorthrow)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler)*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandlers](handlingmixin.md#gethandlers)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandlers](cancelingemployment.md#gethandlers)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  getSubscribedEvents

▸ **getSubscribedEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

*Inherited from [EventHandlingMixin](eventhandlingmixin.md).[getSubscribedEvents](eventhandlingmixin.md#getsubscribedevents)*

*Overrides void*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

___

###  getTypeByHandler

▸ **getTypeByHandler**(`handlerReference`: [Handler](../modules/types.md#handler)): *any | undefined*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getTypeByHandler](onetoonehandlingmixin.md#gettypebyhandler)*

*Overrides [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getTypeByHandler](onetomanyhandlingmixin.md#gettypebyhandler)*

**Parameters:**

Name | Type |
------ | ------ |
`handlerReference` | [Handler](../modules/types.md#handler) |

**Returns:** *any | undefined*

___

###  handle

▸ **handle**(`message`: [Message](../interfaces/types.message.md)): *Promise‹any›*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[handle](onetoonehandlingmixin.md#handle)*

*Overrides [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[handle](onetomanyhandlingmixin.md#handle)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Message](../interfaces/types.message.md) |

**Returns:** *Promise‹any›*

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

###  initialize

▸ **initialize**(): *void*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [Service](service.md).[initialize](service.md#initialize)*

*Overrides [CommandHandlingMixin](commandhandlingmixin.md).[initialize](commandhandlingmixin.md#initialize)*

**Returns:** *void*

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

###  on

▸ **on**(`event`: [Event](../interfaces/types.event.md)): *Promise‹void›*

*Inherited from [EventHandlingMixin](eventhandlingmixin.md).[on](eventhandlingmixin.md#on)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](../interfaces/types.event.md) |

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

###  registerCommandHandler

▸ **registerCommandHandler**(`commandType`: [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Inherited from [CommandHandlingMixin](commandhandlingmixin.md).[registerCommandHandler](commandhandlingmixin.md#registercommandhandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`commandType` | [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

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

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[registerHandler](onetoonehandlingmixin.md#registerhandler)*

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

###  send

▸ **send**(`command`: [Command](../interfaces/types.command.md)): *Promise‹any›*

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [CommandHandlingMixin](commandhandlingmixin.md).[send](commandhandlingmixin.md#send)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`command` | [Command](../interfaces/types.command.md) |

**Returns:** *Promise‹any›*

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
