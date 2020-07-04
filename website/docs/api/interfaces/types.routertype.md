---
id: "types.routertype"
title: "@eveble/eveble"
sidebar_label: "RouterType"
---

## Hierarchy

* **RouterType**

## Index

### Constructors

* [constructor](types.routertype.md#constructor)

## Constructors

###  constructor

\+ **new RouterType**(`EventSourceableType?`: [EventSourceableType](types.eventsourceabletype.md), `InitializingMessageType?`: [MessageType](types.messagetype.md)‹[Command](types.command.md) | [Event](types.event.md)›, `routedCommands?`: [MessageType](types.messagetype.md)‹[Command](types.command.md)›[], `routedEvents?`: [MessageType](types.messagetype.md)‹[Event](types.event.md)›[]): *[Router](types.router.md)*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType?` | [EventSourceableType](types.eventsourceabletype.md) |
`InitializingMessageType?` | [MessageType](types.messagetype.md)‹[Command](types.command.md) &#124; [Event](types.event.md)› |
`routedCommands?` | [MessageType](types.messagetype.md)‹[Command](types.command.md)›[] |
`routedEvents?` | [MessageType](types.messagetype.md)‹[Event](types.event.md)›[] |

**Returns:** *[Router](types.router.md)*

\+ **new RouterType**(`EventSourceableType?`: EventSourceableType, `InitializingMessageType?`: MessageType‹Command | Event›, `routedCommands?`: MessageType‹Command›[], `routedEvents?`: MessageType‹Event›[]): *Router*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType?` | EventSourceableType |
`InitializingMessageType?` | MessageType‹Command &#124; Event› |
`routedCommands?` | MessageType‹Command›[] |
`routedEvents?` | MessageType‹Event›[] |

**Returns:** *Router*
