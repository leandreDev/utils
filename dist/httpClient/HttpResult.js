"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResult = void 0;
class HttpResult {
    constructor(obj, debug, meta = null) {
        if (obj instanceof Error) {
            this.code = 500;
            this.message = obj.message;
            if (debug) {
                this.stack = obj.stack;
            }
        }
        else {
            this.code = 200;
            if (obj instanceof Array) {
                this.response = obj;
            }
            else {
                this.response = [obj];
            }
        }
        this.meta = meta;
    }
}
exports.HttpResult = HttpResult;
