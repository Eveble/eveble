---
id: "unregistrabletypeerror"
title: "UnregistrableTypeError"
sidebar_label: "UnregistrableTypeError"
---

## Hierarchy

  ↳ [TypeError](typeerror.md)

* TypeError

  ↳ **UnregistrableTypeError**

## Index

### Constructors

* [constructor](unregistrabletypeerror.md#constructor)

### Properties

* [code](unregistrabletypeerror.md#optional-code)
* [message](unregistrabletypeerror.md#message)
* [name](unregistrabletypeerror.md#name)
* [stack](unregistrabletypeerror.md#optional-stack)

### Methods

* [fillErrorProps](unregistrabletypeerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UnregistrableTypeError**(`got`: string): *[UnregistrableTypeError](unregistrabletypeerror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | string |

**Returns:** *[UnregistrableTypeError](unregistrabletypeerror.md)*

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
