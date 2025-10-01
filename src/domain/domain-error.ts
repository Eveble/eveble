import { Type } from '@eveble/core';
import { SerializableError } from '../components/serializable-error';

@Type('DomainError')
export abstract class DomainError extends SerializableError {}
