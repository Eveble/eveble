---
id: "statusfulmixin"
title: "StatusfulMixin"
sidebar_label: "StatusfulMixin"
---

## Hierarchy

* **StatusfulMixin**

## Implements

* [Statusful](../interfaces/types.statusful.md)
* Statusful

## Index

### Properties

* [status](statusfulmixin.md#status)

### Methods

* [getSelectableStatuses](statusfulmixin.md#getselectablestatuses)
* [getStatus](statusfulmixin.md#getstatus)
* [hasStatus](statusfulmixin.md#hasstatus)
* [isInOneOfStatuses](statusfulmixin.md#isinoneofstatuses)
* [isInStatus](statusfulmixin.md#isinstatus)
* [setStatus](statusfulmixin.md#setstatus)
* [validateStatus](statusfulmixin.md#validatestatus)

## Properties

###  status

• **status**: *[Status](../modules/types.md#status)*

*Implementation of [Statusful](../interfaces/types.statusful.md).[status](../interfaces/types.statusful.md#status)*

## Methods

###  getSelectableStatuses

▸ **getSelectableStatuses**(): *Record‹string, [Status](../modules/types.md#status)›*

*Implementation of [Statusful](../interfaces/types.statusful.md)*

Returns all selectable status.

**Returns:** *Record‹string, [Status](../modules/types.md#status)›*

Collection of available status.

___

###  getStatus

▸ **getStatus**(): *[Status](../modules/types.md#status)*

*Implementation of [Statusful](../interfaces/types.statusful.md)*

Returns current status of instance.

**Returns:** *[Status](../modules/types.md#status)*

Current status of instance as `string`.

___

###  hasStatus

▸ **hasStatus**(): *boolean*

*Implementation of [Statusful](../interfaces/types.statusful.md)*

Evaluates if target has status set on instance(is not `nil`).

**Returns:** *boolean*

Returns `true` if instance has status set(not `nil`), else `false`.

___

###  isInOneOfStatuses

▸ **isInOneOfStatuses**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Implementation of [Statusful](../interfaces/types.statusful.md)*

Evaluates if target is in one of expected status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] | Expected status in which one of instance should be. |

**Returns:** *boolean*

Returns true if instance is in one of status, else false.

___

###  isInStatus

▸ **isInStatus**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Implementation of [Statusful](../interfaces/types.statusful.md)*

Evaluates if target is in expected status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] | Expected status in which instance should be. |

**Returns:** *boolean*

Returns `true` if instance is in status, else `false`.

___

###  setStatus

▸ **setStatus**(`status`: [Status](../modules/types.md#status)): *void*

*Implementation of [Statusful](../interfaces/types.statusful.md)*

Sets instance status.

**`throws`** {ValidationError}
Thrown if the provided status does not match one of the selectable status.

**`throws`** {UndefinedStatusesError}
Thrown if the instance does not have any status assigned.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | [Status](../modules/types.md#status) | Status to which instance should be set. |

**Returns:** *void*

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [Statusful](../interfaces/types.statusful.md)*

Validates if instance is in allowed status(s).

**`throws`** {InvalidStatusError}
Thrown if target is not in correct(one of allowed) status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] | Expected status list in one of which instance should be. |
`error?` | [Error](extendableerror.md#static-error) | Optional error instance for case where status does not match expected one. |

**Returns:** *boolean*

Returns `true` if instance is in correct status, else throws.
