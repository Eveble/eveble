---
id: "identifiablealreadyexistserror"
title: "IdentifiableAlreadyExistsError"
sidebar_label: "IdentifiableAlreadyExistsError"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [ListError](listerror.md)

* ListError

  ↳ **IdentifiableAlreadyExistsError**

## Implements

* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Versionable](../interfaces/types.versionable.md)
* [Ejsonable](../interfaces/types.ejsonable.md)
* Definable
* Hookable
* Versionable
* Ejsonable

## Index

### Constructors

* [constructor](identifiablealreadyexistserror.md#constructor)

### Properties

* [code](identifiablealreadyexistserror.md#optional-code)
* [message](identifiablealreadyexistserror.md#message)
* [name](identifiablealreadyexistserror.md#name)
* [schemaVersion](identifiablealreadyexistserror.md#optional-schemaversion)
* [stack](identifiablealreadyexistserror.md#optional-stack)

### Methods

* [equals](identifiablealreadyexistserror.md#equals)
* [fillErrorProps](identifiablealreadyexistserror.md#fillerrorprops)
* [getActions](identifiablealreadyexistserror.md#getactions)
* [getHook](identifiablealreadyexistserror.md#gethook)
* [getHookOrThrow](identifiablealreadyexistserror.md#gethookorthrow)
* [getHooks](identifiablealreadyexistserror.md#gethooks)
* [getLegacyTransformer](identifiablealreadyexistserror.md#getlegacytransformer)
* [getLegacyTransformers](identifiablealreadyexistserror.md#getlegacytransformers)
* [getPropTypes](identifiablealreadyexistserror.md#getproptypes)
* [getPropertyInitializers](identifiablealreadyexistserror.md#getpropertyinitializers)
* [getSchemaVersion](identifiablealreadyexistserror.md#getschemaversion)
* [getTypeName](identifiablealreadyexistserror.md#gettypename)
* [hasAction](identifiablealreadyexistserror.md#hasaction)
* [hasHook](identifiablealreadyexistserror.md#hashook)
* [hasLegacyTransformer](identifiablealreadyexistserror.md#haslegacytransformer)
* [overrideHook](identifiablealreadyexistserror.md#overridehook)
* [overrideLegacyTransformer](identifiablealreadyexistserror.md#overridelegacytransformer)
* [registerHook](identifiablealreadyexistserror.md#registerhook)
* [registerLegacyTransformer](identifiablealreadyexistserror.md#registerlegacytransformer)
* [removeHook](identifiablealreadyexistserror.md#removehook)
* [toJSONValue](identifiablealreadyexistserror.md#tojsonvalue)
* [toPlainObject](identifiablealreadyexistserror.md#toplainobject)
* [toString](identifiablealreadyexistserror.md#tostring)
* [transformLegacyProps](identifiablealreadyexistserror.md#transformlegacyprops)
* [typeName](identifiablealreadyexistserror.md#typename)
* [validateProps](identifiablealreadyexistserror.md#validateprops)
* [getPropTypes](identifiablealreadyexistserror.md#static-getproptypes)
* [getPropertyInitializers](identifiablealreadyexistserror.md#static-getpropertyinitializers)
* [getTypeName](identifiablealreadyexistserror.md#static-gettypename)
* [toString](identifiablealreadyexistserror.md#static-tostring)
* [typeName](identifiablealreadyexistserror.md#static-typename)

## Constructors

###  constructor

\+ **new IdentifiableAlreadyExistsError**(`props`: object): *[IdentifiableAlreadyExistsError](identifiablealreadyexistserror.md)*

*Overrides [SerializableError](serializableerror.md).[constructor](serializableerror.md#constructor)*

**Parameters:**

▪ **props**: *object*

Name | Type |
------ | ------ |
`identifiableName` | string |
`key` | string |
`listKey` | string |
`sourceId` | string &#124; undefined |
`sourceName` | string |
`value` | string |

**Returns:** *[IdentifiableAlreadyExistsError](identifiablealreadyexistserror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [SerializableError](serializableerror.md).[code](serializableerror.md#optional-code)*

*Overrides [StateError](stateerror.md).[code](stateerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [SerializableError](serializableerror.md).[message](serializableerror.md#message)*

*Overrides [StateError](stateerror.md).[message](stateerror.md#message)*

___

###  name

• **name**: *string*

*Inherited from [SerializableError](serializableerror.md).[name](serializableerror.md#name)*

*Overrides [StateError](stateerror.md).[name](stateerror.md#name)*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Inherited from [SerializableError](serializableerror.md).[schemaVersion](serializableerror.md#optional-schemaversion)*

*Overrides [VersionableMixin](versionablemixin.md).[schemaVersion](versionablemixin.md#optional-schemaversion)*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [SerializableError](serializableerror.md).[stack](serializableerror.md#optional-stack)*

*Overrides [StateError](stateerror.md).[stack](stateerror.md#optional-stack)*

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[equals](definablemixin.md#equals)*

*Overrides [CreateEmployee](createemployee.md).[equals](createemployee.md#equals)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

*Overrides [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*

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

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

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

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getLegacyTransformers](versionablemixin.md#getlegacytransformers)*

*Overrides [CreateEmployee](createemployee.md).[getLegacyTransformers](createemployee.md#getlegacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getSchemaVersion](versionablemixin.md#getschemaversion)*

*Overrides [CreateEmployee](createemployee.md).[getSchemaVersion](createemployee.md#getschemaversion)*

**Returns:** *number | undefined*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

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

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[hasLegacyTransformer](versionablemixin.md#haslegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[hasLegacyTransformer](createemployee.md#haslegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

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

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[overrideLegacyTransformer](versionablemixin.md#overridelegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[overrideLegacyTransformer](createemployee.md#overridelegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

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

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

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

###  toJSONValue

▸ **toJSONValue**(): *Record‹string, any›*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toJSONValue](serializablemixin.md#tojsonvalue)*

*Overrides [CreateEmployee](createemployee.md).[toJSONValue](createemployee.md#tojsonvalue)*

**Returns:** *Record‹string, any›*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toString](serializablemixin.md#tostring)*

*Overrides [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

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