---
id: "versionableerror"
title: "VersionableError"
sidebar_label: "VersionableError"
---

## Hierarchy

* ExtendableError

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

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[VersionableError](versionableerror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [StateError](stateerror.md).[code](stateerror.md#optional-code)*

*Overrides [StateError](stateerror.md).[code](stateerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [StateError](stateerror.md).[message](stateerror.md#message)*

*Overrides void*

___

###  name

• **name**: *string*

*Inherited from [StateError](stateerror.md).[name](stateerror.md#name)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [StateError](stateerror.md).[stack](stateerror.md#optional-stack)*

*Overrides void*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

*Overrides [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*
