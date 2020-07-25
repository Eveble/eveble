---
id: "hooknotfounderror"
title: "HookNotFoundError"
sidebar_label: "HookNotFoundError"
---

## Hierarchy

  ↳ [HookError](hookerror.md)

* HookError

  ↳ **HookNotFoundError**

## Index

### Constructors

* [constructor](hooknotfounderror.md#constructor)

### Properties

* [code](hooknotfounderror.md#optional-code)
* [message](hooknotfounderror.md#message)
* [name](hooknotfounderror.md#name)
* [stack](hooknotfounderror.md#optional-stack)

### Methods

* [fillErrorProps](hooknotfounderror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HookNotFoundError**(`typeName`: [TypeName](../modules/types.md#typename), `action`: string, `id`: string): *[HookNotFoundError](hooknotfounderror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`action` | string |
`id` | string |

**Returns:** *[HookNotFoundError](hooknotfounderror.md)*

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
