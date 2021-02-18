import { IHttpResult } from './IHttpResult';
import { HttpResult } from './HttpResult';
import { IMeta } from './IMeta';
import { IBase } from '../lib/IBase';
import { CtxInterpretor } from '../CtxInterpretor';
import { Db, Collection, ObjectId, Cursor, AggregationCursor } from 'mongodb';
import { Entity } from './Entity';
import { IHttpServiceBaseView } from './IHttpServiceBaseView';
import { HttpServiceBddBase } from './HttpServiceBddBase';
import { polonaisInverse } from './polonaisInverse';
import { isArray } from 'lodash';

export class HttpServiceBddBaseView<T extends IBase>
  implements IHttpServiceBaseView<T> {
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
    new (): Entity;
    cast(obj: any);
    check(target: any, isCompleteObj: boolean, path: string): string[];
    castQueryParam(path: string, value: any): any;
    getClassNameOfProp(path: string): string;
  };
  protected debug: boolean;
  protected _class: string;
  protected collection: Promise<Collection>;
  protected url: string;

  protected globalCtxInt: CtxInterpretor = new CtxInterpretor(process.env);

  public get(
    query = '*',
    headers: any = {},
    aggregate: any[],
    ctx: any = {}
  ): Promise<IHttpResult<T>> {
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

        meta = {};
        // ajouter les metas de pagination
        ctx.params.mongoFilter = q;
        // meta.offset = 0;
        // meta.pageSize = 1000;
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
                    className: className
                  });
                }
              }
              break;
            case '$limit':
              meta.pageSize = op.value;
              ctx.params.pageSize = op.value;
              break;
            case '$skip':
              meta.offset = op.value;
              ctx.params.offset = op.value;
              break;
            case '$sort':
              meta.sort = op.value;
              ctx.params.sort = op.value;
              break;
            case '$count':
              break;
            default:
              // code...
              break;
          }
        }
        let filterAgg: any = [
          {
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
        const CtxInt: CtxInterpretor = new CtxInterpretor(ctx);
        CtxInt.startPatern = '$ctx.';
        // let agg:any[] = CtxInt.updateArrEnv(filterAgg , true) ;
        const agg: any[] = filterAgg.slice();
        if (this.debug) {
          meta.mongoquery = agg;
        }
        return this.collection.then((collection) => {
          const cursor: AggregationCursor = collection.aggregate(agg, {
            allowDiskUse: true
          });
          return Promise.resolve(cursor.toArray())
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
                      });

                      return popObj.httpService.collection
                        .then((extCol) => {
                          return extCol.find({ _id: { $in: ids } }).toArray();
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
                                objTarget[lastPropName + '_pop'].push(
                                  objKeyCache[element]
                                );
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
                      console.log(err);
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
