import { injectable } from 'inversify';
import { types } from '../../types';

@injectable()
export class InMemoryCommitObserver implements types.CommitObserver {
  protected _isObserving: boolean;

  constructor() {
    this._isObserving = false;
  }

  async startObserving(_commitPublisher: types.CommitPublisher): Promise<void> {
    this._isObserving = true;
  }

  async pauseObserving(): Promise<void> {
    this._isObserving = false;
  }

  async stopObserving(): Promise<void> {
    this._isObserving = false;
  }

  isObserving(): boolean {
    return this._isObserving;
  }
}
