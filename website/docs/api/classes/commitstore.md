---
id: "commitstore"
title: "CommitStore"
sidebar_label: "CommitStore"
---

## Hierarchy

* **CommitStore**

## Implements

* [CommitStore](../interfaces/types.commitstore.md)
* CommitStore

## Index

### Methods

* [createCommit](commitstore.md#createcommit)
* [findById](commitstore.md#findbyid)
* [generateId](commitstore.md#generateid)
* [getAllEvents](commitstore.md#getallevents)
* [getEvents](commitstore.md#getevents)
* [save](commitstore.md#save)

## Methods

###  createCommit

▸ **createCommit**(`eventSourceable`: [EventSourceable](../interfaces/types.eventsourceable.md)): *Promise‹[Commit](../interfaces/types.commit.md)›*

*Implementation of [CommitStore](../interfaces/types.commitstore.md)*

Create `Commit` from event sourceable instance.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceable` | [EventSourceable](../interfaces/types.eventsourceable.md) | Instance implementing `EventSourceable` interface. |

**Returns:** *Promise‹[Commit](../interfaces/types.commit.md)›*

Instance implementing `Commit` interface.

___

###  findById

▸ **findById**(`commitId`: string): *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

*Implementation of [CommitStore](../interfaces/types.commitstore.md)*

Returns commit by commit id.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commitId` | string | Identifier of `Commit`. |

**Returns:** *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

Instance implementing `Commit` interface, else `undefined`.

___

###  generateId

▸ **generateId**(): *Promise‹string›*

*Implementation of [CommitStore](../interfaces/types.commitstore.md)*

Generates identifier compatible with commit storage.

**`async`** 

**Returns:** *Promise‹string›*

Identifier for commit compatible with storage implementation.

___

###  getAllEvents

▸ **getAllEvents**(): *Promise‹[Event](../interfaces/types.event.md)[]›*

*Implementation of [CommitStore](../interfaces/types.commitstore.md)*

Returns events from all existing commits on storage.

**`async`** 

**Returns:** *Promise‹[Event](../interfaces/types.event.md)[]›*

List of all published `Events`.

___

###  getEvents

▸ **getEvents**(`eventSourceableId`: string | [Guid](guid.md), `versionOffset?`: number): *Promise‹[Event](../interfaces/types.event.md)[]›*

*Implementation of [CommitStore](../interfaces/types.commitstore.md)*

Returns all events associated with commits that exceeds or are equal to provided version offset.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceableId` | string &#124; [Guid](guid.md) | Identifier as string or `Guid` instance. |
`versionOffset?` | number | Version number from which version events should be returned. |

**Returns:** *Promise‹[Event](../interfaces/types.event.md)[]›*

List of all `Events` associated with resolved commits for version offset.

___

###  save

▸ **save**(`commit`: [Commit](../interfaces/types.commit.md)): *Promise‹string›*

*Implementation of [CommitStore](../interfaces/types.commitstore.md)*

Adds commit to storage and publishes changes.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commit` | [Commit](../interfaces/types.commit.md) | Instance implementing `Commit` interface. |

**Returns:** *Promise‹string›*

Identifier of commit on commit storage.
