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

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *[TaskAlreadyCompletedError](taskalreadycompletederror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [NoQuittingFoolError](noquittingfoolerror.md).[code](noquittingfoolerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [NoQuittingFoolError](noquittingfoolerror.md).[message](noquittingfoolerror.md#message)*

*Overrides void*

___

###  name

• **name**: *string*

*Inherited from [NoQuittingFoolError](noquittingfoolerror.md).[name](noquittingfoolerror.md#name)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [NoQuittingFoolError](noquittingfoolerror.md).[stack](noquittingfoolerror.md#optional-stack)*

*Overrides void*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [NoQuittingFoolError](noquittingfoolerror.md).[fillErrorProps](noquittingfoolerror.md#fillerrorprops)*

Fills missing error properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) | Provided properties durning construction of error. |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*

Filled properties Object for ExtendableError instance.
