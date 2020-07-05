---
id: "types.snapshotstorage"
title: "@eveble/eveble"
sidebar_label: "SnapshotStorage"
---

## Hierarchy

* **SnapshotStorage**

## Implemented by

* [SnapshotMongoDBStorage](../classes/snapshotmongodbstorage.md)

## Index

### Methods

* [findById](types.snapshotstorage.md#findbyid)
* [save](types.snapshotstorage.md#save)
* [update](types.snapshotstorage.md#update)

## Methods

###  findById

▸ **findById**(`EventSourceableType`: [EventSourceableType](types.eventsourceabletype.md), `eventSourceableId`: string | [Stringifiable](types.stringifiable.md)): *Promise‹[EventSourceable](types.eventsourceable.md) | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType` | [EventSourceableType](types.eventsourceabletype.md) |
`eventSourceableId` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *Promise‹[EventSourceable](types.eventsourceable.md) | undefined›*

▸ **findById**(`EventSourceableType`: EventSourceableType, `eventSourceableId`: string | Stringifiable): *Promise‹EventSourceable | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType` | EventSourceableType |
`eventSourceableId` | string &#124; Stringifiable |

**Returns:** *Promise‹EventSourceable | undefined›*

___

###  save

▸ **save**(`eventSourceable`: [EventSourceable](types.eventsourceable.md)): *Promise‹string | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | [EventSourceable](types.eventsourceable.md) |

**Returns:** *Promise‹string | undefined›*

▸ **save**(`eventSourceable`: EventSourceable): *Promise‹string | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | EventSourceable |

**Returns:** *Promise‹string | undefined›*

___

###  update

▸ **update**(`eventSourceable`: [EventSourceable](types.eventsourceable.md), `lastSnapshot?`: [EventSourceable](types.eventsourceable.md)): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | [EventSourceable](types.eventsourceable.md) |
`lastSnapshot?` | [EventSourceable](types.eventsourceable.md) |

**Returns:** *Promise‹boolean›*

▸ **update**(`eventSourceable`: EventSourceable, `lastSnapshot?`: EventSourceable): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | EventSourceable |
`lastSnapshot?` | EventSourceable |

**Returns:** *Promise‹boolean›*
