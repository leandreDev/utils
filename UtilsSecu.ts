
import * as crypto from  'crypto';

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
}