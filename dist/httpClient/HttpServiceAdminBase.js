"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServiceAdminBase = void 0;
const HttpAbstractService_1 = require("./HttpAbstractService");
const CtxInterpretor_1 = require("../CtxInterpretor");
class HttpServiceAdminBase extends HttpAbstractService_1.HttpAbstractService {
    constructor(conf) {
        super(conf);
        this.globalCtxInt = new CtxInterpretor_1.CtxInterpretor(process.env);
        this.url = conf.url;
    }
    delete(query, headers = {}) {
        return super.baseDelete(this.url + query, headers);
    }
    patch(body, headers = {}, query = '') {
        return super.basePatch(this.url + query, body, headers);
    }
}
exports.HttpServiceAdminBase = HttpServiceAdminBase;
