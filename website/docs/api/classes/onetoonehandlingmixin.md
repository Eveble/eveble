---
id: "onetoonehandlingmixin"
title: "OneToOneHandlingMixin"
sidebar_label: "OneToOneHandlingMixin"
---

## Hierarchy

* [HandlingMixin](handlingmixin.md)

* HandlingMixin

  ↳ **OneToOneHandlingMixin**

  ↳ [CommandHandlingMixin](commandhandlingmixin.md)

## Implements

* [Controller](../interfaces/types.controller.md)
* Controller

## Index

### Constructors

* [constructor](onetoonehandlingmixin.md#constructor)

### Methods

* [ensureHandleability](onetoonehandlingmixin.md#ensurehandleability)
* [getHandleableTypes](onetoonehandlingmixin.md#gethandleabletypes)
* [getHandled](onetoonehandlingmixin.md#gethandled)
* [getHandledCommands](onetoonehandlingmixin.md#gethandledcommands)
* [getHandledEvents](onetoonehandlingmixin.md#gethandledevents)
* [getHandledMessages](onetoonehandlingmixin.md#gethandledmessages)
* [getHandledTypes](onetoonehandlingmixin.md#gethandledtypes)
* [getHandledTypesNames](onetoonehandlingmixin.md#gethandledtypesnames)
* [getHandler](onetoonehandlingmixin.md#gethandler)
* [getHandlerOrThrow](onetoonehandlingmixin.md#gethandlerorthrow)
* [getHandlers](onetoonehandlingmixin.md#gethandlers)
* [getTypeByHandler](onetoonehandlingmixin.md#gettypebyhandler)
* [handle](onetoonehandlingmixin.md#handle)
* [handles](onetoonehandlingmixin.md#handles)
* [hasHandler](onetoonehandlingmixin.md#hashandler)
* [initialize](onetoonehandlingmixin.md#initialize)
* [isHandleabe](onetoonehandlingmixin.md#ishandleabe)
* [overrideHandler](onetoonehandlingmixin.md#overridehandler)
* [registerHandler](onetoonehandlingmixin.md#registerhandler)
* [removeHandler](onetoonehandlingmixin.md#removehandler)
* [setHandleableTypes](onetoonehandlingmixin.md#sethandleabletypes)
* [subscribes](onetoonehandlingmixin.md#subscribes)

## Constructors

###  constructor

\+ **new OneToOneHandlingMixin**(): *[OneToOneHandlingMixin](onetoonehandlingmixin.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

*Overrides void*

**Returns:** *[OneToOneHandlingMixin](onetoonehandlingmixin.md)*

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Implementation of [Controller](../interfaces/types.controller.md)*

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

*Implementation of [Controller](../interfaces/types.controller.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandleableTypes](handlingmixin.md#gethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandleableTypes](cancelingemployment.md#gethandleabletypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [Controller](../interfaces/types.controller.md)*

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

*Implementation of [Controller](../interfaces/types.controller.md)*

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

*Implementation of [Controller](../interfaces/types.controller.md)*

Returns handler for message type.

**`throws`** {InvalidMessageableType}
Thrown if the message type argument is not implementing `Messageable` interface.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |

**Returns:** *[Handler](../modules/types.md#handler) | undefined*

Handler as a function if found, else `undefined`.

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)*

*Implementation of [Controller](../interfaces/types.controller.md)*

Return handler for message type or throws error if not found.

**`throws`** {HandlerNotFoundError}
Thrown if handler for message type is not found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |

**Returns:** *[Handler](../modules/types.md#handler)*

Handler as a function if found, else throws.

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Implementation of [Controller](../interfaces/types.controller.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandlers](handlingmixin.md#gethandlers)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandlers](cancelingemployment.md#gethandlers)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  getTypeByHandler

▸ **getTypeByHandler**(`handlerReference`: [Handler](../modules/types.md#handler)): *any | undefined*

Resolves message type by handler reference.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`handlerReference` | [Handler](../modules/types.md#handler) | Reference to handler function. |

**Returns:** *any | undefined*

Message type if handler is matching one of handlers on class, else `undefined`.

___

###  handle

▸ **handle**(`message`: [Message](../interfaces/types.message.md)): *Promise‹any›*

Handles message type instance.

**`async`** 

**`throws`** {HandlerNotFoundError}
Thrown if handler for type is not found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | [Message](../interfaces/types.message.md) | Type implementing `Messageable` interface. |

**Returns:** *Promise‹any›*

Any value returned by successful or unsuccessful handling.

___

###  handles

▸ **handles**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [Controller](../interfaces/types.controller.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[handles](handlingmixin.md#handles)*

*Overrides [CancelingEmployment](cancelingemployment.md).[handles](cancelingemployment.md#handles)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *boolean*

*Implementation of [Controller](../interfaces/types.controller.md)*

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

*Implementation of [Controller](../interfaces/types.controller.md)*

Initializes OneToOneHandlingMixin.

**`remarks`** 
By defining handler mappings on metadata with annotations: `@handle`,
`@subscribe` and resolving those mapping with `handles`, `subscribes` method -
it ensures, that there is no leakage in between inheriting classes.

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

*Implementation of [Controller](../interfaces/types.controller.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[overrideHandler](handlingmixin.md#overridehandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[overrideHandler](cancelingemployment.md#overridehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

___

###  registerHandler

▸ **registerHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Implementation of [Controller](../interfaces/types.controller.md)*

*Overrides [HandlingMixin](handlingmixin.md).[registerHandler](handlingmixin.md#registerhandler)*

Registers handler for message type.

**`throws`** {UnhandleableTypeError}
Thrown if the type argument is not one of handleable types.

**`throws`** {InvalidHandlerError}
Thrown if the handler argument is not a function.

**`throws`** {HandlerExistError}
Thrown if handler would overridden without explicit call.

**`example`** 
```ts
@define('MyCommand')
class MyCommand extends Command<MyCommand> {
  key: string;
}
define('MyOtherCommand')
class MyOtherCommand extends Command<MyOtherCommand> {
  key: string;
}

class MyClass extends OneToOneHandlingMixin {
  MyCommand(command: MyCommand): void {
    // ...
  }

  @handles()
  MyOtherCommand(command: MyOtherCommand): void {
    // ...
  }
}
const myClass = new MyClass();
// Defined externally or during construction
myClass.registerHandler(MyCommand, myClass.MyCommand);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |
`handler` | [Handler](../modules/types.md#handler) | Handler function that will executed upon handling message type. |
`shouldOverride?` | boolean | Flag indicating that handler should be overridden if exist. |

**Returns:** *void*

___

###  removeHandler

▸ **removeHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *void*

*Implementation of [Controller](../interfaces/types.controller.md)*

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

*Implementation of [Controller](../interfaces/types.controller.md)*

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

*Implementation of [Controller](../interfaces/types.controller.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[subscribes](handlingmixin.md#subscribes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[subscribes](cancelingemployment.md#subscribes)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*
