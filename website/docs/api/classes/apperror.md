---
id: "apperror"
title: "AppError"
sidebar_label: "AppError"
---

## Hierarchy

* ExtendableError

* ExtendableError

  ↳ **AppError**

  ↳ [InvalidAppConfigError](invalidappconfigerror.md)

## Index

### Constructors

* [constructor](apperror.md#constructor)

### Properties

* [code](apperror.md#optional-code)
* [message](apperror.md#message)
* [name](apperror.md#name)
* [stack](apperror.md#optional-stack)

### Methods

* [fillErrorProps](apperror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new AppError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[AppError](apperror.md)*

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[AppError](apperror.md)*

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
