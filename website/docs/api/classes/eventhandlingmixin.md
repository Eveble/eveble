---
id: "eventhandlingmixin"
title: "EventHandlingMixin"
sidebar_label: "EventHandlingMixin"
---

## Hierarchy

  ↳ [OneToManyHandlingMixin](onetomanyhandlingmixin.md)

* OneToManyHandlingMixin

  ↳ **EventHandlingMixin**

## Implements

* [Controller](../interfaces/types.controller.md)
* [Publisher](../interfaces/types.publisher.md)
* Controller
* Publisher

## Index

### Constructors

* [constructor](eventhandlingmixin.md#constructor)

### Properties

* [eventBus](eventhandlingmixin.md#eventbus)

### Methods

* [ensureHandleability](eventhandlingmixin.md#ensurehandleability)
* [getHandleableTypes](eventhandlingmixin.md#gethandleabletypes)
* [getHandled](eventhandlingmixin.md#gethandled)
* [getHandledCommands](eventhandlingmixin.md#gethandledcommands)
* [getHandledEvents](eventhandlingmixin.md#gethandledevents)
* [getHandledMessages](eventhandlingmixin.md#gethandledmessages)
* [getHandledTypes](eventhandlingmixin.md#gethandledtypes)
* [getHandledTypesNames](eventhandlingmixin.md#gethandledtypesnames)
* [getHandler](eventhandlingmixin.md#gethandler)
* [getHandlerOrThrow](eventhandlingmixin.md#gethandlerorthrow)
* [getHandlers](eventhandlingmixin.md#gethandlers)
* [getSubscribedEvents](eventhandlingmixin.md#getsubscribedevents)
* [getTypeByHandler](eventhandlingmixin.md#gettypebyhandler)
* [handle](eventhandlingmixin.md#handle)
* [handles](eventhandlingmixin.md#handles)
* [hasHandler](eventhandlingmixin.md#hashandler)
* [initialize](eventhandlingmixin.md#initialize)
* [isHandleabe](eventhandlingmixin.md#ishandleabe)
* [on](eventhandlingmixin.md#on)
* [overrideHandler](eventhandlingmixin.md#overridehandler)
* [publish](eventhandlingmixin.md#publish)
* [registerEventHandler](eventhandlingmixin.md#registereventhandler)
* [registerHandler](eventhandlingmixin.md#registerhandler)
* [removeHandler](eventhandlingmixin.md#removehandler)
* [setHandleableTypes](eventhandlingmixin.md#sethandleabletypes)
* [subscribeTo](eventhandlingmixin.md#subscribeto)
* [subscribes](eventhandlingmixin.md#subscribes)

## Constructors

###  constructor

\+ **new EventHandlingMixin**(): *[EventHandlingMixin](eventhandlingmixin.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

*Overrides void*

**Returns:** *[EventHandlingMixin](eventhandlingmixin.md)*

## Properties

###  eventBus

• **eventBus**: *EventBus*

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

###  getSubscribedEvents

▸ **getSubscribedEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

**`alias`** getHandledEvents

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

###  initialize

▸ **initialize**(): *void*

*Implementation of [Publisher](../interfaces/types.publisher.md)*

*Overrides [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[initialize](onetomanyhandlingmixin.md#initialize)*

Initializes EventHandlingMixin.

**`remarks`** 
By defining handler mappings on metadata with annotations: `@subscribe`
and resolving those mapping with `subscribes` method - it ensures, that there
is no leakage in between inheriting classes.

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

**`alias`** handle

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [Event](../interfaces/types.event.md) | Instance implementing `Event` interface.  |

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

Publishes(handles) event instance on event bus.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [Event](../interfaces/types.event.md) | Instance implementing `Event` interface.  |

**Returns:** *Promise‹void›*

___

###  registerEventHandler

▸ **registerEventHandler**(`eventType`: [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

Registers event handler and subscribes to that event on event bus.

**`throws`** {UnhandleableTypeError}
Thrown if the type argument is not one of handleable types.

**`throws`** {InvalidHandlerError}
Thrown if the handler argument is not a function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventType` | [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)› | A `Event` type for which handler mapping will be created. |
`handler` | [Handler](../modules/types.md#handler) | Handler function that will executed upon handling type. |
`shouldOverride?` | boolean | Flag indicating that handler should be overridden if  exist. |

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

###  subscribeTo

▸ **subscribeTo**(`eventType`: [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

Subscribes to event(registers handler).

**`alias`** registerEventHandler

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
