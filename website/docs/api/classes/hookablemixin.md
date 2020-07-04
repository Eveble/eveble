---
id: "hookablemixin"
title: "HookableMixin"
sidebar_label: "HookableMixin"
---

## Hierarchy

* **HookableMixin**

## Implements

* [Hookable](../interfaces/types.hookable.md)
* Hookable

## Index

### Methods

* [getActions](hookablemixin.md#getactions)
* [getHook](hookablemixin.md#gethook)
* [getHookOrThrow](hookablemixin.md#gethookorthrow)
* [getHooks](hookablemixin.md#gethooks)
* [hasAction](hookablemixin.md#hasaction)
* [hasHook](hookablemixin.md#hashook)
* [overrideHook](hookablemixin.md#overridehook)
* [registerHook](hookablemixin.md#registerhook)
* [removeHook](hookablemixin.md#removehook)

## Methods

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

Returns a collection of all available actions with matching registered hooks as nested collection.

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

Collection of actions(key) with matching registered hooks as nested collection(value).

___

###  getHook

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

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

*Implementation of [Hookable](../interfaces/types.hookable.md)*

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

*Implementation of [Hookable](../interfaces/types.hookable.md)*

Returns a collection of all available hooks registered for action.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hooks are resolved. |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

Collection of hooks.

___

###  hasAction

▸ **hasAction**(`action`: string): *boolean*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

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

*Implementation of [Hookable](../interfaces/types.hookable.md)*

Evaluates if hook for action with id is registered.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hook is existence is evaluated. |
`id` | string | Identifier under which hook was was registered. |

**Returns:** *boolean*

Returns true if hook exists, else false.

___

###  overrideHook

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

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

###  registerHook

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

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

Name | Type | Description |
------ | ------ | ------ |
`action` | string | Action for which hook will be registered(like `onConstruction`, `onSend`, `onPublish` etc.) |
`id` | string | Identifier under which hook will be registered for further reference. |
`hook` | [Hook](../modules/types.md#hook) | Hook as a `function` matching declaration for required action that will be invoked upon action. |
`shouldOverride?` | boolean | Flag indicating that hook should be overridden if exist. |

**Returns:** *void*

___

###  removeHook

▸ **removeHook**(`action`: string, `id`: string): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

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
