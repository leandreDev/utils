"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CtxInterpretor_1 = require("./CtxInterpretor");
var test = new CtxInterpretor_1.CtxInterpretor({ body: { toto: "bla", titi: "lolo" }, opt: "erttyy" });
var poi = {
    "aa": "$ENV.opt",
    "zz": "$ENV.body.toto",
    "qq": "$ENV.body.titi"
};
test.updateEnv(poi);
console.log(poi);
//# sourceMappingURL=test.js.map