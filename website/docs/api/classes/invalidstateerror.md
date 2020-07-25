---
id: "invalidstateerror"
title: "InvalidStateError"
sidebar_label: "InvalidStateError"
---

## Hierarchy

  ↳ [StateError](stateerror.md)

* StateError

  ↳ **InvalidStateError**

## Index

### Constructors

* [constructor](invalidstateerror.md#constructor)

### Properties

* [code](invalidstateerror.md#optional-code)
* [message](invalidstateerror.md#message)
* [name](invalidstateerror.md#name)
* [stack](invalidstateerror.md#optional-stack)

### Methods

* [fillErrorProps](invalidstateerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidStateError**(`typeName`: [TypeName](../modules/types.md#typename), `currentState`: [State](../modules/types.md#state), `expectedStates`: [State](../modules/types.md#state)): *[InvalidStateError](invalidstateerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`currentState` | [State](../modules/types.md#state) |
`expectedStates` | [State](../modules/types.md#state) |

**Returns:** *[InvalidStateError](invalidstateerror.md)*

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
