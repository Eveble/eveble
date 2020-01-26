import 'reflect-metadata';
import {
  interfaces as inversifyTypes,
  METADATA_KEY,
  Container as InversifyContainer,
} from '@parisholley/inversify-async';
import { types } from '../types';
import { hasPostConstruct } from '../utils/helpers';

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

export class Container extends InversifyContainer implements types.Injector {
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
    if (!mappings) return;

    for (const [key, metadatas] of Object.entries(mappings)) {
      for (const metadata of metadatas) {
        if (metadata.key === 'inject') {
          const id = metadata.value;

          value[key] = this.get(id);
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
    if (!mappings) return;

    for (const [key, metadatas] of Object.entries(mappings)) {
      for (const metadata of metadatas) {
        if (metadata.key === 'inject') {
          const id = metadata.value;
          value[key] = await this.getAsync(id);
        }
      }
    }
    if (hasPostConstruct(value)) {
      executePostConstruct(value);
    }
  }
}
