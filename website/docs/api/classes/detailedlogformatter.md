---
id: "detailedlogformatter"
title: "DetailedLogFormatter"
sidebar_label: "DetailedLogFormatter"
---

## Hierarchy

* **DetailedLogFormatter**

## Implements

* [LogFormatter](../interfaces/types.logformatter.md)
* LogFormatter

## Index

### Constructors

* [constructor](detailedlogformatter.md#constructor)

### Methods

* [format](detailedlogformatter.md#format)

## Constructors

###  constructor

\+ **new DetailedLogFormatter**(`converter`: [LogConverter](../interfaces/types.logconverter.md)): *[DetailedLogFormatter](detailedlogformatter.md)*

Creates an instance of SimpleLogFormatter.
Creates an instance of SimpleLogFormatter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`converter` | [LogConverter](../interfaces/types.logconverter.md) | LogEntry converter instance.  |

**Returns:** *[DetailedLogFormatter](detailedlogformatter.md)*

## Methods

###  format

▸ **format**(`entry`: winston.LogEntry | [LogEntry](../interfaces/types.logentry.md), `config`: [LogTransportConfig](logtransportconfig.md)): *string*

*Implementation of [LogFormatter](../interfaces/types.logformatter.md)*

Converts log entry to detailed message.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | winston.LogEntry &#124; [LogEntry](../interfaces/types.logentry.md) | Winston's or Eveble's instance implementing `LogEntry` interface. |
`config` | [LogTransportConfig](logtransportconfig.md) | `LogTransportConfig` instance. |

**Returns:** *string*

String representation of the provided log as detailed message.
