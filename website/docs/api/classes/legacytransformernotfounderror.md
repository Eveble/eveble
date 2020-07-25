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

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`schemaVersion` | number |

**Returns:** *[LegacyTransformerNotFoundError](legacytransformernotfounderror.md)*

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
