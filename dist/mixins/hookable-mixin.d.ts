import 'reflect-metadata';
import { ExtendableError } from '@eveble/core';
import { types } from '../types';
export declare class HookError extends ExtendableError {
}
export declare class InvalidHookActionError extends HookError {
    constructor(got: any);
}
export declare class InvalidHookIdError extends HookError {
    constructor(got: any);
}
export declare class HookAlreadyExistsError extends HookError {
    constructor(typeName: types.TypeName, action: string, id: string);
}
export declare class HookNotFoundError extends HookError {
    constructor(typeName: types.TypeName, action: string, id: string);
}
export declare class HookableMixin implements types.Hookable {
    registerHook(action: string, id: string, hook: types.Hook, shouldOverride?: boolean): void;
    overrideHook(action: string, id: string, hook: types.Hook): void;
    getHook(action: string, id: string): types.Hook | undefined;
    getHookOrThrow(action: string, id: string): types.Hook;
    getHooks(action: string): types.hooks.Mappings;
    getActions(): types.hooks.Actions;
    hasHook(action: string, id: string): boolean;
    hasAction(action: string): boolean;
    removeHook(action: string, id: string): void;
}
