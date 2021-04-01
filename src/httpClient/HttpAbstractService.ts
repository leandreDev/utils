import * as request from 'request-promise-native';
import { IHttpResult } from './IHttpResult';
import { UtilsSecu } from '../UtilsSecu';
import * as _ from 'lodash';
import * as Url from 'url';

export class HttpAbstractService {
  constructor(conf: { secure: UtilsSecu }) {
    this.secure = conf.secure;
  }
  protected secure: UtilsSecu = null;
  protected callRequest<T>(options): Promise<T> {
    if (this.secure) {
      if (this.secure.addHeadersKey) {
        this.secure.addHeadersKey(options);
        return request(options);
      } else if (this.secure.addHeadersKeyProm) {
        return this.secure.addHeadersKeyProm(options).then(() => {
          return request(options);
        });
      }
    } else {
      return request(options);
    }
    // console.info(options) ;
  }

  public cleanArr(value: any[]): any[] {
    const resArr: any[] = [];
    value.forEach((data) => {
      if (_.isFunction(data)) {
        console.info('_.isFunction')
      } else if (_.isBoolean(data)) {
        resArr.push(data);
      } else if (_.isString(data) && data != '') {
        resArr.push(data);
      } else if (_.isArray(data)) {
        const newArr: any = this.cleanArr(data);
        if (newArr.length > 0) {
          resArr.push(newArr);
        }
      } else if (_.isObject(data)) {
        const newObj: any = this.cleanObj(data);
        if (Object.keys(newObj).length > 0) {
          resArr.push(newObj);
        }
      }
    });
    return resArr;
  }

  public cleanObj(value: any): any {
    const newValue: any = {};

    for (const propName in value) {
      if (_.isFunction(value[propName])) {console.info('_.isFunction')
      } else if (_.isBoolean(value[propName])) {
        newValue[propName] = value[propName];
      } else if (_.isString(value[propName]) && value[propName] != '') {
        newValue[propName] = value[propName];
      } else if (_.isArray(value[propName])) {
        const newArr = this.cleanArr(value[propName]);
        if (newArr.length > 0) {
          newValue[propName] = newArr;
        }
      } else if (_.isObject(value[propName])) {
        const newObj = this.cleanObj(value[propName]);
        if (Object.keys(newObj).length > 0) {
          newValue[propName] = newObj;
        }
      }
    }

    return newValue;
  }

  protected basePatch<T>(
    url = '',
    body: any | null,
    headers: any = {}
  ): Promise<IHttpResult<T>> {
    const options = {
      url: new Url.URL(url).href,
      method: 'PATCH',
      headers: headers,
      body: body,
      json: true,
    };

    return this.callRequest<IHttpResult<T>>(options);
  }

  protected basePost<T, U = T>(
    url = '',
    body: U | null,
    headers: any = {}
  ): Promise<IHttpResult<T>> {
    return this._post<IHttpResult<T>, U>(url, body, headers);
  }

  protected basePut<T, U = T>(
    url = '',
    body: U | null,
    headers: any = {}
  ): Promise<IHttpResult<T>> {
    return this._put<IHttpResult<T>, U>(url, body, headers);
  }

  protected baseDelete<T>(
    url = '',
    headers: any = {}
  ): Promise<IHttpResult<T>> {
    return this._delete<IHttpResult<T>>(url, headers);
  }

  protected baseGet<T>(url = '', headers: any = {}): Promise<IHttpResult<T>> {
    return this._get<IHttpResult<T>>(url, headers);
  }

  //without IHttpResult

  protected _patch<T>(
    url = '',
    body: any | null,
    headers: any = {}
  ): Promise<T> {
    const options = {
      url: new Url.URL(url).href,
      method: 'PATCH',
      headers: headers,
      body: body,
      json: true,
    };

    return this.callRequest<T>(options);
  }

  protected _post<T, U = T>(
    url = '',
    body: U | null,
    headers: any = {}
  ): Promise<T> {
    const options = {
      url: new Url.URL(url).href,
      method: 'POST',
      headers: headers,
      json: true,
      body: body,
    };

    return this.callRequest<T>(options);
  }

  protected _put<T, U = T>(
    url = '',
    body: U | null,
    headers: any = {}
  ): Promise<T> {
    const options = {
      url: new Url.URL(url).href,
      method: 'PUT',
      headers: headers,
      body: body,
      json: true,
    };

    return this.callRequest<T>(options);
  }

  protected _delete<T>(url = '', headers: any = {}): Promise<T> {
    const options = {
      url: new Url.URL(url).href,
      method: 'DELETE',
      headers: headers,
      json: true,
    };

    return this.callRequest<T>(options);
  }

  protected _get<T>(url = '', headers: any = {}): Promise<T> {
    const options = {
      url: new Url.URL(url).href,
      method: 'GET',
      headers: headers,
      json: true,
    };

    return this.callRequest<T>(options);
  }
}
