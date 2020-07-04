---
id: "commitmongodbstorage"
title: "CommitMongoDBStorage"
sidebar_label: "CommitMongoDBStorage"
---

## Hierarchy

* **CommitMongoDBStorage**

## Implements

* [CommitStorage](../interfaces/types.commitstorage.md)
* CommitStorage

## Index

### Methods

* [findById](commitmongodbstorage.md#findbyid)
* [findLastVersionById](commitmongodbstorage.md#findlastversionbyid)
* [findOneAndUpdate](commitmongodbstorage.md#findoneandupdate)
* [flagAndResolveCommitAsTimeouted](commitmongodbstorage.md#flagandresolvecommitastimeouted)
* [flagCommitAsFailed](commitmongodbstorage.md#flagcommitasfailed)
* [flagCommitAsPublished](commitmongodbstorage.md#flagcommitaspublished)
* [generateId](commitmongodbstorage.md#generateid)
* [getAllCommits](commitmongodbstorage.md#getallcommits)
* [getCommits](commitmongodbstorage.md#getcommits)
* [lockCommit](commitmongodbstorage.md#lockcommit)
* [save](commitmongodbstorage.md#save)

## Methods

###  findById

▸ **findById**(`commitId`: string): *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Returns commit by id from MongoDB collection.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commitId` | string | Identifier of `Commit`. |

**Returns:** *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

Instance implementing `Commit` interface, else `undefined`.

___

###  findLastVersionById

▸ **findLastVersionById**(`eventSourceableId`: string | [Guid](guid.md)): *Promise‹number | undefined›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Returns last version of commit by event sourceable's id from MongoDB collection.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceableId` | string &#124; [Guid](guid.md) | Identifier as string or `Guid` instance. |

**Returns:** *Promise‹number | undefined›*

Last commit version as number, else `undefined`.

___

###  findOneAndUpdate

▸ **findOneAndUpdate**(`filter?`: FilterQuery‹any›, `update?`: UpdateQuery‹any›, `options?`: FindOneAndUpdateOption): *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

Find one document and updates it on MongoDB collection.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filter?` | FilterQuery‹any› | The Filter used to select the document to update |
`update?` | UpdateQuery‹any› | The update operations to be applied to the document |
`options?` | FindOneAndUpdateOption | Optional settings |

**Returns:** *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

Updated instance implementing `Commit` interface, else `undefined`.

___

###  flagAndResolveCommitAsTimeouted

▸ **flagAndResolveCommitAsTimeouted**(`commitId`: string, `appId`: string, `workerId`: string, `failedAt`: Date): *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Flags commit as timeouted on MongoDB collection.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commitId` | string | Identifier for Commit that should be locked. |
`appId` | string | Application identifer on which commit timeouted. |
`workerId` | string | Worker identifer on which commit timeouted. |
`failedAt` | Date | Date of commit processing timeout. |

**Returns:** *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

Instance implementing `Commit` interface, else `undefined`.

___

###  flagCommitAsFailed

▸ **flagCommitAsFailed**(`commitId`: string, `appId`: string, `workerId`: string, `failedAt`: Date): *Promise‹boolean›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Flags commit as failed on MongoDB collection.

**`async`** 

**`throws`** {UpdatingCommitError}
Thrown if update operation on MongoDB is not successful.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commitId` | string | Identifier for Commit that should be locked. |
`appId` | string | Application identifer on which commit failed. |
`workerId` | string | Worker identifer on which commit failed. |
`failedAt` | Date | Date of commit processing fail. |

**Returns:** *Promise‹boolean›*

Returns `true` if commit was flagged successfully, else `false`.

___

###  flagCommitAsPublished

▸ **flagCommitAsPublished**(`commitId`: string, `appId`: string, `workerId`: string, `publishedAt`: Date): *Promise‹boolean›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Flags commit as published on MongoDB collection.

**`async`** 

**`throws`** {UpdatingCommitError}
Thrown if update operation on MongoDB is not successful.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commitId` | string | Identifier for Commit that should be locked. |
`appId` | string | Application identifer on which commit is published. |
`workerId` | string | Worker identifer on which commit is published. |
`publishedAt` | Date | Date of commit publication. |

**Returns:** *Promise‹boolean›*

Returns `true` if commit was flagged successfully, else `false`.

___

###  generateId

▸ **generateId**(): *Promise‹string›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Generates commit's id.

**Returns:** *Promise‹string›*

Identifier for `Commit` compatible with MongoDB.

___

###  getAllCommits

▸ **getAllCommits**(): *Promise‹[Commit](../interfaces/types.commit.md)[]›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Returns all commits from MongoDB collection.

**`async`** 

**Returns:** *Promise‹[Commit](../interfaces/types.commit.md)[]›*

List of instances implementing `Commit` interface.

___

###  getCommits

▸ **getCommits**(`eventSourceableId`: string | [Stringifiable](../interfaces/types.stringifiable.md), `versionOffset`: number): *Promise‹[Commit](../interfaces/types.commit.md)[]›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Returns commit from MongoDB collection if exists by event sourceable's id for specific version offset.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventSourceableId` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) | Identifier as string or `Guid` instance. |
`versionOffset` | number | Version number from which version events should be returned. |

**Returns:** *Promise‹[Commit](../interfaces/types.commit.md)[]›*

List of instances implementing `Commit` interface.

___

###  lockCommit

▸ **lockCommit**(`commitId`: string, `appId`: string, `workerId`: string, `registeredAndNotReceivedYetFilter`: Record‹string, any›): *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Locks(changes state to received) commit on MongoDB and publishes it through CommitPublisher

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commitId` | string | Identifier for Commit that should be locked. |
`appId` | string | Application identifer that is handling(locking) Commit. |
`workerId` | string | Worker identifer that is handling(locking) Commit. |
`registeredAndNotReceivedYetFilter` | Record‹string, any› | Filter for MongoDB query argument which selects only commits that have not been yet received by current application. |

**Returns:** *Promise‹[Commit](../interfaces/types.commit.md) | undefined›*

Instance implementing `Commit` interface, else `undefined`.

___

###  save

▸ **save**(`commit`: [Commit](../interfaces/types.commit.md)): *Promise‹string›*

*Implementation of [CommitStorage](../interfaces/types.commitstorage.md)*

Adds commit to MongoDB collection.

**`async`** 

**`throws`** {CommitConcurrencyError}
Thrown if commit with same id already exists on MongoDB collection.

**`throws`** {AddingCommitFailedError}
Thrown if commit with same id already exists on MongoDB collection.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commit` | [Commit](../interfaces/types.commit.md) | Instance implementing `Commit` interface. |

**Returns:** *Promise‹string›*

Identifier for document(as Commit's id) on MongoDB collection.
