---
id: "types.snapshotter"
title: "@eveble/eveble"
sidebar_label: "Snapshotter"
---

## Hierarchy

* **Snapshotter**

## Implemented by

* [Snapshotter](../classes/snapshotter.md)

## Index

### Methods

* [getSnapshotOf](types.snapshotter.md#getsnapshotof)
* [makeSnapshotOf](types.snapshotter.md#makesnapshotof)

## Methods

###  getSnapshotOf

▸ **getSnapshotOf**(`EventSourceableType`: [EventSourceableType](types.eventsourceabletype.md), `eventSourceableId`: string | [Stringifiable](types.stringifiable.md)): *Promise‹[EventSourceable](types.eventsourceable.md) | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType` | [EventSourceableType](types.eventsourceabletype.md) |
`eventSourceableId` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *Promise‹[EventSourceable](types.eventsourceable.md) | undefined›*

▸ **getSnapshotOf**(`EventSourceableType`: EventSourceableType, `eventSourceableId`: string | Stringifiable): *Promise‹EventSourceable | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType` | EventSourceableType |
`eventSourceableId` | string &#124; Stringifiable |

**Returns:** *Promise‹EventSourceable | undefined›*

___

###  makeSnapshotOf

▸ **makeSnapshotOf**(`eventSourceable`: [EventSourceable](types.eventsourceable.md)): *Promise‹string | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | [EventSourceable](types.eventsourceable.md) |

**Returns:** *Promise‹string | undefined›*

▸ **makeSnapshotOf**(`eventSourceable`: EventSourceable): *Promise‹string | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | EventSourceable |

**Returns:** *Promise‹string | undefined›*
