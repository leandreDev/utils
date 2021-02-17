"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServiceBddAdminBase = void 0;
const HttpResult_1 = require("./HttpResult");
const CtxInterpretor_1 = require("../CtxInterpretor");
const mongodb_1 = require("mongodb");
const polonaisInverse_1 = require("./polonaisInverse");
class HttpServiceBddAdminBase {
    constructor(conf) {
        this.globalCtxInt = new CtxInterpretor_1.CtxInterpretor(process.env);
        this.collection = new Promise((resolve, reject) => {
            conf.bdd.then((bd) => {
                resolve(bd.collection(conf.collectionName));
            });
        });
        this.debug = conf.debug;
        this._class = conf._class;
        this.entity = conf.entity;
    }
    delete(query, headers = {}) {
        let meta;
        return polonaisInverse_1.polonaisInverse(query, this.entity)
            .then((stackArr) => {
            let q;
            if (stackArr.length == 0) {
                q = {};
            }
            else if (stackArr.length > 0) {
                q = stackArr.shift();
                if (typeof q === 'string') {
                    if (q == '*') {
                        q = {};
                    }
                    else {
                        q = { _id: new mongodb_1.ObjectId(q) };
                    }
                }
                else if (q instanceof mongodb_1.ObjectId) {
                    q = { _id: q };
                }
            }
            // averifier dans le cas d'un $and ou $or
            if (this._class) {
                if (q.$and) {
                    const arr = q.$and;
                    arr.unshift({ _class: this._class });
                }
                else if (q.$or) {
                    q = {
                        $and: [{ _class: this._class }, q]
                    };
                }
                else {
                    q._class = this._class;
                }
            }
            // ajouter les metas de pagination
            if (this.debug) {
                meta = {
                    mongoquery: q
                };
            }
            else {
                meta = {};
            }
            if (this._class) {
                q._class = this._class;
            }
            return this.collection.then((collection) => {
                return collection.deleteMany(q).then((result) => {
                    if (this.debug) {
                        meta = {
                            mongoquery: q
                        };
                    }
                    if (result.result.ok) {
                        return this.baseGet(q, { $projection: { _id: 1 } }, meta);
                    }
                    else {
                        throw new Error('delete error');
                    }
                });
            });
        })
            .catch((err) => {
            return new HttpResult_1.HttpResult(err, this.debug, meta);
        });
    }
    patch(body, headers = {}, query = '') {
        let meta;
        return Promise.resolve(null)
            .then(() => {
            this.entity.cast(body);
            const err = this.entity.check(body, false, '');
            if (err && err.length > 0) {
                throw new Error(err.join('\n'));
            }
            else {
                return polonaisInverse_1.polonaisInverse(query, this.entity);
            }
        })
            .then((stackArr) => {
            let q;
            if (stackArr.length == 0) {
                q = {};
            }
            else if (stackArr.length > 0) {
                q = stackArr.shift();
                if (typeof q === 'string') {
                    if (q == '*') {
                        q = {};
                    }
                    else {
                        q = { _id: new mongodb_1.ObjectId(q) };
                    }
                }
                else if (q instanceof mongodb_1.ObjectId) {
                    q = { _id: q };
                }
            }
            // averifier dans le cas d'un $and ou $or
            if (this._class) {
                if (q.$and) {
                    const arr = q.$and;
                    arr.unshift({ _class: this._class });
                }
                else if (q.$or) {
                    q = {
                        $and: [{ _class: this._class }, q]
                    };
                }
                else {
                    q._class = this._class;
                }
            }
            // ajouter les metas de pagination
            if (this.debug) {
                meta = {
                    mongoquery: q
                };
            }
            else {
                meta = {};
            }
            if (this._class) {
                q._class = this._class;
            }
            const objSet = {};
            Object.keys(body).forEach((key) => {
                if (key.charAt(0) === '$') {
                    if (key === '$addToSet') {
                        Object.keys(body.$addToSet).forEach((subkey) => {
                            if (subkey === '$each') {
                                body.$addToSet[subkey].$each = body.$addToSet[subkey].$each.map((val) => {
                                    return this.entity.castQueryParam(subkey.replace(/\.\$(\[[a-zA-Z_0-9]*\])*./gi, ''), val);
                                });
                            }
                            else {
                                body.$addToSet[subkey] = this.entity.castQueryParam(subkey.replace(/\.\$(\[[a-zA-Z_0-9]*\])*./gi, ''), body.$addToSet[subkey]);
                            }
                        });
                    }
                    else if (key === '$inc') {
                        Object.keys(body.$inc).forEach((subkey) => {
                            body.$inc[subkey] = new Number(body.$inc[subkey]).valueOf();
                        });
                    }
                }
                else {
                    objSet[key] = body[key];
                    body.$set = objSet;
                    delete body[key];
                }
            });
            return this.collection.then((collection) => {
                return collection.updateMany(q, body).then((objResult) => {
                    if (objResult.result.ok) {
                        return this.baseGet(q, { $projection: { _id: 1 } }, meta);
                    }
                    else {
                        throw new Error('update error');
                    }
                });
            });
        })
            .catch((err) => {
            return new HttpResult_1.HttpResult(err, this.debug);
        });
    }
    get(query = '*', headers = {}) {
        let meta;
        return polonaisInverse_1.polonaisInverse(query, this.entity)
            .then((stackArr) => {
            let q;
            if (stackArr.length == 0) {
                q = {};
            }
            else if (stackArr.length > 0) {
                q = stackArr.shift();
                if (typeof q === 'string') {
                    if (q == '*') {
                        q = {};
                    }
                    else {
                        q = { _id: new mongodb_1.ObjectId(q) };
                    }
                }
                else if (q instanceof mongodb_1.ObjectId) {
                    q = { _id: q };
                }
            }
            // averifier dans le cas d'un $and ou $or
            if (this._class) {
                if (q.$and) {
                    const arr = q.$and;
                    arr.unshift({ _class: this._class });
                }
                else if (q.$or) {
                    q = {
                        $and: [{ _class: this._class }, q]
                    };
                }
                else {
                    q._class = this._class;
                }
            }
            // ajouter les metas de pagination
            if (this.debug) {
                meta = {
                    mongoquery: q
                };
            }
            else {
                meta = {};
            }
            meta.offset = 0;
            meta.pageSize = 1000;
            const pop = [];
            while (stackArr.length > 0) {
                // de nouvelle operation
                const op = stackArr.shift();
                switch (op.name) {
                    case '$pop':
                        pop.push(op.value);
                        break;
                    case '$limit':
                        meta.pageSize = op.value;
                        break;
                    case '$skip':
                        meta.offset = op.value;
                        break;
                    case '$sort':
                        meta.sort = op.value;
                        break;
                    case '$count':
                        break;
                    default:
                        // code...
                        break;
                }
            }
            return this.collection.then((collection) => {
                const cursor = collection.find(q, {
                    projection: headers.$projection
                });
                return cursor
                    .count(false)
                    .then((count) => {
                    meta.count = count;
                    if (meta.sort) {
                        return cursor
                            .skip(meta.offset)
                            .limit(meta.pageSize)
                            .sort(meta.sort)
                            .toArray();
                    }
                    else {
                        return cursor.skip(meta.offset).limit(meta.pageSize).toArray();
                    }
                })
                    .then((arr) => {
                    meta.nb = arr.length;
                    // ajouter la gestion des pop
                    return new HttpResult_1.HttpResult(arr, this.debug, meta);
                });
            });
        })
            .catch((err) => {
            return new HttpResult_1.HttpResult(err, this.debug, meta);
        });
    }
    baseGet(q, headers = {}, meta = {}) {
        return this.collection.then((collection) => {
            const cursor = collection.find(q, {
                projection: headers.$projection
            });
            return cursor
                .count(false)
                .then((count) => {
                meta.count = count;
                if (!meta.offset) {
                    meta.offset = 0;
                }
                if (!meta.pageSize) {
                    meta.pageSize = 1000;
                }
                if (meta.sort) {
                    return cursor
                        .skip(meta.offset)
                        .limit(meta.pageSize)
                        .sort(meta.sort)
                        .toArray();
                }
                else {
                    return cursor.skip(meta.offset).limit(meta.pageSize).toArray();
                }
            })
                .then((arr) => {
                meta.nb = arr.length;
                // ajouter la gestion des pop
                return new HttpResult_1.HttpResult(arr, this.debug, meta);
            });
        });
    }
}
exports.HttpServiceBddAdminBase = HttpServiceBddAdminBase;
