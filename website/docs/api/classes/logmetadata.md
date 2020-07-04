---
id: "logmetadata"
title: "LogMetadata"
sidebar_label: "LogMetadata"
---

## Hierarchy

* **LogMetadata**

## Implements

* [LogMetadata](../interfaces/types.logmetadata.md)
* LogMetadata

## Index

### Constructors

* [constructor](logmetadata.md#constructor)

### Properties

* [description](logmetadata.md#readonly-description)
* [keys](logmetadata.md#optional-readonly-keys)
* [value](logmetadata.md#optional-readonly-value)

## Constructors

###  constructor

\+ **new LogMetadata**(`description`: string, `value?`: any, `keys?`: string[]): *[LogMetadata](logmetadata.md)*

Creates an instance LogMetadata.
Creates an instance LogMetadata.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`description` | string | Description of logged metadata entry. |
`value?` | any | Logged value. |
`keys?` | string[] | Optional array of properties keys when provided value is an object. Allows to display only selected ones back on log entry.  |

**Returns:** *[LogMetadata](logmetadata.md)*

## Properties

### `Readonly` description

• **description**: *string*

*Implementation of [LogMetadata](../interfaces/types.logmetadata.md).[description](../interfaces/types.logmetadata.md#readonly-description)*

___

### `Optional` `Readonly` keys

• **keys**? : *string[]*

*Implementation of [LogMetadata](../interfaces/types.logmetadata.md).[keys](../interfaces/types.logmetadata.md#optional-readonly-keys)*

___

### `Optional` `Readonly` value

• **value**? : *any*

*Implementation of [LogMetadata](../interfaces/types.logmetadata.md).[value](../interfaces/types.logmetadata.md#optional-readonly-value)*
