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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`got` | string |

**Returns:** *[InvalidConfigError](invalidconfigerror.md)*

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
