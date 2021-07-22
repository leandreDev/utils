import { Collection, Cursor, Db, ObjectId } from 'mongodb';

import { CtxInterpretor } from '../CtxInterpretor';
import { Entity } from './Entity';
import { HttpResult } from './HttpResult';
import { IBase } from '../lib/IBase';
import { IHttpResult } from './IHttpResult';
import { IHttpServiceAdminBase } from './IHttpServiceAdminBase';
import { IMeta } from './IMeta';
import { polonaisInverse } from './polonaisInverse';

export class HttpServiceBddAdminBase<T extends IBase>
  implements IHttpServiceAdminBase<T> {
  constructor(conf: {
    bdd: Promise<Db>;
    collectionName: string;
    debug: boolean;
    _class?: string;
    entity: {
      new (): Entity;
      cast(obj: any);
      check(target: any, isCompleteObj: boolean, path: string): string[];
      castQueryParam(path: string, value: any): any;
    };
  }) {
    this.collection = new Promise((resolve, reject) => {
      conf.bdd.then((bd) => {
        resolve(bd.collection(conf.collectionName));
      });
    });
    this.debug = conf.debug;
    this._class = conf._class;
    this.entity = conf.entity;
  }

  protected entity: {
    new (): Entity;
    cast(obj: any);
    check(target: any, isCompleteObj: boolean, path: string): string[];
    castQueryParam(path: string, value: any): any;
  };
  protected debug: boolean;
  protected _class: string;
  protected collection: Promise<Collection>;
  protected url: string;

  protected globalCtxInt: CtxInterpretor = new CtxInterpretor(process.env);

  public delete(query: string, headers: any = {}): Promise<IHttpResult<T>> {
    let meta: IMeta;
    return polonaisInverse(query, this.entity)
      .then((stackArr) => {
        let q: any;
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
              $and: [{ _class: this._class }, q]
            };
          } else {
            q._class = this._class;
          }
        }
        // ajouter les metas de pagination
        if (this.debug) {
          meta = {
            mongoquery: q
          };
        } else {
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
            } else {
              throw new Error('delete error');
            }
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
    let meta: IMeta;
    return Promise.resolve(null)
      .then(() => {
        this.entity.cast(body);
        const err: string[] = this.entity.check(body, false, '');
        if (err && err.length > 0) {
          throw new Error(err.join('\n'));
        } else {
          return polonaisInverse(query, this.entity);
        }
      })
      .then((stackArr) => {
        let q: any;
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
              $and: [{ _class: this._class }, q]
            };
          } else {
            q._class = this._class;
          }
        }
        // ajouter les metas de pagination
        if (this.debug) {
          meta = {
            mongoquery: q
          };
        } else {
          meta = {};
        }
        if (this._class) {
          q._class = this._class;
        }
        const objSet: any = {};
        Object.keys(body).forEach((key: string) => {
          if (key.charAt(0) === '$') {
            if (key === '$addToSet') {
              Object.keys(body.$addToSet).forEach((subkey: string) => {
                if (subkey === '$each') {
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
        return this.collection.then((collection) => {
          return collection.updateMany(q, body).then((objResult) => {
            if (objResult.result.ok) {
              return this.baseGet(q, { $projection: { _id: 1 } }, meta);
            } else {
              throw new Error('update error');
            }
          });
        });
      })
      .catch((err) => {
        return new HttpResult<T>(err, this.debug);
      });
  }

  public get(query = '*', headers: any = {}): Promise<IHttpResult<T>> {
    let meta: IMeta;
    return polonaisInverse(query, this.entity)
      .then((stackArr) => {
        let q: any;
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
              $and: [{ _class: this._class }, q]
            };
          } else {
            q._class = this._class;
          }
        }
        // ajouter les metas de pagination
        if (this.debug) {
          meta = {
            mongoquery: q
          };
        } else {
          meta = {};
        }
        meta.offset = 0;
        meta.pageSize = 1000;
        const pop: string[] = [];
        while (stackArr.length > 0) {
          // de nouvelle operation
          const op: any = stackArr.shift();
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
          const cursor: Cursor = collection.find(q, {
            projection: headers.$projection
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
              } else {
                return cursor.skip(meta.offset).limit(meta.pageSize).toArray();
              }
            })
            .then((arr) => {
              meta.nb = arr.length;
              // ajouter la gestion des pop
              return new HttpResult<T>(arr, this.debug, meta);
            });
        });
      })
      .catch((err) => {
        return new HttpResult<T>(err, this.debug, meta);
      });
  }

  baseGet(q: any, headers: any = {}, meta: any = {}): Promise<IHttpResult<T>> {
    return this.collection.then((collection) => {
      const cursor: Cursor = collection.find(q, {
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
              .sort(meta.sort)
              .skip(meta.offset)
              .limit(meta.pageSize)
              .toArray();
          } else {
            return cursor.skip(meta.offset).limit(meta.pageSize).toArray();
          }
        })
        .then((arr) => {
          meta.nb = arr.length;
          // ajouter la gestion des pop
          return new HttpResult<T>(arr, this.debug, meta);
        });
    });
  }
}
