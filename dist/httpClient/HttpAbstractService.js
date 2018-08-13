"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const _ = require("lodash");
class HttpAbstractService {
    constructor(conf) {
        this.secure = null;
        this.secure = conf.secure;
    }
    callRequest(options) {
        if (this.secure) {
            this.secure.addHeadersKey(options);
        }
        console.log(options);
        return request(options);
    }
    baseDelete(url = '', headers = {}) {
        var options;
        options = {
            url: url,
            method: "DELETE",
            headers: headers,
            json: true
        };
        return this.callRequest(options);
    }
    baseGet(url = '', headers = {}) {
        var options;
        options = {
            url: url,
            method: "GET",
            headers: headers,
            json: true
        };
        return this.callRequest(options);
    }
    cleanArr(value) {
        var resArr = [];
        value.forEach(data => {
            if (_.isFunction(data)) {
            }
            else if (_.isBoolean(data)) {
                resArr.push(data);
            }
            else if (_.isString(data) && data != '') {
                resArr.push(data);
            }
            else if (_.isArray(data)) {
                let newArr;
                newArr = this.cleanArr(data);
                if (newArr.length > 0) {
                    resArr.push(newArr);
                }
            }
            else if (_.isObject(data)) {
                let newObj;
                newObj = this.cleanObj(data);
                if (Object.keys(newObj).length > 0) {
                    resArr.push(newObj);
                }
            }
        });
        return resArr;
    }
    cleanObj(value) {
        let newValue = {};
        for (let propName in value) {
            if (_.isFunction(value[propName])) {
            }
            else if (_.isBoolean(value[propName])) {
                newValue[propName] = value[propName];
            }
            else if (_.isString(value[propName]) && value[propName] != '') {
                newValue[propName] = value[propName];
            }
            else if (_.isArray(value[propName])) {
                let newArr;
                newArr = this.cleanArr(value[propName]);
                if (newArr.length > 0) {
                    newValue[propName] = newArr;
                }
            }
            else if (_.isObject(value[propName])) {
                let newObj;
                newObj = this.cleanObj(value[propName]);
                if (Object.keys(newObj).length > 0) {
                    newValue[propName] = newObj;
                }
            }
        }
        return newValue;
    }
    basePatch(url = '', body, headers = {}) {
        var options;
        options = {
            url: url,
            method: "PATCH",
            headers: headers,
            body: body,
            json: true
        };
        return this.callRequest(options);
    }
    basePost(url = '', body, headers = {}) {
        var options;
        options = {
            url: url,
            method: "POST",
            headers: headers,
            json: true,
            body: body
        };
        return this.callRequest(options);
    }
    basePut(url = '', body, headers = {}) {
        var options;
        options = {
            url: url,
            method: "PUT",
            headers: headers,
            body: body,
            json: true
        };
        return this.callRequest(options);
    }
}
exports.HttpAbstractService = HttpAbstractService;
//# sourceMappingURL=HttpAbstractService.js.map