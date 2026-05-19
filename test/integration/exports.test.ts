import { expect, describe, it } from 'vitest';

import { postConstruct, injectable, inject } from 'inversify';
// Typend
import {
  // Errors
  ValidationError,
  InvalidDefinitionError,
  InvalidTypeError,
  InvalidValueError,
  UnequalValueError,
  UnmatchedTypeError,
  NotAMemberError,
  UnexpectedKeyError,
  UnknownError,
  TypeDescriberExistsError,
  TypeDescriberNotFoundError,
  PatternValidatorExistError,
  PatternValidatorNotFoundError,
  UndefinableClassError,
  TypeConverterExists,
  // Utilities
  PropsOf,
  TypeOf,
  // Typend end-api
  typend,
  validator,
  describer,
  converter,
  validate,
  isValid,
  isInstanceOf,
  check,
  is,
  instanceOf,
  convert,
  reflect,
  // Annotations
  Internal,
  Validable,
  // Patterns
  any,
  iof,
  collection,
  collectionIncluding,
  collectionWithin,
  eq,
  integer,
  list,
  maybe,
  never,
  oneOf,
  optional,
  tuple,
  unknown,
  unrecognized,
  voided,
  where,
  PropTypes,
  // Utilities
  propsOf,
  typeOf,
  // Primitive types
  string,
  number,
  boolean,
  symbol,
} from 'typend';
import {
  ExtendableError,
  Kernel,
  kernel,
  Library,
  KernelError,
  UnavailableSerializerError,
  UnavailableAsserterError,
  TypeError,
  TypeExistsError,
  TypeNotFoundError,
  UnregistrableTypeError,
  isSerializable,
  resolveSerializableFromPropType,
} from '@eveble/core';
// Annotations
import { delegate } from '../../src/annotations/delegate';
import { handle } from '../../src/annotations/handle';
import { initial } from '../../src/annotations/initial';
import { route } from '../../src/annotations/route';
import { subscribe } from '../../src/annotations/subscribe';
import { version } from '../../src/annotations/version';
// Decorators
import { can } from '../../src/decorators/can';
// App
import { App } from '../../src/app/app';
import { Eveble } from '../../src/app/eveble';
import { PulseCommandSchedulerModule } from '../../src/app/modules/pulse-command-scheduler-module';
import { MongoDBCommitStorageModule } from '../../src/app/modules/mongodb-commit-storage-module';
import { MongoDBSnapshotStorageModule } from '../../src/app/modules/mongodb-snapshot-storage-module';
// Components
import { Command, Assignment } from '../../src/components/command';
import { Config } from '../../src/components/config';
import { Event } from '../../src/components/event';
import { Log, LogMetadata } from '../../src/components/log-entry';
import { Message } from '../../src/components/message';
import { SerializableError } from '../../src/components/serializable-error';
import { SerializableTrait } from '../../src/traits/serializable.trait';
import { Struct } from '../../src/components/struct';
// Config
import { AppConfig } from '../../src/configs/app-config';
import { EvebleConfig } from '../../src/configs/eveble-config';
import { LoggingConfig } from '../../src/configs/logging-config';
import { LogTransportConfig } from '../../src/configs/log-transport-config';
// Constants
import { BINDINGS } from '../../src/constants/bindings';
import {
  LITERAL_KEYS,
  NON_ENUMERABLE_VALUE_KEY,
} from '../../src/constants/literal-keys';
import { DEFAULTS, LOGGING_LEVELS } from '../../src/constants/defaults';
import { METADATA_KEYS } from '../../src/constants/metadata-keys';
import { SPECIFICATIONS } from '../../src/constants/specifications';
// Core
import { StringifingConverter } from '../../src/core/logging-transports/formatters/converters/stringifing-converter';
import { DetailedLogFormatter } from '../../src/core/logging-transports/formatters/detailed-log-entry-formatter';
import { SimpleLogFormatter } from '../../src/core/logging-transports/formatters/simple-log-entry-formatter';
import { ConsoleTransport } from '../../src/core/logging-transports/console-transport';
import { BaseApp } from '../../src/core/base-app';
import {
  InjectorError,
  InvalidEventSourceableError,
  ModuleError,
  AppMissingError,
  InjectorMissingError,
  InvalidModuleError,
  InvalidConfigError,
  InvalidEnvironmentError,
  AppError,
  InvalidAppConfigError,
  LoggingError,
  InvalidTransportIdError,
  TransportExistsError,
} from '../../src/core/core-errors';
import { Injector } from '../../src/core/injector';
import { LogTransport } from '../../src/core/log-transport';
import { Logger } from '../../src/core/logger';
import { Module } from '../../src/core/module';
// Domain
import { AbilityAssertion } from '../../src/domain/assertions/ability-assertion';
import {
  StatefulAssertion,
  InvalidStateTransitionError,
} from '../../src/domain/assertions/stateful-assertion';
import {
  StatusfulAssertion,
  InvalidStatusTransitionError,
} from '../../src/domain/assertions/statusful-assertion';
import { Guid } from '../../src/domain/value-objects/guid';
import { Aggregate } from '../../src/domain/aggregate';
import {
  Asserter,
  AssertionApiAlreadyExistsError,
} from '../../src/domain/asserter';
import { Assertion } from '../../src/domain/assertion';
import { BoundedContext } from '../../src/domain/bounded-context';
import { DomainError } from '../../src/domain/domain-error';
import {
  AssertionError,
  UndefinedActionError,
  ListError,
  IdentifiableAlreadyExistsError,
  ElementAlreadyExistsError,
  ElementNotFoundError,
  InvalidListError,
  ValueObjectError,
  EntityError,
  SavedStateNotFoundError,
  EventSourceableError,
  InvalidEventError,
  EventIdMismatchError,
  InvalidInitializingMessageError,
  EmptyStringError,
} from '../../src/domain/domain-errors';
import { DomainException } from '../../src/domain/domain-exception';
import { Entity } from '../../src/domain/entity';
import { EventSourceable } from '../../src/domain/event-sourceable';
import { History } from '../../src/domain/history';
import { List } from '../../src/domain/list';
import { ScheduleCommand } from '../../src/domain/schedule-command';
import { UnscheduleCommand } from '../../src/domain/unschedule-command';
import { Process } from '../../src/domain/process';
import { ValueObject } from '../../src/domain/value-object';
// Infrastructure
import { PulseClient } from '../../src/app/clients/pulse-client';
import { MongoDBClient } from '../../src/app/clients/mongodb-client';
import { PulseCommandScheduler } from '../../src/infrastructure/schedulers/pulse-command-scheduler';
import { CommitSerializer } from '../../src/infrastructure/serializers/commit-serializer';
import { SnapshotSerializer } from '../../src/infrastructure/serializers/snapshot-serializer';
import { CommitMongoDBObserver } from '../../src/infrastructure/storages/commit-mongodb-observer';
import { CommitMongoDBStorage } from '../../src/infrastructure/storages/commit-mongodb-storage';
import { SnapshotMongoDBStorage } from '../../src/infrastructure/storages/snapshot-mongodb-storage';
import {
  Commit,
  CommitReceiver,
} from '../../src/infrastructure/structs/commit';
import { ScheduledJob } from '../../src/infrastructure/structs/scheduled-job';
import { PulseScheduledJobTransformer } from '../../src/infrastructure/transformers/pulse-scheduled-job-transformer';
import { Client } from '../../src/app/client';
import { CommandSchedulingService } from '../../src/infrastructure/command-scheduling-service';
import { CommitPublisher } from '../../src/infrastructure/commit-publisher';
import { CommitStore } from '../../src/infrastructure/commit-store';
import { EventSourceableRepository } from '../../src/infrastructure/event-sourceable-repository';
import {
  InfrastructureError,
  CommitConcurrencyError,
  EventsNotFoundError,
  AddingCommitFailedError,
  UpdatingCommitError,
  AddingSnapshotError,
  UpdatingSnapshotError,
  StorageNotFoundError,
  RouterError,
  MissingEventSourceableError,
  MissingInitializingMessageError,
  CannotRouteMessageError,
  UnresolvableIdentifierFromMessageError,
  UndefinedSnapshotterFrequencyError,
  UndefinedSnapshotterError,
  ProjectionRebuildingError,
  ProjectionAlreadyRebuildingError,
  ProjectionNotRebuildingError,
  ClientError,
  InactiveClientError,
  SchedulerError,
  CommandSchedulingError,
  CommandUnschedulingError,
} from '../../src/infrastructure/infrastructure-errors';
import { ProjectionRebuilder } from '../../src/infrastructure/projection-rebuilder';
import { Projection } from '../../src/infrastructure/projection';
import { Router } from '../../src/infrastructure/router';
import { Service } from '../../src/infrastructure/service';
import { Snapshotter } from '../../src/infrastructure/snapshotter';
// Messaging
import { EJSONSerializerAdapter } from '../../src/messaging/serializers/ejson-serializer-adapter';
import { CommandBus } from '../../src/messaging/command-bus';
import { EventBus } from '../../src/messaging/event-bus';
import {
  HandlingError,
  UnhandleableTypeError,
  InvalidControllerError,
  InvalidHandlerError,
  HandlerExistError,
  HandlerNotFoundError,
  UnsupportedExecutionTypeError,
  InvalidMessageableType,
  InitializingMessageAlreadyExistsError,
  SerializationError,
  UnparsableValueError,
} from '../../src/messaging/messaging-errors';
// Traits
import { CommandHandlingTrait } from '../../src/traits/command-handling.trait';
import { TypeTrait } from '../../src/traits/type.trait';
import { EjsonableTrait } from '../../src/traits/ejsonable.trait';
import { EventHandlingTrait } from '../../src/traits/event-handling.trait';
import { HandlingTrait } from '../../src/traits/handling.trait';
import {
  HookableTrait,
  HookError,
  InvalidHookActionError,
  InvalidHookIdError,
  HookAlreadyExistsError,
  HookNotFoundError,
} from '../../src/traits/hookable.trait';
import { OneToManyHandlingTrait } from '../../src/traits/one-to-many-handling.trait';
import { OneToOneHandlingTrait } from '../../src/traits/one-to-one-handling.trait';
import { RFC5424LoggingTrait } from '../../src/traits/rfc-5424-logging.trait';
import {
  StatefulTrait,
  StateError,
  UndefinedStatesError,
  InvalidStateError,
} from '../../src/traits/stateful.trait';
import {
  StatusfulTrait,
  StatusError,
  UndefinedStatusesError,
  InvalidStatusError,
} from '../../src/traits/statusful.trait';
import {
  VersionableTrait,
  VersionableError,
  InvalidSchemaVersionError,
  LegacyTransformerAlreadyExistsError,
  LegacyTransformerNotFoundError,
  InvalidLegacyTransformerError,
  NotVersionableError,
} from '../../src/traits/versionable.trait';
// Helpers
import {
  isTyped,
  isRecord,
  isPlainRecord,
  toPlainObject,
  convertObjectToCollection,
  createEJSON,
  isEventSourceableType,
  loadENV,
} from '../../src/utils/helpers';
import { loggerLoader } from '../../src/utils/logger-loader';
import {
  getInversifyMetadata,
  isInjectableClass,
  getInjectedPropertyNames,
  getInjectedParameterIndices,
  getInjectedPropertyDetails,
  hasPostConstruct,
  getPostConstructMethodNames,
  hasPreDestroy,
  getPreDestroyMethodNames,
  getMetadataSummary,
  debugInversifyMetadata,
  getAllClassProperties,
  getPropertiesToValidate,
  isPropertyInjected,
} from '../../src/utils/inversify';
// Type Helpers - Constants;
// Type Helpers - Components
import { Standard } from '../../src/domain/type-helpers/standard';
import { ValueString } from '../../src/domain/type-helpers/value-string';
import { ValueNumber } from '../../src/domain/type-helpers/value-number';

// Type Helpers - Traits
import { ValidableTrait } from '../../src/domain/type-helpers/traits/validable.trait';
import {
  GeneratorTrait,
  InvalidGeneratorIdError,
  GeneratorExistsError,
  GeneratorNotFoundError,
} from '../../src/domain/type-helpers/traits/generator.trait';
import {
  ValidatorTrait,
  InvalidValidatorIdError,
  ValidatorExistsError,
  ValidatorNotFoundError,
} from '../../src/domain/type-helpers/traits/validator.trait';
// Type Helpers - Errors
import {
  StandardError,
  UnsupportedStandardError,
  StandardExistError,
  NotApplicableError,
  UnavailableConversionError,
  StandardizedTrait,
} from '../../src/domain/type-helpers/traits/standardized.trait';

/*
EXPORTED
*/
import {
  /*
  TYPEND
  */
  // Errors
  ValidationError as ValidationErrorExported,
  InvalidDefinitionError as InvalidDefinitionErrorExported,
  InvalidTypeError as InvalidTypeErrorExported,
  InvalidValueError as InvalidValueErrorExported,
  UnequalValueError as UnequalValueErrorExported,
  UnmatchedTypeError as UnmatchedTypeErrorExported,
  NotAMemberError as NotAMemberErrorExported,
  UnexpectedKeyError as UnexpectedKeyErrorExported,
  UnknownError as UnknownErrorExported,
  TypeDescriberExistsError as TypeDescriberExistsErrorExported,
  TypeDescriberNotFoundError as TypeDescriberNotFoundErrorExported,
  PatternValidatorExistError as PatternValidatorExistErrorExported,
  PatternValidatorNotFoundError as PatternValidatorNotFoundErrorExported,
  UndefinableClassError as UndefinableClassErrorExported,
  TypeConverterExists as TypeConverterExistsExported,
  // Utilities
  PropsOf as PropsOfExported,
  TypeOf as TypeOfExported,
  // Typend end-api
  typend as typendExported,
  validator as validatorExported,
  describer as describerExported,
  converter as converterExported,
  validate as validateExported,
  isValid as isValidExported,
  isInstanceOf as isInstanceOfExported,
  check as checkExported,
  is as isExported,
  instanceOf as instanceOfExported,
  convert as convertExported,
  reflect as reflectExported,
  // Annotations
  Internal as InternalExported,
  Validable as ValidableExported,
  // Decorators
  can as canExported,
  Can as CanExported,
  // Patterns
  any as anyExported,
  iof as iofExported,
  collection as collectionExported,
  collectionIncluding as collectionIncludingExported,
  collectionWithin as collectionWithinExported,
  eq as eqExported,
  integer as integerExported,
  list as listExported,
  maybe as maybeExported,
  never as neverExported,
  oneOf as oneOfExported,
  optional as optionalExported,
  tuple as tupleExported,
  unknown as unknownExported,
  unrecognized as unrecognizedExported,
  voided as voidedExported,
  where as whereExported,
  PropTypes as PropTypesExported,
  // Utilities
  propsOf as propsOfExported,
  typeOf as typeOfExported,
  // Primitive types
  string as stringExported,
  number as numberExported,
  boolean as booleanExported,
  symbol as symbolExported,
  /*
  EVEBLE
  */
  // Annotations
  delegate as delegateExported,
  handle as handleExported,
  initial as initialExported,
  route as routeExported,
  subscribe as subscribeExported,
  version as versionExported,
  Delegate as DelegateExported,
  Handle as HandleExported,
  Initial as InitialExported,
  Route as RouteExported,
  Subscribe as SubscribeExported,
  Version as VersionExported,
  // App
  App as AppExported,
  Eveble as EvebleExported,
  PulseCommandSchedulerModule as PulseCommandSchedulerModuleExported,
  MongoDBCommitStorageModule as MongoDBCommitStorageModuleExported,
  MongoDBSnapshotStorageModule as MongoDBSnapshotStorageModuleExported,
  // Components
  Command as CommandExported,
  Assignment as AssignmentExported,
  Config as ConfigExported,
  Event as EventExported,
  ExtendableError as ExtendableErrorExported,
  Log as LogExported,
  LogMetadata as LogMetadataExported,
  Message as MessageExported,
  SerializableError as SerializableErrorExported,
  Serializable as SerializableExported,
  Struct as StructExported,
  // Config
  AppConfig as AppConfigExported,
  EvebleConfig as EvebleConfigExported,
  LoggingConfig as LoggingConfigExported,
  LogTransportConfig as LogTransportConfigExported,
  // Constants
  BINDINGS as BINDINGSExported,
  EVEBLE_BINDINGS as EVEBLE_BINDINGSExported,
  DEFAULTS as DEFAULTSExported,
  LOGGING_LEVELS as LOGGING_LEVELS_EXPORTED,
  LITERAL_KEYS as LITERAL_KEYS_EXPORTED,
  METADATA_KEYS as METADATA_KEYS_EXPORTED,
  SPECIFICATIONS as SPECIFICATIONSExported,
  // Core
  StringifingConverter as StringifingConverterExported,
  DetailedLogFormatter as DetailedLogFormatterExported,
  SimpleLogFormatter as SimpleLogFormatterExported,
  ConsoleTransport as ConsoleTransportExported,
  BaseApp as BaseAppExported,
  Kernel as KernelExported,
  kernel as kernelExported,
  Library as LibraryExported,
  LogTransport as LogTransportExported,
  Logger as LoggerExported,
  Module as ModuleExported,
  Injector as InjectorExported,
  // Core Errors
  InjectorError as InjectorErrorExported,
  InvalidEventSourceableError as InvalidEventSourceableErrorExported,
  KernelError as KernelErrorExported,
  UnavailableSerializerError as UnavailableSerializerErrorExported,
  UnavailableAsserterError as UnavailableAsserterErrorExported,
  TypeError as TypeErrorExported,
  TypeExistsError as TypeExistsErrorExported,
  TypeNotFoundError as TypeNotFoundErrorExported,
  UnregistrableTypeError as UnregistrableTypeErrorExported,
  ModuleError as ModuleErrorExported,
  AppMissingError as AppMissingErrorExported,
  InjectorMissingError as InjectorMissingErrorExported,
  InvalidModuleError as InvalidModuleErrorExported,
  InvalidConfigError as InvalidConfigErrorExported,
  InvalidEnvironmentError as InvalidEnvironmentErrorExported,
  AppError as AppErrorExported,
  InvalidAppConfigError as InvalidAppConfigErrorExported,
  LoggingError as LoggingErrorExported,
  InvalidTransportIdError as InvalidTransportIdErrorExported,
  TransportExistsError as TransportExistsErrorExported,
  // Decorators
  Type as TypeExported,
  EvebleType as EvebleTypeExported,
  // Domain
  AbilityAssertion as AbilityAssertionExported,
  StatefulAssertion as StatefulAssertionExported,
  InvalidStateTransitionError as InvalidStateTransitionErrorExported,
  StatusfulAssertion as StatusfulAssertionExported,
  InvalidStatusTransitionError as InvalidStatusTransitionErrorExported,
  Guid as GuidExported,
  Aggregate as AggregateExported,
  Asserter as AsserterExported,
  AssertionApiAlreadyExistsError as AssertionApiAlreadyExistsErrorExported,
  Assertion as AssertionExported,
  BoundedContext as BoundedContextExported,
  DomainError as DomainErrorExported,
  DomainException as DomainExceptionExported,
  Entity as EntityExported,
  EventSourceable as EventSourceableExported,
  History as HistoryExported,
  List as ListExported,
  ScheduleCommand as ScheduleCommandExported,
  UnscheduleCommand as UnscheduleCommandExported,
  Process as ProcessExported,
  ValueObject as ValueObjectExported,
  // Domain Error
  AssertionError as AssertionErrorExported,
  UndefinedActionError as UndefinedActionErrorExported,
  ListError as ListErrorExported,
  IdentifiableAlreadyExistsError as IdentifiableAlreadyExistsErrorExported,
  ElementAlreadyExistsError as ElementAlreadyExistsErrorExported,
  ElementNotFoundError as ElementNotFoundErrorExported,
  InvalidListError as InvalidListErrorExported,
  ValueObjectError as ValueObjectErrorExported,
  EntityError as EntityErrorExported,
  SavedStateNotFoundError as SavedStateNotFoundErrorExported,
  EventSourceableError as EventSourceableErrorExported,
  InvalidEventError as InvalidEventErrorExported,
  EventIdMismatchError as EventIdMismatchErrorExported,
  InvalidInitializingMessageError as InvalidInitializingMessageErrorExported,
  // Infrastructure
  PulseClient as PulseClientExported,
  MongoDBClient as MongoDBClientExported,
  PulseCommandScheduler as PulseCommandSchedulerExported,
  CommitSerializer as CommitSerializerExported,
  SnapshotSerializer as SnapshotSerializerExported,
  CommitMongoDBObserver as CommitMongoDBObserverExported,
  CommitMongoDBStorage as CommitMongoDBStorageExported,
  SnapshotMongoDBStorage as SnapshotMongoDBStorageExported,
  Commit as CommitExported,
  CommitReceiver as CommitReceiverExported,
  ScheduledJob as ScheduledJobExported,
  PulseScheduledJobTransformer as PulseScheduledJobTransformerExported,
  Client as ClientExported,
  CommandSchedulingService as CommandSchedulingServiceExported,
  CommitPublisher as CommitPublisherExported,
  CommitStore as CommitStoreExported,
  EventSourceableRepository as EventSourceableRepositoryExported,
  ProjectionRebuilder as ProjectionRebuilderExported,
  Projection as ProjectionExported,
  Router as RouterExported,
  Service as ServiceExported,
  Snapshotter as SnapshotterExported,
  // Infrastructure Errors
  InfrastructureError as InfrastructureErrorExported,
  CommitConcurrencyError as CommitConcurrencyErrorExported,
  EventsNotFoundError as EventsNotFoundErrorExported,
  AddingCommitFailedError as AddingCommitFailedErrorExported,
  UpdatingCommitError as UpdatingCommitErrorExported,
  AddingSnapshotError as AddingSnapshotErrorExported,
  UpdatingSnapshotError as UpdatingSnapshotErrorExported,
  StorageNotFoundError as StorageNotFoundErrorExported,
  RouterError as RouterErrorExported,
  MissingEventSourceableError as MissingEventSourceableErrorExported,
  MissingInitializingMessageError as MissingInitializingMessageErrorExported,
  CannotRouteMessageError as CannotRouteMessageErrorExported,
  UnresolvableIdentifierFromMessageError as UnresolvableIdentifierFromMessageErrorExported,
  UndefinedSnapshotterFrequencyError as UndefinedSnapshotterFrequencyErrorExported,
  UndefinedSnapshotterError as UndefinedSnapshotterErrorExported,
  ProjectionRebuildingError as ProjectionRebuildingErrorExported,
  ProjectionAlreadyRebuildingError as ProjectionAlreadyRebuildingErrorExported,
  ProjectionNotRebuildingError as ProjectionNotRebuildingErrorExported,
  ClientError as ClientErrorExported,
  InactiveClientError as InactiveClientErrorExported,
  SchedulerError as SchedulerErrorExported,
  CommandSchedulingError as CommandSchedulingErrorExported,
  CommandUnschedulingError as CommandUnschedulingErrorExported,
  // Messaging
  EJSONSerializerAdapter as EJSONSerializerAdapterExported,
  CommandBus as CommandBusExported,
  EventBus as EventBusExported,
  // Messaging Errors
  HandlingError as HandlingErrorExported,
  UnhandleableTypeError as UnhandleableTypeErrorExported,
  InvalidControllerError as InvalidControllerErrorExported,
  InvalidHandlerError as InvalidHandlerErrorExported,
  HandlerExistError as HandlerExistErrorExported,
  HandlerNotFoundError as HandlerNotFoundErrorExported,
  UnsupportedExecutionTypeError as UnsupportedExecutionTypeErrorExported,
  InvalidMessageableType as InvalidMessageableTypeExported,
  InitializingMessageAlreadyExistsError as InitializingMessageAlreadyExistsErrorExported,
  SerializationError as SerializationErrorExported,
  UnparsableValueError as UnparsableValueErrorExported,
  // Traits
  CommandHandlingTrait as CommandHandlingTraitExported,
  TypeTrait as TypeTraitExported,
  EjsonableTrait as EjsonableTraitExported,
  EventHandlingTrait as EventHandlingTraitExported,
  HandlingTrait as HandlingTraitExported,
  HookableTrait as HookableTraitExported,
  HookError as HookErrorExported,
  InvalidHookActionError as InvalidHookActionErrorExported,
  InvalidHookIdError as InvalidHookIdErrorExported,
  HookAlreadyExistsError as HookAlreadyExistsErrorExported,
  HookNotFoundError as HookNotFoundErrorExported,
  OneToManyHandlingTrait as OneToManyHandlingTraitExported,
  OneToOneHandlingTrait as OneToOneHandlingTraitExported,
  RFC5424LoggingTrait as RFC5424LoggingTraitExported,
  SerializableTrait as SerializableTraitExported,
  StatefulTrait as StatefulTraitExported,
  StateError as StateErrorExported,
  UndefinedStatesError as UndefinedStatesErrorExported,
  InvalidStateError as InvalidStateErrorExported,
  StatusfulTrait as StatusfulTraitExported,
  StatusError as StatusErrorExported,
  UndefinedStatusesError as UndefinedStatusesErrorExported,
  InvalidStatusError as InvalidStatusErrorExported,
  VersionableTrait as VersionableTraitExported,
  VersionableError as VersionableErrorExported,
  InvalidSchemaVersionError as InvalidSchemaVersionErrorExported,
  LegacyTransformerAlreadyExistsError as LegacyTransformerAlreadyExistsErrorExported,
  LegacyTransformerNotFoundError as LegacyTransformerNotFoundErrorExported,
  InvalidLegacyTransformerError as InvalidLegacyTransformerErrorExported,
  NotVersionableError as NotVersionableErrorExported,
  // Helpers
  isTyped as isTypedExported,
  isSerializable as isSerializableExported,
  isRecord as isRecordExported,
  isPlainRecord as isPlainRecordExported,
  toPlainObject as toPlainObjectExported,
  convertObjectToCollection as convertObjectToCollectionExported,
  resolveSerializableFromPropType as resolveSerializableFromPropTypeExported,
  createEJSON as createEJSONExported,
  isEventSourceableType as isEventSourceableTypeExported,
  loadENV as loadENVExported,
  loggerLoader as loggerLoaderExported,
  // Inversify
  getInversifyMetadata as getInversifyMetadataExported,
  isInjectableClass as isInjectableClassExported,
  getInjectedPropertyNames as getInjectedPropertyNamesExported,
  getInjectedParameterIndices as getInjectedParameterIndicesExported,
  getInjectedPropertyDetails as getInjectedPropertyDetailsExported,
  hasPostConstruct as hasPostConstructExported,
  getPostConstructMethodNames as getPostConstructMethodNamesExported,
  hasPreDestroy as hasPreDestroyExported,
  getPreDestroyMethodNames as getPreDestroyMethodNamesExported,
  getMetadataSummary as getMetadataSummaryExported,
  debugInversifyMetadata as debugInversifyMetadataExported,
  getAllClassProperties as getAllClassPropertiesExported,
  getPropertiesToValidate as getPropertiesToValidateExported,
  isPropertyInjected as isPropertyInjectedExported,
  // External
  postConstruct as postConstructExported,
  injectable as injectableExported,
  inject as injectExported,
  // Aliases imports
  Can,
  Delegate,
  Handle,
  Initial,
  Route,
  Subscribe,
  Version,
  Type,
  EvebleType,
  Serializable,
  /*
  TYPE HELPERS
  */
  // Constants
  NON_ENUMERABLE_VALUE_KEY as NON_ENUMERABLE_VALUE_KEY_EXPORTED,
  // Components
  Standard as StandardExported,
  ValueString as ValueStringExported,
  ValueNumber as ValueNumberExported,
  // Traits
  StandardizedTrait as StandardizedTraitExported,
  ValidableTrait as ValidableTraitExported,
  GeneratorTrait as GeneratorTraitExported,
  ValidatorTrait as ValidatorTraitExported,
  // Errors
  StandardError as StandardErrorExported,
  UnsupportedStandardError as UnsupportedStandardErrorExported,
  StandardExistError as StandardExistErrorExported,
  NotApplicableError as NotApplicableErrorExported,
  UnavailableConversionError as UnavailableConversionErrorExported,
  InvalidGeneratorIdError as InvalidGeneratorIdErrorExported,
  GeneratorExistsError as GeneratorExistsErrorExported,
  GeneratorNotFoundError as GeneratorNotFoundErrorExported,
  InvalidValidatorIdError as InvalidValidatorIdErrorExported,
  ValidatorExistsError as ValidatorExistsErrorExported,
  ValidatorNotFoundError as ValidatorNotFoundErrorExported,
  EmptyStringError as EmptyStringErrorExported,
} from '../../src/index';

describe(`exports`, () => {
  /*
  TYPEND
  */
  describe('Typend', () => {
    describe('errors', () => {
      it('ValidationError', () => {
        expect(ValidationErrorExported).toBe(ValidationError);
      });
      it('InvalidDefinitionError', () => {
        expect(InvalidDefinitionErrorExported).toBe(InvalidDefinitionError);
      });
      it('InvalidTypeError', () => {
        expect(InvalidTypeErrorExported).toBe(InvalidTypeError);
      });
      it('InvalidValueError', () => {
        expect(InvalidValueErrorExported).toBe(InvalidValueError);
      });
      it('UnequalValueError', () => {
        expect(UnequalValueErrorExported).toBe(UnequalValueError);
      });
      it('UnmatchedTypeError', () => {
        expect(UnmatchedTypeErrorExported).toBe(UnmatchedTypeError);
      });
      it('NotAMemberError', () => {
        expect(NotAMemberErrorExported).toBe(NotAMemberError);
      });
      it('UnexpectedKeyError', () => {
        expect(UnexpectedKeyErrorExported).toBe(UnexpectedKeyError);
      });
      it('UnknownError', () => {
        expect(UnknownErrorExported).toBe(UnknownError);
      });
      it('TypeDescriberExistsError', () => {
        expect(TypeDescriberExistsErrorExported).toBe(TypeDescriberExistsError);
      });
      it('TypeDescriberNotFoundError', () => {
        expect(TypeDescriberNotFoundErrorExported).toBe(
          TypeDescriberNotFoundError
        );
      });
      it('PatternValidatorExistError', () => {
        expect(PatternValidatorExistErrorExported).toBe(
          PatternValidatorExistError
        );
      });
      it('PatternValidatorNotFoundError', () => {
        expect(PatternValidatorNotFoundErrorExported).toBe(
          PatternValidatorNotFoundError
        );
      });
      it('UndefinableClassError', () => {
        expect(UndefinableClassErrorExported).toBe(UndefinableClassError);
      });
      it('TypeConverterExists', () => {
        expect(TypeConverterExistsExported).toBe(TypeConverterExists);
      });
    });
    describe('utilities', () => {
      it('PropsOf', () => {
        expect(PropsOfExported).toBe(PropsOf);
      });
      it('TypeOf', () => {
        expect(TypeOfExported).toBe(TypeOf);
      });
    });
    describe('annotations', () => {
      it('Internal', () => {
        expect(InternalExported).toBe(Internal);
      });
      it('Validable', () => {
        expect(ValidableExported).toBe(Validable);
      });
    });
    describe('end-api', () => {
      it('typend', () => {
        expect(typendExported).toBe(typend);
      });
      it('validator', () => {
        expect(validatorExported).toBe(validator);
      });
      it('describer', () => {
        expect(describerExported).toBe(describer);
      });
      it('converter', () => {
        expect(converterExported).toBe(converter);
      });
      it('validate', () => {
        expect(validateExported).toBe(validate);
      });
      it('isValid', () => {
        expect(isValidExported).toBe(isValid);
      });
      it('isInstanceOf', () => {
        expect(isInstanceOfExported).toBe(isInstanceOf);
      });
      it('check', () => {
        expect(checkExported).toBe(check);
      });
      it('is', () => {
        expect(isExported).toBe(is);
      });
      it('instanceOf', () => {
        expect(instanceOfExported).toBe(instanceOf);
      });
      it('convert', () => {
        expect(convertExported).toBe(convert);
      });
      it('reflect', () => {
        expect(reflectExported).toBe(reflect);
      });
    });
    describe('patterns', () => {
      it('any', () => {
        expect(anyExported).toBe(any);
      });
      it('iof', () => {
        expect(iofExported).toBe(iof);
      });
      it('collection', () => {
        expect(collectionExported).toBe(collection);
      });
      it('collectionIncluding', () => {
        expect(collectionIncludingExported).toBe(collectionIncluding);
      });
      it('collectionWithin', () => {
        expect(collectionWithinExported).toBe(collectionWithin);
      });
      it('eq', () => {
        expect(eqExported).toBe(eq);
      });
      it('integer', () => {
        expect(integerExported).toBe(integer);
      });
      it('list', () => {
        expect(listExported).toBe(list);
      });
      it('maybe', () => {
        expect(maybeExported).toBe(maybe);
      });
      it('never', () => {
        expect(neverExported).toBe(never);
      });
      it('oneOf', () => {
        expect(oneOfExported).toBe(oneOf);
      });
      it('optional', () => {
        expect(optionalExported).toBe(optional);
      });
      it('tuple', () => {
        expect(tupleExported).toBe(tuple);
      });
      it('unknown', () => {
        expect(unknownExported).toBe(unknown);
      });
      it('unrecognized', () => {
        expect(unrecognizedExported).toBe(unrecognized);
      });
      it('voided', () => {
        expect(voidedExported).toBe(voided);
      });
      it('where', () => {
        expect(whereExported).toBe(where);
      });
      it('PropTypes', () => {
        expect(PropTypesExported).toBe(PropTypes);
      });
      // Utilities
      it('propsOf', () => {
        expect(propsOfExported).toBe(propsOf);
      });
      it('typeOf', () => {
        expect(typeOfExported).toBe(typeOf);
      });
    });
    describe('primitive types', () => {
      it('string', () => {
        expect(stringExported).toBe(string);
      });
      it('number', () => {
        expect(numberExported).toBe(number);
      });
      it('boolean', () => {
        expect(booleanExported).toBe(boolean);
      });
      it('symbol', () => {
        expect(symbolExported).toBe(symbol);
      });
    });
  });

  /*
  EVEBLE
  */
  describe('Eveble', () => {
    describe('annotations', () => {
      it('delegate', () => {
        expect(delegateExported).toBe(delegate);
      });
      it('Delegate', () => {
        expect(DelegateExported).toBe(Delegate);
      });
      it('handle', () => {
        expect(handleExported).toBe(handle);
      });
      it('Handle', () => {
        expect(HandleExported).toBe(Handle);
      });
      it('initial', () => {
        expect(initialExported).toBe(initial);
      });
      it('Initial', () => {
        expect(InitialExported).toBe(Initial);
      });
      it('route', () => {
        expect(routeExported).toBe(route);
      });
      it('Route', () => {
        expect(RouteExported).toBe(Route);
      });
      it('subscribe', () => {
        expect(subscribeExported).toBe(subscribe);
      });
      it('Subscribe', () => {
        expect(SubscribeExported).toBe(Subscribe);
      });
      it('version', () => {
        expect(versionExported).toBe(version);
      });
      it('Version', () => {
        expect(VersionExported).toBe(Version);
      });
    });
    describe('annotations', () => {
      it('can', () => {
        expect(canExported).toBe(can);
      });
      it('Can', () => {
        expect(CanExported).toBe(Can);
      });
    });
    describe('app', () => {
      it('App', () => {
        expect(AppExported).toBe(App);
      });
      it('Eveble', () => {
        expect(EvebleExported).toBe(Eveble);
      });
      it('PulseCommandSchedulerModule', () => {
        expect(PulseCommandSchedulerModuleExported).toBe(
          PulseCommandSchedulerModule
        );
      });
      it('MongoDBCommitStorageModule', () => {
        expect(MongoDBCommitStorageModuleExported).toBe(
          MongoDBCommitStorageModule
        );
      });
      it('MongoDBSnapshotStorageModule', () => {
        expect(MongoDBSnapshotStorageModuleExported).toBe(
          MongoDBSnapshotStorageModule
        );
      });
    });
    describe('components', () => {
      it('Command', () => {
        expect(CommandExported).toBe(Command);
      });
      it('Assignment', () => {
        expect(AssignmentExported).toBe(Assignment);
      });
      it('Config', () => {
        expect(ConfigExported).toBe(Config);
      });
      it('Event', () => {
        expect(EventExported).toBe(Event);
      });
      it('ExtendableError', () => {
        expect(ExtendableErrorExported).toBe(ExtendableError);
      });
      it('Log', () => {
        expect(LogExported).toBe(Log);
      });
      it('LogMetadata', () => {
        expect(LogMetadataExported).toBe(LogMetadata);
      });
      it('Message', () => {
        expect(MessageExported).toBe(Message);
      });
      it('SerializableError', () => {
        expect(SerializableErrorExported).toBe(SerializableError);
      });
      it('Serializable', () => {
        expect(SerializableExported).toBe(Serializable);
      });
      it('Struct', () => {
        expect(StructExported).toBe(Struct);
      });
    });
    describe('configs', () => {
      it('AppConfig', () => {
        expect(AppConfigExported).toBe(AppConfig);
      });
      it('EvebleConfig', () => {
        expect(EvebleConfigExported).toBe(EvebleConfig);
      });
      it('LoggingConfig', () => {
        expect(LoggingConfigExported).toBe(LoggingConfig);
      });
      it('LogTransportConfig', () => {
        expect(LogTransportConfigExported).toBe(LogTransportConfig);
      });
    });
    describe('constants', () => {
      it('BINDINGS', () => {
        expect(BINDINGSExported).toBe(BINDINGS);
      });
      it('EVEBLE_BINDINGS', () => {
        expect(EVEBLE_BINDINGSExported).toBe(BINDINGS);
      });
      it('DEFAULTS', () => {
        expect(DEFAULTSExported).toBe(DEFAULTS);
      });
      it('LOGGING_LEVELS', () => {
        expect(LOGGING_LEVELS_EXPORTED).toBe(LOGGING_LEVELS);
      });
      it('LITERAL_KEYS', () => {
        expect(LITERAL_KEYS_EXPORTED).toBe(LITERAL_KEYS);
      });
      it('METADATA_KEYS', () => {
        expect(METADATA_KEYS_EXPORTED).toBe(METADATA_KEYS);
      });
      it('SPECIFICATIONS', () => {
        expect(SPECIFICATIONSExported).toBe(SPECIFICATIONS);
      });
    });
    describe('core', () => {
      it('StringifingConverter', () => {
        expect(StringifingConverterExported).toBe(StringifingConverter);
      });
      it('DetailedLogFormatter', () => {
        expect(DetailedLogFormatterExported).toBe(DetailedLogFormatter);
      });
      it('SimpleLogFormatter', () => {
        expect(SimpleLogFormatterExported).toBe(SimpleLogFormatter);
      });
      it('ConsoleTransport', () => {
        expect(ConsoleTransportExported).toBe(ConsoleTransport);
      });
      it('BaseApp', () => {
        expect(BaseAppExported).toBe(BaseApp);
      });
      it('Injector', () => {
        expect(InjectorExported).toBe(Injector);
      });
      it('Kernel', () => {
        expect(KernelExported).toBe(Kernel);
      });
      it('kernel', () => {
        expect(kernelExported).toBe(kernel);
      });
      it('Library', () => {
        expect(LibraryExported).toBe(Library);
      });
      it('LogTransport', () => {
        expect(LogTransportExported).toBe(LogTransport);
      });
      it('Logger', () => {
        expect(LoggerExported).toBe(Logger);
      });
      it('Module', () => {
        expect(ModuleExported).toBe(Module);
      });
      describe('errors', () => {
        it('InjectorError', () => {
          expect(InjectorErrorExported).toBe(InjectorError);
        });
        it('InvalidEventSourceableError', () => {
          expect(InvalidEventSourceableErrorExported).toBe(
            InvalidEventSourceableError
          );
        });
        it('KernelError', () => {
          expect(KernelErrorExported).toBe(KernelError);
        });
        it('UnavailableSerializerError', () => {
          expect(UnavailableSerializerErrorExported).toBe(
            UnavailableSerializerError
          );
        });
        it('UnavailableAsserterError', () => {
          expect(UnavailableAsserterErrorExported).toBe(
            UnavailableAsserterError
          );
        });
        it('TypeError', () => {
          expect(TypeErrorExported).toBe(TypeError);
        });
        it('TypeExistsError', () => {
          expect(TypeExistsErrorExported).toBe(TypeExistsError);
        });
        it('TypeNotFoundError', () => {
          expect(TypeNotFoundErrorExported).toBe(TypeNotFoundError);
        });
        it('UnregistrableTypeError', () => {
          expect(UnregistrableTypeErrorExported).toBe(UnregistrableTypeError);
        });
        it('ModuleError', () => {
          expect(ModuleErrorExported).toBe(ModuleError);
        });
        it('AppMissingError', () => {
          expect(AppMissingErrorExported).toBe(AppMissingError);
        });
        it('InjectorMissingError', () => {
          expect(InjectorMissingErrorExported).toBe(InjectorMissingError);
        });
        it('InvalidModuleError', () => {
          expect(InvalidModuleErrorExported).toBe(InvalidModuleError);
        });
        it('InvalidConfigError', () => {
          expect(InvalidConfigErrorExported).toBe(InvalidConfigError);
        });
        it('InvalidEnvironmentError', () => {
          expect(InvalidEnvironmentErrorExported).toBe(InvalidEnvironmentError);
        });
        it('AppError', () => {
          expect(AppErrorExported).toBe(AppError);
        });
        it('InvalidAppConfigError', () => {
          expect(InvalidAppConfigErrorExported).toBe(InvalidAppConfigError);
        });
        it('LoggingError', () => {
          expect(LoggingErrorExported).toBe(LoggingError);
        });
        it('InvalidTransportIdError', () => {
          expect(InvalidTransportIdErrorExported).toBe(InvalidTransportIdError);
        });
        it('TransportExistsError', () => {
          expect(TransportExistsErrorExported).toBe(TransportExistsError);
        });
      });
    });
  });
  describe('decorators', () => {
    it('Type', () => {
      expect(TypeExported).toBe(Type);
    });
    it('EvebleType', () => {
      expect(EvebleTypeExported).toBe(EvebleType);
    });
  });
  describe('domain', () => {
    it('AbilityAssertion', () => {
      expect(AbilityAssertionExported).toBe(AbilityAssertion);
    });
    it('StatefulAssertion', () => {
      expect(StatefulAssertionExported).toBe(StatefulAssertion);
    });
    it('InvalidStateTransitionError', () => {
      expect(InvalidStateTransitionErrorExported).toBe(
        InvalidStateTransitionError
      );
    });
    it('StatusfulAssertion', () => {
      expect(StatusfulAssertionExported).toBe(StatusfulAssertion);
    });
    it('InvalidStatusTransitionError', () => {
      expect(InvalidStatusTransitionErrorExported).toBe(
        InvalidStatusTransitionError
      );
    });
    it('Guid', () => {
      expect(GuidExported).toBe(Guid);
    });
    it('Aggregate', () => {
      expect(AggregateExported).toBe(Aggregate);
    });
    it('Asserter', () => {
      expect(AsserterExported).toBe(Asserter);
    });
    it('AssertionApiAlreadyExistsError', () => {
      expect(AssertionApiAlreadyExistsErrorExported).toBe(
        AssertionApiAlreadyExistsError
      );
    });
    it('Assertion', () => {
      expect(AssertionExported).toBe(Assertion);
    });
    it('BoundedContext', () => {
      expect(BoundedContextExported).toBe(BoundedContext);
    });
    it('DomainError', () => {
      expect(DomainErrorExported).toBe(DomainError);
    });
    it('DomainException', () => {
      expect(DomainExceptionExported).toBe(DomainException);
    });
    it('Entity', () => {
      expect(EntityExported).toBe(Entity);
    });
    it('EventSourceable', () => {
      expect(EventSourceableExported).toBe(EventSourceable);
    });
    it('History', () => {
      expect(HistoryExported).toBe(History);
    });
    it('List', () => {
      expect(ListExported).toBe(List);
    });
    it('ScheduleCommand', () => {
      expect(ScheduleCommandExported).toBe(ScheduleCommand);
    });
    it('UnscheduleCommand', () => {
      expect(UnscheduleCommandExported).toBe(UnscheduleCommand);
    });
    it('Process', () => {
      expect(ProcessExported).toBe(Process);
    });
    it('ValueObject', () => {
      expect(ValueObjectExported).toBe(ValueObject);
    });
    describe('errors', () => {
      it('AssertionError', () => {
        expect(AssertionErrorExported).toBe(AssertionError);
      });
      it('UndefinedActionError', () => {
        expect(UndefinedActionErrorExported).toBe(UndefinedActionError);
      });
      it('ListError', () => {
        expect(ListErrorExported).toBe(ListError);
      });
      it('IdentifiableAlreadyExistsError', () => {
        expect(IdentifiableAlreadyExistsErrorExported).toBe(
          IdentifiableAlreadyExistsError
        );
      });
      it('ElementAlreadyExistsError', () => {
        expect(ElementAlreadyExistsErrorExported).toBe(
          ElementAlreadyExistsError
        );
      });
      it('ElementNotFoundError', () => {
        expect(ElementNotFoundErrorExported).toBe(ElementNotFoundError);
      });
      it('InvalidListError', () => {
        expect(InvalidListErrorExported).toBe(InvalidListError);
      });
      it('ValueObjectError', () => {
        expect(ValueObjectErrorExported).toBe(ValueObjectError);
      });
      it('EntityError', () => {
        expect(EntityErrorExported).toBe(EntityError);
      });
      it('SavedStateNotFoundError', () => {
        expect(SavedStateNotFoundErrorExported).toBe(SavedStateNotFoundError);
      });
      it('EventSourceableError', () => {
        expect(EventSourceableErrorExported).toBe(EventSourceableError);
      });
      it('InvalidEventError', () => {
        expect(InvalidEventErrorExported).toBe(InvalidEventError);
      });
      it('EventIdMismatchError', () => {
        expect(EventIdMismatchErrorExported).toBe(EventIdMismatchError);
      });
      it('InvalidInitializingMessageError', () => {
        expect(InvalidInitializingMessageErrorExported).toBe(
          InvalidInitializingMessageError
        );
      });
    });
  });
  describe('infrastructure', () => {
    it('PulseClient', () => {
      expect(PulseClientExported).toBe(PulseClient);
    });
    it('MongoDBClient', () => {
      expect(MongoDBClientExported).toBe(MongoDBClient);
    });
    it('PulseCommandScheduler', () => {
      expect(PulseCommandSchedulerExported).toBe(PulseCommandScheduler);
    });
    it('CommitSerializer', () => {
      expect(CommitSerializerExported).toBe(CommitSerializer);
    });
    it('SnapshotSerializer', () => {
      expect(SnapshotSerializerExported).toBe(SnapshotSerializer);
    });
    it('CommitMongoDBObserver', () => {
      expect(CommitMongoDBObserverExported).toBe(CommitMongoDBObserver);
    });
    it('CommitMongoDBStorage', () => {
      expect(CommitMongoDBStorageExported).toBe(CommitMongoDBStorage);
    });
    it('SnapshotMongoDBStorage', () => {
      expect(SnapshotMongoDBStorageExported).toBe(SnapshotMongoDBStorage);
    });
    it('Commit', () => {
      expect(CommitExported).toBe(Commit);
    });
    it('CommitReceiver', () => {
      expect(CommitReceiverExported).toBe(CommitReceiver);
    });
    it('ScheduledJob', () => {
      expect(ScheduledJobExported).toBe(ScheduledJob);
    });
    it('PulseScheduledJobTransformer', () => {
      expect(PulseScheduledJobTransformerExported).toBe(
        PulseScheduledJobTransformer
      );
    });
    it('Client', () => {
      expect(ClientExported).toBe(Client);
    });
    it('CommandSchedulingService', () => {
      expect(CommandSchedulingServiceExported).toBe(CommandSchedulingService);
    });
    it('CommitPublisher', () => {
      expect(CommitPublisherExported).toBe(CommitPublisher);
    });
    it('CommitStore', () => {
      expect(CommitStoreExported).toBe(CommitStore);
    });
    it('EventSourceableRepository', () => {
      expect(EventSourceableRepositoryExported).toBe(EventSourceableRepository);
    });
    it('ProjectionRebuilder', () => {
      expect(ProjectionRebuilderExported).toBe(ProjectionRebuilder);
    });
    it('Projection', () => {
      expect(ProjectionExported).toBe(Projection);
    });
    it('Router', () => {
      expect(RouterExported).toBe(Router);
    });
    it('Service', () => {
      expect(ServiceExported).toBe(Service);
    });
    it('Snapshotter', () => {
      expect(SnapshotterExported).toBe(Snapshotter);
    });
    describe('errors', () => {
      it('InfrastructureError', () => {
        expect(InfrastructureErrorExported).toBe(InfrastructureError);
      });
      it('CommitConcurrencyError', () => {
        expect(CommitConcurrencyErrorExported).toBe(CommitConcurrencyError);
      });
      it('EventsNotFoundError', () => {
        expect(EventsNotFoundErrorExported).toBe(EventsNotFoundError);
      });
      it('AddingCommitFailedError', () => {
        expect(AddingCommitFailedErrorExported).toBe(AddingCommitFailedError);
      });
      it('UpdatingCommitError', () => {
        expect(UpdatingCommitErrorExported).toBe(UpdatingCommitError);
      });
      it('AddingSnapshotError', () => {
        expect(AddingSnapshotErrorExported).toBe(AddingSnapshotError);
      });
      it('UpdatingSnapshotError', () => {
        expect(UpdatingSnapshotErrorExported).toBe(UpdatingSnapshotError);
      });
      it('StorageNotFoundError', () => {
        expect(StorageNotFoundErrorExported).toBe(StorageNotFoundError);
      });
      it('RouterError', () => {
        expect(RouterErrorExported).toBe(RouterError);
      });
      it('MissingEventSourceableError', () => {
        expect(MissingEventSourceableErrorExported).toBe(
          MissingEventSourceableError
        );
      });
      it('MissingInitializingMessageError', () => {
        expect(MissingInitializingMessageErrorExported).toBe(
          MissingInitializingMessageError
        );
      });
      it('CannotRouteMessageError', () => {
        expect(CannotRouteMessageErrorExported).toBe(CannotRouteMessageError);
      });
      it('UnresolvableIdentifierFromMessageError', () => {
        expect(UnresolvableIdentifierFromMessageErrorExported).toBe(
          UnresolvableIdentifierFromMessageError
        );
      });
      it('UndefinedSnapshotterFrequencyError', () => {
        expect(UndefinedSnapshotterFrequencyErrorExported).toBe(
          UndefinedSnapshotterFrequencyError
        );
      });
      it('UndefinedSnapshotterError', () => {
        expect(UndefinedSnapshotterErrorExported).toBe(
          UndefinedSnapshotterError
        );
      });
      it('ProjectionRebuildingError', () => {
        expect(ProjectionRebuildingErrorExported).toBe(
          ProjectionRebuildingError
        );
      });
      it('ProjectionAlreadyRebuildingError', () => {
        expect(ProjectionAlreadyRebuildingErrorExported).toBe(
          ProjectionAlreadyRebuildingError
        );
      });
      it('ProjectionNotRebuildingError', () => {
        expect(ProjectionNotRebuildingErrorExported).toBe(
          ProjectionNotRebuildingError
        );
      });
      it('ClientError', () => {
        expect(ClientErrorExported).toBe(ClientError);
      });
      it('InactiveClientError', () => {
        expect(InactiveClientErrorExported).toBe(InactiveClientError);
      });
      it('SchedulerError', () => {
        expect(SchedulerErrorExported).toBe(SchedulerError);
      });
      it('CommandSchedulingError', () => {
        expect(CommandSchedulingErrorExported).toBe(CommandSchedulingError);
      });
      it('CommandUnschedulingError', () => {
        expect(CommandUnschedulingErrorExported).toBe(CommandUnschedulingError);
      });
    });
  });
  describe('messaging', () => {
    it('EJSONSerializerAdapter', () => {
      expect(EJSONSerializerAdapterExported).toBe(EJSONSerializerAdapter);
    });
    it('CommandBus', () => {
      expect(CommandBusExported).toBe(CommandBus);
    });
    it('EventBus', () => {
      expect(EventBusExported).toBe(EventBus);
    });
    describe('errors', () => {
      it('HandlingError', () => {
        expect(HandlingErrorExported).toBe(HandlingError);
      });
      it('UnhandleableTypeError', () => {
        expect(UnhandleableTypeErrorExported).toBe(UnhandleableTypeError);
      });
      it('InvalidControllerError', () => {
        expect(InvalidControllerErrorExported).toBe(InvalidControllerError);
      });
      it('InvalidHandlerError', () => {
        expect(InvalidHandlerErrorExported).toBe(InvalidHandlerError);
      });
      it('HandlerExistError', () => {
        expect(HandlerExistErrorExported).toBe(HandlerExistError);
      });
      it('HandlerNotFoundError', () => {
        expect(HandlerNotFoundErrorExported).toBe(HandlerNotFoundError);
      });
      it('UnsupportedExecutionTypeError', () => {
        expect(UnsupportedExecutionTypeErrorExported).toBe(
          UnsupportedExecutionTypeError
        );
      });
      it('InvalidMessageableType', () => {
        expect(InvalidMessageableTypeExported).toBe(InvalidMessageableType);
      });
      it('InitializingMessageAlreadyExistsError', () => {
        expect(InitializingMessageAlreadyExistsErrorExported).toBe(
          InitializingMessageAlreadyExistsError
        );
      });
      it('SerializationError', () => {
        expect(SerializationErrorExported).toBe(SerializationError);
      });
      it('UnparsableValueError', () => {
        expect(UnparsableValueErrorExported).toBe(UnparsableValueError);
      });
    });
  });
  describe('traits', () => {
    it('CommandHandlingTrait', () => {
      expect(CommandHandlingTraitExported).toBe(CommandHandlingTrait);
    });
    it('TypeTrait', () => {
      expect(TypeTraitExported).toBe(TypeTrait);
    });
    it('EjsonableTrait', () => {
      expect(EjsonableTraitExported).toBe(EjsonableTrait);
    });
    it('EventHandlingTrait', () => {
      expect(EventHandlingTraitExported).toBe(EventHandlingTrait);
    });
    it('HandlingTrait', () => {
      expect(HandlingTraitExported).toBe(HandlingTrait);
    });

    it('OneToManyHandlingTrait', () => {
      expect(OneToManyHandlingTraitExported).toBe(OneToManyHandlingTrait);
    });
    it('OneToOneHandlingTrait', () => {
      expect(OneToOneHandlingTraitExported).toBe(OneToOneHandlingTrait);
    });
    it('RFC5424LoggingTrait', () => {
      expect(RFC5424LoggingTraitExported).toBe(RFC5424LoggingTrait);
    });
    it('SerializableTrait', () => {
      expect(SerializableTraitExported).toBe(SerializableTrait);
    });

    describe('HookableTrait', () => {
      it('HookableTrait', () => {
        expect(HookableTraitExported).toBe(HookableTrait);
      });
      it('HookError', () => {
        expect(HookErrorExported).toBe(HookError);
      });
      it('InvalidHookActionError', () => {
        expect(InvalidHookActionErrorExported).toBe(InvalidHookActionError);
      });
      it('InvalidHookIdError', () => {
        expect(InvalidHookIdErrorExported).toBe(InvalidHookIdError);
      });
      it('HookAlreadyExistsError', () => {
        expect(HookAlreadyExistsErrorExported).toBe(HookAlreadyExistsError);
      });
      it('HookNotFoundError', () => {
        expect(HookNotFoundErrorExported).toBe(HookNotFoundError);
      });
    });
    describe('StatefulTrait', () => {
      it('StatefulTrait', () => {
        expect(StatefulTraitExported).toBe(StatefulTrait);
      });
      it('StateError', () => {
        expect(StateErrorExported).toBe(StateError);
      });
      it('UndefinedStatesError', () => {
        expect(UndefinedStatesErrorExported).toBe(UndefinedStatesError);
      });
      it('InvalidStateError', () => {
        expect(InvalidStateErrorExported).toBe(InvalidStateError);
      });
    });
    describe('StatusfulTrait', () => {
      it('StatusfulTrait', () => {
        expect(StatusfulTraitExported).toBe(StatusfulTrait);
      });
      it('StatusError', () => {
        expect(StatusErrorExported).toBe(StatusError);
      });
      it('UndefinedStatusesError', () => {
        expect(UndefinedStatusesErrorExported).toBe(UndefinedStatusesError);
      });
      it('InvalidStatusError', () => {
        expect(InvalidStatusErrorExported).toBe(InvalidStatusError);
      });
    });
    describe('VersionablMixin', () => {
      it('VersionableTrait', () => {
        expect(VersionableTraitExported).toBe(VersionableTrait);
      });
      it('VersionableError', () => {
        expect(VersionableErrorExported).toBe(VersionableError);
      });
      it('InvalidSchemaVersionError', () => {
        expect(InvalidSchemaVersionErrorExported).toBe(
          InvalidSchemaVersionError
        );
      });
      it('LegacyTransformerAlreadyExistsError', () => {
        expect(LegacyTransformerAlreadyExistsErrorExported).toBe(
          LegacyTransformerAlreadyExistsError
        );
      });
      it('LegacyTransformerNotFoundError', () => {
        expect(LegacyTransformerNotFoundErrorExported).toBe(
          LegacyTransformerNotFoundError
        );
      });
      it('InvalidLegacyTransformerError', () => {
        expect(InvalidLegacyTransformerErrorExported).toBe(
          InvalidLegacyTransformerError
        );
      });
      it('NotVersionableError', () => {
        expect(NotVersionableErrorExported).toBe(NotVersionableError);
      });
    });
  });
  describe('helpers', () => {
    it('isTyped', () => {
      expect(isTypedExported).toBe(isTyped);
    });
    it('isSerializable', () => {
      expect(isSerializableExported).toBe(isSerializable);
    });
    it('isRecord', () => {
      expect(isRecordExported).toBe(isRecord);
    });
    it('isPlainRecord', () => {
      expect(isPlainRecordExported).toBe(isPlainRecord);
    });
    it('toPlainObject', () => {
      expect(toPlainObjectExported).toBe(toPlainObject);
    });
    it('convertObjectToCollection', () => {
      expect(convertObjectToCollectionExported).toBe(convertObjectToCollection);
    });
    it('resolveSerializableFromPropType', () => {
      expect(resolveSerializableFromPropTypeExported).toBe(
        resolveSerializableFromPropType
      );
    });
    it('createEJSON', () => {
      expect(createEJSONExported).toBe(createEJSON);
    });
    it('isEventSourceableType', () => {
      expect(isEventSourceableTypeExported).toBe(isEventSourceableType);
    });
    it('loadENV', () => {
      expect(loadENVExported).toBe(loadENV);
    });
    it('loggerLoader', () => {
      expect(loggerLoaderExported).toBe(loggerLoader);
    });
  });

  describe('inversify', () => {
    it('getInversifyMetadata', () => {
      expect(getInversifyMetadataExported).toBe(getInversifyMetadata);
    });
    it('isInjectableClass', () => {
      expect(isInjectableClassExported).toBe(isInjectableClass);
    });
    it('getInjectedPropertyNames', () => {
      expect(getInjectedPropertyNamesExported).toBe(getInjectedPropertyNames);
    });
    it('getInjectedParameterIndices', () => {
      expect(getInjectedParameterIndicesExported).toBe(
        getInjectedParameterIndices
      );
    });
    it('getInjectedPropertyDetails', () => {
      expect(getInjectedPropertyDetailsExported).toBe(
        getInjectedPropertyDetails
      );
    });
    it('hasPostConstruct', () => {
      expect(hasPostConstructExported).toBe(hasPostConstruct);
    });
    it('getPostConstructMethodNames', () => {
      expect(getPostConstructMethodNamesExported).toBe(
        getPostConstructMethodNames
      );
    });
    it('hasPreDestroy', () => {
      expect(hasPreDestroyExported).toBe(hasPreDestroy);
    });
    it('getPreDestroyMethodNames', () => {
      expect(getPreDestroyMethodNamesExported).toBe(getPreDestroyMethodNames);
    });
    it('getMetadataSummary', () => {
      expect(getMetadataSummaryExported).toBe(getMetadataSummary);
    });
    it('debugInversifyMetadata', () => {
      expect(debugInversifyMetadataExported).toBe(debugInversifyMetadata);
    });
    it('getAllClassProperties', () => {
      expect(getAllClassPropertiesExported).toBe(getAllClassProperties);
    });
    it('getPropertiesToValidate', () => {
      expect(getPropertiesToValidateExported).toBe(getPropertiesToValidate);
    });
    it('isPropertyInjected', () => {
      expect(isPropertyInjectedExported).toBe(isPropertyInjected);
    });
  });

  describe('external', () => {
    it('postConstruct', () => {
      expect(postConstructExported).toBe(postConstruct);
    });
    it('injectable', () => {
      expect(injectableExported).toBe(injectable);
    });
    it('inject', () => {
      expect(injectExported).toBe(inject);
    });
  });

  describe('type helpers', () => {
    describe('constants', () => {
      it('NON_ENUMERABLE_VALUE_KEY', () => {
        expect(NON_ENUMERABLE_VALUE_KEY_EXPORTED).toBe(
          NON_ENUMERABLE_VALUE_KEY
        );
      });
    });

    describe('components', () => {
      it('Standard', () => {
        expect(StandardExported).toBe(Standard);
      });
      it('ValueString', () => {
        expect(ValueStringExported).toBe(ValueString);
      });
      it('ValueNumber', () => {
        expect(ValueNumberExported).toBe(ValueNumber);
      });
    });

    describe('traits', () => {
      it('StandardizedTrait', () => {
        expect(StandardizedTraitExported).toBe(StandardizedTrait);
      });
      it('ValidableTrait', () => {
        expect(ValidableTraitExported).toBe(ValidableTrait);
      });
      it('GeneratorTrait', () => {
        expect(GeneratorTraitExported).toBe(GeneratorTrait);
      });
      it('ValidatorTrait', () => {
        expect(ValidatorTraitExported).toBe(ValidatorTrait);
      });
    });

    describe('errors', () => {
      describe('StandardizedTrait errors', () => {
        it('StandardError', () => {
          expect(StandardErrorExported).toBe(StandardError);
        });
        it('UnsupportedStandardError', () => {
          expect(UnsupportedStandardErrorExported).toBe(
            UnsupportedStandardError
          );
        });
        it('StandardExistError', () => {
          expect(StandardExistErrorExported).toBe(StandardExistError);
        });
        it('NotApplicableError', () => {
          expect(NotApplicableErrorExported).toBe(NotApplicableError);
        });
        it('UnavailableConversionError', () => {
          expect(UnavailableConversionErrorExported).toBe(
            UnavailableConversionError
          );
        });
      });

      describe('GeneratorTrait errors', () => {
        it('InvalidGeneratorIdError', () => {
          expect(InvalidGeneratorIdErrorExported).toBe(InvalidGeneratorIdError);
        });
        it('GeneratorExistsError', () => {
          expect(GeneratorExistsErrorExported).toBe(GeneratorExistsError);
        });
        it('GeneratorNotFoundError', () => {
          expect(GeneratorNotFoundErrorExported).toBe(GeneratorNotFoundError);
        });
      });

      describe('ValidatorTrait errors', () => {
        it('InvalidValidatorIdError', () => {
          expect(InvalidValidatorIdErrorExported).toBe(InvalidValidatorIdError);
        });
        it('ValidatorExistsError', () => {
          expect(ValidatorExistsErrorExported).toBe(ValidatorExistsError);
        });
        it('ValidatorNotFoundError', () => {
          expect(ValidatorNotFoundErrorExported).toBe(ValidatorNotFoundError);
        });
      });

      describe('domain errors', () => {
        it('EmptyStringError', () => {
          expect(EmptyStringErrorExported).toBe(EmptyStringError);
        });
      });
    });
  });
});
