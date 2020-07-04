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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

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
