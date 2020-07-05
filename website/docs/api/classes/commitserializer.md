---
id: "commitserializer"
title: "CommitSerializer"
sidebar_label: "CommitSerializer"
---

## Hierarchy

* **CommitSerializer**

## Implements

* [CommitSerializer](../interfaces/types.commitserializer.md)
* CommitSerializer

## Index

### Methods

* [deserialize](commitserializer.md#deserialize)
* [serialize](commitserializer.md#serialize)

## Methods

###  deserialize

▸ **deserialize**(`serializedCommit`: Record‹string, any›): *[Commit](../interfaces/types.commit.md)*

*Implementation of [CommitSerializer](../interfaces/types.commitserializer.md)*

Deserializes serialized commit.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serializedCommit` | Record‹string, any› | Serialized commit. |

**Returns:** *[Commit](../interfaces/types.commit.md)*

Instance implementing `Commit` interface.

___

###  serialize

▸ **serialize**(`commit`: [Commit](../interfaces/types.commit.md)): *Record‹string, any›*

*Implementation of [CommitSerializer](../interfaces/types.commitserializer.md)*

Serializes commit.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commit` | [Commit](../interfaces/types.commit.md) | Instance implementing `Commit` interface. |

**Returns:** *Record‹string, any›*

Serialized commit as a plain object compatible with MongoDB document structure.
