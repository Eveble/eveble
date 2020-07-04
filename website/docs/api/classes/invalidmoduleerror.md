---
id: "invalidmoduleerror"
title: "InvalidModuleError"
sidebar_label: "InvalidModuleError"
---

## Hierarchy

  ↳ [ModuleError](moduleerror.md)

* ModuleError

  ↳ **InvalidModuleError**

## Index

### Constructors

* [constructor](invalidmoduleerror.md#constructor)

### Properties

* [code](invalidmoduleerror.md#optional-code)
* [message](invalidmoduleerror.md#message)
* [name](invalidmoduleerror.md#name)
* [stack](invalidmoduleerror.md#optional-stack)

### Methods

* [fillErrorProps](invalidmoduleerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidModuleError**(`className`: string, `got`: string): *[InvalidModuleError](invalidmoduleerror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`got` | string |

**Returns:** *[InvalidModuleError](invalidmoduleerror.md)*

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
