---
id: "entity"
title: "Entity"
sidebar_label: "Entity"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[StatefulMixin](statefulmixin.md) | [Serializable](serializable.md) | [StatusfulMixin](statusfulmixin.md), this› & [StatefulMixin](statefulmixin.md)‹this› & [Serializable](serializable.md)‹this› & [StatusfulMixin](statusfulmixin.md)‹this›

* SuperPrototypeSelector‹Serializable | StatefulMixin | StatusfulMixin, this› & StatefulMixin‹this› & Serializable‹this› & StatusfulMixin‹this›

  ↳ **Entity**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Ejsonable](../interfaces/types.ejsonable.md)
* [Statusful](../interfaces/types.statusful.md)
* [Entity](../interfaces/types.entity.md)
* Stateful
* Definable
* Hookable
* Ejsonable
* Statusful
* Entity

## Index

### Constructors

* [constructor](entity.md#constructor)

### Properties

* [id](entity.md#id)
* [schemaVersion](entity.md#optional-schemaversion)
* [state](entity.md#state)
* [status](entity.md#status)

### Accessors

* [ableTo](entity.md#ableto)
* [can](entity.md#can)
* [ensure](entity.md#ensure)
* [is](entity.md#is)

### Methods

* [[ROLLBACK_STATE_METHOD_KEY]](entity.md#[rollback_state_method_key])
* [[SAVE_STATE_METHOD_KEY]](entity.md#[save_state_method_key])
* [equals](entity.md#equals)
* [getActions](entity.md#getactions)
* [getHook](entity.md#gethook)
* [getHookOrThrow](entity.md#gethookorthrow)
* [getHooks](entity.md#gethooks)
* [getId](entity.md#getid)
* [getLegacyTransformer](entity.md#getlegacytransformer)
* [getLegacyTransformers](entity.md#getlegacytransformers)
* [getPropTypes](entity.md#getproptypes)
* [getPropertyInitializers](entity.md#getpropertyinitializers)
* [getSchemaVersion](entity.md#getschemaversion)
* [getSelectableStates](entity.md#getselectablestates)
* [getSelectableStatuses](entity.md#getselectablestatuses)
* [getState](entity.md#getstate)
* [getStatus](entity.md#getstatus)
* [getTypeName](entity.md#gettypename)
* [hasAction](entity.md#hasaction)
* [hasHook](entity.md#hashook)
* [hasLegacyTransformer](entity.md#haslegacytransformer)
* [hasState](entity.md#hasstate)
* [hasStatus](entity.md#hasstatus)
* [in](entity.md#in)
* [isInOneOfStates](entity.md#isinoneofstates)
* [isInOneOfStatuses](entity.md#isinoneofstatuses)
* [isInState](entity.md#isinstate)
* [isInStatus](entity.md#isinstatus)
* [isStateSaved](entity.md#isstatesaved)
* [on](entity.md#on)
* [overrideHook](entity.md#overridehook)
* [overrideLegacyTransformer](entity.md#overridelegacytransformer)
* [processSerializableList](entity.md#processserializablelist)
* [registerHook](entity.md#registerhook)
* [registerLegacyTransformer](entity.md#registerlegacytransformer)
* [removeHook](entity.md#removehook)
* [setState](entity.md#setstate)
* [setStatus](entity.md#setstatus)
* [toJSONValue](entity.md#tojsonvalue)
* [toPlainObject](entity.md#toplainobject)
* [toString](entity.md#tostring)
* [transformLegacyProps](entity.md#transformlegacyprops)
* [typeName](entity.md#typename)
* [validateProps](entity.md#validateprops)
* [validateState](entity.md#validatestate)
* [validateStatus](entity.md#validatestatus)
* [disableSerializableLists](entity.md#static-disableserializablelists)
* [enableSerializableLists](entity.md#static-enableserializablelists)
* [from](entity.md#static-from)
* [getPropTypes](entity.md#static-getproptypes)
* [getPropertyInitializers](entity.md#static-getpropertyinitializers)
* [getTypeName](entity.md#static-gettypename)
* [toString](entity.md#static-tostring)
* [typeName](entity.md#static-typename)

## Constructors

###  constructor

\+ **new Entity**(`props`: [Props](../modules/types.md#props)): *[Entity](entity.md)*

*Overrides [Serializable](serializable.md).[constructor](serializable.md#constructor)*

Creates an instance of `Entity`.
Creates an instance of `Entity`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [Props](../modules/types.md#props) | Properties of the type required for construction.  |

**Returns:** *[Entity](entity.md)*

## Properties

###  id

• **id**: *string | Guid*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Overrides [Serializable](serializable.md).[schemaVersion](serializable.md#optional-schemaversion)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Entity](../interfaces/types.entity.md).[state](../interfaces/types.entity.md#state)*

*Overrides [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

___

###  status

• **status**: *[Status](../modules/types.md#status)*

*Implementation of [Entity](../interfaces/types.entity.md).[status](../interfaces/types.entity.md#status)*

*Overrides [StatusfulMixin](statusfulmixin.md).[status](statusfulmixin.md#status)*

## Accessors

###  ableTo

• **get ableTo**(): *this*

Method to enforce TypeScript compliance with `Asserter` and `AbilityAssertion`.

**Returns:** *this*

___

###  can

• **get can**(): *any*

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
users to defined their own apis. By calling:
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

Method to enforce TypeScript compliance with `Asserter` and `AbilityAssertion`.

**Returns:** *this & object*

## Methods

###  [ROLLBACK_STATE_METHOD_KEY]

▸ **[ROLLBACK_STATE_METHOD_KEY]**(): *void*

*Implementation of [Entity](../interfaces/types.entity.md)*

Rollbacks entity to previous state.

**`throws`** {SavedStateNotFoundError}
Thrown if rollback is done on `Entity` without prior saved state.

**Returns:** *void*

___

###  [SAVE_STATE_METHOD_KEY]

▸ **[SAVE_STATE_METHOD_KEY]**(): *void*

*Implementation of [Entity](../interfaces/types.entity.md)*

Saves current entity state.

**Returns:** *void*

___

###  equals

▸ **equals**(`otherEntity`: [Entity](entity.md)): *boolean*

*Overrides [DefinableMixin](definablemixin.md).[equals](definablemixin.md#equals)*

Evaluates if one entity is equal to other by its constructor and identifier.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`otherEntity` | [Entity](entity.md) | Other `Entity` instance. |

**Returns:** *boolean*

Returns `true` if both Entities instances are equal, else `false`.

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getActions](hookablemixin.md#getactions)*

*Overrides [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getHook

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHook](hookablemixin.md#gethook)*

*Overrides [CreateEmployee](createemployee.md).[getHook](createemployee.md#gethook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

___

###  getHookOrThrow

▸ **getHookOrThrow**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHookOrThrow](hookablemixin.md#gethookorthrow)*

*Overrides [CreateEmployee](createemployee.md).[getHookOrThrow](createemployee.md#gethookorthrow)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getHooks

▸ **getHooks**(`action`: string): *[Mappings](../modules/types.hooks.md#mappings)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHooks](hookablemixin.md#gethooks)*

*Overrides [CreateEmployee](createemployee.md).[getHooks](createemployee.md#gethooks)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

___

###  getId

▸ **getId**(): *string | [Guid](guid.md)*

*Implementation of [Entity](../interfaces/types.entity.md)*

Returns identifier for Entity.

**Returns:** *string | [Guid](guid.md)*

Entities identifier as `Guid` instance or string.

___

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getLegacyTransformer](versionablemixin.md#getlegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[getLegacyTransformer](createemployee.md#getlegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getLegacyTransformers

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getLegacyTransformers](versionablemixin.md#getlegacytransformers)*

*Overrides [CreateEmployee](createemployee.md).[getLegacyTransformers](createemployee.md#getlegacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getSchemaVersion](versionablemixin.md#getschemaversion)*

*Overrides [CreateEmployee](createemployee.md).[getSchemaVersion](createemployee.md#getschemaversion)*

**Returns:** *number | undefined*

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getSelectableStatuses

▸ **getSelectableStatuses**(): *Record‹string, [Status](../modules/types.md#status)›*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[getSelectableStatuses](statusfulmixin.md#getselectablestatuses)*

*Overrides [Task](task.md).[getSelectableStatuses](task.md#getselectablestatuses)*

**Returns:** *Record‹string, [Status](../modules/types.md#status)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  getStatus

▸ **getStatus**(): *[Status](../modules/types.md#status)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[getStatus](statusfulmixin.md#getstatus)*

*Overrides [Task](task.md).[getStatus](task.md#getstatus)*

**Returns:** *[Status](../modules/types.md#status)*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[getTypeName](serializablemixin.md#gettypename)*

*Overrides [CreateEmployee](createemployee.md).[getTypeName](createemployee.md#gettypename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  hasAction

▸ **hasAction**(`action`: string): *boolean*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[hasAction](hookablemixin.md#hasaction)*

*Overrides [CreateEmployee](createemployee.md).[hasAction](createemployee.md#hasaction)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *boolean*

___

###  hasHook

▸ **hasHook**(`action`: string, `id`: string): *boolean*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[hasHook](hookablemixin.md#hashook)*

*Overrides [CreateEmployee](createemployee.md).[hasHook](createemployee.md#hashook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *boolean*

___

###  hasLegacyTransformer

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[hasLegacyTransformer](versionablemixin.md#haslegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[hasLegacyTransformer](createemployee.md#haslegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *boolean*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  hasStatus

▸ **hasStatus**(): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[hasStatus](statusfulmixin.md#hasstatus)*

*Overrides [Task](task.md).[hasStatus](task.md#hasstatus)*

**Returns:** *boolean*

___

###  in

▸ **in**‹**T**›(`listName`: string): *[List](../interfaces/types.list.md)‹T›*

*Inherited from [Serializable](serializable.md).[in](serializable.md#in)*

*Overrides [CreateEmployee](createemployee.md).[in](createemployee.md#in)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`listName` | string |

**Returns:** *[List](../interfaces/types.list.md)‹T›*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInOneOfStates](statefulmixin.md#isinoneofstates)*

*Overrides [Task](task.md).[isInOneOfStates](task.md#isinoneofstates)*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInOneOfStatuses

▸ **isInOneOfStatuses**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[isInOneOfStatuses](statusfulmixin.md#isinoneofstatuses)*

*Overrides [Task](task.md).[isInOneOfStatuses](task.md#isinoneofstatuses)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInStatus

▸ **isInStatus**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[isInStatus](statusfulmixin.md#isinstatus)*

*Overrides [Task](task.md).[isInStatus](task.md#isinstatus)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

___

###  isStateSaved

▸ **isStateSaved**(): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

Evaluates if state of entity is saved.

**Returns:** *boolean*

Returns `true` if state of entity is saved, else `false`.

___

###  on

▸ **on**(`action`: string | [Stringifiable](../interfaces/types.stringifiable.md)): *this*

*Implementation of [Entity](../interfaces/types.entity.md)*

Sets current action for asserting state of `Entity`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) | Name of action to be taken or `Command` that is handled. |

**Returns:** *this*

Instance implementing `Asserter` interface.

___

###  overrideHook

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[overrideHook](hookablemixin.md#overridehook)*

*Overrides [CreateEmployee](createemployee.md).[overrideHook](createemployee.md#overridehook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  overrideLegacyTransformer

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[overrideLegacyTransformer](versionablemixin.md#overridelegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[overrideLegacyTransformer](createemployee.md#overridelegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  processSerializableList

▸ **processSerializableList**(`props?`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Inherited from [Serializable](serializable.md).[processSerializableList](serializable.md#processserializablelist)*

*Overrides [CreateEmployee](createemployee.md).[processSerializableList](createemployee.md#processserializablelist)*

**Parameters:**

Name | Type |
------ | ------ |
`props?` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*

___

###  registerHook

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[registerHook](hookablemixin.md#registerhook)*

*Overrides [CreateEmployee](createemployee.md).[registerHook](createemployee.md#registerhook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  registerLegacyTransformer

▸ **registerLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[registerLegacyTransformer](versionablemixin.md#registerlegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[registerLegacyTransformer](createemployee.md#registerlegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHook

▸ **removeHook**(`action`: string, `id`: string): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[removeHook](hookablemixin.md#removehook)*

*Overrides [CreateEmployee](createemployee.md).[removeHook](createemployee.md#removehook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  setStatus

▸ **setStatus**(`status`: [Status](../modules/types.md#status)): *void*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[setStatus](statusfulmixin.md#setstatus)*

*Overrides [Task](task.md).[setStatus](task.md#setstatus)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) |

**Returns:** *void*

___

###  toJSONValue

▸ **toJSONValue**(): *Record‹string, any›*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toJSONValue](serializablemixin.md#tojsonvalue)*

*Overrides [CreateEmployee](createemployee.md).[toJSONValue](createemployee.md#tojsonvalue)*

**Returns:** *Record‹string, any›*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toString](serializablemixin.md#tostring)*

*Overrides [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[transformLegacyProps](versionablemixin.md#transformlegacyprops)*

*Overrides [CreateEmployee](createemployee.md).[transformLegacyProps](createemployee.md#transformlegacyprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*

___

###  typeName

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [EjsonableMixin](ejsonablemixin.md).[typeName](ejsonablemixin.md#typename)*

*Overrides [CreateEmployee](createemployee.md).[typeName](createemployee.md#typename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  validateProps

▸ **validateProps**(`props`: Record‹string | number | symbol, any› | undefined, `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

*Inherited from [DefinableMixin](definablemixin.md).[validateProps](definablemixin.md#validateprops)*

*Overrides [CreateEmployee](createemployee.md).[validateProps](createemployee.md#validateprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | Record‹string &#124; number &#124; symbol, any› &#124; undefined |
`propTypes` | [PropTypes](../modules/types.md#proptypes) |
`isStrict?` | boolean |

**Returns:** *boolean*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: Error): *boolean*

*Implementation of [Entity](../interfaces/types.entity.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[validateStatus](statusfulmixin.md#validatestatus)*

*Overrides [Task](task.md).[validateStatus](task.md#validatestatus)*

**Parameters:**

Name | Type |
------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |
`error?` | Error |

**Returns:** *boolean*

___

### `Static` disableSerializableLists

▸ **disableSerializableLists**(): *void*

*Inherited from [Serializable](serializable.md).[disableSerializableLists](serializable.md#static-disableserializablelists)*

*Overrides [CreateEmployee](createemployee.md).[disableSerializableLists](createemployee.md#static-disableserializablelists)*

**Returns:** *void*

___

### `Static` enableSerializableLists

▸ **enableSerializableLists**(): *void*

*Inherited from [Serializable](serializable.md).[enableSerializableLists](serializable.md#static-enableserializablelists)*

*Overrides [CreateEmployee](createemployee.md).[enableSerializableLists](createemployee.md#static-enableserializablelists)*

**Returns:** *void*

___

### `Static` from

▸ **from**(...`sources`: Record‹string, any›[]): *any*

*Inherited from [Serializable](serializable.md).[from](serializable.md#static-from)*

*Overrides [CreateEmployee](createemployee.md).[from](createemployee.md#static-from)*

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *any*

___

### `Static` getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

### `Static` getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

### `Static` getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [SerializableMixin](serializablemixin.md).[getTypeName](serializablemixin.md#gettypename)*

*Overrides [CreateEmployee](createemployee.md).[getTypeName](createemployee.md#gettypename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

### `Static` toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [SerializableMixin](serializablemixin.md).[toString](serializablemixin.md#tostring)*

*Overrides [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

### `Static` typeName

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [EjsonableMixin](ejsonablemixin.md).[typeName](ejsonablemixin.md#typename)*

*Overrides [CreateEmployee](createemployee.md).[typeName](createemployee.md#typename)*

**Returns:** *[TypeName](../modules/types.md#typename)*
