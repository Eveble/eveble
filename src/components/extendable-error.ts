import { isObject } from 'lodash';
import { types } from '../types';

export class ExtendableError extends Error {
  name: string;

  message: string;

  stack?: string;

  code?: number;

  /**
   * Creates an instance of ExtendableError.
   * @param messageOrProps - Error message as string or object containing message with
   * other properties matching prop types.
   */
  constructor(messageOrProps?: string | types.ErrorProps) {
    const props = isObject(messageOrProps)
      ? messageOrProps
      : { message: messageOrProps };
    props.message = props.message
      ? props.message
      : ExtendableError.prototype.message || '';
    const processedProps = props as types.ErrorProps;

    super();
    this.initializeProperties(processedProps.message);
    const errorProps: types.ErrorProps = this.fillErrorProps(processedProps);
    Object.assign(this, errorProps);
  }

  /**
   * Initializes ExtendableError properties.
   * @param message - Error message as String.
   * @license
   * https://github.com/bjyoungblood/es6-error
   * The MIT License (MIT)
   *
   * Copyright (c) 2015 Ben Youngblood
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy of this
   * software and associated documentation files (the "Software"), to deal in the Software
   * without restriction, including without limitation the rights to use, copy, modify, merge,
   * publish, distribute, sublicense, and/or sell copies of the Software, and to permit
   * persons to whom the Software is furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all copies or
   * substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
   * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
   * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
   * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
   * OR OTHER DEALINGS IN THE SOFTWARE.
   */
  protected initializeProperties(message: string): void {
    // Extending Error does not propagate `message`
    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: false,
      value: message,
      writable: true,
    });

    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      value: this.constructor.name,
      writable: true,
    });
    // eslint-disable-next-line no-prototype-builtins
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    Object.defineProperty(this, 'stack', {
      configurable: true,
      enumerable: false,
      value: new Error(message).stack,
      writable: true,
    });
  }

  /**
   * Fills missing error properties.
   * @param props - Provided properties durning construction of error.
   * @returns Filled properties Object for ExtendableError instance.
   */
  public fillErrorProps(props: types.ErrorProps): types.ErrorProps {
    const errorProps = props;
    errorProps.message = props.message;
    errorProps.name = this.constructor.name;

    const error = Error.call(this, props.message);
    error.name = this.constructor.name;
    if (error.stack !== undefined) {
      errorProps.stack = error.stack;
    }

    return errorProps;
  }
}
