"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const assert = require("assert");
class CtxInterpretor {
    constructor(context) {
        assert(context, "context is not spécified");
        this.context = context;
    }
    setEnv(varKey) {
        if (varKey.indexOf(".") == -1) {
            if (this.context.hasOwnProperty(varKey)) {
                return this.context[varKey];
            }
            else {
                return "$ENV." + varKey + "$$";
            }
        }
        else {
            let argVar = varKey.split(".");
            let targetContext = this.context;
            argVar.forEach((val) => {
                if (targetContext && targetContext.hasOwnProperty(varKey)) {
                    targetContext = targetContext[val];
                }
                else {
                    targetContext = null;
                }
            });
            if (targetContext != null) {
                return targetContext;
            }
            else {
                return "$ENV." + varKey + "$$";
            }
        }
    }
    ;
    setGlobalEnv(stringKey) {
        var arr, result;
        if (stringKey.indexOf("$ENV.") == -1) {
            return stringKey;
        }
        else {
            var envStart = stringKey.indexOf("$ENV.");
            var envEnd;
            while (envStart > -1) {
                let preEnv = "";
                let postEnv = "";
                let envVar = "";
                if (envStart > 0) {
                    preEnv = stringKey.substr(0, envStart);
                }
                envEnd = stringKey.indexOf("$$", envStart);
                if (envEnd == -1) {
                    envEnd = stringKey.length - 1;
                }
                else if (envEnd + 2 < stringKey.length - 1) {
                    postEnv = stringKey.substr(envEnd + 2);
                }
                envVar = stringKey.substring(envStart + 5, envEnd);
                stringKey = preEnv + this.setEnv(envVar) + postEnv;
                envStart = stringKey.indexOf("$ENV.", envStart);
            }
            return stringKey;
            // arr = stringKey.split("$ENV.");
            // result = "";
            // _.each(arr, (val) => {
            //   let indexOf = val.indexOf("$$") ;
            //   if(indexOf == -1){
            //     result += this.setEnv(val);
            //   }else{
            //     let value = val.substr(0 ,indexOf) ;
            //     result += this.setEnv(value) + val.substr(indexOf) ;
            //   }
            // });
            // return result;
        }
    }
    ;
    updateEnv(obj) {
        _.each(obj, (val, key) => {
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
        return obj;
    }
}
exports.CtxInterpretor = CtxInterpretor;
//# sourceMappingURL=CtxInterpretor.js.map