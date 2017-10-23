"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const assert = require("assert");
class UtilsSecu {
    constructor(currentApp) {
        this.currentApp = currentApp;
        assert(currentApp.conf.secretKey, "secretKey is not spécified");
    }
    addHeadersKey(rq) {
        var date = Date.now();
        rq.headers = {
            'keyDate': date,
            'key': crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                .update(date + rq.url.toLowerCase())
                .digest('hex')
        };
    }
    get chekInternalMidelWare() {
        return (req, res, next) => {
            var date = req.header('keyDate');
            var key = req.header('key');
            var requrl;
            if (key) {
                if (req.originalUrl && req.originalUrl.length > 1) {
                    requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
                }
                else {
                    requrl = this.currentApp.conf.urlBase;
                }
                var newKey = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                    .update(date + requrl.toLowerCase())
                    .digest('hex');
                if (newKey == key) {
                    req.ctx.internalCallValid = true;
                    next();
                }
                else {
                    req.internalCallValid = false;
                    console.log("key dont match uri : " + requrl, date, key, newKey);
                    next();
                }
            }
            else {
                next();
            }
        };
    }
    get protectInternalMidelWare() {
        return (req, res, next) => {
            var date = req.header('keyDate');
            var key = req.header('key');
            var requrl;
            if (key) {
                if (req.originalUrl && req.originalUrl.length > 1) {
                    requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
                }
                else {
                    requrl = this.currentApp.conf.urlBase;
                }
                var newKey = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                    .update(date + requrl.toLowerCase())
                    .digest('hex');
                if (newKey == key) {
                    req.ctx.internalCallValid = true;
                    next();
                }
                else {
                    console.log("key dont match uri : " + requrl, date, key, newKey);
                    next("key dont match uri : " + requrl);
                }
            }
            else {
                next("no key");
            }
        };
    }
}
exports.UtilsSecu = UtilsSecu;
//# sourceMappingURL=UtilsSecu.js.map