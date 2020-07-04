---
id: "snapshotserializer"
title: "SnapshotSerializer"
sidebar_label: "SnapshotSerializer"
---

## Hierarchy

* **SnapshotSerializer**

## Implements

* [SnapshotSerializer](../interfaces/types.snapshotserializer.md)
* SnapshotSerializer

## Index

### Methods

* [deserialize](snapshotserializer.md#deserialize)
* [serialize](snapshotserializer.md#serialize)

## Methods

###  deserialize

▸ **deserialize**(`_EventSourceableType`: [EventSourceableType](../interfaces/types.eventsourceabletype.md), `serializedEventSourceable`: string): *[EventSourceable](../interfaces/types.eventsourceable.md)*

*Implementation of [SnapshotSerializer](../interfaces/types.snapshotserializer.md)*

Deserializes serialized event sourceable.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`_EventSourceableType` | [EventSourceableType](../interfaces/types.eventsourceabletype.md) | - |
`serializedEventSourceable` | string | Serialized event sourceable as a string. |

**Returns:** *[EventSourceable](../interfaces/types.eventsourceable.md)*

Deserialized instance of `EventSourceable`.

___

###  serialize

▸ **serialize**(`eventSourceable`: [EventSourceable](../interfaces/types.eventsourceable.md)): *Record‹string, any›*

*Implementation of [SnapshotSerializer](../interfaces/types.snapshotserializer.md)*

Serializes `EventSourceable` instance.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceable` | [EventSourceable](../interfaces/types.eventsourceable.md) | Instance implementing `EventSourceable` interface. |

**Returns:** *Record‹string, any›*

Serialized event sourceable as a string.
