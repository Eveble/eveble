---
id: "invalidlegacytransformererror"
title: "InvalidLegacyTransformerError"
sidebar_label: "InvalidLegacyTransformerError"
---

## Hierarchy

  ↳ [VersionableError](versionableerror.md)

* VersionableError

  ↳ **InvalidLegacyTransformerError**

## Index

### Constructors

* [constructor](invalidlegacytransformererror.md#constructor)

### Properties

* [code](invalidlegacytransformererror.md#optional-code)
* [message](invalidlegacytransformererror.md#message)
* [name](invalidlegacytransformererror.md#name)
* [stack](invalidlegacytransformererror.md#optional-stack)

### Methods

* [fillErrorProps](invalidlegacytransformererror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidLegacyTransformerError**(`typeName`: [TypeName](../modules/types.md#typename), `propertyKey`: string, `schemaVersion`: number): *[InvalidLegacyTransformerError](invalidlegacytransformererror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`propertyKey` | string |
`schemaVersion` | number |

**Returns:** *[InvalidLegacyTransformerError](invalidlegacytransformererror.md)*

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
