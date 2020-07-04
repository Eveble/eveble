---
id: "types.snapshotserializer"
title: "@eveble/eveble"
sidebar_label: "SnapshotSerializer"
---

## Hierarchy

* **SnapshotSerializer**

## Implemented by

* [SnapshotSerializer](../classes/snapshotserializer.md)

## Index

### Methods

* [deserialize](types.snapshotserializer.md#deserialize)
* [serialize](types.snapshotserializer.md#serialize)

## Methods

###  deserialize

▸ **deserialize**(`EventSourceableType`: [EventSourceableType](types.eventsourceabletype.md), `serializedEventSourceable`: string): *[EventSourceable](types.eventsourceable.md)*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType` | [EventSourceableType](types.eventsourceabletype.md) |
`serializedEventSourceable` | string |

**Returns:** *[EventSourceable](types.eventsourceable.md)*

▸ **deserialize**(`EventSourceableType`: EventSourceableType, `serializedEventSourceable`: string): *EventSourceable*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType` | EventSourceableType |
`serializedEventSourceable` | string |

**Returns:** *EventSourceable*

___

###  serialize

▸ **serialize**(`eventSourceable`: [EventSourceable](types.eventsourceable.md)): *Record‹string, any›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | [EventSourceable](types.eventsourceable.md) |

**Returns:** *Record‹string, any›*

▸ **serialize**(`eventSourceable`: EventSourceable): *Record‹string, any›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | EventSourceable |

**Returns:** *Record‹string, any›*
