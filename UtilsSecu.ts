
import * as crypto from  'crypto';
import * as url from 'url' ;

export class UtilsSecu{

	constructor(private currentApp:any){

	}
	
	 addHeadersKey (rq:any){
		var date:number = Date.now() ;
		 rq.headers =  {
		    'date': date ,
		    'key' : crypto.createHmac('sha256', this.currentApp.secretKey)
                   .update(date + rq.url)
                   .digest('hex')
		  }
	}

	chekInternalMidelWare(req, res, next){

		let date = req.header('date') ;
		let key = req.header('key')  ;
		var requrl ;
		if(key){
			requrl = url.format({
		    protocol: req.protocol,
		    host: req.get('host'),
		    pathname: req.originalUrl,
		});
		var newKey:string = crypto.createHmac('sha256', this.currentApp.secretKey)
                   .update(date + requrl)
                   .digest('hex') ;

        if(newKey == key){
        	req.internalCallValid = true ;
        	next() ;
        }else{
        	next("key dont match uri : " + requrl) ;
        }
       
		}else{
			next() ;
		}
		
	}
	protectInternalMidelWare(req, res, next){

		let date = req.header('date') ;
		let key = req.header('key')  ;
		var requrl ;
		if(key){
			requrl = url.format({
		    protocol: req.protocol,
		    host: req.get('host'),
		    pathname: req.originalUrl,
		});
		var newKey:string = crypto.createHmac('sha256', this.currentApp.secretKey)
                   .update(date + requrl)
                   .digest('hex') ;
                   
        if(newKey == key){
        	req.internalCallValid = true ;
        	next() ;
        }else{
        	next("key dont match uri : " + requrl) ;
        }
       
		}else{
			next("no key") ;
		}
		
	}
}