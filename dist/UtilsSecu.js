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
        if (!rq.headers) {
            rq.headers = {};
        }
        if (rq.headers.keyDate) {
            date = new Date(rq.headers.keyDate).valueOf();
        }
        else {
            rq.headers.keyDate = date;
        }
        var url = encodeURI(rq.url.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://"));
        // console.log(url) ;
        // var url = encodeURI(url);
        // var url = rq.url.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://")
        console.log(url);
        rq.headers.key = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
            .update(date + url)
            .digest('hex');
    }
    get chekInternalMidelWare() {
        return (req, res, next) => {
            var date = Number(req.header('keyDate'));
            var key = req.header('key');
            var requrl;
            var currentDate = Date.now();
            if (key) {
                if (currentDate > date + 30000) {
                    if (this.currentApp.conf.debug) {
                        console.log("keyDate is obsolete : " + currentDate + ">" + date + "+ 30000");
                    }
                    next("keyDate is obsolete");
                }
                else {
                    if (req.originalUrl && req.originalUrl.length > 1) {
                        requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
                    }
                    else {
                        requrl = this.currentApp.conf.urlBase;
                    }
                    var url = decodeURI(requrl.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://"));
                    var newKey = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                        .update(date + url)
                        .digest('hex');
                    if (newKey == key) {
                        req.ctx.internalCallValid = true;
                        next();
                    }
                    else {
                        req.ctx.internalCallValid = false;
                        if (this.currentApp.conf.debug) {
                            console.log("key dont match uri : " + requrl, date, key, newKey);
                        }
                        next();
                    }
                }
            }
            else {
                next();
            }
        };
    }
    get protectInternalMidelWare() {
        return (req, res, next) => {
            var date = Number(req.header('keyDate'));
            var key = req.header('key');
            var requrl;
            var currentDate = Date.now();
            if (key) {
                if (currentDate > date + 30000) {
                    if (this.currentApp.conf.debug) {
                        console.log("keyDate is obsolete : " + currentDate + ">" + date + "+ 30000");
                    }
                    next("keyDate is obsolete");
                }
                else {
                    if (req.originalUrl && req.originalUrl.length > 1) {
                        requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
                    }
                    else {
                        requrl = this.currentApp.conf.urlBase;
                    }
                    var url = decodeURI(requrl.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://"));
                    var newKey = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                        .update(date + url)
                        .digest('hex');
                    if (newKey == key) {
                        req.ctx.internalCallValid = true;
                        next();
                    }
                    else {
                        if (this.currentApp.conf.debug) {
                            console.log("key dont match uri : " + requrl, date, key, newKey);
                        }
                        next("key dont match uri : " + requrl);
                    }
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