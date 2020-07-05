---
id: "types.commitstorage"
title: "@eveble/eveble"
sidebar_label: "CommitStorage"
---

## Hierarchy

* **CommitStorage**

## Implemented by

* [CommitMongoDBStorage](../classes/commitmongodbstorage.md)

## Index

### Methods

* [findById](types.commitstorage.md#findbyid)
* [findLastVersionById](types.commitstorage.md#findlastversionbyid)
* [flagAndResolveCommitAsTimeouted](types.commitstorage.md#flagandresolvecommitastimeouted)
* [flagCommitAsFailed](types.commitstorage.md#flagcommitasfailed)
* [flagCommitAsPublished](types.commitstorage.md#flagcommitaspublished)
* [generateId](types.commitstorage.md#generateid)
* [getAllCommits](types.commitstorage.md#getallcommits)
* [getCommits](types.commitstorage.md#getcommits)
* [lockCommit](types.commitstorage.md#lockcommit)
* [save](types.commitstorage.md#save)

## Methods

###  findById

▸ **findById**(`commitId`: string): *Promise‹[Commit](types.commit.md) | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |

**Returns:** *Promise‹[Commit](types.commit.md) | undefined›*

▸ **findById**(`commitId`: string): *Promise‹Commit | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |

**Returns:** *Promise‹Commit | undefined›*

___

###  findLastVersionById

▸ **findLastVersionById**(`eventSourceableId`: string | [Stringifiable](types.stringifiable.md)): *Promise‹number | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceableId` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *Promise‹number | undefined›*

▸ **findLastVersionById**(`eventSourceableId`: string | Stringifiable): *Promise‹number | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceableId` | string &#124; Stringifiable |

**Returns:** *Promise‹number | undefined›*

___

###  flagAndResolveCommitAsTimeouted

▸ **flagAndResolveCommitAsTimeouted**(`commitId`: string, `appId`: string, `workerId`: string, `failedAt`: Date): *Promise‹[Commit](types.commit.md) | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |
`appId` | string |
`workerId` | string |
`failedAt` | Date |

**Returns:** *Promise‹[Commit](types.commit.md) | undefined›*

▸ **flagAndResolveCommitAsTimeouted**(`commitId`: string, `appId`: string, `workerId`: string, `failedAt`: Date): *Promise‹Commit | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |
`appId` | string |
`workerId` | string |
`failedAt` | Date |

**Returns:** *Promise‹Commit | undefined›*

___

###  flagCommitAsFailed

▸ **flagCommitAsFailed**(`commitId`: string, `appId`: string, `workerId`: string, `failedAt`: Date): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |
`appId` | string |
`workerId` | string |
`failedAt` | Date |

**Returns:** *Promise‹boolean›*

▸ **flagCommitAsFailed**(`commitId`: string, `appId`: string, `workerId`: string, `failedAt`: Date): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |
`appId` | string |
`workerId` | string |
`failedAt` | Date |

**Returns:** *Promise‹boolean›*

___

###  flagCommitAsPublished

▸ **flagCommitAsPublished**(`commitId`: string, `appId`: string, `workerId`: string, `publishedAt`: Date): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |
`appId` | string |
`workerId` | string |
`publishedAt` | Date |

**Returns:** *Promise‹boolean›*

▸ **flagCommitAsPublished**(`commitId`: string, `appId`: string, `workerId`: string, `publishedAt`: Date): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |
`appId` | string |
`workerId` | string |
`publishedAt` | Date |

**Returns:** *Promise‹boolean›*

___

###  generateId

▸ **generateId**(): *Promise‹string›*

**Returns:** *Promise‹string›*

▸ **generateId**(): *Promise‹string›*

**Returns:** *Promise‹string›*

___

###  getAllCommits

▸ **getAllCommits**(): *Promise‹[Commit](types.commit.md)[]›*

**Returns:** *Promise‹[Commit](types.commit.md)[]›*

▸ **getAllCommits**(): *Promise‹Commit[]›*

**Returns:** *Promise‹Commit[]›*

___

###  getCommits

▸ **getCommits**(`eventSourceableId`: string | [Stringifiable](types.stringifiable.md), `versionOffset`: number): *Promise‹[Commit](types.commit.md)[]›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceableId` | string &#124; [Stringifiable](types.stringifiable.md) |
`versionOffset` | number |

**Returns:** *Promise‹[Commit](types.commit.md)[]›*

▸ **getCommits**(`eventSourceableId`: string | Stringifiable, `versionOffset`: number): *Promise‹Commit[]›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceableId` | string &#124; Stringifiable |
`versionOffset` | number |

**Returns:** *Promise‹Commit[]›*

___

###  lockCommit

▸ **lockCommit**(`commitId`: string, `appId`: string, `workerId`: string, `registeredAndNotReceivedYetFilter`: Record‹string, any›): *Promise‹[Commit](types.commit.md) | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |
`appId` | string |
`workerId` | string |
`registeredAndNotReceivedYetFilter` | Record‹string, any› |

**Returns:** *Promise‹[Commit](types.commit.md) | undefined›*

▸ **lockCommit**(`commitId`: string, `appId`: string, `workerId`: string, `registeredAndNotReceivedYetFilter`: Record‹string, any›): *Promise‹Commit | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |
`appId` | string |
`workerId` | string |
`registeredAndNotReceivedYetFilter` | Record‹string, any› |

**Returns:** *Promise‹Commit | undefined›*

___

###  save

▸ **save**(`commit`: [Commit](types.commit.md)): *Promise‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`commit` | [Commit](types.commit.md) |

**Returns:** *Promise‹string›*

▸ **save**(`commit`: Commit): *Promise‹string›*

**Parameters:**

Name | Type |
------ | ------ |
`commit` | Commit |

**Returns:** *Promise‹string›*
