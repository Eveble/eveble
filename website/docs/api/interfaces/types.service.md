---
id: "types.service"
title: "@eveble/eveble"
sidebar_label: "Service"
---

## Hierarchy

  ↳ [Sender](types.sender.md)

  ↳ [Publisher](types.publisher.md)

* Sender

* Publisher

  ↳ **Service**

## Index

### Methods

* [ensureHandleability](types.service.md#ensurehandleability)
* [getHandleableTypes](types.service.md#gethandleabletypes)
* [getHandled](types.service.md#gethandled)
* [getHandledTypes](types.service.md#gethandledtypes)
* [getHandler](types.service.md#gethandler)
* [getHandlerOrThrow](types.service.md#gethandlerorthrow)
* [getHandlers](types.service.md#gethandlers)
* [handle](types.service.md#handle)
* [handles](types.service.md#handles)
* [hasHandler](types.service.md#hashandler)
* [initialize](types.service.md#initialize)
* [isHandleabe](types.service.md#ishandleabe)
* [overrideHandler](types.service.md#overridehandler)
* [publish](types.service.md#publish)
* [registerHandler](types.service.md#registerhandler)
* [removeHandler](types.service.md#removehandler)
* [send](types.service.md#send)
* [setHandleableTypes](types.service.md#sethandleabletypes)
* [subscribeTo](types.service.md#subscribeto)
* [subscribes](types.service.md#subscribes)

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handleableTypes`: [MessageType](types.messagetype.md)‹[Message](types.message.md)› | [MessageType](types.messagetype.md)‹[Message](types.message.md)›[]): *boolean*

*Inherited from [Controller](types.controller.md).[ensureHandleability](types.controller.md#ensurehandleability)*

*Overrides [Controller](types.controller.md).[ensureHandleability](types.controller.md#ensurehandleability)*

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

*Overrides [Controller](types.controller.md).[getHandleableTypes](types.controller.md#gethandleabletypes)*

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

*Inherited from [Controller](types.controller.md).[getHandled](types.controller.md#gethandled)*

*Overrides [Controller](types.controller.md).[getHandled](types.controller.md#gethandled)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

*Inherited from [Controller](types.controller.md).[getHandledTypes](types.controller.md#gethandledtypes)*

*Overrides [Controller](types.controller.md).[getHandledTypes](types.controller.md#gethandledtypes)*

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandler

▸ **getHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

*Inherited from [Controller](types.controller.md).[getHandler](types.controller.md#gethandler)*

*Overrides [Controller](types.controller.md).[getHandler](types.controller.md#gethandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

*Inherited from [Controller](types.controller.md).[getHandlerOrThrow](types.controller.md#gethandlerorthrow)*

*Overrides [Controller](types.controller.md).[getHandlerOrThrow](types.controller.md#gethandlerorthrow)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](types.messagetype.md)‹[Message](types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Inherited from [Controller](types.controller.md).[getHandlers](types.controller.md#gethandlers)*

*Overrides [Controller](types.controller.md).[getHandlers](types.controller.md#gethandlers)*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Message](types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  handle

▸ **handle**(`message`: [Message](types.message.md), `execution?`: [Execution](../modules/types.md#execution)): *Promise‹any›*

*Inherited from [Controller](types.controller.md).[handle](types.controller.md#handle)*

*Overrides [Controller](types.controller.md).[handle](types.controller.md#handle)*

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

*Overrides [Controller](types.controller.md).[handles](types.controller.md#handles)*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Command](types.command.md)›, [Handler](../modules/types.md#handler)›*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *boolean*

*Inherited from [Controller](types.controller.md).[hasHandler](types.controller.md#hashandler)*

*Overrides [Controller](types.controller.md).[hasHandler](types.controller.md#hashandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *void*

*Inherited from [Controller](types.controller.md).[initialize](types.controller.md#initialize)*

*Overrides [Controller](types.controller.md).[initialize](types.controller.md#initialize)*

**Returns:** *void*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *boolean*

*Inherited from [Controller](types.controller.md).[isHandleabe](types.controller.md#ishandleabe)*

*Overrides [Controller](types.controller.md).[isHandleabe](types.controller.md#ishandleabe)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *boolean*

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

*Inherited from [Controller](types.controller.md).[overrideHandler](types.controller.md#overridehandler)*

*Overrides [Controller](types.controller.md).[overrideHandler](types.controller.md#overridehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

___

###  publish

▸ **publish**(`event`: [Event](types.event.md)): *Promise‹void›*

*Inherited from [Publisher](types.publisher.md).[publish](types.publisher.md#publish)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](types.event.md) |

**Returns:** *Promise‹void›*

___

###  registerHandler

▸ **registerHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Inherited from [Controller](types.controller.md).[registerHandler](types.controller.md#registerhandler)*

*Overrides [Controller](types.controller.md).[registerHandler](types.controller.md#registerhandler)*

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

*Overrides [Controller](types.controller.md).[removeHandler](types.controller.md#removehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *void*

___

###  send

▸ **send**(`command`: [Command](types.command.md)): *Promise‹any›*

*Inherited from [Sender](types.sender.md).[send](types.sender.md#send)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`command` | [Command](types.command.md) |

**Returns:** *Promise‹any›*

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](types.messagetype.md)‹[Message](types.message.md)› | [MessageType](types.messagetype.md)‹[Message](types.message.md)›[]): *void*

*Inherited from [Controller](types.controller.md).[setHandleableTypes](types.controller.md#sethandleabletypes)*

*Overrides [Controller](types.controller.md).[setHandleableTypes](types.controller.md#sethandleabletypes)*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)›[] |

**Returns:** *void*

___

###  subscribeTo

▸ **subscribeTo**(`event`: any, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Inherited from [Publisher](types.publisher.md).[subscribeTo](types.publisher.md#subscribeto)*

*Overrides void*

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

*Overrides [Controller](types.controller.md).[subscribes](types.controller.md#subscribes)*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*
