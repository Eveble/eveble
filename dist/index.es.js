import 'reflect-metadata';
import { CORE_METADATA_KEYS, ExtendableError, kernel, define, isSerializable, UnregistrableTypeError, TypeExistsError, TypeNotFoundError } from '@eveble/core';
export { ExtendableError, Kernel, KernelError, Library, TypeError, TypeExistsError, TypeNotFoundError, UnavailableAsserterError, UnavailableSerializerError, UnregistrableTypeError, define, isSerializable, kernel, resolveSerializableFromPropType } from '@eveble/core';
import { instanceOf, isDefined, Collection, getMatchingParentProto, OneOf, InstanceOf, Optional, define as define$1 } from 'typend';
export { InvalidDefinitionError, InvalidTypeError, InvalidValueError, NotAMemberError, PatternValidatorExistError, PatternValidatorNotFoundError, PropTypes, PropsOf, TypeConverterExists, TypeDescriberExistsError, TypeDescriberNotFoundError, TypeOf, UndefinableClassError, UnequalValueError, UnexpectedKeyError, UnknownError, UnmatchedTypeError, ValidationError, any, boolean, check, collection, collectionIncluding, collectionWithin, convert, converter, describer, eq, instanceOf, integer, internal, iof, is, isInstanceOf, isValid, list, maybe, never, number, oneOf, optional, propsOf, reflect, string, symbol, tuple, typeOf, typend, unknown, unrecognized, validable, validate, validator, voided, where } from 'typend';
import { getTypeName, isClassInstance } from '@eveble/helpers';
import { isNumber, isPlainObject, pick, isEqual, isString, has, get, omit, isFunction, pull, last, isEmpty, set, capitalize, intersection, partial, union } from 'lodash';
import merge from 'deepmerge';
import { classes } from 'polytype';
import { injectable, METADATA_KEY, Container, inject, postConstruct } from '@parisholley/inversify-async';
export { inject, injectable, postConstruct } from '@parisholley/inversify-async';
import deepClone from '@jsbits/deep-clone';
import decache from 'decache';
import dotenv from 'dotenv-extended';
import getenv from 'getenv';
import { v4 } from 'uuid';
import Agenda from 'agenda';
import { MongoClient } from 'mongodb';
import * as winston from 'winston';
import chalk from 'chalk';
import { ReflectParams } from 'reflect-params';
import { inspect } from 'util';
import hasAnsi from 'has-ansi';
import abbreviate from 'abbreviate';

const BINDINGS = {
    chalk: Symbol.for('chalk'),
    App: Symbol.for('App'),
    Injector: Symbol.for('Injector'),
    Converter: Symbol.for('Converter'),
    Library: Symbol.for('Library'),
    Config: Symbol.for('Config'),
    Validator: Symbol.for('Validator'),
    Describer: Symbol.for('Describer'),
    log: Symbol.for('Logger'),
    winston: Symbol.for('winston'),
    LogConverter: Symbol.for('LogConverter'),
    SimpleLogFormatter: Symbol.for('SimpleLogFormatter'),
    DetailedLogFormatter: Symbol.for('DetailedLogFormatter'),
    console: 'console',
    CommandBus: Symbol.for('CommandBus'),
    EventBus: Symbol.for('EventBus'),
    EJSON: Symbol.for('EJSON'),
    Serializer: Symbol.for('Serializer'),
    Asserter: Symbol.for('Asserter'),
    Router: Symbol.for('Router'),
    EventSourceableRepository: Symbol.for('EventSourceableRepository'),
    CommitStore: Symbol.for('CommitStore'),
    Snapshotter: Symbol.for('Snapshotter'),
    SnapshotStorage: Symbol.for('SnapshotStorage'),
    SnapshotSerializer: Symbol.for('SnapshotSerializer'),
    CommitStorage: Symbol.for('CommitStorage'),
    CommitPublisher: Symbol.for('CommitPublisher'),
    CommitObserver: Symbol.for('CommitObserver'),
    CommitSerializer: Symbol.for('CommitSerializer'),
    MongoDB: {
        library: Symbol.for('MongoDB.library'),
        clients: {
            Snapshotter: Symbol.for('MongoDB.clients.Snapshotter'),
            CommitStore: Symbol.for('MongoDB.clients.CommitStore'),
            CommandScheduler: Symbol.for('MongoDB.clients.CommandScheduler'),
        },
        collections: {
            Snapshots: Symbol.for('MongoDB.collections.Snapshots'),
            Commits: Symbol.for('MongoDB.collections.Commits'),
            ScheduledCommands: Symbol.for('MongoDB.collections.ScheduledCommands'),
        },
    },
    Agenda: {
        library: Symbol.for('Agenda.library'),
        clients: {
            CommandScheduler: Symbol.for('Agenda.clients.CommandScheduler'),
        },
        jobTransformer: Symbol.for('Agenda.jobTransformer'),
    },
    CommandScheduler: Symbol.for('CommandScheduler'),
    CommandSchedulingService: Symbol.for('CommandSchedulingService'),
};

const HOOKABLE_KEY = Symbol('eveble:flags:hookable');
const HOOKS_CONTAINER_KEY = Symbol('eveble:containers:hooks');
const DEFAULT_PROPS_KEY = CORE_METADATA_KEYS.DEFAULT_PROPS_KEY;
const DELEGATED_KEY = Symbol('eveble:flags:delegated');
const VERSIONABLE_KEY = Symbol('eveble:versionable');
const LEGACY_TRANSFORMERS_CONTAINER_KEY = Symbol('eveble:container:legacy-transformers');
const HANDLER_KEY = Symbol('eveble:controller:handler');
const COMMAND_HANDLERS_CONTAINER_KEY = Symbol('eveble:container:command-handlers');
const ROUTED_COMMANDS_CONTAINER_KEY = Symbol('eveble:container:routed-commands');
const SUBSCRIBER_KEY = Symbol('eveble:controller:subscriber');
const EVENT_HANDLERS_CONTAINER_KEY = Symbol('eveble:container:event-handlers');
const ROUTED_EVENTS_CONTAINER_KEY = Symbol('eveble:container:routed-events');
const INITIALIZING_MESSAGE_KEY = Symbol('eveble:controller:initializing-message');
const SERIALIZABLE_LIST_PROPS_KEY = CORE_METADATA_KEYS.SERIALIZABLE_LIST_PROPS_KEY;
const METADATA_KEYS = {
    HOOKABLE_KEY,
    HOOKS_CONTAINER_KEY,
    DEFAULT_PROPS_KEY,
    DELEGATED_KEY,
    VERSIONABLE_KEY,
    LEGACY_TRANSFORMERS_CONTAINER_KEY,
    HANDLER_KEY,
    COMMAND_HANDLERS_CONTAINER_KEY,
    ROUTED_COMMANDS_CONTAINER_KEY,
    SUBSCRIBER_KEY,
    EVENT_HANDLERS_CONTAINER_KEY,
    ROUTED_EVENTS_CONTAINER_KEY,
    INITIALIZING_MESSAGE_KEY,
    SERIALIZABLE_LIST_PROPS_KEY,
};

function delegate() {
    return (target) => {
        Reflect.defineMetadata(DELEGATED_KEY, true, target);
    };
}

class HandlingError extends ExtendableError {
}
class UnhandleableTypeError extends HandlingError {
    constructor(className, handleableTypes, got) {
        super(`${className}: type must be one of: ${handleableTypes}; got ${got}`);
    }
}
class InvalidControllerError extends HandlingError {
    constructor(className) {
        super(`${className}: provided class must implement Controller interface`);
    }
}
class InvalidHandlerError extends HandlingError {
    constructor(className, type, got) {
        super(`${className}: provided handler for '${type}' must be a function, got ${got}`);
    }
}
class HandlerExistError extends HandlingError {
    constructor(className, type) {
        super(`${className}: handler for '${type}' already exists`);
    }
}
class HandlerNotFoundError extends HandlingError {
    constructor(className, type) {
        super(`${className}: handler for type '${type}' can't be found`);
    }
}
class UnsupportedExecutionTypeError extends HandlingError {
    constructor(className, execution) {
        super(`${className}: execution type '${execution}' is not supported on controller`);
    }
}
class InvalidMessageableType extends HandlingError {
    constructor(got) {
        super(`Type '${got}' must implement Messageable interface`);
    }
}
class InitializingMessageAlreadyExistsError extends HandlingError {
    constructor(className, existingMsgName, newMsgName) {
        super(`${className}: trying to override already existing initializing message with '${newMsgName}'. Remove annotation '@initial' from '${existingMsgName}' beforehand`);
    }
}
class SerializationError extends ExtendableError {
}
class UnparsableValueError extends SerializationError {
    constructor(got) {
        super(`Value must be parsable string, got ${got}`);
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

class VersionableError extends ExtendableError {
}
class InvalidSchemaVersionError extends VersionableError {
    constructor(typeName, got) {
        super(`${typeName}: schema version must be a number, got ${got}`);
    }
}
class LegacyTransformerAlreadyExistsError extends VersionableError {
    constructor(typeName, schemaVersion) {
        super(`${typeName}: legacy transformer for schema version ${schemaVersion} already exists`);
    }
}
class LegacyTransformerNotFoundError extends VersionableError {
    constructor(typeName, schemaVersion) {
        super(`${typeName}: legacy transformer for schema version ${schemaVersion} was not found`);
    }
}
class InvalidLegacyTransformerError extends VersionableError {
    constructor(typeName, propertyKey, schemaVersion) {
        super(`${typeName}: declared legacy transformer under key '${propertyKey}' for schema version of ${schemaVersion} must be annotating method`);
    }
}
class NotVersionableError extends VersionableError {
    constructor(typeName) {
        super(`${typeName}: class must implement Versionable and Hookable interfaces`);
    }
}
let VersionableMixin = class VersionableMixin {
    transformLegacyProps(props) {
        const instanceSchemaVersion = props.schemaVersion || 0;
        const currentSchemaVersion = this.getCurrentSchemaVersion();
        if (this.isLegacySchemaVersion(instanceSchemaVersion, currentSchemaVersion)) {
            const nextSchemaVersion = this.calculateNextSchemaVersion(instanceSchemaVersion);
            for (let version = nextSchemaVersion; version <= currentSchemaVersion; version++) {
                const transformerMethod = this.getLegacyTransformer(version);
                transformerMethod(props);
            }
            props.schemaVersion = currentSchemaVersion;
        }
        return props;
    }
    getCurrentSchemaVersion() {
        const transformers = this.getLegacyTransformers();
        if (transformers.size === 0) {
            return 0;
        }
        const schemaVersions = Array.from(transformers.keys());
        const sortedSchemaVersions = schemaVersions.sort((a, b) => b - a);
        return sortedSchemaVersions[0];
    }
    isLegacySchemaVersion(instanceVersion, currentVersion) {
        return currentVersion > instanceVersion;
    }
    calculateNextSchemaVersion(instanceVersion = 0) {
        return instanceVersion + 1;
    }
    registerLegacyTransformer(schemaVersion, transformer, shouldOverride = false) {
        if (!isNumber(schemaVersion)) {
            throw new InvalidSchemaVersionError(getTypeName(this.constructor), kernel.describer.describe(schemaVersion));
        }
        if (this.hasLegacyTransformer(schemaVersion) && !shouldOverride) {
            throw new LegacyTransformerAlreadyExistsError(getTypeName(this.constructor), schemaVersion);
        }
        const typeName = getTypeName(this.constructor);
        const isVersionable = Reflect.getMetadata(VERSIONABLE_KEY, this.constructor) === typeName;
        if (!isVersionable) {
            Reflect.defineMetadata(LEGACY_TRANSFORMERS_CONTAINER_KEY, new Map(), this.constructor.prototype);
            Reflect.defineMetadata(VERSIONABLE_KEY, typeName, this.constructor);
        }
        const transformers = this.getLegacyTransformers();
        transformers.set(schemaVersion, transformer);
    }
    overrideLegacyTransformer(schemaVersion, transformer) {
        this.registerLegacyTransformer(schemaVersion, transformer, true);
    }
    hasLegacyTransformer(schemaVersion) {
        return this.getLegacyTransformers().has(schemaVersion);
    }
    getLegacyTransformers() {
        const transformers = Reflect.getOwnMetadata(LEGACY_TRANSFORMERS_CONTAINER_KEY, this.constructor.prototype);
        return transformers || new Map();
    }
    getLegacyTransformer(schemaVersion) {
        const typeName = getTypeName(this.constructor) || '';
        const transformers = this.getLegacyTransformers();
        if (!transformers.has(schemaVersion)) {
            throw new LegacyTransformerNotFoundError(typeName, schemaVersion);
        }
        return transformers.get(schemaVersion);
    }
    getSchemaVersion() {
        return this.schemaVersion;
    }
};
VersionableMixin = __decorate([
    injectable()
], VersionableMixin);

function isDefinable(arg) {
    if (arg == null)
        return false;
    return ((arg instanceof Struct || instanceOf({ kind: 15, name: "Definable", properties: { "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 } } })(arg)) &&
        isDefined(arg.constructor));
}
function isRecord(arg) {
    return (isPlainObject(arg) || isClassInstance(arg) || arg instanceof Collection);
}
function isPlainRecord(arg) {
    return isPlainObject(arg) || arg instanceof Collection;
}
function hasPostConstruct(target) {
    return (target != null &&
        Reflect.hasMetadata(METADATA_KEY.POST_CONSTRUCT, target.constructor));
}
function toPlainObject(arg) {
    const plainObj = {};
    for (const key of Reflect.ownKeys(arg)) {
        const value = arg[key.toString()];
        if (typeof (value === null || value === void 0 ? void 0 : value.toPlainObject) === 'function') {
            plainObj[key] = value.toPlainObject();
        }
        else if (isPlainRecord(value)) {
            plainObj[key] = toPlainObject(value);
        }
        else {
            plainObj[key] = value;
        }
    }
    return plainObj;
}
function convertObjectToCollection(obj) {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
        if (isPlainObject(value)) {
            converted[key] = new Collection(value);
        }
        else {
            converted[key] = value;
        }
    }
    return converted;
}
const createEJSON = function () {
    decache('@eveble/ejson');
    return require('@eveble/ejson');
};
function isEventSourceableType(arg) {
    if (arg == null)
        return false;
    return (typeof arg.resolveInitializingMessage === 'function' &&
        typeof arg.resolveRoutedCommands === 'function' &&
        typeof arg.resolveRoutedEvents === 'function' &&
        typeof arg.resolveRoutedMessages === 'function' &&
        typeof arg.getTypeName === 'function' &&
        typeof arg.from === 'function');
}
function loadENV(envFilePath) {
    dotenv.load({
        silent: false,
        defaults: '.env.defaults',
        schema: '.env.schema',
        errorOnMissing: true,
        errorOnExtra: true,
        path: envFilePath,
    });
}

let DefinableMixin = class DefinableMixin {
    getPropTypes() {
        const classPattern = kernel.converter.convert(this.constructor);
        return classPattern.properties;
    }
    getPropertyInitializers() {
        const parentInitializers = this.getParentInitializers();
        const instanceInitializers = this.getInstanceInitializers();
        const defaults = merge(parentInitializers, instanceInitializers, {
            isMergeableObject: isPlainRecord,
        });
        return defaults;
    }
    getInstanceInitializers() {
        return Reflect.getMetadata(DEFAULT_PROPS_KEY, this.constructor) || {};
    }
    getParentInitializers() {
        const matcher = (evaluatedProto) => {
            return typeof evaluatedProto.getInstanceInitializers === 'function';
        };
        const parentProto = getMatchingParentProto(this.constructor.prototype, matcher);
        if (parentProto === undefined)
            return {};
        return parentProto.getInstanceInitializers();
    }
    toPlainObject() {
        const propsKeys = Object.keys(this.getPropTypes());
        const plainObj = deepClone(toPlainObject(this));
        return pick(plainObj, propsKeys);
    }
    validateProps(props = {}, propTypes, isStrict = true) {
        if (!kernel.isValidating()) {
            return true;
        }
        try {
            return kernel.validator.validate(props, propTypes, isStrict);
        }
        catch (error) {
            const { message } = error;
            const typeName = getTypeName(this);
            throw new error.constructor(`${typeName}: ${message}`);
        }
    }
    equals(other) {
        return (other !== null &&
            other.constructor === this.constructor &&
            this.hasSameValues(other));
    }
    hasSameValues(other) {
        var _a;
        let hasSameValues = true;
        for (const key in this.getPropTypes()) {
            if (typeof ((_a = this[key]) === null || _a === void 0 ? void 0 : _a.equals) === 'function') {
                if (!this[key].equals(other[key])) {
                    hasSameValues = false;
                    break;
                }
            }
            else if (!isEqual(this[key], other[key])) {
                hasSameValues = false;
                break;
            }
        }
        return hasSameValues;
    }
    static getPropTypes() {
        return this.prototype.getPropTypes();
    }
    static getPropertyInitializers() {
        return this.prototype.getPropertyInitializers();
    }
};
DefinableMixin = __decorate([
    injectable()
], DefinableMixin);

var HookableMixin_1;
class HookError extends ExtendableError {
}
class InvalidHookActionError extends HookError {
    constructor(got) {
        super(`Expected action argument to be string, got ${got}`);
    }
}
class InvalidHookIdError extends HookError {
    constructor(got) {
        super(`Expected id argument to be string, got ${got}`);
    }
}
class HookAlreadyExistsError extends HookError {
    constructor(typeName, action, id) {
        super(`${typeName}: hook for action '${action}' with id '${id}' would be overwritten. Avoid overriding of existing hooks do to inconsistent behavior`);
    }
}
class HookNotFoundError extends HookError {
    constructor(typeName, action, id) {
        super(`${typeName}: hook for action '${action}' with id '${id}' can't be found`);
    }
}
let HookableMixin = HookableMixin_1 = class HookableMixin {
    registerHook(action, id, hook, shouldOverride = false) {
        if (!isString(action)) {
            throw new InvalidHookActionError(kernel.describer.describe(action));
        }
        if (!isString(id)) {
            throw new InvalidHookIdError(kernel.describer.describe(id));
        }
        const typeName = getTypeName(this.constructor) || '';
        if (this.hasHook(action, id) && !shouldOverride) {
            throw new HookAlreadyExistsError(typeName, action, id);
        }
        if (!Reflect.hasOwnMetadata(HOOKS_CONTAINER_KEY, this)) {
            Reflect.defineMetadata(HOOKS_CONTAINER_KEY, {}, this);
        }
        if (!Reflect.hasOwnMetadata(HOOKABLE_KEY, this.constructor)) {
            Reflect.defineMetadata(HOOKABLE_KEY, true, this.constructor);
        }
        const actions = Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this);
        if (!has(actions, action)) {
            actions[action] = {};
        }
        actions[action][id] = hook;
    }
    overrideHook(action, id, hook) {
        this.registerHook(action, id, hook, true);
    }
    getHook(action, id) {
        const hooks = this.getHooks(action);
        return get(hooks, id, undefined);
    }
    getHookOrThrow(action, id) {
        const hook = this.getHook(action, id);
        if (!hook) {
            const typeName = getTypeName(this.constructor) || '';
            throw new HookNotFoundError(typeName, action, id);
        }
        return hook;
    }
    getHooks(action) {
        const matcher = (proto) => {
            return (typeof proto.getHooks === 'function' &&
                proto.constructor !== HookableMixin_1);
        };
        const parentProto = getMatchingParentProto(this, matcher);
        const parentHooks = parentProto !== undefined && typeof parentProto.getHooks === 'function'
            ? parentProto.getHooks(action)
            : {};
        const childActions = Reflect.hasOwnMetadata(HOOKS_CONTAINER_KEY, this)
            ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
            : {};
        const childHooks = childActions[action] || {};
        const hooks = merge(parentHooks, childHooks, {
            isMergeableObject: isPlainObject,
        });
        return hooks;
    }
    getActions() {
        const matcher = (proto) => {
            return (typeof proto.getActions === 'function' &&
                proto.constructor !== HookableMixin_1);
        };
        const parentProto = getMatchingParentProto(this, matcher);
        const parentActions = parentProto !== undefined && typeof parentProto.getActions === 'function'
            ? parentProto.getActions()
            : {};
        const childActions = Reflect.hasOwnMetadata(HOOKS_CONTAINER_KEY, this)
            ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
            : {};
        const actions = merge(parentActions, childActions, {
            isMergeableObject: isPlainObject,
        });
        return actions;
    }
    hasHook(action, id) {
        const actions = this.getActions();
        return has(actions, `${action}.${id}`);
    }
    hasAction(action) {
        const actions = this.getActions();
        return has(actions, action);
    }
    removeHook(action, id) {
        const isHookable = Reflect.getOwnMetadata(HOOKABLE_KEY, this.constructor);
        if (!isHookable) {
            return;
        }
        const actions = Reflect.hasOwnMetadata(HOOKS_CONTAINER_KEY, this)
            ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
            : {};
        if (has(actions, `${action}.${id}`)) {
            delete actions[action][id];
        }
    }
};
HookableMixin = HookableMixin_1 = __decorate([
    injectable()
], HookableMixin);

class Struct extends classes(DefinableMixin, HookableMixin) {
    constructor(props = {}) {
        super();
        if (Reflect.getMetadata(DELEGATED_KEY, this.constructor) !== true &&
            Reflect.getMetadata(DEFAULT_PROPS_KEY, this.constructor) === undefined) {
            this.construct(props);
        }
    }
    construct(props = {}) {
        Object.assign(this, this.processProps(props));
    }
    processProps(props = {}) {
        const processedProps = this.onConstruction(props);
        this.onValidation(processedProps);
        return processedProps;
    }
    onConstruction(props) {
        const propertyInitializers = this.getPropertyInitializers();
        const processedProps = merge(propertyInitializers, props, {
            isMergeableObject: isPlainRecord,
        });
        const hooks = this.getHooks('onConstruction');
        for (const hook of Object.values(hooks)) {
            hook.bind(this)(processedProps);
        }
        return processedProps;
    }
    onValidation(props) {
        const mappings = Reflect.getMetadata(METADATA_KEY.TAGGED_PROP, this.constructor) || {};
        const propTypes = omit(this.getPropTypes(), Object.keys(mappings));
        const result = this.validateProps(props, propTypes, true);
        const hooks = this.getHooks('onValidation');
        for (const hook of Object.values(hooks)) {
            hook.bind(this)(props);
        }
        return result;
    }
}

class SerializableMixin {
    getTypeName() {
        return getTypeName(this);
    }
    toString() {
        return this.getTypeName();
    }
    static toString() {
        return this.getTypeName();
    }
    static getTypeName() {
        return getTypeName(this);
    }
    toJSONValue() {
        var _a;
        return (_a = kernel.serializer) === null || _a === void 0 ? void 0 : _a.toJSONValue(this);
    }
}

let EjsonableMixin = class EjsonableMixin extends SerializableMixin {
    typeName() {
        return this.getTypeName();
    }
    static typeName() {
        return this.getTypeName();
    }
};
EjsonableMixin = __decorate([
    injectable()
], EjsonableMixin);

let SerializableError = class SerializableError extends classes(ExtendableError, DefinableMixin, HookableMixin, EjsonableMixin, VersionableMixin) {
    constructor(propsOrMessage) {
        let props = {};
        if (typeof propsOrMessage === 'string') {
            props.message = propsOrMessage;
        }
        else if (propsOrMessage !== undefined) {
            props = propsOrMessage;
        }
        const errorProps = pick(props, [
            'message',
            'name',
            'stack',
            'code',
        ]);
        super([errorProps]);
        Object.assign(this, this.processProps(props));
    }
    processProps(props = {}) {
        const processedProps = this.onConstruction(props);
        this.onValidation(processedProps);
        return processedProps;
    }
    onConstruction(props) {
        const propertyInitializers = this.getPropertyInitializers();
        const processedProps = merge(propertyInitializers, props, {
            isMergeableObject: isPlainRecord,
        });
        if (props.name === undefined)
            processedProps.name = this.name;
        if (props.message === undefined)
            processedProps.message = this.message;
        const hooks = this.getHooks('onConstruction');
        for (const hook of Object.values(hooks)) {
            hook.bind(this)(processedProps);
        }
        return processedProps;
    }
    onValidation(props) {
        return this.validateProps(props, this.getPropTypes(), true);
    }
};
SerializableError = __decorate([
    define('SerializableError')({ kind: 19, name: "SerializableError", properties: { "name": { kind: 2 }, "message": { kind: 2 }, "stack": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "code": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, "schemaVersion": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] } }, extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], SerializableError);

let DomainError = class DomainError extends SerializableError {
};
DomainError = __decorate([
    define('DomainError')({ kind: 19, name: "DomainError", properties: {}, extends: { kind: 18, type: SerializableError, arguments: [] } })
], DomainError);

let AssertionError = class AssertionError extends DomainError {
};
AssertionError = __decorate([
    define('AssertionError')({ kind: 19, name: "AssertionError", properties: {}, extends: { kind: 18, type: DomainError, arguments: [] } })
], AssertionError);
let UndefinedActionError = class UndefinedActionError extends AssertionError {
    constructor(entityName, assertionApi) {
        super(`${entityName}: action name is not set while using assertion '${assertionApi}'. Please define action by using 'entity.on('action-name-as-string').${assertionApi}(...)' or 'entity.on(MyCommandType).ensure.${assertionApi}(...)`);
    }
};
UndefinedActionError = __decorate([
    define('UndefinedActionError')({ kind: 19, name: "UndefinedActionError", properties: {}, extends: { kind: 18, type: AssertionError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], UndefinedActionError);
let ListError = class ListError extends DomainError {
};
ListError = __decorate([
    define('ListError')({ kind: 19, name: "ListError", properties: {}, extends: { kind: 18, type: DomainError, arguments: [] } })
], ListError);
let IdentifiableAlreadyExistsError = class IdentifiableAlreadyExistsError extends ListError {
    constructor(props) {
        const { sourceName, listKey, identifiableName, key, value } = props;
        const sourceId = props.sourceId ? `@${props.sourceId}` : ``;
        const message = `${sourceName}${sourceId}: already has '${identifiableName}' with ${key} '${value}' on '${listKey}' list`;
        super({ message });
    }
};
IdentifiableAlreadyExistsError = __decorate([
    define('IdentifiableAlreadyExistsError')({ kind: 19, name: "IdentifiableAlreadyExistsError", properties: {}, extends: { kind: 18, type: ListError, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], IdentifiableAlreadyExistsError);
let ElementAlreadyExistsError = class ElementAlreadyExistsError extends ListError {
    constructor(props) {
        const { sourceName, listKey, serializableName, element } = props;
        const sourceId = props.sourceId ? `@${props.sourceId}` : ``;
        const message = `${sourceName}${sourceId}: already has same '${serializableName}' on '${listKey}' list`;
        super({ message, element });
    }
};
ElementAlreadyExistsError = __decorate([
    define('ElementAlreadyExistsError')({ kind: 19, name: "ElementAlreadyExistsError", properties: { "element": { kind: 15, name: "Serializable", properties: { "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } } }, extends: { kind: 18, type: ListError, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], ElementAlreadyExistsError);
let ElementNotFoundError = class ElementNotFoundError extends ListError {
    constructor(props) {
        const { sourceName, listKey, serializableName, key, value } = props;
        const sourceId = props.sourceId ? `@${props.sourceId}` : ``;
        const message = `${sourceName}${sourceId}: does not contain '${serializableName}' with ${key} '${value}' on '${listKey}' list`;
        super({ message });
    }
};
ElementNotFoundError = __decorate([
    define('ElementNotFoundError')({ kind: 19, name: "ElementNotFoundError", properties: {}, extends: { kind: 18, type: ListError, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], ElementNotFoundError);
let InvalidListError = class InvalidListError extends ListError {
    constructor(sourceName, listName) {
        super(`${sourceName}: list '${listName}' is not a serializable list property type`);
    }
};
InvalidListError = __decorate([
    define('InvalidListError')({ kind: 19, name: "InvalidListError", properties: {}, extends: { kind: 18, type: ListError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], InvalidListError);
let ValueObjectError = class ValueObjectError extends SerializableError {
};
ValueObjectError = __decorate([
    define('ValueObjectError')({ kind: 19, name: "ValueObjectError", properties: {}, extends: { kind: 18, type: SerializableError, arguments: [] } })
], ValueObjectError);
let EntityError = class EntityError extends DomainError {
};
EntityError = __decorate([
    define('EntityError')({ kind: 19, name: "EntityError", properties: {}, extends: { kind: 18, type: DomainError, arguments: [] } })
], EntityError);
let SavedStateNotFoundError = class SavedStateNotFoundError extends EntityError {
    constructor(esTypeName, id) {
        super(`${esTypeName}@${id}: expected entity to be have state saved before rollbacking it`);
    }
};
SavedStateNotFoundError = __decorate([
    define('SavedStateNotFoundError')({ kind: 19, name: "SavedStateNotFoundError", properties: {}, extends: { kind: 18, type: EntityError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], SavedStateNotFoundError);
let EventSourceableError = class EventSourceableError extends DomainError {
};
EventSourceableError = __decorate([
    define('EventSourceableError')({ kind: 19, name: "EventSourceableError", properties: {}, extends: { kind: 18, type: DomainError, arguments: [] } })
], EventSourceableError);
let InvalidEventError = class InvalidEventError extends EventSourceableError {
    constructor(esTypeName, got) {
        super(`${esTypeName}: event must be instance of Event, got ${got}`);
    }
};
InvalidEventError = __decorate([
    define('InvalidEventError')({ kind: 19, name: "InvalidEventError", properties: {}, extends: { kind: 18, type: EventSourceableError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], InvalidEventError);
let EventIdMismatchError = class EventIdMismatchError extends EventSourceableError {
    constructor(esTypeName, expectedId, got) {
        super(`${esTypeName}: the given event has mismatching source id. Expected id '${expectedId}', got '${got}'`);
    }
};
EventIdMismatchError = __decorate([
    define('EventIdMismatchError')({ kind: 19, name: "EventIdMismatchError", properties: {}, extends: { kind: 18, type: EventSourceableError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], EventIdMismatchError);
let InvalidInitializingMessageError = class InvalidInitializingMessageError extends EventSourceableError {
    constructor(esTypeName, expected, got) {
        super(`${esTypeName}: the given initializing message is not one of allowed types. Expected ${expected}, got ${got}`);
    }
};
InvalidInitializingMessageError = __decorate([
    define('InvalidInitializingMessageError')({ kind: 19, name: "InvalidInitializingMessageError", properties: {}, extends: { kind: 18, type: EventSourceableError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], InvalidInitializingMessageError);

const TYPE_KEY = '_type';
const HANDLERS = Symbol('eveble:handlers');
const HANDLEABLE_TYPES = Symbol('eveble:handleable-types');
const SOURCE_KEY = Symbol('eveble:source');
const LIST_KEY = Symbol('eveble:list-key');
const SERIALIZABLE_TYPE_KEY = Symbol('eveble:serializable-type');
const SAVE_STATE_METHOD_KEY = Symbol('eveble:save-state');
const SAVED_STATE_KEY = Symbol('eveble:saved-state');
const ROLLBACK_STATE_METHOD_KEY = Symbol('eveble:rollback-state');
const COMMANDS_KEY = Symbol('eveble:commands');
const EVENTS_KEY = Symbol('eveble:events');
const LITERAL_KEYS = {
    TYPE_KEY,
    HANDLERS,
    HANDLEABLE_TYPES,
    SOURCE_KEY,
    LIST_KEY,
    SERIALIZABLE_TYPE_KEY,
    SAVE_STATE_METHOD_KEY,
    SAVED_STATE_KEY,
    ROLLBACK_STATE_METHOD_KEY,
    COMMANDS_KEY,
    EVENTS_KEY,
};

class List extends Array {
    constructor(source, listKey, serializableType, serializables) {
        if (typeof source === 'number') {
            super(source);
        }
        else {
            super();
            Object.defineProperty(this, SOURCE_KEY, {
                enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
                value: source,
            });
            Object.defineProperty(this, LIST_KEY, {
                enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
                value: listKey,
            });
            Object.defineProperty(this, SERIALIZABLE_TYPE_KEY, {
                enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
                value: serializableType,
            });
            this.push(...serializables);
        }
    }
    create(...sources) {
        const element = this[SERIALIZABLE_TYPE_KEY].from(...sources);
        this.add(element);
        return element;
    }
    add(element) {
        kernel.validator.validate(element, this[SERIALIZABLE_TYPE_KEY]);
        if (typeof element.getId === 'function') {
            const identifiable = element;
            if (this.hasById(identifiable.getId())) {
                throw new IdentifiableAlreadyExistsError({
                    sourceName: this[SOURCE_KEY].getTypeName(),
                    sourceId: this.getSourceIdAsString(),
                    listKey: this[LIST_KEY],
                    identifiableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
                    key: 'id',
                    value: identifiable.getId().toString(),
                });
            }
        }
        else if (this.hasSame(element)) {
            throw new ElementAlreadyExistsError({
                sourceName: this[SOURCE_KEY].getTypeName(),
                sourceId: this.getSourceIdAsString(),
                listKey: this[LIST_KEY],
                serializableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
                element,
            });
        }
        this.push(element);
    }
    overrideBy(key, value, element) {
        const foundSerializable = this.getBy(key, value);
        if (foundSerializable === undefined) {
            this.add(element);
        }
        else {
            this[this.indexOf(foundSerializable)] = element;
        }
    }
    getBy(key, value) {
        let foundSerializable;
        for (const serializable of this) {
            if (serializable[key] === undefined) {
                continue;
            }
            if (isFunction(serializable[key].equals)) {
                if (serializable[key].equals(value)) {
                    foundSerializable = serializable;
                }
            }
            else if (serializable[key] === value) {
                foundSerializable = serializable;
            }
        }
        return foundSerializable;
    }
    getByOrThrow(key, value) {
        const foundSerializable = this.getBy(key, value);
        if (foundSerializable === undefined) {
            throw new ElementNotFoundError({
                sourceName: this[SOURCE_KEY].getTypeName(),
                sourceId: this.getSourceIdAsString(),
                listKey: this[LIST_KEY],
                serializableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
                key,
                value: kernel.describer.describe(value),
            });
        }
        return foundSerializable;
    }
    getById(id) {
        return this.getBy('id', id);
    }
    getByIdOrThrow(id) {
        const foundSerializable = this.getById(id);
        if (foundSerializable === undefined) {
            throw new ElementNotFoundError({
                sourceName: this[SOURCE_KEY].getTypeName(),
                sourceId: this.getSourceIdAsString(),
                listKey: this[LIST_KEY],
                serializableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
                key: 'id',
                value: id.toString(),
            });
        }
        return foundSerializable;
    }
    findById(id) {
        return this.getByIdOrThrow(id);
    }
    findBy(key, value) {
        return this.getByOrThrow(key, value);
    }
    hasBy(key, value) {
        return this.getBy(key, value) !== undefined;
    }
    hasSame(element) {
        return this.some((serializable) => {
            return serializable.equals(element);
        });
    }
    hasById(id) {
        return this.getById(id) !== undefined;
    }
    replaceById(id, element) {
        const foundSerializable = this.getById(id);
        if (foundSerializable === undefined) {
            this.add(element);
        }
        else {
            this[this.indexOf(foundSerializable)] = element;
        }
    }
    replaceBy(key, value, element) {
        const foundSerializable = this.getBy(key, value);
        if (foundSerializable === undefined) {
            this.add(element);
        }
        else {
            this[this.indexOf(foundSerializable)] = element;
        }
    }
    removeById(id) {
        const foundSerializable = this.getById(id);
        if (foundSerializable !== undefined) {
            pull(this, foundSerializable);
        }
    }
    removeBy(key, value) {
        const foundSerializable = this.getBy(key, value);
        if (foundSerializable !== undefined) {
            pull(this, foundSerializable);
        }
    }
    first() {
        return this[0];
    }
    last() {
        return last(this);
    }
    getSourceIdAsString() {
        if (typeof this[SOURCE_KEY].getId === 'function') {
            const identifiable = this[SOURCE_KEY];
            return identifiable.getId().toString();
        }
        return undefined;
    }
    getSource() {
        return this[SOURCE_KEY];
    }
    getListKey() {
        return this[LIST_KEY];
    }
    getSerializableType() {
        return this[SERIALIZABLE_TYPE_KEY];
    }
}

let Serializable = class Serializable extends classes(Struct, EjsonableMixin, VersionableMixin) {
    constructor(props = {}) {
        super([props]);
    }
    processSerializableList(props = {}) {
        const serializablesListProps = Reflect.getMetadata(SERIALIZABLE_LIST_PROPS_KEY, this.constructor);
        if (serializablesListProps !== undefined) {
            for (const [key, serializable] of Object.entries(serializablesListProps)) {
                props[key] = new List(this, key, serializable, props[key] || []);
            }
        }
        return props;
    }
    in(listName) {
        if (this[listName] === undefined) {
            throw new InvalidListError(this.typeName(), listName);
        }
        return this[listName];
    }
    static from(...sources) {
        const propTypes = this.getPropTypes();
        const propKeys = Object.keys(propTypes);
        const pickedProps = {};
        for (const source of sources) {
            Object.assign(pickedProps, pick(source, propKeys));
        }
        return new this(pickedProps);
    }
    static enableSerializableLists() {
        this.prototype.registerHook('onConstruction', 'convert-serializable-list', this.prototype.processSerializableList, true);
    }
    static disableSerializableLists() {
        this.prototype.removeHook('onConstruction', 'convert-serializable-list');
    }
};
Serializable = __decorate([
    define('Serializable')({ kind: 19, name: "Serializable", properties: { "schemaVersion": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] } }, extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], Serializable);
Serializable.enableSerializableLists();

let Message = class Message extends Serializable {
    constructor(props = {}) {
        super(props);
    }
    processProps(props = {}) {
        const processedProps = { ...props };
        if (!processedProps.timestamp) {
            processedProps.timestamp = new Date();
        }
        if (!processedProps.metadata) {
            processedProps.metadata = {};
        }
        return super.processProps(processedProps);
    }
    getTimestamp() {
        return this.timestamp;
    }
    assignMetadata(props) {
        Object.assign(this.metadata, merge(this.metadata, props, {
            isMergeableObject: isPlainRecord,
        }));
    }
    hasMetadata() {
        return !isEmpty(this.metadata);
    }
    getMetadata() {
        return this.metadata || {};
    }
    setCorrelationId(key, id) {
        set(this.metadata, `correlation.${key}`, id.toString());
    }
    getCorrelationId(key) {
        if (!this.hasMetadata()) {
            return undefined;
        }
        return get(this.metadata, `correlation.${key}`);
    }
    hasCorrelationId(key) {
        if (!this.hasMetadata()) {
            return false;
        }
        return has(this.metadata, `correlation.${key}`);
    }
};
Message = __decorate([
    define('Message')({ kind: 19, name: "Message", properties: { "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } }, extends: { kind: 18, type: Serializable, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], Message);

let ValueObject = class ValueObject extends Serializable {
};
ValueObject = __decorate([
    define('ValueObject')({ kind: 19, name: "ValueObject", properties: {}, extends: { kind: 18, type: Serializable, arguments: [] } })
], ValueObject);

var Guid_1;
let InvalidGuidValueError = class InvalidGuidValueError extends ValueObjectError {
    constructor(got) {
        super(`Guid: Expected string as a valid guid, got ${got}`);
    }
};
InvalidGuidValueError = __decorate([
    define('InvalidGuidValueError')({ kind: 19, name: "InvalidGuidValueError", properties: {}, extends: { kind: 18, type: ValueObjectError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], InvalidGuidValueError);
let Guid = Guid_1 = class Guid extends ValueObject {
    constructor(propsOrVal) {
        const props = isPlainObject(propsOrVal)
            ? { id: propsOrVal.id }
            : { id: propsOrVal };
        if (props.id !== undefined) {
            if (!Guid_1.isValid(props.id)) {
                throw new InvalidGuidValueError(kernel.describer.describe(props.id));
            }
        }
        else {
            props.id = Guid_1.generate().toString();
        }
        super(props);
        Object.freeze(this);
    }
    valueOf() {
        return this.id;
    }
    toString() {
        return this.id;
    }
    equals(otherGuid) {
        return otherGuid instanceof Guid_1 && otherGuid.valueOf() === this.valueOf();
    }
    static generate() {
        return new Guid_1(v4().toString());
    }
    static isValid(id) {
        return isString(id) && this.pattern.test(id.toString());
    }
};
Guid.pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
Guid = Guid_1 = __decorate([
    define('Guid')({ kind: 19, name: "Guid", properties: { "id": { kind: 2 } }, extends: { kind: 18, type: ValueObject, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], Guid);

let Assignment = class Assignment extends Serializable {
};
Assignment = __decorate([
    define('Assignment')({ kind: 19, name: "Assignment", properties: { "assignmentId": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "deliverAt": { kind: 18, type: Date, arguments: [] }, "assignerId": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "assignerType": { kind: 2 } }, extends: { kind: 18, type: Serializable, arguments: [] } })
], Assignment);
let Command = class Command extends Message {
    constructor(props) {
        super(props);
        if (Reflect.getMetadata(DEFAULT_PROPS_KEY, this.constructor) === undefined) {
            Object.freeze(this);
        }
    }
    getId() {
        return this.targetId;
    }
    schedule(assignment) {
        this.assignMetadata({
            scheduling: assignment,
        });
    }
    getAssignment() {
        return get(this, 'metadata.scheduling', undefined);
    }
    isScheduled() {
        if (!this.hasMetadata()) {
            return false;
        }
        const metadata = this.getMetadata();
        return has(metadata, 'scheduling');
    }
    isDeliverable() {
        var _a;
        const metadata = this.getMetadata();
        return (this.isScheduled() &&
            new Date().getTime() >= ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.scheduling) === null || _a === void 0 ? void 0 : _a.deliverAt));
    }
};
Command = __decorate([
    define('Command')({ kind: 19, name: "Command", properties: { "targetId": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] } }, extends: { kind: 18, type: Message, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], Command);

function handle(target, methodName, index) {
    if (!instanceOf({ kind: 15, name: "Controller", properties: { "initialize": { kind: 21 }, "handles": { kind: 21 }, "subscribes": { kind: 21 }, "registerHandler": { kind: 21 }, "overrideHandler": { kind: 21 }, "hasHandler": { kind: 21 }, "getHandler": { kind: 21 }, "getHandlerOrThrow": { kind: 21 }, "removeHandler": { kind: 21 }, "getHandlers": { kind: 21 }, "setHandleableTypes": { kind: 21 }, "getHandleableTypes": { kind: 21 }, "ensureHandleability": { kind: 21 }, "isHandleabe": { kind: 21 }, "getHandledTypes": { kind: 21 }, "getHandled": { kind: 21 }, "handle": { kind: 21 } } })(target)) {
        throw new InvalidControllerError(getTypeName(target.constructor));
    }
    const params = Reflect.getMetadata('design:paramtypes', target, methodName);
    const command = params[index];
    if (!((command === null || command === void 0 ? void 0 : command.prototype) instanceof Command)) {
        throw new UnhandleableTypeError(getTypeName(target.constructor), kernel.describer.describe([Command]), kernel.describer.describe(command));
    }
    const typeName = getTypeName(target.constructor);
    const isHandling = Reflect.getMetadata(HANDLER_KEY, target.constructor) === typeName;
    if (!isHandling) {
        Reflect.defineMetadata(COMMAND_HANDLERS_CONTAINER_KEY, new Map(), target.constructor.prototype);
        Reflect.defineMetadata(HANDLER_KEY, typeName, target.constructor);
    }
    const handlers = Reflect.getMetadata(COMMAND_HANDLERS_CONTAINER_KEY, target.constructor.prototype);
    handlers.set(command, target[methodName]);
}

let Event = class Event extends Message {
    constructor(props) {
        super(props);
        if (Reflect.getMetadata(DEFAULT_PROPS_KEY, this.constructor) === undefined) {
            Object.freeze(this);
        }
    }
    getId() {
        return this.sourceId;
    }
};
Event = __decorate([
    define('Event')({ kind: 19, name: "Event", properties: { "sourceId": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "version": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] } }, extends: { kind: 18, type: Message, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], Event);

function subscribe(target, propertyName, index) {
    if (!instanceOf({ kind: 15, name: "Controller", properties: { "initialize": { kind: 21 }, "handles": { kind: 21 }, "subscribes": { kind: 21 }, "registerHandler": { kind: 21 }, "overrideHandler": { kind: 21 }, "hasHandler": { kind: 21 }, "getHandler": { kind: 21 }, "getHandlerOrThrow": { kind: 21 }, "removeHandler": { kind: 21 }, "getHandlers": { kind: 21 }, "setHandleableTypes": { kind: 21 }, "getHandleableTypes": { kind: 21 }, "ensureHandleability": { kind: 21 }, "isHandleabe": { kind: 21 }, "getHandledTypes": { kind: 21 }, "getHandled": { kind: 21 }, "handle": { kind: 21 } } })(target)) {
        throw new InvalidControllerError(getTypeName(target.constructor));
    }
    const params = Reflect.getMetadata('design:paramtypes', target, propertyName);
    const event = params[index];
    if (!((event === null || event === void 0 ? void 0 : event.prototype) instanceof Event)) {
        throw new UnhandleableTypeError(getTypeName(target.constructor), kernel.describer.describe([Event]), kernel.describer.describe(event));
    }
    const typeName = getTypeName(target.constructor);
    const isSubscribing = Reflect.getMetadata(SUBSCRIBER_KEY, target.constructor) === typeName;
    if (!isSubscribing) {
        Reflect.defineMetadata(EVENT_HANDLERS_CONTAINER_KEY, new Map(), target.constructor.prototype);
        Reflect.defineMetadata(SUBSCRIBER_KEY, typeName, target.constructor);
    }
    const handlers = Reflect.getMetadata(EVENT_HANDLERS_CONTAINER_KEY, target.constructor.prototype);
    handlers.set(event, target[propertyName]);
}

function initial(target, methodName, index) {
    if (!instanceOf({ kind: 15, name: "Controller", properties: { "initialize": { kind: 21 }, "handles": { kind: 21 }, "subscribes": { kind: 21 }, "registerHandler": { kind: 21 }, "overrideHandler": { kind: 21 }, "hasHandler": { kind: 21 }, "getHandler": { kind: 21 }, "getHandlerOrThrow": { kind: 21 }, "removeHandler": { kind: 21 }, "getHandlers": { kind: 21 }, "setHandleableTypes": { kind: 21 }, "getHandleableTypes": { kind: 21 }, "ensureHandleability": { kind: 21 }, "isHandleabe": { kind: 21 }, "getHandledTypes": { kind: 21 }, "getHandled": { kind: 21 }, "handle": { kind: 21 } } })(target)) {
        throw new InvalidControllerError(getTypeName(target.constructor));
    }
    const params = Reflect.getMetadata('design:paramtypes', target, methodName);
    const message = params[index];
    if (!((message === null || message === void 0 ? void 0 : message.prototype) instanceof Command) &&
        !((message === null || message === void 0 ? void 0 : message.prototype) instanceof Event)) {
        throw new UnhandleableTypeError(getTypeName(target.constructor), kernel.describer.describe([Command]), kernel.describer.describe(message));
    }
    const initializingMessage = Reflect.getOwnMetadata(INITIALIZING_MESSAGE_KEY, target.constructor.prototype);
    if (initializingMessage === undefined) {
        Reflect.defineMetadata(INITIALIZING_MESSAGE_KEY, message, target.constructor.prototype);
    }
    else {
        throw new InitializingMessageAlreadyExistsError(target.getTypeName(), initializingMessage.getTypeName(), message.getTypeName());
    }
    if (message.prototype instanceof Command) {
        handle(target, methodName, index);
    }
    else {
        subscribe(target, methodName, index);
    }
}

function route(target, methodName, index) {
    if (!instanceOf({ kind: 15, name: "Controller", properties: { "initialize": { kind: 21 }, "handles": { kind: 21 }, "subscribes": { kind: 21 }, "registerHandler": { kind: 21 }, "overrideHandler": { kind: 21 }, "hasHandler": { kind: 21 }, "getHandler": { kind: 21 }, "getHandlerOrThrow": { kind: 21 }, "removeHandler": { kind: 21 }, "getHandlers": { kind: 21 }, "setHandleableTypes": { kind: 21 }, "getHandleableTypes": { kind: 21 }, "ensureHandleability": { kind: 21 }, "isHandleabe": { kind: 21 }, "getHandledTypes": { kind: 21 }, "getHandled": { kind: 21 }, "handle": { kind: 21 } } })(target)) {
        throw new InvalidControllerError(getTypeName(target.constructor));
    }
    const params = Reflect.getMetadata('design:paramtypes', target, methodName);
    const message = params[index];
    if (!((message === null || message === void 0 ? void 0 : message.prototype) instanceof Command) &&
        !((message === null || message === void 0 ? void 0 : message.prototype) instanceof Event)) {
        throw new UnhandleableTypeError(getTypeName(target.constructor), kernel.describer.describe([Command]), kernel.describer.describe(message));
    }
    const containerKey = message.prototype instanceof Command
        ? ROUTED_COMMANDS_CONTAINER_KEY
        : ROUTED_EVENTS_CONTAINER_KEY;
    const hasRoutedMessage = Reflect.getMetadata(containerKey, target.constructor.prototype);
    if (!hasRoutedMessage) {
        Reflect.defineMetadata(containerKey, [], target.constructor.prototype);
    }
    const routedMessage = Reflect.getMetadata(containerKey, target.constructor.prototype);
    routedMessage.push(message);
    if (message.prototype instanceof Command) {
        handle(target, methodName, index);
    }
    else {
        subscribe(target, methodName, index);
    }
}

function version(schemaVersion) {
    return function (proto, propertyKey) {
        const target = proto.constructor;
        const descriptor = Object.getOwnPropertyDescriptor(proto, propertyKey);
        const type = descriptor === undefined ? 'property' : 'method';
        if (type !== 'method') {
            throw new InvalidLegacyTransformerError(getTypeName(target), propertyKey, schemaVersion);
        }
        if (!instanceOf({ kind: 15, name: "Versionable", properties: { "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } })(proto) ||
            !instanceOf({ kind: 15, name: "Hookable", properties: { "registerHook": { kind: 21 }, "overrideHook": { kind: 21 }, "getHook": { kind: 21 }, "getHookOrThrow": { kind: 21 }, "getHooks": { kind: 21 }, "getActions": { kind: 21 }, "hasHook": { kind: 21 }, "hasAction": { kind: 21 }, "removeHook": { kind: 21 } } })(proto)) {
            throw new NotVersionableError(getTypeName(target));
        }
        if (!proto.hasHook('onConstruction', 'versionable')) {
            proto.registerHook('onConstruction', 'versionable', proto.transformLegacyProps);
        }
        proto.registerLegacyTransformer(schemaVersion, descriptor === null || descriptor === void 0 ? void 0 : descriptor.value);
    };
}

class ModuleError extends ExtendableError {
}
class AppMissingError extends ModuleError {
    constructor() {
        super(`Instance of App is required to initialize module`);
    }
}
class InjectorMissingError extends ModuleError {
    constructor() {
        super(`Instance of Injector is required to initialize module`);
    }
}
class InvalidModuleError extends ModuleError {
    constructor(className, got) {
        super(`${className}: dependent modules must be instance of Module, got ${got}`);
    }
}
class InvalidConfigError extends ModuleError {
    constructor(className, got) {
        super(`${className}: configuration must be an instance implementing Configurable interface, got ${got}`);
    }
}
class InvalidEnvironmentError extends ModuleError {
    constructor(action, currentEnv) {
        super(`Trying to run action '${action}' on '${currentEnv}' environment`);
    }
}
class InjectorError extends ExtendableError {
}
class InvalidEventSourceableError extends InjectorError {
    constructor(got) {
        super(`Injector: expected EventSourceableType to be constructor type of EventSourceable, got ${got}`);
    }
}
class AppError extends ExtendableError {
}
class InvalidAppConfigError extends AppError {
    constructor(got) {
        super(`Configuration provided for application must be an instance of AppConfig, got ${got}`);
    }
}
class LoggingError extends ExtendableError {
}
class InvalidTransportIdError extends LoggingError {
    constructor(got) {
        super(`Expected id argument to be string, got ${got}`);
    }
}
class TransportExistsError extends LoggingError {
    constructor(id) {
        super(`Transport with id '${id}' would be overridden. To override existing mapping use <Logger.prototype.overrideTransport>`);
    }
}

function executePostConstruct(target) {
    const metadata = Reflect.getMetadata(METADATA_KEY.POST_CONSTRUCT, target.constructor);
    const methodName = metadata.value;
    target[methodName]();
}
async function executePostConstructAsync(target) {
    const metadata = Reflect.getMetadata(METADATA_KEY.POST_CONSTRUCT, target.constructor);
    const methodName = metadata.value;
    await target[methodName]();
}
class Injector extends Container {
    bind(serviceIdentifier) {
        const bindingToSyntax = super.bind(serviceIdentifier);
        bindingToSyntax.toRoute = (EventSourceableType) => {
            if (!isEventSourceableType(EventSourceableType)) {
                throw new InvalidEventSourceableError(kernel.describer.describe(EventSourceableType));
            }
            const Router = this.get(BINDINGS.Router);
            const router = new Router(EventSourceableType, EventSourceableType.resolveInitializingMessage(), EventSourceableType.resolveRoutedCommands(), EventSourceableType.resolveRoutedEvents());
            this.injectInto(router);
            bindingToSyntax.toConstantValue(router);
        };
        return bindingToSyntax;
    }
    injectInto(value) {
        const mappings = Reflect.getMetadata(METADATA_KEY.TAGGED_PROP, value.constructor);
        if (mappings) {
            for (const [key, metadatas] of Object.entries(mappings)) {
                for (const metadata of metadatas) {
                    if (metadata.key === 'inject') {
                        const id = metadata.value;
                        value[key] = this.get(id);
                    }
                }
            }
        }
        if (hasPostConstruct(value)) {
            executePostConstruct(value);
        }
    }
    async injectIntoAsync(value) {
        const mappings = Reflect.getMetadata(METADATA_KEY.TAGGED_PROP, value.constructor);
        if (mappings) {
            for (const [key, metadatas] of Object.entries(mappings)) {
                for (const metadata of metadatas) {
                    if (metadata.key === 'inject') {
                        const id = metadata.value;
                        value[key] = await this.getAsync(id);
                    }
                }
            }
        }
        if (hasPostConstruct(value)) {
            await executePostConstructAsync(value);
        }
    }
    findByScope(scope) {
        const lookup = this._bindingDictionary;
        const identifiers = [];
        lookup.traverse((key) => {
            const bindings = lookup.get(key);
            for (const binding of bindings) {
                if (binding.scope === scope) {
                    identifiers.push(binding.serviceIdentifier);
                }
            }
        });
        return identifiers;
    }
}

class StateError extends ExtendableError {
}
class UndefinedStatesError extends StateError {
    constructor(typeName) {
        super(`${typeName}: states are not defined. Please define states as class(MyClass.STATES) property or define your getter as MyClass.prototype.getAvailableStates`);
    }
}
class InvalidStateError extends StateError {
    constructor(typeName, currentState, expectedStates) {
        super(`${typeName}: expected current state of '${currentState}' to be in one of states: '${expectedStates}'`);
    }
}
let StatefulMixin = class StatefulMixin {
    setState(state) {
        const selectableStates = this.getSelectableStates();
        if (isEmpty(selectableStates)) {
            const typeName = getTypeName(this.constructor);
            throw new UndefinedStatesError(typeName);
        }
        const oneOfSelectableStates = Object.values(selectableStates);
        if (kernel.isValidating()) {
            const pattern = new OneOf(...oneOfSelectableStates);
            kernel.validator.validate(state, pattern);
        }
        this.state = state;
    }
    isInState(state) {
        if (Array.isArray(state)) {
            return this.isInOneOfStates(state);
        }
        return this.state === state;
    }
    isInOneOfStates(states) {
        const expectedStates = Array.isArray(states)
            ? states
            : [states];
        return expectedStates.includes(this.state);
    }
    getState() {
        return this.state;
    }
    hasState() {
        return this.state != null;
    }
    validateState(stateOrStates, error) {
        const expectedStates = Array.isArray(stateOrStates)
            ? stateOrStates
            : [stateOrStates];
        if (!this.isInOneOfStates(expectedStates)) {
            if (error !== undefined) {
                throw error;
            }
            const typeName = getTypeName(this.constructor);
            throw new InvalidStateError(typeName, this.state, expectedStates.join(', '));
        }
        return true;
    }
    getSelectableStates() {
        return this.constructor.STATES;
    }
};
StatefulMixin = __decorate([
    injectable()
], StatefulMixin);

class UndefinedLoggableTargetError extends ExtendableError {
    constructor() {
        super(`Please define your logged target with 'Log.prototype.on' method at your Log instance`);
    }
}
class LogMetadata {
    constructor(description, value, keys) {
        this.description = description;
        if (value)
            this.value = value;
        if (keys)
            this.keys = keys;
    }
}
class Log {
    constructor(messageOrProps) {
        if (typeof messageOrProps === 'string') {
            const message = messageOrProps;
            this.message = message;
            this.metadata = new Map();
            this.options = {};
            this.method = undefined;
            this.methodName = '';
            this.typeName = '';
        }
        else {
            const props = messageOrProps;
            Object.assign(this, props);
        }
    }
    toString() {
        return this.message;
    }
    on(target) {
        this.target = target;
        this.typeName = getTypeName(this.target) || '';
        return this;
    }
    in(methodOrName) {
        if (this.target === undefined) {
            throw new UndefinedLoggableTargetError();
        }
        let method;
        if (isString(methodOrName)) {
            this.methodName = methodOrName;
            method = this.target[this.methodName];
        }
        else {
            method = methodOrName;
            this.methodName = method.name;
        }
        this.method = method;
        return this;
    }
    with(description, value, keys) {
        const metadata = new LogMetadata(description, value, keys);
        this.metadata.set(description, metadata);
        return this;
    }
    format(options) {
        Object.assign(this.options, options);
        return this;
    }
    getTarget() {
        return this.target;
    }
    isStaticMethod() {
        if (this.target !== undefined && this.method !== undefined) {
            return (this.target.constructor !== undefined &&
                this.target.constructor[this.method.name] !== undefined);
        }
        return false;
    }
    getMetadata(description) {
        return this.metadata.get(description);
    }
    hasMetadata(description) {
        return this.metadata.has(description);
    }
    setLevel(level) {
        this.level = level;
        return this;
    }
}

var Config_1;
let Config = Config_1 = class Config extends Struct {
    constructor() {
        super();
    }
    isConfigurable(path) {
        return has(this.getPropTypes(), path);
    }
    getPropTypes() {
        var _a;
        const instancePropTypes = super.getPropTypes();
        let propTypes = {};
        for (const key of Reflect.ownKeys(instancePropTypes)) {
            const value = instancePropTypes[key.toString()];
            if (value instanceof InstanceOf &&
                typeof ((_a = value[0]) === null || _a === void 0 ? void 0 : _a.getPropTypes) === 'function') {
                propTypes[key] = new Collection(value[0].getPropTypes());
            }
            else {
                propTypes[key] = value;
            }
        }
        if (isEmpty(this.merged)) {
            return propTypes;
        }
        let mergedPropTypes = {};
        for (const mergedCfg of Object.values(this.merged || {})) {
            const mergedConfigPropTypes = mergedCfg.getPropTypes();
            mergedPropTypes = merge(mergedPropTypes, mergedConfigPropTypes, {
                isMergeableObject: isPlainRecord,
            });
        }
        propTypes = merge(mergedPropTypes, propTypes, {
            isMergeableObject: isPlainRecord,
        });
        return convertObjectToCollection(propTypes);
    }
    has(path) {
        const hasValue = has(this, path);
        if (hasValue)
            return true;
        for (const config of Object.values(this.included || {})) {
            if (config.has(path)) {
                return true;
            }
        }
        return false;
    }
    get(path, runtimeDefaultValue) {
        let foundValue = get(this, path);
        if (foundValue !== undefined) {
            if (isPlainRecord(foundValue)) {
                return { ...foundValue };
            }
            return foundValue;
        }
        for (const config of Object.values(this.included || [])) {
            foundValue = config.getExact(path);
            if (foundValue !== undefined) {
                return foundValue;
            }
        }
        if (runtimeDefaultValue !== undefined) {
            return runtimeDefaultValue;
        }
        return this.getDefault(path);
    }
    getExact(path) {
        let foundValue = get(this, path);
        if (foundValue !== undefined) {
            if (isPlainRecord(foundValue)) {
                return { ...foundValue };
            }
            return foundValue;
        }
        for (const config of Object.values(this.included || [])) {
            foundValue = config.getExact(path);
            if (foundValue !== undefined) {
                return foundValue;
            }
        }
        return undefined;
    }
    getDefault(path) {
        let foundDefaultValue = get(this.getPropertyInitializers(), path);
        if (foundDefaultValue !== undefined) {
            if (isPlainRecord(foundDefaultValue)) {
                return { ...foundDefaultValue };
            }
            return foundDefaultValue;
        }
        for (const config of Object.values(this.included || {})) {
            foundDefaultValue = config.getDefault(path);
            if (foundDefaultValue !== undefined) {
                return foundDefaultValue;
            }
        }
        return undefined;
    }
    hasDefault(path) {
        const hasDefaultValue = has(this.getPropertyInitializers(), path);
        if (hasDefaultValue)
            return true;
        for (const config of Object.values(this.included || {})) {
            if (config.hasDefault(path)) {
                return true;
            }
        }
        return hasDefaultValue;
    }
    set(path, value) {
        const copy = this.toPlainObject();
        set(copy, path, value);
        this.validateProps(copy, this.getPropTypes());
        set(this, path, value);
    }
    assign(props) {
        let copy = this.toPlainObject();
        copy = merge(copy, props, {
            isMergeableObject: isPlainRecord,
        });
        this.validateProps(copy, this.getPropTypes());
        Object.assign(this, merge(this, props, {
            isMergeableObject: isPlainRecord,
        }));
    }
    include(config) {
        if (!instanceOf({ kind: 15, name: "Configurable", properties: { "isConfigurable": { kind: 21 }, "has": { kind: 21 }, "get": { kind: 21 }, "getExact": { kind: 21 }, "getDefault": { kind: 21 }, "hasDefault": { kind: 21 }, "set": { kind: 21 }, "assign": { kind: 21 }, "include": { kind: 21 }, "merge": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 } } })(config)) {
            throw new InvalidConfigError(getTypeName(this), kernel.describer.describe(config));
        }
        if (this.included === undefined)
            this.included = {};
        this.included[getTypeName(config)] = config;
    }
    static from(props) {
        const propTypes = this.getPropTypes();
        const processedProps = {};
        for (const [key, PropType] of Object.entries(propTypes)) {
            let UnwrapedPropType = PropType;
            if (PropType instanceof Optional) {
                UnwrapedPropType = PropType[0];
            }
            if (UnwrapedPropType instanceof InstanceOf) {
                UnwrapedPropType = UnwrapedPropType[0];
            }
            if (props[key] === undefined) {
                continue;
            }
            if (UnwrapedPropType.prototype !== undefined &&
                UnwrapedPropType.prototype instanceof Config_1) {
                processedProps[key] = new UnwrapedPropType(props[key]);
            }
            else {
                processedProps[key] = props[key];
            }
        }
        return new this(processedProps);
    }
    merge(config) {
        if (!instanceOf({ kind: 15, name: "Configurable", properties: { "isConfigurable": { kind: 21 }, "has": { kind: 21 }, "get": { kind: 21 }, "getExact": { kind: 21 }, "getDefault": { kind: 21 }, "hasDefault": { kind: 21 }, "set": { kind: 21 }, "assign": { kind: 21 }, "include": { kind: 21 }, "merge": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 } } })(config)) {
            throw new InvalidConfigError(getTypeName(this), kernel.describer.describe(config));
        }
        const configCopy = config.toPlainObject();
        delete configCopy.included;
        Object.assign(this, merge(configCopy, this, {
            isMergeableObject: isPlainRecord,
        }));
        if (this.merged === undefined)
            this.merged = {};
        this.merged[getTypeName(config)] = config;
    }
};
Config = Config_1 = __decorate([
    delegate(),
    define()({ kind: 19, name: "Config", properties: { "included": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "merged": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } }, extends: { kind: 18, type: Struct, arguments: [] } }),
    __metadata("design:paramtypes", [])
], Config);

let LogTransportConfig = class LogTransportConfig extends Config {
    constructor(props) {
        super();
        this.isEnabled = true;
        this.level = 'info';
        this.logColors = {
            emerg: 'bold redBG',
            alert: 'bold yellow',
            crit: 'bold red',
            error: 'red',
            warning: 'yellow',
            notice: 'blue',
            info: 'white',
            debug: 'bold cyan',
        };
        this.partsColors = {
            initial: 'white',
            separator: 'white',
            timestamp: 'white',
            label: 'white',
            target: 'white',
            method: 'white',
        };
        this.messages = {
            start: chalk `{gray start}`,
            exit: chalk `{gray exit}`,
        };
        this.parts = {
            initial: '',
            separator: ' ',
            label: '',
        };
        this.flags = {
            isTimestamped: true,
            isLabeled: false,
            showTarget: true,
            showMethod: true,
            isColored: true,
            isWholeLineColored: true,
            includeStackTrace: true,
            isAbbreviatingSources: false,
        };
        this.timestampFormat = 'HH:mm:ss';
        this.abbreviationLength = 15;
        this.inspectDepth = 0;
        Object.assign(this, this.processProps(props));
    }
};
LogTransportConfig = __decorate([
    define()({ kind: 19, name: "LogTransportConfig", properties: { "isEnabled": { kind: 17, initializer: () => true, types: [{ kind: 12 }, { kind: 4 }] }, "level": { kind: 17, initializer: () => 'info', types: [{ kind: 12 }, { kind: 2 }] }, "logColors": { kind: 17, initializer: () => ({
                    emerg: 'bold redBG',
                    alert: 'bold yellow',
                    crit: 'bold red',
                    error: 'red',
                    warning: 'yellow',
                    notice: 'blue',
                    info: 'white',
                    debug: 'bold cyan',
                }), types: [{ kind: 12 }, { kind: 15, properties: {} }] }, "partsColors": { kind: 17, initializer: () => ({
                    initial: 'white',
                    separator: 'white',
                    timestamp: 'white',
                    label: 'white',
                    target: 'white',
                    method: 'white',
                }), types: [{ kind: 12 }, { kind: 15, properties: { "initial": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "separator": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "target": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "method": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "label": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] } } }] }, "messages": { kind: 17, initializer: () => ({
                    start: chalk `{gray start}`,
                    exit: chalk `{gray exit}`,
                }), types: [{ kind: 12 }, { kind: 15, properties: { "start": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "exit": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] } } }] }, "parts": { kind: 17, initializer: () => ({
                    initial: '',
                    separator: ' ',
                    label: '',
                }), types: [{ kind: 12 }, { kind: 15, properties: { "initial": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "separator": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "label": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] } } }] }, "flags": { kind: 17, initializer: () => ({
                    isTimestamped: true,
                    isLabeled: false,
                    showTarget: true,
                    showMethod: true,
                    isColored: true,
                    isWholeLineColored: true,
                    includeStackTrace: true,
                    isAbbreviatingSources: false,
                }), types: [{ kind: 12 }, { kind: 15, properties: { "isTimestamped": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] }, "isLabeled": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] }, "showTarget": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] }, "showMethod": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] }, "isColored": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] }, "isWholeLineColored": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] }, "includeStackTrace": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] }, "isAbbreviatingSources": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] } } }] }, "timestampFormat": { kind: 17, initializer: () => 'HH:mm:ss', types: [{ kind: 12 }, { kind: 2 }] }, "abbreviationLength": { kind: 17, initializer: () => 15, types: [{ kind: 12 }, { kind: 3 }] }, "inspectDepth": { kind: 17, initializer: () => 0, types: [{ kind: 12 }, { kind: 3 }] } }, extends: { kind: 18, type: Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], LogTransportConfig);

let LoggingConfig = class LoggingConfig extends Config {
    constructor(props) {
        super();
        this.isEnabled = true;
        this.levels = {
            emerg: 0,
            alert: 1,
            crit: 2,
            error: 3,
            warning: 4,
            notice: 5,
            info: 6,
            debug: 7,
        };
        this.transports = {
            console: new LogTransportConfig({
                level: getenv.string('LOGGING_LEVEL', 'info'),
            }),
        };
        Object.assign(this, this.processProps(props));
    }
};
LoggingConfig = __decorate([
    define()({ kind: 19, name: "LoggingConfig", properties: { "isEnabled": { kind: 17, initializer: () => true, types: [{ kind: 12 }, { kind: 4 }] }, "levels": { kind: 17, initializer: () => ({
                    emerg: 0,
                    alert: 1,
                    crit: 2,
                    error: 3,
                    warning: 4,
                    notice: 5,
                    info: 6,
                    debug: 7,
                }), types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "transports": { kind: 17, initializer: () => ({
                    console: new LogTransportConfig({
                        level: getenv.string('LOGGING_LEVEL', 'info'),
                    }),
                }), types: [{ kind: 12 }, { kind: 15, properties: { "console": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: LogTransportConfig, arguments: [] }] } } }] } }, extends: { kind: 18, type: Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], LoggingConfig);

let EvebleConfig = class EvebleConfig extends Config {
    constructor(props) {
        super();
        if (props)
            Object.assign(this, this.processProps(props));
    }
};
EvebleConfig = __decorate([
    define()({ kind: 19, name: "EvebleConfig", properties: { "CommitStore": { kind: 17, types: [{ kind: 12 }, { kind: 15, properties: { "timeout": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] } } }] }, "Snapshotter": { kind: 17, types: [{ kind: 12 }, { kind: 15, properties: { "isEnabled": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] }, "frequency": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] } } }] }, "CommandScheduler": { kind: 17, types: [{ kind: 12 }, { kind: 15, properties: { "isEnabled": { kind: 17, types: [{ kind: 12 }, { kind: 4 }] } } }] } }, extends: { kind: 18, type: Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], EvebleConfig);

var AppConfig_1;
let AppConfig = AppConfig_1 = class AppConfig extends Config {
    constructor(props) {
        super();
        this.appId = getenv.string('APP_ID', AppConfig_1.generateId());
        this.workerId = getenv.string('WORKER_ID', AppConfig_1.generateId());
        this.logging = new LoggingConfig();
        this.conversion = { type: 'runtime' };
        this.validation = { type: 'runtime' };
        this.description = { formatting: 'default' };
        this.eveble = new EvebleConfig();
        this.clients = {
            MongoDB: {
                CommitStore: AppConfig_1.defaultMongoDBOptions,
                Snapshotter: AppConfig_1.defaultMongoDBOptions,
                CommandScheduler: AppConfig_1.defaultMongoDBOptions,
            },
            Agenda: {
                CommandScheduler: {
                    processEvery: 180000,
                },
            },
        };
        if (props)
            Object.assign(this, this.processProps(props));
    }
    processProps(props = {}) {
        if (props.eveble !== undefined && !(props.eveble instanceof EvebleConfig)) {
            props.eveble = new EvebleConfig(props.eveble);
        }
        return super.processProps(props);
    }
    static generateId() {
        return v4().toString();
    }
};
AppConfig.defaultMongoDBOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
AppConfig = AppConfig_1 = __decorate([
    define()({ kind: 19, name: "AppConfig", properties: { "appId": { kind: 17, initializer: () => getenv.string('APP_ID', AppConfig_1.generateId()), types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "workerId": { kind: 17, initializer: () => getenv.string('WORKER_ID', AppConfig_1.generateId()), types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "logging": { kind: 17, initializer: () => new LoggingConfig(), types: [{ kind: 12 }, { kind: 18, type: LoggingConfig, arguments: [] }] }, "conversion": { kind: 17, initializer: () => ({ type: 'runtime' }), types: [{ kind: 12 }, { kind: 15, properties: { "type": { kind: 17, types: [{ kind: 5, value: "manual" }, { kind: 5, value: "runtime" }] } } }] }, "validation": { kind: 17, initializer: () => ({ type: 'runtime' }), types: [{ kind: 12 }, { kind: 15, properties: { "type": { kind: 17, types: [{ kind: 5, value: "manual" }, { kind: 5, value: "runtime" }] } } }] }, "description": { kind: 17, initializer: () => ({ formatting: 'default' }), types: [{ kind: 12 }, { kind: 15, properties: { "formatting": { kind: 17, types: [{ kind: 5, value: "compact" }, { kind: 5, value: "debug" }, { kind: 5, value: "default" }] } } }] }, "eveble": { kind: 17, initializer: () => new EvebleConfig(), types: [{ kind: 12 }, { kind: 18, type: EvebleConfig, arguments: [] }] }, "clients": { kind: 17, initializer: () => ({
                    MongoDB: {
                        CommitStore: AppConfig_1.defaultMongoDBOptions,
                        Snapshotter: AppConfig_1.defaultMongoDBOptions,
                        CommandScheduler: AppConfig_1.defaultMongoDBOptions,
                    },
                    Agenda: {
                        CommandScheduler: {
                            processEvery: 180000,
                        },
                    },
                }), types: [{ kind: 12 }, { kind: 15, properties: { "MongoDB": { kind: 17, types: [{ kind: 12 }, { kind: 15, properties: { "CommitStore": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "Snapshotter": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "CommandScheduler": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } } }] }, "Agenda": { kind: 17, types: [{ kind: 12 }, { kind: 15, properties: { "CommandScheduler": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } } }] } } }] } }, extends: { kind: 18, type: Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], AppConfig);

var STATES;
(function (STATES) {
    STATES["constructed"] = "constructed";
    STATES["configuring"] = "configuring";
    STATES["initializing"] = "initializing";
    STATES["initialized"] = "initialized";
    STATES["running"] = "running";
    STATES["stopped"] = "stopped";
    STATES["shutdown"] = "shutdown";
})(STATES || (STATES = {}));
class Module extends classes(StatefulMixin) {
    constructor(props = {}) {
        super();
        if (props.config)
            this.validateConfig(props.config);
        if (props.modules)
            this.validateModules(props.modules);
        Object.assign(this, props);
        if (this.config === undefined) {
            this.config = new Config();
        }
        if (this.modules === undefined) {
            this.modules = [];
        }
        this.isResetting = false;
        this.setState(Module.STATES.constructed);
    }
    async initialize(app, injector) {
        var _a;
        if (app == null) {
            throw new AppMissingError();
        }
        if (injector == null) {
            throw new InjectorMissingError();
        }
        this.app = app;
        this.injector = injector;
        if (!this.isInState(Module.STATES.constructed)) {
            return;
        }
        this.setState(Module.STATES.configuring);
        await this.initializeLogger();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initializing`)
            .on(this)
            .in(this.initialize)
            .with('arguments', [app, injector]));
        this.mergeConfigWithApp(this.app);
        if (this.modules !== undefined) {
            await this.initializeModules(this.modules, app, injector);
        }
        await this.runInitializeHooks(injector);
    }
    async start() {
        this.validateState([
            Module.STATES.initialized,
            Module.STATES.stopped,
            Module.STATES.running,
        ]);
        if (this.isInState(Module.STATES.running)) {
            return;
        }
        await this.runLifeCycleAction('start');
        this.setState(Module.STATES.running);
        this.isResetting = false;
    }
    async stop() {
        this.validateState([
            Module.STATES.initialized,
            Module.STATES.stopped,
            Module.STATES.running,
        ]);
        if (this.isInState(Module.STATES.stopped)) {
            return;
        }
        await this.runLifeCycleAction('stop');
        this.setState(Module.STATES.stopped);
    }
    async reset() {
        this.validateState([
            Module.STATES.initialized,
            Module.STATES.stopped,
            Module.STATES.running,
        ]);
        if (!this.isAllowedToResetOnProduction()) {
            throw new InvalidEnvironmentError('reset', getenv.string('NODE_ENV'));
        }
        if (this.isResetting) {
            return;
        }
        this.isResetting = true;
        const restartRequired = this.isInState(Module.STATES.running);
        if (restartRequired) {
            await this.stop();
        }
        await this.runLifeCycleAction('reset');
        if (restartRequired) {
            await this.start();
        }
    }
    async shutdown() {
        var _a;
        this.validateState([
            Module.STATES.constructed,
            Module.STATES.initialized,
            Module.STATES.stopped,
            Module.STATES.running,
            Module.STATES.shutdown,
        ]);
        if (this.isInState(Module.STATES.constructed)) {
            return;
        }
        if (this.isInState(Module.STATES.shutdown)) {
            return;
        }
        if (!this.isInState(Module.STATES.constructed) &&
            !this.isInState(Module.STATES.stopped)) {
            await this.stop();
        }
        await this.runLifeCycleAction('shutdown');
        this.setState(Module.STATES.shutdown);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`shutdown`).on(this).in(this.shutdown));
    }
    async invokeAction(actionName, options = { isLoggable: false }) {
        var _a;
        if (options.isLoggable) {
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`${actionName}`).on(this));
        }
        if (isFunction(this[actionName])) {
            await this[actionName]();
        }
    }
    validateModules(modules) {
        for (const module of modules) {
            if (!instanceOf({ kind: 15, name: "Module", properties: { "config": { kind: 15, name: "Configurable", properties: { "isConfigurable": { kind: 21 }, "has": { kind: 21 }, "get": { kind: 21 }, "getExact": { kind: 21 }, "getDefault": { kind: 21 }, "hasDefault": { kind: 21 }, "set": { kind: 21 }, "assign": { kind: 21 }, "include": { kind: 21 }, "merge": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 } } }, "initialize": { kind: 21 }, "start": { kind: 21 }, "stop": { kind: 21 }, "reset": { kind: 21 }, "shutdown": { kind: 21 }, "invokeAction": { kind: 21 }, "state": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "isInState": { kind: 21 }, "isInOneOfStates": { kind: 21 }, "getState": { kind: 21 }, "setState": { kind: 21 }, "hasState": { kind: 21 }, "validateState": { kind: 21 }, "getSelectableStates": { kind: 21 } } })(module)) {
                const typeName = getTypeName(this.constructor);
                throw new InvalidModuleError(typeName, kernel.describer.describe(module));
            }
        }
    }
    validateConfig(config) {
        if (!instanceOf({ kind: 15, name: "Configurable", properties: { "isConfigurable": { kind: 21 }, "has": { kind: 21 }, "get": { kind: 21 }, "getExact": { kind: 21 }, "getDefault": { kind: 21 }, "hasDefault": { kind: 21 }, "set": { kind: 21 }, "assign": { kind: 21 }, "include": { kind: 21 }, "merge": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 } } })(config)) {
            const typeName = getTypeName(this.constructor);
            throw new InvalidConfigError(typeName, kernel.describer.describe(config));
        }
    }
    async initializeLogger() {
        var _a;
        this.log = await ((_a = this.injector) === null || _a === void 0 ? void 0 : _a.getAsync(BINDINGS.log));
    }
    mergeConfigWithApp(app) {
        var _a;
        if (!this.isAppConfig(app.config)) {
            throw new InvalidAppConfigError(kernel.describer.describe(app.config));
        }
        if (this.config !== undefined) {
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`merging module configuration with application`)
                .on(this)
                .in(this.mergeConfigWithApp));
            app.config.merge(this.config);
        }
        this.config = app.config;
    }
    isAppConfig(config) {
        return config instanceof AppConfig;
    }
    async initializeModules(modules, app, injector) {
        for (const module of modules) {
            await module.initialize(app, injector);
        }
    }
    async runInitializeHooks(injector) {
        await this.runBeforeInitializeHooks();
        await this.runOnInitializeHooks(injector);
        await this.runAfterInitializeHooks();
    }
    async runBeforeInitializeHooks() {
        var _a;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`beforeInitialize`).on(this).in(this.runBeforeInitializeHooks));
        const options = {
            isLoggable: false,
        };
        await this.invokeAction('beforeInitialize', options);
    }
    async runOnInitializeHooks(injector) {
        var _a;
        await this.invokeActionOnDependentModules('runOnInitializeHooks');
        if (!this.isInState(Module.STATES.configuring)) {
            return;
        }
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`onInitialize`).on(this).in(this.runOnInitializeHooks));
        this.setState(Module.STATES.initializing);
        injector.injectIntoAsync(this);
        const options = {
            isLoggable: false,
        };
        await this.invokeAction('onInitialize', options);
    }
    async runAfterInitializeHooks() {
        var _a;
        await this.invokeActionOnDependentModules('runAfterInitializeHooks');
        if (!this.isInState(Module.STATES.initializing)) {
            return;
        }
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`afterInitialize`).on(this).in(this.runAfterInitializeHooks));
        this.setState(Module.STATES.initialized);
        const options = {
            isLoggable: false,
        };
        await this.invokeAction('afterInitialize', options);
    }
    async runLifeCycleAction(actionName) {
        var _a;
        await this.invokeActionOnDependentModules(actionName);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`${actionName}`).on(this));
        await this.invokeAction(`before${capitalize(actionName)}`, {
            isLoggable: true,
        });
        await this.invokeAction(`on${capitalize(actionName)}`, {
            isLoggable: true,
        });
        await this.invokeAction(`after${capitalize(actionName)}`, {
            isLoggable: true,
        });
    }
    async invokeActionOnDependentModules(actionName) {
        if (this.modules === undefined) {
            return;
        }
        const options = {
            isLoggable: false,
        };
        for (const module of this.modules) {
            await module.invokeAction(actionName, options);
        }
    }
    isAllowedToResetOnProduction() {
        return !this.isInProduction();
    }
    isInProduction() {
        return this.isInEnv('production');
    }
    isInDevelopment() {
        return this.isInEnv('dev');
    }
    isInEnv(env) {
        return getenv.string('NODE_ENV') === env;
    }
}
Module.STATES = STATES;

const RFC5424 = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
};
const SPECIFICATIONS = {
    RFC5424,
};

const LOGGING_LEVELS = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
};
const DEFAULTS = {
    LOGGING_LEVELS,
};

let RFC5424LoggingMixin = class RFC5424LoggingMixin {
    emerg(entry, ...args) {
        this.log('emerg', entry, ...args);
    }
    alert(entry, ...args) {
        this.log('alert', entry, ...args);
    }
    crit(entry, ...args) {
        this.log('crit', entry, ...args);
    }
    error(entry, ...args) {
        this.log('error', entry, ...args);
    }
    warning(entry, ...args) {
        this.log('warning', entry, ...args);
    }
    notice(entry, ...args) {
        this.log('notice', entry, ...args);
    }
    info(entry, ...args) {
        this.log('info', entry, ...args);
    }
    debug(entry, ...args) {
        this.log('debug', entry, ...args);
    }
    log(entry, ...args) {
        return entry && args ? undefined : undefined;
    }
};
RFC5424LoggingMixin = __decorate([
    injectable()
], RFC5424LoggingMixin);

var Logger_1;
var STATES$1;
(function (STATES) {
    STATES["constructed"] = "constructed";
    STATES["stopped"] = "stopped";
    STATES["running"] = "running";
})(STATES$1 || (STATES$1 = {}));
let Logger = Logger_1 = class Logger extends classes(StatefulMixin, RFC5424LoggingMixin) {
    constructor(levels = LOGGING_LEVELS) {
        super();
        this.levels = levels;
        this.transports = new Map();
        this.setState(Logger_1.STATES.constructed);
        this.initializeLoggedLevels();
    }
    start() {
        if (this.isInState(Logger_1.STATES.running)) {
            return;
        }
        this.validateState([Logger_1.STATES.constructed, Logger_1.STATES.stopped]);
        this.setState(Logger_1.STATES.running);
    }
    stop() {
        if (this.isInState(Logger_1.STATES.constructed)) {
            return;
        }
        this.setState(Logger_1.STATES.stopped);
    }
    isRunning() {
        return this.isInState(Logger_1.STATES.running);
    }
    isStopped() {
        return !this.isInState(Logger_1.STATES.running);
    }
    getPriority(level) {
        return this.levels[level];
    }
    registerTransport(id, transport, shouldOverride = false) {
        if (typeof id !== 'string') {
            throw new InvalidTransportIdError(kernel.describer.describe(id));
        }
        if (this.hasTransport(id) && !shouldOverride) {
            throw new TransportExistsError(id);
        }
        this.transports.set(id, transport);
    }
    overrideTransport(id, transport) {
        this.registerTransport(id, transport, true);
    }
    getTransport(id) {
        return this.transports.get(id);
    }
    hasTransport(id) {
        return this.transports.has(id);
    }
    removeTransport(id) {
        this.transports.delete(id);
    }
    getTransports() {
        return this.transports;
    }
    log(level, entry, ...args) {
        if (!this.isInState(Logger_1.STATES.running)) {
            return;
        }
        if (typeof entry !== 'string' && (entry === null || entry === void 0 ? void 0 : entry.setLevel) !== undefined) {
            entry.setLevel(level);
        }
        for (const transport of this.getTransports().values()) {
            transport.log(level, entry, ...args);
        }
    }
    initializeLoggedLevels() {
        for (const [level] of Object.entries(this.levels)) {
            if (this[level] !== undefined) {
                continue;
            }
            this[level] = (entry, ...args) => {
                this.log(level, entry, ...args);
            };
        }
    }
};
Logger.STATES = STATES$1;
Logger = Logger_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [Object])
], Logger);

class LogTransport extends RFC5424LoggingMixin {
    constructor(level, config) {
        super();
        this.level = level;
        if (config)
            this.config = config;
    }
    initialize() {
        this.initializeLoggedLevels();
    }
    isLoggable(level) {
        const levelPriority = get(this.logger, `levels.${level}`);
        const transportPriority = get(this.logger, `levels.${this.level}`);
        return levelPriority <= transportPriority;
    }
    log(level, entry, ...args) {
        if (!this.isLoggable(level)) {
            return;
        }
        this.client[level](entry, ...args);
    }
    initializeLoggedLevels() {
        for (const [level] of Object.entries(this.logger.levels)) {
            if (this[level] !== undefined) {
                continue;
            }
            this[level] = (entry, ...args) => {
                this.log(level, entry, ...args);
            };
        }
    }
}
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], LogTransport.prototype, "logger", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogTransport.prototype, "initialize", null);

class ConsoleTransport extends LogTransport {
    constructor(level, config, format) {
        super(level, config);
        if (format)
            this.format = format;
    }
    initialize() {
        if (this.format === undefined)
            this.format = this.resolveFormatter();
        const props = {
            level: this.level,
            levels: this.logger.levels,
            transports: [new this.winston.transports.Console()],
            format: this.format,
        };
        this.client = this.createWinstonLogger(props);
        const logColors = this.config.get(`logColors`);
        if (logColors !== undefined) {
            this.initializeColors(this.config.get(`logColors`));
        }
        super.initialize();
    }
    createWinstonLogger(props) {
        return this.winston.createLogger(props);
    }
    initializeColors(colors) {
        this.winston.addColors(colors);
    }
    resolveFormatter() {
        const { format } = this.winston;
        const formatArgs = [
            format.errors({
                stack: this.config.get('flags.includeStackTrace'),
            }),
        ];
        if (this.config.get('flags.isTimestamped')) {
            formatArgs.push(format.timestamp({
                format: this.config.get('timestampFormat'),
            }));
        }
        if (this.config.get('flags.isColored')) {
            formatArgs.push(format.colorize({
                all: this.config.get('flags.isWholeLineColored'),
            }));
        }
        formatArgs.push(format.printf((log) => {
            return this.formatEntry(log);
        }));
        return format.combine(...formatArgs);
    }
    formatEntry(entry) {
        var _a;
        const isSimple = entry instanceof Log && ((_a = entry === null || entry === void 0 ? void 0 : entry.options) === null || _a === void 0 ? void 0 : _a.isSimple) === true;
        let str;
        if (isSimple) {
            str = this.simpleFormatter.format(entry);
        }
        else {
            str = this.detailedFormatter.format(entry, this.config);
        }
        return str;
    }
}
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], ConsoleTransport.prototype, "logger", void 0);
__decorate([
    inject(BINDINGS.winston),
    __metadata("design:type", Object)
], ConsoleTransport.prototype, "winston", void 0);
__decorate([
    inject(BINDINGS.SimpleLogFormatter),
    __metadata("design:type", Object)
], ConsoleTransport.prototype, "simpleFormatter", void 0);
__decorate([
    inject(BINDINGS.DetailedLogFormatter),
    __metadata("design:type", Object)
], ConsoleTransport.prototype, "detailedFormatter", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsoleTransport.prototype, "initialize", null);

let StringifingConverter = class StringifingConverter {
    convertArguments(entry, options) {
        let inspectOptions = {};
        if (options !== undefined) {
            inspectOptions = this.resolveInspectOptions(entry, options);
        }
        const splatArgs = entry[Symbol.for('splat')] || [];
        const rest = splatArgs
            .map((arg) => this.stringifyValue(arg, inspectOptions, '\n'))
            .join(' ');
        return rest;
    }
    convertMetadata(metadata, entry, options) {
        let inspectOptions = {};
        if (options !== undefined) {
            inspectOptions = this.resolveInspectOptions(entry, options);
        }
        let strItem = '';
        if (metadata.description === 'arguments') {
            const strArgs = this.stringifyMethodParams(entry, metadata, inspectOptions);
            if (strArgs.length > 0) {
                strItem = `\nfunction arguments:\n  ${strArgs}`;
            }
        }
        else if (metadata.description === 'properties') {
            const strProps = this.stringifyClassProps(entry, metadata, inspectOptions);
            if (strProps.length > 0) {
                strItem = `\nclass properties:\n  ${strProps}`;
            }
        }
        else {
            const strValue = this.stringifyValue(metadata.value, inspectOptions);
            if (strValue.length > 0) {
                strItem = `\n${metadata.description}:  ${strValue}`;
            }
        }
        return strItem;
    }
    stringifyValue(value, inspectOptions = {}, prefix = '', suffix = '') {
        const prefixStr = this.isPrimitive(value) ? '' : prefix;
        const suffixStr = this.isPrimitive(value) ? '' : suffix;
        const isInspectable = typeof value !== 'string' || !hasAnsi(value);
        return (prefixStr +
            (isInspectable ? inspect(value, inspectOptions) : value) +
            suffixStr);
    }
    stringifyMethodParams(entry, metadata, inspectOptions = {}) {
        if (entry.method === undefined) {
            return '';
        }
        const argNames = ReflectParams(entry.method);
        const requiredArgNames = metadata.keys instanceof Array ? metadata.keys : argNames;
        const obj = {};
        const argsIndexes = requiredArgNames.map((argName) => {
            return argNames.indexOf(argName);
        });
        for (const index of argsIndexes) {
            if (index === -1 || index >= metadata.value.length)
                continue;
            obj[argNames[index]] = metadata.value[index];
        }
        return this.stringifyObject(obj, inspectOptions);
    }
    stringifyClassProps(entry, metadata, inspectOptions = {}) {
        const allProps = Object.keys(entry.target);
        const requiredProps = metadata.keys instanceof Array
            ? intersection(allProps, metadata.keys)
            : allProps;
        const obj = {};
        for (const propName of requiredProps) {
            obj[propName] = entry.target[propName];
        }
        return this.stringifyObject(obj, inspectOptions);
    }
    stringifyObject(obj, inspectOptions = {}) {
        return inspect(obj, {
            depth: inspectOptions.depth || 0,
            colors: inspectOptions.color || false,
        })
            .replace(/^\{/g, '')
            .replace(/\}$/g, '')
            .replace(/^\s+|\s+$/g, '');
    }
    isPrimitive(arg) {
        return (arg === null || (typeof arg !== 'object' && typeof arg !== 'function'));
    }
    resolveInspectOptions(entry, options) {
        var _a, _b;
        const inspectOptions = {
            depth: entry instanceof Log
                ? (_a = entry.options) === null || _a === void 0 ? void 0 : _a.isColored : options.get('isColored'),
            colors: entry instanceof Log
                ? (_b = entry.options) === null || _b === void 0 ? void 0 : _b.inspectDepth : options.get('inspectDepth'),
        };
        return inspectOptions;
    }
};
StringifingConverter = __decorate([
    injectable()
], StringifingConverter);

let SimpleLogFormatter = class SimpleLogFormatter {
    constructor(converter) {
        this.converter = converter;
    }
    format(entry) {
        const rest = this.converter.convertArguments(entry);
        return `${entry.message} ${rest}`;
    }
};
SimpleLogFormatter = __decorate([
    injectable(),
    __param(0, inject(BINDINGS.LogConverter)),
    __metadata("design:paramtypes", [Object])
], SimpleLogFormatter);

let DetailedLogFormatter = class DetailedLogFormatter {
    constructor(converter, chalk) {
        this.converter = converter;
        this.chalk = chalk;
    }
    format(entry, config) {
        const rest = this.converter.convertArguments(entry, config);
        const colors = this.processPartsColors(config);
        const initial = this.getInitial(config, colors);
        const timestamp = this.getTimestamp(entry, config, colors);
        const label = this.getLabel(config, colors);
        let targetName = '';
        let methodName = '';
        let details = '';
        if (entry.metadata) {
            targetName = this.getTargetName(entry, config, colors);
            if (config.get('flags.showMethod') &&
                entry.methodName !== undefined &&
                entry.methodName.length > 0) {
                methodName = this.getMethodName(entry, config, colors);
            }
            for (const metadata of entry.metadata.values()) {
                details += this.converter.convertMetadata(metadata, entry, config);
            }
        }
        const { message, level } = entry;
        return `${initial}${timestamp}${label}${level}${targetName}${methodName}: ${message} ${rest}${details}`;
    }
    getMethodName(entry, config, colors) {
        const methodNotation = entry.isStaticMethod() ? '.' : '::';
        const methodType = this.chalk.keyword(colors.separator)(methodNotation);
        let entryMethodName = entry.methodName;
        if (config.get('flags.isAbbreviatingSources')) {
            entryMethodName = this.abbreviate(entry.methodName, config);
        }
        return methodType + this.chalk.keyword(colors.method)(entryMethodName);
    }
    getTargetName(entry, config, colors) {
        let entryTypeName = entry.typeName;
        if (config.get('flags.isAbbreviatingSources')) {
            entryTypeName = this.abbreviate(entry.typeName, config);
        }
        return config.get('flags.showTarget')
            ? this.getSeparator(config, colors) +
                this.chalk.keyword(colors.target)(entryTypeName)
            : '';
    }
    getLabel(config, colors) {
        return config.get('flags.isLabeled') &&
            config.get('parts.label') !== undefined &&
            config.get('parts.label').length > 0
            ? this.chalk.keyword(colors.label)(config.get('parts.label')) +
                this.getSeparator(config, colors)
            : '';
    }
    getTimestamp(entry, config, colors) {
        var _a;
        if (((_a = config.flags) === null || _a === void 0 ? void 0 : _a.isTimestamped) === false) {
            return '';
        }
        return entry.timestamp !== undefined
            ? this.chalk.keyword(colors.timestamp)(entry.timestamp) +
                this.getSeparator(config, colors)
            : '';
    }
    getSeparator(config, colors) {
        return this.chalk.keyword(colors.separator)(config.get('parts.separator'));
    }
    getInitial(config, colors) {
        return this.chalk.keyword(colors.initial)(config.get('parts.initial'));
    }
    processPartsColors(config) {
        const partsColors = config.get('partsColors', {});
        const processed = {};
        for (const [part, color] of Object.entries(partsColors)) {
            processed[part] = color.replace(' ', '.');
        }
        return processed;
    }
    abbreviate(str, config) {
        return abbreviate(str, {
            length: config.get('abbreviationLength'),
        });
    }
};
DetailedLogFormatter = __decorate([
    injectable(),
    __param(0, inject(BINDINGS.LogConverter)),
    __param(1, inject(BINDINGS.chalk)),
    __metadata("design:paramtypes", [Object, Object])
], DetailedLogFormatter);

class BaseApp extends Module {
    constructor(props = {}) {
        var _a;
        const defaults = {
            modules: [],
            config: new AppConfig(),
        };
        const processedProps = { ...defaults, ...props };
        if (!(processedProps.config instanceof AppConfig)) {
            throw new InvalidAppConfigError(kernel.describer.describe(processedProps.config));
        }
        super(processedProps);
        this.injector = (_a = processedProps.injector) !== null && _a !== void 0 ? _a : new Injector();
    }
    debug() {
        this.config.assign({
            logging: new LoggingConfig({
                isEnabled: true,
                transports: {
                    console: new LogTransportConfig({
                        level: 'debug',
                        timestampFormat: 'mm:ss',
                        flags: {
                            isLabeled: false,
                            isAbbreviatingSources: true,
                        },
                        abbreviationLength: 15,
                    }),
                },
            }),
        });
    }
    async initialize() {
        var _a;
        if (!this.isInState(BaseApp.STATES.constructed)) {
            return;
        }
        this.setState(BaseApp.STATES.configuring);
        await this.onConfiguration();
        if (this.modules !== undefined) {
            await this.initializeModules(this.modules, this, this.injector);
        }
        await this.runInitializeHooks(this.injector);
        await this.initializeSingletons();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`config:`)
            .on(this)
            .in(this.initialize)
            .with('config', this.config)
            .format({
            inspectDepth: 10,
        }));
    }
    async shutdown() {
        var _a;
        await super.shutdown();
        const consoleTransport = (_a = this.log) === null || _a === void 0 ? void 0 : _a.getTransport(BINDINGS.console);
        if (consoleTransport !== undefined &&
            this.config.get('logging.isEnabled')) {
            this.logExitingMessage(consoleTransport);
        }
    }
    async afterShutdown() {
        var _a;
        if (this.config.get('logging.isEnabled')) {
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.stop();
        }
    }
    configure(props) {
        this.config.assign(props);
    }
    async onConfiguration() {
        var _a;
        this.bindKernelDependencies();
        this.bindAppDependencies();
        if (kernel.injector === undefined) {
            kernel.setInjector(this.injector);
        }
        this.bindExternalDependencies();
        this.bindLoggerDependencies();
        await this.initializeLogger();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initialize`).on(this).in(this.initialize));
    }
    bindKernelDependencies() {
        this.injector
            .bind(BINDINGS.Converter)
            .toConstantValue(kernel.converter);
        this.injector
            .bind(BINDINGS.Validator)
            .toConstantValue(kernel.validator);
        this.injector
            .bind(BINDINGS.Describer)
            .toConstantValue(kernel.describer);
        this.injector
            .bind(BINDINGS.Library)
            .toConstantValue(kernel.library);
    }
    bindAppDependencies() {
        this.injector
            .bind(BINDINGS.Injector)
            .toConstantValue(this.injector);
        this.injector
            .bind(BINDINGS.Config)
            .toConstantValue(this.config);
    }
    bindExternalDependencies() {
        if (!this.injector.isBound(BINDINGS.winston)) {
            this.injector.bind(BINDINGS.winston).toConstantValue(winston);
        }
        if (!this.injector.isBound(BINDINGS.chalk)) {
            this.injector.bind(BINDINGS.chalk).toConstantValue(chalk);
        }
    }
    bindLoggerDependencies() {
        const converter = new StringifingConverter();
        if (!this.injector.isBound(BINDINGS.SimpleLogFormatter)) {
            const simpleFormatter = new SimpleLogFormatter(converter);
            this.injector
                .bind(BINDINGS.SimpleLogFormatter)
                .toConstantValue(simpleFormatter);
        }
        if (!this.injector.isBound(BINDINGS.DetailedLogFormatter)) {
            const detailedFormatter = new DetailedLogFormatter(converter, this.injector.get(BINDINGS.chalk));
            this.injector
                .bind(BINDINGS.DetailedLogFormatter)
                .toConstantValue(detailedFormatter);
        }
    }
    async initializeLogger() {
        let logger;
        if (!this.injector.isBound(BINDINGS.log)) {
            logger = await this.createLogger();
            this.injector.bind(BINDINGS.log).toConstantValue(logger);
        }
        else {
            logger = this.injector.get(BINDINGS.log);
        }
        this.log = logger;
        const transportId = BINDINGS.console;
        if (this.config.get(`logging.transports.${transportId}.isEnabled`) &&
            !this.log.hasTransport(transportId)) {
            const consoleTransport = await this.createConsoleTransport();
            logger.registerTransport(transportId, consoleTransport);
        }
        if (this.config.get('logging.isEnabled')) {
            await this.startLogging();
        }
    }
    async createLogger() {
        const levels = {
            ...RFC5424,
            ...this.config.get('logging.levels'),
        };
        return new Logger(levels);
    }
    async createConsoleTransport() {
        const key = 'logging.transports.console';
        if (!this.config.has(`${key}.parts.label`)) {
            this.config.set(`${key}.parts.label`, this.config.get(`appId`));
        }
        const level = this.config.get(`${key}.level`);
        const consoleOptions = this.config.get(`${key}`);
        const consoleTransport = new ConsoleTransport(level, consoleOptions);
        this.injector.injectInto(consoleTransport);
        return consoleTransport;
    }
    async startLogging() {
        var _a, _b;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.start();
        if ((_b = this.log) === null || _b === void 0 ? void 0 : _b.hasTransport('console')) {
            const consoleTransport = this.log.getTransport(BINDINGS.console);
            this.logStartingMessage(consoleTransport);
        }
    }
    logStartingMessage(consoleTransport) {
        consoleTransport.info(new Log(this.config.get(`logging.transports.console.messages.start`)));
    }
    logExitingMessage(consoleTransport) {
        consoleTransport.info(new Log(this.config.get(`logging.transports.console.messages.exit`)));
    }
    async initializeSingletons() {
        var _a;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initializing singletons`).on(this).in(this.initializeSingletons));
        const serviceIdentifiers = this.injector.findByScope('Singleton');
        for (const serviceIdentifier of serviceIdentifiers) {
            await this.injector.getAsync(serviceIdentifier);
        }
    }
}

let EJSONSerializerAdapter = class EJSONSerializerAdapter {
    constructor(typeKey = TYPE_KEY) {
        this.typeKey = typeKey;
    }
    registerType(typeName, type, shouldOverride = false) {
        if (!isSerializable(type.prototype)) {
            throw new UnregistrableTypeError(typeName);
        }
        const factory = this.createFactory(type);
        factory.type = type;
        if (this.hasType(typeName)) {
            if (shouldOverride) {
                this.ejson.overrideType(typeName, factory);
            }
            else {
                throw new TypeExistsError('EJSON', typeName);
            }
        }
        else {
            this.ejson.addType(typeName, factory);
        }
    }
    createFactory(type) {
        const construct = function (serializer, TypeCtor, json) {
            const propTypes = isFunction(TypeCtor.getPropTypes)
                ? TypeCtor.getPropTypes()
                : {};
            for (const key of Object.keys(propTypes)) {
                if (json[key]) {
                    json[key] = serializer.fromJSONValue(json[key]);
                }
            }
            return new TypeCtor(json);
        };
        return partial(construct, this, type);
    }
    getFactory(typeName) {
        return this.ejson.getType(typeName);
    }
    overrideType(typeName, type) {
        this.registerType(typeName, type, true);
    }
    hasType(typeName) {
        return this.ejson.hasType(typeName);
    }
    getTypes() {
        const factoryTypes = this.ejson.getTypes();
        const mappings = new Map();
        for (const [typeName, factory] of Object.entries(factoryTypes)) {
            mappings.set(typeName, factory.type);
        }
        return mappings;
    }
    getType(typeName) {
        const factory = this.getFactory(typeName);
        return factory !== undefined ? factory.type : undefined;
    }
    getTypeOrThrow(typeName) {
        if (!this.hasType(typeName)) {
            throw new TypeNotFoundError('EJSON', typeName);
        }
        return this.getType(typeName);
    }
    getTypesNames() {
        return Array.from(this.getTypes().keys());
    }
    removeType(typeName) {
        this.ejson.removeType(typeName);
    }
    removeTypes() {
        this.ejson.removeTypes();
    }
    isTypeInstance(typeInstance) {
        return this.ejson.isCustomType(typeInstance);
    }
    getTypeKey() {
        return this.typeKey;
    }
    toJSONValue(value) {
        const propTypes = isFunction(value.getPropTypes)
            ? value.getPropTypes()
            : {};
        if (isEmpty(propTypes)) {
            return JSON.parse(JSON.stringify(value));
        }
        const serialized = {};
        for (const key in propTypes) {
            if (value[key] !== undefined) {
                serialized[key] = this.ejson.toJSONValue(value[key]);
            }
        }
        return serialized;
    }
    fromJSONValue(value) {
        try {
            return this.ejson.fromJSONValue(value);
        }
        catch (e) {
            const regexp = new RegExp('Custom EJSON type ([a-zA-Z0-9-.]+) is not defined');
            const typeName = e.message.match(regexp)[1];
            throw new TypeNotFoundError('EJSON', typeName);
        }
    }
    stringify(value, options) {
        return this.ejson.stringify(value, options);
    }
    parse(str) {
        try {
            return this.ejson.parse(str);
        }
        catch (e) {
            throw new UnparsableValueError(str);
        }
    }
    clone(value) {
        return this.ejson.clone(value);
    }
    equals(a, b, options) {
        return this.ejson.equals(a, b, options);
    }
    toData(serializable) {
        if (!isSerializable(serializable)) {
            throw new UnregistrableTypeError(kernel.describer.describe(serializable));
        }
        const data = {
            [this.getTypeKey()]: serializable.getTypeName(),
        };
        for (const key of Object.keys(serializable.getPropTypes())) {
            if (serializable[key] === undefined)
                continue;
            const value = serializable[key];
            if (Array.isArray(value)) {
                data[key] = value.map((item) => {
                    return instanceOf({ kind: 15, name: "Serializable", properties: { "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } })(item)
                        ? this.toData(item)
                        : item;
                });
            }
            else if (instanceOf({ kind: 15, name: "Serializable", properties: { "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } })(value)) {
                data[key] = this.toData(value);
            }
            else {
                data[key] = value;
            }
        }
        return data;
    }
    fromData(data) {
        const props = {};
        const Type = this.getType(data[this.getTypeKey()]);
        for (const key of Object.keys(Type.getPropTypes())) {
            if (data[key] === undefined)
                continue;
            const value = data[key];
            if (value !== undefined && value[this.getTypeKey()] !== undefined) {
                props[key] = this.fromData(data[key]);
            }
            else if (Array.isArray(value)) {
                props[key] = value.map((item) => {
                    if (item[this.getTypeKey()] !== undefined) {
                        return this.fromData(item);
                    }
                    return item;
                });
            }
            else {
                props[key] = value;
            }
        }
        return new Type(props);
    }
};
__decorate([
    inject(BINDINGS.EJSON),
    __metadata("design:type", Object)
], EJSONSerializerAdapter.prototype, "ejson", void 0);
EJSONSerializerAdapter = __decorate([
    injectable(),
    __metadata("design:paramtypes", [String])
], EJSONSerializerAdapter);

let HandlingMixin = class HandlingMixin {
    constructor() {
        Object.defineProperty(this, HANDLERS, {
            value: new Map(),
            enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
            writable: true,
        });
        Object.defineProperty(this, HANDLEABLE_TYPES, {
            value: [],
            enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
            writable: true,
        });
    }
    setupHandlers(props) {
        const { handlers, registrator, isBoundable, handleableTypes } = {
            isBoundable: false,
            handleableTypes: this.getHandleableTypes(),
            ...props,
        };
        for (const [type, handler] of handlers) {
            if (handleableTypes) {
                this.ensureHandleability(type, handleableTypes);
            }
            let processedHandler = handler;
            if (isBoundable) {
                processedHandler = handler.bind(this);
                processedHandler.original = handler;
            }
            if (registrator) {
                registrator(type, handler);
            }
            else if (this.hasHandler(type)) {
                this.overrideHandler(type, processedHandler);
            }
            else {
                this.registerHandler(type, processedHandler);
            }
        }
    }
    handles() {
        return (Reflect.getOwnMetadata(COMMAND_HANDLERS_CONTAINER_KEY, this.constructor.prototype) || new Map());
    }
    subscribes() {
        return (Reflect.getOwnMetadata(EVENT_HANDLERS_CONTAINER_KEY, this.constructor.prototype) || new Map());
    }
    registerHandler(_messageType, _handler, _shouldOverride = false) {
    }
    overrideHandler(messageType, handler) {
        this.registerHandler(messageType, handler, true);
    }
    hasHandler(messageType) {
        return this[HANDLERS].has(messageType);
    }
    removeHandler(messageType) {
        this[HANDLERS].delete(messageType);
    }
    getHandlers() {
        return this[HANDLERS];
    }
    setHandleableTypes(handleableTypes) {
        const normalizedTypes = Array.isArray(handleableTypes)
            ? handleableTypes
            : [handleableTypes];
        if (this[HANDLEABLE_TYPES] === undefined) {
            Object.defineProperty(this, 'handleableTypes', {
                value: [],
                enumerable: false,
            });
        }
        this[HANDLEABLE_TYPES].push(...normalizedTypes);
    }
    getHandleableTypes() {
        return isEmpty(this[HANDLEABLE_TYPES]) ? [Message] : this[HANDLEABLE_TYPES];
    }
    ensureHandleability(messageType, handleableTypes = this.getHandleableTypes()) {
        if (!this.isHandleabe(messageType, handleableTypes)) {
            throw new UnhandleableTypeError(getTypeName(this.constructor), kernel.describer.describe(handleableTypes), kernel.describer.describe(messageType));
        }
        return true;
    }
    isHandleabe(messageType, handleableTypes = this.getHandleableTypes()) {
        const normalizedHandleableTypes = Array.isArray(handleableTypes)
            ? handleableTypes
            : [handleableTypes];
        let isHandleabe = false;
        for (const handleableType of normalizedHandleableTypes) {
            if (messageType.prototype instanceof handleableType ||
                messageType === handleableType) {
                isHandleabe = true;
            }
        }
        return isHandleabe;
    }
    getHandledTypes() {
        const handledTypes = [];
        for (const type of this[HANDLERS].keys()) {
            handledTypes.push(type);
        }
        return handledTypes;
    }
    getHandled(messageType) {
        const handledTypes = [];
        for (const handledType of this[HANDLERS].keys()) {
            if (kernel.validator.isValid(handledType.prototype, messageType)) {
                handledTypes.push(handledType);
            }
        }
        return handledTypes;
    }
    getHandledMessages() {
        return this.getHandled(Message);
    }
    getHandledCommands() {
        return this.getHandled(Command);
    }
    getHandledEvents() {
        return this.getHandled(Event);
    }
    getHandledTypesNames() {
        const handlers = this.getHandlers();
        const typeNames = [];
        for (const type of handlers.keys()) {
            typeNames.push(type.getTypeName());
        }
        return typeNames;
    }
};
HandlingMixin = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], HandlingMixin);

let OneToOneHandlingMixin = class OneToOneHandlingMixin extends HandlingMixin {
    initialize() {
        this.setupHandlers({
            handlers: this.handles(),
            handleableTypes: [Command],
            isBoundable: true,
        });
        this.setupHandlers({
            handlers: this.subscribes(),
            handleableTypes: [Event],
            isBoundable: true,
        });
    }
    registerHandler(messageType, handler, shouldOverride = false) {
        if (!this.isHandleabe(messageType)) {
            throw new UnhandleableTypeError(getTypeName(this.constructor), kernel.describer.describe(this.getHandleableTypes()), kernel.describer.describe(messageType));
        }
        if (!isFunction(handler)) {
            throw new InvalidHandlerError(getTypeName(this.constructor), messageType.getTypeName(), kernel.describer.describe(handler));
        }
        if (this.hasHandler(messageType) && !shouldOverride) {
            throw new HandlerExistError(getTypeName(this.constructor), messageType.getTypeName());
        }
        this[HANDLERS].set(messageType, handler);
    }
    getHandler(messageType) {
        if (!(messageType.prototype instanceof Message)) {
            throw new InvalidMessageableType(kernel.describer.describe(messageType));
        }
        return this.hasHandler(messageType)
            ? this[HANDLERS].get(messageType)
            : undefined;
    }
    getHandlerOrThrow(messageType) {
        const handler = this.getHandler(messageType);
        if (handler === undefined) {
            throw new HandlerNotFoundError(getTypeName(this.constructor), messageType.getTypeName());
        }
        return handler;
    }
    getTypeByHandler(handlerReference) {
        for (const [messageType, handler] of this[HANDLERS].entries()) {
            const unboundHandler = handler.original;
            if (handlerReference === unboundHandler || handlerReference === handler) {
                return messageType;
            }
        }
        return undefined;
    }
    async handle(message) {
        const handler = this.getHandlerOrThrow(message.constructor);
        const result = await handler(message);
        return result;
    }
};
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OneToOneHandlingMixin.prototype, "initialize", null);
OneToOneHandlingMixin = __decorate([
    injectable()
], OneToOneHandlingMixin);

let CommandBus = class CommandBus extends classes(HookableMixin, OneToOneHandlingMixin) {
    constructor() {
        super();
        this.setHandleableTypes([Command]);
    }
    registerHandler(commandType, handler, shouldOverride = false) {
        super.registerHandler(commandType, handler, shouldOverride);
    }
    onSend(id, hook, shouldOverride = false) {
        this.registerHook('onSend', id, hook, shouldOverride);
    }
    async handle(command) {
        const hooks = this.getHooks('onSend');
        for (const [, hook] of Object.entries(hooks)) {
            await hook(command);
        }
        const result = await super.handle(command);
        return result;
    }
    async send(command) {
        const result = await this.handle(command);
        return result;
    }
};
CommandBus = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], CommandBus);
Object.getPrototypeOf(CommandBus.prototype).constructor = Object;

let OneToManyHandlingMixin = class OneToManyHandlingMixin extends HandlingMixin {
    initialize() {
        this.setupHandlers({
            handlers: this.subscribes(),
            handleableTypes: [Event],
            isBoundable: true,
        });
    }
    registerHandler(messageType, handler, shouldOverride = false) {
        if (!this.isHandleabe(messageType)) {
            throw new UnhandleableTypeError(getTypeName(this.constructor), kernel.describer.describe(this.getHandleableTypes()), kernel.describer.describe(messageType));
        }
        if (!isFunction(handler)) {
            throw new InvalidHandlerError(getTypeName(this.constructor), messageType.getTypeName(), kernel.describer.describe(handler));
        }
        if (!this.hasHandler(messageType) || shouldOverride) {
            this[HANDLERS].set(messageType, [handler]);
        }
        else {
            this[HANDLERS].get(messageType).push(handler);
        }
    }
    getHandler(messageType) {
        if (!(messageType.prototype instanceof Message)) {
            throw new InvalidMessageableType(kernel.describer.describe(messageType));
        }
        return this.hasHandler(messageType)
            ? this[HANDLERS].get(messageType)
            : undefined;
    }
    getHandlerOrThrow(messageType) {
        const handlers = this.getHandler(messageType);
        if (handlers === undefined) {
            throw new HandlerNotFoundError(getTypeName(this.constructor), getTypeName(messageType));
        }
        return handlers;
    }
    getTypeByHandler(handlerReference) {
        for (const [messageType, handlers] of this[HANDLERS].entries()) {
            const unboundHandlers = handlers.map((handler) => {
                return handler.original || handler;
            });
            if (unboundHandlers.includes(handlerReference) ||
                handlers.includes(handlerReference)) {
                return messageType;
            }
        }
        return undefined;
    }
    async handle(message, execution = 'sequential') {
        switch (execution) {
            case 'sequential':
                await this.handleSequential(message);
                break;
            case 'concurrent':
                await this.handleConcurrent(message);
                break;
            default:
                throw new UnsupportedExecutionTypeError(getTypeName(this.constructor), execution);
        }
    }
    async handleSequential(message) {
        const handlers = this.getHandler(message.constructor) || [];
        for (const handler of handlers) {
            await handler(message);
        }
    }
    async handleConcurrent(message) {
        const handlers = this.getHandler(message.constructor) || [];
        const promises = handlers.map((handler) => {
            return handler(message);
        });
        return Promise.all(promises);
    }
};
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OneToManyHandlingMixin.prototype, "initialize", null);
OneToManyHandlingMixin = __decorate([
    injectable()
], OneToManyHandlingMixin);

let EventBus = class EventBus extends classes(HookableMixin, OneToManyHandlingMixin) {
    constructor() {
        super();
        this.setHandleableTypes([Event]);
    }
    registerHandler(eventType, handler, shouldOverride = false) {
        super.registerHandler(eventType, handler, shouldOverride);
    }
    subscribeTo(eventType, handler) {
        this.registerHandler(eventType, handler);
    }
    onPublish(id, hook, shouldOverride = false) {
        this.registerHook('onPublish', id, hook, shouldOverride);
    }
    async handle(event) {
        const hooks = this.getHooks('onPublish');
        for (const [, hook] of Object.entries(hooks)) {
            await hook(event);
        }
        return super.handle(event, 'concurrent');
    }
    async publish(event) {
        const result = await this.handle(event);
        return result;
    }
};
EventBus = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], EventBus);
Object.getPrototypeOf(EventBus.prototype).constructor = Object;

let InfrastructureError = class InfrastructureError extends SerializableError {
};
InfrastructureError = __decorate([
    define('InfrastructureError')({ kind: 19, name: "InfrastructureError", properties: {}, extends: { kind: 18, type: SerializableError, arguments: [] } })
], InfrastructureError);
let CommitConcurrencyError = class CommitConcurrencyError extends InfrastructureError {
    constructor(eventSourceableType, id, expectedVersion, currentVersion) {
        super(`${eventSourceableType}: expected event sourceable with id of '${id}' to be at version ${expectedVersion} but is at version ${currentVersion}`);
    }
};
CommitConcurrencyError = __decorate([
    define('CommitConcurrencyError')({ kind: 19, name: "CommitConcurrencyError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String])
], CommitConcurrencyError);
let EventsNotFoundError = class EventsNotFoundError extends InfrastructureError {
    constructor(EventSourceableTypeName, id) {
        super(`No events found for event sourceable '${EventSourceableTypeName}' with id '${id}'`);
    }
};
EventsNotFoundError = __decorate([
    define('EventsNotFoundError')({ kind: 19, name: "EventsNotFoundError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], EventsNotFoundError);
let AddingCommitFailedError = class AddingCommitFailedError extends InfrastructureError {
    constructor(storageName, commitId, appId) {
        super(`${storageName}: adding commit with id '${commitId}' failed on '${appId}'`);
    }
};
AddingCommitFailedError = __decorate([
    define('AddingCommitFailedError')({ kind: 19, name: "AddingCommitFailedError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], AddingCommitFailedError);
let UpdatingCommitError = class UpdatingCommitError extends InfrastructureError {
    constructor(storageName, commitId, appId) {
        super(`${storageName}: updating commit with id '${commitId}' failed on '${appId}'`);
    }
};
UpdatingCommitError = __decorate([
    define('UpdatingCommitError')({ kind: 19, name: "UpdatingCommitError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], UpdatingCommitError);
let AddingSnapshotError = class AddingSnapshotError extends InfrastructureError {
    constructor(storageName, EventSourceableTypeName, eventSourceableId) {
        super(`${storageName}: adding snapshot for event sourceable '${EventSourceableTypeName}' with id '${eventSourceableId}' failed`);
    }
};
AddingSnapshotError = __decorate([
    define('AddingSnapshotError')({ kind: 19, name: "AddingSnapshotError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], AddingSnapshotError);
let UpdatingSnapshotError = class UpdatingSnapshotError extends InfrastructureError {
    constructor(storageName, EventSourceableTypeName, eventSourceableId) {
        super(`${storageName}: updating snapshot for event sourceable '${EventSourceableTypeName}' with id '${eventSourceableId}' failed`);
    }
};
UpdatingSnapshotError = __decorate([
    define('UpdatingSnapshotError')({ kind: 19, name: "UpdatingSnapshotError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], UpdatingSnapshotError);
let StorageNotFoundError = class StorageNotFoundError extends InfrastructureError {
    constructor(storageName, clientType) {
        super(`${storageName}: storage for client type '${clientType}' was not found`);
    }
};
StorageNotFoundError = __decorate([
    define('StorageNotFoundError')({ kind: 19, name: "StorageNotFoundError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], StorageNotFoundError);
let RouterError = class RouterError extends InfrastructureError {
};
RouterError = __decorate([
    define('RouterError')({ kind: 19, name: "RouterError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } })
], RouterError);
let MissingEventSourceableError = class MissingEventSourceableError extends RouterError {
    constructor(routerName) {
        super(`${routerName}: please specify property Router.prototype.EventSourceableType as EventSourceable class to be managed by the router`);
    }
};
MissingEventSourceableError = __decorate([
    define('MissingEventSourceableError')({ kind: 19, name: "MissingEventSourceableError", properties: {}, extends: { kind: 18, type: RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], MissingEventSourceableError);
let MissingInitializingMessageError = class MissingInitializingMessageError extends RouterError {
    constructor(routerName) {
        super(`${routerName}: please specify property Router.prototype.InitializingMessageType(as command or event class) that will be used to create new instances of the managed EventSourceable`);
    }
};
MissingInitializingMessageError = __decorate([
    define('MissingInitializingMessageError')({ kind: 19, name: "MissingInitializingMessageError", properties: {}, extends: { kind: 18, type: RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], MissingInitializingMessageError);
let CannotRouteMessageError = class CannotRouteMessageError extends RouterError {
    constructor(routerName, messageTypeName) {
        super(`${routerName}: no event sourceable found to handle '${messageTypeName}'`);
    }
};
CannotRouteMessageError = __decorate([
    define('CannotRouteMessageError')({ kind: 19, name: "CannotRouteMessageError", properties: {}, extends: { kind: 18, type: RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], CannotRouteMessageError);
let UnresolvableIdentifierFromMessageError = class UnresolvableIdentifierFromMessageError extends RouterError {
    constructor(routerName, eventTypeName, esTypeName) {
        super(`${routerName}: message '${eventTypeName}' is not a valid initializing or handleable message for '${esTypeName}'`);
    }
};
UnresolvableIdentifierFromMessageError = __decorate([
    define('UnresolvableIdentifierFromMessageError')({ kind: 19, name: "UnresolvableIdentifierFromMessageError", properties: {}, extends: { kind: 18, type: RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], UnresolvableIdentifierFromMessageError);
let SnapshotterError = class SnapshotterError extends InfrastructureError {
};
SnapshotterError = __decorate([
    define('SnapshotterError')({ kind: 19, name: "SnapshotterError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } })
], SnapshotterError);
let UndefinedSnapshotterFrequencyError = class UndefinedSnapshotterFrequencyError extends SnapshotterError {
    constructor() {
        super(`Missing snapshotting frequency on configuration with path: 'eveble.Snapshotter.frequency'`);
    }
};
UndefinedSnapshotterFrequencyError = __decorate([
    define('UndefinedSnapshotterFrequencyError')({ kind: 19, name: "UndefinedSnapshotterFrequencyError", properties: {}, extends: { kind: 18, type: SnapshotterError, arguments: [] } }),
    __metadata("design:paramtypes", [])
], UndefinedSnapshotterFrequencyError);
let UndefinedSnapshotterError = class UndefinedSnapshotterError extends InfrastructureError {
    constructor() {
        super(`Snapshotter is not defined on EventSourceableRepository`);
    }
};
UndefinedSnapshotterError = __decorate([
    define('UndefinedSnapshotterError')({ kind: 19, name: "UndefinedSnapshotterError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [])
], UndefinedSnapshotterError);
let ProjectionRebuildingError = class ProjectionRebuildingError extends InfrastructureError {
};
ProjectionRebuildingError = __decorate([
    define('ProjectionRebuildingError')({ kind: 19, name: "ProjectionRebuildingError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } })
], ProjectionRebuildingError);
let ProjectionAlreadyRebuildingError = class ProjectionAlreadyRebuildingError extends ProjectionRebuildingError {
    constructor(projectionName) {
        super(`Projection '${projectionName}' is already being rebuilt`);
    }
};
ProjectionAlreadyRebuildingError = __decorate([
    define('ProjectionAlreadyRebuildingError')({ kind: 19, name: "ProjectionAlreadyRebuildingError", properties: {}, extends: { kind: 18, type: ProjectionRebuildingError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], ProjectionAlreadyRebuildingError);
let ProjectionNotRebuildingError = class ProjectionNotRebuildingError extends ProjectionRebuildingError {
    constructor(projectionName) {
        super(`Expected projection '${projectionName}' to be in a state of rebuilding`);
    }
};
ProjectionNotRebuildingError = __decorate([
    define('ProjectionNotRebuildingError')({ kind: 19, name: "ProjectionNotRebuildingError", properties: {}, extends: { kind: 18, type: ProjectionRebuildingError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], ProjectionNotRebuildingError);
let ClientError = class ClientError extends InfrastructureError {
};
ClientError = __decorate([
    define('ClientError')({ kind: 19, name: "ClientError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } })
], ClientError);
let InactiveClientError = class InactiveClientError extends ClientError {
    constructor(targetName, clientId) {
        super(`${targetName}: can't be initialized since underlying client with id '${clientId}' is inactive`);
    }
};
InactiveClientError = __decorate([
    define('InactiveClientError')({ kind: 19, name: "InactiveClientError", properties: {}, extends: { kind: 18, type: ClientError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], InactiveClientError);
let SchedulerError = class SchedulerError extends InfrastructureError {
};
SchedulerError = __decorate([
    define('SchedulerError')({ kind: 19, name: "SchedulerError", properties: {}, extends: { kind: 18, type: InfrastructureError, arguments: [] } })
], SchedulerError);
let CommandSchedulingError = class CommandSchedulingError extends SchedulerError {
    constructor(jobName, assignmentId, assignerType, assignerId, error) {
        super(`${jobName}: cannot schedule command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`);
    }
};
CommandSchedulingError = __decorate([
    define('CommandSchedulingError')({ kind: 19, name: "CommandSchedulingError", properties: {}, extends: { kind: 18, type: SchedulerError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String, String])
], CommandSchedulingError);
let CommandUnschedulingError = class CommandUnschedulingError extends SchedulerError {
    constructor(jobName, assignmentId, assignerType, assignerId, error) {
        super(`${jobName}: cannot cancel command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`);
    }
};
CommandUnschedulingError = __decorate([
    define('CommandUnschedulingError')({ kind: 19, name: "CommandUnschedulingError", properties: {}, extends: { kind: 18, type: SchedulerError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String, String])
], CommandUnschedulingError);

class History extends Array {
    constructor(events) {
        super();
        this.push(...events);
    }
    getInitializingMessage() {
        return this[0];
    }
}

let EventSourceableRepository = class EventSourceableRepository {
    async save(eventSourceable) {
        this.log.debug(new Log(`saving '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`)
            .on(this)
            .in(this.save)
            .with('event sourceable', eventSourceable));
        const storageIdentifiers = {};
        try {
            const commit = await this.commitStore.createCommit(eventSourceable);
            const commitId = await this.commitStore.save(commit);
            storageIdentifiers.commitId = commitId;
            eventSourceable.incrementVersion();
            if (this.isSnapshotting()) {
                const snapshotIdOnStorage = await this.makeSnapshotOf(eventSourceable);
                if (snapshotIdOnStorage !== undefined) {
                    storageIdentifiers.snapshotId = snapshotIdOnStorage;
                }
            }
        }
        catch (error) {
            this.log.error(new Log(`failed saving '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' do to error: ${error}`)
                .on(this)
                .in(this.save)
                .with('event sourceable', eventSourceable));
            throw error;
        }
        this.log.debug(new Log(`saved '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`)
            .on(this)
            .in(this.save)
            .with('event sourceable', eventSourceable));
        return storageIdentifiers;
    }
    async find(EventSourceableType, eventSourceableId) {
        let eventSourceable;
        if (this.isSnapshotting()) {
            eventSourceable = await this.restoreFromSnapshot(EventSourceableType, eventSourceableId);
        }
        if (eventSourceable === undefined) {
            eventSourceable = await this.rehydrateFromEventHistory(EventSourceableType, eventSourceableId);
        }
        if (eventSourceable === undefined) {
            this.log.notice(new Log(`'${EventSourceableType.getTypeName()}' not found with id '${eventSourceableId}'`)
                .on(this)
                .in(this.find));
        }
        return eventSourceable;
    }
    async makeSnapshotOf(eventSourceable) {
        if (!this.isSnapshotting()) {
            throw new UndefinedSnapshotterError();
        }
        const snapshotter = this.injector.get(BINDINGS.Snapshotter);
        const snapshotIdOnStorage = await snapshotter.makeSnapshotOf(eventSourceable);
        return snapshotIdOnStorage;
    }
    async getSnapshotOf(EventSourceableType, eventSourceableId) {
        if (!this.isSnapshotting()) {
            throw new UndefinedSnapshotterError();
        }
        const snapshotter = this.injector.get(BINDINGS.Snapshotter);
        return snapshotter.getSnapshotOf(EventSourceableType, eventSourceableId);
    }
    isSnapshotting() {
        return (this.injector.isBound(BINDINGS.Snapshotter) &&
            this.config.get('eveble.Snapshotter.isEnabled'));
    }
    async restoreFromSnapshot(EventSourceableType, eventSourceableId) {
        this.log.debug(new Log(`restoring '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}' from snapshot`)
            .on(this)
            .in(this.restoreFromSnapshot));
        const eventSourceable = await this.getSnapshotOf(EventSourceableType, eventSourceableId);
        if (eventSourceable !== undefined) {
            this.log.debug(new Log(`restored '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}' from snapshot`)
                .on(this)
                .in(this.restoreFromSnapshot)
                .with('event sourceable', eventSourceable));
            const nextVersion = eventSourceable.getVersion() + 1;
            const remainingEvents = await this.commitStore.getEvents(eventSourceableId, nextVersion);
            eventSourceable.initialize();
            if (remainingEvents !== undefined && remainingEvents.length > 0) {
                this.log.debug(new Log(`replaying history on snapshot of '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}'`)
                    .on(this)
                    .in(this.restoreFromSnapshot)
                    .with('event sourceable', eventSourceable)
                    .with('remaining events', remainingEvents));
                const history = new History(remainingEvents);
                eventSourceable.replayHistory(history);
            }
        }
        return eventSourceable;
    }
    async rehydrateFromEventHistory(EventSourceableType, eventSourceableId) {
        this.log.debug(new Log(`fetching event history for '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}'`)
            .on(this)
            .in(this.rehydrateFromEventHistory));
        let eventSourceable;
        const eventHistory = await this.commitStore.getEvents(eventSourceableId);
        if (!Array.isArray(eventHistory)) {
            return eventSourceable;
        }
        if (eventHistory.length > 0) {
            const history = new History(eventHistory);
            eventSourceable = new EventSourceableType(history);
            eventSourceable.initialize();
            eventSourceable.replayHistory(eventHistory);
        }
        else {
            const error = new EventsNotFoundError(EventSourceableType.getTypeName(), eventSourceableId.toString());
            this.log.error(new Log(`no events found for '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}'`)
                .on(this)
                .in(this.rehydrateFromEventHistory));
            throw error;
        }
        this.log.debug(new Log(`re-hydrated '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}' from event history`)
            .on(this)
            .in(this.rehydrateFromEventHistory)
            .with('event history', eventHistory));
        return eventSourceable;
    }
};
__decorate([
    inject(BINDINGS.Injector),
    __metadata("design:type", Object)
], EventSourceableRepository.prototype, "injector", void 0);
__decorate([
    inject(BINDINGS.Config),
    __metadata("design:type", Object)
], EventSourceableRepository.prototype, "config", void 0);
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], EventSourceableRepository.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.CommitStore),
    __metadata("design:type", Object)
], EventSourceableRepository.prototype, "commitStore", void 0);
EventSourceableRepository = __decorate([
    injectable()
], EventSourceableRepository);

var CommitReceiver_1;
let CommitReceiver = CommitReceiver_1 = class CommitReceiver extends classes(Serializable, StatefulMixin) {
    constructor(props = {}) {
        super([props]);
        if (props.state) {
            this.setState(props.state);
        }
    }
    getCurrentTime() {
        return new Date();
    }
    flagAsReceived(workerId) {
        this.setState(CommitReceiver_1.STATES.received);
        this.receivedAt = this.getCurrentTime();
        this.workerId = workerId;
    }
    flagAsPublished(workerId) {
        this.setState(CommitReceiver_1.STATES.published);
        this.publishedAt = this.getCurrentTime();
        this.workerId = workerId;
    }
    flagAsTimeouted(workerId) {
        this.setState(CommitReceiver_1.STATES.timeouted);
        this.failedAt = this.getCurrentTime();
        this.workerId = workerId;
    }
    flagAsFailed(workerId) {
        this.setState(CommitReceiver_1.STATES.failed);
        this.failedAt = this.getCurrentTime();
        this.workerId = workerId;
    }
};
CommitReceiver.STATES = {
    received: 'received',
    published: 'published',
    timeouted: 'timeouted',
    failed: 'failed',
};
CommitReceiver = CommitReceiver_1 = __decorate([
    define$1('CommitReceiver')({ kind: 19, name: "CommitReceiver", properties: { "state": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "appId": { kind: 2 }, "workerId": { kind: 17, types: [{ kind: 12 }, { kind: 2 }] }, "receivedAt": { kind: 18, type: Date, arguments: [] }, "publishedAt": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "failedAt": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] } }, extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], CommitReceiver);
let Commit = class Commit extends Serializable {
    getEventTypeNames() {
        const typeNames = [];
        for (const event of this.events) {
            typeNames.push(event.getTypeName());
        }
        return typeNames;
    }
    getCommandTypeNames() {
        const typeNames = [];
        for (const command of this.commands) {
            typeNames.push(command.getTypeName());
        }
        return typeNames;
    }
    addReceiver(receiver) {
        this.receivers.push(receiver);
    }
    getReceiver(appId) {
        return this.receivers.find((receiver) => {
            return receiver.appId.toString() === appId.toString();
        });
    }
};
Commit = __decorate([
    define$1('Commit')({ kind: 19, name: "Commit", properties: { "id": { kind: 2 }, "sourceId": { kind: 2 }, "version": { kind: 3 }, "eventSourceableType": { kind: 2 }, "commands": { kind: 18, type: Array, arguments: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "getId": { kind: 21 }, "isDeliverable": { kind: 21 }, "isScheduled": { kind: 21 }, "schedule": { kind: 21 }, "getAssignment": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } }] }, "events": { kind: 18, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "version": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } }] }, "insertedAt": { kind: 18, type: Date, arguments: [] }, "sentBy": { kind: 2 }, "receivers": { kind: 18, type: Array, arguments: [{ kind: 18, type: CommitReceiver, arguments: [] }] } }, extends: { kind: 18, type: Serializable, arguments: [] } })
], Commit);

let CommitStore = class CommitStore {
    async createCommit(eventSourceable) {
        const sourceId = eventSourceable.getId();
        const expectedVersion = eventSourceable.getVersion();
        const eventSourceableType = eventSourceable.getTypeName();
        let events = [...eventSourceable.getEvents()];
        const commands = [...eventSourceable.getCommands()];
        this.log.debug(new Log(`creating commit for '${eventSourceableType}@${sourceId}' with expected at version ${expectedVersion}`)
            .on(this)
            .in(this.createCommit)
            .with('event sourceable', eventSourceable));
        let currentVersion;
        const lastVersion = await this.storage.findLastVersionById(sourceId);
        if (lastVersion !== undefined) {
            currentVersion = lastVersion;
        }
        else {
            currentVersion = 0;
        }
        if (currentVersion !== expectedVersion) {
            throw new CommitConcurrencyError(eventSourceableType, sourceId.toString(), expectedVersion.toString(), currentVersion.toString());
        }
        const newVersion = currentVersion + 1;
        events = this.resolveEventsWithNewVersion(events, newVersion);
        const appId = this.config
            .get('appId')
            .toString();
        const workerId = this.config
            .get('workerId')
            .toString();
        const timestamp = new Date();
        const receiver = new CommitReceiver({
            state: CommitReceiver.STATES.received,
            appId,
            workerId,
            receivedAt: timestamp,
        });
        const props = {
            sourceId: sourceId.toString(),
            version: newVersion,
            eventSourceableType,
            commands,
            events,
            insertedAt: timestamp,
            sentBy: appId,
            receivers: [receiver],
        };
        const commitId = await this.generateId();
        if (commitId) {
            props.id = commitId.toString();
        }
        else {
            props.id = new Guid().toString();
        }
        return new Commit(props);
    }
    async generateId() {
        return this.storage.generateId();
    }
    async save(commit) {
        this.log.debug(new Log(`adding commit for '${commit.eventSourceableType}@${commit.sourceId}'`)
            .on(this)
            .in(this.save)
            .with('commit', commit));
        let commitId;
        try {
            commitId = await this.storage.save(commit);
            this.log.debug(new Log(`added commit with id '${commitId}' for '${commit.eventSourceableType}@${commit.sourceId}'`)
                .on(this)
                .in(this.save)
                .with('commit', commit));
        }
        catch (error) {
            this.log.error(new Log(`failed adding commit for '${commit.eventSourceableType}@${commit.sourceId}' do to error: ${error}`)
                .on(this)
                .in(this.save)
                .with('commit', commit));
            throw error;
        }
        await this.publisher.publishChanges(commit);
        return commitId;
    }
    async getEvents(eventSourceableId, versionOffset = 1) {
        const foundCommits = await this.storage.getCommits(eventSourceableId, versionOffset);
        return this.getEventsFromCommits(foundCommits);
    }
    async getAllEvents() {
        const foundCommits = await this.storage.getAllCommits();
        return this.getEventsFromCommits(foundCommits);
    }
    async findById(commitId) {
        return this.storage.findById(commitId);
    }
    getEventsFromCommits(commits = []) {
        const events = [];
        for (const commit of commits) {
            for (const event of commit.events) {
                events.push(event);
            }
        }
        return events;
    }
    resolveEventsWithNewVersion(events, newVersion) {
        const newlyVersionedEvents = [];
        for (const event of events) {
            newlyVersionedEvents.push(new event.constructor({ ...event, version: newVersion }));
        }
        return newlyVersionedEvents;
    }
};
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], CommitStore.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.Config),
    __metadata("design:type", Object)
], CommitStore.prototype, "config", void 0);
__decorate([
    inject(BINDINGS.CommitStorage),
    __metadata("design:type", Object)
], CommitStore.prototype, "storage", void 0);
__decorate([
    inject(BINDINGS.CommitPublisher),
    __metadata("design:type", Object)
], CommitStore.prototype, "publisher", void 0);
CommitStore = __decorate([
    injectable()
], CommitStore);

let CommitPublisher = class CommitPublisher {
    constructor() {
        this.inProgress = new Map();
    }
    async startPublishing() {
        this.log.debug(new Log('starting observing commits').on(this).in(this.startPublishing));
        await this.observer.startObserving(this);
        this.log.debug(new Log('started observing commits').on(this).in(this.startPublishing));
    }
    async stopPublishing() {
        this.log.debug(new Log('stopping observing commits').on(this).in(this.stopPublishing));
        await this.observer.stopObserving();
        this.log.debug(new Log('stopped observing commits').on(this).in(this.stopPublishing));
    }
    async publishChanges(commit) {
        const appId = this.config
            .get('appId')
            .toString();
        const workerId = this.config
            .get('workerId')
            .toString();
        const receiver = commit.getReceiver(appId);
        receiver.flagAsReceived(workerId);
        this.setTimeout(commit);
        try {
            for (const event of commit.events) {
                await this.publishEvent(event);
            }
            for (const command of commit.commands) {
                await this.sendCommand(command);
            }
            if (!receiver.isInState(CommitReceiver.STATES.timeouted)) {
                receiver.flagAsPublished(workerId);
                await this.storage.flagCommitAsPublished(commit.id, appId, workerId, new Date());
                this.log.debug(new Log(`published commit with id '${commit.id}'`)
                    .on(this)
                    .in(this.publishChanges)
                    .with('commit', commit));
            }
        }
        catch (error) {
            receiver.flagAsFailed(workerId);
            await this.storage.flagCommitAsFailed(commit.id, appId, workerId, new Date());
            this.log.error(new Log(`failed publishing commit with id '${commit.id}'`)
                .on(this)
                .in(this.publishChanges)
                .with('commit', commit));
            throw error;
        }
        finally {
            this.clearTimeout(commit.id);
        }
    }
    getHandledEventTypes() {
        return this.eventBus.getHandledTypesNames();
    }
    getHandledCommandTypes() {
        return this.commandBus.getHandledTypesNames();
    }
    canSendCommand(command) {
        const typeName = command.getTypeName();
        return (this.serializer.hasType(typeName) === true &&
            this.commandBus.hasHandler(command.constructor) === true);
    }
    isInProgress(commitId) {
        return this.inProgress.has(commitId);
    }
    async publishEvent(event) {
        this.log.debug(new Log(`publishing '${event.getTypeName()}'`)
            .on(this)
            .in(this.publishEvent)
            .with('event', event));
        await this.eventBus.publish(event);
    }
    async sendCommand(command) {
        if (!this.canSendCommand(command)) {
            return;
        }
        this.log.debug(new Log(`sending '${command.getTypeName()}'`)
            .on(this)
            .in(this.sendCommand)
            .with('command', command));
        await this.commandBus.send(command);
    }
    async setTimeout(commit) {
        const timeout = this.config.get('eveble.commitStore.timeout');
        this.inProgress.set(commit.id.toString(), setTimeout(async () => {
            await this.onTimeout(commit);
        }, timeout));
    }
    async onTimeout(commit) {
        var _a;
        const appId = this.config
            .get('appId')
            .toString();
        const workerId = this.config
            .get('workerId')
            .toString();
        (_a = commit.getReceiver(appId)) === null || _a === void 0 ? void 0 : _a.flagAsTimeouted(workerId);
        const failedCommit = await this.storage.flagAndResolveCommitAsTimeouted(commit.id, appId, workerId, new Date());
        if (failedCommit) {
            this.log.error(new Log(`timeouted commit with id '${commit.id}'`)
                .on(this)
                .in(this.onTimeout)
                .with('failed commit', failedCommit));
        }
        this.cleanupTimeout(commit.id);
    }
    clearTimeout(commitId) {
        clearTimeout(this.inProgress.get(commitId.toString()));
        this.cleanupTimeout(commitId);
    }
    cleanupTimeout(commitId) {
        this.inProgress.delete(commitId.toString());
    }
};
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], CommitPublisher.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.Config),
    __metadata("design:type", Object)
], CommitPublisher.prototype, "config", void 0);
__decorate([
    inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], CommitPublisher.prototype, "commandBus", void 0);
__decorate([
    inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], CommitPublisher.prototype, "eventBus", void 0);
__decorate([
    inject(BINDINGS.Serializer),
    __metadata("design:type", Object)
], CommitPublisher.prototype, "serializer", void 0);
__decorate([
    inject(BINDINGS.CommitStorage),
    __metadata("design:type", Object)
], CommitPublisher.prototype, "storage", void 0);
__decorate([
    inject(BINDINGS.CommitObserver),
    __metadata("design:type", Object)
], CommitPublisher.prototype, "observer", void 0);
CommitPublisher = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], CommitPublisher);

let CommandHandlingMixin = class CommandHandlingMixin extends OneToOneHandlingMixin {
    initialize() {
        this.setupHandlers({
            handlers: this.handles(),
            registrator: this.registerCommandHandler.bind(this),
            handleableTypes: [Command],
        });
    }
    registerCommandHandler(commandType, handler, shouldOverride = false) {
        this.ensureHandleability(commandType, [Command]);
        const boundHandler = handler.bind(this);
        boundHandler.original = handler;
        this.commandBus.registerHandler(commandType, boundHandler, shouldOverride);
        this.registerHandler(commandType, boundHandler, shouldOverride);
    }
    async send(command) {
        const result = await this.commandBus.send(command);
        return result;
    }
};
__decorate([
    inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], CommandHandlingMixin.prototype, "commandBus", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommandHandlingMixin.prototype, "initialize", null);
CommandHandlingMixin = __decorate([
    injectable()
], CommandHandlingMixin);

let EventHandlingMixin = class EventHandlingMixin extends OneToManyHandlingMixin {
    initialize() {
        this.setupHandlers({
            handlers: this.subscribes(),
            registrator: this.registerEventHandler.bind(this),
            handleableTypes: [Event],
        });
    }
    registerEventHandler(eventType, handler, shouldOverride = false) {
        this.ensureHandleability(eventType, [Event]);
        const boundHandler = handler.bind(this);
        boundHandler.original = handler;
        this.eventBus.subscribeTo(eventType, boundHandler, shouldOverride);
        this.registerHandler(eventType, boundHandler, shouldOverride);
    }
    subscribeTo(eventType, handler, shouldOverride) {
        this.registerEventHandler(eventType, handler, shouldOverride);
    }
    getSubscribedEvents() {
        return this.getHandledEvents();
    }
    async on(event) {
        await this.handle(event);
    }
    async publish(event) {
        await this.eventBus.publish(event);
    }
};
__decorate([
    inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], EventHandlingMixin.prototype, "eventBus", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventHandlingMixin.prototype, "initialize", null);
EventHandlingMixin = __decorate([
    injectable()
], EventHandlingMixin);

let Service = class Service extends classes(CommandHandlingMixin, EventHandlingMixin) {
    initialize() {
        super.class(CommandHandlingMixin).initialize();
        super.class(EventHandlingMixin).initialize();
    }
};
__decorate([
    inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], Service.prototype, "commandBus", void 0);
__decorate([
    inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], Service.prototype, "eventBus", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Service.prototype, "initialize", null);
Service = __decorate([
    injectable()
], Service);
Object.getPrototypeOf(Service.prototype).constructor = Object;

let ScheduleCommand = class ScheduleCommand extends Command {
    isDeliverable() {
        const metadata = this.command.getMetadata();
        return new Date().getTime() >= (metadata === null || metadata === void 0 ? void 0 : metadata.scheduling.deliverAt.getTime());
    }
    getDeliveryDate() {
        const metadata = this.command.getMetadata();
        return metadata === null || metadata === void 0 ? void 0 : metadata.scheduling.deliverAt;
    }
    getAssignment() {
        return get(this, 'metadata.scheduling');
    }
};
ScheduleCommand = __decorate([
    define('ScheduleCommand')({ kind: 19, name: "ScheduleCommand", properties: { "command": { kind: 15, name: "Command", properties: { "targetId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "getId": { kind: 21 }, "isDeliverable": { kind: 21 }, "isScheduled": { kind: 21 }, "schedule": { kind: 21 }, "getAssignment": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } } }, extends: { kind: 18, type: Command, arguments: [{ kind: 18, type: ScheduleCommand, arguments: [] }] } })
], ScheduleCommand);

let UnscheduleCommand = class UnscheduleCommand extends Command {
};
UnscheduleCommand = __decorate([
    define('UnscheduleCommand')({ kind: 19, name: "UnscheduleCommand", properties: { "assignmentId": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "commandType": { kind: 2 }, "assignerId": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "assignerType": { kind: 2 } }, extends: { kind: 18, type: Command, arguments: [{ kind: 18, type: UnscheduleCommand, arguments: [] }] } })
], UnscheduleCommand);

let CommandSchedulingService = class CommandSchedulingService extends Service {
    async ScheduleCommand(scheduleCommand) {
        if (scheduleCommand.isDeliverable()) {
            await this.commandBus.send(scheduleCommand.command);
        }
        else {
            await this.scheduler.schedule(scheduleCommand);
        }
    }
    async UnscheduleCommand(unscheduleCommand) {
        await this.scheduler.unschedule(unscheduleCommand);
    }
};
__decorate([
    inject(BINDINGS.CommandScheduler),
    __metadata("design:type", Object)
], CommandSchedulingService.prototype, "scheduler", void 0);
__decorate([
    inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], CommandSchedulingService.prototype, "commandBus", void 0);
__decorate([
    inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], CommandSchedulingService.prototype, "eventBus", void 0);
__decorate([
    __param(0, handle),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ScheduleCommand]),
    __metadata("design:returntype", Promise)
], CommandSchedulingService.prototype, "ScheduleCommand", null);
__decorate([
    __param(0, handle),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UnscheduleCommand]),
    __metadata("design:returntype", Promise)
], CommandSchedulingService.prototype, "UnscheduleCommand", null);
CommandSchedulingService = __decorate([
    injectable()
], CommandSchedulingService);

let Snapshotter = class Snapshotter {
    initialize() {
        if (!this.config.has('eveble.Snapshotter.frequency')) {
            throw new UndefinedSnapshotterFrequencyError();
        }
    }
    async makeSnapshotOf(eventSourceable) {
        const id = eventSourceable.getId();
        const currentVersion = eventSourceable.getVersion();
        const isSnapshottable = currentVersion >= this.getVersionFrequency();
        if (!isSnapshottable) {
            this.logInsufficientPassedVersionsForSnapshot(eventSourceable);
            return undefined;
        }
        this.log.debug(new Log(`snapshotting '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`)
            .on(this)
            .in(this.makeSnapshotOf)
            .with('event sourceable', eventSourceable));
        const EventSourceableType = eventSourceable.constructor;
        const lastSnapshot = await this.storage.findById(EventSourceableType, id);
        let snapshotId;
        if (lastSnapshot === undefined) {
            snapshotId = await this.saveToStorage(eventSourceable);
        }
        else {
            const isUpdatable = lastSnapshot.getVersion() <=
                currentVersion - this.getVersionFrequency();
            if (isUpdatable) {
                snapshotId = await this.updateOnStorage(eventSourceable, lastSnapshot);
            }
            else {
                this.logInsufficientPassedVersionsForSnapshot(eventSourceable, lastSnapshot);
            }
        }
        return snapshotId;
    }
    async getSnapshotOf(EventSourceableType, eventSourceableId) {
        return this.storage.findById(EventSourceableType, eventSourceableId);
    }
    getVersionFrequency() {
        return this.config.get('eveble.Snapshotter.frequency');
    }
    async saveToStorage(eventSourceable) {
        try {
            const snapshotId = await this.storage.save(eventSourceable);
            this.log.debug(new Log(`created new snapshot of '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`)
                .on(this)
                .in(this.saveToStorage)
                .with('event sourceable', eventSourceable));
            return snapshotId;
        }
        catch (error) {
            this.log.error(new Log(`failed creating snapshot of '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' do to error: ${error}`)
                .on(this)
                .in(this.makeSnapshotOf)
                .with('event sourceable', eventSourceable));
            throw error;
        }
    }
    async updateOnStorage(eventSourceable, lastSnapshot) {
        try {
            await this.storage.update(eventSourceable, lastSnapshot);
        }
        catch (error) {
            this.log.error(new Log(`failed to update last found snapshot(${lastSnapshot.getVersion()}) for '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' do to error: ${error}`)
                .on(this)
                .in(this.updateOnStorage)
                .with('event sourceable', eventSourceable)
                .with('updated last snapshot', lastSnapshot)
                .with('error', error));
            throw error;
        }
        this.log.debug(new Log(`updated last found snapshot(${lastSnapshot.getVersion()}) for '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}'`)
            .on(this)
            .in(this.updateOnStorage)
            .with('updated last snapshot', lastSnapshot));
        return lastSnapshot.getId().toString();
    }
    logInsufficientPassedVersionsForSnapshot(eventSourceable, lastSnapshot) {
        let log;
        if (lastSnapshot !== undefined) {
            log = new Log(`not enough version passed(${lastSnapshot.getVersion()}<=${this.getVersionFrequency()}) on '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' to update last snapshot`);
            log.with('last snapshot', lastSnapshot);
            log.with('last snapshot version', lastSnapshot.getVersion());
        }
        else {
            log = new Log(`not enough version passed(${eventSourceable.getVersion()}<=${this.getVersionFrequency()}) on '${eventSourceable.getTypeName()}' with id '${eventSourceable.getId()}' to create new snapshot of event sourceable`);
        }
        log.on(this);
        log.in(this.makeSnapshotOf);
        log.with('current version', eventSourceable.getVersion());
        log.with('snapshot frequency', this.getVersionFrequency());
        this.log.debug(log);
    }
};
__decorate([
    inject(BINDINGS.Config),
    __metadata("design:type", Object)
], Snapshotter.prototype, "config", void 0);
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], Snapshotter.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.SnapshotStorage),
    __metadata("design:type", Object)
], Snapshotter.prototype, "storage", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Snapshotter.prototype, "initialize", null);
Snapshotter = __decorate([
    injectable()
], Snapshotter);

let DomainException = class DomainException extends Event {
};
DomainException = __decorate([
    define('DomainException')({ kind: 19, name: "DomainException", properties: { "thrower": { kind: 2 }, "error": { kind: 18, type: DomainError, arguments: [] } }, extends: { kind: 18, type: Event, arguments: [{ kind: 18, type: DomainException, arguments: [] }] } })
], DomainException);

class Router {
    constructor(EventSourceableType, InitializingMessageType, routedCommands, routedEvents) {
        if (EventSourceableType)
            this.EventSourceableType = EventSourceableType;
        if (InitializingMessageType)
            this.InitializingMessageType = InitializingMessageType;
        this.routedCommands = routedCommands || [];
        this.routedEvents = routedEvents || [];
    }
    initialize() {
        if (this.EventSourceableType === undefined) {
            throw new MissingEventSourceableError(this.constructor.name);
        }
        this.InitializingMessageType = this.resolveInitializingMessage();
        if (this.InitializingMessageType === undefined) {
            throw new MissingInitializingMessageError(this.constructor.name);
        }
        this.log.debug(new Log(`defined initializing message '${this.InitializingMessageType.getTypeName()}'`)
            .on(this)
            .in(this.initialize));
        if (this.routedCommands.length === 0)
            this.routedCommands = this.resolveRoutedCommands();
        this.log.debug(new Log(`defined routed commands`)
            .on(this)
            .in(this.initialize)
            .with('routed commands', this.routedCommands));
        if (this.routedEvents.length === 0)
            this.routedEvents = this.resolveRoutedEvents();
        this.log.debug(new Log(`defined routed events`)
            .on(this)
            .in(this.initialize)
            .with('routed events', this.routedEvents));
        this.setupInitializingMessageHandler(this.initializingMessageHandler);
        this.log.debug(new Log(`set up initializing message handler for '${this.InitializingMessageType.getTypeName()}'`)
            .on(this)
            .in(this.initialize));
        for (const EventType of this.routedEvents) {
            this.setupEventHandlers(EventType);
        }
        for (const CommandType of this.routedCommands) {
            this.setupCommandHandlers(CommandType);
        }
    }
    setupInitializingMessageHandler(handler) {
        const boundHandler = handler.bind(this);
        boundHandler.original = handler;
        const MessageType = this
            .InitializingMessageType;
        if (this.InitializingMessageType.prototype instanceof Event) {
            this.eventBus.subscribeTo(MessageType, boundHandler);
        }
        else if (this.InitializingMessageType.prototype instanceof Command) {
            this.commandBus.registerHandler(MessageType, boundHandler);
        }
        else {
            throw new InvalidInitializingMessageError(this.EventSourceableType.getTypeName(), kernel.describer.describe([Command, Event]), kernel.describer.describe(MessageType));
        }
    }
    async initializingMessageHandler(message) {
        const eventSourceableId = this.getIdForEventSourceableFromMessage(message);
        this.log.debug(new Log(`creating '${this.EventSourceableType.getTypeName()}' with message '${message.getTypeName()}'`)
            .on(this)
            .in(this.initializingMessageHandler)
            .with('message', message));
        const fn = async () => {
            const instance = new this.EventSourceableType(message);
            await this.injector.injectIntoAsync(instance);
            await instance.handle(message);
            instance.validateProps(instance, instance.getPropTypes());
            return instance;
        };
        const handledEventSourceable = await this.handleOrThrowDomainError(fn, message);
        this.log.debug(new Log(`created '${this.EventSourceableType.getTypeName()}' with id '${handledEventSourceable
            .getId()
            .toString()}'`)
            .on(this)
            .in(this.initializingMessageHandler)
            .with('message', message));
        if (handledEventSourceable !== undefined) {
            try {
                await this.saveEventSourceable(handledEventSourceable);
            }
            catch (error) {
                await this.handleSaveErrors(error, message, eventSourceableId);
            }
        }
    }
    getIdForEventSourceableFromMessage(message) {
        if (message instanceof Command) {
            return message.getId();
        }
        const esTypeName = this.EventSourceableType.getTypeName();
        if (message instanceof Event) {
            if (message.hasCorrelationId(esTypeName)) {
                return message.getCorrelationId(esTypeName);
            }
            return undefined;
        }
        throw new UnresolvableIdentifierFromMessageError(this.constructor.name, this.EventSourceableType.getTypeName(), message.getTypeName());
    }
    async handleOrThrowDomainError(fn, message) {
        try {
            return await fn.call(this);
        }
        catch (error) {
            this.log.error(new Log(`failed handling '${message.getTypeName()}' do to error: ${error}`)
                .on(this)
                .in(this.handleOrThrowDomainError)
                .with('message', message));
            if (error instanceof DomainError) {
                const props = {
                    sourceId: message.getId(),
                    thrower: this.EventSourceableType.getTypeName(),
                    error,
                    metadata: {},
                };
                if (message.hasMetadata()) {
                    props.metadata = { ...message.getMetadata() };
                }
                const exception = new DomainException(props);
                await this.eventBus.publish(exception);
            }
            throw error;
        }
    }
    async messageHandler(message) {
        const eventSourceableId = this.getIdForEventSourceableFromMessage(message);
        if (eventSourceableId === undefined) {
            return;
        }
        this.log.debug(new Log(`handling message '${message.getTypeName()}' for '${this.EventSourceableType.name}@${eventSourceableId}'`)
            .on(this)
            .in(this.messageHandler)
            .with('message', message));
        const foundEventSourceable = await this.repository.find(this.EventSourceableType, eventSourceableId);
        if (foundEventSourceable === undefined) {
            this.log.error(new Log(`not found '${this.EventSourceableType.name}' with id '${eventSourceableId}'`)
                .on(this)
                .in(this.messageHandler));
            throw new CannotRouteMessageError(this.constructor.name, message.getTypeName());
        }
        await this.injector.injectIntoAsync(foundEventSourceable);
        const fn = async () => {
            const handledEventSourceable = await foundEventSourceable.handle(message);
            handledEventSourceable.validateProps(handledEventSourceable, handledEventSourceable.getPropTypes());
            return handledEventSourceable;
        };
        const handledEventSourceable = await this.handleOrThrowDomainError(fn, message);
        this.log.debug(new Log(`handled message '${message.getTypeName()}' for '${this.EventSourceableType.name}@${eventSourceableId}'`)
            .on(this)
            .in(this.messageHandler)
            .with('message', message));
        if (handledEventSourceable !== undefined) {
            try {
                await this.saveEventSourceable(handledEventSourceable);
            }
            catch (error) {
                await this.handleSaveErrors(error, message, eventSourceableId);
            }
        }
    }
    async saveEventSourceable(eventSourceable) {
        await this.repository.save(eventSourceable);
    }
    resolveInitializingMessage() {
        return (this.InitializingMessageType ||
            this.EventSourceableType.resolveInitializingMessage());
    }
    resolveRoutedCommands() {
        return this.EventSourceableType.resolveRoutedCommands();
    }
    resolveRoutedEvents() {
        return this.EventSourceableType.resolveRoutedEvents();
    }
    setupCommandHandlers(CommandType) {
        const boundHandler = this.messageHandler.bind(this);
        boundHandler.original = this.messageHandler;
        this.commandBus.registerHandler(CommandType, boundHandler);
    }
    setupEventHandlers(EventType) {
        const boundHandler = this.messageHandler.bind(this);
        boundHandler.original = this.messageHandler;
        this.eventBus.subscribeTo(EventType, boundHandler);
    }
    async handleSaveErrors(error, message, eventSourceableId) {
        if (error instanceof CommitConcurrencyError) {
            this.log.warning(new Log(`concurrency exception, re-handling message '${message.getTypeName()}' for '${this.EventSourceableType.getTypeName()}@${eventSourceableId}'`)
                .on(this)
                .in(this.handleSaveErrors)
                .with('message', message));
            return this.messageHandler(message);
        }
        this.log.error(new Log(`failed saving '${this.EventSourceableType.getTypeName()}@${eventSourceableId}' with '${message.getTypeName()}' do to error: ${error}`)
            .on(this)
            .in(this.handleSaveErrors)
            .with('message', message));
        throw error;
    }
}
__decorate([
    inject(BINDINGS.Injector),
    __metadata("design:type", Object)
], Router.prototype, "injector", void 0);
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], Router.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], Router.prototype, "commandBus", void 0);
__decorate([
    inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], Router.prototype, "eventBus", void 0);
__decorate([
    inject(BINDINGS.EventSourceableRepository),
    __metadata("design:type", Object)
], Router.prototype, "repository", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Router.prototype, "initialize", null);

class AssertionApiAlreadyExistsError extends ExtendableError {
    constructor(asserterName, assertionName, path) {
        super(`${asserterName}: api from assertion '${assertionName}' already exists on path '${path}'`);
    }
}
class Asserter {
    constructor() {
        this.api = new Map();
        this.assertions = [];
    }
    registerAssertion(assertion) {
        for (const [path, method] of assertion.getApi()) {
            this.api.set(path, method);
            if (has(this, path)) {
                throw new AssertionApiAlreadyExistsError(getTypeName(this.constructor), getTypeName(assertion), path);
            }
            if (typeof method === 'function') {
                const boundMethod = method.bind(assertion);
                set(this, path, boundMethod);
            }
            else {
                set(this, path, method);
            }
        }
        this.assertions.push(assertion);
    }
    hasAssertion(assertionCtor) {
        for (const assertion of this.assertions) {
            if (assertion instanceof assertionCtor) {
                return true;
            }
        }
        return false;
    }
    hasApi(pathOrPartial) {
        for (const key of this.api.keys()) {
            if (key.includes(pathOrPartial)) {
                return true;
            }
        }
        return false;
    }
    assert() {
        return this;
    }
    setEntity(entity) {
        this.entity = entity;
    }
    getEntity() {
        return this.entity;
    }
    setAction(action) {
        this.action = action;
    }
    clearAction() {
        this.action = undefined;
    }
    getAction() {
        return this.action;
    }
    hasAction() {
        return this.action !== undefined;
    }
    getAssertions() {
        return this.assertions;
    }
    getApi() {
        return this.api;
    }
}

class Assertion {
    constructor(asserter) {
        this.asserter = asserter;
    }
    getApi() {
        return this.api;
    }
}

let InvalidStateTransitionError = class InvalidStateTransitionError extends AssertionError {
    constructor(entityName, entityId, currentState, expected, action) {
        const message = `${entityName}: cannot '${action}' when in '${currentState}' state(expected states: '${expected}')`;
        const expectedStates = expected.split(', ');
        super({
            message,
            entityName,
            entityId,
            currentState,
            expectedStates,
            action,
        });
    }
};
InvalidStateTransitionError = __decorate([
    define('InvalidStateTransitionError')({ kind: 19, name: "InvalidStateTransitionError", properties: { "entityName": { kind: 2 }, "entityId": { kind: 2 }, "currentState": { kind: 2 }, "expectedStates": { kind: 18, type: Array, arguments: [{ kind: 2 }] }, "action": { kind: 2 } }, extends: { kind: 18, type: AssertionError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String, String])
], InvalidStateTransitionError);
class StatefulAssertion extends Assertion {
    constructor() {
        super(...arguments);
        this.api = new Map([
            ['ensure.is.inState', this.ensureIsInState],
            ['ensure.is.not.inState', this.ensureIsNotInState],
            ['ensure.is.inOneOfStates', this.ensureIsInOneOfStates],
            ['ensure.is.not.inOneOfStates', this.ensureIsNotInOneOfStates],
        ]);
    }
    ensureIsInState(expectedState, error) {
        if (!this.asserter.getEntity().isInState(expectedState)) {
            this.failAssertion(expectedState, 'ensure.is.inState', error);
        }
        return this.asserter;
    }
    ensureIsNotInState(expectedState, error) {
        if (this.asserter.getEntity().isInState(expectedState)) {
            this.failAssertion(expectedState, 'ensure.is.not.inState', error);
        }
        return this.asserter;
    }
    ensureIsInOneOfStates(expectedStates, error) {
        if (!this.asserter.getEntity().isInOneOfStates(expectedStates)) {
            this.failAssertion(expectedStates.join(', '), 'ensure.is.inOneOfStates', error);
        }
        return this.asserter;
    }
    ensureIsNotInOneOfStates(expectedStates, error) {
        if (this.asserter.getEntity().isInOneOfStates(expectedStates)) {
            this.failAssertion(expectedStates.join(', '), 'ensure.is.not.inOneOfStates', error);
        }
        return this.asserter;
    }
    failAssertion(expectedState, api, error) {
        if (error !== undefined) {
            throw error;
        }
        else {
            if (!this.asserter.hasAction()) {
                throw new UndefinedActionError(this.asserter.getEntity().getTypeName(), api);
            }
            let action = this.asserter.getAction();
            if (action.getTypeName !== undefined) {
                action = action.getTypeName();
            }
            throw new InvalidStateTransitionError(this.asserter.getEntity().getTypeName(), this.asserter.getEntity().getId().toString(), this.asserter.getEntity().getState(), expectedState, action.toString());
        }
    }
}

let InvalidStatusTransitionError = class InvalidStatusTransitionError extends AssertionError {
    constructor(entityName, entityId, currentStatus, expected, action) {
        const message = `${entityName}: cannot '${action}' when in '${currentStatus}' status(expected statuses: '${expected}')`;
        const expectedStatuses = expected.split(', ');
        super({
            message,
            entityName,
            entityId,
            currentStatus,
            expectedStatuses,
            action,
        });
    }
};
InvalidStatusTransitionError = __decorate([
    define('InvalidStatusTransitionError')({ kind: 19, name: "InvalidStatusTransitionError", properties: { "entityName": { kind: 2 }, "entityId": { kind: 2 }, "currentStatus": { kind: 2 }, "expectedStatuses": { kind: 18, type: Array, arguments: [{ kind: 2 }] }, "action": { kind: 2 } }, extends: { kind: 18, type: AssertionError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String, String])
], InvalidStatusTransitionError);
class StatusfulAssertion extends Assertion {
    constructor() {
        super(...arguments);
        this.api = new Map([
            ['ensure.is.inStatus', this.ensureIsInStatus],
            ['ensure.is.not.inStatus', this.ensureIsNotInStatus],
            ['ensure.is.inOneOfStatuses', this.ensureIsInOneOfStatuses],
            [
                'ensure.is.not.inOneOfStatuses',
                this.ensureIsNotInOneOfStatuses,
            ],
        ]);
    }
    ensureIsInStatus(expectedStatus, error) {
        if (!this.asserter.getEntity().isInStatus(expectedStatus)) {
            this.failAssertion(expectedStatus, 'ensure.is.inStatus', error);
        }
        return this.asserter;
    }
    ensureIsNotInStatus(expectedStatus, error) {
        if (this.asserter.getEntity().isInStatus(expectedStatus)) {
            this.failAssertion(expectedStatus, 'ensure.is.not.inStatus', error);
        }
        return this.asserter;
    }
    ensureIsInOneOfStatuses(expectedStatuses, error) {
        if (!this.asserter.getEntity().isInOneOfStatuses(expectedStatuses)) {
            this.failAssertion(expectedStatuses.join(', '), 'ensure.is.inOneOfStatuses', error);
        }
        return this.asserter;
    }
    ensureIsNotInOneOfStatuses(expectedStatuses, error) {
        if (this.asserter.getEntity().isInOneOfStatuses(expectedStatuses)) {
            this.failAssertion(expectedStatuses.join(', '), 'ensure.is.not.inOneOfStatuses', error);
        }
        return this.asserter;
    }
    failAssertion(expectedStatus, api, error) {
        if (error !== undefined) {
            throw error;
        }
        else {
            if (!this.asserter.hasAction()) {
                throw new UndefinedActionError(this.asserter.getEntity().getTypeName(), api);
            }
            let action = this.asserter.getAction();
            if (action.getTypeName !== undefined) {
                action = action.getTypeName();
            }
            throw new InvalidStatusTransitionError(this.asserter.getEntity().getTypeName(), this.asserter.getEntity().getId().toString(), this.asserter.getEntity().getStatus(), expectedStatus, action.toString());
        }
    }
}

class AbilityAssertion extends Assertion {
    constructor() {
        super(...arguments);
        this.api = new Map([
            [
                'ensure.is.ableTo',
                new Proxy(this, {
                    get(target, propKey) {
                        const entity = target.asserter.getEntity();
                        if (typeof entity[propKey] === 'function') {
                            const proxifiedMethod = new Proxy(entity[propKey], {
                                apply(_targetMethod, _thisArg, args) {
                                    entity[SAVE_STATE_METHOD_KEY]();
                                    const result = entity[propKey](...args);
                                    entity[ROLLBACK_STATE_METHOD_KEY]();
                                    target.asserter.clearAction();
                                    return result;
                                },
                            });
                            return proxifiedMethod;
                        }
                        return entity[propKey];
                    },
                }),
            ],
            [
                'is.ableTo',
                new Proxy(this, {
                    get(target, propKey) {
                        const entity = target.asserter.getEntity();
                        if (typeof entity[propKey] === 'function') {
                            const proxifiedMethod = new Proxy(entity[propKey], {
                                apply(_targetMethod, _thisArg, args) {
                                    entity[SAVE_STATE_METHOD_KEY]();
                                    let isAble = true;
                                    try {
                                        entity[propKey](...args);
                                    }
                                    catch (e) {
                                        isAble = false;
                                    }
                                    entity[ROLLBACK_STATE_METHOD_KEY]();
                                    return isAble;
                                },
                            });
                            return proxifiedMethod;
                        }
                        return entity[propKey];
                    },
                }),
            ],
        ]);
    }
}

class Eveble extends Module {
    constructor(props = {}) {
        super(props);
    }
    isSnapshotting() {
        return this.config.get('eveble.Snapshotter.isEnabled') === true;
    }
    isCommandScheduling() {
        return this.config.get('eveble.CommandScheduler.isEnabled') === true;
    }
    async onInitialize() {
        await this.initializeTopLevelDependencies();
    }
    async initializeTopLevelDependencies() {
        var _a;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initializing top level dependencies`)
            .on(this)
            .in(this.initializeTopLevelDependencies));
        this.setAsserterOnKernel();
        this.bindSerializer();
        await this.setSerializerOnKernel();
        await this.registerTypesOnSerializer();
        this.bindRouter();
        this.bindInfrastructure();
        this.bindSnapshotter();
        this.bindCommandSchedulingService();
    }
    async afterInitialize() {
        this.commitPublisher = await this.injector.getAsync(BINDINGS.CommitPublisher);
    }
    async beforeStart() {
        if (this.isCommandScheduling()) {
            this.commandScheduler = await this.injector.getAsync(BINDINGS.CommandScheduler);
        }
    }
    async onStart() {
        var _a, _b;
        if (this.isCommandScheduling()) {
            (_a = this.commandScheduler) === null || _a === void 0 ? void 0 : _a.startScheduling();
        }
        await ((_b = this.commitPublisher) === null || _b === void 0 ? void 0 : _b.startPublishing());
    }
    async onStop() {
        var _a, _b;
        await ((_a = this.commitPublisher) === null || _a === void 0 ? void 0 : _a.stopPublishing());
        if (this.isCommandScheduling()) {
            (_b = this.commandScheduler) === null || _b === void 0 ? void 0 : _b.stopScheduling();
        }
    }
    setAsserterOnKernel() {
        var _a;
        const asserter = new Asserter();
        asserter.registerAssertion(new StatefulAssertion(asserter));
        asserter.registerAssertion(new StatusfulAssertion(asserter));
        asserter.registerAssertion(new AbilityAssertion(asserter));
        kernel.setAsserter(asserter);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`set asserter '${asserter.constructor.name}' on Kernel`)
            .on(this)
            .in(this.initializeTopLevelDependencies));
    }
    bindSerializer() {
        var _a, _b;
        if (!this.injector.isBound(BINDINGS.Serializer)) {
            this.injector
                .bind(BINDINGS.EJSON)
                .toConstantValue(this.createEJSON());
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'EJSON' to constant value`)
                .on(this)
                .in(this.initializeTopLevelDependencies));
            this.injector
                .bind(BINDINGS.Serializer)
                .to(EJSONSerializerAdapter);
            (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`bound 'Serializer' to 'EJSONSerializerAdapter' in singleton scope`)
                .on(this)
                .in(this.initializeTopLevelDependencies));
        }
    }
    async setSerializerOnKernel() {
        var _a;
        const serializer = await this.injector.getAsync(BINDINGS.Serializer);
        kernel.setSerializer(serializer);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`set serializer '${serializer.constructor.name}' on Kernel`)
            .on(this)
            .in(this.initializeTopLevelDependencies));
    }
    async registerTypesOnSerializer() {
        var _a, _b;
        const library = await this.injector.getAsync(BINDINGS.Library);
        const serializer = await this.injector.getAsync(BINDINGS.Serializer);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`registering types`).on(serializer));
        for (const [typeName, type] of library.getTypes()) {
            serializer.registerType(typeName, type);
            (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`registered type '${typeName}' on '${serializer.constructor.name}' serializer`)
                .on(this)
                .in(this.initializeTopLevelDependencies));
        }
    }
    bindRouter() {
        var _a;
        if (!this.injector.isBound(BINDINGS.Router)) {
            this.injector
                .bind(BINDINGS.Router)
                .toConstantValue(Router);
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'Router' as constant value`)
                .on(this)
                .in(this.initializeTopLevelDependencies));
        }
    }
    bindInfrastructure() {
        var _a;
        const singletons = {
            CommitPublisher,
            CommitStore,
            CommandBus,
            EventBus,
            EventSourceableRepository,
        };
        for (const [id, component] of Object.entries(singletons)) {
            if (!this.injector.isBound(BINDINGS[id])) {
                this.injector.bind(BINDINGS[id]).to(component).inSingletonScope();
                (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound '${id}' in singleton scope`)
                    .on(this)
                    .in(this.initializeTopLevelDependencies));
            }
        }
    }
    bindSnapshotter() {
        var _a, _b, _c;
        if (this.isSnapshotting() && !this.injector.isBound(BINDINGS.Snapshotter)) {
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`enabling snapshotting`).on(this).in(this.bindSnapshotter));
            this.injector
                .bind(BINDINGS.Snapshotter)
                .to(Snapshotter)
                .inSingletonScope();
            (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`bound 'Snapshotter' in singleton scope`)
                .on(this)
                .in(this.initializeTopLevelDependencies));
            (_c = this.log) === null || _c === void 0 ? void 0 : _c.debug(new Log(`enabled snapshotting`).on(this).in(this.bindSnapshotter));
        }
    }
    bindCommandSchedulingService() {
        var _a;
        if (this.isCommandScheduling() &&
            this.injector.isBound(BINDINGS.CommandScheduler) &&
            !this.injector.isBound(BINDINGS.CommandSchedulingService)) {
            const service = new CommandSchedulingService();
            this.injector.injectInto(service);
            this.injector
                .bind(BINDINGS.CommandSchedulingService)
                .toConstantValue(service);
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'CommandSchedulingService' as constant value`)
                .on(this)
                .in(this.initializeTopLevelDependencies));
        }
    }
    createEJSON() {
        return createEJSON();
    }
}

class Client extends StatefulMixin {
    constructor(props = {}) {
        super();
        Object.assign(this, props);
        this.setState(Client.STATES.constructed);
    }
    getId() {
        return this.id;
    }
}
Client.STATES = {
    constructed: 'constructed',
    initialized: 'initialized',
    connected: 'connected',
    paused: 'paused',
    stopped: 'stopped',
    disconnected: 'disconnected',
    failed: 'failed',
};

let MongoDBCollectionConfig = class MongoDBCollectionConfig extends Config {
    constructor(props) {
        super();
        Object.assign(this, this.processProps(props));
    }
};
MongoDBCollectionConfig = __decorate([
    define()({ kind: 19, name: "MongoDBCollectionConfig", properties: { "name": { kind: 2 }, "indexes": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Array, arguments: [{ kind: 1 }] }] } }, extends: { kind: 18, type: Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], MongoDBCollectionConfig);
let MongoDBDatabaseConfig = class MongoDBDatabaseConfig extends Config {
    constructor(props) {
        super();
        Object.assign(this, this.processProps(props));
    }
};
MongoDBDatabaseConfig = __decorate([
    define()({ kind: 19, name: "MongoDBDatabaseConfig", properties: { "name": { kind: 2 }, "collections": { kind: 18, type: Array, arguments: [{ kind: 18, type: MongoDBCollectionConfig, arguments: [] }] } }, extends: { kind: 18, type: Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], MongoDBDatabaseConfig);
class MongoDBClient extends Client {
    constructor(props) {
        const processedProps = {
            databases: [],
            ...props,
        };
        processedProps.options = {
            ...MongoDBClient.defaultOptions,
            ...(props.options || {}),
        };
        super(processedProps);
    }
    async initialize() {
        this.log.debug(new Log(`initializing client '${this.getId()}'`)
            .on(this)
            .in(this.initialize)
            .with('url', this.url)
            .with('options', this.options));
        try {
            this._library = new this.MongoDB(this.url, this.options);
            this.setState(Client.STATES.initialized);
            this.log.debug(new Log(`successfully initialized client '${this.getId()}'`)
                .on(this)
                .in(this.initialize)
                .with('url', this.url)
                .with('options', this.options));
        }
        catch (error) {
            this.setState(Client.STATES.failed);
            this.log.error(new Log(`failed to initialize client '${this.getId()}' do to error: ${error}`)
                .on(this)
                .in(this.initialize)
                .with('url', this.url)
                .with('options', this.options));
            throw error;
        }
    }
    get library() {
        this.validateState([
            MongoDBClient.STATES.initialized,
            MongoDBClient.STATES.connected,
            MongoDBClient.STATES.paused,
            MongoDBClient.STATES.stopped,
            MongoDBClient.STATES.disconnected,
        ]);
        return this._library;
    }
    async connect() {
        var _a;
        this.validateState([
            Client.STATES.initialized,
            Client.STATES.connected,
            Client.STATES.stopped,
        ]);
        if (this.isConnected()) {
            return;
        }
        this.log.debug(new Log(`connecting client '${this.getId()}'`).on(this).in(this.connect));
        try {
            await ((_a = this._library) === null || _a === void 0 ? void 0 : _a.connect());
            this.setState(Client.STATES.connected);
            if (!isEmpty(this.databases)) {
                await this.initializeDatabases(this.databases);
            }
            this.log.debug(new Log(`connected client '${this.getId()}'`).on(this).in(this.connect));
        }
        catch (error) {
            this.setState(Client.STATES.failed);
            this.log.error(new Log(`failed connection on client '${this.getId()}' do to error: ${error}`)
                .on(this)
                .in(this.connect));
            throw error;
        }
    }
    async disconnect() {
        var _a;
        if (!this.isInState(Client.STATES.stopped)) {
            if (!this.isConnected()) {
                return;
            }
        }
        this.log.debug(new Log(`disconnecting client '${this.getId()}'`)
            .on(this)
            .in(this.disconnect));
        await ((_a = this._library) === null || _a === void 0 ? void 0 : _a.close());
        this.setState(Client.STATES.disconnected);
        delete this._library;
        this.log.debug(new Log(`disconnected client '${this.getId()}'`)
            .on(this)
            .in(this.disconnect));
    }
    async reconnect() {
        this.log.debug(new Log(`reconnecting client '${this.getId()}'`)
            .on(this)
            .in(this.reconnect));
        if (!this.isConnected()) {
            await this.initialize();
            await this.connect();
        }
    }
    isConnected() {
        var _a;
        return (this._library !== undefined &&
            this.isInState(Client.STATES.connected) && ((_a = this._library) === null || _a === void 0 ? void 0 : _a.isConnected()));
    }
    getDatabase(name) {
        var _a;
        this.validateState([
            Client.STATES.initialized,
            Client.STATES.connected,
            Client.STATES.stopped,
        ]);
        return (_a = this._library) === null || _a === void 0 ? void 0 : _a.db(name);
    }
    getCollection(databaseName, collectionName) {
        return this.getDatabase(databaseName).collection(collectionName);
    }
    async initializeDatabases(databases) {
        for (const dbDefinition of databases) {
            const { name, collections } = dbDefinition;
            const db = this.getDatabase(name);
            await this.initializeCollections(db, collections);
        }
    }
    async initializeCollections(db, collections) {
        for (const collDefinition of collections) {
            const { name, indexes } = collDefinition;
            const collection = db.collection(name);
            if (indexes !== undefined) {
                for (const indexDefinition of indexes) {
                    await collection.createIndex.apply(collection, indexDefinition);
                }
            }
        }
    }
}
MongoDBClient.defaultOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], MongoDBClient.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.MongoDB.library),
    __metadata("design:type", Object)
], MongoDBClient.prototype, "MongoDB", void 0);

class AgendaClient extends Client {
    async initialize() {
        this.log.debug(new Log(`initializing client '${this.getId()}'`)
            .on(this)
            .in(this.initialize)
            .with('url', this.mongoClient.url)
            .with('options', this.options)
            .with('collectionName', this.collectionName));
        try {
            const database = this.mongoClient.getDatabase(this.databaseName);
            this._library = new this.Agenda({
                mongo: database,
                collection: this.collectionName,
                ...this.options,
            });
            await this.initializeEventHandlers();
            this.log.debug(new Log(`successfully initialized client '${this.getId()}'`)
                .on(this)
                .in(this.initialize)
                .with('url', this.mongoClient.url)
                .with('options', this.options)
                .with('collectionName', this.collectionName));
            this.setState(AgendaClient.STATES.initialized);
            this.setState('initialized');
        }
        catch (error) {
            this.setState(AgendaClient.STATES.failed);
            this.log.error(new Log(`failed to initialize client '${this.getId()}' do to error: ${error}`)
                .on(this)
                .in(this.initialize)
                .with('url', this.mongoClient.url)
                .with('options', this.options)
                .with('collectionName', this.collectionName));
            throw error;
        }
    }
    get library() {
        this.validateState([
            AgendaClient.STATES.initialized,
            AgendaClient.STATES.connected,
            AgendaClient.STATES.paused,
            AgendaClient.STATES.stopped,
            AgendaClient.STATES.disconnected,
        ]);
        return this._library;
    }
    async connect() {
        this.validateState([
            AgendaClient.STATES.initialized,
            AgendaClient.STATES.connected,
            AgendaClient.STATES.stopped,
        ]);
        if (this.isConnected()) {
            return;
        }
        this.log.debug(new Log(`connecting client '${this.getId()}'`).on(this).in(this.connect));
        try {
            await this.library.start();
            this.setState(AgendaClient.STATES.connected);
            this.log.debug(new Log(`connected client '${this.getId()}'`).on(this).in(this.connect));
        }
        catch (error) {
            this.setState(AgendaClient.STATES.failed);
            this.log.error(new Log(`failed connection on client '${this.getId()}' do to error: ${error}`)
                .on(this)
                .in(this.connect));
            throw error;
        }
    }
    async stop() {
        if (!this.isConnected()) {
            return;
        }
        this.log.debug(new Log(`stopping client '${this.getId()}'`).on(this).in(this.stop));
        await this.library.stop();
        this.setState(AgendaClient.STATES.stopped);
        this.log.debug(new Log(`stopped client '${this.getId()}'`).on(this).in(this.stop));
    }
    async disconnect() {
        if (!this.isInState(AgendaClient.STATES.stopped)) {
            if (!this.isConnected()) {
                return;
            }
        }
        this.log.debug(new Log(`disconnecting client '${this.getId()}'`)
            .on(this)
            .in(this.disconnect));
        await this.stop();
        this.setState(AgendaClient.STATES.disconnected);
        delete this._library;
        this.log.debug(new Log(`disconnected client '${this.getId()}'`)
            .on(this)
            .in(this.disconnect));
    }
    async reconnect() {
        this.log.debug(new Log(`reconnecting client '${this.getId()}'`)
            .on(this)
            .in(this.reconnect));
        this.setState(AgendaClient.STATES.paused);
        if (!this.isConnected()) {
            await this.initialize();
            await this.connect();
        }
    }
    isConnected() {
        return (this._library !== undefined &&
            this.isInState(AgendaClient.STATES.connected) &&
            this.mongoClient.isConnected());
    }
    getInterval() {
        var _a, _b, _c, _d;
        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.processEvery) === undefined)
            return undefined;
        return typeof ((_b = this.options) === null || _b === void 0 ? void 0 : _b.processEvery) === 'number'
            ? (_c = this.options) === null || _c === void 0 ? void 0 : _c.processEvery : parseFloat((_d = this.options) === null || _d === void 0 ? void 0 : _d.processEvery);
    }
    async initializeEventHandlers() {
        var _a, _b, _c, _d, _e;
        (_a = this._library) === null || _a === void 0 ? void 0 : _a.on('ready', async () => {
            this.log.debug(new Log(`activated client '${this.getId()}'`)
                .on(this)
                .in(this.initializeEventHandlers));
        });
        (_b = this._library) === null || _b === void 0 ? void 0 : _b.on('start', async (job) => {
            this.log.debug(new Log(`started job '${job.attrs.name}'`)
                .on(this)
                .in(this.initializeEventHandlers));
        });
        (_c = this._library) === null || _c === void 0 ? void 0 : _c.on('complete', async (job) => {
            this.log.debug(new Log(`completed job '${job.attrs.name}'`)
                .on(this)
                .in(this.initializeEventHandlers));
        });
        (_d = this._library) === null || _d === void 0 ? void 0 : _d.on('success', async (job) => {
            this.log.debug(new Log(`successful job '${job.attrs.name}'`)
                .on(this)
                .in(this.initializeEventHandlers));
        });
        (_e = this._library) === null || _e === void 0 ? void 0 : _e.on('fail', async (error, job) => {
            this.log.error(new Log(`failed job '${job.attrs.name}' do to error: ${error}`)
                .on(this)
                .in(this.initializeEventHandlers));
        });
    }
}
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], AgendaClient.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.Agenda.library),
    __metadata("design:type", Object)
], AgendaClient.prototype, "Agenda", void 0);
__decorate([
    inject(BINDINGS.MongoDB.clients.CommandScheduler),
    __metadata("design:type", MongoDBClient)
], AgendaClient.prototype, "mongoClient", void 0);

var AgendaCommandScheduler_1;
let AgendaCommandScheduler = AgendaCommandScheduler_1 = class AgendaCommandScheduler extends StatefulMixin {
    constructor(jobName = 'send scheduled command', options = {}) {
        super();
        this.jobName = jobName;
        this.options = options;
        this.setState(AgendaCommandScheduler_1.STATES.constructed);
    }
    async startScheduling() {
        if (this.isInState(AgendaCommandScheduler_1.STATES.active)) {
            return;
        }
        await this.initialize();
        this.setState(AgendaCommandScheduler_1.STATES.active);
    }
    async stopScheduling() {
        if (this.isInState(AgendaCommandScheduler_1.STATES.stopped)) {
            return;
        }
        this.setState(AgendaCommandScheduler_1.STATES.stopped);
    }
    async initialize() {
        if (!this.agendaClient.isConnected()) {
            const error = new InactiveClientError(this.constructor.name, this.agendaClient.getId().toString());
            this.log.error(new Log('inactive Agenda client').on(this).in(this.initialize));
            throw error;
        }
        await this.defineJob(this.jobName, this.options, this.handleScheduledCommand);
        this.log.debug(new Log(`defined new Agenda job '${this.jobName}' for client with id '${this.agendaClient.getId()}'`)
            .on(this)
            .in(this.initialize));
        this.setState(AgendaCommandScheduler_1.STATES.initialized);
    }
    async schedule(scheduleCommand) {
        const serializedData = this.serializeScheduleCommandToData(scheduleCommand);
        const { command } = scheduleCommand;
        const assignment = command.getAssignment();
        const assignmentId = assignment.assignmentId;
        this.log.debug(new Log(`scheduling command '${assignmentId}'`)
            .on(this)
            .in(this.schedule)
            .with('scheduled command', scheduleCommand));
        try {
            const when = scheduleCommand.getDeliveryDate();
            await this.agendaClient.library.schedule(when, this.jobName, serializedData);
            this.log.debug(new Log(`scheduled command '${assignmentId}'`)
                .on(this)
                .in(this.schedule)
                .with('scheduled command', scheduleCommand));
        }
        catch (error) {
            this.log.error(new Log(`failed scheduling command '${assignmentId}' do to error: ${error}`)
                .on(this)
                .in(this.schedule)
                .with('scheduled command', scheduleCommand));
            throw new CommandSchedulingError(this.jobName, assignmentId.toString(), assignment.assignerType, assignment.assignerId.toString(), error);
        }
    }
    async unschedule(unscheduleCommand) {
        const { assignmentId, commandType, assignerId, assignerType, } = unscheduleCommand;
        const mongoQuery = {
            'data.commandType': commandType,
            'data.assignerId': assignerId.toString(),
            'data.assignerType': assignerType,
            'data.id': assignmentId.toString(),
        };
        this.log.debug(new Log(`unscheduling command '${assignmentId}'`)
            .on(this)
            .in(this.unschedule)
            .with('unschedule command', unscheduleCommand));
        try {
            const removedCount = await this.agendaClient.library.cancel(mongoQuery);
            const isSuccessful = removedCount > 0;
            if (isSuccessful) {
                this.log.debug(new Log(`unscheduled command '${assignmentId}'`)
                    .on(this)
                    .in(this.unschedule)
                    .with('unschedule command', unscheduleCommand));
            }
            return isSuccessful;
        }
        catch (error) {
            this.log.error(new Log(`failed unscheduling command '${assignmentId}' do to error: ${error}`)
                .on(this)
                .in(this.unschedule)
                .with('unschedule command', unscheduleCommand));
            throw new CommandUnschedulingError(this.jobName, assignmentId.toString(), assignerType, assignerId.toString(), error);
        }
    }
    async unscheduleAll() {
        const mongoQuery = { name: this.jobName };
        try {
            await this.collection.deleteMany(mongoQuery);
            this.log.debug(new Log(`successfully unscheduled all jobs from '${this.jobName}'`)
                .on(this)
                .in(this.unscheduleAll));
        }
        catch (error) {
            this.log.error(new Log(`failed unscheduling all jobs from '${this.jobName}' do to error: ${error}`)
                .on(this)
                .in(this.unscheduleAll));
            throw error;
        }
    }
    async getJob(commandType, assignerId, assignerType, assignmentId) {
        const mongoQuery = {
            'data.commandType': commandType,
            'data.assignerId': assignerId.toString(),
            'data.assignerType': assignerType,
        };
        if (assignmentId) {
            mongoQuery['data.id'] = assignmentId.toString();
        }
        const mongoSort = { data: -1 };
        const mongoLimit = 1;
        const jobs = await this.agendaClient.library.jobs(mongoQuery, mongoSort, mongoLimit);
        if (isEmpty(jobs)) {
            return undefined;
        }
        return this.jobTransformer.transform(jobs[0]);
    }
    async handleScheduledCommand(job) {
        const serializedData = job.attrs.data;
        const command = this.serializer.parse(serializedData.command);
        this.log.debug(new Log(`handling scheduled command '${serializedData.id}'`)
            .on(this)
            .in(this.handleScheduledCommand)
            .with('command', command));
        try {
            await this.commandBus.send(command);
            this.log.debug(new Log(`handled scheduled command '${serializedData.id}'`)
                .on(this)
                .in(this.handleScheduledCommand)
                .with('command', command));
        }
        catch (error) {
            job.fail(error);
            await job.save();
            this.log.error(new Log(`failed handling of scheduled command '${serializedData.id}' do to error: ${error}`)
                .on(this)
                .in(this.handleScheduledCommand)
                .with('command', command));
        }
    }
    getInterval() {
        return this.agendaClient.getInterval() || 1;
    }
    async defineJob(jobName, options = {}, handler) {
        const boundHandler = handler.bind(this);
        boundHandler.original = handler;
        this.agendaClient.library.define(jobName, options, boundHandler);
    }
    serializeScheduleCommandToData(scheduleCommand) {
        const { command } = scheduleCommand;
        const assignment = command.getAssignment();
        const data = {
            commandType: command.getTypeName(),
            command: this.serializer.stringify(command),
            assignerId: assignment.assignerId.toString(),
            assignerType: assignment.assignerType,
            id: assignment.assignmentId.toString(),
        };
        return data;
    }
};
AgendaCommandScheduler.STATES = {
    constructed: 'constructed',
    initialized: 'initialized',
    active: 'active',
    stopped: 'stopped',
};
__decorate([
    inject(BINDINGS.Agenda.clients.CommandScheduler),
    __metadata("design:type", AgendaClient)
], AgendaCommandScheduler.prototype, "agendaClient", void 0);
__decorate([
    inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], AgendaCommandScheduler.prototype, "commandBus", void 0);
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], AgendaCommandScheduler.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.Serializer),
    __metadata("design:type", Object)
], AgendaCommandScheduler.prototype, "serializer", void 0);
__decorate([
    inject(BINDINGS.MongoDB.collections.ScheduledCommands),
    __metadata("design:type", Object)
], AgendaCommandScheduler.prototype, "collection", void 0);
__decorate([
    inject(BINDINGS.Agenda.jobTransformer),
    __metadata("design:type", Object)
], AgendaCommandScheduler.prototype, "jobTransformer", void 0);
AgendaCommandScheduler = AgendaCommandScheduler_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [Object, Object])
], AgendaCommandScheduler);

let ScheduledJob = class ScheduledJob extends classes(Struct, StatefulMixin) {
    constructor(props = {}) {
        super([props]);
        if (props.state) {
            this.setState(props.state);
        }
    }
};
ScheduledJob.STATES = {
    enqueued: 'enqueued',
    started: 'started',
    locked: 'locked',
    failed: 'failed',
    completed: 'completed',
    removed: 'removed',
};
ScheduledJob = __decorate([
    define()({ kind: 19, name: "ScheduledJob", properties: { "id": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "state": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "name": { kind: 2 }, "data": { kind: 15, name: "__type", properties: {} }, "priority": { kind: 17, types: [{ kind: 3 }, { kind: 5, value: "lowest" }, { kind: 5, value: "low" }, { kind: 5, value: "normal" }, { kind: 5, value: "high" }, { kind: 5, value: "highest" }] }, "nextRunAt": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "completedAt": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "lockedAt": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "lastRunAt": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "failedAt": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] } }, extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], ScheduledJob);

let AgendaScheduledJobTransformer = class AgendaScheduledJobTransformer {
    transform(job) {
        const props = this.pickProps(job);
        props.state = this.determineState(job);
        return new ScheduledJob(props);
    }
    pickProps(job) {
        const { attrs } = job;
        const props = pick(attrs, Object.keys(ScheduledJob.getPropTypes()));
        Object.keys(props).forEach((key) => props[key] === null && delete props[key]);
        if (attrs.lastFinishedAt !== undefined) {
            props.completedAt = attrs.lastFinishedAt;
        }
        props.id = attrs._id.toString();
        return props;
    }
    determineState(job) {
        const { attrs } = job;
        if (attrs.failedAt instanceof Date) {
            return ScheduledJob.STATES.failed;
        }
        if (attrs.lastFinishedAt instanceof Date) {
            return ScheduledJob.STATES.completed;
        }
        if (attrs.lockedAt instanceof Date) {
            return ScheduledJob.STATES.locked;
        }
        if (attrs.nextRunAt instanceof Date) {
            return ScheduledJob.STATES.enqueued;
        }
        return undefined;
    }
};
AgendaScheduledJobTransformer = __decorate([
    injectable()
], AgendaScheduledJobTransformer);

class AgendaCommandSchedulerModule extends Module {
    async beforeInitialize() {
        await this.initializeTopLevelDependencies();
        await this.initializeMongoDBClientForCommandScheduler();
        await this.initializeAgendaClientForCommandScheduler();
    }
    async onInitialize() {
        await this.initializeCommandScheduler();
    }
    async onStart() {
        var _a;
        await ((_a = this.agendaClient) === null || _a === void 0 ? void 0 : _a.connect());
    }
    async onStop() {
        var _a;
        await ((_a = this.agendaClient) === null || _a === void 0 ? void 0 : _a.stop());
    }
    async onShutdown() {
        var _a, _b;
        await ((_a = this.agendaClient) === null || _a === void 0 ? void 0 : _a.disconnect());
        await ((_b = this.mongoClient) === null || _b === void 0 ? void 0 : _b.disconnect());
    }
    async initializeTopLevelDependencies() {
        var _a;
        this.injector
            .bind(BINDINGS.Agenda.jobTransformer)
            .to(AgendaScheduledJobTransformer)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'Agenda.ScheduledJobTransformer' in singleton scope`)
            .on(this)
            .in(this.initializeTopLevelDependencies));
    }
    async initializeMongoDBClientForCommandScheduler() {
        var _a, _b;
        const url = getenv.string(`EVEBLE_COMMAND_SCHEDULER_MONGODB_URL`);
        const options = {
            ...this.config.get('clients.MongoDB.CommandScheduler'),
            ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
            useUnifiedTopology: false,
        };
        const databaseName = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME');
        const collectionName = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION');
        const mongoClient = new MongoDBClient({
            id: 'MongoDB.clients.CommandScheduler',
            url,
            options,
        });
        this.injector.injectInto(mongoClient);
        this.injector
            .bind(BINDINGS.MongoDB.clients.CommandScheduler)
            .toConstantValue(mongoClient);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'MongoDB.clients.CommandScheduler' as constant value`)
            .on(this)
            .in(this.initializeMongoDBClientForCommandScheduler));
        this.mongoClient = this.injector.get(BINDINGS.MongoDB.clients.CommandScheduler);
        await this.mongoClient.initialize();
        await this.mongoClient.connect();
        const collection = this.mongoClient.getCollection(databaseName, collectionName);
        this.injector
            .bind(BINDINGS.MongoDB.collections.ScheduledCommands)
            .toConstantValue(collection);
        (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`bound 'MongoDB.collections.CommandScheduler' as constant value`)
            .on(this)
            .in(this.initializeMongoDBClientForCommandScheduler));
    }
    async initializeAgendaClientForCommandScheduler() {
        var _a;
        const databaseName = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME');
        const collectionName = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION');
        const options = this.config.get('clients.Agenda.CommandScheduler');
        options.processEvery = getenv.int('EVEBLE_COMMAND_SCHEDULER_INTERVAL');
        const client = new AgendaClient({
            id: 'Agenda.clients.CommandScheduler',
            databaseName,
            collectionName,
            options,
        });
        this.injector.injectInto(client);
        await client.initialize();
        this.injector
            .bind(BINDINGS.Agenda.clients.CommandScheduler)
            .toConstantValue(client);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'Agenda.clients.CommandScheduler' as constant value`)
            .on(this)
            .in(this.initializeAgendaClientForCommandScheduler));
        this.agendaClient = this.injector.get(BINDINGS.Agenda.clients.CommandScheduler);
    }
    async initializeCommandScheduler() {
        var _a;
        this.injector
            .bind(BINDINGS.CommandScheduler)
            .to(AgendaCommandScheduler)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'CommandScheduler' to 'AgendaCommandScheduler' in singleton scope`)
            .on(this)
            .in(this.initializeCommandScheduler));
    }
}

let SnapshotMongoDBStorage = class SnapshotMongoDBStorage {
    async save(eventSourceable) {
        const snapshot = this.snapshotSerializer.serialize(eventSourceable);
        const output = await this.collection.insertOne(snapshot);
        if (!this.isSuccessfulInsert(output, 1)) {
            throw new AddingSnapshotError(this.constructor.name, eventSourceable.getTypeName(), eventSourceable.getId().toString());
        }
        return output.insertedId;
    }
    async update(eventSourceable) {
        const filter = { _id: eventSourceable.getId().toString() };
        const snapshot = this.snapshotSerializer.serialize(eventSourceable);
        const update = {
            $set: { snapshot: snapshot.snapshot },
        };
        const isSuccessful = await this.updateOne(filter, update);
        if (!isSuccessful) {
            throw new UpdatingSnapshotError(this.constructor.name, eventSourceable.getTypeName(), eventSourceable.getId().toString());
        }
        return true;
    }
    async findById(EventSourceableType, eventSourceableId) {
        const query = { _id: eventSourceableId.toString() };
        const foundSerializedSnapshot = await this.collection.findOne(query);
        if (foundSerializedSnapshot) {
            return this.snapshotSerializer.deserialize(EventSourceableType, foundSerializedSnapshot.snapshot);
        }
        return undefined;
    }
    async updateOne(filter = {}, update = {}) {
        const output = await this.collection.updateOne(filter, update);
        if (output !== undefined && this.isSuccessfulUpdate(output, 1)) {
            return true;
        }
        return false;
    }
    isSuccessfulInsert(output, expectedNumber) {
        return output.insertedCount === expectedNumber;
    }
    isSuccessfulUpdate(output, expectedNumber) {
        const didUpdateOne = get(output, 'result.nModified') === expectedNumber;
        const didFindAndUpdatedOne = get(output, 'lastErrorObject.n') === expectedNumber;
        return didUpdateOne || didFindAndUpdatedOne;
    }
};
__decorate([
    inject(BINDINGS.MongoDB.collections.Snapshots),
    __metadata("design:type", Object)
], SnapshotMongoDBStorage.prototype, "collection", void 0);
__decorate([
    inject(BINDINGS.SnapshotSerializer),
    __metadata("design:type", Object)
], SnapshotMongoDBStorage.prototype, "snapshotSerializer", void 0);
SnapshotMongoDBStorage = __decorate([
    injectable()
], SnapshotMongoDBStorage);

let SnapshotSerializer = class SnapshotSerializer {
    serialize(eventSourceable) {
        const data = this.serializer.toData(eventSourceable);
        return {
            _id: eventSourceable.getId().toString(),
            snapshot: this.serializer.stringify(data),
        };
    }
    deserialize(_EventSourceableType, serializedEventSourceable) {
        const data = this.serializer.parse(serializedEventSourceable);
        return this.serializer.fromData(data);
    }
};
__decorate([
    inject(BINDINGS.Serializer),
    __metadata("design:type", Object)
], SnapshotSerializer.prototype, "serializer", void 0);
SnapshotSerializer = __decorate([
    injectable()
], SnapshotSerializer);

class MongoDBSnapshotStorageModule extends Module {
    async onInitialize() {
        await this.initializeSnapshotSerializer();
        await this.initializeClientForSnapshotter();
        await this.initializeSnapshotter();
    }
    async onStart() {
        var _a, _b, _c;
        if (!((_a = this.mongoClient) === null || _a === void 0 ? void 0 : _a.isConnected())) {
            await ((_b = this.mongoClient) === null || _b === void 0 ? void 0 : _b.initialize());
            await ((_c = this.mongoClient) === null || _c === void 0 ? void 0 : _c.connect());
        }
    }
    async onShutdown() {
        var _a;
        await ((_a = this.mongoClient) === null || _a === void 0 ? void 0 : _a.disconnect());
    }
    async initializeClientForSnapshotter() {
        var _a, _b;
        const url = getenv.string(`EVEBLE_SNAPSHOTTER_MONGODB_URL`);
        const options = {
            ...this.config.get('clients.MongoDB.Snapshotter'),
            ssl: getenv.bool(`EVEBLE_SNAPSHOTTER_MONGODB_SSL`),
        };
        const databaseName = getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_DBNAME');
        const collectionName = getenv.string('EVEBLE_SNAPSHOTTER_MONGODB_COLLECTION');
        const client = new MongoDBClient({
            id: 'MongoDB.clients.Snapshotter',
            url,
            options,
        });
        this.injector.injectInto(client);
        this.injector
            .bind(BINDINGS.MongoDB.clients.Snapshotter)
            .toConstantValue(client);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'MongoDB.clients.Snapshotter' as constant value`)
            .on(this)
            .in(this.initializeClientForSnapshotter));
        this.mongoClient = this.injector.get(BINDINGS.MongoDB.clients.Snapshotter);
        await this.mongoClient.initialize();
        await this.mongoClient.connect();
        const collection = this.mongoClient.getCollection(databaseName, collectionName);
        this.injector
            .bind(BINDINGS.MongoDB.collections.Snapshots)
            .toConstantValue(collection);
        (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`bound 'MongoDB.collections.Snapshots' as constant value`)
            .on(this)
            .in(this.initializeClientForSnapshotter));
    }
    async initializeSnapshotSerializer() {
        var _a;
        this.injector
            .bind(BINDINGS.SnapshotSerializer)
            .to(SnapshotSerializer)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'SnapshotSerializer' to 'SnapshotSerializer' in singleton scope`)
            .on(this)
            .in(this.initializeSnapshotSerializer));
    }
    async initializeSnapshotter() {
        var _a;
        this.injector
            .bind(BINDINGS.SnapshotStorage)
            .to(SnapshotMongoDBStorage)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'SnapshotStorage' to 'SnapshotMongoDBStorage' in singleton scope`)
            .on(this)
            .in(this.initializeSnapshotter));
    }
}

let CommitMongoDBStorage = class CommitMongoDBStorage {
    async save(commit) {
        const serializedCommit = this.commitSerializer.serialize(commit);
        let output;
        try {
            output = await this.collection.insertOne(serializedCommit);
        }
        catch (error) {
            if (error.code === 11000) {
                const foundDuplicatedVersion = (await this.findLastVersionById(commit.sourceId));
                throw new CommitConcurrencyError(commit.eventSourceableType, commit.sourceId, this.getExpectedVersionOnStorage(commit).toString(), foundDuplicatedVersion.toString());
            }
            else {
                throw error;
            }
        }
        if (!this.isSuccessfulInsert(output, 1)) {
            throw new AddingCommitFailedError(this.constructor.name, commit.id, commit.sentBy);
        }
        return output.insertedId;
    }
    async generateId() {
        return new Guid().toString();
    }
    async findLastVersionById(eventSourceableId) {
        const query = { sourceId: eventSourceableId.toString() };
        const sort = {
            sort: [['version', 'desc']],
            projection: { version: 1 },
        };
        const foundSerializedCommit = await this.collection.findOne(query, sort);
        if (foundSerializedCommit != null) {
            return foundSerializedCommit.version;
        }
        return undefined;
    }
    async findById(commitId) {
        const query = {
            _id: commitId,
        };
        const foundSerializedCommit = await this.collection.findOne(query);
        if (foundSerializedCommit != null) {
            return this.commitSerializer.deserialize(foundSerializedCommit);
        }
        return undefined;
    }
    async getCommits(eventSourceableId, versionOffset) {
        const query = {
            sourceId: eventSourceableId.toString(),
            version: { $gte: versionOffset },
        };
        const options = { sort: [['version', 'asc']] };
        return this.findAndReturnDeserializedCommits(query, options);
    }
    async getAllCommits() {
        return this.findAndReturnDeserializedCommits();
    }
    async flagCommitAsPublished(commitId, appId, workerId, publishedAt) {
        const filter = {
            $and: [
                { _id: commitId },
                {
                    receivers: {
                        $elemMatch: {
                            appId,
                        },
                    },
                },
            ],
        };
        const update = {
            $set: {
                'receivers.$.publishedAt': publishedAt,
                'receivers.$.state': 'published',
                'receivers.$.workerId': workerId,
            },
        };
        const isSuccessful = await this.updateOne(filter, update);
        if (!isSuccessful) {
            throw new UpdatingCommitError(this.constructor.name, commitId, appId);
        }
        return true;
    }
    async flagCommitAsFailed(commitId, appId, workerId, failedAt) {
        const filter = {
            $and: [
                { _id: commitId },
                {
                    receivers: {
                        $elemMatch: {
                            appId,
                        },
                    },
                },
            ],
        };
        const update = {
            $set: {
                'receivers.$.failedAt': failedAt,
                'receivers.$.state': 'failed',
                'receivers.$.workerId': workerId,
            },
        };
        const isSuccessful = await this.updateOne(filter, update);
        if (!isSuccessful) {
            throw new UpdatingCommitError(this.constructor.name, commitId, appId);
        }
        return true;
    }
    async flagAndResolveCommitAsTimeouted(commitId, appId, workerId, failedAt) {
        const filter = {
            $and: [
                { _id: commitId },
                {
                    receivers: {
                        $elemMatch: {
                            appId,
                            publishedAt: { $exists: false },
                        },
                    },
                },
            ],
        };
        const update = {
            $set: {
                'receivers.$.failedAt': failedAt,
                'receivers.$.state': 'timeouted',
                'receivers.$.workerId': workerId,
            },
        };
        return this.findOneAndUpdate(filter, update);
    }
    async lockCommit(commitId, appId, workerId, registeredAndNotReceivedYetFilter) {
        const filter = {
            $and: [{ _id: commitId }, registeredAndNotReceivedYetFilter],
        };
        const update = {
            $push: {
                receivers: {
                    state: 'received',
                    appId,
                    workerId,
                    receivedAt: new Date(),
                },
            },
        };
        const options = {
            returnOriginal: false,
        };
        return this.findOneAndUpdate(filter, update, options);
    }
    async findAndReturnDeserializedCommits(query = {}, options = {}) {
        const foundSerializedCommits = await this.findCommits(query, options);
        const commits = [];
        for (const serializedCommit of foundSerializedCommits) {
            commits.push(this.commitSerializer.deserialize(serializedCommit));
        }
        return commits;
    }
    async findCommits(query = {}, options = {}) {
        const cursor = await this.collection.find(query, options);
        const foundSerializedCommits = await cursor.toArray();
        return foundSerializedCommits;
    }
    async updateOne(filter = {}, update = {}) {
        const output = await this.collection.updateOne(filter, update);
        if (output !== undefined && this.isSuccessfulUpdate(output, 1)) {
            return true;
        }
        return false;
    }
    async findOneAndUpdate(filter = {}, update = {}, options = {
        returnOriginal: false,
    }) {
        const output = await this.collection.findOneAndUpdate(filter, update, options);
        if (output !== undefined && this.isSuccessfulUpdate(output, 1)) {
            const foundSerializedCommit = output.value;
            return this.commitSerializer.deserialize(foundSerializedCommit);
        }
        return undefined;
    }
    isSuccessfulInsert(output, expectedNumber) {
        return output.insertedCount === expectedNumber;
    }
    isSuccessfulUpdate(output, expectedNumber) {
        const didUpdateOne = get(output, 'result.nModified') === expectedNumber;
        const didFindAndUpdatedOne = get(output, 'lastErrorObject.n') === expectedNumber;
        return didUpdateOne || didFindAndUpdatedOne;
    }
    getExpectedVersionOnStorage(commit) {
        const decremented = commit.version - 1;
        return decremented === 0 ? 0 : decremented;
    }
};
__decorate([
    inject(BINDINGS.MongoDB.collections.Commits),
    __metadata("design:type", Object)
], CommitMongoDBStorage.prototype, "collection", void 0);
__decorate([
    inject(BINDINGS.CommitSerializer),
    __metadata("design:type", Object)
], CommitMongoDBStorage.prototype, "commitSerializer", void 0);
CommitMongoDBStorage = __decorate([
    injectable()
], CommitMongoDBStorage);

var CommitMongoDBObserver_1;
let CommitMongoDBObserver = CommitMongoDBObserver_1 = class CommitMongoDBObserver extends StatefulMixin {
    constructor() {
        super();
        this.setState(CommitMongoDBObserver_1.STATES.created);
    }
    async startObserving(commitPublisher) {
        const appId = this.config
            .get('appId')
            .toString();
        const workerId = this.config
            .get('workerId')
            .toString();
        const registeredQuery = {
            $or: [
                { eventTypes: { $in: commitPublisher.getHandledEventTypes() } },
                {
                    commandTypes: {
                        $in: commitPublisher.getHandledCommandTypes(),
                    },
                },
            ],
        };
        const notReceivedYetQuery = {
            'receivers.appId': {
                $nin: [appId],
            },
        };
        const registeredAndNotReceivedYetFilter = {
            $and: [registeredQuery, notReceivedYetQuery],
        };
        const cursor = await this.collection.find(registeredAndNotReceivedYetFilter, {
            timeout: false,
        });
        this.stream = await cursor.stream();
        this.setState(CommitMongoDBObserver_1.STATES.observing);
        this.stream.on('data', async (serializedCommit) => {
            const lockedCommit = await this.storage.lockCommit(serializedCommit.id, appId, workerId, registeredAndNotReceivedYetFilter);
            if (lockedCommit !== undefined) {
                await commitPublisher.publishChanges(lockedCommit);
            }
        });
        await this.initializeEventHandlers();
    }
    async pauseObserving() {
        if (this.stream !== undefined && this.isObserving()) {
            this.setState(CommitMongoDBObserver_1.STATES.paused);
            await this.stream.pause();
        }
    }
    async stopObserving() {
        if (this.stream !== undefined && this.isObserving()) {
            this.setState(CommitMongoDBObserver_1.STATES.closed);
            await this.stream.close();
        }
    }
    isObserving() {
        return (this.state !== undefined &&
            this.state === CommitMongoDBObserver_1.STATES.observing);
    }
    async initializeEventHandlers() {
        if (this.stream === undefined)
            return;
        this.stream.on('finish', async () => {
            this.setState(CommitMongoDBObserver_1.STATES.finished);
            this.log.debug(new Log(`finished observing commits`));
        });
        this.stream.on('end', async () => {
            this.setState(CommitMongoDBObserver_1.STATES.ended);
            this.log.debug(new Log(`ended observing commits`));
        });
        this.stream.on('close', async () => {
            this.setState(CommitMongoDBObserver_1.STATES.closed);
            this.log.debug(new Log(`closed observing commits`));
        });
        this.stream.on('pause', async () => {
            this.setState(CommitMongoDBObserver_1.STATES.paused);
            this.log.debug(new Log(`paused observing commits`));
        });
        this.stream.on('error', async (error) => {
            this.setState(CommitMongoDBObserver_1.STATES.failed);
            this.log.error(new Log(`failed observing commits do to error: ${error}`));
            if (this.isInProduction()) {
                process.exit(0);
            }
        });
    }
    isInProduction() {
        return getenv.string('NODE_ENV') === 'production';
    }
};
CommitMongoDBObserver.STATES = {
    created: 'created',
    observing: 'observing',
    paused: 'paused',
    closed: 'closed',
    finished: 'finished',
    ended: 'ended',
    failed: 'failed',
};
__decorate([
    inject(BINDINGS.MongoDB.collections.Commits),
    __metadata("design:type", Object)
], CommitMongoDBObserver.prototype, "collection", void 0);
__decorate([
    inject(BINDINGS.CommitStorage),
    __metadata("design:type", Object)
], CommitMongoDBObserver.prototype, "storage", void 0);
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], CommitMongoDBObserver.prototype, "log", void 0);
__decorate([
    inject(BINDINGS.Config),
    __metadata("design:type", Object)
], CommitMongoDBObserver.prototype, "config", void 0);
CommitMongoDBObserver = CommitMongoDBObserver_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], CommitMongoDBObserver);

let CommitSerializer = class CommitSerializer {
    serialize(commit) {
        const serializedCommit = {};
        serializedCommit.id = commit.id;
        serializedCommit._id = commit.id;
        serializedCommit.sourceId = commit.sourceId;
        serializedCommit.version = commit.version;
        serializedCommit.insertedAt = commit.insertedAt;
        serializedCommit.sentBy = commit.sentBy;
        serializedCommit.eventSourceableType = commit.eventSourceableType;
        serializedCommit.events = [];
        serializedCommit.commands = [];
        serializedCommit.eventTypes = [];
        serializedCommit.commandTypes = [];
        serializedCommit.receivers = [];
        for (const event of commit.events) {
            serializedCommit.events.push({
                type: event.getTypeName(),
                data: this.serializer.toData(event),
            });
            serializedCommit.eventTypes = union(serializedCommit.eventTypes, [
                event.getTypeName(),
            ]);
        }
        for (const command of commit.commands) {
            serializedCommit.commands.push({
                type: command.getTypeName(),
                data: this.serializer.toData(command),
            });
            serializedCommit.commandTypes = union(serializedCommit.commandTypes, [
                command.getTypeName(),
            ]);
        }
        for (const receiver of commit.receivers) {
            serializedCommit.receivers.push({ ...receiver });
        }
        return serializedCommit;
    }
    deserialize(serializedCommit) {
        const deserializedProps = { ...serializedCommit };
        delete deserializedProps._id;
        delete deserializedProps.commandTypes;
        delete deserializedProps.eventTypes;
        deserializedProps.receivers = [];
        deserializedProps.events = [];
        deserializedProps.commands = [];
        for (const event of serializedCommit.events) {
            if (this.serializer.hasType(event.type)) {
                deserializedProps.events.push(this.serializer.fromData(event.data));
            }
        }
        for (const command of serializedCommit.commands) {
            if (this.serializer.hasType(command.type)) {
                deserializedProps.commands.push(this.serializer.fromData(command.data));
            }
        }
        for (const receiverProps of serializedCommit.receivers) {
            deserializedProps.receivers.push(new CommitReceiver(receiverProps));
        }
        return new Commit(deserializedProps);
    }
};
__decorate([
    inject(BINDINGS.Serializer),
    __metadata("design:type", Object)
], CommitSerializer.prototype, "serializer", void 0);
CommitSerializer = __decorate([
    injectable()
], CommitSerializer);

class MongoDBCommitStorageModule extends Module {
    async onInitialize() {
        await this.initializeClientForCommitStorage();
        await this.initializeCommitSerializer();
        await this.initializeCommitStorage();
        await this.initializeCommitObserver();
    }
    async onStart() {
        var _a, _b, _c;
        if (!((_a = this.mongoClient) === null || _a === void 0 ? void 0 : _a.isConnected())) {
            await ((_b = this.mongoClient) === null || _b === void 0 ? void 0 : _b.initialize());
            await ((_c = this.mongoClient) === null || _c === void 0 ? void 0 : _c.connect());
        }
    }
    async onShutdown() {
        var _a;
        await ((_a = this.mongoClient) === null || _a === void 0 ? void 0 : _a.disconnect());
    }
    async initializeClientForCommitStorage() {
        var _a, _b;
        const url = getenv.string(`EVEBLE_COMMITSTORE_MONGODB_URL`);
        const options = {
            ...this.config.get('clients.MongoDB.CommitStore'),
            ssl: getenv.bool(`EVEBLE_COMMITSTORE_MONGODB_SSL`),
        };
        const databaseName = getenv.string('EVEBLE_COMMITSTORE_MONGODB_DBNAME');
        const collectionName = getenv.string('EVEBLE_COMMITSTORE_MONGODB_COLLECTION');
        const indexes = [
            [
                {
                    sourceId: 1,
                    version: 1,
                },
                {
                    unique: true,
                },
            ],
            [
                {
                    'receivers.appId': 1,
                },
            ],
            [
                {
                    _id: 1,
                    'receivers.appId': 1,
                },
            ],
        ];
        const commitsCollection = new MongoDBCollectionConfig({
            name: collectionName,
            indexes,
        });
        const database = new MongoDBDatabaseConfig({
            name: databaseName,
            collections: [commitsCollection],
        });
        const client = new MongoDBClient({
            id: 'MongoDB.clients.CommitStore',
            databases: [database],
            url,
            options,
        });
        this.injector.injectInto(client);
        this.injector
            .bind(BINDINGS.MongoDB.clients.CommitStore)
            .toConstantValue(client);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'MongoDB.clients.CommitStore' as constant value`)
            .on(this)
            .in(this.initializeClientForCommitStorage));
        this.mongoClient = this.injector.get(BINDINGS.MongoDB.clients.CommitStore);
        await this.mongoClient.initialize();
        await this.mongoClient.connect();
        const collection = this.mongoClient.getCollection(databaseName, collectionName);
        this.injector
            .bind(BINDINGS.MongoDB.collections.Commits)
            .toConstantValue(collection);
        (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`bound 'MongoDB.collections.Commits' as constant value`)
            .on(this)
            .in(this.initializeClientForCommitStorage));
    }
    async initializeCommitSerializer() {
        var _a;
        this.injector
            .bind(BINDINGS.CommitSerializer)
            .to(CommitSerializer)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'CommitSerializer' to 'CommitSerializer' in singleton scope`)
            .on(this)
            .in(this.initializeCommitSerializer));
    }
    async initializeCommitStorage() {
        var _a;
        this.injector
            .bind(BINDINGS.CommitStorage)
            .to(CommitMongoDBStorage)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'CommitStorage' to 'CommitMongoDBStorage' in singleton scope`)
            .on(this)
            .in(this.initializeCommitStorage));
    }
    async initializeCommitObserver() {
        var _a;
        if (!this.injector.isBound(BINDINGS.CommitObserver)) {
            this.injector
                .bind(BINDINGS.CommitObserver)
                .to(CommitMongoDBObserver)
                .inSingletonScope();
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'CommitObserver' to 'CommitMongoDBObserver' in singleton scope`)
                .on(this)
                .in(this.initializeCommitObserver));
        }
    }
}

class App extends BaseApp {
    constructor(props = {}) {
        const env = process.env.NODE_ENV;
        const envFilePath = process.env.NODE_ENV ? `.env.${env}` : '.env';
        loadENV(envFilePath);
        const processedProps = { ...props };
        if (isPlainObject(props.config)) {
            processedProps.config = AppConfig.from(props.config);
        }
        if (props.config === undefined) {
            processedProps.config = new AppConfig({
                appId: AppConfig.generateId(),
                logging: new LoggingConfig({
                    isEnabled: true,
                }),
            });
        }
        if (!processedProps.config.has('eveble.CommitStore.timeout')) {
            processedProps.config.set('eveble.CommitStore.timeout', getenv.int('EVEBLE_COMMITSTORE_TIMEOUT'));
        }
        if (!processedProps.config.has('eveble.Snapshotter.isEnabled')) {
            processedProps.config.set('eveble.Snapshotter.isEnabled', getenv.bool('EVEBLE_SNAPSHOTTER_ENABLED'));
        }
        if (!processedProps.config.has('eveble.Snapshotter.frequency')) {
            processedProps.config.set('eveble.Snapshotter.frequency', getenv.int('EVEBLE_SNAPSHOTTER_FREQUENCY'));
        }
        if (!processedProps.config.has('eveble.CommandScheduler.isEnabled')) {
            processedProps.config.set('eveble.CommandScheduler.isEnabled', getenv.bool('EVEBLE_COMMAND_SCHEDULER_ENABLED'));
        }
        if (processedProps.modules === undefined) {
            processedProps.modules = [];
        }
        let hasEveble = false;
        for (const module of processedProps.modules) {
            if (module instanceof Eveble) {
                hasEveble = true;
            }
        }
        if (!hasEveble) {
            processedProps.modules.unshift(new Eveble());
        }
        super(processedProps);
        this.injector.bind(BINDINGS.App).toConstantValue(this);
        this.envFilePath = envFilePath;
    }
    async send(command) {
        const commandBus = await this.injector.getAsync(BINDINGS.CommandBus);
        return commandBus.send(command);
    }
    async publish(event) {
        const eventBus = await this.injector.getAsync(BINDINGS.EventBus);
        await eventBus.publish(event);
    }
    async subscribeTo(eventType, handler) {
        const eventBus = await this.injector.getAsync(BINDINGS.EventBus);
        eventBus.subscribeTo(eventType, handler);
    }
    isInProduction() {
        return getenv.string('NODE_ENV') === 'production';
    }
    isSnapshotting() {
        return this.config.get('eveble.Snapshotter.isEnabled') === true;
    }
    isCommandScheduling() {
        return this.config.get('eveble.CommandScheduler.isEnabled') === true;
    }
    async onConfiguration() {
        await super.onConfiguration();
        await this.initializeGracefulShutdown();
        await this.initializeExternalDependencies();
        await this.initializeSchedulers();
        await this.initializeStorages();
    }
    async initializeGracefulShutdown() {
        var _a, _b;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initializing graceful shutdown for process signals`)
            .on(this)
            .in(this.initializeGracefulShutdown));
        const signalEvents = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        for (const sig of signalEvents) {
            (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`registers graceful shutdown for code: '${sig}'`)
                .on(this)
                .in(this.initializeGracefulShutdown));
            const boundListener = this.onProcessSignal.bind(this);
            boundListener.original = this.onProcessSignal;
            process.on(sig, boundListener);
        }
    }
    async onProcessSignal(code) {
        var _a;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.warning(new Log(`got signal '${code}': initializing graceful shutdown`)
            .on(this)
            .in(this.onProcessSignal));
        await this.shutdown();
    }
    async initializeExternalDependencies() {
        var _a, _b;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initializing external dependencies`)
            .on(this)
            .in(this.initializeExternalDependencies));
        const components = {
            'Agenda.library': Agenda,
            'MongoDB.library': MongoClient,
        };
        for (const [id, component] of Object.entries(components)) {
            if (!this.injector.isBound(get(BINDINGS, id))) {
                this.injector.bind(get(BINDINGS, id)).toConstantValue(component);
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`bound '${id}' as constant value`)
                    .on(this)
                    .in(this.initializeExternalDependencies));
            }
        }
    }
    async initializeSchedulers() {
        var _a, _b;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initializing schedulers`).on(this).in(this.initializeSchedulers));
        if (this.isCommandScheduling() &&
            !this.injector.isBound(BINDINGS.CommandScheduler)) {
            const client = getenv.string('EVEBLE_COMMAND_SCHEDULER_CLIENT');
            switch (client) {
                case 'agenda':
                    this.modules.unshift(new AgendaCommandSchedulerModule());
                    (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`added 'CommandScheduler' as 'AgendaCommandSchedulerModule' to application modules`)
                        .on(this)
                        .in(this.initializeSchedulers));
                    break;
                default:
                    throw new StorageNotFoundError('CommandScheduler', client);
            }
        }
    }
    async initializeStorages() {
        var _a, _b, _c;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initializing storages`).on(this).in(this.initializeStorages));
        if (!this.injector.isBound(BINDINGS.SnapshotStorage) &&
            this.isSnapshotting()) {
            const client = getenv.string('EVEBLE_COMMITSTORE_CLIENT');
            switch (client) {
                case 'mongodb':
                    this.modules.unshift(new MongoDBSnapshotStorageModule());
                    (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`added 'SnapshotStorage' as 'MongoDBSnapshotStorageModule' to application modules`)
                        .on(this)
                        .in(this.initializeStorages));
                    break;
                default:
                    throw new StorageNotFoundError('SnapshotStorage', client);
            }
        }
        if (!this.injector.isBound(BINDINGS.CommitStorage)) {
            const client = getenv.string('EVEBLE_COMMITSTORE_CLIENT');
            switch (client) {
                case 'mongodb':
                    this.modules.unshift(new MongoDBCommitStorageModule());
                    (_c = this.log) === null || _c === void 0 ? void 0 : _c.debug(new Log(`added 'CommitStorage' as 'MongoDBCommitStorageModule' to application modules`)
                        .on(this)
                        .in(this.initializeStorages));
                    break;
                default:
                    throw new StorageNotFoundError('CommitStorage', client);
            }
        }
    }
}

class StatusError extends ExtendableError {
}
class UndefinedStatusesError extends StatusError {
    constructor(typeName) {
        super(`${typeName}: statuses are not defined. Please define statuses as class(MyClass.STATUSES) property or define your getter as MyClass.prototype.getAvailableStatuses`);
    }
}
class InvalidStatusError extends StatusError {
    constructor(typeName, currentStatus, expectedStatuses) {
        super(`${typeName}: expected current status of '${currentStatus}' to be in one of statuses: '${expectedStatuses}'`);
    }
}
let StatusfulMixin = class StatusfulMixin {
    setStatus(status) {
        const selectableStatuses = this.getSelectableStatuses();
        if (isEmpty(selectableStatuses)) {
            const typeName = getTypeName(this.constructor);
            throw new UndefinedStatusesError(typeName);
        }
        const oneOfSelectableStatuses = Object.values(selectableStatuses);
        if (kernel.isValidating()) {
            const pattern = new OneOf(...oneOfSelectableStatuses);
            kernel.validator.validate(status, pattern);
        }
        this.status = status;
    }
    isInStatus(status) {
        if (Array.isArray(status)) {
            return this.isInOneOfStatuses(status);
        }
        return this.status === status;
    }
    isInOneOfStatuses(status) {
        const expectedStatuses = Array.isArray(status)
            ? status
            : [status];
        return expectedStatuses.includes(this.status);
    }
    getStatus() {
        return this.status;
    }
    hasStatus() {
        return this.status != null;
    }
    validateStatus(statusOrStatuses, error) {
        const expectedStatuses = Array.isArray(statusOrStatuses)
            ? statusOrStatuses
            : [statusOrStatuses];
        if (!this.isInOneOfStatuses(expectedStatuses)) {
            if (error !== undefined) {
                throw error;
            }
            const typeName = getTypeName(this.constructor);
            throw new InvalidStatusError(typeName, this.status, expectedStatuses.join(', '));
        }
        return true;
    }
    getSelectableStatuses() {
        return this.constructor.STATUSES;
    }
};
StatusfulMixin = __decorate([
    injectable()
], StatusfulMixin);

let Entity = class Entity extends classes(Serializable, StatefulMixin, StatusfulMixin) {
    constructor(props) {
        super([props]);
    }
    getId() {
        return this.id;
    }
    equals(otherEntity) {
        return (otherEntity != null &&
            otherEntity.constructor === this.constructor &&
            otherEntity.getId() === this.id);
    }
    assign(...sources) {
        const pickedProps = this.pickProps(...sources);
        this.validateProps({ ...this, ...pickedProps }, this.getPropTypes(), true);
        Object.assign(this, pickedProps);
        return this;
    }
    pickProps(...sources) {
        const propTypes = this.getPropTypes();
        const propKeys = Object.keys(propTypes);
        const pickedProps = {};
        for (const source of sources) {
            Object.assign(pickedProps, pick(source, propKeys));
        }
        return pickedProps;
    }
    on(action) {
        kernel.asserter.setAction(action);
        return this;
    }
    get ensure() {
        return new Proxy(this, {
            get(target, key) {
                if (key === Symbol.toStringTag) {
                    return this;
                }
                const propKey = key;
                if (kernel.asserter.hasApi(`${propKey}.`)) {
                    kernel.asserter.setEntity(target);
                    return kernel.asserter.ensure[propKey];
                }
                if (typeof target[propKey] === 'function') {
                    const proxifiedMethod = new Proxy(target[propKey], {
                        apply(_targetMethod, _thisArg, args) {
                            target[SAVE_STATE_METHOD_KEY]();
                            let result;
                            let error;
                            try {
                                result = target[propKey](...args);
                            }
                            catch (e) {
                                error = e;
                            }
                            target[ROLLBACK_STATE_METHOD_KEY]();
                            if (error !== undefined)
                                throw error;
                            return result;
                        },
                    });
                    return proxifiedMethod;
                }
                if (target[propKey] === undefined) {
                    return target;
                }
                return target[propKey];
            },
        });
    }
    get ableTo() {
        return this;
    }
    get is() {
        return this;
    }
    get can() {
        return new Proxy(this, {
            get(target, propKey) {
                const proxifiedMethod = new Proxy(target[propKey], {
                    apply(_targetMethod, _thisArg, args) {
                        target[SAVE_STATE_METHOD_KEY]();
                        let isAble = true;
                        try {
                            target[propKey](...args);
                        }
                        catch (e) {
                            isAble = false;
                        }
                        target[ROLLBACK_STATE_METHOD_KEY]();
                        return isAble;
                    },
                });
                return proxifiedMethod;
            },
        });
    }
    [SAVE_STATE_METHOD_KEY]() {
        this[SAVED_STATE_KEY] = {};
        const propTypes = this.getPropTypes();
        for (const key of Object.keys(propTypes)) {
            if (this[key] !== undefined) {
                this[SAVED_STATE_KEY][key] = deepClone(this[key]);
            }
        }
    }
    [ROLLBACK_STATE_METHOD_KEY]() {
        if (!this.isStateSaved()) {
            throw new SavedStateNotFoundError(this.getTypeName(), this.getId().toString());
        }
        Object.assign(this, this[SAVED_STATE_KEY]);
        const serializablesListProps = Reflect.getMetadata(SERIALIZABLE_LIST_PROPS_KEY, this.constructor);
        for (const [key, serializable] of Object.entries(serializablesListProps)) {
            this[key] = new List(this, key, serializable, this[SAVED_STATE_KEY][key] || []);
        }
        delete this[SAVED_STATE_KEY];
    }
    isStateSaved() {
        return this[SAVED_STATE_KEY] !== undefined;
    }
};
Entity = __decorate([
    define('Entity')({ kind: 19, name: "Entity", properties: { "id": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "state": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "status": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "schemaVersion": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, [SAVED_STATE_KEY]: { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } }, extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], Entity);
Entity.enableSerializableLists();

let EventSourceable = class EventSourceable extends classes(Entity, OneToOneHandlingMixin) {
    constructor(props) {
        const processedProps = { version: 0, ...props };
        super([processedProps]);
        if (this.state !== undefined) {
            this.setState(this.state);
        }
        if (this.status !== undefined) {
            this.setStatus(this.status);
        }
        Object.defineProperty(this, EVENTS_KEY, {
            enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
            value: [],
        });
        Object.defineProperty(this, COMMANDS_KEY, {
            enumerable: getenv.bool('EVEBLE_SHOW_INTERNALS', false),
            value: [],
        });
        this.setHandleableTypes([Command, Event]);
    }
    async initialize() {
        this.setupHandlers({
            handlers: this.handles(),
            handleableTypes: [Command],
            isBoundable: true,
        });
        this.setupHandlers({
            handlers: this.subscribes(),
            handleableTypes: [Event],
            isBoundable: true,
        });
    }
    processProps(props = {}) {
        const processedProps = this.onConstruction(props);
        return processedProps;
    }
    getVersion() {
        return this.version || 0;
    }
    setVersion(version) {
        this.version = version;
    }
    getEvents() {
        return this[EVENTS_KEY];
    }
    getCommands() {
        return this[COMMANDS_KEY];
    }
    async handle(message) {
        if (message instanceof Command &&
            message.isScheduled() &&
            !message.isDeliverable()) {
            return this;
        }
        if (message.hasMetadata()) {
            const metadata = omit(message.metadata, ['scheduling']);
            this.assignMetadata(metadata);
        }
        const handler = this.getHandler(message.constructor);
        if (handler === undefined) {
            throw new HandlerNotFoundError(getTypeName(this.constructor), message.getTypeName());
        }
        await handler(message);
        return this;
    }
    schedule(command, deliverAt, assignmentId = this.getId()) {
        const assignmentProps = {
            assignmentId,
            assignerId: this.getId(),
            assignerType: this.typeName(),
            deliverAt,
        };
        const assignment = new Assignment(assignmentProps);
        command.schedule(assignment);
        const scheduleCommand = new ScheduleCommand({
            targetId: command.getId(),
            command,
        });
        this[COMMANDS_KEY].push(scheduleCommand);
    }
    unschedule(assignmentId, commandType) {
        const unscheduleCommand = new UnscheduleCommand({
            targetId: this.getId(),
            assignerId: this.getId(),
            assignerType: this.typeName(),
            assignmentId,
            commandType: commandType.getTypeName(),
        });
        this[COMMANDS_KEY].push(unscheduleCommand);
    }
    assign(...sources) {
        const pickedProps = {};
        for (const source of sources) {
            const processedSource = omit(source, 'sourceId', 'targetId', 'version', 'timestamp');
            const props = this.pickProps(processedSource);
            Object.assign(pickedProps, props);
        }
        Object.assign(this, pickedProps);
        return this;
    }
    record(event) {
        this.validateEventApplicability(event);
        if (this.metadata !== undefined) {
            event.assignMetadata(this.metadata);
        }
        this[EVENTS_KEY].push(event);
        if (this.hasHandler(event.constructor)) {
            this.handle(event);
        }
        this.updateToEventVersion(event);
    }
    replay(event) {
        this.validateEventApplicability(event);
        if (this.hasHandler(event.constructor)) {
            this.handle(event);
        }
        this.updateToEventVersion(event);
    }
    replayHistory(history) {
        for (const event of history) {
            this.replay(event);
        }
    }
    assignMetadata(metadata) {
        if (this.metadata === undefined) {
            this.metadata = {};
        }
        Object.assign(this.metadata, merge(this.metadata, metadata, {
            isMergeableObject: isPlainRecord,
        }));
    }
    updateToEventVersion(event) {
        if (event.version !== undefined) {
            this.setVersion(event.version);
        }
    }
    validateEventApplicability(event) {
        if (!(event instanceof Event)) {
            throw new InvalidEventError(this.typeName(), kernel.describer.describe(event));
        }
        if (event.sourceId.toString() !== this.getId().toString()) {
            throw new EventIdMismatchError(this.typeName(), this.getId().toString(), event.sourceId.toString());
        }
        return true;
    }
    eventProps() {
        return {
            sourceId: this.getId(),
            version: this.getVersion(),
            timestamp: new Date(),
            metadata: {},
        };
    }
    commandProps() {
        return {
            timestamp: new Date(),
            metadata: {},
        };
    }
    incrementVersion() {
        this.version += 1;
    }
    static resolveInitializingMessage() {
        return (Reflect.getMetadata(INITIALIZING_MESSAGE_KEY, this.prototype) || undefined);
    }
    static resolveRoutedCommands() {
        return (Reflect.getMetadata(ROUTED_COMMANDS_CONTAINER_KEY, this.prototype) || []);
    }
    static resolveRoutedEvents() {
        return (Reflect.getMetadata(ROUTED_EVENTS_CONTAINER_KEY, this.prototype) || []);
    }
    static resolveRoutedMessages() {
        const commands = Reflect.getMetadata(ROUTED_COMMANDS_CONTAINER_KEY, this.prototype) || [];
        const events = Reflect.getMetadata(ROUTED_EVENTS_CONTAINER_KEY, this.prototype) || [];
        return [...commands, ...events];
    }
};
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventSourceable.prototype, "initialize", null);
EventSourceable = __decorate([
    define('EventSourceable')({ kind: 19, name: "EventSourceable", properties: { "id": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "version": { kind: 3 }, "state": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "status": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "schemaVersion": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, [COMMANDS_KEY]: { kind: 18, type: Array, arguments: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "getId": { kind: 21 }, "isDeliverable": { kind: 21 }, "isScheduled": { kind: 21 }, "schedule": { kind: 21 }, "getAssignment": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } }] }, [EVENTS_KEY]: { kind: 18, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "version": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } }] } }, extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], EventSourceable);
EventSourceable.enableSerializableLists();

let Aggregate = class Aggregate extends EventSourceable {
    constructor(arg) {
        const props = {
            version: 0,
        };
        let isInitializedWithEvent = false;
        if (arg instanceof History) {
            const initializingMessage = arg.getInitializingMessage();
            props.id = initializingMessage.getId();
        }
        else if (arg instanceof Command) {
            const initializingMessage = arg;
            props.id = initializingMessage.getId();
        }
        else if (arg instanceof Event) {
            isInitializedWithEvent = true;
        }
        else {
            Object.assign(props, arg);
        }
        super(props);
        if (isInitializedWithEvent) {
            throw new InvalidInitializingMessageError(this.typeName(), kernel.describer.describe([Command, History]), kernel.describer.describe(arg));
        }
    }
};
Aggregate = __decorate([
    define('Aggregate')({ kind: 19, name: "Aggregate", properties: { "id": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "version": { kind: 3 }, "state": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "status": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "schemaVersion": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, [COMMANDS_KEY]: { kind: 18, type: Array, arguments: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "getId": { kind: 21 }, "isDeliverable": { kind: 21 }, "isScheduled": { kind: 21 }, "schedule": { kind: 21 }, "getAssignment": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } }] }, [EVENTS_KEY]: { kind: 18, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "version": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } }] } }, extends: { kind: 18, type: EventSourceable, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], Aggregate);

class BoundedContext extends Module {
}

let Process = class Process extends EventSourceable {
    constructor(arg) {
        const props = {
            version: 0,
        };
        let hasInitializingMessage = false;
        if (arg instanceof History) {
            const initializingMessage = arg.getInitializingMessage();
            props.id = initializingMessage.getId();
        }
        else if (arg instanceof Command || arg instanceof Event) {
            hasInitializingMessage = true;
            const initializingMessage = arg;
            if (initializingMessage instanceof Event) {
                props.id = new Guid();
            }
            else {
                props.id = initializingMessage.getId();
            }
        }
        else {
            Object.assign(props, arg);
        }
        super(props);
        if (hasInitializingMessage &&
            !(arg instanceof Command || arg instanceof Event)) {
            throw new InvalidInitializingMessageError(this.getTypeName(), kernel.describer.describe([Command, Event]), kernel.describer.describe(arg));
        }
    }
    static getCorrelationKey() {
        return this.correlationKey !== undefined
            ? this.correlationKey
            : this.getTypeName();
    }
    static setCorrelationKey(key) {
        this.correlationKey = key;
    }
    getCorrelationKey() {
        return this.constructor.getCorrelationKey();
    }
    trigger(command) {
        command.setCorrelationId(this.getCorrelationKey(), this.getId());
        this[COMMANDS_KEY].push(command);
    }
    validateEventApplicability() {
        return true;
    }
};
Process = __decorate([
    define('Process')({ kind: 19, name: "Process", properties: { "id": { kind: 17, types: [{ kind: 2 }, { kind: 18, type: Guid, arguments: [] }] }, "version": { kind: 3 }, "state": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "status": { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "schemaVersion": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, [COMMANDS_KEY]: { kind: 18, type: Array, arguments: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "getId": { kind: 21 }, "isDeliverable": { kind: 21 }, "isScheduled": { kind: 21 }, "schedule": { kind: 21 }, "getAssignment": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } }] }, [EVENTS_KEY]: { kind: 18, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21 } } }] }, "version": { kind: 17, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21 }, "timestamp": { kind: 17, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21 }, "assignMetadata": { kind: 21 }, "hasMetadata": { kind: 21 }, "getMetadata": { kind: 21 }, "setCorrelationId": { kind: 21 }, "getCorrelationId": { kind: 21 }, "hasCorrelationId": { kind: 21 }, "getTypeName": { kind: 21 }, "toString": { kind: 21 }, "getPropTypes": { kind: 21 }, "toPlainObject": { kind: 21 }, "validateProps": { kind: 21 }, "getPropertyInitializers": { kind: 21 }, "equals": { kind: 21 }, "getSchemaVersion": { kind: 21 }, "transformLegacyProps": { kind: 21 }, "registerLegacyTransformer": { kind: 21 }, "overrideLegacyTransformer": { kind: 21 }, "hasLegacyTransformer": { kind: 21 }, "getLegacyTransformers": { kind: 21 }, "getLegacyTransformer": { kind: 21 } } }] } }, extends: { kind: 18, type: EventSourceable, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], Process);

let RebuildingResult = class RebuildingResult extends Struct {
};
RebuildingResult = __decorate([
    define()({ kind: 19, name: "RebuildingResult", properties: { "projectionsNames": { kind: 18, type: Array, arguments: [{ kind: 2 }] }, "duration": { kind: 3 }, "message": { kind: 2 } }, extends: { kind: 18, type: Struct, arguments: [] } })
], RebuildingResult);
class ProjectionRebuilder {
    async rebuild(projections) {
        const projectionsNames = [];
        for (const projection of projections) {
            projectionsNames.push(projection.getProjectionName());
        }
        this.log.info(new Log(`rebuilding projections: '${projectionsNames.join(', ')}'`)
            .on(this)
            .in(this.rebuild));
        this.startTimer();
        const queue = [];
        try {
            for (const projection of projections) {
                await this.enterRebuildModeOnProjection(projection);
                await this.runBeforeRebuildHookOnProjection(projection);
                queue.push(projection);
            }
        }
        catch (error) {
            this.logInitializingRollback(error);
            for (const projection of queue) {
                await this.rollbackStateForProjection(projection);
            }
            throw error;
        }
        try {
            await this.publishAllEventsFromCommitStoreOnQueuedProjections(queue);
            for (const projection of queue) {
                await this.commitStateOnProjection(projection);
            }
        }
        catch (error) {
            this.logInitializingRollback(error);
            let errorOnRollback;
            for (const projection of queue) {
                try {
                    await projection.invokeAction('rollback');
                }
                catch (e) {
                    errorOnRollback = e;
                }
                await projection.exitRebuildMode();
            }
            if (errorOnRollback !== undefined) {
                throw errorOnRollback;
            }
            throw error;
        }
        for (const projection of queue) {
            await projection.exitRebuildMode();
        }
        const duration = this.calculateOperationTime();
        const message = `finished rebuilding '${projectionsNames.join(', ')}' in ${duration}ms`;
        this.log.info(new Log(message).on(this).in(this.rebuild));
        return new RebuildingResult({
            projectionsNames,
            duration,
            message,
        });
    }
    startTimer() {
        this.timer = process.hrtime();
    }
    calculateOperationTime() {
        return Math.round(process.hrtime(this.timer)[1] / 1000000);
    }
    async enterRebuildModeOnProjection(projection) {
        await projection.enterRebuildMode();
    }
    async runBeforeRebuildHookOnProjection(projection) {
        await projection.invokeAction('beforeRebuild');
    }
    async publishAllEventsFromCommitStoreOnQueuedProjections(queueProjections) {
        const events = await this.commitStore.getAllEvents();
        this.log.debug(new Log(`publishing events on projections`)
            .on(this)
            .in(this.publishAllEventsFromCommitStoreOnQueuedProjections));
        for (const event of events) {
            for (const projection of queueProjections) {
                const isRebuildEvent = true;
                await projection.on(event, isRebuildEvent);
            }
        }
        this.log.debug(new Log(`finished publishing events`)
            .on(this)
            .in(this.publishAllEventsFromCommitStoreOnQueuedProjections));
    }
    async commitStateOnProjection(projection) {
        await projection.invokeAction('commit');
    }
    async rollbackStateForProjection(projection) {
        try {
            await projection.invokeAction('rollback');
        }
        catch (error) { }
        await projection.exitRebuildMode();
    }
    logInitializingRollback(error) {
        this.log.emerg(new Log(`initializing rollback on projections due to error: ${error}`)
            .on(this)
            .in(this.rebuild));
    }
}
__decorate([
    inject(BINDINGS.CommitStore),
    __metadata("design:type", Object)
], ProjectionRebuilder.prototype, "commitStore", void 0);
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], ProjectionRebuilder.prototype, "log", void 0);

class Projection extends classes(EventHandlingMixin, StatefulMixin) {
    constructor() {
        super([]);
        this.setState(Projection.STATES.projecting);
        this.queuedEvents = [];
    }
    initialize() {
        super.class(EventHandlingMixin).initialize();
    }
    async on(event, isRebuildEvent = false) {
        if (!this.hasHandler(event.constructor)) {
            return;
        }
        if (this.isInState(Projection.STATES.projecting) ||
            (this.isInState(Projection.STATES.rebuilding) && isRebuildEvent)) {
            this.log.debug(new Log(`publishing '${event.getTypeName()}'`)
                .on(this)
                .in(this.on)
                .with('event', event));
            await super.on(event);
        }
        else {
            this.log.debug(new Log(`adding '${event.getTypeName()}' to queue`)
                .on(this)
                .in(this.on)
                .with('event', event));
            this.queuedEvents.push(event);
        }
    }
    async enterRebuildMode() {
        if (this.isInState(Projection.STATES.rebuilding)) {
            this.log.error(new Log(`failed entering rebuilding(already in rebuild mode)`)
                .on(this)
                .in(this.enterRebuildMode));
            throw new ProjectionAlreadyRebuildingError(this.constructor.name);
        }
        this.setState(Projection.STATES.rebuilding);
        this.log.debug(new Log(`rebuilding`).on(this).in(this.enterRebuildMode));
    }
    async exitRebuildMode() {
        if (!this.isInState(Projection.STATES.rebuilding)) {
            this.log.error(new Log(`failed exiting rebuilding(already projecting)`)
                .on(this)
                .in(this.exitRebuildMode));
            throw new ProjectionNotRebuildingError(this.constructor.name);
        }
        this.setState(Projection.STATES.projecting);
        for (const event of this.queuedEvents) {
            this.on(event);
        }
        this.log.debug(new Log(`projecting`).on(this).in(this.exitRebuildMode));
    }
    async invokeAction(actionName) {
        if (isFunction(this[actionName])) {
            try {
                this.log.debug(new Log(`${actionName}`).on(this).in(this[actionName]));
                await this[actionName]();
                this.log.debug(new Log(`finished ${actionName}`).on(this).in(this[actionName]));
            }
            catch (error) {
                this.log.error(new Log(`failed ${actionName} do to error: ${error}`)
                    .on(this)
                    .in(this[actionName]));
                throw error;
            }
        }
    }
    getProjectionName() {
        return this.constructor.name;
    }
}
Projection.STATES = {
    projecting: 'projecting',
    rebuilding: 'rebuilding',
};
__decorate([
    inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], Projection.prototype, "eventBus", void 0);
__decorate([
    inject(BINDINGS.log),
    __metadata("design:type", Object)
], Projection.prototype, "log", void 0);
__decorate([
    postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Projection.prototype, "initialize", null);

function bindExternalDependencies(injector) {
    if (!injector.isBound(BINDINGS.winston)) {
        injector.bind(BINDINGS.winston).toConstantValue(winston);
    }
    if (!injector.isBound(BINDINGS.chalk)) {
        injector.bind(BINDINGS.chalk).toConstantValue(chalk);
    }
}
function bindLoggerDependencies(injector) {
    const converter = new StringifingConverter();
    if (!injector.isBound(BINDINGS.SimpleLogFormatter)) {
        const simpleFormatter = new SimpleLogFormatter(converter);
        injector
            .bind(BINDINGS.SimpleLogFormatter)
            .toConstantValue(simpleFormatter);
    }
    if (!injector.isBound(BINDINGS.DetailedLogFormatter)) {
        const detailedFormatter = new DetailedLogFormatter(converter, injector.get(BINDINGS.chalk));
        injector
            .bind(BINDINGS.DetailedLogFormatter)
            .toConstantValue(detailedFormatter);
    }
}
function createConsoleTransport(level, transportConfig = new LogTransportConfig()) {
    return new ConsoleTransport(level, transportConfig);
}
function createLogger(levels) {
    return new Logger(levels);
}
function loggerLoader(injector, level, consoleTransportConfig = new LogTransportConfig(), levels) {
    bindExternalDependencies(injector);
    bindLoggerDependencies(injector);
    const logger = createLogger(levels);
    injector.bind(BINDINGS.log).toConstantValue(logger);
    const consoleTransport = createConsoleTransport(level, consoleTransportConfig);
    injector.injectInto(consoleTransport);
    logger.registerTransport('console', consoleTransport);
    return logger;
}

export { AbilityAssertion, AddingCommitFailedError, AddingSnapshotError, AgendaClient, AgendaCommandScheduler, AgendaCommandSchedulerModule, AgendaScheduledJobTransformer, Aggregate, App, AppConfig, AppError, AppMissingError, Asserter, Assertion, AssertionApiAlreadyExistsError, AssertionError, Assignment, BINDINGS, BaseApp, BoundedContext, CannotRouteMessageError, Client, ClientError, Command, CommandBus, CommandHandlingMixin, CommandSchedulingError, CommandSchedulingService, CommandUnschedulingError, Commit, CommitConcurrencyError, CommitMongoDBObserver, CommitMongoDBStorage, CommitPublisher, CommitReceiver, CommitSerializer, CommitStore, Config, ConsoleTransport, DEFAULTS, DefinableMixin, DetailedLogFormatter, DomainError, DomainException, EJSONSerializerAdapter, BINDINGS as EVEBLE_BINDINGS, EjsonableMixin, ElementAlreadyExistsError, ElementNotFoundError, Entity, EntityError, Eveble, EvebleConfig, Event, EventBus, EventHandlingMixin, EventIdMismatchError, EventSourceable, EventSourceableError, EventSourceableRepository, EventsNotFoundError, Guid, HandlerExistError, HandlerNotFoundError, HandlingError, History, HookAlreadyExistsError, HookError, HookNotFoundError, HookableMixin, IdentifiableAlreadyExistsError, InactiveClientError, InfrastructureError, InitializingMessageAlreadyExistsError, Injector, InjectorError, InjectorMissingError, InvalidAppConfigError, InvalidConfigError, InvalidControllerError, InvalidEnvironmentError, InvalidEventError, InvalidEventSourceableError, InvalidHandlerError, InvalidHookActionError, InvalidHookIdError, InvalidInitializingMessageError, InvalidLegacyTransformerError, InvalidListError, InvalidMessageableType, InvalidModuleError, InvalidSchemaVersionError, InvalidStateError, InvalidStateTransitionError, InvalidStatusError, InvalidStatusTransitionError, InvalidTransportIdError, LITERAL_KEYS, LegacyTransformerAlreadyExistsError, LegacyTransformerNotFoundError, List, ListError, Log, LogMetadata, LogTransport, LogTransportConfig, Logger, LoggingConfig, LoggingError, METADATA_KEYS, Message, MissingEventSourceableError, MissingInitializingMessageError, Module, ModuleError, MongoDBClient, MongoDBCommitStorageModule, MongoDBSnapshotStorageModule, NotVersionableError, OneToManyHandlingMixin, OneToOneHandlingMixin, Process, Projection, ProjectionAlreadyRebuildingError, ProjectionNotRebuildingError, ProjectionRebuilder, ProjectionRebuildingError, RFC5424LoggingMixin, Router, RouterError, SPECIFICATIONS, SavedStateNotFoundError, ScheduleCommand, ScheduledJob, SchedulerError, Serializable, SerializableError, SerializableMixin, SerializationError, Service, SimpleLogFormatter, SnapshotMongoDBStorage, SnapshotSerializer, Snapshotter, StateError, StatefulAssertion, StatefulMixin, StatusError, StatusfulAssertion, StatusfulMixin, StorageNotFoundError, StringifingConverter, Struct, TransportExistsError, UndefinedActionError, UndefinedSnapshotterError, UndefinedSnapshotterFrequencyError, UndefinedStatesError, UndefinedStatusesError, UnhandleableTypeError, UnparsableValueError, UnresolvableIdentifierFromMessageError, UnscheduleCommand, UnsupportedExecutionTypeError, UpdatingCommitError, UpdatingSnapshotError, ValueObject, ValueObjectError, VersionableError, VersionableMixin, convertObjectToCollection, createEJSON, delegate, handle, hasPostConstruct, initial, isDefinable, isEventSourceableType, isPlainRecord, isRecord, loadENV, loggerLoader, route, subscribe, toPlainObject, version };
