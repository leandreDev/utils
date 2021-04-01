"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAbstractService = void 0;
const request = require("request-promise-native");
const _ = require("lodash");
const Url = require("url");
class HttpAbstractService {
    constructor(conf) {
        this.secure = null;
        this.secure = conf.secure;
    }
    callRequest(options) {
        if (this.secure) {
            if (this.secure.addHeadersKey) {
                this.secure.addHeadersKey(options);
                return request(options);
            }
            else if (this.secure.addHeadersKeyProm) {
                return this.secure.addHeadersKeyProm(options).then(() => {
                    return request(options);
                });
            }
        }
        else {
            return request(options);
        }
        // console.info(options) ;
    }
    cleanArr(value) {
        const resArr = [];
        value.forEach((data) => {
            if (_.isFunction(data)) {
                console.info('_.isFunction');
            }
            else if (_.isBoolean(data)) {
                resArr.push(data);
            }
            else if (_.isString(data) && data != '') {
                resArr.push(data);
            }
            else if (_.isArray(data)) {
                const newArr = this.cleanArr(data);
                if (newArr.length > 0) {
                    resArr.push(newArr);
                }
            }
            else if (_.isObject(data)) {
                const newObj = this.cleanObj(data);
                if (Object.keys(newObj).length > 0) {
                    resArr.push(newObj);
                }
            }
        });
        return resArr;
    }
    cleanObj(value) {
        const newValue = {};
        for (const propName in value) {
            if (_.isFunction(value[propName])) {
                console.info('_.isFunction');
            }
            else if (_.isBoolean(value[propName])) {
                newValue[propName] = value[propName];
            }
            else if (_.isString(value[propName]) && value[propName] != '') {
                newValue[propName] = value[propName];
            }
            else if (_.isArray(value[propName])) {
                const newArr = this.cleanArr(value[propName]);
                if (newArr.length > 0) {
                    newValue[propName] = newArr;
                }
            }
            else if (_.isObject(value[propName])) {
                const newObj = this.cleanObj(value[propName]);
                if (Object.keys(newObj).length > 0) {
                    newValue[propName] = newObj;
                }
            }
        }
        return newValue;
    }
    basePatch(url = '', body, headers = {}) {
        const options = {
            url: new Url.URL(url).href,
            method: 'PATCH',
            headers: headers,
            body: body,
            json: true,
        };
        return this.callRequest(options);
    }
    basePost(url = '', body, headers = {}) {
        return this._post(url, body, headers);
    }
    basePut(url = '', body, headers = {}) {
        return this._put(url, body, headers);
    }
    baseDelete(url = '', headers = {}) {
        return this._delete(url, headers);
    }
    baseGet(url = '', headers = {}) {
        return this._get(url, headers);
    }
    //without IHttpResult
    _patch(url = '', body, headers = {}) {
        const options = {
            url: new Url.URL(url).href,
            method: 'PATCH',
            headers: headers,
            body: body,
            json: true,
        };
        return this.callRequest(options);
    }
    _post(url = '', body, headers = {}) {
        const options = {
            url: new Url.URL(url).href,
            method: 'POST',
            headers: headers,
            json: true,
            body: body,
        };
        return this.callRequest(options);
    }
    _put(url = '', body, headers = {}) {
        const options = {
            url: new Url.URL(url).href,
            method: 'PUT',
            headers: headers,
            body: body,
            json: true,
        };
        return this.callRequest(options);
    }
    _delete(url = '', headers = {}) {
        const options = {
            url: new Url.URL(url).href,
            method: 'DELETE',
            headers: headers,
            json: true,
        };
        return this.callRequest(options);
    }
    _get(url = '', headers = {}) {
        const options = {
            url: new Url.URL(url).href,
            method: 'GET',
            headers: headers,
            json: true,
        };
        return this.callRequest(options);
    }
}
exports.HttpAbstractService = HttpAbstractService;
