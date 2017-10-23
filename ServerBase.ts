import * as express from 'express' ;
import * as request from 'request-promise' ;
import {ConfLoader} from './ConfLoader' ;
import {UtilsSecu} from './UtilsSecu' ;
import * as jose from 'node-jose' ;
import * as _  from 'lodash' ;
import * as Util  from 'util' ;
import * as http from 'http' ;
import * as assert from 'assert' ;

export class ServerBase{

	public currentApp:any ;
	public app:express ;
	public secu:UtilsSecu ;
	public server:http.Server ;

	constructor(){
		this.currentApp = {} ;
		this.init().then(()=>{
			this.app.use((err, req, res, next) => {
			    let obj = this.toErrRes(err) ;
			    res.send(obj);
			});
			this.startHttpServer() ;
		}).catch((err)=>{
				console.log(err) ;
			})

	}

	protected startHttpServer(){
		this.server = this.app.listen(this.currentApp.conf.port, () => {
	        console.log('Server listen on port ' + this.currentApp.conf.port )
	    })
	}
	protected init():Promise<any>{
		return ConfLoader.getConf().then((conf)=>{
			this.currentApp.conf =  conf ;
			if(this.currentApp.conf.debug){
				console.log(this.currentApp) ;
			}
			assert(this.currentApp.conf['licence_well-known'], "licence_well-known is not spécified");
			return this.currentApp ;
		}).then(()=>{
			let opt ={
				url:this.currentApp.conf['licence_well-known'],
				json:true 
			}
			return request.get(opt).then((conf)=>{
					let opt2 ={
					
					url:conf.jwks_uri ,
					json:true 
					}
					return request.get(opt2)
				})
		}).then((objKey)=>{
			return jose.JWK.asKeyStore(objKey).then((keyStore)=>{
					this.currentApp.licence_keyStore = keyStore ;
					return this.currentApp ;
				})
				.then(()=>{

					this.app = express();
					
					console.log("start app") ;
					
					
					this.currentApp.express = this.app  ;
					this.currentApp.toErrRes = this.toErrRes ;
					this.currentApp.toJsonRes = this.toJsonRes ;
					this.secu = new UtilsSecu(this.currentApp) ;
					this.currentApp.secu = this.secu ;
					this.app.use( function(req, res , next){
						this.headers.forEach((data)=>{
							res.header(data[0] , data[1]) ;
						})	
				       
					  next() ;
					})
					.use((req, res, next) => {
					    console.log(req.method + "," +  req.url) ;
					    next() ;
					})
					.use(this.addCtx , this.secu.chekInternalMidelWare , this.checkJWT , this.hasRight)
					.get('/', (req, res) => {
					    res.send({online:true})
					})
					.get('/reloadConf', this.reloadConf)
					
				})
		})
	}

	public headers:string[][] = [
			["Access-Control-Allow-Methods" , "GET, POST, OPTIONS, PUT, PATCH, DELETE"],
			["Access-Control-Allow-Origin", "*"],
			["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, idtoken, JWT, keyDate , key"],
			["Cache-Control", "no-cache, no-store, must-revalidate"],
			["Pragma", "no-cache"],
			["Expires", "0"]

		];
		
	public reloadConf (req, res)  {
		 ConfLoader.getConf()
		 .then((conf)=>{
	    	this.currentApp.conf = conf ;
			res.send({code:200}) ;
		}).catch((err)=>{
			res.send(this.toErrRes(err)) ;
		})
	}

	public  toErrRes (err: any): any{
		if(Util.isString(err)){
			err = {message:err }
		}
        let rep = {
            code: 500,
            message: err.message,
            name: err.name,
            stack: undefined
        };
        if(this.currentApp.conf.debug){
          rep.stack = err.stack ;
        }
        return rep ;
    };

    public  toJsonRes (objs: any, meta: any = null): any  {
	    if (!Util.isArray(objs)) {
	        objs = [objs];
	    };

	    if (!meta) {
	        meta = {};
	    };

	    return {
	        code: 200,
	        meta: meta,
	        response: objs
	    };
	};

	public get addCtx(){
		return (req, res , next) =>{
			if(!req.ctx){
				req.ctx = {} ;
			}
			next() ;
		}
	}
	



	public get checkJWT(){
		return (req, res, next) => {

			let token = req.header('JWT') 

			if(token ){
				
				jose.JWS.createVerify(this.currentApp.licence_keyStore).verify(token)
				.then(function(result) {
					req.ctx.user = JSON.parse(result.payload.toString()) ;

					next() ;
		        }).catch(function(err){
		        	next(err) ;
		        })
			}else{
				
				next() ;
			}
		}
	}



	public get hasRight(){

		return (req, res, next)  => {
			req.ctx.roles = [] ;
			var confSecu:any[]
			if(req.internalCallValid){
				
			}else if(req.ctx.user){

				req.ctx.roles = req.ctx.user.role
				if(this.currentApp.conf &&  this.currentApp.conf.configurations && this.currentApp.conf.configurations[req.ctx.user.appId]){
					confSecu = this.currentApp.conf.configurations[req.ctx.user.appId].httAccess["_$" + req.method.toLowerCase()] ;
				}
			}
			req.ctx.roles.push("*") ;
			if((! confSecu) &&  this.currentApp.conf && this.currentApp.conf.publicAccess ){
				confSecu = this.currentApp.conf.publicAccess["_$" + req.method.toLowerCase()] ;
			}
			if(req.internalCallValid || req.method.toLowerCase() == "options"){
				next()
			}else{
				let path:string =req.originalUrl ;
				if(confSecu){
					
					let access = confSecu.find(( val )=>{
						return path.indexOf(val.route) == 0 ;
					})
					
					if(access && _.intersection(access.role , req.ctx.roles).length > 0){
						next() ;
					}else{	
						console.log("unautorized " , access , path , req.ctx.roles )
						next("unautorized" ) ;
					}
				}else{
					console.log("unautorized, no conf match" , confSecu , path , req.ctx.roles )
						next("unautorized" ) ;
				}
				
			}
		}
	}




}

