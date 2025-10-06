import 'reflect-metadata';
import { BindingIdentifier, BindingScope, BindToFluentSyntax, Container as InversifyContainer, ServiceIdentifier } from 'inversify';
import { types } from '../types';
export declare class Injector extends InversifyContainer implements types.Injector {
    private _scopeRegistry;
    _trackScope(scope: BindingScope, serviceIdentifier: ServiceIdentifier<any>): void;
    bind<T>(serviceIdentifier: ServiceIdentifier<T>): BindToFluentSyntax<T> & {
        toRoute(EventSourceableType: types.EventSourceableType): void;
    };
    unbind(serviceIdentifier: BindingIdentifier | ServiceIdentifier): Promise<void>;
    unbindAll(): Promise<void>;
    injectInto(value: any): void;
    injectIntoAsync(value: any): Promise<void>;
    findByScope(scope: BindingScope): ServiceIdentifier<any>[];
}
