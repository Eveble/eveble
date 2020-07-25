---
id: "invalidenvironmenterror"
title: "InvalidEnvironmentError"
sidebar_label: "InvalidEnvironmentError"
---

## Hierarchy

  ↳ [ModuleError](moduleerror.md)

* ModuleError

  ↳ **InvalidEnvironmentError**

## Index

### Constructors

* [constructor](invalidenvironmenterror.md#constructor)

### Properties

* [code](invalidenvironmenterror.md#optional-code)
* [message](invalidenvironmenterror.md#message)
* [name](invalidenvironmenterror.md#name)
* [stack](invalidenvironmenterror.md#optional-stack)

### Methods

* [fillErrorProps](invalidenvironmenterror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidEnvironmentError**(`action`: string, `currentEnv`: string): *[InvalidEnvironmentError](invalidenvironmenterror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`currentEnv` | string |

**Returns:** *[InvalidEnvironmentError](invalidenvironmenterror.md)*

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
