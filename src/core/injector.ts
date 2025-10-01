import 'reflect-metadata';
import {
  BindingIdentifier,
  BindingScope,
  BindToFluentSyntax,
  Container as InversifyContainer,
  ServiceIdentifier,
} from 'inversify';
import { kernel } from '@eveble/core';
import { types } from '../types';
import { isEventSourceableType } from '../utils/helpers';
import { BINDINGS } from '../constants/bindings';
import { InvalidEventSourceableError } from './core-errors';
import {
  getInversifyMetadata,
  getPostConstructMethodNames,
  hasPostConstruct,
} from '../utils/inversify';

/**
 * Executes annotated by `@postConstruct` post construction method on target.
 * @param target - Instance that has `@postConstruct` annotation applied to method.
 */
function executePostConstruct(target: any): void {
  const postConstructMethods = getPostConstructMethodNames(target.constructor);
  for (const methodName of postConstructMethods) {
    target[methodName]();
  }
}

/**
 * Executes annotated by `@postConstruct` post construction method on target.
 * @async
 * @param target - Instance that has `@postConstruct` annotation applied to method.
 */
async function executePostConstructAsync(target: any): Promise<void> {
  const postConstructMethods = getPostConstructMethodNames(target.constructor);
  for (const methodName of postConstructMethods) {
    await target[methodName]();
  }
}

/**
 * Extended binding syntax that tracks scope
 */
class TrackedBindingToSyntax<T> {
  constructor(
    private originalSyntax: any,
    private injector: Injector,
    private serviceIdentifier: ServiceIdentifier<T>
  ) {
    // Copy all methods from original
    const proto = Object.getPrototypeOf(originalSyntax);
    const methods = Object.getOwnPropertyNames(proto).filter(
      (name) =>
        name !== 'constructor' && typeof (proto as any)[name] === 'function'
    );

    for (const method of methods) {
      if (!(this as any)[method]) {
        (this as any)[method] = (...args: any[]) => {
          const result = (originalSyntax as any)[method](...args);

          // Track scope changes
          if (method === 'inSingletonScope') {
            this.injector._trackScope('Singleton', this.serviceIdentifier);
          } else if (method === 'inTransientScope') {
            this.injector._trackScope('Transient', this.serviceIdentifier);
          } else if (method === 'inRequestScope') {
            this.injector._trackScope('Request', this.serviceIdentifier);
          } else if (method === 'toConstantValue') {
            this.injector._trackScope('Transient', this.serviceIdentifier);
          } else if (method === 'to' || method === 'toSelf') {
            // Default scope is Transient
            this.injector._trackScope('Transient', this.serviceIdentifier);
          }

          // Return wrapped result if it's chainable
          if (
            result &&
            typeof result === 'object' &&
            result !== originalSyntax
          ) {
            return new TrackedBindingToSyntax(
              result,
              this.injector,
              this.serviceIdentifier
            );
          }
          return result;
        };
      }
    }
  }

  toRoute(EventSourceableType: types.EventSourceableType): void {
    if (!isEventSourceableType(EventSourceableType)) {
      throw new InvalidEventSourceableError(
        kernel.describer.describe(EventSourceableType)
      );
    }
    const Router = this.injector.get<types.RouterType>(BINDINGS.Router);
    const router = new Router(
      EventSourceableType,
      EventSourceableType.resolveInitializingMessage(),
      EventSourceableType.resolveRoutedCommands(),
      EventSourceableType.resolveRoutedEvents()
    );
    this.injector.injectInto(router);
    (this.originalSyntax as any).toConstantValue(router);
    this.injector._trackScope('Transient', this.serviceIdentifier);
  }
}

export class Injector extends InversifyContainer implements types.Injector {
  /**
   * Internal registry to track bindings by scope
   */
  private _scopeRegistry: Map<BindingScope, Set<ServiceIdentifier<any>>> =
    new Map([
      ['Singleton', new Set()],
      ['Transient', new Set()],
      ['Request', new Set()],
    ]);

  /**
   * Track a service identifier with its scope (internal use only)
   * @internal
   */
  public _trackScope(
    scope: BindingScope,
    serviceIdentifier: ServiceIdentifier<any>
  ): void {
    // Remove from all scopes
    for (const identifiers of this._scopeRegistry.values()) {
      identifiers.delete(serviceIdentifier);
    }

    // Add to new scope
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._scopeRegistry.get(scope)!.add(serviceIdentifier);
  }

  /**
   * [OVERRIDE]
   * Registers a type binding
   * @param serviceIdentifier - Identifier for a service.
   * @returns Instance implementing `BindToFluentSyntax` with additional `toRoute` method.
   */
  public bind<T>(
    serviceIdentifier: ServiceIdentifier<T>
  ): BindToFluentSyntax<T> & {
    toRoute(EventSourceableType: types.EventSourceableType): void;
  } {
    const originalSyntax = super.bind<T>(serviceIdentifier);
    return new TrackedBindingToSyntax(
      originalSyntax,
      this,
      serviceIdentifier
    ) as any;
  }

  /**
   * [OVERRIDE]
   * Removes all bindings for a given service identifier
   */
  public unbind(
    serviceIdentifier: BindingIdentifier | ServiceIdentifier
  ): Promise<void> {
    super.unbind(serviceIdentifier);

    // Remove from all scopes
    for (const identifiers of this._scopeRegistry.values()) {
      identifiers.delete(serviceIdentifier as any);
    }
    return Promise.resolve();
  }

  /**
   * [OVERRIDE]
   * Removes all bindings
   */
  public unbindAll(): Promise<void> {
    super.unbindAll();
    for (const identifiers of this._scopeRegistry.values()) {
      identifiers.clear();
    }
    return Promise.resolve();
  }

  /**
   * Synchronously injects dependencies from IoC container to existing value.
   * @remarks
   * Supports `@postConstruct` decorator.
   * @param value - Value to which dependencies should be injected.
   */
  public injectInto(value: any): void {
    const metadata = getInversifyMetadata(value.constructor);

    // Inject property dependencies
    if (metadata?.properties) {
      for (const [
        propertyName,
        propertyMetadata,
      ] of metadata.properties.entries()) {
        const serviceId = propertyMetadata.value;

        // Handle optional dependencies
        if (propertyMetadata.optional) {
          try {
            value[propertyName] = this.get(serviceId);
          } catch (error) {
            // Optional dependency not found, skip
            value[propertyName] = undefined;
          }
        } else {
          value[propertyName] = this.get(serviceId);
        }
      }
    }

    // Execute post construct hooks
    if (hasPostConstruct(value.constructor)) {
      executePostConstruct(value);
    }
  }

  /**
   * Asynchronously injects dependencies from IoC container to existing value.
   * @remarks
   * Supports async `@postConstruct` decorator.
   * @param value - Value to which dependencies should be injected.
   */
  async injectIntoAsync(value: any): Promise<void> {
    const metadata = getInversifyMetadata(value.constructor);

    // Inject property dependencies
    if (metadata?.properties) {
      for (const [
        propertyName,
        propertyMetadata,
      ] of metadata.properties.entries()) {
        const serviceId = propertyMetadata.value;

        // Handle optional dependencies
        if (propertyMetadata.optional) {
          try {
            value[propertyName] = await this.getAsync(serviceId);
          } catch (error) {
            // Optional dependency not found, skip
            value[propertyName] = undefined;
          }
        } else {
          value[propertyName] = await this.getAsync(serviceId);
        }
      }
    }

    // Execute post construct hooks
    if (hasPostConstruct(value.constructor)) {
      await executePostConstructAsync(value);
    }
  }

  /**
   * Finds service identifiers by scope.
   * @param scope - One of supported scopes by Inversify.
   * @returns List of service identifiers binding with provided scope.
   */
  findByScope(scope: BindingScope): ServiceIdentifier<any>[] {
    const identifiers = this._scopeRegistry.get(scope);
    return identifiers ? Array.from(identifiers) : [];
  }
}
