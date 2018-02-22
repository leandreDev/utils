
import * as request from 'request-promise' ;
import {CtxInterpretor} from './CtxInterpretor' ;
import {UtilsSecu} from './UtilsSecu' ;

import * as fs  from 'fs-extra' ;
import * as assert from 'assert' ;

export class ConfLoader {


	static getConf():Promise<any>{
		return new Promise((resolve , reject)=>{
			let options:any = {} ;
			
			assert(process.env.CONF_URL, "$env.CONF_URL is not spécified");
			// assert(process.env.CLIENT_ID, "$env.CLIENT_ID is not spécified");
			assert(process.env.SRV_ID, "$env.SRV_ID is not spécified");
			assert(process.env.SECRET, "$env.SECRET is not spécified");
			options.url = process.env.CONF_URL + process.env.SRV_ID  ;
			options.json = true ;
			let secu:UtilsSecu = new UtilsSecu({conf:{secretKey:process.env.SECRET}})
			let contextInterpretor:CtxInterpretor = new CtxInterpretor(process.env) ;
			if(process.env.CONF_URL == "none"){
				try{
					let val = fs.readJSONSync("./confs/" + process.env.SRV_ID  + ".json") ;
					let conf:any = contextInterpretor.updateEnv(val) ;
					resolve(val) ;
				}catch(err){
					console.log("offline confloader error read JSON" , err) ;
					reject(err) ;
				}
			}else{
				
				secu.addHeadersKey(options) ;
				request.get(options).then((val)=>{
					let data:any ;
					if(val && val.code == 200 && val.response && val.response[0] ){
						data = val.response[0] ;
						fs.ensureDirSync("./confs")
						fs.writeJSONSync("./confs/" + process.env.SRV_ID + ".json" , data , {spaces:2} )
						
					}else{
						if(val && val.code != 200){

							console.log("online confloader error read JSON" , val , options.url , options.headers , process.env.SECRET ) ;
						}	
						data = fs.readJSONSync("./confs/" + process.env.SRV_ID  + ".json") ;
					}
					let conf:any = contextInterpretor.updateEnv(data) ;
					resolve(data) ;
				}).catch(err=>{
					try{
						console.log("confloader error on JSON " , err) ;
						let val = fs.readJSONSync("./confs/" + process.env.SRV_ID  + ".json") ;
						let conf:any = contextInterpretor.updateEnv(val) ;
						resolve(val) ;
					}catch(err2){
						console.log("confloader fatal error " , err2) ;
						reject(err) ;
					}
					
					
				})
			}
			
		})
		
	}

}