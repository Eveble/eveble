---
id: "legacytransformernotfounderror"
title: "LegacyTransformerNotFoundError"
sidebar_label: "LegacyTransformerNotFoundError"
---

## Hierarchy

  ↳ [VersionableError](versionableerror.md)

* VersionableError

  ↳ **LegacyTransformerNotFoundError**

## Index

### Constructors

* [constructor](legacytransformernotfounderror.md#constructor)

### Properties

* [code](legacytransformernotfounderror.md#optional-code)
* [message](legacytransformernotfounderror.md#message)
* [name](legacytransformernotfounderror.md#name)
* [stack](legacytransformernotfounderror.md#optional-stack)

### Methods

* [fillErrorProps](legacytransformernotfounderror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new LegacyTransformerNotFoundError**(`typeName`: [TypeName](../modules/types.md#typename), `schemaVersion`: number): *[LegacyTransformerNotFoundError](legacytransformernotfounderror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`schemaVersion` | number |

**Returns:** *[LegacyTransformerNotFoundError](legacytransformernotfounderror.md)*

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
