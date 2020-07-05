import { types } from '../types';
export declare class ExtendableError extends Error {
    name: string;
    message: string;
    stack?: string;
    code?: number;
    constructor(messageOrProps?: string | types.ErrorProps);
    protected initializeProperties(message: string): void;
    fillErrorProps(props: types.ErrorProps): types.ErrorProps;
}
