"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const URL = require("url");
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
        if (this.currentApp.conf.debug) {
            console.log(rq.url);
        }
        var url = URL.format(new URL.URL(rq.url.trim().toLowerCase()), { unicode: true });
        // var url = encodeURI(rq.url.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://"));
        // console.log(url) ;
        // var url = encodeURI(url);
        // var url = rq.url.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://")
        console.log(url);
        if (this.currentApp.conf.debug) {
            console.log(url);
        }
        rq.headers.key = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
            .update(date + url)
            .digest('hex');
        if (this.currentApp.conf.debug) {
            console.log(rq.headers.keyDate, rq.headers.key);
        }
    }
    testkey(req) {
        var date = Number(req.headers.keyDate);
        var key = req.headers.key;
        var requrl;
        var currentDate = Date.now();
        if (req.originalUrl && req.originalUrl.length > 1) {
            requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
        }
        else {
            requrl = this.currentApp.conf.urlBase;
        }
        // var url = requrl.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://");
        var url = URL.format(new URL.URL(requrl.trim().toLowerCase()), { unicode: true });
        if (this.currentApp.conf.debug) {
            console.log(`url : ${url}`);
        }
        url = encodeURI(decodeURI(url));
        if (this.currentApp.conf.debug) {
            console.log(`url  decoded encoded : ${url}`);
        }
        var newKey = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
            .update(date + url)
            .digest('hex');
        if (newKey == key) {
            req.ctx.internalCallValid = true;
        }
        else {
            req.ctx.internalCallValid = false;
            if (this.currentApp.conf.debug) {
                console.log("key dont match uri encodeURI: " + url, date, key, newKey);
            }
        }
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
                    req.ctx.internalCallValid = false;
                    next();
                }
                else {
                    if (req.originalUrl && req.originalUrl.length > 1) {
                        requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
                    }
                    else {
                        requrl = this.currentApp.conf.urlBase;
                    }
                    // var url = requrl.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://");
                    var url = URL.format(new URL.URL(requrl.trim().toLowerCase()), { unicode: true });
                    if (this.currentApp.conf.debug) {
                        console.log(`url : ${url}`);
                    }
                    // url = encodeURI(decodeURI(url)) ;
                    if (this.currentApp.conf.debug) {
                        console.log(`url  decoded encoded : ${url}`);
                    }
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
                            console.log("key dont match uri encodeURI: " + url, date, key, newKey);
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
                    var url = URL.format(new URL.URL(requrl.trim().toLowerCase()), { unicode: true });
                    // var url = requrl.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://") ;
                    // url = encodeURI(decodeURI(url)) ;
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