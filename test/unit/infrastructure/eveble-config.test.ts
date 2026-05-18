import { expect, describe, it } from 'vitest';

import { PropTypes } from 'typend';
import { EvebleConfig } from '../../../src/configs/eveble-config';
import { Config } from '../../../src/components/config';

describe(`EvebleConfig`, () => {
  it(`extends Config`, () => {
    expect(EvebleConfig.prototype).toBeInstanceOf(Config);
  });

  describe('prop types', () => {
    it('takes optional CommitStore object with properties: timeout as a number', () => {
      expect(EvebleConfig.getPropTypes().CommitStore).toEqual(
        PropTypes.shape({
          timeout: PropTypes.instanceOf(Number).isOptional,
        }).isOptional
      );
    });

    it('takes optional Snapshotter object with properties: isEnabled as a boolean and frequency as a number', () => {
      expect(EvebleConfig.getPropTypes().Snapshotter).toEqual(
        PropTypes.shape({
          isEnabled: PropTypes.instanceOf(Boolean).isOptional,
          frequency: PropTypes.instanceOf(Number).isOptional,
        }).isOptional
      );
    });

    it('takes optional CommandScheduler object with properties: isEnabled as a boolean', () => {
      expect(EvebleConfig.getPropTypes().CommandScheduler).toEqual(
        PropTypes.shape({
          isEnabled: PropTypes.instanceOf(Boolean).isOptional,
        }).isOptional
      );
    });
  });
});

