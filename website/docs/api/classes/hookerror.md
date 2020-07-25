---
id: "hookerror"
title: "HookError"
sidebar_label: "HookError"
---

## Hierarchy

* ExtendableError

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

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[HookError](hookerror.md)*

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
