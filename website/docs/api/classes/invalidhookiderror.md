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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | any |

**Returns:** *[InvalidHookIdError](invalidhookiderror.md)*

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
