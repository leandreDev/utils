"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const CtxInterpretor_1 = require("./CtxInterpretor");
const UtilsSecu_1 = require("./UtilsSecu");
const fs = require("fs-extra");
const assert = require("assert");
class ConfLoader {
    static getConf() {
        return new Promise((resolve, reject) => {
            let options = {};
            assert(process.env.CONF_URL, "$env.CONF_URL is not spécified");
            // assert(process.env.CLIENT_ID, "$env.CLIENT_ID is not spécified");
            assert(process.env.SRV_ID, "$env.SRV_ID is not spécified");
            assert(process.env.SECRET, "$env.SECRET is not spécified");
            options.url = process.env.CONF_URL + process.env.SRV_ID;
            options.json = true;
            let secu = new UtilsSecu_1.UtilsSecu({ conf: { secretKey: process.env.SECRET } });
            let contextInterpretor = new CtxInterpretor_1.CtxInterpretor(process.env);
            if (process.env.CONF_URL == "none") {
                try {
                    let val = fs.readJSONSync("./confs/" + process.env.SRV_ID + ".json");
                    let conf = contextInterpretor.updateEnv(val);
                    resolve(val);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                secu.addHeadersKey(options);
                request.get(options).then((val) => {
                    let data;
                    if (val && val.code == 200 && val.response && val.response[0]) {
                        data = val.response[0];
                        fs.ensureDirSync("./confs");
                        fs.writeJSONSync("./confs/" + process.env.SRV_ID + ".json", data);
                    }
                    else {
                        if (val && val.code != 200) {
                            console.log(val);
                        }
                        data = fs.readJSONSync("./confs/" + process.env.SRV_ID + ".json");
                    }
                    let conf = contextInterpretor.updateEnv(data);
                    resolve(data);
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
            }
        });
    }
}
exports.ConfLoader = ConfLoader;
//# sourceMappingURL=ConfLoader.js.map