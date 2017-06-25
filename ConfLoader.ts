
import * as request from 'request-promise' ;
import {CtxInterpretor} from './CtxInterpretor' ;
import * as fs  from 'fs-extra' ;
import * as assert from 'assert' ;

export class ConfLoader {


	static getConf():Promise<any>{
		let options:any = {} ;

		assert(process.env.CONF_URL, "$env.CONF_URL is not spécified");
		// assert(process.env.CLIENT_ID, "$env.CLIENT_ID is not spécified");
		assert(process.env.SRV_ID, "$env.SRV_ID is not spécified");
		options.url = process.env.CONF_URL + process.env.SRV_ID  ;
		options.json = true ;
		let contextInterpretor:CtxInterpretor = new CtxInterpretor(process.env) ;
		return new Promise((resolve , reject)=>{
			request.get(options).then((val)=>{
				if(val && val.code == 200 && val.response && val.response[0] ){
					val = val.response[0] ;
					fs.ensureDirSync("./confs")
					fs.outputJSONSync("./confs/" + process.env.SRV_ID + ".json" , val   )
				}else{
					val = fs.readJSONSync("./confs/" + process.env.SRV_ID  + ".json") ;
				}
				let conf:any = contextInterpretor.updateEnv(val) ;
				resolve(val) ;
			}).catch(err=>{
				try{
					let val = fs.readJSONSync("./confs/" + process.env.SRV_ID  + ".json") ;
					let conf:any = contextInterpretor.updateEnv(val) ;
					resolve(val) ;
				}catch(err2){
					reject(err) ;
				}
				
				
			})
		})
		
	}

}