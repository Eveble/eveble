import { interfaces as inversifyTypes } from '@parisholley/inversify-async';
import { types as typendTypes } from 'typend';
import winston from 'winston';
import {
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
} from './constants/literal-keys';

/*
https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines

Any type or interface exported in 'root' level of declaration is considered
'first-class' building block.

Types or interfaces enclosed in new dedicated namespace are considered
contracts building blocks for replaceable parts of the system.

This unclutters the availability of names for any other prioritized contracts that would made naming rea
*/
export namespace types {
  /*
  GENERIC
  */
  export type Class<T = unknown, Arguments extends any[] = any[]> = new (
    ...arguments_: Arguments
  ) => T;

  export interface Constructor<T> {
    new (...args: any[]): T;
  }

  export type AnyFunction = (...args: any[]) => any;

  export type Prototype = Record<keyof any, any>;

  export type Primitive =
    | any
    | string
    | number
    | boolean
    | symbol
    | void
    | undefined
    | null
    | never
    | unknown;

  export type ErrorProps = {
    name?: string;
    message: string;
    stack?: string;
    code?: number;
  };

  export type Props = Record<keyof any, any>;
  export type PropTypes = Record<keyof any, typendTypes.Expectation>;

  export type ConfigProps = {
    [path: string]: any;
  };

  // Decorators
  export type ClassDecorator = <TFunction extends Function>(
    target: TFunction
  ) => TFunction | void;

  export type PropertyDecorator = (
    target: Record<keyof any, any>,
    propertyKey: string | symbol
  ) => void;

  export type MethodDecorator = <T>(
    target: Record<keyof any, any>,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => TypedPropertyDescriptor<T> | void;

  export type ParameterDecorator = (
    target: Record<keyof any, any>,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => void;

  export interface Stringifiable {
    toString(): string;
  }

  export type TypeName = string;

  /*
  CORE
  */
  export interface Injector extends inversifyTypes.Container {
    injectInto(value: any): void;
    injectIntoAsync(value: any): Promise<void>;
  }

  export type Validator = {
    validate(value: any, expectation: any, isStrict?: boolean): boolean;
    isValid(value: any, expectation: any, isStrict?: boolean): boolean;
    isInstanceOf(value: any, expectation: any): boolean;
  };

  export type Describer = {
    describe(source: any): string;
    setFormatting(formatting: typendTypes.DescriberFormatting): void;
  };

  export interface Converter {
    convert(reflectedType: any): any;
    reflect(reflectedType: any): any;
  }

  export interface Library {
    registerType(
      typeName: TypeName,
      type: Serializable,
      shouldOverride?: boolean
    ): void;
    overrideType(typeName: TypeName, type: Serializable): void;
    getType(typeName: TypeName): Serializable | undefined;
    getTypeOrThrow(typeName: TypeName): Serializable;
    getTypes(): Map<string, Serializable>;
    hasType(typeName: TypeName): boolean;
    removeType(typeName: TypeName): void;
    isInState(state: State | State[]): boolean;
    setState(state: State): void;
  }

  export type KernelConfig = {
    conversion: {
      type: 'manual' | 'runtime';
    };

    validation: {
      type: 'manual' | 'runtime';
    };

    describer: {
      formatting: 'default' | 'compact' | 'debug';
    };
  };

  /*
  DEFINITION
  */
  export interface Definable {
    getPropTypes(): Record<keyof any, any>;
    toPlainObject(): Props;
    validateProps(
      props: Props,
      propTypes: PropTypes,
      isStrict?: boolean
    ): boolean;
    getPropertyInitializers(): Props;
    equals(other: any): boolean;
  }

  export type Type = any;

  /*
  HOOKS
  */
  export interface Hookable {
    registerHook(
      action: string,
      id: string,
      hook: Hook,
      shouldOverride?: boolean
    ): void;
    overrideHook(action: string, id: string, hook: Hook): void;
    getHook(action: string, id: string): Hook | undefined;
    getHookOrThrow(action: string, id: string): Hook | undefined;
    getHooks(action: string): hooks.Mappings;
    getActions(): hooks.Actions;
    hasHook(action: string, id: string): boolean;
    hasAction(action: string): boolean;
    removeHook(action: string, id: string): void;
  }
  export type Hook = AnyFunction;

  export namespace hooks {
    export type Mappings = Record<string, Hook>;

    export type Actions = Record<string, Mappings>;
  }

  /*
  NODE
  */
  export namespace node {
    export namespace util {
      export type InspectOptions = {
        showHidden?: boolean;
        depth?: number | null;
        color?: boolean;
      };
    }
  }

  /*
  CONFIGURATION
  */
  export interface Configurable extends Definable {
    isConfigurable(path: string): boolean;
    has(path: string): boolean;
    get(path: string, runtimeDefaultValue?: any): any;
    getExact(path: string): any;
    getDefault(path: string): any;
    hasDefault(path: string): boolean;
    set(path: string, value: any): void;
    assign(props: Props): void;
    include(config: Configurable): void;
    merge(config: Configurable): void;
  }

  /*
  STATEFUL
  */
  export type State = string | number | undefined;

  export interface Stateful {
    state: State;
    isInState(state: State | State[]): boolean;
    isInOneOfStates(states: State | State[]): boolean;
    getState(): State;
    setState(state: State): void;
    hasState(): boolean;
    validateState(stateOrStates: State | State[], error?: Error): boolean;
    getSelectableStates(): Record<string, State>;
  }

  /*
  VERSIONABLE
  */
  export interface Versionable {
    getSchemaVersion(): number | undefined;
    transformLegacyProps(props: Props): Props;
    registerLegacyTransformer(
      schemaVersion: number,
      transformer: Hook,
      shouldOverride: boolean
    ): void;
    overrideLegacyTransformer(schemaVersion: number, transformer: Hook): void;
    hasLegacyTransformer(schemaVersion: number): boolean;
    getLegacyTransformers(): LegacyTransformers;
    getLegacyTransformer(schemaVersion: number): Hook;
  }

  export type LegacyTransformers = Map<number, Hook>;

  /*
  LOGGING
  */
  export interface Loggable {
    log: Logger | undefined;
  }

  // Log entry
  export interface LogEntry {
    readonly message: string;
    readonly options: LogFormatting;
    readonly metadata: Map<string, LogMetadata>;
    on(target: any): this;
    method?: () => AnyFunction;
    methodName?: string;
    getTarget(): any;
    typeName?: TypeName | undefined;
    toString(): string;
    isStaticMethod(): boolean;
    hasMetadata(description: string): boolean;
    getMetadata(description: string): LogMetadata | undefined;
    in(methodOrName: AnyFunction | string): this;
    with(description: string, value?: any, keys?: string[]): this;
    format(options: LogFormatting): this;
    level: LogLevel;
    setLevel(level: LogLevel): this;
  }

  export type LogFormatting = {
    isSimple?: boolean;
    isColored?: boolean;
    inspectDepth?: number;
  };

  export interface LogMetadata {
    readonly description: string;
    readonly value?: any;
    readonly keys?: string[];
  }
  // Logging
  export type LogLevel = string;

  export type LogLevels = Record<string, Priority>;

  export type Priority = number;

  export type RFC5424Levels = {
    emerg(entry: string | LogEntry, ...args: any[]): void;
    alert(entry: string | LogEntry, ...args: any[]): void;
    crit(entry: string | LogEntry, ...args: any[]): void;
    error(entry: string | LogEntry, ...args: any[]): void;
    warning(entry: string | LogEntry, ...args: any[]): void;
    notice(entry: string | LogEntry, ...args: any[]): void;
    info(entry: string | LogEntry, ...args: any[]): void;
    debug(entry: string | LogEntry, ...args: any[]): void;
  };

  export interface LogTransport extends RFC5424Levels {
    readonly level: LogLevel;
    logger: Logger;
    isLoggable(level: LogLevel): boolean;
    log(level: LogLevel, entry: string | LogEntry, ...args: any[]): void;
  }

  export interface Logger extends RFC5424Levels, Stateful {
    readonly levels: LogLevels;
    start(): void;
    stop(): void;
    isRunning(): boolean;
    isStopped(): boolean;
    getPriority(level: LogLevel): number;
    registerTransport(
      id: string,
      transport: LogTransport,
      shouldOverride?: boolean
    ): void;
    overrideTransport(id: string, transport: LogTransport): void;
    getTransport(id: string): LogTransport | undefined;
    hasTransport(id: string): boolean;
    removeTransport(id: string): void;
    getTransports(): Map<string, LogTransport>;
    log(level: LogLevel, entry: string | LogEntry, ...args: any[]): void;
  }

  export interface LogFormatter {
    format(entry: winston.LogEntry | LogEntry, options?: Configurable): string;
  }

  export interface LogConverter {
    convertArguments(
      entry: winston.LogEntry | LogEntry,
      options?: Configurable
    ): any;
    convertMetadata(
      metadata: LogMetadata,
      entry: winston.LogEntry | LogEntry,
      options?: Configurable
    ): any;
  }
  /*
  MODULAR
  */
  export interface BaseApp extends Stateful {
    injector: Injector;
    config: Configurable;
    initialize(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    reset(): Promise<void>;
    shutdown(): Promise<void>;
    invokeAction(
      actionName: string,
      options: ActionInvokingOptions
    ): Promise<void>;
  }

  export interface App extends BaseApp {
    send(command: Command): Promise<any>;
    publish(event: Event): Promise<void>;
  }

  export interface AppType {
    new (props?: ModuleProps): App;
  }

  export interface Module extends Stateful {
    config: Configurable;
    initialize(app: BaseApp, injector: Injector): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    reset(): Promise<void>;
    shutdown(): Promise<void>;
    invokeAction(
      actionName: string,
      options: ActionInvokingOptions
    ): Promise<void>;
  }

  export interface ModuleType {
    new (props?: ModuleProps): Module;
  }

  export type ActionInvokingOptions = {
    isLoggable: boolean;
  };

  export type AppProps = ModuleProps & {
    injector?: Injector;
  };

  export type ModuleProps = {
    [key: string]:
      | any
      | {
          modules?: Module[];
        };
  };

  /*
  MESSAGING
  */
  export interface Serializable extends Definable, Versionable {
    getTypeName(): TypeName;
    toString(): TypeName | string;
  }

  // https://github.com/Eveble/ejson/blob/develop/vendor/ejson.js#L255
  export interface Ejsonable extends Serializable {
    typeName(): TypeName;
    toJSONValue(): Record<string, any>;
  }

  export type Execution = 'sequential' | 'concurrent';

  export interface Message extends Serializable {
    timestamp: Date;
    metadata?: Record<string, any>;
    getTimestamp(): Date;
    assignMetadata(props: Record<string, any>): void;
    hasMetadata(): boolean;
    getMetadata(): Record<string, any>;
    setCorrelationId(key: string, id: Stringifiable): void;
    getCorrelationId(key: string): string | undefined;
    hasCorrelationId(key: string): boolean;
  }

  export interface MessageType<T extends Message> {
    new (props: Props): T;
    getTypeName(): TypeName;
  }

  export type Handler = (message: Message) => any;

  export interface Controller {
    initialize(): void;
    handles(): Map<MessageType<Command>, Handler>;
    subscribes(): Map<MessageType<Event>, Handler>;
    registerHandler(
      messageType: MessageType<Message>,
      handler: Handler,
      shouldOverride?: boolean
    ): void;
    overrideHandler(messageType: MessageType<Message>, handler: Handler): void;
    hasHandler(messageType: MessageType<Message>): boolean;
    getHandler(
      messageType: MessageType<Message>
    ): Handler | Handler[] | undefined;
    getHandlerOrThrow(messageType: MessageType<Message>): Handler | Handler[];
    removeHandler(messageType: MessageType<Message>): void;
    getHandlers(): Map<MessageType<Message>, Handler | Handler[]>;
    setHandleableTypes(
      handleableTypes: MessageType<Message> | MessageType<Message>[]
    ): void;
    getHandleableTypes(): MessageType<Message>[];
    ensureHandleability(
      messageType: MessageType<Message>,
      handleableTypes: MessageType<Message> | MessageType<Message>[]
    ): boolean;
    isHandleabe(messageType: MessageType<Message>): boolean;
    getHandledTypes(): MessageType<Message>[];
    getHandled(messageType: MessageType<Message>): MessageType<Message>[];
    handle(message: Message, execution?: Execution): Promise<any>;
  }

  export interface Command extends Message {
    targetId: string | Stringifiable;
    getId(): string | Stringifiable;
    isDeliverable(): boolean;
    isScheduled(): boolean;
    schedule(assignment: Assignment): void;
    getAssignment(): Assignment | undefined;
  }

  export interface Event extends Message {
    sourceId: string | Stringifiable;
    version?: number;
    getId(): string | Stringifiable;
  }

  export interface Sender extends Controller {
    send(command: Command): Promise<any>;
  }
  export interface Publisher extends Controller {
    publish(event: Event): Promise<void>;
    subscribeTo(event: any, handler: Handler, shouldOverride?: boolean): void;
  }

  export interface CommandBus extends Sender {
    onSend(id: string, hook: Hook, shouldOverride?: boolean): void;
    getHandledTypesNames(): TypeName[];
  }
  export interface EventBus extends Publisher {
    onPublish(id: string, hook: Hook, shouldOverride?: boolean): void;
    getHandledTypesNames(): TypeName[];
  }

  export interface Serializer {
    registerType(
      typeName: TypeName,
      type: Type,
      shouldOverride?: boolean
    ): void;
    overrideType(typeName: TypeName, type: Type): void;
    hasType(typeName: TypeName): boolean;
    getTypes(): Map<TypeName, Type>;
    getType(typeName: TypeName): Type | undefined;
    getTypeOrThrow(typeName: TypeName): Type;
    getTypesNames(): TypeName[];
    removeType(typeName: TypeName): void;
    removeTypes(): void;
    isTypeInstance(typeInstance: Serializable): boolean;
    toJSONValue(value: any): any;
    fromJSONValue(
      value: Record<string, any>
    ): Record<string, any> | Serializable;
    stringify(
      value: any,
      options?: { indent: boolean | number; canonical: boolean }
    ): string;
    parse(str: string): any;
    clone<T>(value: T): T;
    equals(a: any, b: any, options?: { keyOrderSensitive: boolean }): boolean;
    toData(arg: Record<string | number, any>): Record<string | number, any>;
    fromData(data: Record<string | number, any>): Record<string | number, any>;
  }

  /*
  STATUSFUL
  */
  export type Status = string | number | undefined;

  export interface Statusful {
    status: Status;
    isInStatus(status: Status | Status[]): boolean;
    isInOneOfStatuses(status: Status | Status[]): boolean;
    getStatus(): Status;
    setStatus(status: Status): void;
    hasStatus(): boolean;
    validateStatus(statusOrStatuses: Status | Status[], error?: Error): boolean;
    getSelectableStatuses(): Record<string, Status>;
  }

  /*
  DOMAIN
  */
  export interface Identifiable extends Serializable {
    getId(): string | Stringifiable;
  }

  export interface List<T> extends Array<T> {
    create(...sources: Record<string, any>[]): T;
    add(element: T): void;
    overrideBy(key: string, value: any, element: T): void;
    getBy(key: string, value: any): T | undefined;
    getByOrThrow(key: string, value: any): T;
    getById(id: string | Stringifiable): T | undefined;
    getByIdOrThrow(id: string | Stringifiable): T;
    findById(id: string | Stringifiable): T;
    findBy(key: string, value: any): T;
    hasBy(key: string, value: any): boolean;
    hasSame(element: T): boolean;
    hasById(id: string | Stringifiable): boolean;
    removeById(id: string | Stringifiable): void;
    removeBy(key: string, value: any): void;
    first(): T | undefined;
    last(): T | undefined;
  }

  export interface Assertion {
    getApi(): Map<string, Function>;
  }

  export interface Asserter {
    setAction(action: Stringifiable | MessageType<Message>): void;
    getAction(): Stringifiable | MessageType<Message>;
    setEntity(entity: Entity): void;
    getEntity(): Entity;
    assert(): Asserter;
    registerAssertion(assertion: Assertion): void;
    getAssertions(): Assertion[];
    getApi(): Map<string, Function>;
    hasAssertion(assertionCtor: any): boolean;
  }

  export interface Entity
    extends Serializable,
      Stateful,
      Statusful,
      Identifiable {
    on(action: string | Stringifiable): any;
    [SAVE_STATE_METHOD_KEY](): void;
    [ROLLBACK_STATE_METHOD_KEY](): void;
    isStateSaved(): boolean;
  }

  export interface EventSourceable extends Entity, Controller {
    getVersion(): number;
    getEvents(): Event[];
    getCommands(): Command[];
    handle(message: Message): any;
    schedule(
      command: Command,
      deliverAt: Date,
      assignmentId?: string | Stringifiable
    ): void;
    unschedule(
      assignmentId: string | Stringifiable,
      commandType: MessageType<Command>
    ): void;
    record(event: Event): void;
    replay(event: Event): void;
    replayHistory(history: Event[]): void;
    assignMetadata(metadata: Record<string, any>): void;
    eventProps(): Record<keyof any, any>;
    pickEventProps(...sources: Record<string, any>[]): Record<keyof any, any>[];
    incrementVersion(): void;
  }

  export interface EventSourceableType {
    new (props: Props): EventSourceable;
    resolveInitializingMessage(): MessageType<Command | Event> | undefined;
    resolveRoutedCommands(): MessageType<Command>[];
    resolveRoutedEvents(): MessageType<Event>[];
    resolveRoutedMessages(): MessageType<Command | Event>[];
    getTypeName(): TypeName;
    from(...sources: Record<string, any>[]): EventSourceable;
  }

  }
}
