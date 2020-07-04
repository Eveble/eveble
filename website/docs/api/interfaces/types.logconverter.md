---
id: "types.logconverter"
title: "@eveble/eveble"
sidebar_label: "LogConverter"
---

## Hierarchy

* **LogConverter**

## Implemented by

* [StringifingConverter](../classes/stringifingconverter.md)

## Index

### Methods

* [convertArguments](types.logconverter.md#convertarguments)
* [convertMetadata](types.logconverter.md#convertmetadata)

## Methods

###  convertArguments

▸ **convertArguments**(`entry`: winston.LogEntry | [LogEntry](types.logentry.md), `options?`: [Configurable](types.configurable.md)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | winston.LogEntry &#124; [LogEntry](types.logentry.md) |
`options?` | [Configurable](types.configurable.md) |

**Returns:** *any*

▸ **convertArguments**(`entry`: winston.LogEntry | LogEntry, `options?`: Configurable): *any*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | winston.LogEntry &#124; LogEntry |
`options?` | Configurable |

**Returns:** *any*

___

###  convertMetadata

▸ **convertMetadata**(`metadata`: [LogMetadata](types.logmetadata.md), `entry`: winston.LogEntry | [LogEntry](types.logentry.md), `options?`: [Configurable](types.configurable.md)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | [LogMetadata](types.logmetadata.md) |
`entry` | winston.LogEntry &#124; [LogEntry](types.logentry.md) |
`options?` | [Configurable](types.configurable.md) |

**Returns:** *any*

▸ **convertMetadata**(`metadata`: LogMetadata, `entry`: winston.LogEntry | LogEntry, `options?`: Configurable): *any*

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | LogMetadata |
`entry` | winston.LogEntry &#124; LogEntry |
`options?` | Configurable |

**Returns:** *any*
