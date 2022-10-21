# utils

v1.2.6

# Library

Interface: IApplicationConfiguration

```
- licence_keyStore?: Jose.JWK.KeyStore;
- server?: http.Server;
- express?: express.Application;
- toErrRes?: { (err: any, code?: number): any };
- toJsonRes?: { (objs: any, meta?: any): any };
- secu?: UtilsSecu;
- conf?: any;
```

Class: UtilsSecu

```
new UtilsSecu(app: IApplicationConfiguration)

- addHeadersKeyProm(req: express.Request): Promise<void>
- addHeadersKey(req: express.Request): void
- testkey(req: ICtxRequest<any>): void
- chekInternalMidelWare(): express.RequestHandler | express.ErrorRequestHandler
- protectInternalMidelWare(): express.RequestHandler | express.ErrorRequestHandler
- protectUserConnected(): express.RequestHandler | express.ErrorRequestHandler
```

Class: RequestContext

```
new RequestContext()

- null: null
- emptyStr: string
- now(): number
- DateNow(): Date
```

Class: CtxInterpretor

```
new CtxInterpretor(context: any)

- context: any
- startPatern: string
- endPatern: string
- splitPatern: string
- updateArrEnv(obj: any[], clone: boolean = false, removeUnknownVar: boolean = false): any
- updateEnv(obj: any, clone: boolean = false, removeUnknownVar: boolean = false): any
```

Class ConfLoader

```
new ConfLoader()

- getConf(): Promise<any>
- loadConf(): Promise<any>
```

Class: ServerBase

```
new ServerBase()

- headers: string[][]
- reloadConf(): express.RequestHandler
- toErrRes(): { (err: any, code?: number): any }
- toJsonRes(): { (objs: any, meta?: any): any }
- addCtx(): express.RequestHandler | express.ErrorRequestHandler
- checkJWT(): express.RequestHandler | express.ErrorRequestHandler
- hasRight(): express.RequestHandler | express.ErrorRequestHandler
```

## Github Workflows

Il existe 3 workflows :

- ## Generate Dev version
  Ce workflow permet de generer un version Major, Minor ou Patch avec le dernier commit present sur la branch dev, une fois que l'exection du workflow aura reussi, un nouveau tag sera present avec le format : dev_x.x.xxx
- ## Generate Master Version

  Ce workflow permet de mettre a jour la branche master avec la dernier version de la branche dev, seulement le dossier dist, et le fichier package.json seron mis a jour, une fois que l'execution du worklflow aura reussi , un nouveau tag sera present au format : x.x.xxx;

  Ce workflow n'aura de resussite que s'il y a une nouvelle version dans la branche dev, autrement il sera en echec

- ## Standard Pipeline
  Ce workflow est destine a executer des jobs de verification du code avec les scripts npm ci, npm build et npm testing
