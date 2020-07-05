import abbreviate from 'abbreviate';
import { inject, injectable } from '@parisholley/inversify-async';
import winston from 'winston';
import { types } from '../../../types';
import { LogTransportConfig } from '../../../configs/log-transport-config';
import { BINDINGS } from '../../../constants/bindings';

@injectable()
export class DetailedLogFormatter implements types.LogFormatter {
  protected converter: types.LogConverter;

  protected chalk: any;

  /**
   * Creates an instance of SimpleLogFormatter.
   * @param converter - LogEntry converter instance.
   */
  constructor(
    @inject(BINDINGS.LogConverter)
    converter: types.LogConverter,
    @inject(BINDINGS.chalk)
    chalk: any
  ) {
    this.converter = converter;
    this.chalk = chalk;
  }

  /**
   * Converts log entry to detailed message.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param config - `LogTransportConfig` instance.
   * @returns String representation of the provided log as detailed message.
   */
  format(
    entry: winston.LogEntry | types.LogEntry,
    config: LogTransportConfig
  ): string {
    const rest = this.converter.convertArguments(entry, config);

    // Formatting
    const colors: Record<string, string> = this.processPartsColors(config);

    // Parts
    const initial: string = this.getInitial(config, colors);
    const timestamp: string = this.getTimestamp(entry, config, colors);
    const label = this.getLabel(config, colors);

    let targetName = '';
    let methodName = '';
    let details = '';

    if (entry.metadata) {
      targetName = this.getTargetName(entry, config, colors);

      if (
        config.get<boolean>('flags.showMethod') &&
        entry.methodName !== undefined &&
        entry.methodName.length > 0
      ) {
        methodName = this.getMethodName(entry, config, colors);
      }

      for (const metadata of entry.metadata.values()) {
        details += this.converter.convertMetadata(metadata, entry, config);
      }
    }

    const { message, level } = entry as any;
    return `${initial}${timestamp}${label}${level}${targetName}${methodName}: ${message} ${rest}${details}`;
  }

  /**
   * Return method name part of log entry.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param config - `LogTransportConfig` instance.
   * @param colors - Colors object with keys as a string and values as chalk-friendly string.
   * @return Formatted method name.
   */
  protected getMethodName(
    entry: winston.LogEntry | types.LogEntry,
    config: LogTransportConfig,
    colors: Record<string, string>
  ) {
    const methodNotation = entry.isStaticMethod() ? '.' : '::';
    const methodType = this.chalk.keyword(colors.separator)(methodNotation);
    let entryMethodName = entry.methodName;
    if (config.get<boolean>('flags.isAbbreviatingSources')) {
      entryMethodName = this.abbreviate(entry.methodName, config);
    }
    return methodType + this.chalk.keyword(colors.method)(entryMethodName);
  }

  /**
   * Return target name part of log entry.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param config - `LogTransportConfig` instance.
   * @param colors - Colors object with keys as a string and values as chalk-friendly string.
   * @return Formatted target name.
   */
  protected getTargetName(
    entry: winston.LogEntry | types.LogEntry,
    config: LogTransportConfig,
    colors: Record<string, string>
  ): string {
    let entryTypeName: string = entry.typeName;
    if (config.get<boolean>('flags.isAbbreviatingSources')) {
      entryTypeName = this.abbreviate(entry.typeName, config);
    }
    return config.get<boolean>('flags.showTarget')
      ? this.getSeparator(config, colors) +
          this.chalk.keyword(colors.target)(entryTypeName)
      : '';
  }

  /**
   * Return label part of log entry.
   * @param config - `LogTransportConfig` instance.
   * @param colors - Colors object with keys as a string and values as chalk-friendly string.
   * @return Formatted label.
   */
  protected getLabel(
    config: LogTransportConfig,
    colors: Record<string, string>
  ) {
    return config.get<boolean>('flags.isLabeled') &&
      config.get<string>('parts.label') !== undefined &&
      config.get<string>('parts.label').length > 0
      ? this.chalk.keyword(colors.label)(config.get<string>('parts.label')) +
          this.getSeparator(config, colors)
      : '';
  }

  /**
   * Return timestamp part of log entry.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @param config - `LogTransportConfig` instance.
   * @param colors - Colors object with keys as a string and values as chalk-friendly string.
   * @return Formatted timestamp.
   */
  protected getTimestamp(
    entry: winston.LogEntry | types.LogEntry,
    config: LogTransportConfig,
    colors: Record<string, string>
  ): string {
    if (config.flags?.isTimestamped === false) {
      return '';
    }
    return (entry as any).timestamp !== undefined
      ? this.chalk.keyword(colors.timestamp)((entry as any).timestamp) +
          this.getSeparator(config, colors)
      : '';
  }

  /**
   * Return separator part of log entry.
   * @param config - `LogTransportConfig` instance.
   * @param colors - Colors object with keys as a string and values as chalk-friendly string.
   * @return Formatted separator.
   */
  protected getSeparator(
    config: LogTransportConfig,
    colors: Record<string, string>
  ): string {
    return this.chalk.keyword(colors.separator)(
      config.get<string>('parts.separator')
    );
  }

  /**
   * Return initial part of log entry.
   * @param config - `LogTransportConfig` instance.
   * @param colors - Colors object with keys as a string and values as chalk-friendly string.
   * @return Formatted initial.
   */
  protected getInitial(
    config: LogTransportConfig,
    colors: Record<string, string>
  ): string {
    return this.chalk.keyword(colors.initial)(
      config.get<string>('parts.initial')
    );
  }

  /**
   * Processes colors of parts for chalk-friendly notation.
   * @param config - `LogTransportConfig` instance.
   * @returns Colors object with keys as a string and values as chalk-friendly string.
   */
  protected processPartsColors(
    config: LogTransportConfig
  ): Record<string, string> {
    const partsColors: Record<string, string> = config.get<
      Record<string, string>
    >('partsColors', {});

    const processed: Record<string, string> = {};
    for (const [part, color] of Object.entries(partsColors)) {
      processed[part] = color.replace(' ', '.');
    }
    return processed;
  }

  /**
   * Abbreviates part of log entry.
   * @param str - Part of log entry.
   * @param config - `LogTransportConfig` instance.
   * @returns Abbreviation.
   */
  protected abbreviate(str: string, config: LogTransportConfig): string {
    return abbreviate(str, {
      length: config.get<number>('abbreviationLength'),
    });
  }
}
