import {HttpAbstractService} from "./HttpAbstractService"
import {IHttpResult} from "./IHttpResult" ;
import {CtxInterpretor} from "../CtxInterpretor" ;
import { IHttpServiceAdminBase } from "./IHttpServiceAdminBase";

export class HttpServiceAdminBase<T> extends HttpAbstractService implements IHttpServiceAdminBase<T> {
  constructor(
    conf:any 
  ) {
  	super(conf) ;
    this.url = conf.url ;
  }

  protected url:string ;

protected  globalCtxInt:CtxInterpretor = new CtxInterpretor(process.env) ;

   public delete(
    query: string,
    headers: any = {}
  ): Promise<IHttpResult<T>> {
   
    return super.baseDelete<T>(this.url + query, headers)
  }
  

  public patch(
    body: any ,
    headers: any = {},
    query: string = ''
  ): Promise<IHttpResult<T>> {

    return super.basePatch<T>(this.url + query , body, headers)
    
  }
  

}