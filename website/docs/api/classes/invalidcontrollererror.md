---
id: "invalidcontrollererror"
title: "InvalidControllerError"
sidebar_label: "InvalidControllerError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **InvalidControllerError**

## Index

### Constructors

* [constructor](invalidcontrollererror.md#constructor)

### Properties

* [code](invalidcontrollererror.md#optional-code)
* [message](invalidcontrollererror.md#message)
* [name](invalidcontrollererror.md#name)
* [stack](invalidcontrollererror.md#optional-stack)

### Methods

* [fillErrorProps](invalidcontrollererror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidControllerError**(`className`: string): *[InvalidControllerError](invalidcontrollererror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |

**Returns:** *[InvalidControllerError](invalidcontrollererror.md)*

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
