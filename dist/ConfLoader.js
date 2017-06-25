"use strict";
const request = require("request-promise");
const CtxInterpretor_1 = require("./CtxInterpretor");
const fs = require("fs-extra");
const assert = require("assert");
class ConfLoader {
    static getConf() {
        let options = {};
        assert(process.env.CONF_URL, "$env.CONF_URL is not spécified");
        // assert(process.env.CLIENT_ID, "$env.CLIENT_ID is not spécified");
        assert(process.env.SRV_ID, "$env.SRV_ID is not spécified");
        options.url = process.env.CONF_URL + process.env.SRV_ID;
        options.json = true;
        let contextInterpretor = new CtxInterpretor_1.CtxInterpretor(process.env);
        return new Promise((resolve, reject) => {
            request.get(options).then((val) => {
                if (val && val.code == 200 && val.response && val.response[0]) {
                    val = val.response[0];
                    fs.ensureDirSync("./confs");
                }
                else {
                    val = fs.readJSONSync("./confs/" + process.env.SRV_ID + ".json");
                }
                let conf = contextInterpretor.updateEnv(val);
                resolve(val);
            }).catch(err => {
                try {
                    let val = fs.readJSONSync("./confs/" + process.env.SRV_ID + ".json");
                    let conf = contextInterpretor.updateEnv(val);
                    resolve(val);
                }
                catch (err2) {
                    reject(err);
                }
            });
        });
    }
}
exports.ConfLoader = ConfLoader;
//# sourceMappingURL=ConfLoader.js.map