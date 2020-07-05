import 'reflect-metadata';
import { define } from 'typend';
import { ExtendableError } from '../components/extendable-error';
export declare class InvalidTypeNameError extends ExtendableError {
    constructor(invalidTypeName: any);
}
export { define };
