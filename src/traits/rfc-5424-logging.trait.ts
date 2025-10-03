import { trait } from '@traits-ts/core';
import { types } from '../types';

export const RFC5424LoggingTrait = trait(
  (base) =>
    class extends base {
      /**
       * Logs emergency system is unusable.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public emerg(entry: string | types.LogEntry, ...args: any[]): void {
        this.log('emerg', entry, ...args);
      }

      /**
       * Logs action must be taken immediately.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public alert(entry: string | types.LogEntry, ...args: any[]): void {
        this.log('alert', entry, ...args);
      }

      /**
       * Logs critical conditions.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public crit(entry: string | types.LogEntry, ...args: any[]): void {
        this.log('crit', entry, ...args);
      }

      /**
       * Logs error conditions.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public error(entry: string | types.LogEntry, ...args: any[]): void {
        this.log('error', entry, ...args);
      }

      /**
       * Logs warning conditions.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public warning(entry: string | types.LogEntry, ...args: any[]): void {
        this.log('warning', entry, ...args);
      }

      /**
       * Logs normal but significant condition.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public notice(entry: string | types.LogEntry, ...args: any[]): void {
        this.log('notice', entry, ...args);
      }

      /**
       * Logs informational messages.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public info(entry: string | types.LogEntry, ...args: any[]): void {
        this.log('info', entry, ...args);
      }

      /**
       * Logs debug-level messages.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public debug(entry: string | types.LogEntry, ...args: any[]): void {
        this.log('debug', entry, ...args);
      }

      /**
       * [PLACEHOLDER]: Logs message for level.
       * @param entry - Logging entry as a string or loggable.
       * @param args - Any other arguments that will be attached to log entry.
       */
      public log(entry: string | types.LogEntry, ...args: any[]): void {
        return entry && args ? undefined : undefined;
      }
    }
);
