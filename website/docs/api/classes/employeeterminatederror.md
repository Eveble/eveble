---
id: "employeeterminatederror"
title: "EmployeeTerminatedError"
sidebar_label: "EmployeeTerminatedError"
---

## Type parameters

▪ **T**: *SuperConstructor*

## Hierarchy

* DomainError

  ↳ **EmployeeTerminatedError**

## Implements

* Definable
* Hookable
* Versionable
* Ejsonable

## Index

### Constructors

* [constructor](employeeterminatederror.md#constructor)

### Properties

* [code](employeeterminatederror.md#optional-code)
* [message](employeeterminatederror.md#message)
* [name](employeeterminatederror.md#name)
* [schemaVersion](employeeterminatederror.md#optional-schemaversion)
* [stack](employeeterminatederror.md#optional-stack)

### Methods

* [equals](employeeterminatederror.md#equals)
* [fillErrorProps](employeeterminatederror.md#fillerrorprops)
* [getActions](employeeterminatederror.md#getactions)
* [getHook](employeeterminatederror.md#gethook)
* [getHookOrThrow](employeeterminatederror.md#gethookorthrow)
* [getHooks](employeeterminatederror.md#gethooks)
* [getLegacyTransformer](employeeterminatederror.md#getlegacytransformer)
* [getLegacyTransformers](employeeterminatederror.md#getlegacytransformers)
* [getPropTypes](employeeterminatederror.md#getproptypes)
* [getPropertyInitializers](employeeterminatederror.md#getpropertyinitializers)
* [getSchemaVersion](employeeterminatederror.md#getschemaversion)
* [getTypeName](employeeterminatederror.md#gettypename)
* [hasAction](employeeterminatederror.md#hasaction)
* [hasHook](employeeterminatederror.md#hashook)
* [hasLegacyTransformer](employeeterminatederror.md#haslegacytransformer)
* [overrideHook](employeeterminatederror.md#overridehook)
* [overrideLegacyTransformer](employeeterminatederror.md#overridelegacytransformer)
* [registerHook](employeeterminatederror.md#registerhook)
* [registerLegacyTransformer](employeeterminatederror.md#registerlegacytransformer)
* [removeHook](employeeterminatederror.md#removehook)
* [toJSONValue](employeeterminatederror.md#tojsonvalue)
* [toPlainObject](employeeterminatederror.md#toplainobject)
* [toString](employeeterminatederror.md#tostring)
* [transformLegacyProps](employeeterminatederror.md#transformlegacyprops)
* [typeName](employeeterminatederror.md#typename)
* [validateProps](employeeterminatederror.md#validateprops)
* [getPropTypes](employeeterminatederror.md#static-getproptypes)
* [getPropertyInitializers](employeeterminatederror.md#static-getpropertyinitializers)
* [getTypeName](employeeterminatederror.md#static-gettypename)
* [toString](employeeterminatederror.md#static-tostring)
* [typeName](employeeterminatederror.md#static-typename)

## Constructors

###  constructor

\+ **new EmployeeTerminatedError**(`employeeId`: string): *[EmployeeTerminatedError](employeeterminatederror.md)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`employeeId` | string |

**Returns:** *[EmployeeTerminatedError](employeeterminatederror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [CancelingEmploymentUnavailableForEmployee](cancelingemploymentunavailableforemployee.md).[code](cancelingemploymentunavailableforemployee.md#optional-code)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[code](noquittingfoolerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [CancelingEmploymentUnavailableForEmployee](cancelingemploymentunavailableforemployee.md).[message](cancelingemploymentunavailableforemployee.md#message)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[message](noquittingfoolerror.md#message)*

___

###  name

• **name**: *string*

*Inherited from [CancelingEmploymentUnavailableForEmployee](cancelingemploymentunavailableforemployee.md).[name](cancelingemploymentunavailableforemployee.md#name)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[name](noquittingfoolerror.md#name)*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Inherited from [CancelingEmploymentUnavailableForEmployee](cancelingemploymentunavailableforemployee.md).[schemaVersion](cancelingemploymentunavailableforemployee.md#optional-schemaversion)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [CancelingEmploymentUnavailableForEmployee](cancelingemploymentunavailableforemployee.md).[stack](cancelingemploymentunavailableforemployee.md#optional-stack)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[stack](noquittingfoolerror.md#optional-stack)*

## Methods

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

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [NoQuittingFoolError](noquittingfoolerror.md).[fillErrorProps](noquittingfoolerror.md#fillerrorprops)*

Fills missing error properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) | Provided properties durning construction of error. |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*

Filled properties Object for ExtendableError instance.

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
