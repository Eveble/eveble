---
id: "types.eventsourceablerepository"
title: "@eveble/eveble"
sidebar_label: "EventSourceableRepository"
---

## Hierarchy

* **EventSourceableRepository**

## Implemented by

* [EventSourceableRepository](../classes/eventsourceablerepository.md)

## Index

### Methods

* [find](types.eventsourceablerepository.md#find)
* [getSnapshotOf](types.eventsourceablerepository.md#getsnapshotof)
* [isSnapshotting](types.eventsourceablerepository.md#issnapshotting)
* [makeSnapshotOf](types.eventsourceablerepository.md#makesnapshotof)
* [save](types.eventsourceablerepository.md#save)

## Methods

###  find

▸ **find**(`EventSourceableType`: [EventSourceableType](types.eventsourceabletype.md), `eventSourceableId`: string | [Stringifiable](types.stringifiable.md)): *Promise‹[EventSourceable](types.eventsourceable.md) | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType` | [EventSourceableType](types.eventsourceabletype.md) |
`eventSourceableId` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *Promise‹[EventSourceable](types.eventsourceable.md) | undefined›*

▸ **find**(`EventSourceableType`: EventSourceableType, `eventSourceableId`: string | Stringifiable): *Promise‹EventSourceable | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`EventSourceableType` | EventSourceableType |
`eventSourceableId` | string &#124; Stringifiable |

**Returns:** *Promise‹EventSourceable | undefined›*

___

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

###  isSnapshotting

▸ **isSnapshotting**(): *boolean*

**Returns:** *boolean*

▸ **isSnapshotting**(): *boolean*

**Returns:** *boolean*

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

___

###  save

▸ **save**(`eventSourceable`: [EventSourceable](types.eventsourceable.md)): *Promise‹[StorageIdentifiers](../modules/types.md#storageidentifiers)›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | [EventSourceable](types.eventsourceable.md) |

**Returns:** *Promise‹[StorageIdentifiers](../modules/types.md#storageidentifiers)›*

▸ **save**(`eventSourceable`: EventSourceable): *Promise‹[StorageIdentifiers](../modules/types.md#storageidentifiers)›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | EventSourceable |

**Returns:** *Promise‹[StorageIdentifiers](../modules/types.md#storageidentifiers)›*
