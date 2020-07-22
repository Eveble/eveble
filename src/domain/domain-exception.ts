import { define } from '@eveble/core';
import { Event } from '../components/event';
import { DomainError } from './domain-error';

@define('DomainException')
export class DomainException extends Event<DomainException> {
  thrower: string; // Type name of Aggregate or Process that threw the error

  error: DomainError;
}
