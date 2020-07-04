---
id: "types.eventbus"
title: "@eveble/eveble"
sidebar_label: "EventBus"
---

## Hierarchy

  ↳ [Publisher](types.publisher.md)

* Publisher

  ↳ **EventBus**

## Implemented by

* [EventBus](../classes/eventbus.md)

## Index

### Methods

* [ensureHandleability](types.eventbus.md#ensurehandleability)
* [getHandleableTypes](types.eventbus.md#gethandleabletypes)
* [getHandled](types.eventbus.md#gethandled)
* [getHandledTypes](types.eventbus.md#gethandledtypes)
* [getHandledTypesNames](types.eventbus.md#gethandledtypesnames)
* [getHandler](types.eventbus.md#gethandler)
* [getHandlerOrThrow](types.eventbus.md#gethandlerorthrow)
* [getHandlers](types.eventbus.md#gethandlers)
* [handle](types.eventbus.md#handle)
* [handles](types.eventbus.md#handles)
* [hasHandler](types.eventbus.md#hashandler)
* [initialize](types.eventbus.md#initialize)
* [isHandleabe](types.eventbus.md#ishandleabe)
* [onPublish](types.eventbus.md#onpublish)
* [overrideHandler](types.eventbus.md#overridehandler)
* [publish](types.eventbus.md#publish)
* [registerHandler](types.eventbus.md#registerhandler)
* [removeHandler](types.eventbus.md#removehandler)
* [setHandleableTypes](types.eventbus.md#sethandleabletypes)
* [subscribeTo](types.eventbus.md#subscribeto)
* [subscribes](types.eventbus.md#subscribes)

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

###  getHandledTypesNames

▸ **getHandledTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

▸ **getHandledTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

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

###  onPublish

▸ **onPublish**(`id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **onPublish**(`id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

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

*Overrides void*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*
