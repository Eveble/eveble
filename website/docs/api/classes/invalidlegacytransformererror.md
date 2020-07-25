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

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

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
