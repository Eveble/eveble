---
id: "config"
title: "Config"
sidebar_label: "Config"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [Struct](struct.md)

* Struct

  ↳ **Config**

  ↳ [LogTransportConfig](logtransportconfig.md)

  ↳ [LoggingConfig](loggingconfig.md)

  ↳ [EvebleConfig](evebleconfig.md)

  ↳ [AppConfig](appconfig.md)

  ↳ [MongoDBCollectionConfig](mongodbcollectionconfig.md)

  ↳ [MongoDBDatabaseConfig](mongodbdatabaseconfig.md)

## Implements

* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Configurable](../interfaces/types.configurable.md)
* Definable
* Hookable
* Configurable

## Index

### Constructors

* [constructor](config.md#constructor)

### Properties

* [included](config.md#optional-included)
* [merged](config.md#optional-merged)

### Methods

* [assign](config.md#assign)
* [equals](config.md#equals)
* [get](config.md#get)
* [getActions](config.md#getactions)
* [getDefault](config.md#getdefault)
* [getExact](config.md#getexact)
* [getHook](config.md#gethook)
* [getHookOrThrow](config.md#gethookorthrow)
* [getHooks](config.md#gethooks)
* [getPropTypes](config.md#getproptypes)
* [getPropertyInitializers](config.md#getpropertyinitializers)
* [has](config.md#has)
* [hasAction](config.md#hasaction)
* [hasDefault](config.md#hasdefault)
* [hasHook](config.md#hashook)
* [include](config.md#include)
* [isConfigurable](config.md#isconfigurable)
* [merge](config.md#merge)
* [overrideHook](config.md#overridehook)
* [registerHook](config.md#registerhook)
* [removeHook](config.md#removehook)
* [set](config.md#set)
* [toPlainObject](config.md#toplainobject)
* [validateProps](config.md#validateprops)
* [from](config.md#static-from)
* [getPropTypes](config.md#static-getproptypes)
* [getPropertyInitializers](config.md#static-getpropertyinitializers)

## Constructors

###  constructor

\+ **new Config**(): *[Config](config.md)*

*Overrides [Struct](struct.md).[constructor](struct.md#constructor)*

Creates an instance of Config.
Creates an instance of Config.

**`example`** 
```ts
@define()
class MyConfig extends Config {
  appId: string
  logging: {
    isEnabled = true,
    level: 'debug' | 'info'
  }

  constructor(props: Partial<MyConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}
```

**`example`** 
```ts
@define()
class MyConfig extends Config {
  appId: string
  logging: {
    isEnabled = true,
    level: 'debug' | 'info'
  }

  constructor(props: Partial<MyConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}
```

**Returns:** *[Config](config.md)*

## Properties

### `Optional` included

• **included**? : *Record‹string, Configurable›*

___

### `Optional` merged

• **merged**? : *Record‹string, Configurable›*

## Methods

###  assign

▸ **assign**(`props`: [Props](../modules/types.md#props)): *void*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Assign collection of values to configuration.

**`throws`** {ValidationError}
Thrown if the provided properties does not match prop types.

**`example`** 
```ts
@define()
class MyConfig extends Config {
  appId: string
  logging: {
    isEnabled = true,
    level: 'debug' | 'info'
  }

  constructor(props: Partial<MyConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

const config = new MyAppConfig({
  appId: 'my-app-id',
  logging: {isEnabled: true, level: 'debug'}
});

const newProps = {
  appId: 'my-other-app-id',
  logging: {isEnabled: false, level: 'info'}
};
config.assign(newProps);
expect(config).to.be.eql(newProps);
expect(() =>
  config.assign({invalidKey: 'invalid-value'})
).to.throw(ValidationError);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [Props](../modules/types.md#props) | Properties with relation path: value matching prop types. |

**Returns:** *void*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[equals](definablemixin.md#equals)*

*Overrides [CreateEmployee](createemployee.md).[equals](createemployee.md#equals)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  get

▸ **get**‹**T**›(`path`: string, `runtimeDefaultValue?`: T): *T | any*

Returns value from configuration, included ones or default fallbacks.

**`example`** 
```ts
@define()
class MyConfig extends Config {
  appId: string
  logging: {
    isEnabled = true,
    level: 'debug' | 'info'
  }

  constructor(props: Partial<MyConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

const config = new MyAppConfig({
  appId: 'my-app-id',
  logging: {isEnabled: true, level: 'debug'}
})

expect(config.get('appId')).to.be.equal('my-app-id');
expect(config.get('logging.level')).to.be.equal('debug');

expect(
  config.get('logging.nonExistentPath', 'my-runtime-fallback')
).to.be.equal('my-runtime-fallback');
```

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | Configuration path using dotted notation for nested objects. |
`runtimeDefaultValue?` | T | Value that will be returned as default if no value is set on configuration. |

**Returns:** *T | any*

Resolved value from instance if its found on path; value from other included configurations; the runtime default value(if provided) or undefined.

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getActions](hookablemixin.md#getactions)*

*Overrides [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getDefault

▸ **getDefault**‹**T**›(`path`: string): *T | any*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Returns default value for configuration(if property initializers are set) or included ones.

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | Configuration path using dotted notation for nested objects. |

**Returns:** *T | any*

Resolved default value or undefined.

___

###  getExact

▸ **getExact**‹**T**›(`path`: string): *T | any*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Returns exact value set on configuration or included ones(without any fallback in place).

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | Configuration path using dotted notation for nested objects. |

**Returns:** *T | any*

Resolved value if its found over provided path or value from other included configurations.

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

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Overrides [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

Returns all prop types from whole inheritance tree and other included configurations.

**Returns:** *[Props](../modules/types.md#props)*

Plain object representation of prop types.

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  has

▸ **has**(`path`: string): *boolean*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Evaluates if value is set on configuration or included ones.

**`example`** 
```ts
@define()
class MyConfig extends Config {
  appId: string
  logging: {
    isEnabled = true,
    level: 'debug' | 'info'
  }

  constructor(props: Partial<MyConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

const config = new MyAppConfig({
  appId: 'my-app-id',
  logging: {isEnabled: true, level: 'debug'}
})
expect(config.has('appId')).to.be.true;
expect(config.has('logging.level')).to.be.true;
expect(config.has('logging.nonExistentPath')).to.be.false;
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | Configuration path using dotted notation for nested objects. |

**Returns:** *boolean*

Returns `true` if configuration is set under questioned path, else `false`.

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

###  hasDefault

▸ **hasDefault**(`path`: string): *boolean*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Evaluates if there is default value set for path on configuration or included ones.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | Configuration path using dotted notation for nested objects. |

**Returns:** *boolean*

Returns `true` if default value is set on configuration, else `false`.

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

###  include

▸ **include**(`config`: [Configurable](../interfaces/types.configurable.md)): *void*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Attaches another configuration instance to current configuration.

**`throws`** {InvalidConfigError}
Thrown if the passed configuration is not implementation of `Configurable` interface.

**`example`** 
```ts
@define('First')
class First extends Config {
  firstKey: string;

  constructor(props: Partial<First>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

@define('Second')
class Second extends Config {
  secondKey: string;

  constructor(props: Partial<Second>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

const first = new First({ firstKey: 'first' });
const second = new Second({ secondKey: 'second' });
first.include(second);

expect(first.included).to.be.eql({ Second: second });
expect(first.get('firstKey')).to.be.equal('first');
expect(first.get('secondKey')).to.be.equal('second');
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [Configurable](../interfaces/types.configurable.md) | Instance implementing `Configurable` interface. |

**Returns:** *void*

___

###  isConfigurable

▸ **isConfigurable**(`path`: string): *boolean*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Evaluates if value can be configured on specific path.

**`example`** 
```ts
@define()
class MyConfig extends Config {
  appId: string
  logging: {
    isEnabled = true,
    level: 'debug' | 'info'
  }

  constructor(props: Partial<MyConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

const config = new MyAppConfig()
expect(config.isConfigurable('appId')).to.be.true;
expect(config.isConfigurable('logging.level')).to.be.true;
expect(config.isConfigurable('logging.nonExistentPath')).to.be.false;
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | Configuration path using dotted notation for nested objects. |

**Returns:** *boolean*

Returns `true` if property on path is configurable on configuration, else `false`.

___

###  merge

▸ **merge**(`config`: [Configurable](../interfaces/types.configurable.md)): *void*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Attaches another configuration instance to current configuration and merges
all properties. Parent configuration merging child will always have precedence
in values assigned on same paths.

**`throws`** {InvalidConfigError}
Thrown if the passed configuration is not implementation of `Configurable` interface.
```ts
@define('Config.First')
class First extends Config {
  key = 'first-key';

  foo = 'first-foo';

  constructor(props: Partial<First>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

@define('Config.Second')
class Second extends Config {
  key = 'second-key';

  baz = 'second-baz';

  constructor(props: Partial<Second>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

const first = new First({
  key: 'first-key',
  foo: 'first-foo',
});
const second = new Second({
  key: 'second-key',
  baz: 'second-baz',
});

first.merge(second);
expect(first.getPropTypes()).to.be.eql({
  included: PropTypes.interface({}).isOptional,
  merged: PropTypes.interface({}).isOptional,
  foo: PropTypes.instanceOf(String),
  key: PropTypes.instanceOf(String),
  baz: PropTypes.instanceOf(String),
});

expect(first).to.be.eql({
  merged: { 'Config.Second': second },
  foo: 'first-foo',
  baz: 'second-baz',
  key: 'first-key',
});
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [Configurable](../interfaces/types.configurable.md) | Instance implementing `Configurable` interface. |

**Returns:** *void*

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

###  set

▸ **set**‹**T**›(`path`: string, `value`: T): *void*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

Sets a value on configuration.

**`throws`** {ValidationError}
Thrown if the provided value does not match the prop types.

**`example`** 
```ts
@define()
class MyConfig extends Config {
  appId: string
  logging: {
    isEnabled = true,
    level: 'debug' | 'info'
  }

  constructor(props: Partial<MyConfig>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

const config = new MyAppConfig({
  appId: 'my-app-id',
  logging: {isEnabled: true, level: 'debug'}
});

config.set('appId', 'set-id')
config.set('logging.level', 'info')

expect(config.get('appId')).to.be.equal('set-id');
expect(config.get('logging.level')).to.be.equal('info');

expect(() =>
  config.set('appId', 1337)
).to.throw(ValidationError)
expect(() =>
  config.set('logging.nonExistentPath', 'my-value')
).to.throw(ValidationError)
```

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | Configuration path using dotted notation for nested objects. |
`value` | T | Value to be set on configuration. |

**Returns:** *void*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

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

### `Static` from

▸ **from**‹**T**›(`props`: Record‹string, any›): *T*

Create an `Config` from plain object source of properties.

**`throws`** {ValidationError}
Thrown if the passed properties does not match config property types.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | Record‹string, any› | Properties as object that can contains other nested configurations. |

**Returns:** *T*

New instance of `Config` with assigned properties.

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
