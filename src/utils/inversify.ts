/* eslint-disable no-console */
import 'reflect-metadata';

const METADATA_KEY = {
  NAMED_TAG: 'named',
  NAME_TAG: 'name',
  UNMANAGED_TAG: 'unmanaged',
  OPTIONAL_TAG: 'optional',
  INJECT_TAG: 'inject',
  MULTI_INJECT_TAG: 'multi_inject',
  TAGGED: 'inversify:tagged',
  TAGGED_PROP: 'inversify:tagged_props',
  PARAM_TYPES: 'inversify:paramtypes',
  DESIGN_PARAM_TYPES: 'design:paramtypes',
  POST_CONSTRUCT: 'post_construct',
  PRE_DESTROY: 'pre_destroy',
};
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
 * Walk up the prototype chain and collect metadata from all ancestors
 */
function getMetadataFromInheritanceChain(
  target: any
): InversifyClassMetadata[] {
  const metadataList: InversifyClassMetadata[] = [];
  let currentTarget = target;

  // Walk up the prototype chain
  while (
    currentTarget &&
    currentTarget !== Object &&
    currentTarget !== Function.prototype
  ) {
    const metadata = getInversifyMetadata(currentTarget);
    if (metadata) {
      metadataList.push(metadata);
    }
    currentTarget = Object.getPrototypeOf(currentTarget);
  }

  return metadataList;
}

/**
 * Check if class is injectable
 */
export function isInjectableClass(target: any): boolean {
  return Reflect.getMetadata(INVERSIFY_INJECTABLE_FLAG, target) === true;
}

/**
 * Get all property names that have @inject decorator (from entire inheritance chain)
 */
export function getInjectedPropertyNames(target: any): string[] {
  const metadataList = getMetadataFromInheritanceChain(target);
  const propertyNames = new Set<string>();

  for (const metadata of metadataList) {
    if (metadata?.properties) {
      for (const propName of metadata.properties.keys()) {
        propertyNames.add(propName);
      }
    }
  }

  return Array.from(propertyNames);
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
 * Get details about injected properties (from entire inheritance chain)
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
  const metadataList = getMetadataFromInheritanceChain(target);
  const result = new Map();

  // Collect from parent to child (child overrides parent)
  for (let i = metadataList.length - 1; i >= 0; i--) {
    const metadata = metadataList[i];
    if (metadata?.properties) {
      for (const [propName, propMetadata] of metadata.properties.entries()) {
        result.set(propName, {
          serviceIdentifier: propMetadata.value,
          optional: propMetadata.optional,
          name: propMetadata.name,
          tags: propMetadata.tags,
        });
      }
    }
  }

  return result;
}

/**
 * Check if class has @postConstruct decorator (checks entire inheritance chain)
 */
export function hasPostConstruct(target: any): boolean {
  const metadataList = getMetadataFromInheritanceChain(target);

  for (const metadata of metadataList) {
    if (metadata?.lifecycle?.postConstructMethodNames?.size > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Get all @postConstruct method names (from entire inheritance chain)
 */
export function getPostConstructMethodNames(target: any): string[] {
  const metadataList = getMetadataFromInheritanceChain(target);
  const methodNames = new Set<string>();

  // Collect from all levels of inheritance
  for (const metadata of metadataList) {
    if (metadata?.lifecycle?.postConstructMethodNames) {
      for (const methodName of metadata.lifecycle.postConstructMethodNames) {
        methodNames.add(methodName);
      }
    }
  }

  return Array.from(methodNames);
}

/**
 * Check if class has @preDestroy decorator (checks entire inheritance chain)
 */
export function hasPreDestroy(target: any): boolean {
  const metadataList = getMetadataFromInheritanceChain(target);

  for (const metadata of metadataList) {
    if (metadata?.lifecycle?.preDestroyMethodNames?.size > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Get all @preDestroy method names (from entire inheritance chain)
 */
export function getPreDestroyMethodNames(target: any): string[] {
  const metadataList = getMetadataFromInheritanceChain(target);
  const methodNames = new Set<string>();

  // Collect from all levels of inheritance
  for (const metadata of metadataList) {
    if (metadata?.lifecycle?.preDestroyMethodNames) {
      for (const methodName of metadata.lifecycle.preDestroyMethodNames) {
        methodNames.add(methodName);
      }
    }
  }

  return Array.from(methodNames);
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

  const metadataList = getMetadataFromInheritanceChain(target);

  console.log(`\nInheritance chain depth: ${metadataList.length}`);

  metadataList.forEach((metadata, index) => {
    console.log(`\n--- Level ${index} ---`);

    console.log('Injected Properties:');
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

    console.log('Constructor Arguments:');
    if (metadata.constructorArguments.length === 0) {
      console.log('  (none)');
    } else {
      metadata.constructorArguments.forEach((arg, idx) => {
        console.log(`  [${idx}]:`, arg);
      });
    }

    console.log('Lifecycle Hooks:');
    console.log(
      '  @postConstruct:',
      Array.from(metadata.lifecycle.postConstructMethodNames)
    );
    console.log(
      '  @preDestroy:',
      Array.from(metadata.lifecycle.preDestroyMethodNames)
    );

    console.log('Scope:', metadata.scope);
  });
}

/**
 * Get all own properties of a class including inherited ones (excluding constructor)
 */
export function getAllClassProperties(target: any): string[] {
  const props = new Set<string>();
  let currentTarget = target;

  // Walk up the prototype chain
  while (
    currentTarget &&
    currentTarget !== Object &&
    currentTarget !== Function.prototype
  ) {
    const ownProps = Object.getOwnPropertyNames(currentTarget.prototype);
    ownProps.forEach((prop) => {
      if (prop !== 'constructor') {
        props.add(prop);
      }
    });
    currentTarget = Object.getPrototypeOf(currentTarget);
  }

  return Array.from(props);
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

/**
 * Manually registers a method as a @postConstruct hook for InversifyJS
 * This mimics what the @postConstruct decorator does internally
 */
export function registerPostConstruct(target: any, methodName: string): void {
  const proto = target.prototype || target;

  // Get existing post construct methods
  let currentMetadata: string[] = Reflect.hasMetadata(
    METADATA_KEY.POST_CONSTRUCT,
    proto
  )
    ? Reflect.getMetadata(METADATA_KEY.POST_CONSTRUCT, proto)
    : [];

  // Ensure it's an array
  if (!Array.isArray(currentMetadata)) {
    currentMetadata = [];
  }

  // Add the method name if not already present
  if (!currentMetadata.includes(methodName)) {
    currentMetadata.push(methodName);
  }

  // Define the metadata on the prototype
  Reflect.defineMetadata(METADATA_KEY.POST_CONSTRUCT, currentMetadata, proto);

  console.log(
    `Registered postConstruct for ${proto.constructor.name}.${methodName}`
  );
}
