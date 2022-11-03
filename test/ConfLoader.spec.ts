import { describe, expect, it } from '@jest/globals';
import { AssertionError } from 'assert';

import { ConfLoader } from '../src/ConfLoader';

describe('ConfLoader', () => {
  describe('constructor', () => {
    it('should set it', () => {
      expect(new ConfLoader());
    });

    it('should get an error if CONF_URL env is not set', () => {
      expect(ConfLoader.getConf()).rejects.toThrowError(AssertionError);
    });
  });
});
