import { isString } from 'lodash';
import { getTypeName } from '@eveble/helpers';
import { ExtendableError } from '@eveble/core';
import { types } from '../types';

export class UndefinedLoggableTargetError extends ExtendableError {
  constructor() {
    super(
      `Please define your logged target with 'Log.prototype.on' method at your Log instance`
    );
  }
}

export class LogMetadata implements types.LogMetadata {
  public readonly description: string;

  public readonly value?: any;

  public readonly keys?: string[];

  /**
   * Creates an instance LogMetadata.
   * @param description - Description of logged metadata entry.
   * @param value - Logged value.
   * @param keys - Optional array of properties keys when provided value is an object. Allows to display only selected ones back on log entry.
   */
  constructor(description: string, value?: any, keys?: string[]) {
    this.description = description;
    if (value) this.value = value;
    if (keys) this.keys = keys;
  }
}

export class Log implements types.LogEntry, types.Stringifiable {
  public readonly message: string;

  public readonly metadata: Map<string, types.LogMetadata>;

  public readonly options: types.LogFormatting;

  public level: types.LogLevel;

  private target?: any;

  public method?: () => types.AnyFunction;

  public methodName?: string;

  public typeName?: types.TypeName | undefined;

  /**
   * Creates an instance Log.
   * @param messageOrProps - Message of a log as a `string` or log properties.
   */
  constructor(messageOrProps: string | Record<keyof any, any>) {
    if (typeof messageOrProps === 'string') {
      const message = messageOrProps;
      this.message = message;
      this.metadata = new Map();
      this.options = {};
      this.method = undefined;
      this.methodName = '';
      this.typeName = '';
    } else {
      const props = messageOrProps;
      Object.assign(this, props);
    }
  }

  /**
   * Converts log to string representation.
   * @returns Log message as a `string`.
   */
  public toString(): string {
    return this.message;
  }

  /**
   * Sets target of the log.
   * @param target - The target on which log is logged(class).
   * @returns Instance of self.
   */
  public on(target: any): this {
    this.target = target;
    this.typeName = getTypeName(this.target) || '';
    return this;
  }

  /**
   * Sets method in which log is invoked or it's name.
   * @param methodOrName - Method in which log is invoked or its name.
   * @returns Instance of self.
   */
  public in(methodOrName: types.AnyFunction | string): this {
    if (this.target === undefined) {
      throw new UndefinedLoggableTargetError();
    }
    let method: types.AnyFunction;
    if (isString(methodOrName)) {
      this.methodName = methodOrName;
      method = this.target[this.methodName];
    } else {
      method = methodOrName;
      this.methodName = method.name;
    }
    this.method = method;

    return this;
  }

  /**
   * Adds additional metadata about log entry.
   * @param description - Description of logged metadata entry.
   * @param value - Optional logged value.
   * @param keys - Optional array of properties keys when provided value is an object. Allows to display only selected ones back on log entry.
   * @returns Instance of self.
   */
  public with(description: string, value?: any, keys?: string[]): this {
    const metadata = new LogMetadata(description, value, keys);
    this.metadata.set(description, metadata);

    return this;
  }

  /**
   * Sets additional formatting options for log entry.
   * @param options - Log formatting options as an object.
   * @returns Instance of self.
   */
  public format(options: types.LogFormatting): this {
    Object.assign(this.options, options);
    return this;
  }

  /**
   * Returns target.
   * @return Class instance.
   */
  public getTarget(): any {
    return this.target;
  }

  /**
   * Evaluates if defined method is a static method.
   * @returns Returns `true` if is static method, else `false`.
   */
  public isStaticMethod(): boolean {
    if (this.target !== undefined && this.method !== undefined) {
      return (
        this.target.constructor !== undefined &&
        this.target.constructor[this.method.name] !== undefined
      );
    }
    return false;
  }

  /**
   * Returns metadata for log entry.
   * @returns `LogMetadata` instance if present.
   */
  public getMetadata(description: string): types.LogMetadata | undefined {
    return this.metadata.get(description);
  }

  /**
   * Evaluates if log entry has metadata with description set on collection.
   * @returns Returns `true` if log entry has metadata, else `false`.
   */
  public hasMetadata(description: string): boolean {
    return this.metadata.has(description);
  }

  /**
   * Sets logging level for which log entry is logged.
   * @param level - Logged level.
   */
  public setLevel(level: types.LogLevel): this {
    this.level = level;
    return this;
  }
}
