---
id: "service"
title: "Service"
sidebar_label: "Service"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[CommandHandlingMixin](commandhandlingmixin.md) | [EventHandlingMixin](eventhandlingmixin.md), this› & [CommandHandlingMixin](commandhandlingmixin.md)‹this› & [EventHandlingMixin](eventhandlingmixin.md)‹this›

* SuperPrototypeSelector‹CommandHandlingMixin | EventHandlingMixin, this› & CommandHandlingMixin‹this› & EventHandlingMixin‹this›

  ↳ **Service**

  ↳ [CommandSchedulingService](commandschedulingservice.md)

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

* [constructor](service.md#constructor)

### Properties

* [commandBus](service.md#commandbus)
* [eventBus](service.md#eventbus)

### Methods

* [ensureHandleability](service.md#ensurehandleability)
* [getHandleableTypes](service.md#gethandleabletypes)
* [getHandled](service.md#gethandled)
* [getHandledCommands](service.md#gethandledcommands)
* [getHandledEvents](service.md#gethandledevents)
* [getHandledMessages](service.md#gethandledmessages)
* [getHandledTypes](service.md#gethandledtypes)
* [getHandledTypesNames](service.md#gethandledtypesnames)
* [getHandler](service.md#gethandler)
* [getHandlerOrThrow](service.md#gethandlerorthrow)
* [getHandlers](service.md#gethandlers)
* [getSubscribedEvents](service.md#getsubscribedevents)
* [getTypeByHandler](service.md#gettypebyhandler)
* [handle](service.md#handle)
* [handles](service.md#handles)
* [hasHandler](service.md#hashandler)
* [initialize](service.md#initialize)
* [isHandleabe](service.md#ishandleabe)
* [on](service.md#on)
* [overrideHandler](service.md#overridehandler)
* [publish](service.md#publish)
* [registerCommandHandler](service.md#registercommandhandler)
* [registerEventHandler](service.md#registereventhandler)
* [registerHandler](service.md#registerhandler)
* [removeHandler](service.md#removehandler)
* [send](service.md#send)
* [setHandleableTypes](service.md#sethandleabletypes)
* [subscribeTo](service.md#subscribeto)
* [subscribes](service.md#subscribes)

## Constructors

###  constructor

\+ **new Service**(): *[Service](service.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

*Overrides [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

**Returns:** *[Service](service.md)*

## Properties

###  commandBus

• **commandBus**: *CommandBus*

*Overrides [CommandHandlingMixin](commandhandlingmixin.md).[commandBus](commandhandlingmixin.md#commandbus)*

___

###  eventBus

• **eventBus**: *EventBus*

*Overrides [EventHandlingMixin](eventhandlingmixin.md).[eventBus](eventhandlingmixin.md#eventbus)*

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[ensureHandleability](handlingmixin.md#ensurehandleability)*

*Overrides [HandlingMixin](handlingmixin.md).[ensureHandleability](handlingmixin.md#ensurehandleability)*

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

*Overrides [HandlingMixin](handlingmixin.md).[getHandleableTypes](handlingmixin.md#gethandleabletypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandled](handlingmixin.md#gethandled)*

*Overrides [HandlingMixin](handlingmixin.md).[getHandled](handlingmixin.md#gethandled)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledCommands

▸ **getHandledCommands**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledCommands](handlingmixin.md#gethandledcommands)*

*Overrides [HandlingMixin](handlingmixin.md).[getHandledCommands](handlingmixin.md#gethandledcommands)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

___

###  getHandledEvents

▸ **getHandledEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledEvents](handlingmixin.md#gethandledevents)*

*Overrides [HandlingMixin](handlingmixin.md).[getHandledEvents](handlingmixin.md#gethandledevents)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

___

###  getHandledMessages

▸ **getHandledMessages**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledMessages](handlingmixin.md#gethandledmessages)*

*Overrides [HandlingMixin](handlingmixin.md).[getHandledMessages](handlingmixin.md#gethandledmessages)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledTypes](handlingmixin.md#gethandledtypes)*

*Overrides [HandlingMixin](handlingmixin.md).[getHandledTypes](handlingmixin.md#gethandledtypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledTypesNames

▸ **getHandledTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledTypesNames](handlingmixin.md#gethandledtypesnames)*

*Overrides [HandlingMixin](handlingmixin.md).[getHandledTypesNames](handlingmixin.md#gethandledtypesnames)*

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

*Overrides [HandlingMixin](handlingmixin.md).[getHandlers](handlingmixin.md#gethandlers)*

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

*Overrides [HandlingMixin](handlingmixin.md).[handles](handlingmixin.md#handles)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *boolean*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[hasHandler](handlingmixin.md#hashandler)*

*Overrides [HandlingMixin](handlingmixin.md).[hasHandler](handlingmixin.md#hashandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *void*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Overrides [CommandHandlingMixin](commandhandlingmixin.md).[initialize](commandhandlingmixin.md#initialize)*

Initializes Service.

**Returns:** *void*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Inherited from [HandlingMixin](handlingmixin.md).[isHandleabe](handlingmixin.md#ishandleabe)*

*Overrides [HandlingMixin](handlingmixin.md).[isHandleabe](handlingmixin.md#ishandleabe)*

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

*Overrides [HandlingMixin](handlingmixin.md).[overrideHandler](handlingmixin.md#overridehandler)*

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

*Overrides [HandlingMixin](handlingmixin.md).[removeHandler](handlingmixin.md#removehandler)*

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

*Overrides [HandlingMixin](handlingmixin.md).[setHandleableTypes](handlingmixin.md#sethandleabletypes)*

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

*Overrides [HandlingMixin](handlingmixin.md).[subscribes](handlingmixin.md#subscribes)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*
