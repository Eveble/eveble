---
id: "types.commandscheduler"
title: "@eveble/eveble"
sidebar_label: "CommandScheduler"
---

## Hierarchy

* [Stateful](types.stateful.md)

* Stateful

  ↳ **CommandScheduler**

## Implemented by

* [AgendaCommandScheduler](../classes/agendacommandscheduler.md)

## Index

### Properties

* [state](types.commandscheduler.md#state)

### Methods

* [getInterval](types.commandscheduler.md#getinterval)
* [getJob](types.commandscheduler.md#getjob)
* [getSelectableStates](types.commandscheduler.md#getselectablestates)
* [getState](types.commandscheduler.md#getstate)
* [hasState](types.commandscheduler.md#hasstate)
* [initialize](types.commandscheduler.md#initialize)
* [isInOneOfStates](types.commandscheduler.md#isinoneofstates)
* [isInState](types.commandscheduler.md#isinstate)
* [schedule](types.commandscheduler.md#schedule)
* [setState](types.commandscheduler.md#setstate)
* [startScheduling](types.commandscheduler.md#startscheduling)
* [stopScheduling](types.commandscheduler.md#stopscheduling)
* [unschedule](types.commandscheduler.md#unschedule)
* [unscheduleAll](types.commandscheduler.md#unscheduleall)
* [validateState](types.commandscheduler.md#validatestate)

## Properties

###  state

• **state**: *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[state](types.stateful.md#state)*

*Overrides void*

## Methods

###  getInterval

▸ **getInterval**(): *number*

**Returns:** *number*

▸ **getInterval**(): *number*

**Returns:** *number*

___

###  getJob

▸ **getJob**(`commandType`: string, `assignerId`: string | [Stringifiable](types.stringifiable.md), `assignerType`: string, `assignmentId?`: string | [Stringifiable](types.stringifiable.md)): *Promise‹[ScheduledJob](types.scheduledjob.md) | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`commandType` | string |
`assignerId` | string &#124; [Stringifiable](types.stringifiable.md) |
`assignerType` | string |
`assignmentId?` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *Promise‹[ScheduledJob](types.scheduledjob.md) | undefined›*

▸ **getJob**(`commandType`: string, `assignerId`: string | Stringifiable, `assignerType`: string, `assignmentId?`: string | Stringifiable): *Promise‹ScheduledJob | undefined›*

**Parameters:**

Name | Type |
------ | ------ |
`commandType` | string |
`assignerId` | string &#124; Stringifiable |
`assignerType` | string |
`assignmentId?` | string &#124; Stringifiable |

**Returns:** *Promise‹ScheduledJob | undefined›*

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Inherited from [Stateful](types.stateful.md).[getSelectableStates](types.stateful.md#getselectablestates)*

*Overrides void*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[getState](types.stateful.md#getstate)*

*Overrides void*

**Returns:** *[State](../modules/types.md#state)*

___

###  hasState

▸ **hasState**(): *boolean*

*Inherited from [Stateful](types.stateful.md).[hasState](types.stateful.md#hasstate)*

*Overrides void*

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **initialize**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Stateful](types.stateful.md).[isInOneOfStates](types.stateful.md#isinoneofstates)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Stateful](types.stateful.md).[isInState](types.stateful.md#isinstate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  schedule

▸ **schedule**(`scheduleCommand`: [ScheduleCommand](types.schedulecommand.md)): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`scheduleCommand` | [ScheduleCommand](types.schedulecommand.md) |

**Returns:** *Promise‹void›*

▸ **schedule**(`scheduleCommand`: ScheduleCommand): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`scheduleCommand` | ScheduleCommand |

**Returns:** *Promise‹void›*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Inherited from [Stateful](types.stateful.md).[setState](types.stateful.md#setstate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  startScheduling

▸ **startScheduling**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **startScheduling**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  stopScheduling

▸ **stopScheduling**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **stopScheduling**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  unschedule

▸ **unschedule**(`unscheduleCommand`: [UnscheduleCommand](types.unschedulecommand.md)): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`unscheduleCommand` | [UnscheduleCommand](types.unschedulecommand.md) |

**Returns:** *Promise‹boolean›*

▸ **unschedule**(`unscheduleCommand`: UnscheduleCommand): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`unscheduleCommand` | UnscheduleCommand |

**Returns:** *Promise‹boolean›*

___

###  unscheduleAll

▸ **unscheduleAll**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **unscheduleAll**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Inherited from [Stateful](types.stateful.md).[validateState](types.stateful.md#validatestate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*
