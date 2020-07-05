import { types } from '../types';
export declare class PickableProperties extends Array {
    constructor(...sources: Record<keyof any, any>[]);
    pickProps(propTypes: Record<keyof any, any>): types.Props;
}
