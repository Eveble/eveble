---
id: "consoletransport"
title: "ConsoleTransport"
sidebar_label: "ConsoleTransport"
---

## Hierarchy

  ↳ [LogTransport](logtransport.md)

* LogTransport

  ↳ **ConsoleTransport**

## Implements

* [LogTransport](../interfaces/types.logtransport.md)
* LogTransport

## Index

### Constructors

* [constructor](consoletransport.md#constructor)

### Properties

* [client](consoletransport.md#client)
* [config](consoletransport.md#readonly-config)
* [level](consoletransport.md#readonly-level)
* [logger](consoletransport.md#logger)

### Methods

* [alert](consoletransport.md#alert)
* [crit](consoletransport.md#crit)
* [debug](consoletransport.md#debug)
* [emerg](consoletransport.md#emerg)
* [error](consoletransport.md#error)
* [formatEntry](consoletransport.md#formatentry)
* [info](consoletransport.md#info)
* [initialize](consoletransport.md#initialize)
* [isLoggable](consoletransport.md#isloggable)
* [log](consoletransport.md#log)
* [notice](consoletransport.md#notice)
* [warning](consoletransport.md#warning)

## Constructors

###  constructor

\+ **new ConsoleTransport**(`level`: [LogLevel](../modules/types.md#loglevel), `config`: [LogTransportConfig](logtransportconfig.md), `format?`: any): *[ConsoleTransport](consoletransport.md)*

*Overrides [LogTransport](logtransport.md).[constructor](logtransport.md#constructor)*

Creates a ConsoleTransport.
Creates a ConsoleTransport.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) | Level for which priority logging will only be done(less than or equal to this level). |
`config` | [LogTransportConfig](logtransportconfig.md) | `LogTransportConfig` instance. |
`format?` | any | Optional Winston's formatting.  |

**Returns:** *[ConsoleTransport](consoletransport.md)*

## Properties

###  client

• **client**: *winston.Logger*

*Overrides [LogTransport](logtransport.md).[client](logtransport.md#client)*

___

### `Readonly` config

• **config**: *LogTransportConfig*

*Overrides [LogTransport](logtransport.md).[config](logtransport.md#optional-readonly-config)*

___

### `Readonly` level

• **level**: *[LogLevel](../modules/types.md#loglevel)*

*Implementation of [LogTransport](../interfaces/types.logtransport.md).[level](../interfaces/types.logtransport.md#readonly-level)*

*Overrides [LogTransport](logtransport.md).[level](logtransport.md#readonly-level)*

___

###  logger

• **logger**: *Logger*

*Implementation of [LogTransport](../interfaces/types.logtransport.md).[logger](../interfaces/types.logtransport.md#logger)*

*Overrides [LogTransport](logtransport.md).[logger](logtransport.md#logger)*

## Methods

###  alert

▸ **alert**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[alert](rfc5424loggingmixin.md#alert)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  crit

▸ **crit**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[crit](rfc5424loggingmixin.md#crit)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  debug

▸ **debug**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[debug](rfc5424loggingmixin.md#debug)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  emerg

▸ **emerg**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[emerg](rfc5424loggingmixin.md#emerg)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  error

▸ **error**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[error](rfc5424loggingmixin.md#error)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  formatEntry

▸ **formatEntry**(`entry`: winston.LogEntry | [LogEntry](../interfaces/types.logentry.md)): *string*

Formats log entry.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | winston.LogEntry &#124; [LogEntry](../interfaces/types.logentry.md) | Winston's or Eveble's Log instance. |

**Returns:** *string*

String representation of the provided log.

___

###  info

▸ **info**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[info](rfc5424loggingmixin.md#info)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  initialize

▸ **initialize**(): *void*

*Overrides [LogTransport](logtransport.md).[initialize](logtransport.md#initialize)*

Initializes ConsoleTransport.

**Returns:** *void*

___

###  isLoggable

▸ **isLoggable**(`level`: [LogLevel](../modules/types.md#loglevel)): *boolean*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [LogTransport](logtransport.md).[isLoggable](logtransport.md#isloggable)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |

**Returns:** *boolean*

___

###  log

▸ **log**(`level`: [LogLevel](../modules/types.md#loglevel), `entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [LogTransport](logtransport.md).[log](logtransport.md#log)*

*Overrides [RFC5424LoggingMixin](rfc5424loggingmixin.md).[log](rfc5424loggingmixin.md#log)*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  notice

▸ **notice**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[notice](rfc5424loggingmixin.md#notice)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  warning

▸ **warning**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [LogTransport](../interfaces/types.logtransport.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[warning](rfc5424loggingmixin.md#warning)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*
