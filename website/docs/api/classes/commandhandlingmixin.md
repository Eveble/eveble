---
id: "commandhandlingmixin"
title: "CommandHandlingMixin"
sidebar_label: "CommandHandlingMixin"
---

## Hierarchy

  ↳ [OneToOneHandlingMixin](onetoonehandlingmixin.md)

* OneToOneHandlingMixin

  ↳ **CommandHandlingMixin**

## Implements

* [Controller](../interfaces/types.controller.md)
* [Sender](../interfaces/types.sender.md)
* Controller
* Sender

## Index

### Constructors

* [constructor](commandhandlingmixin.md#constructor)

### Properties

* [commandBus](commandhandlingmixin.md#commandbus)

### Methods

* [ensureHandleability](commandhandlingmixin.md#ensurehandleability)
* [getHandleableTypes](commandhandlingmixin.md#gethandleabletypes)
* [getHandled](commandhandlingmixin.md#gethandled)
* [getHandledCommands](commandhandlingmixin.md#gethandledcommands)
* [getHandledEvents](commandhandlingmixin.md#gethandledevents)
* [getHandledMessages](commandhandlingmixin.md#gethandledmessages)
* [getHandledTypes](commandhandlingmixin.md#gethandledtypes)
* [getHandledTypesNames](commandhandlingmixin.md#gethandledtypesnames)
* [getHandler](commandhandlingmixin.md#gethandler)
* [getHandlerOrThrow](commandhandlingmixin.md#gethandlerorthrow)
* [getHandlers](commandhandlingmixin.md#gethandlers)
* [getTypeByHandler](commandhandlingmixin.md#gettypebyhandler)
* [handle](commandhandlingmixin.md#handle)
* [handles](commandhandlingmixin.md#handles)
* [hasHandler](commandhandlingmixin.md#hashandler)
* [initialize](commandhandlingmixin.md#initialize)
* [isHandleabe](commandhandlingmixin.md#ishandleabe)
* [overrideHandler](commandhandlingmixin.md#overridehandler)
* [registerCommandHandler](commandhandlingmixin.md#registercommandhandler)
* [registerHandler](commandhandlingmixin.md#registerhandler)
* [removeHandler](commandhandlingmixin.md#removehandler)
* [send](commandhandlingmixin.md#send)
* [setHandleableTypes](commandhandlingmixin.md#sethandleabletypes)
* [subscribes](commandhandlingmixin.md#subscribes)

## Constructors

###  constructor

\+ **new CommandHandlingMixin**(): *[CommandHandlingMixin](commandhandlingmixin.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

*Overrides void*

**Returns:** *[CommandHandlingMixin](commandhandlingmixin.md)*

## Properties

###  commandBus

• **commandBus**: *CommandBus*

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Implementation of [Sender](../interfaces/types.sender.md)*

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

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandleableTypes](handlingmixin.md#gethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandleableTypes](cancelingemployment.md#gethandleabletypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [Sender](../interfaces/types.sender.md)*

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

*Implementation of [Sender](../interfaces/types.sender.md)*

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

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getHandler](onetoonehandlingmixin.md#gethandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandler](cancelingemployment.md#gethandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)*

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getHandlerOrThrow](onetoonehandlingmixin.md#gethandlerorthrow)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandlerOrThrow](cancelingemployment.md#gethandlerorthrow)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler)*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandlers](handlingmixin.md#gethandlers)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandlers](cancelingemployment.md#gethandlers)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  getTypeByHandler

▸ **getTypeByHandler**(`handlerReference`: [Handler](../modules/types.md#handler)): *any | undefined*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getTypeByHandler](onetoonehandlingmixin.md#gettypebyhandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getTypeByHandler](cancelingemployment.md#gettypebyhandler)*

**Parameters:**

Name | Type |
------ | ------ |
`handlerReference` | [Handler](../modules/types.md#handler) |

**Returns:** *any | undefined*

___

###  handle

▸ **handle**(`message`: [Message](../interfaces/types.message.md)): *Promise‹any›*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[handle](onetoonehandlingmixin.md#handle)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Message](../interfaces/types.message.md) |

**Returns:** *Promise‹any›*

___

###  handles

▸ **handles**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[handles](handlingmixin.md#handles)*

*Overrides [CancelingEmployment](cancelingemployment.md).[handles](cancelingemployment.md#handles)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *boolean*

*Implementation of [Sender](../interfaces/types.sender.md)*

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

*Implementation of [Sender](../interfaces/types.sender.md)*

*Overrides [OneToOneHandlingMixin](onetoonehandlingmixin.md).[initialize](onetoonehandlingmixin.md#initialize)*

Initializes CommandHandlingMixin.

**`remarks`** 
By defining handler mappings on metadata with annotations: `@handle`
and resolving those mapping with `handles` method - it ensures, that there
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

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[overrideHandler](handlingmixin.md#overridehandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[overrideHandler](cancelingemployment.md#overridehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

___

###  registerCommandHandler

▸ **registerCommandHandler**(`commandType`: [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

Registers command handler and registers that command on command bus.

**`remarks`** 
Ensure first that handler for command is registrable(i.e. only can
handler can exist for specific Command on whole application)

**`throws`** {UnhandleableTypeError}
Thrown if the type argument is not one of handleable types.

**`throws`** {InvalidHandlerError}
Thrown if the handler argument is not a function.

**`throws`** {HandlerExistError}
Thrown if handler would overridden without explicit call.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commandType` | [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)› | A `Command` type for which handler mapping will be created. |
`handler` | [Handler](../modules/types.md#handler) | Handler function that will executed upon handling type. |
`shouldOverride?` | boolean | Flag indicating that handler should be overridden if exist. |

**Returns:** *void*

___

###  registerHandler

▸ **registerHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Implementation of [Sender](../interfaces/types.sender.md)*

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

*Implementation of [Sender](../interfaces/types.sender.md)*

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

Sends(handles) command instance through command bus.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`command` | [Command](../interfaces/types.command.md) | Instance of a `Command` type. |

**Returns:** *Promise‹any›*

Any value that is returned from handler after handling command instance.

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *void*

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[setHandleableTypes](handlingmixin.md#sethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[setHandleableTypes](cancelingemployment.md#sethandleabletypes)*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *void*

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [Sender](../interfaces/types.sender.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[subscribes](handlingmixin.md#subscribes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[subscribes](cancelingemployment.md#subscribes)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*
