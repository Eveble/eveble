---
id: "onetomanyhandlingmixin"
title: "OneToManyHandlingMixin"
sidebar_label: "OneToManyHandlingMixin"
---

## Hierarchy

* [HandlingMixin](handlingmixin.md)

* HandlingMixin

  ↳ **OneToManyHandlingMixin**

  ↳ [EventHandlingMixin](eventhandlingmixin.md)

## Implements

* [Controller](../interfaces/types.controller.md)
* Controller

## Index

### Constructors

* [constructor](onetomanyhandlingmixin.md#constructor)

### Methods

* [ensureHandleability](onetomanyhandlingmixin.md#ensurehandleability)
* [getHandleableTypes](onetomanyhandlingmixin.md#gethandleabletypes)
* [getHandled](onetomanyhandlingmixin.md#gethandled)
* [getHandledCommands](onetomanyhandlingmixin.md#gethandledcommands)
* [getHandledEvents](onetomanyhandlingmixin.md#gethandledevents)
* [getHandledMessages](onetomanyhandlingmixin.md#gethandledmessages)
* [getHandledTypes](onetomanyhandlingmixin.md#gethandledtypes)
* [getHandledTypesNames](onetomanyhandlingmixin.md#gethandledtypesnames)
* [getHandler](onetomanyhandlingmixin.md#gethandler)
* [getHandlerOrThrow](onetomanyhandlingmixin.md#gethandlerorthrow)
* [getHandlers](onetomanyhandlingmixin.md#gethandlers)
* [getTypeByHandler](onetomanyhandlingmixin.md#gettypebyhandler)
* [handle](onetomanyhandlingmixin.md#handle)
* [handles](onetomanyhandlingmixin.md#handles)
* [hasHandler](onetomanyhandlingmixin.md#hashandler)
* [initialize](onetomanyhandlingmixin.md#initialize)
* [isHandleabe](onetomanyhandlingmixin.md#ishandleabe)
* [overrideHandler](onetomanyhandlingmixin.md#overridehandler)
* [registerHandler](onetomanyhandlingmixin.md#registerhandler)
* [removeHandler](onetomanyhandlingmixin.md#removehandler)
* [setHandleableTypes](onetomanyhandlingmixin.md#sethandleabletypes)
* [subscribes](onetomanyhandlingmixin.md#subscribes)

## Constructors

###  constructor

\+ **new OneToManyHandlingMixin**(): *[OneToManyHandlingMixin](onetomanyhandlingmixin.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

*Overrides void*

**Returns:** *[OneToManyHandlingMixin](onetomanyhandlingmixin.md)*

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

▸ **getHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)[] | undefined*

*Implementation of [Controller](../interfaces/types.controller.md)*

Returns handlers for message type.

**`throws`** {InvalidMessageableType}
Thrown if the message type argument is not implementing `Messageable` interface.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |

**Returns:** *[Handler](../modules/types.md#handler)[] | undefined*

List with handlers as a functions if found, else `undefined`.

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)[]*

*Implementation of [Controller](../interfaces/types.controller.md)*

Return handlers for message type or throws error if not found.

**`throws`** {HandlerNotFoundError}
Thrown if handler for message type is not found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |

**Returns:** *[Handler](../modules/types.md#handler)[]*

List with handlers as a functions if found, else throws.

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

▸ **handle**(`message`: [Message](../interfaces/types.message.md), `execution?`: [Execution](../modules/types.md#execution)): *Promise‹void›*

*Implementation of [Controller](../interfaces/types.controller.md)*

Handles message type instance sequentially.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | [Message](../interfaces/types.message.md) | Type implementing `Messageable` interface.  |
`execution?` | [Execution](../modules/types.md#execution) | - |

**Returns:** *Promise‹void›*

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

Initializes OneToManyHandlingMixin.

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

**`example`** 
```ts
@define('MyEvent')
class MyEvent extends Event<MyEvent> {
  key: string;
}
@define('MyOtherEvent')
class MyOtherEvent extends Event<MyOtherEvent> {
  key: string;
}

class MyClass extends OneToManyHandlingMixin {
  MyEvent(event: MyEvent): void {
    // ...
  }

  @handles()
  MyOtherEvent(event: MyOtherEvent): void {
    // ...
  }
}
const myClass = new MyClass();
myClass.registerHandler(MyEvent, myClass.MyEvent);
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
