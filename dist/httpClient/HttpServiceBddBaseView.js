"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServiceBddBaseView = void 0;
const HttpResult_1 = require("./HttpResult");
const CtxInterpretor_1 = require("../CtxInterpretor");
const mongodb_1 = require("mongodb");
const polonaisInverse_1 = require("./polonaisInverse");
const lodash_1 = require("lodash");
class HttpServiceBddBaseView {
    constructor(conf) {
        this.globalCtxInt = new CtxInterpretor_1.CtxInterpretor(process.env);
        this.collection = new Promise((resolve, reject) => {
            conf.bdd.then(bd => {
                resolve(bd.collection(conf.collectionName));
            });
        });
        this.debug = conf.debug;
        this._class = conf._class;
        this.entity = conf.entity;
        this.collections = conf.collections;
    }
    get(query = '*', headers = {}, aggregate, ctx = {}) {
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
                    if (q == "*") {
                        q = {};
                    }
                    else {
                        q = { _id: new mongodb_1.ObjectId(q) };
                    }
                    ;
                }
                else if (q instanceof mongodb_1.ObjectId) {
                    q = { _id: q };
                }
            }
            ;
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
            meta = {};
            // ajouter les metas de pagination
            ctx.params.mongoFilter = q;
            // meta.offset = 0;
            // meta.pageSize = 1000;
            const pop = [];
            while (stackArr.length > 0) {
                // de nouvelle operation
                let op = stackArr.shift();
                switch (op.name) {
                    case "$pop":
                        // recupérer la class de l'objet
                        // pop.push({propName:op.value});
                        const className = this.entity.getClassNameOfProp(op.value);
                        if (className) {
                            const httpServ = this.collections.getHttpService(className);
                            if (httpServ) {
                                pop.push({ propName: op.value, httpService: httpServ, className: className });
                            }
                        }
                        break;
                    case "$limit":
                        meta.pageSize = op.value;
                        ctx.params.pageSize = op.value;
                        break;
                    case "$skip":
                        meta.offset = op.value;
                        ctx.params.offset = op.value;
                        break;
                    case "$sort":
                        meta.sort = op.value;
                        ctx.params.sort = op.value;
                        break;
                    case "$count":
                        break;
                    default:
                        // code...
                        break;
                }
                ;
            }
            ;
            let filterAgg = [{
                    $match: q
                }
            ];
            if (meta.sort) {
                filterAgg.push({
                    $sort: meta.sort
                });
            }
            if (meta.offset) {
                filterAgg.push({
                    $skip: meta.offset
                });
            }
            if (meta.pageSize) {
                filterAgg.push({
                    $limit: meta.pageSize
                });
            }
            filterAgg = [...filterAgg, ...aggregate];
            let CtxInt = new CtxInterpretor_1.CtxInterpretor(ctx);
            CtxInt.startPatern = "$ctx.";
            // let agg:any[] = CtxInt.updateArrEnv(filterAgg , true) ;
            let agg = filterAgg.slice();
            if (this.debug) {
                meta.mongoquery = agg;
            }
            return this.collection
                .then(collection => {
                const cursor = collection.aggregate(agg, { allowDiskUse: true });
                return Promise.resolve(cursor.toArray())
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
                                arr.forEach(resObj => {
                                    this.getValueOfPath(pathArr.slice(), resObj, ids, proxy);
                                });
                                return popObj.httpService.collection
                                    .then(extCol => {
                                    return extCol.find({ _id: { $in: ids } }).toArray();
                                })
                                    .then((popArr) => {
                                    let objKeyCache = {};
                                    popArr.forEach(res => {
                                        objKeyCache[res._id] = res;
                                    });
                                    let lastPropName = pathArr.pop();
                                    proxy.forEach(objTarget => {
                                        if (lodash_1.isArray(objTarget[lastPropName])) {
                                            if (!objTarget[lastPropName + '_pop']) {
                                                objTarget[lastPropName + '_pop'] = [];
                                            }
                                            objTarget[lastPropName].forEach(element => {
                                                objTarget[lastPropName + '_pop'].push(objKeyCache[element]);
                                            });
                                        }
                                        else {
                                            objTarget[lastPropName + '_pop'] = objKeyCache[objTarget[lastPropName]];
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
                                .catch(err => {
                                console.log(err);
                                return arr;
                            });
                        });
                        return prom;
                    }
                })
                    .then(arr => {
                    meta.nb = arr.length;
                    return new HttpResult_1.HttpResult(arr, this.debug, meta);
                });
            });
        })
            .catch(err => {
            return new HttpResult_1.HttpResult(err, this.debug, meta);
        });
    }
    getValueOfPath(path, obj, ids, proxy) {
        const propName = path.shift();
        if (path.length === 0) {
            proxy.push(obj);
            if (lodash_1.isArray(obj[propName])) {
                obj[propName].forEach(prop => {
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
                obj[propName].forEach(prop => {
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
exports.HttpServiceBddBaseView = HttpServiceBddBaseView;
//# sourceMappingURL=HttpServiceBddBaseView.js.map