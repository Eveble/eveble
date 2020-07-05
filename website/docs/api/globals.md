---
id: "globals"
title: "@eveble/eveble"
sidebar_label: "Globals"
---

## Index

### Namespaces

* [taskTypes](modules/tasktypes.md)
* [types](modules/types.md)

### Enumerations

* [STATES](enums/states.md)

### Classes

* [AbilityAssertion](classes/abilityassertion.md)
* [AcceptTask](classes/accepttask.md)
* [AddedClosedEmployeeTaskList](classes/addedclosedemployeetasklist.md)
* [AddingCommitFailedError](classes/addingcommitfailederror.md)
* [AddingSnapshotError](classes/addingsnapshoterror.md)
* [AgendaClient](classes/agendaclient.md)
* [AgendaCommandScheduler](classes/agendacommandscheduler.md)
* [AgendaCommandSchedulerModule](classes/agendacommandschedulermodule.md)
* [AgendaScheduledJobTransformer](classes/agendascheduledjobtransformer.md)
* [Aggregate](classes/aggregate.md)
* [App](classes/app.md)
* [AppConfig](classes/appconfig.md)
* [AppError](classes/apperror.md)
* [AppMissingError](classes/appmissingerror.md)
* [Asserter](classes/asserter.md)
* [Assertion](classes/assertion.md)
* [AssertionApiAlreadyExistsError](classes/assertionapialreadyexistserror.md)
* [AssertionError](classes/assertionerror.md)
* [AssignTaskList](classes/assigntasklist.md)
* [AssignTaskListToEmployee](classes/assigntasklisttoemployee.md)
* [Assignment](classes/assignment.md)
* [BaseApp](classes/baseapp.md)
* [BoundedContext](classes/boundedcontext.md)
* [CancelEmployment](classes/cancelemployment.md)
* [CancelingEmployment](classes/cancelingemployment.md)
* [CancelingEmploymentCompleted](classes/cancelingemploymentcompleted.md)
* [CancelingEmploymentFailed](classes/cancelingemploymentfailed.md)
* [CancelingEmploymentInitiated](classes/cancelingemploymentinitiated.md)
* [CancelingEmploymentUnavailableForEmployee](classes/cancelingemploymentunavailableforemployee.md)
* [CannotRouteMessageError](classes/cannotroutemessageerror.md)
* [ChangeTaskPriority](classes/changetaskpriority.md)
* [Client](classes/client.md)
* [ClientError](classes/clienterror.md)
* [CloseTaskList](classes/closetasklist.md)
* [ClosingEmployeeTaskListsCompleted](classes/closingemployeetasklistscompleted.md)
* [ClosingEmployeeTaskListsInitiated](classes/closingemployeetasklistsinitiated.md)
* [Command](classes/command.md)
* [CommandBus](classes/commandbus.md)
* [CommandHandlingMixin](classes/commandhandlingmixin.md)
* [CommandSchedulingError](classes/commandschedulingerror.md)
* [CommandSchedulingService](classes/commandschedulingservice.md)
* [CommandUnschedulingError](classes/commandunschedulingerror.md)
* [Commit](classes/commit.md)
* [CommitConcurrencyError](classes/commitconcurrencyerror.md)
* [CommitMongoDBObserver](classes/commitmongodbobserver.md)
* [CommitMongoDBStorage](classes/commitmongodbstorage.md)
* [CommitPublisher](classes/commitpublisher.md)
* [CommitReceiver](classes/commitreceiver.md)
* [CommitSerializer](classes/commitserializer.md)
* [CommitStore](classes/commitstore.md)
* [CompleteTask](classes/completetask.md)
* [Config](classes/config.md)
* [ConsoleTransport](classes/consoletransport.md)
* [CreateEmployee](classes/createemployee.md)
* [CreateTask](classes/createtask.md)
* [CreateTaskList](classes/createtasklist.md)
* [DeclineTask](classes/declinetask.md)
* [DefinableMixin](classes/definablemixin.md)
* [DetailedLogFormatter](classes/detailedlogformatter.md)
* [DomainError](classes/domainerror.md)
* [DomainException](classes/domainexception.md)
* [EJSONSerializerAdapter](classes/ejsonserializeradapter.md)
* [EjsonableMixin](classes/ejsonablemixin.md)
* [ElementAlreadyExistsError](classes/elementalreadyexistserror.md)
* [ElementNotFoundError](classes/elementnotfounderror.md)
* [Employee](classes/employee.md)
* [EmployeeAlreadyTerminatedError](classes/employeealreadyterminatederror.md)
* [EmployeeCreated](classes/employeecreated.md)
* [EmployeeProductivityEstimated](classes/employeeproductivityestimated.md)
* [EmployeeTerminated](classes/employeeterminated.md)
* [EmployeeTerminatedError](classes/employeeterminatederror.md)
* [EmployeeTerminationCompleted](classes/employeeterminationcompleted.md)
* [EmployeeTerminationInitiated](classes/employeeterminationinitiated.md)
* [Entity](classes/entity.md)
* [EntityError](classes/entityerror.md)
* [EstimateEmployeeProductivity](classes/estimateemployeeproductivity.md)
* [Eveble](classes/eveble.md)
* [EvebleConfig](classes/evebleconfig.md)
* [Event](classes/event.md)
* [EventBus](classes/eventbus.md)
* [EventHandlingMixin](classes/eventhandlingmixin.md)
* [EventIdMismatchError](classes/eventidmismatcherror.md)
* [EventSourceable](classes/eventsourceable.md)
* [EventSourceableError](classes/eventsourceableerror.md)
* [EventSourceableRepository](classes/eventsourceablerepository.md)
* [EventsNotFoundError](classes/eventsnotfounderror.md)
* [ExpireTask](classes/expiretask.md)
* [ExpiringTaskCompletionPolicy](classes/expiringtaskcompletionpolicy.md)
* [ExtendableError](classes/extendableerror.md)
* [Guid](classes/guid.md)
* [HandlerExistError](classes/handlerexisterror.md)
* [HandlerNotFoundError](classes/handlernotfounderror.md)
* [HandlingError](classes/handlingerror.md)
* [HandlingMixin](classes/handlingmixin.md)
* [History](classes/history.md)
* [HoldTask](classes/holdtask.md)
* [HookAlreadyExistsError](classes/hookalreadyexistserror.md)
* [HookError](classes/hookerror.md)
* [HookNotFoundError](classes/hooknotfounderror.md)
* [HookableMixin](classes/hookablemixin.md)
* [IdentifiableAlreadyExistsError](classes/identifiablealreadyexistserror.md)
* [InactiveClientError](classes/inactiveclienterror.md)
* [InappropriateTaskListTitleError](classes/inappropriatetasklisttitleerror.md)
* [InfiniteTaskCompletionPolicy](classes/infinitetaskcompletionpolicy.md)
* [InfrastructureError](classes/infrastructureerror.md)
* [InitializingMessageAlreadyExistsError](classes/initializingmessagealreadyexistserror.md)
* [Injector](classes/injector.md)
* [InjectorError](classes/injectorerror.md)
* [InjectorMissingError](classes/injectormissingerror.md)
* [InvalidAppConfigError](classes/invalidappconfigerror.md)
* [InvalidConfigError](classes/invalidconfigerror.md)
* [InvalidControllerError](classes/invalidcontrollererror.md)
* [InvalidEnvironmentError](classes/invalidenvironmenterror.md)
* [InvalidEventError](classes/invalideventerror.md)
* [InvalidEventSourceableError](classes/invalideventsourceableerror.md)
* [InvalidGuidValueError](classes/invalidguidvalueerror.md)
* [InvalidHandlerError](classes/invalidhandlererror.md)
* [InvalidHookActionError](classes/invalidhookactionerror.md)
* [InvalidHookIdError](classes/invalidhookiderror.md)
* [InvalidInitializingMessageError](classes/invalidinitializingmessageerror.md)
* [InvalidLegacyTransformerError](classes/invalidlegacytransformererror.md)
* [InvalidListError](classes/invalidlisterror.md)
* [InvalidMessageableType](classes/invalidmessageabletype.md)
* [InvalidModuleError](classes/invalidmoduleerror.md)
* [InvalidSchemaVersionError](classes/invalidschemaversionerror.md)
* [InvalidStateError](classes/invalidstateerror.md)
* [InvalidStateTransitionError](classes/invalidstatetransitionerror.md)
* [InvalidStatusError](classes/invalidstatuserror.md)
* [InvalidStatusTransitionError](classes/invalidstatustransitionerror.md)
* [InvalidTransportIdError](classes/invalidtransportiderror.md)
* [InvalidTypeNameError](classes/invalidtypenameerror.md)
* [Kernel](classes/kernel.md)
* [KernelError](classes/kernelerror.md)
* [LegacyTransformerAlreadyExistsError](classes/legacytransformeralreadyexistserror.md)
* [LegacyTransformerNotFoundError](classes/legacytransformernotfounderror.md)
* [Library](classes/library.md)
* [List](classes/list.md)
* [ListError](classes/listerror.md)
* [Log](classes/log.md)
* [LogMetadata](classes/logmetadata.md)
* [LogTransport](classes/logtransport.md)
* [LogTransportConfig](classes/logtransportconfig.md)
* [Logger](classes/logger.md)
* [LoggingConfig](classes/loggingconfig.md)
* [LoggingError](classes/loggingerror.md)
* [Message](classes/message.md)
* [MissingEventSourceableError](classes/missingeventsourceableerror.md)
* [MissingInitializingMessageError](classes/missinginitializingmessageerror.md)
* [Module](classes/module.md)
* [ModuleError](classes/moduleerror.md)
* [MongoDBClient](classes/mongodbclient.md)
* [MongoDBCollectionConfig](classes/mongodbcollectionconfig.md)
* [MongoDBCommitStorageModule](classes/mongodbcommitstoragemodule.md)
* [MongoDBDatabaseConfig](classes/mongodbdatabaseconfig.md)
* [MongoDBSnapshotStorageModule](classes/mongodbsnapshotstoragemodule.md)
* [NoQuittingFoolError](classes/noquittingfoolerror.md)
* [NotVersionableError](classes/notversionableerror.md)
* [OneToManyHandlingMixin](classes/onetomanyhandlingmixin.md)
* [OneToOneHandlingMixin](classes/onetoonehandlingmixin.md)
* [OpenTaskList](classes/opentasklist.md)
* [PickableProperties](classes/pickableproperties.md)
* [PostponeTask](classes/postponetask.md)
* [Process](classes/process.md)
* [ProductivityEstimation](classes/productivityestimation.md)
* [ProductivityEstimationCompleted](classes/productivityestimationcompleted.md)
* [ProductivityEstimationFailed](classes/productivityestimationfailed.md)
* [ProductivityEstimationInitiated](classes/productivityestimationinitiated.md)
* [ProductivityEstimationUnavailableForEmployeeError](classes/productivityestimationunavailableforemployeeerror.md)
* [Projection](classes/projection.md)
* [ProjectionAlreadyRebuildingError](classes/projectionalreadyrebuildingerror.md)
* [ProjectionNotRebuildingError](classes/projectionnotrebuildingerror.md)
* [ProjectionRebuilder](classes/projectionrebuilder.md)
* [ProjectionRebuildingError](classes/projectionrebuildingerror.md)
* [QuitTask](classes/quittask.md)
* [RFC5424LoggingMixin](classes/rfc5424loggingmixin.md)
* [RebuildingResult](classes/rebuildingresult.md)
* [Router](classes/router.md)
* [RouterError](classes/routererror.md)
* [SavedStateNotFoundError](classes/savedstatenotfounderror.md)
* [ScheduleCommand](classes/schedulecommand.md)
* [ScheduledJob](classes/scheduledjob.md)
* [SchedulerError](classes/schedulererror.md)
* [Serializable](classes/serializable.md)
* [SerializableError](classes/serializableerror.md)
* [SerializableMixin](classes/serializablemixin.md)
* [SerializationError](classes/serializationerror.md)
* [Service](classes/service.md)
* [SimpleLogFormatter](classes/simplelogformatter.md)
* [SnapshotMongoDBStorage](classes/snapshotmongodbstorage.md)
* [SnapshotSerializer](classes/snapshotserializer.md)
* [Snapshotter](classes/snapshotter.md)
* [SnapshotterError](classes/snapshottererror.md)
* [StartTask](classes/starttask.md)
* [StateError](classes/stateerror.md)
* [StatefulAssertion](classes/statefulassertion.md)
* [StatefulMixin](classes/statefulmixin.md)
* [StatusError](classes/statuserror.md)
* [StatusfulAssertion](classes/statusfulassertion.md)
* [StatusfulMixin](classes/statusfulmixin.md)
* [StorageNotFoundError](classes/storagenotfounderror.md)
* [StringifingConverter](classes/stringifingconverter.md)
* [Struct](classes/struct.md)
* [Task](classes/task.md)
* [TaskAccepted](classes/taskaccepted.md)
* [TaskAlreadyCompletedError](classes/taskalreadycompletederror.md)
* [TaskCompleted](classes/taskcompleted.md)
* [TaskCreated](classes/taskcreated.md)
* [TaskDeclined](classes/taskdeclined.md)
* [TaskExpired](classes/taskexpired.md)
* [TaskHold](classes/taskhold.md)
* [TaskList](classes/tasklist.md)
* [TaskListAlreadyAssignedError](classes/tasklistalreadyassignederror.md)
* [TaskListAssigned](classes/tasklistassigned.md)
* [TaskListAssignedToEmployee](classes/tasklistassignedtoemployee.md)
* [TaskListClosed](classes/tasklistclosed.md)
* [TaskListClosedError](classes/tasklistclosederror.md)
* [TaskListCreated](classes/tasklistcreated.md)
* [TaskListOpened](classes/tasklistopened.md)
* [TaskPostponed](classes/taskpostponed.md)
* [TaskPriorityChanged](classes/taskprioritychanged.md)
* [TaskQuitted](classes/taskquitted.md)
* [TaskStarted](classes/taskstarted.md)
* [TerminateEmployee](classes/terminateemployee.md)
* [TransportExistsError](classes/transportexistserror.md)
* [TypeError](classes/typeerror.md)
* [TypeExistsError](classes/typeexistserror.md)
* [TypeNotFoundError](classes/typenotfounderror.md)
* [UnavailableAsserterError](classes/unavailableassertererror.md)
* [UnavailableSerializerError](classes/unavailableserializererror.md)
* [UndefinedActionError](classes/undefinedactionerror.md)
* [UndefinedLoggableTargetError](classes/undefinedloggabletargeterror.md)
* [UndefinedSnapshotterError](classes/undefinedsnapshottererror.md)
* [UndefinedSnapshotterFrequencyError](classes/undefinedsnapshotterfrequencyerror.md)
* [UndefinedStatesError](classes/undefinedstateserror.md)
* [UndefinedStatusesError](classes/undefinedstatuseserror.md)
* [UnhandleableTypeError](classes/unhandleabletypeerror.md)
* [UnparsableValueError](classes/unparsablevalueerror.md)
* [UnregistrableTypeError](classes/unregistrabletypeerror.md)
* [UnresolvableIdentifierFromMessageError](classes/unresolvableidentifierfrommessageerror.md)
* [UnscheduleCommand](classes/unschedulecommand.md)
* [UnsupportedExecutionTypeError](classes/unsupportedexecutiontypeerror.md)
* [UpdatingCommitError](classes/updatingcommiterror.md)
* [UpdatingSnapshotError](classes/updatingsnapshoterror.md)
* [ValueObject](classes/valueobject.md)
* [ValueObjectError](classes/valueobjecterror.md)
* [VersionableError](classes/versionableerror.md)
* [VersionableMixin](classes/versionablemixin.md)

### Type aliases

* [Mappings](globals.md#mappings)

### Variables

* [COMMANDS_KEY](globals.md#const-commands_key)
* [COMMAND_HANDLERS_CONTAINER_KEY](globals.md#const-command_handlers_container_key)
* [CommandBus_base](globals.md#const-commandbus_base)
* [CommitReceiver_base](globals.md#const-commitreceiver_base)
* [DEFAULT_PROPS_KEY](globals.md#const-default_props_key)
* [DELEGATED_KEY](globals.md#const-delegated_key)
* [EVENTS_KEY](globals.md#const-events_key)
* [EVENT_HANDLERS_CONTAINER_KEY](globals.md#const-event_handlers_container_key)
* [Entity_base](globals.md#const-entity_base)
* [EventBus_base](globals.md#const-eventbus_base)
* [EventSourceable_base](globals.md#const-eventsourceable_base)
* [HANDLEABLE_TYPES](globals.md#const-handleable_types)
* [HANDLERS](globals.md#const-handlers)
* [HANDLER_KEY](globals.md#const-handler_key)
* [HOOKABLE_KEY](globals.md#const-hookable_key)
* [HOOKS_CONTAINER_KEY](globals.md#const-hooks_container_key)
* [INITIALIZING_MESSAGE_KEY](globals.md#const-initializing_message_key)
* [LEGACY_TRANSFORMERS_CONTAINER_KEY](globals.md#const-legacy_transformers_container_key)
* [LIST_KEY](globals.md#const-list_key)
* [Logger_base](globals.md#const-logger_base)
* [Module_base](globals.md#const-module_base)
* [Projection_base](globals.md#const-projection_base)
* [ROLLBACK_STATE_METHOD_KEY](globals.md#const-rollback_state_method_key)
* [ROUTED_COMMANDS_CONTAINER_KEY](globals.md#const-routed_commands_container_key)
* [ROUTED_EVENTS_CONTAINER_KEY](globals.md#const-routed_events_container_key)
* [SAVED_STATE_KEY](globals.md#const-saved_state_key)
* [SAVE_STATE_METHOD_KEY](globals.md#const-save_state_method_key)
* [SERIALIZABLE_LIST_PROPS_KEY](globals.md#const-serializable_list_props_key)
* [SERIALIZABLE_TYPE_KEY](globals.md#const-serializable_type_key)
* [SOURCE_KEY](globals.md#const-source_key)
* [SUBSCRIBER_KEY](globals.md#const-subscriber_key)
* [ScheduledJob_base](globals.md#const-scheduledjob_base)
* [SerializableError_base](globals.md#const-serializableerror_base)
* [Serializable_base](globals.md#const-serializable_base)
* [Service_base](globals.md#const-service_base)
* [Struct_base](globals.md#const-struct_base)
* [TYPE_KEY](globals.md#const-type_key)
* [VERSIONABLE_KEY](globals.md#const-versionable_key)
* [env](globals.md#const-env)
* [envFile](globals.md#const-envfile)
* [kernel](globals.md#const-kernel)
* [library](globals.md#const-library)

### Functions

* [bindExternalDependencies](globals.md#bindexternaldependencies)
* [bindLoggerDependencies](globals.md#bindloggerdependencies)
* [convertObjectToCollection](globals.md#convertobjecttocollection)
* [createConsoleTransport](globals.md#createconsoletransport)
* [createEJSON](globals.md#const-createejson)
* [createLogger](globals.md#createlogger)
* [delegate](globals.md#delegate)
* [executePostConstruct](globals.md#executepostconstruct)
* [executePostConstructAsync](globals.md#executepostconstructasync)
* [getCollectionName](globals.md#const-getcollectionname)
* [getDatabaseName](globals.md#const-getdatabasename)
* [getUrl](globals.md#const-geturl)
* [handle](globals.md#handle)
* [hasPostConstruct](globals.md#haspostconstruct)
* [initial](globals.md#initial)
* [isDefinable](globals.md#isdefinable)
* [isEventSourceableType](globals.md#iseventsourceabletype)
* [isPlainRecord](globals.md#isplainrecord)
* [isRecord](globals.md#isrecord)
* [isSSL](globals.md#const-isssl)
* [isSerializable](globals.md#isserializable)
* [loadENV](globals.md#loadenv)
* [loggerLoader](globals.md#loggerloader)
* [resolveSerializableFromPropType](globals.md#resolveserializablefromproptype)
* [route](globals.md#route)
* [setupCommitStoreMongo](globals.md#const-setupcommitstoremongo)
* [setupInjector](globals.md#setupinjector)
* [setupSchedulerMongo](globals.md#const-setupschedulermongo)
* [setupSnapshotterMongo](globals.md#const-setupsnapshottermongo)
* [sleep](globals.md#sleep)
* [subscribe](globals.md#subscribe)
* [toPlainObject](globals.md#toplainobject)
* [version](globals.md#version)

### Object literals

* [BINDINGS](globals.md#const-bindings)
* [DEFAULTS](globals.md#const-defaults)
* [LITERAL_KEYS](globals.md#const-literal_keys)
* [LOGGING_LEVELS](globals.md#const-logging_levels)
* [METADATA_KEYS](globals.md#const-metadata_keys)
* [RFC5424](globals.md#const-rfc5424)
* [SPECIFICATIONS](globals.md#const-specifications)
* [config](globals.md#const-config)

## Type aliases

###  Mappings

Ƭ **Mappings**: *Record‹keyof any, inversifyTypes.Metadata[]›*

## Variables

### `Const` COMMANDS_KEY

• **COMMANDS_KEY**: *keyof symbol* = Symbol('eveble:commands')

___

### `Const` COMMAND_HANDLERS_CONTAINER_KEY

• **COMMAND_HANDLERS_CONTAINER_KEY**: *keyof symbol* = Symbol(
  'eveble:container:command-handlers'
)

___

### `Const` CommandBus_base

• **CommandBus_base**: *object & SuperConstructorSelector‹[HookableMixin](classes/hookablemixin.md) | [OneToOneHandlingMixin](classes/onetoonehandlingmixin.md)› & object & object & object*

___

### `Const` CommitReceiver_base

• **CommitReceiver_base**: *object & SuperConstructorSelector‹[StatefulMixin](classes/statefulmixin.md) | [Serializable](classes/serializable.md)› & object & object & object*

___

### `Const` DEFAULT_PROPS_KEY

• **DEFAULT_PROPS_KEY**: *keyof symbol* = Symbol(
  'eveble:containers:default-props'
)

___

### `Const` DELEGATED_KEY

• **DELEGATED_KEY**: *keyof symbol* = Symbol('eveble:flags:delegated')

___

### `Const` EVENTS_KEY

• **EVENTS_KEY**: *keyof symbol* = Symbol('eveble:events')

___

### `Const` EVENT_HANDLERS_CONTAINER_KEY

• **EVENT_HANDLERS_CONTAINER_KEY**: *keyof symbol* = Symbol(
  'eveble:container:event-handlers'
)

___

### `Const` Entity_base

• **Entity_base**: *object & SuperConstructorSelector‹[StatefulMixin](classes/statefulmixin.md) | [Serializable](classes/serializable.md) | [StatusfulMixin](classes/statusfulmixin.md)› & object & object & object & object*

___

### `Const` EventBus_base

• **EventBus_base**: *object & SuperConstructorSelector‹[HookableMixin](classes/hookablemixin.md) | [OneToManyHandlingMixin](classes/onetomanyhandlingmixin.md)› & object & object & object*

___

### `Const` EventSourceable_base

• **EventSourceable_base**: *object & SuperConstructorSelector‹[Entity](classes/entity.md) | [OneToOneHandlingMixin](classes/onetoonehandlingmixin.md)› & object & object & object*

___

### `Const` HANDLEABLE_TYPES

• **HANDLEABLE_TYPES**: *keyof symbol* = Symbol(
  'eveble:handleable-types'
)

___

### `Const` HANDLERS

• **HANDLERS**: *keyof symbol* = Symbol('eveble:handlers')

___

### `Const` HANDLER_KEY

• **HANDLER_KEY**: *keyof symbol* = Symbol('eveble:controller:handler')

___

### `Const` HOOKABLE_KEY

• **HOOKABLE_KEY**: *keyof symbol* = Symbol('eveble:flags:hookable')

___

### `Const` HOOKS_CONTAINER_KEY

• **HOOKS_CONTAINER_KEY**: *keyof symbol* = Symbol(
  'eveble:containers:hooks'
)

___

### `Const` INITIALIZING_MESSAGE_KEY

• **INITIALIZING_MESSAGE_KEY**: *keyof symbol* = Symbol(
  'eveble:controller:initializing-message'
)

___

### `Const` LEGACY_TRANSFORMERS_CONTAINER_KEY

• **LEGACY_TRANSFORMERS_CONTAINER_KEY**: *keyof symbol* = Symbol(
  'eveble:container:legacy-transformers'
)

___

### `Const` LIST_KEY

• **LIST_KEY**: *keyof symbol* = Symbol('eveble:list-key')

___

### `Const` Logger_base

• **Logger_base**: *object & SuperConstructorSelector‹[StatefulMixin](classes/statefulmixin.md) | [RFC5424LoggingMixin](classes/rfc5424loggingmixin.md)› & object & object & object*

___

### `Const` Module_base

• **Module_base**: *object & SuperConstructorSelector‹[StatefulMixin](classes/statefulmixin.md)› & object & object*

___

### `Const` Projection_base

• **Projection_base**: *object & SuperConstructorSelector‹[StatefulMixin](classes/statefulmixin.md) | [EventHandlingMixin](classes/eventhandlingmixin.md)› & object & object & object*

___

### `Const` ROLLBACK_STATE_METHOD_KEY

• **ROLLBACK_STATE_METHOD_KEY**: *keyof symbol* = Symbol(
  'eveble:rollback-state'
)

___

### `Const` ROUTED_COMMANDS_CONTAINER_KEY

• **ROUTED_COMMANDS_CONTAINER_KEY**: *keyof symbol* = Symbol(
  'eveble:container:routed-commands'
)

___

### `Const` ROUTED_EVENTS_CONTAINER_KEY

• **ROUTED_EVENTS_CONTAINER_KEY**: *keyof symbol* = Symbol(
  'eveble:container:routed-events'
)

___

### `Const` SAVED_STATE_KEY

• **SAVED_STATE_KEY**: *keyof symbol* = Symbol('eveble:saved-state')

___

### `Const` SAVE_STATE_METHOD_KEY

• **SAVE_STATE_METHOD_KEY**: *keyof symbol* = Symbol('eveble:save-state')

___

### `Const` SERIALIZABLE_LIST_PROPS_KEY

• **SERIALIZABLE_LIST_PROPS_KEY**: *keyof symbol* = Symbol(
  'eveble:container:serializable-list-props'
)

___

### `Const` SERIALIZABLE_TYPE_KEY

• **SERIALIZABLE_TYPE_KEY**: *keyof symbol* = Symbol(
  'eveble:serializable-type'
)

___

### `Const` SOURCE_KEY

• **SOURCE_KEY**: *keyof symbol* = Symbol('eveble:source')

___

### `Const` SUBSCRIBER_KEY

• **SUBSCRIBER_KEY**: *keyof symbol* = Symbol(
  'eveble:controller:subscriber'
)

___

### `Const` ScheduledJob_base

• **ScheduledJob_base**: *object & SuperConstructorSelector‹[StatefulMixin](classes/statefulmixin.md) | [Struct](classes/struct.md)› & object & object & object*

___

### `Const` SerializableError_base

• **SerializableError_base**: *object & SuperConstructorSelector‹[ExtendableError](classes/extendableerror.md) | [DefinableMixin](classes/definablemixin.md) | [HookableMixin](classes/hookablemixin.md) | [EjsonableMixin](classes/ejsonablemixin.md) | [VersionableMixin](classes/versionablemixin.md)› & object & object & object & object & object & object*

___

### `Const` Serializable_base

• **Serializable_base**: *object & SuperConstructorSelector‹[Struct](classes/struct.md) | [EjsonableMixin](classes/ejsonablemixin.md) | [VersionableMixin](classes/versionablemixin.md)› & object & object & object & object*

___

### `Const` Service_base

• **Service_base**: *object & SuperConstructorSelector‹[CommandHandlingMixin](classes/commandhandlingmixin.md) | [EventHandlingMixin](classes/eventhandlingmixin.md)› & object & object & object*

___

### `Const` Struct_base

• **Struct_base**: *object & SuperConstructorSelector‹[DefinableMixin](classes/definablemixin.md) | [HookableMixin](classes/hookablemixin.md)› & object & object & object*

___

### `Const` TYPE_KEY

• **TYPE_KEY**: *"_type"* = "_type"

___

### `Const` VERSIONABLE_KEY

• **VERSIONABLE_KEY**: *keyof symbol* = Symbol('eveble:versionable')

___

### `Const` env

• **env**: *string* = process.env.NODE_ENV

___

### `Const` envFile

• **envFile**: *string* = process.env.NODE_ENV ? `.env.${env}` : '.env'

___

### `Const` kernel

• **kernel**: *Kernel‹›* = new Kernel(
  typend.converter,
  typend,
  typend.describer,
  library,
  config
)

___

### `Const` library

• **library**: *Library‹›* = new Library()

## Functions

###  bindExternalDependencies

▸ **bindExternalDependencies**(`injector`: Injector): *void*

Binds external dependencies to Injector.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`injector` | Injector | IoC container implementing `Injector` interface.  |

**Returns:** *void*

___

###  bindLoggerDependencies

▸ **bindLoggerDependencies**(`injector`: Injector): *void*

Binds logger dependencies to Injector.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`injector` | Injector | IoC container implementing `Injector` interface.  |

**Returns:** *void*

___

###  convertObjectToCollection

▸ **convertObjectToCollection**(`obj`: any): *Record‹keyof any, any›*

Converts root-level objects to collection.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`obj` | any | Object that should be converted. |

**Returns:** *Record‹keyof any, any›*

Instance of `Collection` pattern with properties from object.

___

###  createConsoleTransport

▸ **createConsoleTransport**(`level`: [LogLevel](modules/types.md#loglevel), `transportConfig`: LogTransportConfig): *ConsoleTransport*

Creates a ConsoleTransport.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`level` | [LogLevel](modules/types.md#loglevel) | - | Level for which priority logging will only be done(less than or equal to this level) on `ConsoleTransport`. |
`transportConfig` | LogTransportConfig | new LogTransportConfig() | - |

**Returns:** *ConsoleTransport*

___

### `Const` createEJSON

▸ **createEJSON**(): *any*

Creates instance of EJSON.

**`remarks`** 
By default, EJSON module stores types in variable that is not referenced on the EJSON object
itself. This creates issue when running tests in watch modes(like Mocha's --watch) since the state of EJSON is cached.

**Returns:** *any*

De-cached version of EJSON module.

___

###  createLogger

▸ **createLogger**(`levels?`: [LogLevels](modules/types.md#loglevels)): *Logger*

Creates an instance of Logger.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`levels?` | [LogLevels](modules/types.md#loglevels) | Optional logging levels for logger.  |

**Returns:** *Logger*

___

###  delegate

▸ **delegate**(): *function*

**Returns:** *function*

▸ (`target`: Record‹string, any›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`target` | Record‹string, any› |

___

###  executePostConstruct

▸ **executePostConstruct**(`target`: any): *void*

Executes annotated by `@postConstruct` post construction method on target.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | any | Instance that has `@postConstruct` annotation applied to method.  |

**Returns:** *void*

___

###  executePostConstructAsync

▸ **executePostConstructAsync**(`target`: any): *Promise‹void›*

Executes annotated by `@postConstruct` post construction method on target.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | any | Instance that has `@postConstruct` annotation applied to method.  |

**Returns:** *Promise‹void›*

___

### `Const` getCollectionName

▸ **getCollectionName**(`targetName`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`targetName` | string |

**Returns:** *string*

___

### `Const` getDatabaseName

▸ **getDatabaseName**(`targetName`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`targetName` | string |

**Returns:** *string*

___

### `Const` getUrl

▸ **getUrl**(`targetName`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`targetName` | string |

**Returns:** *string*

___

###  handle

▸ **handle**(`target`: Record‹string, any›, `methodName`: string, `index`: number): *void*

Annotates method parameter as a handler for `Command` type(or other) - type that is
used as first method parameter(i.e. for example below `MyCommandHandlingMethod` with
 parameter `MyCommand`).

**`remarks`** 
Since decorator is **executed before class instance is ever created**, we need to
solve the issue of registered handlers **leaking** in between multiple classes
when inheritance is involved.

To solve that - we create a container on metadata that holds all registered
types and handlers. Then, whenever a class is instantiated - we resolve that
container through `Reflect.getOwnMetadata` to ensure that only metadata assigned
to class is resolved and then - iterate through that container on construction
and register all the assigned types and handlers.

Implementation of this can be seen on `OneToOneHandlingMixin` or `OneToManyHandlingMixin` constructors.

**`example`** 
```ts
@define('MyCommand')
class MyCommand extends Command {
 key: string;
}

class MyClass extends OneToOneHandlingMixin {
 MyCommandHandlingMethod(@handle command: MyCommand) {
   return true;
 }
}
const instance = new MyClass();
expect(instance.getHandlers()).to.be.eql(
new Map([[MyCommand, instance.MyCommandHandlingMethod]])
);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | Record‹string, any› | Target which method parameter is being decorated. |
`methodName` | string | Method name which parameter is being decorated. |
`index` | number | Index number of the parameter that is being decorated. |

**Returns:** *void*

___

###  hasPostConstruct

▸ **hasPostConstruct**(`target`: any): *boolean*

Evaluates if `@postConstruct`(from Inversify) annotation is applied to target's method.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | any | **Instance** of evaluated argument. |

**Returns:** *boolean*

Returns `true` if target's constructor has `@postConstruct` annotation applied, else `false`.

___

###  initial

▸ **initial**(`target`: Record‹string, any›, `methodName`: string, `index`: number): *void*

Annotates method parameter as a handler for initial `Command` or `Event` type(or other) - type that is
used as first method parameter.

**`remarks`** 
Since decorator is **executed before class instance is ever created**, we need to
solve the issue of registered handlers **leaking** in between multiple classes
when inheritance is involved.

To solve that - we create a container on metadata that holds all registered
types and handlers. Then, whenever a class is instantiated - we resolve that
container through `Reflect.getOwnMetadata` to ensure that only metadata assigned
to class is resolved and then - iterate through that container on construction
and register all the assigned types and handlers.

Implementation of this can be seen on `OneToOneHandlingMixin` or `OneToManyHandlingMixin` constructors.

**`example`** 
```ts
@define('MyCommand')
class MyCommand extends Command {
 key: string;
}

class MyClass extends OneToOneHandlingMixin {
 MyInitialCommand(@initial command: MyCommand) {
   return true;
 }
}

expect(MyClass.resolveInitializingMessage()).to.be.equal(
 MyCommand
);
```

**`example`** 
```ts
@define('MyEvent')
class MyEvent extends Event {
 key: string;
}

class MyClass extends OneToOneHandlingMixin {
 MyInitialEvent(@initial event: MyEvent) {
   return true;
 }
}

expect(MyClass.resolveInitializingMessage()).to.be.equal(
 MyEvent
);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | Record‹string, any› | Target which method parameter is being decorated. |
`methodName` | string | Method name which parameter is being decorated. |
`index` | number | Index number of the parameter that is being decorated. |

**Returns:** *void*

___

###  isDefinable

▸ **isDefinable**(`arg`: any): *boolean*

Evaluates if provided argument is a `Definable` implementation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | any | **Instance** of evaluated argument. |

**Returns:** *boolean*

Returns `true` if provided argument is implementing `Definable` interface, else `false`.

___

###  isEventSourceableType

▸ **isEventSourceableType**(`arg`: any): *boolean*

Evaluates if provided argument is a `EventSourceable` type constructor implementation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | any | **Constructor** of evaluated argument. |

**Returns:** *boolean*

Returns `true` if provided argument is implementing `EventSourceableType` interface, else `false`.

___

###  isPlainRecord

▸ **isPlainRecord**(`arg`: any): *boolean*

Evaluates if provided argument is a plain record(plain object or `Collection`).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | any | Evaluated argument. |

**Returns:** *boolean*

Returns `true` if argument is an record(literal object or `Collection` instance), else `false`.

___

###  isRecord

▸ **isRecord**(`arg`: any): *boolean*

Evaluates if provided argument is a record.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | any | Evaluated argument. |

**Returns:** *boolean*

Returns `true` if argument is an record(literal object, class instance or `Collection` instance), else `false`.

___

### `Const` isSSL

▸ **isSSL**(`targetName`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`targetName` | string |

**Returns:** *boolean*

___

###  isSerializable

▸ **isSerializable**(`arg`: any): *boolean*

Evaluates if provided argument is serialziable i.e. at current time implements  `Ejsonable` implementation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | any | **Instance** of evaluated argument. |

**Returns:** *boolean*

Returns `true` if provided argument is implementing `Ejsonable` interface, else `false`.

___

###  loadENV

▸ **loadENV**(`envFilePath`: string): *void*

Assigns environment variables based on environment.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`envFilePath` | string | Path to env file.  |

**Returns:** *void*

___

###  loggerLoader

▸ **loggerLoader**(`injector`: [Injector](interfaces/types.injector.md), `level`: [LogLevel](modules/types.md#loglevel), `consoleTransportConfig?`: [LogTransportConfig](classes/logtransportconfig.md), `levels?`: [LogLevels](modules/types.md#loglevels)): *[Logger](interfaces/types.logger.md)*

Bootstraps creation of `Logger` instance.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`injector` | [Injector](interfaces/types.injector.md) | IoC container implementing `Injector` interface |
`level` | [LogLevel](modules/types.md#loglevel) | Level for which priority logging will only be done(less than or equal to this level) on `ConsoleTransport`. |
`consoleTransportConfig?` | [LogTransportConfig](classes/logtransportconfig.md) | Optional `LogTransportConfig` instance. |
`levels?` | [LogLevels](modules/types.md#loglevels) | Optional logging levels for logger. |

**Returns:** *[Logger](interfaces/types.logger.md)*

`Logger` instance.

___

###  resolveSerializableFromPropType

▸ **resolveSerializableFromPropType**(`propType`: any): *[Serializable](interfaces/types.serializable.md) | undefined*

Resolves `Serializable` from prop type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`propType` | any | Property type for converted class type. |

**Returns:** *[Serializable](interfaces/types.serializable.md) | undefined*

`Serializable` from prop type, else if not present - `undefined`.

___

###  route

▸ **route**(`target`: Record‹string, any›, `methodName`: string, `index`: number): *void*

Annotates method parameter as a handler for routed `Command` or `Event` type(or other) - type that is
used as first method parameter.

**`remarks`** 
Since decorator is **executed before class instance is ever created**, we need to
solve the issue of registered handlers **leaking** in between multiple classes
when inheritance is involved.

To solve that - we create a container on metadata that holds all registered
types and handlers. Then, whenever a class is instantiated - we resolve that
container through `Reflect.getOwnMetadata` to ensure that only metadata assigned
to class is resolved and then - iterate through that container on construction
and register all the assigned types and handlers.

Implementation of this can be seen on `OneToOneHandlingMixin` or `OneToManyHandlingMixin` constructors.

**`example`** 
```ts
@define('MyCommand')
class MyCommand extends Command {
 key: string;
}

class MyClass extends OneToOneHandlingMixin {
 MyCommand(@route command: MyCommand) {
   return true;
 }
}
const instance = new MyClass();
expect(instance.resolveRoutedCommands()).to.be.eql([MyCommand]);
```

**`example`** 
```ts
@define('MyEvent')
class MyEvent extends Event {
 key: string;
}

class MyClass extends OneToOneHandlingMixin {
 MyEvent(@route command: MyEvent) {
   return true;
 }
}
const instance = new MyClass();
expect(instance.resolveRoutedEvents()).to.be.eql([MyEvent]);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | Record‹string, any› | Target which method parameter is being decorated. |
`methodName` | string | Method name which parameter is being decorated. |
`index` | number | Index number of the parameter that is being decorated. |

**Returns:** *void*

___

### `Const` setupCommitStoreMongo

▸ **setupCommitStoreMongo**(`injector`: Injector, `clients`: Record‹string, Client›, `collections`: Record‹string, Collection›): *Promise‹object›*

**Parameters:**

Name | Type |
------ | ------ |
`injector` | Injector |
`clients` | Record‹string, Client› |
`collections` | Record‹string, Collection› |

**Returns:** *Promise‹object›*

___

###  setupInjector

▸ **setupInjector**(): *object*

**Returns:** *object*

* **config**: *any*

* **injector**: *Injector*

* **log**: *any*

___

### `Const` setupSchedulerMongo

▸ **setupSchedulerMongo**(`injector`: Injector, `clients`: Record‹string, Client›, `collections`: Record‹string, Collection›): *Promise‹object›*

**Parameters:**

Name | Type |
------ | ------ |
`injector` | Injector |
`clients` | Record‹string, Client› |
`collections` | Record‹string, Collection› |

**Returns:** *Promise‹object›*

___

### `Const` setupSnapshotterMongo

▸ **setupSnapshotterMongo**(`injector`: Injector, `clients`: Record‹string, Client›, `collections`: Record‹string, Collection›): *Promise‹object›*

**Parameters:**

Name | Type |
------ | ------ |
`injector` | Injector |
`clients` | Record‹string, Client› |
`collections` | Record‹string, Collection› |

**Returns:** *Promise‹object›*

___

###  sleep

▸ **sleep**(`ms`: number): *Promise‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`ms` | number |

**Returns:** *Promise‹any›*

___

###  subscribe

▸ **subscribe**(`target`: Record‹string, any›, `propertyName`: string, `index`: number): *void*

Annotates method as a handler for type(`Event` or other)- type that is used as first method parameter(i.e. for example below `MyEvent`).

**`remarks`** 
Since decorator is **executed before class instance is ever created**, we need to
solve the issue of registered handlers **leaking** in between multiple classes
when inheritance is involved.

To solve that - we create a container on metadata that holds all registered
types and handlers. Then, whenever a class is instantiated - we resolve that
container through `Reflect.getOwnMetadata` to ensure that only metadata assigned
to class is resolved and then - iterate through that container on construction
and register all the assigned types and handlers.

Implementation of this can be seen on `OneToOneHandlingMixin` or `OneToManyHandlingMixin` constructors.

**`example`** 
```ts
@define('MyEvent')
class MyEvent extends Event {
 key: string;
}

class MyClass extends OneToOneHandlingMixin {
 MyEventHandlingMethod(@subscribe event: MyEvent) {
   return true;
 }
}
const instance = new MyClass();
expect(instance.getHandlers()).to.be.eql(
new Map([[MyEvent, instance.MyEventHandlingMethod]])
);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | Record‹string, any› | Target which method parameter is being decorated. |
`propertyName` | string | - |
`index` | number | Index number of the parameter that is being decorated. |

**Returns:** *void*

___

###  toPlainObject

▸ **toPlainObject**(`arg`: Record‹keyof any, any›): *Record‹keyof any, any›*

Converts object and all nested records implementing `DefinableMixin` to plain object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | Record‹keyof any, any› | Object or instance of a class for conversion. |

**Returns:** *Record‹keyof any, any›*

Plain object representation of provided argument.

___

###  version

▸ **version**‹**T**›(`schemaVersion`: number): *any*

Annotates legacy schema transformer method on a class that will used for processing legacy
properties(data).

**`example`** 
```ts
// In the best interest of future developer's sanity is to keep track
// of previous type versions. You can define previous prop types of a class as type
// and assign it as generic type at @version<T>(schemaVersion: number)

type CustomerV0 = {
  firstName: string;
  lastName: string;
  city: string;
  street: string;
};

@define('Customer')
class Customer extends Serializable {
  name: string;

  address: string;

  @version<CustomerV0>(1)
  transformToVersion1(props: types.Props): types.Props {
    props.name = `${props.firstName} ${props.lastName}`;
    props.address = `${props.city}, ${props.street}`;
    delete props.firstName;
    delete props.lastName;
    delete props.city;
    delete props.street;
    return props;
  }
}
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemaVersion` | number | Schema version for which legacy transformation will be done. |

**Returns:** *any*

## Object literals

### `Const` BINDINGS

### ▪ **BINDINGS**: *object*

###  App

• **App**: *symbol* = Symbol.for('App')

###  Asserter

• **Asserter**: *symbol* = Symbol.for('Asserter')

###  CommandBus

• **CommandBus**: *symbol* = Symbol.for('CommandBus')

###  CommandScheduler

• **CommandScheduler**: *symbol* = Symbol.for('CommandScheduler')

###  CommandSchedulingService

• **CommandSchedulingService**: *symbol* = Symbol.for('CommandSchedulingService')

###  CommitObserver

• **CommitObserver**: *symbol* = Symbol.for('CommitObserver')

###  CommitPublisher

• **CommitPublisher**: *symbol* = Symbol.for('CommitPublisher')

###  CommitSerializer

• **CommitSerializer**: *symbol* = Symbol.for('CommitSerializer')

###  CommitStorage

• **CommitStorage**: *symbol* = Symbol.for('CommitStorage')

###  CommitStore

• **CommitStore**: *symbol* = Symbol.for('CommitStore')

###  Config

• **Config**: *symbol* = Symbol.for('Config')

###  Converter

• **Converter**: *symbol* = Symbol.for('Converter')

###  Describer

• **Describer**: *symbol* = Symbol.for('Describer')

###  DetailedLogFormatter

• **DetailedLogFormatter**: *symbol* = Symbol.for('DetailedLogFormatter')

###  EJSON

• **EJSON**: *symbol* = Symbol.for('EJSON')

###  EventBus

• **EventBus**: *symbol* = Symbol.for('EventBus')

###  EventSourceableRepository

• **EventSourceableRepository**: *symbol* = Symbol.for('EventSourceableRepository')

###  Injector

• **Injector**: *symbol* = Symbol.for('Injector')

###  Library

• **Library**: *symbol* = Symbol.for('Library')

###  LogConverter

• **LogConverter**: *symbol* = Symbol.for('LogConverter')

###  Router

• **Router**: *symbol* = Symbol.for('Router')

###  Serializer

• **Serializer**: *symbol* = Symbol.for('Serializer')

###  SimpleLogFormatter

• **SimpleLogFormatter**: *symbol* = Symbol.for('SimpleLogFormatter')

###  SnapshotSerializer

• **SnapshotSerializer**: *symbol* = Symbol.for('SnapshotSerializer')

###  SnapshotStorage

• **SnapshotStorage**: *symbol* = Symbol.for('SnapshotStorage')

###  Snapshotter

• **Snapshotter**: *symbol* = Symbol.for('Snapshotter')

###  Validator

• **Validator**: *symbol* = Symbol.for('Validator')

###  chalk

• **chalk**: *symbol* = Symbol.for('chalk')

###  console

• **console**: *string* = "console"

###  log

• **log**: *symbol* = Symbol.for('Logger')

###  winston

• **winston**: *symbol* = Symbol.for('winston')

▪ **Agenda**: *object*

* **jobTransformer**: *symbol* = Symbol.for('Agenda.jobTransformer')

* **library**: *symbol* = Symbol.for('Agenda.library')

* **clients**: *object*

  * **CommandScheduler**: *symbol* = Symbol.for('Agenda.clients.CommandScheduler')

▪ **MongoDB**: *object*

* **library**: *symbol* = Symbol.for('MongoDB.library')

* **clients**: *object*

  * **CommandScheduler**: *symbol* = Symbol.for('MongoDB.clients.CommandScheduler')

  * **CommitStore**: *symbol* = Symbol.for('MongoDB.clients.CommitStore')

  * **Snapshotter**: *symbol* = Symbol.for('MongoDB.clients.Snapshotter')

* **collections**: *object*

  * **Commits**: *symbol* = Symbol.for('MongoDB.collections.Commits')

  * **ScheduledCommands**: *symbol* = Symbol.for('MongoDB.collections.ScheduledCommands')

  * **Snapshots**: *symbol* = Symbol.for('MongoDB.collections.Snapshots')

___

### `Const` DEFAULTS

### ▪ **DEFAULTS**: *object*

###  LOGGING_LEVELS

• **LOGGING_LEVELS**: *object*

#### Type declaration:

* **alert**: *number* = 1

* **crit**: *number* = 2

* **debug**: *number* = 7

* **emerg**: *number* = 0

* **error**: *number* = 3

* **info**: *number* = 6

* **notice**: *number* = 5

* **warning**: *number* = 4

___

### `Const` LITERAL_KEYS

### ▪ **LITERAL_KEYS**: *object*

###  COMMANDS_KEY

• **COMMANDS_KEY**: *symbol*

###  EVENTS_KEY

• **EVENTS_KEY**: *symbol*

###  HANDLEABLE_TYPES

• **HANDLEABLE_TYPES**: *symbol*

###  HANDLERS

• **HANDLERS**: *symbol*

###  LIST_KEY

• **LIST_KEY**: *symbol*

###  ROLLBACK_STATE_METHOD_KEY

• **ROLLBACK_STATE_METHOD_KEY**: *symbol*

###  SAVED_STATE_KEY

• **SAVED_STATE_KEY**: *symbol*

###  SAVE_STATE_METHOD_KEY

• **SAVE_STATE_METHOD_KEY**: *symbol*

###  SERIALIZABLE_TYPE_KEY

• **SERIALIZABLE_TYPE_KEY**: *symbol*

###  SOURCE_KEY

• **SOURCE_KEY**: *symbol*

###  TYPE_KEY

• **TYPE_KEY**: *string*

___

### `Const` LOGGING_LEVELS

### ▪ **LOGGING_LEVELS**: *object*

###  alert

• **alert**: *number* = 1

###  crit

• **crit**: *number* = 2

###  debug

• **debug**: *number* = 7

###  emerg

• **emerg**: *number* = 0

###  error

• **error**: *number* = 3

###  info

• **info**: *number* = 6

###  notice

• **notice**: *number* = 5

###  warning

• **warning**: *number* = 4

___

### `Const` METADATA_KEYS

### ▪ **METADATA_KEYS**: *object*

###  COMMAND_HANDLERS_CONTAINER_KEY

• **COMMAND_HANDLERS_CONTAINER_KEY**: *symbol*

###  DEFAULT_PROPS_KEY

• **DEFAULT_PROPS_KEY**: *symbol*

###  DELEGATED_KEY

• **DELEGATED_KEY**: *symbol*

###  EVENT_HANDLERS_CONTAINER_KEY

• **EVENT_HANDLERS_CONTAINER_KEY**: *symbol*

###  HANDLER_KEY

• **HANDLER_KEY**: *symbol*

###  HOOKABLE_KEY

• **HOOKABLE_KEY**: *symbol*

###  HOOKS_CONTAINER_KEY

• **HOOKS_CONTAINER_KEY**: *symbol*

###  INITIALIZING_MESSAGE_KEY

• **INITIALIZING_MESSAGE_KEY**: *symbol*

###  LEGACY_TRANSFORMERS_CONTAINER_KEY

• **LEGACY_TRANSFORMERS_CONTAINER_KEY**: *symbol*

###  ROUTED_COMMANDS_CONTAINER_KEY

• **ROUTED_COMMANDS_CONTAINER_KEY**: *symbol*

###  ROUTED_EVENTS_CONTAINER_KEY

• **ROUTED_EVENTS_CONTAINER_KEY**: *symbol*

###  SERIALIZABLE_LIST_PROPS_KEY

• **SERIALIZABLE_LIST_PROPS_KEY**: *symbol*

###  SUBSCRIBER_KEY

• **SUBSCRIBER_KEY**: *symbol*

###  VERSIONABLE_KEY

• **VERSIONABLE_KEY**: *symbol*

___

### `Const` RFC5424

### ▪ **RFC5424**: *object*

###  alert

• **alert**: *number* = 1

###  crit

• **crit**: *number* = 2

###  debug

• **debug**: *number* = 7

###  emerg

• **emerg**: *number* = 0

###  error

• **error**: *number* = 3

###  info

• **info**: *number* = 6

###  notice

• **notice**: *number* = 5

###  warning

• **warning**: *number* = 4

___

### `Const` SPECIFICATIONS

### ▪ **SPECIFICATIONS**: *object*

###  RFC5424

• **RFC5424**: *object*

#### Type declaration:

* **alert**: *number* = 1

* **crit**: *number* = 2

* **debug**: *number* = 7

* **emerg**: *number* = 0

* **error**: *number* = 3

* **info**: *number* = 6

* **notice**: *number* = 5

* **warning**: *number* = 4

___

### `Const` config

### ▪ **config**: *object*

▪ **conversion**: *object*

* **type**: *"manual" | "runtime"* = getenv.string('EVEBLE_CONVERSION_TYPE', 'runtime') as
      | 'runtime'
      | 'manual'

▪ **describer**: *object*

* **formatting**: *"compact" | "debug" | "default"* = getenv.string('EVEBLE_DESCRIBER_FORMATTING', 'default') as
      | 'default'
      | 'compact'
      | 'debug'

▪ **validation**: *object*

* **type**: *"manual" | "runtime"* = getenv.string('EVEBLE_VALIDATION_TYPE', 'runtime') as
      | 'runtime'
      | 'manual'
