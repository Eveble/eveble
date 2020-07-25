---
id: "invalidappconfigerror"
title: "InvalidAppConfigError"
sidebar_label: "InvalidAppConfigError"
---

## Hierarchy

  ↳ [AppError](apperror.md)

* AppError

  ↳ **InvalidAppConfigError**

## Index

### Constructors

* [constructor](invalidappconfigerror.md#constructor)

### Properties

* [code](invalidappconfigerror.md#optional-code)
* [message](invalidappconfigerror.md#message)
* [name](invalidappconfigerror.md#name)
* [stack](invalidappconfigerror.md#optional-stack)

### Methods

* [fillErrorProps](invalidappconfigerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidAppConfigError**(`got`: string): *[InvalidAppConfigError](invalidappconfigerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | string |

**Returns:** *[InvalidAppConfigError](invalidappconfigerror.md)*

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
