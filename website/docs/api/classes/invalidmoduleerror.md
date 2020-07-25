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

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`got` | string |

**Returns:** *[InvalidModuleError](invalidmoduleerror.md)*

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
