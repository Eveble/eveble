---
id: "stringifingconverter"
title: "StringifingConverter"
sidebar_label: "StringifingConverter"
---

## Hierarchy

* **StringifingConverter**

## Implements

* [LogConverter](../interfaces/types.logconverter.md)
* LogConverter

## Index

### Methods

* [convertArguments](stringifingconverter.md#convertarguments)
* [convertMetadata](stringifingconverter.md#convertmetadata)

## Methods

###  convertArguments

▸ **convertArguments**(`entry`: winston.LogEntry | [LogEntry](../interfaces/types.logentry.md), `options?`: [LogTransportConfig](logtransportconfig.md)): *string*

*Implementation of [LogConverter](../interfaces/types.logconverter.md)*

Converts additional logged arguments('rest').

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | winston.LogEntry &#124; [LogEntry](../interfaces/types.logentry.md) | Winston's or Eveble's instance implementing `LogEntry` interface. |
`options?` | [LogTransportConfig](logtransportconfig.md) | `LogTransportOption` instance. |

**Returns:** *string*

String representation of 'rest' arguments from `LogEntry`.

___

###  convertMetadata

▸ **convertMetadata**(`metadata`: [LogMetadata](../interfaces/types.logmetadata.md), `entry`: winston.LogEntry | [LogEntry](../interfaces/types.logentry.md), `options`: [LogTransportConfig](logtransportconfig.md)): *string*

*Implementation of [LogConverter](../interfaces/types.logconverter.md)*

Converts log metadata to string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadata` | [LogMetadata](../interfaces/types.logmetadata.md) | LogMetadata instance. |
`entry` | winston.LogEntry &#124; [LogEntry](../interfaces/types.logentry.md) | Winston's or Eveble's instance implementing `LogEntry` interface. |
`options` | [LogTransportConfig](logtransportconfig.md) | `LogTransportOption` instance. |

**Returns:** *string*

String representation of log metadata item.
