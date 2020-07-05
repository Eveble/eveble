import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
import { StatefulMixin } from '../mixins/stateful-mixin';
export declare class Client extends StatefulMixin {
    static STATES: {
        constructed: string;
        initialized: string;
        connected: string;
        paused: string;
        stopped: string;
        disconnected: string;
        failed: string;
    };
    id: string | Guid;
    state: types.State;
    constructor(props?: types.Props);
    getId(): string | Guid;
}
