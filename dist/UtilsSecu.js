"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsSecu = void 0;
const crypto = require("crypto");
const URL = require("url");
const assert = require("assert");
class UtilsSecu {
    constructor(currentApp) {
        this.currentApp = currentApp;
        assert(currentApp.conf.secretKey, 'secretKey is not spécified');
    }
    addHeadersKeyProm(rq) {
        return Promise.resolve().then(() => {
            this.addHeadersKey(rq);
            return;
        });
    }
    addHeadersKey(rq) {
        let date = Date.now();
        if (!rq.headers) {
            rq.headers = {};
        }
        if (rq.headers.keyDate) {
            date = new Date(rq.headers.keyDate).valueOf();
        }
        else {
            rq.headers.keyDate = date;
        }
        rq.url = URL.format(new URL.URL(rq.url.trim()), { unicode: true });
        const url = rq.url.toLowerCase();
        rq.headers.key = crypto
            .createHmac('sha256', this.currentApp.conf.secretKey)
            .update(rq.headers.keyDate + url)
            .digest('hex');
        if (this.currentApp.conf.debug) {
            console.info('create sig', url, rq.headers.keyDate, rq.headers.key);
        }
    }
    testkey(req) {
        const date = Number(req.headers.keyDate);
        const key = req.headers.key;
        let requrl;
        const currentDate = Date.now();
        if (req.originalUrl && req.originalUrl.length > 1) {
            requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
        }
        else {
            requrl = this.currentApp.conf.urlBase;
        }
        // var url = requrl.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://");
        const url = URL.format(new URL.URL(requrl.trim()), {
            unicode: true,
        }).toLowerCase();
        const newKey = crypto
            .createHmac('sha256', this.currentApp.conf.secretKey)
            .update(date + url)
            .digest('hex');
        if (newKey == key) {
            req.ctx.internalCallValid = true;
        }
        else {
            req.ctx.internalCallValid = false;
            if (this.currentApp.conf.debug) {
                console.error('key dont match ' + url, date, key, newKey);
            }
        }
    }
    get chekInternalMidelWare() {
        return (req, res, next) => {
            const date = Number(req.header('keyDate'));
            const key = req.header('key');
            let requrl;
            const currentDate = Date.now();
            if (key) {
                if (currentDate > date + 30000) {
                    if (this.currentApp.conf.debug) {
                        console.error('keyDate is obsolete : ' + currentDate + '>' + date + '+ 30000');
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
                    const url = URL.format(new URL.URL(requrl.trim()), {
                        unicode: true,
                    }).toLowerCase();
                    const newKey = crypto
                        .createHmac('sha256', this.currentApp.conf.secretKey)
                        .update(date + url)
                        .digest('hex');
                    if (newKey == key) {
                        req.ctx.internalCallValid = true;
                        next();
                    }
                    else {
                        req.ctx.internalCallValid = false;
                        if (this.currentApp.conf.debug) {
                            console.error('key dont match ' + url, date, key, newKey);
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
            const date = Number(req.header('keyDate'));
            const key = req.header('key');
            let requrl;
            const currentDate = Date.now();
            if (key) {
                if (currentDate > date + 30000) {
                    if (this.currentApp.conf.debug) {
                        console.error('keyDate is obsolete : ' + currentDate + '>' + date + '+ 30000');
                    }
                    next('keyDate is obsolete');
                }
                else {
                    if (req.originalUrl && req.originalUrl.length > 1) {
                        requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
                    }
                    else {
                        requrl = this.currentApp.conf.urlBase;
                    }
                    const url = URL.format(new URL.URL(requrl.trim()), {
                        unicode: true,
                    }).toLowerCase();
                    const newKey = crypto
                        .createHmac('sha256', this.currentApp.conf.secretKey)
                        .update(date + url)
                        .digest('hex');
                    if (newKey == key) {
                        if (!req.ctx) {
                            req.ctx = {};
                        }
                        req.ctx.internalCallValid = true;
                        next();
                    }
                    else {
                        if (this.currentApp.conf.debug) {
                            console.error('key dont match uri : ' + url, date, key, newKey);
                        }
                        next('key dont match uri : ' + requrl);
                    }
                }
            }
            else {
                next('no key');
            }
        };
    }
    get protectUserConnected() {
        return (req, res, next) => {
            if (req.ctx && req.ctx.user) {
                next();
            }
            else {
                next('user not connected');
            }
        };
    }
}
exports.UtilsSecu = UtilsSecu;
