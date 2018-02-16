"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CtxInterpretor_1 = require("./CtxInterpretor");
var test = new CtxInterpretor_1.CtxInterpretor({ body: { toto: "bla", titi: "$ENV.opt$$" }, opt: "erttyy", num: 32 });
var poi = {
    "aa": "$ENV.opt$$",
    "zz": "$ENV.body.toto$$uuuu",
    "qq": "qzsazqs$ENV.body.titi$$wxcvdfd",
    "aas": "$ENV.opt",
    "aax": "www$ENV.opt",
    "aasss": "www$ENV.optsdsds$$dsds",
    "aasssq": "$ENV.optsdsds$$dsds",
    "aasssx": "www$ENV.optsdsds",
    "aasssw": "www$ENV.optsdsds$$dsdsdsd$ENV.opt",
    "ooo": "$ENV.num",
    "ooo2": "$ENV.num$$dsqdsq",
    "ooo3": "dsqdsq$ENV.num$$dsqdsq",
    "ooo4": "dsqdsq$ENV.num",
};
test.updateEnv(poi);
console.log(poi);
//# sourceMappingURL=test.js.map