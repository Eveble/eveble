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

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`got` | any |

**Returns:** *[InvalidSchemaVersionError](invalidschemaversionerror.md)*

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
