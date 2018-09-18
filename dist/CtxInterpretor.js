"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const assert = require("assert");
const moment = require("moment");
class CtxInterpretor {
    constructor(context) {
        this.startPatern = "$ENV.";
        this.endPatern = "$$";
        this.splitPatern = ".";
        assert(context, "context is not spécified");
        this.context = context;
    }
    setEnv(varKey, removeUnknownVar = false) {
        if (varKey.indexOf(".") == -1) {
            if (this.context.hasOwnProperty(varKey)) {
                return this.context[varKey];
            }
            else {
                return this.startPatern + varKey + this.endPatern;
            }
        }
        else {
            let argVar = varKey.split(this.splitPatern);
            let targetContext = this.context;
            argVar.forEach((val) => {
                if (targetContext) {
                    if (_.isArray(targetContext) && parseInt(val) != NaN) {
                        targetContext = targetContext[parseInt(val)];
                    }
                    else if (targetContext.hasOwnProperty(val)) {
                        targetContext = targetContext[val];
                    }
                    else {
                        targetContext = null;
                    }
                }
            });
            if (targetContext != null) {
                return targetContext;
            }
            else {
                if (removeUnknownVar) {
                    return "";
                }
                else {
                    return this.startPatern + varKey + this.endPatern;
                }
            }
        }
    }
    ;
    setGlobalEnv(stringKey, removeUnknownVar = false) {
        var arr, result;
        if (stringKey.indexOf(this.startPatern) == -1) {
            return stringKey;
        }
        else {
            var envStart = stringKey.indexOf(this.startPatern);
            var envEnd;
            var startPaternLength = this.startPatern.length;
            var endPaternLength = this.endPatern.length;
            while (envStart > -1) {
                let preEnv = "";
                let postEnv = "";
                let envVar = "";
                if (envStart > 0) {
                    preEnv = stringKey.substr(0, envStart);
                }
                envEnd = stringKey.indexOf(this.endPatern, envStart);
                if (envEnd == -1) {
                    envEnd = stringKey.length;
                }
                else if (envEnd + endPaternLength < stringKey.length - 1) {
                    postEnv = stringKey.substr(envEnd + endPaternLength);
                }
                envVar = stringKey.substring(envStart + startPaternLength, envEnd);
                if (preEnv == "" && postEnv == "") {
                    stringKey = this.setEnv(envVar, removeUnknownVar);
                    envStart = -1;
                }
                else {
                    stringKey = preEnv + this.setEnv(envVar, removeUnknownVar) + postEnv;
                    envStart = stringKey.indexOf(this.startPatern, envStart + 1);
                }
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
    updateArrEnv(obj, clone = false, removeUnknownVar = false) {
        let newArr = [];
        obj.forEach((data) => {
            if (_.isString(data)) {
                newArr.push(this.setGlobalEnv(data, removeUnknownVar));
            }
            else if (_.isArray(data)) {
                newArr.push(this.updateArrEnv(data, clone, removeUnknownVar));
            }
            else if (_.isObject(data)) {
                newArr.push(this.updateEnv(data, clone, removeUnknownVar));
            }
            else {
                newArr.push(data);
            }
        });
        if (newArr.length > 1 && (newArr[0].toString()).slice(0, 3) == "$__") {
            // c'est une fonction
            let key = newArr[0].toString();
            try {
                switch (key) {
                    case "$__moment_add":
                        return moment(newArr[1]).add(parseFloat(newArr[2].tostring()), newArr[3]);
                    case "$__moment_substract":
                        return moment(newArr[1]).add(parseFloat(newArr[2].tostring()), newArr[3]);
                    default:
                        break;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            return newArr;
        }
    }
    updateEnv(obj, clone = false, removeUnknownVar = false) {
        if (clone) {
            obj = Object.assign({}, obj);
        }
        _.each(obj, (val, key) => {
            var arr;
            if (_.isString(val)) {
                obj[key] = this.setGlobalEnv(val, removeUnknownVar);
            }
            else if (_.isArray(val)) {
                obj[key] = this.updateArrEnv(val, clone, removeUnknownVar);
            }
            else if (_.isObject(val)) {
                obj[key] = this.updateEnv(val, clone, removeUnknownVar);
            }
        });
        return obj;
    }
}
exports.CtxInterpretor = CtxInterpretor;
//# sourceMappingURL=CtxInterpretor.js.map