---
id: "invalidhandlererror"
title: "InvalidHandlerError"
sidebar_label: "InvalidHandlerError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **InvalidHandlerError**

## Index

### Constructors

* [constructor](invalidhandlererror.md#constructor)

### Properties

* [code](invalidhandlererror.md#optional-code)
* [message](invalidhandlererror.md#message)
* [name](invalidhandlererror.md#name)
* [stack](invalidhandlererror.md#optional-stack)

### Methods

* [fillErrorProps](invalidhandlererror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidHandlerError**(`className`: string, `type`: string, `got`: string): *[InvalidHandlerError](invalidhandlererror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`type` | string |
`got` | string |

**Returns:** *[InvalidHandlerError](invalidhandlererror.md)*

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