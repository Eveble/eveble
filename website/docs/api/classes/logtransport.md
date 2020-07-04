---
id: "logtransport"
title: "LogTransport"
sidebar_label: "LogTransport"
---

## Hierarchy

* [RFC5424LoggingMixin](rfc5424loggingmixin.md)

* RFC5424LoggingMixin

  ↳ **LogTransport**

  ↳ [ConsoleTransport](consoletransport.md)

## Index

### Constructors

* [constructor](logtransport.md#constructor)

### Properties

* [client](logtransport.md#client)
* [config](logtransport.md#optional-readonly-config)
* [level](logtransport.md#readonly-level)
* [logger](logtransport.md#logger)

### Methods

* [alert](logtransport.md#alert)
* [crit](logtransport.md#crit)
* [debug](logtransport.md#debug)
* [emerg](logtransport.md#emerg)
* [error](logtransport.md#error)
* [info](logtransport.md#info)
* [initialize](logtransport.md#initialize)
* [isLoggable](logtransport.md#isloggable)
* [log](logtransport.md#log)
* [notice](logtransport.md#notice)
* [warning](logtransport.md#warning)

## Constructors

###  constructor

\+ **new LogTransport**(`level`: [LogLevel](../modules/types.md#loglevel), `config?`: [LogTransportConfig](logtransportconfig.md)): *[LogTransport](logtransport.md)*

Creates a LogTransport.
Creates a LogTransport.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) | Level for which logging will only allowed(less than or equal to this level). |
`config?` | [LogTransportConfig](logtransportconfig.md) | `LogTransportConfig` instance.  |

**Returns:** *[LogTransport](logtransport.md)*

## Properties

###  client

• **client**: *any*

___

### `Optional` `Readonly` config

• **config**? : *LogTransportConfig*

___

### `Readonly` level

• **level**: *[LogLevel](../modules/types.md#loglevel)*

___

###  logger

• **logger**: *Logger*

## Methods

###  alert

▸ **alert**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

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

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[error](rfc5424loggingmixin.md#error)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  info

▸ **info**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

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

Initializes LogTransport.

**Returns:** *void*

___

###  isLoggable

▸ **isLoggable**(`level`: [LogLevel](../modules/types.md#loglevel)): *boolean*

Evaluates if actual logged level is loggable on transport.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) | Log's level name. |

**Returns:** *boolean*

Returns true if log is loggable on transport, else false.

___

###  log

▸ **log**(`level`: [LogLevel](../modules/types.md#loglevel), `entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Overrides [RFC5424LoggingMixin](rfc5424loggingmixin.md).[log](rfc5424loggingmixin.md#log)*

Logs entry with level.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) | Logging level for entry. |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or implementation of `LogEntry` instance. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  notice

▸ **notice**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

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

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[warning](rfc5424loggingmixin.md#warning)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*
