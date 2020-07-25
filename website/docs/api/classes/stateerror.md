---
id: "stateerror"
title: "StateError"
sidebar_label: "StateError"
---

## Hierarchy

* ExtendableError

* ExtendableError

  ↳ **StateError**

  ↳ [UndefinedStatesError](undefinedstateserror.md)

  ↳ [InvalidStateError](invalidstateerror.md)

## Index

### Constructors

* [constructor](stateerror.md#constructor)

### Properties

* [code](stateerror.md#optional-code)
* [message](stateerror.md#message)
* [name](stateerror.md#name)
* [stack](stateerror.md#optional-stack)

### Methods

* [fillErrorProps](stateerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new StateError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[StateError](stateerror.md)*

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[StateError](stateerror.md)*

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
