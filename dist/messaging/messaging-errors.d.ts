import { ExtendableError } from '../components/extendable-error';
export declare class HandlingError extends ExtendableError {
}
export declare class UnhandleableTypeError extends HandlingError {
    constructor(className: string, handleableTypes: string, got: string);
}
export declare class InvalidControllerError extends HandlingError {
    constructor(className: string);
}
export declare class InvalidHandlerError extends HandlingError {
    constructor(className: string, type: string, got: string);
}
export declare class HandlerExistError extends HandlingError {
    constructor(className: string, type: string);
}
export declare class HandlerNotFoundError extends HandlingError {
    constructor(className: string, type: string);
}
export declare class UnsupportedExecutionTypeError extends HandlingError {
    constructor(className: string, execution: string);
}
export declare class InvalidMessageableType extends HandlingError {
    constructor(got: string);
}
export declare class InitializingMessageAlreadyExistsError extends HandlingError {
    constructor(className: string, existingMsgName: string, newMsgName: string);
}
export declare class SerializationError extends ExtendableError {
}
export declare class UnparsableValueError extends SerializationError {
    constructor(got: string);
}
