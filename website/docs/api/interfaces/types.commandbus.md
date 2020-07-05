---
id: "types.commandbus"
title: "@eveble/eveble"
sidebar_label: "CommandBus"
---

## Hierarchy

  ↳ [Sender](types.sender.md)

* Sender

  ↳ **CommandBus**

## Implemented by

* [CommandBus](../classes/commandbus.md)

## Index

### Methods

* [ensureHandleability](types.commandbus.md#ensurehandleability)
* [getHandleableTypes](types.commandbus.md#gethandleabletypes)
* [getHandled](types.commandbus.md#gethandled)
* [getHandledTypes](types.commandbus.md#gethandledtypes)
* [getHandledTypesNames](types.commandbus.md#gethandledtypesnames)
* [getHandler](types.commandbus.md#gethandler)
* [getHandlerOrThrow](types.commandbus.md#gethandlerorthrow)
* [getHandlers](types.commandbus.md#gethandlers)
* [handle](types.commandbus.md#handle)
* [handles](types.commandbus.md#handles)
* [hasHandler](types.commandbus.md#hashandler)
* [initialize](types.commandbus.md#initialize)
* [isHandleabe](types.commandbus.md#ishandleabe)
* [onSend](types.commandbus.md#onsend)
* [overrideHandler](types.commandbus.md#overridehandler)
* [registerHandler](types.commandbus.md#registerhandler)
* [removeHandler](types.commandbus.md#removehandler)
* [send](types.commandbus.md#send)
* [setHandleableTypes](types.commandbus.md#sethandleabletypes)
* [subscribes](types.commandbus.md#subscribes)

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

###  onSend

▸ **onSend**(`id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **onSend**(`id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

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

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)›[] |

**Returns:** *void*

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*

*Inherited from [Controller](types.controller.md).[subscribes](types.controller.md#subscribes)*

*Overrides void*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*
