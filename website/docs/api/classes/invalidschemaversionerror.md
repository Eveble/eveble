---
id: "invalidschemaversionerror"
title: "InvalidSchemaVersionError"
sidebar_label: "InvalidSchemaVersionError"
---

## Hierarchy

  ↳ [VersionableError](versionableerror.md)

* VersionableError

  ↳ **InvalidSchemaVersionError**

## Index

### Constructors

* [constructor](invalidschemaversionerror.md#constructor)

### Properties

* [code](invalidschemaversionerror.md#optional-code)
* [message](invalidschemaversionerror.md#message)
* [name](invalidschemaversionerror.md#name)
* [stack](invalidschemaversionerror.md#optional-stack)

### Methods

* [fillErrorProps](invalidschemaversionerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidSchemaVersionError**(`typeName`: [TypeName](../modules/types.md#typename), `got`: any): *[InvalidSchemaVersionError](invalidschemaversionerror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`got` | any |

**Returns:** *[InvalidSchemaVersionError](invalidschemaversionerror.md)*

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
