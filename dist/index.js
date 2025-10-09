'use strict';

require('reflect-metadata');
var core = require('@eveble/core');
var typend = require('typend');
var helpers = require('@eveble/helpers');
var lodash = require('lodash');
var merge = require('deepmerge');
var core$1 = require('@traits-ts/core');
var deepClone = require('@jsbits/deep-clone');
var getenv = require('getenv');
var decache = require('decache');
var dotenv = require('dotenv-extended');
var uuid = require('uuid');
var Pulse = require('@pulsecron/pulse');
var mongodb = require('mongodb');
var winston = require('winston');
var chalk = require('chalk');
var inversify = require('inversify');
var deepDiff = require('deep-diff');
var reflectParams = require('reflect-params');
var util = require('util');
var hasAnsi = require('has-ansi');
var abbreviate = require('abbreviate');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var winston__namespace = /*#__PURE__*/_interopNamespaceDefault(winston);

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
    Pulse: {
        library: Symbol.for('Pulse.library'),
        clients: {
            CommandScheduler: Symbol.for('Pulse.clients.CommandScheduler'),
        },
        jobTransformer: Symbol.for('Pulse.jobTransformer'),
    },
    CommandScheduler: Symbol.for('CommandScheduler'),
    CommandSchedulingService: Symbol.for('CommandSchedulingService'),
};

const HOOKABLE_KEY = Symbol('eveble:flags:hookable');
const HOOKS_CONTAINER_KEY = Symbol('eveble:containers:hooks');
const DEFAULT_PROPS_KEY = core.CORE_METADATA_KEYS.DEFAULT_PROPS_KEY;
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
const SERIALIZABLE_LIST_PROPS_KEY = core.CORE_METADATA_KEYS.SERIALIZABLE_LIST_PROPS_KEY;
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

class HandlingError extends core.ExtendableError {
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
class SerializationError extends core.ExtendableError {
}
class UnparsableValueError extends SerializationError {
    constructor(got) {
        super(`Value must be parsable string, got ${got}`);
    }
}

/******************************************************************************
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
/* global Reflect, Promise */


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

class HookError extends core.ExtendableError {
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
const HookableTrait = core$1.trait((base) => class extends base {
    registerHook(action, id, hook, shouldOverride = false) {
        if (!lodash.isString(action)) {
            throw new InvalidHookActionError(core.kernel.describer.describe(action));
        }
        if (!lodash.isString(id)) {
            throw new InvalidHookIdError(core.kernel.describer.describe(id));
        }
        const typeName = helpers.getTypeName(this.constructor) || '';
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
        if (!lodash.has(actions, action)) {
            actions[action] = {};
        }
        actions[action][id] = hook;
    }
    overrideHook(action, id, hook) {
        this.registerHook(action, id, hook, true);
    }
    getHook(action, id) {
        const hooks = this.getHooks(action);
        return lodash.get(hooks, id, undefined);
    }
    getHookOrThrow(action, id) {
        const hook = this.getHook(action, id);
        if (!hook) {
            const typeName = helpers.getTypeName(this.constructor) || '';
            throw new HookNotFoundError(typeName, action, id);
        }
        return hook;
    }
    getHooks(action) {
        const matcher = (proto) => typeof proto.getHooks === 'function' &&
            proto.constructor !== HookableTrait;
        const parentProto = typend.getMatchingParentProto(this, matcher);
        const parentHooks = parentProto !== undefined &&
            typeof parentProto.getHooks === 'function'
            ? parentProto.getHooks(action)
            : {};
        const childActions = Reflect.hasOwnMetadata(HOOKS_CONTAINER_KEY, this)
            ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
            : {};
        const childHooks = childActions[action] || {};
        const hooks = merge(parentHooks, childHooks, {
            isMergeableObject: lodash.isPlainObject,
        });
        return hooks;
    }
    getActions() {
        const matcher = (proto) => typeof proto.getActions === 'function' &&
            proto.constructor !== HookableTrait;
        const parentProto = typend.getMatchingParentProto(this, matcher);
        const parentActions = parentProto !== undefined &&
            typeof parentProto.getActions === 'function'
            ? parentProto.getActions()
            : {};
        const childActions = Reflect.hasOwnMetadata(HOOKS_CONTAINER_KEY, this)
            ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
            : {};
        const actions = merge(parentActions, childActions, {
            isMergeableObject: lodash.isPlainObject,
        });
        return actions;
    }
    hasHook(action, id) {
        const actions = this.getActions();
        return lodash.has(actions, `${action}.${id}`);
    }
    hasAction(action) {
        const actions = this.getActions();
        return lodash.has(actions, action);
    }
    removeHook(action, id) {
        const isHookable = Reflect.getOwnMetadata(HOOKABLE_KEY, this.constructor);
        if (!isHookable) {
            return;
        }
        const actions = Reflect.hasOwnMetadata(HOOKS_CONTAINER_KEY, this)
            ? Reflect.getOwnMetadata(HOOKS_CONTAINER_KEY, this)
            : {};
        if (lodash.has(actions, `${action}.${id}`)) {
            delete actions[action][id];
        }
    }
});

function isPlainRecord$1(arg) {
    return lodash.isPlainObject(arg) || arg instanceof typend.Collection;
}
function convertObjectToCollection$1(obj) {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
        if (lodash.isPlainObject(value)) {
            converted[key] = new typend.Collection(value);
        }
        else {
            converted[key] = value;
        }
    }
    return converted;
}
function toPlainObject$1(arg) {
    const plainObj = {};
    for (const key of Reflect.ownKeys(arg)) {
        const value = arg[key.toString()];
        if (typeof (value === null || value === void 0 ? void 0 : value.toPlainObject) === 'function') {
            plainObj[key] = value.toPlainObject();
        }
        else if (isPlainRecord$1(value)) {
            plainObj[key] = toPlainObject$1(value);
        }
        else {
            plainObj[key] = value;
        }
    }
    return plainObj;
}

const INVERSIFY_METADATA_KEY = '@inversifyjs/core/classMetadataReflectKey';
const INVERSIFY_INJECTABLE_FLAG = '@inversifyjs/core/classIsInjectableFlagReflectKey';
function getInversifyMetadata(target) {
    return Reflect.getMetadata(INVERSIFY_METADATA_KEY, target) || null;
}
function getMetadataFromInheritanceChain(target) {
    const metadataList = [];
    let currentTarget = target;
    while (currentTarget &&
        currentTarget !== Object &&
        currentTarget !== Function.prototype) {
        const metadata = getInversifyMetadata(currentTarget);
        if (metadata) {
            metadataList.push(metadata);
        }
        currentTarget = Object.getPrototypeOf(currentTarget);
    }
    return metadataList;
}
function isInjectableClass(target) {
    return Reflect.getMetadata(INVERSIFY_INJECTABLE_FLAG, target) === true;
}
function getInjectedPropertyNames(target) {
    const metadataList = getMetadataFromInheritanceChain(target);
    const propertyNames = new Set();
    for (const metadata of metadataList) {
        if (metadata === null || metadata === void 0 ? void 0 : metadata.properties) {
            for (const propName of metadata.properties.keys()) {
                propertyNames.add(propName);
            }
        }
    }
    return Array.from(propertyNames);
}
function getInjectedParameterIndices(target) {
    const metadata = getInversifyMetadata(target);
    if (!metadata || !metadata.constructorArguments) {
        return [];
    }
    return metadata.constructorArguments
        .map((_, index) => index)
        .filter((index) => metadata.constructorArguments[index] !== undefined);
}
function getInjectedPropertyDetails(target) {
    const metadataList = getMetadataFromInheritanceChain(target);
    const result = new Map();
    for (let i = metadataList.length - 1; i >= 0; i--) {
        const metadata = metadataList[i];
        if (metadata === null || metadata === void 0 ? void 0 : metadata.properties) {
            for (const [propName, propMetadata] of metadata.properties.entries()) {
                result.set(propName, {
                    serviceIdentifier: propMetadata.value,
                    optional: propMetadata.optional,
                    name: propMetadata.name,
                    tags: propMetadata.tags,
                });
            }
        }
    }
    return result;
}
function hasPostConstruct(target) {
    var _a, _b;
    const metadataList = getMetadataFromInheritanceChain(target);
    for (const metadata of metadataList) {
        if (((_b = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.lifecycle) === null || _a === void 0 ? void 0 : _a.postConstructMethodNames) === null || _b === void 0 ? void 0 : _b.size) > 0) {
            return true;
        }
    }
    return false;
}
function getPostConstructMethodNames(target) {
    var _a;
    const metadataList = getMetadataFromInheritanceChain(target);
    const methodNames = new Set();
    for (const metadata of metadataList) {
        if ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.lifecycle) === null || _a === void 0 ? void 0 : _a.postConstructMethodNames) {
            for (const methodName of metadata.lifecycle.postConstructMethodNames) {
                methodNames.add(methodName);
            }
        }
    }
    return Array.from(methodNames);
}
function hasPreDestroy(target) {
    var _a, _b;
    const metadataList = getMetadataFromInheritanceChain(target);
    for (const metadata of metadataList) {
        if (((_b = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.lifecycle) === null || _a === void 0 ? void 0 : _a.preDestroyMethodNames) === null || _b === void 0 ? void 0 : _b.size) > 0) {
            return true;
        }
    }
    return false;
}
function getPreDestroyMethodNames(target) {
    var _a;
    const metadataList = getMetadataFromInheritanceChain(target);
    const methodNames = new Set();
    for (const metadata of metadataList) {
        if ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.lifecycle) === null || _a === void 0 ? void 0 : _a.preDestroyMethodNames) {
            for (const methodName of metadata.lifecycle.preDestroyMethodNames) {
                methodNames.add(methodName);
            }
        }
    }
    return Array.from(methodNames);
}
function getMetadataSummary(target) {
    const metadata = getInversifyMetadata(target);
    return {
        isInjectable: isInjectableClass(target),
        injectedProperties: getInjectedPropertyNames(target),
        injectedParameters: getInjectedParameterIndices(target),
        postConstructMethods: getPostConstructMethodNames(target),
        preDestroyMethods: getPreDestroyMethodNames(target),
        scope: metadata === null || metadata === void 0 ? void 0 : metadata.scope,
    };
}
function debugInversifyMetadata(target) {
    console.log('\n=== INVERSIFY METADATA DEBUG ===');
    console.log('Target:', target.name);
    console.log('Is Injectable:', isInjectableClass(target));
    const metadataList = getMetadataFromInheritanceChain(target);
    console.log(`\nInheritance chain depth: ${metadataList.length}`);
    metadataList.forEach((metadata, index) => {
        console.log(`\n--- Level ${index} ---`);
        console.log('Injected Properties:');
        if (metadata.properties.size === 0) {
            console.log('  (none)');
        }
        else {
            for (const [name, details] of metadata.properties.entries()) {
                console.log(`  - ${name}:`, {
                    serviceId: details.value,
                    optional: details.optional,
                    name: details.name,
                    tags: Array.from(details.tags.entries()),
                });
            }
        }
        console.log('Constructor Arguments:');
        if (metadata.constructorArguments.length === 0) {
            console.log('  (none)');
        }
        else {
            metadata.constructorArguments.forEach((arg, idx) => {
                console.log(`  [${idx}]:`, arg);
            });
        }
        console.log('Lifecycle Hooks:');
        console.log('  @postConstruct:', Array.from(metadata.lifecycle.postConstructMethodNames));
        console.log('  @preDestroy:', Array.from(metadata.lifecycle.preDestroyMethodNames));
        console.log('Scope:', metadata.scope);
    });
}
function getAllClassProperties(target) {
    const props = new Set();
    let currentTarget = target;
    while (currentTarget &&
        currentTarget !== Object &&
        currentTarget !== Function.prototype) {
        const ownProps = Object.getOwnPropertyNames(currentTarget.prototype);
        ownProps.forEach((prop) => {
            if (prop !== 'constructor') {
                props.add(prop);
            }
        });
        currentTarget = Object.getPrototypeOf(currentTarget);
    }
    return Array.from(props);
}
function getPropertiesToValidate(target) {
    const allProps = getAllClassProperties(target);
    const injectedProps = getInjectedPropertyNames(target);
    const postConstructMethods = getPostConstructMethodNames(target);
    const preDestroyMethods = getPreDestroyMethodNames(target);
    const excludedProps = new Set([
        ...injectedProps,
        ...postConstructMethods,
        ...preDestroyMethods,
    ]);
    return allProps.filter((prop) => !excludedProps.has(prop));
}
function isPropertyInjected(target, propertyName) {
    const injectedProps = getInjectedPropertyNames(target);
    return injectedProps.includes(propertyName);
}

const EXCLUDED_PROP_TYPES_KEY = 'excludedPropTypes';
const TypeTrait = core$1.trait((base) => { var _a; return _a = class extends base {
        getPropTypes() {
            const classPattern = core.kernel.converter.convert(this.constructor);
            const props = classPattern.properties;
            return lodash.omit(props, this.constructor[EXCLUDED_PROP_TYPES_KEY]);
        }
        getPropertyInitializers() {
            const parentInitializers = this.getParentInitializers();
            const instanceInitializers = this.getInstanceInitializers();
            const defaults = merge(parentInitializers, instanceInitializers, {
                isMergeableObject: isPlainRecord$1,
            });
            return defaults;
        }
        getInstanceInitializers() {
            return Reflect.getMetadata(DEFAULT_PROPS_KEY, this.constructor) || {};
        }
        getParentInitializers() {
            const matcher = (evaluatedProto) => typeof evaluatedProto.getInstanceInitializers === 'function';
            const parentProto = typend.getMatchingParentProto(this.constructor.prototype, matcher);
            if (parentProto === undefined)
                return {};
            return parentProto.getInstanceInitializers();
        }
        toPlainObject() {
            const propsKeys = Object.keys(this.getPropTypes());
            const plainObj = deepClone(toPlainObject$1(this));
            return lodash.pick(plainObj, propsKeys);
        }
        validateProps(props = {}, propTypes, isStrict = true) {
            if (!core.kernel.isValidating()) {
                return true;
            }
            try {
                return core.kernel.validator.validate(props, propTypes, isStrict);
            }
            catch (error) {
                const { message } = error;
                const typeName = helpers.getTypeName(this);
                throw new error.constructor(`${typeName}: ${message}`);
            }
        }
        equals(other) {
            return (other !== null &&
                other.constructor === this.constructor &&
                this.hasSameValues(other));
        }
        hasSameValues(other) {
            var _b;
            let hasSameValues = true;
            for (const key in this.getPropTypes()) {
                if (typeof ((_b = this[key]) === null || _b === void 0 ? void 0 : _b.equals) === 'function') {
                    if (!this[key].equals(other[key])) {
                        hasSameValues = false;
                        break;
                    }
                }
                else if (!lodash.isEqual(this[key], other[key])) {
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
    },
    _a.excludedPropTypes = [],
    _a; });

class Struct extends core$1.derive(TypeTrait, HookableTrait) {
    constructor(props = {}) {
        super();
        if (Reflect.getMetadata(DELEGATED_KEY, this.constructor) !== true &&
            Reflect.getMetadata(core.METADATA_KEYS.DEFAULT_PROPS_KEY, this.constructor) ===
                undefined) {
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
            isMergeableObject: isPlainRecord$1,
        });
        const hooks = this.getHooks('onConstruction');
        for (const hook of Object.values(hooks)) {
            hook.bind(this)(processedProps);
        }
        return processedProps;
    }
    onValidation(props) {
        const dependencyMappings = getInjectedPropertyNames(this.constructor);
        const propTypes = lodash.omit(this.getPropTypes(), dependencyMappings);
        const result = this.validateProps(props, propTypes, true);
        const hooks = this.getHooks('onValidation');
        for (const hook of Object.values(hooks)) {
            hook.bind(this)(props);
        }
        return result;
    }
}

const SerializableTrait = core$1.trait((base) => class extends base {
    getTypeName() {
        return helpers.getTypeName(this);
    }
    toString() {
        return this.getTypeName();
    }
    static toString() {
        return this.getTypeName();
    }
    static getTypeName() {
        return helpers.getTypeName(this);
    }
    toJSONValue() {
        var _a;
        return (_a = core.kernel.serializer) === null || _a === void 0 ? void 0 : _a.toJSONValue(this);
    }
});

const EjsonableTrait = core$1.trait([SerializableTrait], (base) => class extends base {
    typeName() {
        return this.getTypeName();
    }
    static typeName() {
        return this.getTypeName();
    }
});

class VersionableError extends core.ExtendableError {
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
const VersionableTrait = core$1.trait((base) => class extends base {
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
        if (!lodash.isNumber(schemaVersion)) {
            throw new InvalidSchemaVersionError(helpers.getTypeName(this.constructor), core.kernel.describer.describe(schemaVersion));
        }
        if (this.hasLegacyTransformer(schemaVersion) && !shouldOverride) {
            throw new LegacyTransformerAlreadyExistsError(helpers.getTypeName(this.constructor), schemaVersion);
        }
        const typeName = helpers.getTypeName(this.constructor);
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
        const typeName = helpers.getTypeName(this.constructor) || '';
        const transformers = this.getLegacyTransformers();
        if (!transformers.has(schemaVersion)) {
            throw new LegacyTransformerNotFoundError(typeName, schemaVersion);
        }
        return transformers.get(schemaVersion);
    }
    getSchemaVersion() {
        return this.schemaVersion;
    }
});

exports.SerializableError = class SerializableError extends core$1.derive(TypeTrait, HookableTrait, EjsonableTrait, VersionableTrait, core.ExtendableError) {
    constructor(propsOrMessage) {
        let props = {};
        if (typeof propsOrMessage === 'string') {
            props.message = propsOrMessage;
        }
        else if (propsOrMessage !== undefined) {
            props = propsOrMessage;
        }
        const errorProps = lodash.pick(props, [
            'message',
            'name',
            'stack',
            'code',
        ]);
        super(errorProps);
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
            isMergeableObject: isPlainRecord$1,
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
exports.SerializableError = __decorate([
    core.Type('SerializableError')({ kind: 19, name: "SerializableError", properties: { "name": { kind: 2, modifiers: 1 }, "message": { kind: 2, modifiers: 1 }, "stack": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }] }, "code": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] }, "schemaVersion": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], exports.SerializableError);

exports.DomainError = class DomainError extends exports.SerializableError {
};
exports.DomainError = __decorate([
    core.Type('DomainError')({ kind: 19, name: "DomainError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.SerializableError, arguments: [] } })
], exports.DomainError);

exports.AssertionError = class AssertionError extends exports.DomainError {
};
exports.AssertionError = __decorate([
    core.Type('AssertionError')({ kind: 19, name: "AssertionError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.DomainError, arguments: [] } })
], exports.AssertionError);
exports.UndefinedActionError = class UndefinedActionError extends exports.AssertionError {
    constructor(entityName, assertionApi) {
        super(`${entityName}: action name is not set while using assertion '${assertionApi}'. Please define action by using 'entity.on('action-name-as-string').${assertionApi}(...)' or 'entity.on(MyCommandType).ensure.${assertionApi}(...)`);
    }
};
exports.UndefinedActionError = __decorate([
    core.Type('UndefinedActionError')({ kind: 19, name: "UndefinedActionError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "entityName", modifiers: 0, type: { kind: 2 } }, { name: "assertionApi", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.AssertionError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.UndefinedActionError);
exports.ListError = class ListError extends exports.DomainError {
};
exports.ListError = __decorate([
    core.Type('ListError')({ kind: 19, name: "ListError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.DomainError, arguments: [] } })
], exports.ListError);
exports.IdentifiableAlreadyExistsError = class IdentifiableAlreadyExistsError extends exports.ListError {
    constructor(props) {
        const { sourceName, listKey, identifiableName, key, value } = props;
        const sourceId = props.sourceId ? `@${props.sourceId}` : ``;
        const message = `${sourceName}${sourceId}: already has '${identifiableName}' with ${key} '${value}' on '${listKey}' list`;
        super({ message });
    }
};
exports.IdentifiableAlreadyExistsError = __decorate([
    core.Type('IdentifiableAlreadyExistsError')({ kind: 19, name: "IdentifiableAlreadyExistsError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, properties: { "sourceName": { kind: 2, modifiers: 0 }, "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "listKey": { kind: 2, modifiers: 0 }, "identifiableName": { kind: 2, modifiers: 0 }, "key": { kind: 2, modifiers: 0 }, "value": { kind: 2, modifiers: 0 } } } }] }], extends: { kind: 18, type: exports.ListError, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.IdentifiableAlreadyExistsError);
exports.ElementAlreadyExistsError = class ElementAlreadyExistsError extends exports.ListError {
    constructor(props) {
        const { sourceName, listKey, serializableName, element } = props;
        const sourceId = props.sourceId ? `@${props.sourceId}` : ``;
        const message = `${sourceName}${sourceId}: already has same '${serializableName}' on '${listKey}' list`;
        super({ message, element });
    }
};
exports.ElementAlreadyExistsError = __decorate([
    core.Type('ElementAlreadyExistsError')({ kind: 19, name: "ElementAlreadyExistsError", properties: { "element": { kind: 15, modifiers: 0, name: "Serializable", properties: { "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, properties: { "sourceName": { kind: 2, modifiers: 0 }, "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "listKey": { kind: 2, modifiers: 0 }, "serializableName": { kind: 2, modifiers: 0 }, "element": { kind: 15, modifiers: 0, name: "Serializable", properties: { "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } } } } }] }], extends: { kind: 18, type: exports.ListError, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.ElementAlreadyExistsError);
exports.ElementNotFoundError = class ElementNotFoundError extends exports.ListError {
    constructor(props) {
        const { sourceName, listKey, serializableName, key, value } = props;
        const sourceId = props.sourceId ? `@${props.sourceId}` : ``;
        const message = `${sourceName}${sourceId}: does not contain '${serializableName}' with ${key} '${value}' on '${listKey}' list`;
        super({ message });
    }
};
exports.ElementNotFoundError = __decorate([
    core.Type('ElementNotFoundError')({ kind: 19, name: "ElementNotFoundError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, properties: { "sourceName": { kind: 2, modifiers: 0 }, "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "listKey": { kind: 2, modifiers: 0 }, "serializableName": { kind: 2, modifiers: 0 }, "key": { kind: 2, modifiers: 0 }, "value": { kind: 2, modifiers: 0 } } } }] }], extends: { kind: 18, type: exports.ListError, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.ElementNotFoundError);
exports.InvalidListError = class InvalidListError extends exports.ListError {
    constructor(sourceName, listName) {
        super(`${sourceName}: list '${listName}' is not a serializable list property type`);
    }
};
exports.InvalidListError = __decorate([
    core.Type('InvalidListError')({ kind: 19, name: "InvalidListError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "sourceName", modifiers: 0, type: { kind: 2 } }, { name: "listName", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.ListError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.InvalidListError);
exports.ValueObjectError = class ValueObjectError extends exports.SerializableError {
};
exports.ValueObjectError = __decorate([
    core.Type('ValueObjectError')({ kind: 19, name: "ValueObjectError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.SerializableError, arguments: [] } })
], exports.ValueObjectError);
exports.EntityError = class EntityError extends exports.DomainError {
};
exports.EntityError = __decorate([
    core.Type('EntityError')({ kind: 19, name: "EntityError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.DomainError, arguments: [] } })
], exports.EntityError);
exports.SavedStateNotFoundError = class SavedStateNotFoundError extends exports.EntityError {
    constructor(esTypeName, id) {
        super(`${esTypeName}@${id}: expected entity to be have state saved before rollbacking it`);
    }
};
exports.SavedStateNotFoundError = __decorate([
    core.Type('SavedStateNotFoundError')({ kind: 19, name: "SavedStateNotFoundError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "esTypeName", modifiers: 0, type: { kind: 2 } }, { name: "id", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.EntityError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.SavedStateNotFoundError);
exports.EventSourceableError = class EventSourceableError extends exports.DomainError {
};
exports.EventSourceableError = __decorate([
    core.Type('EventSourceableError')({ kind: 19, name: "EventSourceableError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.DomainError, arguments: [] } })
], exports.EventSourceableError);
exports.InvalidEventError = class InvalidEventError extends exports.EventSourceableError {
    constructor(esTypeName, got) {
        super(`${esTypeName}: event must be instance of Event, got ${got}`);
    }
};
exports.InvalidEventError = __decorate([
    core.Type('InvalidEventError')({ kind: 19, name: "InvalidEventError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "esTypeName", modifiers: 0, type: { kind: 2 } }, { name: "got", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.EventSourceableError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.InvalidEventError);
exports.EventIdMismatchError = class EventIdMismatchError extends exports.EventSourceableError {
    constructor(esTypeName, expectedId, got) {
        super(`${esTypeName}: the given event has mismatching source id. Expected id '${expectedId}', got '${got}'`);
    }
};
exports.EventIdMismatchError = __decorate([
    core.Type('EventIdMismatchError')({ kind: 19, name: "EventIdMismatchError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "esTypeName", modifiers: 0, type: { kind: 2 } }, { name: "expectedId", modifiers: 0, type: { kind: 2 } }, { name: "got", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.EventSourceableError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], exports.EventIdMismatchError);
exports.InvalidInitializingMessageError = class InvalidInitializingMessageError extends exports.EventSourceableError {
    constructor(esTypeName, expected, got) {
        super(`${esTypeName}: the given initializing message is not one of allowed types. Expected ${expected}, got ${got}`);
    }
};
exports.InvalidInitializingMessageError = __decorate([
    core.Type('InvalidInitializingMessageError')({ kind: 19, name: "InvalidInitializingMessageError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "esTypeName", modifiers: 0, type: { kind: 2 } }, { name: "expected", modifiers: 0, type: { kind: 2 } }, { name: "got", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.EventSourceableError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], exports.InvalidInitializingMessageError);
exports.EmptyStringError = class EmptyStringError extends exports.ValueObjectError {
    constructor(typeName) {
        super(`${typeName}: can't be an empty string`);
    }
};
exports.EmptyStringError = __decorate([
    core.Type('EmptyStringError')({ kind: 19, name: "EmptyStringError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "typeName", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.ValueObjectError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], exports.EmptyStringError);
let UnimplementedError = class UnimplementedError extends exports.ValueObjectError {
    constructor() {
        super(`Not implemented`);
    }
};
UnimplementedError = __decorate([
    core.Type('UnimplementedError')({ kind: 19, name: "UnimplementedError", properties: {}, constructors: [{ modifiers: 0, parameters: [] }], extends: { kind: 18, type: exports.ValueObjectError, arguments: [] } }),
    __metadata("design:paramtypes", [])
], UnimplementedError);

const TYPE_KEY = '_type';
const HANDLERS = 'eveble:handlers';
const HANDLEABLE_TYPES = 'eveble:handleable-types';
const SOURCE_KEY = Symbol('eveble:source');
const LIST_KEY = Symbol('eveble:list-key');
const SERIALIZABLE_TYPE_KEY = Symbol('eveble:serializable-type');
const SAVE_STATE_METHOD_KEY = Symbol('eveble:save-state');
const SAVED_STATE_KEY = Symbol('eveble:saved-state');
const ENABLE_ACTION_VALIDATION_METHOD_KEY = Symbol('eveble:enable-action-validation');
const DISABLE_ACTION_VALIDATION_METHOD_KEY = Symbol('eveble:disable-action-validation');
const IS_ACTION_VALIDATED_METHOD_KEY = Symbol('eveble:is-action-validated');
const ACTION_VALIDATION_KEY = Symbol('eveble:action-validation');
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
const NON_ENUMERABLE_VALUE_KEY = '__value__';

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
            if (Array.isArray(serializables)) {
                this.push(...serializables);
            }
        }
    }
    toPlainObject() {
        return this.map((value) => {
            if (typeof (value === null || value === void 0 ? void 0 : value.toPlainObject) === 'function') {
                return value.toPlainObject();
            }
            return value.valueOf();
        });
    }
    create(...sources) {
        const element = this[SERIALIZABLE_TYPE_KEY].from(...sources);
        this.add(element);
        return element;
    }
    add(element) {
        core.kernel.validator.validate(element, this[SERIALIZABLE_TYPE_KEY]);
        if (typeof element.getId === 'function') {
            const identifiable = element;
            if (this.hasById(identifiable.getId())) {
                throw new exports.IdentifiableAlreadyExistsError({
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
            throw new exports.ElementAlreadyExistsError({
                sourceName: this[SOURCE_KEY].getTypeName(),
                sourceId: this.getSourceIdAsString(),
                listKey: this[LIST_KEY],
                serializableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
                element,
            });
        }
        this.getSource()[this.getListKey()].push(element);
    }
    overrideBy(key, value, element) {
        const foundSerializable = this.getBy(key, value);
        if (foundSerializable === undefined) {
            this.add(element);
        }
        else {
            this.getSource()[this.getListKey()][this.indexOf(foundSerializable)] =
                element;
        }
    }
    getBy(key, value) {
        let foundSerializable;
        for (const serializable of this.getSource()[this.getListKey()]) {
            if (serializable[key] === undefined) {
                continue;
            }
            if (lodash.isFunction(serializable[key].equals)) {
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
            throw new exports.ElementNotFoundError({
                sourceName: this[SOURCE_KEY].getTypeName(),
                sourceId: this.getSourceIdAsString(),
                listKey: this[LIST_KEY],
                serializableName: this[SERIALIZABLE_TYPE_KEY].getTypeName(),
                key,
                value: core.kernel.describer.describe(value),
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
            throw new exports.ElementNotFoundError({
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
    findByIdOrFail(id) {
        return this.getByIdOrThrow(id);
    }
    findBy(key, value) {
        return this.getByOrThrow(key, value);
    }
    findByOrFail(key, value) {
        return this.getByOrThrow(key, value);
    }
    hasBy(key, value) {
        return this.getBy(key, value) !== undefined;
    }
    hasSame(element) {
        return this.some((serializable) => serializable.equals(element));
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
            this.getSource()[this.getListKey()][this.indexOf(foundSerializable)] =
                element;
        }
    }
    replaceBy(key, value, element) {
        const foundSerializable = this.getBy(key, value);
        if (foundSerializable === undefined) {
            this.add(element);
        }
        else {
            this.getSource()[this.getListKey()][this.indexOf(foundSerializable)] =
                element;
        }
    }
    removeById(id) {
        const foundSerializable = this.getById(id);
        if (foundSerializable !== undefined) {
            lodash.pull(this.getSource()[this.getListKey()], foundSerializable);
        }
    }
    removeBy(key, value) {
        const foundSerializable = this.getBy(key, value);
        if (foundSerializable !== undefined) {
            lodash.pull(this.getSource()[this.getListKey()], foundSerializable);
        }
    }
    deleteById(id) {
        const foundSerializable = this.getById(id);
        if (foundSerializable !== undefined) {
            lodash.pull(this.getSource()[this.getListKey()], foundSerializable);
        }
    }
    deleteBy(key, value) {
        const foundSerializable = this.getBy(key, value);
        if (foundSerializable !== undefined) {
            lodash.pull(this.getSource()[this.getListKey()], foundSerializable);
        }
    }
    first() {
        return this.getSource()[this.getListKey()][0];
    }
    last() {
        return lodash.last(this.getSource()[this.getListKey()]);
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

exports.Serializable = class Serializable extends core$1.derive(EjsonableTrait, VersionableTrait, Struct) {
    constructor(props = {}) {
        super(props);
    }
    in(listName) {
        if (this[listName] === undefined) {
            throw new exports.InvalidListError(this.typeName(), listName);
        }
        let ListCnstr = this.getPropTypes()[listName];
        if (ListCnstr === undefined) {
            throw new exports.InvalidListError(this.typeName(), listName);
        }
        if (ListCnstr.constructor.name === 'List') {
            ListCnstr = ListCnstr[0];
        }
        if (ListCnstr instanceof typend.InstanceOf) {
            ListCnstr = ListCnstr[0];
        }
        return new List(this, listName, ListCnstr, this[listName]);
    }
    static from(...sources) {
        const propTypes = this.getPropTypes();
        const propKeys = Object.keys(propTypes);
        const pickedProps = {};
        for (const source of sources) {
            Object.assign(pickedProps, lodash.pick(source, propKeys));
        }
        return new this(pickedProps);
    }
};
exports.Serializable = __decorate([
    core.Type('Serializable')({ kind: 19, name: "Serializable", properties: { "schemaVersion": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, initializer: () => ({}), name: "__type", properties: {} } }] }], extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], exports.Serializable);

function isTyped(arg) {
    if (arg == null)
        return false;
    return ((arg instanceof Struct || typend.instanceOf({ kind: 15, name: "Typed", properties: { "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 } } })(arg)) &&
        typend.isType(arg.constructor));
}
function isRecord(arg) {
    return (lodash.isPlainObject(arg) || helpers.isClassInstance(arg) || arg instanceof typend.Collection);
}
function isPlainRecord(arg) {
    return lodash.isPlainObject(arg) || arg instanceof typend.Collection;
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
        if (lodash.isPlainObject(value)) {
            converted[key] = new typend.Collection(value);
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

exports.Message = class Message extends exports.Serializable {
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
        return !lodash.isEmpty(this.metadata);
    }
    getMetadata() {
        return this.metadata || {};
    }
    setCorrelationId(key, id) {
        lodash.set(this.metadata, `correlation.${key}`, id.toString());
    }
    getCorrelationId(key) {
        if (!this.hasMetadata()) {
            return undefined;
        }
        return lodash.get(this.metadata, `correlation.${key}`);
    }
    hasCorrelationId(key) {
        if (!this.hasMetadata()) {
            return false;
        }
        return lodash.has(this.metadata, `correlation.${key}`);
    }
};
exports.Message = __decorate([
    core.Type('Message')({ kind: 19, name: "Message", properties: { "timestamp": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, initializer: () => ({}), name: "__type", properties: {} } }] }], extends: { kind: 18, type: exports.Serializable, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.Message);

exports.ValueObject = class ValueObject extends exports.Serializable {
};
exports.ValueObject = __decorate([
    core.Type('ValueObject')({ kind: 19, name: "ValueObject", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, initializer: () => ({}), name: "__type", properties: {} } }] }], extends: { kind: 18, type: exports.Serializable, arguments: [] } })
], exports.ValueObject);

var Guid_1;
let InvalidGuidValueError = class InvalidGuidValueError extends exports.ValueObjectError {
    constructor(got) {
        super(`Guid: Expected string as a valid guid, got ${got}`);
    }
};
InvalidGuidValueError = __decorate([
    core.Type('InvalidGuidValueError')({ kind: 19, name: "InvalidGuidValueError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "got", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.ValueObjectError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], InvalidGuidValueError);
exports.Guid = Guid_1 = class Guid extends exports.ValueObject {
    constructor(propsOrVal) {
        const props = lodash.isPlainObject(propsOrVal)
            ? { id: propsOrVal.id }
            : { id: propsOrVal };
        if (props.id !== undefined) {
            if (!Guid_1.isValid(props.id)) {
                throw new InvalidGuidValueError(core.kernel.describer.describe(props.id));
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
        return new Guid_1(uuid.v4().toString());
    }
    static isValid(id) {
        return lodash.isString(id) && this.pattern.test(id.toString());
    }
};
exports.Guid.pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
exports.Guid = Guid_1 = __decorate([
    core.Type('Guid')({ kind: 19, name: "Guid", properties: { "id": { kind: 2, modifiers: 0 } }, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrVal", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, properties: { "id": { kind: 2, modifiers: 0 } } }] } }] }], extends: { kind: 18, type: exports.ValueObject, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.Guid);

exports.Assignment = class Assignment extends exports.Serializable {
};
exports.Assignment = __decorate([
    core.Type('Assignment')({ kind: 19, name: "Assignment", properties: { "assignmentId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "deliverAt": { kind: 18, modifiers: 0, type: Date, arguments: [] }, "assignerId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "assignerType": { kind: 2, modifiers: 0 } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, initializer: () => ({}), name: "__type", properties: {} } }] }], extends: { kind: 18, type: exports.Serializable, arguments: [] } })
], exports.Assignment);
exports.Command = class Command extends exports.Message {
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
        return lodash.get(this, 'metadata.scheduling', undefined);
    }
    isScheduled() {
        if (!this.hasMetadata()) {
            return false;
        }
        const metadata = this.getMetadata();
        return lodash.has(metadata, 'scheduling');
    }
    isDeliverable() {
        var _a;
        const metadata = this.getMetadata();
        return (this.isScheduled() &&
            new Date().getTime() >= ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.scheduling) === null || _a === void 0 ? void 0 : _a.deliverAt));
    }
};
exports.Command = __decorate([
    core.Type('Command')({ kind: 19, name: "Command", properties: { "targetId": { kind: 17, modifiers: 1, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 999 } }] }], extends: { kind: 18, type: exports.Message, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.Command);

function handle(target, methodName, index) {
    if (!typend.instanceOf({ kind: 15, name: "Controller", properties: { "initialize": { kind: 21, modifiers: 0 }, "handles": { kind: 21, modifiers: 0 }, "subscribes": { kind: 21, modifiers: 0 }, "registerHandler": { kind: 21, modifiers: 0 }, "overrideHandler": { kind: 21, modifiers: 0 }, "hasHandler": { kind: 21, modifiers: 0 }, "getHandler": { kind: 21, modifiers: 0 }, "getHandlerOrThrow": { kind: 21, modifiers: 0 }, "removeHandler": { kind: 21, modifiers: 0 }, "getHandlers": { kind: 21, modifiers: 0 }, "setHandleableTypes": { kind: 21, modifiers: 0 }, "getHandleableTypes": { kind: 21, modifiers: 0 }, "ensureHandleability": { kind: 21, modifiers: 0 }, "isHandleabe": { kind: 21, modifiers: 0 }, "getHandledTypes": { kind: 21, modifiers: 0 }, "getHandled": { kind: 21, modifiers: 0 }, "handle": { kind: 21, modifiers: 0 } } })(target)) {
        throw new InvalidControllerError(helpers.getTypeName(target.constructor));
    }
    const params = Reflect.getMetadata('design:paramtypes', target, methodName);
    const command = params[index];
    if (!((command === null || command === void 0 ? void 0 : command.prototype) instanceof exports.Command)) {
        throw new UnhandleableTypeError(helpers.getTypeName(target.constructor), core.kernel.describer.describe([exports.Command]), core.kernel.describer.describe(command));
    }
    const typeName = helpers.getTypeName(target.constructor);
    const isHandling = Reflect.getMetadata(HANDLER_KEY, target.constructor) === typeName;
    if (!isHandling) {
        Reflect.defineMetadata(COMMAND_HANDLERS_CONTAINER_KEY, new Map(), target.constructor.prototype);
        Reflect.defineMetadata(HANDLER_KEY, typeName, target.constructor);
    }
    const handlers = Reflect.getMetadata(COMMAND_HANDLERS_CONTAINER_KEY, target.constructor.prototype);
    handlers.set(command, target[methodName]);
}

exports.Event = class Event extends exports.Message {
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
exports.Event = __decorate([
    core.Type('Event')({ kind: 19, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 1, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "version": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 999 } }] }], extends: { kind: 18, type: exports.Message, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.Event);

function subscribe(target, propertyName, index) {
    if (!typend.instanceOf({ kind: 15, name: "Controller", properties: { "initialize": { kind: 21, modifiers: 0 }, "handles": { kind: 21, modifiers: 0 }, "subscribes": { kind: 21, modifiers: 0 }, "registerHandler": { kind: 21, modifiers: 0 }, "overrideHandler": { kind: 21, modifiers: 0 }, "hasHandler": { kind: 21, modifiers: 0 }, "getHandler": { kind: 21, modifiers: 0 }, "getHandlerOrThrow": { kind: 21, modifiers: 0 }, "removeHandler": { kind: 21, modifiers: 0 }, "getHandlers": { kind: 21, modifiers: 0 }, "setHandleableTypes": { kind: 21, modifiers: 0 }, "getHandleableTypes": { kind: 21, modifiers: 0 }, "ensureHandleability": { kind: 21, modifiers: 0 }, "isHandleabe": { kind: 21, modifiers: 0 }, "getHandledTypes": { kind: 21, modifiers: 0 }, "getHandled": { kind: 21, modifiers: 0 }, "handle": { kind: 21, modifiers: 0 } } })(target)) {
        throw new InvalidControllerError(helpers.getTypeName(target.constructor));
    }
    const params = Reflect.getMetadata('design:paramtypes', target, propertyName);
    const event = params[index];
    if (event === undefined) {
        throw new Error(`Unable to identify Event type for method on '${helpers.getTypeName(target.constructor)}::${propertyName}'. This can happen because of circular dependency definition used while defining typeorm 'OneToMany' or 'ManyToOne' relations.\n\nPlease ensure, that in such case - both files are not referencing each other. Replace any definition of the relating parent Entity on child using 'any' type.`);
    }
    if (!((event === null || event === void 0 ? void 0 : event.prototype) instanceof exports.Event)) {
        throw new UnhandleableTypeError(helpers.getTypeName(target.constructor), core.kernel.describer.describe([exports.Event]), core.kernel.describer.describe(event));
    }
    const typeName = helpers.getTypeName(target.constructor);
    const isSubscribing = Reflect.getMetadata(SUBSCRIBER_KEY, target.constructor) === typeName;
    if (!isSubscribing) {
        Reflect.defineMetadata(EVENT_HANDLERS_CONTAINER_KEY, new Map(), target.constructor.prototype);
        Reflect.defineMetadata(SUBSCRIBER_KEY, typeName, target.constructor);
    }
    const handlers = Reflect.getMetadata(EVENT_HANDLERS_CONTAINER_KEY, target.constructor.prototype);
    handlers.set(event, target[propertyName]);
}

function initial(target, methodName, index) {
    if (!typend.instanceOf({ kind: 15, name: "Controller", properties: { "initialize": { kind: 21, modifiers: 0 }, "handles": { kind: 21, modifiers: 0 }, "subscribes": { kind: 21, modifiers: 0 }, "registerHandler": { kind: 21, modifiers: 0 }, "overrideHandler": { kind: 21, modifiers: 0 }, "hasHandler": { kind: 21, modifiers: 0 }, "getHandler": { kind: 21, modifiers: 0 }, "getHandlerOrThrow": { kind: 21, modifiers: 0 }, "removeHandler": { kind: 21, modifiers: 0 }, "getHandlers": { kind: 21, modifiers: 0 }, "setHandleableTypes": { kind: 21, modifiers: 0 }, "getHandleableTypes": { kind: 21, modifiers: 0 }, "ensureHandleability": { kind: 21, modifiers: 0 }, "isHandleabe": { kind: 21, modifiers: 0 }, "getHandledTypes": { kind: 21, modifiers: 0 }, "getHandled": { kind: 21, modifiers: 0 }, "handle": { kind: 21, modifiers: 0 } } })(target)) {
        throw new InvalidControllerError(helpers.getTypeName(target.constructor));
    }
    const params = Reflect.getMetadata('design:paramtypes', target, methodName);
    const message = params[index];
    if (!((message === null || message === void 0 ? void 0 : message.prototype) instanceof exports.Command) &&
        !((message === null || message === void 0 ? void 0 : message.prototype) instanceof exports.Event)) {
        throw new UnhandleableTypeError(helpers.getTypeName(target.constructor), core.kernel.describer.describe([exports.Command]), core.kernel.describer.describe(message));
    }
    const initializingMessage = Reflect.getOwnMetadata(INITIALIZING_MESSAGE_KEY, target.constructor.prototype);
    if (initializingMessage === undefined) {
        Reflect.defineMetadata(INITIALIZING_MESSAGE_KEY, message, target.constructor.prototype);
    }
    else {
        throw new InitializingMessageAlreadyExistsError(target.getTypeName(), initializingMessage.getTypeName(), message.getTypeName());
    }
    if (message.prototype instanceof exports.Command) {
        handle(target, methodName, index);
    }
    else {
        subscribe(target, methodName, index);
    }
}

function route(target, methodName, index) {
    if (!typend.instanceOf({ kind: 15, name: "Controller", properties: { "initialize": { kind: 21, modifiers: 0 }, "handles": { kind: 21, modifiers: 0 }, "subscribes": { kind: 21, modifiers: 0 }, "registerHandler": { kind: 21, modifiers: 0 }, "overrideHandler": { kind: 21, modifiers: 0 }, "hasHandler": { kind: 21, modifiers: 0 }, "getHandler": { kind: 21, modifiers: 0 }, "getHandlerOrThrow": { kind: 21, modifiers: 0 }, "removeHandler": { kind: 21, modifiers: 0 }, "getHandlers": { kind: 21, modifiers: 0 }, "setHandleableTypes": { kind: 21, modifiers: 0 }, "getHandleableTypes": { kind: 21, modifiers: 0 }, "ensureHandleability": { kind: 21, modifiers: 0 }, "isHandleabe": { kind: 21, modifiers: 0 }, "getHandledTypes": { kind: 21, modifiers: 0 }, "getHandled": { kind: 21, modifiers: 0 }, "handle": { kind: 21, modifiers: 0 } } })(target)) {
        throw new InvalidControllerError(helpers.getTypeName(target.constructor));
    }
    const params = Reflect.getMetadata('design:paramtypes', target, methodName);
    const message = params[index];
    if (!((message === null || message === void 0 ? void 0 : message.prototype) instanceof exports.Command) &&
        !((message === null || message === void 0 ? void 0 : message.prototype) instanceof exports.Event)) {
        throw new UnhandleableTypeError(helpers.getTypeName(target.constructor), core.kernel.describer.describe([exports.Command]), core.kernel.describer.describe(message));
    }
    const containerKey = message.prototype instanceof exports.Command
        ? ROUTED_COMMANDS_CONTAINER_KEY
        : ROUTED_EVENTS_CONTAINER_KEY;
    const hasRoutedMessage = Reflect.getMetadata(containerKey, target.constructor.prototype);
    if (!hasRoutedMessage) {
        Reflect.defineMetadata(containerKey, [], target.constructor.prototype);
    }
    const routedMessage = Reflect.getMetadata(containerKey, target.constructor.prototype);
    routedMessage.push(message);
    if (message.prototype instanceof exports.Command) {
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
            throw new InvalidLegacyTransformerError(helpers.getTypeName(target), propertyKey, schemaVersion);
        }
        if (!typend.instanceOf({ kind: 15, name: "Versionable", properties: { "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } })(proto) ||
            !typend.instanceOf({ kind: 15, name: "Hookable", properties: { "registerHook": { kind: 21, modifiers: 0 }, "overrideHook": { kind: 21, modifiers: 0 }, "getHook": { kind: 21, modifiers: 0 }, "getHookOrThrow": { kind: 21, modifiers: 0 }, "getHooks": { kind: 21, modifiers: 0 }, "getActions": { kind: 21, modifiers: 0 }, "hasHook": { kind: 21, modifiers: 0 }, "hasAction": { kind: 21, modifiers: 0 }, "removeHook": { kind: 21, modifiers: 0 } } })(proto)) {
            throw new NotVersionableError(helpers.getTypeName(target));
        }
        if (!proto.hasHook('onConstruction', 'versionable')) {
            proto.registerHook('onConstruction', 'versionable', proto.transformLegacyProps);
        }
        proto.registerLegacyTransformer(schemaVersion, descriptor === null || descriptor === void 0 ? void 0 : descriptor.value);
    };
}

class StateError extends core.ExtendableError {
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
const StatefulTrait = core$1.trait((base) => class extends base {
    setState(state) {
        const selectableStates = this.getSelectableStates();
        if (lodash.isEmpty(selectableStates)) {
            const typeName = helpers.getTypeName(this.constructor);
            throw new UndefinedStatesError(typeName);
        }
        const oneOfSelectableStates = Object.values(selectableStates);
        if (core.kernel.isValidating()) {
            const pattern = new typend.OneOf(...oneOfSelectableStates);
            core.kernel.validator.validate(state, pattern);
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
            const typeName = helpers.getTypeName(this.constructor);
            throw new InvalidStateError(typeName, this.state, expectedStates.join(', '));
        }
        return true;
    }
    getSelectableStates() {
        return this.constructor.STATES;
    }
});

class StatusError extends core.ExtendableError {
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
const StatusfulTrait = core$1.trait((base) => class extends base {
    setStatus(status) {
        const selectableStatuses = this.getSelectableStatuses();
        if (lodash.isEmpty(selectableStatuses)) {
            const typeName = helpers.getTypeName(this.constructor);
            throw new UndefinedStatusesError(typeName);
        }
        const oneOfSelectableStatuses = Object.values(selectableStatuses);
        if (core.kernel.isValidating()) {
            const pattern = new typend.OneOf(...oneOfSelectableStatuses);
            core.kernel.validator.validate(status, pattern);
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
            const typeName = helpers.getTypeName(this.constructor);
            throw new InvalidStatusError(typeName, this.status, expectedStatuses.join(', '));
        }
        return true;
    }
    getSelectableStatuses() {
        return this.constructor.STATUSES;
    }
});

exports.Entity = class Entity extends core$1.derive(StatefulTrait, StatusfulTrait, exports.Serializable) {
    constructor(props) {
        super(props);
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
            Object.assign(pickedProps, lodash.pick(source, propKeys));
        }
        return pickedProps;
    }
    on(action) {
        core.kernel.asserter.setAction(action);
        return this;
    }
    get ensure() {
        return new Proxy(this, {
            get(target, key) {
                if (key === Symbol.toStringTag) {
                    return this;
                }
                const propKey = key;
                if (core.kernel.asserter.hasApi(`${propKey}.`)) {
                    core.kernel.asserter.setEntity(target);
                    return core.kernel.asserter.ensure[propKey];
                }
                if (typeof target[propKey] === 'function') {
                    const proxifiedMethod = new Proxy(target[propKey], {
                        apply(_targetMethod, _thisArg, args) {
                            target[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
                            const result = target[propKey](...args);
                            target[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
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
                        target[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
                        let isAble = true;
                        try {
                            target[propKey](...args);
                        }
                        catch (e) {
                            isAble = false;
                        }
                        target[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
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
    [ENABLE_ACTION_VALIDATION_METHOD_KEY]() {
        Object.defineProperty(this, ACTION_VALIDATION_KEY, {
            value: true,
            enumerable: false,
            writable: true,
        });
    }
    [DISABLE_ACTION_VALIDATION_METHOD_KEY]() {
        Object.defineProperty(this, ACTION_VALIDATION_KEY, {
            value: false,
            enumerable: false,
            writable: true,
        });
    }
    [IS_ACTION_VALIDATED_METHOD_KEY]() {
        return this[ACTION_VALIDATION_KEY] || false;
    }
    [ROLLBACK_STATE_METHOD_KEY]() {
        if (!this.isStateSaved()) {
            throw new exports.SavedStateNotFoundError(this.getTypeName(), this.getId().toString());
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
exports.Entity = __decorate([
    core.Type('Entity')({ kind: 19, name: "Entity", properties: { "id": { kind: 17, modifiers: 1, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "state": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "status": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "schemaVersion": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, name: "__type", properties: {} } }] }], extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], exports.Entity);

const can = (validator) => (target, _propertyKey, descriptor) => {
    if (target.prototype instanceof exports.Entity) {
        throw new Error(`Only 'Entity' child classes actions(methods) can be decorated with @can(...) decorator`);
    }
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        if (this[IS_ACTION_VALIDATED_METHOD_KEY]()) {
            return validator(this, ...args);
        }
        const result = originalMethod.apply(this, args);
        return result;
    };
    return descriptor;
};

class ModuleError extends core.ExtendableError {
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
class InjectorError extends core.ExtendableError {
}
class InvalidEventSourceableError extends InjectorError {
    constructor(got) {
        super(`Injector: expected EventSourceableType to be constructor type of EventSourceable, got ${got}`);
    }
}
class AppError extends core.ExtendableError {
}
class InvalidAppConfigError extends AppError {
    constructor(got) {
        super(`Configuration provided for application must be an instance of AppConfig, got ${got}`);
    }
}
class LoggingError extends core.ExtendableError {
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
    const postConstructMethods = getPostConstructMethodNames(target.constructor);
    for (const methodName of postConstructMethods) {
        target[methodName]();
    }
}
async function executePostConstructAsync(target) {
    const postConstructMethods = getPostConstructMethodNames(target.constructor);
    for (const methodName of postConstructMethods) {
        await target[methodName]();
    }
}
class TrackedBindingToSyntax {
    constructor(originalSyntax, injector, serviceIdentifier) {
        this.originalSyntax = originalSyntax;
        this.injector = injector;
        this.serviceIdentifier = serviceIdentifier;
        const proto = Object.getPrototypeOf(originalSyntax);
        const methods = Object.getOwnPropertyNames(proto).filter((name) => name !== 'constructor' && typeof proto[name] === 'function');
        for (const method of methods) {
            if (!this[method]) {
                this[method] = (...args) => {
                    const result = originalSyntax[method](...args);
                    if (method === 'inSingletonScope') {
                        this.injector._trackScope('Singleton', this.serviceIdentifier);
                    }
                    else if (method === 'inTransientScope') {
                        this.injector._trackScope('Transient', this.serviceIdentifier);
                    }
                    else if (method === 'inRequestScope') {
                        this.injector._trackScope('Request', this.serviceIdentifier);
                    }
                    else if (method === 'toConstantValue') {
                        this.injector._trackScope('Transient', this.serviceIdentifier);
                    }
                    else if (method === 'to' || method === 'toSelf') {
                        this.injector._trackScope('Transient', this.serviceIdentifier);
                    }
                    if (result &&
                        typeof result === 'object' &&
                        result !== originalSyntax) {
                        return new TrackedBindingToSyntax(result, this.injector, this.serviceIdentifier);
                    }
                    return result;
                };
            }
        }
    }
    toRoute(EventSourceableType) {
        if (!isEventSourceableType(EventSourceableType)) {
            throw new InvalidEventSourceableError(core.kernel.describer.describe(EventSourceableType));
        }
        const Router = this.injector.get(BINDINGS.Router);
        const router = new Router(EventSourceableType, EventSourceableType.resolveInitializingMessage(), EventSourceableType.resolveRoutedCommands(), EventSourceableType.resolveRoutedEvents());
        this.injector.injectInto(router);
        this.originalSyntax.toConstantValue(router);
        this.injector._trackScope('Transient', this.serviceIdentifier);
    }
}
class Injector extends inversify.Container {
    constructor() {
        super(...arguments);
        this._scopeRegistry = new Map([
            ['Singleton', new Set()],
            ['Transient', new Set()],
            ['Request', new Set()],
        ]);
    }
    _trackScope(scope, serviceIdentifier) {
        for (const identifiers of this._scopeRegistry.values()) {
            identifiers.delete(serviceIdentifier);
        }
        this._scopeRegistry.get(scope).add(serviceIdentifier);
    }
    bind(serviceIdentifier) {
        const originalSyntax = super.bind(serviceIdentifier);
        return new TrackedBindingToSyntax(originalSyntax, this, serviceIdentifier);
    }
    unbind(serviceIdentifier) {
        super.unbind(serviceIdentifier);
        for (const identifiers of this._scopeRegistry.values()) {
            identifiers.delete(serviceIdentifier);
        }
        return Promise.resolve();
    }
    unbindAll() {
        super.unbindAll();
        for (const identifiers of this._scopeRegistry.values()) {
            identifiers.clear();
        }
        return Promise.resolve();
    }
    injectInto(value) {
        const metadata = getInversifyMetadata(value.constructor);
        if (metadata === null || metadata === void 0 ? void 0 : metadata.properties) {
            for (const [propertyName, propertyMetadata,] of metadata.properties.entries()) {
                const serviceId = propertyMetadata.value;
                if (propertyMetadata.optional) {
                    try {
                        value[propertyName] = this.get(serviceId);
                    }
                    catch (error) {
                        value[propertyName] = undefined;
                    }
                }
                else {
                    value[propertyName] = this.get(serviceId);
                }
            }
        }
        if (hasPostConstruct(value.constructor)) {
            executePostConstruct(value);
        }
    }
    async injectIntoAsync(value) {
        const metadata = getInversifyMetadata(value.constructor);
        if (metadata === null || metadata === void 0 ? void 0 : metadata.properties) {
            for (const [propertyName, propertyMetadata,] of metadata.properties.entries()) {
                const serviceId = propertyMetadata.value;
                if (propertyMetadata.optional) {
                    try {
                        value[propertyName] = await this.getAsync(serviceId);
                    }
                    catch (error) {
                        value[propertyName] = undefined;
                    }
                }
                else {
                    value[propertyName] = await this.getAsync(serviceId);
                }
            }
        }
        if (hasPostConstruct(value.constructor)) {
            await executePostConstructAsync(value);
        }
    }
    findByScope(scope) {
        const identifiers = this._scopeRegistry.get(scope);
        return identifiers ? Array.from(identifiers) : [];
    }
}

class UndefinedLoggableTargetError extends core.ExtendableError {
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
        this.typeName = helpers.getTypeName(this.target) || '';
        return this;
    }
    in(methodOrName) {
        if (this.target === undefined) {
            throw new UndefinedLoggableTargetError();
        }
        let method;
        if (lodash.isString(methodOrName)) {
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
const CONFIG_INCLUDED_KEY = Symbol('eveble:config-included-key');
const CONFIG_MERGED_KEY = Symbol('eveble:config-merged-key');
exports.Config = Config_1 = class Config extends exports.Serializable {
    constructor() {
        super();
        Object.defineProperty(this, CONFIG_INCLUDED_KEY, {
            enumerable: false,
            writable: true,
            value: {},
        });
        Object.defineProperty(this, CONFIG_MERGED_KEY, {
            enumerable: false,
            writable: true,
            value: {},
        });
    }
    isConfigurable(path) {
        return lodash.has(this.getPropTypes(), path);
    }
    getPropTypes() {
        const instancePropTypes = super.getPropTypes();
        let propTypes = {};
        for (const key of Reflect.ownKeys(instancePropTypes)) {
            const value = instancePropTypes[key.toString()];
            if (value instanceof typend.InstanceOf) {
                if (value[0].prototype instanceof Config_1) {
                    propTypes[key] = new typend.Collection(value[0].getPropTypes());
                }
                else {
                    propTypes[key] = value;
                }
            }
            else {
                propTypes[key] = value;
            }
        }
        if (lodash.isEmpty(this[CONFIG_MERGED_KEY])) {
            return propTypes;
        }
        let mergedPropTypes = {};
        for (const mergedCfg of Object.values(this[CONFIG_MERGED_KEY] || {})) {
            const mergedConfigPropTypes = mergedCfg.getPropTypes();
            mergedPropTypes = merge(mergedPropTypes, mergedConfigPropTypes, {
                isMergeableObject: isPlainRecord$1,
            });
        }
        propTypes = merge(mergedPropTypes, propTypes, {
            isMergeableObject: isPlainRecord$1,
        });
        return convertObjectToCollection$1(propTypes);
    }
    has(path) {
        const hasValue = lodash.has(this, path);
        if (hasValue)
            return true;
        for (const config of Object.values(this[CONFIG_INCLUDED_KEY] || {})) {
            if (config.has(path)) {
                return true;
            }
        }
        return false;
    }
    get(path, runtimeDefaultValue) {
        let foundValue = lodash.get(this, path);
        if (foundValue !== undefined) {
            if (isPlainRecord$1(foundValue)) {
                return { ...foundValue };
            }
            return foundValue;
        }
        for (const config of Object.values(this[CONFIG_INCLUDED_KEY] || [])) {
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
        let foundValue = lodash.get(this, path);
        if (foundValue !== undefined) {
            if (isPlainRecord$1(foundValue)) {
                return { ...foundValue };
            }
            return foundValue;
        }
        for (const config of Object.values(this[CONFIG_INCLUDED_KEY] || [])) {
            foundValue = config.getExact(path);
            if (foundValue !== undefined) {
                return foundValue;
            }
        }
        return undefined;
    }
    getDefault(path) {
        let foundDefaultValue = lodash.get(this.getPropertyInitializers(), path);
        if (foundDefaultValue !== undefined) {
            if (isPlainRecord$1(foundDefaultValue)) {
                return { ...foundDefaultValue };
            }
            return foundDefaultValue;
        }
        for (const config of Object.values(this[CONFIG_INCLUDED_KEY] || {})) {
            foundDefaultValue = config.getDefault(path);
            if (foundDefaultValue !== undefined) {
                return foundDefaultValue;
            }
        }
        return undefined;
    }
    hasDefault(path) {
        const hasDefaultValue = lodash.has(this.getPropertyInitializers(), path);
        if (hasDefaultValue)
            return true;
        for (const config of Object.values(this[CONFIG_INCLUDED_KEY] || {})) {
            if (config.hasDefault(path)) {
                return true;
            }
        }
        return hasDefaultValue;
    }
    set(path, value) {
        const copy = deepClone(this);
        lodash.set(copy, path, value);
        this.validateProps(copy, this.getPropTypes());
        lodash.set(this, path, value);
    }
    assign(props) {
        const configCopy = deepClone(this);
        this.findDiffAndUpdate(configCopy, configCopy, props);
        this.validateProps(configCopy, this.getPropTypes());
        this.findDiffAndUpdate(this, props, this);
    }
    include(config) {
        if (!typend.instanceOf({ kind: 15, name: "Configurable", properties: { "isConfigurable": { kind: 21, modifiers: 0 }, "has": { kind: 21, modifiers: 0 }, "get": { kind: 21, modifiers: 0 }, "getExact": { kind: 21, modifiers: 0 }, "getDefault": { kind: 21, modifiers: 0 }, "hasDefault": { kind: 21, modifiers: 0 }, "set": { kind: 21, modifiers: 0 }, "assign": { kind: 21, modifiers: 0 }, "include": { kind: 21, modifiers: 0 }, "merge": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 } } })(config)) {
            throw new InvalidConfigError(helpers.getTypeName(this), core.kernel.describer.describe(config));
        }
        if (this[CONFIG_INCLUDED_KEY] === undefined)
            this[CONFIG_INCLUDED_KEY] = {};
        this[CONFIG_INCLUDED_KEY][helpers.getTypeName(config)] = config;
    }
    static from(props) {
        const propTypes = this.getPropTypes();
        const processedProps = {};
        for (const [key, PropType] of Object.entries(propTypes)) {
            let UnwrapedPropType = PropType;
            if (PropType instanceof typend.Optional) {
                UnwrapedPropType = PropType[0];
            }
            if (UnwrapedPropType instanceof typend.InstanceOf) {
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
        if (!typend.instanceOf({ kind: 15, name: "Configurable", properties: { "isConfigurable": { kind: 21, modifiers: 0 }, "has": { kind: 21, modifiers: 0 }, "get": { kind: 21, modifiers: 0 }, "getExact": { kind: 21, modifiers: 0 }, "getDefault": { kind: 21, modifiers: 0 }, "hasDefault": { kind: 21, modifiers: 0 }, "set": { kind: 21, modifiers: 0 }, "assign": { kind: 21, modifiers: 0 }, "include": { kind: 21, modifiers: 0 }, "merge": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 } } })(config)) {
            throw new InvalidConfigError(helpers.getTypeName(this), core.kernel.describer.describe(config));
        }
        const configCopy = deepClone(config);
        delete configCopy.included;
        this.findDiffAndUpdate(this, this, configCopy);
        if (this[CONFIG_MERGED_KEY] === undefined)
            this[CONFIG_MERGED_KEY] = {};
        this[CONFIG_MERGED_KEY][helpers.getTypeName(config)] = config;
    }
    findDiffAndUpdate(target, left, right) {
        const differences = deepDiff.diff(left, right);
        for (const difference of differences) {
            if (difference.path.includes('merged')) {
                continue;
            }
            if (['E'].includes(difference.kind)) {
                lodash.set(target, difference.path, difference.lhs);
            }
            if (['N'].includes(difference.kind)) {
                lodash.set(target, difference.path, difference.rhs);
            }
            if (['D'].includes(difference.kind)) {
                lodash.set(target, difference.path, difference.lhs);
            }
        }
    }
};
exports.Config = Config_1 = __decorate([
    delegate(),
    core.Type()({ kind: 19, name: "Config", properties: { [CONFIG_INCLUDED_KEY]: { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, [CONFIG_MERGED_KEY]: { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } }, constructors: [{ modifiers: 0, parameters: [] }], extends: { kind: 18, type: exports.Serializable, arguments: [] } }),
    __metadata("design:paramtypes", [])
], exports.Config);

exports.LogTransportConfig = class LogTransportConfig extends exports.Config {
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
exports.LogTransportConfig = __decorate([
    core.Type()({ kind: 19, name: "LogTransportConfig", properties: { "isEnabled": { kind: 17, initializer: () => true, modifiers: 1, types: [{ kind: 12 }, { kind: 4 }] }, "level": { kind: 17, initializer: () => 'info', modifiers: 1, types: [{ kind: 12 }, { kind: 2 }] }, "logColors": { kind: 17, initializer: () => ({
                    emerg: 'bold redBG',
                    alert: 'bold yellow',
                    crit: 'bold red',
                    error: 'red',
                    warning: 'yellow',
                    notice: 'blue',
                    info: 'white',
                    debug: 'bold cyan',
                }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: {} }] }, "partsColors": { kind: 17, initializer: () => ({
                    initial: 'white',
                    separator: 'white',
                    timestamp: 'white',
                    label: 'white',
                    target: 'white',
                    method: 'white',
                }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "initial": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "separator": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "target": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "method": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "label": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] } } }] }, "messages": { kind: 17, initializer: () => ({
                    start: chalk `{gray start}`,
                    exit: chalk `{gray exit}`,
                }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "start": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "exit": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] } } }] }, "parts": { kind: 17, initializer: () => ({
                    initial: '',
                    separator: ' ',
                    label: '',
                }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "initial": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "separator": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] }, "label": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }] } } }] }, "flags": { kind: 17, initializer: () => ({
                    isTimestamped: true,
                    isLabeled: false,
                    showTarget: true,
                    showMethod: true,
                    isColored: true,
                    isWholeLineColored: true,
                    includeStackTrace: true,
                    isAbbreviatingSources: false,
                }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "isTimestamped": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] }, "isLabeled": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] }, "showTarget": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] }, "showMethod": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] }, "isColored": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] }, "isWholeLineColored": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] }, "includeStackTrace": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] }, "isAbbreviatingSources": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] } } }] }, "timestampFormat": { kind: 17, initializer: () => 'HH:mm:ss', modifiers: 1, types: [{ kind: 12 }, { kind: 2 }] }, "abbreviationLength": { kind: 17, initializer: () => 15, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] }, "inspectDepth": { kind: 17, initializer: () => 0, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: { "isEnabled": { kind: 999, modifiers: 0 }, "level": { kind: 999, modifiers: 0 }, "logColors": { kind: 999, modifiers: 0 }, "partsColors": { kind: 999, modifiers: 0 }, "messages": { kind: 999, modifiers: 0 }, "parts": { kind: 999, modifiers: 0 }, "flags": { kind: 999, modifiers: 0 }, "timestampFormat": { kind: 999, modifiers: 0 }, "abbreviationLength": { kind: 999, modifiers: 0 }, "inspectDepth": { kind: 999, modifiers: 0 }, "isConfigurable": { kind: 999, modifiers: 0 }, "getPropTypes": { kind: 999, modifiers: 0 }, "has": { kind: 999, modifiers: 0 }, "get": { kind: 999, modifiers: 0 }, "getExact": { kind: 999, modifiers: 0 }, "getDefault": { kind: 999, modifiers: 0 }, "hasDefault": { kind: 999, modifiers: 0 }, "set": { kind: 999, modifiers: 0 }, "assign": { kind: 999, modifiers: 0 }, "include": { kind: 999, modifiers: 0 }, "merge": { kind: 999, modifiers: 0 }, "__@CONFIG_INCLUDED_KEY@7335": { kind: 999, modifiers: 0 }, "__@CONFIG_MERGED_KEY@7336": { kind: 999, modifiers: 0 }, "schemaVersion": { kind: 999, modifiers: 0 }, "in": { kind: 999, modifiers: 0 }, "typeName": { kind: 999, modifiers: 0 }, "getTypeName": { kind: 999, modifiers: 0 }, "toString": { kind: 999, modifiers: 0 }, "toJSONValue": { kind: 999, modifiers: 0 }, "transformLegacyProps": { kind: 999, modifiers: 0 }, "getCurrentSchemaVersion": { kind: 999, modifiers: 0 }, "isLegacySchemaVersion": { kind: 999, modifiers: 0 }, "calculateNextSchemaVersion": { kind: 999, modifiers: 0 }, "registerLegacyTransformer": { kind: 999, modifiers: 0 }, "overrideLegacyTransformer": { kind: 999, modifiers: 0 }, "hasLegacyTransformer": { kind: 999, modifiers: 0 }, "getLegacyTransformers": { kind: 999, modifiers: 0 }, "getLegacyTransformer": { kind: 999, modifiers: 0 }, "getSchemaVersion": { kind: 999, modifiers: 0 }, "getPropertyInitializers": { kind: 999, modifiers: 0 }, "getInstanceInitializers": { kind: 999, modifiers: 0 }, "getParentInitializers": { kind: 999, modifiers: 0 }, "toPlainObject": { kind: 999, modifiers: 0 }, "validateProps": { kind: 999, modifiers: 0 }, "equals": { kind: 999, modifiers: 0 }, "hasSameValues": { kind: 999, modifiers: 0 }, "registerHook": { kind: 999, modifiers: 0 }, "overrideHook": { kind: 999, modifiers: 0 }, "getHook": { kind: 999, modifiers: 0 }, "getHookOrThrow": { kind: 999, modifiers: 0 }, "getHooks": { kind: 999, modifiers: 0 }, "getActions": { kind: 999, modifiers: 0 }, "hasHook": { kind: 999, modifiers: 0 }, "hasAction": { kind: 999, modifiers: 0 }, "removeHook": { kind: 999, modifiers: 0 } } }] } }] }], extends: { kind: 18, type: exports.Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.LogTransportConfig);

exports.LoggingConfig = class LoggingConfig extends exports.Config {
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
            console: new exports.LogTransportConfig({
                level: getenv.string('LOGGING_LEVEL', 'info'),
            }),
        };
        Object.assign(this, this.processProps(props));
    }
};
exports.LoggingConfig = __decorate([
    core.Type()({ kind: 19, name: "LoggingConfig", properties: { "isEnabled": { kind: 17, initializer: () => true, modifiers: 1, types: [{ kind: 12 }, { kind: 4 }] }, "levels": { kind: 17, initializer: () => ({
                    emerg: 0,
                    alert: 1,
                    crit: 2,
                    error: 3,
                    warning: 4,
                    notice: 5,
                    info: 6,
                    debug: 7,
                }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "transports": { kind: 17, initializer: () => ({
                    console: new exports.LogTransportConfig({
                        level: getenv.string('LOGGING_LEVEL', 'info'),
                    }),
                }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "console": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: exports.LogTransportConfig, arguments: [] }] } } }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: { "isEnabled": { kind: 999, modifiers: 0 }, "levels": { kind: 999, modifiers: 0 }, "transports": { kind: 999, modifiers: 0 }, "isConfigurable": { kind: 999, modifiers: 0 }, "getPropTypes": { kind: 999, modifiers: 0 }, "has": { kind: 999, modifiers: 0 }, "get": { kind: 999, modifiers: 0 }, "getExact": { kind: 999, modifiers: 0 }, "getDefault": { kind: 999, modifiers: 0 }, "hasDefault": { kind: 999, modifiers: 0 }, "set": { kind: 999, modifiers: 0 }, "assign": { kind: 999, modifiers: 0 }, "include": { kind: 999, modifiers: 0 }, "merge": { kind: 999, modifiers: 0 }, "__@CONFIG_INCLUDED_KEY@7335": { kind: 999, modifiers: 0 }, "__@CONFIG_MERGED_KEY@7336": { kind: 999, modifiers: 0 }, "schemaVersion": { kind: 999, modifiers: 0 }, "in": { kind: 999, modifiers: 0 }, "typeName": { kind: 999, modifiers: 0 }, "getTypeName": { kind: 999, modifiers: 0 }, "toString": { kind: 999, modifiers: 0 }, "toJSONValue": { kind: 999, modifiers: 0 }, "transformLegacyProps": { kind: 999, modifiers: 0 }, "getCurrentSchemaVersion": { kind: 999, modifiers: 0 }, "isLegacySchemaVersion": { kind: 999, modifiers: 0 }, "calculateNextSchemaVersion": { kind: 999, modifiers: 0 }, "registerLegacyTransformer": { kind: 999, modifiers: 0 }, "overrideLegacyTransformer": { kind: 999, modifiers: 0 }, "hasLegacyTransformer": { kind: 999, modifiers: 0 }, "getLegacyTransformers": { kind: 999, modifiers: 0 }, "getLegacyTransformer": { kind: 999, modifiers: 0 }, "getSchemaVersion": { kind: 999, modifiers: 0 }, "getPropertyInitializers": { kind: 999, modifiers: 0 }, "getInstanceInitializers": { kind: 999, modifiers: 0 }, "getParentInitializers": { kind: 999, modifiers: 0 }, "toPlainObject": { kind: 999, modifiers: 0 }, "validateProps": { kind: 999, modifiers: 0 }, "equals": { kind: 999, modifiers: 0 }, "hasSameValues": { kind: 999, modifiers: 0 }, "registerHook": { kind: 999, modifiers: 0 }, "overrideHook": { kind: 999, modifiers: 0 }, "getHook": { kind: 999, modifiers: 0 }, "getHookOrThrow": { kind: 999, modifiers: 0 }, "getHooks": { kind: 999, modifiers: 0 }, "getActions": { kind: 999, modifiers: 0 }, "hasHook": { kind: 999, modifiers: 0 }, "hasAction": { kind: 999, modifiers: 0 }, "removeHook": { kind: 999, modifiers: 0 } } }] } }] }], extends: { kind: 18, type: exports.Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.LoggingConfig);

exports.EvebleConfig = class EvebleConfig extends exports.Config {
    constructor(props) {
        super();
        if (props)
            Object.assign(this, this.processProps(props));
    }
};
exports.EvebleConfig = __decorate([
    core.Type()({ kind: 19, name: "EvebleConfig", properties: { "CommitStore": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "timeout": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] } } }] }, "Snapshotter": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "isEnabled": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] }, "frequency": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] } } }] }, "CommandScheduler": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "isEnabled": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 4 }] } } }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: { "CommitStore": { kind: 999, modifiers: 0 }, "Snapshotter": { kind: 999, modifiers: 0 }, "CommandScheduler": { kind: 999, modifiers: 0 }, "isConfigurable": { kind: 999, modifiers: 0 }, "getPropTypes": { kind: 999, modifiers: 0 }, "has": { kind: 999, modifiers: 0 }, "get": { kind: 999, modifiers: 0 }, "getExact": { kind: 999, modifiers: 0 }, "getDefault": { kind: 999, modifiers: 0 }, "hasDefault": { kind: 999, modifiers: 0 }, "set": { kind: 999, modifiers: 0 }, "assign": { kind: 999, modifiers: 0 }, "include": { kind: 999, modifiers: 0 }, "merge": { kind: 999, modifiers: 0 }, "__@CONFIG_INCLUDED_KEY@7335": { kind: 999, modifiers: 0 }, "__@CONFIG_MERGED_KEY@7336": { kind: 999, modifiers: 0 }, "schemaVersion": { kind: 999, modifiers: 0 }, "in": { kind: 999, modifiers: 0 }, "typeName": { kind: 999, modifiers: 0 }, "getTypeName": { kind: 999, modifiers: 0 }, "toString": { kind: 999, modifiers: 0 }, "toJSONValue": { kind: 999, modifiers: 0 }, "transformLegacyProps": { kind: 999, modifiers: 0 }, "getCurrentSchemaVersion": { kind: 999, modifiers: 0 }, "isLegacySchemaVersion": { kind: 999, modifiers: 0 }, "calculateNextSchemaVersion": { kind: 999, modifiers: 0 }, "registerLegacyTransformer": { kind: 999, modifiers: 0 }, "overrideLegacyTransformer": { kind: 999, modifiers: 0 }, "hasLegacyTransformer": { kind: 999, modifiers: 0 }, "getLegacyTransformers": { kind: 999, modifiers: 0 }, "getLegacyTransformer": { kind: 999, modifiers: 0 }, "getSchemaVersion": { kind: 999, modifiers: 0 }, "getPropertyInitializers": { kind: 999, modifiers: 0 }, "getInstanceInitializers": { kind: 999, modifiers: 0 }, "getParentInitializers": { kind: 999, modifiers: 0 }, "toPlainObject": { kind: 999, modifiers: 0 }, "validateProps": { kind: 999, modifiers: 0 }, "equals": { kind: 999, modifiers: 0 }, "hasSameValues": { kind: 999, modifiers: 0 }, "registerHook": { kind: 999, modifiers: 0 }, "overrideHook": { kind: 999, modifiers: 0 }, "getHook": { kind: 999, modifiers: 0 }, "getHookOrThrow": { kind: 999, modifiers: 0 }, "getHooks": { kind: 999, modifiers: 0 }, "getActions": { kind: 999, modifiers: 0 }, "hasHook": { kind: 999, modifiers: 0 }, "hasAction": { kind: 999, modifiers: 0 }, "removeHook": { kind: 999, modifiers: 0 } } }] } }] }], extends: { kind: 18, type: exports.Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.EvebleConfig);

var AppConfig_1;
exports.AppConfig = AppConfig_1 = class AppConfig extends exports.Config {
    constructor(props) {
        super();
        this.appId = getenv.string('APP_ID', AppConfig_1.generateId());
        this.workerId = getenv.string('WORKER_ID', AppConfig_1.generateId());
        this.logging = new exports.LoggingConfig();
        this.conversion = { type: 'runtime' };
        this.validation = { type: 'runtime' };
        this.description = { formatting: 'default' };
        this.eveble = new exports.EvebleConfig();
        this.clients = {
            MongoDB: {
                CommitStore: AppConfig_1.defaultMongoDBOptions,
                Snapshotter: AppConfig_1.defaultMongoDBOptions,
                CommandScheduler: AppConfig_1.defaultMongoDBOptions,
            },
            Pulse: {
                CommandScheduler: {
                    processEvery: 180000,
                },
            },
        };
        if (props)
            Object.assign(this, this.processProps(props));
    }
    processProps(props = {}) {
        if (props.eveble !== undefined && !(props.eveble instanceof exports.EvebleConfig)) {
            props.eveble = new exports.EvebleConfig(props.eveble);
        }
        return super.processProps(props);
    }
    static generateId() {
        return uuid.v4().toString();
    }
};
exports.AppConfig.defaultMongoDBOptions = {};
exports.AppConfig = AppConfig_1 = __decorate([
    core.Type()({ kind: 19, name: "AppConfig", properties: { "appId": { kind: 17, initializer: () => getenv.string('APP_ID', AppConfig_1.generateId()), modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "workerId": { kind: 17, initializer: () => getenv.string('WORKER_ID', AppConfig_1.generateId()), modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "logging": { kind: 17, initializer: () => new exports.LoggingConfig(), modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: exports.LoggingConfig, arguments: [] }] }, "conversion": { kind: 17, initializer: () => ({ type: 'runtime' }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "type": { kind: 17, modifiers: 0, types: [{ kind: 5, value: "manual" }, { kind: 5, value: "runtime" }] } } }] }, "validation": { kind: 17, initializer: () => ({ type: 'runtime' }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "type": { kind: 17, modifiers: 0, types: [{ kind: 5, value: "manual" }, { kind: 5, value: "runtime" }] } } }] }, "description": { kind: 17, initializer: () => ({ formatting: 'default' }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "formatting": { kind: 17, modifiers: 0, types: [{ kind: 5, value: "compact" }, { kind: 5, value: "debug" }, { kind: 5, value: "default" }] } } }] }, "eveble": { kind: 17, initializer: () => new exports.EvebleConfig(), modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: exports.EvebleConfig, arguments: [] }] }, "clients": { kind: 17, initializer: () => ({
                    MongoDB: {
                        CommitStore: AppConfig_1.defaultMongoDBOptions,
                        Snapshotter: AppConfig_1.defaultMongoDBOptions,
                        CommandScheduler: AppConfig_1.defaultMongoDBOptions,
                    },
                    Pulse: {
                        CommandScheduler: {
                            processEvery: 180000,
                        },
                    },
                }), modifiers: 1, types: [{ kind: 12 }, { kind: 15, properties: { "MongoDB": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, properties: { "CommitStore": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "Snapshotter": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "CommandScheduler": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } } }] }, "Pulse": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, properties: { "CommandScheduler": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] } } }] } } }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: { "appId": { kind: 999, modifiers: 0 }, "workerId": { kind: 999, modifiers: 0 }, "logging": { kind: 999, modifiers: 0 }, "conversion": { kind: 999, modifiers: 0 }, "validation": { kind: 999, modifiers: 0 }, "description": { kind: 999, modifiers: 0 }, "eveble": { kind: 999, modifiers: 0 }, "clients": { kind: 999, modifiers: 0 }, "isConfigurable": { kind: 999, modifiers: 0 }, "getPropTypes": { kind: 999, modifiers: 0 }, "has": { kind: 999, modifiers: 0 }, "get": { kind: 999, modifiers: 0 }, "getExact": { kind: 999, modifiers: 0 }, "getDefault": { kind: 999, modifiers: 0 }, "hasDefault": { kind: 999, modifiers: 0 }, "set": { kind: 999, modifiers: 0 }, "assign": { kind: 999, modifiers: 0 }, "include": { kind: 999, modifiers: 0 }, "merge": { kind: 999, modifiers: 0 }, "__@CONFIG_INCLUDED_KEY@6267": { kind: 999, modifiers: 0 }, "__@CONFIG_MERGED_KEY@6269": { kind: 999, modifiers: 0 }, "schemaVersion": { kind: 999, modifiers: 0 }, "in": { kind: 999, modifiers: 0 }, "typeName": { kind: 999, modifiers: 0 }, "getTypeName": { kind: 999, modifiers: 0 }, "toString": { kind: 999, modifiers: 0 }, "toJSONValue": { kind: 999, modifiers: 0 }, "transformLegacyProps": { kind: 999, modifiers: 0 }, "getCurrentSchemaVersion": { kind: 999, modifiers: 0 }, "isLegacySchemaVersion": { kind: 999, modifiers: 0 }, "calculateNextSchemaVersion": { kind: 999, modifiers: 0 }, "registerLegacyTransformer": { kind: 999, modifiers: 0 }, "overrideLegacyTransformer": { kind: 999, modifiers: 0 }, "hasLegacyTransformer": { kind: 999, modifiers: 0 }, "getLegacyTransformers": { kind: 999, modifiers: 0 }, "getLegacyTransformer": { kind: 999, modifiers: 0 }, "getSchemaVersion": { kind: 999, modifiers: 0 }, "getPropertyInitializers": { kind: 999, modifiers: 0 }, "getInstanceInitializers": { kind: 999, modifiers: 0 }, "getParentInitializers": { kind: 999, modifiers: 0 }, "toPlainObject": { kind: 999, modifiers: 0 }, "validateProps": { kind: 999, modifiers: 0 }, "equals": { kind: 999, modifiers: 0 }, "hasSameValues": { kind: 999, modifiers: 0 }, "registerHook": { kind: 999, modifiers: 0 }, "overrideHook": { kind: 999, modifiers: 0 }, "getHook": { kind: 999, modifiers: 0 }, "getHookOrThrow": { kind: 999, modifiers: 0 }, "getHooks": { kind: 999, modifiers: 0 }, "getActions": { kind: 999, modifiers: 0 }, "hasHook": { kind: 999, modifiers: 0 }, "hasAction": { kind: 999, modifiers: 0 }, "removeHook": { kind: 999, modifiers: 0 } } }] } }] }], extends: { kind: 18, type: exports.Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.AppConfig);

var STATES$1;
(function (STATES) {
    STATES["constructed"] = "constructed";
    STATES["configuring"] = "configuring";
    STATES["initializing"] = "initializing";
    STATES["initialized"] = "initialized";
    STATES["running"] = "running";
    STATES["stopped"] = "stopped";
    STATES["shutdown"] = "shutdown";
})(STATES$1 || (STATES$1 = {}));
class Module extends core$1.derive(StatefulTrait) {
    constructor(props = {}) {
        super();
        if (props.config)
            this.validateConfig(props.config);
        if (props.modules)
            this.validateModules(props.modules);
        Object.assign(this, props);
        if (this.config === undefined) {
            this.config = new exports.Config();
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
        if (lodash.isFunction(this[actionName])) {
            await this[actionName]();
        }
    }
    validateModules(modules) {
        for (const module of modules) {
            if (!typend.instanceOf({ kind: 15, name: "Module", properties: { "config": { kind: 15, modifiers: 0, name: "Configurable", properties: { "isConfigurable": { kind: 21, modifiers: 0 }, "has": { kind: 21, modifiers: 0 }, "get": { kind: 21, modifiers: 0 }, "getExact": { kind: 21, modifiers: 0 }, "getDefault": { kind: 21, modifiers: 0 }, "hasDefault": { kind: 21, modifiers: 0 }, "set": { kind: 21, modifiers: 0 }, "assign": { kind: 21, modifiers: 0 }, "include": { kind: 21, modifiers: 0 }, "merge": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 } } }, "initialize": { kind: 21, modifiers: 0 }, "start": { kind: 21, modifiers: 0 }, "stop": { kind: 21, modifiers: 0 }, "reset": { kind: 21, modifiers: 0 }, "shutdown": { kind: 21, modifiers: 0 }, "invokeAction": { kind: 21, modifiers: 0 }, "state": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "isInState": { kind: 21, modifiers: 0 }, "isInOneOfStates": { kind: 21, modifiers: 0 }, "getState": { kind: 21, modifiers: 0 }, "setState": { kind: 21, modifiers: 0 }, "hasState": { kind: 21, modifiers: 0 }, "validateState": { kind: 21, modifiers: 0 }, "getSelectableStates": { kind: 21, modifiers: 0 } } })(module)) {
                const typeName = helpers.getTypeName(this.constructor);
                throw new InvalidModuleError(typeName, core.kernel.describer.describe(module));
            }
        }
    }
    validateConfig(config) {
        if (!typend.instanceOf({ kind: 15, name: "Configurable", properties: { "isConfigurable": { kind: 21, modifiers: 0 }, "has": { kind: 21, modifiers: 0 }, "get": { kind: 21, modifiers: 0 }, "getExact": { kind: 21, modifiers: 0 }, "getDefault": { kind: 21, modifiers: 0 }, "hasDefault": { kind: 21, modifiers: 0 }, "set": { kind: 21, modifiers: 0 }, "assign": { kind: 21, modifiers: 0 }, "include": { kind: 21, modifiers: 0 }, "merge": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 } } })(config)) {
            const typeName = helpers.getTypeName(this.constructor);
            throw new InvalidConfigError(typeName, core.kernel.describer.describe(config));
        }
    }
    async initializeLogger() {
        var _a;
        this.log = await ((_a = this.injector) === null || _a === void 0 ? void 0 : _a.getAsync(BINDINGS.log));
    }
    mergeConfigWithApp(app) {
        var _a;
        if (!this.isAppConfig(app.config)) {
            throw new InvalidAppConfigError(core.kernel.describer.describe(app.config));
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
        return config instanceof exports.AppConfig;
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
        await this.invokeAction(`before${lodash.capitalize(actionName)}`, {
            isLoggable: true,
        });
        await this.invokeAction(`on${lodash.capitalize(actionName)}`, {
            isLoggable: true,
        });
        await this.invokeAction(`after${lodash.capitalize(actionName)}`, {
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
Module.STATES = STATES$1;

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

const RFC5424LoggingTrait = core$1.trait((base) => class extends base {
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
});

var Logger_1;
var STATES;
(function (STATES) {
    STATES["constructed"] = "constructed";
    STATES["stopped"] = "stopped";
    STATES["running"] = "running";
})(STATES || (STATES = {}));
exports.Logger = Logger_1 = class Logger extends core$1.derive(StatefulTrait, RFC5424LoggingTrait) {
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
            throw new InvalidTransportIdError(core.kernel.describer.describe(id));
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
exports.Logger.STATES = STATES;
exports.Logger = Logger_1 = __decorate([
    inversify.injectable(),
    __metadata("design:paramtypes", [Object])
], exports.Logger);

class LogTransport extends core$1.derive(RFC5424LoggingTrait) {
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
        const levelPriority = lodash.get(this.logger, `levels.${level}`);
        const transportPriority = lodash.get(this.logger, `levels.${this.level}`);
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
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], LogTransport.prototype, "logger", void 0);
__decorate([
    inversify.postConstruct(),
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
        formatArgs.push(format.printf((log) => this.formatEntry(log)));
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
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], ConsoleTransport.prototype, "logger", void 0);
__decorate([
    inversify.inject(BINDINGS.winston),
    __metadata("design:type", Object)
], ConsoleTransport.prototype, "winston", void 0);
__decorate([
    inversify.inject(BINDINGS.SimpleLogFormatter),
    __metadata("design:type", Object)
], ConsoleTransport.prototype, "simpleFormatter", void 0);
__decorate([
    inversify.inject(BINDINGS.DetailedLogFormatter),
    __metadata("design:type", Object)
], ConsoleTransport.prototype, "detailedFormatter", void 0);
__decorate([
    inversify.postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConsoleTransport.prototype, "initialize", null);

exports.StringifingConverter = class StringifingConverter {
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
            (isInspectable ? util.inspect(value, inspectOptions) : value) +
            suffixStr);
    }
    stringifyMethodParams(entry, metadata, inspectOptions = {}) {
        if (entry.method === undefined) {
            return '';
        }
        const argNames = reflectParams.ReflectParams(entry.method);
        const requiredArgNames = metadata.keys instanceof Array ? metadata.keys : argNames;
        const obj = {};
        const argsIndexes = requiredArgNames.map((argName) => argNames.indexOf(argName));
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
            ? lodash.intersection(allProps, metadata.keys)
            : allProps;
        const obj = {};
        for (const propName of requiredProps) {
            obj[propName] = entry.target[propName];
        }
        return this.stringifyObject(obj, inspectOptions);
    }
    stringifyObject(obj, inspectOptions = {}) {
        return util.inspect(obj, {
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
                ? (_a = entry.options) === null || _a === void 0 ? void 0 : _a.isColored
                : options.get('isColored'),
            colors: entry instanceof Log
                ? (_b = entry.options) === null || _b === void 0 ? void 0 : _b.inspectDepth
                : options.get('inspectDepth'),
        };
        return inspectOptions;
    }
};
exports.StringifingConverter = __decorate([
    inversify.injectable()
], exports.StringifingConverter);

exports.SimpleLogFormatter = class SimpleLogFormatter {
    constructor(converter) {
        this.converter = converter;
    }
    format(entry) {
        const rest = this.converter.convertArguments(entry);
        return `${entry.message} ${rest}`;
    }
};
exports.SimpleLogFormatter = __decorate([
    inversify.injectable(),
    __param(0, inversify.inject(BINDINGS.LogConverter)),
    __metadata("design:paramtypes", [Object])
], exports.SimpleLogFormatter);

exports.DetailedLogFormatter = class DetailedLogFormatter {
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
exports.DetailedLogFormatter = __decorate([
    inversify.injectable(),
    __param(0, inversify.inject(BINDINGS.LogConverter)),
    __param(1, inversify.inject(BINDINGS.chalk)),
    __metadata("design:paramtypes", [Object, Object])
], exports.DetailedLogFormatter);

class BaseApp extends Module {
    constructor(props = {}) {
        var _a;
        const defaults = {
            modules: [],
            config: new exports.AppConfig(),
        };
        const processedProps = { ...defaults, ...props };
        if (!(processedProps.config instanceof exports.AppConfig)) {
            throw new InvalidAppConfigError(core.kernel.describer.describe(processedProps.config));
        }
        super(processedProps);
        this.injector = (_a = processedProps.injector) !== null && _a !== void 0 ? _a : new Injector();
    }
    debug() {
        this.config.assign({
            logging: new exports.LoggingConfig({
                isEnabled: true,
                transports: {
                    console: new exports.LogTransportConfig({
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
        if (core.kernel.injector === undefined) {
            core.kernel.setInjector(this.injector);
        }
        this.bindExternalDependencies();
        this.bindLoggerDependencies();
        await this.initializeLogger();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`initialize`).on(this).in(this.initialize));
    }
    bindKernelDependencies() {
        this.injector
            .bind(BINDINGS.Converter)
            .toConstantValue(core.kernel.converter);
        this.injector
            .bind(BINDINGS.Validator)
            .toConstantValue(core.kernel.validator);
        this.injector
            .bind(BINDINGS.Describer)
            .toConstantValue(core.kernel.describer);
        this.injector
            .bind(BINDINGS.Library)
            .toConstantValue(core.kernel.library);
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
            this.injector.bind(BINDINGS.winston).toConstantValue(winston__namespace);
        }
        if (!this.injector.isBound(BINDINGS.chalk)) {
            this.injector.bind(BINDINGS.chalk).toConstantValue(chalk);
        }
    }
    bindLoggerDependencies() {
        const converter = new exports.StringifingConverter();
        if (!this.injector.isBound(BINDINGS.SimpleLogFormatter)) {
            const simpleFormatter = new exports.SimpleLogFormatter(converter);
            this.injector
                .bind(BINDINGS.SimpleLogFormatter)
                .toConstantValue(simpleFormatter);
        }
        if (!this.injector.isBound(BINDINGS.DetailedLogFormatter)) {
            const detailedFormatter = new exports.DetailedLogFormatter(converter, this.injector.get(BINDINGS.chalk));
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
        return new exports.Logger(levels);
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

exports.EJSONSerializerAdapter = class EJSONSerializerAdapter {
    constructor(typeKey = TYPE_KEY) {
        this.typeKey = typeKey;
    }
    registerType(typeName, type, shouldOverride = false) {
        if (!core.isSerializable(type.prototype)) {
            throw new core.UnregistrableTypeError(typeName);
        }
        const factory = this.createFactory(type);
        factory.type = type;
        if (this.hasType(typeName)) {
            if (shouldOverride) {
                this.ejson.overrideType(typeName, factory);
            }
            else {
                throw new core.TypeExistsError('EJSON', typeName);
            }
        }
        else {
            this.ejson.addType(typeName, factory);
        }
    }
    createFactory(type) {
        const construct = function (serializer, TypeCtor, json) {
            const propTypes = lodash.isFunction(TypeCtor.getPropTypes)
                ? TypeCtor.getPropTypes()
                : {};
            for (const key of Object.keys(propTypes)) {
                if (json[key]) {
                    json[key] = serializer.fromJSONValue(json[key]);
                }
            }
            return new TypeCtor(json);
        };
        return lodash.partial(construct, this, type);
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
            throw new core.TypeNotFoundError('EJSON', typeName);
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
        const propTypes = lodash.isFunction(value.getPropTypes)
            ? value.getPropTypes()
            : {};
        if (lodash.isEmpty(propTypes)) {
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
            throw new core.TypeNotFoundError('EJSON', typeName);
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
        if (!core.isSerializable(serializable)) {
            throw new core.UnregistrableTypeError(core.kernel.describer.describe(serializable));
        }
        const data = {
            [this.getTypeKey()]: serializable.getTypeName(),
        };
        for (const key of Object.keys(serializable.getPropTypes())) {
            if (serializable[key] === undefined)
                continue;
            const value = serializable[key];
            if (Array.isArray(value)) {
                data[key] = value.map((item) => core.isSerializable(item) ? this.toData(item) : item);
            }
            else if (core.isSerializable(value)) {
                data[key] = this.toData(value);
            }
            else if (lodash.isPlainObject(value)) {
                data[key] = this.processNestedObjToData(value);
            }
            else {
                data[key] = value;
            }
        }
        return data;
    }
    processNestedObjToData(obj) {
        const data = {};
        for (const [key, value] of Object.entries(obj)) {
            if (core.isSerializable(value)) {
                data[key] = this.toData(value);
            }
            else if (!key.includes('correlation') && lodash.isPlainObject(value)) {
                data[key] = this.processNestedObjToData(obj);
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
            else if (lodash.isPlainObject(value)) {
                props[key] = this.processNestedObjFromData(value);
            }
            else {
                props[key] = value;
            }
        }
        return new Type(props);
    }
    processNestedObjFromData(data) {
        const props = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && value[this.getTypeKey()] !== undefined) {
                props[key] = this.fromData(value);
            }
            else if (lodash.isPlainObject(value)) {
                props[key] = this.processNestedObjFromData(value);
            }
            else {
                props[key] = value;
            }
        }
        return props;
    }
};
__decorate([
    inversify.inject(BINDINGS.EJSON),
    __metadata("design:type", Object)
], exports.EJSONSerializerAdapter.prototype, "ejson", void 0);
exports.EJSONSerializerAdapter = __decorate([
    inversify.injectable(),
    __metadata("design:paramtypes", [String])
], exports.EJSONSerializerAdapter);

const HandlingTrait = core$1.trait((base) => class extends base {
    constructor() {
        super();
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
        return lodash.isEmpty(this[HANDLEABLE_TYPES])
            ? [exports.Message]
            : this[HANDLEABLE_TYPES];
    }
    ensureHandleability(messageType, handleableTypes = this.getHandleableTypes()) {
        if (!this.isHandleabe(messageType, handleableTypes)) {
            throw new UnhandleableTypeError(helpers.getTypeName(this.constructor), core.kernel.describer.describe(handleableTypes), core.kernel.describer.describe(messageType));
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
            if (core.kernel.validator.isValid(handledType.prototype, messageType)) {
                handledTypes.push(handledType);
            }
        }
        return handledTypes;
    }
    getHandledMessages() {
        return this.getHandled(exports.Message);
    }
    getHandledCommands() {
        return this.getHandled(exports.Command);
    }
    getHandledEvents() {
        return this.getHandled(exports.Event);
    }
    getHandledTypesNames() {
        const handlers = this.getHandlers();
        const typeNames = [];
        for (const type of handlers.keys()) {
            typeNames.push(type.getTypeName());
        }
        return typeNames;
    }
});

const OneToOneHandlingTrait = core$1.trait([HandlingTrait], (base) => {
    const klass = class extends base {
        initialize() {
            this.setupHandlers({
                handlers: this.handles(),
                handleableTypes: [exports.Command],
                isBoundable: true,
            });
            this.setupHandlers({
                handlers: this.subscribes(),
                handleableTypes: [exports.Event],
                isBoundable: true,
            });
        }
        registerHandler(messageType, handler, shouldOverride = false) {
            if (!this.isHandleabe(messageType)) {
                throw new UnhandleableTypeError(helpers.getTypeName(this.constructor), core.kernel.describer.describe(this.getHandleableTypes()), core.kernel.describer.describe(messageType));
            }
            if (!lodash.isFunction(handler)) {
                throw new InvalidHandlerError(helpers.getTypeName(this.constructor), messageType.getTypeName(), core.kernel.describer.describe(handler));
            }
            if (this.hasHandler(messageType) && !shouldOverride) {
                throw new HandlerExistError(helpers.getTypeName(this.constructor), messageType.getTypeName());
            }
            this[HANDLERS].set(messageType, handler);
        }
        getHandler(messageType) {
            if (!(messageType.prototype instanceof exports.Message)) {
                throw new InvalidMessageableType(core.kernel.describer.describe(messageType));
            }
            return this.hasHandler(messageType)
                ? this[HANDLERS].get(messageType)
                : undefined;
        }
        getHandlerOrThrow(messageType) {
            const handler = this.getHandler(messageType);
            if (handler === undefined) {
                throw new HandlerNotFoundError(helpers.getTypeName(this.constructor), messageType.getTypeName());
            }
            return handler;
        }
        getTypeByHandler(handlerReference) {
            for (const [messageType, handler] of this[HANDLERS].entries()) {
                const unboundHandler = handler.original;
                if (handlerReference === unboundHandler ||
                    handlerReference === handler) {
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
    const descriptor = Object.getOwnPropertyDescriptor(core$1.trait.prototype, 'initialize');
    inversify.postConstruct()(klass.prototype, 'initialize', descriptor);
    return klass;
});

exports.CommandBus = class CommandBus extends core$1.derive(HookableTrait, OneToOneHandlingTrait) {
    constructor() {
        super();
        this.setHandleableTypes([exports.Command]);
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
exports.CommandBus = __decorate([
    inversify.injectable(),
    __metadata("design:paramtypes", [])
], exports.CommandBus);
Object.getPrototypeOf(exports.CommandBus.prototype).constructor = Object;

const OneToManyHandlingTrait = core$1.trait([HandlingTrait], (base) => {
    const klass = class extends base {
        initialize() {
            this.setupHandlers({
                handlers: this.subscribes(),
                handleableTypes: [exports.Event],
                isBoundable: true,
            });
        }
        registerHandler(messageType, handler, shouldOverride = false) {
            if (!this.isHandleabe(messageType)) {
                throw new UnhandleableTypeError(helpers.getTypeName(this.constructor), core.kernel.describer.describe(this.getHandleableTypes()), core.kernel.describer.describe(messageType));
            }
            if (!lodash.isFunction(handler)) {
                throw new InvalidHandlerError(helpers.getTypeName(this.constructor), messageType.getTypeName(), core.kernel.describer.describe(handler));
            }
            if (!this.hasHandler(messageType) || shouldOverride) {
                this[HANDLERS].set(messageType, [handler]);
            }
            else {
                this[HANDLERS].get(messageType).push(handler);
            }
        }
        getHandler(messageType) {
            if (!(messageType.prototype instanceof exports.Message)) {
                throw new InvalidMessageableType(core.kernel.describer.describe(messageType));
            }
            return this.hasHandler(messageType)
                ? this[HANDLERS].get(messageType)
                : undefined;
        }
        getHandlerOrThrow(messageType) {
            const handlers = this.getHandler(messageType);
            if (handlers === undefined) {
                throw new HandlerNotFoundError(helpers.getTypeName(this.constructor), helpers.getTypeName(messageType));
            }
            return handlers;
        }
        getTypeByHandler(handlerReference) {
            for (const [messageType, handlers] of this[HANDLERS].entries()) {
                const unboundHandlers = handlers.map((handler) => handler.original || handler);
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
                    throw new UnsupportedExecutionTypeError(helpers.getTypeName(this.constructor), execution);
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
            const promises = handlers.map((handler) => handler(message));
            return Promise.all(promises);
        }
    };
    const descriptor = Object.getOwnPropertyDescriptor(core$1.trait.prototype, 'initialize');
    inversify.postConstruct()(klass.prototype, 'initialize', descriptor);
    return klass;
});

exports.EventBus = class EventBus extends core$1.derive(HookableTrait, OneToManyHandlingTrait) {
    constructor() {
        super();
        this.setHandleableTypes([exports.Event]);
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
exports.EventBus = __decorate([
    inversify.injectable(),
    __metadata("design:paramtypes", [])
], exports.EventBus);
Object.getPrototypeOf(exports.EventBus.prototype).constructor = Object;

exports.InfrastructureError = class InfrastructureError extends exports.SerializableError {
};
exports.InfrastructureError = __decorate([
    core.Type('InfrastructureError')({ kind: 19, name: "InfrastructureError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.SerializableError, arguments: [] } })
], exports.InfrastructureError);
exports.CommitConcurrencyError = class CommitConcurrencyError extends exports.InfrastructureError {
    constructor(eventSourceableType, id, expectedVersion, currentVersion) {
        super(`${eventSourceableType}: expected event sourceable with id of '${id}' to be at version ${expectedVersion} but is at version ${currentVersion}`);
    }
};
exports.CommitConcurrencyError = __decorate([
    core.Type('CommitConcurrencyError')({ kind: 19, name: "CommitConcurrencyError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "eventSourceableType", modifiers: 0, type: { kind: 2 } }, { name: "id", modifiers: 0, type: { kind: 2 } }, { name: "expectedVersion", modifiers: 0, type: { kind: 2 } }, { name: "currentVersion", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String])
], exports.CommitConcurrencyError);
exports.EventsNotFoundError = class EventsNotFoundError extends exports.InfrastructureError {
    constructor(EventSourceableTypeName, id) {
        super(`No events found for event sourceable '${EventSourceableTypeName}' with id '${id}'`);
    }
};
exports.EventsNotFoundError = __decorate([
    core.Type('EventsNotFoundError')({ kind: 19, name: "EventsNotFoundError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "EventSourceableTypeName", modifiers: 0, type: { kind: 2 } }, { name: "id", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.EventsNotFoundError);
exports.AddingCommitFailedError = class AddingCommitFailedError extends exports.InfrastructureError {
    constructor(storageName, commitId, appId) {
        super(`${storageName}: adding commit with id '${commitId}' failed on '${appId}'`);
    }
};
exports.AddingCommitFailedError = __decorate([
    core.Type('AddingCommitFailedError')({ kind: 19, name: "AddingCommitFailedError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "storageName", modifiers: 0, type: { kind: 2 } }, { name: "commitId", modifiers: 0, type: { kind: 2 } }, { name: "appId", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], exports.AddingCommitFailedError);
exports.UpdatingCommitError = class UpdatingCommitError extends exports.InfrastructureError {
    constructor(storageName, commitId, appId) {
        super(`${storageName}: updating commit with id '${commitId}' failed on '${appId}'`);
    }
};
exports.UpdatingCommitError = __decorate([
    core.Type('UpdatingCommitError')({ kind: 19, name: "UpdatingCommitError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "storageName", modifiers: 0, type: { kind: 2 } }, { name: "commitId", modifiers: 0, type: { kind: 2 } }, { name: "appId", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], exports.UpdatingCommitError);
exports.AddingSnapshotError = class AddingSnapshotError extends exports.InfrastructureError {
    constructor(storageName, EventSourceableTypeName, eventSourceableId) {
        super(`${storageName}: adding snapshot for event sourceable '${EventSourceableTypeName}' with id '${eventSourceableId}' failed`);
    }
};
exports.AddingSnapshotError = __decorate([
    core.Type('AddingSnapshotError')({ kind: 19, name: "AddingSnapshotError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "storageName", modifiers: 0, type: { kind: 2 } }, { name: "EventSourceableTypeName", modifiers: 0, type: { kind: 2 } }, { name: "eventSourceableId", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], exports.AddingSnapshotError);
exports.UpdatingSnapshotError = class UpdatingSnapshotError extends exports.InfrastructureError {
    constructor(storageName, EventSourceableTypeName, eventSourceableId) {
        super(`${storageName}: updating snapshot for event sourceable '${EventSourceableTypeName}' with id '${eventSourceableId}' failed`);
    }
};
exports.UpdatingSnapshotError = __decorate([
    core.Type('UpdatingSnapshotError')({ kind: 19, name: "UpdatingSnapshotError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "storageName", modifiers: 0, type: { kind: 2 } }, { name: "EventSourceableTypeName", modifiers: 0, type: { kind: 2 } }, { name: "eventSourceableId", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], exports.UpdatingSnapshotError);
exports.StorageNotFoundError = class StorageNotFoundError extends exports.InfrastructureError {
    constructor(storageName, clientType) {
        super(`${storageName}: storage for client type '${clientType}' was not found`);
    }
};
exports.StorageNotFoundError = __decorate([
    core.Type('StorageNotFoundError')({ kind: 19, name: "StorageNotFoundError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "storageName", modifiers: 0, type: { kind: 2 } }, { name: "clientType", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.StorageNotFoundError);
exports.RouterError = class RouterError extends exports.InfrastructureError {
};
exports.RouterError = __decorate([
    core.Type('RouterError')({ kind: 19, name: "RouterError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } })
], exports.RouterError);
exports.MissingEventSourceableError = class MissingEventSourceableError extends exports.RouterError {
    constructor(routerName) {
        super(`${routerName}: please specify property Router.prototype.EventSourceableType as EventSourceable class to be managed by the router`);
    }
};
exports.MissingEventSourceableError = __decorate([
    core.Type('MissingEventSourceableError')({ kind: 19, name: "MissingEventSourceableError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "routerName", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], exports.MissingEventSourceableError);
exports.MissingInitializingMessageError = class MissingInitializingMessageError extends exports.RouterError {
    constructor(routerName) {
        super(`${routerName}: please specify property Router.prototype.InitializingMessageType(as command or event class) that will be used to create new instances of the managed EventSourceable`);
    }
};
exports.MissingInitializingMessageError = __decorate([
    core.Type('MissingInitializingMessageError')({ kind: 19, name: "MissingInitializingMessageError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "routerName", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], exports.MissingInitializingMessageError);
exports.CannotRouteMessageError = class CannotRouteMessageError extends exports.RouterError {
    constructor(routerName, messageTypeName) {
        super(`${routerName}: no event sourceable found to handle '${messageTypeName}'`);
    }
};
exports.CannotRouteMessageError = __decorate([
    core.Type('CannotRouteMessageError')({ kind: 19, name: "CannotRouteMessageError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "routerName", modifiers: 0, type: { kind: 2 } }, { name: "messageTypeName", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.CannotRouteMessageError);
exports.UnresolvableIdentifierFromMessageError = class UnresolvableIdentifierFromMessageError extends exports.RouterError {
    constructor(routerName, eventTypeName, esTypeName) {
        super(`${routerName}: message '${eventTypeName}' is not a valid initializing or handleable message for '${esTypeName}'`);
    }
};
exports.UnresolvableIdentifierFromMessageError = __decorate([
    core.Type('UnresolvableIdentifierFromMessageError')({ kind: 19, name: "UnresolvableIdentifierFromMessageError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "routerName", modifiers: 0, type: { kind: 2 } }, { name: "eventTypeName", modifiers: 0, type: { kind: 2 } }, { name: "esTypeName", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String])
], exports.UnresolvableIdentifierFromMessageError);
let InitializingIdentifierAlreadyExistsError = class InitializingIdentifierAlreadyExistsError extends exports.RouterError {
    constructor(routerName, id) {
        super(`${routerName}: provided identifier ${id} is already in use`);
    }
};
InitializingIdentifierAlreadyExistsError = __decorate([
    core.Type('InitializingIdentifierAlreadyExistsError')({ kind: 19, name: "InitializingIdentifierAlreadyExistsError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "routerName", modifiers: 0, type: { kind: 2 } }, { name: "id", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.RouterError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], InitializingIdentifierAlreadyExistsError);
let SnapshotterError = class SnapshotterError extends exports.InfrastructureError {
};
SnapshotterError = __decorate([
    core.Type('SnapshotterError')({ kind: 19, name: "SnapshotterError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } })
], SnapshotterError);
exports.UndefinedSnapshotterFrequencyError = class UndefinedSnapshotterFrequencyError extends SnapshotterError {
    constructor() {
        super(`Missing snapshotting frequency on configuration with path: 'eveble.Snapshotter.frequency'`);
    }
};
exports.UndefinedSnapshotterFrequencyError = __decorate([
    core.Type('UndefinedSnapshotterFrequencyError')({ kind: 19, name: "UndefinedSnapshotterFrequencyError", properties: {}, constructors: [{ modifiers: 0, parameters: [] }], extends: { kind: 18, type: SnapshotterError, arguments: [] } }),
    __metadata("design:paramtypes", [])
], exports.UndefinedSnapshotterFrequencyError);
exports.UndefinedSnapshotterError = class UndefinedSnapshotterError extends exports.InfrastructureError {
    constructor() {
        super(`Snapshotter is not defined on EventSourceableRepository`);
    }
};
exports.UndefinedSnapshotterError = __decorate([
    core.Type('UndefinedSnapshotterError')({ kind: 19, name: "UndefinedSnapshotterError", properties: {}, constructors: [{ modifiers: 0, parameters: [] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } }),
    __metadata("design:paramtypes", [])
], exports.UndefinedSnapshotterError);
exports.ProjectionRebuildingError = class ProjectionRebuildingError extends exports.InfrastructureError {
};
exports.ProjectionRebuildingError = __decorate([
    core.Type('ProjectionRebuildingError')({ kind: 19, name: "ProjectionRebuildingError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } })
], exports.ProjectionRebuildingError);
exports.ProjectionAlreadyRebuildingError = class ProjectionAlreadyRebuildingError extends exports.ProjectionRebuildingError {
    constructor(projectionName) {
        super(`Projection '${projectionName}' is already being rebuilt`);
    }
};
exports.ProjectionAlreadyRebuildingError = __decorate([
    core.Type('ProjectionAlreadyRebuildingError')({ kind: 19, name: "ProjectionAlreadyRebuildingError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "projectionName", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.ProjectionRebuildingError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], exports.ProjectionAlreadyRebuildingError);
exports.ProjectionNotRebuildingError = class ProjectionNotRebuildingError extends exports.ProjectionRebuildingError {
    constructor(projectionName) {
        super(`Expected projection '${projectionName}' to be in a state of rebuilding`);
    }
};
exports.ProjectionNotRebuildingError = __decorate([
    core.Type('ProjectionNotRebuildingError')({ kind: 19, name: "ProjectionNotRebuildingError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "projectionName", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.ProjectionRebuildingError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], exports.ProjectionNotRebuildingError);
exports.ClientError = class ClientError extends exports.InfrastructureError {
};
exports.ClientError = __decorate([
    core.Type('ClientError')({ kind: 19, name: "ClientError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } })
], exports.ClientError);
exports.InactiveClientError = class InactiveClientError extends exports.ClientError {
    constructor(targetName, clientId) {
        super(`${targetName}: can't be initialized since underlying client with id '${clientId}' is inactive`);
    }
};
exports.InactiveClientError = __decorate([
    core.Type('InactiveClientError')({ kind: 19, name: "InactiveClientError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "targetName", modifiers: 0, type: { kind: 2 } }, { name: "clientId", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.ClientError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.InactiveClientError);
exports.SchedulerError = class SchedulerError extends exports.InfrastructureError {
};
exports.SchedulerError = __decorate([
    core.Type('SchedulerError')({ kind: 19, name: "SchedulerError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.InfrastructureError, arguments: [] } })
], exports.SchedulerError);
exports.CommandSchedulingError = class CommandSchedulingError extends exports.SchedulerError {
    constructor(jobName, assignmentId, assignerType, assignerId, error) {
        super(`${jobName}: cannot schedule command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`);
    }
};
exports.CommandSchedulingError = __decorate([
    core.Type('CommandSchedulingError')({ kind: 19, name: "CommandSchedulingError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "jobName", modifiers: 0, type: { kind: 2 } }, { name: "assignmentId", modifiers: 0, type: { kind: 2 } }, { name: "assignerType", modifiers: 0, type: { kind: 2 } }, { name: "assignerId", modifiers: 0, type: { kind: 2 } }, { name: "error", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.SchedulerError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String, String])
], exports.CommandSchedulingError);
exports.CommandUnschedulingError = class CommandUnschedulingError extends exports.SchedulerError {
    constructor(jobName, assignmentId, assignerType, assignerId, error) {
        super(`${jobName}: cannot cancel command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`);
    }
};
exports.CommandUnschedulingError = __decorate([
    core.Type('CommandUnschedulingError')({ kind: 19, name: "CommandUnschedulingError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "jobName", modifiers: 0, type: { kind: 2 } }, { name: "assignmentId", modifiers: 0, type: { kind: 2 } }, { name: "assignerType", modifiers: 0, type: { kind: 2 } }, { name: "assignerId", modifiers: 0, type: { kind: 2 } }, { name: "error", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.SchedulerError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String, String])
], exports.CommandUnschedulingError);

exports.History = class History extends Array {
    constructor(events) {
        super();
        this.push(...events);
    }
    getInitializingMessage() {
        return this[0];
    }
};
exports.History = __decorate([
    typend.Type()({ kind: 19, name: "History", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "events", modifiers: 0, type: { kind: 18, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "version": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] } }] }], extends: { kind: 18, type: Array, arguments: [{ kind: 1 }] } }),
    __metadata("design:paramtypes", [Array])
], exports.History);

exports.EventSourceableRepository = class EventSourceableRepository {
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
    async hasBySourceId(eventSourceableId) {
        return this.commitStore.hasBySourceId(eventSourceableId);
    }
    async makeSnapshotOf(eventSourceable) {
        if (!this.isSnapshotting()) {
            throw new exports.UndefinedSnapshotterError();
        }
        const snapshotter = this.injector.get(BINDINGS.Snapshotter);
        const snapshotIdOnStorage = await snapshotter.makeSnapshotOf(eventSourceable);
        return snapshotIdOnStorage;
    }
    async getSnapshotOf(EventSourceableType, eventSourceableId) {
        if (!this.isSnapshotting()) {
            throw new exports.UndefinedSnapshotterError();
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
            await this.injector.injectIntoAsync(eventSourceable);
            if (remainingEvents !== undefined && remainingEvents.length > 0) {
                this.log.debug(new Log(`replaying history on snapshot of '${EventSourceableType.getTypeName()}' with id '${eventSourceableId}'`)
                    .on(this)
                    .in(this.restoreFromSnapshot)
                    .with('event sourceable', eventSourceable)
                    .with('remaining events', remainingEvents));
                const history = new exports.History(remainingEvents);
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
            const history = new exports.History(eventHistory);
            eventSourceable = new EventSourceableType(history);
            await this.injector.injectIntoAsync(eventSourceable);
            eventSourceable.replayHistory(eventHistory);
        }
        else {
            const error = new exports.EventsNotFoundError(EventSourceableType.getTypeName(), eventSourceableId.toString());
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
    inversify.inject(BINDINGS.Injector),
    __metadata("design:type", Object)
], exports.EventSourceableRepository.prototype, "injector", void 0);
__decorate([
    inversify.inject(BINDINGS.Config),
    __metadata("design:type", Object)
], exports.EventSourceableRepository.prototype, "config", void 0);
__decorate([
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], exports.EventSourceableRepository.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.CommitStore),
    __metadata("design:type", Object)
], exports.EventSourceableRepository.prototype, "commitStore", void 0);
exports.EventSourceableRepository = __decorate([
    inversify.injectable()
], exports.EventSourceableRepository);

var CommitReceiver_1;
exports.CommitReceiver = CommitReceiver_1 = class CommitReceiver extends core$1.derive(StatefulTrait, exports.Serializable) {
    constructor(props = {}) {
        super(props);
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
exports.CommitReceiver.STATES = {
    received: 'received',
    published: 'published',
    timeouted: 'timeouted',
    failed: 'failed',
};
exports.CommitReceiver = CommitReceiver_1 = __decorate([
    typend.Type('CommitReceiver')({ kind: 19, name: "CommitReceiver", properties: { "state": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "appId": { kind: 2, modifiers: 1 }, "workerId": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }] }, "receivedAt": { kind: 18, modifiers: 1, type: Date, arguments: [] }, "publishedAt": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "failedAt": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, initializer: () => ({}), name: "__type", properties: {} } }] }], extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], exports.CommitReceiver);
exports.Commit = class Commit extends exports.Serializable {
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
        return this.receivers.find((receiver) => receiver.appId.toString() === appId.toString());
    }
};
exports.Commit = __decorate([
    typend.Type('Commit')({ kind: 19, name: "Commit", properties: { "id": { kind: 2, modifiers: 1 }, "sourceId": { kind: 2, modifiers: 1 }, "version": { kind: 3, modifiers: 1 }, "eventSourceableType": { kind: 2, modifiers: 1 }, "commands": { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "getId": { kind: 21, modifiers: 0 }, "isDeliverable": { kind: 21, modifiers: 0 }, "isScheduled": { kind: 21, modifiers: 0 }, "schedule": { kind: 21, modifiers: 0 }, "getAssignment": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] }, "events": { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "version": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] }, "insertedAt": { kind: 18, modifiers: 1, type: Date, arguments: [] }, "sentBy": { kind: 2, modifiers: 1 }, "receivers": { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 18, type: exports.CommitReceiver, arguments: [] }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, initializer: () => ({}), name: "__type", properties: {} } }] }], extends: { kind: 18, type: exports.Serializable, arguments: [] } })
], exports.Commit);

exports.CommitStore = class CommitStore {
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
            throw new exports.CommitConcurrencyError(eventSourceableType, sourceId.toString(), expectedVersion.toString(), currentVersion.toString());
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
        const receiver = new exports.CommitReceiver({
            state: exports.CommitReceiver.STATES.received,
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
            props.id = new exports.Guid().toString();
        }
        return new exports.Commit(props);
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
    async hasBySourceId(eventSourceableId) {
        return this.storage.hasBySourceId(eventSourceableId);
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
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], exports.CommitStore.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.Config),
    __metadata("design:type", Object)
], exports.CommitStore.prototype, "config", void 0);
__decorate([
    inversify.inject(BINDINGS.CommitStorage),
    __metadata("design:type", Object)
], exports.CommitStore.prototype, "storage", void 0);
__decorate([
    inversify.inject(BINDINGS.CommitPublisher),
    __metadata("design:type", Object)
], exports.CommitStore.prototype, "publisher", void 0);
exports.CommitStore = __decorate([
    inversify.injectable()
], exports.CommitStore);

exports.CommitPublisher = class CommitPublisher {
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
            if (!receiver.isInState(exports.CommitReceiver.STATES.timeouted)) {
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
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], exports.CommitPublisher.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.Config),
    __metadata("design:type", Object)
], exports.CommitPublisher.prototype, "config", void 0);
__decorate([
    inversify.inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], exports.CommitPublisher.prototype, "commandBus", void 0);
__decorate([
    inversify.inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], exports.CommitPublisher.prototype, "eventBus", void 0);
__decorate([
    inversify.inject(BINDINGS.Serializer),
    __metadata("design:type", Object)
], exports.CommitPublisher.prototype, "serializer", void 0);
__decorate([
    inversify.inject(BINDINGS.CommitStorage),
    __metadata("design:type", Object)
], exports.CommitPublisher.prototype, "storage", void 0);
__decorate([
    inversify.inject(BINDINGS.CommitObserver),
    __metadata("design:type", Object)
], exports.CommitPublisher.prototype, "observer", void 0);
exports.CommitPublisher = __decorate([
    inversify.injectable(),
    __metadata("design:paramtypes", [])
], exports.CommitPublisher);

const CommandHandlingTrait = core$1.trait([OneToOneHandlingTrait], (base) => {
    const klass = class extends base {
        initialize() {
            this.setupCommandHandlers();
        }
        setupCommandHandlers() {
            this.setupHandlers({
                handlers: this.handles(),
                registrator: this.registerCommandHandler.bind(this),
                handleableTypes: [exports.Command],
            });
        }
        registerCommandHandler(commandType, handler, shouldOverride = false) {
            this.ensureHandleability(commandType, [exports.Command]);
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
    const descriptor = Object.getOwnPropertyDescriptor(core$1.trait.prototype, 'initialize');
    inversify.inject(BINDINGS.CommandBus)(klass.prototype, 'commandBus');
    inversify.postConstruct()(klass.prototype, 'initialize', descriptor);
    return klass;
});

const EventHandlingTrait = core$1.trait([OneToManyHandlingTrait], (base) => {
    const klass = class extends base {
        initialize() {
            this.setupEventHandlers();
        }
        setupEventHandlers() {
            this.setupHandlers({
                handlers: this.subscribes(),
                registrator: this.registerEventHandler.bind(this),
                handleableTypes: [exports.Event],
            });
        }
        registerEventHandler(eventType, handler, shouldOverride = false) {
            this.ensureHandleability(eventType, [exports.Event]);
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
    const descriptor = Object.getOwnPropertyDescriptor(core$1.trait.prototype, 'initialize');
    inversify.inject(BINDINGS.EventBus)(klass.prototype, 'eventBus');
    inversify.postConstruct()(klass.prototype, 'initialize', descriptor);
    return klass;
});

exports.Service = class Service extends core$1.derive(CommandHandlingTrait, EventHandlingTrait) {
    initialize() {
        this.setupCommandHandlers();
        this.setupEventHandlers();
    }
};
__decorate([
    inversify.inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], exports.Service.prototype, "commandBus", void 0);
__decorate([
    inversify.inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], exports.Service.prototype, "eventBus", void 0);
__decorate([
    inversify.postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], exports.Service.prototype, "initialize", null);
exports.Service = __decorate([
    inversify.injectable()
], exports.Service);

exports.ScheduleCommand = class ScheduleCommand extends exports.Command {
    isDeliverable() {
        const metadata = this.command.getMetadata();
        return new Date().getTime() >= (metadata === null || metadata === void 0 ? void 0 : metadata.scheduling.deliverAt.getTime());
    }
    getDeliveryDate() {
        const metadata = this.command.getMetadata();
        return metadata === null || metadata === void 0 ? void 0 : metadata.scheduling.deliverAt;
    }
    getAssignment() {
        return lodash.get(this, 'metadata.scheduling');
    }
};
exports.ScheduleCommand = __decorate([
    core.Type('ScheduleCommand')({ kind: 19, name: "ScheduleCommand", properties: { "command": { kind: 15, modifiers: 1, name: "Command", properties: { "targetId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "getId": { kind: 21, modifiers: 0 }, "isDeliverable": { kind: 21, modifiers: 0 }, "isScheduled": { kind: 21, modifiers: 0 }, "schedule": { kind: 21, modifiers: 0 }, "getAssignment": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 999 } }] }], extends: { kind: 18, type: exports.Command, arguments: [{ kind: 18, type: exports.ScheduleCommand, arguments: [] }] } })
], exports.ScheduleCommand);

exports.UnscheduleCommand = class UnscheduleCommand extends exports.Command {
};
exports.UnscheduleCommand = __decorate([
    core.Type('UnscheduleCommand')({ kind: 19, name: "UnscheduleCommand", properties: { "assignmentId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "commandType": { kind: 2, modifiers: 0 }, "assignerId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "assignerType": { kind: 2, modifiers: 0 } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 999 } }] }], extends: { kind: 18, type: exports.Command, arguments: [{ kind: 18, type: exports.UnscheduleCommand, arguments: [] }] } })
], exports.UnscheduleCommand);

exports.CommandSchedulingService = class CommandSchedulingService extends exports.Service {
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
    inversify.inject(BINDINGS.CommandScheduler),
    __metadata("design:type", Object)
], exports.CommandSchedulingService.prototype, "scheduler", void 0);
__decorate([
    inversify.inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], exports.CommandSchedulingService.prototype, "commandBus", void 0);
__decorate([
    inversify.inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], exports.CommandSchedulingService.prototype, "eventBus", void 0);
__decorate([
    __param(0, handle),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exports.ScheduleCommand]),
    __metadata("design:returntype", Promise)
], exports.CommandSchedulingService.prototype, "ScheduleCommand", null);
__decorate([
    __param(0, handle),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exports.UnscheduleCommand]),
    __metadata("design:returntype", Promise)
], exports.CommandSchedulingService.prototype, "UnscheduleCommand", null);
exports.CommandSchedulingService = __decorate([
    inversify.injectable()
], exports.CommandSchedulingService);

exports.Snapshotter = class Snapshotter {
    initialize() {
        if (!this.config.has('eveble.Snapshotter.frequency')) {
            throw new exports.UndefinedSnapshotterFrequencyError();
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
    inversify.inject(BINDINGS.Config),
    __metadata("design:type", Object)
], exports.Snapshotter.prototype, "config", void 0);
__decorate([
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], exports.Snapshotter.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.SnapshotStorage),
    __metadata("design:type", Object)
], exports.Snapshotter.prototype, "storage", void 0);
__decorate([
    inversify.postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], exports.Snapshotter.prototype, "initialize", null);
exports.Snapshotter = __decorate([
    inversify.injectable()
], exports.Snapshotter);

exports.DomainException = class DomainException extends exports.Event {
};
exports.DomainException = __decorate([
    core.Type('DomainException')({ kind: 19, name: "DomainException", properties: { "thrower": { kind: 2, modifiers: 0 }, "error": { kind: 18, modifiers: 0, type: exports.DomainError, arguments: [] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 999 } }] }], extends: { kind: 18, type: exports.Event, arguments: [{ kind: 18, type: exports.DomainException, arguments: [] }] } })
], exports.DomainException);

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
            throw new exports.MissingEventSourceableError(this.constructor.name);
        }
        this.InitializingMessageType = this.resolveInitializingMessage();
        if (this.InitializingMessageType === undefined) {
            throw new exports.MissingInitializingMessageError(this.constructor.name);
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
            this.setupEventHandler(EventType);
        }
        for (const CommandType of this.routedCommands) {
            this.setupCommandHandler(CommandType);
        }
    }
    setupInitializingMessageHandler(handler) {
        const boundHandler = handler.bind(this);
        boundHandler.original = handler;
        const MessageType = this.InitializingMessageType;
        if (this.InitializingMessageType.prototype instanceof exports.Event) {
            this.eventBus.subscribeTo(MessageType, boundHandler);
        }
        else if (this.InitializingMessageType.prototype instanceof exports.Command) {
            this.commandBus.registerHandler(MessageType, boundHandler);
        }
        else {
            throw new exports.InvalidInitializingMessageError(this.EventSourceableType.getTypeName(), core.kernel.describer.describe([exports.Command, exports.Event]), core.kernel.describer.describe(MessageType));
        }
    }
    async initializingMessageHandler(message) {
        const eventSourceableId = this.getIdForEventSourceableFromMessage(message);
        if (eventSourceableId !== undefined) {
            const isInitializable = await this.isInitializable(eventSourceableId);
            if (isInitializable === false) {
                const error = new InitializingIdentifierAlreadyExistsError(this.EventSourceableType.getTypeName(), message.getId().toString());
                this.log.error(new Log(`failed handling message '${message.getTypeName()}' do to error: ${error.name}: ${error.message}`)
                    .on(this)
                    .in(this.initializingMessageHandler)
                    .with('message', message));
                throw error;
            }
        }
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
    async isInitializable(eventSourceableId) {
        return (await this.repository.hasBySourceId(eventSourceableId)) === false;
    }
    getIdForEventSourceableFromMessage(message) {
        if (message instanceof exports.Command) {
            return message.getId();
        }
        const esTypeName = this.EventSourceableType.getTypeName();
        if (message instanceof exports.Event) {
            if (message.hasCorrelationId(esTypeName)) {
                return message.getCorrelationId(esTypeName);
            }
            return undefined;
        }
        throw new exports.UnresolvableIdentifierFromMessageError(this.constructor.name, this.EventSourceableType.getTypeName(), message.getTypeName());
    }
    async handleOrThrowDomainError(fn, message) {
        try {
            return await fn.call(this);
        }
        catch (error) {
            this.log.error(new Log(`failed handling '${message.getTypeName()}' do to error: ${error.name}: ${error.message}`)
                .on(this)
                .in(this.handleOrThrowDomainError)
                .with('message', message));
            if (error instanceof exports.DomainError) {
                const props = {
                    sourceId: message.getId(),
                    thrower: this.EventSourceableType.getTypeName(),
                    error,
                    metadata: {},
                };
                if (message.hasMetadata()) {
                    props.metadata = { ...message.getMetadata() };
                }
                const exception = new exports.DomainException(props);
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
            throw new exports.CannotRouteMessageError(this.constructor.name, message.getTypeName());
        }
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
    setupCommandHandler(CommandType) {
        const boundHandler = this.messageHandler.bind(this);
        boundHandler.original = this.messageHandler;
        this.commandBus.registerHandler(CommandType, boundHandler);
    }
    setupEventHandler(EventType) {
        const boundHandler = this.messageHandler.bind(this);
        boundHandler.original = this.messageHandler;
        this.eventBus.subscribeTo(EventType, boundHandler);
    }
    async handleSaveErrors(error, message, eventSourceableId) {
        if (error instanceof exports.CommitConcurrencyError) {
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
    inversify.inject(BINDINGS.Injector),
    __metadata("design:type", Object)
], Router.prototype, "injector", void 0);
__decorate([
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], Router.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], Router.prototype, "commandBus", void 0);
__decorate([
    inversify.inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], Router.prototype, "eventBus", void 0);
__decorate([
    inversify.inject(BINDINGS.EventSourceableRepository),
    __metadata("design:type", Object)
], Router.prototype, "repository", void 0);
__decorate([
    inversify.postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Router.prototype, "initialize", null);

class AssertionApiAlreadyExistsError extends core.ExtendableError {
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
            if (lodash.has(this, path)) {
                throw new AssertionApiAlreadyExistsError(helpers.getTypeName(this.constructor), helpers.getTypeName(assertion), path);
            }
            if (typeof method === 'function') {
                const boundMethod = method.bind(assertion);
                lodash.set(this, path, boundMethod);
            }
            else {
                lodash.set(this, path, method);
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

exports.InvalidStateTransitionError = class InvalidStateTransitionError extends exports.AssertionError {
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
exports.InvalidStateTransitionError = __decorate([
    core.Type('InvalidStateTransitionError')({ kind: 19, name: "InvalidStateTransitionError", properties: { "entityName": { kind: 2, modifiers: 0 }, "entityId": { kind: 2, modifiers: 0 }, "currentState": { kind: 2, modifiers: 0 }, "expectedStates": { kind: 18, modifiers: 0, type: Array, arguments: [{ kind: 2 }] }, "action": { kind: 2, modifiers: 0 } }, constructors: [{ modifiers: 0, parameters: [{ name: "entityName", modifiers: 0, type: { kind: 2 } }, { name: "entityId", modifiers: 0, type: { kind: 2 } }, { name: "currentState", modifiers: 0, type: { kind: 2 } }, { name: "expected", modifiers: 0, type: { kind: 2 } }, { name: "action", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.AssertionError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String, String])
], exports.InvalidStateTransitionError);
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
                throw new exports.UndefinedActionError(this.asserter.getEntity().getTypeName(), api);
            }
            let action = this.asserter.getAction();
            if (action.getTypeName !== undefined) {
                action = action.getTypeName();
            }
            throw new exports.InvalidStateTransitionError(this.asserter.getEntity().getTypeName(), this.asserter.getEntity().getId().toString(), this.asserter.getEntity().getState(), expectedState, action.toString());
        }
    }
}

exports.InvalidStatusTransitionError = class InvalidStatusTransitionError extends exports.AssertionError {
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
exports.InvalidStatusTransitionError = __decorate([
    core.Type('InvalidStatusTransitionError')({ kind: 19, name: "InvalidStatusTransitionError", properties: { "entityName": { kind: 2, modifiers: 0 }, "entityId": { kind: 2, modifiers: 0 }, "currentStatus": { kind: 2, modifiers: 0 }, "expectedStatuses": { kind: 18, modifiers: 0, type: Array, arguments: [{ kind: 2 }] }, "action": { kind: 2, modifiers: 0 } }, constructors: [{ modifiers: 0, parameters: [{ name: "entityName", modifiers: 0, type: { kind: 2 } }, { name: "entityId", modifiers: 0, type: { kind: 2 } }, { name: "currentStatus", modifiers: 0, type: { kind: 2 } }, { name: "expected", modifiers: 0, type: { kind: 2 } }, { name: "action", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.AssertionError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String, String, String, String])
], exports.InvalidStatusTransitionError);
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
                throw new exports.UndefinedActionError(this.asserter.getEntity().getTypeName(), api);
            }
            let action = this.asserter.getAction();
            if (action.getTypeName !== undefined) {
                action = action.getTypeName();
            }
            throw new exports.InvalidStatusTransitionError(this.asserter.getEntity().getTypeName(), this.asserter.getEntity().getId().toString(), this.asserter.getEntity().getStatus(), expectedStatus, action.toString());
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
                                    entity[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
                                    const result = entity[propKey](...args);
                                    entity[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
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
                                    entity[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
                                    let isAble = true;
                                    try {
                                        entity[propKey](...args);
                                    }
                                    catch (e) {
                                        isAble = false;
                                    }
                                    entity[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
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
            this.commandScheduler =
                await this.injector.getAsync(BINDINGS.CommandScheduler);
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
        core.kernel.setAsserter(asserter);
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
                .to(exports.EJSONSerializerAdapter);
            (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`bound 'Serializer' to 'EJSONSerializerAdapter' in singleton scope`)
                .on(this)
                .in(this.initializeTopLevelDependencies));
        }
    }
    async setSerializerOnKernel() {
        var _a;
        const serializer = await this.injector.getAsync(BINDINGS.Serializer);
        core.kernel.setSerializer(serializer);
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
            CommitPublisher: exports.CommitPublisher,
            CommitStore: exports.CommitStore,
            CommandBus: exports.CommandBus,
            EventBus: exports.EventBus,
            EventSourceableRepository: exports.EventSourceableRepository,
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
                .to(exports.Snapshotter)
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
            const service = new exports.CommandSchedulingService();
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

class Client extends core$1.derive(StatefulTrait) {
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

let MongoDBCollectionConfig = class MongoDBCollectionConfig extends exports.Config {
    constructor(props) {
        super();
        Object.assign(this, this.processProps(props));
    }
};
MongoDBCollectionConfig = __decorate([
    core.Type()({ kind: 19, name: "MongoDBCollectionConfig", properties: { "name": { kind: 2, modifiers: 1 }, "indexes": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Array, arguments: [{ kind: 1 }] }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, name: "__type", properties: { "name": { kind: 999, modifiers: 0 }, "indexes": { kind: 999, modifiers: 0 }, "isConfigurable": { kind: 999, modifiers: 0 }, "getPropTypes": { kind: 999, modifiers: 0 }, "has": { kind: 999, modifiers: 0 }, "get": { kind: 999, modifiers: 0 }, "getExact": { kind: 999, modifiers: 0 }, "getDefault": { kind: 999, modifiers: 0 }, "hasDefault": { kind: 999, modifiers: 0 }, "set": { kind: 999, modifiers: 0 }, "assign": { kind: 999, modifiers: 0 }, "include": { kind: 999, modifiers: 0 }, "merge": { kind: 999, modifiers: 0 }, "__@CONFIG_INCLUDED_KEY@7335": { kind: 999, modifiers: 0 }, "__@CONFIG_MERGED_KEY@7336": { kind: 999, modifiers: 0 }, "schemaVersion": { kind: 999, modifiers: 0 }, "in": { kind: 999, modifiers: 0 }, "typeName": { kind: 999, modifiers: 0 }, "getTypeName": { kind: 999, modifiers: 0 }, "toString": { kind: 999, modifiers: 0 }, "toJSONValue": { kind: 999, modifiers: 0 }, "transformLegacyProps": { kind: 999, modifiers: 0 }, "getCurrentSchemaVersion": { kind: 999, modifiers: 0 }, "isLegacySchemaVersion": { kind: 999, modifiers: 0 }, "calculateNextSchemaVersion": { kind: 999, modifiers: 0 }, "registerLegacyTransformer": { kind: 999, modifiers: 0 }, "overrideLegacyTransformer": { kind: 999, modifiers: 0 }, "hasLegacyTransformer": { kind: 999, modifiers: 0 }, "getLegacyTransformers": { kind: 999, modifiers: 0 }, "getLegacyTransformer": { kind: 999, modifiers: 0 }, "getSchemaVersion": { kind: 999, modifiers: 0 }, "getPropertyInitializers": { kind: 999, modifiers: 0 }, "getInstanceInitializers": { kind: 999, modifiers: 0 }, "getParentInitializers": { kind: 999, modifiers: 0 }, "toPlainObject": { kind: 999, modifiers: 0 }, "validateProps": { kind: 999, modifiers: 0 }, "equals": { kind: 999, modifiers: 0 }, "hasSameValues": { kind: 999, modifiers: 0 }, "registerHook": { kind: 999, modifiers: 0 }, "overrideHook": { kind: 999, modifiers: 0 }, "getHook": { kind: 999, modifiers: 0 }, "getHookOrThrow": { kind: 999, modifiers: 0 }, "getHooks": { kind: 999, modifiers: 0 }, "getActions": { kind: 999, modifiers: 0 }, "hasHook": { kind: 999, modifiers: 0 }, "hasAction": { kind: 999, modifiers: 0 }, "removeHook": { kind: 999, modifiers: 0 } } } }] }], extends: { kind: 18, type: exports.Config, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], MongoDBCollectionConfig);
let MongoDBDatabaseConfig = class MongoDBDatabaseConfig extends exports.Config {
    constructor(props) {
        super();
        Object.assign(this, this.processProps(props));
    }
};
MongoDBDatabaseConfig = __decorate([
    core.Type()({ kind: 19, name: "MongoDBDatabaseConfig", properties: { "name": { kind: 2, modifiers: 1 }, "collections": { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 18, type: MongoDBCollectionConfig, arguments: [] }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, name: "__type", properties: { "name": { kind: 999, modifiers: 0 }, "collections": { kind: 999, modifiers: 0 }, "isConfigurable": { kind: 999, modifiers: 0 }, "getPropTypes": { kind: 999, modifiers: 0 }, "has": { kind: 999, modifiers: 0 }, "get": { kind: 999, modifiers: 0 }, "getExact": { kind: 999, modifiers: 0 }, "getDefault": { kind: 999, modifiers: 0 }, "hasDefault": { kind: 999, modifiers: 0 }, "set": { kind: 999, modifiers: 0 }, "assign": { kind: 999, modifiers: 0 }, "include": { kind: 999, modifiers: 0 }, "merge": { kind: 999, modifiers: 0 }, "__@CONFIG_INCLUDED_KEY@7335": { kind: 999, modifiers: 0 }, "__@CONFIG_MERGED_KEY@7336": { kind: 999, modifiers: 0 }, "schemaVersion": { kind: 999, modifiers: 0 }, "in": { kind: 999, modifiers: 0 }, "typeName": { kind: 999, modifiers: 0 }, "getTypeName": { kind: 999, modifiers: 0 }, "toString": { kind: 999, modifiers: 0 }, "toJSONValue": { kind: 999, modifiers: 0 }, "transformLegacyProps": { kind: 999, modifiers: 0 }, "getCurrentSchemaVersion": { kind: 999, modifiers: 0 }, "isLegacySchemaVersion": { kind: 999, modifiers: 0 }, "calculateNextSchemaVersion": { kind: 999, modifiers: 0 }, "registerLegacyTransformer": { kind: 999, modifiers: 0 }, "overrideLegacyTransformer": { kind: 999, modifiers: 0 }, "hasLegacyTransformer": { kind: 999, modifiers: 0 }, "getLegacyTransformers": { kind: 999, modifiers: 0 }, "getLegacyTransformer": { kind: 999, modifiers: 0 }, "getSchemaVersion": { kind: 999, modifiers: 0 }, "getPropertyInitializers": { kind: 999, modifiers: 0 }, "getInstanceInitializers": { kind: 999, modifiers: 0 }, "getParentInitializers": { kind: 999, modifiers: 0 }, "toPlainObject": { kind: 999, modifiers: 0 }, "validateProps": { kind: 999, modifiers: 0 }, "equals": { kind: 999, modifiers: 0 }, "hasSameValues": { kind: 999, modifiers: 0 }, "registerHook": { kind: 999, modifiers: 0 }, "overrideHook": { kind: 999, modifiers: 0 }, "getHook": { kind: 999, modifiers: 0 }, "getHookOrThrow": { kind: 999, modifiers: 0 }, "getHooks": { kind: 999, modifiers: 0 }, "getActions": { kind: 999, modifiers: 0 }, "hasHook": { kind: 999, modifiers: 0 }, "hasAction": { kind: 999, modifiers: 0 }, "removeHook": { kind: 999, modifiers: 0 } } } }] }], extends: { kind: 18, type: exports.Config, arguments: [] } }),
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
            if (!lodash.isEmpty(this.databases)) {
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
        if (!this._library || this.isInState(Client.STATES.disconnected)) {
            return;
        }
        if (this.isInState(Client.STATES.stopped)) {
            this.setState(Client.STATES.disconnected);
            delete this._library;
            return;
        }
        this.log.debug(new Log(`disconnecting client '${this.getId()}'`)
            .on(this)
            .in(this.disconnect));
        try {
            await this._library.close(false);
            this.setState(Client.STATES.disconnected);
            delete this._library;
            this.log.debug(new Log(`disconnected client '${this.getId()}'`)
                .on(this)
                .in(this.disconnect));
        }
        catch (error) {
            this.log.warning(new Log(`error during disconnect: ${error}`)
                .on(this)
                .in(this.disconnect));
            this.setState(Client.STATES.disconnected);
            delete this._library;
        }
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
        var _a, _b;
        if (!this._library) {
            return false;
        }
        try {
            const topology = this._library.topology;
            if (!topology) {
                return false;
            }
            const topologyState = ((_a = topology.s) === null || _a === void 0 ? void 0 : _a.state) || ((_b = topology.description) === null || _b === void 0 ? void 0 : _b.type);
            const isTopologyConnected = topologyState !== 'closed' && topologyState !== 'Unknown';
            return this.isInState(Client.STATES.connected) && isTopologyConnected;
        }
        catch (_c) {
            return this.isInState(Client.STATES.connected);
        }
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
MongoDBClient.defaultOptions = {};
__decorate([
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], MongoDBClient.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.MongoDB.library),
    __metadata("design:type", Object)
], MongoDBClient.prototype, "MongoDB", void 0);

class PulseClient extends Client {
    async initialize() {
        this.log.debug(new Log(`initializing client '${this.getId()}'`)
            .on(this)
            .in(this.initialize)
            .with('url', this.mongoClient.url)
            .with('options', this.options)
            .with('collectionName', this.collectionName));
        try {
            const database = this.mongoClient.getDatabase(this.databaseName);
            this._library = new this.Pulse({
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
            this.setState(PulseClient.STATES.initialized);
        }
        catch (error) {
            this.setState(PulseClient.STATES.failed);
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
            PulseClient.STATES.initialized,
            PulseClient.STATES.connected,
            PulseClient.STATES.paused,
            PulseClient.STATES.stopped,
            PulseClient.STATES.disconnected,
        ]);
        return this._library;
    }
    async connect() {
        this.validateState([
            PulseClient.STATES.initialized,
            PulseClient.STATES.connected,
            PulseClient.STATES.stopped,
        ]);
        if (this.isConnected()) {
            return;
        }
        this.log.debug(new Log(`connecting client '${this.getId()}'`).on(this).in(this.connect));
        try {
            this.setState(PulseClient.STATES.connected);
            this.log.debug(new Log(`connected client '${this.getId()}'`).on(this).in(this.connect));
        }
        catch (error) {
            this.setState(PulseClient.STATES.failed);
            this.log.error(new Log(`failed connection on client '${this.getId()}' do to error: ${error}`)
                .on(this)
                .in(this.connect));
            throw error;
        }
    }
    async startProcessing(jobName) {
        if (!this.isConnected()) {
            throw new Error('Pulse client must be connected before starting processing');
        }
        this.log.debug(new Log(`starting job processing on client '${this.getId()}'`)
            .on(this)
            .in(this.startProcessing)
            .with('jobName', jobName)
            .with('processEvery', this.getInterval()));
        await this.library.start();
    }
    async stop() {
        if (!this.isConnected()) {
            return;
        }
        this.log.debug(new Log(`stopping client '${this.getId()}'`).on(this).in(this.stop));
        await this.library.stop();
        await new Promise((resolve) => setTimeout(resolve, 100));
        this.setState(PulseClient.STATES.stopped);
        this.log.debug(new Log(`stopped client '${this.getId()}'`).on(this).in(this.stop));
    }
    async disconnect() {
        if (!this.isInState(PulseClient.STATES.stopped)) {
            if (!this.isConnected()) {
                return;
            }
        }
        this.log.debug(new Log(`disconnecting client '${this.getId()}'`)
            .on(this)
            .in(this.disconnect));
        await this.stop();
        this.setState(PulseClient.STATES.disconnected);
        delete this._library;
        this.log.debug(new Log(`disconnected client '${this.getId()}'`)
            .on(this)
            .in(this.disconnect));
    }
    async reconnect() {
        this.log.debug(new Log(`reconnecting client '${this.getId()}'`)
            .on(this)
            .in(this.reconnect));
        this.setState(PulseClient.STATES.paused);
        if (!this.isConnected()) {
            await this.initialize();
            await this.connect();
        }
    }
    isConnected() {
        return (this._library !== undefined &&
            this.isInState(PulseClient.STATES.connected) &&
            this.mongoClient.isConnected());
    }
    getInterval() {
        var _a, _b, _c, _d;
        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.processEvery) === undefined)
            return undefined;
        return typeof ((_b = this.options) === null || _b === void 0 ? void 0 : _b.processEvery) === 'number'
            ? (_c = this.options) === null || _c === void 0 ? void 0 : _c.processEvery
            : parseFloat((_d = this.options) === null || _d === void 0 ? void 0 : _d.processEvery);
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
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], PulseClient.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.Pulse.library),
    __metadata("design:type", Object)
], PulseClient.prototype, "Pulse", void 0);
__decorate([
    inversify.inject(BINDINGS.MongoDB.clients.CommandScheduler),
    __metadata("design:type", MongoDBClient)
], PulseClient.prototype, "mongoClient", void 0);

exports.ScheduledJob = class ScheduledJob extends core$1.derive(StatefulTrait, Struct) {
    constructor(props = {}) {
        super(props);
        if (props.state) {
            this.setState(props.state);
        }
    }
};
exports.ScheduledJob.STATES = {
    enqueued: 'enqueued',
    started: 'started',
    locked: 'locked',
    failed: 'failed',
    completed: 'completed',
    removed: 'removed',
};
exports.ScheduledJob = __decorate([
    core.Type()({ kind: 19, name: "ScheduledJob", properties: { "id": { kind: 17, modifiers: 1, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "state": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "name": { kind: 2, modifiers: 1 }, "data": { kind: 15, modifiers: 1, name: "__type", properties: {} }, "priority": { kind: 17, modifiers: 1, types: [{ kind: 3 }, { kind: 5, value: "lowest" }, { kind: 5, value: "low" }, { kind: 5, value: "normal" }, { kind: 5, value: "high" }, { kind: 5, value: "highest" }] }, "nextRunAt": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "completedAt": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "lockedAt": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "lastRunAt": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "failedAt": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, initializer: () => ({}), name: "__type", properties: {} } }] }], extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], exports.ScheduledJob);

exports.PulseScheduledJobTransformer = class PulseScheduledJobTransformer {
    transform(job) {
        const props = this.pickProps(job);
        props.state = this.determineState(job);
        return new exports.ScheduledJob(props);
    }
    pickProps(job) {
        const { attrs } = job;
        const props = lodash.pick(attrs, Object.keys(exports.ScheduledJob.getPropTypes()));
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
            return exports.ScheduledJob.STATES.failed;
        }
        if (attrs.lastFinishedAt instanceof Date) {
            return exports.ScheduledJob.STATES.completed;
        }
        if (attrs.lockedAt instanceof Date) {
            return exports.ScheduledJob.STATES.locked;
        }
        if (attrs.nextRunAt instanceof Date) {
            return exports.ScheduledJob.STATES.enqueued;
        }
        return undefined;
    }
};
exports.PulseScheduledJobTransformer = __decorate([
    inversify.injectable()
], exports.PulseScheduledJobTransformer);

var PulseCommandScheduler_1;
exports.PulseCommandScheduler = PulseCommandScheduler_1 = class PulseCommandScheduler extends core$1.derive(StatefulTrait) {
    constructor(jobName = 'send scheduled command', options = {}) {
        super();
        this.jobName = jobName;
        this.options = options;
        this.setState(PulseCommandScheduler_1.STATES.constructed);
    }
    async startScheduling() {
        if (this.isInState(PulseCommandScheduler_1.STATES.active)) {
            return;
        }
        await this.initialize();
        this.setState(PulseCommandScheduler_1.STATES.active);
    }
    async stopScheduling() {
        if (this.isInState(PulseCommandScheduler_1.STATES.stopped)) {
            return;
        }
        await this.pulseClient.library.cancel({ name: this.jobName });
        this.setState(PulseCommandScheduler_1.STATES.stopped);
    }
    async initialize() {
        if (!this.pulseClient.isConnected()) {
            const error = new exports.InactiveClientError(this.constructor.name, this.pulseClient.getId().toString());
            this.log.error(new Log('inactive Pulse client').on(this).in(this.initialize));
            throw error;
        }
        await this.defineJob(this.jobName, this.options, async (job) => this.handleScheduledCommand(job));
        this.log.debug(new Log(`defined new Pulse job '${this.jobName}' for client with id '${this.pulseClient.getId()}'`)
            .on(this)
            .in(this.initialize));
        await this.pulseClient.startProcessing(this.jobName);
        this.setState(PulseCommandScheduler_1.STATES.initialized);
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
            const job = await this.pulseClient.library.schedule(when, this.jobName, serializedData);
            if (job && typeof job.save === 'function') {
                await job.save();
            }
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
            throw new exports.CommandSchedulingError(this.jobName, assignmentId.toString(), assignment.assignerType, assignment.assignerId.toString(), error);
        }
    }
    async unschedule(unscheduleCommand) {
        const { assignmentId, commandType, assignerId, assignerType } = unscheduleCommand;
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
            const removedCount = await this.pulseClient.library.cancel(mongoQuery);
            const isSuccessful = (removedCount !== null && removedCount !== void 0 ? removedCount : 0) > 0;
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
            throw new exports.CommandUnschedulingError(this.jobName, assignmentId.toString(), assignerType, assignerId.toString(), error);
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
        const jobs = await this.pulseClient.library.jobs(mongoQuery, mongoSort, mongoLimit);
        if (lodash.isEmpty(jobs)) {
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
        return this.pulseClient.getInterval() || 1;
    }
    async defineJob(jobName, options = {}, handler) {
        this.pulseClient.library.define(jobName, handler, options);
        const definitions = this.pulseClient.library._definitions || {};
        if (!definitions[jobName]) {
            this.log.error(new Log(`failed defining job '${jobName}'`).on(this).in(this.defineJob));
            throw new Error(`Failed to define job: ${jobName}`);
        }
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
exports.PulseCommandScheduler.STATES = {
    constructed: 'constructed',
    initialized: 'initialized',
    active: 'active',
    stopped: 'stopped',
};
__decorate([
    inversify.inject(BINDINGS.Pulse.clients.CommandScheduler),
    __metadata("design:type", PulseClient)
], exports.PulseCommandScheduler.prototype, "pulseClient", void 0);
__decorate([
    inversify.inject(BINDINGS.CommandBus),
    __metadata("design:type", Object)
], exports.PulseCommandScheduler.prototype, "commandBus", void 0);
__decorate([
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], exports.PulseCommandScheduler.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.Serializer),
    __metadata("design:type", Object)
], exports.PulseCommandScheduler.prototype, "serializer", void 0);
__decorate([
    inversify.inject(BINDINGS.MongoDB.collections.ScheduledCommands),
    __metadata("design:type", mongodb.Collection)
], exports.PulseCommandScheduler.prototype, "collection", void 0);
__decorate([
    inversify.inject(BINDINGS.Pulse.jobTransformer),
    __metadata("design:type", Object)
], exports.PulseCommandScheduler.prototype, "jobTransformer", void 0);
exports.PulseCommandScheduler = PulseCommandScheduler_1 = __decorate([
    inversify.injectable(),
    __metadata("design:paramtypes", [Object, Object])
], exports.PulseCommandScheduler);

class PulseCommandSchedulerModule extends Module {
    async beforeInitialize() {
        await this.initializeTopLevelDependencies();
        await this.initializeMongoDBClientForCommandScheduler();
        await this.initializePulseClientForCommandScheduler();
    }
    async onInitialize() {
        await this.initializeCommandScheduler();
    }
    async onStart() {
        var _a;
        await ((_a = this.pulseClient) === null || _a === void 0 ? void 0 : _a.connect());
    }
    async onStop() {
        var _a;
        await ((_a = this.pulseClient) === null || _a === void 0 ? void 0 : _a.stop());
    }
    async onShutdown() {
        var _a;
        await ((_a = this.pulseClient) === null || _a === void 0 ? void 0 : _a.disconnect());
    }
    async initializeTopLevelDependencies() {
        var _a;
        if (this.injector.isBound(BINDINGS.Pulse.library) === false) {
            this.injector
                .bind(BINDINGS.Pulse.library)
                .toConstantValue(Pulse);
        }
        this.injector
            .bind(BINDINGS.Pulse.jobTransformer)
            .to(exports.PulseScheduledJobTransformer)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'Pulse.ScheduledJobTransformer' in singleton scope`)
            .on(this)
            .in(this.initializeTopLevelDependencies));
    }
    async initializeMongoDBClientForCommandScheduler() {
        var _a, _b;
        const url = getenv.string(`EVEBLE_COMMAND_SCHEDULER_MONGODB_URL`);
        const options = {
            ...this.config.get('clients.MongoDB.CommandScheduler'),
            ssl: getenv.bool(`EVEBLE_COMMAND_SCHEDULER_MONGODB_SSL`),
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
    async initializePulseClientForCommandScheduler() {
        var _a;
        const databaseName = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_DBNAME');
        const collectionName = getenv.string('EVEBLE_COMMAND_SCHEDULER_MONGODB_COLLECTION');
        const options = this.config.get('clients.Pulse.CommandScheduler');
        options.processEvery = getenv.int('EVEBLE_COMMAND_SCHEDULER_INTERVAL');
        const client = new PulseClient({
            id: 'Pulse.clients.CommandScheduler',
            databaseName,
            collectionName,
            options,
        });
        this.injector.injectInto(client);
        await client.initialize();
        this.injector
            .bind(BINDINGS.Pulse.clients.CommandScheduler)
            .toConstantValue(client);
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'Pulse.clients.CommandScheduler' as constant value`)
            .on(this)
            .in(this.initializePulseClientForCommandScheduler));
        this.pulseClient = this.injector.get(BINDINGS.Pulse.clients.CommandScheduler);
    }
    async initializeCommandScheduler() {
        var _a;
        this.injector
            .bind(BINDINGS.CommandScheduler)
            .to(exports.PulseCommandScheduler)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'CommandScheduler' to 'PulseCommandScheduler' in singleton scope`)
            .on(this)
            .in(this.initializeCommandScheduler));
    }
}

exports.SnapshotMongoDBStorage = class SnapshotMongoDBStorage {
    async save(eventSourceable) {
        const snapshot = this.snapshotSerializer.serialize(eventSourceable);
        const output = await this.collection.insertOne(snapshot);
        if (!this.isSuccessfulInsert(output, 1)) {
            throw new exports.AddingSnapshotError(this.constructor.name, eventSourceable.getTypeName(), eventSourceable.getId().toString());
        }
        return output.insertedId.toString();
    }
    async update(eventSourceable) {
        const filter = { _id: eventSourceable.getId().toString() };
        const snapshot = this.snapshotSerializer.serialize(eventSourceable);
        const update = {
            $set: { snapshot: snapshot.snapshot },
        };
        const isSuccessful = await this.updateOne(filter, update);
        if (!isSuccessful) {
            throw new exports.UpdatingSnapshotError(this.constructor.name, eventSourceable.getTypeName(), eventSourceable.getId().toString());
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
    isSuccessfulInsert(output, _expectedNumber) {
        return output.acknowledged && output.insertedId !== null;
    }
    isSuccessfulUpdate(output, expectedNumber) {
        return output.modifiedCount === expectedNumber;
    }
};
__decorate([
    inversify.inject(BINDINGS.MongoDB.collections.Snapshots),
    __metadata("design:type", mongodb.Collection)
], exports.SnapshotMongoDBStorage.prototype, "collection", void 0);
__decorate([
    inversify.inject(BINDINGS.SnapshotSerializer),
    __metadata("design:type", Object)
], exports.SnapshotMongoDBStorage.prototype, "snapshotSerializer", void 0);
exports.SnapshotMongoDBStorage = __decorate([
    inversify.injectable()
], exports.SnapshotMongoDBStorage);

exports.SnapshotSerializer = class SnapshotSerializer {
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
    inversify.inject(BINDINGS.Serializer),
    __metadata("design:type", Object)
], exports.SnapshotSerializer.prototype, "serializer", void 0);
exports.SnapshotSerializer = __decorate([
    inversify.injectable()
], exports.SnapshotSerializer);

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
            .to(exports.SnapshotSerializer)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'SnapshotSerializer' to 'SnapshotSerializer' in singleton scope`)
            .on(this)
            .in(this.initializeSnapshotSerializer));
    }
    async initializeSnapshotter() {
        var _a;
        this.injector
            .bind(BINDINGS.SnapshotStorage)
            .to(exports.SnapshotMongoDBStorage)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'SnapshotStorage' to 'SnapshotMongoDBStorage' in singleton scope`)
            .on(this)
            .in(this.initializeSnapshotter));
    }
}

exports.CommitMongoDBStorage = class CommitMongoDBStorage {
    async save(commit) {
        const serializedCommit = this.commitSerializer.serialize(commit);
        let output;
        try {
            output = await this.collection.insertOne(serializedCommit);
        }
        catch (error) {
            if (error.code === 11000) {
                const foundDuplicatedVersion = (await this.findLastVersionById(commit.sourceId));
                throw new exports.CommitConcurrencyError(commit.eventSourceableType, commit.sourceId, this.getExpectedVersionOnStorage(commit).toString(), foundDuplicatedVersion.toString());
            }
            else {
                throw error;
            }
        }
        if (!this.isSuccessfulInsert(output, 1)) {
            throw new exports.AddingCommitFailedError(this.constructor.name, commit.id, commit.sentBy);
        }
        return output.insertedId.toString();
    }
    async generateId() {
        return new exports.Guid().toString();
    }
    async findLastVersionById(eventSourceableId) {
        const query = { sourceId: eventSourceableId.toString() };
        const options = {
            sort: { version: -1 },
            projection: { version: 1 },
        };
        const foundSerializedCommit = await this.collection.findOne(query, options);
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
    async hasBySourceId(eventSourceableId) {
        const query = { sourceId: eventSourceableId.toString() };
        return (await this.collection.findOne(query)) != null;
    }
    async getCommits(eventSourceableId, versionOffset) {
        const query = {
            sourceId: eventSourceableId.toString(),
            version: { $gte: versionOffset },
        };
        const options = { sort: { version: 1 } };
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
            throw new exports.UpdatingCommitError(this.constructor.name, commitId, appId);
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
            throw new exports.UpdatingCommitError(this.constructor.name, commitId, appId);
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
            returnDocument: 'after',
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
        const cursor = this.collection.find(query, options);
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
        returnDocument: 'after',
    }) {
        const output = await this.collection.findOneAndUpdate(filter, update, options);
        if (output !== null) {
            return this.commitSerializer.deserialize(output);
        }
        return undefined;
    }
    isSuccessfulInsert(output, _expectedNumber) {
        return output.acknowledged && output.insertedId !== null;
    }
    isSuccessfulUpdate(output, expectedNumber) {
        if ('modifiedCount' in output) {
            return output.modifiedCount === expectedNumber;
        }
        if ('ok' in output && 'value' in output) {
            return output.ok === 1 && output.value !== null;
        }
        return false;
    }
    getExpectedVersionOnStorage(commit) {
        const decremented = commit.version - 1;
        return decremented === 0 ? 0 : decremented;
    }
};
__decorate([
    inversify.inject(BINDINGS.MongoDB.collections.Commits),
    __metadata("design:type", mongodb.Collection)
], exports.CommitMongoDBStorage.prototype, "collection", void 0);
__decorate([
    inversify.inject(BINDINGS.CommitSerializer),
    __metadata("design:type", Object)
], exports.CommitMongoDBStorage.prototype, "commitSerializer", void 0);
exports.CommitMongoDBStorage = __decorate([
    inversify.injectable()
], exports.CommitMongoDBStorage);

var CommitMongoDBObserver_1;
exports.CommitMongoDBObserver = CommitMongoDBObserver_1 = class CommitMongoDBObserver extends core$1.derive(StatefulTrait) {
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
        const pipeline = [
            {
                $match: {
                    operationType: 'insert',
                    $or: [
                        {
                            'fullDocument.eventTypes': {
                                $in: commitPublisher.getHandledEventTypes(),
                            },
                        },
                        {
                            'fullDocument.commandTypes': {
                                $in: commitPublisher.getHandledCommandTypes(),
                            },
                        },
                    ],
                },
            },
        ];
        this.changeStream = this.collection.watch(pipeline, {
            fullDocument: 'updateLookup',
        });
        this.setState(CommitMongoDBObserver_1.STATES.observing);
        this.changeStream.on('change', async (change) => {
            const serializedCommit = change.fullDocument;
            if (!serializedCommit)
                return;
            const lockedCommit = await this.storage.lockCommit(serializedCommit.id, appId, workerId, {});
            if (lockedCommit !== undefined) {
                await commitPublisher.publishChanges(lockedCommit);
            }
        });
        await this.initializeEventHandlers();
    }
    async pauseObserving() {
        if (this.changeStream && this.isObserving()) {
            this.setState(CommitMongoDBObserver_1.STATES.paused);
            await this.changeStream.pause();
        }
    }
    async stopObserving() {
        if (this.changeStream && this.isObserving()) {
            this.setState(CommitMongoDBObserver_1.STATES.closed);
            await this.changeStream.close();
        }
    }
    isObserving() {
        return this.state === CommitMongoDBObserver_1.STATES.observing;
    }
    async initializeEventHandlers() {
        if (!this.changeStream)
            return;
        this.changeStream.on('close', () => {
            this.setState(CommitMongoDBObserver_1.STATES.closed);
            this.log.debug(new Log('closed observing commits'));
        });
        this.changeStream.on('error', (error) => {
            this.setState(CommitMongoDBObserver_1.STATES.failed);
            this.log.error(new Log(`failed observing commits due to error: ${error}`));
            if (this.isInProduction()) {
                process.exit(0);
            }
        });
    }
    isInProduction() {
        return getenv.string('NODE_ENV') === 'production';
    }
};
exports.CommitMongoDBObserver.STATES = {
    created: 'created',
    observing: 'observing',
    paused: 'paused',
    closed: 'closed',
    finished: 'finished',
    ended: 'ended',
    failed: 'failed',
};
__decorate([
    inversify.inject(BINDINGS.MongoDB.collections.Commits),
    __metadata("design:type", mongodb.Collection)
], exports.CommitMongoDBObserver.prototype, "collection", void 0);
__decorate([
    inversify.inject(BINDINGS.CommitStorage),
    __metadata("design:type", Object)
], exports.CommitMongoDBObserver.prototype, "storage", void 0);
__decorate([
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], exports.CommitMongoDBObserver.prototype, "log", void 0);
__decorate([
    inversify.inject(BINDINGS.Config),
    __metadata("design:type", Object)
], exports.CommitMongoDBObserver.prototype, "config", void 0);
exports.CommitMongoDBObserver = CommitMongoDBObserver_1 = __decorate([
    inversify.injectable(),
    __metadata("design:paramtypes", [])
], exports.CommitMongoDBObserver);

exports.CommitSerializer = class CommitSerializer {
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
            serializedCommit.eventTypes = lodash.union(serializedCommit.eventTypes, [
                event.getTypeName(),
            ]);
        }
        for (const command of commit.commands) {
            serializedCommit.commands.push({
                type: command.getTypeName(),
                data: this.serializer.toData(command),
            });
            serializedCommit.commandTypes = lodash.union(serializedCommit.commandTypes, [
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
            deserializedProps.receivers.push(new exports.CommitReceiver(receiverProps));
        }
        return new exports.Commit(deserializedProps);
    }
};
__decorate([
    inversify.inject(BINDINGS.Serializer),
    __metadata("design:type", Object)
], exports.CommitSerializer.prototype, "serializer", void 0);
exports.CommitSerializer = __decorate([
    inversify.injectable()
], exports.CommitSerializer);

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
            .to(exports.CommitSerializer)
            .inSingletonScope();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(new Log(`bound 'CommitSerializer' to 'CommitSerializer' in singleton scope`)
            .on(this)
            .in(this.initializeCommitSerializer));
    }
    async initializeCommitStorage() {
        var _a;
        this.injector
            .bind(BINDINGS.CommitStorage)
            .to(exports.CommitMongoDBStorage)
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
                .to(exports.CommitMongoDBObserver)
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
        if (lodash.isPlainObject(props.config)) {
            const configData = props.config;
            if (configData.logging &&
                !(configData.logging instanceof exports.LoggingConfig)) {
                configData.logging = new exports.LoggingConfig(configData.logging);
            }
            processedProps.config = exports.AppConfig.from(configData);
        }
        if (props.config === undefined) {
            processedProps.config = new exports.AppConfig({
                appId: exports.AppConfig.generateId(),
                logging: new exports.LoggingConfig({
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
            'Pulse.library': Pulse,
            'MongoDB.library': mongodb.MongoClient,
        };
        for (const [id, component] of Object.entries(components)) {
            if (!this.injector.isBound(lodash.get(BINDINGS, id))) {
                this.injector.bind(lodash.get(BINDINGS, id)).toConstantValue(component);
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
                case 'pulse':
                    this.modules.unshift(new PulseCommandSchedulerModule());
                    (_b = this.log) === null || _b === void 0 ? void 0 : _b.debug(new Log(`added 'CommandScheduler' as 'PulseCommandSchedulerModule' to application modules`)
                        .on(this)
                        .in(this.initializeSchedulers));
                    break;
                default:
                    throw new exports.StorageNotFoundError('CommandScheduler', client);
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
                    throw new exports.StorageNotFoundError('SnapshotStorage', client);
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
                    throw new exports.StorageNotFoundError('CommitStorage', client);
            }
        }
    }
}

exports.EventSourceable = class EventSourceable extends core$1.derive(OneToOneHandlingTrait, exports.Entity) {
    constructor(props) {
        const processedProps = { version: 0, ...props };
        super(processedProps);
        if (!this.id) {
            this.construct({ version: 0, ...props });
        }
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
        this.setHandleableTypes([exports.Command, exports.Event]);
    }
    async initialize() {
        this.setupHandlers({
            handlers: this.handles(),
            handleableTypes: [exports.Command],
            isBoundable: true,
        });
        this.setupHandlers({
            handlers: this.subscribes(),
            handleableTypes: [exports.Event],
            isBoundable: true,
        });
    }
    construct(props = {}) {
        const processedProps = { version: 0, ...props };
        Object.assign(this, this.processProps(processedProps));
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
        if (message instanceof exports.Command &&
            message.isScheduled() &&
            !message.isDeliverable()) {
            return this;
        }
        if (message.hasMetadata()) {
            const metadata = lodash.omit(message.metadata, ['scheduling']);
            this.assignMetadata(metadata);
        }
        const handler = this.getHandler(message.constructor);
        if (handler === undefined) {
            throw new HandlerNotFoundError(helpers.getTypeName(this.constructor), message.getTypeName());
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
        const assignment = new exports.Assignment(assignmentProps);
        command.schedule(assignment);
        const scheduleCommand = new exports.ScheduleCommand({
            targetId: command.getId(),
            command,
        });
        this[COMMANDS_KEY].push(scheduleCommand);
    }
    unschedule(assignmentId, commandType) {
        const unscheduleCommand = new exports.UnscheduleCommand({
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
            const processedSource = lodash.omit(source, 'sourceId', 'targetId', 'version', 'timestamp');
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
        this[EVENTS_KEY].push(deepClone(event));
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
        if (!(event instanceof exports.Event)) {
            throw new exports.InvalidEventError(this.typeName(), core.kernel.describer.describe(event));
        }
        if (event.sourceId.toString() !== this.getId().toString()) {
            throw new exports.EventIdMismatchError(this.typeName(), this.getId().toString(), event.sourceId.toString());
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
    inversify.postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], exports.EventSourceable.prototype, "initialize", null);
exports.EventSourceable = __decorate([
    core.Type('EventSourceable')({ kind: 19, name: "EventSourceable", properties: { "id": { kind: 17, modifiers: 1, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "version": { kind: 3, modifiers: 1 }, "state": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "status": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "metadata": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "schemaVersion": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] }, [COMMANDS_KEY]: { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "getId": { kind: 21, modifiers: 0 }, "isDeliverable": { kind: 21, modifiers: 0 }, "isScheduled": { kind: 21, modifiers: 0 }, "schedule": { kind: 21, modifiers: 0 }, "getAssignment": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] }, [EVENTS_KEY]: { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "version": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, name: "__type", properties: {} } }] }], extends: { kind: 999 } }),
    __metadata("design:paramtypes", [Object])
], exports.EventSourceable);

exports.Aggregate = class Aggregate extends exports.EventSourceable {
    constructor(arg) {
        const props = {
            version: 0,
        };
        let isInitializedWithEvent = false;
        if (arg instanceof exports.History) {
            const initializingMessage = arg.getInitializingMessage();
            props.id = initializingMessage.getId();
        }
        else if (arg instanceof exports.Command) {
            const initializingMessage = arg;
            props.id = initializingMessage.getId();
        }
        else if (arg instanceof exports.Event) {
            isInitializedWithEvent = true;
        }
        else {
            Object.assign(props, arg);
        }
        super(props);
        if (isInitializedWithEvent) {
            throw new exports.InvalidInitializingMessageError(this.typeName(), core.kernel.describer.describe([exports.Command, exports.History]), core.kernel.describer.describe(arg));
        }
    }
};
exports.Aggregate = __decorate([
    core.Type('Aggregate')({ kind: 19, name: "Aggregate", properties: { "id": { kind: 17, modifiers: 1, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "version": { kind: 3, modifiers: 1 }, "state": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "status": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "metadata": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "schemaVersion": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] }, [COMMANDS_KEY]: { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "getId": { kind: 21, modifiers: 0 }, "isDeliverable": { kind: 21, modifiers: 0 }, "isScheduled": { kind: 21, modifiers: 0 }, "schedule": { kind: 21, modifiers: 0 }, "getAssignment": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] }, [EVENTS_KEY]: { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "version": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "arg", modifiers: 0, type: { kind: 17, types: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "getId": { kind: 21, modifiers: 0 }, "isDeliverable": { kind: 21, modifiers: 0 }, "isScheduled": { kind: 21, modifiers: 0 }, "schedule": { kind: 21, modifiers: 0 }, "getAssignment": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }, { kind: 15, name: "__type", properties: {} }, { kind: 18, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "version": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] }] } }] }], extends: { kind: 18, type: exports.EventSourceable, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.Aggregate);

class BoundedContext extends Module {
}

exports.Process = class Process extends exports.EventSourceable {
    constructor(arg) {
        const props = {
            version: 0,
        };
        let hasInitializingMessage = false;
        if (arg instanceof exports.History) {
            const initializingMessage = arg.getInitializingMessage();
            props.id = initializingMessage.getId();
        }
        else if (arg instanceof exports.Command || arg instanceof exports.Event) {
            hasInitializingMessage = true;
            const initializingMessage = arg;
            if (initializingMessage instanceof exports.Event) {
                props.id = new exports.Guid();
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
            !(arg instanceof exports.Command || arg instanceof exports.Event)) {
            throw new exports.InvalidInitializingMessageError(this.getTypeName(), core.kernel.describer.describe([exports.Command, exports.Event]), core.kernel.describer.describe(arg));
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
exports.Process = __decorate([
    core.Type('Process')({ kind: 19, name: "Process", properties: { "id": { kind: 17, modifiers: 1, types: [{ kind: 2 }, { kind: 18, type: exports.Guid, arguments: [] }] }, "version": { kind: 3, modifiers: 1 }, "state": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "status": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 2 }, { kind: 3 }] }, "metadata": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "schemaVersion": { kind: 17, modifiers: 1, types: [{ kind: 12 }, { kind: 3 }] }, [COMMANDS_KEY]: { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "getId": { kind: 21, modifiers: 0 }, "isDeliverable": { kind: 21, modifiers: 0 }, "isScheduled": { kind: 21, modifiers: 0 }, "schedule": { kind: 21, modifiers: 0 }, "getAssignment": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] }, [EVENTS_KEY]: { kind: 18, modifiers: 1, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "version": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] } }, constructors: [{ modifiers: 0, parameters: [{ name: "arg", modifiers: 0, type: { kind: 17, types: [{ kind: 15, name: "Command", properties: { "targetId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "getId": { kind: 21, modifiers: 0 }, "isDeliverable": { kind: 21, modifiers: 0 }, "isScheduled": { kind: 21, modifiers: 0 }, "schedule": { kind: 21, modifiers: 0 }, "getAssignment": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }, { kind: 15, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "version": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }, { kind: 15, name: "__type", properties: {} }, { kind: 18, type: Array, arguments: [{ kind: 15, name: "Event", properties: { "sourceId": { kind: 17, modifiers: 0, types: [{ kind: 2 }, { kind: 15, name: "Stringifiable", properties: { "toString": { kind: 21, modifiers: 0 } } }] }, "version": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 3 }] }, "getId": { kind: 21, modifiers: 0 }, "timestamp": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 18, type: Date, arguments: [] }] }, "metadata": { kind: 17, modifiers: 0, types: [{ kind: 12 }, { kind: 15, name: "__type", properties: {} }] }, "getTimestamp": { kind: 21, modifiers: 0 }, "assignMetadata": { kind: 21, modifiers: 0 }, "hasMetadata": { kind: 21, modifiers: 0 }, "getMetadata": { kind: 21, modifiers: 0 }, "setCorrelationId": { kind: 21, modifiers: 0 }, "getCorrelationId": { kind: 21, modifiers: 0 }, "hasCorrelationId": { kind: 21, modifiers: 0 }, "getTypeName": { kind: 21, modifiers: 0 }, "toString": { kind: 21, modifiers: 0 }, "getPropTypes": { kind: 21, modifiers: 0 }, "toPlainObject": { kind: 21, modifiers: 0 }, "validateProps": { kind: 21, modifiers: 0 }, "getPropertyInitializers": { kind: 21, modifiers: 0 }, "equals": { kind: 21, modifiers: 0 }, "getSchemaVersion": { kind: 21, modifiers: 0 }, "transformLegacyProps": { kind: 21, modifiers: 0 }, "registerLegacyTransformer": { kind: 21, modifiers: 0 }, "overrideLegacyTransformer": { kind: 21, modifiers: 0 }, "hasLegacyTransformer": { kind: 21, modifiers: 0 }, "getLegacyTransformers": { kind: 21, modifiers: 0 }, "getLegacyTransformer": { kind: 21, modifiers: 0 } } }] }] } }] }], extends: { kind: 18, type: exports.EventSourceable, arguments: [] } }),
    __metadata("design:paramtypes", [Object])
], exports.Process);

let RebuildingResult = class RebuildingResult extends Struct {
};
RebuildingResult = __decorate([
    core.Type()({ kind: 19, name: "RebuildingResult", properties: { "projectionsNames": { kind: 18, modifiers: 0, type: Array, arguments: [{ kind: 2 }] }, "duration": { kind: 3, modifiers: 0 }, "message": { kind: 2, modifiers: 0 } }, constructors: [{ modifiers: 0, parameters: [{ name: "props", modifiers: 0, type: { kind: 15, initializer: () => ({}), name: "__type", properties: {} } }] }], extends: { kind: 18, type: Struct, arguments: [] } })
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
    inversify.inject(BINDINGS.CommitStore),
    __metadata("design:type", Object)
], ProjectionRebuilder.prototype, "commitStore", void 0);
__decorate([
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], ProjectionRebuilder.prototype, "log", void 0);

class Projection extends core$1.derive(EventHandlingTrait, StatefulTrait) {
    constructor() {
        super();
        this.setState(Projection.STATES.projecting);
        this.queuedEvents = [];
    }
    initialize() {
        super.initialize();
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
            throw new exports.ProjectionAlreadyRebuildingError(this.constructor.name);
        }
        this.setState(Projection.STATES.rebuilding);
        this.log.debug(new Log(`rebuilding`).on(this).in(this.enterRebuildMode));
    }
    async exitRebuildMode() {
        if (!this.isInState(Projection.STATES.rebuilding)) {
            this.log.error(new Log(`failed exiting rebuilding(already projecting)`)
                .on(this)
                .in(this.exitRebuildMode));
            throw new exports.ProjectionNotRebuildingError(this.constructor.name);
        }
        this.setState(Projection.STATES.projecting);
        for (const event of this.queuedEvents) {
            this.on(event);
        }
        this.log.debug(new Log(`projecting`).on(this).in(this.exitRebuildMode));
    }
    async invokeAction(actionName) {
        if (lodash.isFunction(this[actionName])) {
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
    inversify.inject(BINDINGS.EventBus),
    __metadata("design:type", Object)
], Projection.prototype, "eventBus", void 0);
__decorate([
    inversify.inject(BINDINGS.log),
    __metadata("design:type", Object)
], Projection.prototype, "log", void 0);
__decorate([
    inversify.postConstruct(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Projection.prototype, "initialize", null);

function bindExternalDependencies(injector) {
    if (!injector.isBound(BINDINGS.winston)) {
        injector.bind(BINDINGS.winston).toConstantValue(winston__namespace);
    }
    if (!injector.isBound(BINDINGS.chalk)) {
        injector.bind(BINDINGS.chalk).toConstantValue(chalk);
    }
}
function bindLoggerDependencies(injector) {
    const converter = new exports.StringifingConverter();
    if (!injector.isBound(BINDINGS.SimpleLogFormatter)) {
        const simpleFormatter = new exports.SimpleLogFormatter(converter);
        injector
            .bind(BINDINGS.SimpleLogFormatter)
            .toConstantValue(simpleFormatter);
    }
    if (!injector.isBound(BINDINGS.DetailedLogFormatter)) {
        const detailedFormatter = new exports.DetailedLogFormatter(converter, injector.get(BINDINGS.chalk));
        injector
            .bind(BINDINGS.DetailedLogFormatter)
            .toConstantValue(detailedFormatter);
    }
}
function createConsoleTransport(level, transportConfig = new exports.LogTransportConfig()) {
    return new ConsoleTransport(level, transportConfig);
}
function createLogger(levels) {
    return new exports.Logger(levels);
}
function loggerLoader(injector, level, consoleTransportConfig = new exports.LogTransportConfig(), levels) {
    bindExternalDependencies(injector);
    bindLoggerDependencies(injector);
    const logger = createLogger(levels);
    injector.bind(BINDINGS.log).toConstantValue(logger);
    const consoleTransport = createConsoleTransport(level, consoleTransportConfig);
    injector.injectInto(consoleTransport);
    logger.registerTransport('console', consoleTransport);
    return logger;
}

let UnconvertibleStandardError = class UnconvertibleStandardError extends exports.ValueObjectError {
    constructor(standardId) {
        super({ message: `Standard does not support conversion`, standardId });
    }
};
UnconvertibleStandardError = __decorate([
    core.Type('UnconvertibleStandardError')({ kind: 19, name: "UnconvertibleStandardError", properties: { "standardId": { kind: 2, modifiers: 1 } }, constructors: [{ modifiers: 0, parameters: [{ name: "standardId", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.ValueObjectError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], UnconvertibleStandardError);
class Standard {
    constructor(id, isConvertible = false, codes) {
        this.id = id;
        this.isConvertible = isConvertible;
        this.codes = codes;
    }
    getId() {
        return this.id;
    }
    isValid(code) {
        return this.isIn(code);
    }
    isIn(code) {
        if (this.codes === undefined) {
            throw new UnimplementedError();
        }
        return this.codes.includes(code);
    }
    convert(code, _identifiedStandard) {
        if (!this.isConvertible) {
            throw new UnconvertibleStandardError(this.id);
        }
        return code;
    }
    getCodes() {
        return this.codes || [];
    }
}

const ValidableTrait = core$1.trait((base) => class extends base {
    static setValidator(validator) {
        this.prototype.overrideHook('onValidation', 'validation', validator);
    }
    static getValidator() {
        return this.prototype.getHook('onValidation', 'validation');
    }
    static removeValidator() {
        this.prototype.removeHook('onValidation', 'validation');
    }
    static hasValidator() {
        return this.prototype.hasHook('onValidation', 'validation');
    }
});

class ValueString extends core$1.derive(EjsonableTrait, HookableTrait, ValidableTrait, String) {
    constructor(value) {
        super(value);
        this.onValidation(value);
        Object.defineProperty(this, NON_ENUMERABLE_VALUE_KEY, {
            value,
            enumerable: false,
        });
    }
    equals(other) {
        return (other !== null &&
            other.constructor === this.constructor &&
            this.valueOf() === other.valueOf());
    }
    [util.inspect.custom]() {
        return `[${this.constructor.name}: '${this[NON_ENUMERABLE_VALUE_KEY]}']`;
    }
    toString() {
        return this[NON_ENUMERABLE_VALUE_KEY];
    }
    valueOf() {
        return this[NON_ENUMERABLE_VALUE_KEY];
    }
    toPlainObject() {
        return this.valueOf();
    }
    anchor() {
        return this.anchor();
    }
    big() {
        return this.big();
    }
    blink() {
        return this.blink();
    }
    bold() {
        return this.bold();
    }
    fixed() {
        return this.fixed();
    }
    fontcolor(color) {
        return this.fontcolor(color);
    }
    fontsize(size) {
        return this.fontsize(size);
    }
    italics() {
        return this.italics();
    }
    link(url) {
        return this.link(url);
    }
    small() {
        return this.small();
    }
    strike() {
        return this.strike();
    }
    sub() {
        return this.sub();
    }
    sup() {
        return this.sup();
    }
    onValidation(value, isStrict = true) {
        if (!core.kernel.isValidating()) {
            return true;
        }
        try {
            core.kernel.validator.validate(value, String, isStrict);
        }
        catch (error) {
            const { message } = error;
            const typeName = this.getTypeName();
            throw new error.constructor(`${typeName}: ${message}`);
        }
        const hooks = this.getHooks('onValidation');
        for (const hook of Object.values(hooks)) {
            hook.bind(this)(value);
        }
        return true;
    }
    static from(value) {
        return new this(value);
    }
}
ValueString.transformer = function () {
    const Self = this;
    return {
        to: (instance) => {
            if (instance === undefined) {
                return undefined;
            }
            if (Array.isArray(instance)) {
                return instance.map((item) => item.valueOf());
            }
            return instance.valueOf();
        },
        from: (value) => {
            if (Array.isArray(value)) {
                return value.map((item) => new Self(item));
            }
            return new Self(value);
        },
    };
};

class ValueNumber extends core$1.derive(HookableTrait, Number) {
    constructor(value) {
        super(value);
        this.onValidation(value);
        Object.defineProperties(this, {
            [NON_ENUMERABLE_VALUE_KEY]: {
                value,
                enumerable: false,
            },
            registerHook: {
                enumerable: false,
            },
            overrideHook: {
                enumerable: false,
            },
            getHook: {
                enumerable: false,
            },
            getHookOrThrow: {
                enumerable: false,
            },
            getHooks: {
                enumerable: false,
            },
            getActions: {
                enumerable: false,
            },
            hasHook: {
                enumerable: false,
            },
            hasAction: {
                enumerable: false,
            },
            removeHook: {
                enumerable: false,
            },
        });
    }
    toString() {
        return `${this[NON_ENUMERABLE_VALUE_KEY]}`;
    }
    valueOf() {
        return this[NON_ENUMERABLE_VALUE_KEY];
    }
    toPlainObject() {
        return this.valueOf();
    }
    equals(other) {
        return (other !== null &&
            other.constructor === this.constructor &&
            this.valueOf() === other.valueOf());
    }
    [util.inspect.custom]() {
        return `[${this.constructor.name}: ${this}]`;
    }
    typeName() {
        return this.getTypeName();
    }
    static typeName() {
        return this.getTypeName();
    }
    getTypeName() {
        return helpers.getTypeName(this);
    }
    static toString() {
        return this.getTypeName();
    }
    static getTypeName() {
        return helpers.getTypeName(this);
    }
    toJSONValue() {
        var _a;
        return (_a = core.kernel.serializer) === null || _a === void 0 ? void 0 : _a.toJSONValue(this);
    }
    static from(value) {
        return new this(value);
    }
    onValidation(value, isStrict = true) {
        if (!core.kernel.isValidating()) {
            return true;
        }
        try {
            core.kernel.validator.validate(value, Number, isStrict);
        }
        catch (error) {
            const { message } = error;
            const typeName = this.getTypeName();
            throw new error.constructor(`${typeName}: ${message}`);
        }
        const hooks = this.getHooks('onValidation');
        for (const hook of Object.values(hooks)) {
            hook.bind(this)(value);
        }
        return true;
    }
    static setValidator(validator) {
        this.prototype.overrideHook('onValidation', 'validation', validator);
    }
    static getValidator() {
        return this.prototype.getHook('onValidation', 'validation');
    }
    static removeValidator() {
        this.prototype.removeHook('onValidation', 'validation');
    }
    static hasValidator() {
        return this.prototype.hasHook('onValidation', 'validation');
    }
}
ValueNumber.transformer = function () {
    const Self = this;
    return {
        to: (instance) => {
            if (instance === undefined) {
                return undefined;
            }
            if (Array.isArray(instance)) {
                return instance.map((item) => item.valueOf());
            }
            return instance.valueOf();
        },
        from: (value) => {
            if (Array.isArray(value)) {
                return value.map((item) => new Self(item));
            }
            return new Self(value);
        },
    };
};

exports.StandardError = class StandardError extends exports.ValueObjectError {
};
exports.StandardError = __decorate([
    core.Type('Eveble.StandardError')({ kind: 19, name: "StandardError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "propsOrMessage", modifiers: 0, type: { kind: 17, types: [{ kind: 12 }, { kind: 2 }, { kind: 15, name: "__type", properties: {} }] } }] }], extends: { kind: 18, type: exports.ValueObjectError, arguments: [] } })
], exports.StandardError);
exports.UnsupportedStandardError = class UnsupportedStandardError extends exports.ValueObjectError {
    constructor(standardId) {
        super({ message: `Standard is not supported`, standardId });
    }
};
exports.UnsupportedStandardError = __decorate([
    core.Type('Eveble.UnsupportedStandardError')({ kind: 19, name: "UnsupportedStandardError", properties: { "standardId": { kind: 2, modifiers: 1 } }, constructors: [{ modifiers: 0, parameters: [{ name: "standardId", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.ValueObjectError, arguments: [] } }),
    __metadata("design:paramtypes", [String])
], exports.UnsupportedStandardError);
exports.StandardExistError = class StandardExistError extends exports.StandardError {
    constructor(typeName, id) {
        super(`${typeName}: standard with id '${id}' already exists`);
    }
};
exports.StandardExistError = __decorate([
    core.Type('Eveble.StandardExistError')({ kind: 19, name: "StandardExistError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "typeName", modifiers: 0, type: { kind: 2 } }, { name: "id", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.StandardError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.StandardExistError);
exports.NotApplicableError = class NotApplicableError extends exports.StandardError {
    constructor(typeName, id) {
        super(`${typeName}: standard with id '${id}' is not applicable`);
    }
};
exports.NotApplicableError = __decorate([
    core.Type('Eveble.NotApplicableError')({ kind: 19, name: "NotApplicableError", properties: {}, constructors: [{ modifiers: 0, parameters: [{ name: "typeName", modifiers: 0, type: { kind: 2 } }, { name: "id", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.StandardError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.NotApplicableError);
exports.UnavailableConversionError = class UnavailableConversionError extends exports.StandardError {
    constructor(from, to) {
        super({ message: `Conversion is not available`, from, to });
    }
};
exports.UnavailableConversionError = __decorate([
    core.Type('Eveble.UnavailableConversionError')({ kind: 19, name: "UnavailableConversionError", properties: { "from": { kind: 2, modifiers: 1 }, "to": { kind: 2, modifiers: 1 } }, constructors: [{ modifiers: 0, parameters: [{ name: "from", modifiers: 0, type: { kind: 2 } }, { name: "to", modifiers: 0, type: { kind: 2 } }] }], extends: { kind: 18, type: exports.StandardError, arguments: [] } }),
    __metadata("design:paramtypes", [String, String])
], exports.UnavailableConversionError);
const StandardizedTrait = core$1.trait((base) => class extends base {
    static registerStandard(standard, shouldOverride = false) {
        if (this.standards === undefined) {
            this.standards = new Map();
        }
        if (this.hasStandard(standard.getId()) && !shouldOverride) {
            throw new exports.StandardExistError(this.getTypeName(), standard.getId());
        }
        this.standards.set(standard.getId(), standard);
    }
    static overrideStandard(standard) {
        this.registerStandard(standard, true);
    }
    static hasStandard(standardId) {
        var _a;
        if (this.standards === undefined)
            return false;
        return (_a = this.standards) === null || _a === void 0 ? void 0 : _a.has(standardId);
    }
    static removeStandard(standardId) {
        var _a;
        (_a = this.standards) === null || _a === void 0 ? void 0 : _a.delete(standardId);
    }
    static getStandards() {
        var _a;
        if (this.standards !== undefined) {
            return Array.from((_a = this.standards) === null || _a === void 0 ? void 0 : _a.values());
        }
        return [];
    }
    static getStandard(standardId) {
        if (this.standards === undefined)
            return undefined;
        return this.standards.get(standardId);
    }
    static getCodes(standardId) {
        var _a;
        if (!this.hasStandard(standardId)) {
            throw new exports.UnsupportedStandardError(standardId);
        }
        const standard = (_a = this.standards) === null || _a === void 0 ? void 0 : _a.get(standardId);
        return standard.getCodes();
    }
    static identifyStandard(code) {
        if (this.standards === undefined)
            return undefined;
        for (const standard of this.standards.values()) {
            if (standard.isValid(code))
                return standard;
        }
        return undefined;
    }
    static isInStandard(code, standardId) {
        if (!this.hasStandard(standardId)) {
            throw new exports.UnsupportedStandardError(standardId);
        }
        const standard = this.getStandard(standardId);
        return standard.isIn(code);
    }
    static convert(code, otherStandardId) {
        if (!this.hasStandard(otherStandardId)) {
            throw new exports.UnsupportedStandardError(otherStandardId);
        }
        const identifiedStandard = this.identifyStandard(code);
        if ((identifiedStandard === null || identifiedStandard === void 0 ? void 0 : identifiedStandard.getId()) === otherStandardId)
            return code;
        const standard = this.getStandard(otherStandardId);
        if (standard.isConvertible === true) {
            return standard.convert(code, identifiedStandard);
        }
        return undefined;
    }
});

class InvalidGeneratorIdError extends core.ExtendableError {
    constructor(got) {
        super(`Expected id argument to be string, got ${got}`);
    }
}
class GeneratorExistsError extends core.ExtendableError {
    constructor(id) {
        super(`Generator with id '${id}' would be overridden. To override existing mapping use <MyGenerator.prototype.overrideGenerator>`);
    }
}
class GeneratorNotFoundError extends core.ExtendableError {
    constructor(id) {
        super(`Generator with id '${id}' was not found`);
    }
}
const GeneratorTrait = () => core$1.trait((base) => class extends base {
    constructor(generators = new Map()) {
        super();
        this.generators = generators;
    }
    registerGenerator(id, generator, shouldOverride = false) {
        if (typeof id !== 'string') {
            throw new InvalidGeneratorIdError(core.kernel.describer.describe(id));
        }
        if (this.hasGenerator(id) && !shouldOverride) {
            throw new GeneratorExistsError(id);
        }
        this.generators.set(id, generator);
    }
    overrideGenerator(id, generator) {
        this.registerGenerator(id, generator, true);
    }
    getGenerator(id) {
        return this.generators.get(id);
    }
    hasGenerator(id) {
        return this.generators.has(id);
    }
    removeGenerator(id) {
        this.generators.delete(id);
    }
    getGenerators() {
        return this.generators;
    }
});

class InvalidValidatorIdError extends core.ExtendableError {
    constructor(got) {
        super(`Expected id argument to be string, got ${got}`);
    }
}
class ValidatorExistsError extends core.ExtendableError {
    constructor(id) {
        super(`Validator with id '${id}' would be overridden. To override existing mapping use <MyValidator.prototype.overrideValidator>`);
    }
}
class ValidatorNotFoundError extends core.ExtendableError {
    constructor(id) {
        super(`Validator with id '${id}' was not found`);
    }
}
const ValidatorTrait = () => core$1.trait((base) => class extends base {
    constructor(validators = new Map()) {
        super();
        this.validators = validators;
    }
    registerValidator(id, validator, shouldOverride = false) {
        if (typeof id !== 'string') {
            throw new InvalidValidatorIdError(core.kernel.describer.describe(id));
        }
        if (this.hasValidator(id) && !shouldOverride) {
            throw new ValidatorExistsError(id);
        }
        this.validators.set(id, validator);
    }
    overrideValidator(id, validator) {
        this.registerValidator(id, validator, true);
    }
    getValidator(id) {
        return this.validators.get(id);
    }
    hasValidator(id) {
        return this.validators.has(id);
    }
    removeValidator(id) {
        this.validators.delete(id);
    }
    getValidators() {
        return this.validators;
    }
});

exports.LanguageCode = void 0;
(function (LanguageCode) {
    LanguageCode["af"] = "af";
    LanguageCode["ak"] = "ak";
    LanguageCode["sq"] = "sq";
    LanguageCode["am"] = "am";
    LanguageCode["ar"] = "ar";
    LanguageCode["hy"] = "hy";
    LanguageCode["as"] = "as";
    LanguageCode["az"] = "az";
    LanguageCode["bm"] = "bm";
    LanguageCode["bn"] = "bn";
    LanguageCode["eu"] = "eu";
    LanguageCode["be"] = "be";
    LanguageCode["bs"] = "bs";
    LanguageCode["br"] = "br";
    LanguageCode["bg"] = "bg";
    LanguageCode["my"] = "my";
    LanguageCode["ca"] = "ca";
    LanguageCode["ce"] = "ce";
    LanguageCode["zh"] = "zh";
    LanguageCode["zh_Hans"] = "zh_Hans";
    LanguageCode["zh_Hant"] = "zh_Hant";
    LanguageCode["cu"] = "cu";
    LanguageCode["kw"] = "kw";
    LanguageCode["co"] = "co";
    LanguageCode["hr"] = "hr";
    LanguageCode["cs"] = "cs";
    LanguageCode["da"] = "da";
    LanguageCode["nl"] = "nl";
    LanguageCode["nl_BE"] = "nl_BE";
    LanguageCode["dz"] = "dz";
    LanguageCode["en"] = "en";
    LanguageCode["en_AU"] = "en_AU";
    LanguageCode["en_CA"] = "en_CA";
    LanguageCode["en_GB"] = "en_GB";
    LanguageCode["en_US"] = "en_US";
    LanguageCode["eo"] = "eo";
    LanguageCode["et"] = "et";
    LanguageCode["ee"] = "ee";
    LanguageCode["fo"] = "fo";
    LanguageCode["fi"] = "fi";
    LanguageCode["fr"] = "fr";
    LanguageCode["fr_CA"] = "fr_CA";
    LanguageCode["fr_CH"] = "fr_CH";
    LanguageCode["ff"] = "ff";
    LanguageCode["gl"] = "gl";
    LanguageCode["lg"] = "lg";
    LanguageCode["ka"] = "ka";
    LanguageCode["de"] = "de";
    LanguageCode["de_AT"] = "de_AT";
    LanguageCode["de_CH"] = "de_CH";
    LanguageCode["el"] = "el";
    LanguageCode["gu"] = "gu";
    LanguageCode["ht"] = "ht";
    LanguageCode["ha"] = "ha";
    LanguageCode["he"] = "he";
    LanguageCode["hi"] = "hi";
    LanguageCode["hu"] = "hu";
    LanguageCode["is"] = "is";
    LanguageCode["ig"] = "ig";
    LanguageCode["id"] = "id";
    LanguageCode["ia"] = "ia";
    LanguageCode["ga"] = "ga";
    LanguageCode["it"] = "it";
    LanguageCode["ja"] = "ja";
    LanguageCode["jv"] = "jv";
    LanguageCode["kl"] = "kl";
    LanguageCode["kn"] = "kn";
    LanguageCode["ks"] = "ks";
    LanguageCode["kk"] = "kk";
    LanguageCode["km"] = "km";
    LanguageCode["ki"] = "ki";
    LanguageCode["rw"] = "rw";
    LanguageCode["ko"] = "ko";
    LanguageCode["ku"] = "ku";
    LanguageCode["ky"] = "ky";
    LanguageCode["lo"] = "lo";
    LanguageCode["la"] = "la";
    LanguageCode["lv"] = "lv";
    LanguageCode["ln"] = "ln";
    LanguageCode["lt"] = "lt";
    LanguageCode["lu"] = "lu";
    LanguageCode["lb"] = "lb";
    LanguageCode["mk"] = "mk";
    LanguageCode["mg"] = "mg";
    LanguageCode["ms"] = "ms";
    LanguageCode["ml"] = "ml";
    LanguageCode["mt"] = "mt";
    LanguageCode["gv"] = "gv";
    LanguageCode["mi"] = "mi";
    LanguageCode["mr"] = "mr";
    LanguageCode["mn"] = "mn";
    LanguageCode["ne"] = "ne";
    LanguageCode["nd"] = "nd";
    LanguageCode["se"] = "se";
    LanguageCode["nb"] = "nb";
    LanguageCode["nn"] = "nn";
    LanguageCode["ny"] = "ny";
    LanguageCode["or"] = "or";
    LanguageCode["om"] = "om";
    LanguageCode["os"] = "os";
    LanguageCode["ps"] = "ps";
    LanguageCode["fa"] = "fa";
    LanguageCode["fa_AF"] = "fa_AF";
    LanguageCode["pl"] = "pl";
    LanguageCode["pt"] = "pt";
    LanguageCode["pt_BR"] = "pt_BR";
    LanguageCode["pt_PT"] = "pt_PT";
    LanguageCode["pa"] = "pa";
    LanguageCode["qu"] = "qu";
    LanguageCode["ro"] = "ro";
    LanguageCode["ro_MD"] = "ro_MD";
    LanguageCode["rm"] = "rm";
    LanguageCode["rn"] = "rn";
    LanguageCode["ru"] = "ru";
    LanguageCode["sm"] = "sm";
    LanguageCode["sg"] = "sg";
    LanguageCode["sa"] = "sa";
    LanguageCode["gd"] = "gd";
    LanguageCode["sr"] = "sr";
    LanguageCode["sn"] = "sn";
    LanguageCode["ii"] = "ii";
    LanguageCode["sd"] = "sd";
    LanguageCode["si"] = "si";
    LanguageCode["sk"] = "sk";
    LanguageCode["sl"] = "sl";
    LanguageCode["so"] = "so";
    LanguageCode["st"] = "st";
    LanguageCode["es"] = "es";
    LanguageCode["es_ES"] = "es_ES";
    LanguageCode["es_MX"] = "es_MX";
    LanguageCode["su"] = "su";
    LanguageCode["sw"] = "sw";
    LanguageCode["sw_CD"] = "sw_CD";
    LanguageCode["sv"] = "sv";
    LanguageCode["tg"] = "tg";
    LanguageCode["ta"] = "ta";
    LanguageCode["tt"] = "tt";
    LanguageCode["te"] = "te";
    LanguageCode["th"] = "th";
    LanguageCode["bo"] = "bo";
    LanguageCode["ti"] = "ti";
    LanguageCode["to"] = "to";
    LanguageCode["tr"] = "tr";
    LanguageCode["tk"] = "tk";
    LanguageCode["uk"] = "uk";
    LanguageCode["ur"] = "ur";
    LanguageCode["ug"] = "ug";
    LanguageCode["uz"] = "uz";
    LanguageCode["vi"] = "vi";
    LanguageCode["vo"] = "vo";
    LanguageCode["cy"] = "cy";
    LanguageCode["fy"] = "fy";
    LanguageCode["wo"] = "wo";
    LanguageCode["xh"] = "xh";
    LanguageCode["yi"] = "yi";
    LanguageCode["yo"] = "yo";
    LanguageCode["zu"] = "zu";
})(exports.LanguageCode || (exports.LanguageCode = {}));

Object.defineProperty(exports, 'EvebleType', {
  enumerable: true,
  get: function () { return core.Type; }
});
Object.defineProperty(exports, 'ExtendableError', {
  enumerable: true,
  get: function () { return core.ExtendableError; }
});
Object.defineProperty(exports, 'Kernel', {
  enumerable: true,
  get: function () { return core.Kernel; }
});
Object.defineProperty(exports, 'KernelError', {
  enumerable: true,
  get: function () { return core.KernelError; }
});
Object.defineProperty(exports, 'Library', {
  enumerable: true,
  get: function () { return core.Library; }
});
Object.defineProperty(exports, 'Type', {
  enumerable: true,
  get: function () { return core.Type; }
});
Object.defineProperty(exports, 'TypeError', {
  enumerable: true,
  get: function () { return core.TypeError; }
});
Object.defineProperty(exports, 'TypeExistsError', {
  enumerable: true,
  get: function () { return core.TypeExistsError; }
});
Object.defineProperty(exports, 'TypeNotFoundError', {
  enumerable: true,
  get: function () { return core.TypeNotFoundError; }
});
Object.defineProperty(exports, 'UnavailableAsserterError', {
  enumerable: true,
  get: function () { return core.UnavailableAsserterError; }
});
Object.defineProperty(exports, 'UnavailableSerializerError', {
  enumerable: true,
  get: function () { return core.UnavailableSerializerError; }
});
Object.defineProperty(exports, 'UnregistrableTypeError', {
  enumerable: true,
  get: function () { return core.UnregistrableTypeError; }
});
Object.defineProperty(exports, 'isSerializable', {
  enumerable: true,
  get: function () { return core.isSerializable; }
});
Object.defineProperty(exports, 'kernel', {
  enumerable: true,
  get: function () { return core.kernel; }
});
Object.defineProperty(exports, 'resolveSerializableFromPropType', {
  enumerable: true,
  get: function () { return core.resolveSerializableFromPropType; }
});
Object.defineProperty(exports, 'Internal', {
  enumerable: true,
  get: function () { return typend.Internal; }
});
Object.defineProperty(exports, 'InvalidDefinitionError', {
  enumerable: true,
  get: function () { return typend.InvalidDefinitionError; }
});
Object.defineProperty(exports, 'InvalidTypeError', {
  enumerable: true,
  get: function () { return typend.InvalidTypeError; }
});
Object.defineProperty(exports, 'InvalidValueError', {
  enumerable: true,
  get: function () { return typend.InvalidValueError; }
});
Object.defineProperty(exports, 'NotAMemberError', {
  enumerable: true,
  get: function () { return typend.NotAMemberError; }
});
Object.defineProperty(exports, 'PatternValidatorExistError', {
  enumerable: true,
  get: function () { return typend.PatternValidatorExistError; }
});
Object.defineProperty(exports, 'PatternValidatorNotFoundError', {
  enumerable: true,
  get: function () { return typend.PatternValidatorNotFoundError; }
});
Object.defineProperty(exports, 'PropTypes', {
  enumerable: true,
  get: function () { return typend.PropTypes; }
});
Object.defineProperty(exports, 'PropsOf', {
  enumerable: true,
  get: function () { return typend.PropsOf; }
});
Object.defineProperty(exports, 'TypeConverterExists', {
  enumerable: true,
  get: function () { return typend.TypeConverterExists; }
});
Object.defineProperty(exports, 'TypeDescriberExistsError', {
  enumerable: true,
  get: function () { return typend.TypeDescriberExistsError; }
});
Object.defineProperty(exports, 'TypeDescriberNotFoundError', {
  enumerable: true,
  get: function () { return typend.TypeDescriberNotFoundError; }
});
Object.defineProperty(exports, 'TypeOf', {
  enumerable: true,
  get: function () { return typend.TypeOf; }
});
Object.defineProperty(exports, 'UndefinableClassError', {
  enumerable: true,
  get: function () { return typend.UndefinableClassError; }
});
Object.defineProperty(exports, 'UnequalValueError', {
  enumerable: true,
  get: function () { return typend.UnequalValueError; }
});
Object.defineProperty(exports, 'UnexpectedKeyError', {
  enumerable: true,
  get: function () { return typend.UnexpectedKeyError; }
});
Object.defineProperty(exports, 'UnknownError', {
  enumerable: true,
  get: function () { return typend.UnknownError; }
});
Object.defineProperty(exports, 'UnmatchedTypeError', {
  enumerable: true,
  get: function () { return typend.UnmatchedTypeError; }
});
Object.defineProperty(exports, 'Validable', {
  enumerable: true,
  get: function () { return typend.Validable; }
});
Object.defineProperty(exports, 'ValidationError', {
  enumerable: true,
  get: function () { return typend.ValidationError; }
});
Object.defineProperty(exports, 'any', {
  enumerable: true,
  get: function () { return typend.any; }
});
Object.defineProperty(exports, 'boolean', {
  enumerable: true,
  get: function () { return typend.boolean; }
});
Object.defineProperty(exports, 'check', {
  enumerable: true,
  get: function () { return typend.check; }
});
Object.defineProperty(exports, 'collection', {
  enumerable: true,
  get: function () { return typend.collection; }
});
Object.defineProperty(exports, 'collectionIncluding', {
  enumerable: true,
  get: function () { return typend.collectionIncluding; }
});
Object.defineProperty(exports, 'collectionWithin', {
  enumerable: true,
  get: function () { return typend.collectionWithin; }
});
Object.defineProperty(exports, 'convert', {
  enumerable: true,
  get: function () { return typend.convert; }
});
Object.defineProperty(exports, 'converter', {
  enumerable: true,
  get: function () { return typend.converter; }
});
Object.defineProperty(exports, 'describer', {
  enumerable: true,
  get: function () { return typend.describer; }
});
Object.defineProperty(exports, 'eq', {
  enumerable: true,
  get: function () { return typend.eq; }
});
Object.defineProperty(exports, 'instanceOf', {
  enumerable: true,
  get: function () { return typend.instanceOf; }
});
Object.defineProperty(exports, 'integer', {
  enumerable: true,
  get: function () { return typend.integer; }
});
Object.defineProperty(exports, 'iof', {
  enumerable: true,
  get: function () { return typend.iof; }
});
Object.defineProperty(exports, 'is', {
  enumerable: true,
  get: function () { return typend.is; }
});
Object.defineProperty(exports, 'isInstanceOf', {
  enumerable: true,
  get: function () { return typend.isInstanceOf; }
});
Object.defineProperty(exports, 'isValid', {
  enumerable: true,
  get: function () { return typend.isValid; }
});
Object.defineProperty(exports, 'list', {
  enumerable: true,
  get: function () { return typend.list; }
});
Object.defineProperty(exports, 'maybe', {
  enumerable: true,
  get: function () { return typend.maybe; }
});
Object.defineProperty(exports, 'never', {
  enumerable: true,
  get: function () { return typend.never; }
});
Object.defineProperty(exports, 'number', {
  enumerable: true,
  get: function () { return typend.number; }
});
Object.defineProperty(exports, 'oneOf', {
  enumerable: true,
  get: function () { return typend.oneOf; }
});
Object.defineProperty(exports, 'optional', {
  enumerable: true,
  get: function () { return typend.optional; }
});
Object.defineProperty(exports, 'propsOf', {
  enumerable: true,
  get: function () { return typend.propsOf; }
});
Object.defineProperty(exports, 'reflect', {
  enumerable: true,
  get: function () { return typend.reflect; }
});
Object.defineProperty(exports, 'string', {
  enumerable: true,
  get: function () { return typend.string; }
});
Object.defineProperty(exports, 'symbol', {
  enumerable: true,
  get: function () { return typend.symbol; }
});
Object.defineProperty(exports, 'tuple', {
  enumerable: true,
  get: function () { return typend.tuple; }
});
Object.defineProperty(exports, 'typeOf', {
  enumerable: true,
  get: function () { return typend.typeOf; }
});
Object.defineProperty(exports, 'typend', {
  enumerable: true,
  get: function () { return typend.typend; }
});
Object.defineProperty(exports, 'unknown', {
  enumerable: true,
  get: function () { return typend.unknown; }
});
Object.defineProperty(exports, 'unrecognized', {
  enumerable: true,
  get: function () { return typend.unrecognized; }
});
Object.defineProperty(exports, 'validate', {
  enumerable: true,
  get: function () { return typend.validate; }
});
Object.defineProperty(exports, 'validator', {
  enumerable: true,
  get: function () { return typend.validator; }
});
Object.defineProperty(exports, 'voided', {
  enumerable: true,
  get: function () { return typend.voided; }
});
Object.defineProperty(exports, 'where', {
  enumerable: true,
  get: function () { return typend.where; }
});
Object.defineProperty(exports, 'Inject', {
  enumerable: true,
  get: function () { return inversify.inject; }
});
Object.defineProperty(exports, 'Injectable', {
  enumerable: true,
  get: function () { return inversify.injectable; }
});
Object.defineProperty(exports, 'PostConstruct', {
  enumerable: true,
  get: function () { return inversify.postConstruct; }
});
Object.defineProperty(exports, 'inject', {
  enumerable: true,
  get: function () { return inversify.inject; }
});
Object.defineProperty(exports, 'injectable', {
  enumerable: true,
  get: function () { return inversify.injectable; }
});
Object.defineProperty(exports, 'postConstruct', {
  enumerable: true,
  get: function () { return inversify.postConstruct; }
});
exports.AbilityAssertion = AbilityAssertion;
exports.App = App;
exports.AppError = AppError;
exports.AppMissingError = AppMissingError;
exports.Asserter = Asserter;
exports.Assertion = Assertion;
exports.AssertionApiAlreadyExistsError = AssertionApiAlreadyExistsError;
exports.BINDINGS = BINDINGS;
exports.BaseApp = BaseApp;
exports.BoundedContext = BoundedContext;
exports.Can = can;
exports.Client = Client;
exports.CommandHandlingTrait = CommandHandlingTrait;
exports.ConsoleTransport = ConsoleTransport;
exports.DEFAULTS = DEFAULTS;
exports.Delegate = delegate;
exports.EVEBLE_BINDINGS = BINDINGS;
exports.EjsonableTrait = EjsonableTrait;
exports.Eveble = Eveble;
exports.EventHandlingTrait = EventHandlingTrait;
exports.GeneratorExistsError = GeneratorExistsError;
exports.GeneratorNotFoundError = GeneratorNotFoundError;
exports.GeneratorTrait = GeneratorTrait;
exports.Handle = handle;
exports.HandlerExistError = HandlerExistError;
exports.HandlerNotFoundError = HandlerNotFoundError;
exports.HandlingError = HandlingError;
exports.HandlingTrait = HandlingTrait;
exports.HookAlreadyExistsError = HookAlreadyExistsError;
exports.HookError = HookError;
exports.HookNotFoundError = HookNotFoundError;
exports.HookableTrait = HookableTrait;
exports.Initial = initial;
exports.InitializingMessageAlreadyExistsError = InitializingMessageAlreadyExistsError;
exports.Injector = Injector;
exports.InjectorError = InjectorError;
exports.InjectorMissingError = InjectorMissingError;
exports.InvalidAppConfigError = InvalidAppConfigError;
exports.InvalidConfigError = InvalidConfigError;
exports.InvalidControllerError = InvalidControllerError;
exports.InvalidEnvironmentError = InvalidEnvironmentError;
exports.InvalidEventSourceableError = InvalidEventSourceableError;
exports.InvalidGeneratorIdError = InvalidGeneratorIdError;
exports.InvalidHandlerError = InvalidHandlerError;
exports.InvalidHookActionError = InvalidHookActionError;
exports.InvalidHookIdError = InvalidHookIdError;
exports.InvalidLegacyTransformerError = InvalidLegacyTransformerError;
exports.InvalidMessageableType = InvalidMessageableType;
exports.InvalidModuleError = InvalidModuleError;
exports.InvalidSchemaVersionError = InvalidSchemaVersionError;
exports.InvalidStateError = InvalidStateError;
exports.InvalidStatusError = InvalidStatusError;
exports.InvalidTransportIdError = InvalidTransportIdError;
exports.InvalidValidatorIdError = InvalidValidatorIdError;
exports.LITERAL_KEYS = LITERAL_KEYS;
exports.LOGGING_LEVELS = LOGGING_LEVELS;
exports.LegacyTransformerAlreadyExistsError = LegacyTransformerAlreadyExistsError;
exports.LegacyTransformerNotFoundError = LegacyTransformerNotFoundError;
exports.List = List;
exports.Log = Log;
exports.LogMetadata = LogMetadata;
exports.LogTransport = LogTransport;
exports.LoggingError = LoggingError;
exports.METADATA_KEYS = METADATA_KEYS;
exports.Module = Module;
exports.ModuleError = ModuleError;
exports.MongoDBClient = MongoDBClient;
exports.MongoDBCommitStorageModule = MongoDBCommitStorageModule;
exports.MongoDBSnapshotStorageModule = MongoDBSnapshotStorageModule;
exports.NON_ENUMERABLE_VALUE_KEY = NON_ENUMERABLE_VALUE_KEY;
exports.NotVersionableError = NotVersionableError;
exports.OneToManyHandlingTrait = OneToManyHandlingTrait;
exports.OneToOneHandlingTrait = OneToOneHandlingTrait;
exports.Projection = Projection;
exports.ProjectionRebuilder = ProjectionRebuilder;
exports.PulseClient = PulseClient;
exports.PulseCommandSchedulerModule = PulseCommandSchedulerModule;
exports.RFC5424LoggingTrait = RFC5424LoggingTrait;
exports.Route = route;
exports.Router = Router;
exports.SPECIFICATIONS = SPECIFICATIONS;
exports.SerializableTrait = SerializableTrait;
exports.SerializationError = SerializationError;
exports.Standard = Standard;
exports.StandardizedTrait = StandardizedTrait;
exports.StateError = StateError;
exports.StatefulAssertion = StatefulAssertion;
exports.StatefulTrait = StatefulTrait;
exports.StatusError = StatusError;
exports.StatusfulAssertion = StatusfulAssertion;
exports.StatusfulTrait = StatusfulTrait;
exports.Struct = Struct;
exports.Subscribe = subscribe;
exports.TransportExistsError = TransportExistsError;
exports.TypeTrait = TypeTrait;
exports.UndefinedStatesError = UndefinedStatesError;
exports.UndefinedStatusesError = UndefinedStatusesError;
exports.UnhandleableTypeError = UnhandleableTypeError;
exports.UnparsableValueError = UnparsableValueError;
exports.UnsupportedExecutionTypeError = UnsupportedExecutionTypeError;
exports.ValidableTrait = ValidableTrait;
exports.ValidatorExistsError = ValidatorExistsError;
exports.ValidatorNotFoundError = ValidatorNotFoundError;
exports.ValidatorTrait = ValidatorTrait;
exports.ValueNumber = ValueNumber;
exports.ValueString = ValueString;
exports.Version = version;
exports.VersionableError = VersionableError;
exports.VersionableTrait = VersionableTrait;
exports.can = can;
exports.convertObjectToCollection = convertObjectToCollection;
exports.createEJSON = createEJSON;
exports.debugInversifyMetadata = debugInversifyMetadata;
exports.delegate = delegate;
exports.getAllClassProperties = getAllClassProperties;
exports.getInjectedParameterIndices = getInjectedParameterIndices;
exports.getInjectedPropertyDetails = getInjectedPropertyDetails;
exports.getInjectedPropertyNames = getInjectedPropertyNames;
exports.getInversifyMetadata = getInversifyMetadata;
exports.getMetadataSummary = getMetadataSummary;
exports.getPostConstructMethodNames = getPostConstructMethodNames;
exports.getPreDestroyMethodNames = getPreDestroyMethodNames;
exports.getPropertiesToValidate = getPropertiesToValidate;
exports.handle = handle;
exports.hasPostConstruct = hasPostConstruct;
exports.hasPreDestroy = hasPreDestroy;
exports.initial = initial;
exports.isEventSourceableType = isEventSourceableType;
exports.isInjectableClass = isInjectableClass;
exports.isPlainRecord = isPlainRecord;
exports.isPropertyInjected = isPropertyInjected;
exports.isRecord = isRecord;
exports.isTyped = isTyped;
exports.loadENV = loadENV;
exports.loggerLoader = loggerLoader;
exports.route = route;
exports.subscribe = subscribe;
exports.toPlainObject = toPlainObject;
exports.version = version;
