"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CtxInterpretor_1 = require("./CtxInterpretor");
var test = new CtxInterpretor_1.CtxInterpretor({ body: { toto: "bla", titi: "lolo" }, opt: "erttyy" });
var poi = {
    "aa": "$ENV.opt$$",
    "zz": "$ENV.body.toto$$uuuu",
    "qq": "qzsazqs$ENV.body.titi$$wxcvdfd",
    "aas": "$ENV.opt",
    "aax": "www$ENV.opt",
};
test.updateEnv(poi);
console.log(poi);
//# sourceMappingURL=test.js.map