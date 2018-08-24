"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilsSecu_1 = require("./UtilsSecu");
var utilSecu = new UtilsSecu_1.UtilsSecu({ conf: { secretKey: "jgffnFDGijg654FGHdeamlkdfj8egsglkhjBrfohg" } });
var rq = {
    url: "https://services-preprod.daesign.com/front-apps-dbs/collection/Task/startExecDate/$null/=/actionDate/2018-08-24T13:04:51.822Z/</&/1/$limit",
    headers: {
        keyDate: 1535115891822,
    }
};
utilSecu.addHeadersKey(rq);
console.log(rq);
//# sourceMappingURL=testKeys.js.map