import { set, has } from 'lodash';
import { getTypeName } from '@eveble/helpers';
import { ExtendableError } from '@eveble/core';
import { types } from '../types';

export class AssertionApiAlreadyExistsError extends ExtendableError {
  constructor(asserterName: string, assertionName: string, path: string) {
    super(
      `${asserterName}: api from assertion '${assertionName}' already exists on path '${path}'`
    );
  }
}

export class Asserter implements types.Asserter {
  protected assertions: types.Assertion[];

  protected action?: types.Stringifiable | types.MessageType<types.Command>;

  protected entity: types.Entity;

  protected api: Map<string, Function>;

  /**
   * Creates an instance of Asserter.
   * @remarks
   * Current implementation of asserting engine is done in singleton fashion to
   * have minimal-to-none impact on performance in comparison to other solutions.
   */
  constructor() {
    this.api = new Map();
    this.assertions = [];
  }

  /**
   * Registers assertion extension.
   * @param assertion - Instance implementing `Assertion` interface.
   */
  public registerAssertion(assertion: types.Assertion): void {
    for (const [path, method] of assertion.getApi()) {
      this.api.set(path, method);
      // Ensure that apis don't conflict with each other.
      if (has(this, path)) {
        throw new AssertionApiAlreadyExistsError(
          getTypeName(this.constructor) as string,
          getTypeName(assertion) as string,
          path
        );
      }
      // Build up api in form of accessible, nested object properties reassembling
      // sinon `expect` implementation
      if (typeof method === 'function') {
        const boundMethod = method.bind(assertion);
        set(this, path, boundMethod);
      } else {
        set(this, path, method);
      }
    }
    this.assertions.push(assertion);
  }

  /**
   * Evaluates if assertion type is registered on asserter.
   * @param assertion - `Assertion` type constructor.
   * @returns Returns `true` if assertion instance is registered on asserter, else `false`.
   */
  hasAssertion(assertionCtor: any): boolean {
    for (const assertion of this.assertions) {
      if (assertion instanceof assertionCtor) {
        return true;
      }
    }
    return false;
  }

  /**
   * Evaluates if explicit or partial api is registered on asserter.
   * @param explicitOrPartialPath - Explicit or partial path of API.
   * @returns Returns `true` if api is registered on asserter, else `false`.
   */
  hasApi(pathOrPartial: any): boolean {
    for (const key of this.api.keys()) {
      if (key.includes(pathOrPartial)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Changes type of current instance to any so it can be used on TypeScript.
   * @returns This instance of `Asserter`.
   */
  assert(): any {
    return this;
  }

  /**
   * Sets the `Entity` target of assertions.
   * @param entity - `Entity` or subclass instance.
   */
  public setEntity(entity: types.Entity): void {
    this.entity = entity;
  }

  /**
   * Returns `Entity` instance  target of assertions.
   * @returns `Entity` instance.
   */
  public getEntity(): types.Entity {
    return this.entity;
  }

  /**
   * Sets the action for which assertion is being made.
   * @param action - Action name or type implementing `MessageableType`.
   */
  public setAction(action: types.Stringifiable): void {
    this.action = action;
  }

  /**
   * Clears the action
   */
  public clearAction(): void {
    this.action = undefined;
  }

  /**
   * Gets action for which assertion is being made.
   * @returns Action as string or `Stringifiable` implementation.
   */
  public getAction():
    | types.Stringifiable
    | types.MessageType<types.Message>
    | undefined {
    return this.action;
  }

  /**
   * Evaluates if action is set on asserter.
   * @returns Returns `true` if action is set on asserter, else `false`.
   */
  public hasAction(): boolean {
    return this.action !== undefined;
  }

  /**
   * Return registered assertions.
   * @returns List of registered instances of `Assertion` interface.
   */
  public getAssertions(): types.Assertion[] {
    return this.assertions;
  }

  /**
   * Returns available api.
   * @returns Mapping of all available methods.
   */
  public getApi(): Map<string, Function> {
    return this.api;
  }
}
