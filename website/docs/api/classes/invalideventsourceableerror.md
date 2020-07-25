---
id: "invalideventsourceableerror"
title: "InvalidEventSourceableError"
sidebar_label: "InvalidEventSourceableError"
---

## Hierarchy

  ↳ [InjectorError](injectorerror.md)

* InjectorError

  ↳ **InvalidEventSourceableError**

## Index

### Constructors

* [constructor](invalideventsourceableerror.md#constructor)

### Properties

* [code](invalideventsourceableerror.md#optional-code)
* [message](invalideventsourceableerror.md#message)
* [name](invalideventsourceableerror.md#name)
* [stack](invalideventsourceableerror.md#optional-stack)

### Methods

* [fillErrorProps](invalideventsourceableerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidEventSourceableError**(`got`: any): *[InvalidEventSourceableError](invalideventsourceableerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | any |

**Returns:** *[InvalidEventSourceableError](invalideventsourceableerror.md)*

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
