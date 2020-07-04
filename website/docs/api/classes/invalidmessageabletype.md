---
id: "invalidmessageabletype"
title: "InvalidMessageableType"
sidebar_label: "InvalidMessageableType"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **InvalidMessageableType**

## Index

### Constructors

* [constructor](invalidmessageabletype.md#constructor)

### Properties

* [code](invalidmessageabletype.md#optional-code)
* [message](invalidmessageabletype.md#message)
* [name](invalidmessageabletype.md#name)
* [stack](invalidmessageabletype.md#optional-stack)

### Methods

* [fillErrorProps](invalidmessageabletype.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidMessageableType**(`got`: string): *[InvalidMessageableType](invalidmessageabletype.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | string |

**Returns:** *[InvalidMessageableType](invalidmessageabletype.md)*

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
