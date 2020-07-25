---
id: "router"
title: "Router"
sidebar_label: "Router"
---

## Hierarchy

* **Router**

## Implements

* [Router](../interfaces/types.router.md)
* Router

## Index

### Constructors

* [constructor](router.md#constructor)

### Properties

* [EventSourceableType](router.md#eventsourceabletype)
* [InitializingMessageType](router.md#initializingmessagetype)
* [injector](router.md#injector)
* [routedCommands](router.md#routedcommands)
* [routedEvents](router.md#routedevents)

### Methods

* [handleSaveErrors](router.md#handlesaveerrors)
* [initialize](router.md#initialize)
* [initializingMessageHandler](router.md#initializingmessagehandler)
* [messageHandler](router.md#messagehandler)

## Constructors

###  constructor

\+ **new Router**(`EventSourceableType?`: [EventSourceableType](../interfaces/types.eventsourceabletype.md), `InitializingMessageType?`: [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)›, `routedCommands?`: [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[], `routedEvents?`: [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]): *[Router](router.md)*

Creates an instance of Router.
Creates an instance of Router.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`EventSourceableType?` | [EventSourceableType](../interfaces/types.eventsourceabletype.md) | `EventSourceable` type(constructor) for routing. |
`InitializingMessageType?` | [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) &#124; [Event](../interfaces/types.event.md)› | Initializing message of event sourceable. |
`routedCommands?` | [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[] | Optional routed commands. |
`routedEvents?` | [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[] | Optional routed events.  |

**Returns:** *[Router](router.md)*

## Properties

###  EventSourceableType

• **EventSourceableType**: *EventSourceableType*

*Implementation of [Router](../interfaces/types.router.md).[EventSourceableType](../interfaces/types.router.md#eventsourceabletype)*

___

###  InitializingMessageType

• **InitializingMessageType**: *MessageType‹Command | Event›*

*Implementation of [Router](../interfaces/types.router.md).[InitializingMessageType](../interfaces/types.router.md#initializingmessagetype)*

___

###  injector

• **injector**: *Injector*

___

###  routedCommands

• **routedCommands**: *MessageType‹Command›[]*

*Implementation of [Router](../interfaces/types.router.md).[routedCommands](../interfaces/types.router.md#routedcommands)*

___

###  routedEvents

• **routedEvents**: *MessageType‹Event›[]*

*Implementation of [Router](../interfaces/types.router.md).[routedEvents](../interfaces/types.router.md#routedevents)*

## Methods

###  handleSaveErrors

▸ **handleSaveErrors**(`error`: Error, `message`: [Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md), `eventSourceableId`: string | [Guid](guid.md)): *Promise‹void›*

Handles errors related to persisting event sourceable.

**`async`** 

**`throws`** {Error}
Thrown if the error is not a instance of `CommitConcurrencyError`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`error` | Error | Instance of `Error` not related to domain. |
`message` | [Command](../interfaces/types.command.md) &#124; [Event](../interfaces/types.event.md) | Instance of `Command` or `Event`. |
`eventSourceableId` | string &#124; [Guid](guid.md) | Event sourceable identifier as string or instance of `Guid` |

**Returns:** *Promise‹void›*

___

###  initialize

▸ **initialize**(): *void*

*Implementation of [Router](../interfaces/types.router.md)*

Initializes Router.

**`throws`** {MissingEventSourceableError}
Thrown if events sourceable is not set on router.

**`throws`** {MissingInitializingMessageError}
Thrown if initializing message is not set on router and can't be resolved from
event sourceable.

**Returns:** *void*

___

###  initializingMessageHandler

▸ **initializingMessageHandler**(`message`: [Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)): *Promise‹void›*

Initializing message handler.

**`async`** 

**`throws`** {Error}
Thrown if non-DomainError or CommitConcurrencyError is thrown on event
sourceable message handler.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | [Command](../interfaces/types.command.md) &#124; [Event](../interfaces/types.event.md) | Instance of `Command` or `Event`. |

**Returns:** *Promise‹void›*

___

###  messageHandler

▸ **messageHandler**(`message`: [Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)): *Promise‹void›*

Default message handler.

**`async`** 

**`throws`** {Error} Will throw an error if error is thrown on event sourceable message handler and is not a DomainError or
CommitConcurrencyError error type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`message` | [Command](../interfaces/types.command.md) &#124; [Event](../interfaces/types.event.md) | Instance of `Command` or `Event`. |

**Returns:** *Promise‹void›*
