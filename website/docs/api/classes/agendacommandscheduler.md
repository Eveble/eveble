---
id: "agendacommandscheduler"
title: "AgendaCommandScheduler"
sidebar_label: "AgendaCommandScheduler"
---

## Hierarchy

* [StatefulMixin](statefulmixin.md)

* StatefulMixin

  ↳ **AgendaCommandScheduler**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [CommandScheduler](../interfaces/types.commandscheduler.md)
* Stateful
* CommandScheduler

## Index

### Constructors

* [constructor](agendacommandscheduler.md#constructor)

### Properties

* [agendaClient](agendacommandscheduler.md#readonly-agendaclient)
* [jobName](agendacommandscheduler.md#readonly-jobname)
* [options](agendacommandscheduler.md#optional-readonly-options)
* [state](agendacommandscheduler.md#state)

### Methods

* [getInterval](agendacommandscheduler.md#getinterval)
* [getJob](agendacommandscheduler.md#getjob)
* [getSelectableStates](agendacommandscheduler.md#getselectablestates)
* [getState](agendacommandscheduler.md#getstate)
* [handleScheduledCommand](agendacommandscheduler.md#handlescheduledcommand)
* [hasState](agendacommandscheduler.md#hasstate)
* [initialize](agendacommandscheduler.md#initialize)
* [isInOneOfStates](agendacommandscheduler.md#isinoneofstates)
* [isInState](agendacommandscheduler.md#isinstate)
* [schedule](agendacommandscheduler.md#schedule)
* [setState](agendacommandscheduler.md#setstate)
* [startScheduling](agendacommandscheduler.md#startscheduling)
* [stopScheduling](agendacommandscheduler.md#stopscheduling)
* [unschedule](agendacommandscheduler.md#unschedule)
* [unscheduleAll](agendacommandscheduler.md#unscheduleall)
* [validateState](agendacommandscheduler.md#validatestate)

### Object literals

* [STATES](agendacommandscheduler.md#static-states)

## Constructors

###  constructor

\+ **new AgendaCommandScheduler**(`jobName?`: string, `options?`: AgendaConfiguration): *[AgendaCommandScheduler](agendacommandscheduler.md)*

Creates an instance of AgendaCommandScheduler.
Creates an instance of AgendaCommandScheduler.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`jobName?` | string | Name of the job that is being scheduled on Agenda. |
`options?` | AgendaConfiguration | Optional options passed to Agenda client.  |

**Returns:** *[AgendaCommandScheduler](agendacommandscheduler.md)*

## Properties

### `Readonly` agendaClient

• **agendaClient**: *AgendaClient*

___

### `Readonly` jobName

• **jobName**: *string*

___

### `Optional` `Readonly` options

• **options**? : *AgendaConfiguration*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md).[state](../interfaces/types.commandscheduler.md#state)*

*Overrides [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

## Methods

###  getInterval

▸ **getInterval**(): *number*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

Returns frequency at which schedule will query looking for scheduled commands that need to
be processed.

**Returns:** *number*

Interval for query frequency as a `number`, else `undefined`.

___

###  getJob

▸ **getJob**(`commandType`: string, `assignerId`: string | [Guid](guid.md), `assignerType`: string, `assignmentId?`: string | [Guid](guid.md)): *Promise‹[ScheduledJob](../interfaces/types.scheduledjob.md) | undefined›*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

Returns ScheduledJob if it can be found on `Scheduler`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commandType` | string | Command type name for which schedule was made. |
`assignerId` | string &#124; [Guid](guid.md) | Source of scheduled job i.e. Event Sourceable's identifier. |
`assignerType` | string | Event Sourceable type name. |
`assignmentId?` | string &#124; [Guid](guid.md) | Assignment identifier. |

**Returns:** *Promise‹[ScheduledJob](../interfaces/types.scheduledjob.md) | undefined›*

Instance implementing `ScheduledJob` interface, else `undefined`.

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  handleScheduledCommand

▸ **handleScheduledCommand**(`job`: Agenda.Job): *Promise‹void›*

Agenda job handler for ScheduledCommand.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`job` | Agenda.Job | Instance implementing `Agenda.Job` interface.  |

**Returns:** *Promise‹void›*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

Initializes Agenda command scheduler.

**`async`** 

**`throws`** {InactiveClientError}
Thrown if agenda client is not connected.

**Returns:** *Promise‹void›*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInOneOfStates](statefulmixin.md#isinoneofstates)*

*Overrides [Task](task.md).[isInOneOfStates](task.md#isinoneofstates)*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  schedule

▸ **schedule**(`scheduleCommand`: [ScheduleCommand](schedulecommand.md)): *Promise‹void›*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

Schedules command with Agenda.

**`async`** 

**`throws`** {CommandSchedulingError}
Thrown if scheduled command cannot be scheduled.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scheduleCommand` | [ScheduleCommand](schedulecommand.md) | Instance of `ScheduleCommand`. |

**Returns:** *Promise‹void›*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  startScheduling

▸ **startScheduling**(): *Promise‹void›*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

Starts processing on CommandScheduler.

**Returns:** *Promise‹void›*

___

###  stopScheduling

▸ **stopScheduling**(): *Promise‹void›*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

Stops processing on CommandScheduler.

**Returns:** *Promise‹void›*

___

###  unschedule

▸ **unschedule**(`unscheduleCommand`: [UnscheduleCommand](unschedulecommand.md)): *Promise‹boolean›*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

Unschedules command from Agenda.

**`async`** 

**`throws`** {CommandUnschedulingError}
Thrown if scheduled command cannot be cancelled.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`unscheduleCommand` | [UnscheduleCommand](unschedulecommand.md) | Instance of `UnscheduleCommand`. |

**Returns:** *Promise‹boolean›*

___

###  unscheduleAll

▸ **unscheduleAll**(): *Promise‹void›*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

Unschedules all commands(jobs matching scheduler's job name) from Agenda.

**`async`** 

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [CommandScheduler](../interfaces/types.commandscheduler.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](extendableerror.md#static-error) |

**Returns:** *boolean*

## Object literals

### `Static` STATES

### ▪ **STATES**: *object*

###  active

• **active**: *string* = "active"

###  constructed

• **constructed**: *string* = "constructed"

###  initialized

• **initialized**: *string* = "initialized"

###  stopped

• **stopped**: *string* = "stopped"
