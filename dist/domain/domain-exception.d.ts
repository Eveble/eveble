import { Event } from '../components/event';
import { DomainError } from './domain-error';
export declare class DomainException extends Event {
    thrower: string;
    error: DomainError;
}
