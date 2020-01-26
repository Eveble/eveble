import env from 'getenv';
import { typend } from 'typend';
import { BINDINGS } from '../constants/bindings';
import { Library } from './library';
import { types } from '../types';
import { UnavailableSerializerError } from './core-errors';

export class Kernel {
  public injector?: types.Injector;

  private _converter: types.Converter;

  private _validator: types.Validator;

  private _describer: types.Describer;

  private _library: types.Library;

  private _serializer?: types.Serializer;

  private _config: types.KernelConfig;

  /**
   * Creates an instance of Kernel.
   * @remarks
   * Allows to have a single point of entry for low level components of the framework.
   * Most are used on runtime, and would as constructor dependencies/property dependencies -
   * cause a lot of unnecessary complexity on construction or initialization of components.
   * @param converter - `Converter` implementation.
   * @param validator - `Validator` implementation.
   * @param describer - `Describer` implementation.
   * @param library - `Library` implementation.
   * @param config - Kernel configuration.
   */
  constructor(
    converter: types.Converter,
    validator: types.Validator,
    describer: types.Describer,
    library: types.Library,
    config: types.KernelConfig
  ) {
    this._converter = converter;
    this._validator = validator;
    this._describer = describer;
    this._library = library;
    this._config = config;

    this.describer.setFormatting(this._config.describer.formatting);
  }

  /**
   * Returns converter assigned to Kernel or one from IoC container(if container is assigned to Kernel).
   * @returns Instance implementing `types.Converter` interface.
   */
  public get converter(): types.Converter {
    return (
      this.injector?.get<types.Converter>(BINDINGS.Converter) ?? this._converter
    );
  }

  /**
   * Returns validator assigned to Kernel or one from IoC container(if container is assigned to Kernel).
   * @returns Instance implementing `types.Validator` interface.
   */
  public get validator(): types.Validator {
    return (
      this.injector?.get<types.Validator>(BINDINGS.Validator) ?? this._validator
    );
  }

  /**
   * Returns describer assigned to Kernel or one from IoC container(if container is assigned to Kernel).
   * @returns Instance implementing `types.Describer` interface.
   */
  public get describer(): types.Describer {
    return (
      this.injector?.get<types.Describer>(BINDINGS.Describer) ?? this._describer
    );
  }

  /**
   * Returns library assigned to Kernel or one from IoC container(if container is assigned to Kernel).
   * @returns Instance implementing `types.Library` interface.
   */
  public get library(): types.Library {
    return this.injector?.get<types.Library>(BINDINGS.Library) ?? this._library;
  }

  /**
   * Returns serializer assigned to Kernel or one from IoC container(if container is assigned to Kernel).
   * @returns Instance implementing `types.Serializer` interface.
   */
  public get serializer(): types.Serializer {
    if (this.injector?.isBound(BINDINGS.Serializer)) {
      return this.injector?.get<types.Serializer>(BINDINGS.Serializer);
    }

    if (this._serializer !== undefined) {
      return this._serializer;
    }

    throw new UnavailableSerializerError();
  }

  /**
   * Sets converter on Kernel and IoC container(if container is assigned to Kernel).
   * @param converter - Instance implementing `Converter` interface.
   */
  public setConverter(converter: types.Converter): void {
    this._converter = converter;
    this.injector
      ?.rebind<types.Converter>(BINDINGS.Converter)
      ?.toConstantValue(converter);
  }

  /**
   * Sets validator on Kernel and IoC container(if container is assigned to Kernel).
   * @param validator - Instance implementing `Validator` interface.
   */
  public setValidator(validator: types.Validator): void {
    this._validator = validator;
    this.injector
      ?.rebind<types.Validator>(BINDINGS.Validator)
      ?.toConstantValue(validator);
  }

  /**
   * Sets describer on Kernel and IoC container(if container is assigned to Kernel).
   * @param describer - Instance implementing `Describer` interface.
   */
  public setDescriber(describer: types.Describer): void {
    this._describer = describer;
    this.injector
      ?.rebind<types.Describer>(BINDINGS.Describer)
      ?.toConstantValue(describer);
  }

  /**
   * Sets library on Kernel and IoC container(if container is assigned to Kernel).
   * @param library - Instance implementing `Library` interface.
   */
  public setLibrary(library: types.Library): void {
    this._library = library;
    this.injector
      ?.rebind<types.Library>(BINDINGS.Library)
      ?.toConstantValue(library);
  }

  /**
   * Sets serializer on Kernel and IoC container(if container is assigned to Kernel).
   * @param serializer - Instance implementing `Serializer` interface.
   */
  public setSerializer(serializer: types.Serializer): void {
    this._serializer = serializer;
    // Undefined as testing helper
    if (this.injector?.isBound(BINDINGS.Serializer)) {
      this.injector
        ?.rebind<types.Serializer>(BINDINGS.Serializer)
        ?.toConstantValue(serializer);
    }
  }

  /**
   * Sets the IoC container on Kernel.
   * @param injector - IoC container implementing `Container` interface.
   */
  public setInjector(injector: types.Injector): void {
    this.injector = injector;
  }

  /**
   * Evaluates if conversion is done on runtime.
   * @returns Returns `true` if conversion is done on runtime, else `false`.
   */
  public isConverting(): boolean {
    return this._config?.conversion?.type === 'runtime';
  }

  /**
   * Evaluates if validation is done on runtime.
   * @returns Returns `true` if validation is done on runtime, else `false`.
   */
  public isValidating(): boolean {
    return this._config?.validation?.type === 'runtime';
  }

  /**
   * Disables validation.
   */
  public disableValidation(): void {
    this._config.validation.type = 'manual';
  }

  /**
   * Enable validation.
   */
  public enableValidation(): void {
    this._config.validation.type = 'runtime';
  }
}

const library = new Library();
const config: types.KernelConfig = {
  conversion: {
    type: env.string('EVEBLE_CONVERSION_TYPE', 'runtime'),
  },
  validation: {
    type: env.string('EVEBLE_VALIDATION_TYPE', 'runtime'),
  },
  describer: {
    formatting: env.string('EVEBLE_DESCRIBER_FORMATTING', 'default'),
  },
};

export const kernel = new Kernel(
  typend.converter,
  typend,
  typend.describer,
  library,
  config
);
