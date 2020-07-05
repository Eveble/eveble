---
id: "invalidtransportiderror"
title: "InvalidTransportIdError"
sidebar_label: "InvalidTransportIdError"
---

## Hierarchy

  ↳ [LoggingError](loggingerror.md)

* LoggingError

  ↳ **InvalidTransportIdError**

## Index

### Constructors

* [constructor](invalidtransportiderror.md#constructor)

### Properties

* [code](invalidtransportiderror.md#optional-code)
* [message](invalidtransportiderror.md#message)
* [name](invalidtransportiderror.md#name)
* [stack](invalidtransportiderror.md#optional-stack)

### Methods

* [fillErrorProps](invalidtransportiderror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidTransportIdError**(`got`: string): *[InvalidTransportIdError](invalidtransportiderror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | string |

**Returns:** *[InvalidTransportIdError](invalidtransportiderror.md)*

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
