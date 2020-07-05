---
id: "undefinedloggabletargeterror"
title: "UndefinedLoggableTargetError"
sidebar_label: "UndefinedLoggableTargetError"
---

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **UndefinedLoggableTargetError**

## Index

### Constructors

* [constructor](undefinedloggabletargeterror.md#constructor)

### Properties

* [code](undefinedloggabletargeterror.md#optional-code)
* [message](undefinedloggabletargeterror.md#message)
* [name](undefinedloggabletargeterror.md#name)
* [stack](undefinedloggabletargeterror.md#optional-stack)

### Methods

* [fillErrorProps](undefinedloggabletargeterror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UndefinedLoggableTargetError**(): *[UndefinedLoggableTargetError](undefinedloggabletargeterror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Returns:** *[UndefinedLoggableTargetError](undefinedloggabletargeterror.md)*

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
