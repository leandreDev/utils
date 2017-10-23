
import * as crypto from  'crypto';
import * as url from 'url' ;
import * as assert from 'assert' ;

export class UtilsSecu{

	constructor(private currentApp:any){
		 assert(currentApp.conf.secretKey, "secretKey is not spécified");
	}
	
	public addHeadersKey (rq:any){
		var date:number = Date.now() ;
		 rq.headers =  {
		    'keyDate': date ,
		    'key' : crypto.createHmac('sha256', this.currentApp.conf.secretKey)
                   .update(date + rq.url.toLowerCase())
                   .digest('hex')
		  }
	}

	public get chekInternalMidelWare():Function{
		return (req, res, next)=>{
			var date = req.header('keyDate') ;
			var key = req.header('key')  ;
			var requrl ;
			if(key){
				
				if(req.originalUrl && req.originalUrl.length > 1){
					requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1) ;
				}else{
					requrl = this.currentApp.conf.urlBase  ;
				}
				
				var newKey:string = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
		                   .update(date + requrl.toLowerCase())
		                   .digest('hex') ;

		        if(newKey == key){
		        	req.ctx.internalCallValid = true ;
		        	next() ;
		        }else{
		        	req.internalCallValid = false ;
		        	console.log("key dont match uri : " + requrl , date , key , newKey) ;
		        	next() ;
		        }
		       
			}else{
				next() ;
			}
			
		}
	} 

	public get protectInternalMidelWare():Function{
		return (req, res, next) => {
			var date = req.header('keyDate') ;
			var key = req.header('key')  ;
			var requrl ;
			if(key){
				if(req.originalUrl && req.originalUrl.length > 1){
					requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1) ;
				}else{
					requrl = this.currentApp.conf.urlBase  ;
				}
				
				var newKey:string = crypto.createHmac('sha256', this.currentApp.conf.secretKey)
	                   .update(date + requrl.toLowerCase())
	                   .digest('hex') ;
	                   
		        if(newKey == key){
		        	req.ctx.internalCallValid = true ;

		        	next() ;
		        }else{
		        	console.log("key dont match uri : " + requrl , date , key , newKey) ;
		        	next("key dont match uri : " + requrl) ;
		        }
			}else{
				next("no key") ;
			}
			
		}
	} 
}