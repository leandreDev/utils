"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class UtilsSecu {
    constructor(currentApp) {
        this.currentApp = currentApp;
    }
    addHeadersKey(rq) {
        var date = Date.now();
        rq.headers = {
            'date': date,
            'key': crypto.createHmac('sha256', this.currentApp.secretKey)
                .update(date + rq.url)
                .digest('hex')
        };
    }
}
exports.UtilsSecu = UtilsSecu;
//# sourceMappingURL=UtilsSecu.js.map