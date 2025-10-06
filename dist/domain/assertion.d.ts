import { types } from '../types';
export declare class Assertion {
    api: Map<string, Function>;
    asserter: types.Asserter;
    constructor(asserter: types.Asserter);
    getApi(): Map<string, Function>;
}
