---
id: "invalidhookactionerror"
title: "InvalidHookActionError"
sidebar_label: "InvalidHookActionError"
---

## Hierarchy

  ↳ [HookError](hookerror.md)

* HookError

  ↳ **InvalidHookActionError**

## Index

### Constructors

* [constructor](invalidhookactionerror.md#constructor)

### Properties

* [code](invalidhookactionerror.md#optional-code)
* [message](invalidhookactionerror.md#message)
* [name](invalidhookactionerror.md#name)
* [stack](invalidhookactionerror.md#optional-stack)

### Methods

* [fillErrorProps](invalidhookactionerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidHookActionError**(`got`: any): *[InvalidHookActionError](invalidhookactionerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | any |

**Returns:** *[InvalidHookActionError](invalidhookactionerror.md)*

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
