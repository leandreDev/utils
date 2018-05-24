"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilsSecu_1 = require("./UtilsSecu");
var utilSecu = new UtilsSecu_1.UtilsSecu({ conf: { secretKey: "BOf5u8FgRaUCe8h3oESxOiksanNEDi6T0AuL9qRRIZs=" } });
var rq = {
    url: "https://core-services-dev.daesign.com/sso-dbs/collection/oidc_account/email/hfdevpro@gmail.com/=",
    headers: {}
};
utilSecu.addHeadersKey(rq);
console.log(rq);
rq.url = "   https://core-services-dev.daesign.com///sso-dbs//collection//oidc_account/email/hfdevpro@gmail.com/=   ";
console.log(rq.url.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://"));
utilSecu.addHeadersKey(rq);
console.log(rq);
//# sourceMappingURL=testKeys.js.map