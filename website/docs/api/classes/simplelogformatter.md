---
id: "simplelogformatter"
title: "SimpleLogFormatter"
sidebar_label: "SimpleLogFormatter"
---

## Hierarchy

* **SimpleLogFormatter**

## Implements

* [LogFormatter](../interfaces/types.logformatter.md)
* LogFormatter

## Index

### Constructors

* [constructor](simplelogformatter.md#constructor)

### Methods

* [format](simplelogformatter.md#format)

## Constructors

###  constructor

\+ **new SimpleLogFormatter**(`converter`: [LogConverter](../interfaces/types.logconverter.md)): *[SimpleLogFormatter](simplelogformatter.md)*

Creates an instance of SimpleLogFormatter.
Creates an instance of SimpleLogFormatter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`converter` | [LogConverter](../interfaces/types.logconverter.md) | LogEntry converter instance.  |

**Returns:** *[SimpleLogFormatter](simplelogformatter.md)*

## Methods

###  format

▸ **format**(`entry`: winston.LogEntry | [LogEntry](../interfaces/types.logentry.md)): *string*

Converts log entry to simple message.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | winston.LogEntry &#124; [LogEntry](../interfaces/types.logentry.md) | Winston's or Eveble's instance implementing `LogEntry` interface. |

**Returns:** *string*

String representation of the provided log as simple message.
