import { Collection, Cursor, Db, ObjectId } from 'mongodb';

import { CtxInterpretor } from '../CtxInterpretor';
import { Entity } from './Entity';
import { HttpResult } from './HttpResult';
import { IBase } from '../lib/IBase';
import { IHttpResult } from './IHttpResult';
import { IHttpServiceBase } from './IHttpServiceBase';
import { IMeta } from './IMeta';
import { isArray } from 'lodash';
import { polonaisInverse } from './polonaisInverse';

// comment
export class HttpServiceBddBase<T extends IBase>
  implements IHttpServiceBase<T> {
  constructor(conf: {
    bdd: Promise<Db>;
    collectionName: string;
    debug: boolean;
    _class?: string;
    entity: {
      new(): Entity;
      cast(obj: any);
      check(target: any, isCompleteObj: boolean, path: string): string[];
      castQueryParam(path: string, value: any): any;
      getClassNameOfProp(path: string): string;
    };
    collections: { getHttpService(colName: string): HttpServiceBddBase<IBase> };
  }) {
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

  public collections: {
    getHttpService(colName: string): HttpServiceBddBase<IBase>;
  };
  protected entity: {
    new(): Entity;
    cast(obj: any);
    check(target: any, isCompleteObj: boolean, path: string): string[];
    castQueryParam(path: string, value: any): any;
    getClassNameOfProp(path: string): string;
  };
  protected debug: boolean;
  protected _class: string;
  public collection: Promise<Collection>;
  protected url: string;

  protected globalCtxInt: CtxInterpretor = new CtxInterpretor(process.env);

  public delete(id: string, headers: any = {}): Promise<IHttpResult<T>> {
    let meta: IMeta;
    return Promise.resolve()
      .then(() => {
        const q: any = { _id: new ObjectId(id) };
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
              return new HttpResult<T>(result.value, this.debug, meta);
            } else {
              return new HttpResult<T>(
                new Error(result.lastErrorObject.message),
                this.debug,
                meta
              );
            }
          });
        });
      })
      .catch((err) => {
        return new HttpResult<T>(err, this.debug, meta);
      });
  }

  protected stackArrToMongoQuery(stackArr: any[]): any {
    let q: any;
    let meta: IMeta;
    if (stackArr.length == 0) {
      q = {};
    } else if (stackArr.length > 0) {
      q = stackArr.shift();
      if (typeof q === 'string') {
        if (q == '*') {
          q = {};
        } else {
          q = { _id: new ObjectId(q) };
        }
      } else if (q instanceof ObjectId) {
        q = { _id: q };
      }
    }
    // averifier dans le cas d'un $and ou $or
    if (this._class) {
      if (q.$and) {
        const arr: any[] = q.$and;
        arr.unshift({ _class: this._class });
      } else if (q.$or) {
        q = {
          $and: [{ _class: this._class }, q],
        };
      } else {
        q._class = this._class;
      }
    }
    // ajouter les metas de pagination
    if (this.debug) {
      meta = {
        mongoquery: q,
      };
    } else {
      meta = {};
    }
    meta.offset = 0;
    meta.pageSize = 1000;
    const pop: {
      propName: string;
      httpService: HttpServiceBddBase<IBase>;
      className: string;
    }[] = [];
    while (stackArr.length > 0) {
      // de nouvelle operation
      const op: any = stackArr.shift();
      switch (op.name) {
        case '$pop':
          // recupérer la class de l'objet
          // pop.push({propName:op.value});
          // eslint-disable-next-line no-case-declarations
          const className: string = this.entity.getClassNameOfProp(
            op.value
          );
          if (className) {
            const httpServ: HttpServiceBddBase<IBase> = this.collections.getHttpService(
              className
            );
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
    return { q: q, meta: meta, pop: pop };
  }
  public get(query = '*', headers: any = {}): Promise<IHttpResult<T>> {
    let meta: IMeta;
    return polonaisInverse(query, this.entity)
      .then((stackArr) => {
        return this.stackArrToMongoQuery(stackArr)
      })
      .then((queryMongo) => {
        const q = queryMongo.q;
        meta = queryMongo.meta;
        const pop: {
          propName: string;
          httpService: HttpServiceBddBase<IBase>;
          className: string;
        }[] = queryMongo.pop;
        const proj = {
          projection: {
            ...headers.$projection
          }
        };
        Object.keys(proj.projection).forEach(prop => {
          if (prop.endsWith('_pop')) {
            delete proj.projection[prop];
          }
        })

        return this.collection.then((collection) => {
          const cursor: Cursor = collection.find(q, proj);
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
              } else {
                return cursor.skip(meta.offset).limit(meta.pageSize).toArray();
              }
            })
            .then((arr) => {
              // a externaliser pour une meilleur lecture
              if (pop.length === 0) {
                return arr;
              } else {
                let prom: Promise<any[]> = Promise.resolve(null);
                pop.forEach((popObj) => {
                  prom = prom
                    .then(() => {
                      const ids: ObjectId[] = [];
                      const proxy: any[] = [];
                      const pathArr: string[] = popObj.propName.split('.');

                      arr.forEach((resObj) => {
                        this.getValueOfPath(
                          pathArr.slice(),
                          resObj,
                          ids,
                          proxy
                        );
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
                      let popProjection: any = {};
                      const keyName: string = popObj.propName + '_pop';
                      if (headers && headers.$projection && headers.$projection[keyName]) {
                        const keyValue: any = headers.$projection[keyName];
                        popProjection = { projection: keyValue };
                      }
                      return popObj.httpService.collection
                        .then((extCol) => {
                          return extCol.find({ _id: { $in: ids } }, popProjection).toArray();
                        })
                        .then((popArr) => {
                          const objKeyCache: any = {};
                          popArr.forEach((res) => {
                            objKeyCache[res._id] = res;
                          });
                          const lastPropName: string = pathArr.pop();
                          proxy.forEach((objTarget) => {
                            if (isArray(objTarget[lastPropName])) {
                              if (!objTarget[lastPropName + '_pop']) {
                                objTarget[lastPropName + '_pop'] = [];
                              }
                              objTarget[lastPropName].forEach((element) => {
                                if (objKeyCache[element] !== null && objKeyCache[element] !== undefined) {
                                  objTarget[lastPropName + '_pop'].push(
                                    objKeyCache[element]
                                  );
                                }

                              });
                            } else {
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
                          return arr as any[];
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
              return new HttpResult<T>(arr, this.debug, meta);
            });
        });
      })
      .catch((err) => {
        return new HttpResult<T>(err, this.debug, meta);
      });
  }

  public patch(
    body: any,
    headers: any = {},
    query = ''
  ): Promise<IHttpResult<T>> {
    let q;
    let meta;
    let pop: {
      propName: string;
      httpService: HttpServiceBddBase<IBase>;
      className: string;
    }[]
    return polonaisInverse(query, this.entity)
      .then((stackArr) => {
        return this.stackArrToMongoQuery(stackArr)
      })
      .then((queryMongo) => {
        q = queryMongo.q;
        meta = queryMongo.meta;
        pop = queryMongo.pop;
        this.entity.cast(body);
        const err: string[] = this.entity.check(body, false, '');
        if (err && err.length > 0) {
          throw new Error(err.join('\n'));
        } else {
          return this.collection;
        }
      })
      .then((collection) => {
        const objSet: any = {};
        const _id = body._id;
        delete body._id;
        Object.keys(body).forEach((key: string) => {
          if (key.charAt(0) === '$') {
            // add $push $pull $pop $pullAll
            if (key === '$addToSet') {
              Object.keys(body.$addToSet).forEach((subkey: string) => {
                if (body.$addToSet[subkey].$each) {
                  body.$addToSet[subkey].$each = body.$addToSet[
                    subkey
                  ].$each.map((val) => {
                    return this.entity.castQueryParam(
                      subkey.replace(/\.\$(\[[a-zA-Z_0-9]*\])*./gi, ''),
                      val
                    );
                  });
                } else {
                  body.$addToSet[subkey] = this.entity.castQueryParam(
                    subkey.replace(/\.\$(\[[a-zA-Z_0-9]*\])*./gi, ''),
                    body.$addToSet[subkey]
                  );
                }
              });
            } else if (key === '$inc') {
              Object.keys(body.$inc).forEach((subkey: string) => {
                body.$inc[subkey] = new Number(body.$inc[subkey]).valueOf();
              });
            }
          } else {
            objSet[key] = body[key];
            body.$set = objSet;
            delete body[key];
          }
        });
        q._id = _id;
        return collection
          .findOneAndUpdate(q, body, { returnOriginal: false })
          .then((objResult) => {
            if (objResult.ok) {
              return new HttpResult(objResult.value, this.debug);
            } else {
              throw new Error(objResult.lastErrorObject.message);
            }
          });
      })
      .catch((err) => {
        return new HttpResult<T>(err, this.debug);
      });
  }

  public post(body: T, headers: any = {}, query = ''): Promise<IHttpResult<T>> {
    // ajouter le cast du body
    return Promise.resolve(null)
      .then(() => {
        this.entity.cast(body);
        const err: string[] = this.entity.check(body, true, '');
        if (err && err.length > 0) {
          throw new Error(err.join('\n'));
        } else {
          return null;
        }
      })
      .then(() => {
        if (query !== '') {
          return this.get(query).then((findResult) => {
            if (findResult.response && findResult.response.length > 0) {
              return findResult;
            } else {
              return null;
            }
          });
        } else {
          return null;
        }
      })
      .then((result) => {
        if (result) {
          return result;
        } else {
          return this.collection.then((collection) => {
            return collection.insertOne(body).then((objResult) => {
              return new HttpResult(objResult.ops[0], this.debug);
            });
          });
        }
      })
      .catch((err) => {
        return new HttpResult<T>(err, this.debug);
      });
  }

  public put(body: T, headers: any = {}, query = ''): Promise<IHttpResult<T>> {
    return Promise.resolve(null)
      .then(() => {
        this.entity.cast(body);
        const err: string[] = this.entity.check(body, true, '');
        if (err && err.length > 0) {
          throw new Error(err.join('\n'));
        } else {
          return null;
        }
      })
      .then(() => {
        if (query !== '') {
          return this.collection.then((collection) => {
            return polonaisInverse(query, this.entity)
              .then((stackArr) => {
                let q: any = stackArr[0];
                if (q.$and) {
                  const arr: any[] = q.$and;
                  arr.unshift({ _id: body._id });
                } else if (q.$or) {
                  q = {
                    $and: [{ _id: body._id }, q],
                  };
                } else {
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
                  } else {
                    return new HttpResult(objResult.value, this.debug);
                  }
                } else {
                  throw new Error(objResult.lastErrorObject.message);
                }
              });
          });
        } else {
          return this.collection.then((collection) => {
            return collection
              .findOneAndReplace({ _id: body._id }, body, {
                returnOriginal: false,
              })
              .then((objResult) => {
                if (objResult.ok) {
                  return new HttpResult(objResult.value, this.debug);
                } else {
                  throw new Error(objResult.lastErrorObject.message);
                }
              });
          });
        }
      })
      .catch((err) => {
        return new HttpResult<T>(err, this.debug);
      });
  }

  public getValueOfPath(
    path: string[],
    obj: any,
    ids: ObjectId[],
    proxy: any[]
  ) {
    const propName: string = path.shift();
    if (path.length === 0) {
      proxy.push(obj);
      if (isArray(obj[propName])) {
        obj[propName].forEach((prop) => {
          if (ids.indexOf(prop) === -1) {
            ids.push(new ObjectId(prop));
          }
        });
      } else {
        if (ids.indexOf(obj[propName]) === -1) {
          ids.push(new ObjectId(obj[propName]));
        }
      }
    } else {
      if (isArray(obj[propName])) {
        obj[propName].forEach((prop) => {
          if (prop) {
            this.getValueOfPath(path.slice(), prop, ids, proxy);
          }
        });
      } else {
        if (obj[propName]) {
          this.getValueOfPath(path.slice(), obj[propName], ids, proxy);
        }
      }
    }
  }
}
