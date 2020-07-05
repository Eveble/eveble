---
id: "types.eventsourceabletype"
title: "@eveble/eveble"
sidebar_label: "EventSourceableType"
---

## Hierarchy

* **EventSourceableType**

## Index

### Constructors

* [constructor](types.eventsourceabletype.md#constructor)

### Methods

* [from](types.eventsourceabletype.md#from)
* [getTypeName](types.eventsourceabletype.md#gettypename)
* [resolveInitializingMessage](types.eventsourceabletype.md#resolveinitializingmessage)
* [resolveRoutedCommands](types.eventsourceabletype.md#resolveroutedcommands)
* [resolveRoutedEvents](types.eventsourceabletype.md#resolveroutedevents)
* [resolveRoutedMessages](types.eventsourceabletype.md#resolveroutedmessages)

## Constructors

###  constructor

\+ **new EventSourceableType**(`props`: [Props](../modules/types.md#props)): *[EventSourceable](types.eventsourceable.md)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *[EventSourceable](types.eventsourceable.md)*

\+ **new EventSourceableType**(`props`: [Props](../modules/types.md#props)): *EventSourceable*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *EventSourceable*

## Methods

###  from

▸ **from**(...`sources`: Record‹string, any›[]): *[EventSourceable](types.eventsourceable.md)*

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *[EventSourceable](types.eventsourceable.md)*

▸ **from**(...`sources`: Record‹string, any›[]): *EventSourceable*

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *EventSourceable*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  resolveInitializingMessage

▸ **resolveInitializingMessage**(): *[MessageType](types.messagetype.md)‹[Command](types.command.md) | [Event](types.event.md)› | undefined*

**Returns:** *[MessageType](types.messagetype.md)‹[Command](types.command.md) | [Event](types.event.md)› | undefined*

▸ **resolveInitializingMessage**(): *MessageType‹Command | Event› | undefined*

**Returns:** *MessageType‹Command | Event› | undefined*

___

###  resolveRoutedCommands

▸ **resolveRoutedCommands**(): *[MessageType](types.messagetype.md)‹[Command](types.command.md)›[]*

**Returns:** *[MessageType](types.messagetype.md)‹[Command](types.command.md)›[]*

▸ **resolveRoutedCommands**(): *MessageType‹Command›[]*

**Returns:** *MessageType‹Command›[]*

___

###  resolveRoutedEvents

▸ **resolveRoutedEvents**(): *[MessageType](types.messagetype.md)‹[Event](types.event.md)›[]*

**Returns:** *[MessageType](types.messagetype.md)‹[Event](types.event.md)›[]*

▸ **resolveRoutedEvents**(): *MessageType‹Event›[]*

**Returns:** *MessageType‹Event›[]*

___

###  resolveRoutedMessages

▸ **resolveRoutedMessages**(): *[MessageType](types.messagetype.md)‹[Command](types.command.md) | [Event](types.event.md)›[]*

**Returns:** *[MessageType](types.messagetype.md)‹[Command](types.command.md) | [Event](types.event.md)›[]*

▸ **resolveRoutedMessages**(): *MessageType‹Command | Event›[]*

**Returns:** *MessageType‹Command | Event›[]*
