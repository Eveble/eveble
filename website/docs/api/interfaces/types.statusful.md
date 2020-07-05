---
id: "types.statusful"
title: "@eveble/eveble"
sidebar_label: "Statusful"
---

## Hierarchy

* **Statusful**

  ↳ [Entity](types.entity.md)

## Implemented by

* [Aggregate](../classes/aggregate.md)
* [Entity](../classes/entity.md)
* [EventSourceable](../classes/eventsourceable.md)
* [Process](../classes/process.md)
* [StatusfulMixin](../classes/statusfulmixin.md)

## Index

### Properties

* [status](types.statusful.md#status)

### Methods

* [getSelectableStatuses](types.statusful.md#getselectablestatuses)
* [getStatus](types.statusful.md#getstatus)
* [hasStatus](types.statusful.md#hasstatus)
* [isInOneOfStatuses](types.statusful.md#isinoneofstatuses)
* [isInStatus](types.statusful.md#isinstatus)
* [setStatus](types.statusful.md#setstatus)
* [validateStatus](types.statusful.md#validatestatus)

## Properties

###  status

• **status**: *[Status](../modules/types.md#status)*

## Methods

###  getSelectableStatuses

▸ **getSelectableStatuses**(): *Record‹string, [Status](../modules/types.md#status)›*

**Returns:** *Record‹string, [Status](../modules/types.md#status)›*

▸ **getSelectableStatuses**(): *Record‹string, [Status](../modules/types.md#status)›*

**Returns:** *Record‹string, [Status](../modules/types.md#status)›*

___

###  getStatus

▸ **getStatus**(): *[Status](../modules/types.md#status)*

**Returns:** *[Status](../modules/types.md#status)*

▸ **getStatus**(): *[Status](../modules/types.md#status)*

**Returns:** *[Status](../modules/types.md#status)*

___

###  hasStatus

▸ **hasStatus**(): *boolean*

**Returns:** *boolean*

▸ **hasStatus**(): *boolean*

**Returns:** *boolean*

___

###  isInOneOfStatuses

▸ **isInOneOfStatuses**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

▸ **isInOneOfStatuses**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

___

###  isInStatus

▸ **isInStatus**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

▸ **isInStatus**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

___

###  setStatus

▸ **setStatus**(`status`: [Status](../modules/types.md#status)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) |

**Returns:** *void*

▸ **setStatus**(`status`: [Status](../modules/types.md#status)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) |

**Returns:** *void*

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: [Error](../classes/extendableerror.md#static-error)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |
`error?` | [Error](../classes/extendableerror.md#static-error) |

**Returns:** *boolean*

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: [Error](../classes/extendableerror.md#static-error)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |
`error?` | [Error](../classes/extendableerror.md#static-error) |

**Returns:** *boolean*
