---
id: "invalidtypenameerror"
title: "InvalidTypeNameError"
sidebar_label: "InvalidTypeNameError"
---

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **InvalidTypeNameError**

## Index

### Constructors

* [constructor](invalidtypenameerror.md#constructor)

### Properties

* [code](invalidtypenameerror.md#optional-code)
* [message](invalidtypenameerror.md#message)
* [name](invalidtypenameerror.md#name)
* [stack](invalidtypenameerror.md#optional-stack)

### Methods

* [fillErrorProps](invalidtypenameerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidTypeNameError**(`invalidTypeName`: any): *[InvalidTypeNameError](invalidtypenameerror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`invalidTypeName` | any |

**Returns:** *[InvalidTypeNameError](invalidtypenameerror.md)*

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
