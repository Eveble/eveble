import { expect } from 'chai';
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
  internal,
  validable,
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
  define,
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
import { AgendaCommandSchedulerModule } from '../../src/app/modules/agenda-command-scheduler-module';
import { MongoDBCommitStorageModule } from '../../src/app/modules/mongodb-commit-storage-module';
import { MongoDBSnapshotStorageModule } from '../../src/app/modules/mongodb-snapshot-storage-module';
// Components
import { Command, Assignment } from '../../src/components/command';
import { Config } from '../../src/components/config';
import { Event } from '../../src/components/event';
import { Log, LogMetadata } from '../../src/components/log-entry';
import { Message } from '../../src/components/message';
import { SerializableError } from '../../src/components/serializable-error';
import { Serializable } from '../../src/components/serializable';
import { Struct } from '../../src/components/struct';
// Config
import { AppConfig } from '../../src/configs/app-config';
import { EvebleConfig } from '../../src/configs/eveble-config';
import { LoggingConfig } from '../../src/configs/logging-config';
import { LogTransportConfig } from '../../src/configs/log-transport-config';
// Constants
import { BINDINGS } from '../../src/constants/bindings';
import { LITERAL_KEYS } from '../../src/constants/literal-keys';
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
import { AgendaClient } from '../../src/app/clients/agenda-client';
import { MongoDBClient } from '../../src/app/clients/mongodb-client';
import { AgendaCommandScheduler } from '../../src/infrastructure/schedulers/agenda-command-scheduler';
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
import { AgendaScheduledJobTransformer } from '../../src/infrastructure/transformers/agenda-scheduled-job-transformer';
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
// Mixins
import { CommandHandlingMixin } from '../../src/mixins/command-handling-mixin';
import { TypeTrait } from '../../src/mixins/definable-mixin';
import { EjsonableMixin } from '../../src/mixins/ejsonable-mixin';
import { EventHandlingMixin } from '../../src/mixins/event-handling-mixin';
import {
  HookableTrait,
  HookError,
  InvalidHookActionError,
  InvalidHookIdError,
  HookAlreadyExistsError,
  HookNotFoundError,
} from '../../src/trait/hookable.trait';
import { OneToManyHandlingMixin } from '../../src/mixins/one-to-many-handling-mixin';
import { OneToOneHandlingMixin } from '../../src/mixins/one-to-one-handling-mixin';
import { RFC5424LoggingMixin } from '../../src/mixins/rfc-5424-logging-mixin';
import { SerializableMixin } from '../../src/mixins/serializable-mixin';
import {
  StatefulMixin,
  StateError,
  UndefinedStatesError,
  InvalidStateError,
} from '../../src/mixins/stateful-mixin';
import {
  StatusfulMixin,
  StatusError,
  UndefinedStatusesError,
  InvalidStatusError,
} from '../../src/mixins/statusful-mixin';
import {
  VersionableMixin,
  VersionableError,
  InvalidSchemaVersionError,
  LegacyTransformerAlreadyExistsError,
  LegacyTransformerNotFoundError,
  InvalidLegacyTransformerError,
  NotVersionableError,
} from '../../src/mixins/versionable-mixin';
// Helpers
import {
  isTyped,
  isRecord,
  isPlainRecord,
  hasPostConstruct,
  toPlainObject,
  convertObjectToCollection,
  createEJSON,
  isEventSourceableType,
  loadENV,
} from '../../src/utils/helpers';
import { loggerLoader } from '../../src/utils/logger-loader';

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
  internal as internalExported,
  Internal as InternalExported,
  validable as validableExported,
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
  AgendaCommandSchedulerModule as AgendaCommandSchedulerModuleExported,
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
  // eslint-disable-next-line camelcase
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
  define as defineExported,
  Define as DefineExported,
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
  AgendaClient as AgendaClientExported,
  MongoDBClient as MongoDBClientExported,
  AgendaCommandScheduler as AgendaCommandSchedulerExported,
  CommitSerializer as CommitSerializerExported,
  SnapshotSerializer as SnapshotSerializerExported,
  CommitMongoDBObserver as CommitMongoDBObserverExported,
  CommitMongoDBStorage as CommitMongoDBStorageExported,
  SnapshotMongoDBStorage as SnapshotMongoDBStorageExported,
  Commit as CommitExported,
  CommitReceiver as CommitReceiverExported,
  ScheduledJob as ScheduledJobExported,
  AgendaScheduledJobTransformer as AgendaScheduledJobTransformerExported,
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
  // Mixins
  CommandHandlingMixin as CommandHandlingMixinExported,
  TypeTrait as TypeTraitExported,
  EjsonableMixin as EjsonableMixinExported,
  EventHandlingMixin as EventHandlingMixinExported,
  HookableTrait as HookableTraitExported,
  HookError as HookErrorExported,
  InvalidHookActionError as InvalidHookActionErrorExported,
  InvalidHookIdError as InvalidHookIdErrorExported,
  HookAlreadyExistsError as HookAlreadyExistsErrorExported,
  HookNotFoundError as HookNotFoundErrorExported,
  OneToManyHandlingMixin as OneToManyHandlingMixinExported,
  OneToOneHandlingMixin as OneToOneHandlingMixinExported,
  RFC5424LoggingMixin as RFC5424LoggingMixinExported,
  SerializableMixin as SerializableMixinExported,
  StatefulMixin as StatefulMixinExported,
  StateError as StateErrorExported,
  UndefinedStatesError as UndefinedStatesErrorExported,
  InvalidStateError as InvalidStateErrorExported,
  StatusfulMixin as StatusfulMixinExported,
  StatusError as StatusErrorExported,
  UndefinedStatusesError as UndefinedStatusesErrorExported,
  InvalidStatusError as InvalidStatusErrorExported,
  VersionableMixin as VersionableMixinExported,
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
  hasPostConstruct as hasPostConstructExported,
  toPlainObject as toPlainObjectExported,
  convertObjectToCollection as convertObjectToCollectionExported,
  resolveSerializableFromPropType as resolveSerializableFromPropTypeExported,
  createEJSON as createEJSONExported,
  isEventSourceableType as isEventSourceableTypeExported,
  loadENV as loadENVExported,
  loggerLoader as loggerLoaderExported,
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
  Define,
  Type,
  EvebleType,
  Internal,
  Validable,
} from '../../src/index';

describe(`exports`, () => {
  /*
  TYPEND
  */
  describe('Typend', () => {
    describe('errors', () => {
      it('ValidationError', () => {
        expect(ValidationErrorExported).to.be.equal(ValidationError);
      });
      it('InvalidDefinitionError', () => {
        expect(InvalidDefinitionErrorExported).to.be.equal(
          InvalidDefinitionError
        );
      });
      it('InvalidTypeError', () => {
        expect(InvalidTypeErrorExported).to.be.equal(InvalidTypeError);
      });
      it('InvalidValueError', () => {
        expect(InvalidValueErrorExported).to.be.equal(InvalidValueError);
      });
      it('UnequalValueError', () => {
        expect(UnequalValueErrorExported).to.be.equal(UnequalValueError);
      });
      it('UnmatchedTypeError', () => {
        expect(UnmatchedTypeErrorExported).to.be.equal(UnmatchedTypeError);
      });
      it('NotAMemberError', () => {
        expect(NotAMemberErrorExported).to.be.equal(NotAMemberError);
      });
      it('UnexpectedKeyError', () => {
        expect(UnexpectedKeyErrorExported).to.be.equal(UnexpectedKeyError);
      });
      it('UnknownError', () => {
        expect(UnknownErrorExported).to.be.equal(UnknownError);
      });
      it('TypeDescriberExistsError', () => {
        expect(TypeDescriberExistsErrorExported).to.be.equal(
          TypeDescriberExistsError
        );
      });
      it('TypeDescriberNotFoundError', () => {
        expect(TypeDescriberNotFoundErrorExported).to.be.equal(
          TypeDescriberNotFoundError
        );
      });
      it('PatternValidatorExistError', () => {
        expect(PatternValidatorExistErrorExported).to.be.equal(
          PatternValidatorExistError
        );
      });
      it('PatternValidatorNotFoundError', () => {
        expect(PatternValidatorNotFoundErrorExported).to.be.equal(
          PatternValidatorNotFoundError
        );
      });
      it('UndefinableClassError', () => {
        expect(UndefinableClassErrorExported).to.be.equal(
          UndefinableClassError
        );
      });
      it('TypeConverterExists', () => {
        expect(TypeConverterExistsExported).to.be.equal(TypeConverterExists);
      });
    });
    describe('utilities', () => {
      it('PropsOf', () => {
        expect(PropsOfExported).to.be.equal(PropsOf);
      });
      it('TypeOf', () => {
        expect(TypeOfExported).to.be.equal(TypeOf);
      });
    });
    describe('annotations', () => {
      it('internal', () => {
        expect(internalExported).to.be.equal(internal);
      });
      it('validable', () => {
        expect(validableExported).to.be.equal(validable);
      });
      it('Internal', () => {
        expect(InternalExported).to.be.equal(Internal);
      });
      it('Validable', () => {
        expect(ValidableExported).to.be.equal(Validable);
      });
    });
    describe('end-api', () => {
      it('typend', () => {
        expect(typendExported).to.be.equal(typend);
      });
      it('validator', () => {
        expect(validatorExported).to.be.equal(validator);
      });
      it('describer', () => {
        expect(describerExported).to.be.equal(describer);
      });
      it('converter', () => {
        expect(converterExported).to.be.equal(converter);
      });
      it('validate', () => {
        expect(validateExported).to.be.equal(validate);
      });
      it('isValid', () => {
        expect(isValidExported).to.be.equal(isValid);
      });
      it('isInstanceOf', () => {
        expect(isInstanceOfExported).to.be.equal(isInstanceOf);
      });
      it('check', () => {
        expect(checkExported).to.be.equal(check);
      });
      it('is', () => {
        expect(isExported).to.be.equal(is);
      });
      it('instanceOf', () => {
        expect(instanceOfExported).to.be.equal(instanceOf);
      });
      it('convert', () => {
        expect(convertExported).to.be.equal(convert);
      });
      it('reflect', () => {
        expect(reflectExported).to.be.equal(reflect);
      });
    });
    describe('patterns', () => {
      it('any', () => {
        expect(anyExported).to.be.equal(any);
      });
      it('iof', () => {
        expect(iofExported).to.be.equal(iof);
      });
      it('collection', () => {
        expect(collectionExported).to.be.equal(collection);
      });
      it('collectionIncluding', () => {
        expect(collectionIncludingExported).to.be.equal(collectionIncluding);
      });
      it('collectionWithin', () => {
        expect(collectionWithinExported).to.be.equal(collectionWithin);
      });
      it('eq', () => {
        expect(eqExported).to.be.equal(eq);
      });
      it('integer', () => {
        expect(integerExported).to.be.equal(integer);
      });
      it('list', () => {
        expect(listExported).to.be.equal(list);
      });
      it('maybe', () => {
        expect(maybeExported).to.be.equal(maybe);
      });
      it('never', () => {
        expect(neverExported).to.be.equal(never);
      });
      it('oneOf', () => {
        expect(oneOfExported).to.be.equal(oneOf);
      });
      it('optional', () => {
        expect(optionalExported).to.be.equal(optional);
      });
      it('tuple', () => {
        expect(tupleExported).to.be.equal(tuple);
      });
      it('unknown', () => {
        expect(unknownExported).to.be.equal(unknown);
      });
      it('unrecognized', () => {
        expect(unrecognizedExported).to.be.equal(unrecognized);
      });
      it('voided', () => {
        expect(voidedExported).to.be.equal(voided);
      });
      it('where', () => {
        expect(whereExported).to.be.equal(where);
      });
      it('PropTypes', () => {
        expect(PropTypesExported).to.be.equal(PropTypes);
      });
      // Utilities
      it('propsOf', () => {
        expect(propsOfExported).to.be.equal(propsOf);
      });
      it('typeOf', () => {
        expect(typeOfExported).to.be.equal(typeOf);
      });
    });
    describe('primitive types', () => {
      it('string', () => {
        expect(stringExported).to.be.equal(string);
      });
      it('number', () => {
        expect(numberExported).to.be.equal(number);
      });
      it('boolean', () => {
        expect(booleanExported).to.be.equal(boolean);
      });
      it('symbol', () => {
        expect(symbolExported).to.be.equal(symbol);
      });
    });
  });

  /*
  EVEBLE
  */
  describe('Eveble', () => {
    describe('annotations', () => {
      it('delegate', () => {
        expect(delegateExported).to.be.equal(delegate);
      });
      it('Delegate', () => {
        expect(DelegateExported).to.be.equal(Delegate);
      });
      it('handle', () => {
        expect(handleExported).to.be.equal(handle);
      });
      it('Handle', () => {
        expect(HandleExported).to.be.equal(Handle);
      });
      it('initial', () => {
        expect(initialExported).to.be.equal(initial);
      });
      it('Initial', () => {
        expect(InitialExported).to.be.equal(Initial);
      });
      it('route', () => {
        expect(routeExported).to.be.equal(route);
      });
      it('Route', () => {
        expect(RouteExported).to.be.equal(Route);
      });
      it('subscribe', () => {
        expect(subscribeExported).to.be.equal(subscribe);
      });
      it('Subscribe', () => {
        expect(SubscribeExported).to.be.equal(Subscribe);
      });
      it('version', () => {
        expect(versionExported).to.be.equal(version);
      });
      it('Version', () => {
        expect(VersionExported).to.be.equal(Version);
      });
    });
    describe('annotations', () => {
      it('can', () => {
        expect(canExported).to.be.equal(can);
      });
      it('Can', () => {
        expect(CanExported).to.be.equal(Can);
      });
    });
    describe('app', () => {
      it('App', () => {
        expect(AppExported).to.be.equal(App);
      });
      it('Eveble', () => {
        expect(EvebleExported).to.be.equal(Eveble);
      });
      it('AgendaCommandSchedulerModule', () => {
        expect(AgendaCommandSchedulerModuleExported).to.be.equal(
          AgendaCommandSchedulerModule
        );
      });
      it('MongoDBCommitStorageModule', () => {
        expect(MongoDBCommitStorageModuleExported).to.be.equal(
          MongoDBCommitStorageModule
        );
      });
      it('MongoDBSnapshotStorageModule', () => {
        expect(MongoDBSnapshotStorageModuleExported).to.be.equal(
          MongoDBSnapshotStorageModule
        );
      });
    });
    describe('components', () => {
      it('Command', () => {
        expect(CommandExported).to.be.equal(Command);
      });
      it('Assignment', () => {
        expect(AssignmentExported).to.be.equal(Assignment);
      });
      it('Config', () => {
        expect(ConfigExported).to.be.equal(Config);
      });
      it('Event', () => {
        expect(EventExported).to.be.equal(Event);
      });
      it('ExtendableError', () => {
        expect(ExtendableErrorExported).to.be.equal(ExtendableError);
      });
      it('Log', () => {
        expect(LogExported).to.be.equal(Log);
      });
      it('LogMetadata', () => {
        expect(LogMetadataExported).to.be.equal(LogMetadata);
      });
      it('Message', () => {
        expect(MessageExported).to.be.equal(Message);
      });
      it('SerializableError', () => {
        expect(SerializableErrorExported).to.be.equal(SerializableError);
      });
      it('Serializable', () => {
        expect(SerializableExported).to.be.equal(Serializable);
      });
      it('Struct', () => {
        expect(StructExported).to.be.equal(Struct);
      });
    });
    describe('configs', () => {
      it('AppConfig', () => {
        expect(AppConfigExported).to.be.equal(AppConfig);
      });
      it('EvebleConfig', () => {
        expect(EvebleConfigExported).to.be.equal(EvebleConfig);
      });
      it('LoggingConfig', () => {
        expect(LoggingConfigExported).to.be.equal(LoggingConfig);
      });
      it('LogTransportConfig', () => {
        expect(LogTransportConfigExported).to.be.equal(LogTransportConfig);
      });
    });
    describe('constants', () => {
      it('BINDINGS', () => {
        expect(BINDINGSExported).to.be.equal(BINDINGS);
      });
      it('EVEBLE_BINDINGS', () => {
        expect(EVEBLE_BINDINGSExported).to.be.equal(BINDINGS);
      });
      it('DEFAULTS', () => {
        expect(DEFAULTSExported).to.be.equal(DEFAULTS);
      });
      it('LOGGING_LEVELS', () => {
        expect(LOGGING_LEVELS_EXPORTED).to.be.equal(LOGGING_LEVELS);
      });
      it('LITERAL_KEYS', () => {
        expect(LITERAL_KEYS_EXPORTED).to.be.equal(LITERAL_KEYS);
      });
      it('METADATA_KEYS', () => {
        expect(METADATA_KEYS_EXPORTED).to.be.equal(METADATA_KEYS);
      });
      it('SPECIFICATIONS', () => {
        expect(SPECIFICATIONSExported).to.be.equal(SPECIFICATIONS);
      });
    });
    describe('core', () => {
      it('StringifingConverter', () => {
        expect(StringifingConverterExported).to.be.equal(StringifingConverter);
      });
      it('DetailedLogFormatter', () => {
        expect(DetailedLogFormatterExported).to.be.equal(DetailedLogFormatter);
      });
      it('SimpleLogFormatter', () => {
        expect(SimpleLogFormatterExported).to.be.equal(SimpleLogFormatter);
      });
      it('ConsoleTransport', () => {
        expect(ConsoleTransportExported).to.be.equal(ConsoleTransport);
      });
      it('BaseApp', () => {
        expect(BaseAppExported).to.be.equal(BaseApp);
      });
      it('Injector', () => {
        expect(InjectorExported).to.be.equal(Injector);
      });
      it('Kernel', () => {
        expect(KernelExported).to.be.equal(Kernel);
      });
      it('kernel', () => {
        expect(kernelExported).to.be.equal(kernel);
      });
      it('Library', () => {
        expect(LibraryExported).to.be.equal(Library);
      });
      it('LogTransport', () => {
        expect(LogTransportExported).to.be.equal(LogTransport);
      });
      it('Logger', () => {
        expect(LoggerExported).to.be.equal(Logger);
      });
      it('Module', () => {
        expect(ModuleExported).to.be.equal(Module);
      });
      describe('errors', () => {
        it('InjectorError', () => {
          expect(InjectorErrorExported).to.be.equal(InjectorError);
        });
        it('InvalidEventSourceableError', () => {
          expect(InvalidEventSourceableErrorExported).to.be.equal(
            InvalidEventSourceableError
          );
        });
        it('KernelError', () => {
          expect(KernelErrorExported).to.be.equal(KernelError);
        });
        it('UnavailableSerializerError', () => {
          expect(UnavailableSerializerErrorExported).to.be.equal(
            UnavailableSerializerError
          );
        });
        it('UnavailableAsserterError', () => {
          expect(UnavailableAsserterErrorExported).to.be.equal(
            UnavailableAsserterError
          );
        });
        it('TypeError', () => {
          expect(TypeErrorExported).to.be.equal(TypeError);
        });
        it('TypeExistsError', () => {
          expect(TypeExistsErrorExported).to.be.equal(TypeExistsError);
        });
        it('TypeNotFoundError', () => {
          expect(TypeNotFoundErrorExported).to.be.equal(TypeNotFoundError);
        });
        it('UnregistrableTypeError', () => {
          expect(UnregistrableTypeErrorExported).to.be.equal(
            UnregistrableTypeError
          );
        });
        it('ModuleError', () => {
          expect(ModuleErrorExported).to.be.equal(ModuleError);
        });
        it('AppMissingError', () => {
          expect(AppMissingErrorExported).to.be.equal(AppMissingError);
        });
        it('InjectorMissingError', () => {
          expect(InjectorMissingErrorExported).to.be.equal(
            InjectorMissingError
          );
        });
        it('InvalidModuleError', () => {
          expect(InvalidModuleErrorExported).to.be.equal(InvalidModuleError);
        });
        it('InvalidConfigError', () => {
          expect(InvalidConfigErrorExported).to.be.equal(InvalidConfigError);
        });
        it('InvalidEnvironmentError', () => {
          expect(InvalidEnvironmentErrorExported).to.be.equal(
            InvalidEnvironmentError
          );
        });
        it('AppError', () => {
          expect(AppErrorExported).to.be.equal(AppError);
        });
        it('InvalidAppConfigError', () => {
          expect(InvalidAppConfigErrorExported).to.be.equal(
            InvalidAppConfigError
          );
        });
        it('LoggingError', () => {
          expect(LoggingErrorExported).to.be.equal(LoggingError);
        });
        it('InvalidTransportIdError', () => {
          expect(InvalidTransportIdErrorExported).to.be.equal(
            InvalidTransportIdError
          );
        });
        it('TransportExistsError', () => {
          expect(TransportExistsErrorExported).to.be.equal(
            TransportExistsError
          );
        });
      });
    });
  });
  describe('decorators', () => {
    it('define', () => {
      expect(defineExported).to.be.equal(define);
    });
    it('Define', () => {
      expect(DefineExported).to.be.equal(Define);
    });
    it('Type', () => {
      expect(TypeExported).to.be.equal(Type);
    });
    it('EvebleType', () => {
      expect(EvebleTypeExported).to.be.equal(EvebleType);
    });
  });
  describe('domain', () => {
    it('AbilityAssertion', () => {
      expect(AbilityAssertionExported).to.be.equal(AbilityAssertion);
    });
    it('StatefulAssertion', () => {
      expect(StatefulAssertionExported).to.be.equal(StatefulAssertion);
    });
    it('InvalidStateTransitionError', () => {
      expect(InvalidStateTransitionErrorExported).to.be.equal(
        InvalidStateTransitionError
      );
    });
    it('StatusfulAssertion', () => {
      expect(StatusfulAssertionExported).to.be.equal(StatusfulAssertion);
    });
    it('InvalidStatusTransitionError', () => {
      expect(InvalidStatusTransitionErrorExported).to.be.equal(
        InvalidStatusTransitionError
      );
    });
    it('Guid', () => {
      expect(GuidExported).to.be.equal(Guid);
    });
    it('Aggregate', () => {
      expect(AggregateExported).to.be.equal(Aggregate);
    });
    it('Asserter', () => {
      expect(AsserterExported).to.be.equal(Asserter);
    });
    it('AssertionApiAlreadyExistsError', () => {
      expect(AssertionApiAlreadyExistsErrorExported).to.be.equal(
        AssertionApiAlreadyExistsError
      );
    });
    it('Assertion', () => {
      expect(AssertionExported).to.be.equal(Assertion);
    });
    it('BoundedContext', () => {
      expect(BoundedContextExported).to.be.equal(BoundedContext);
    });
    it('DomainError', () => {
      expect(DomainErrorExported).to.be.equal(DomainError);
    });
    it('DomainException', () => {
      expect(DomainExceptionExported).to.be.equal(DomainException);
    });
    it('Entity', () => {
      expect(EntityExported).to.be.equal(Entity);
    });
    it('EventSourceable', () => {
      expect(EventSourceableExported).to.be.equal(EventSourceable);
    });
    it('History', () => {
      expect(HistoryExported).to.be.equal(History);
    });
    it('List', () => {
      expect(ListExported).to.be.equal(List);
    });
    it('ScheduleCommand', () => {
      expect(ScheduleCommandExported).to.be.equal(ScheduleCommand);
    });
    it('UnscheduleCommand', () => {
      expect(UnscheduleCommandExported).to.be.equal(UnscheduleCommand);
    });
    it('Process', () => {
      expect(ProcessExported).to.be.equal(Process);
    });
    it('ValueObject', () => {
      expect(ValueObjectExported).to.be.equal(ValueObject);
    });
    describe('errors', () => {
      it('AssertionError', () => {
        expect(AssertionErrorExported).to.be.equal(AssertionError);
      });
      it('UndefinedActionError', () => {
        expect(UndefinedActionErrorExported).to.be.equal(UndefinedActionError);
      });
      it('ListError', () => {
        expect(ListErrorExported).to.be.equal(ListError);
      });
      it('IdentifiableAlreadyExistsError', () => {
        expect(IdentifiableAlreadyExistsErrorExported).to.be.equal(
          IdentifiableAlreadyExistsError
        );
      });
      it('ElementAlreadyExistsError', () => {
        expect(ElementAlreadyExistsErrorExported).to.be.equal(
          ElementAlreadyExistsError
        );
      });
      it('ElementNotFoundError', () => {
        expect(ElementNotFoundErrorExported).to.be.equal(ElementNotFoundError);
      });
      it('InvalidListError', () => {
        expect(InvalidListErrorExported).to.be.equal(InvalidListError);
      });
      it('ValueObjectError', () => {
        expect(ValueObjectErrorExported).to.be.equal(ValueObjectError);
      });
      it('EntityError', () => {
        expect(EntityErrorExported).to.be.equal(EntityError);
      });
      it('SavedStateNotFoundError', () => {
        expect(SavedStateNotFoundErrorExported).to.be.equal(
          SavedStateNotFoundError
        );
      });
      it('EventSourceableError', () => {
        expect(EventSourceableErrorExported).to.be.equal(EventSourceableError);
      });
      it('InvalidEventError', () => {
        expect(InvalidEventErrorExported).to.be.equal(InvalidEventError);
      });
      it('EventIdMismatchError', () => {
        expect(EventIdMismatchErrorExported).to.be.equal(EventIdMismatchError);
      });
      it('InvalidInitializingMessageError', () => {
        expect(InvalidInitializingMessageErrorExported).to.be.equal(
          InvalidInitializingMessageError
        );
      });
    });
  });
  describe('infrastructure', () => {
    it('AgendaClient', () => {
      expect(AgendaClientExported).to.be.equal(AgendaClient);
    });
    it('MongoDBClient', () => {
      expect(MongoDBClientExported).to.be.equal(MongoDBClient);
    });
    it('AgendaCommandScheduler', () => {
      expect(AgendaCommandSchedulerExported).to.be.equal(
        AgendaCommandScheduler
      );
    });
    it('CommitSerializer', () => {
      expect(CommitSerializerExported).to.be.equal(CommitSerializer);
    });
    it('SnapshotSerializer', () => {
      expect(SnapshotSerializerExported).to.be.equal(SnapshotSerializer);
    });
    it('CommitMongoDBObserver', () => {
      expect(CommitMongoDBObserverExported).to.be.equal(CommitMongoDBObserver);
    });
    it('CommitMongoDBStorage', () => {
      expect(CommitMongoDBStorageExported).to.be.equal(CommitMongoDBStorage);
    });
    it('SnapshotMongoDBStorage', () => {
      expect(SnapshotMongoDBStorageExported).to.be.equal(
        SnapshotMongoDBStorage
      );
    });
    it('Commit', () => {
      expect(CommitExported).to.be.equal(Commit);
    });
    it('CommitReceiver', () => {
      expect(CommitReceiverExported).to.be.equal(CommitReceiver);
    });
    it('ScheduledJob', () => {
      expect(ScheduledJobExported).to.be.equal(ScheduledJob);
    });
    it('AgendaScheduledJobTransformer', () => {
      expect(AgendaScheduledJobTransformerExported).to.be.equal(
        AgendaScheduledJobTransformer
      );
    });
    it('Client', () => {
      expect(ClientExported).to.be.equal(Client);
    });
    it('CommandSchedulingService', () => {
      expect(CommandSchedulingServiceExported).to.be.equal(
        CommandSchedulingService
      );
    });
    it('CommitPublisher', () => {
      expect(CommitPublisherExported).to.be.equal(CommitPublisher);
    });
    it('CommitStore', () => {
      expect(CommitStoreExported).to.be.equal(CommitStore);
    });
    it('EventSourceableRepository', () => {
      expect(EventSourceableRepositoryExported).to.be.equal(
        EventSourceableRepository
      );
    });
    it('ProjectionRebuilder', () => {
      expect(ProjectionRebuilderExported).to.be.equal(ProjectionRebuilder);
    });
    it('Projection', () => {
      expect(ProjectionExported).to.be.equal(Projection);
    });
    it('Router', () => {
      expect(RouterExported).to.be.equal(Router);
    });
    it('Service', () => {
      expect(ServiceExported).to.be.equal(Service);
    });
    it('Snapshotter', () => {
      expect(SnapshotterExported).to.be.equal(Snapshotter);
    });
    describe('errors', () => {
      it('InfrastructureError', () => {
        expect(InfrastructureErrorExported).to.be.equal(InfrastructureError);
      });
      it('CommitConcurrencyError', () => {
        expect(CommitConcurrencyErrorExported).to.be.equal(
          CommitConcurrencyError
        );
      });
      it('EventsNotFoundError', () => {
        expect(EventsNotFoundErrorExported).to.be.equal(EventsNotFoundError);
      });
      it('AddingCommitFailedError', () => {
        expect(AddingCommitFailedErrorExported).to.be.equal(
          AddingCommitFailedError
        );
      });
      it('UpdatingCommitError', () => {
        expect(UpdatingCommitErrorExported).to.be.equal(UpdatingCommitError);
      });
      it('AddingSnapshotError', () => {
        expect(AddingSnapshotErrorExported).to.be.equal(AddingSnapshotError);
      });
      it('UpdatingSnapshotError', () => {
        expect(UpdatingSnapshotErrorExported).to.be.equal(
          UpdatingSnapshotError
        );
      });
      it('StorageNotFoundError', () => {
        expect(StorageNotFoundErrorExported).to.be.equal(StorageNotFoundError);
      });
      it('RouterError', () => {
        expect(RouterErrorExported).to.be.equal(RouterError);
      });
      it('MissingEventSourceableError', () => {
        expect(MissingEventSourceableErrorExported).to.be.equal(
          MissingEventSourceableError
        );
      });
      it('MissingInitializingMessageError', () => {
        expect(MissingInitializingMessageErrorExported).to.be.equal(
          MissingInitializingMessageError
        );
      });
      it('CannotRouteMessageError', () => {
        expect(CannotRouteMessageErrorExported).to.be.equal(
          CannotRouteMessageError
        );
      });
      it('UnresolvableIdentifierFromMessageError', () => {
        expect(UnresolvableIdentifierFromMessageErrorExported).to.be.equal(
          UnresolvableIdentifierFromMessageError
        );
      });
      it('UndefinedSnapshotterFrequencyError', () => {
        expect(UndefinedSnapshotterFrequencyErrorExported).to.be.equal(
          UndefinedSnapshotterFrequencyError
        );
      });
      it('UndefinedSnapshotterError', () => {
        expect(UndefinedSnapshotterErrorExported).to.be.equal(
          UndefinedSnapshotterError
        );
      });
      it('ProjectionRebuildingError', () => {
        expect(ProjectionRebuildingErrorExported).to.be.equal(
          ProjectionRebuildingError
        );
      });
      it('ProjectionAlreadyRebuildingError', () => {
        expect(ProjectionAlreadyRebuildingErrorExported).to.be.equal(
          ProjectionAlreadyRebuildingError
        );
      });
      it('ProjectionNotRebuildingError', () => {
        expect(ProjectionNotRebuildingErrorExported).to.be.equal(
          ProjectionNotRebuildingError
        );
      });
      it('ClientError', () => {
        expect(ClientErrorExported).to.be.equal(ClientError);
      });
      it('InactiveClientError', () => {
        expect(InactiveClientErrorExported).to.be.equal(InactiveClientError);
      });
      it('SchedulerError', () => {
        expect(SchedulerErrorExported).to.be.equal(SchedulerError);
      });
      it('CommandSchedulingError', () => {
        expect(CommandSchedulingErrorExported).to.be.equal(
          CommandSchedulingError
        );
      });
      it('CommandUnschedulingError', () => {
        expect(CommandUnschedulingErrorExported).to.be.equal(
          CommandUnschedulingError
        );
      });
    });
  });
  describe('messaging', () => {
    it('EJSONSerializerAdapter', () => {
      expect(EJSONSerializerAdapterExported).to.be.equal(
        EJSONSerializerAdapter
      );
    });
    it('CommandBus', () => {
      expect(CommandBusExported).to.be.equal(CommandBus);
    });
    it('EventBus', () => {
      expect(EventBusExported).to.be.equal(EventBus);
    });
    describe('errors', () => {
      it('HandlingError', () => {
        expect(HandlingErrorExported).to.be.equal(HandlingError);
      });
      it('UnhandleableTypeError', () => {
        expect(UnhandleableTypeErrorExported).to.be.equal(
          UnhandleableTypeError
        );
      });
      it('InvalidControllerError', () => {
        expect(InvalidControllerErrorExported).to.be.equal(
          InvalidControllerError
        );
      });
      it('InvalidHandlerError', () => {
        expect(InvalidHandlerErrorExported).to.be.equal(InvalidHandlerError);
      });
      it('HandlerExistError', () => {
        expect(HandlerExistErrorExported).to.be.equal(HandlerExistError);
      });
      it('HandlerNotFoundError', () => {
        expect(HandlerNotFoundErrorExported).to.be.equal(HandlerNotFoundError);
      });
      it('UnsupportedExecutionTypeError', () => {
        expect(UnsupportedExecutionTypeErrorExported).to.be.equal(
          UnsupportedExecutionTypeError
        );
      });
      it('InvalidMessageableType', () => {
        expect(InvalidMessageableTypeExported).to.be.equal(
          InvalidMessageableType
        );
      });
      it('InitializingMessageAlreadyExistsError', () => {
        expect(InitializingMessageAlreadyExistsErrorExported).to.be.equal(
          InitializingMessageAlreadyExistsError
        );
      });
      it('SerializationError', () => {
        expect(SerializationErrorExported).to.be.equal(SerializationError);
      });
      it('UnparsableValueError', () => {
        expect(UnparsableValueErrorExported).to.be.equal(UnparsableValueError);
      });
    });
  });
  describe('mixins', () => {
    it('CommandHandlingMixin', () => {
      expect(CommandHandlingMixinExported).to.be.equal(CommandHandlingMixin);
    });
    it('TypeTrait', () => {
      expect(TypeTraitExported).to.be.equal(TypeTrait);
    });
    it('EjsonableMixin', () => {
      expect(EjsonableMixinExported).to.be.equal(EjsonableMixin);
    });
    it('EventHandlingMixin', () => {
      expect(EventHandlingMixinExported).to.be.equal(EventHandlingMixin);
    });

    it('OneToManyHandlingMixin', () => {
      expect(OneToManyHandlingMixinExported).to.be.equal(
        OneToManyHandlingMixin
      );
    });
    it('OneToOneHandlingMixin', () => {
      expect(OneToOneHandlingMixinExported).to.be.equal(OneToOneHandlingMixin);
    });
    it('RFC5424LoggingMixin', () => {
      expect(RFC5424LoggingMixinExported).to.be.equal(RFC5424LoggingMixin);
    });
    it('SerializableMixin', () => {
      expect(SerializableMixinExported).to.be.equal(SerializableMixin);
    });

    describe('HookableTrait', () => {
      it('HookableTrait', () => {
        expect(HookableTraitExported).to.be.equal(HookableTrait);
      });
      it('HookError', () => {
        expect(HookErrorExported).to.be.equal(HookError);
      });
      it('InvalidHookActionError', () => {
        expect(InvalidHookActionErrorExported).to.be.equal(
          InvalidHookActionError
        );
      });
      it('InvalidHookIdError', () => {
        expect(InvalidHookIdErrorExported).to.be.equal(InvalidHookIdError);
      });
      it('HookAlreadyExistsError', () => {
        expect(HookAlreadyExistsErrorExported).to.be.equal(
          HookAlreadyExistsError
        );
      });
      it('HookNotFoundError', () => {
        expect(HookNotFoundErrorExported).to.be.equal(HookNotFoundError);
      });
    });
    describe('StatefulMixin', () => {
      it('StatefulMixin', () => {
        expect(StatefulMixinExported).to.be.equal(StatefulMixin);
      });
      it('StateError', () => {
        expect(StateErrorExported).to.be.equal(StateError);
      });
      it('UndefinedStatesError', () => {
        expect(UndefinedStatesErrorExported).to.be.equal(UndefinedStatesError);
      });
      it('InvalidStateError', () => {
        expect(InvalidStateErrorExported).to.be.equal(InvalidStateError);
      });
    });
    describe('StatusfulMixin', () => {
      it('StatusfulMixin', () => {
        expect(StatusfulMixinExported).to.be.equal(StatusfulMixin);
      });
      it('StatusError', () => {
        expect(StatusErrorExported).to.be.equal(StatusError);
      });
      it('UndefinedStatusesError', () => {
        expect(UndefinedStatusesErrorExported).to.be.equal(
          UndefinedStatusesError
        );
      });
      it('InvalidStatusError', () => {
        expect(InvalidStatusErrorExported).to.be.equal(InvalidStatusError);
      });
    });
    describe('VersionablMixin', () => {
      it('VersionableMixin', () => {
        expect(VersionableMixinExported).to.be.equal(VersionableMixin);
      });
      it('VersionableError', () => {
        expect(VersionableErrorExported).to.be.equal(VersionableError);
      });
      it('InvalidSchemaVersionError', () => {
        expect(InvalidSchemaVersionErrorExported).to.be.equal(
          InvalidSchemaVersionError
        );
      });
      it('LegacyTransformerAlreadyExistsError', () => {
        expect(LegacyTransformerAlreadyExistsErrorExported).to.be.equal(
          LegacyTransformerAlreadyExistsError
        );
      });
      it('LegacyTransformerNotFoundError', () => {
        expect(LegacyTransformerNotFoundErrorExported).to.be.equal(
          LegacyTransformerNotFoundError
        );
      });
      it('InvalidLegacyTransformerError', () => {
        expect(InvalidLegacyTransformerErrorExported).to.be.equal(
          InvalidLegacyTransformerError
        );
      });
      it('NotVersionableError', () => {
        expect(NotVersionableErrorExported).to.be.equal(NotVersionableError);
      });
    });
  });
  describe('helpers', () => {
    it('isTyped', () => {
      expect(isTypedExported).to.be.equal(isTyped);
    });
    it('isSerializable', () => {
      expect(isSerializableExported).to.be.equal(isSerializable);
    });
    it('isRecord', () => {
      expect(isRecordExported).to.be.equal(isRecord);
    });
    it('isPlainRecord', () => {
      expect(isPlainRecordExported).to.be.equal(isPlainRecord);
    });
    it('hasPostConstruct', () => {
      expect(hasPostConstructExported).to.be.equal(hasPostConstruct);
    });
    it('toPlainObject', () => {
      expect(toPlainObjectExported).to.be.equal(toPlainObject);
    });
    it('convertObjectToCollection', () => {
      expect(convertObjectToCollectionExported).to.be.equal(
        convertObjectToCollection
      );
    });
    it('resolveSerializableFromPropType', () => {
      expect(resolveSerializableFromPropTypeExported).to.be.equal(
        resolveSerializableFromPropType
      );
    });
    it('createEJSON', () => {
      expect(createEJSONExported).to.be.equal(createEJSON);
    });
    it('isEventSourceableType', () => {
      expect(isEventSourceableTypeExported).to.be.equal(isEventSourceableType);
    });
    it('loadENV', () => {
      expect(loadENVExported).to.be.equal(loadENV);
    });
    it('loggerLoader', () => {
      expect(loggerLoaderExported).to.be.equal(loggerLoader);
    });
  });

  describe('external', () => {
    it('postConstruct', () => {
      expect(postConstructExported).to.be.equal(postConstruct);
    });
    it('injectable', () => {
      expect(injectableExported).to.be.equal(injectable);
    });
    it('inject', () => {
      expect(injectExported).to.be.equal(inject);
    });
  });
});
