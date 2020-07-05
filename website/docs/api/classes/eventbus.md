---
id: "eventbus"
title: "EventBus"
sidebar_label: "EventBus"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[HookableMixin](hookablemixin.md) | [OneToManyHandlingMixin](onetomanyhandlingmixin.md), this› & [HookableMixin](hookablemixin.md)‹this› & [OneToManyHandlingMixin](onetomanyhandlingmixin.md)‹this›

* SuperPrototypeSelector‹HookableMixin | OneToManyHandlingMixin, this› & HookableMixin‹this› & OneToManyHandlingMixin‹this›

  ↳ **EventBus**

## Implements

* [Hookable](../interfaces/types.hookable.md)
* [Controller](../interfaces/types.controller.md)
* [EventBus](../interfaces/types.eventbus.md)
* Hookable
* Controller
* EventBus

## Index

### Constructors

* [constructor](eventbus.md#constructor)

### Methods

* [ensureHandleability](eventbus.md#ensurehandleability)
* [getActions](eventbus.md#getactions)
* [getHandleableTypes](eventbus.md#gethandleabletypes)
* [getHandled](eventbus.md#gethandled)
* [getHandledCommands](eventbus.md#gethandledcommands)
* [getHandledEvents](eventbus.md#gethandledevents)
* [getHandledMessages](eventbus.md#gethandledmessages)
* [getHandledTypes](eventbus.md#gethandledtypes)
* [getHandledTypesNames](eventbus.md#gethandledtypesnames)
* [getHandler](eventbus.md#gethandler)
* [getHandlerOrThrow](eventbus.md#gethandlerorthrow)
* [getHandlers](eventbus.md#gethandlers)
* [getHook](eventbus.md#gethook)
* [getHookOrThrow](eventbus.md#gethookorthrow)
* [getHooks](eventbus.md#gethooks)
* [getTypeByHandler](eventbus.md#gettypebyhandler)
* [handle](eventbus.md#handle)
* [handles](eventbus.md#handles)
* [hasAction](eventbus.md#hasaction)
* [hasHandler](eventbus.md#hashandler)
* [hasHook](eventbus.md#hashook)
* [initialize](eventbus.md#initialize)
* [isHandleabe](eventbus.md#ishandleabe)
* [onPublish](eventbus.md#onpublish)
* [overrideHandler](eventbus.md#overridehandler)
* [overrideHook](eventbus.md#overridehook)
* [publish](eventbus.md#publish)
* [registerHandler](eventbus.md#registerhandler)
* [registerHook](eventbus.md#registerhook)
* [removeHandler](eventbus.md#removehandler)
* [removeHook](eventbus.md#removehook)
* [setHandleableTypes](eventbus.md#sethandleabletypes)
* [subscribeTo](eventbus.md#subscribeto)
* [subscribes](eventbus.md#subscribes)

## Constructors

###  constructor

\+ **new EventBus**(): *[EventBus](eventbus.md)*

*Overrides [HandlingMixin](handlingmixin.md).[constructor](handlingmixin.md#constructor)*

Creates an instance of CommandBus.
Creates an instance of CommandBus.

**Returns:** *[EventBus](eventbus.md)*

## Methods

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[ensureHandleability](handlingmixin.md#ensurehandleability)*

*Overrides [CancelingEmployment](cancelingemployment.md).[ensureHandleability](cancelingemployment.md#ensurehandleability)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handleableTypes?` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *boolean*

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getActions](hookablemixin.md#getactions)*

*Overrides [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getHandleableTypes

▸ **getHandleableTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandleableTypes](handlingmixin.md#gethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandleableTypes](cancelingemployment.md#gethandleabletypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandled](handlingmixin.md#gethandled)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandled](cancelingemployment.md#gethandled)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledCommands

▸ **getHandledCommands**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledCommands](handlingmixin.md#gethandledcommands)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledCommands](cancelingemployment.md#gethandledcommands)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

___

###  getHandledEvents

▸ **getHandledEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledEvents](handlingmixin.md#gethandledevents)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledEvents](cancelingemployment.md#gethandledevents)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

___

###  getHandledMessages

▸ **getHandledMessages**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledMessages](handlingmixin.md#gethandledmessages)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledMessages](cancelingemployment.md#gethandledmessages)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledTypes](handlingmixin.md#gethandledtypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledTypes](cancelingemployment.md#gethandledtypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledTypesNames

▸ **getHandledTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledTypesNames](handlingmixin.md#gethandledtypesnames)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledTypesNames](cancelingemployment.md#gethandledtypesnames)*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

___

###  getHandler

▸ **getHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)[] | undefined*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getHandler](onetomanyhandlingmixin.md#gethandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler)[] | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)[]*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getHandlerOrThrow](onetomanyhandlingmixin.md#gethandlerorthrow)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler)[]*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandlers](handlingmixin.md#gethandlers)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandlers](cancelingemployment.md#gethandlers)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

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

###  getTypeByHandler

▸ **getTypeByHandler**(`handlerReference`: [Handler](../modules/types.md#handler)): *any | undefined*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[getTypeByHandler](onetomanyhandlingmixin.md#gettypebyhandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`handlerReference` | [Handler](../modules/types.md#handler) |

**Returns:** *any | undefined*

___

###  handle

▸ **handle**(`event`: [Event](../interfaces/types.event.md)): *Promise‹void›*

*Overrides [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[handle](onetomanyhandlingmixin.md#handle)*

Handles event instance concurrently.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [Event](../interfaces/types.event.md) | An instance of `Event` type.  |

**Returns:** *Promise‹void›*

___

###  handles

▸ **handles**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[handles](handlingmixin.md#handles)*

*Overrides [CancelingEmployment](cancelingemployment.md).[handles](cancelingemployment.md#handles)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

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

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *boolean*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[hasHandler](handlingmixin.md#hashandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[hasHandler](cancelingemployment.md#hashandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

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

###  initialize

▸ **initialize**(): *void*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[initialize](onetomanyhandlingmixin.md#initialize)*

*Overrides void*

**Returns:** *void*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Inherited from [HandlingMixin](handlingmixin.md).[isHandleabe](handlingmixin.md#ishandleabe)*

*Overrides [CancelingEmployment](cancelingemployment.md).[isHandleabe](cancelingemployment.md#ishandleabe)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handleableTypes?` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *boolean*

___

###  onPublish

▸ **onPublish**(`id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

Registers `onPublish` callback hook.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | Identifier under which `onPublish` hook will be defined. |
`hook` | [Hook](../modules/types.md#hook) | Function that will be executed upon publishing `Event`. |
`shouldOverride?` | boolean | Flag indicating that hook should be overridden if exist.  |

**Returns:** *void*

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[overrideHandler](handlingmixin.md#overridehandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[overrideHandler](cancelingemployment.md#overridehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

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

###  publish

▸ **publish**(`event`: [Event](../interfaces/types.event.md)): *Promise‹void›*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

**`alias`** handle

**`async`** 

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](../interfaces/types.event.md) |

**Returns:** *Promise‹void›*

___

###  registerHandler

▸ **registerHandler**(`eventType`: [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Overrides [OneToManyHandlingMixin](onetomanyhandlingmixin.md).[registerHandler](onetomanyhandlingmixin.md#registerhandler)*

Registers handler for event.

**`throws`** {UnhandleableTypeError}
Thrown if the type argument is not subclass of `Event` type.

**`throws`** {InvalidHandlerError}
Thrown if the handler argument is not a function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`eventType` | [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)› | A subclass of `Event` type. |
`handler` | [Handler](../modules/types.md#handler) | Handler function that will executed upon handling type. |
`shouldOverride?` | boolean | Flag indicating that handler should be overridden if exist. |

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

###  removeHandler

▸ **removeHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *void*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[removeHandler](handlingmixin.md#removehandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[removeHandler](cancelingemployment.md#removehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

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

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *void*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[setHandleableTypes](handlingmixin.md#sethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[setHandleableTypes](cancelingemployment.md#sethandleabletypes)*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *void*

___

###  subscribeTo

▸ **subscribeTo**(`eventType`: [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

Subscribes to event with handler.

**`alias`** registerHandler

**Parameters:**

Name | Type |
------ | ------ |
`eventType` | [MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [EventBus](../interfaces/types.eventbus.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[subscribes](handlingmixin.md#subscribes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[subscribes](cancelingemployment.md#subscribes)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*
