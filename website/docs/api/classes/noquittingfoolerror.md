---
id: "noquittingfoolerror"
title: "NoQuittingFoolError"
sidebar_label: "NoQuittingFoolError"
---

## Hierarchy

* StateError

  ↳ **NoQuittingFoolError**

## Index

### Constructors

* [constructor](noquittingfoolerror.md#constructor)

### Properties

* [code](noquittingfoolerror.md#optional-code)
* [message](noquittingfoolerror.md#message)
* [name](noquittingfoolerror.md#name)
* [stack](noquittingfoolerror.md#optional-stack)

### Methods

* [fillErrorProps](noquittingfoolerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new NoQuittingFoolError**(): *[NoQuittingFoolError](noquittingfoolerror.md)*

*Overrides void*

**Returns:** *[NoQuittingFoolError](noquittingfoolerror.md)*

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
