---
id: "taskalreadycompletederror"
title: "TaskAlreadyCompletedError"
sidebar_label: "TaskAlreadyCompletedError"
---

## Hierarchy

* StateError

  ↳ **TaskAlreadyCompletedError**

## Index

### Constructors

* [constructor](taskalreadycompletederror.md#constructor)

### Properties

* [code](taskalreadycompletederror.md#optional-code)
* [message](taskalreadycompletederror.md#message)
* [name](taskalreadycompletederror.md#name)
* [stack](taskalreadycompletederror.md#optional-stack)

### Methods

* [fillErrorProps](taskalreadycompletederror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new TaskAlreadyCompletedError**(`id`: any): *[TaskAlreadyCompletedError](taskalreadycompletederror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *[TaskAlreadyCompletedError](taskalreadycompletederror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [StateError](stateerror.md).[code](stateerror.md#optional-code)*

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

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*
