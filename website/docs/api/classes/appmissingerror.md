---
id: "appmissingerror"
title: "AppMissingError"
sidebar_label: "AppMissingError"
---

## Hierarchy

  ↳ [ModuleError](moduleerror.md)

* ModuleError

  ↳ **AppMissingError**

## Index

### Constructors

* [constructor](appmissingerror.md#constructor)

### Properties

* [code](appmissingerror.md#optional-code)
* [message](appmissingerror.md#message)
* [name](appmissingerror.md#name)
* [stack](appmissingerror.md#optional-stack)

### Methods

* [fillErrorProps](appmissingerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new AppMissingError**(): *[AppMissingError](appmissingerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Returns:** *[AppMissingError](appmissingerror.md)*

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
