---
id: "invalidstatuserror"
title: "InvalidStatusError"
sidebar_label: "InvalidStatusError"
---

## Hierarchy

  ↳ [StatusError](statuserror.md)

* StatusError

  ↳ **InvalidStatusError**

## Index

### Constructors

* [constructor](invalidstatuserror.md#constructor)

### Properties

* [code](invalidstatuserror.md#optional-code)
* [message](invalidstatuserror.md#message)
* [name](invalidstatuserror.md#name)
* [stack](invalidstatuserror.md#optional-stack)

### Methods

* [fillErrorProps](invalidstatuserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidStatusError**(`typeName`: [TypeName](../modules/types.md#typename), `currentStatus`: [Status](../modules/types.md#status), `expectedStatuses`: [Status](../modules/types.md#status)): *[InvalidStatusError](invalidstatuserror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`currentStatus` | [Status](../modules/types.md#status) |
`expectedStatuses` | [Status](../modules/types.md#status) |

**Returns:** *[InvalidStatusError](invalidstatuserror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [StateError](stateerror.md).[code](stateerror.md#optional-code)*

*Overrides [StateError](stateerror.md).[code](stateerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [StateError](stateerror.md).[message](stateerror.md#message)*

*Overrides void*

___

###  name

• **name**: *string*

*Inherited from [StateError](stateerror.md).[name](stateerror.md#name)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [StateError](stateerror.md).[stack](stateerror.md#optional-stack)*

*Overrides void*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

*Overrides [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*
