import { intersection } from 'lodash';
import { ReflectParams } from 'reflect-params';
import { inspect } from 'util';
import hasAnsi from 'has-ansi';
import { injectable } from 'inversify';
import winston from 'winston';
import { types } from '../../../../types';
import { LogTransportConfig } from '../../../../configs/log-transport-config';
import { Log } from '../../../../components/log-entry';

@injectable()
export class StringifingConverter implements types.LogConverter {
  /**
   * Converts additional logged arguments('rest').
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param options - `LogTransportOption` instance.
   * @returns String representation of 'rest' arguments from `LogEntry`.
   */
  public convertArguments(
    entry: winston.LogEntry | types.LogEntry,
    options?: LogTransportConfig
  ): string {
    let inspectOptions: types.node.util.InspectOptions = {};
    if (options !== undefined) {
      inspectOptions = this.resolveInspectOptions(entry, options);
    }

    const splatArgs: any[] = entry[Symbol.for('splat')] || [];
    const rest: string = splatArgs
      .map((arg: any): string => this.stringifyValue(arg, inspectOptions, '\n'))
      .join(' ');
    return rest;
  }

  /**
   * Converts log metadata to string.
   * @param metadata - LogMetadata instance.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param options - `LogTransportOption` instance.
   * @returns String representation of log metadata item.
   */
  public convertMetadata(
    metadata: types.LogMetadata,
    entry: winston.LogEntry | types.LogEntry,
    options: LogTransportConfig
  ): string {
    let inspectOptions: types.node.util.InspectOptions = {};
    if (options !== undefined) {
      inspectOptions = this.resolveInspectOptions(entry, options);
    }

    let strItem = '';
    if (metadata.description === 'arguments') {
      const strArgs: string = this.stringifyMethodParams(
        entry,
        metadata,
        inspectOptions
      );
      if (strArgs.length > 0) {
        strItem = `\nfunction arguments:\n  ${strArgs}`;
      }
    } else if (metadata.description === 'properties') {
      const strProps: string = this.stringifyClassProps(
        entry,
        metadata,
        inspectOptions
      );
      if (strProps.length > 0) {
        strItem = `\nclass properties:\n  ${strProps}`;
      }
    } else {
      const strValue: string = this.stringifyValue(
        metadata.value,
        inspectOptions
      );
      if (strValue.length > 0) {
        strItem = `\n${metadata.description}:  ${strValue}`;
      }
    }
    return strItem;
  }

  /**
   * Converts value to string.
   * @param value - Any value.
   * @param inspectOptions - Formatting util.inspect options.
   * @param inspectOptions.depth - Depth to how deep inspection of value should be done.
   * @param inspectOptions.colors - Flag indicating that values should be colored.
   * @param prefix - Prefix for inspected value.
   * @param suffix - Suffix for inspected value.
   * @returns String representation of that value by Node's util.inspect.
   */
  protected stringifyValue(
    value: any,
    inspectOptions: types.node.util.InspectOptions = {},
    prefix = '',
    suffix = ''
  ): string {
    const prefixStr: string = this.isPrimitive(value) ? '' : prefix;
    const suffixStr: string = this.isPrimitive(value) ? '' : suffix;
    const isInspectable: boolean = typeof value !== 'string' || !hasAnsi(value);

    return (
      prefixStr +
      (isInspectable ? inspect(value, inspectOptions) : value) +
      suffixStr
    );
  }

  /**
   * Converts to string method parameters with names and assigned arguments.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param metadata - LogMetadata instance.
   * @param inspectOptions - Formatting util.inspect options.
   * @param inspectOptions.depth - Depth to how deep inspection of value should be done.
   * @param inspectOptions.colors - Flag indicating that values should be colored.
   * @returns String representation of method parameters and assigned arguments by Node's util.inspect.
   */
  protected stringifyMethodParams(
    entry: winston.LogEntry | types.LogEntry,
    metadata: types.LogMetadata,
    inspectOptions: types.node.util.InspectOptions = {}
  ): string {
    if (entry.method === undefined) {
      return '';
    }

    const argNames: string[] = ReflectParams(entry.method);
    const requiredArgNames: string[] =
      metadata.keys instanceof Array ? metadata.keys : argNames;

    const obj = {};
    const argsIndexes = requiredArgNames.map((argName) =>
      argNames.indexOf(argName)
    );

    for (const index of argsIndexes) {
      if (index === -1 || index >= metadata.value.length) continue;
      obj[argNames[index]] = metadata.value[index];
    }

    return this.stringifyObject(obj, inspectOptions);
  }

  /**
   * Converts to string class properties names and assigned values.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param metadata - LogMetadata instance.
   * @param inspectOptions - Formatting util.inspect options.
   * @param inspectOptions.depth - Depth to how deep inspection of value should be done.
   * @param inspectOptions.colors - Flag indicating that values should be colored.
   * @returns String representation of class properties names and assigned values  by Node's util.inspect.
   */
  protected stringifyClassProps(
    entry: winston.LogEntry | types.LogEntry,
    metadata: types.LogMetadata,
    inspectOptions: types.node.util.InspectOptions = {}
  ): string {
    const allProps = Object.keys((entry as any).target);

    const requiredProps =
      metadata.keys instanceof Array
        ? intersection(allProps, metadata.keys)
        : allProps;

    const obj = {};
    for (const propName of requiredProps) {
      obj[propName] = (entry as any).target[propName];
    }

    return this.stringifyObject(obj, inspectOptions);
  }

  /**
   * Converts object to string representation.
   * @param obj - Object for conversion.
   * @param inspectOptions - Formatting util.inspect options.
   * @param inspectOptions.depth - Depth to how deep inspection of value should be done.
   * @param inspectOptions.colors - Flag indicating that values should be colored.
   * @returns String representation of the object by Node's util.inspect.
   */
  protected stringifyObject(
    obj: Record<keyof any, string>,
    inspectOptions: types.node.util.InspectOptions = {}
  ): string {
    return inspect(obj, {
      depth: inspectOptions.depth || 0,
      colors: inspectOptions.color || false,
    })
      .replace(/^\{/g, '')
      .replace(/\}$/g, '')
      .replace(/^\s+|\s+$/g, '');
  }

  /**
   * Evaluates if value is primitive.
   * @param arg - Any argument.
   * @returns Returns true if argument is primitive, else false.
   */
  protected isPrimitive(arg: any): boolean {
    return (
      arg === null || (typeof arg !== 'object' && typeof arg !== 'function')
    );
  }

  /**
   * Resolves options for Node's util.inspect from LogEntry(if formatting options are attached) or LoggingTransportOptions.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param options - `LogTransportOption` instance.
   * @returns Resolved Node's util.inspect options.
   */
  protected resolveInspectOptions(
    entry: winston.LogEntry | types.LogEntry,
    options: LogTransportConfig
  ): types.node.util.InspectOptions {
    const inspectOptions = {
      depth:
        entry instanceof Log
          ? entry.options?.isColored
          : options.get('isColored'),
      colors:
        entry instanceof Log
          ? entry.options?.inspectDepth
          : options.get('inspectDepth'),
    };
    return inspectOptions;
  }
}
