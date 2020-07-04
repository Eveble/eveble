---
id: "handlingmixin"
title: "HandlingMixin"
sidebar_label: "HandlingMixin"
---

## Hierarchy

* **HandlingMixin**

  ↳ [OneToOneHandlingMixin](onetoonehandlingmixin.md)

  ↳ [OneToManyHandlingMixin](onetomanyhandlingmixin.md)

## Index

### Constructors

* [constructor](handlingmixin.md#constructor)

### Methods

* [ensureHandleability](handlingmixin.md#ensurehandleability)
* [getHandleableTypes](handlingmixin.md#gethandleabletypes)
* [getHandled](handlingmixin.md#gethandled)
* [getHandledCommands](handlingmixin.md#gethandledcommands)
* [getHandledEvents](handlingmixin.md#gethandledevents)
* [getHandledMessages](handlingmixin.md#gethandledmessages)
* [getHandledTypes](handlingmixin.md#gethandledtypes)
* [getHandledTypesNames](handlingmixin.md#gethandledtypesnames)
* [getHandlers](handlingmixin.md#gethandlers)
* [handles](handlingmixin.md#handles)
* [hasHandler](handlingmixin.md#hashandler)
* [isHandleabe](handlingmixin.md#ishandleabe)
* [overrideHandler](handlingmixin.md#overridehandler)
* [registerHandler](handlingmixin.md#registerhandler)
* [removeHandler](handlingmixin.md#removehandler)
* [setHandleableTypes](handlingmixin.md#sethandleabletypes)
* [subscribes](handlingmixin.md#subscribes)

## Constructors

###  constructor

\+ **new HandlingMixin**(): *[HandlingMixin](handlingmixin.md)*

Creates an instance of HandlingMixin.
Creates an instance of HandlingMixin.

**Returns:** *[HandlingMixin](handlingmixin.md)*

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

Ensures that provided type can be handled by verifying it against handleable types.

**`throws`** {UnhandleableTypeError}
Thrown if message type is not one of handleable types.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |
`handleableTypes?` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] | Optional handleable types to be verified against on runtime. |

**Returns:** *boolean*

Returns true if `type` is handleable, else `false`.

___

###  getHandleableTypes

▸ **getHandleableTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

Returns handleable message types.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

Returns handleable message types as a list with message types.

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

Returns all message types that matches evaluated one by equal constructor or subclassing.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

List of all handled types matching evaluated one.

___

###  getHandledCommands

▸ **getHandledCommands**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

Returns all commands that can be handled.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

List of all handled types matching `Command`.

___

###  getHandledEvents

▸ **getHandledEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

Returns all commands that can be handled.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

List of all handled types matching `Event`.

___

###  getHandledMessages

▸ **getHandledMessages**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

Returns all messages that can be handled.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

List of all handled types matching `Message`.

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

Returns all handled message types.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

List of all handled message types.

___

###  getHandledTypesNames

▸ **getHandledTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

Returns all type names that can be handled.

**Returns:** *[TypeName](../modules/types.md#typename)[]*

List of all handled type names

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

Returns all available handler mappings.

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

Returns mappings of all available handlers by message type: handler(s) relation.

___

###  handles

▸ **handles**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

Returns all handled `Command` mappings.

**`example`** 
```ts
class MyController extends HandlingMixin {
  initialize(): void {
    this.setupHandlers({
      handlers: this.handles(),
    });
  }
  // ...
  MyCommandHandlerMethod(@handle command: MyCommand): boolean {
    return command.key === 'my-string';
  }
}
const controller = new MyController();
controller.registerHandler = sinon.stub();
controller.initialize();

expect(controller.registerHandler).to.be.calledOnce;
expect(controller.registerHandler).to.be.calledWithExactly(
  MyCommand,
  controller.MyCommandHandlerMethod
);
```

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

Returns all handled `Command`(s) defined with `@handle` annotation
or allows developer to define manually handlers.

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *boolean*

Evaluates if handler for message type is registered.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |

**Returns:** *boolean*

Returns `true` if handler for message type is registered, else `false`.

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

Evaluates if type can be handled.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |
`handleableTypes?` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] | Optional handleable types to be verified against on runtime. |

**Returns:** *boolean*

Returns `true` if message type can be handled, else `false`.

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

Overrides already existing handler for message type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface. |
`handler` | [Handler](../modules/types.md#handler) | Handler function that will executed upon handling message type.  |

**Returns:** *void*

___

###  registerHandler

▸ **registerHandler**(`_messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `_handler`: [Handler](../modules/types.md#handler), `_shouldOverride?`: boolean): *void*

[!] Placeholder for registering handler for message type.

**Parameters:**

Name | Type |
------ | ------ |
`_messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`_handler` | [Handler](../modules/types.md#handler) |
`_shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHandler

▸ **removeHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *void*

Removes handler by type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | Type implementing `MessageableType` interface.  |

**Returns:** *void*

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *void*

Sets the only allowed handleable message types.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`handleableTypes` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] | List of allowed types for handling.  |

**Returns:** *void*

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*

Returns all handled `Event` mappings.

**`example`** 
```ts
class MyController extends HandlingMixin {
  initialize(): void {
    this.setupHandlers({
      handlers: this.subscribes(),
    });
  }
  // ...
  MyEventHandlerMethod(@subscribe event: MyEvent): boolean {
    return event.key === 'my-string';
  }
}
const controller = new MyController();
controller.registerHandler = sinon.stub();
controller.initialize();

expect(controller.registerHandler).to.be.calledOnce;
expect(controller.registerHandler).to.be.calledWithExactly(
  MyEvent,
  controller.MyEventHandlerMethod
);
```

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*

Returns all handled `Events`(s) defined with `@subscribe` annotation
or allows developer to define manually handlers.
