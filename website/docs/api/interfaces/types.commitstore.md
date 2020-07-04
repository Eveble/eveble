---
id: "types.commitstore"
title: "@eveble/eveble"
sidebar_label: "CommitStore"
---

## Hierarchy

* **CommitStore**

## Implemented by

* [CommitStore](../classes/commitstore.md)

## Index

### Methods

* [createCommit](types.commitstore.md#createcommit)
* [findById](types.commitstore.md#findbyid)
* [generateId](types.commitstore.md#generateid)
* [getAllEvents](types.commitstore.md#getallevents)
* [getEvents](types.commitstore.md#getevents)
* [save](types.commitstore.md#save)

## Methods

###  createCommit

▸ **createCommit**(`eventSourceable`: [EventSourceable](types.eventsourceable.md)): *Promise‹[Commit](types.commit.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | [EventSourceable](types.eventsourceable.md) |

**Returns:** *Promise‹[Commit](types.commit.md)›*

▸ **createCommit**(`eventSourceable`: EventSourceable): *Promise‹Commit›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceable` | EventSourceable |

**Returns:** *Promise‹Commit›*

___

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

###  generateId

▸ **generateId**(): *Promise‹string›*

**Returns:** *Promise‹string›*

▸ **generateId**(): *Promise‹string›*

**Returns:** *Promise‹string›*

___

###  getAllEvents

▸ **getAllEvents**(): *Promise‹[Event](types.event.md)[]›*

**Returns:** *Promise‹[Event](types.event.md)[]›*

▸ **getAllEvents**(): *Promise‹Event[]›*

**Returns:** *Promise‹Event[]›*

___

###  getEvents

▸ **getEvents**(`eventSourceableId`: string | [Stringifiable](types.stringifiable.md), `versionOffset?`: number): *Promise‹[Event](types.event.md)[] | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceableId` | string &#124; [Stringifiable](types.stringifiable.md) |
`versionOffset?` | number |

**Returns:** *Promise‹[Event](types.event.md)[] | undefined›*

▸ **getEvents**(`eventSourceableId`: string | Stringifiable, `versionOffset?`: number): *Promise‹Event[] | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`eventSourceableId` | string &#124; Stringifiable |
`versionOffset?` | number |

**Returns:** *Promise‹Event[] | undefined›*

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
