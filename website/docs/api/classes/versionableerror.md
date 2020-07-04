---
id: "versionableerror"
title: "VersionableError"
sidebar_label: "VersionableError"
---

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **VersionableError**

  ↳ [InvalidSchemaVersionError](invalidschemaversionerror.md)

  ↳ [LegacyTransformerAlreadyExistsError](legacytransformeralreadyexistserror.md)

  ↳ [LegacyTransformerNotFoundError](legacytransformernotfounderror.md)

  ↳ [InvalidLegacyTransformerError](invalidlegacytransformererror.md)

  ↳ [NotVersionableError](notversionableerror.md)

## Index

### Constructors

* [constructor](versionableerror.md#constructor)

### Properties

* [code](versionableerror.md#optional-code)
* [message](versionableerror.md#message)
* [name](versionableerror.md#name)
* [stack](versionableerror.md#optional-stack)

### Methods

* [fillErrorProps](versionableerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new VersionableError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[VersionableError](versionableerror.md)*

*Inherited from [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[VersionableError](versionableerror.md)*

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
