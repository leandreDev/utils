"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilSecuOAuthSrv = void 0;
const console_1 = require("console");
const request = require("request-promise-native");
class UtilSecuOAuthSrv {
    constructor(currentApp) {
        this.currentApp = currentApp;
        console_1.assert(currentApp.conf.accessTokenUrl, "client_id is not spécified");
        console_1.assert(currentApp.conf.client_id, "client_id is not spécified");
        console_1.assert(currentApp.conf.client_secret, "client_secret is not spécified");
        this.accessTokenUrl = currentApp.conf.accessTokenUrl;
        this.client_id = currentApp.conf.client_id;
        this.client_secret = currentApp.conf.client_secret;
    }
    getToken() {
        if (this.accToken && this.refreshTokenDate >= Date.now()) {
            return Promise.resolve(this.accToken);
        }
        else {
            if (this.promToken) {
                return this.promToken;
            }
            else {
                this.promToken = this.setToken();
                return this.promToken;
            }
        }
    }
    setToken() {
        let rq = {
            url: `${this.accessTokenUrl}?grant_type=client_credentials&client_id=${this.client_id}&client_secret=${this.client_secret}`,
            method: 'post',
            json: true
        };
        this.accToken = null;
        return request(rq)
            .then(token => {
            this.accToken = token;
            this.refreshTokenDate = Date.now() + (token.expires_in * 1000);
            this.promToken = null;
            return token;
        });
    }
    addHeadersKeyProm(rq) {
        return this.getToken()
            .then(token => {
            if (!rq.headers) {
                rq.headers = {};
            }
            rq.headers.Authorization = `Bearer ${token.access_token}`;
            return rq;
        });
    }
}
exports.UtilSecuOAuthSrv = UtilSecuOAuthSrv;
