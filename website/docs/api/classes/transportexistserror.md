---
id: "transportexistserror"
title: "TransportExistsError"
sidebar_label: "TransportExistsError"
---

## Hierarchy

  ↳ [LoggingError](loggingerror.md)

* LoggingError

  ↳ **TransportExistsError**

## Index

### Constructors

* [constructor](transportexistserror.md#constructor)

### Properties

* [code](transportexistserror.md#optional-code)
* [message](transportexistserror.md#message)
* [name](transportexistserror.md#name)
* [stack](transportexistserror.md#optional-stack)

### Methods

* [fillErrorProps](transportexistserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new TransportExistsError**(`id`: string): *[TransportExistsError](transportexistserror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *[TransportExistsError](transportexistserror.md)*

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
