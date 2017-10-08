"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const url = require("url");
class UtilsSecu {
    constructor(currentApp) {
        this.currentApp = currentApp;
        this.chekInternalMidelWare = (req, res, next) => {
            let date = req.header('date');
            let key = req.header('key');
            var requrl;
            if (key) {
                requrl = url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    pathname: req.originalUrl,
                });
                var newKey = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                    .update(date + requrl)
                    .digest('hex');
                if (newKey == key) {
                    req.internalCallValid = true;
                    next();
                }
                else {
                    next("key dont match uri : " + requrl);
                }
            }
            else {
                next();
            }
        };
        this.protectInternalMidelWare = (req, res, next) => {
            let date = req.header('date');
            let key = req.header('key');
            var requrl;
            if (key) {
                requrl = url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    pathname: req.originalUrl,
                });
                var newKey = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                    .update(date + requrl)
                    .digest('hex');
                if (newKey == key) {
                    req.internalCallValid = true;
                    next();
                }
                else {
                    next("key dont match uri : " + requrl);
                }
            }
            else {
                next("no key");
            }
        };
    }
    addHeadersKey(rq) {
        var date = Date.now();
        rq.headers = {
            'date': date,
            'key': crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                .update(date + rq.url)
                .digest('hex')
        };
    }
}
exports.UtilsSecu = UtilsSecu;
//# sourceMappingURL=UtilsSecu.js.map