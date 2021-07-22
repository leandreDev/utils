"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServiceBddBase = void 0;
const mongodb_1 = require("mongodb");
const CtxInterpretor_1 = require("../CtxInterpretor");
const HttpResult_1 = require("./HttpResult");
const lodash_1 = require("lodash");
const polonaisInverse_1 = require("./polonaisInverse");
class HttpServiceBddBase {
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
        this.collections = conf.collections;
    }
    delete(id, headers = {}) {
        let meta;
        return Promise.resolve()
            .then(() => {
            const q = { _id: new mongodb_1.ObjectId(id) };
            if (this._class) {
                q._class = this._class;
            }
            return this.collection.then((collection) => {
                return collection.findOneAndDelete(q).then((result) => {
                    if (this.debug) {
                        meta = {
                            mongoquery: q,
                        };
                    }
                    if (result.ok) {
                        return new HttpResult_1.HttpResult(result.value, this.debug, meta);
                    }
                    else {
                        return new HttpResult_1.HttpResult(new Error(result.lastErrorObject.message), this.debug, meta);
                    }
                });
            });
        })
            .catch((err) => {
            return new HttpResult_1.HttpResult(err, this.debug, meta);
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
                        $and: [{ _class: this._class }, q],
                    };
                }
                else {
                    q._class = this._class;
                }
            }
            // ajouter les metas de pagination
            if (this.debug) {
                meta = {
                    mongoquery: q,
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
                        // recupérer la class de l'objet
                        // pop.push({propName:op.value});
                        // eslint-disable-next-line no-case-declarations
                        const className = this.entity.getClassNameOfProp(op.value);
                        if (className) {
                            const httpServ = this.collections.getHttpService(className);
                            if (httpServ) {
                                pop.push({
                                    propName: op.value,
                                    httpService: httpServ,
                                    className: className,
                                });
                            }
                        }
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
                    projection: headers.$projection,
                });
                return cursor
                    .count(false)
                    .then((count) => {
                    meta.count = count;
                    if (meta.sort) {
                        return cursor
                            .sort(meta.sort)
                            .skip(meta.offset)
                            .limit(meta.pageSize)
                            .toArray();
                    }
                    else {
                        return cursor.skip(meta.offset).limit(meta.pageSize).toArray();
                    }
                })
                    .then((arr) => {
                    // a externaliser pour une meilleur lecture
                    if (pop.length === 0) {
                        return arr;
                    }
                    else {
                        let prom = Promise.resolve(null);
                        pop.forEach((popObj) => {
                            prom = prom
                                .then(() => {
                                const ids = [];
                                const proxy = [];
                                const pathArr = popObj.propName.split('.');
                                arr.forEach((resObj) => {
                                    this.getValueOfPath(pathArr.slice(), resObj, ids, proxy);
                                    // if(_.isArray(resObj[popObj.propName])){
                                    //   resObj[popObj.propName].forEach(element => {
                                    //     if (ids.indexOf(element) === -1) {
                                    //       ids.push(element);
                                    //     }
                                    //   });
                                    // }else{
                                    //   if (ids.indexOf(resObj[popObj.propName]) === -1) {
                                    //     ids.push(resObj[popObj.propName] as ObjectId);
                                    //   }
                                    // }
                                });
                                return popObj.httpService.collection
                                    .then((extCol) => {
                                    return extCol.find({ _id: { $in: ids } }).toArray();
                                })
                                    .then((popArr) => {
                                    const objKeyCache = {};
                                    popArr.forEach((res) => {
                                        objKeyCache[res._id] = res;
                                    });
                                    const lastPropName = pathArr.pop();
                                    proxy.forEach((objTarget) => {
                                        if (lodash_1.isArray(objTarget[lastPropName])) {
                                            if (!objTarget[lastPropName + '_pop']) {
                                                objTarget[lastPropName + '_pop'] = [];
                                            }
                                            objTarget[lastPropName].forEach((element) => {
                                                if (objKeyCache[element] !== null && objKeyCache[element] !== undefined) {
                                                    objTarget[lastPropName + '_pop'].push(objKeyCache[element]);
                                                }
                                            });
                                        }
                                        else {
                                            objTarget[lastPropName + '_pop'] =
                                                objKeyCache[objTarget[lastPropName]];
                                        }
                                    });
                                    // arr.forEach(resObj => {
                                    //   if(_.isArray(resObj[popObj.propName])){
                                    //     if(!resObj[popObj.propName + '_pop']){
                                    //       resObj[popObj.propName + '_pop'] = [] ;
                                    //     }
                                    //     resObj[popObj.propName].forEach(element=>{
                                    //       resObj[popObj.propName + '_pop'].push(objKeyCache[element ]) ;
                                    //     })
                                    //   }else{
                                    //     resObj[popObj.propName + '_pop'] = objKeyCache[resObj[popObj.propName] ] ;
                                    //   }
                                    // });
                                    return arr;
                                });
                            })
                                .catch((err) => {
                                console.error(err);
                                return arr;
                            });
                        });
                        return prom;
                    }
                })
                    .then((arr) => {
                    meta.nb = arr.length;
                    return new HttpResult_1.HttpResult(arr, this.debug, meta);
                });
            });
        })
            .catch((err) => {
            return new HttpResult_1.HttpResult(err, this.debug, meta);
        });
    }
    patch(body, headers = {}, query = '') {
        return Promise.resolve(null)
            .then(() => {
            this.entity.cast(body);
            const err = this.entity.check(body, false, '');
            if (err && err.length > 0) {
                throw new Error(err.join('\n'));
            }
            else {
                return this.collection;
            }
        })
            .then((collection) => {
            const objSet = {};
            const _id = body._id;
            delete body._id;
            Object.keys(body).forEach((key) => {
                if (key.charAt(0) === '$') {
                    // add $push $pull $pop $pullAll
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
            return collection
                .findOneAndUpdate({ _id: _id }, body, { returnOriginal: false })
                .then((objResult) => {
                if (objResult.ok) {
                    return new HttpResult_1.HttpResult(objResult.value, this.debug);
                }
                else {
                    throw new Error(objResult.lastErrorObject.message);
                }
            });
        })
            .catch((err) => {
            return new HttpResult_1.HttpResult(err, this.debug);
        });
    }
    post(body, headers = {}, query = '') {
        // ajouter le cast du body
        return Promise.resolve(null)
            .then(() => {
            this.entity.cast(body);
            const err = this.entity.check(body, true, '');
            if (err && err.length > 0) {
                throw new Error(err.join('\n'));
            }
            else {
                return null;
            }
        })
            .then(() => {
            if (query !== '') {
                return this.get(query).then((findResult) => {
                    if (findResult.response && findResult.response.length > 0) {
                        return findResult;
                    }
                    else {
                        return null;
                    }
                });
            }
            else {
                return null;
            }
        })
            .then((result) => {
            if (result) {
                return result;
            }
            else {
                return this.collection.then((collection) => {
                    return collection.insertOne(body).then((objResult) => {
                        return new HttpResult_1.HttpResult(objResult.ops[0], this.debug);
                    });
                });
            }
        })
            .catch((err) => {
            return new HttpResult_1.HttpResult(err, this.debug);
        });
    }
    put(body, headers = {}, query = '') {
        return Promise.resolve(null)
            .then(() => {
            this.entity.cast(body);
            const err = this.entity.check(body, true, '');
            if (err && err.length > 0) {
                throw new Error(err.join('\n'));
            }
            else {
                return null;
            }
        })
            .then(() => {
            if (query !== '') {
                return this.collection.then((collection) => {
                    return polonaisInverse_1.polonaisInverse(query, this.entity)
                        .then((stackArr) => {
                        let q = stackArr[0];
                        if (q.$and) {
                            const arr = q.$and;
                            arr.unshift({ _id: body._id });
                        }
                        else if (q.$or) {
                            q = {
                                $and: [{ _id: body._id }, q],
                            };
                        }
                        else {
                            q._id = body._id;
                        }
                        return collection.findOneAndReplace(q, body, {
                            returnOriginal: false,
                        });
                    })
                        .then((objResult) => {
                        if (objResult.ok) {
                            // savoire si le doc pastrouvé passe ici ???
                            if (objResult.value === null) {
                                return this.get(`${body._id}`);
                            }
                            else {
                                return new HttpResult_1.HttpResult(objResult.value, this.debug);
                            }
                        }
                        else {
                            throw new Error(objResult.lastErrorObject.message);
                        }
                    });
                });
            }
            else {
                return this.collection.then((collection) => {
                    return collection
                        .findOneAndReplace({ _id: body._id }, body, {
                        returnOriginal: false,
                    })
                        .then((objResult) => {
                        if (objResult.ok) {
                            return new HttpResult_1.HttpResult(objResult.value, this.debug);
                        }
                        else {
                            throw new Error(objResult.lastErrorObject.message);
                        }
                    });
                });
            }
        })
            .catch((err) => {
            return new HttpResult_1.HttpResult(err, this.debug);
        });
    }
    getValueOfPath(path, obj, ids, proxy) {
        const propName = path.shift();
        if (path.length === 0) {
            proxy.push(obj);
            if (lodash_1.isArray(obj[propName])) {
                obj[propName].forEach((prop) => {
                    if (ids.indexOf(prop) === -1) {
                        ids.push(new mongodb_1.ObjectId(prop));
                    }
                });
            }
            else {
                if (ids.indexOf(obj[propName]) === -1) {
                    ids.push(new mongodb_1.ObjectId(obj[propName]));
                }
            }
        }
        else {
            if (lodash_1.isArray(obj[propName])) {
                obj[propName].forEach((prop) => {
                    if (prop) {
                        this.getValueOfPath(path.slice(), prop, ids, proxy);
                    }
                });
            }
            else {
                if (obj[propName]) {
                    this.getValueOfPath(path.slice(), obj[propName], ids, proxy);
                }
            }
        }
    }
}
exports.HttpServiceBddBase = HttpServiceBddBase;
