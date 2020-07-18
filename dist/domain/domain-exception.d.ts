import { Event } from '../components/event';
import { DomainError } from './domain-error';
export declare class DomainException extends Event<DomainException> {
    thrower: string;
    error: DomainError;
}
