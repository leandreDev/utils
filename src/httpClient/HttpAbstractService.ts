
import * as request from "request-promise-native" ;
import {IHttpResult} from "./IHttpResult" ;
import {UtilsSecu} from "../UtilsSecu" ;
import * as _ from 'lodash' ;
import * as Url from 'url' ;

export class HttpAbstractService {
  constructor(
  	conf:{
      secure:UtilsSecu ;
    } 
  ) {
    this.secure = conf.secure ;
  }
protected secure:UtilsSecu = null 
  protected callRequest<T>(options):Promise<T>{
  	if ( this.secure ) {
      if(this.secure.addHeadersKey){
        this.secure.addHeadersKey(options) ;
        return request(options) ;
      }else if(this.secure.addHeadersKeyProm){
        this.secure.addHeadersKeyProm(options) 
        .then(()=>{
          return request(options) ;
        })
      }
      
    } else{
      return request(options) ;
    }
    // console.log(options) ;
  	
  }

  

  public cleanArr(value: any[]): any[] {
    var resArr: any[] = []
    value.forEach(data => {
      if (_.isFunction(data)) {
      } else if (_.isBoolean(data)) {
        resArr.push(data)
      } else if (_.isString(data) && data != '') {
        resArr.push(data)
      } else if (_.isArray(data)) {
        let newArr: any[]
        newArr = this.cleanArr(data)
        if (newArr.length > 0) {
          resArr.push(newArr)
        }
      } else if (_.isObject(data)) {
        let newObj: any
        newObj = this.cleanObj(data)
        if (Object.keys(newObj).length > 0) {
          resArr.push(newObj)
        }
      }
    })
    return resArr
  }

  public cleanObj(value: any): any {
    let newValue: any = {}

    for (let propName in value) {
      if (_.isFunction(value[propName])) {
      } else if (_.isBoolean(value[propName])) {
        newValue[propName] = value[propName]
      } else if (_.isString(value[propName]) && value[propName] != '') {
        newValue[propName] = value[propName]
      } else if (_.isArray(value[propName])) {
        let newArr: any[]
        newArr = this.cleanArr(value[propName])
        if (newArr.length > 0) {
          newValue[propName] = newArr
        }
      } else if (_.isObject(value[propName])) {
        let newObj: any
        newObj = this.cleanObj(value[propName])
        if (Object.keys(newObj).length > 0) {
          newValue[propName] = newObj
        }
      }
    }

    return newValue
  }

  protected basePatch<T>(
    url: string = '',
    body: any | null,
    headers: any = {}
  ): Promise<IHttpResult<T>> {
  	var options:any ;
  	options = {
  		url:new Url.URL(url).href,
  		method:"PATCH",
  		headers :headers,
      body:body,
  		json:true
  	} ;
    
    return this.callRequest<IHttpResult<T>>(options) ;
  }

  protected basePost<T , U=T>(
    url: string = '',
    body: U | null,
    headers: any = {}
  ): Promise<IHttpResult<T>> {  
    return this._post<IHttpResult<T>, U>(url , body , headers) ;
  }

  protected basePut<T , U=T>(
    url: string = '',
    body: U | null,
    headers: any = {}
  ): Promise<IHttpResult<T>> {
  
    return this._put<IHttpResult<T>, U>(url , body, headers) ;
  }

  protected baseDelete<T >(
    url: string = '',
    headers:any = {} 
  ): Promise<IHttpResult<T>> {
    return this._delete<IHttpResult<T>>(url, headers) ;
  }

  protected baseGet<T>(
    url: string = '',
    headers: any = {}
  ): Promise<IHttpResult<T>> {
    return this._get<IHttpResult<T>>(url , headers ) ;
  }

  //without IHttpResult

  protected _patch<T>(
    url: string = '',
    body: any | null,
    headers: any = {}
  ): Promise<T> {
  	var options:any ;
  	options = {
  		url:new Url.URL(url).href,
  		method:"PATCH",
  		headers :headers,
      body:body,
  		json:true
  	} ;
    
    return this.callRequest<T>(options) ;
  }

  protected _post<T , U=T>(
    url: string = '',
    body: U | null,
    headers: any = {}
  ): Promise<T> {
  	var options:any ;
  	options = {
  		url:new Url.URL(url).href,
  		method:"POST",
  		headers :headers,
  		json:true,
      body:body
  	} ;
    
    return this.callRequest<T>(options) ;
  }

  protected _put<T , U=T>(
    url: string = '',
    body: U | null,
    headers: any = {}
  ): Promise<T> {
  	var options:any ;
  	options = {
  		url:new Url.URL(url).href,
  		method:"PUT",
  		headers :headers,
      body:body,
  		json:true
  	} ;
    
    return this.callRequest<T>(options) ;
  }

  protected _delete<T >(
    url: string = '',
    headers:any = {} 
  ): Promise<T> {
  	var options:any ;
  	options = {
  		url: new Url.URL(url).href,
  		method:"DELETE",
  		headers :headers,
  		json:true
  	} ;
    
    return this.callRequest<T>(options) ;
  }

  protected _get<T>(
    url: string = '',
    headers: any = {}
  ): Promise<T> {
  	var options:any ;
  	options = {
  		url:new Url.URL(url).href,
  		method:"GET",
  		headers :headers,
  		json:true
  	} ;
    
    return this.callRequest<T>(options) ;
  }
}