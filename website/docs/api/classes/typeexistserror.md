---
id: "typeexistserror"
title: "TypeExistsError"
sidebar_label: "TypeExistsError"
---

## Hierarchy

  ↳ [TypeError](typeerror.md)

* TypeError

  ↳ **TypeExistsError**

## Index

### Constructors

* [constructor](typeexistserror.md#constructor)

### Properties

* [code](typeexistserror.md#optional-code)
* [message](typeexistserror.md#message)
* [name](typeexistserror.md#name)
* [stack](typeexistserror.md#optional-stack)

### Methods

* [fillErrorProps](typeexistserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new TypeExistsError**(`source`: string, `typeName`: string): *[TypeExistsError](typeexistserror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`source` | string |
`typeName` | string |

**Returns:** *[TypeExistsError](typeexistserror.md)*

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
