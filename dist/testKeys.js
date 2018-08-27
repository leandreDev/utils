"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilsSecu_1 = require("./UtilsSecu");
// BOf5u8FgRaUCe8h3oESxOiksanNEDi6T0AuL9qRRIZs='
// jgffnFDGijg654FGHdeamlkdfj8egsglkhjBrfohg
var utilSecu = new UtilsSecu_1.UtilsSecu({ conf: { secretKey: "BOf5u8FgRaUCe8h3oESxOiksanNEDi6T0AuL9qRRIZs=" } });
var rq = {
    url: "https://services-dev.daesign.com/front-apps-dbs/collection/Task/startExecDate/$null/=/actionDate/Mon%20Aug%2027%202018%2013:46:25%20GMT+0000%20(UTC)/$date/</&/1/$limit",
    headers: {
        keyDate: 1535377585330,
    }
};
utilSecu.addHeadersKey(rq);
console.log(rq);
//# sourceMappingURL=testKeys.js.map