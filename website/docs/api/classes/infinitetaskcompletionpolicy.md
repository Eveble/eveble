---
id: "infinitetaskcompletionpolicy"
title: "InfiniteTaskCompletionPolicy"
sidebar_label: "InfiniteTaskCompletionPolicy"
---

## Hierarchy

* **InfiniteTaskCompletionPolicy**

## Index

### Methods

* [cancel](infinitetaskcompletionpolicy.md#cancel)
* [implement](infinitetaskcompletionpolicy.md#implement)

## Methods

###  cancel

▸ **cancel**(`_taskList`: [TaskList](tasklist.md), `_taskId`: Guid): *void*

Cancels expiring policy for Task in TaskList.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`_taskList` | [TaskList](tasklist.md) | `TaskList` instance on which policy is cancelled. |
`_taskId` | Guid | Identifier of a `Task` which policy should be cancelled.  |

**Returns:** *void*

___

###  implement

▸ **implement**(`_taskList`: [TaskList](tasklist.md), `_taskId`: Guid): *void*

Applies expiring policy to created Task in TaskList.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`_taskList` | [TaskList](tasklist.md) | `TaskList` instance on which policy is applied. |
`_taskId` | Guid | `Task` identifier to which policy should be applied.  |

**Returns:** *void*
