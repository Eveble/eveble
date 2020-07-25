---
id: "hookalreadyexistserror"
title: "HookAlreadyExistsError"
sidebar_label: "HookAlreadyExistsError"
---

## Hierarchy

  ↳ [HookError](hookerror.md)

* HookError

  ↳ **HookAlreadyExistsError**

## Index

### Constructors

* [constructor](hookalreadyexistserror.md#constructor)

### Properties

* [code](hookalreadyexistserror.md#optional-code)
* [message](hookalreadyexistserror.md#message)
* [name](hookalreadyexistserror.md#name)
* [stack](hookalreadyexistserror.md#optional-stack)

### Methods

* [fillErrorProps](hookalreadyexistserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HookAlreadyExistsError**(`typeName`: [TypeName](../modules/types.md#typename), `action`: string, `id`: string): *[HookAlreadyExistsError](hookalreadyexistserror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`action` | string |
`id` | string |

**Returns:** *[HookAlreadyExistsError](hookalreadyexistserror.md)*

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
