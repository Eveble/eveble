import { types } from '../types';

export class Assertion {
  public api: Map<string, Function>;

  public asserter: types.Asserter;

  /**
   * Creates an instance of Assertion.
   * @param asserter - Instance implementing `Asserter` interface.
   */
  constructor(asserter: types.Asserter) {
    this.asserter = asserter;
  }

  /**
   * Return assertion api for current assertion.
   * @returns Mappings of exposed api assertions.
   */
  public getApi(): Map<string, Function> {
    return this.api;
  }
}
