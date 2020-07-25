---
id: "invalidconfigerror"
title: "InvalidConfigError"
sidebar_label: "InvalidConfigError"
---

## Hierarchy

  ↳ [ModuleError](moduleerror.md)

* ModuleError

  ↳ **InvalidConfigError**

## Index

### Constructors

* [constructor](invalidconfigerror.md#constructor)

### Properties

* [code](invalidconfigerror.md#optional-code)
* [message](invalidconfigerror.md#message)
* [name](invalidconfigerror.md#name)
* [stack](invalidconfigerror.md#optional-stack)

### Methods

* [fillErrorProps](invalidconfigerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidConfigError**(`className`: string, `got`: string): *[InvalidConfigError](invalidconfigerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`got` | string |

**Returns:** *[InvalidConfigError](invalidconfigerror.md)*

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
