import { define } from '@eveble/core';
import { SerializableError } from '../components/serializable-error';

@define('DomainError')
export abstract class DomainError extends SerializableError {}
