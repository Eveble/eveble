---
id: "snapshotter"
title: "Snapshotter"
sidebar_label: "Snapshotter"
---

## Hierarchy

* **Snapshotter**

## Implements

* [Snapshotter](../interfaces/types.snapshotter.md)
* Snapshotter

## Index

### Methods

* [getSnapshotOf](snapshotter.md#getsnapshotof)
* [initialize](snapshotter.md#initialize)
* [makeSnapshotOf](snapshotter.md#makesnapshotof)

## Methods

###  getSnapshotOf

▸ **getSnapshotOf**(`EventSourceableType`: [EventSourceableType](../interfaces/types.eventsourceabletype.md), `eventSourceableId`: string | [Guid](guid.md)): *Promise‹[EventSourceable](../interfaces/types.eventsourceable.md) | undefined›*

*Implementation of [Snapshotter](../interfaces/types.snapshotter.md)*

Restores snapshotted event sourceable from storage.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`EventSourceableType` | [EventSourceableType](../interfaces/types.eventsourceabletype.md) | Event sourceable type(constructor). |
`eventSourceableId` | string &#124; [Guid](guid.md) | Identifier as string or `Guid` instance. |

**Returns:** *Promise‹[EventSourceable](../interfaces/types.eventsourceable.md) | undefined›*

Instance as a snapshot implementing `EventSourceable` interface, else `undefined`.

___

###  initialize

▸ **initialize**(): *void*

Initializes Snapshotter.

**Returns:** *void*

___

###  makeSnapshotOf

▸ **makeSnapshotOf**(`eventSourceable`: [EventSourceable](../interfaces/types.eventsourceable.md)): *Promise‹string | undefined›*

*Implementation of [Snapshotter](../interfaces/types.snapshotter.md)*

Snapshots Event Sourceable.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceable` | [EventSourceable](../interfaces/types.eventsourceable.md) | Instance implementing `EventSourceable` interface. |

**Returns:** *Promise‹string | undefined›*

Identifier of snapshot on storage.
