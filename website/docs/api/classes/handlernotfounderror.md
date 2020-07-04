---
id: "handlernotfounderror"
title: "HandlerNotFoundError"
sidebar_label: "HandlerNotFoundError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **HandlerNotFoundError**

## Index

### Constructors

* [constructor](handlernotfounderror.md#constructor)

### Properties

* [code](handlernotfounderror.md#optional-code)
* [message](handlernotfounderror.md#message)
* [name](handlernotfounderror.md#name)
* [stack](handlernotfounderror.md#optional-stack)

### Methods

* [fillErrorProps](handlernotfounderror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HandlerNotFoundError**(`className`: string, `type`: string): *[HandlerNotFoundError](handlernotfounderror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`type` | string |

**Returns:** *[HandlerNotFoundError](handlernotfounderror.md)*

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
