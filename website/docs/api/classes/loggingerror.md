---
id: "loggingerror"
title: "LoggingError"
sidebar_label: "LoggingError"
---

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **LoggingError**

  ↳ [InvalidTransportIdError](invalidtransportiderror.md)

  ↳ [TransportExistsError](transportexistserror.md)

## Index

### Constructors

* [constructor](loggingerror.md#constructor)

### Properties

* [code](loggingerror.md#optional-code)
* [message](loggingerror.md#message)
* [name](loggingerror.md#name)
* [stack](loggingerror.md#optional-stack)

### Methods

* [fillErrorProps](loggingerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new LoggingError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[LoggingError](loggingerror.md)*

*Inherited from [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[LoggingError](loggingerror.md)*

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
