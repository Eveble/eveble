import { ExtendableError, kernel } from '@eveble/core';
import { trait } from '@traits-ts/core';

export class InvalidGeneratorIdError extends ExtendableError {
  constructor(got: string) {
    super(`Expected id argument to be string, got ${got}`);
  }
}

export class GeneratorExistsError extends ExtendableError {
  constructor(id: string) {
    super(
      `Generator with id '${id}' would be overridden. To override existing mapping use <MyGenerator.prototype.overrideGenerator>`
    );
  }
}

export class GeneratorNotFoundError extends ExtendableError {
  constructor(id: string) {
    super(`Generator with id '${id}' was not found`);
  }
}

export const GeneratorTrait = <T>() =>
  trait(
    (base) =>
      class extends base {
        public generators: Map<string, T>;

        /**
         * Create an instance of `GeneratorMixin`.
         * @param generators - Map of generators.
         */
        constructor(generators: Map<string, T> = new Map()) {
          super();
          this.generators = generators;
        }

        /**
         * Registers generator.
         * @param id - Identifier for the generator.
         * @param generator - Function for generating value.
         * @param shouldOverride Flag indicating that generator should be overridden.
         * @throws {InvalidGeneratorIdError}
         * Thrown if the id argument is not a string.
         * @throws {GeneratorExistsError}
         * Thrown if the generator would override existing one.
         */
        public registerGenerator(
          id: string,
          generator: T,
          shouldOverride = false
        ): void {
          if (typeof id !== 'string') {
            throw new InvalidGeneratorIdError(kernel.describer.describe(id));
          }
          if (this.hasGenerator(id) && !shouldOverride) {
            throw new GeneratorExistsError(id);
          }
          this.generators.set(id, generator);
        }

        /**
         * Override existing generator.
         * @param id - Identifier for the generator.
         * @param generator - Function for generating value.
         */
        public overrideGenerator(id: string, generator: T): void {
          this.registerGenerator(id, generator, true);
        }

        /**
         * Returns generator.
         * @param id - Identifier for the generator.
         * @return Generator function.
         */
        public getGenerator(id: string): T | undefined {
          return this.generators.get(id);
        }

        /**
         * Evaluates if generator is registered.
         * @param id - Identifier for the generator.
         * @returns Returns `true` if generator is registered, else `false`.
         */
        public hasGenerator(id: string): boolean {
          return this.generators.has(id);
        }

        /**
         * Removes generator.
         * @param id - Identifier for the generator.
         */
        public removeGenerator(id: string): void {
          this.generators.delete(id);
        }

        /**
         * Returns all generator mappings.
         * @returns Mappings of all registered generators.
         */
        public getGenerators(): Map<string, T> {
          return this.generators;
        }
      }
  );
