---
id: "types.commitpublisher"
title: "@eveble/eveble"
sidebar_label: "CommitPublisher"
---

## Hierarchy

* **CommitPublisher**

## Index

### Methods

* [getHandledCommandTypes](types.commitpublisher.md#gethandledcommandtypes)
* [getHandledEventTypes](types.commitpublisher.md#gethandledeventtypes)
* [isInProgress](types.commitpublisher.md#isinprogress)
* [publishChanges](types.commitpublisher.md#publishchanges)
* [startPublishing](types.commitpublisher.md#startpublishing)
* [stopPublishing](types.commitpublisher.md#stoppublishing)

## Methods

###  getHandledCommandTypes

▸ **getHandledCommandTypes**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

▸ **getHandledCommandTypes**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

___

###  getHandledEventTypes

▸ **getHandledEventTypes**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

▸ **getHandledEventTypes**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

___

###  isInProgress

▸ **isInProgress**(`commitId`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |

**Returns:** *boolean*

▸ **isInProgress**(`commitId`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`commitId` | string |

**Returns:** *boolean*

___

###  publishChanges

▸ **publishChanges**(`commit`: [Commit](types.commit.md)): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`commit` | [Commit](types.commit.md) |

**Returns:** *Promise‹void›*

▸ **publishChanges**(`commit`: Commit): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`commit` | Commit |

**Returns:** *Promise‹void›*

___

###  startPublishing

▸ **startPublishing**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **startPublishing**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  stopPublishing

▸ **stopPublishing**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **stopPublishing**(): *Promise‹void›*

**Returns:** *Promise‹void›*
