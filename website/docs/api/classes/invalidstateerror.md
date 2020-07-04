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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

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
