---
id: "types.controller"
title: "@eveble/eveble"
sidebar_label: "Controller"
---

## Hierarchy

* **Controller**

  ↳ [Sender](types.sender.md)

  ↳ [Publisher](types.publisher.md)

  ↳ [EventSourceable](types.eventsourceable.md)

## Implemented by

* [Aggregate](../classes/aggregate.md)
* [CommandBus](../classes/commandbus.md)
* [CommandHandlingMixin](../classes/commandhandlingmixin.md)
* [CommandSchedulingService](../classes/commandschedulingservice.md)
* [CommandSchedulingService](../classes/commandschedulingservice.md)
* [EventBus](../classes/eventbus.md)
* [EventHandlingMixin](../classes/eventhandlingmixin.md)
* [EventSourceable](../classes/eventsourceable.md)
* [OneToManyHandlingMixin](../classes/onetomanyhandlingmixin.md)
* [OneToOneHandlingMixin](../classes/onetoonehandlingmixin.md)
* [Process](../classes/process.md)
* [Projection](../classes/projection.md)
* [Service](../classes/service.md)
* [Service](../classes/service.md)

## Index

### Methods

* [ensureHandleability](types.controller.md#ensurehandleability)
* [getHandleableTypes](types.controller.md#gethandleabletypes)
* [getHandled](types.controller.md#gethandled)
* [getHandledTypes](types.controller.md#gethandledtypes)
* [getHandler](types.controller.md#gethandler)
* [getHandlerOrThrow](types.controller.md#gethandlerorthrow)
* [getHandlers](types.controller.md#gethandlers)
* [handle](types.controller.md#handle)
* [handles](types.controller.md#handles)
* [hasHandler](types.controller.md#hashandler)
* [initialize](types.controller.md#initialize)
* [isHandleabe](types.controller.md#ishandleabe)
* [overrideHandler](types.controller.md#overridehandler)
* [registerHandler](types.controller.md#registerhandler)
* [removeHandler](types.controller.md#removehandler)
* [setHandleableTypes](types.controller.md#sethandleabletypes)
* [subscribes](types.controller.md#subscribes)

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handleableTypes`: [MessageType](types.messagetype.md)‹[Message](types.message.md)› | [MessageType](types.messagetype.md)‹[Message](types.message.md)›[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handleableTypes` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)›[] |

**Returns:** *boolean*

▸ **ensureHandleability**(`messageType`: MessageType‹Message›, `handleableTypes`: MessageType‹Message› | MessageType‹Message›[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |
`handleableTypes` | MessageType‹Message› &#124; MessageType‹Message›[] |

**Returns:** *boolean*

___

###  getHandleableTypes

▸ **getHandleableTypes**(): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

▸ **getHandleableTypes**(): *MessageType‹Message›[]*

**Returns:** *MessageType‹Message›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

▸ **getHandled**(`messageType`: MessageType‹Message›): *MessageType‹Message›[]*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |

**Returns:** *MessageType‹Message›[]*

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

▸ **getHandledTypes**(): *MessageType‹Message›[]*

**Returns:** *MessageType‹Message›[]*

___

###  getHandler

▸ **getHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

▸ **getHandler**(`messageType`: MessageType‹Message›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

▸ **getHandlerOrThrow**(`messageType`: MessageType‹Message›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](types.messagetype.md)‹[Message](types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Message](types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

▸ **getHandlers**(): *Map‹MessageType‹Message›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

**Returns:** *Map‹MessageType‹Message›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  handle

▸ **handle**(`message`: [Message](types.message.md), `execution?`: [Execution](../modules/types.md#execution)): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Message](types.message.md) |
`execution?` | [Execution](../modules/types.md#execution) |

**Returns:** *Promise‹any›*

▸ **handle**(`message`: Message, `execution?`: [Execution](../modules/types.md#execution)): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Message |
`execution?` | [Execution](../modules/types.md#execution) |

**Returns:** *Promise‹any›*

___

###  handles

▸ **handles**(): *Map‹[MessageType](types.messagetype.md)‹[Command](types.command.md)›, [Handler](../modules/types.md#handler)›*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Command](types.command.md)›, [Handler](../modules/types.md#handler)›*

▸ **handles**(): *Map‹MessageType‹Command›, [Handler](../modules/types.md#handler)›*

**Returns:** *Map‹MessageType‹Command›, [Handler](../modules/types.md#handler)›*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *boolean*

▸ **hasHandler**(`messageType`: MessageType‹Message›): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *void*

**Returns:** *void*

▸ **initialize**(): *void*

**Returns:** *void*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *boolean*

▸ **isHandleabe**(`messageType`: MessageType‹Message›): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |

**Returns:** *boolean*

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

▸ **overrideHandler**(`messageType`: MessageType‹Message›, `handler`: [Handler](../modules/types.md#handler)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

___

###  registerHandler

▸ **registerHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **registerHandler**(`messageType`: MessageType‹Message›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHandler

▸ **removeHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *void*

▸ **removeHandler**(`messageType`: MessageType‹Message›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | MessageType‹Message› |

**Returns:** *void*

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](types.messagetype.md)‹[Message](types.message.md)› | [MessageType](types.messagetype.md)‹[Message](types.message.md)›[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)›[] |

**Returns:** *void*

▸ **setHandleableTypes**(`handleableTypes`: MessageType‹Message› | MessageType‹Message›[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | MessageType‹Message› &#124; MessageType‹Message›[] |

**Returns:** *void*

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*

▸ **subscribes**(): *Map‹MessageType‹Event›, [Handler](../modules/types.md#handler)›*

**Returns:** *Map‹MessageType‹Event›, [Handler](../modules/types.md#handler)›*
