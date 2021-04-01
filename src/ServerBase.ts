let pkg_lock;
let pkg;
try {
  pkg = require(__dirname + '/../../../package.json');
  pkg_lock = require(__dirname + '/../../../package-lock.json');
} catch (error) {console.error(error)}

import * as express from 'express';
import * as request from 'request-promise-native';
import { ConfLoader } from './ConfLoader';
import { UtilsSecu } from './UtilsSecu';
import * as jose from 'node-jose';
import * as _ from 'lodash';
import * as Util from 'util';
import * as http from 'http';
import * as fs from 'fs-extra';
import { RequestContext } from './RequestContext';
import { IApplicationConfiguration } from './IApplicationConfiguration';

export class ServerBase {
  public currentApp: IApplicationConfiguration;
  public app: any;
  public secu: UtilsSecu;
  public server: http.Server;

  constructor() {
    this.currentApp = {};
    this.init()
      .then(() => {
        this.app.use((err, req, res, next) => {
          const obj = this.toErrRes(err);
          res.send(obj);
        });
        this.startHttpServer();
      })
      .catch((err) => {
        console.error(err);
      });

    process.on('message', this.parentProcessHandler);
  }

  protected get parentProcessHandler() {
    return (msg) => {
      console.info('parentMessage ', msg);
      switch (msg) {
        case 'reloadConf':
          this.reloadConfPromise()
            .then((conf) => {
              this.currentApp.conf = conf;
            })
            .catch((err) => {
              console.error(err);
            });
          break;
      }
    };
  }

  protected sendToParentProcess(msg) {
    process.send(msg);
  }

  protected startHttpServer() {
    this.server = this.app.listen(this.currentApp.conf.port, () => {
      console.info('Server listen on port ' + this.currentApp.conf.port);
    });
    this.currentApp.server = this.server;
  }
  protected init(): Promise<any> {
    const prom = this.loadConfPromise()
      .then((conf) => {
        this.currentApp.conf = conf;
        if (this.currentApp.conf.debug) {
          console.info(this.currentApp);
        }
        this.app = express();
        console.info('start app');
        this.currentApp.express = this.app;
        this.currentApp.toErrRes = this.toErrRes;
        this.currentApp.toJsonRes = this.toJsonRes;
        this.secu = new UtilsSecu(this.currentApp);
        this.currentApp.secu = this.secu;
        this.app
          .use((req, res, next) => {
            this.headers.forEach((data) => {
              res.header(data[0], data[1]);
            });

            next();
          })
          .use((req, res, next) => {
            if (this.currentApp.conf.debug) {
              console.info(req.method + ',' + req.url);
            }
            next();
          })
          .use(this.addCtx, this.secu.chekInternalMidelWare, this.checkJWT);
        return this.currentApp;
      })
      .then(() => {
        return this.loadDepConfPromise();
      })
      .then((data) => {
        this.app
          .use(this.hasRight)
          .get('/', (req, res) => {
            res.send({ online: true });
          })
          .get('/version', (req, res) => {
            res.send(pkg_lock);
          })
          .get('/reloadConf', this.reloadConf)
          .get('/admin/info', (req, res) => {
            const respObj = {
              cpuUsage: process.cpuUsage(),
              memoryUsage: process.memoryUsage(),
              upTime: process.uptime(),
            };

            res.send(this.toJsonRes(respObj));
          });
      });

    return prom;
  }

  public headers: string[][] = [
    ['Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'],
    ['Access-Control-Allow-Origin', '*'],
    [
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, idtoken, JWT, jwt, keydate, keyDate , key, ngsw-bypass',
    ],
    ['Cache-Control', 'no-cache, no-store, must-revalidate'],
    ['Pragma', 'no-cache'],
    ['Expires', '0'],
  ];

  protected loadConfPromise(): Promise<any> {
    return ConfLoader.getConf();
  }

  protected loadDepConfPromise(): Promise<any> {
    if (
      this.currentApp.conf['licence_well-known'] &&
      this.currentApp.conf['licence_well-known'] != ''
    ) {
      const opt = {
        url: this.currentApp.conf['licence_well-known'],
        json: true,
      };
      return Promise.resolve(request.get(opt))
        .then((data) => {
          if (data.code == 500) {
            throw new Error('licence_well-known ' + data.message);
          } else {
            return data;
          }
        })
        .catch((err) => {
          const val = fs.readJSONSync(
            './confs/dep/' +
              this.currentApp.conf['licence_well-known'].replace(/\//gi, '_') +
              '.json'
          );
          return val;
        })
        .then((conf) => {
          fs.ensureDirSync('./confs/dep/');
          fs.writeJSONSync(
            './confs/dep/' +
              this.currentApp.conf['licence_well-known'].replace(/\//gi, '_') +
              '.json',
            conf
          );
          const opt2 = {
            url: conf.jwks_uri,
            json: true,
          };
          return request
            .get(opt2)
            .then((data) => {
              if (data.code == 500) {
                throw new Error('jwk ' + data.message);
              } else {
                return data;
              }
            })
            .catch((err) => {
              const valJwk = fs.readJSONSync(
                './confs/dep/' + conf.jwks_uri.replace(/\//gi, '_') + '.json'
              );

              return valJwk;
            })
            .then((objKey) => {
              fs.ensureDirSync('./confs/dep/');
              fs.writeJSONSync(
                './confs/dep/' + conf.jwks_uri.replace(/\//gi, '_') + '.json',
                objKey
              );
              return jose.JWK.asKeyStore(objKey).then((keyStore) => {
                this.currentApp.licence_keyStore = keyStore;
                return this.currentApp;
              });
            });
        });
    } else {
      return Promise.resolve(this.currentApp);
    }
  }
  protected reloadConfPromise(): Promise<any> {
    return ConfLoader.getConf()
      .then((conf) => {
        this.currentApp.conf = conf;
      })
      .then(() => {
        return this.loadDepConfPromise();
      });
  }
  public get reloadConf() {
    return (req, res) => {
      this.reloadConfPromise()
        .then((conf) => {
          // 	this.currentApp.conf = conf ;
          res.send({ code: 200 });
        })
        .catch((err) => {
          res.send(this.toErrRes(err));
        });
    };
  }

  public get toErrRes(): { (err: any, code?: number): any } {
    return (err: any, code = 500): any => {
      if (Util.isString(err)) {
        err = { message: err };
      }
      const rep = {
        code: code,
        message: err.message,
        name: err.name,
        stack: undefined,
      };

      if (this.currentApp.conf.debug) {
        rep.stack = err.stack;
      }
      console.error(JSON.stringify(err));
      return rep;
    };
  }

  public get toJsonRes(): { (objs: any, meta?: any): any } {
    return (objs: any, meta: any = null): any => {
      if (!Util.isArray(objs)) {
        objs = [objs];
      }

      if (!meta) {
        meta = {};
      }

      return {
        code: 200,
        meta: meta,
        response: objs,
      };
    };
  }

  public get addCtx(): express.RequestHandler | express.ErrorRequestHandler {
    return (req, res, next) => {
      if (!req.ctx) {
        req.ctx = new RequestContext();
      }
      next();
    };
  }

  public get checkJWT(): express.RequestHandler | express.ErrorRequestHandler {
    return (req, res, next) => {
      const token = req.header('JWT');

      if (token && this.currentApp.licence_keyStore) {
        jose.JWS.createVerify(this.currentApp.licence_keyStore)
          .verify(token)
          .then(function (result) {
            const payload: any = JSON.parse(result.payload.toString());
            const myDate: number = Date.now() / 1000;
            if (payload.exp < myDate) {
              console.error('token is expired', req.ctx.user);
              next('token is expired');
            } else if (payload.nbf > myDate) {
              console.error('nbf token is not valid', req.ctx.user);
              next('nbf token is not valid');
            } else {
              req.ctx.user = payload;
              req.ctx.JWT = token;
              next();
            }
          })
          .catch(function (err) {
            next(err);
          });
      } else {
        next();
      }
    };
  }

  public get hasRight(): express.RequestHandler | express.ErrorRequestHandler {
    return (req, res, next) => {
      req.ctx.roles = [];
      let confSecu: any[];
      if (req.ctx.internalCallValid) {
        console.info('internalCallValid')
      } else if (req.ctx.user) {
        req.ctx.roles = req.ctx.user.role;
        if (
          this.currentApp.conf &&
          this.currentApp.conf.configurations &&
          this.currentApp.conf.configurations[req.ctx.user.appId]
        ) {
          confSecu = this.currentApp.conf.configurations[req.ctx.user.appId]
            .httAccess['_$' + req.method.toLowerCase()];
        }
      }
      req.ctx.roles.push('*');
      // console.info("confSecu" , confSecu , this.currentApp.conf ,  )
      if (
        !confSecu &&
        this.currentApp.conf &&
        this.currentApp.conf.publicAccess
      ) {
        if (this.currentApp.conf.debug) {
          console.info('find public access ' + '_$' + req.method.toLowerCase());
        }
        confSecu = this.currentApp.conf.publicAccess[
          '_$' + req.method.toLowerCase()
        ];
      }
      // console.info("confSecu" , confSecu )
      if (req.ctx.internalCallValid || req.method.toLowerCase() == 'options') {
        next();
      } else {
        const path: string = req.originalUrl;
        if (confSecu) {
          const access = confSecu.find((val) => {
            return path.indexOf(val.route) == 0;
          });

          if (access && _.intersection(access.role, req.ctx.roles).length > 0) {
            next();
          } else {
            if (this.currentApp.conf.debug) {
              console.info(
                'unautorized ',
                confSecu,
                access,
                path,
                req.ctx.roles
              );
            }
            next('unautorized');
          }
        } else {
          if (this.currentApp.conf.debug) {
            console.info(
              'unautorized, no conf match',
              confSecu,
              path,
              req.ctx.roles
            );
          }
          next('unautorized');
        }
      }
    };
  }
}
