import 'reflect-metadata';
import { interfaces as inversifyTypes, Container as InversifyContainer } from '@parisholley/inversify-async';
import { types } from '../types';
export declare class Injector extends InversifyContainer implements types.Injector {
    bind<T>(serviceIdentifier: inversifyTypes.ServiceIdentifier<T>): inversifyTypes.BindingToSyntax<T> & {
        toRoute(EventSourceableType: types.EventSourceableType): void;
    };
    injectInto(value: any): void;
    injectIntoAsync(value: any): Promise<void>;
    findByScope(scope: inversifyTypes.BindingScope): inversifyTypes.ServiceIdentifier<any>[];
}
