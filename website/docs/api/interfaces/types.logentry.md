---
id: "types.logentry"
title: "@eveble/eveble"
sidebar_label: "LogEntry"
---

## Hierarchy

* **LogEntry**

## Implemented by

* [Log](../classes/log.md)

## Index

### Properties

* [level](types.logentry.md#level)
* [message](types.logentry.md#readonly-message)
* [metadata](types.logentry.md#readonly-metadata)
* [method](types.logentry.md#optional-method)
* [methodName](types.logentry.md#optional-methodname)
* [options](types.logentry.md#readonly-options)
* [typeName](types.logentry.md#optional-typename)

### Methods

* [format](types.logentry.md#format)
* [getMetadata](types.logentry.md#getmetadata)
* [getTarget](types.logentry.md#gettarget)
* [hasMetadata](types.logentry.md#hasmetadata)
* [in](types.logentry.md#in)
* [isStaticMethod](types.logentry.md#isstaticmethod)
* [on](types.logentry.md#on)
* [setLevel](types.logentry.md#setlevel)
* [toString](types.logentry.md#tostring)
* [with](types.logentry.md#with)

## Properties

###  level

• **level**: *[LogLevel](../modules/types.md#loglevel)*

___

### `Readonly` message

• **message**: *string*

___

### `Readonly` metadata

• **metadata**: *Map‹string, LogMetadata›*

___

### `Optional` method

• **method**? : *function*

#### Type declaration:

▸ (): *[AnyFunction](../modules/types.md#anyfunction)*

___

### `Optional` methodName

• **methodName**? : *string*

___

### `Readonly` options

• **options**: *[LogFormatting](../modules/types.md#logformatting)*

___

### `Optional` typeName

• **typeName**? : *[TypeName](../modules/types.md#typename) | undefined*

## Methods

###  format

▸ **format**(`options`: [LogFormatting](../modules/types.md#logformatting)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [LogFormatting](../modules/types.md#logformatting) |

**Returns:** *this*

▸ **format**(`options`: [LogFormatting](../modules/types.md#logformatting)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [LogFormatting](../modules/types.md#logformatting) |

**Returns:** *this*

___

###  getMetadata

▸ **getMetadata**(`description`: string): *[LogMetadata](types.logmetadata.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |

**Returns:** *[LogMetadata](types.logmetadata.md) | undefined*

▸ **getMetadata**(`description`: string): *LogMetadata | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |

**Returns:** *LogMetadata | undefined*

___

###  getTarget

▸ **getTarget**(): *any*

**Returns:** *any*

▸ **getTarget**(): *any*

**Returns:** *any*

___

###  hasMetadata

▸ **hasMetadata**(`description`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |

**Returns:** *boolean*

▸ **hasMetadata**(`description`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |

**Returns:** *boolean*

___

###  in

▸ **in**(`methodOrName`: [AnyFunction](../modules/types.md#anyfunction) | string): *this*

**Parameters:**

Name | Type |
------ | ------ |
`methodOrName` | [AnyFunction](../modules/types.md#anyfunction) &#124; string |

**Returns:** *this*

▸ **in**(`methodOrName`: [AnyFunction](../modules/types.md#anyfunction) | string): *this*

**Parameters:**

Name | Type |
------ | ------ |
`methodOrName` | [AnyFunction](../modules/types.md#anyfunction) &#124; string |

**Returns:** *this*

___

###  isStaticMethod

▸ **isStaticMethod**(): *boolean*

**Returns:** *boolean*

▸ **isStaticMethod**(): *boolean*

**Returns:** *boolean*

___

###  on

▸ **on**(`target`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |

**Returns:** *this*

▸ **on**(`target`: any): *this*

**Parameters:**

Name | Type |
------ | ------ |
`target` | any |

**Returns:** *this*

___

###  setLevel

▸ **setLevel**(`level`: [LogLevel](../modules/types.md#loglevel)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |

**Returns:** *this*

▸ **setLevel**(`level`: [LogLevel](../modules/types.md#loglevel)): *this*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |

**Returns:** *this*

___

###  toString

▸ **toString**(): *string*

**Returns:** *string*

▸ **toString**(): *string*

**Returns:** *string*

___

###  with

▸ **with**(`description`: string, `value?`: any, `keys?`: string[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |
`value?` | any |
`keys?` | string[] |

**Returns:** *this*

▸ **with**(`description`: string, `value?`: any, `keys?`: string[]): *this*

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |
`value?` | any |
`keys?` | string[] |

**Returns:** *this*
