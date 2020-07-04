---
id: "productivityestimation"
title: "ProductivityEstimation"
sidebar_label: "ProductivityEstimation"
---

## Type parameters

▪ **T**: *SuperConstructor*

## Hierarchy

* Process

  ↳ **ProductivityEstimation**

## Implements

* Controller
* Stateful
* Definable
* Hookable
* Ejsonable
* Statusful
* Entity
* EventSourceable

## Index

### Constructors

* [constructor](productivityestimation.md#constructor)

### Properties

* [[COMMANDS_KEY]](productivityestimation.md#[commands_key])
* [[EVENTS_KEY]](productivityestimation.md#[events_key])
* [employeeId](productivityestimation.md#employeeid)
* [estimatedPoints](productivityestimation.md#estimatedpoints)
* [id](productivityestimation.md#id)
* [metadata](productivityestimation.md#optional-metadata)
* [schemaVersion](productivityestimation.md#optional-schemaversion)
* [state](productivityestimation.md#state)
* [status](productivityestimation.md#status)
* [taskId](productivityestimation.md#taskid)
* [version](productivityestimation.md#version)
* [correlationKey](productivityestimation.md#static-optional-correlationkey)

### Accessors

* [ableTo](productivityestimation.md#ableto)
* [can](productivityestimation.md#can)
* [ensure](productivityestimation.md#ensure)
* [is](productivityestimation.md#is)

### Methods

* [DomainException](productivityestimation.md#domainexception)
* [EmployeeProductivityEstimated](productivityestimation.md#employeeproductivityestimated)
* [ProductivityEstimationCompleted](productivityestimation.md#productivityestimationcompleted)
* [ProductivityEstimationFailed](productivityestimation.md#productivityestimationfailed)
* [ProductivityEstimationInitiated](productivityestimation.md#productivityestimationinitiated)
* [TaskCompleted](productivityestimation.md#taskcompleted)
* [[ROLLBACK_STATE_METHOD_KEY]](productivityestimation.md#[rollback_state_method_key])
* [[SAVE_STATE_METHOD_KEY]](productivityestimation.md#[save_state_method_key])
* [assignMetadata](productivityestimation.md#assignmetadata)
* [ensureHandleability](productivityestimation.md#ensurehandleability)
* [equals](productivityestimation.md#equals)
* [eventProps](productivityestimation.md#eventprops)
* [getActions](productivityestimation.md#getactions)
* [getCommands](productivityestimation.md#getcommands)
* [getCorrelationKey](productivityestimation.md#getcorrelationkey)
* [getEvents](productivityestimation.md#getevents)
* [getHandleableTypes](productivityestimation.md#gethandleabletypes)
* [getHandled](productivityestimation.md#gethandled)
* [getHandledCommands](productivityestimation.md#gethandledcommands)
* [getHandledEvents](productivityestimation.md#gethandledevents)
* [getHandledMessages](productivityestimation.md#gethandledmessages)
* [getHandledTypes](productivityestimation.md#gethandledtypes)
* [getHandledTypesNames](productivityestimation.md#gethandledtypesnames)
* [getHandler](productivityestimation.md#gethandler)
* [getHandlerOrThrow](productivityestimation.md#gethandlerorthrow)
* [getHandlers](productivityestimation.md#gethandlers)
* [getHook](productivityestimation.md#gethook)
* [getHookOrThrow](productivityestimation.md#gethookorthrow)
* [getHooks](productivityestimation.md#gethooks)
* [getId](productivityestimation.md#getid)
* [getLegacyTransformer](productivityestimation.md#getlegacytransformer)
* [getLegacyTransformers](productivityestimation.md#getlegacytransformers)
* [getPropTypes](productivityestimation.md#getproptypes)
* [getPropertyInitializers](productivityestimation.md#getpropertyinitializers)
* [getSchemaVersion](productivityestimation.md#getschemaversion)
* [getSelectableStates](productivityestimation.md#getselectablestates)
* [getSelectableStatuses](productivityestimation.md#getselectablestatuses)
* [getState](productivityestimation.md#getstate)
* [getStatus](productivityestimation.md#getstatus)
* [getTypeByHandler](productivityestimation.md#gettypebyhandler)
* [getTypeName](productivityestimation.md#gettypename)
* [getVersion](productivityestimation.md#getversion)
* [handle](productivityestimation.md#handle)
* [handles](productivityestimation.md#handles)
* [hasAction](productivityestimation.md#hasaction)
* [hasHandler](productivityestimation.md#hashandler)
* [hasHook](productivityestimation.md#hashook)
* [hasLegacyTransformer](productivityestimation.md#haslegacytransformer)
* [hasState](productivityestimation.md#hasstate)
* [hasStatus](productivityestimation.md#hasstatus)
* [in](productivityestimation.md#in)
* [incrementVersion](productivityestimation.md#incrementversion)
* [initialize](productivityestimation.md#initialize)
* [isHandleabe](productivityestimation.md#ishandleabe)
* [isInOneOfStates](productivityestimation.md#isinoneofstates)
* [isInOneOfStatuses](productivityestimation.md#isinoneofstatuses)
* [isInState](productivityestimation.md#isinstate)
* [isInStatus](productivityestimation.md#isinstatus)
* [isStateSaved](productivityestimation.md#isstatesaved)
* [on](productivityestimation.md#on)
* [overrideHandler](productivityestimation.md#overridehandler)
* [overrideHook](productivityestimation.md#overridehook)
* [overrideLegacyTransformer](productivityestimation.md#overridelegacytransformer)
* [pickEventProps](productivityestimation.md#pickeventprops)
* [processSerializableList](productivityestimation.md#processserializablelist)
* [record](productivityestimation.md#record)
* [registerHandler](productivityestimation.md#registerhandler)
* [registerHook](productivityestimation.md#registerhook)
* [registerLegacyTransformer](productivityestimation.md#registerlegacytransformer)
* [removeHandler](productivityestimation.md#removehandler)
* [removeHook](productivityestimation.md#removehook)
* [replay](productivityestimation.md#replay)
* [replayHistory](productivityestimation.md#replayhistory)
* [schedule](productivityestimation.md#schedule)
* [setHandleableTypes](productivityestimation.md#sethandleabletypes)
* [setState](productivityestimation.md#setstate)
* [setStatus](productivityestimation.md#setstatus)
* [setVersion](productivityestimation.md#setversion)
* [subscribes](productivityestimation.md#subscribes)
* [toJSONValue](productivityestimation.md#tojsonvalue)
* [toPlainObject](productivityestimation.md#toplainobject)
* [toString](productivityestimation.md#tostring)
* [transformLegacyProps](productivityestimation.md#transformlegacyprops)
* [trigger](productivityestimation.md#trigger)
* [typeName](productivityestimation.md#typename)
* [unschedule](productivityestimation.md#unschedule)
* [validateProps](productivityestimation.md#validateprops)
* [validateState](productivityestimation.md#validatestate)
* [validateStatus](productivityestimation.md#validatestatus)
* [disableSerializableLists](productivityestimation.md#static-disableserializablelists)
* [enableSerializableLists](productivityestimation.md#static-enableserializablelists)
* [from](productivityestimation.md#static-from)
* [getCorrelationKey](productivityestimation.md#static-getcorrelationkey)
* [getPropTypes](productivityestimation.md#static-getproptypes)
* [getPropertyInitializers](productivityestimation.md#static-getpropertyinitializers)
* [getTypeName](productivityestimation.md#static-gettypename)
* [resolveInitializingMessage](productivityestimation.md#static-resolveinitializingmessage)
* [resolveRoutedCommands](productivityestimation.md#static-resolveroutedcommands)
* [resolveRoutedEvents](productivityestimation.md#static-resolveroutedevents)
* [resolveRoutedMessages](productivityestimation.md#static-resolveroutedmessages)
* [setCorrelationKey](productivityestimation.md#static-setcorrelationkey)
* [toString](productivityestimation.md#static-tostring)
* [typeName](productivityestimation.md#static-typename)

### Object literals

* [STATES](productivityestimation.md#static-states)

## Constructors

###  constructor

\+ **new ProductivityEstimation**(`arg`: History | Command | Event | [Props](../modules/types.md#props)): *[ProductivityEstimation](productivityestimation.md)*

*Inherited from [CancelingEmployment](cancelingemployment.md).[constructor](cancelingemployment.md#constructor)*

*Overrides void*

Creates an instance of `Process`.
**Flows**:
1. **Replay History** - `Process` is recreated from `History` instance - list  of `Events`(manual initialization and replay is required before running Aggregate.prototype.replayHistory!).
2. **Command|Event** - `Command` or `Event` instance is passed as initializing message and `Process` has assigned id from it.
3. **Properties** - `Process` is deserialized, so props as object are passed.

**`example`** 
```ts
new Process(
 new History([
   new Event({targetId: 'my-id', key: 'value'})
 ])
);
new Process(new Command({targetId: 'my-id', key: 'value'}));
new Process(new Event({targetId: 'my-id', key: 'value'}));
new Process({id: 'my-id'}); // 3
new Process({id: 'my-id', key: 'value'}); // 3
```

**`throws`** {InvalidInitializingMessageError}
Thrown if provided initializing message is not instance of `Command` or `Event`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | History &#124; Command &#124; Event &#124; [Props](../modules/types.md#props) | Instance of: `History`, `Command`, `Event` or properties. |

**Returns:** *[ProductivityEstimation](productivityestimation.md)*

## Properties

###  [COMMANDS_KEY]

• **[COMMANDS_KEY]**: *Command[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[[COMMANDS_KEY]](cancelingemployment.md#[commands_key])*

*Overrides void*

___

###  [EVENTS_KEY]

• **[EVENTS_KEY]**: *Event[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[[EVENTS_KEY]](cancelingemployment.md#[events_key])*

*Overrides void*

___

###  employeeId

• **employeeId**: *Guid*

___

###  estimatedPoints

• **estimatedPoints**: *number*

___

###  id

• **id**: *string | Guid*

*Inherited from [CancelingEmployment](cancelingemployment.md).[id](cancelingemployment.md#id)*

*Overrides void*

___

### `Optional` metadata

• **metadata**? : *Record‹string, any›*

*Inherited from [CancelingEmployment](cancelingemployment.md).[metadata](cancelingemployment.md#optional-metadata)*

*Overrides void*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Inherited from [CancelingEmployment](cancelingemployment.md).[schemaVersion](cancelingemployment.md#optional-schemaversion)*

*Overrides void*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Inherited from [CancelingEmployment](cancelingemployment.md).[state](cancelingemployment.md#state)*

*Overrides void*

___

###  status

• **status**: *[Status](../modules/types.md#status)*

*Inherited from [CancelingEmployment](cancelingemployment.md).[status](cancelingemployment.md#status)*

*Overrides void*

___

###  taskId

• **taskId**: *Guid*

___

###  version

• **version**: *number*

*Inherited from [CancelingEmployment](cancelingemployment.md).[version](cancelingemployment.md#version)*

*Overrides void*

___

### `Static` `Optional` correlationKey

▪ **correlationKey**? : *string*

*Inherited from [CancelingEmployment](cancelingemployment.md).[correlationKey](cancelingemployment.md#static-optional-correlationkey)*

## Accessors

###  ableTo

• **get ableTo**(): *this*

*Inherited from [Task](task.md).[ableTo](task.md#ableto)*

Method to enforce TypeScript compliance with `Asserter` and `AbilityAssertion`.

**Returns:** *this*

___

###  can

• **get can**(): *any*

*Inherited from [Task](task.md).[can](task.md#can)*

Evaluates if action can be taken on `Entity`.
Prior to invocation of any non-assertion methods snapshot of current state
is done - that will be automatically rollbacked after method execution.
Proxified instance wraps the executed method and ensures that boolean is
returned as result indicating if method indeed can be executed(`true`) - or
fail with thrown error(`false`)

**Returns:** *any*

Proxified instance of `Entity`.

___

###  ensure

• **get ensure**(): *this & object*

*Inherited from [Task](task.md).[ensure](task.md#ensure)*

Exposes the `ensure` BDD assertion for `Entity`.

**`remarks`** 
The `entity.ensure` getter-method will return a Proxified instance of the
`Entity`. This proxified instance listens to all get methods and
catches the requested method name.

If the requested get method/property name matches exactly or partially
one of registered apis on `Asserter`(like: `is`) it returns associated
object assigned to that assertion. Like for example - for registered
`AbilityAssertion`, calling entity with:
```ts
entity.ensure.is
```
Will result with returned object:
```ts
{ableTo: ...}
```
That can be called like:
```ts
entity.ensure.is.ableTo.doAction(...)
```
Same rules of behavior will apply to other assertions like:
`StatefulAssertion`, `StatusfulAssertion`.

However, since we want to enable an expressive apis on Entities - we allow
users to defined thier own apis. By calling:
```ts
entity.ensure.myMethod()
```
A backup of the entity state will be created that will be rollbacked directly * after the invocation of the method(and that will happen automatically)
(it behaves exactly like `ensure.is.ableTo` assertion from `AbilityAssertion`)

This allows for evaluation of state change on command handlers directly
without writing unnecessary duplicated code that would ensure that
state indeed can be changed(first method) and then actually change
it(second method).

**Returns:** *this & object*

Proxified instance of `Entity`.

___

###  is

• **get is**(): *this & object*

*Inherited from [Task](task.md).[is](task.md#is)*

Method to enforce TypeScript compliance with `Asserter` and `AbilityAssertion`.

**Returns:** *this & object*

## Methods

###  DomainException

▸ **DomainException**(`exception`: DomainException): *void*

**Parameters:**

Name | Type |
------ | ------ |
`exception` | DomainException |

**Returns:** *void*

___

###  EmployeeProductivityEstimated

▸ **EmployeeProductivityEstimated**(`_event`: [EmployeeProductivityEstimated](employeeproductivityestimated.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_event` | [EmployeeProductivityEstimated](employeeproductivityestimated.md) |

**Returns:** *void*

___

###  ProductivityEstimationCompleted

▸ **ProductivityEstimationCompleted**(`_event`: [ProductivityEstimationCompleted](productivityestimationcompleted.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_event` | [ProductivityEstimationCompleted](productivityestimationcompleted.md) |

**Returns:** *void*

___

###  ProductivityEstimationFailed

▸ **ProductivityEstimationFailed**(`_event`: [ProductivityEstimationFailed](productivityestimationfailed.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`_event` | [ProductivityEstimationFailed](productivityestimationfailed.md) |

**Returns:** *void*

___

###  ProductivityEstimationInitiated

▸ **ProductivityEstimationInitiated**(`event`: [ProductivityEstimationInitiated](productivityestimationinitiated.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [ProductivityEstimationInitiated](productivityestimationinitiated.md) |

**Returns:** *void*

___

###  TaskCompleted

▸ **TaskCompleted**(`event`: [TaskCompleted](taskcompleted.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [TaskCompleted](taskcompleted.md) |

**Returns:** *void*

___

###  [ROLLBACK_STATE_METHOD_KEY]

▸ **[ROLLBACK_STATE_METHOD_KEY]**(): *void*

*Inherited from [Task](task.md).[[ROLLBACK_STATE_METHOD_KEY]](task.md#[rollback_state_method_key])*

Rollbacks entity to previous state.

**`throws`** {SavedStateNotFoundError}
Thrown if rollback is done on `Entity` without prior saved state.

**Returns:** *void*

___

###  [SAVE_STATE_METHOD_KEY]

▸ **[SAVE_STATE_METHOD_KEY]**(): *void*

*Inherited from [Task](task.md).[[SAVE_STATE_METHOD_KEY]](task.md#[save_state_method_key])*

Saves current entity state.

**Returns:** *void*

___

###  assignMetadata

▸ **assignMetadata**(`metadata`: Record‹string, any›): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[assignMetadata](cancelingemployment.md#assignmetadata)*

Attaches metadata to `EventSourceable`.

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | Record‹string, any› |

**Returns:** *void*

___

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: MessageType‹Message›, `handleableTypes`: MessageType‹Message› | MessageType‹Message›[]): *boolean*

*Inherited from [CancelingEmployment](cancelingemployment.md).[ensureHandleability](cancelingemployment.md#ensurehandleability)*

Ensures that provided type can be handled by verifying it against handleable types.

**`throws`** {UnhandleableTypeError}
Thrown if message type is not one of handleable types.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`messageType` | MessageType‹Message› | - | Type implementing `MessageableType` interface. |
`handleableTypes` | MessageType‹Message› &#124; MessageType‹Message›[] | this.getHandleableTypes() | Optional handleable types to be verified against on runtime. |

**Returns:** *boolean*

Returns true if `type` is handleable, else `false`.

___

###  equals

▸ **equals**(`otherEntity`: Entity): *boolean*

*Inherited from [Task](task.md).[equals](task.md#equals)*

*Overrides [CreateEmployee](createemployee.md).[equals](createemployee.md#equals)*

Evaluates if one entity is equal to other by its constructor and identifier.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`otherEntity` | Entity | Other `Entity` instance. |

**Returns:** *boolean*

Returns `true` if both Entities instances are equal, else `false`.

___

###  eventProps

▸ **eventProps**(): *Record‹keyof any, any›*

*Inherited from [CancelingEmployment](cancelingemployment.md).[eventProps](cancelingemployment.md#eventprops)*

Picks base properties(`sourceId` & `version`) for new `Event` instance.

**`example`** 
```ts
this.record(new MyEvent({
  ...this.eventProps(),
  customerName: command.customerName,
}));
```

**Returns:** *Record‹keyof any, any›*

Returns properties for `Event` instance.

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Inherited from [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

Returns a collection of all available actions with matching registered hooks as nested collection.

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

Collection of actions(key) with matching registered hooks as nested collection(value).

___

###  getCommands

▸ **getCommands**(): *Command[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getCommands](cancelingemployment.md#getcommands)*

Returns triggered commands on `EventSourceable`.

**Returns:** *Command[]*

List of recorded `Commands`.

___

###  getCorrelationKey

▸ **getCorrelationKey**(): *string*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getCorrelationKey](cancelingemployment.md#static-getcorrelationkey)*

Returns correlation key for `Process`.

**Returns:** *string*

Custom predefined correlation key or `Process` type name.

___

###  getEvents

▸ **getEvents**(): *Event[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getEvents](cancelingemployment.md#getevents)*

Returns recorded events on `EventSourceable`.

**Returns:** *Event[]*

List of recorded `Events`.

___

###  getHandleableTypes

▸ **getHandleableTypes**(): *MessageType‹Message›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandleableTypes](cancelingemployment.md#gethandleabletypes)*

Returns handleable message types.

**Returns:** *MessageType‹Message›[]*

Returns handleable message types as a list with message types.

___

###  getHandled

▸ **getHandled**(`messageType`: MessageType‹Message›): *MessageType‹Message›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandled](cancelingemployment.md#gethandled)*

Returns all message types that matches evaluated one by equal constructor or subclassing.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | MessageType‹Message› | Type implementing `MessageableType` interface. |

**Returns:** *MessageType‹Message›[]*

List of all handled types matching evaluated one.

___

###  getHandledCommands

▸ **getHandledCommands**(): *MessageType‹Command›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandledCommands](cancelingemployment.md#gethandledcommands)*

Returns all commands that can be handled.

**Returns:** *MessageType‹Command›[]*

List of all handled types matching `Command`.

___

###  getHandledEvents

▸ **getHandledEvents**(): *MessageType‹Event›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandledEvents](cancelingemployment.md#gethandledevents)*

Returns all commands that can be handled.

**Returns:** *MessageType‹Event›[]*

List of all handled types matching `Event`.

___

###  getHandledMessages

▸ **getHandledMessages**(): *MessageType‹Message›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandledMessages](cancelingemployment.md#gethandledmessages)*

Returns all messages that can be handled.

**Returns:** *MessageType‹Message›[]*

List of all handled types matching `Message`.

___

###  getHandledTypes

▸ **getHandledTypes**(): *MessageType‹Message›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandledTypes](cancelingemployment.md#gethandledtypes)*

Returns all handled message types.

**Returns:** *MessageType‹Message›[]*

List of all handled message types.

___

###  getHandledTypesNames

▸ **getHandledTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandledTypesNames](cancelingemployment.md#gethandledtypesnames)*

Returns all type names that can be handled.

**Returns:** *[TypeName](../modules/types.md#typename)[]*

List of all handled type names

___

###  getHandler

▸ **getHandler**(`messageType`: MessageType‹Message›): *[Handler](../modules/types.md#handler) | undefined*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandler](cancelingemployment.md#gethandler)*

Returns handler for message type.

**`throws`** {InvalidMessageableType}
Thrown if the message type argument is not implementing `Messageable` interface.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | MessageType‹Message› | Type implementing `MessageableType` interface. |

**Returns:** *[Handler](../modules/types.md#handler) | undefined*

Handler as a function if found, else `undefined`.

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: MessageType‹Message›): *[Handler](../modules/types.md#handler)*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandlerOrThrow](cancelingemployment.md#gethandlerorthrow)*

Return handler for message type or throws error if not found.

**`throws`** {HandlerNotFoundError}
Thrown if handler for message type is not found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | MessageType‹Message› | Type implementing `MessageableType` interface. |

**Returns:** *[Handler](../modules/types.md#handler)*

Handler as a function if found, else throws.

___

###  getHandlers

▸ **getHandlers**(): *Map‹MessageType‹Message›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getHandlers](cancelingemployment.md#gethandlers)*

Returns all available handler mappings.

**Returns:** *Map‹MessageType‹Message›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

Returns mappings of all available handlers by message type: handler(s) relation.

___

###  getHook

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

*Inherited from [CreateEmployee](createemployee.md).[getHook](createemployee.md#gethook)*

Returns hook for action and id.

**`example`** 
```ts
class MyClass extends HookableMixin {}

const hook = sinon.spy();
MyClass.prototype.registerHook('onConstruction', 'my-hook', hook);

expect(MyClass.prototype.getHook('onConstruction', 'my-hook')).to.be.equal(hook);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hook is resolved. |
`id` | string | Identifier under which hook was was registered. |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

Hook as a `function` matching declaration, else `undefined`.

___

###  getHookOrThrow

▸ **getHookOrThrow**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook)*

*Inherited from [CreateEmployee](createemployee.md).[getHookOrThrow](createemployee.md#gethookorthrow)*

Returns hook for action and id or throws.

**`throws`** {HandlerNotFoundError}
Thrown if there is no hook registered for action with id.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hook is resolved. |
`id` | string | Identifier under which hook was was registered. |

**Returns:** *[Hook](../modules/types.md#hook)*

Hook as a `function` matching declaration, else throws.

___

###  getHooks

▸ **getHooks**(`action`: string): *[Mappings](../modules/types.hooks.md#mappings)*

*Inherited from [CreateEmployee](createemployee.md).[getHooks](createemployee.md#gethooks)*

Returns a collection of all available hooks registered for action.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hooks are resolved. |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

Collection of hooks.

___

###  getId

▸ **getId**(): *string | Guid*

*Inherited from [Task](task.md).[getId](task.md#getid)*

Returns identifier for Entity.

**Returns:** *string | Guid*

Entities identifier as `Guid` instance or string.

___

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Inherited from [CreateEmployee](createemployee.md).[getLegacyTransformer](createemployee.md#getlegacytransformer)*

Returns legacy transformer for schema version.

**`throws`** {LegacyTransformerNotFoundError}
Thrown if transformer for schema version can't be found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemaVersion` | number | Schema version. |

**Returns:** *[Hook](../modules/types.md#hook)*

Legacy transformer for schema version.

___

###  getLegacyTransformers

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

*Inherited from [CreateEmployee](createemployee.md).[getLegacyTransformers](createemployee.md#getlegacytransformers)*

Returns all available legacy transformers.

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

Map instance of all registered legacy transformers with number version as a key and transformer function as a value.

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Inherited from [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

Returns class properties types from whole inheritance tree.

**`example`** 
```ts
@define()
class MyClass extends DefinableMixin {
  stringKey: string

  constructor(props: Record<keyof any, any>) {
    super()
    Object.assign(this, props);
  }
}

expect(new MyClass({stringKey: 'my-string'}).getPropTypes()).to.be.eql({
  stringKey: PropTypes.instanceOf(String)
})
```

**Returns:** *[Props](../modules/types.md#props)*

Plain object representation of properties types.

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

Returns default values metadata from property initializers conversion for whole
inheritance tree.

**`example`** 
```ts
@define()
class MyClass extends Struct {
  stringKey = 'my-string';

  numberKey = 1337;

  constructor(props: Partial<MyClass>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

expect(new MyClass().getPropertyInitializers()).to.be.eql({
  stringKey: 'my-string',
  numberKey: 1337
})
```

**Returns:** *[Props](../modules/types.md#props)*

Default values for properties.

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Inherited from [CreateEmployee](createemployee.md).[getSchemaVersion](createemployee.md#getschemaversion)*

Returns current instance schema version.

**Returns:** *number | undefined*

Schema version as a number, else `undefined`.

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Inherited from [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

Returns all selectable states.

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

Collection of available states.

___

###  getSelectableStatuses

▸ **getSelectableStatuses**(): *Record‹string, [Status](../modules/types.md#status)›*

*Inherited from [Task](task.md).[getSelectableStatuses](task.md#getselectablestatuses)*

Returns all selectable status.

**Returns:** *Record‹string, [Status](../modules/types.md#status)›*

Collection of available status.

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Inherited from [Task](task.md).[getState](task.md#getstate)*

Returns current state of instance.

**Returns:** *[State](../modules/types.md#state)*

Current state of instance as `string`.

___

###  getStatus

▸ **getStatus**(): *[Status](../modules/types.md#status)*

*Inherited from [Task](task.md).[getStatus](task.md#getstatus)*

Returns current status of instance.

**Returns:** *[Status](../modules/types.md#status)*

Current status of instance as `string`.

___

###  getTypeByHandler

▸ **getTypeByHandler**(`handlerReference`: [Handler](../modules/types.md#handler)): *any | undefined*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getTypeByHandler](cancelingemployment.md#gettypebyhandler)*

Resolves message type by handler reference.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`handlerReference` | [Handler](../modules/types.md#handler) | Reference to handler function. |

**Returns:** *any | undefined*

Message type if handler is matching one of handlers on class, else `undefined`.

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [CreateEmployee](createemployee.md).[getTypeName](createemployee.md#gettypename)*

Returns definable type name.

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

___

###  getVersion

▸ **getVersion**(): *number*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getVersion](cancelingemployment.md#getversion)*

Returns current version of `EventSourceable`.

**Returns:** *number*

Current number version of instance.

___

###  handle

▸ **handle**(`message`: Command | Event): *Promise‹any›*

*Inherited from [CancelingEmployment](cancelingemployment.md).[handle](cancelingemployment.md#handle)*

*Overrides void*

Handles message.

**`async`** 

**`throws`** {HandlerNotFoundError}
Thrown if handler for type is not found.

**Parameters:**

Name | Type |
------ | ------ |
`message` | Command &#124; Event |

**Returns:** *Promise‹any›*

Instance of `EventSourceable`.

___

###  handles

▸ **handles**(): *Map‹MessageType‹Command›, [Handler](../modules/types.md#handler)›*

*Inherited from [CancelingEmployment](cancelingemployment.md).[handles](cancelingemployment.md#handles)*

Returns all handled `Command` mappings.

**`example`** 
```ts
class MyController extends HandlingMixin {
  initialize(): void {
    this.setupHandlers({
      handlers: this.handles(),
    });
  }
  // ...
  MyCommandHandlerMethod(@handle command: MyCommand): boolean {
    return command.key === 'my-string';
  }
}
const controller = new MyController();
controller.registerHandler = sinon.stub();
controller.initialize();

expect(controller.registerHandler).to.be.calledOnce;
expect(controller.registerHandler).to.be.calledWithExactly(
  MyCommand,
  controller.MyCommandHandlerMethod
);
```

**Returns:** *Map‹MessageType‹Command›, [Handler](../modules/types.md#handler)›*

Returns all handled `Command`(s) defined with `@handle` annotation
or allows developer to define manually handlers.

___

###  hasAction

▸ **hasAction**(`action`: string): *boolean*

*Inherited from [CreateEmployee](createemployee.md).[hasAction](createemployee.md#hasaction)*

Evaluates if hooks for action are registered.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hook is existence is evaluated. |

**Returns:** *boolean*

Returns true if hooks for action exists, else false.

___

###  hasHandler

▸ **hasHandler**(`messageType`: MessageType‹Message›): *boolean*

*Inherited from [CancelingEmployment](cancelingemployment.md).[hasHandler](cancelingemployment.md#hashandler)*

Evaluates if handler for message type is registered.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | MessageType‹Message› | Type implementing `MessageableType` interface. |

**Returns:** *boolean*

Returns `true` if handler for message type is registered, else `false`.

___

###  hasHook

▸ **hasHook**(`action`: string, `id`: string): *boolean*

*Inherited from [CreateEmployee](createemployee.md).[hasHook](createemployee.md#hashook)*

Evaluates if hook for action with id is registered.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hook is existence is evaluated. |
`id` | string | Identifier under which hook was was registered. |

**Returns:** *boolean*

Returns true if hook exists, else false.

___

###  hasLegacyTransformer

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

*Inherited from [CreateEmployee](createemployee.md).[hasLegacyTransformer](createemployee.md#haslegacytransformer)*

Evaluates is there is registered legacy transformer for schema version.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemaVersion` | number | Schema version. |

**Returns:** *boolean*

Returns `true` if legacy transformer for schema version is registered, else `false`.

___

###  hasState

▸ **hasState**(): *boolean*

*Inherited from [Task](task.md).[hasState](task.md#hasstate)*

Evaluates if target has state set on instance(is not `nil`).

**Returns:** *boolean*

Returns `true` if instance has state set(not `nil`), else `false`.

___

###  hasStatus

▸ **hasStatus**(): *boolean*

*Inherited from [Task](task.md).[hasStatus](task.md#hasstatus)*

Evaluates if target has status set on instance(is not `nil`).

**Returns:** *boolean*

Returns `true` if instance has status set(not `nil`), else `false`.

___

###  in

▸ **in**‹**T**›(`listName`: string): *List‹T›*

*Inherited from [CreateEmployee](createemployee.md).[in](createemployee.md#in)*

Returns `List` for `Serializable` array.

**`throws`** {InvalidListError}
Thrown if the provided container name does not point to list of supported `Serializables`.

**`example`** 
```ts
@define('Employee')
class Employee extends Serializable {
  id: string;
}
@define('Company')
class Company extends Serializable {
  employees: Employee[];
}

 const employees = [
  new Employee({ id: 'first' }),
  new Employee({ id: 'second' }),
];
const company = new Company({ employees });
expect(company.in<Employee>('employees')).to.be.instanceof(List);
expect(company.in<Employee>('employees')).to.have.length(2);
expect(company.in<Employee>('employees')).to.have.members(employees);
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`listName` | string | Property name of the `Serializable` list on this instance. |

**Returns:** *List‹T›*

Instance of `List` implementation.

___

###  incrementVersion

▸ **incrementVersion**(): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[incrementVersion](cancelingemployment.md#incrementversion)*

Increments version of event sourceable.

**Returns:** *void*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

*Inherited from [CancelingEmployment](cancelingemployment.md).[initialize](cancelingemployment.md#initialize)*

*Overrides void*

Initializes EventSourceable.

**Returns:** *Promise‹void›*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: MessageType‹Message›, `handleableTypes`: MessageType‹Message› | MessageType‹Message›[]): *boolean*

*Inherited from [CancelingEmployment](cancelingemployment.md).[isHandleabe](cancelingemployment.md#ishandleabe)*

Evaluates if type can be handled.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`messageType` | MessageType‹Message› | - | Type implementing `MessageableType` interface. |
`handleableTypes` | MessageType‹Message› &#124; MessageType‹Message›[] | this.getHandleableTypes() | Optional handleable types to be verified against on runtime. |

**Returns:** *boolean*

Returns `true` if message type can be handled, else `false`.

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Task](task.md).[isInOneOfStates](task.md#isinoneofstates)*

Evaluates if target is in one of expected state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] | Expected states in which one of instance should be. |

**Returns:** *boolean*

Returns true if instance is in one of states, else false.

___

###  isInOneOfStatuses

▸ **isInOneOfStatuses**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Inherited from [Task](task.md).[isInOneOfStatuses](task.md#isinoneofstatuses)*

Evaluates if target is in one of expected status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] | Expected status in which one of instance should be. |

**Returns:** *boolean*

Returns true if instance is in one of status, else false.

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Task](task.md).[isInState](task.md#isinstate)*

Evaluates if target is in expected state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] | Expected state in which instance should be. |

**Returns:** *boolean*

Returns `true` if instance is in state, else `false`.

___

###  isInStatus

▸ **isInStatus**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Inherited from [Task](task.md).[isInStatus](task.md#isinstatus)*

Evaluates if target is in expected status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] | Expected status in which instance should be. |

**Returns:** *boolean*

Returns `true` if instance is in status, else `false`.

___

###  isStateSaved

▸ **isStateSaved**(): *boolean*

*Inherited from [Task](task.md).[isStateSaved](task.md#isstatesaved)*

Evaluates if state of entity is saved.

**Returns:** *boolean*

Returns `true` if state of entity is saved, else `false`.

___

###  on

▸ **on**(`action`: string | Stringifiable): *this*

*Inherited from [Task](task.md).[on](task.md#on)*

Sets current action for asserting state of `Entity`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string &#124; Stringifiable | Name of action to be taken or `Command` that is handled. |

**Returns:** *this*

Instance implementing `Asserter` interface.

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: MessageType‹Message›, `handler`: [Handler](../modules/types.md#handler)): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[overrideHandler](cancelingemployment.md#overridehandler)*

Overrides already existing handler for message type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | MessageType‹Message› | Type implementing `MessageableType` interface. |
`handler` | [Handler](../modules/types.md#handler) | Handler function that will executed upon handling message type.  |

**Returns:** *void*

___

###  overrideHook

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

*Inherited from [CreateEmployee](createemployee.md).[overrideHook](createemployee.md#overridehook)*

Overrides registered hook by action and id or registers a new one.

**`throws`** {InvalidHookActionError}
Thrown if the the action argument is not a `string`.

**`throws`** {InvalidHookIdError}
Thrown if the the id argument is not a `string`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hook will be registered(like `onConstruction`, `onSend`, `onPublish` etc.) |
`id` | string | Identifier under which hook will be registered for further reference. |
`hook` | [Hook](../modules/types.md#hook) | Hook as a `function` matching declaration for required action that will be invoked upon action. |

**Returns:** *void*

___

###  overrideLegacyTransformer

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

*Inherited from [CreateEmployee](createemployee.md).[overrideLegacyTransformer](createemployee.md#overridelegacytransformer)*

Overrides registered transformer by schema version or registers a new one.

**`throws`** {InvalidSchemaVersionError}
Thrown if the the schema version argument is not a number.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemaVersion` | number | Schema version. |
`transformer` | [Hook](../modules/types.md#hook) | Transformer function. |

**Returns:** *void*

___

###  pickEventProps

▸ **pickEventProps**(...`sources`: Record‹string, any›[]): *PickableProperties*

*Inherited from [CancelingEmployment](cancelingemployment.md).[pickEventProps](cancelingemployment.md#pickeventprops)*

Generates pickable properties for new `Event` instance as  `PickableProperties`
instance with all necessary sources for `Event`.

**`example`** 
```ts
this.record(new MyEvent(this.pickEventProps(command)));
this.record(new MyEvent(this.pickEventProps(
  command,
  {key: 'value'}
)));
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...sources` | Record‹string, any›[] | One or more source of properties. |

**Returns:** *PickableProperties*

Returns properties for `Event` instance as `PickableProperties`.

___

###  processSerializableList

▸ **processSerializableList**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Inherited from [CreateEmployee](createemployee.md).[processSerializableList](createemployee.md#processserializablelist)*

Processes properties for Serializable by wrapping each serializable list property with `List` .

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`props` | [Props](../modules/types.md#props) | {} | Properties of the type required for construction. |

**Returns:** *[Props](../modules/types.md#props)*

Processed properties with any registered `onConstruction` hooks and
validates them against prop types.

___

###  record

▸ **record**(`event`: Event): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[record](cancelingemployment.md#record)*

Records state change of `EventSourceable` as `Event` and updates event sourceable version.

**`example`** 
```ts
this.record(new MyEvent({
  sourceId: this.getId(),
  key: 'value'
});
this.record(new MyEvent({
  ...this.eventProps(),
  customerName: command.customerName,
}));
this.record(new MyEvent(this.pickEventProps(command)));
this.record(new MyEvent(this.pickEventProps(
  command,
  {key: 'value'}
)));
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | Event | Instance of `Event`. |

**Returns:** *void*

___

###  registerHandler

▸ **registerHandler**(`messageType`: MessageType‹Message›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride`: boolean): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[registerHandler](cancelingemployment.md#registerhandler)*

*Overrides void*

Registers handler for message type.

**`throws`** {UnhandleableTypeError}
Thrown if the type argument is not one of handleable types.

**`throws`** {InvalidHandlerError}
Thrown if the handler argument is not a function.

**`throws`** {HandlerExistError}
Thrown if handler would overridden without explicit call.

**`example`** 
```ts
@define('MyCommand')
class MyCommand extends Command {
  key: string;
}
define('MyOtherCommand')
class MyOtherCommand extends Command {
  key: string;
}

class MyClass extends OneToOneHandlingMixin {
  MyCommand(command: MyCommand): void {
    // ...
  }

  @handles()
  MyOtherCommand(command: MyOtherCommand): void {
    // ...
  }
}
const myClass = new MyClass();
// Defined externally or during construction
myClass.registerHandler(MyCommand, myClass.MyCommand);
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`messageType` | MessageType‹Message› | - | Type implementing `MessageableType` interface. |
`handler` | [Handler](../modules/types.md#handler) | - | Handler function that will executed upon handling message type. |
`shouldOverride` | boolean | false | Flag indicating that handler should be overridden if exist. |

**Returns:** *void*

___

###  registerHook

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride`: boolean): *void*

*Inherited from [CreateEmployee](createemployee.md).[registerHook](createemployee.md#registerhook)*

Registers hook by action type and id.

**`throws`** {InvalidHookActionError}
Thrown if the the action argument is not a string.

**`throws`** {InvalidHookIdError}
Thrown if the the id argument is not a string.

**`throws`** {HookAlreadyExistsError}
Thrown if the existing hook with id would be overridden.

**`example`** 
```ts
import {expect} from 'chai';
import {HookableMixin} from 'eveble'

class Document extends HookableMixin {
  content: string;

  version: number;

  constructor(props: Record<keyof any, any>) {
    super();
    const processedProps = { ...props };

    const hooks = this.getHooks('onConstruction');
    for (const hook of Object.values(hooks)) {
      hook.bind(this)(processedProps);
    }
    Object.assign(this, processedProps);
  }
}

const versionable = (props: Record<keyof any, any>) => {
  if (props.version === undefined) {
    props.version = 0;
  }
  return props;
};
Document.prototype.registerHook('onConstruction', 'versionable', versionable);

const newDoc = new Document({ content: 'My document content' });
expect(newDoc.version).to.be.equal(0);
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`action` | string | - | Action for which hook will be registered(like `onConstruction`, `onSend`, `onPublish` etc.) |
`id` | string | - | Identifier under which hook will be registered for further reference. |
`hook` | [Hook](../modules/types.md#hook) | - | Hook as a `function` matching declaration for required action that will be invoked upon action. |
`shouldOverride` | boolean | false | Flag indicating that hook should be overridden if exist. |

**Returns:** *void*

___

###  registerLegacyTransformer

▸ **registerLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook), `shouldOverride`: boolean): *void*

*Inherited from [CreateEmployee](createemployee.md).[registerLegacyTransformer](createemployee.md#registerlegacytransformer)*

Registers legacy transformer for version.

**`throws`** {InvalidSchemaVersionError}
Thrown if the the schema version argument is not a number.

**`throws`** {LegacyTransformerAlreadyExistsError}
Thrown if transformer for version would overridden without explicit call.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`schemaVersion` | number | - | Schema version. |
`transformer` | [Hook](../modules/types.md#hook) | - | Transformer function. |
`shouldOverride` | boolean | false | Flag indicating that transformer should be overridden if exist. |

**Returns:** *void*

___

###  removeHandler

▸ **removeHandler**(`messageType`: MessageType‹Message›): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[removeHandler](cancelingemployment.md#removehandler)*

Removes handler by type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageType` | MessageType‹Message› | Type implementing `MessageableType` interface.  |

**Returns:** *void*

___

###  removeHook

▸ **removeHook**(`action`: string, `id`: string): *void*

*Inherited from [CreateEmployee](createemployee.md).[removeHook](createemployee.md#removehook)*

Removes a hook by action and id.

**`example`** 
```ts
class MyClass extends HookableMixin {}

const hook = sinon.spy();
MyClass.prototype.registerHook('onConstruction', 'my-hook', hook);

MyClass.prototype.removeHook('onConstruction', 'my-hook')
expect(MyClass.prototype.getHook('onConstruction', 'my-hook')).to.be.undefined;
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hook is removed. |
`id` | string | Identifier under which hook was was registered. |

**Returns:** *void*

___

###  replay

▸ **replay**(`event`: Event): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[replay](cancelingemployment.md#replay)*

Replies event and updates `EventSourceable` version.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | Event | Instance of `Event`.  |

**Returns:** *void*

___

###  replayHistory

▸ **replayHistory**(`history`: History): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[replayHistory](cancelingemployment.md#replayhistory)*

Replies history from list of events.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`history` | History | Instance of `History` containing `Event` list.  |

**Returns:** *void*

___

###  schedule

▸ **schedule**(`command`: Command, `deliverAt`: Date, `assignmentId`: string | Guid): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[schedule](cancelingemployment.md#schedule)*

Schedules command to be delivered at specific time.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`command` | Command | - | `Command` instance. |
`deliverAt` | Date | - | `Date` instance on which command should be delivered.  |
`assignmentId` | string &#124; Guid | this.getId() | Scheduling assignment identifer. |

**Returns:** *void*

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: MessageType‹Message› | MessageType‹Message›[]): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[setHandleableTypes](cancelingemployment.md#sethandleabletypes)*

Sets the only allowed handleable message types.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`handleableTypes` | MessageType‹Message› &#124; MessageType‹Message›[] | List of allowed types for handling.  |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Inherited from [Task](task.md).[setState](task.md#setstate)*

Sets instance state.

**`throws`** {ValidationError}
Thrown if the provided state does not match one of the selectable states.

**`throws`** {UndefinedStatesError}
Thrown if the instance does not have any states assigned.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [State](../modules/types.md#state) | State to which instance should be set. |

**Returns:** *void*

___

###  setStatus

▸ **setStatus**(`status`: [Status](../modules/types.md#status)): *void*

*Inherited from [Task](task.md).[setStatus](task.md#setstatus)*

Sets instance status.

**`throws`** {ValidationError}
Thrown if the provided status does not match one of the selectable status.

**`throws`** {UndefinedStatusesError}
Thrown if the instance does not have any status assigned.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`status` | [Status](../modules/types.md#status) | Status to which instance should be set. |

**Returns:** *void*

___

###  setVersion

▸ **setVersion**(`version`: number): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[setVersion](cancelingemployment.md#setversion)*

Sets version of `EventSourceable`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`version` | number | Version number. |

**Returns:** *void*

Current number version of instance.

___

###  subscribes

▸ **subscribes**(): *Map‹MessageType‹Event›, [Handler](../modules/types.md#handler)›*

*Inherited from [CancelingEmployment](cancelingemployment.md).[subscribes](cancelingemployment.md#subscribes)*

Returns all handled `Event` mappings.

**`example`** 
```ts
class MyController extends HandlingMixin {
  initialize(): void {
    this.setupHandlers({
      handlers: this.subscribes(),
    });
  }
  // ...
  MyEventHandlerMethod(@subscribe event: MyEvent): boolean {
    return event.key === 'my-string';
  }
}
const controller = new MyController();
controller.registerHandler = sinon.stub();
controller.initialize();

expect(controller.registerHandler).to.be.calledOnce;
expect(controller.registerHandler).to.be.calledWithExactly(
  MyEvent,
  controller.MyEventHandlerMethod
);
```

**Returns:** *Map‹MessageType‹Event›, [Handler](../modules/types.md#handler)›*

Returns all handled `Events`(s) defined with `@subscribe` annotation
or allows developer to define manually handlers.

___

###  toJSONValue

▸ **toJSONValue**(): *Record‹string, any›*

*Inherited from [CreateEmployee](createemployee.md).[toJSONValue](createemployee.md#tojsonvalue)*

Serializes value into a JSON-compatible value. It preserves all custom
field types, however the initial value type is not saved.

**`example`** 
```ts
@define('Address')
class Address extends Serializable {
  city: string;

  street: string;
}

@define('Person')
class Person extends Serializable {
  firstName: string;

  lastName: string;

  address?: Address;
}

const person = new Person({
  firstName: 'Jane',
  lastName: 'Doe',
  address: new Address({
    city: 'New York',
    street: 'Wall Street',
  }),
});

expect(person.toJSONValue()).to.be.eql({
  firstName: 'Jane',
  lastName: 'Doe',
  address: {
    city: 'New York',
    street: 'Wall Street',
  },
});

**Returns:** *Record‹string, any›*

Normalized value as JSON-compatible without type identifers.

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Inherited from [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

Converts properties to plain object.

**`remarks`** 
**Loosing object references is required** since in scenarios when properties resolved
from `toPlainObject` are transformed - in such changes to the modified plain object
will cascade to original instance(**THIS** instance, since properties are **referenced**).

**`example`** 
```ts
@define()
class Point extends DefinableMixin {
  x: number;
  y: number;
  z: number;
}

const point = new Point({x: 1, y: 2, z: 3})
expect(point.toPlainObject()).to.be.eql({x: 1, y: 2, z: 3});
```

**Returns:** *[Props](../modules/types.md#props)*

Public properties with assigned values as plain object.

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

Returns definable type name

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Inherited from [CreateEmployee](createemployee.md).[transformLegacyProps](createemployee.md#transformlegacyprops)*

Registrable hook for transforming legacy schema.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [Props](../modules/types.md#props) | Properties object to be transformed. |

**Returns:** *[Props](../modules/types.md#props)*

Transformed legacy properties or thier unchanged state if up to date.

___

###  trigger

▸ **trigger**(`command`: Command): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[trigger](cancelingemployment.md#trigger)*

Adds `Command` instance to command that should be triggered.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`command` | Command | Instance of `Command`.  |

**Returns:** *void*

___

###  typeName

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [CreateEmployee](createemployee.md).[typeName](createemployee.md#typename)*

**`alias`** getTypeName

**`remarks`** 
Compatibility for EJSON serializer: `@eveble/ejson`

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  unschedule

▸ **unschedule**(`assignmentId`: string | Guid, `commandType`: MessageType‹Command›): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[unschedule](cancelingemployment.md#unschedule)*

Unschedule delivery of a specific command by assignment specification.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`assignmentId` | string &#124; Guid | Scheduling assignment identifer. |
`commandType` | MessageType‹Command› | A `Command` type that should be unscheduled.  |

**Returns:** *void*

___

###  validateProps

▸ **validateProps**(`props`: [Props](../modules/types.md#props), `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict`: boolean): *boolean*

*Inherited from [CreateEmployee](createemployee.md).[validateProps](createemployee.md#validateprops)*

Validates if provided properties matches prop types.

**`throws`** {ValidationError}
Thrown if the passed properties do not match prop types.

**`remarks`** 
Disabling of runtime validation is possible via Kernel's configuration(and by
that env flags also) or by annotating class with `@validable(false)`.

This is useful when there is external layer(like transportation) that does all
the heavy lifting of validation and there are no other sources of incoming data beside
points that is handled by layer.

Use env `EVEBLE_VALIDATION_TYPE` set to `manual` to disable validation on
initialization. You ca re-enable it again on your application configuration via
path `validation.type` set to `runtime` before staring application.

**`example`** 
```ts
@define()
class MyClass extends DefinableMixin {
  stringKey: string

  constructor(props: Record<keyof any, any>) {
    super()
    Object.assign(this, props);
  }
}

const instance = new MyClass({stringKey: 'my-string'});
expect(
  () => instance.validateProps({stringKey: 1337}, this.getPropTypes())
).to.throw(ValidationError)
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`props` | [Props](../modules/types.md#props) | {} | Properties to validate. |
`propTypes` | [PropTypes](../modules/types.md#proptypes) | - | Properties types. |
`isStrict` | boolean | true | Flag indicating that validation should be done in strict mode. |

**Returns:** *boolean*

Returns `true` if properties are valid, else throws.

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Inherited from [Task](task.md).[validateState](task.md#validatestate)*

Validates if instance is in allowed state(s).

**`throws`** {InvalidStateError}
Thrown if target is not in correct(one of allowed) state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] | Expected states list in one of which instance should be. |
`error?` | [Error](extendableerror.md#static-error) | Optional error instance for case where state does not match expected one. |

**Returns:** *boolean*

Returns `true` if instance is in correct state, else throws.

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Inherited from [Task](task.md).[validateStatus](task.md#validatestatus)*

Validates if instance is in allowed status(s).

**`throws`** {InvalidStatusError}
Thrown if target is not in correct(one of allowed) status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] | Expected status list in one of which instance should be. |
`error?` | [Error](extendableerror.md#static-error) | Optional error instance for case where status does not match expected one. |

**Returns:** *boolean*

Returns `true` if instance is in correct status, else throws.

___

### `Static` disableSerializableLists

▸ **disableSerializableLists**(): *void*

*Inherited from [CreateEmployee](createemployee.md).[disableSerializableLists](createemployee.md#static-disableserializablelists)*

Disables conversion of serializable lists to `List` instances.

**Returns:** *void*

___

### `Static` enableSerializableLists

▸ **enableSerializableLists**(): *void*

*Inherited from [CreateEmployee](createemployee.md).[enableSerializableLists](createemployee.md#static-enableserializablelists)*

Enables conversion of serializable lists to `List` instances.

**`remarks`** 
Since using mixins with polytype on extendable classes like: `Serializable`, `Entity`,
`EventSourceable`, `ValueObject` will result in loosing all registered hooks on metadata
- this ensures that hook can be easily re-applied.

**Returns:** *void*

___

### `Static` from

▸ **from**(...`sources`: Record‹string, any›[]): *any*

*Inherited from [CreateEmployee](createemployee.md).[from](createemployee.md#static-from)*

Create an `Serializable` from multiple property sources. Have similar api
like `Object.assign`.

**`throws`** {ValidationError}
Thrown if the passed properties does not match serializeble's property types.

**`example`** 
```ts
const props1 = {
  firstName: 'Jane',
  age: 28,
};
const props2 = {
  lastName: 'Doe',
  favoriteColor: 'black',
};
const props3 = {
  hobby: 'martial arts',
};
const person = Person.from(props1, props2, props3);
expect(person).to.be.instanceof(Person);
expect(person).to.be.eql({
  firstName: 'Jane',
  lastName: 'Doe',
});
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...sources` | Record‹string, any›[] | One or more source of properties. |

**Returns:** *any*

New instance of `Serializable` with assigned properties.

___

### `Static` getCorrelationKey

▸ **getCorrelationKey**(): *string*

*Inherited from [CancelingEmployment](cancelingemployment.md).[getCorrelationKey](cancelingemployment.md#static-getcorrelationkey)*

Returns correlation key.

**Returns:** *string*

Custom predefined correlation key or `Process` type name.

___

### `Static` getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Inherited from [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

Returns class properties types from whole inheritance tree.

**`example`** 
```ts
@define()
class MyClass extends DefinableMixin {
  stringKey: string

  constructor(props: Record<keyof any, any>) {
    super()
    Object.assign(this, props);
  }
}

expect(MyClass.getPropTypes()).to.be.eql({
  stringKey: PropTypes.instanceOf(String)
})
```

**Returns:** *[Props](../modules/types.md#props)*

Plain object representation of properties types.

___

### `Static` getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

Returns class property initializers for whole inheritance tree.

**`example`** 
```ts
@define()
class MyClass extends Struct {
  stringKey = 'my-string';

  numberKey = 1337;

  constructor(props: Partial<MyClass>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

expect(MyClass.getPropertyInitializers()).to.be.eql({
  stringKey: 'my-string',
  numberKey: 1337
})
```

**Returns:** *[Props](../modules/types.md#props)*

Plain object representation of property initializers.

___

### `Static` getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [CreateEmployee](createemployee.md).[getTypeName](createemployee.md#gettypename)*

Returns definable type name.

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

___

### `Static` resolveInitializingMessage

▸ **resolveInitializingMessage**(): *MessageType‹Command | Event› | undefined*

*Inherited from [CancelingEmployment](cancelingemployment.md).[resolveInitializingMessage](cancelingemployment.md#static-resolveinitializingmessage)*

Resolves initializing message on `EventSourceable`.

**Returns:** *MessageType‹Command | Event› | undefined*

`Command` or `Event` type.

___

### `Static` resolveRoutedCommands

▸ **resolveRoutedCommands**(): *MessageType‹Command›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[resolveRoutedCommands](cancelingemployment.md#static-resolveroutedcommands)*

Resolves routed commands.

**Returns:** *MessageType‹Command›[]*

List of all routed `Command` types.

___

### `Static` resolveRoutedEvents

▸ **resolveRoutedEvents**(): *MessageType‹Event›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[resolveRoutedEvents](cancelingemployment.md#static-resolveroutedevents)*

Resolves routed events.

**Returns:** *MessageType‹Event›[]*

List of all routed `Event` types.

___

### `Static` resolveRoutedMessages

▸ **resolveRoutedMessages**(): *MessageType‹Command | Event›[]*

*Inherited from [CancelingEmployment](cancelingemployment.md).[resolveRoutedMessages](cancelingemployment.md#static-resolveroutedmessages)*

Resolves routed messages.

**Returns:** *MessageType‹Command | Event›[]*

List of all routed messages types.

___

### `Static` setCorrelationKey

▸ **setCorrelationKey**(`key`: string): *void*

*Inherited from [CancelingEmployment](cancelingemployment.md).[setCorrelationKey](cancelingemployment.md#static-setcorrelationkey)*

Sets correlation key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Key under which correlation will be set for `Process`.  |

**Returns:** *void*

___

### `Static` toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

Returns definable type name

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

___

### `Static` typeName

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [CreateEmployee](createemployee.md).[typeName](createemployee.md#typename)*

**`alias`** getTypeName

**`remarks`** 
Compatibility for EJSON serializer: `@eveble/ejson`

**Returns:** *[TypeName](../modules/types.md#typename)*

## Object literals

### `Static` STATES

### ▪ **STATES**: *object*

###  completed

• **completed**: *string* = "completed"

###  failed

• **failed**: *string* = "failed"

###  initiated

• **initiated**: *string* = "initiated"
