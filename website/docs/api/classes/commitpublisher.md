---
id: "commitpublisher"
title: "CommitPublisher"
sidebar_label: "CommitPublisher"
---

## Hierarchy

* **CommitPublisher**

## Index

### Constructors

* [constructor](commitpublisher.md#constructor)

### Properties

* [commandBus](commitpublisher.md#commandbus)

### Methods

* [getHandledCommandTypes](commitpublisher.md#gethandledcommandtypes)
* [getHandledEventTypes](commitpublisher.md#gethandledeventtypes)
* [isInProgress](commitpublisher.md#isinprogress)
* [publishChanges](commitpublisher.md#publishchanges)
* [startPublishing](commitpublisher.md#startpublishing)
* [stopPublishing](commitpublisher.md#stoppublishing)

## Constructors

###  constructor

\+ **new CommitPublisher**(): *[CommitPublisher](commitpublisher.md)*

Create a CommitPublisher
Create a CommitPublisher

**Returns:** *[CommitPublisher](commitpublisher.md)*

## Properties

###  commandBus

• **commandBus**: *CommandBus*

## Methods

###  getHandledCommandTypes

▸ **getHandledCommandTypes**(): *[TypeName](../modules/types.md#typename)[]*

Returns all handleable command type names from command bus.

**Returns:** *[TypeName](../modules/types.md#typename)[]*

List of handled command type names.

___

###  getHandledEventTypes

▸ **getHandledEventTypes**(): *[TypeName](../modules/types.md#typename)[]*

Returns all handleable event type names from event bus.

**Returns:** *[TypeName](../modules/types.md#typename)[]*

List of handled event type names.

___

###  isInProgress

▸ **isInProgress**(`commitId`: string): *boolean*

Evaluates if commit is processed.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commitId` | string | Identifier for `Commit`. |

**Returns:** *boolean*

Returns `true` if commit is being processed, else `false`.

___

###  publishChanges

▸ **publishChanges**(`commit`: [Commit](../interfaces/types.commit.md)): *Promise‹void›*

Publishes changes from commit on application.

**`async`** 

**`throws`** {Error}
Thrown if there is any issue with handling published change(message).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commit` | [Commit](../interfaces/types.commit.md) | Instance implementing `Commit` interface. |

**Returns:** *Promise‹void›*

___

###  startPublishing

▸ **startPublishing**(): *Promise‹void›*

Starts observing for changes in commits.

**`async`** 

**Returns:** *Promise‹void›*

___

###  stopPublishing

▸ **stopPublishing**(): *Promise‹void›*

Stops observing for changes in commits.

**`async`** 

**Returns:** *Promise‹void›*
