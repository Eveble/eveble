---
id: "task"
title: "Task"
sidebar_label: "Task"
---

## Type parameters

▪ **T**: *SuperConstructor*

## Hierarchy

* Entity

  ↳ **Task**

## Implements

* Stateful
* Definable
* Hookable
* Ejsonable
* Statusful
* Entity

## Index

### Constructors

* [constructor](task.md#constructor)

### Properties

* [declineReason](task.md#optional-declinereason)
* [expireAt](task.md#optional-expireat)
* [id](task.md#id)
* [name](task.md#name)
* [postponeReason](task.md#optional-postponereason)
* [postponedAt](task.md#optional-postponedat)
* [priority](task.md#priority)
* [schemaVersion](task.md#optional-schemaversion)
* [state](task.md#state)
* [status](task.md#status)

### Accessors

* [ableTo](task.md#ableto)
* [can](task.md#can)
* [ensure](task.md#ensure)
* [is](task.md#is)

### Methods

* [[ROLLBACK_STATE_METHOD_KEY]](task.md#[rollback_state_method_key])
* [[SAVE_STATE_METHOD_KEY]](task.md#[save_state_method_key])
* [accept](task.md#accept)
* [changePriority](task.md#changepriority)
* [complete](task.md#complete)
* [decline](task.md#decline)
* [equals](task.md#equals)
* [expire](task.md#expire)
* [getActions](task.md#getactions)
* [getHook](task.md#gethook)
* [getHookOrThrow](task.md#gethookorthrow)
* [getHooks](task.md#gethooks)
* [getId](task.md#getid)
* [getLegacyTransformer](task.md#getlegacytransformer)
* [getLegacyTransformers](task.md#getlegacytransformers)
* [getPropTypes](task.md#getproptypes)
* [getPropertyInitializers](task.md#getpropertyinitializers)
* [getSchemaVersion](task.md#getschemaversion)
* [getSelectableStates](task.md#getselectablestates)
* [getSelectableStatuses](task.md#getselectablestatuses)
* [getState](task.md#getstate)
* [getStatus](task.md#getstatus)
* [getTypeName](task.md#gettypename)
* [hasAction](task.md#hasaction)
* [hasHook](task.md#hashook)
* [hasLegacyTransformer](task.md#haslegacytransformer)
* [hasState](task.md#hasstate)
* [hasStatus](task.md#hasstatus)
* [hold](task.md#hold)
* [in](task.md#in)
* [isInOneOfStates](task.md#isinoneofstates)
* [isInOneOfStatuses](task.md#isinoneofstatuses)
* [isInState](task.md#isinstate)
* [isInStatus](task.md#isinstatus)
* [isStateSaved](task.md#isstatesaved)
* [on](task.md#on)
* [overrideHook](task.md#overridehook)
* [overrideLegacyTransformer](task.md#overridelegacytransformer)
* [postpone](task.md#postpone)
* [processSerializableList](task.md#processserializablelist)
* [quit](task.md#quit)
* [registerHook](task.md#registerhook)
* [registerLegacyTransformer](task.md#registerlegacytransformer)
* [removeHook](task.md#removehook)
* [setState](task.md#setstate)
* [setStatus](task.md#setstatus)
* [start](task.md#start)
* [toJSONValue](task.md#tojsonvalue)
* [toPlainObject](task.md#toplainobject)
* [toString](task.md#tostring)
* [transformLegacyProps](task.md#transformlegacyprops)
* [typeName](task.md#typename)
* [validateProps](task.md#validateprops)
* [validateState](task.md#validatestate)
* [validateStatus](task.md#validatestatus)
* [disableSerializableLists](task.md#static-disableserializablelists)
* [enableSerializableLists](task.md#static-enableserializablelists)
* [from](task.md#static-from)
* [getPropTypes](task.md#static-getproptypes)
* [getPropertyInitializers](task.md#static-getpropertyinitializers)
* [getTypeName](task.md#static-gettypename)
* [toString](task.md#static-tostring)
* [typeName](task.md#static-typename)

### Object literals

* [STATES](task.md#static-states)

## Constructors

###  constructor

\+ **new Task**(`props`: Partial‹[Task](task.md)›): *[Task](task.md)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | Partial‹[Task](task.md)› |

**Returns:** *[Task](task.md)*

## Properties

### `Optional` declineReason

• **declineReason**? : *string*

___

### `Optional` expireAt

• **expireAt**? : *Date*

___

###  id

• **id**: *string | Guid*

*Inherited from [Task](task.md).[id](task.md#id)*

___

###  name

• **name**: *string*

___

### `Optional` postponeReason

• **postponeReason**? : *string*

___

### `Optional` postponedAt

• **postponedAt**? : *Date*

___

###  priority

• **priority**: *0 | 1 | 2 | 3*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Inherited from [Task](task.md).[schemaVersion](task.md#optional-schemaversion)*

*Overrides [CreateEmployee](createemployee.md).[schemaVersion](createemployee.md#optional-schemaversion)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Inherited from [Task](task.md).[state](task.md#state)*

*Overrides void*

___

###  status

• **status**: *[Status](../modules/types.md#status)*

*Inherited from [Task](task.md).[status](task.md#status)*

*Overrides void*

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

*Inherited from [Task](task.md).[is](task.md#is)*

Method to enforce TypeScript compliance with `Asserter` and `AbilityAssertion`.

**Returns:** *this & object*

## Methods

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

###  accept

▸ **accept**(): *void*

**Returns:** *void*

___

###  changePriority

▸ **changePriority**(`priority`: 0 | 1 | 2 | 3): *void*

**Parameters:**

Name | Type |
------ | ------ |
`priority` | 0 &#124; 1 &#124; 2 &#124; 3 |

**Returns:** *void*

___

###  complete

▸ **complete**(): *void*

**Returns:** *void*

___

###  decline

▸ **decline**(`declineReason`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`declineReason` | string |

**Returns:** *void*

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

###  expire

▸ **expire**(): *void*

**Returns:** *void*

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Inherited from [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

Returns a collection of all available actions with matching registered hooks as nested collection.

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

Collection of actions(key) with matching registered hooks as nested collection(value).

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

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [CreateEmployee](createemployee.md).[getTypeName](createemployee.md#gettypename)*

Returns definable type name.

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

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

###  hold

▸ **hold**(): *void*

**Returns:** *void*

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

###  postpone

▸ **postpone**(`postponedAt`: Date): *void*

**Parameters:**

Name | Type |
------ | ------ |
`postponedAt` | Date |

**Returns:** *void*

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

###  quit

▸ **quit**(): *void*

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

###  start

▸ **start**(): *void*

**Returns:** *void*

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

Transformed legacy properties or their unchanged state if up to date.

___

###  typeName

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [CreateEmployee](createemployee.md).[typeName](createemployee.md#typename)*

**`alias`** getTypeName

**`remarks`** 
Compatibility for EJSON serializer: `@eveble/ejson`

**Returns:** *[TypeName](../modules/types.md#typename)*

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

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Inherited from [Task](task.md).[validateState](task.md#validatestate)*

Validates if instance is in allowed state(s).

**`throws`** {InvalidStateError}
Thrown if target is not in correct(one of allowed) state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] | Expected states list in one of which instance should be. |
`error?` | Error | Optional error instance for case where state does not match expected one. |

**Returns:** *boolean*

Returns `true` if instance is in correct state, else throws.

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: Error): *boolean*

*Inherited from [Task](task.md).[validateStatus](task.md#validatestatus)*

Validates if instance is in allowed status(s).

**`throws`** {InvalidStatusError}
Thrown if target is not in correct(one of allowed) status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] | Expected status list in one of which instance should be. |
`error?` | Error | Optional error instance for case where status does not match expected one. |

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

###  accepted

• **accepted**: *string* = "accepted"

###  completed

• **completed**: *string* = "completed"

###  created

• **created**: *string* = "created"

###  declined

• **declined**: *string* = "declined"

###  expired

• **expired**: *string* = "expired"

###  hold

• **hold**: *string* = "hold"

###  postponed

• **postponed**: *string* = "postponed"

###  quitted

• **quitted**: *string* = "quitted"

###  started

• **started**: *string* = "started"
