import { describe, expect, it } from '@jest/globals';
import { IApplicationConfiguration } from '../src/IApplicationConfiguration';
import { UtilsSecu } from '../src/UtilsSecu';
import { createRequest } from 'node-mocks-http';

const appConf: IApplicationConfiguration = {
  conf: { secretKey: 'poipoi', debug: true },
};

const request = createRequest({
  method: 'GET',
  url: '/this/is/some/random/url',
  headers: {
    ['keyDate']: Date.now().toString(),
  },
});

describe('UtilsSecu', () => {
  it('should have a valid application configuration', () => {
    expect(new UtilsSecu(appConf));
  });

  it('test', () => {
    new UtilsSecu(appConf).addHeadersKey(request);
    expect(request);
  });
});
