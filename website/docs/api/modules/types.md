---
id: "types"
title: "@eveble/eveble"
sidebar_label: "README"
---

## Index

### Namespaces

* [hooks](types.hooks.md)
* [node](types.node.md)

### Interfaces

* [AgendaJobTransformer](../interfaces/types.agendajobtransformer.md)
* [App](../interfaces/types.app.md)
* [AppType](../interfaces/types.apptype.md)
* [Asserter](../interfaces/types.asserter.md)
* [Assertion](../interfaces/types.assertion.md)
* [Assignment](../interfaces/types.assignment.md)
* [BaseApp](../interfaces/types.baseapp.md)
* [Client](../interfaces/types.client.md)
* [Command](../interfaces/types.command.md)
* [CommandBus](../interfaces/types.commandbus.md)
* [CommandScheduler](../interfaces/types.commandscheduler.md)
* [Commit](../interfaces/types.commit.md)
* [CommitObserver](../interfaces/types.commitobserver.md)
* [CommitPublisher](../interfaces/types.commitpublisher.md)
* [CommitReceiver](../interfaces/types.commitreceiver.md)
* [CommitSerializer](../interfaces/types.commitserializer.md)
* [CommitStorage](../interfaces/types.commitstorage.md)
* [CommitStore](../interfaces/types.commitstore.md)
* [Configurable](../interfaces/types.configurable.md)
* [Constructor](../interfaces/types.constructor.md)
* [Controller](../interfaces/types.controller.md)
* [Converter](../interfaces/types.converter.md)
* [Definable](../interfaces/types.definable.md)
* [Ejsonable](../interfaces/types.ejsonable.md)
* [Entity](../interfaces/types.entity.md)
* [Event](../interfaces/types.event.md)
* [EventBus](../interfaces/types.eventbus.md)
* [EventSourceable](../interfaces/types.eventsourceable.md)
* [EventSourceableRepository](../interfaces/types.eventsourceablerepository.md)
* [EventSourceableType](../interfaces/types.eventsourceabletype.md)
* [Hookable](../interfaces/types.hookable.md)
* [Identifiable](../interfaces/types.identifiable.md)
* [Injector](../interfaces/types.injector.md)
* [Library](../interfaces/types.library.md)
* [List](../interfaces/types.list.md)
* [LogConverter](../interfaces/types.logconverter.md)
* [LogEntry](../interfaces/types.logentry.md)
* [LogFormatter](../interfaces/types.logformatter.md)
* [LogMetadata](../interfaces/types.logmetadata.md)
* [LogTransport](../interfaces/types.logtransport.md)
* [Loggable](../interfaces/types.loggable.md)
* [Logger](../interfaces/types.logger.md)
* [Message](../interfaces/types.message.md)
* [MessageType](../interfaces/types.messagetype.md)
* [Module](../interfaces/types.module.md)
* [ModuleType](../interfaces/types.moduletype.md)
* [MongoDBSerializedCommit](../interfaces/types.mongodbserializedcommit.md)
* [Projection](../interfaces/types.projection.md)
* [ProjectionRebuilder](../interfaces/types.projectionrebuilder.md)
* [Publisher](../interfaces/types.publisher.md)
* [Router](../interfaces/types.router.md)
* [RouterType](../interfaces/types.routertype.md)
* [ScheduleCommand](../interfaces/types.schedulecommand.md)
* [ScheduledJob](../interfaces/types.scheduledjob.md)
* [Sender](../interfaces/types.sender.md)
* [Serializable](../interfaces/types.serializable.md)
* [Serializer](../interfaces/types.serializer.md)
* [Service](../interfaces/types.service.md)
* [SnapshotSerializer](../interfaces/types.snapshotserializer.md)
* [SnapshotStorage](../interfaces/types.snapshotstorage.md)
* [Snapshotter](../interfaces/types.snapshotter.md)
* [Stateful](../interfaces/types.stateful.md)
* [Statusful](../interfaces/types.statusful.md)
* [Stringifiable](../interfaces/types.stringifiable.md)
* [UnscheduleCommand](../interfaces/types.unschedulecommand.md)
* [Versionable](../interfaces/types.versionable.md)

### Type aliases

* [ActionInvokingOptions](types.md#actioninvokingoptions)
* [AnyFunction](types.md#anyfunction)
* [AppProps](types.md#appprops)
* [Class](types.md#class)
* [ClassDecorator](types.md#classdecorator)
* [ConfigProps](types.md#configprops)
* [Describer](types.md#describer)
* [ErrorProps](types.md#errorprops)
* [Execution](types.md#execution)
* [Handler](types.md#handler)
* [Hook](types.md#hook)
* [KernelConfig](types.md#kernelconfig)
* [LegacyTransformers](types.md#legacytransformers)
* [LogFormatting](types.md#logformatting)
* [LogLevel](types.md#loglevel)
* [LogLevels](types.md#loglevels)
* [MethodDecorator](types.md#methoddecorator)
* [ModuleProps](types.md#moduleprops)
* [MongoDBSerializedType](types.md#mongodbserializedtype)
* [ParameterDecorator](types.md#parameterdecorator)
* [Primitive](types.md#primitive)
* [Priority](types.md#priority)
* [PropTypes](types.md#proptypes)
* [PropertyDecorator](types.md#propertydecorator)
* [Props](types.md#props)
* [Prototype](types.md#prototype)
* [RFC5424Levels](types.md#rfc5424levels)
* [State](types.md#state)
* [Status](types.md#status)
* [StorageIdentifiers](types.md#storageidentifiers)
* [Type](types.md#type)
* [TypeName](types.md#typename)
* [Validator](types.md#validator)

## Type aliases

###  ActionInvokingOptions

Ƭ **ActionInvokingOptions**: *object*

#### Type declaration:

* **isLoggable**: *boolean*

___

###  AnyFunction

Ƭ **AnyFunction**: *function*

#### Type declaration:

▸ (...`args`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

___

###  AppProps

Ƭ **AppProps**: *[ModuleProps](types.md#moduleprops) & object*

___

###  Class

Ƭ **Class**: *object*

#### Type declaration:

___

###  ClassDecorator

Ƭ **ClassDecorator**: *function*

#### Type declaration:

▸ ‹**TFunction**›(`target`: TFunction): *TFunction | void*

**Type parameters:**

▪ **TFunction**: *Function*

**Parameters:**

Name | Type |
------ | ------ |
`target` | TFunction |

___

###  ConfigProps

Ƭ **ConfigProps**: *object*

#### Type declaration:

* \[ **path**: *string*\]: any

___

###  Describer

Ƭ **Describer**: *object*

#### Type declaration:

* **describe**(`source`: any): *string*

* **setFormatting**(`formatting`: typendTypes.DescriberFormatting): *void*

___

###  ErrorProps

Ƭ **ErrorProps**: *object*

#### Type declaration:

* **code**? : *number*

* **message**: *string*

* **name**? : *string*

* **stack**? : *string*

___

###  Execution

Ƭ **Execution**: *"sequential" | "concurrent"*

___

###  Handler

Ƭ **Handler**: *function*

#### Type declaration:

▸ (`message`: Message): *any*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Message |

___

###  Hook

Ƭ **Hook**: *[AnyFunction](types.md#anyfunction)*

___

###  KernelConfig

Ƭ **KernelConfig**: *object*

#### Type declaration:

* **conversion**(): *object*

  * **type**: *"manual" | "runtime"*

* **describer**(): *object*

  * **formatting**: *"default" | "compact" | "debug"*

* **validation**(): *object*

  * **type**: *"manual" | "runtime"*

___

###  LegacyTransformers

Ƭ **LegacyTransformers**: *Map‹number, [Hook](types.md#hook)›*

___

###  LogFormatting

Ƭ **LogFormatting**: *object*

#### Type declaration:

* **inspectDepth**? : *number*

* **isColored**? : *boolean*

* **isSimple**? : *boolean*

___

###  LogLevel

Ƭ **LogLevel**: *string*

___

###  LogLevels

Ƭ **LogLevels**: *Record‹string, [Priority](types.md#priority)›*

___

###  MethodDecorator

Ƭ **MethodDecorator**: *function*

#### Type declaration:

▸ ‹**T**›(`target`: Record‹keyof any, any›, `propertyKey`: string | symbol, `descriptor`: TypedPropertyDescriptor‹T›): *TypedPropertyDescriptor‹T› | void*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`target` | Record‹keyof any, any› |
`propertyKey` | string &#124; symbol |
`descriptor` | TypedPropertyDescriptor‹T› |

___

###  ModuleProps

Ƭ **ModuleProps**: *object*

#### Type declaration:

* \[ **key**: *string*\]: any | object

___

###  MongoDBSerializedType

Ƭ **MongoDBSerializedType**: *object*

#### Type declaration:

* \[ **key**: *string*\]: any

* **_type**: *string*

___

###  ParameterDecorator

Ƭ **ParameterDecorator**: *function*

#### Type declaration:

▸ (`target`: Record‹keyof any, any›, `propertyKey`: string | symbol, `parameterIndex`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`target` | Record‹keyof any, any› |
`propertyKey` | string &#124; symbol |
`parameterIndex` | number |

___

###  Primitive

Ƭ **Primitive**: *any | string | number | boolean | symbol | void | undefined | null | never | unknown*

___

###  Priority

Ƭ **Priority**: *number*

___

###  PropTypes

Ƭ **PropTypes**: *Record‹keyof any, typendTypes.Expectation›*

___

###  PropertyDecorator

Ƭ **PropertyDecorator**: *function*

#### Type declaration:

▸ (`target`: Record‹keyof any, any›, `propertyKey`: string | symbol): *void*

**Parameters:**

Name | Type |
------ | ------ |
`target` | Record‹keyof any, any› |
`propertyKey` | string &#124; symbol |

___

###  Props

Ƭ **Props**: *Record‹keyof any, any›*

___

###  Prototype

Ƭ **Prototype**: *Record‹keyof any, any›*

___

###  RFC5424Levels

Ƭ **RFC5424Levels**: *object*

#### Type declaration:

* **alert**(`entry`: string | LogEntry, ...`args`: any[]): *void*

* **crit**(`entry`: string | LogEntry, ...`args`: any[]): *void*

* **debug**(`entry`: string | LogEntry, ...`args`: any[]): *void*

* **emerg**(`entry`: string | LogEntry, ...`args`: any[]): *void*

* **error**(`entry`: string | LogEntry, ...`args`: any[]): *void*

* **info**(`entry`: string | LogEntry, ...`args`: any[]): *void*

* **notice**(`entry`: string | LogEntry, ...`args`: any[]): *void*

* **warning**(`entry`: string | LogEntry, ...`args`: any[]): *void*

___

###  State

Ƭ **State**: *string | number | undefined*

___

###  Status

Ƭ **Status**: *string | number | undefined*

___

###  StorageIdentifiers

Ƭ **StorageIdentifiers**: *object*

#### Type declaration:

* **commitId**? : *string*

* **snapshotId**? : *string*

___

###  Type

Ƭ **Type**: *any*

___

###  TypeName

Ƭ **TypeName**: *string*

___

###  Validator

Ƭ **Validator**: *object*

#### Type declaration:

* **isInstanceOf**(`value`: any, `expectation`: any): *boolean*

* **isValid**(`value`: any, `expectation`: any, `isStrict?`: boolean): *boolean*

* **validate**(`value`: any, `expectation`: any, `isStrict?`: boolean): *boolean*
