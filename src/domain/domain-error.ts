import { SerializableError } from '../components/serializable-error';
import { define } from '../decorators/define';

@define('DomainError')
export class DomainError extends SerializableError {}
