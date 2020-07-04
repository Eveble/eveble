---
id: "log"
title: "Log"
sidebar_label: "Log"
---

## Hierarchy

* **Log**

## Implements

* [LogEntry](../interfaces/types.logentry.md)
* [Stringifiable](../interfaces/types.stringifiable.md)
* LogEntry
* Stringifiable

## Index

### Constructors

* [constructor](log.md#constructor)

### Properties

* [level](log.md#level)
* [message](log.md#readonly-message)
* [metadata](log.md#readonly-metadata)
* [method](log.md#optional-method)
* [methodName](log.md#optional-methodname)
* [options](log.md#readonly-options)
* [typeName](log.md#optional-typename)

### Methods

* [format](log.md#format)
* [getMetadata](log.md#getmetadata)
* [getTarget](log.md#gettarget)
* [hasMetadata](log.md#hasmetadata)
* [in](log.md#in)
* [isStaticMethod](log.md#isstaticmethod)
* [on](log.md#on)
* [setLevel](log.md#setlevel)
* [toString](log.md#tostring)
* [with](log.md#with)

## Constructors

###  constructor

\+ **new Log**(`messageOrProps`: string | Record‹keyof any, any›): *[Log](log.md)*

Creates an instance Log.
Creates an instance Log.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageOrProps` | string &#124; Record‹keyof any, any› | Message of a log as a `string` or log properties.  |

**Returns:** *[Log](log.md)*

## Properties

###  level

• **level**: *[LogLevel](../modules/types.md#loglevel)*

*Implementation of [LogEntry](../interfaces/types.logentry.md).[level](../interfaces/types.logentry.md#level)*

___

### `Readonly` message

• **message**: *string*

*Implementation of [LogEntry](../interfaces/types.logentry.md).[message](../interfaces/types.logentry.md#readonly-message)*

___

### `Readonly` metadata

• **metadata**: *Map‹string, LogMetadata›*

*Implementation of [LogEntry](../interfaces/types.logentry.md).[metadata](../interfaces/types.logentry.md#readonly-metadata)*

___

### `Optional` method

• **method**? : *function*

*Implementation of [LogEntry](../interfaces/types.logentry.md).[method](../interfaces/types.logentry.md#optional-method)*

#### Type declaration:

▸ (): *[AnyFunction](../modules/types.md#anyfunction)*

___

### `Optional` methodName

• **methodName**? : *string*

*Implementation of [LogEntry](../interfaces/types.logentry.md).[methodName](../interfaces/types.logentry.md#optional-methodname)*

___

### `Readonly` options

• **options**: *[LogFormatting](../modules/types.md#logformatting)*

*Implementation of [LogEntry](../interfaces/types.logentry.md).[options](../interfaces/types.logentry.md#readonly-options)*

___

### `Optional` typeName

• **typeName**? : *[TypeName](../modules/types.md#typename) | undefined*

*Implementation of [LogEntry](../interfaces/types.logentry.md).[typeName](../interfaces/types.logentry.md#optional-typename)*

## Methods

###  format

▸ **format**(`options`: [LogFormatting](../modules/types.md#logformatting)): *this*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Sets additional formatting options for log entry.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | [LogFormatting](../modules/types.md#logformatting) | Log formatting options as an object. |

**Returns:** *this*

Instance of self.

___

###  getMetadata

▸ **getMetadata**(`description`: string): *[LogMetadata](../interfaces/types.logmetadata.md) | undefined*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Returns metadata for log entry.

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |

**Returns:** *[LogMetadata](../interfaces/types.logmetadata.md) | undefined*

`LogMetadata` instance if present.

___

###  getTarget

▸ **getTarget**(): *any*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Returns target.

**Returns:** *any*

Class instance.

___

###  hasMetadata

▸ **hasMetadata**(`description`: string): *boolean*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Evaluates if log entry has metadata with description set on collection.

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |

**Returns:** *boolean*

Returns `true` if log entry has metadata, else `false`.

___

###  in

▸ **in**(`methodOrName`: [AnyFunction](../modules/types.md#anyfunction) | string): *this*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Sets method in which log is invoked or it's name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`methodOrName` | [AnyFunction](../modules/types.md#anyfunction) &#124; string | Method in which log is invoked or its name. |

**Returns:** *this*

Instance of self.

___

###  isStaticMethod

▸ **isStaticMethod**(): *boolean*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Evaluates if defined method is a static method.

**Returns:** *boolean*

Returns `true` if is static method, else `false`.

___

###  on

▸ **on**(`target`: any): *this*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Sets target of the log.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | any | The target on which log is logged(class). |

**Returns:** *this*

Instance of self.

___

###  setLevel

▸ **setLevel**(`level`: [LogLevel](../modules/types.md#loglevel)): *this*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Sets logging level for which log entry is logged.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) | Logged level.  |

**Returns:** *this*

___

###  toString

▸ **toString**(): *string*

*Implementation of [Stringifiable](../interfaces/types.stringifiable.md)*

Converts log to string representation.

**Returns:** *string*

Log message as a `string`.

___

###  with

▸ **with**(`description`: string, `value?`: any, `keys?`: string[]): *this*

*Implementation of [LogEntry](../interfaces/types.logentry.md)*

Adds additional metadata about log entry.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`description` | string | Description of logged metadata entry. |
`value?` | any | Optional logged value. |
`keys?` | string[] | Optional array of properties keys when provided value is an object. Allows to display only selected ones back on log entry. |

**Returns:** *this*

Instance of self.
