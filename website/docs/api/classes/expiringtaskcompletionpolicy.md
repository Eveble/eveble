---
id: "expiringtaskcompletionpolicy"
title: "ExpiringTaskCompletionPolicy"
sidebar_label: "ExpiringTaskCompletionPolicy"
---

## Hierarchy

* **ExpiringTaskCompletionPolicy**

## Index

### Constructors

* [constructor](expiringtaskcompletionpolicy.md#constructor)

### Methods

* [cancel](expiringtaskcompletionpolicy.md#cancel)
* [implement](expiringtaskcompletionpolicy.md#implement)
* [setExpirationDuration](expiringtaskcompletionpolicy.md#setexpirationduration)

## Constructors

###  constructor

\+ **new ExpiringTaskCompletionPolicy**(`expireIn`: number): *[ExpiringTaskCompletionPolicy](expiringtaskcompletionpolicy.md)*

Creates an instance of `ExpiringTaskCompletionPolicy`.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`expireIn` | number | 1 * 60 * 60 * 1000 | The amount of time in milliseconds after which `Task` will expire.  |

**Returns:** *[ExpiringTaskCompletionPolicy](expiringtaskcompletionpolicy.md)*

## Methods

###  cancel

▸ **cancel**(`taskList`: [TaskList](tasklist.md), `taskId`: Guid): *void*

Cancels expiring policy for `Task` in `TaskList`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskList` | [TaskList](tasklist.md) | `TaskList` instance on which policy is cancelled. |
`taskId` | Guid | Identifier of a `Task` which policy should be cancelled.  |

**Returns:** *void*

___

###  implement

▸ **implement**(`taskList`: [TaskList](tasklist.md), `taskId`: Guid): *void*

Applies expiring policy to created `Task` in `TaskList`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskList` | [TaskList](tasklist.md) | `TaskList` instance on which policy is applied. |
`taskId` | Guid | `Task` identifier to which policy should be applied.  |

**Returns:** *void*

___

###  setExpirationDuration

▸ **setExpirationDuration**(`expireIn`: number): *void*

Sets expiration duration for policy.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expireIn` | number | The amount of time in milliseconds after which `Task` will expire.  |

**Returns:** *void*
