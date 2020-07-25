---
id: "invalidhookiderror"
title: "InvalidHookIdError"
sidebar_label: "InvalidHookIdError"
---

## Hierarchy

  ↳ [HookError](hookerror.md)

* HookError

  ↳ **InvalidHookIdError**

## Index

### Constructors

* [constructor](invalidhookiderror.md#constructor)

### Properties

* [code](invalidhookiderror.md#optional-code)
* [message](invalidhookiderror.md#message)
* [name](invalidhookiderror.md#name)
* [stack](invalidhookiderror.md#optional-stack)

### Methods

* [fillErrorProps](invalidhookiderror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidHookIdError**(`got`: any): *[InvalidHookIdError](invalidhookiderror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | any |

**Returns:** *[InvalidHookIdError](invalidhookiderror.md)*

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
