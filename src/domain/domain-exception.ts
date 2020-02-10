import { Event } from '../components/event';
import { DomainError } from './domain-error';
import { define } from '../decorators/define';

@define('DomainException')
export class DomainException extends Event {
  thrower: string; // Type name of Aggregate or Process that threw the error

  error: DomainError;
}
