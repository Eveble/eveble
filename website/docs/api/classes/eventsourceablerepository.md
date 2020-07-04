---
id: "eventsourceablerepository"
title: "EventSourceableRepository"
sidebar_label: "EventSourceableRepository"
---

## Hierarchy

* **EventSourceableRepository**

## Implements

* [EventSourceableRepository](../interfaces/types.eventsourceablerepository.md)
* EventSourceableRepository

## Index

### Methods

* [find](eventsourceablerepository.md#find)
* [getSnapshotOf](eventsourceablerepository.md#getsnapshotof)
* [isSnapshotting](eventsourceablerepository.md#issnapshotting)
* [makeSnapshotOf](eventsourceablerepository.md#makesnapshotof)
* [save](eventsourceablerepository.md#save)

## Methods

###  find

▸ **find**(`EventSourceableType`: [EventSourceableType](../interfaces/types.eventsourceabletype.md), `eventSourceableId`: string | [Guid](guid.md)): *Promise‹[EventSourceable](../interfaces/types.eventsourceable.md) | undefined›*

*Implementation of [EventSourceableRepository](../interfaces/types.eventsourceablerepository.md)*

Returns a re-hydrated instance of event sourceable.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`EventSourceableType` | [EventSourceableType](../interfaces/types.eventsourceabletype.md) | Event sourceable type(constructor). |
`eventSourceableId` | string &#124; [Guid](guid.md) | Identifier as string or `Guid` instance. |

**Returns:** *Promise‹[EventSourceable](../interfaces/types.eventsourceable.md) | undefined›*

Instance implementing `EventSourceable` interface, else `undefined`.

___

###  getSnapshotOf

▸ **getSnapshotOf**(`EventSourceableType`: [EventSourceableType](../interfaces/types.eventsourceabletype.md), `eventSourceableId`: string | [Guid](guid.md)): *Promise‹[EventSourceable](../interfaces/types.eventsourceable.md) | undefined›*

*Implementation of [EventSourceableRepository](../interfaces/types.eventsourceablerepository.md)*

Returns snapshot of `EventSourceable` by identifier.

**`async`** 

**`throws`** {UndefinedSnapshotterError}
Thrown f the snapshotter is not available on IoC.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`EventSourceableType` | [EventSourceableType](../interfaces/types.eventsourceabletype.md) | Event sourceable type(constructor). |
`eventSourceableId` | string &#124; [Guid](guid.md) | Identifier as string or `Guid` instance. |

**Returns:** *Promise‹[EventSourceable](../interfaces/types.eventsourceable.md) | undefined›*

Instance implementing `EventSourceable` interface, else `undefined`.

___

###  isSnapshotting

▸ **isSnapshotting**(): *boolean*

*Implementation of [EventSourceableRepository](../interfaces/types.eventsourceablerepository.md)*

Evaluates if application is snapshotting.

**Returns:** *boolean*

Returns `true` if snapshotting is enabled on application, else `false`.

___

###  makeSnapshotOf

▸ **makeSnapshotOf**(`eventSourceable`: [EventSourceable](../interfaces/types.eventsourceable.md)): *Promise‹string | undefined›*

*Implementation of [EventSourceableRepository](../interfaces/types.eventsourceablerepository.md)*

Makes a snapshot of `EventSourceable`.

**`async`** 

**`throws`** {UndefinedSnapshotterError}
Thrown f the snapshotter is not available on IoC.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceable` | [EventSourceable](../interfaces/types.eventsourceable.md) | Instance implementing `EventSourceable` interface. |

**Returns:** *Promise‹string | undefined›*

String identifier for made snapshot on storage.

___

###  save

▸ **save**(`eventSourceable`: [EventSourceable](../interfaces/types.eventsourceable.md)): *Promise‹[StorageIdentifiers](../modules/types.md#storageidentifiers)›*

*Implementation of [EventSourceableRepository](../interfaces/types.eventsourceablerepository.md)*

Persists event sourceable.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceable` | [EventSourceable](../interfaces/types.eventsourceable.md) | Instance implementing `EventSourceable` interface. |

**Returns:** *Promise‹[StorageIdentifiers](../modules/types.md#storageidentifiers)›*

Object implementing `StorageIdentifiers` interface.
