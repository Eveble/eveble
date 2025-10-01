import { inject, injectable } from 'inversify';
import winston from 'winston';
import { types } from '../../../types';
import { BINDINGS } from '../../../constants/bindings';

@injectable()
export class SimpleLogFormatter implements types.LogFormatter {
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
   * Converts log entry to simple message.
   * @param entry - Winston's or Eveble's instance implementing `LogEntry` interface.
   * @returns String representation of the provided log as simple message.
   */
  format(entry: winston.LogEntry | types.LogEntry): string {
    const rest = this.converter.convertArguments(entry);
    return `${entry.message} ${rest}`;
  }
}
