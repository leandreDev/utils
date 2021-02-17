"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfLoader = void 0;
const request = require("request-promise-native");
const CtxInterpretor_1 = require("./CtxInterpretor");
const UtilsSecu_1 = require("./UtilsSecu");
const fs = require("fs-extra");
const assert = require("assert");
class ConfLoader {
    static getConf() {
        return new Promise((resolve, reject) => {
            const options = {};
            assert(process.env.CONF_URL, '$env.CONF_URL is not spécified');
            // assert(process.env.CLIENT_ID, "$env.CLIENT_ID is not spécified");
            assert(process.env.SRV_ID, '$env.SRV_ID is not spécified');
            assert(process.env.SECRET, '$env.SECRET is not spécified');
            options.url = process.env.CONF_URL + process.env.SRV_ID;
            options.json = true;
            const secu = new UtilsSecu_1.UtilsSecu({
                conf: { secretKey: process.env.SECRET, debug: false }
            });
            const contextInterpretor = new CtxInterpretor_1.CtxInterpretor(process.env);
            if (process.env.CONF_URL == 'none') {
                try {
                    const val = fs.readJSONSync('./confs/' + process.env.SRV_ID + '.json');
                    const conf = contextInterpretor.updateEnv(val);
                    resolve(val);
                }
                catch (err) {
                    console.log('offline confloader error read JSON', err);
                    reject(err);
                }
            }
            else {
                //
                let tempConf;
                if (fs.existsSync('./confs/' + process.env.SRV_ID + '.json')) {
                    tempConf = fs.readJSONSync('./confs/' + process.env.SRV_ID + '.json');
                    if (tempConf.loadConfAfter) {
                        ConfLoader.loadConf().catch((err) => {
                            console.log(err);
                        });
                        resolve(tempConf);
                    }
                    else {
                        ConfLoader.loadConf().then(resolve).catch(reject);
                    }
                }
                else {
                    ConfLoader.loadConf().then(resolve).catch(reject);
                }
            }
        });
    }
    static loadConf() {
        const options = {};
        options.url = process.env.CONF_URL + process.env.SRV_ID;
        options.json = true;
        const secu = new UtilsSecu_1.UtilsSecu({
            conf: { secretKey: process.env.SECRET, debug: false }
        });
        const contextInterpretor = new CtxInterpretor_1.CtxInterpretor(process.env);
        secu.addHeadersKey(options);
        return Promise.resolve(request
            .get(options)
            .then((val) => {
            let data;
            if (val && val.code == 200 && val.response && val.response[0]) {
                data = val.response[0];
                fs.ensureDirSync('./confs');
                fs.writeJSONSync('./confs/' + process.env.SRV_ID + '.json', data, {
                    spaces: 2
                });
            }
            else {
                if (val && val.code != 200) {
                    console.log('online confloader error read JSON', val, options.url);
                }
                data = fs.readJSONSync('./confs/' + process.env.SRV_ID + '.json');
            }
            const conf = contextInterpretor.updateEnv(data);
            return data;
        })
            .catch((err) => {
            try {
                console.log('confloader error on JSON ', err);
                const val = fs.readJSONSync('./confs/' + process.env.SRV_ID + '.json');
                const conf = contextInterpretor.updateEnv(val);
                return val;
            }
            catch (err2) {
                console.log('confloader fatal error ', err2);
                throw err;
            }
        }));
    }
}
exports.ConfLoader = ConfLoader;
