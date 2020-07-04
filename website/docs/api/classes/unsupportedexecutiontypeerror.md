---
id: "unsupportedexecutiontypeerror"
title: "UnsupportedExecutionTypeError"
sidebar_label: "UnsupportedExecutionTypeError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **UnsupportedExecutionTypeError**

## Index

### Constructors

* [constructor](unsupportedexecutiontypeerror.md#constructor)

### Properties

* [code](unsupportedexecutiontypeerror.md#optional-code)
* [message](unsupportedexecutiontypeerror.md#message)
* [name](unsupportedexecutiontypeerror.md#name)
* [stack](unsupportedexecutiontypeerror.md#optional-stack)

### Methods

* [fillErrorProps](unsupportedexecutiontypeerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UnsupportedExecutionTypeError**(`className`: string, `execution`: string): *[UnsupportedExecutionTypeError](unsupportedexecutiontypeerror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`execution` | string |

**Returns:** *[UnsupportedExecutionTypeError](unsupportedexecutiontypeerror.md)*

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
