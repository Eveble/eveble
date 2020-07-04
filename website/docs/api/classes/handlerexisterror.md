---
id: "handlerexisterror"
title: "HandlerExistError"
sidebar_label: "HandlerExistError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **HandlerExistError**

## Index

### Constructors

* [constructor](handlerexisterror.md#constructor)

### Properties

* [code](handlerexisterror.md#optional-code)
* [message](handlerexisterror.md#message)
* [name](handlerexisterror.md#name)
* [stack](handlerexisterror.md#optional-stack)

### Methods

* [fillErrorProps](handlerexisterror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HandlerExistError**(`className`: string, `type`: string): *[HandlerExistError](handlerexisterror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`type` | string |

**Returns:** *[HandlerExistError](handlerexisterror.md)*

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
