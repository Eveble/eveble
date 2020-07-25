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

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Returns:** *[InjectorMissingError](injectormissingerror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [StateError](stateerror.md).[code](stateerror.md#optional-code)*

*Overrides [StateError](stateerror.md).[code](stateerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [StateError](stateerror.md).[message](stateerror.md#message)*

*Overrides void*

___

###  name

• **name**: *string*

*Inherited from [StateError](stateerror.md).[name](stateerror.md#name)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [StateError](stateerror.md).[stack](stateerror.md#optional-stack)*

*Overrides void*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

*Overrides [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*
