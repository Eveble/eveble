import 'reflect-metadata';
import {
  interfaces as inversifyTypes,
  METADATA_KEY,
  Container as InversifyContainer,
} from '@parisholley/inversify-async';
import { types } from '../types';
import { hasPostConstruct, isEventSourceableType } from '../utils/helpers';
import { BINDINGS } from '../constants/bindings';
import { kernel } from './kernel';
import { InvalidEventSourceableError } from './core-errors';

type Mappings = Record<keyof any, inversifyTypes.Metadata[]>;

/**
 * Executes annotated by `@postConstruct` post construction method on target.
 * @param target - Instance that has `@postConstruct` annotation applied to method.
 */
function executePostConstruct(target: any): void {
  const metadata = Reflect.getMetadata(
    METADATA_KEY.POST_CONSTRUCT,
    target.constructor
  );

  const methodName = metadata.value;
  target[methodName]();
}

/**
 * Executes annotated by `@postConstruct` post construction method on target.
 * @async
 * @param target - Instance that has `@postConstruct` annotation applied to method.
 */
async function executePostConstructAsync(target: any): Promise<void> {
  const metadata = Reflect.getMetadata(
    METADATA_KEY.POST_CONSTRUCT,
    target.constructor
  );

  const methodName = metadata.value;
  await target[methodName]();
}

export class Injector extends InversifyContainer implements types.Injector {
  /**
   * [OVERRIDE]
   * Registers a type binding
   * @param serviceIdentifier - Identifier for a service.
   * @returns Instance implementing `BindingToSyntax` with additional `toRoute` method.
   */
  public bind<T>(
    serviceIdentifier: inversifyTypes.ServiceIdentifier<T>
  ): inversifyTypes.BindingToSyntax<T> & {
    toRoute(EventSourceableType: types.EventSourceableType): void;
  } {
    const bindingToSyntax = super.bind<T>(serviceIdentifier) as any;

    /**
     * Binds a new instance of `Router` for `EventSourceable` as constant value on Container
     * @param EventSourceableType - `EventSourceable` type(constructor).
     * @returns Instance of `BindingWhenOnSyntax`
     */
    bindingToSyntax.toRoute = (
      EventSourceableType: types.EventSourceableType
    ): void => {
      if (!isEventSourceableType(EventSourceableType)) {
        throw new InvalidEventSourceableError(
          kernel.describer.describe(EventSourceableType)
        );
      }
      const Router = this.get<types.RouterType>(BINDINGS.Router);
      const router = new Router(
        EventSourceableType,
        EventSourceableType.resolveInitializingMessage(),
        EventSourceableType.resolveRoutedCommands(),
        EventSourceableType.resolveRoutedEvents()
      );
      this.injectInto(router);
      bindingToSyntax.toConstantValue(router);
    };
    return bindingToSyntax;
  }

  /**
   * Synchronously injects dependencies from IoC container to existing value.
   * @remarks
   * Supports `@postConstruct` decorator.
   * @param value - Value to which dependencies should be injected.
   */
  public injectInto(value: any): void {
    const mappings: Mappings = Reflect.getMetadata(
      METADATA_KEY.TAGGED_PROP,
      value.constructor
    );
    if (mappings) {
      for (const [key, metadatas] of Object.entries(mappings)) {
        for (const metadata of metadatas) {
          if (metadata.key === 'inject') {
            const id = metadata.value;

            value[key] = this.get(id);
          }
        }
      }
    }

    if (hasPostConstruct(value)) {
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
    const mappings: Mappings = Reflect.getMetadata(
      METADATA_KEY.TAGGED_PROP,
      value.constructor
    );
    if (mappings) {
      for (const [key, metadatas] of Object.entries(mappings)) {
        for (const metadata of metadatas) {
          if (metadata.key === 'inject') {
            const id = metadata.value;
            value[key] = await this.getAsync(id);
          }
        }
      }
    }

    if (hasPostConstruct(value)) {
      await executePostConstructAsync(value);
    }
  }

  /**
   * Finds service identifiers by scope.
   * @param scope - One of supported scopes by Inversify.
   * @returns List of service identifiers binding with provided scope.
   */
  findByScope(
    scope: inversifyTypes.BindingScope
  ): inversifyTypes.ServiceIdentifier<any>[] {
    const lookup = (this as any)._bindingDictionary;

    const identifiers: inversifyTypes.ServiceIdentifier<any>[] = [];
    lookup.traverse((key: any) => {
      const bindings = lookup.get(key);
      for (const binding of bindings) {
        if (binding.scope === scope) {
          identifiers.push(binding.serviceIdentifier);
        }
      }
    });

    return identifiers;
  }
}
