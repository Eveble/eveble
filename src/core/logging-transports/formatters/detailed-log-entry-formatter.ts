import chalk from 'chalk';
import abbreviate from 'abbreviate';
import { inject, injectable } from '@parisholley/inversify-async';
import winston from 'winston';
import { types } from '../../../types';
import { LogTransportConfig } from '../../../configs/log-transport-config';
import { BINDINGS } from '../../../constants/bindings';

@injectable()
export class DetailedLogFormatter implements types.LogFormatter {
  protected converter: types.LogConverter;

  /**
   * Creates an instance of SimpleLogFormatter.
   * @param converter - LogEntry converter instance.
   */
  constructor(
    @inject(BINDINGS.LogConverter)
    converter: types.LogConverter
  ) {
    this.converter = converter;
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
    const separator: string = chalk`{${colors.separator} ${config.get<string>(
      'parts.separator'
    )}}`;
    // Parts
    const initial: string = config.get<string>('parts.initial', '');
    const timestamp: string =
      (entry as any).timestamp !== undefined
        ? chalk`{${colors.timestamp} ${(entry as any).timestamp}}${separator}`
        : '';
    const label =
      config.get<boolean>('flags.isLabeled') &&
      config.get<string>('parts.label') !== undefined &&
      config.get<string>('parts.label').length > 0
        ? chalk`{${colors.label} ${config.get<string>(
            'parts.label'
          )}}${separator}`
        : '';

    let targetName = '';
    let methodName = '';
    let details = '';

    if (entry.metadata) {
      let entryTypeName = entry.typeName;
      if (config.get<boolean>('flags.isAbbreviatingSources')) {
        entryTypeName = this.abbreviate(entry.typeName, config);
      }
      targetName = config.get<boolean>('flags.showTarget')
        ? chalk`${separator}{${colors.target} ${entryTypeName}}`
        : '';

      if (
        config.get<boolean>('flags.showMethod') &&
        entry.methodName !== undefined &&
        entry.methodName.length > 0
      ) {
        const methodNotation = entry.isStaticMethod() ? '.' : '::';
        const methodType = chalk`{${colors.separator} ${methodNotation}}`;
        let entryMethodName = entry.methodName;
        if (config.get<boolean>('flags.isAbbreviatingSources')) {
          entryMethodName = this.abbreviate(entry.methodName, config);
        }
        methodName = chalk`${methodType}{${colors.method} ${entryMethodName}}`;
      }

      for (const metadata of entry.metadata.values()) {
        details += this.converter.convertMetadata(metadata, entry, config);
      }
    }

    const { message, level } = entry as any;
    return `${initial}${timestamp}${label}${level}${targetName}${methodName}: ${message} ${rest}${details}`;
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
   * @returns abbreviate
   */
  protected abbreviate(str: string, config: LogTransportConfig): string {
    return abbreviate(str, {
      length: config.get<number>('abbreviationLength'),
    });
  }
}
