import { ExtendableError } from '../components/extendable-error';
export declare class KernelError extends ExtendableError {
}
export declare class UnavailableSerializerError extends KernelError {
    constructor();
}
export declare class UnavailableAsserterError extends KernelError {
    constructor();
}
export declare class TypeError extends ExtendableError {
}
export declare class TypeExistsError extends TypeError {
    constructor(source: string, typeName: string);
}
export declare class TypeNotFoundError extends TypeError {
    constructor(source: string, typeName: string);
}
export declare class UnregistrableTypeError extends TypeError {
    constructor(got: string);
}
export declare class ModuleError extends ExtendableError {
}
export declare class AppMissingError extends ModuleError {
    constructor();
}
export declare class InjectorMissingError extends ModuleError {
    constructor();
}
export declare class InvalidModuleError extends ModuleError {
    constructor(className: string, got: string);
}
export declare class InvalidConfigError extends ModuleError {
    constructor(className: string, got: string);
}
export declare class InvalidEnvironmentError extends ModuleError {
    constructor(action: string, currentEnv: string);
}
export declare class InjectorError extends ExtendableError {
}
export declare class InvalidEventSourceableError extends InjectorError {
    constructor(got: any);
}
export declare class AppError extends ExtendableError {
}
export declare class InvalidAppConfigError extends AppError {
    constructor(got: string);
}
export declare class LoggingError extends ExtendableError {
}
export declare class InvalidTransportIdError extends LoggingError {
    constructor(got: string);
}
export declare class TransportExistsError extends LoggingError {
    constructor(id: string);
}
