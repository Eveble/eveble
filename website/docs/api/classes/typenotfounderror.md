---
id: "typenotfounderror"
title: "TypeNotFoundError"
sidebar_label: "TypeNotFoundError"
---

## Hierarchy

  ↳ [TypeError](typeerror.md)

* TypeError

  ↳ **TypeNotFoundError**

## Index

### Constructors

* [constructor](typenotfounderror.md#constructor)

### Properties

* [code](typenotfounderror.md#optional-code)
* [message](typenotfounderror.md#message)
* [name](typenotfounderror.md#name)
* [stack](typenotfounderror.md#optional-stack)

### Methods

* [fillErrorProps](typenotfounderror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new TypeNotFoundError**(`source`: string, `typeName`: string): *[TypeNotFoundError](typenotfounderror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | string |
`typeName` | string |

**Returns:** *[TypeNotFoundError](typenotfounderror.md)*

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
