---
id: "hookerror"
title: "HookError"
sidebar_label: "HookError"
---

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **HookError**

  ↳ [InvalidHookActionError](invalidhookactionerror.md)

  ↳ [InvalidHookIdError](invalidhookiderror.md)

  ↳ [HookAlreadyExistsError](hookalreadyexistserror.md)

  ↳ [HookNotFoundError](hooknotfounderror.md)

## Index

### Constructors

* [constructor](hookerror.md#constructor)

### Properties

* [code](hookerror.md#optional-code)
* [message](hookerror.md#message)
* [name](hookerror.md#name)
* [stack](hookerror.md#optional-stack)

### Methods

* [fillErrorProps](hookerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HookError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[HookError](hookerror.md)*

*Inherited from [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[HookError](hookerror.md)*

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
