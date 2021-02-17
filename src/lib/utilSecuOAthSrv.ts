import { assert } from 'console';
import * as request from 'request-promise-native';

export class UtilSecuOAuthSrv {
  protected accessTokenUrl: string;
  protected client_id: string;
  protected client_secret: string;
  constructor(private currentApp: any) {
    assert(currentApp.conf.accessTokenUrl, 'client_id is not spécified');
    assert(currentApp.conf.client_id, 'client_id is not spécified');
    assert(currentApp.conf.client_secret, 'client_secret is not spécified');
    this.accessTokenUrl = currentApp.conf.accessTokenUrl;
    this.client_id = currentApp.conf.client_id;
    this.client_secret = currentApp.conf.client_secret;
  }

  protected refreshTokenDate: number;
  protected endTokenDate: number;

  protected promToken: Promise<any>;
  protected accToken: any;

  getToken(): Promise<any> {
    if (this.accToken && this.refreshTokenDate >= Date.now()) {
      return Promise.resolve(this.accToken);
    } else {
      if (this.promToken) {
        return this.promToken;
      } else {
        this.promToken = this.setToken();
        return this.promToken;
      }
    }
  }

  setToken(): Promise<any> {
    const rq = {
      url: `${this.accessTokenUrl}?grant_type=client_credentials&client_id=${this.client_id}&client_secret=${this.client_secret}`,
      method: 'post',
      json: true
    };
    this.accToken = null;
    return request(rq).then((token) => {
      this.accToken = token;
      this.refreshTokenDate = Date.now() + token.expires_in * 1000;
      this.promToken = null;
      return token;
    });
  }

  public addHeadersKeyProm(rq: any): Promise<any> {
    return this.getToken().then((token) => {
      if (!rq.headers) {
        rq.headers = {};
      }
      rq.headers.Authorization = `Bearer ${token.access_token}`;
      return rq;
    });
  }
}
