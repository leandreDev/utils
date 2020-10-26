import { IHttpResult } from './IHttpResult'
import { IMeta } from './IMeta'

export class HttpResult<T> implements IHttpResult<T> {

  public code: number
  public message?: string
  public name?: string
  public stack?: string
  public meta?: IMeta;
  public response: T[] ;

  constructor(obj:T | T[]| Error , debug:boolean, meta:IMeta = null ){
     if( obj instanceof Error ){
      this.code = 500 ;
      this.message = obj.message ;
      if(debug){
        this.stack = obj.stack ;
      }
     }else {
       this.code = 200 ;
       if(obj instanceof Array){
        this.response = obj ;
       }else{
         this.response = [obj] ;
       }
     }
     this.meta = meta ;
  }
}