---
id: "injectorerror"
title: "InjectorError"
sidebar_label: "InjectorError"
---

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **InjectorError**

  ↳ [InvalidEventSourceableError](invalideventsourceableerror.md)

## Index

### Constructors

* [constructor](injectorerror.md#constructor)

### Properties

* [code](injectorerror.md#optional-code)
* [message](injectorerror.md#message)
* [name](injectorerror.md#name)
* [stack](injectorerror.md#optional-stack)

### Methods

* [fillErrorProps](injectorerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InjectorError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[InjectorError](injectorerror.md)*

*Inherited from [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[InjectorError](injectorerror.md)*

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
