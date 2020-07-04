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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

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

*Inherited from [ExtendableError](extendableerror.md).[code](extendableerror.md#optional-code)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[code](noquittingfoolerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [ExtendableError](extendableerror.md).[message](extendableerror.md#message)*

*Overrides void*

___

###  name

• **name**: *string*

*Inherited from [ExtendableError](extendableerror.md).[name](extendableerror.md#name)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [ExtendableError](extendableerror.md).[stack](extendableerror.md#optional-stack)*

*Overrides void*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [ExtendableError](extendableerror.md).[fillErrorProps](extendableerror.md#fillerrorprops)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[fillErrorProps](noquittingfoolerror.md#fillerrorprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*
