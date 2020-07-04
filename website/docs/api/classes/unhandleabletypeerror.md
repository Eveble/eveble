---
id: "unhandleabletypeerror"
title: "UnhandleableTypeError"
sidebar_label: "UnhandleableTypeError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **UnhandleableTypeError**

## Index

### Constructors

* [constructor](unhandleabletypeerror.md#constructor)

### Properties

* [code](unhandleabletypeerror.md#optional-code)
* [message](unhandleabletypeerror.md#message)
* [name](unhandleabletypeerror.md#name)
* [stack](unhandleabletypeerror.md#optional-stack)

### Methods

* [fillErrorProps](unhandleabletypeerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UnhandleableTypeError**(`className`: string, `handleableTypes`: string, `got`: string): *[UnhandleableTypeError](unhandleabletypeerror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`handleableTypes` | string |
`got` | string |

**Returns:** *[UnhandleableTypeError](unhandleabletypeerror.md)*

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
