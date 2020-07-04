---
id: "tasklistopened"
title: "TaskListOpened"
sidebar_label: "TaskListOpened"
---

## Type parameters

▪ **T**: *SuperConstructor*

## Hierarchy

* Event

  ↳ **TaskListOpened**

## Implements

* Definable
* Hookable
* Ejsonable
* Message
* Event
* Identifiable

## Index

### Constructors

* [constructor](tasklistopened.md#constructor)

### Properties

* [metadata](tasklistopened.md#metadata)
* [schemaVersion](tasklistopened.md#optional-schemaversion)
* [sourceId](tasklistopened.md#sourceid)
* [tasks](tasklistopened.md#tasks)
* [timestamp](tasklistopened.md#timestamp)
* [title](tasklistopened.md#title)
* [version](tasklistopened.md#optional-version)

### Methods

* [assignMetadata](tasklistopened.md#assignmetadata)
* [equals](tasklistopened.md#equals)
* [getActions](tasklistopened.md#getactions)
* [getCorrelationId](tasklistopened.md#getcorrelationid)
* [getHook](tasklistopened.md#gethook)
* [getHookOrThrow](tasklistopened.md#gethookorthrow)
* [getHooks](tasklistopened.md#gethooks)
* [getId](tasklistopened.md#getid)
* [getLegacyTransformer](tasklistopened.md#getlegacytransformer)
* [getLegacyTransformers](tasklistopened.md#getlegacytransformers)
* [getMetadata](tasklistopened.md#getmetadata)
* [getPropTypes](tasklistopened.md#getproptypes)
* [getPropertyInitializers](tasklistopened.md#getpropertyinitializers)
* [getSchemaVersion](tasklistopened.md#getschemaversion)
* [getTimestamp](tasklistopened.md#gettimestamp)
* [getTypeName](tasklistopened.md#gettypename)
* [hasAction](tasklistopened.md#hasaction)
* [hasCorrelationId](tasklistopened.md#hascorrelationid)
* [hasHook](tasklistopened.md#hashook)
* [hasLegacyTransformer](tasklistopened.md#haslegacytransformer)
* [hasMetadata](tasklistopened.md#hasmetadata)
* [in](tasklistopened.md#in)
* [overrideHook](tasklistopened.md#overridehook)
* [overrideLegacyTransformer](tasklistopened.md#overridelegacytransformer)
* [processSerializableList](tasklistopened.md#processserializablelist)
* [registerHook](tasklistopened.md#registerhook)
* [registerLegacyTransformer](tasklistopened.md#registerlegacytransformer)
* [removeHook](tasklistopened.md#removehook)
* [setCorrelationId](tasklistopened.md#setcorrelationid)
* [toJSONValue](tasklistopened.md#tojsonvalue)
* [toPlainObject](tasklistopened.md#toplainobject)
* [toString](tasklistopened.md#tostring)
* [transformLegacyProps](tasklistopened.md#transformlegacyprops)
* [typeName](tasklistopened.md#typename)
* [validateProps](tasklistopened.md#validateprops)
* [disableSerializableLists](tasklistopened.md#static-disableserializablelists)
* [enableSerializableLists](tasklistopened.md#static-enableserializablelists)
* [from](tasklistopened.md#static-from)
* [getPropTypes](tasklistopened.md#static-getproptypes)
* [getPropertyInitializers](tasklistopened.md#static-getpropertyinitializers)
* [getTypeName](tasklistopened.md#static-gettypename)
* [toString](tasklistopened.md#static-tostring)
* [typeName](tasklistopened.md#static-typename)

## Constructors

###  constructor

\+ **new TaskListOpened**(`props`: [Props](../modules/types.md#props)): *[TaskListOpened](tasklistopened.md)*

*Inherited from [EmployeeCreated](employeecreated.md).[constructor](employeecreated.md#constructor)*

*Overrides void*

Creates an instance of Event.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`props` | [Props](../modules/types.md#props) | {} | Properties of the type required for construction.  |

**Returns:** *[TaskListOpened](tasklistopened.md)*

## Properties

###  metadata

• **metadata**: *Record‹string, any›*

*Inherited from [CreateEmployee](createemployee.md).[metadata](createemployee.md#metadata)*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Inherited from [CreateEmployee](createemployee.md).[schemaVersion](createemployee.md#optional-schemaversion)*

*Overrides void*

___

###  sourceId

• **sourceId**: *Guid | string*

*Inherited from [EmployeeCreated](employeecreated.md).[sourceId](employeecreated.md#sourceid)*

___

###  tasks

• **tasks**: *[Task](task.md)[]*

___

###  timestamp

• **timestamp**: *Date*

*Inherited from [CreateEmployee](createemployee.md).[timestamp](createemployee.md#timestamp)*

___

###  title

• **title**: *string*

___

### `Optional` version

• **version**? : *number*

*Inherited from [EmployeeCreated](employeecreated.md).[version](employeecreated.md#optional-version)*

## Methods

###  assignMetadata

▸ **assignMetadata**(`props`: Record‹string, any›): *void*

*Inherited from [CreateEmployee](createemployee.md).[assignMetadata](createemployee.md#assignmetadata)*

Assigns metadata to message.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | Record‹string, any› | Metadata properties object with all information related to `Message`.  |

**Returns:** *void*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Inherited from [CreateEmployee](createemployee.md).[equals](createemployee.md#equals)*

Evaluates if value and value's type of passed other instance are equal to current one.

**`example`** 
```ts
class Person extends DefinableMixin {
  firstName: string;
  lastName: string;
  age: number;

  constructor(firstName: string, lastName: string, age: number) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}
const firstPerson = new Person('Jane', 'Doe', 28);
const secondPerson = new Person('Jane', 'Doe', 28);
expect(firstPerson.equals(secondPerson)).to.be.true;
```

**`example`** 
```ts
const firstPerson = new Person('Jane', 'Doe', 28);
const secondPerson = new Person('John', 'Doe', 30);
expect(firstPerson.equals(secondPerson)).to.be.false;
```

**`example`** 
```ts
const firstPerson = new Person('Jane', 'Doe', 28);
const secondPerson = {firstName: 'John', lastName: 'Doe', age: 30);
expect(firstPerson.equals(secondPerson)).to.be.false;
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`other` | any | Other instance of DefinableMixin. |

**Returns:** *boolean*

Returns `true` if other instance of DefinableMixin is equal, else `false`.

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Inherited from [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

Returns a collection of all available actions with matching registered hooks as nested collection.

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

Collection of actions(key) with matching registered hooks as nested collection(value).

___

###  getCorrelationId

▸ **getCorrelationId**(`key`: string): *string | undefined*

*Inherited from [CreateEmployee](createemployee.md).[getCorrelationId](createemployee.md#getcorrelationid)*

Returns metadata correlation id for message.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Key under which correlation is set with support of dotted notation for nested objects. |

**Returns:** *string | undefined*

String identifier of correlating element.

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

▸ **getId**(): *Guid | string*

*Inherited from [EmployeeCreated](employeecreated.md).[getId](employeecreated.md#getid)*

Returns event's originating source by id.

**Returns:** *Guid | string*

Event's source identifier as a instance of `Guid` or string.

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

###  getMetadata

▸ **getMetadata**(): *Record‹string, any›*

*Inherited from [CreateEmployee](createemployee.md).[getMetadata](createemployee.md#getmetadata)*

Returns metadata assigned to the message.

**Returns:** *Record‹string, any›*

Returns metadata assigned to the message as an object.

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

###  getTimestamp

▸ **getTimestamp**(): *Date*

*Inherited from [CreateEmployee](createemployee.md).[getTimestamp](createemployee.md#gettimestamp)*

Returns time when message was created.

**Returns:** *Date*

Returns instance of `Date`.

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

###  hasCorrelationId

▸ **hasCorrelationId**(`key`: string): *boolean*

*Inherited from [CreateEmployee](createemployee.md).[hasCorrelationId](createemployee.md#hascorrelationid)*

Evaluates if message contains correlation id on metadata.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Key under which correlation is set with support of dotted notation for nested objects. |

**Returns:** *boolean*

Returns `true` if metadata contains correlated element, else `false`.

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

###  hasMetadata

▸ **hasMetadata**(): *boolean*

*Inherited from [CreateEmployee](createemployee.md).[hasMetadata](createemployee.md#hasmetadata)*

Evaluates if there is assigned metadata to message.

**Returns:** *boolean*

Returns true if `message` has assigned metadata, else `false`.

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

###  setCorrelationId

▸ **setCorrelationId**(`key`: string, `id`: Stringifiable): *void*

*Inherited from [CreateEmployee](createemployee.md).[setCorrelationId](createemployee.md#setcorrelationid)*

Sets correlation id metadata on message.

**`remarks`** 
**Databases like MongoDB does not support object keys with dots like: `my.nested.key`**
Since for correlation key - namespaced 'type name' like `MyNamespace.MyMessage`
can be used we utilize lodash'es 'set' method to construct nested object from
such notation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Key under which correlation is set with support of dotted notation for nested objects. |
`id` | Stringifiable | Identifier of correlating element. |

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

Transformed legacy properties or thier unchanged state if up to date.

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
