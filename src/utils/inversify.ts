import 'reflect-metadata';

/**
 * InversifyJS metadata keys (v7+)
 */
const INVERSIFY_METADATA_KEY = '@inversifyjs/core/classMetadataReflectKey';
const INVERSIFY_INJECTABLE_FLAG =
  '@inversifyjs/core/classIsInjectableFlagReflectKey';

/**
 * Interface for InversifyJS class metadata structure
 */
export interface InversifyClassMetadata {
  constructorArguments: any[];
  lifecycle: {
    postConstructMethodNames: Set<string>;
    preDestroyMethodNames: Set<string>;
  };
  properties: Map<
    string,
    {
      kind: number;
      name: string | undefined;
      optional: boolean;
      tags: Map<any, any>;
      value: any;
    }
  >;
  scope: any;
}

/**
 * Get InversifyJS class metadata
 */
export function getInversifyMetadata(
  target: any
): InversifyClassMetadata | null {
  return Reflect.getMetadata(INVERSIFY_METADATA_KEY, target) || null;
}

/**
 * Check if class is injectable
 */
export function isInjectableClass(target: any): boolean {
  return Reflect.getMetadata(INVERSIFY_INJECTABLE_FLAG, target) === true;
}

/**
 * Get all property names that have @inject decorator
 */
export function getInjectedPropertyNames(target: any): string[] {
  const metadata = getInversifyMetadata(target);

  if (!metadata || !metadata.properties) {
    return [];
  }

  return Array.from(metadata.properties.keys());
}

/**
 * Get all constructor parameter indices that are injected
 */
export function getInjectedParameterIndices(target: any): number[] {
  const metadata = getInversifyMetadata(target);

  if (!metadata || !metadata.constructorArguments) {
    return [];
  }

  return metadata.constructorArguments
    .map((_, index) => index)
    .filter((index) => metadata.constructorArguments[index] !== undefined);
}

/**
 * Get details about injected properties
 */
export function getInjectedPropertyDetails(target: any): Map<
  string,
  {
    serviceIdentifier: any;
    optional: boolean;
    name?: string;
    tags: Map<any, any>;
  }
> {
  const metadata = getInversifyMetadata(target);

  if (!metadata || !metadata.properties) {
    return new Map();
  }

  const result = new Map();

  for (const [propName, propMetadata] of metadata.properties.entries()) {
    result.set(propName, {
      serviceIdentifier: propMetadata.value,
      optional: propMetadata.optional,
      name: propMetadata.name,
      tags: propMetadata.tags,
    });
  }

  return result;
}

/**
 * Check if class has @postConstruct decorator
 */
export function hasPostConstruct(target: any): boolean {
  const metadata: any = getInversifyMetadata(target);
  return metadata?.lifecycle?.postConstructMethodNames?.size > 0 ?? false;
}

/**
 * Get all @postConstruct method names
 */
export function getPostConstructMethodNames(target: any): string[] {
  const metadata = getInversifyMetadata(target);

  if (!metadata?.lifecycle?.postConstructMethodNames) {
    return [];
  }

  return Array.from(metadata.lifecycle.postConstructMethodNames);
}

/**
 * Check if class has @preDestroy decorator
 */
export function hasPreDestroy(target: any): boolean {
  const metadata: any = getInversifyMetadata(target);
  return metadata?.lifecycle?.preDestroyMethodNames?.size > 0 ?? false;
}

/**
 * Get all @preDestroy method names
 */
export function getPreDestroyMethodNames(target: any): string[] {
  const metadata = getInversifyMetadata(target);

  if (!metadata?.lifecycle?.preDestroyMethodNames) {
    return [];
  }

  return Array.from(metadata.lifecycle.preDestroyMethodNames);
}

/**
 * Get complete metadata summary
 */
export function getMetadataSummary(target: any): {
  isInjectable: boolean;
  injectedProperties: string[];
  injectedParameters: number[];
  postConstructMethods: string[];
  preDestroyMethods: string[];
  scope: any;
} {
  const metadata = getInversifyMetadata(target);

  return {
    isInjectable: isInjectableClass(target),
    injectedProperties: getInjectedPropertyNames(target),
    injectedParameters: getInjectedParameterIndices(target),
    postConstructMethods: getPostConstructMethodNames(target),
    preDestroyMethods: getPreDestroyMethodNames(target),
    scope: metadata?.scope,
  };
}

/**
 * Debug: Print all InversifyJS metadata
 */
export function debugInversifyMetadata(target: any): void {
  console.log('\n=== INVERSIFY METADATA DEBUG ===');
  console.log('Target:', target.name);
  console.log('Is Injectable:', isInjectableClass(target));

  const metadata = getInversifyMetadata(target);
  if (!metadata) {
    console.log('No InversifyJS metadata found');
    return;
  }

  console.log('\nInjected Properties:');
  if (metadata.properties.size === 0) {
    console.log('  (none)');
  } else {
    for (const [name, details] of metadata.properties.entries()) {
      console.log(`  - ${name}:`, {
        serviceId: details.value,
        optional: details.optional,
        name: details.name,
        tags: Array.from(details.tags.entries()),
      });
    }
  }

  console.log('\nConstructor Arguments:');
  if (metadata.constructorArguments.length === 0) {
    console.log('  (none)');
  } else {
    metadata.constructorArguments.forEach((arg, index) => {
      console.log(`  [${index}]:`, arg);
    });
  }

  console.log('\nLifecycle Hooks:');
  console.log(
    '  @postConstruct:',
    Array.from(metadata.lifecycle.postConstructMethodNames)
  );
  console.log(
    '  @preDestroy:',
    Array.from(metadata.lifecycle.preDestroyMethodNames)
  );

  console.log('\nScope:', metadata.scope);
}

// ============================================
// PRACTICAL HELPER FUNCTIONS
// ============================================

/**
 * Get all own properties of a class (excluding constructor)
 */
export function getAllClassProperties(target: any): string[] {
  const props = Object.getOwnPropertyNames(target.prototype);
  return props.filter((p) => p !== 'constructor');
}

/**
 * Get properties that should be validated (excludes injected properties and lifecycle hooks)
 */
export function getPropertiesToValidate(target: any): string[] {
  const allProps = getAllClassProperties(target);
  const injectedProps = getInjectedPropertyNames(target);
  const postConstructMethods = getPostConstructMethodNames(target);
  const preDestroyMethods = getPreDestroyMethodNames(target);

  const excludedProps = new Set([
    ...injectedProps,
    ...postConstructMethods,
    ...preDestroyMethods,
  ]);

  return allProps.filter((prop) => !excludedProps.has(prop));
}

/**
 * Check if a specific property is injected
 */
export function isPropertyInjected(target: any, propertyName: string): boolean {
  const injectedProps = getInjectedPropertyNames(target);
  return injectedProps.includes(propertyName);
}
