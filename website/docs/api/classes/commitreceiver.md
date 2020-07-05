---
id: "commitreceiver"
title: "CommitReceiver"
sidebar_label: "CommitReceiver"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[StatefulMixin](statefulmixin.md) | [Serializable](serializable.md), this› & [StatefulMixin](statefulmixin.md)‹this› & [Serializable](serializable.md)‹this›

* SuperPrototypeSelector‹Serializable | StatefulMixin, this› & StatefulMixin‹this› & Serializable‹this›

  ↳ **CommitReceiver**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Ejsonable](../interfaces/types.ejsonable.md)
* [CommitReceiver](../interfaces/types.commitreceiver.md)
* Stateful
* Definable
* Hookable
* Ejsonable
* CommitReceiver

## Index

### Constructors

* [constructor](commitreceiver.md#constructor)

### Properties

* [appId](commitreceiver.md#appid)
* [failedAt](commitreceiver.md#optional-failedat)
* [publishedAt](commitreceiver.md#optional-publishedat)
* [receivedAt](commitreceiver.md#receivedat)
* [schemaVersion](commitreceiver.md#optional-schemaversion)
* [state](commitreceiver.md#state)
* [workerId](commitreceiver.md#optional-workerid)

### Methods

* [equals](commitreceiver.md#equals)
* [flagAsFailed](commitreceiver.md#flagasfailed)
* [flagAsPublished](commitreceiver.md#flagaspublished)
* [flagAsReceived](commitreceiver.md#flagasreceived)
* [flagAsTimeouted](commitreceiver.md#flagastimeouted)
* [getActions](commitreceiver.md#getactions)
* [getCurrentTime](commitreceiver.md#getcurrenttime)
* [getHook](commitreceiver.md#gethook)
* [getHookOrThrow](commitreceiver.md#gethookorthrow)
* [getHooks](commitreceiver.md#gethooks)
* [getLegacyTransformer](commitreceiver.md#getlegacytransformer)
* [getLegacyTransformers](commitreceiver.md#getlegacytransformers)
* [getPropTypes](commitreceiver.md#getproptypes)
* [getPropertyInitializers](commitreceiver.md#getpropertyinitializers)
* [getSchemaVersion](commitreceiver.md#getschemaversion)
* [getSelectableStates](commitreceiver.md#getselectablestates)
* [getState](commitreceiver.md#getstate)
* [getTypeName](commitreceiver.md#gettypename)
* [hasAction](commitreceiver.md#hasaction)
* [hasHook](commitreceiver.md#hashook)
* [hasLegacyTransformer](commitreceiver.md#haslegacytransformer)
* [hasState](commitreceiver.md#hasstate)
* [in](commitreceiver.md#in)
* [isInOneOfStates](commitreceiver.md#isinoneofstates)
* [isInState](commitreceiver.md#isinstate)
* [overrideHook](commitreceiver.md#overridehook)
* [overrideLegacyTransformer](commitreceiver.md#overridelegacytransformer)
* [processSerializableList](commitreceiver.md#processserializablelist)
* [registerHook](commitreceiver.md#registerhook)
* [registerLegacyTransformer](commitreceiver.md#registerlegacytransformer)
* [removeHook](commitreceiver.md#removehook)
* [setState](commitreceiver.md#setstate)
* [toJSONValue](commitreceiver.md#tojsonvalue)
* [toPlainObject](commitreceiver.md#toplainobject)
* [toString](commitreceiver.md#tostring)
* [transformLegacyProps](commitreceiver.md#transformlegacyprops)
* [typeName](commitreceiver.md#typename)
* [validateProps](commitreceiver.md#validateprops)
* [validateState](commitreceiver.md#validatestate)
* [disableSerializableLists](commitreceiver.md#static-disableserializablelists)
* [enableSerializableLists](commitreceiver.md#static-enableserializablelists)
* [from](commitreceiver.md#static-from)
* [getPropTypes](commitreceiver.md#static-getproptypes)
* [getPropertyInitializers](commitreceiver.md#static-getpropertyinitializers)
* [getTypeName](commitreceiver.md#static-gettypename)
* [toString](commitreceiver.md#static-tostring)
* [typeName](commitreceiver.md#static-typename)

### Object literals

* [STATES](commitreceiver.md#static-states)

## Constructors

###  constructor

\+ **new CommitReceiver**(`props?`: [Props](../modules/types.md#props)): *[CommitReceiver](commitreceiver.md)*

*Overrides [Serializable](serializable.md).[constructor](serializable.md#constructor)*

Creates an instance of Serializable.
Creates an instance of Serializable.

**`remarks`** 
Since were dealing with special cases, mixins and limits of TypeScript, we
use of "invoking multiple base constructors" from polytype to pass props to Struct's
constructor:
https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors

**`remarks`** 
Since were dealing with special cases, mixins and limits of TypeScript, we
use of "invoking multiple base constructors" from polytype to pass props to Struct's
constructor:
https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props?` | [Props](../modules/types.md#props) | Properties of the type required for construction. |

**Returns:** *[CommitReceiver](commitreceiver.md)*

## Properties

###  appId

• **appId**: *string*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md).[appId](../interfaces/types.commitreceiver.md#appid)*

___

### `Optional` failedAt

• **failedAt**? : *Date*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md).[failedAt](../interfaces/types.commitreceiver.md#optional-failedat)*

___

### `Optional` publishedAt

• **publishedAt**? : *Date*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md).[publishedAt](../interfaces/types.commitreceiver.md#optional-publishedat)*

___

###  receivedAt

• **receivedAt**: *Date*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md).[receivedAt](../interfaces/types.commitreceiver.md#receivedat)*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Inherited from [Serializable](serializable.md).[schemaVersion](serializable.md#optional-schemaversion)*

*Overrides [VersionableMixin](versionablemixin.md).[schemaVersion](versionablemixin.md#optional-schemaversion)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md).[state](../interfaces/types.commitreceiver.md#state)*

*Overrides [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

___

### `Optional` workerId

• **workerId**? : *string*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md).[workerId](../interfaces/types.commitreceiver.md#optional-workerid)*

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [DefinableMixin](definablemixin.md).[equals](definablemixin.md#equals)*

*Overrides [CreateEmployee](createemployee.md).[equals](createemployee.md#equals)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  flagAsFailed

▸ **flagAsFailed**(`workerId`: string): *void*

Flags that commit failed(is not publishable on application).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`workerId` | string | Identifier of worker that failed to publish `Commit`.  |

**Returns:** *void*

___

###  flagAsPublished

▸ **flagAsPublished**(`workerId`: string): *void*

Flags that commit is published on application.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`workerId` | string | Identifier of worker that published `Commit`.  |

**Returns:** *void*

___

###  flagAsReceived

▸ **flagAsReceived**(`workerId`: string): *void*

Flags that commit is received by application.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`workerId` | string | Identifier of worker that received `Commit`.  |

**Returns:** *void*

___

###  flagAsTimeouted

▸ **flagAsTimeouted**(`workerId`: string): *void*

Flags that commit was not published do to timeout on application.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`workerId` | string | Identifier of worker on which `Commit` timeout.  |

**Returns:** *void*

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getActions](hookablemixin.md#getactions)*

*Overrides [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getCurrentTime

▸ **getCurrentTime**(): *Date*

Returns current time.

**Returns:** *Date*

Instance of `Date`.

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

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getLegacyTransformers](versionablemixin.md#getlegacytransformers)*

*Overrides [CreateEmployee](createemployee.md).[getLegacyTransformers](createemployee.md#getlegacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getSchemaVersion](versionablemixin.md#getschemaversion)*

*Overrides [CreateEmployee](createemployee.md).[getSchemaVersion](createemployee.md#getschemaversion)*

**Returns:** *number | undefined*

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

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

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toString](serializablemixin.md#tostring)*

*Overrides [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

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

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [CommitReceiver](../interfaces/types.commitreceiver.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](extendableerror.md#static-error) |

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

## Object literals

### `Static` STATES

### ▪ **STATES**: *object*

###  failed

• **failed**: *string* = "failed"

###  published

• **published**: *string* = "published"

###  received

• **received**: *string* = "received"

###  timeouted

• **timeouted**: *string* = "timeouted"
