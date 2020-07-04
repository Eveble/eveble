---
id: "injectormissingerror"
title: "InjectorMissingError"
sidebar_label: "InjectorMissingError"
---

## Hierarchy

  ↳ [ModuleError](moduleerror.md)

* ModuleError

  ↳ **InjectorMissingError**

## Index

### Constructors

* [constructor](injectormissingerror.md#constructor)

### Properties

* [code](injectormissingerror.md#optional-code)
* [message](injectormissingerror.md#message)
* [name](injectormissingerror.md#name)
* [stack](injectormissingerror.md#optional-stack)

### Methods

* [fillErrorProps](injectormissingerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InjectorMissingError**(): *[InjectorMissingError](injectormissingerror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Returns:** *[InjectorMissingError](injectormissingerror.md)*

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
