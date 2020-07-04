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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | any |

**Returns:** *[InvalidEventSourceableError](invalideventsourceableerror.md)*

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
