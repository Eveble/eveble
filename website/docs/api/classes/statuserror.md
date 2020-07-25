---
id: "statuserror"
title: "StatusError"
sidebar_label: "StatusError"
---

## Hierarchy

* ExtendableError

* ExtendableError

  ↳ **StatusError**

  ↳ [UndefinedStatusesError](undefinedstatuseserror.md)

  ↳ [InvalidStatusError](invalidstatuserror.md)

## Index

### Constructors

* [constructor](statuserror.md#constructor)

### Properties

* [code](statuserror.md#optional-code)
* [message](statuserror.md#message)
* [name](statuserror.md#name)
* [stack](statuserror.md#optional-stack)

### Methods

* [fillErrorProps](statuserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new StatusError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[StatusError](statuserror.md)*

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[StatusError](statuserror.md)*

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
