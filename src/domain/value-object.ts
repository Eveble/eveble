import { define } from '../decorators/define';
import { Serializable } from '../components/serializable';

@define('ValueObject')
export class ValueObject extends Serializable {}
