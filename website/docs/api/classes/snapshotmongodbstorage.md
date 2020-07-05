---
id: "snapshotmongodbstorage"
title: "SnapshotMongoDBStorage"
sidebar_label: "SnapshotMongoDBStorage"
---

## Hierarchy

* **SnapshotMongoDBStorage**

## Implements

* [SnapshotStorage](../interfaces/types.snapshotstorage.md)
* SnapshotStorage

## Index

### Methods

* [findById](snapshotmongodbstorage.md#findbyid)
* [save](snapshotmongodbstorage.md#save)
* [update](snapshotmongodbstorage.md#update)

## Methods

###  findById

▸ **findById**(`EventSourceableType`: [EventSourceableType](../interfaces/types.eventsourceabletype.md), `eventSourceableId`: string | [Guid](guid.md)): *Promise‹[EventSourceable](../interfaces/types.eventsourceable.md) | undefined›*

*Implementation of [SnapshotStorage](../interfaces/types.snapshotstorage.md)*

Returns snapshot from Mongo snapshots collection by id if exists.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`EventSourceableType` | [EventSourceableType](../interfaces/types.eventsourceabletype.md) | Event sourceable type(constructor). |
`eventSourceableId` | string &#124; [Guid](guid.md) | Identifier as string or `Guid` instance. |

**Returns:** *Promise‹[EventSourceable](../interfaces/types.eventsourceable.md) | undefined›*

Instance as a snapshot implementing `EventSourceable` interface, else `undefined`.

___

###  save

▸ **save**(`eventSourceable`: [EventSourceable](../interfaces/types.eventsourceable.md)): *Promise‹string›*

*Implementation of [SnapshotStorage](../interfaces/types.snapshotstorage.md)*

Adds new snapshot as serialized version of `EventSourceable` instance to `MongoDB` snapshots collection.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceable` | [EventSourceable](../interfaces/types.eventsourceable.md) | Instance implementing `EventSourceable` interface. |

**Returns:** *Promise‹string›*

Identifier for document(as Snapshot's id) on MongoDB collection.

___

###  update

▸ **update**(`eventSourceable`: [EventSourceable](../interfaces/types.eventsourceable.md)): *Promise‹boolean›*

Updates `EventSourceable` snapshot on the snapshots collection.

**`async`** 

**`throws`** {UpdatingSnapshotError}
Thrown if update operation on MongoDB is not successful.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceable` | [EventSourceable](../interfaces/types.eventsourceable.md) | Instance implementing `EventSourceable` interface. |

**Returns:** *Promise‹boolean›*

Returns `true` if snapshot update was successful, else throws.
