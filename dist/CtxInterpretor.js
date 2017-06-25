"use strict";
const _ = require("lodash");
const assert = require("assert");
class CtxInterpretor {
    constructor(context) {
        assert(context, "context is not spécified");
        this.context = context;
    }
    setEnv(varKey) {
        if (this.context.hasOwnProperty(varKey)) {
            return this.context[varKey];
        }
        else {
            return varKey;
        }
    }
    ;
    setGlobalEnv(stringKey) {
        var arr, result;
        arr = stringKey.split("$ENV.");
        result = "";
        _.each(arr, (val) => {
            var data;
            data = val.split("$$");
            _.each(data, (value) => {
                result += this.setEnv(value);
            });
        });
        return result;
    }
    ;
    updateEnv(obj) {
        return _.each(obj, (val, key) => {
            var arr;
            if (_.isString(val)) {
                return obj[key] = this.setGlobalEnv(val);
            }
            else if (_.isArray(val)) {
                arr = [];
                _.each(val, (obj) => {
                    if (_.isString(obj)) {
                        return arr.push(this.setGlobalEnv(obj));
                    }
                    else {
                        this.updateEnv(obj);
                        return arr.push(obj);
                    }
                });
                return obj[key] = arr;
            }
            else if (_.isObject(val)) {
                return this.updateEnv(val);
            }
        });
    }
}
exports.CtxInterpretor = CtxInterpretor;
//# sourceMappingURL=CtxInterpretor.js.map