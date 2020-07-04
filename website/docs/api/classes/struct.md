---
id: "struct"
title: "Struct"
sidebar_label: "Struct"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[DefinableMixin](definablemixin.md) | [HookableMixin](hookablemixin.md), this› & [DefinableMixin](definablemixin.md)‹this› & [HookableMixin](hookablemixin.md)‹this›

* SuperPrototypeSelector‹DefinableMixin | HookableMixin, this› & DefinableMixin‹this› & HookableMixin‹this›

  ↳ **Struct**

  ↳ [Config](config.md)

  ↳ [RebuildingResult](rebuildingresult.md)

## Implements

* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* Definable
* Hookable

## Index

### Constructors

* [constructor](struct.md#constructor)

### Methods

* [equals](struct.md#equals)
* [getActions](struct.md#getactions)
* [getHook](struct.md#gethook)
* [getHookOrThrow](struct.md#gethookorthrow)
* [getHooks](struct.md#gethooks)
* [getPropTypes](struct.md#getproptypes)
* [getPropertyInitializers](struct.md#getpropertyinitializers)
* [hasAction](struct.md#hasaction)
* [hasHook](struct.md#hashook)
* [overrideHook](struct.md#overridehook)
* [registerHook](struct.md#registerhook)
* [removeHook](struct.md#removehook)
* [toPlainObject](struct.md#toplainobject)
* [validateProps](struct.md#validateprops)
* [getPropTypes](struct.md#static-getproptypes)
* [getPropertyInitializers](struct.md#static-getpropertyinitializers)

## Constructors

###  constructor

\+ **new Struct**(`props?`: [Props](../modules/types.md#props)): *[Struct](struct.md)*

Creates an instance of Struct.
Creates an instance of Struct.

**`throws`** {UndefinableClassError}
Thrown if provided class constructor has no `@define` decorator applied.

**`remarks`** 
**Property initializers** on current implementation of TypeScript v3.7 are counterintuitive
when inheritance is involved:

```ts
@define('MyClass')
class MyClass extends Struct {
 foo = 'default-value';
}
expect(
new MyClass({foo: 'set-value'}).foo
).to.be.equal('set-value'); // false, its 'default-value'
```

Normally in such cases developer expects, that - since underlying parent of
`MyClass` i.e. `Struct` class assings properties via `Object.assign` - they will
override the default values of property initializer(so the `default-value` will be
overridden by `set-value`).

**However since `MyClass` does not override constructor - that will not happen.**

This will instantiate `MyClass` with the `default-value`, and not the
expected one - `set-value`.
Conclusion from this is that property initializers are set **AFTER** the
construction - not before(where inhabitance is in play).

To **fix this issue** - define custom constructor for derived class:
```ts
@define('MyClass')
class MyClass extends Struct {
 foo = 'default-value';

 constructor(props: Partial<MyClass>) {
   super();
   Object.assign(this, this.processProps(props));
 }
}

expect(
new MyClass({foo: 'set-value'}).foo
).to.be.equal('set-value'); // true
```

**`throws`** {UndefinableClassError}
Thrown if provided class constructor has no `@define` decorator applied.

**`remarks`** 
**Property initializers** on current implementation of TypeScript v3.7 are counterintuitive
when inheritance is involved:

```ts
@define('MyClass')
class MyClass extends Struct {
 foo = 'default-value';
}
expect(
new MyClass({foo: 'set-value'}).foo
).to.be.equal('set-value'); // false, its 'default-value'
```

Normally in such cases developer expects, that - since underlying parent of
`MyClass` i.e. `Struct` class assings properties via `Object.assign` - they will
override the default values of property initializer(so the `default-value` will be
overridden by `set-value`).

**However since `MyClass` does not override constructor - that will not happen.**

This will instantiate `MyClass` with the `default-value`, and not the
expected one - `set-value`.
Conclusion from this is that property initializers are set **AFTER** the
construction - not before(where inhabitance is in play).

To **fix this issue** - define custom constructor for derived class:
```ts
@define('MyClass')
class MyClass extends Struct {
 foo = 'default-value';

 constructor(props: Partial<MyClass>) {
   super();
   Object.assign(this, this.processProps(props));
 }
}

expect(
new MyClass({foo: 'set-value'}).foo
).to.be.equal('set-value'); // true
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props?` | [Props](../modules/types.md#props) | Properties of the type required for construction. |

**Returns:** *[Struct](struct.md)*

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [Definable](../interfaces/types.definable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[equals](definablemixin.md#equals)*

*Overrides [CreateEmployee](createemployee.md).[equals](createemployee.md#equals)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

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

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [Definable](../interfaces/types.definable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [Definable](../interfaces/types.definable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

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

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Implementation of [Definable](../interfaces/types.definable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

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
