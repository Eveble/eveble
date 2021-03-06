---
id: "types.publisher"
title: "@eveble/eveble"
sidebar_label: "Publisher"
---

## Hierarchy

* [Controller](types.controller.md)

* Controller

  ↳ **Publisher**

  ↳ [EventBus](types.eventbus.md)

  ↳ [Service](types.service.md)

## Implemented by

* [CommandSchedulingService](../classes/commandschedulingservice.md)
* [EventHandlingMixin](../classes/eventhandlingmixin.md)
* [Projection](../classes/projection.md)
* [Service](../classes/service.md)

## Index

### Methods

* [ensureHandleability](types.publisher.md#ensurehandleability)
* [getHandleableTypes](types.publisher.md#gethandleabletypes)
* [getHandled](types.publisher.md#gethandled)
* [getHandledTypes](types.publisher.md#gethandledtypes)
* [getHandler](types.publisher.md#gethandler)
* [getHandlerOrThrow](types.publisher.md#gethandlerorthrow)
* [getHandlers](types.publisher.md#gethandlers)
* [handle](types.publisher.md#handle)
* [handles](types.publisher.md#handles)
* [hasHandler](types.publisher.md#hashandler)
* [initialize](types.publisher.md#initialize)
* [isHandleabe](types.publisher.md#ishandleabe)
* [overrideHandler](types.publisher.md#overridehandler)
* [publish](types.publisher.md#publish)
* [registerHandler](types.publisher.md#registerhandler)
* [removeHandler](types.publisher.md#removehandler)
* [setHandleableTypes](types.publisher.md#sethandleabletypes)
* [subscribeTo](types.publisher.md#subscribeto)
* [subscribes](types.publisher.md#subscribes)

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handleableTypes`: [MessageType](types.messagetype.md)‹[Message](types.message.md)› | [MessageType](types.messagetype.md)‹[Message](types.message.md)›[]): *boolean*

*Inherited from [Controller](types.controller.md).[ensureHandleability](types.controller.md#ensurehandleability)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handleableTypes` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)›[] |

**Returns:** *boolean*

___

###  getHandleableTypes

▸ **getHandleableTypes**(): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

*Inherited from [Controller](types.controller.md).[getHandleableTypes](types.controller.md#gethandleabletypes)*

*Overrides void*

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

*Inherited from [Controller](types.controller.md).[getHandled](types.controller.md#gethandled)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

*Inherited from [Controller](types.controller.md).[getHandledTypes](types.controller.md#gethandledtypes)*

*Overrides void*

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandler

▸ **getHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

*Inherited from [Controller](types.controller.md).[getHandler](types.controller.md#gethandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

*Inherited from [Controller](types.controller.md).[getHandlerOrThrow](types.controller.md#gethandlerorthrow)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](types.messagetype.md)‹[Message](types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Inherited from [Controller](types.controller.md).[getHandlers](types.controller.md#gethandlers)*

*Overrides void*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Message](types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  handle

▸ **handle**(`message`: [Message](types.message.md), `execution?`: [Execution](../modules/types.md#execution)): *Promise‹any›*

*Inherited from [Controller](types.controller.md).[handle](types.controller.md#handle)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Message](types.message.md) |
`execution?` | [Execution](../modules/types.md#execution) |

**Returns:** *Promise‹any›*

___

###  handles

▸ **handles**(): *Map‹[MessageType](types.messagetype.md)‹[Command](types.command.md)›, [Handler](../modules/types.md#handler)›*

*Inherited from [Controller](types.controller.md).[handles](types.controller.md#handles)*

*Overrides void*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Command](types.command.md)›, [Handler](../modules/types.md#handler)›*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *boolean*

*Inherited from [Controller](types.controller.md).[hasHandler](types.controller.md#hashandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *void*

*Inherited from [Controller](types.controller.md).[initialize](types.controller.md#initialize)*

*Overrides void*

**Returns:** *void*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *boolean*

*Inherited from [Controller](types.controller.md).[isHandleabe](types.controller.md#ishandleabe)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *boolean*

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

*Inherited from [Controller](types.controller.md).[overrideHandler](types.controller.md#overridehandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

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

###  registerHandler

▸ **registerHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Inherited from [Controller](types.controller.md).[registerHandler](types.controller.md#registerhandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHandler

▸ **removeHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *void*

*Inherited from [Controller](types.controller.md).[removeHandler](types.controller.md#removehandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *void*

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](types.messagetype.md)‹[Message](types.message.md)› | [MessageType](types.messagetype.md)‹[Message](types.message.md)›[]): *void*

*Inherited from [Controller](types.controller.md).[setHandleableTypes](types.controller.md#sethandleabletypes)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)›[] |

**Returns:** *void*

___

###  subscribeTo

▸ **subscribeTo**(`event`: any, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **subscribeTo**(`event`: any, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*

*Inherited from [Controller](types.controller.md).[subscribes](types.controller.md#subscribes)*

*Overrides void*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*
