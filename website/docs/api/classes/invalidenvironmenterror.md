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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`currentEnv` | string |

**Returns:** *[InvalidEnvironmentError](invalidenvironmenterror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [ExtendableError](extendableerror.md).[code](extendableerror.md#optional-code)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[code](noquittingfoolerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [ExtendableError](extendableerror.md).[message](extendableerror.md#message)*

*Overrides void*

___

###  name

• **name**: *string*

*Inherited from [ExtendableError](extendableerror.md).[name](extendableerror.md#name)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [ExtendableError](extendableerror.md).[stack](extendableerror.md#optional-stack)*

*Overrides void*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [ExtendableError](extendableerror.md).[fillErrorProps](extendableerror.md#fillerrorprops)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[fillErrorProps](noquittingfoolerror.md#fillerrorprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*
